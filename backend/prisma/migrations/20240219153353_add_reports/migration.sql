-- CreateTable
CREATE TABLE "QuizReport" (
    "id" SERIAL NOT NULL,
    "quizId" INTEGER NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuizReport" ADD CONSTRAINT "QuizReport_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizReport" ADD CONSTRAINT "QuizReport_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
