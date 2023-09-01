/*
  Warnings:

  - You are about to drop the column `githubAuth` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `googleAuth` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" RENAME COLUMN "githubAuth" TO "githubAuthId";
ALTER TABLE "User" RENAME COLUMN "googleAuth" TO "googleAuthId";
