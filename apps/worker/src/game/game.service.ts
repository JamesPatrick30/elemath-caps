import { Injectable } from '@nestjs/common';
import {GenerateQuestionsRequest} from '@repo/types';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class GameService {

    private client: OpenAI;

    constructor(private readonly configService: ConfigService) {
        this.client = new OpenAI({
            apiKey: this.configService.get<string>('OPENROUTER_API_KEY'),
            baseURL: 'https://openrouter.ai/api/v1',
        });
    }
    // async generateQuestions(data: GenerateQuestionsRequest): Promise<void> {

    //     const { content, numberOfQuestions, type } = data;

    //     const questions = await this.AiQuestionGenerator(content!, numberOfQuestions, type);
    //     console.log('Generating questions with data:', data);
    //     // Implement your logic to generate questions based on the provided data
    // }

    async AiQuestionGenerator(
        content: string,
        numberOfQuestions: number,
        type: 'multiple-choice' | 'true-false' | 'short-answer',
    ): Promise<any> {
        const prompt = `
        You are an experienced elementary school teacher and assessment creator.

        Your task is to create a quiz based ONLY on the lesson provided.

        ## Rules
        - Generate exactly ${numberOfQuestions} ${type} questions.
        - Use ONLY information found in the lesson.
        - Do NOT invent or assume facts that are not present.
        - Questions should be clear, grammatically correct, and appropriate for elementary students.
        - Avoid duplicate or nearly identical questions.
        - Cover different concepts from the lesson whenever possible.
        - Return ONLY valid JSON.
        - Do NOT wrap the JSON in markdown.
        - Do NOT include explanations.

        ${
        type === 'multiple-choice'
            ? `
        ### Multiple Choice Rules
        - Every question must have exactly 4 choices.
        - Only one choice is correct.
        - Incorrect choices should be believable.
        - Shuffle the correct answer position naturally.

        Return this JSON format:

        {
        "type": "multiple-choice",
        "questions": [
            {
            "question": "",
            "choices": [
                "",
                "",
                "",
                ""
            ],
            "correctAnswer": ""
            }
        ]
        }
        `
            : type === 'true-false'
            ? `
        ### True / False Rules
        - The answer must be either true or false.
        - False statements should be realistic and based on the lesson.

        Return this JSON format:

        {
        "type": "true-false",
        "questions": [
            {
            "question": "",
            "correctAnswer": true
            }
        ]
        }
        `
            : `
        ### Short Answer Rules
        - Answers should be short.
        - Prefer one word, a number, or a short phrase.
        - Avoid open-ended opinion questions.

        Return this JSON format:

        {
        "type": "short-answer",
        "questions": [
            {
            "question": "",
            "correctAnswer": ""
            }
        ]
        }
        `
        }

        Lesson:

        ${content}
        `;

        const response = await this.client.chat.completions.create({
            model: this.configService.get<string>('OPENROUTER_MODEL_QUESTION')!,
            messages: [
            {
                role: 'user',
                content: prompt,
            },
            ],
            response_format: {
            type: 'json_object',
            },
        });

        return JSON.parse(response.choices[0].message.content!);
        }
}
