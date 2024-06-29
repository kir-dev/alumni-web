-- CreateTable
CREATE TABLE "GroupDomain" (
    "domain" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupDomain_domain_key" ON "GroupDomain"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "GroupDomain_groupId_key" ON "GroupDomain"("groupId");

-- AddForeignKey
ALTER TABLE "GroupDomain" ADD CONSTRAINT "GroupDomain_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
