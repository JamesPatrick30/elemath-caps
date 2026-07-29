/*
  Warnings:

  - You are about to drop the column `content` on the `lessons` table. All the data in the column will be lost.
  - Added the required column `pdfUrl` to the `lessons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questions` to the `lessons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "content",
ADD COLUMN     "pdfUrl" TEXT NOT NULL,
ADD COLUMN     "questions" JSONB NOT NULL,
ADD COLUMN     "summary" TEXT;
