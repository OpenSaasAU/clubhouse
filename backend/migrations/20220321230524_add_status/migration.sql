-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "status" TEXT DEFAULT E'active';

-- AlterTable
ALTER TABLE "Variation" ADD COLUMN     "status" TEXT DEFAULT E'active';
