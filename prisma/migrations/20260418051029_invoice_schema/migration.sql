/*
  Warnings:

  - You are about to drop the column `address` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `invoices` table. All the data in the column will be lost.
  - Added the required column `customerPhone` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "address",
DROP COLUMN "phoneNumber",
ADD COLUMN     "customerAddress" TEXT,
ADD COLUMN     "customerPhone" TEXT NOT NULL;
