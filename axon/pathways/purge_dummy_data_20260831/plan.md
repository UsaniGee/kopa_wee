# Implementation Plan: Purge Mock Data & Dynamic Live User Flow (`purge_dummy_data_20260831`)

Execution roadmap for clearing stale mock arrays, adding Scandinavian empty state components, writing the Prisma database seed script, resetting the Neon PostgreSQL database, and verifying live user creation.

---

## Phase 1: Create Database Seeder (`prisma/seed.ts`) & Reset Neon DB

- [ ] Task: Create Prisma Database Seeder (`prisma/seed.ts`)
  - [ ] Implement seed script populating 4 realistic Corper accounts, 4 Lodges, 6 Marketplace items, and 4 Logbook entries
  - [ ] Configure `prisma.seed` command in `package.json`
- [ ] Task: Reset Live Neon PostgreSQL Database
  - [ ] Execute `npx prisma db push --force-reset` to establish pristine schema
  - [ ] Run `npx prisma db seed` to test seed script execution
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Refactor Frontend Modules to Pure Dynamic Data & Empty States

- [ ] Task: Refactor Accommodation Page (`src/app/dashboard/accommodation/page.tsx`)
  - [ ] Remove `SAMPLE_LODGES` fallback dependency
  - [ ] Add Scandinavian empty state card for empty search/filter queries
- [ ] Task: Refactor Marketplace Page (`src/app/dashboard/marketplace/page.tsx`)
  - [ ] Remove `SAMPLE_LISTINGS` fallback dependency
  - [ ] Add Scandinavian empty state card with "Post First Item" button
- [ ] Task: Refactor Workplace & Logbook Page (`src/app/dashboard/workplace/page.tsx`)
  - [ ] Fetch live attendance logs from `GET /api/workplace/logbook`
  - [ ] Add empty state banner when no attendance recorded today
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: End-to-End Build & Real User Flow Verification

- [ ] Task: End-to-End Build Verification (`npm run build`)
  - [ ] Verify 100% clean compilation of all 21 routes with zero TypeScript errors
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
