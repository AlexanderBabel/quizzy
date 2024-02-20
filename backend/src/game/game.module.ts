// game.module.ts
import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { ModelModule } from 'src/model/model.module';
import { GameGateway } from './game.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [GameService, GameGateway],
  imports: [ModelModule, AuthModule],
  exports: [GameService],
})
export class GameModule {}
