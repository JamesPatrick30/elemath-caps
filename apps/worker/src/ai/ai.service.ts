import { Injectable } from '@nestjs/common';
import { RedisPubSubService, CacheService } from '@repo/redis';
import { pubsubEvents } from '../types/pubsubEvents';
import { SocketEvents } from '../types/socketEvents';
import { PubSubSocketEvents, generateQuestionsQueueData, QuestionAiOutput, QuestionSave, QuizStudentData } from '@repo/types';
import { PrismaService } from '../prisma/prisma.service';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

interface jobReturn{ message: string,questions:QuestionSave[], questionsKey: string, type: 'multiple-choice' | 'true-false' | 'short-answer'  };
@Injectable()
export class AiService {
    private client: OpenAI;
    constructor(
        private readonly redisPubSubService: RedisPubSubService, 
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly cacheService: CacheService
    ) {
        this.client = new OpenAI({
            apiKey: this.configService.get<string>('OPENROUTER_API_KEY'),
            baseURL: 'https://openrouter.ai/api/v1',
        });
    }

    private generateRandomQuestionsId (): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    async onFailed(jobData: generateQuestionsQueueData, error: Error) {
        console.error('AI job failed:', jobData, error);

        // Handle the failure, e.g., log it, notify someone, etc.
    }

    async onCompleted(jobData: generateQuestionsQueueData, returnValue:jobReturn) {
        const key: string = returnValue.questionsKey;
        const mappedQuizData: QuizStudentData = {
            type: returnValue.type,
            isSessionDone: false,
            questions:returnValue.questions
        }
        await this.cacheService.setGameData(key, JSON.stringify(mappedQuizData));
        this.redisPubSubService.publish(pubsubEvents.SOCKET_EVENT, { event: SocketEvents.QUIZ_STARTED, payload: returnValue, room: jobData.roomKey } as PubSubSocketEvents);
        console.log('AI job completed:', jobData, returnValue);
        // Handle the completion, e.g., update a database, notify someone, etc.
    }

    async generateQuestions(jobData: generateQuestionsQueueData): Promise<jobReturn> {
        console.log('Generating questions for job:', jobData);
        //simeple delay to simulate question generation
        const context = await this.prismaService.client().lessons.findUnique({
            where: { id: jobData.moduleId },
            select: { summary: true },
        });

        if (!context) {
            throw new Error(`Lesson with ID ${jobData.moduleId} not found`);
        }
        const lessonSummary = context.summary ?? '';
        let prompt: string;
        switch (jobData.type) {
            case 'true-false':
                console.log('Using True/False prompt');
                prompt = this.TrueFalsePrompt(lessonSummary, jobData.numberOfQuestions);
                break;
            case 'multiple-choice':
                console.log('Using Multiple Choice prompt');
                prompt = this.MultipleChoicePrompt(lessonSummary, jobData.numberOfQuestions);
                break;
            case 'short-answer':
                console.log('Using Short Answer prompt');
                prompt = this.ShortAnswerPrompt(lessonSummary, jobData.numberOfQuestions);
                break;
            default:
                throw new Error(`Unsupported question type: ${jobData.type}`);
        }

        // console.log('Generated prompt:', prompt.trim());
        // await new Promise(resolve => setTimeout(resolve, 5000));
    
        const response: any = await this.client.chat.completions.create({
            model: this.configService.get<string>('OPENROUTER_MODEL') || 'openai/gpt-4.1-mini',
            messages: [{ role: 'user', content: prompt.trim() }],
        });

        console.log('AI response received:', response.choices[0].message.content);

        const questions: QuestionAiOutput[] = JSON.parse(response.choices[0].message.content);

        questions.forEach((q: QuestionAiOutput) => {
            console.log('Generated question:', q);
        });

        const mappedQuestions: QuestionSave[] = questions.map((q) => ({
            ...q,
            id:this.generateRandomQuestionsId(),
        }));

        mappedQuestions.forEach((q: QuestionSave) =>{
            console.log('mapped: ', q);
        })
        

        return { message: 'Questions generated successfully', questions:mappedQuestions, questionsKey: jobData.roomQuestionsKey, type: jobData.type  }; // Implement the logic to generate questions based on the jobData
        // Implement the logic to generate questions based on the jobData
        // This could involve calling an external API, processing data, etc.
    }

