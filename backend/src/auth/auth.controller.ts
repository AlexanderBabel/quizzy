import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreatorModelService } from 'src/model/creator.model.service';
import { GoogleAuthGuard } from './google/google.guard';
import { JwtAuthType } from './jwt/jwt.enum';
import { OAuth2Client } from 'google-auth-library';

@Controller('v1/auth')
export class AuthController {
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly creatorModelService: CreatorModelService,
    private readonly jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
  }

  @Get('callback/google')
  @UseGuards(GoogleAuthGuard)
  async login(@Req() req): Promise<{ accessToken: string }> {
    const data = {
      email: req.user.email,
      name: req.user.firstName + ' ' + req.user.lastName,
    };

    const creator = await this.creatorModelService.createOrUpdateCreator({
      where: { externalId: req.user.id },
      create: {
        externalId: req.user.id,
        ...data,
      },
      update: data,
    });

    return {
      accessToken: this.jwtService.sign({
        id: creator.id,
        email: creator.email,
        name: creator.name,
        type: JwtAuthType.Creator,
      }),
    };
  }

  @Post('login')
  async loginWithJwt(
    @Body('token', new ValidationPipe()) token: string,
  ): Promise<{ accessToken: string }> {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const data = {
      email: payload.email,
      name: payload.given_name + ' ' + payload.family_name,
    };

    const creator = await this.creatorModelService.createOrUpdateCreator({
      where: { externalId: payload.sub },
      create: {
        externalId: payload.sub,
        ...data,
      },
      update: data,
    });

    return {
      accessToken: this.jwtService.sign({
        id: creator.id,
        email: creator.email,
        name: creator.name,
        type: JwtAuthType.Creator,
      }),
    };
  }
}
