import { forwardRef, Module } from '@nestjs/common';
import { RedisProviders } from './redis.provider';
import { CacheService } from './cache.service';
import {RedisPubSubService} from './pubsub.service';
import { WebsocketModule } from '../websocket/websocket.module';
@Module({
  imports: [forwardRef(() => WebsocketModule)],
  providers: [...RedisProviders, CacheService, RedisPubSubService],
  exports: [...RedisProviders, CacheService, RedisPubSubService],
})
export class RedisModule {}
