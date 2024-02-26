import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { JoinLobbyDto } from './dtos/join.lobby.dto';
import { LobbyService } from './lobby.service';
import { GameRole } from 'src/auth/jwt/enums/roles.enum';
import { Roles } from 'src/auth/jwt/decorators/roles.decorator';
import { GameService } from 'src/game/game.service';
import { WSValidationPipe } from 'src/ws.validation.pipe';
import { QuizModelService } from 'src/model/quiz.model.service';
import { QuizVisibility } from '@prisma/client';
import { JwtAuthType } from 'src/auth/jwt/enums/jwt.enum';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    allowedHeaders: ['Authorization'],
    credentials: true,
  },
})
export class LobbyGateway {
  constructor(
    private readonly lobbyService: LobbyService,
    private readonly gameService: GameService,
    private readonly quizModelService: QuizModelService,
  ) {}

  @WebSocketServer()
  private server: Server;

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @SubscribeMessage('lobby:create')
  async createLobby(client: Socket, quizId: string): Promise<string> {
    if (client.data.lobbyCode) {
      throw new WsException('Already in a lobby');
    }

    const quiz = await this.quizModelService.findQuiz({
      where: {
        id: Number.parseInt(quizId),
        OR: [
          {
            creatorId:
              client.data.authType === JwtAuthType.Creator
                ? client.data.id
                : -1,
          },
          { visibility: QuizVisibility.PUBLIC },
        ],
      },
    });
    if (!quiz) {
      throw new WsException('Quiz not found');
    }

    const lobbyCode = await this.lobbyService.createLobby({
      quizId: Number.parseInt(quizId),
      hostId: client.data.id,
      hostType: client.data.authType,
    });

    client.data.lobbyCode = lobbyCode;
    client.data.role = GameRole.Host;

    client.join(lobbyCode);

    console.log('lobby:create', client.data);
    client.emit('lobby:create', lobbyCode);
    return lobbyCode;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new WSValidationPipe())
  @SubscribeMessage('lobby:join')
  async joinLobby(client: Socket, payload: JoinLobbyDto): Promise<string> {
    const { lobbyCode } = payload;
    if (client.data.blockedLobbies?.includes(lobbyCode)) {
      throw new WsException('Lobby not found');
    }

    if (client.data.lobbyCode) {
      throw new WsException('Already in lobby');
    }

    const lobby = await this.lobbyService.getLobby(lobbyCode);
    const game = await this.gameService.getGameState(lobbyCode);
    console.log('lobby:join', lobbyCode, lobby, game);
    if (!lobby && !game) {
      throw new WsException('Lobby not found');
    }

    client.data.lobbyCode = lobbyCode;
    client.data.userName = payload.userName;
    client.data.role = GameRole.Player;

    client.join(lobbyCode);
    client.to(lobbyCode).emit('lobby:playerJoined', client.data.userName);

    const players = await this.server.to(lobbyCode).fetchSockets();
    this.server.to(lobbyCode).emit(
      'lobby:players',
      players
        .filter((p) => p.data.role === GameRole.Player)
        .map((p) => ({ name: p.data.userName, id: p.data.id })),
    );

    if (game && game.current.endTime > this.gameService.now()) {
      this.gameService.sendQuestion(client, game);
    }

    console.log('lobby:join', payload, client.data);
    return 'Joined lobby';
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('lobby:players')
  async getPlayers(client: Socket): Promise<string> {
    const { lobbyCode } = client.data;
    if (!lobbyCode) {
      throw new WsException('Not in a lobby');
    }

    const players = await client.to(lobbyCode).fetchSockets();
    client.emit(
      'lobby:players',
      players
        .filter((p) => p.data.role === GameRole.Player)
        .map((p) => ({ name: p.data.userName, id: p.data.id })),
    );
    return 'Players sent';
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('lobby:leave')
  async leaveLobby(client: Socket): Promise<string> {
    const { lobbyCode } = client.data;
    if (!lobbyCode) {
      throw new WsException('Not in a lobby');
    }

    console.log('leave room', lobbyCode);
    client.to(lobbyCode).emit('lobby:playerLeft', { id: client.data.id });

    delete client.data.lobbyCode;
    delete client.data.userName;
    delete client.data.role;
    client.leave(lobbyCode);

    this.server.to(lobbyCode).emit(
      'lobby:players',
      (await client.to(lobbyCode).fetchSockets())
        .filter((p) => p.data.role === GameRole.Player)
        .map((p) => ({ name: p.data.userName, id: p.data.id })),
    );

    return 'Left lobby';
  }

  @Roles(GameRole.Host)
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('lobby:start')
  async startQuiz(client: Socket): Promise<string> {
    const { lobbyCode } = client.data;
    if (!lobbyCode) {
      throw new WsException('Not in a lobby');
    }

    const lobby = await this.lobbyService.getLobby(lobbyCode);
    if (!lobby) {
      throw new WsException('Lobby not found');
    }

    // at least one player besides the host is required
    const players = await this.server.to(lobby.code).fetchSockets();
    if (players.length < 2) {
      throw new WsException('Not enough players');
    }

    console.log('start quiz', lobby.code);
    this.server.to(lobby.code).emit('lobby:startQuiz');
    this.lobbyService.deleteLobby(lobby.code);
    const res = await this.gameService.startGame(client, lobby);
    if (!res) {
      throw new WsException('Error starting the game');
    }

    return 'Quiz started';
  }

  @Roles(GameRole.Host)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @SubscribeMessage('lobby:kick')
  async kickPlayer(
    client: Socket,
    payload: { playerId: string; block: boolean },
  ): Promise<string> {
    const { lobbyCode } = client.data;
    if (!lobbyCode) {
      throw new WsException('Not in a lobby');
    }

    const players = await client.to(lobbyCode).fetchSockets();
    for (const player of players) {
      // string to int comparison is intentional
      if (player.data.id == payload.playerId) {
        delete client.data.lobbyCode;
        delete client.data.userName;
        delete client.data.role;
        player.leave(lobbyCode);

        if (payload.block) {
          client.data.blockedLobbies = client.data.blockedLobbies ?? [];
          client.data.blockedLobbies.push(payload.block);
        }

        this.server.to(lobbyCode).emit('lobby:playerLeft', payload.playerId);
        console.log('kick player', payload, client['user']);
        return 'Kicked player';
      }
    }

    this.server.to(lobbyCode).emit(
      'lobby:players',
      (await client.to(lobbyCode).fetchSockets())
        .filter((p) => p.data.role === GameRole.Player)
        .map((p) => ({ name: p.data.userName, id: p.data.id })),
    );

    throw new WsException('Player not found');
  }
}
