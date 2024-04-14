/*
  Warnings:

  - You are about to drop the column `siteId` on the `SiteBlock` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SiteBlock" DROP CONSTRAINT "SiteBlock_siteId_fkey";

-- AlterTable
ALTER TABLE "SiteBlock" DROP COLUMN "siteId";
