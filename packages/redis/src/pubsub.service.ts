import {
  Inject,
  Injectable,
  OnModuleDestroy,
} from '@nestjs/common';

import Redis from 'ioredis';

import {
  REDIS_PUBLISHER,
  REDIS_SUBSCRIBER,
} from './redis.provider';

type PubSubHandler<T = unknown> = (payload: T) => void;

@Injectable()
export class RedisPubSubService implements OnModuleDestroy {
  private readonly handlers = new Map<
    string,
    Set<PubSubHandler>
  >();

  constructor(
    @Inject(REDIS_PUBLISHER)
    private readonly publisher: Redis,

    @Inject(REDIS_SUBSCRIBER)
    private readonly subscriber: Redis,
  ) {
    this.subscriber.on(
      'message',
      this.handleMessage.bind(this),
    );
  }

  async publish<T>(
    channel: string,
    payload: T,
  ): Promise<void> {
    await this.publisher.publish(
      channel,
      JSON.stringify(payload),
    );
  }

  async subscribe<T>(
    channel: string,
    handler: PubSubHandler<T>,
  ): Promise<void> {
    let handlers = this.handlers.get(channel);

    if (!handlers) {
      handlers = new Set();
      this.handlers.set(channel, handlers);

      await this.subscriber.subscribe(channel);
    }

    handlers.add(handler as PubSubHandler);
  }

  async unsubscribe(
    channel: string,
    handler: PubSubHandler,
  ): Promise<void> {
    const handlers = this.handlers.get(channel);

    if (!handlers) {
      return;
    }

    handlers.delete(handler);

    if (handlers.size === 0) {
      this.handlers.delete(channel);

      await this.subscriber.unsubscribe(channel);
    }
  }

  private handleMessage(
    channel: string,
    message: string,
  ): void {
    const handlers = this.handlers.get(channel);

    if (!handlers) {
      return;
    }

    let payload: unknown;

    try {
      payload = JSON.parse(message);
    } catch (error) {
      console.error(
        `Invalid Redis message on channel "${channel}"`,
        error,
      );

      return;
    }

    for (const handler of handlers) {
      handler(payload);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.publisher.quit();
    await this.subscriber.quit();
  }
}