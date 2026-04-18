/*
  Warnings:

  - The values [DRAFT,SENT,OVERDUE,CANCELLED] on the enum `InvoiceStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdAt` on the `invoice_items` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `invoice_items` table. All the data in the column will be lost.
  - You are about to alter the column `quantity` on the `invoice_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,3)` to `DoublePrecision`.
  - You are about to alter the column `rate` on the `invoice_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `DoublePrecision`.
  - You are about to alter the column `amount` on the `invoice_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `DoublePrecision`.
  - You are about to drop the column `billNo` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `customerAddress` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `customerPhone` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `grossTotal` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceDate` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `netDue` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `previousDue` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `productsTotal` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `referenceInvoiceId` on the `invoices` table. All the data in the column will be lost.
  - You are about to alter the column `receivedAmount` on the `invoices` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `DoublePrecision`.
  - A unique constraint covering the columns `[invoiceNumber]` on the table `invoices` will be added. If there are existing duplicate values, this will fail.
  - The required column `invoiceNumber` was added to the `invoices` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `phoneNumber` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InvoiceStatus_new" AS ENUM ('PAID', 'PARTIAL', 'DUE');
ALTER TABLE "public"."invoices" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "invoices" ALTER COLUMN "status" TYPE "InvoiceStatus_new" USING ("status"::text::"InvoiceStatus_new");
ALTER TYPE "InvoiceStatus" RENAME TO "InvoiceStatus_old";
ALTER TYPE "InvoiceStatus_new" RENAME TO "InvoiceStatus";
DROP TYPE "public"."InvoiceStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_referenceInvoiceId_fkey";

-- DropIndex
DROP INDEX "invoices_billNo_key";

-- DropIndex
DROP INDEX "invoices_referenceInvoiceId_idx";

-- AlterTable
ALTER TABLE "invoice_items" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "rate" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "billNo",
DROP COLUMN "customerAddress",
DROP COLUMN "customerPhone",
DROP COLUMN "grossTotal",
DROP COLUMN "invoiceDate",
DROP COLUMN "netDue",
DROP COLUMN "previousDue",
DROP COLUMN "productsTotal",
DROP COLUMN "referenceInvoiceId",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "dueAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "invoiceNumber" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "receivedAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "status" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber");
