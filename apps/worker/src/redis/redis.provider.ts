import Redis from 'ioredis';

export const REDIS = 'REDIS';
export const REDIS_PUBLISHER = 'REDIS_PUBLISHER';
export const REDIS_SUBSCRIBER = 'REDIS_SUBSCRIBER';

const createRedis = () => {
  const redis = new Redis(process.env.REDIS_URL || "");

  redis.on('ready', () => {
    console.log('✅ Redis connected');
  });

  redis.on('error', (err) => {
    console.error('❌ Redis Error:', err.message);
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