import { Injectable } from '@nestjs/common';
import { Prisma, Quiz, QuizQuestion, QuizQuestionAnswer } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  async findQuiz(
    quizWhereUniqueInput: Prisma.QuizWhereUniqueInput,
  ): Promise<Quiz | null> {
    return this.prisma.quiz.findUnique({
      where: quizWhereUniqueInput,
    });
  }

  async findQuizzes(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.QuizWhereUniqueInput;
    where?: Prisma.QuizWhereInput;
    orderBy?: Prisma.QuizOrderByWithRelationInput;
  }): Promise<Quiz[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.quiz.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createQuiz(params: { data: Prisma.QuizCreateInput }): Promise<Quiz> {
    const { data } = params;
    return this.prisma.quiz.create({ data });
  }

  async updateQuiz(params: {
    where: Prisma.QuizWhereUniqueInput;
    data: Prisma.QuizUpdateInput;
  }): Promise<Quiz> {
    const { where, data } = params;
    return this.prisma.quiz.update({
      data,
      where,
    });
  }

  async deleteQuiz(params: {
    where: Prisma.QuizWhereUniqueInput;
  }): Promise<Quiz> {
    const { where } = params;
    return this.prisma.quiz.delete({
      where,
    });
  }

  async createQuestion(params: {
    data: Prisma.QuizQuestionCreateInput;
  }): Promise<QuizQuestion & { answers: QuizQuestionAnswer[] }> {
    const { data } = params;
    return this.prisma.quizQuestion.create({
      data,
      include: { answers: true },
    });
  }

  async updateQuestion(params: {
    where: Prisma.QuizQuestionWhereUniqueInput;
    data: Prisma.QuizQuestionUpdateInput;
  }): Promise<QuizQuestion> {
    const { where, data } = params;
    return this.prisma.quizQuestion.update({
      data,
      where,
    });
  }

  async deleteQuestions(params: {
    where: Prisma.QuizQuestionWhereInput;
  }): Promise<Prisma.BatchPayload> {
    const { where } = params;
    return this.prisma.quizQuestion.deleteMany({ where });
  }

  async createAnswer(params: {
    data: Prisma.QuizQuestionAnswerCreateInput;
  }): Promise<QuizQuestionAnswer> {
    const { data } = params;
    return this.prisma.quizQuestionAnswer.create({ data });
  }

  async updateAnswer(params: {
    where: Prisma.QuizQuestionAnswerWhereUniqueInput;
    data: Prisma.QuizQuestionAnswerUpdateInput;
  }): Promise<QuizQuestionAnswer> {
    const { where, data } = params;
    return this.prisma.quizQuestionAnswer.update({
      data,
      where,
    });
  }

  async deleteAnswers(params: {
    where: Prisma.QuizQuestionAnswerWhereInput;
  }): Promise<Prisma.BatchPayload> {
    const { where } = params;
    return this.prisma.quizQuestionAnswer.deleteMany({ where });
  }
}
