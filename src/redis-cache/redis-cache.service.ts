import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';
const redis = new Redis();

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}
  async get(key: string): Promise<string | null> {
    return (await this.cache.get(key)) ?? null;
  }

  async set(key: string, value: string): Promise<string | null> {
    return await this.cache.set(key, value);
  }

  async addCreatorScore(userId: number) {
    return await redis.zincrby('creators_rating', 1, userId);
  }

  async getCreatorsRating() {
    const range = await redis.zrange('creators_rating', 0, -1, 'WITHSCORES');
    const creators = [];
    for (let iCreator = 0; iCreator < range.length / 2; iCreator++) {
      creators.push({
        author_id: range[iCreator * 2],
        created: range[iCreator * 2 + 1],
      });
    }
    return creators.sort((a, b) =>
      a.created === b.created ? 0 : a.created > b.created ? -1 : 1,
    );
  }
}
