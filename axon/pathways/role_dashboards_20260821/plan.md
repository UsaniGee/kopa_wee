# Plan: Role-Based Dashboards & App Modules

## Status: ✅ COMPLETE

---

## Phase 1 — Shared Dashboard Shell & Navigation (`/dashboard`)
**Files:** `src/app/dashboard/layout.tsx`, `src/app/dashboard/page.tsx`, `src/shared/components/DashboardNavbar.tsx`

### Tasks
- [x] Create `/dashboard/layout.tsx` with shared topbar/sidebar navigation and role switcher state.
- [x] Create `/dashboard/page.tsx` rendering role-specific overview metrics, quick action launcher, and active module feeds.
- [x] Connect "Get Started" and "Role Demo" buttons from Landing Page directly to `/dashboard`.

---

## Phase 2 — Smart Companion Module (`/dashboard/companion`)
**Files:** `src/app/dashboard/companion/page.tsx`

### Tasks
- [x] Build LGA Clearance countdown widget with calendar sync toggle.
- [x] Build Document Vault preview with encrypted upload triggers.
- [x] Build Call-Up Letter & Orientation Camp checklist.

---

## Phase 3 — Corper Marketplace Module (`/dashboard/marketplace`)
**Files:** `src/app/dashboard/marketplace/page.tsx`

### Tasks
- [x] Build filterable marketplace grid (P2P items, POP handoff bundles, price filters).
- [x] Build "Sell an Item / POP Handoff" modal form.

---

## Phase 4 — Accommodation & Safety Modules (`/dashboard/accommodation`, `/dashboard/safety`)
**Files:** `src/app/dashboard/accommodation/page.tsx`, `src/app/dashboard/safety/page.tsx`

### Tasks
- [x] Build Lodge finder & Roommate matching preferences.
- [x] Build Highway trip check-in & SOS emergency broadcast tool.

---

## Phase 5 — Workplace & CDS Modules (`/dashboard/workplace`, `/dashboard/community`)
**Files:** `src/app/dashboard/workplace/page.tsx`, `src/app/dashboard/community/page.tsx`

### Tasks
- [x] Build PPA Attendance logger & Employer performance feedback form.
- [x] Build CDS Group meeting register & dues payment ledger.

---

## Verification & Checkpoint
- [x] Run `pnpm tsc --noEmit` to verify type safety across all dashboard routes (Exit Code 0).
- [x] Verify full navigation between landing page and dashboard modules.
