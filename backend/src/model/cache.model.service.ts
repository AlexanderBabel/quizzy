import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheModelService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(key: string, data: any, ttl = 0): Promise<void> {
    return this.cacheManager.set(key, data, ttl);
  }

  async get(key: string): Promise<any> {
    return this.cacheManager.get(key);
  }

  async del(key: string): Promise<any> {
    return this.cacheManager.del(key);
  }
}
