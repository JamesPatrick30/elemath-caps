import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {workerQueueDataFile} from '@repo/types';
import { PdfService } from './pdf.service';
import {QueueNames} from '../types/queue';
@Processor(QueueNames.PDF)
export class PdfProcessor extends WorkerHost {
  constructor(private readonly pdfService: PdfService) {
    super();
  }

  async process(job: Job): Promise<void> {
    console.log('Processing PDF job:', job.data);
    await this.pdfService.pdfProcessor(job.data as workerQueueDataFile);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job, error: Error) {
    await this.pdfService.onFailed(job.data as workerQueueDataFile, error);
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job, returnvalue: any) {
    await this.pdfService.onCompleted(job.data as workerQueueDataFile, returnvalue);
  }
}