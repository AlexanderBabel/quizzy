import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { ModelModule } from 'src/model/model.module';

@Module({
  imports: [ModelModule],
  controllers: [QuizController],
  providers: [],
})
export class QuizModule {}
