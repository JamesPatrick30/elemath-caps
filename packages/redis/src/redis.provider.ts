import Redis from 'ioredis';
import { Logger } from '@nestjs/common';

export const REDIS = 'REDIS';
export const REDIS_PUBLISHER = 'REDIS_PUBLISHER';
export const REDIS_SUBSCRIBER = 'REDIS_SUBSCRIBER';

const logger = new Logger('RedisProvider');

const createRedis = () => {
  const redis = new Redis(process.env.REDIS_URL!, {
    lazyConnect: false,

    retryStrategy(times) {
      const delay = Math.min(times * 1000, 10_000);

      logger.warn(`Reconnect attempt #${times}`);

      return delay;
    },

    maxRetriesPerRequest: null,
  });

  let lastError = 0;
  let lastReconnect = 0;
  let lastClose = 0;

  redis.on('ready', () => {
    logger.log('Redis connected');

    lastError = 0;
    lastReconnect = 0;
    lastClose = 0;
  });

  redis.on('error', (err:any) => {
    const now = Date.now();

    if (now - lastError > 6000) {
      logger.error(`Redis error: ${err.message}`);
      lastError = now;
    }
  });

  redis.on('close', () => {
    const now = Date.now();

    if (now - lastClose > 6000) {
      logger.warn('Redis connection closed');
      lastClose = now;
    }
  });

  redis.on('reconnecting', () => {
    const now = Date.now();

    if (now - lastReconnect > 6000) {
      logger.warn('Redis reconnecting...');
      lastReconnect = now;
    }
  });

  return redis;
};

export const RedisProviders = [
  {
    provide: REDIS,
    useFactory: createRedis,
  },
  {
    provide: REDIS_PUBLISHER,
    useFactory: createRedis,
  },
  {
    provide: REDIS_SUBSCRIBER,
    useFactory: createRedis,
  },
];