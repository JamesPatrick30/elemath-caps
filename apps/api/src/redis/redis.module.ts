import { Module } from '@nestjs/common';
import { RedisProviders } from './redis.provider';
import { CacheService } from './cache.service';
import {RedisPubSubService} from './pubsub.service';
@Module({
  providers: [...RedisProviders, CacheService, RedisPubSubService],
  exports: [...RedisProviders, CacheService, RedisPubSubService],
})
export class RedisModule {}
