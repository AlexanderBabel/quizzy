import { Module } from '@nestjs/common';
import { GoogleStrategy } from './google/google.strategy';
import { ConfigModule } from '@nestjs/config';
import { CreatorJwtStrategy } from './creator/creator.jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
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
  providers: [GoogleStrategy, CreatorJwtStrategy],
})
export class AuthModule {}
