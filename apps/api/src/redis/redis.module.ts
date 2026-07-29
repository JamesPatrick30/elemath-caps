import { Module } from '@nestjs/common';
import { RedisProviders } from './redis.provider';
import { CacheService } from './cache.service';
@Module({
  providers: [...RedisProviders, CacheService],
  exports: [...RedisProviders, CacheService],
})
export class RedisModule {}
