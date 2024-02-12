import { IsNotEmpty, IsNumber } from 'class-validator';
import {
  CreateQuizAnswerDto,
  CreateQuizDto,
  CreateQuizQuestionDto,
} from './create.quiz.dto';

export class EditQuizDto extends CreateQuizDto {
  @IsNotEmpty()
  questions: EditQuizQuestionDto[];
}

export class EditQuizQuestionDto extends CreateQuizQuestionDto {
  @IsNumber()
  questionId: number;

  @IsNotEmpty()
  answers: EditQuizAnswerDto[];
}

export class EditQuizAnswerDto extends CreateQuizAnswerDto {
  @IsNumber()
  answerId: number;
}
