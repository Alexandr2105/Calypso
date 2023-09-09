/*
  Warnings:

  - Added the required column `theAmountOfHours` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscriptions" ADD COLUMN     "theAmountOfHours" INTEGER NOT NULL,
ALTER COLUMN "dateOfPayments" DROP NOT NULL,
ALTER COLUMN "endDateOfSubscription" DROP NOT NULL;
