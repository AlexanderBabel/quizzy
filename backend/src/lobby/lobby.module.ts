import { Module } from '@nestjs/common';
import { LobbyController } from './lobby.controller';
import { LobbyService } from './lobby.service';
import { ModelModule } from 'src/model/model.module';
import { LobbyGateway } from './lobby.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [LobbyController],
  providers: [LobbyService, LobbyGateway],
  imports: [ModelModule, AuthModule],
})
export class LobbyModule {}
