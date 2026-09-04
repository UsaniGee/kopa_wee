# Implementation Plan: NYSC Platform — Final Updates to Dashboard, Account Settings & Subscription

## Phase 1: Remove Role Switcher & Contextual Dashboard Header
- [ ] Task: Remove `RoleSwitcher` and role dropdown controls from `DashboardNavbar.tsx` and all user header components.
- [ ] Task: Display read-only NYSC Status badge (`PCM`, `SERVING`, `ALUMNI`) formatted appropriately on all user dashboards.
- [ ] Task: Phase Verification & Checkpoint — TypeScript clean.

## Phase 2: PCM Dashboard, Camp Date Integration & Smart Manual Transition
- [ ] Task: Update PCM Dashboard: ensure no Service Start/End year fields exist; verify camp packing checklist, camp info, deployment info, and community sections.
- [ ] Task: Update PCM manual status update modal:
  - If camp dates are missing, prompt user to add camp dates or proceed manually.
  - If camp dates are present, display: *"Your status will automatically update on [Camp Exit Date], but would you like to update to Serving now?"*
- [ ] Task: Phase Verification & Checkpoint — TypeScript clean.

## Phase 3: Serving Dashboard Service Information, POP Tracking & 12-Clearance Alumni Transition
- [ ] Task: Add "Complete your service timeline" banner to Serving dashboard when service dates are incomplete.
- [ ] Task: Add POP Journey Tracking Widget to Serving dashboard calculating expected POP countdown based on `serviceEndDate`.
- [ ] Task: Update `ClearanceWidget` / `/api/clearance`:
  - Track count of completed monthly clearances.
  - After 12 clearances, transform clearance action into a "Complete NYSC Service & Transition to Alumni" button.
- [ ] Task: Phase Verification & Checkpoint — TypeScript clean.

## Phase 4: Context-Aware Account Settings & Status-Based Filtering
- [ ] Task: Update `/dashboard/settings` page:
  - **PCM view**: Personal info, PCM batch, institution, course, deployment info, camp entry/exit dates. Hide Service Start/End Years.
  - **Serving view**: Personal info, NYSC state of service, LGA, PPA info, Service Start/End Year & dates.
  - **Alumni view**: Personal info, service history summary, batch/year served, state served, career/networking preferences. Hide clearance/PPA widgets.
- [ ] Task: Phase Verification & Checkpoint — TypeScript clean.

## Phase 5: Automatic Serving -> Alumni Transition Cron Engine
- [ ] Task: Update `/api/cron/journey-status`:
  - Add logic for `SERVING -> ALUMNI` transition when `currentDate >= serviceEndDate`.
  - Create `UserStatusHistory` audit record (`AUTOMATIC`) and send user notification upon completion.
- [ ] Task: Phase Verification & Checkpoint — TypeScript clean.

## Phase 6: Early Access Homepage Pricing Section
- [ ] Task: Add "Early Access" pricing section/card to homepage (`src/app/page.tsx`):
  - Heading: "Early Access"
  - Subheading: "Free for now. Premium plans coming soon."
  - Feature list & transparent pricing message + CTA.
- [ ] Task: Phase Verification & Checkpoint — TypeScript clean.

## Phase 7: Final Build Verification & Checkpoint
- [ ] Task: Execute full production build (`npm run build`) to ensure 0 errors.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
