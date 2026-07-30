import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { AuthModule } from '../auth/auth.module';
@Module({
    imports: [
    BullModule.registerQueue({
        name: 'pdf',
        }),
    AuthModule,

    ],
    providers: [PdfService],
    controllers: [PdfController],

})
export class PdfModule {}
