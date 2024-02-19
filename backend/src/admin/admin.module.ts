import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ModelModule } from 'src/model/model.module';

@Module({
  controllers: [AdminController],
  providers: [],
  imports: [ModelModule],
})
export class AdminModule {}
