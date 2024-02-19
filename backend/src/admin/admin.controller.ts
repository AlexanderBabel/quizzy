import { Controller, Post, Get, Body, UseGuards, Delete } from '@nestjs/common';
import { Role } from 'src/auth/roles/roles.enum';
import { Roles } from 'src/auth/roles/roles.decorator';
import { CreatorModelService } from 'src/model/creator.model.service';
import { QuizModelService } from 'src/model/quiz.model.service';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { QuizReport } from '@prisma/client';

@Controller('v1/admin')
export class AdminController {
  constructor(
    private readonly creatorModelService: CreatorModelService,
    private readonly quizModelService: QuizModelService,
  ) {}

  @Post('block')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async blockUser(
    @Body('userId') userId: number,
  ): Promise<{ success: boolean }> {
    const success = await this.creatorModelService.changeBlockedState(
      userId,
      true,
    );
    return { success };
  }

  @Post('unblock')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async unblockUser(
    @Body('userId') userId: number,
  ): Promise<{ success: boolean }> {
    const success = await this.creatorModelService.changeBlockedState(
      userId,
      false,
    );
    return { success };
  }

  @Get('reports')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async getAllReports(): Promise<QuizReport[]> {
    return this.quizModelService.reports({});
  }

  @Delete('report/:id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async deleteReport(@Body('id') id: number): Promise<{ success: boolean }> {
    const deleteResult = await this.quizModelService.deleteReport({
      where: { id },
    });
    return { success: !!deleteResult };
  }
}
