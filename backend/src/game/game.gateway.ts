import { UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Roles } from 'src/auth/jwt/decorators/roles.decorator';
import { GameRole } from 'src/auth/jwt/enums/roles.enum';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { GameService } from './game.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    allowedHeaders: ['Authorization'],
    credentials: true,
  },
})
export class GameGateway {
  constructor(private readonly gameService: GameService) {}

  @Roles(GameRole.Host)
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('game:nextQuestion')
  async handleNextQuestion(client: Socket) {
    const { lobbyCode } = client.data;
    if (!lobbyCode) {
      throw new WsException('You are not in a game');
    }

    const game = await this.gameService.getGameState(lobbyCode);
    if (!game) {
      throw new WsException('Game not found');
    }

    const nextQuestionFound = await this.gameService.nextQuestion(client, game);
    if (!nextQuestionFound) {
      throw new WsException('No more questions');
    }
  }

  @Roles(GameRole.Player)
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('game:answer')
  async handleAnswer(client: Socket, answerId: number) {
    const { lobbyCode } = client.data;
    if (!lobbyCode) {
      throw new WsException('You are not in a game');
    }

    const game = await this.gameService.getGameState(lobbyCode);
    if (!game) {
      throw new WsException('Game not found');
    }

    await this.gameService.answerQuestion(client, game, answerId);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('game:question')
  async handleQuestion(client: Socket) {
    const { lobbyCode } = client.data;
    if (!lobbyCode) {
      throw new WsException('You are not in a game');
    }

    const game = await this.gameService.getGameState(lobbyCode);
    if (!game) {
      throw new WsException('Game not found');
    }

    client.emit('game:question', {
      answers: game.current.question.answers.map((a) => ({
        id: a.id,
        text: a.text,
      })),
      count: game.current.count,
      current: game.current.index,
    });
  }
}
