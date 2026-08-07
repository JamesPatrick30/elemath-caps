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
import { WebsocketService } from '../websocket/websocket.service';
import { SocketEvents } from '../types/socketEvents';
@Injectable()
export class RedisPubSubService implements OnModuleInit {
  constructor(
    @Inject(REDIS_PUBLISHER)
    private readonly publisher: Redis,

    @Inject(REDIS_SUBSCRIBER)
    private readonly subscriber: Redis,

    private readonly websocketService: WebsocketService,
  ) {}

  async onModuleInit() {
    await this.subscriber.subscribe('pdf-generated');

    this.subscriber.on('message', (channel, message) => {
      console.log(`Received on ${channel}:`, message);

      const data = JSON.parse(message);
      switch (channel) {
        case 'pdf-generated':
          this.websocketService.emit(SocketEvents.PDF_UPLOADED, data, data.id);
          break;
        default:
          console.warn(`No handler for channel: ${channel}`);
      }

    });
  }

  async publish(channel: string, payload: any) {
    await this.publisher.publish(
      channel,
      JSON.stringify(payload),
    );
  }
}