-- CreateTable
CREATE TABLE "Students" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "classroomId" TEXT NOT NULL,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAnalytics" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "quizzesTaken" INTEGER NOT NULL DEFAULT 0,
    "averageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "highestScore" INTEGER NOT NULL DEFAULT 0,
    "lowestScore" INTEGER NOT NULL DEFAULT 0,
    "totalTimeSpent" INTEGER NOT NULL DEFAULT 0,
    "accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "StudentAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "habitat" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassAnalytics" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "totalStudents" INTEGER NOT NULL,
    "quizzesCreated" INTEGER NOT NULL,
    "quizzesCompleted" INTEGER NOT NULL,
    "averageScore" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ClassAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionAnalytics" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "questionIndex" INTEGER NOT NULL,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "wrongCount" INTEGER NOT NULL DEFAULT 0,
    "skippedCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "QuestionAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizAnalytics" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "averageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "highestScore" INTEGER NOT NULL DEFAULT 0,
    "lowestScore" INTEGER NOT NULL DEFAULT 0,
    "averageDuration" INTEGER NOT NULL DEFAULT 0,
    "completionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "QuizAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "score" INTEGER NOT NULL,
    "totalItems" INTEGER NOT NULL,
    "durationSec" INTEGER NOT NULL,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadedFile" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "summary" TEXT,
    "pptUrl" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UploadedFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Students_email_key" ON "Students"("email");

-- CreateIndex
CREATE INDEX "Students_id_idx" ON "Students"("id");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAnalytics_studentId_key" ON "StudentAnalytics"("studentId");

-- CreateIndex
CREATE INDEX "Class_id_idx" ON "Class"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ClassAnalytics_classId_key" ON "ClassAnalytics"("classId");

-- CreateIndex
CREATE INDEX "Quiz_id_idx" ON "Quiz"("id");

-- CreateIndex
CREATE INDEX "Quiz_teacherId_idx" ON "Quiz"("teacherId");

-- CreateIndex
CREATE INDEX "Quiz_classId_idx" ON "Quiz"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionAnalytics_quizId_questionIndex_key" ON "QuestionAnalytics"("quizId", "questionIndex");

-- CreateIndex
CREATE UNIQUE INDEX "QuizAnalytics_quizId_key" ON "QuizAnalytics"("quizId");

-- CreateIndex
CREATE INDEX "QuizAttempt_quizId_idx" ON "QuizAttempt"("quizId");

-- CreateIndex
CREATE INDEX "QuizAttempt_studentId_idx" ON "QuizAttempt"("studentId");

-- CreateIndex
CREATE INDEX "UploadedFile_id_idx" ON "UploadedFile"("id");

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAnalytics" ADD CONSTRAINT "StudentAnalytics_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassAnalytics" ADD CONSTRAINT "ClassAnalytics_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnalytics" ADD CONSTRAINT "QuestionAnalytics_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAnalytics" ADD CONSTRAINT "QuizAnalytics_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedFile" ADD CONSTRAINT "UploadedFile_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
