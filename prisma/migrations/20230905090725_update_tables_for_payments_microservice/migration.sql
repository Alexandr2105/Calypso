/*
  Warnings:

  - The primary key for the `Payments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dateOfPayments` on the `Payments` table. All the data in the column will be lost.
  - You are about to drop the column `endDateOfSubscription` on the `Payments` table. All the data in the column will be lost.
  - You are about to drop the column `paymentsType` on the `Payments` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionType` on the `Payments` table. All the data in the column will be lost.
  - Added the required column `createdAt` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentSystem` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Made the column `allDataPayment` on table `Payments` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('Stripe', 'Paypall');

-- AlterTable
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_pkey",
DROP COLUMN "dateOfPayments",
DROP COLUMN "endDateOfSubscription",
DROP COLUMN "paymentsType",
DROP COLUMN "subscriptionType",
ADD COLUMN     "allDataPaymentConfirm" JSONB,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "paymentSystem" "PaymentType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "allDataPayment" SET NOT NULL,
ALTER COLUMN "paymentStatus" DROP DEFAULT,
ADD CONSTRAINT "Payments_pkey" PRIMARY KEY ("paymentsId");

-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "quantity" INTEGER,
ADD COLUMN     "subscriptionTimeHours" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Subscriptions" (
    "userId" TEXT NOT NULL,
    "paymentsId" TEXT NOT NULL,
    "dateOfPayments" TIMESTAMP(3) NOT NULL,
    "endDateOfSubscription" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,
    "subscriptionType" "AccountType" NOT NULL,
    "paymentsType" "PaymentStatus" NOT NULL,

    CONSTRAINT "Subscriptions_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscriptions_paymentsId_key" ON "Subscriptions"("paymentsId");
