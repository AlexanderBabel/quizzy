import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreatorService } from './creator.service';
import { PrismaModule } from 'nestjs-prisma';
import { QuizService } from './quiz.service';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule],
  controllers: [],
  providers: [CreatorService, QuizService],
  exports: [CreatorService, QuizService],
})
export class ModelModule {}
