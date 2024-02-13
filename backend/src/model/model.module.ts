import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreatorModelService } from './creator.model.service';
import { PrismaModule } from 'nestjs-prisma';
import { QuizModelService } from './quiz.model.service';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheModelService } from './cache.model.service';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    CacheModule.register({
      isGlobal: true,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      store: redisStore,
    }),
  ],
  controllers: [],
  providers: [CreatorModelService, QuizModelService, CacheModelService],
  exports: [CreatorModelService, QuizModelService, CacheModelService],
})
export class ModelModule {}
