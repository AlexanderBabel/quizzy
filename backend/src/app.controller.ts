import { Controller, Get, Req } from '@nestjs/common';

@Controller('v1')
export class AppController {
  @Get('info')
  async login(@Req() req): Promise<any> {
    return {
      id: req.user?.id,
      email: req.user?.email,
      name: req.user?.name,
    };
  }
}
