-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "paymentTerms" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "taxId" TEXT,
ADD COLUMN     "zipCode" TEXT;
