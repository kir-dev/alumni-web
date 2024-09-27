-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "enableEventNotification" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enableGroupNotification" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enableNewsNotification" BOOLEAN NOT NULL DEFAULT true;
