# Implementation Plan: Purge Mock Data & Dynamic Live User Flow (`purge_dummy_data_20260831`)

Execution roadmap for clearing stale mock arrays, adding Scandinavian empty state components, writing the Prisma database seed script, resetting the Neon PostgreSQL database, and verifying live user creation.

---

## Phase 1: Create Database Seeder (`prisma/seed.ts`) & Reset Neon DB

- [x] Task: Create Prisma Database Seeder (`prisma/seed.ts`)
  - [x] Implement seed script populating 4 realistic Corper accounts, 4 Lodges, 6 Marketplace items, and 4 Logbook entries
  - [x] Configure `prisma.seed` command in `package.json`
- [x] Task: Reset Live Neon PostgreSQL Database
  - [x] Execute `npx prisma db push --force-reset` to establish pristine schema
  - [x] Run `npx prisma db seed` to test seed script execution
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Refactor Frontend Modules to Pure Dynamic Data & Empty States

- [x] Task: Refactor Accommodation Page (`src/app/dashboard/accommodation/page.tsx`)
  - [x] Remove `SAMPLE_LODGES` fallback dependency
  - [x] Add Scandinavian empty state card for empty search/filter queries
- [x] Task: Refactor Marketplace Page (`src/app/dashboard/marketplace/page.tsx`)
  - [x] Remove `SAMPLE_LISTINGS` fallback dependency
  - [x] Add Scandinavian empty state card with "Post First Item" button
- [x] Task: Refactor Workplace & Logbook Page (`src/app/dashboard/workplace/page.tsx`)
  - [x] Fetch live attendance logs from `GET /api/workplace/logbook`
  - [x] Add empty state banner when no attendance recorded today
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: End-to-End Build & Real User Flow Verification

- [x] Task: End-to-End Build Verification (`npm run build`)
  - [x] Verify 100% clean compilation of all 21 routes with zero TypeScript errors
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

