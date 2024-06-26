import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { ModelModule } from 'src/model/model.module';
import { QuizService } from './quiz.service';

@Module({
  imports: [ModelModule],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
