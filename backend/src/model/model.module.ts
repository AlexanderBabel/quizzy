import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreatorService } from './creator.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [CreatorService, PrismaService],
  exports: [CreatorService],
})
export class ModelModule {}
