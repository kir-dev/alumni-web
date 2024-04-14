-- CreateEnum
CREATE TYPE "SiteBlockType" AS ENUM ('Text', 'Image', 'ImageText', 'Testimonial');

-- CreateTable
CREATE TABLE "StaticSite" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaticSite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteBlock" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "type" "SiteBlockType" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteBlock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SiteBlock" ADD CONSTRAINT "SiteBlock_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "StaticSite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
