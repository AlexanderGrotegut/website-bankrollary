CREATE TYPE "GameType" AS ENUM (
  'POKER',
  'SPORTS_BETTING',
  'CASINO',
  'BLACKJACK',
  'ROULETTE',
  'SLOTS'
);

CREATE TYPE "TransactionType" AS ENUM (
  'STARTING_BALANCE',
  'DEPOSIT',
  'WITHDRAWAL'
);

CREATE TABLE "RateLimitEntry" (
  "key" TEXT NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 1,
  "windowStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RateLimitEntry_pkey" PRIMARY KEY ("key")
);

CREATE TABLE "UserSettings" (
  "userId" TEXT NOT NULL,
  "defaultCurrency" CHAR(3) NOT NULL DEFAULT 'EUR',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("userId")
);

CREATE TABLE "Platform" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "archivedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Session" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" "GameType" NOT NULL,
  "platformId" TEXT NOT NULL,
  "currency" CHAR(3) NOT NULL,
  "startedAt" TIMESTAMP(3) NOT NULL,
  "endedAt" TIMESTAMP(3),
  "buyIn" DECIMAL(14,2) NOT NULL,
  "cashOut" DECIMAL(14,2),
  "notes" VARCHAR(500),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BankrollTransaction" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" "TransactionType" NOT NULL,
  "amount" DECIMAL(14,2) NOT NULL,
  "currency" CHAR(3) NOT NULL,
  "note" VARCHAR(200),
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BankrollTransaction_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Platform_userId_name_key" ON "Platform"("userId", "name");
CREATE INDEX "Platform_userId_archivedAt_idx" ON "Platform"("userId", "archivedAt");
CREATE INDEX "Session_userId_startedAt_idx" ON "Session"("userId", "startedAt");
CREATE INDEX "Session_userId_currency_idx" ON "Session"("userId", "currency");
CREATE INDEX "Session_platformId_idx" ON "Session"("platformId");
CREATE INDEX "BankrollTransaction_userId_occurredAt_idx" ON "BankrollTransaction"("userId", "occurredAt");
CREATE INDEX "BankrollTransaction_userId_currency_idx" ON "BankrollTransaction"("userId", "currency");

ALTER TABLE "Session"
  ADD CONSTRAINT "Session_platformId_fkey"
  FOREIGN KEY ("platformId") REFERENCES "Platform"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- The application accesses these tables only through authenticated server
-- actions and Prisma. Deny direct Data API access by enabling RLS without
-- public anon/authenticated policies.
ALTER TABLE "RateLimitEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Platform" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BankrollTransaction" ENABLE ROW LEVEL SECURITY;
