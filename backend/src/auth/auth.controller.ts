import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreatorModelService } from 'src/model/creator.model.service';
import { JwtAuthType } from './jwt/enums/jwt.enum';
import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { IsPublic } from './jwt/decorators/public.decorator';
import { LoginDto } from './dtos/login.dto';

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

  @IsPublic()
  @Post('login')
  async loginWithJwt(
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string }> {
    let ticket: LoginTicket;
    try {
      ticket = await this.googleClient.verifyIdToken({
        idToken: loginDto.token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }

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
