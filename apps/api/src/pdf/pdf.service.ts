import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import type{ workerQueueDataFile,workerQueue } from '@repo/types';
import { QueueNames } from '../types/queue';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class PdfService {
    constructor(@InjectQueue(QueueNames.PDF) private readonly pdfQueue: Queue, private readonly prismaService: PrismaService) {}

    async addPdfJob(data: workerQueueDataFile): Promise<void> {
        console.log('Adding PDF job to the queue:', data);
        await this.pdfQueue.add('generate-pdf', {userId: data.userId, fileName: data.fileName, classId: data.classId, originalName: data.originalName, path: data.path} as workerQueueDataFile, {
            attempts: 3,
            removeOnComplete: 100,
            removeOnFail: 100,
        });
    }

    async getPdf(classId: string): Promise<{id: string; fileName: string; context: string;}[] | null> {
        const uploadedFiles = await this.prismaService.client().lessons.findMany({
            where: {
                classId,
            },
        });
        if (uploadedFiles.length === 0) {
            throw new NotFoundException(`No uploaded files found for class ID ${classId}`);
        }

        const mappedFiles = uploadedFiles.map((file) => ({
            id: file.id,
            fileName: file.title,
            context: file.summary ?? '',
        }));
        return mappedFiles;
    }
}
