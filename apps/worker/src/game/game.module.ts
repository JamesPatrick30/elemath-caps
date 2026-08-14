import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { BullModule } from '@nestjs/bullmq';
@Module({
  providers: [GameService],
  imports: [BullModule.registerQueue()],
})
export class GameModule {}
