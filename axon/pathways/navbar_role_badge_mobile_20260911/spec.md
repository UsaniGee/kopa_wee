# Spec: Navbar Role Badge — Responsive Mobile Abbreviation

## Overview
The `DashboardNavbar` renders the active role's full `label` (e.g. `"Serving Corps Member"`) inside the green badge at all screen sizes. On narrow mobile viewports this clutters the navbar because the text is too long. The badge should abbreviate on mobile, showing only a short code like `"SCM"` for the serving role.

## Functional Requirements
1. The role badge in `DashboardNavbar` MUST show the **full label** on `sm` and above viewports (≥ 640 px).
2. The role badge MUST show a **short badge code** on viewports smaller than `sm` (< 640 px).
3. The short badge code for the **serving** role MUST be `"SCM"` (not `"Serving"`).
4. Other roles MUST use their existing `badge` field as the mobile short form (e.g. `"PCM"`, `"POP"`, `"CDS Exec"`, `"Employer"`, `"Inspector"`).

## Implementation Target
- `src/shared/components/DashboardNavbar.tsx`
  - Update `DASHBOARD_ROLES[1]` (serving) `badge` from `"Serving"` → `"SCM"`.
  - Update the badge `<span>` at line 183 to render two spans:
    - `<span className="hidden sm:inline">{activeRoleObj.label}</span>` — full label on desktop
    - `<span className="sm:hidden">{activeRoleObj.badge}</span>` — short code on mobile

## Acceptance Criteria
- On mobile (< 640 px): badge shows `● SCM` for serving role.
- On desktop (≥ 640 px): badge shows `● Serving Corps Member` for serving role.
- `npx tsc --noEmit` exits with code 0.

## Out of Scope
- No changes to dashboard hero banner badge (already handled in previous pathway).
- No changes to any other navbar items.
