# Implementation Plan: User Navigation Clean-Up — Hide Mobile Top Sub-Nav & Move Account Settings to User Profile Icon

## Phase 1: Code Modifications
- [x] Task: Update `src/app/dashboard/layout.tsx`:
  - Add `hidden md:block` to the Module Sub-Navigation Bar container.
  - Remove `{ href: "/dashboard/settings", label: "Account Settings", icon: Settings }` from all `ROLE_NAV_ITEMS` arrays.
- [x] Task: Update `src/shared/components/DashboardNavbar.tsx`:
  - Add `profileOpen` state and `profileRef` outside-click handler.
  - Import `FiSettings` from `react-icons/fi`.
  - Transform User Profile Avatar into an interactive button triggering a dropdown menu containing user details, "Account Settings" link, and "Logout".

## Phase 2: Verification & Registry Update
- [x] Task: Run `npx tsc --noEmit` to verify type safety.
- [x] Task: Append completed pathway entry to `axon/pathways.md`.
