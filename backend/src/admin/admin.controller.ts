import {
  Controller,
  Post,
  Get,
  Body,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreatorModelService } from 'src/model/creator.model.service';
import { QuizModelService } from 'src/model/quiz.model.service';
import { Creator, QuizReport } from '@prisma/client';
import { Roles } from 'src/auth/jwt/decorators/roles.decorator';
import { Role } from 'src/auth/jwt/enums/roles.enum';

@Controller('v1/admin')
export class AdminController {
  constructor(
    private readonly creatorModelService: CreatorModelService,
    private readonly quizModelService: QuizModelService,
  ) {}

  @Roles(Role.Admin)
  @Post('block')
  async blockUser(
    @Body('creatorId', new ParseIntPipe()) creatorId: number,
  ): Promise<{ success: boolean }> {
    const success = await this.creatorModelService.changeBlockedState(
      creatorId,
      true,
    );
    return { success };
  }

  @Roles(Role.Admin)
  @Post('unblock')
  async unblockUser(
    @Body('creatorId', new ParseIntPipe()) creatorId: number,
  ): Promise<{ success: boolean }> {
    const success = await this.creatorModelService.changeBlockedState(
      creatorId,
      false,
    );
    return { success };
  }

  @Roles(Role.Admin)
  @Get('reports')
  async getAllReports(): Promise<QuizReport[]> {
    return this.quizModelService.reports({});
  }

  @Roles(Role.Admin)
  @Delete('report/:id/delete')
  async deleteReport(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<{ success: boolean }> {
    const deleteResult = await this.quizModelService.deleteReport({
      where: { id },
    });
    return { success: !!deleteResult };
  }

  @Roles(Role.Admin)
  @Get('creator/:creatorId')
  async getCreator(
    @Param('creatorId', new ParseIntPipe()) id: number,
  ): Promise<Creator> {
    return this.creatorModelService.creator({ id });
  }
}
