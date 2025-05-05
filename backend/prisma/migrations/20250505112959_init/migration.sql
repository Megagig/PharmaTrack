-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PHARMACY', 'EXECUTIVE', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pharmacyId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pharmacies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pharmacistInCharge" TEXT NOT NULL,
    "pcnLicenseNumber" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "ward" TEXT NOT NULL,
    "lga" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pharmacies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "patientsServed" INTEGER NOT NULL,
    "maleCount" INTEGER,
    "femaleCount" INTEGER,
    "childrenCount" INTEGER,
    "adultCount" INTEGER,
    "elderlyCount" INTEGER,
    "topMedications" TEXT[],
    "commonAilments" TEXT[],
    "adverseDrugReactions" INTEGER NOT NULL,
    "adverseReactionDetails" TEXT,
    "referralsMade" INTEGER NOT NULL,
    "immunizationsGiven" INTEGER,
    "healthEducationSessions" INTEGER,
    "bpChecks" INTEGER,
    "expiredDrugs" BOOLEAN,
    "stockouts" BOOLEAN,
    "supplyDelays" BOOLEAN,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pharmacyId" TEXT NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pharmacies_pcnLicenseNumber_key" ON "pharmacies"("pcnLicenseNumber");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "pharmacies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "pharmacies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
