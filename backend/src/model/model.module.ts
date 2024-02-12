import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreatorService } from './creator.service';
import { PrismaModule } from 'nestjs-prisma';
import { CacheModule } from '@nestjs/cache-manager'
import * as redis from 'cache-manager-redis-store'
import { CacheService } from './cache.service';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule,
    CacheModule.register(
      {
        isGlobal: true,
        store: redis,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      }
    )
  ],
  controllers: [],
  providers: [CreatorService, CacheService],
  exports: [CreatorService, CacheService],
})
export class ModelModule {}
