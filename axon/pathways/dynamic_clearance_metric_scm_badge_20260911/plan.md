# Implementation Plan: Dynamic Clearance Metric Card & Responsive SCM Role Badge

## Phase 1: Dynamic Next Clearance Metric Card
- [ ] Task: Update Serving metric grid in `src/app/dashboard/page.tsx`:
  - Calculate `val` dynamically (`"[N] Days Left"`, `"Open Now"`, or `"Completed"`).
  - Format `sub` dynamically from `nextEligibleAt` date + user `lga` & `deployedState` (`"Aug 25 · Ikeja Hub"` replaced with live data).
- [ ] Task: Phase Verification & Checkpoint — TypeScript clean.

## Phase 2: Responsive SCM Role Badge
- [ ] Task: Update Serving role badge text in `src/app/dashboard/page.tsx`:
  - Render `SCM` on mobile viewports (`hidden sm:inline` / `sm:hidden`).
  - Render `SERVING CORPS MEMBER` on desktop viewports.
- [ ] Task: Phase Verification & Checkpoint — TypeScript clean.

## Phase 3: Final Build Verification & Checkpoint
- [ ] Task: Execute full production build (`npm run build`) to ensure 0 errors.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
