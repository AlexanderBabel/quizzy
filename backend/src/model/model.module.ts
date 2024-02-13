import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreatorService } from './creator.service';
import { PrismaModule } from 'nestjs-prisma';
import { CacheModule } from '@nestjs/cache-manager'
import { CacheService } from './cache.service';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule,
    CacheModule.register(
      {
        isGlobal: true,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        store: redisStore
      }
    )
  ],
  controllers: [],
  providers: [CreatorService, CacheService],
  exports: [CreatorService, CacheService],
})
export class ModelModule {}
