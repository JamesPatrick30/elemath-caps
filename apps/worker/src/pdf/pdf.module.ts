import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfProcessor } from './pdf.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { RedisModule } from '../redis/redis.module';
@Module({
    imports: [
        PrismaModule,
        BullModule.registerQueue({
            name: 'pdf',
        }),
        RedisModule,
    ],
    providers: [PdfService, PdfProcessor],
})
export class PdfModule {}
