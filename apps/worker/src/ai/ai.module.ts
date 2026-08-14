import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueNames } from '../types/queue';
import { AiProcessor } from './ai.provider';
@Module({
  providers: [AiService, AiProcessor],
  imports: [BullModule.registerQueue({
    name: QueueNames.AI,
  })],
})
export class AiModule {}
