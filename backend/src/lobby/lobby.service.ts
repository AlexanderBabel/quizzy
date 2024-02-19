import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CacheModelService } from 'src/model/cache.model.service';
import { Lobby } from './types/lobby.type';
import { JwtAuthType } from 'src/auth/jwt/enums/jwt.enum';

@Injectable()
export class LobbyService {
  constructor(
    @Inject(CacheModelService) private cacheModelService: CacheModelService,
  ) {}

  private generateRandomCode(): string {
    return (Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000).toString(); //generate pseudo-random code as string
  }

  async getLobby(lobbyCode: string): Promise<Lobby> {
    const lobbyWithCode: Lobby = await this.cacheModelService.get(lobbyCode);

    if (!lobbyWithCode) {
      throw new NotFoundException(`Lobby with code ${lobbyCode} not found!`);
    }

    return lobbyWithCode;
  }

  async joinLobby(joinLobby: {
    lobbyCode: string;
    userName: string;
    playerId: string;
    playerType: JwtAuthType;
  }) {
    await this.cacheModelService.runScriptByName(
      'joinLobby',
      [joinLobby.lobbyCode],
      [joinLobby.userName, joinLobby.playerId, joinLobby.playerType],
    );
  }

  async createLobby(createLobby: {
    quizId: string;
    hostId: string;
    hostType: JwtAuthType;
  }): Promise<string> {
    const newLobby: Lobby = {
      code: this.generateRandomCode(),
      quizId: createLobby.quizId,
      hostId: createLobby.hostId,
      hostType: createLobby.hostType,
      players: [],
    };

    await this.cacheModelService.set(newLobby.code, newLobby);
    return newLobby.code;
  }

  async getPlayers(getPlayers: { lobbyCode: string }) {
    const lobbyWithCode: Lobby = await this.getLobby(getPlayers.lobbyCode);

    return lobbyWithCode.players;
  }

  async kickPlayer(kickPlayer: { lobbyCode: string; playerId: string }) {
    await this.cacheModelService.runScriptByName(
      'kickPlayer',
      [kickPlayer.lobbyCode],
      [kickPlayer.playerId],
    );
  }

  startQuiz() {} //TODO: Need the Game API to continue with this
}
