import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreatorService } from './creator.service';
import { PrismaService } from './prisma.service';
import { CacheModule } from '@nestjs/cache-manager'
import * as redis from 'cache-manager-redis-store'
import { CacheService } from './cache.service';

@Module({
  imports: [ConfigModule.forRoot(),
    CacheModule.register(
      {
        isGlobal: true,
        store: redis,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      }
    )],
  controllers: [],
  providers: [CreatorService, PrismaService, CacheService],
  exports: [CreatorService, CacheService],
})
export class ModelModule {}
