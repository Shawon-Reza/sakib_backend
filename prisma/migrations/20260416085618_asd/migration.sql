/*
  Warnings:

  - You are about to drop the column `statuse` on the `customers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "customers" DROP COLUMN "statuse",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;
