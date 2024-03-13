import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Lobby } from 'src/lobby/types/lobby.type';
import { CacheModelService } from 'src/model/cache.model.service';
import { QuizModelService } from 'src/model/quiz.model.service';
import { WsException } from '@nestjs/websockets';
import { GameRole } from 'src/auth/jwt/enums/roles.enum';
import { GameState } from './types/game.state.type';

const CHECK_INTERVAL = 1000;
const QUESTION_TIME = 30000;

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
      quizName: lobby.quizName,
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

  async endGame(host: Socket, gameState: GameState): Promise<void> {
    host.to(gameState.lobbyCode).emit('game:end', { ended: true });
    await this.cacheModelService.del(`game:${gameState.lobbyCode}`);

    const clients = await host.to(gameState.lobbyCode).fetchSockets();
    clients.forEach((client) => {
      delete client.data.userName;
      delete client.data.role;
      delete client.data.lobbyCode;
      delete client.data.answerId;
      delete client.data.submissionTime;
    });

    host.to(gameState.lobbyCode).socketsLeave(gameState.lobbyCode);
    host.leave(gameState.lobbyCode);
  }

  async nextQuestion(host: Socket, game: GameState): Promise<boolean> {
    if (game.current.index >= game.current.count - 1) {
      console.log('nextQuestion: no more questions');
      return false;
    }

    game.current.index++;
    console.log('nextQuestion:gameState', game);

    const questions = await this.quizModelService.findQuestions({
      where: { order: game.current.index, quizId: game.quizId },
      include: { answers: true },
    });

    console.log('nextQuestion', questions);
    if (questions.length !== 1) {
      console.log('nextQuestion: no question found');
      return false;
    }

    const [question] = questions;
    game.current.question = question;
    game.current.startTime = this.now();
    game.current.endTime = game.current.startTime + QUESTION_TIME;

    await this.saveGameState(game);

    // send answer options to players
    host.to(game.lobbyCode).emit('game:question', {
      answers: question.answers.map((a) => ({ id: a.id, text: a.text })),
      count: game.current.count,
      current: game.current.index,
      endTime: game.current.endTime,
    });

    // send question to host
    host.emit('game:question', {
      question: question.question,
      answers: question.answers.map((a) => ({ id: a.id, text: a.text })),
      count: game.current.count,
      current: game.current.index,
      endTime: game.current.endTime,
    });

    setTimeout(() => this.checkAnswers(host), CHECK_INTERVAL);
    return true;
  }

  async sendQuestion(client: Socket, game: GameState) {
    client.emit('game:question', {
      answers: game.current.question.answers.map((a) => ({
        id: a.id,
        text: a.text,
      })),
      count: game.current.count,
      current: game.current.index,
      endTime: game.current.endTime,
    });
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

    const game = await this.getGameState(host.data.lobbyCode);
    console.log(
      'checkAnswers',
      missingAnswers,
      players.length,
      game.current.endTime - this.now(),
    );

    if (missingAnswers && this.now() < game.current.endTime) {
      setTimeout(() => this.checkAnswers(host), CHECK_INTERVAL);
      return;
    }

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
      .map((client, index, array) => {
        // maximum score: 1000 points
        // the score gets smaller by every player that answered correctly before
        // and the time it took to answer (uses the percentage of the time that has passed to calculate the score)
        const placePercentage = 1 - index / array.length;
        const timePercentage =
          1 -
          (client.data.submissionTime - game.current.startTime) /
            (game.current.endTime - game.current.startTime);

        const delta = Math.max(
          // place percentage counts 70% and time percentage 30%
          Math.floor(700 * placePercentage + 300 * timePercentage),
          // min score for a correct answer is 100 points
          100,
        );
        game.scores[client.data.id] += delta;

        return {
          client,
          score: game.scores[client.data.id],
          delta,
          correct: true,
        };
      });

    console.log(
      'checkAnswers:playersWithNoAnswer',
      playersWithNoAnswer.map((p) => p.client.data.userName),
    );
    console.log(
      'checkAnswers:playersWithCorrectAnswer',
      playersWithCorrectAnswer.map((p) => p.client.data.userName),
    );

    const answersCountsObj = players.reduce((acc, client) => {
      const { answerId } = client.data;
      if (!answerId) {
        return acc;
      }

      acc[answerId] = acc[answerId] ?? 0;
      acc[answerId] += 1;
      return acc;
    }, {});

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

        delete data.client.data.answerId;
        delete data.client.data.submissionTime;

        data.client.emit('game:results', {
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
    host.emit('game:results', {
      scores: scores,
      gameOver,
      answerCounts: game.current.question.answers.map((a) => ({
        id: a.id,
        correct: a.correct,
        count: answersCountsObj[a.id] ?? 0,
      })),
    });
    console.log('checkAnswers:scores', scores);
  }
}
