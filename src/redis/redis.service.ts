import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import { REDIS_CLIENT } from './redis-client.factory';
import type { RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
  ) {}

  onModuleDestroy() {
    this.redisClient.destroy();
  }

  async blacklistToken(token: string, expiryInSeconds: number): Promise<void> {
    await this.redisClient.setEx(token, expiryInSeconds, 'blacklisted');
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await this.redisClient.get(token);
    return result === 'blacklisted';
  }

  async removeFromBlacklist(token: string): Promise<void> {
    await this.redisClient.del(token);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.redisClient.setEx(key, ttlSeconds, value);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
