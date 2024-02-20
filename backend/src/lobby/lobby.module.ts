import { Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { ModelModule } from 'src/model/model.module';
import { LobbyGateway } from './lobby.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { GameModule } from 'src/game/game.module';

@Module({
  providers: [LobbyService, LobbyGateway],
  imports: [ModelModule, AuthModule, GameModule],
})
export class LobbyModule {}
