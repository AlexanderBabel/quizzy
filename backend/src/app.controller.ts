import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt/jwt.guard';

@Controller('v1')
export class AppController {
  @Get('info')
  @UseGuards(JwtAuthGuard)
  async login(@Req() req): Promise<any> {
    return {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    };
  }
}
