-- AlterTable
ALTER TABLE "Variation" ADD COLUMN     "about" JSONB NOT NULL DEFAULT E'[{"type":"paragraph","children":[{"text":""}]}]';
