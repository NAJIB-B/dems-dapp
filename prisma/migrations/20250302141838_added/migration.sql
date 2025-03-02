/*
  Warnings:

  - Added the required column `vaultBalance` to the `Estate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Poll` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Estate" ADD COLUMN     "vaultBalance" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Poll" ADD COLUMN     "amount" INTEGER NOT NULL;
