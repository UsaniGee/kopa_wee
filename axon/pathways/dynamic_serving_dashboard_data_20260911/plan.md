# Implementation Plan: Purge Hardcoded Serving Dashboard Banner Data & Dynamic User Fetching

## Phase 1: User Profile & Location Data Fetching in Dashboard
- [ ] Task: Update `DashboardOverviewPage` in `src/app/dashboard/page.tsx` to fetch active user profile details (name, stateCode, deployedState, lga) via `/api/users/me` or `/api/users/journey`.
- [ ] Task: Phase Verification & Checkpoint — TypeScript clean.

## Phase 2: Refactor Serving Dashboard Banner UI
- [ ] Task: Replace hardcoded banner strings in Serving Corps Member view:
  - State code badge: display actual `stateCode`.
  - Welcome greeting: display actual user `name`.
  - Clearance notice: calculate dynamic clearance days remaining and format user `lga` & `deployedState`.
- [ ] Task: Phase Verification & Checkpoint — TypeScript clean.

## Phase 3: Final Build Verification & Checkpoint
- [ ] Task: Execute full production build (`npm run build`) to ensure 0 errors.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
