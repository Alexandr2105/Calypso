/*
  Warnings:

  - You are about to drop the column `allDataPayments` on the `Payments` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'Success', 'Declined', 'Canceled');

-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "allDataPayments",
ADD COLUMN     "allDataPayment" JSONB,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'Pending';
