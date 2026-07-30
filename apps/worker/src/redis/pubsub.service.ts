import {
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';

import {
  REDIS_PUBLISHER,
  REDIS_SUBSCRIBER,
} from './redis.provider';

@Injectable()
export class RedisPubSubService implements OnModuleInit {
  constructor(
    @Inject(REDIS_PUBLISHER)
    private readonly publisher: Redis,

    @Inject(REDIS_SUBSCRIBER)
    private readonly subscriber: Redis,
  ) {}

  async onModuleInit() {
    await this.subscriber.subscribe('pdf-generated');

    this.subscriber.on('message', (channel, message) => {
      console.log(`Received on ${channel}:`, message);

      const data = JSON.parse(message);

      // Handle event
    });
  }

  async publish(channel: string, payload: any) {
    await this.publisher.publish(
      channel,
      JSON.stringify(payload),
    );
  }
}