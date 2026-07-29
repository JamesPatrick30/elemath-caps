import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfProcessor } from './pdf.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
@Module({
    imports: [
        PrismaModule,
        BullModule.registerQueue({
            name: 'pdf',
        }),
    ],
    providers: [PdfService, PdfProcessor],
})
export class PdfModule {}
