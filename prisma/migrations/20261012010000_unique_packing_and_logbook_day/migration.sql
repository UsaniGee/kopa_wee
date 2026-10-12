-- One default packing list per user and one logbook entry per user per day.
-- Remove existing duplicates first (keep the oldest row) so the unique indexes can be created.
-- Logbook duplicates could only come from the old screen, which always posted the same fixed text.

DELETE FROM "PackingItem" p
USING "PackingItem" q
WHERE p."userId" = q."userId" AND p."name" = q."name"
  AND (p."createdAt", p."id") > (q."createdAt", q."id");

DELETE FROM "PPALogbookEntry" p
USING "PPALogbookEntry" q
WHERE p."userId" = q."userId" AND p."date" = q."date"
  AND (p."createdAt", p."id") > (q."createdAt", q."id");

-- DropIndex
DROP INDEX "PPALogbookEntry_userId_date_idx";

-- CreateIndex
CREATE UNIQUE INDEX "PackingItem_userId_name_key" ON "PackingItem"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "PPALogbookEntry_userId_date_key" ON "PPALogbookEntry"("userId", "date");
