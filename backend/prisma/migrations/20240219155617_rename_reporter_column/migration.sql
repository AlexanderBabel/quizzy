/*
  Warnings:

  - You are about to drop the column `creatorId` on the `QuizReport` table. All the data in the column will be lost.
  - Added the required column `reporterId` to the `QuizReport` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QuizReport" DROP CONSTRAINT "QuizReport_creatorId_fkey";

-- AlterTable
ALTER TABLE "QuizReport" DROP COLUMN "creatorId",
ADD COLUMN     "reporterId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "QuizReport" ADD CONSTRAINT "QuizReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "Creator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
