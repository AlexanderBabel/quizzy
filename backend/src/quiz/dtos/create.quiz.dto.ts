import { QuizVisibility } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateQuizDto {
  @IsString()
  name: string;

  @IsEnum(QuizVisibility, {
    message: `visibility must be one of the following values: ${Object.values(
      QuizVisibility,
    ).join(', ')}`,
  })
  visibility: string;

  @IsNotEmpty()
  questions: CreateQuizQuestionDto[];
}

export class CreateQuizQuestionDto {
  @IsNumber()
  order: number;

  @IsString()
  question: string;

  @IsString()
  @IsOptional()
  imageUpload: string;

  @IsNotEmpty()
  answers: CreateQuizAnswerDto[];
}

export class CreateQuizAnswerDto {
  @IsString()
  text: string;

  @IsNotEmpty()
  correct: boolean;
}
