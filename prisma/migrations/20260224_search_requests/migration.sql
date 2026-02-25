-- CreateEnum
CREATE TYPE "SearchRequestStatus" AS ENUM ('ACTIVE', 'MATCHED', 'CLOSED', 'EXPIRED');

-- CreateTable
CREATE TABLE "SearchRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "firstName" TEXT,
    "canton" TEXT NOT NULL,
    "city" TEXT,
    "rooms" DOUBLE PRECISION,
    "maxBudget" DECIMAL(65,30),
    "description" TEXT,
    "moveInDate" TIMESTAMP(3),
    "status" "SearchRequestStatus" NOT NULL DEFAULT 'ACTIVE',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "responseCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SearchRequest_canton_status_idx" ON "SearchRequest"("canton", "status");

-- CreateIndex
CREATE INDEX "SearchRequest_status_expiresAt_idx" ON "SearchRequest"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "SearchRequest_email_idx" ON "SearchRequest"("email");
