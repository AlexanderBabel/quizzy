import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CacheModelService } from 'src/model/cache.model.service';

type Player = {
  //Probably defined somewhere else later, dodge for now
  name: string;
  id: string;
};

type Lobby = {
  lobbyCode: string;
  quizId: string;
  players: Player[];
};

@Injectable()
export class LobbyService {
  constructor(
    @Inject(CacheModelService) private cacheModelService: CacheModelService,
  ) {}

  private generateRandomCode(): string {
    return (Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000).toString(); //generate pseudo-random code as string
  }

  private async getLobby({ lobbyCode }: { lobbyCode: string }): Promise<Lobby> {
    let lobbyWithCode: Lobby = await this.cacheModelService.get(lobbyCode);

    if (!lobbyWithCode) {
      throw new NotFoundException(`Lobby with code ${lobbyCode} not found!`);
    }

    return lobbyWithCode;
  }

  async joinLobby(joinLobby: { lobbyCode: string; userName: string }) {
    const playerId: string = this.generateRandomCode();

    await this.cacheModelService.runScriptByName(
      'joinLobby',
      [joinLobby.lobbyCode],
      [joinLobby.userName, playerId],
    );
  }

  async createLobby(createLobby: { quizId: string }) {
    const randomLobbyId: string = this.generateRandomCode();

    let newLobby: Lobby = {
      lobbyCode: randomLobbyId,
      quizId: createLobby.quizId,
      players: [],
    };

    await this.cacheModelService.set(randomLobbyId, newLobby);
    return randomLobbyId;
  }

  async getPlayers(getPlayers: { lobbyCode: string }) {
    const lobbyWithCode: Lobby = await this.getLobby({
      lobbyCode: getPlayers.lobbyCode,
    });

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
