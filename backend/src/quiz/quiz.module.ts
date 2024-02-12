import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './quiz.controller';
import { ModelModule } from 'src/model/model.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ModelModule,
  ],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
