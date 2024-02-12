import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateQuizDto, CreateQuizQuestionDto } from './dtos/create.quiz.dto';
import { QuizService } from 'src/model/quiz.service';
import { ResponseQuiz } from './types/quiz.type';
import { EditQuizDto } from './dtos/edit.quiz.dto';
import {
  Quiz,
  QuizQuestion,
  QuizQuestionAnswer,
  QuizVisibility,
} from '@prisma/client';
import { CreatorAuthGuard } from 'src/auth/creator/creator.jwt.guard';

@Controller('v1/quiz')
export class AuthController {
  constructor(private readonly quizService: QuizService) {}

  private validateQuestions(questions: CreateQuizQuestionDto[]): void {
    let highestOrder = 0;

    // question order has to be unique
    const usedOrder = {};
    for (const question of questions) {
      if (usedOrder[question.order]) {
        throw new BadRequestException(
          'The same order number is used more than once.',
        );
      }
      usedOrder[question.order] = true;
      highestOrder = Math.max(question.order, highestOrder);

      // at least one answer has to be correct
      if (!question.answers.some((answer) => answer.correct)) {
        throw new BadRequestException(
          'At least one answer has to be correct. Affected question: ' +
            question.question,
        );
      }
    }

    // the order should be sequential and not be higher than the amount of questions.
    if (highestOrder > questions.length) {
      throw new BadRequestException('Order numbers are too high.');
    }
  }

  private formatQuiz(
    quiz: Quiz,
    questions: (QuizQuestion & { answers: QuizQuestionAnswer[] })[],
  ): ResponseQuiz {
    return {
      quizId: quiz.id,
      name: quiz.name,
      questions: questions.map((question) => ({
        questionId: question.id,
        order: question.order,
        question: question.question,
        answers: question.answers.map((answer) => ({
          answerId: answer.id,
          text: answer.text,
          correct: answer.correct,
        })),
      })),
    };
  }

  @Post('/add')
  @UseGuards(CreatorAuthGuard)
  async addQuiz(
    @Req() req,
    @Body() createQuizDto: CreateQuizDto,
  ): Promise<ResponseQuiz> {
    // validate questions
    this.validateQuestions(createQuizDto.questions);

    // create quiz
    const quiz = await this.quizService.createQuiz({
      data: {
        name: createQuizDto.name,
        creator: req.user.id,
      },
    });

    // create questions
    const questions = await Promise.all(
      createQuizDto.questions.map(async (question) =>
        this.quizService.createQuestion({
          data: {
            order: question.order,
            question: question.question,
            quiz: { connect: { id: quiz.id } },
            answers: {
              createMany: {
                data: question.answers.map((answer) => ({
                  text: answer.text,
                  correct: answer.correct,
                })),
              },
            },
          },
        }),
      ),
    );

    // return quiz with questions and answers
    return this.formatQuiz(quiz, questions);
  }

  @Put('/:quizId/edit')
  @UseGuards(CreatorAuthGuard)
  async editQuiz(
    @Req() req,
    @Body() editQuizDto: EditQuizDto,
    @Param('quizId') quizId: number,
  ): Promise<ResponseQuiz> {
    const quiz = await this.quizService.findQuiz({ id: quizId });
    if (!quiz || quiz.creatorId !== req.user.id) {
      throw new BadRequestException('Quiz not found.');
    }

    // validate questions
    this.validateQuestions(editQuizDto.questions);

    // update quiz
    await this.quizService.updateQuiz({
      where: { id: quizId },
      data: { name: editQuizDto.name },
    });

    // create or update questions
    const questions = await Promise.all(
      editQuizDto.questions.map(async (question) => {
        if (!question.questionId) {
          // create question
          return this.quizService.createQuestion({
            data: {
              order: question.order,
              question: question.question,
              quiz: { connect: { id: quizId } },
              answers: {
                createMany: {
                  data: question.answers.map((answer) => ({
                    text: answer.text,
                    correct: answer.correct,
                  })),
                },
              },
            },
          });
        }

        // update question
        await this.quizService.updateQuestion({
          where: { id: question.questionId },
          data: { order: question.order, question: question.question },
        });

        // create or update answers
        await Promise.all(
          question.answers.map(async (answer) => {
            if (answer.answerId) {
              // update answer
              await this.quizService.updateAnswer({
                where: { id: answer.answerId },
                data: { text: answer.text, correct: answer.correct },
              });
            } else {
              // create answer
              await this.quizService.createAnswer({
                data: {
                  question: { connect: { id: question.questionId } },
                  text: answer.text,
                  correct: answer.correct,
                },
              });
            }
          }),
        );

        // delete old answers
        await this.quizService.deleteAnswers({
          where: {
            questionId: question.questionId,
            id: {
              notIn: question.answers.map((answer) => answer.answerId),
            },
          },
        });
      }),
    );

    // delete questions
    await this.quizService.deleteQuestions({
      where: {
        quizId,
        id: {
          notIn: editQuizDto.questions.map((question) => question.questionId),
        },
      },
    });

    // return quiz with questions and answers
    return this.formatQuiz(quiz, questions);
  }

  @Get('/list')
  @UseGuards(CreatorAuthGuard)
  async listQuizzes(@Req() req): Promise<Quiz[]> {
    return this.quizService.findQuizzes({ where: { creatorId: req.user.id } });
  }

  @Delete('/:quizId/delete')
  @UseGuards(CreatorAuthGuard)
  async deleteQuiz(@Req() req, @Param('quizId') quizId: number): Promise<Quiz> {
    const quiz = await this.quizService.findQuiz({ id: quizId });
    if (!quiz || quiz.creatorId !== req.user.id) {
      throw new BadRequestException('Quiz not found.');
    }

    return this.quizService.deleteQuiz({ where: { id: quizId } });
  }

  @Get('/search')
  async searchQuizzes(@Query('query') query: string): Promise<Quiz[]> {
    return this.quizService.findQuizzes({
      where: { name: { contains: query }, visibility: QuizVisibility.PUBLIC },
    });
  }
}
