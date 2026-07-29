import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { REDIS } from "../redis/redis.provider";

@Injectable()
export class CacheService {
    constructor(
        @Inject(REDIS)
        private readonly redis: Redis,
    ) {}

    async get<T>(key: string): Promise<T | null> {
        const value = await this.redis.get(key);

        if (!value) {
        return null;
        }

        return JSON.parse(value) as T;
    }

    async set(
        key: string,
        value: unknown,
        ttlSeconds = 300,
    ): Promise<void> {
        await this.redis.set(
        key,
        JSON.stringify(value),
        "EX",
        ttlSeconds,
        );
    }

    async del(key: string): Promise<void> {
        await this.redis.del(key);
    }

    async exists(key: string): Promise<boolean> {
        return (await this.redis.exists(key)) === 1;
    }

    
}