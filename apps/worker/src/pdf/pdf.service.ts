import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import pdfParse from 'pdf-parse';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class PdfService {
    private client: OpenAI;

    constructor(private readonly configService: ConfigService, private readonly prismaService: PrismaService) {
        this.client = new OpenAI({
        apiKey: this.configService.get<string>('OPENROUTER_API_KEY'),
        baseURL: 'https://openrouter.ai/api/v1',
    });
    }
    private readonly logger = new Logger(PdfService.name);

    async pdfProcessor(data: { data: { path: string; classId: string; originalName: string; } }): Promise<void> {
        try {
        this.logger.log(`Reading PDF: ${data.data.path}`);
        console.log(data);
        
        // Read the uploaded PDF
        const buffer = await fs.readFile(data.data.path);

        // Extract text
        const result = await pdfParse(buffer);

        this.logger.log('===== PDF TEXT =====');
        this.logger.log(result.text);
        this.logger.log('====================');

        // TODO:
        // - Send result.text to your AI
        // - Generate quiz questions
        // - Save them to PostgreSQL

        this.logger.log('===== AI PROCESSING =====');

        let openai;
        let summary;
        try{
            summary = await this.chat(`Summarize the following text: ${result.text}`);
            openai = await this.chat(`
                You are an educational assessment generator.

                Generate a multiple-choice quiz from the lesson below.

                Requirements:
                - Detect the lesson title.
                - Detect the subject.
                - Generate up to 20 questions.
                - Every question must have exactly 4 choices.
                - Only one correct answer.
                - Answers must come directly from the lesson.
                - Do not hallucinate.
                - Return ONLY valid JSON.

                {
                "title": "",
                "subject": "",
                "questions": [
                    {
                    "question": "",
                    "choices": [],
                    "correctAnswer": ""
                    }
                ]
                }

                Lesson:
                ${result.text}
            `);
        } catch (error) {
            this.logger.error('Error during AI processing:', error);
        }
        
        this.logger.log('===== AI RESPONSE =====');
        console.log(JSON.parse(openai));
        console.log('========================');
        console.log('===== AI SUMMARY =====');
        console.log(summary);
        this.logger.log('========================');

        // await this.prismaService.client().lessons.create({
        //     data: {
        //         classId: data.data.classId,
        //         title: data.data.originalName,
        //         pdfUrl: data.data.path,
        //         questions: JSON.parse(openai),
        //         summary: summary,
        //     }
        // });
        } catch (error) {
        this.logger.error('Failed to process PDF', error);
        throw error;
        }
    }

    async chat(prompt: string) {
        const response = await this.client.chat.completions.create({
        model: this.configService.get<string>('OPENROUTER_MODEL')!,
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