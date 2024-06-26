import { Injectable } from '@nestjs/common';
import {
  Prisma,
  Quiz,
  QuizQuestion,
  QuizQuestionAnswer,
  QuizReport,
} from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class QuizModelService {
  constructor(private prisma: PrismaService) {}

  async findQuizWithQuestions(params: {
    where: Prisma.QuizWhereUniqueInput;
  }): Promise<
    | (Quiz & {
        questions: (QuizQuestion & { answers: QuizQuestionAnswer[] })[];
      })
    | null
  > {
    const { where } = params;
    return this.prisma.quiz.findUnique({
      where,
      include: { questions: { include: { answers: true } } },
    });
  }

  async findQuiz(params: {
    where: Prisma.QuizWhereUniqueInput;
  }): Promise<Quiz | null> {
    const { where } = params;
    return this.prisma.quiz.findUnique({
      where,
    });
  }

  async findQuizzes(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.QuizWhereUniqueInput;
    where?: Prisma.QuizWhereInput;
    orderBy?: Prisma.QuizOrderByWithRelationInput;
    include?: Prisma.QuizInclude;
  }): Promise<Quiz[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.quiz.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
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

  async findQuestions(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.QuizQuestionWhereUniqueInput;
    where?: Prisma.QuizQuestionWhereInput;
    orderBy?: Prisma.QuizQuestionOrderByWithRelationInput;
    include?: Prisma.QuizQuestionInclude;
  }): Promise<(QuizQuestion & { answers: QuizQuestionAnswer[] })[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.quizQuestion.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async countQuestions(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.QuizQuestionWhereUniqueInput;
    where?: Prisma.QuizQuestionWhereInput;
    orderBy?: Prisma.QuizQuestionOrderByWithRelationInput;
  }): Promise<number> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.quizQuestion.count({
      skip,
      take,
      cursor,
      where,
      orderBy,
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
  }): Promise<QuizQuestion & { answers: QuizQuestionAnswer[] }> {
    const { where, data } = params;
    return this.prisma.quizQuestion.update({
      data,
      where,
      include: { answers: true },
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

  async reportQuiz(params: {
    data: Prisma.QuizReportCreateInput;
  }): Promise<QuizReport> {
    const { data } = params;
    return this.prisma.quizReport.create({
      data,
    });
  }

  async report(params: {
    where: Prisma.QuizReportWhereInput;
  }): Promise<QuizReport | null> {
    const { where } = params;
    return this.prisma.quizReport.findFirst({
      where,
    });
  }

  async reports(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.QuizReportWhereUniqueInput;
    where?: Prisma.QuizReportWhereInput;
    orderBy?: Prisma.QuizReportOrderByWithRelationInput;
  }): Promise<QuizReport[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.quizReport.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { quiz: true, reporter: true },
    });
  }

  async deleteReport(params: {
    where: Prisma.QuizReportWhereUniqueInput;
  }): Promise<QuizReport> {
    const { where } = params;
    return this.prisma.quizReport.delete({
      where,
    });
  }
}
