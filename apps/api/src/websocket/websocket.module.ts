import { Module, forwardRef  } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '../redis/redis.module';
@Module({
  providers: [WebsocketGateway, WebsocketService],
  imports: [JwtModule.register({}),forwardRef(() => RedisModule)],
  exports: [WebsocketService],
})
export class WebsocketModule {}
