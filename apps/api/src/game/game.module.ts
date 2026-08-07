import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueNames } from '../types/queue';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { AuthModule } from '../auth/auth.module';
@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [AuthModule, BullModule.registerQueue({name: QueueNames.GenerateQuestions}), PrismaModule, RedisModule, WebsocketModule]
})
export class GameModule {}
