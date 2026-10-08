# Spec: Admin Dashboard Responsive Header — Icon-Only Buttons on Mobile

## Overview
On mobile screens, the Admin Dashboard (`src/app/admin/page.tsx`) top navigation bar becomes cluttered because both action buttons ("Refresh Feed" and "Logout Admin") display full text labels alongside their icons.

## Requirements
1. Hide the text labels ("Refresh Feed" and "Logout Admin") on viewports `< 640px` (mobile), displaying only their icons (`<RefreshCw />` and `<LogOut />`).
2. Show full text labels on viewports `≥ 640px` (`sm:inline`).
3. Add accessible `title` and `aria-label` attributes to the buttons so screen readers and touch tooltips identify their actions.

## Acceptance Criteria
- [x] On mobile (`< 640px`), Refresh and Logout buttons render icon-only, eliminating nav clutter.
- [x] On desktop (`≥ 640px`), full button text is displayed cleanly.
- [x] TypeScript compilation passes with 0 errors.
