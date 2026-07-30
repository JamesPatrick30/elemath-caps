import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import type{ workerQueueDataFile,workerQueue } from '@repo/types';
import { QueueNames } from '../types/queue';
@Injectable()
export class PdfService {
    constructor(@InjectQueue(QueueNames.PDF) private readonly pdfQueue: Queue) {}

    async addPdfJob(data: workerQueueDataFile): Promise<void> {
        console.log('Adding PDF job to the queue:', data);
        await this.pdfQueue.add('generate-pdf', {fileName: data.fileName, classId: data.classId, originalName: data.originalName, path: data.path} as workerQueueDataFile, {
            attempts: 3,
            removeOnComplete: 100,
            removeOnFail: 100,
        });
    }
}
