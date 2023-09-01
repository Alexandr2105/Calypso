/*
  Warnings:

  - The `accountType` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('Personal', 'Business');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "accountType" SET DEFAULT 'Personal'::"AccountType";
ALTER TABLE "User" ALTER COLUMN "accountType" TYPE "AccountType" USING ("accountType"::"AccountType");
