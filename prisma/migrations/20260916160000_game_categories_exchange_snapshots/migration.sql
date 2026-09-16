CREATE TABLE "GameCategory" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "name" TEXT NOT NULL,
  "normalizedName" TEXT NOT NULL,
  "archivedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GameCategory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GameCategory_userId_normalizedName_key"
  ON "GameCategory"("userId", "normalizedName");
CREATE INDEX "GameCategory_userId_archivedAt_idx"
  ON "GameCategory"("userId", "archivedAt");

INSERT INTO "GameCategory"
  ("id", "userId", "name", "normalizedName", "archivedAt", "updatedAt")
VALUES
  ('builtin-poker', NULL, 'Poker', 'poker', NULL, CURRENT_TIMESTAMP),
  ('builtin-sports-betting', NULL, 'Sports Betting', 'sports betting', NULL, CURRENT_TIMESTAMP),
  ('builtin-blackjack', NULL, 'Blackjack', 'blackjack', NULL, CURRENT_TIMESTAMP),
  ('builtin-roulette', NULL, 'Roulette', 'roulette', NULL, CURRENT_TIMESTAMP),
  ('builtin-slots', NULL, 'Slots', 'slots', NULL, CURRENT_TIMESTAMP),
  ('builtin-stocks', NULL, 'Stocks', 'stocks', NULL, CURRENT_TIMESTAMP),
  ('legacy-casino', NULL, 'Casino', 'casino', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

ALTER TABLE "Session"
  ADD COLUMN "gameCategoryId" TEXT,
  ADD COLUMN "convertToDefaultCurrency" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "exchangeRate" DECIMAL(20,10),
  ADD COLUMN "exchangeRateDate" TIMESTAMP(3),
  ADD COLUMN "convertedCurrency" CHAR(3),
  ADD COLUMN "convertedBuyIn" DECIMAL(14,2),
  ADD COLUMN "convertedCashOut" DECIMAL(14,2),
  ADD COLUMN "convertedProfit" DECIMAL(14,2);

UPDATE "Session"
SET "gameCategoryId" = CASE "type"::text
  WHEN 'POKER' THEN 'builtin-poker'
  WHEN 'SPORTS_BETTING' THEN 'builtin-sports-betting'
  WHEN 'CASINO' THEN 'legacy-casino'
  WHEN 'BLACKJACK' THEN 'builtin-blackjack'
  WHEN 'ROULETTE' THEN 'builtin-roulette'
  WHEN 'SLOTS' THEN 'builtin-slots'
END;

ALTER TABLE "Session" ALTER COLUMN "gameCategoryId" SET NOT NULL;
CREATE INDEX "Session_gameCategoryId_idx" ON "Session"("gameCategoryId");
ALTER TABLE "Session"
  ADD CONSTRAINT "Session_gameCategoryId_fkey"
  FOREIGN KEY ("gameCategoryId") REFERENCES "GameCategory"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Session" DROP COLUMN "type";
DROP TYPE "GameType";

ALTER TABLE "GameCategory" ENABLE ROW LEVEL SECURITY;
