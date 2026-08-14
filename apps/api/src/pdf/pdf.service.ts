import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import type { workerQueueDataFile,checkCacheStatusResponse } from '@repo/types';
import { QueueNames } from '../types/queue';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '@repo/redis';
import { SharedService } from '../shared/shared.service';
@Injectable()
export class PdfService {
    constructor(
        @InjectQueue(QueueNames.PDF) private readonly pdfQueue: Queue, 
        private readonly prismaService: PrismaService, 
        private readonly sharedService: SharedService,
        private readonly cacheService: CacheService
    ) {}

    async addPdfJob(data: workerQueueDataFile): Promise<void> {
        await this.pdfQueue.add('generate-pdf', {userId: data.userId, fileName: data.fileName, classId: data.classId, originalName: data.originalName, path: data.path} as workerQueueDataFile, {
            attempts: 3,
            removeOnComplete: 100,
            removeOnFail: 100,
        });
        const cacheKey = this.sharedService.uploadFileTaskKey(data.userId);
        await this.cacheService.set(cacheKey, JSON.stringify({ status: 'processing' }), 3600); // Cache for 1 hour (3600 seconds)
    }

    async getPdf(classId: string): Promise<{id: string; fileName: string; context: string;}[] | null> {

        const CacheKeys = `files:${classId}`;
        const cachedData = await this.cacheService.get<{id: string; fileName: string; context: string;}[] | null>(CacheKeys);

        if (cachedData) {
            return cachedData;
        }
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
        await this.cacheService.set(CacheKeys, JSON.stringify(mappedFiles), 3600); // Cache for 1 hour
        return mappedFiles;
    }

    async getProcessingFile(userId: string): Promise<checkCacheStatusResponse> {
        const cacheKey = this.sharedService.uploadFileTaskKey(userId);
        const cachedData = await this.cacheService.get<{ status: string }>(cacheKey);
        if (cachedData) {
            return { processing: true, status: cachedData.status };
        }
        return { processing: false, status: 'No processing file found' };
    }
}
