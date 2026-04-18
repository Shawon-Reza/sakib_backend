/*
  Warnings:

  - You are about to drop the column `invoiceNumber` on the `invoices` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "invoices_invoiceNumber_key";

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "invoiceNumber";
