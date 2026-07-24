import { getEnvValue } from '../config/config.loader';
import Redis from 'ioredis';
import { ResourceNotFoundException } from '../exception/resource-not-found.exception';

export class RedisService {
  private redisClient: Redis;
  constructor() {
    this.redisClient = new Redis({
      host: getEnvValue('REDIS_HOST'),
      port: parseInt(getEnvValue('REDIS_PORT'), 10),
    });
  }

  async getUserSessionByToken(accessToken: string) {
    const redisHashKey = `user_session:token:${accessToken}`;
    // smembers Return all members stored inside a Redis Set.
    const hashData = await this.redisClient.smembers(redisHashKey);
    if (!hashData || hashData.length === 0) {
      throw new ResourceNotFoundException('user', 'token', accessToken);
    }
    const userDetails = await this.redisClient.hgetall(
      `user_session:${hashData[0]}`,
    );

    if (!userDetails) {
      throw new ResourceNotFoundException('user', 'token', accessToken);
    }
    return userDetails;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redisClient.set(key, value, 'EX', ttl);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async makeIncrement(key: string): Promise<number> {
    return await this.redisClient.incr(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redisClient.exists(key);
    return result === 1;
  }

  async setExpiry(key: string, ttl: number): Promise<void> {
    await this.redisClient.expire(key, ttl);
  }
}
