import { IsString } from 'class-validator';

export class ReportQuizDto {
  @IsString()
  reason: string;
}
