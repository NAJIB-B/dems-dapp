/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Member` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Member_estateId_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Member_id_key" ON "Member"("id");
