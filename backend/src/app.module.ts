import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { QuizModule } from './quiz/quiz.module';
import { LobbyModule } from './lobby/lobby.module';
import { GameModule } from './game/game.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    QuizModule,
    LobbyModule,
    GameModule,
    AdminModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../frontend/build'),
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
