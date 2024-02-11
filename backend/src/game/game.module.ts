// game.module.ts
import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { CacheModule } from '@nestjs/cache-manager'
import * as redis from 'cache-manager-redis-store'

@Module({
  imports: [
    CacheModule.register(
        {
          isGlobal: true,
          store: redis,
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT
        }
      )
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}