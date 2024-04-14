-- DropForeignKey
ALTER TABLE "SiteBlock" DROP CONSTRAINT "SiteBlock_siteId_fkey";

-- AddForeignKey
ALTER TABLE "SiteBlock" ADD CONSTRAINT "SiteBlock_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "StaticSite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
