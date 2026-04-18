/*
  Warnings:

  - Added the required column `billNo` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "billNo" TEXT NOT NULL;
