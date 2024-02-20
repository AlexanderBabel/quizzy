import { QuizQuestion, QuizQuestionAnswer } from '@prisma/client';

export type GameState = {
  lobbyCode: string;
  quizId: number;
  current: {
    index: number;
    question: QuizQuestion & { answers: QuizQuestionAnswer[] };
    count: number;
    startTime: number;
    endTime: number;
  };
  scores: {
    [playerId: string]: number;
  };
};
