/*
  Warnings:

  - You are about to drop the column `customerAddress` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `customerPhone` on the `invoices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "customerAddress",
DROP COLUMN "customerName",
DROP COLUMN "customerPhone";
