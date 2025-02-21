/*
  Warnings:

  - A unique constraint covering the columns `[publicKey]` on the table `Counter` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicKey` to the `Counter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Counter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Counter" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "publicKey" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Counter_publicKey_key" ON "Counter"("publicKey");
