/*
  Warnings:

  - Added the required column `siteId` to the `SiteBlock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SiteBlock" ADD COLUMN     "siteId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SiteBlock" ADD CONSTRAINT "SiteBlock_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "StaticSite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
