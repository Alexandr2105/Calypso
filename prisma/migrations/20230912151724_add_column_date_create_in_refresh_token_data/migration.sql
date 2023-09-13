-- AlterTable
ALTER TABLE "RefreshTokenData" ADD COLUMN     "dateCreate" TIMESTAMP(3) NOT NULL DEFAULT now();
