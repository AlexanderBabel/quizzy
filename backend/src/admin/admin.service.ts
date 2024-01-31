import { Injectable } from '@nestjs/common';
import { Report } from './domain/report.entity';


@Injectable()
export class AdminService {
  blockUser(userId: string): boolean {
    try {
        //TODO: Update database isBlocked for the userId
        if (userId === `31`) {
            return false;  
        }
        return true;
      } catch (error) {
        console.error(`User could not blocked: ${error.message}`);
        return false;
      }
  }

  getAllReports(): any[] {

    //TODO: Fetch the table

    const reports: Report[] = [];

    const report: Report = {
        reportId: `reportId1`,
        userId: `userId1`,
        quizId: `quizId1`,
        reason: `en slumpmässig orsak`,
      };

    reports.push(report);

    const report2: Report = {
        reportId: `reportId2`,
        userId: `userId2`,
        quizId: `quizId2`,
        reason: `en annan orsak`,
      };

    reports.push(report2);

    return reports;
  }
}