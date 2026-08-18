import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { REDIS } from "./redis.provider";

@Injectable()
export class CacheService {
    constructor(@Inject(REDIS) private readonly redis: Redis) {}

    async get<T>(key: string): Promise<T | null> {
        const value = await this.redis.get(key);

        if (!value) {
        return null;
        }

        return JSON.parse(value) as T;
    }

    async set(
        key: string,
        value: string,
        ttlSeconds = 300,
    ): Promise<void> {
        try {
            
            await this.redis.set(
            key,
            value,
            "EX",
            ttlSeconds,
            );
        } catch (error) {
            console.error(`Error setting key ${key} in Redis:`, error);
        }
    }

    async setGameData(key: string, value: string, ttlSeconds = 3600): Promise<void> { // Custom method for game data that expired on 1 hour
        await this.set(key, value, ttlSeconds);
    }

    async hset(key: string, field: string, value: unknown): Promise<void> {
        await this.redis.hset(key, field, JSON.stringify(value));
    }

    async hget<T>(key: string, field: string): Promise<T | null> {
        const value = await this.redis.hget(key, field);
        if (!value) {
            return null;
        }
        return JSON.parse(value) as T;
    }

    // Leaderboard related methods

    async incrementScore(
        key: string,
        studentId: string,
        points: number = 1,
    ): Promise<number> {
        const score = await this.redis.zincrby(
            key,
            points,
            studentId,
        );

        return Number(score);
    }

    async getLeaderboard(key: string) {
        const data = await this.redis.zrevrange(
            key,
            0,
            -1,
            'WITHSCORES',
        );

        const leaderboard = [];

        for (let i = 0; i < data.length; i += 2) {
            leaderboard.push({
                studentId: data[i],
                score: Number(data[i + 1]),
                rank: i / 2 + 1,
            });
        }

        return leaderboard;
    }

    async getScore(key: string, studentId: string){
        const score = await this.redis.zscore(key,studentId);

        return score ? Number(score) : 0;
    }
    // async zadd(key: string, score: number, data: {memberId: string; name: string}): Promise<void> {
    //     const existKey = await this.redis.exists(key);

    //     const multi = this.redis.multi();

    //     multi.zadd(key, score, JSON.stringify(data));

    //     if (!existKey) {
    //         multi.expire(key, 3600); // Set expiration to 1 hour
    //     }
    //     await multi.exec();
    // }

    // async zrange(key: string, start = 0, end = 10): Promise<{memberId: string; name: string}[]> {
    //     const members = await this.redis.zrange(key, start, end);
    //     if (!members) {
    //         return [];
    //     }
    //     return members.map((member) => JSON.parse(member) as {memberId: string; name: string});
    // }

    async del(key: string): Promise<void> {
        await this.redis.del(key);
    }

    async exists(key: string): Promise<boolean> {
        return (await this.redis.exists(key)) === 1;
    }

    
}