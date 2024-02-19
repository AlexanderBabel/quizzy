import { Controller, Post, Get, Body, Param, HttpStatus, HttpCode } from '@nestjs/common';
import { GameService } from './game.service';
import { GameState } from './domain/gameState.entity';


@Controller('v1/game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('ready')
  async ready(@Body('lobbyCode') lobbyCode: string): Promise<GameState | null> {
    const response = await this.gameService.getGameState(lobbyCode);
    return response;
  }


  @Post('gameState')
  async gameState(@Body('lobbyCode') lobbyCode: string, @Body('status') status: string, @Body('round') round: number): Promise<{ success: boolean }> {
    const success = await this.gameService.setGameState(lobbyCode, status, round);
    return { success };
  }

  @Post('nextRound')
  @HttpCode(HttpStatus.NO_CONTENT)
  async nextRound(@Body('lobbyCode') lobbyCode: string): Promise<{ success: boolean }> {
    const success = await this.gameService.nextRound(lobbyCode);
    return { success: true };
  }

}
