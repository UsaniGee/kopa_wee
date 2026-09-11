# Spec: User Navigation Clean-Up — Hide Mobile Top Sub-Nav & Move Account Settings to User Profile Icon

## Overview
Currently on mobile viewports (`< 768px`), both the top sub-navigation bar (containing tabs like "Overview", "LGA Clearance", etc.) AND the sticky bottom mobile navbar are visible simultaneously, creating duplicate navigation bars. Additionally, "Account Settings" is currently rendered as a standard navigation tab across all role lists, taking up valuable tab space.

This pathway cleans up the mobile layout and moves Account Settings into an interactive User Profile dropdown menu.

## Requirements
1. **Hide Top Sub-Nav Bar on Mobile**: Set `hidden md:block` on the Module Sub-Navigation Bar in `src/app/dashboard/layout.tsx` so mobile users exclusively use the clean bottom mobile navigation bar.
2. **Move Account Settings to User Profile Icon**:
   - Remove `{ href: "/dashboard/settings", label: "Account Settings", icon: Settings }` from `ROLE_NAV_ITEMS` in `src/app/dashboard/layout.tsx`.
   - Update `DashboardNavbar.tsx` to turn the user profile avatar into an interactive dropdown menu on click.
   - Profile Dropdown menu includes:
     - User Profile Header (Name, State Code, Active Role Badge)
     - **Account Settings** (`/dashboard/settings` link with `FiSettings` icon)
     - **Logout** button (`handleLogout` with `FiLogOut` icon)
   - Support outside-click closing for the profile dropdown.
3. Maintain full access to `/dashboard/settings` via `isSettingsPage` route validation in `src/app/dashboard/layout.tsx`.

## Acceptance Criteria
- [x] Top sub-nav bar is hidden on mobile screens (`< 768px`) and visible on desktop (`≥ 768px`).
- [x] Mobile bottom navbar displays core role features cleanly without "Account Settings" tab clutter.
- [x] Clicking User Profile Avatar in the top header opens a profile menu containing "Account Settings" and "Logout".
- [x] TypeScript compilation passes cleanly with zero errors.
