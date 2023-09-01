/*
  Warnings:

  - You are about to drop the column `endDateOfSubscripion` on the `Payments` table. All the data in the column will be lost.
  - You are about to drop the column `subsripionType` on the `Payments` table. All the data in the column will be lost.
  - Added the required column `endDateOfSubscription` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subsriptionType` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "endDateOfSubscripion",
DROP COLUMN "subsripionType",
ADD COLUMN     "endDateOfSubscription" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "subsriptionType" TEXT NOT NULL;
