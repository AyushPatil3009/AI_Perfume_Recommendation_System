-- AlterTable: Safely add the columns if they do not exist
ALTER TABLE "perfumes" ADD COLUMN IF NOT EXISTS "season" TEXT;
ALTER TABLE "perfumes" ADD COLUMN IF NOT EXISTS "occasion" TEXT;
ALTER TABLE "perfumes" ADD COLUMN IF NOT EXISTS "intensity" TEXT;