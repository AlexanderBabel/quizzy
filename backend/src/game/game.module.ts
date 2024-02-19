// game.module.ts
import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { ModelModule } from 'src/model/model.module';
import { GameGateway } from './game.gateway';

@Module({
  controllers: [GameController],
  providers: [GameService, GameGateway],
  imports: [ModelModule],
})
export class GameModule {}
