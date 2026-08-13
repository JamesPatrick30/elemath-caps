import { Module } from '@nestjs/common';

import {
  REDIS,
  REDIS_PUBLISHER,
  REDIS_SUBSCRIBER,
  RedisProviders,
} from './redis.provider';

import { RedisService } from './redis.service';
import { CacheService } from './cache.service';
import { RedisPubSubService } from './pubsub.service';

@Module({
  providers: [
    ...RedisProviders,
    RedisService,
    CacheService,
    RedisPubSubService,
  ],
  exports: [
    REDIS,
    REDIS_PUBLISHER,
    REDIS_SUBSCRIBER,
    RedisService,
    CacheService,
    RedisPubSubService,
  ],
})
export class RedisModule {}