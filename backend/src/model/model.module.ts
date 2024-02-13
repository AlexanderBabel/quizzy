import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreatorService } from './creator.service';
import { PrismaModule } from 'nestjs-prisma';
import { CacheService } from './cache.service';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule],
  controllers: [],
  providers: [CreatorService, CacheService],
  exports: [CreatorService, CacheService],
})
export class ModelModule {}
