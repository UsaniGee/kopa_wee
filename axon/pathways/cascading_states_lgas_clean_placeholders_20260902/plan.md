# Implementation Plan: Cascading Backend States/LGAs & Clean Placeholders (`cascading_states_lgas_clean_placeholders_20260902`)

Execution roadmap for LGA database schema, seed data, API route handlers, and project-wide UI refactoring.

---

## Phase 1: Database Schema & Comprehensive LGAs Seed Data

- [x] Task: Update `prisma/schema.prisma`
  - [x] Add `LGA` model with relation to `State`
  - [x] Run `npx prisma db push` to update Neon PostgreSQL
- [x] Task: Create `src/shared/data/nigeriaStatesLgas.ts` Data Mapping
  - [x] Map all 36 Nigerian States + FCT and their 774 LGAs
- [x] Task: Create `GET /api/states` & `GET /api/lgas` Endpoint Handlers
  - [x] Auto-seed States and LGAs in Neon PostgreSQL if empty
  - [x] Return LGAs filtered by `stateId` or `stateName`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Refactor Marketplace Forms & Modals

- [x] Task: Refactor `PostItemModal` in `src/app/dashboard/marketplace/page.tsx`
  - [x] Implement Cascading State ➔ LGA ➔ Area ➔ Street selection
  - [x] Start State select at `Select State...` (no default "Lagos")
  - [x] Start LGA select at `Select LGA...` (disabled until State is chosen)
  - [x] Use generic placeholder `Enter area / neighborhood...` and `Enter street / landmark...`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: Refactor Accommodation & Roommate Modals

- [x] Task: Refactor `PostLodgeModal` in `src/app/dashboard/accommodation/page.tsx`
  - [x] Implement Cascading State ➔ LGA ➔ Area ➔ Street selection
  - [x] Start State select at `Select State...` and LGA select at `Select LGA...`
  - [x] Set rent placeholder to `Enter annual rent...` and phone to `Enter phone number...`
- [x] Task: Refactor `RequestRoommateModal` in `src/app/dashboard/accommodation/page.tsx`
  - [x] Implement Cascading State ➔ LGA ➔ Area ➔ Street selection
  - [x] Start dropdowns with `Select State...` and `Select LGA...`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 4: Project-Wide Placeholder & Default Purge

- [x] Task: Refactor `Onboarding` (`src/app/onboarding/page.tsx`)
  - [x] Ensure all state dropdowns start at `Select State...` and text inputs use generic placeholders
- [x] Task: Refactor Auth & Dashboard Filters
  - [x] Replace any remaining "Lagos" or "Ikeja" placeholders with neutral generic placeholders (`Enter email address...`, `Enter full name...`)
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 5: End-to-End Build & Verification

- [x] Task: End-to-End Build Verification (`npm run build`)
  - [x] Verify 100% clean compilation across all routes with zero TypeScript errors
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

