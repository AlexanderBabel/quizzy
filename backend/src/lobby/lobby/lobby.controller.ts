import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { LobbyService } from './lobby.service';

@Controller('v1/lobby')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Post('join')
  joinLobby(@Body() joinLobby: { lobbyCode: string; userName: string }) {
    return this.lobbyService.joinLobby(joinLobby);
  }

  @Post('create')
  createLobby(@Body() createLobby: { quizId: string }) {
    return this.lobbyService.createLobby(createLobby);
  }

  @Get('players')
  getPlayers() {
    return this.lobbyService.getPlayers();
  }

  @Get('start')
  startQuiz() {
    return this.lobbyService.startQuiz();
  }

  @Post('kick')
  kickPlayer(@Body() kickPlayer: { playerId: string }) {
    return this.lobbyService.kickPlayer(kickPlayer);
  }
}
