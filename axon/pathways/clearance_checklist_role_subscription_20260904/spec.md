# Pathway Specification: NYSC Platform — Clearance, Packing Checklist, Role Status, Progressive Profile & Subscription Implementation

## Overview
This pathway builds backend-enforced business logic, data models, API authorization, and UI components for:
1. Monthly Clearance Confirmation & 20-Day Lockout
2. PCM Packing Checklist & Serving Item Stock Tracking (`Intact`, `Used`, `Missing`)
3. Controlled NYSC Status Transitions & User Audit Logs
4. Progressive NYSC Journey Account Settings (Optional Camp Dates & Service End Dates)
5. Automatic Journey Transitions (`PCM -> SERVING -> ALUMNI`) driven by backend date evaluation, audit trails (`changedBy: SYSTEM`), and notifications
6. Admin Status Management & Reversals for both manual and automatic transitions
7. Early Access Subscription Infrastructure & Plans Page

## Functional Requirements

### 1. Monthly Clearance (Serving Corps Members)
- **Confirmation Flow:** Clicking "Mark Clearance Done" opens a confirmation modal:
  - Title: "Mark Monthly Clearance as Done?"
  - Message: "Are you sure you want to mark your clearance as completed for this month? Once confirmed, you won't be able to mark another clearance as done until your next clearance, approximately 20 days from now."
  - Actions: "Cancel" & "Yes, Mark Clearance Done".
- **Backend Enforcement:** `POST /api/clearance` calculates `nextEligibleAt` (current date + 20 days) and locks the user out until that timestamp. Direct API attempts or multiple tabs fail with error `CLEARANCE_NOT_YET_AVAILABLE` returning `nextEligibleAt`.
- **Double-Submission Prevention:** Database transaction and lock prevent double submissions.
- **Frontend Persistence & Countdown:** Button remains disabled after completion; UI displays persistent status (e.g. "Clearance completed ✓ Next clearance available in 20 days").

### 2. Packing Checklist & Serving Stock Tracking
- **PCM Mode:** Preparation checklist for camp. Users view recommended items, add custom items (`+ Add Item`), toggle completion (`pcmCompleted`), and persist state.
- **Status Transition Preservation:** When transitioning from PCM to Serving, all checklist items remain intact without duplication.
- **Serving Mode:** Converts checklist to an item/stock tracker. Displays notice:
  > **Keep Track of Your Camp Items**
  > This helps you keep track of the items you brought to camp. We're helping you keep an account of your belongings and track what you still have after camp.
- **Three Item States:** Options `Intact`, `Used`, and `Missing`. Default state upon transition to Serving is `Intact`. Only one state active per item at a time. Preserves original PCM checklist history (`pcmCompleted`) alongside `servingTrackingStatus`.

### 3. Controlled NYSC Role/Status & Manual Transitions
- **Controlled State:** NYSC lifecycle status (`PCM`, `SERVING`, `ALUMNI`) is controlled server-side and distinct from application roles (`USER`, `ADMIN`).
- **PCM -> Serving Flow:** "Update Status" button on PCM dashboard opens a confirmation modal explaining that the transition is irreversible by the user and requires contacting an admin to undo.
- **Backend Endpoint `POST /api/users/status`:** Validates user authentication, current status, and allowed transition matrix (`PCM -> SERVING`). Rejects unauthorized manual transitions (`SERVING -> PCM`, `PCM -> ADMIN`) with `400 Bad Request`.
- **Audit Logging:** Logs all transitions to `UserStatusHistory` (`userId`, `previousStatus`, `newStatus`, `changedBy`, `changeType`, `reason`, `createdAt`).

### 4. Account Settings, Progressive Profiling & NYSC Journey Dates
- **Account Settings Area:** Dedicated tabs for Personal Info, NYSC Information, NYSC Journey Dates, and Preferences.
- **Progressive Entry:** Fields are optional during signup. Users can fill or update them anytime.
- **Camp Dates (PCM):** `campEntryDate` and `campExitDate` (stored with source `USER_PROVIDED`).
- **Service Dates (Serving):** `serviceStartDate` and `serviceEndDate` (Expected POP Date).
- **Dashboard Context:** Renders personalized journey widgets ("Camp ends in 8 days", "POP expected in 132 days") or profile completion prompts ("Add your camp dates") without breaking layout when missing.

### 5. Automatic Journey Status Transitions & Notifications
- **Backend Evaluator:** Server-side evaluator (`/api/cron/journey-status` or profile access evaluation) checks:
  - If `currentStatus == PCM` and `campExitDate <= currentDate` -> Automatic transition to `SERVING`.
  - If `currentStatus == SERVING` and `serviceEndDate <= currentDate` -> Automatic transition to `ALUMNI`.
- **Idempotency & Audit:** Automatic transitions execute once within a DB transaction and record `UserStatusHistory` (`changedBy: SYSTEM`, `changeType: AUTOMATIC`, `reason: CAMP_EXIT_DATE_REACHED` / `SERVICE_END_DATE_REACHED`).
- **In-App Notification:** Generates user notification ("Welcome to your service year! 🎉" or "Congratulations on completing your service year! 🎓").

### 6. Admin Status Reversal & Dashboard Protection
- **Admin Dashboard User Management:** View user list, current NYSC status, and status history timeline (manual & automatic changes).
- **Status Reversal Action:** Admin can revert status (`SERVING -> PCM`, `ALUMNI -> SERVING`) with confirmation modal and reason input. Records audit history (`changedBy: ADMIN`).
- **Server Authorization:** Direct access to SERVING or ALUMNI APIs is gated server-side by actual user status.

### 7. Early Access Subscription & Pricing Roadmap
- **Data Models:** `SubscriptionPlan` (Free / Early Access vs future paid tiers) and `UserSubscription`.
- **Current State:** Every user defaults to `FREE` Early Access plan.
- **UI & Messaging:** Non-intrusive badge ("Early Access — Free for now") and dedicated "Plans & Pricing" page detailing Early Access features and future paid tier roadmap with transparent marketing copy.

## Acceptance Criteria
- [ ] Monthly clearance confirmation modal appears, backend locks clearance for 20 days, and direct API retries return `CLEARANCE_NOT_YET_AVAILABLE`.
- [ ] PCM checklist items and custom additions persist without loss when transitioning to Serving status.
- [ ] Serving corps members see stock tracking notice with `Intact`, `Used`, `Missing` toggle controls.
- [ ] Account Settings allows progressive entry of optional camp and service dates (`USER_PROVIDED`).
- [ ] Backend automatically transitions PCM -> SERVING when `campExitDate` passes, creates audit log (`changedBy: SYSTEM`), and sends welcome notification.
- [ ] Backend automatically transitions SERVING -> ALUMNI when `serviceEndDate` passes, creates audit log (`changedBy: SYSTEM`), and sends completion notification.
- [ ] Controlled status transition modal works; direct client attempts to set status fail.
- [ ] Admin can view full status history timeline and revert any user status with confirmation.
- [ ] Early Access subscription plan is active for all users with Plans & Pricing page.
- [ ] Project compiles cleanly without errors (`npm run build`).
