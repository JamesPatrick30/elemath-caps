// redis.provider.ts

import Redis from "ioredis";
export const REDIS = "REDIS";
export const REDIS_PUBLISHER = "REDIS_PUBLISHER";
export const REDIS_SUBSCRIBER = "REDIS_SUBSCRIBER";

export const RedisProviders = [
  {
    provide: REDIS,
    useFactory: () => {
        
        const redis = new Redis(process.env.REDIS_URL || "");

        redis.on("ready", () => {
            console.log("✅ Redis ready");
        });

        redis.on("error", (err) => {
            console.error("❌ Redis error:", err.message);
        });

        return redis;
    
    },
  },
  {
    provide: REDIS_PUBLISHER,
    useFactory: () => {
      return new Redis(process.env.REDIS_URL || "");
    },
  },
  {
    provide: REDIS_SUBSCRIBER,
    useFactory: () => {
      return new Redis(process.env.REDIS_URL || "");
    },
  },
];