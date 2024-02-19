import { Controller, Post, Get, Body, Delete } from '@nestjs/common';
import { CreatorModelService } from 'src/model/creator.model.service';
import { QuizModelService } from 'src/model/quiz.model.service';
import { QuizReport } from '@prisma/client';
import { Roles } from 'src/auth/jwt/decorators/roles.decorator';
import { Role } from 'src/auth/jwt/enums/roles.enum';

@Controller('v1/admin')
export class AdminController {
  constructor(
    private readonly creatorModelService: CreatorModelService,
    private readonly quizModelService: QuizModelService,
  ) {}

  @Post('block')
  @Roles(Role.Admin)
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
  async getAllReports(): Promise<QuizReport[]> {
    return this.quizModelService.reports({});
  }

  @Delete('report/:id/delete')
  @Roles(Role.Admin)
  async deleteReport(@Body('id') id: number): Promise<{ success: boolean }> {
    const deleteResult = await this.quizModelService.deleteReport({
      where: { id },
    });
    return { success: !!deleteResult };
  }
}
