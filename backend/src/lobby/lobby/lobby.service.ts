import { Injectable, NotFoundException } from '@nestjs/common';

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

function getLobby(lobbyCode: string): lobby {
    const lobbyWithCode: lobby = this.lobbies.find((lobby) => lobby.lobbyCode === lobbyCode);
    if (!lobbyWithCode) { throw new NotFoundException("No lobby with code ${joinLobby.lobbyCode} found!"); }

    return lobbyWithCode;
}

@Injectable()
export class LobbyService {
  private lobbies: lobby[];

  joinLobby(joinLobby: { lobbyCode: string; userName: string }) {
    const lobbyWithCode: lobby = getLobby(joinLobby.lobbyCode);
    const player: player = {userName: joinLobby.userName, playerId: generateRandomCode()};

    lobbyWithCode.players.push(player); //Add users to player array in lobby
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
    const lobbyWithCode: lobby = getLobby(getPlayers.lobbyCode);

    return lobbyWithCode.players;
  }

  startQuiz() {}

  kickPlayer(kickPlayer: { lobbyCode: string, playerId: string }) {
    const lobbyWithCode: lobby = getLobby(kickPlayer.lobbyCode);
    
    const playerIndex = lobbyWithCode.players.findIndex((player) => player.playerId === kickPlayer.playerId);

    lobbyWithCode.players.splice(playerIndex, 1);
  }
}
