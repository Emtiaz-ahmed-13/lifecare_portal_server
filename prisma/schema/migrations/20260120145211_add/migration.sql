/*
  Warnings:

  - You are about to drop the column `UserNeedPasswordChange` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `patients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "needPasswordChange" "UserNeedPasswordChange" NOT NULL DEFAULT 'TRUE',
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "doctors" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "UserNeedPasswordChange",
DROP COLUMN "role",
ALTER COLUMN "updatedAt" DROP DEFAULT;
