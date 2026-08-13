import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');
  }

  async onModuleInit() {
    await this.client.ping();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async set(
    key: string,
    value: string,
    ttl?: number,
  ) {
    if (ttl) {
      return this.client.set(key, value, 'EX', ttl);
    }

    return this.client.set(key, value);
  }

  async del(key: string) {
    return this.client.del(key);
  }
}