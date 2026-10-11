-- The camp checklist now lives in "PackingItem" (/api/packing-items).
-- "CampChecklist" was empty on the dev branch (a copy of production) when this was written.

-- DropForeignKey
ALTER TABLE "CampChecklist" DROP CONSTRAINT "CampChecklist_userId_fkey";

-- DropTable
DROP TABLE "CampChecklist";
