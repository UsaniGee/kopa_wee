# Pathway Specification: NYSC Platform — Clearance, Packing Checklist, Role Status & Subscription Implementation

## Overview
This pathway builds backend-enforced business logic and UI experiences for NYSC Monthly Clearance, Packing Checklist & Item Stock Tracking, Controlled NYSC Status Transitions with Audit Logs, Admin Status Reversals, and Early Access Subscription infrastructure across the KopaWee platform.

## Functional Requirements

### 1. Monthly Clearance (Serving Corps Members)
- **Confirmation Flow:** Clicking "Mark Clearance Done" opens a confirmation modal:
  - Title: "Mark Monthly Clearance as Done?"
  - Message: "Are you sure you want to mark your clearance as completed for this month? Once confirmed, you won't be able to mark another clearance as done until your next clearance, approximately 20 days from now."
  - Actions: "Cancel" & "Yes, Mark Clearance Done".
- **Backend Enforcement:** `POST /api/clearance` calculates `nextEligibleAt` (current date + 20 days) and locks the user out until that timestamp is reached. Direct API attempts or multiple tabs before `nextEligibleAt` fail with error `CLEARANCE_NOT_YET_AVAILABLE` and return `nextEligibleAt`.
- **Double-Submission Prevention:** Database transaction and lock prevent concurrent double submissions.
- **Frontend Persistence & Countdown:** Button remains disabled after completion; UI displays persistent status (e.g. "Clearance completed ✓ Next clearance available in 20 days").

### 2. Packing Checklist & Serving Stock Tracking
- **PCM Mode:** Preparation checklist for camp. Users can view recommended items, add custom items (`+ Add Item`), toggle completion (`pcmCompleted`), and persist state.
- **Status Transition Preservation:** When a user transitions from PCM to Serving, all checklist items (standard and custom) remain intact without duplication.
- **Serving Mode:** Converts checklist to an item/stock tracker. Displays notice:
  > **Keep Track of Your Camp Items**
  > This helps you keep track of the items you brought to camp. We're helping you keep an account of your belongings and track what you still have after camp.
- **Three Item States:** Options `Intact`, `Used`, and `Missing`. Default state for items upon transition to Serving is `Intact`. Only one state active per item at a time. Preserves original PCM checklist history (`pcmCompleted`) alongside `servingTrackingStatus`.

### 3. Controlled NYSC Role/Status & Audit Trail
- **Controlled State:** NYSC lifecycle status (`PCM`, `SERVING`, `ALUMNI`) is controlled server-side and distinct from system user role (`USER`, `ADMIN`).
- **PCM -> Serving Flow:** "Update Status" button on PCM dashboard opens a confirmation modal explaining that the transition is irreversible by the user and requires contacting an admin to undo.
- **Backend Endpoint `POST /api/users/status`:** Validates user authentication, current status, and allowed transition matrix (`PCM -> SERVING`). Rejects unauthorized transitions (`SERVING -> PCM`, `PCM -> ADMIN`) with `400 Bad Request`.
- **Audit Logging:** Logs all transitions to `UserStatusHistory` (`userId`, `previousStatus`, `newStatus`, `changedBy`, `reason`, `createdAt`).

### 4. Admin Status Reversal & Dashboard Protection
- **Admin Dashboard User Management:** View user list, current NYSC status, and status history timeline.
- **Status Reversal Action:** Admin can revert status (`SERVING -> PCM`) with confirmation modal and reason input. Records audit history (`changedBy: ADMIN`).
- **Feature Protection:** Server-side API endpoints validate NYSC status where relevant. Reverting a user from SERVING to PCM immediately hides serving-only features and returns 403 on serving endpoints upon session refresh.

### 5. Subscription & Early Access Infrastructure
- **Data Models:** `SubscriptionPlan` (free/early access vs future paid plans) and `UserSubscription`.
- **Current State:** Every user defaults to `FREE` / Early Access plan with active status.
- **UI & Messaging:** Dedicated "Plans & Pricing" modal/page and subtle badge ("Early Access — Free for now"). Honest marketing copy: "Free during Early Access. Premium features coming soon. Join early to secure access." No fake countdowns or false claims. Backend ready for future payment gateways.

## Acceptance Criteria
- [ ] Monthly clearance confirmation modal appears, backend locks clearance for 20 days, and direct API retries return `CLEARANCE_NOT_YET_AVAILABLE`.
- [ ] PCM checklist items and custom additions persist without loss when transitioning to Serving status.
- [ ] Serving corps members see stock tracking notice with `Intact`, `Used`, `Missing` toggle controls.
- [ ] Status transition `PCM -> SERVING` requires confirmation modal, backend validation, and writes to `UserStatusHistory`.
- [ ] Admin can view user status history and revert `SERVING -> PCM` with admin confirmation and audit log.
- [ ] Subscription models (`SubscriptionPlan`, `UserSubscription`) are created and seeded with Early Access plan; Plans & Pricing UI displays accurate pricing messaging.
- [ ] Project builds cleanly without errors (`npm run build`).
