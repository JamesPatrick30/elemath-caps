import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
@Injectable()
export class PdfService {
    constructor(@InjectQueue('pdf') private readonly pdfQueue: Queue) {}

    async addPdfJob(data: any): Promise<void> {
        console.log('Adding PDF job to the queue:', data);
        await this.pdfQueue.add('generate-pdf', {data},{
            attempts: 3,
            removeOnComplete: 100,
            removeOnFail: 100,
        },);
    }
}
