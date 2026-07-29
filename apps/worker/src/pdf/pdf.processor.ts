import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { PdfService } from './pdf.service';

@Processor('pdf')
export class PdfProcessor extends WorkerHost {
  constructor(private readonly pdfService: PdfService) {
    super();
  }

  async process(job: Job): Promise<void> {
    console.log('Processing PDF job:', job.data);
    await this.pdfService.pdfProcessor(job.data);

  }
}