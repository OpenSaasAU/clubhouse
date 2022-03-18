-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "canManageProducts" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
