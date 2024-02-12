import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CacheService } from 'src/model/cache.service';

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

function generateRandomCode(): string {
  return (Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000).toString(); //generate pseudo-random code as string
}

@Injectable()
export class LobbyService {
  constructor(@Inject(CacheService) private CacheService: CacheService) {}

  private async getLobby({ lobbyCode }: { lobbyCode: string }): Promise<Lobby> {
    let lobbyWithCode: Lobby = await this.CacheService.get(lobbyCode);

    if (!lobbyWithCode) {
      throw new NotFoundException(
        `Lobby with code ${lobbyCode} not found!`,
      );
    }

    return lobbyWithCode;
  }

  async joinLobby(joinLobby: { lobbyCode: string; name: string }) {
    let lobbyWithCode: Lobby = await this.getLobby({
      lobbyCode: joinLobby.lobbyCode,
    });
    const player: Player = {
      name: joinLobby.name,
      id: generateRandomCode(),
    }; //Generate playerId to differentiate player's with the same username

    lobbyWithCode.players.push(player); //Add users to player array in lobby
    await this.CacheService.set(joinLobby.lobbyCode, lobbyWithCode); //Store back in cache
  }

  async createLobby(createLobby: { quizId: string }) {
    const randomLobbyId: string = generateRandomCode();

    let newLobby: Lobby = {
      lobbyCode: randomLobbyId,
      quizId: createLobby.quizId,
      players: [],
    };

    await this.CacheService.set(randomLobbyId, newLobby);
  }

  async getPlayers(getPlayers: { lobbyCode: string }) {
    const lobbyWithCode: Lobby = await this.getLobby({
      lobbyCode: getPlayers.lobbyCode,
    });

    return lobbyWithCode.players;
  }

  startQuiz() {}

  async kickPlayer(kickPlayer: { lobbyCode: string; playerId: string }) {
    let lobbyWithCode: Lobby = await this.getLobby({
      lobbyCode: kickPlayer.lobbyCode,
    });

    const playerIndex = lobbyWithCode.players.findIndex(
      (player) => player.id === kickPlayer.playerId,
    );

    lobbyWithCode.players = lobbyWithCode.players.splice(playerIndex, 1);
    await this.CacheService.set(kickPlayer.lobbyCode, lobbyWithCode);
  }
}
