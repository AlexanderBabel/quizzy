import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisCache } from 'cache-manager-redis-yet';

@Injectable()
export class CacheService implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private readonly CacheService: RedisCache,
  ) {}

  get redis() {
    return this.CacheService.store.client;
  }

  async set(key: string, data: any): Promise<void> {
    await this.CacheService.set(key, data);
  }

  async get(key: string): Promise<any> {
    return await this.CacheService.get(key);
  }

  async onModuleInit() {
    console.log('Hello');
  }
}
