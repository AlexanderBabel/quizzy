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

  @Put('/:quizId/edit')
  @Roles(Role.Creator, Role.Admin)
  async editQuiz(
    @Req() req,
    @Body() editQuizDto: EditQuizDto,
    @Param('quizId') quizId: string,
  ): Promise<ResponseQuiz> {
    let quiz = await this.quizModelService.findQuiz({
      where: { id: Number.parseInt(quizId) },
    });

    if (
      !quiz ||
      // don't grant access if the user is not the creator or an admin
      (quiz.creatorId !== req.user.id && req.user.role !== Role.Admin)
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

  @Get('/:quizId')
  @Roles(Role.Creator, GameRole.Player, Role.Admin)
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

  @Get('/list')
  @Roles(Role.Creator, Role.Admin)
  async listQuizzes(
    @Req() req,
    @Query('creatorId') creatorId?: number,
  ): Promise<ResponseQuiz[]> {
    const quizzes = await this.quizModelService.findQuizzes({
      where: {
        creatorId:
          // only allow admins to fetch quizzes from other creators
          req.user.role === Role.Admin && creatorId ? creatorId : req.user.id,
      },
      include: { questions: true },
    });

    return quizzes.map((quiz) => this.quizService.formatQuiz(quiz));
  }

  @Delete('/:quizId/delete')
  @Roles(Role.Creator, Role.Admin)
  async deleteQuiz(
    @Req() req,
    @Param('quizId') quizId: number,
  ): Promise<{ success: boolean }> {
    const quiz = await this.quizModelService.findQuiz({
      where: { id: quizId },
    });
    if (
      !quiz ||
      // don't grant access if the user is not the creator or an admin
      (quiz.creatorId !== req.user.id && req.user.role !== Role.Admin)
    ) {
      throw new BadRequestException('Quiz not found.');
    }

    const deleteResult = await this.quizModelService.deleteQuiz({
      where: { id: quizId },
    });
    return { success: !!deleteResult };
  }

  @IsPublic()
  @Get('/search')
  async searchQuizzes(@Query('query') query: string): Promise<Quiz[]> {
    return this.quizModelService.findQuizzes({
      where: { name: { contains: query }, visibility: QuizVisibility.PUBLIC },
    });
  }

  @Post('/:quizId/report')
  @Roles(GameRole.Player, GameRole.Host, Role.Creator, Role.Admin)
  async reportQuiz(
    @Req() req,
    @Param('quizId') quizId: number,
    @Body('reason') reason: string,
  ): Promise<{ success: boolean }> {
    const quiz = await this.quizModelService.findQuiz({
      where: { id: quizId },
    });
    if (!quiz) {
      throw new BadRequestException('Quiz not found.');
    }

    if (req.user.authType === JwtAuthType.Creator) {
      const report = await this.quizModelService.report({
        where: { quizId, creatorId: req.user.id },
      });
      if (report) {
        throw new BadRequestException('You have already reported this quiz.');
      }
    }

    const report = await this.quizModelService.reportQuiz({
      data: {
        quiz: { connect: { id: quizId } },
        creator:
          req.user.authType === JwtAuthType.Creator
            ? { connect: { id: req.user.id } }
            : null,
        reason,
      },
    });
    return { success: !!report };
  }
}
