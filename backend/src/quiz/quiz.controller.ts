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
} from '@nestjs/common';
import { CreateQuizDto } from './dtos/create.quiz.dto';
import { QuizModelService } from 'src/model/quiz.model.service';
import { ResponseQuiz } from './types/quiz.type';
import { EditQuizDto } from './dtos/edit.quiz.dto';
import { Quiz, QuizVisibility } from '@prisma/client';
import { GameRole, Role } from 'src/auth/jwt/enums/roles.enum';
import { Roles } from 'src/auth/jwt/decorators/roles.decorator';
import { JwtAuthType } from 'src/auth/jwt/enums/jwt.enum';
import { QuizService } from './quiz.service';
import { IsPublic } from 'src/auth/jwt/decorators/public.decorator';

@Controller('v1/quiz')
export class QuizController {
  constructor(
    private readonly quizModelService: QuizModelService,
    private readonly quizService: QuizService,
  ) {}

  @Roles(Role.Creator)
  @Post('/add')
  async addQuiz(
    @Req() req,
    @Body() createQuizDto: CreateQuizDto,
  ): Promise<ResponseQuiz> {
    // validate questions
    this.quizService.validateQuestions(createQuizDto.questions);

    // create quiz
    const quiz = await this.quizModelService.createQuiz({
      data: {
        name: createQuizDto.name,
        creator: { connect: { id: req.user.id } },
        visibility: createQuizDto.visibility,
      },
    });

    // create questions
    const questions = await Promise.all(
      createQuizDto.questions.map(async (question) =>
        this.quizModelService.createQuestion({
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
    return this.quizService.formatQuiz(quiz, questions);
  }

  @Roles(Role.Creator)
  @Put('/:quizId/edit')
  async editQuiz(
    @Req() req,
    @Body() editQuizDto: EditQuizDto,
    @Param('quizId') quizId: string,
  ): Promise<ResponseQuiz> {
    let quiz = await this.quizModelService.findQuiz({
      where: { id: Number.parseInt(quizId) },
    });
    if (!quiz || quiz.creatorId !== req.user.id) {
      throw new BadRequestException('Quiz not found.');
    }

    // validate questions
    this.quizService.validateQuestions(editQuizDto.questions);

    // update quiz
    quiz = await this.quizModelService.updateQuiz({
      where: { id: quiz.id },
      data: {
        name: editQuizDto.name,
        visibility: editQuizDto.visibility,
      },
    });

    // create or update questions
    const questions = await Promise.all(
      editQuizDto.questions.map(async (question) => {
        if (!question.questionId) {
          // create question
          return this.quizModelService.createQuestion({
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
          });
        }

        // create or update answers
        await Promise.all(
          question.answers.map(async (answer) => {
            if (answer.answerId) {
              // update answer
              await this.quizModelService.updateAnswer({
                where: { id: answer.answerId },
                data: { text: answer.text, correct: answer.correct },
              });
            } else {
              // create answer
              await this.quizModelService.createAnswer({
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
        await this.quizModelService.deleteAnswers({
          where: {
            questionId: question.questionId,
            id: {
              notIn: question.answers.map((answer) => answer.answerId),
            },
          },
        });

        // update question
        return this.quizModelService.updateQuestion({
          where: { id: question.questionId },
          data: { order: question.order, question: question.question },
        });
      }),
    );

    // delete questions
    await this.quizModelService.deleteQuestions({
      where: {
        quizId: quiz.id,
        id: {
          notIn: editQuizDto.questions.map((question) => question.questionId),
        },
      },
    });

    // return quiz with questions and answers
    return this.quizService.formatQuiz(quiz, questions);
  }

  @Roles(Role.Creator, GameRole.Player)
  @Get('/:quizId')
  async getQuiz(
    @Req() req,
    @Param('quizId') quizId: string,
  ): Promise<ResponseQuiz> {
    const quiz = await this.quizModelService.findQuizWithQuestions({
      where: {
        id: Number.parseInt(quizId),
        OR: [
          { visibility: QuizVisibility.PUBLIC },
          {
            creatorId:
              req.user.authType === JwtAuthType.Creator ? req.user.id : -1,
          },
        ],
      },
    });

    return this.quizService.formatQuiz(quiz, quiz.questions);
  }

  @Roles(Role.Creator)
  @Get('/list')
  async listQuizzes(@Req() req): Promise<ResponseQuiz[]> {
    const quizzes = await this.quizModelService.findQuizzes({
      where: { creatorId: req.user.id },
      include: { questions: true },
    });

    return quizzes.map((quiz) => this.quizService.formatQuiz(quiz));
  }

  @Roles(Role.Creator)
  @Delete('/:quizId/delete')
  async deleteQuiz(@Req() req, @Param('quizId') quizId: number): Promise<Quiz> {
    const quiz = await this.quizModelService.findQuiz({
      where: { id: quizId },
    });
    if (!quiz || quiz.creatorId !== req.user.id) {
      throw new BadRequestException('Quiz not found.');
    }

    return this.quizModelService.deleteQuiz({ where: { id: quizId } });
  }

  @IsPublic()
  @Get('/search')
  async searchQuizzes(@Query('query') query: string): Promise<Quiz[]> {
    return this.quizModelService.findQuizzes({
      where: { name: { contains: query }, visibility: QuizVisibility.PUBLIC },
    });
  }
}
