import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { ReportQuizDto } from './dtos/report.quiz.dto';

@Controller('v1/quiz')
export class QuizController {
  constructor(
    private readonly quizModelService: QuizModelService,
    private readonly quizService: QuizService,
  ) {}

  @IsPublic()
  @Get('/')
  async last20Quizzes(): Promise<Quiz[]> {
    return this.quizModelService.findQuizzes({
      take: 20,
      orderBy: {
        createdAt: 'desc',
      },
      where: { visibility: QuizVisibility.PUBLIC },
    });
  }

  @IsPublic()
  @Get('/search')
  async searchQuizzes(@Query('query') query: string): Promise<Quiz[]> {
    return this.quizModelService.findQuizzes({
      where: { name: { contains: query }, visibility: QuizVisibility.PUBLIC },
    });
  }

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

  @Roles(Role.Creator, Role.Admin)
  @Get('/list')
  async listQuizzes(
    @Req() req,
    @Query('creatorId', new ParseIntPipe({ optional: true }))
    creatorId?: number,
  ): Promise<ResponseQuiz[]> {
    const quizzes = await this.quizModelService.findQuizzes({
      where: {
        creatorId:
          // only allow admins to fetch quizzes from other creators
          req.user.isAdmin && creatorId ? creatorId : req.user.id,
      },
      include: { questions: true },
    });

    return quizzes.map((quiz) => this.quizService.formatQuiz(quiz));
  }

  @Roles(Role.Creator, Role.Admin)
  @Put('/:quizId/edit')
  async editQuiz(
    @Req() req,
    @Body() editQuizDto: EditQuizDto,
    @Param('quizId', new ParseIntPipe()) quizId: number,
  ): Promise<ResponseQuiz> {
    let quiz = await this.quizModelService.findQuiz({
      where: { id: quizId },
    });

    if (
      !quiz ||
      // don't grant access if the user is not the creator or an admin
      (quiz.creatorId !== req.user.id && req.user.isAdmin === false)
    ) {
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

  @Roles(Role.Creator, Role.Admin)
  @Delete('/:quizId/delete')
  async deleteQuiz(
    @Req() req,
    @Param('quizId', new ParseIntPipe()) quizId: number,
  ): Promise<{ success: boolean }> {
    const quiz = await this.quizModelService.findQuiz({
      where: { id: quizId },
    });
    if (
      !quiz ||
      // don't grant access if the user is not the creator or an admin
      (quiz.creatorId !== req.user.id && req.user.isAdmin === false)
    ) {
      throw new BadRequestException('Quiz not found.');
    }

    const deleteResult = await this.quizModelService.deleteQuiz({
      where: { id: quizId },
    });
    return { success: !!deleteResult };
  }

  @Roles(GameRole.Player, GameRole.Host, Role.Creator, Role.Admin)
  @Post('/:quizId/report')
  async reportQuiz(
    @Req() req,
    @Param('quizId', new ParseIntPipe()) quizId: number,
    @Body() reportQuizDto: ReportQuizDto,
  ): Promise<{ success: boolean }> {
    const quiz = await this.quizModelService.findQuiz({
      where: { id: quizId },
    });
    if (!quiz) {
      throw new BadRequestException('Quiz not found.');
    }

    if (req.user.authType === JwtAuthType.Creator) {
      const report = await this.quizModelService.report({
        where: { quizId, reporterId: req.user.id },
      });
      if (report) {
        throw new BadRequestException('You have already reported this quiz.');
      }
    }

    const report = await this.quizModelService.reportQuiz({
      data: {
        quiz: { connect: { id: quizId } },
        reporter:
          req.user.authType === JwtAuthType.Creator
            ? { connect: { id: req.user.id } }
            : null,
        reason: reportQuizDto.reason,
      },
    });
    return { success: !!report };
  }

  @Roles(Role.Creator, GameRole.Player, Role.Admin)
  @Get('/:quizId')
  async getQuiz(
    @Req() req,
    @Param('quizId', new ParseIntPipe()) quizId: number,
  ): Promise<ResponseQuiz> {
    const quiz = await this.quizModelService.findQuizWithQuestions({
      where: {
        id: quizId,
        OR: [
          { visibility: QuizVisibility.PUBLIC },
          {
            creatorId:
              req.user.authType === JwtAuthType.Creator ? req.user.id : -1,
          },
        ],
      },
    });

    if (!quiz) {
      throw new BadRequestException('Quiz not found.');
    }

    return this.quizService.formatQuiz(quiz, quiz.questions);
  }
}
