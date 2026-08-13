import { Module  } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@repo/redis';
import { SharedService } from '../shared/shared.service';
@Module({
  providers: [WebsocketGateway, WebsocketService, SharedService],
  imports: [JwtModule.register({}),RedisModule],
  exports: [WebsocketService],
})
export class WebsocketModule {}
