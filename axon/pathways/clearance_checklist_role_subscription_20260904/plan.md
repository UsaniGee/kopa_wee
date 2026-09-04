# Implementation Plan: NYSC Platform — Clearance, Packing Checklist, Role Status, Progressive Profile & Subscription Implementation

## Phase 1: Database Schema Expansion
- [ ] Task: Update `prisma/schema.prisma` with `MonthlyClearance`, `PackingItem`, `UserStatusHistory`, `SubscriptionPlan`, `UserSubscription`, `NYSCJourney`, and `Notification` models.
- [ ] Task: Push database schema changes (`npx prisma db push`) and generate updated Prisma client (`npx prisma generate`).
- [ ] Task: Create database seed logic for initial `SubscriptionPlan` ("Free - Early Access") and default camp packing items.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Monthly Clearance Backend API & Serving Dashboard Confirmation Flow
- [ ] Task: Implement backend API `GET /api/clearance` & `POST /api/clearance` in Next.js App Router handlers with 20-day eligibility check (`CLEARANCE_NOT_YET_AVAILABLE`) and concurrency protection.
- [ ] Task: Write unit tests for `POST /api/clearance` validating lockout rules, error responses, and successful completions.
- [ ] Task: Update Serving Corps Member dashboard clearance component with confirmation modal ("Mark Monthly Clearance as Done?"), countdown timer, and persistent disabled state.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Packing Checklist & Serving Item Stock Tracking
- [ ] Task: Implement backend endpoints `GET/POST/PATCH/DELETE /api/checklist` supporting custom items, PCM completed state, and Serving stock tracking state (`INTACT`, `USED`, `MISSING`).
- [ ] Task: Write unit tests for checklist item management and stock tracking status updates.
- [ ] Task: Build PCM Camp Packing Checklist UI with `+ Add Item` custom creation and persistent state.
- [ ] Task: Build Serving Corps Member Camp Item Tracking UI with notice banner and `[Intact] [Used] [Missing]` state toggle buttons.
- [ ] Task: Verify seamless data preservation of checklist items when transitioning user status from PCM to Serving.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 4: Controlled NYSC Status Transition & Audit Trail
- [ ] Task: Implement backend endpoint `POST /api/users/status` validating manual transition matrix (`PCM -> SERVING`) and creating audit records in `UserStatusHistory`.
- [ ] Task: Write unit tests for user status transition rules and unauthorized status switch rejections.
- [ ] Task: Build PCM Dashboard "Update Status" action with confirmation modal warning about user-side irreversibility.
- [ ] Task: Update session and user context updates to trigger dashboard re-rendering upon status change.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 5: Account Settings, Progressive Profiling & Journey Dates
- [ ] Task: Implement `GET/PATCH /api/users/settings` for user profile and progressive NYSC journey dates (`campEntryDate`, `campExitDate`, `serviceStartDate`, `serviceEndDate`).
- [ ] Task: Build Account Settings page UI with Personal Info, NYSC Information, NYSC Journey Dates, and Preferences tabs.
- [ ] Task: Integrate progressive profile completion prompts on PCM and Serving dashboards without blocking standard features.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 6: Automatic Journey Status Transitions & Notifications
- [ ] Task: Implement backend journey status evaluator handler `/api/cron/journey-status` (and user profile fetch auto-evaluation fallback) for idempotent `PCM -> SERVING` and `SERVING -> ALUMNI` transitions.
- [ ] Task: Write unit tests verifying automatic status transitions, system audit log generation (`changedBy: SYSTEM`), and notification dispatch.
- [ ] Task: Create in-app notifications system (`GET/PATCH /api/notifications`) and UI popover/banner for transition alerts.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 7: Admin Dashboard User Status Management & Audit Reversal
- [ ] Task: Implement backend endpoint `POST /api/admin/users/revert-status` and `GET /api/admin/users/[userId]/history` restricted to `ADMIN` system role.
- [ ] Task: Write unit tests for admin status reversal logic (both manual and automatic transitions) and audit logging.
- [ ] Task: Update Admin Dashboard with user status column, status history modal, and "Revert Status" modal with confirmation.
- [ ] Task: Verify that reverting status immediately updates user dashboard and API access permissions.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 8: Subscription & Early Access Infrastructure
- [ ] Task: Implement backend endpoint `GET /api/subscription` returning user subscription plan and benefits.
- [ ] Task: Add "Early Access — Free for Now" badge/banner in top header / navigation area.
- [ ] Task: Build "Plans & Pricing" modal and page detailing Free Early Access features and future paid tier roadmap.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 9: E2E Verification & Final Build Checkpoint
- [ ] Task: Execute full production build (`npm run build`) to ensure 0 TypeScript or Next.js build errors.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