    private TrueFalsePrompt(context?: string, numQuestions: number = 10): string {
        return `
            Generate exactly ${numQuestions} True/False questions based only on the provided context.

            Rules:
            - Questions must be factually supported by the context.
            - Do not use information that is not present in the context.
            - Each question must have only one correct answer.
            - The answer must be exactly "True" or "False".
            - Make the questions clear, concise, and appropriate for students.
            - Avoid ambiguous, opinion-based, or trick questions.
            - Create a balanced mix of True and False questions when possible.
            - Do not include explanations.
            - Do not include numbering.
            - Return ONLY a valid JSON array.
            - Do not wrap the JSON in Markdown or code fences.

            Required JSON format:
            [
            {
                "question": "Is the sky blue?",
                "answer": "True"
            }
            ]

            Context:
            ${context}`;
        // Example return of the ai:
        // [
        //     {
        //         question: "Is the sky blue?",
        //         answer: "True"
        //     },
        //     {
        //         question: "Is the grass red?",
        //         answer: "False"
        //     }
        // ]
    }

    private MultipleChoicePrompt(context?: string, numQuestions: number = 10): string {
        return `
            Generate exactly ${numQuestions} multiple-choice questions based only on the provided context.

            Rules:
            - Questions must be factually supported by the context.
            - Do not use information that is not present in the context.
            - Each question must have exactly 4 options.
            - Only one option must be correct.
            - The "answer" value must exactly match one of the values in the "options" array.
            - Make incorrect options plausible but clearly incorrect based on the context.
            - Make the questions clear, concise, and appropriate for students.
            - Avoid ambiguous, opinion-based, or trick questions.
            - Randomize the position of the correct answer across the questions.
            - Do not include explanations.
            - Do not include numbering.
            - Return ONLY a valid JSON array.
            - Do not wrap the JSON in Markdown or code fences.

            Required JSON format:
            [
            {
                "question": "What is the capital of France?",
                "options": ["Berlin", "Madrid", "Paris", "Rome"],
                "answer": "Paris"
            }
            ]

            Context:
            ${context}
            `;
        // Example return of the ai:
        // [
        //     {
        //         question: "What is the capital of France?",
        //         options: ["Berlin", "Madrid", "Paris", "Rome"],
        //         answer: "Paris"
        //     },
        //     {
        //         question: "What is 2 + 2?",
        //         options: ["3", "4", "5", "6"],
        //         answer: "4"
        //     }
        // ]
    }

    private ShortAnswerPrompt(context?: string, numQuestions: number = 10): string {
        return `
            Generate exactly ${numQuestions} short-answer questions based only on the provided context.

            Rules:
            - Questions must be answerable using information from the context.
            - Do not use information that is not present in the context.
            - Each question must have one clear expected answer.
            - Answers should be concise but complete.
            - The answer should contain the key information necessary to correctly answer the question.
            - Questions should test understanding, recall, or basic application of the provided material.
            - Avoid questions that require personal opinions.
            - Avoid overly broad questions.
            - Make the questions clear, concise, and appropriate for students.
            - Do not include explanations outside the answer.
            - Do not include numbering.
            - Return ONLY a valid JSON array.
            - Do not wrap the JSON in Markdown or code fences.

            Required JSON format:
            [
            {
                "question": "What is photosynthesis?",
                "answer": "Photosynthesis is the process by which plants convert light energy into chemical energy."
            }
            ]

            Context:
            ${context}
            `;
        // Example return of the ai:
        // [
        //     {
        //         question: "Explain the theory of relativity.",
        //         answer: "The theory of relativity, developed by Albert Einstein, is a fundamental theory in physics that describes the relationship between space, time, and gravity. It consists of two main parts: special relativity and general relativity. Special relativity deals with objects moving at constant speeds, particularly those approaching the speed of light, and introduces concepts such as time dilation and length contraction. General relativity extends these ideas to include acceleration and gravity, describing how massive objects warp spacetime and influence the motion of other objects. This theory has been confirmed through numerous experiments and observations, making it a cornerstone of modern physics."
        //     },
        //     {
        //         question: "What is photosynthesis?",
        //         answer: "Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy, usually from the sun, into chemical energy stored in glucose (sugar) molecules. This process takes place in the chloroplasts of plant cells, where chlorophyll pigments absorb light energy. During photosynthesis, carbon dioxide (CO2) from the air and water (H2O) from the soil are used to produce glucose (C6H12O6) and oxygen (O2) as a byproduct. The overall chemical equation for photosynthesis can be summarized as: 6 CO2 + 6 H2O + light energy → C6H12O6 + 6 O2. Photosynthesis is essential for life on Earth, as it provides the primary source of energy for nearly all living organisms and contributes to the oxygen content of the atmosphere."
        //     }
        // ]
    }
}
