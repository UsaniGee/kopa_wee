# Implementation Plan: Smart AI Posting, Backend States API, Roommate System & Posting Fixes (`smart_ai_posting_backend_states_roommates_20260902`)

Execution roadmap for database models, seed script, API endpoints, AI listing service, and frontend UI refactoring.

---

## Phase 1: Database Schema Updates & States Seeding

- [x] Task: Update `prisma/schema.prisma`
  - [x] Add `State` and `LGA` models
  - [x] Add `RoommateRequest` model with single-active user constraint
  - [x] Add `verificationStatus` enum (`UNVERIFIED`, `PENDING`, `VERIFIED`, `REJECTED`) to `AccommodationListing`
  - [x] Run `npx prisma db push`
- [x] Task: Create `GET /api/states` Endpoint & Seed Script
  - [x] Seed all 36 Nigerian States + FCT into PostgreSQL
  - [x] Build `GET /api/states` route handler
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Build Reusable Smart AI Posting Backend Service

- [x] Task: Create `POST /api/ai/listing/analyse` Route Handler
  - [x] Process uploaded images and short user description
  - [x] Extract structured listing draft (Title, Category, Price, Location, Amenities/Condition) without hallucinating missing facts
  - [x] Identify missing required fields for user input
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: Build Roommate DB API & Single Active Constraint

- [x] Task: Create `GET/POST/DELETE /api/roommates` Route Handlers
  - [x] Support fetching roommate requests filtered by location
  - [x] Enforce backend rule: reject new creation if user already has an active roommate request
  - [x] Support cancelling/editing active roommate request
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 4: Refactor Accommodation & Marketplace Posting Modals

- [x] Task: Update Marketplace (`src/app/dashboard/marketplace/page.tsx`)
  - [x] Replace static `NIGERIAN_STATES` array with dynamic `GET /api/states` fetch
  - [x] Implement Option A (Manual) & Option B (✨ Smart AI Posting with photo upload previews)
  - [x] Fix root cause of "Failed to post item" error
- [x] Task: Update Accommodation (`src/app/dashboard/accommodation/page.tsx`)
  - [x] Replace hard-coded state filter with dynamic `GET /api/states` fetch
  - [x] Implement Option A & Option B (✨ Smart AI Posting)
  - [x] Display `UNVERIFIED` badge & safety disclaimer on listings
  - [x] Replace static roommate cards with dynamic `RoommateRequest` API feed & request drawer
- [x] Task: Update Onboarding (`src/app/onboarding/page.tsx`)
  - [x] Connect state select inputs to `GET /api/states`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 5: End-to-End Build & Verification

- [x] Task: End-to-End Build Verification (`npm run build`)
  - [x] Verify 100% clean compilation across all routes with zero TypeScript errors
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

