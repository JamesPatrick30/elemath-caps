import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueNames } from '../types/queue';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '@repo/redis';
import { WebsocketModule } from '../websocket/websocket.module';
import { AuthModule } from '../auth/auth.module';
import { SharedService } from '../shared/shared.service';
@Module({
  controllers: [GameController],
  providers: [GameService, SharedService],
  imports: [AuthModule, BullModule.registerQueue({name: QueueNames.AI}), PrismaModule, RedisModule, WebsocketModule]
})
export class GameModule {}
