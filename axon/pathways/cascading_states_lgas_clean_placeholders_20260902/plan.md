# Implementation Plan: Cascading Backend States/LGAs & Clean Placeholders (`cascading_states_lgas_clean_placeholders_20260902`)

Execution roadmap for LGA database schema, seed data, API route handlers, and project-wide UI refactoring.

---

## Phase 1: Database Schema & Comprehensive LGAs Seed Data

- [ ] Task: Update `prisma/schema.prisma`
  - [ ] Add `LGA` model with relation to `State`
  - [ ] Run `npx prisma db push` to update Neon PostgreSQL
- [ ] Task: Create `src/shared/data/nigeriaStatesLgas.ts` Data Mapping
  - [ ] Map all 36 Nigerian States + FCT and their 774 LGAs
- [ ] Task: Create `GET /api/states` & `GET /api/lgas` Endpoint Handlers
  - [ ] Auto-seed States and LGAs in Neon PostgreSQL if empty
  - [ ] Return LGAs filtered by `stateId` or `stateName`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Refactor Marketplace Forms & Modals

- [ ] Task: Refactor `PostItemModal` in `src/app/dashboard/marketplace/page.tsx`
  - [ ] Implement Cascading State ➔ LGA ➔ Area selection
  - [ ] Start State select at `Select State...` (no default "Lagos")
  - [ ] Start LGA select at `Select LGA...` (disabled until State is chosen)
  - [ ] Use generic placeholder `Enter area / neighborhood...` for area input
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: Refactor Accommodation & Roommate Modals

- [ ] Task: Refactor `PostLodgeModal` in `src/app/dashboard/accommodation/page.tsx`
  - [ ] Implement Cascading State ➔ LGA ➔ Area selection
  - [ ] Start State select at `Select State...` and LGA select at `Select LGA...`
  - [ ] Set rent placeholder to `Enter rent amount...` and phone to `Enter contact phone...`
- [ ] Task: Refactor `RequestRoommateModal` in `src/app/dashboard/accommodation/page.tsx`
  - [ ] Implement Cascading State ➔ LGA selection
  - [ ] Start dropdowns with `Select State...` and `Select LGA...`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 4: Project-Wide Placeholder & Default Purge

- [ ] Task: Refactor `Onboarding` (`src/app/onboarding/page.tsx`)
  - [ ] Ensure all state dropdowns start at `Select State...` and text inputs use generic placeholders
- [ ] Task: Refactor Auth & Dashboard Filters
  - [ ] Replace any remaining "Lagos" or "Ikeja" placeholders with neutral generic placeholders (`Enter email address...`, `Enter full name...`)
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 5: End-to-End Build & Verification

- [ ] Task: End-to-End Build Verification (`npm run build`)
  - [ ] Verify 100% clean compilation across all routes with zero TypeScript errors
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
