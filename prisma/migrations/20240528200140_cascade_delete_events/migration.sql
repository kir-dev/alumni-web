-- DropForeignKey
ALTER TABLE "EventApplication" DROP CONSTRAINT "EventApplication_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventApplication" DROP CONSTRAINT "EventApplication_userId_fkey";

-- AddForeignKey
ALTER TABLE "EventApplication" ADD CONSTRAINT "EventApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventApplication" ADD CONSTRAINT "EventApplication_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
