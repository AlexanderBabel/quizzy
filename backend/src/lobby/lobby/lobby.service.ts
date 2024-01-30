import { Injectable } from '@nestjs/common';

@Injectable()
export class LobbyService {
  private lobbies = {};

  joinLobby(joinLobby: { lobbyCode: string; userName: string }) {
  }

  createLobby(createLobby: { quizId: string }) {
  }

  getPlayers() {
  }

  startQuiz() {
  }

  kickPlayer(kickPlayer: { playerId: string }) {
    
  }
}
