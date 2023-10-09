-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ban" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reasonBan" TEXT;
