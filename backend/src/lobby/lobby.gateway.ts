import { Logger, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  OnGatewayDisconnect,
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

@WebSocketGateway({ cors: true })
export class LobbyGateway implements OnGatewayDisconnect {
  constructor(
    private readonly lobbyService: LobbyService,
    private readonly gameService: GameService,
    private readonly quizModelService: QuizModelService,
  ) {}

  @WebSocketServer()
  private server: Server;
  private readonly logger = new Logger(LobbyGateway.name);

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @SubscribeMessage('lobby:create')
  async createLobby(client: Socket, quizId: string): Promise<string> {
    if (client.data.lobbyCode) {
      throw new WsException('Already in a lobby');
    }

    // rejoin the lobby if the client was disconnected
    const playerData = await this.lobbyService.getPlayerData(client.data.id);
    if (playerData) {
      this.logger.debug('reconnected', client.data);
      if (playerData.role === GameRole.Host) {
        return this.joinLobby(client, {
          lobbyCode: playerData.lobbyCode,
          userName: null,
        });
      }
      await this.lobbyService.deletePlayerData(client.data.id);
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
      quizName: quiz.name,
      hostId: client.data.id,
      hostType: client.data.authType,
    });

    client.data.lobbyCode = lobbyCode;
    client.data.role = GameRole.Host;

    client.join(lobbyCode);

    this.logger.debug('lobby:create', client.data);
    client.emit('lobby:create', { lobbyCode, quizName: quiz.name });
    return lobbyCode;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new WSValidationPipe())
  @SubscribeMessage('lobby:join')
  async joinLobby(client: Socket, payload: JoinLobbyDto): Promise<string> {
    if (client.data.lobbyCode) {
      throw new WsException('Already in lobby');
    }

    const { lobbyCode, userName } = payload;

    let playerData = await this.lobbyService.getPlayerData(client.data.id);
    if (!client.data.blockedLobbies && playerData?.blockedLobbies) {
      client.data.blockedLobbies = playerData.blockedLobbies;
      this.logger.debug('reconnected', client.data);
    }

    // delete data from redis
    if (playerData) {
      await this.lobbyService.deletePlayerData(client.data.id);
    }

    // allow joining into a new lobby on reconnect
    if (playerData?.lobbyCode !== lobbyCode) {
      playerData = null;
    }

    if (client.data.blockedLobbies?.includes(lobbyCode)) {
      throw new WsException('Lobby not found');
    }

    const lobby = await this.lobbyService.getLobby(lobbyCode);
    const game = await this.gameService.getGameState(lobbyCode);
    this.logger.debug('lobby:join', lobbyCode, lobby, game);
    if (!lobby && !game) {
      throw new WsException('Lobby not found');
    }

    // require userName for players
    if (
      !userName &&
      !playerData?.userName &&
      playerData?.role !== GameRole.Host
    ) {
      client.emit('lobby:join', { state: 'name' });
      return;
    }

    client.data.lobbyCode = lobbyCode;
    client.data.userName = playerData?.userName ?? userName;
    client.data.role = playerData?.role ?? GameRole.Player;

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

    this.logger.debug('lobby:join', payload, client.data, {
      state: game ? 'game' : 'lobby',
      role: client.data.role,
      quizId: game?.quizId ?? lobby?.quizId,
      quizName: game?.quizName ?? lobby?.quizName,
    });
    client.emit('lobby:join', {
      state: game ? 'game' : 'lobby',
      role: client.data.role,
      quizId: game?.quizId ?? lobby?.quizId,
      quizName: game?.quizName ?? lobby?.quizName,
    });
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

  async handleDisconnect(client: Socket): Promise<void> {
    if (client.data.lobbyCode || client.data.blockedLobbies) {
      await this.lobbyService.savePlayerData({
        id: client.data.id,
        role: client.data.role,
        lobbyCode: client.data.lobbyCode,
        userName: client.data.userName,
        blockedLobbies: client.data.blockedLobbies,
      });
      await this.leaveLobby(client);
    }
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('lobby:leave')
  async leaveLobby(client: Socket): Promise<string> {
    const { lobbyCode } = client.data;
    if (!lobbyCode) {
      throw new WsException('Not in a lobby');
    }

    this.logger.debug('leave room', lobbyCode);
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

    this.logger.debug('start quiz', lobby.code);
    this.server.to(lobby.code).emit('lobby:start', { success: true });
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

    // string to int comparison is intentional
    const kickedPlayer = players.find((p) => p.data.id == payload.playerId);
    if (!kickedPlayer) {
      throw new WsException('Player not found');
    }

    delete kickedPlayer.data.lobbyCode;
    delete kickedPlayer.data.userName;
    delete kickedPlayer.data.role;
    kickedPlayer.leave(lobbyCode);
    kickedPlayer.emit('lobby:kick', { kicked: true });

    if (payload.block) {
      kickedPlayer.data.blockedLobbies = kickedPlayer.data.blockedLobbies ?? [];
      kickedPlayer.data.blockedLobbies.push(payload.block);
    }

    this.server.to(lobbyCode).emit('lobby:playerLeft', payload.playerId);
    this.logger.debug('kick player', payload, kickedPlayer['user']);

    this.server.to(lobbyCode).emit(
      'lobby:players',
      (await client.to(lobbyCode).fetchSockets())
        .filter((p) => p.data.role === GameRole.Player)
        .map((p) => ({ name: p.data.userName, id: p.data.id })),
    );

    return 'Kicked player';
  }
}
