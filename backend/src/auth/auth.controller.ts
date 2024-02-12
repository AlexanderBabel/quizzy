import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreatorService } from 'src/model/creator.service';
import { GoogleAuthGuard } from './google/google.guard';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly creatorService: CreatorService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('callback/google')
  @UseGuards(GoogleAuthGuard)
  async login(@Req() req): Promise<{ accessToken: string }> {
    const data = {
      email: req.user.email,
      name: req.user.firstName + ' ' + req.user.lastName,
    };

    const creator = await this.creatorService.createOrUpdateCreator({
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
      }),
    };
  }
}
