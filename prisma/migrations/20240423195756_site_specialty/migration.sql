/*
  Warnings:

  - The values [Testimonial] on the enum `SiteBlockType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "SiteSpecialty" AS ENUM ('Home', 'Impressum', 'PrivacyPolicy');

-- AlterEnum
BEGIN;
CREATE TYPE "SiteBlockType_new" AS ENUM ('Text', 'Image', 'ImageText');
ALTER TABLE "SiteBlock" ALTER COLUMN "type" TYPE "SiteBlockType_new" USING ("type"::text::"SiteBlockType_new");
ALTER TYPE "SiteBlockType" RENAME TO "SiteBlockType_old";
ALTER TYPE "SiteBlockType_new" RENAME TO "SiteBlockType";
DROP TYPE "SiteBlockType_old";
COMMIT;

-- AlterTable
ALTER TABLE "StaticSite" ADD COLUMN     "specialty" "SiteSpecialty";
