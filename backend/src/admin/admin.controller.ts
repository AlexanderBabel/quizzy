import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Report } from './domain/report.entity';
import { Role } from 'src/auth/roles/roles.enum';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';

@Controller('v1/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('block')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async blockUser(
    @Body('userId') userId: string,
  ): Promise<{ success: boolean }> {
    const success = await this.adminService.blockUser(userId);
    return { success };
  }

  @Get('reports')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async getAllReports(): Promise<Report[]> {
    return this.adminService.getAllReports();
  }
}
