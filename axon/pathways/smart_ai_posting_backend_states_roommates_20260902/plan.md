# Implementation Plan: Smart AI Posting, Backend States API, Roommate System & Posting Fixes (`smart_ai_posting_backend_states_roommates_20260902`)

Execution roadmap for database models, seed script, API endpoints, AI listing service, and frontend UI refactoring.

---

## Phase 1: Database Schema Updates & States Seeding

- [ ] Task: Update `prisma/schema.prisma`
  - [ ] Add `State` and `LGA` models
  - [ ] Add `RoommateRequest` model with single-active user constraint
  - [ ] Add `verificationStatus` enum (`UNVERIFIED`, `PENDING`, `VERIFIED`, `REJECTED`) to `AccommodationListing`
  - [ ] Run `npx prisma db push`
- [ ] Task: Create `GET /api/states` Endpoint & Seed Script
  - [ ] Seed all 36 Nigerian States + FCT into PostgreSQL
  - [ ] Build `GET /api/states` route handler
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Build Reusable Smart AI Posting Backend Service

- [ ] Task: Create `POST /api/ai/listing/analyse` Route Handler
  - [ ] Process uploaded images and short user description
  - [ ] Extract structured listing draft (Title, Category, Price, Location, Amenities/Condition) without hallucinating missing facts
  - [ ] Identify missing required fields for user input
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: Build Roommate DB API & Single Active Constraint

- [ ] Task: Create `GET/POST/DELETE /api/roommates` Route Handlers
  - [ ] Support fetching roommate requests filtered by location
  - [ ] Enforce backend rule: reject new creation if user already has an active roommate request
  - [ ] Support cancelling/editing active roommate request
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 4: Refactor Accommodation & Marketplace Posting Modals

- [ ] Task: Update Marketplace (`src/app/dashboard/marketplace/page.tsx`)
  - [ ] Replace static `NIGERIAN_STATES` array with dynamic `GET /api/states` fetch
  - [ ] Implement Option A (Manual) & Option B (✨ Smart AI Posting with photo upload previews)
  - [ ] Fix root cause of "Failed to post item" error
- [ ] Task: Update Accommodation (`src/app/dashboard/accommodation/page.tsx`)
  - [ ] Replace hard-coded state filter with dynamic `GET /api/states` fetch
  - [ ] Implement Option A & Option B (✨ Smart AI Posting)
  - [ ] Display `UNVERIFIED` badge & safety disclaimer on listings
  - [ ] Replace static roommate cards with dynamic `RoommateRequest` API feed & request drawer
- [ ] Task: Update Onboarding (`src/app/onboarding/page.tsx`)
  - [ ] Connect state select inputs to `GET /api/states`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 5: End-to-End Build & Verification

- [ ] Task: End-to-End Build Verification (`npm run build`)
  - [ ] Verify 100% clean compilation across all routes with zero TypeScript errors
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
