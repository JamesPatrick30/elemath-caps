import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '@repo/redis';
import { SharedService } from '../shared/shared.service';
@Module({
    imports: [
        BullModule.registerQueue({
            name: 'pdf',
            }),
        AuthModule,
        PrismaModule,
        RedisModule,
    ],
    providers: [PdfService, SharedService],
    controllers: [PdfController],

})
export class PdfModule {}
