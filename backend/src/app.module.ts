import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LobbyModule } from './lobby/lobby/lobby.module'

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, LobbyModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
