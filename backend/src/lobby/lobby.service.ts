import { Injectable, Inject } from '@nestjs/common';
import { CacheModelService } from 'src/model/cache.model.service';
import { Lobby } from './types/lobby.type';
import { JwtAuthType } from 'src/auth/jwt/enums/jwt.enum';
import { PlayerData } from './types/plater.data.type';

@Injectable()
export class LobbyService {
  constructor(
    @Inject(CacheModelService) private cacheModelService: CacheModelService,
  ) {}

  private generateRandomCode(): string {
    // generate pseudo-random code as string
    return (Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000).toString();
  }

  async getPlayerData(playerId: string): Promise<PlayerData | null> {
    return this.cacheModelService.get(`lobby:player:${playerId}`);
  }

  async savePlayerData(playerData: PlayerData): Promise<void> {
    return this.cacheModelService.set(
      `lobby:player:${playerData.id}`,
      playerData,
      3600, // 1 hour ttl
    );
  }

  async deletePlayerData(playerId: string): Promise<void> {
    return this.cacheModelService.del(`lobby:player:${playerId}`);
  }

  async getLobby(lobbyCode: string): Promise<Lobby> {
    const lobbyWithCode: Lobby = await this.cacheModelService.get(
      `lobby:${lobbyCode}`,
    );

    if (!lobbyWithCode) {
      return null;
    }

    return lobbyWithCode;
  }

  async createLobby(createLobby: {
    quizId: number;
    quizName: string;
    hostId: string;
    hostType: JwtAuthType;
  }): Promise<string> {
    const newLobby: Lobby = {
      code: this.generateRandomCode(),
      quizId: createLobby.quizId,
      quizName: createLobby.quizName,
    };

    await this.cacheModelService.set(`lobby:${newLobby.code}`, newLobby);
    return newLobby.code;
  }

  async deleteLobby(lobbyCode: string) {
    await this.cacheModelService.del(`lobby:${lobbyCode}`);
  }
}
