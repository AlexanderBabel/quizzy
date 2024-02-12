import { Module } from '@nestjs/common';
import { LobbyController } from './lobby.controller';
import { LobbyService } from './lobby.service';
import { ModelModule } from 'src/model/model.module';

@Module({
  controllers: [LobbyController],
  providers: [LobbyService],
  imports: [ModelModule]
})
export class LobbyModule {}