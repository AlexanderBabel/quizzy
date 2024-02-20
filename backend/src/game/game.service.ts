import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Lobby } from 'src/lobby/types/lobby.type';
import { CacheModelService } from 'src/model/cache.model.service';
import { QuizModelService } from 'src/model/quiz.model.service';
import { WsException } from '@nestjs/websockets';
import { GameRole } from 'src/auth/jwt/enums/roles.enum';
import { GameState } from './types/game.state.type';

const CHECK_INTERVAL = 1000;
const QUESTION_TIME = 10000;

@Injectable()
export class GameService {
  constructor(
    private readonly cacheModelService: CacheModelService,
    private readonly quizModelService: QuizModelService,
  ) {}

  now() {
    return new Date().getTime();
  }

  async getGameState(lobbyCode: string): Promise<GameState | null> {
    return this.cacheModelService.get(`game:${lobbyCode}`);
  }

  async saveGameState(gameState: GameState): Promise<void> {
    return this.cacheModelService.set(`game:${gameState.lobbyCode}`, gameState);
  }

  async startGame(host: Socket, lobby: Lobby): Promise<boolean> {
    const questionIndex = -1;
    const lobbyCode = lobby.code;
    const quizId = lobby.quizId;

    const questionCount = await this.quizModelService.countQuestions({
      where: { quizId },
    });

    const gameState: GameState = {
      lobbyCode,
      quizId,
      current: {
        index: questionIndex,
        question: null,
        count: questionCount,
        startTime: null,
        endTime: null,
      },
      scores: {},
    };

    return this.nextQuestion(host, gameState);
  }

  async nextQuestion(host: Socket, gameSate: GameState): Promise<boolean> {
    if (gameSate.current.index >= gameSate.current.count - 1) {
      return false;
    }

    const questions = await this.quizModelService.findQuestions({
      where: { order: gameSate.current.index, quizId: gameSate.quizId },
      include: { answers: true },
    });

    if (questions.length !== 1) {
      return false;
    }

    const [question] = questions;
    gameSate.current.question = question;
    gameSate.current.index++;
    gameSate.current.startTime = this.now();
    gameSate.current.endTime = gameSate.current.startTime + QUESTION_TIME;

    await this.saveGameState(gameSate);

    // send answer options to players
    host.to(gameSate.lobbyCode).emit('game:question', {
      answers: question.answers.map((a) => ({ id: a.id, text: a.text })),
      count: gameSate.current.count,
      current: gameSate.current.index,
    });

    // send question to host
    host.emit('game:question', {
      question: question.question,
      answers: question.answers.map((a) => ({ id: a.id, text: a.text })),
      count: gameSate.current.count,
      current: gameSate.current.index,
    });

    setTimeout(() => this.checkAnswers(host), CHECK_INTERVAL);
    return true;
  }

  async answerQuestion(client: Socket, game: GameState, answerId: number) {
    if (game.current.endTime < this.now()) {
      throw new WsException('Time is up');
    }

    client.data.answerId = answerId;
    client.data.submissionTime = this.now();
  }

  async checkAnswers(host: Socket) {
    const players = await host.to(host.data.lobbyCode).fetchSockets();
    const missingAnswers = players.some(
      (client) => !client.data.answerId && client.data.role === GameRole.Player,
    );

    if (missingAnswers && this.now() < host.data.questionEndTime) {
      setTimeout(() => this.checkAnswers(host), CHECK_INTERVAL);
      return;
    }

    const game = await this.getGameState(host.data.lobbyCode);

    const playersWithNoAnswer = [];
    const playersWithCorrectAnswer = players
      // filter out host and players with no answer
      .filter((client) => {
        // ignore host
        if (client.data.role !== GameRole.Player) {
          return false;
        }

        // init score if not set
        game.scores[client.data.id] = game.scores[client.data.id] ?? 0;

        const answer = game.current.question.answers.find(
          (a) => a.id === client.data.answerId,
        );
        if (!answer || answer.correct === false) {
          playersWithNoAnswer.push({
            client,
            score: game.scores[client.data.id],
            delta: 0,
            correct: false,
          });
          return false;
        }

        return true;
      })

      // sort by submission time
      .sort((a, b) => a.data.submissionTime - b.data.submissionTime)

      // calculate scores
      .map((client, index) => {
        // maximum score: 1000 points
        // the score gets smaller by every player that answered correctly before
        // and the time it took to answer (uses the percentage of the time that has passed to calculate the score)
        const score = 1000 - index * 100;
        const timePercentage =
          (client.data.submissionTime - game.current.startTime) /
          (game.current.endTime - game.current.startTime);

        const delta = Math.floor(score * (1 - timePercentage));
        game.scores[client.data.id] += delta;

        return {
          client,
          score: game.scores[client.data.id],
          delta,
          correct: true,
        };
      });

    const gameOver = game.current.index >= game.current.count - 1;
    const scores = [...playersWithNoAnswer, ...playersWithCorrectAnswer]
      // sort by score to get ranking
      .sort((a, b) => b.score - a.score)

      // send results to players
      .map((data, index) => {
        const score = {
          place: index + 1,
          score: data.score,
          delta: data.delta,
        };

        data.client.emit('game:result', {
          correct: data.correct,
          gameOver,
          ...score,
        });

        return {
          id: data.client.data.id,
          name: data.client.data.userName,
          ...score,
        };
      });

    await this.saveGameState(game);

    // send scores to host
    host.emit('game:scores', {
      scores: scores,
      gameOver,
    });
  }
}
