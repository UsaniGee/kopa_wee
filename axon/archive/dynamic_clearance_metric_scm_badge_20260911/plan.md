# Implementation Plan: Dynamic Clearance Metric Card & Responsive SCM Role Badge

## Phase 1: Dynamic Next Clearance Metric Card
- [x] Task: Update Serving metric grid in `src/app/dashboard/page.tsx`:
  - Calculate `val` dynamically (`"[N] Days Left"`, `"Open Now"`, or `"Completed"`).
  - Format `sub` dynamically from `nextEligibleAt` date + user `lga` & `deployedState` (`"Aug 25 · Ikeja Hub"` replaced with live data).
- [x] Task: Phase Verification & Checkpoint — TypeScript clean.

## Phase 2: Responsive SCM Role Badge
- [x] Task: Update Serving role badge text in `src/app/dashboard/page.tsx`:
  - Render `SCM` on mobile viewports (`sm:hidden`).
  - Render `SERVING CORPS MEMBER` on desktop viewports (`hidden sm:inline`).
- [x] Task: Phase Verification & Checkpoint — TypeScript clean.

## Phase 3: Final Build Verification & Checkpoint
- [x] Task: Fix two corruption sites in `src/app/dashboard/page.tsx` introduced by prior edits.
- [x] Task: TypeScript type check passed (exit code 0).
- [x] Task: Committed as `cdda54b`.
