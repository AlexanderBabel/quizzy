import { BadRequestException, Injectable } from '@nestjs/common';
import { Quiz, QuizQuestion, QuizQuestionAnswer } from '@prisma/client';
import { CreateQuizQuestionDto } from './dtos/create.quiz.dto';
import { ResponseQuiz } from './types/quiz.type';

@Injectable()
export class QuizService {
  validateQuestions(questions: CreateQuizQuestionDto[]): void {
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

  formatQuiz(
    quiz: Quiz,
    questions?: (QuizQuestion & { answers: QuizQuestionAnswer[] })[],
  ): ResponseQuiz {
    const response: ResponseQuiz = {
      quizId: quiz.id,
      name: quiz.name,
      visibility: quiz.visibility,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    };

    if (questions) {
      response.questions = questions.map((question) => ({
        questionId: question.id,
        order: question.order,
        question: question.question,
        answers: question.answers.map((answer) => ({
          answerId: answer.id,
          text: answer.text,
          correct: answer.correct,
        })),
      }));
    }

    return response;
  }
}
