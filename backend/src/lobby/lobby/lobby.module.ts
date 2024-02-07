import { Module } from '@nestjs/common';
import { LobbyController } from './lobby.controller';
import { LobbyService } from './lobby.service';
import { CacheModule } from '@nestjs/cache-manager'
import * as redis from 'cache-manager-redis-store'

@Module({
  controllers: [LobbyController],
  providers: [LobbyService],
  imports: [
    CacheModule.register(
      {
        isGlobal: true,
        store: redis,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      }
    )
  ]
})
export class LobbyModule {}