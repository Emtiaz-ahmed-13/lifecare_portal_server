-- CreateEnum
CREATE TYPE "UserNeedPasswordChange" AS ENUM ('TRUE', 'FALSE');

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "UserNeedPasswordChange" BOOLEAN NOT NULL DEFAULT true;
