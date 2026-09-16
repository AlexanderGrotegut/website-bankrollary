ALTER TABLE "Session"
  ADD COLUMN "gameCategoryName" TEXT,
  ADD COLUMN "platformName" TEXT;

UPDATE "Session" AS session
SET "gameCategoryName" = category."name"
FROM "GameCategory" AS category
WHERE session."gameCategoryId" = category."id";

UPDATE "Session" AS session
SET "platformName" = platform."name"
FROM "Platform" AS platform
WHERE session."platformId" = platform."id";

ALTER TABLE "Session"
  ALTER COLUMN "gameCategoryName" SET NOT NULL,
  ALTER COLUMN "platformName" SET NOT NULL,
  ALTER COLUMN "gameCategoryId" DROP NOT NULL,
  ALTER COLUMN "platformId" DROP NOT NULL;

ALTER TABLE "Session"
  DROP CONSTRAINT "Session_gameCategoryId_fkey",
  DROP CONSTRAINT "Session_platformId_fkey";

ALTER TABLE "Session"
  ADD CONSTRAINT "Session_gameCategoryId_fkey"
  FOREIGN KEY ("gameCategoryId") REFERENCES "GameCategory"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Session"
  ADD CONSTRAINT "Session_platformId_fkey"
  FOREIGN KEY ("platformId") REFERENCES "Platform"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

DELETE FROM "GameCategory" WHERE "archivedAt" IS NOT NULL;
DELETE FROM "Platform" WHERE "archivedAt" IS NOT NULL;
