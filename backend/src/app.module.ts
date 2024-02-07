import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LobbyController } from './lobby/lobby/lobby.controller'
import { LobbyModule } from './lobby/lobby/lobby.module'

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, LobbyModule],
  controllers: [AppController, LobbyController],
  providers: [],
})
export class AppModule {}
