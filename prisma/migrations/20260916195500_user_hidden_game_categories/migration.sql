CREATE TABLE "HiddenGameCategory" (
  "userId" TEXT NOT NULL,
  "gameCategoryId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "HiddenGameCategory_pkey" PRIMARY KEY ("userId", "gameCategoryId")
);

CREATE INDEX "HiddenGameCategory_gameCategoryId_idx"
  ON "HiddenGameCategory"("gameCategoryId");

ALTER TABLE "HiddenGameCategory"
  ADD CONSTRAINT "HiddenGameCategory_gameCategoryId_fkey"
  FOREIGN KEY ("gameCategoryId") REFERENCES "GameCategory"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "HiddenGameCategory" ENABLE ROW LEVEL SECURITY;
