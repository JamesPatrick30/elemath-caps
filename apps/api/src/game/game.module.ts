import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueNames } from '../types/queue';

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [BullModule.registerQueue({name: QueueNames.GenerateQuestions})]
})
export class GameModule {}
