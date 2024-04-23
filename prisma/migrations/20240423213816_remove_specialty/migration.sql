/*
  Warnings:

  - You are about to drop the column `specialty` on the `StaticSite` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StaticSite" DROP COLUMN "specialty";

-- DropEnum
DROP TYPE "SiteSpecialty";
