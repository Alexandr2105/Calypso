/*
  Warnings:

  - You are about to alter the column `price` on the `Products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(6,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Products" ALTER COLUMN "price" SET DATA TYPE INTEGER;
