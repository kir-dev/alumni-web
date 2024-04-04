/*
  Warnings:

  - Added the required column `groupId` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "News" ADD COLUMN     "groupId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
