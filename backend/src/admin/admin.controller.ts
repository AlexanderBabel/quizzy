import { Controller, Post, Get, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Report } from './domain/report.entity';

@Controller('v1/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('block')
  async blockUser(@Body('userId') userId: string): Promise<{ success: boolean }> {
    const success = await this.adminService.blockUser(userId);
    return { success };
  }

  @Get('reports')
  async getAllReports(): Promise<Report[]> {
    return this.adminService.getAllReports();
  }
}
