import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { JoinLobbyDto } from './dtos/join.lobby.dto';
import { LobbyService } from './lobby.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    allowedHeaders: ['Authorization'],
    credentials: true,
  },
})
export class LobbyGateway {
  constructor(private readonly lobbyService: LobbyService) {}

  @WebSocketServer()
  private server: Server;

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @SubscribeMessage('joinLobby')
  async joinLobby(client: Socket, payload: JoinLobbyDto): string {
    const lobby = await this.lobbyService.getLobby(payload.lobbyCode);
    if (!lobby) {
      return 'Lobby not found';
    }

    this.lobbyService.joinLobby({
      lobbyCode: payload.lobbyCode,
      userName: payload.userName,
      playerId: client['user'].id,
      playerType: client['user'].authType,
    });

    this.server
      .to(lobby.id)
      .emit('playerJoined', client['user'].userName);

    console.log('joinLobby', payload, client['user']);
    return 'Hello world!';
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('leaveLobby')
  leaveLobby(client: Socket, room: string) {
    console.log('leave room', room);
    client.leave(room);
  }

  //   @IsPublic()
  //   @Post('create')
  //   createLobby(@Body() createLobby: { quizId: string }) {
  //     return this.lobbyService.createLobby(createLobby);
  //   }

  //   @Roles(GameRole.Host, GameRole.Player)
  //   @Get('players')
  //   getPlayers(@Body() getPlayers: { lobbyCode: string }) {
  //     return this.lobbyService.getPlayers(getPlayers);
  //   }

  //   @Roles(GameRole.Host)
  //   @Get('start')
  //   startQuiz() {
  //     return this.lobbyService.startQuiz();
  //   }

  //   @Roles(GameRole.Host)
  //   @Post('kick')
  //   kickPlayer(@Body() kickPlayer: { lobbyCode: string; playerId: string }) {
  //     return this.lobbyService.kickPlayer(kickPlayer);
  //   }
}
