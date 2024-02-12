import { Injectable, Inject, Type } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private CacheService: Cache) {}

  async set(key: string, data: any): Promise<void> {
    await this.CacheService.set(key, data);
  }

  async get(key: string): Promise<any> {
    return await this.CacheService.get(key);
  }
}
