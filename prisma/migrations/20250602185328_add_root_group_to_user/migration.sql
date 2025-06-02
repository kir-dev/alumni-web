-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rootGroupId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rootGroupId_fkey" FOREIGN KEY ("rootGroupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
