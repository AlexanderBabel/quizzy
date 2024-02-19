import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { Roles } from 'src/auth/jwt/decorators/roles.decorator';
import { GameRole } from 'src/auth/jwt/enums/roles.enum';

@Controller('v1/lobby')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Post('join')
  joinLobby(
    @Req() req,
    @Body() joinLobby: { lobbyCode: string; userName: string },
  ) {
    return this.lobbyService.joinLobby({
      lobbyCode: joinLobby.lobbyCode,
      userName: joinLobby.userName,
      playerId: req.user.id,
      playerType: req.user.authType,
    });
  }

  @Post('create')
  createLobby(@Req() req, @Body() createLobby: { quizId: string }) {
    return this.lobbyService.createLobby({
      quizId: createLobby.quizId,
      hostId: req.user.id,
      hostType: req.user.authType,
    });
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
