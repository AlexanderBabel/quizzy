import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, QuizModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
