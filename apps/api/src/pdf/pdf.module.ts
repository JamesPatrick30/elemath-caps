import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
@Module({
    imports: [
    BullModule.registerQueue({
        name: 'pdf',
        }),
    ],
    providers: [PdfService],
    controllers: [PdfController],

})
export class PdfModule {}
