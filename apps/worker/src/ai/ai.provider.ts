import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { AiService } from './ai.service';
import { QueueNames } from '../types/queue';
import { generateQuestionsQueueData } from '@repo/types';
@Processor(QueueNames.AI)
export class AiProcessor extends WorkerHost {
  constructor(private readonly aiService: AiService) {
    super();
  }

    async process(job: Job<generateQuestionsQueueData>): Promise<void> {

        console.log('Processing GenerateQuestions job:', job.data);
        return await this.aiService.generateQuestions(job.data);
    }

    @OnWorkerEvent('failed')
    async onFailed(job: Job<generateQuestionsQueueData>, error: Error) {
        return await this.aiService.onFailed(job.data, error);
    }

    @OnWorkerEvent('completed')
    async onCompleted(job: Job<generateQuestionsQueueData>, returnvalue: any) {
        return await this.aiService.onCompleted(job.data, returnvalue);
    }
}