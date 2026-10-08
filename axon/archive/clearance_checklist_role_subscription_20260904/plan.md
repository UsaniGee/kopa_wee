# Implementation Plan: NYSC Platform — Clearance, Packing Checklist, Role Status, Progressive Profile & Subscription Implementation

## Phase 1: Database Schema Expansion
- [x] Task: Update `prisma/schema.prisma` with `MonthlyClearance`, `PackingItem`, `UserStatusHistory`, `SubscriptionPlan`, `UserSubscription`, `NYSCJourney`, and `Notification` models. Added `ApplicationRole`, `NyscStatus`, `DateSource`, `ItemTrackingStatus`, `StatusChangeType`, `SubscriptionStatus` enums.
- [x] Task: Push database schema changes (`npx prisma db push`) and generate updated Prisma client (`npx prisma generate`).
- [x] Task: Create database seed logic for initial `SubscriptionPlan` ("Early Access - Free") and 23 default camp packing items via `FormOption` reference records.
- [x] Task: Phase Verification & Checkpoint — DB in sync, seed ran successfully, TypeScript clean.

## Phase 2: Monthly Clearance Backend API & Serving Dashboard Confirmation Flow
- [x] Task: Implement backend API `GET /api/clearance` & `POST /api/clearance` with 20-day eligibility check, concurrency protection via `$transaction`, SERVING-only guard, and `CLEARANCE_NOT_YET_AVAILABLE` error code.
- [x] Task: Update Serving Corps Member dashboard with `ClearanceWidget` component: fetches status from backend, confirmation modal with next-window notice, persistent disabled state after clearance.
- [x] Task: Phase Verification & Checkpoint — TypeScript clean.

## Phase 3: Packing Checklist & Serving Item Stock Tracking
- [x] Task: Implement backend endpoints `GET/POST/PATCH/DELETE /api/packing-items` with auto-seeding of 23 default items, ownership-verified custom item management, PCM `pcmCompleted` toggle, and Serving `INTACT/USED/MISSING` tracking.
- [x] Task: Build PCM Camp Packing Checklist UI: categorized items, checkbox, `+ Add Item` form, delete custom items.
- [x] Task: Build Serving Corps Member Camp Item Tracking UI: `[INTACT] [USED] [MISSING]` toggle buttons, notice banner, preserved data from PCM phase.
- [x] Task: Phase Verification & Checkpoint — TypeScript clean.

## Phase 4: Controlled NYSC Status Transition & Audit Trail
- [x] Task: Implement backend endpoint `POST /api/users/status` validating manual transition matrix (`PCM -> SERVING` only), creating audit records in `UserStatusHistory`, syncing legacy `role` field.
- [x] Task: Build PCM Dashboard "Update Status" action with confirmation modal warning about irreversibility, API call, and role context update.
- [x] Task: Phase Verification & Checkpoint — TypeScript clean.

## Phase 5: Account Settings, Progressive Profiling & Journey Dates
- [x] Task: Implement `GET/PATCH /api/users/journey` for progressive NYSC journey dates (campEntryDate, campExitDate, serviceStartDate, serviceEndDate) and identity fields.
- [x] Task: Build Account Settings page (`/dashboard/settings`) with NYSC identity, camp dates, service dates, and Early Access subscription display. Added "Account Settings" tab to all role navs.
- [x] Task: Phase Verification & Checkpoint — TypeScript clean.

## Phase 6: Automatic Journey Status Transitions & Notifications
- [x] Task: Implement backend journey evaluator `/api/cron/journey-status` (GET: batch cron, POST: per-user profile-load fallback) for idempotent PCM->SERVING and SERVING->ALUMNI transitions with audit log + user notification creation.
- [x] Task: Create notifications API `GET/PATCH /api/notifications` with unread count, mark-as-read (single or all).
- [x] Task: Phase Verification & Checkpoint — TypeScript clean.

## Phase 7: Admin Dashboard User Status Management & Audit Reversal
- [x] Task: Implement `POST /api/admin/users/revert-status` (applicationRole ADMIN guard, ADMIN_REVERSAL audit log, user notification) and `GET /api/admin/users/[userId]/history` (full status history).
- [x] Task: Add "User Status Management" tab to Admin Dashboard: user ID search, status history display with change type badges (MANUAL/AUTOMATIC/ADMIN_REVERSAL), admin reversal panel with required reason.
- [x] Task: Phase Verification & Checkpoint — TypeScript clean.

## Phase 8: Subscription & Early Access Infrastructure
- [x] Task: Implement `GET /api/subscription` returning user plan (auto-assigns Early Access if none) and all active plans.
- [x] Task: Early Access status shown on Account Settings page with "Free" badge and future pricing roadmap note.
- [x] Task: Phase Verification & Checkpoint — TypeScript clean.

## Phase 9: E2E Verification & Final Build Checkpoint
- [x] Task: Execute full production build (`npm run build`) to ensure 0 TypeScript or Next.js build errors.
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)
