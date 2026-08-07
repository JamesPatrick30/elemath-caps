import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import pdfParse from 'pdf-parse';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { workerQueueDataFile } from '@repo/types';
import {RedisPubSubService} from '../redis/pubsub.service';
import type { uploadTask } from '@repo/types';
import { CacheService } from '../redis/cache.service';
import { SocketEvents } from '../types/socketEvents';

@Injectable()
export class PdfService {
    private client: OpenAI;

    constructor(
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService,
        private readonly redisPubSubService: RedisPubSubService,
        private readonly cacheService: CacheService
    ) {
        this.client = new OpenAI({
            apiKey: this.configService.get<string>('OPENROUTER_API_KEY'),
            baseURL: 'https://openrouter.ai/api/v1',
        });
    }
    private readonly logger = new Logger(PdfService.name);

    async pdfProcessor(data: workerQueueDataFile): Promise<void> {
        try {
        
        // Read the uploaded PDF
        const buffer = await fs.readFile(data.path);

        let userSocketId = await this.cacheService.get(`socket:${data.userId}`); 
        this.redisPubSubService.publish('pdf-generated', { status: 'PDF processed successfully', id: userSocketId, isDone: false } as uploadTask);
        // Extract text
        const result = await pdfParse(buffer);

        let questions;
        let summary;
        try{
            summary = await this.AiSummarizerCall(`Summarize the following text: ${result.text}`);
            // delay simulation for testing purposes
            // await new Promise(resolve => setTimeout(resolve, 5000));
            // summary = "This is a simulated summary of the PDF content.";


            userSocketId = await this.cacheService.get(`socket:${data.userId}`);
            this.redisPubSubService.publish('pdf-generated', { status: 'Generating practice questions...', id: userSocketId, isDone: false } as uploadTask);

            questions = await this.AIQuestionGenerator(summary);
            // delay simulation for testing purposes
            // await new Promise(resolve => setTimeout(resolve, 5000));
            // summary = "This is a simulated summary of the PDF content.";

        } catch (error) {
            this.logger.error('Error during AI processing:', error);
        }
        
        this.logger.log('===== AI RESPONSE =====');
        console.log(questions);
        console.log('========================');
        console.log('===== AI SUMMARY =====');
        console.log(summary);
        this.logger.log('========================');

        await this.prismaService.client().lessons.create({
            data: {
                classId: data.classId,
                title: data.originalName,
                pdfUrl: data.path,
                questions: JSON.parse(questions),
                summary: summary,
            }
        });

        userSocketId = await this.cacheService.get(`socket:${data.userId}`);

        this.redisPubSubService.publish('pdf-generated', { status: 'Data saved successfully', id: userSocketId, isDone: true } as uploadTask);

        } catch (error) {
        this.logger.error('Failed to process PDF', error);
        throw error;
        }
    }

    async AiSummarizerCall(prompt: string) {
        const response = await this.client.chat.completions.create({
        model: this.configService.get<string>('OPENROUTER_MODEL_SUMMARIZE')!,
        messages: [
            {
            role: 'user',
            content: prompt,
            },
        ],
        });

        return response.choices[0].message.content;
    }

    async AIQuestionGenerator(context: string) {
        const prompt = `
        You are an expert elementary school teacher.

        Based ONLY on the lesson below, generate EXACTLY 10 multiple-choice questions.

        Requirements:
        - Return ONLY valid JSON.
        - Do NOT wrap the JSON inside markdown.
        - Do NOT include explanations.
        - Do NOT include additional text.
        - Every question must have exactly 4 choices.
        - Exactly one choice must be correct.
        - The "answer" must exactly match one of the choices.
        - Questions should test understanding, not just memorization.
        - Avoid duplicate questions.
        - If the lesson does not contain enough information, create reasonable questions only from the given lesson.

        JSON Format:

        [
        {
            "question": "Question here",
            "choices": [
            "Choice A",
            "Choice B",
            "Choice C",
            "Choice D"
            ],
            "type": "multiple-choice",
            "answer": "Correct Choice"
        }
        ]

        Lesson:

        ${context}
        `;

        const response = await this.client.chat.completions.create({
            model: this.configService.get<string>('OPENROUTER_MODEL_QUESTION')!,
            messages: [
            {
                role: 'user',
                content: prompt,
            },
            ],
        });

        return response.choices[0].message.content;
    }
}