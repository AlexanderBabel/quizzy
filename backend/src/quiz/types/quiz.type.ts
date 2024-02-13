import { QuizVisibility } from '@prisma/client';

export type ResponseQuiz = {
  quizId: number;
  name: string;
  visibility: QuizVisibility;
  createdAt: Date;
  updatedAt: Date;
  questions?: ResponseQuizQuestion[];
};

export type ResponseQuizQuestion = {
  questionId: number;
  order: number;
  question: string;
  answers: ResponseQuizQuestionAnswer[];
};

export type ResponseQuizQuestionAnswer = {
  answerId: number;
  text: string;
  correct: boolean;
};
