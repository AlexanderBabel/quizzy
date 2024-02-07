import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('v1')
export class AppController {
  constructor() {}

  @Get('info')
  @UseGuards(AuthGuard('jwt'))
  async login(@Req() req): Promise<any> {
    return {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    };
  }
}
