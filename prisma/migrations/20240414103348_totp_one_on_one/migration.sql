/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `TfaToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TfaToken_userId_key" ON "TfaToken"("userId");
