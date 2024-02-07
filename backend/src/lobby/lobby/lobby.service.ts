import {Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

type player = { //Probably defined somewhere else later, dodge for now
    userName: string;
    playerId: string;
}

type lobby = {
  lobbyCode: string;
  quizId: string;
  players: player[];
};

function generateRandomCode(): string {
    return (Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000).toString(); //generate pseudo-random code as string
}

@Injectable()
export class LobbyService {

  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  private lobbies: lobby[];

  private async getLobby({ lobbyCode }: { lobbyCode: string }): Promise<lobby>
  {
    let lobbyWithCode: lobby = await this.cacheService.get(lobbyCode);

    if (!lobbyWithCode) { throw new NotFoundException("Lobby with code ${getLobby.lobbyCode} not found!")};

    return lobbyWithCode;
  } 

  async joinLobby(joinLobby: { lobbyCode: string; userName: string }) {
    let lobbyWithCode: lobby = await this.getLobby({ lobbyCode: joinLobby.lobbyCode });
    const player: player = {userName: joinLobby.userName, playerId: generateRandomCode()}; //Generate playerId to differentiate player's with the same username

    lobbyWithCode.players.push(player); //Add users to player array in lobby
    await this.cacheService.set(joinLobby.lobbyCode, lobbyWithCode) //Store back in cache
  }

  createLobby(createLobby: { quizId: string }) {
    const randomLobbyId: string = generateRandomCode();

    let newLobby: lobby = {
      lobbyCode: randomLobbyId,
      quizId: createLobby.quizId,
      players: [],
    };

    this.lobbies.push(newLobby);
  }

  getPlayers(getPlayers: { lobbyCode: string; }) {
    const lobbyWithCode: lobby = this.getLobby(getPlayers.lobbyCode);

    return lobbyWithCode.players;
  }

  startQuiz() {}

  kickPlayer(kickPlayer: { lobbyCode: string, playerId: string }) {
    const lobbyWithCode: lobby = this.getLobby(kickPlayer.lobbyCode);
    
    const playerIndex = lobbyWithCode.players.findIndex((player) => player.playerId === kickPlayer.playerId);

    lobbyWithCode.players.splice(playerIndex, 1);
  }
}
