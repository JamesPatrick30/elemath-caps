import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueNames } from '../types/queue';
import { AiProcessor } from './ai.provider';
import { RedisModule } from '@repo/redis';
@Module({
  providers: [AiService, AiProcessor],
  imports: [BullModule.registerQueue({
    name: QueueNames.AI,
  }), RedisModule, PrismaModule],
})
export class AiModule {}
