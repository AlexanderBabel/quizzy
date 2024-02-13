import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreatorModelService } from 'src/model/creator.model.service';
import { GoogleAuthGuard } from './google/google.guard';
import { JwtAuthType } from './jwt/jwt.enum';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly creatorModelService: CreatorModelService,
    private readonly jwtService: JwtService,
  ) {}

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
}
