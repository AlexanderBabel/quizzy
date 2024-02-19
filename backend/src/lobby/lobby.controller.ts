import { Controller, Post, Get, Body } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { IsPublic } from 'src/auth/jwt/decorators/public.decorator';
import { Roles } from 'src/auth/jwt/decorators/roles.decorator';
import { GameRole, Role } from 'src/auth/jwt/enums/roles.enum';

@Controller('v1/lobby')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @IsPublic()
  @Post('join')
  joinLobby(@Body() joinLobby: { lobbyCode: string; userName: string }) {
    return this.lobbyService.joinLobby(joinLobby);
  }

  @IsPublic()
  @Post('create')
  createLobby(@Body() createLobby: { quizId: string }) {
    return this.lobbyService.createLobby(createLobby);
  }

  @Roles(GameRole.Host, GameRole.Player)
  @Get('players')
  getPlayers(@Body() getPlayers: { lobbyCode: string }) {
    return this.lobbyService.getPlayers(getPlayers);
  }

  @Roles(GameRole.Host)
  @Get('start')
  startQuiz() {
    return this.lobbyService.startQuiz();
  }

  @Roles(GameRole.Host)
  @Post('kick')
  kickPlayer(@Body() kickPlayer: { lobbyCode: string; playerId: string }) {
    return this.lobbyService.kickPlayer(kickPlayer);
  }
}
