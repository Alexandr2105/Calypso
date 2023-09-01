/*
  Warnings:

  - You are about to drop the column `subsriptionType` on the `Payments` table. All the data in the column will be lost.
  - Added the required column `subscriptionType` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "subsriptionType",
ADD COLUMN     "subscriptionType" TEXT NOT NULL;
