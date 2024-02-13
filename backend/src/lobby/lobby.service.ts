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
    const lobbyWithCode: Lobby = await this.cacheModelService.get(lobbyCode);

    if (!lobbyWithCode) {
      throw new NotFoundException(`Lobby with code ${lobbyCode} not found!`);
    }

    return lobbyWithCode;
  }

  async joinLobby(joinLobby: { lobbyCode: string; userName: string }) {
    console.log(joinLobby.lobbyCode);
    const lobbyWithCode: Lobby = await this.getLobby({
      lobbyCode: joinLobby.lobbyCode,
    });

    const player: Player = {
      name: joinLobby.userName,
      id: this.generateRandomCode(),
    }; //Generate playerId to differentiate player's with the same username

    lobbyWithCode.players.push(player); //Add users to player array in lobby
    await this.cacheModelService.set(joinLobby.lobbyCode, lobbyWithCode); //Store back in cache
  }

  async createLobby(createLobby: { quizId: string }) {
    const randomLobbyId: string = this.generateRandomCode();

    const newLobby: Lobby = {
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

  startQuiz() {} //TODO: Need the Game API to continue with this

  async kickPlayer(kickPlayer: { lobbyCode: string; playerId: string }) {
    const lobbyWithCode: Lobby = await this.getLobby({
      lobbyCode: kickPlayer.lobbyCode,
    });

    const playerIndex = lobbyWithCode.players.findIndex(
      (player) => player.id === kickPlayer.playerId,
    );

    lobbyWithCode.players = lobbyWithCode.players.splice(playerIndex, 1);
    await this.cacheModelService.set(kickPlayer.lobbyCode, lobbyWithCode);
  }
}
