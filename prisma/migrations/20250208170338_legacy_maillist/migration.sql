-- AlterTable
ALTER TABLE "Group"
    ADD COLUMN "legacyMaillist" TEXT[] DEFAULT ARRAY []::TEXT[];
