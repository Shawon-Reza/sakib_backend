/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "referrer" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "customers_phone_key" ON "customers"("phone");
