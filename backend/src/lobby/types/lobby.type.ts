import { JwtAuthType } from 'src/auth/jwt/enums/jwt.enum';
import { Player } from './player.type';

export type Lobby = {
  code: string;
  quizId: number;
  players: Player[];
  hostId: string;
  hostType: JwtAuthType;
  // questions: string[];
  // currentQuestion: number;
  // gameState: 'lobby' | 'answering' | 'results' | 'scoreboard';
  // scores: { [playerId: string]: number };
};

/**
 * start game request
 * - fetch quiz and questions from db
 * - set current question to 0, save array of questions
 * - pub question to all players
 *   - question, answers, end time
 * -
 *
 */
