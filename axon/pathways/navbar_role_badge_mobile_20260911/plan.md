# Implementation Plan: Navbar Role Badge — Responsive Mobile Abbreviation

## Phase 1: Fix Role Badge Data & Render
- [x] Task: Update `DASHBOARD_ROLES` serving entry in `src/shared/components/DashboardNavbar.tsx`:
  - Change `badge` from `"Serving"` → `"SCM"`.
- [x] Task: Update badge `<span>` render to use responsive Tailwind classes:
  - `<span className="hidden sm:inline">{activeRoleObj.label}</span>` — full text on desktop.
  - `<span className="sm:hidden">{activeRoleObj.badge}</span>` — short code on mobile.
- [x] Task: Phase Verification & Checkpoint — TypeScript clean (`tsc --noEmit` exits 0).

## Phase 2: Final Verification
- [x] Task: Commit changes.
