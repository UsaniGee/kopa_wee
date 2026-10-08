# Spec: Remove Duplicate Mode Switcher from Admin Dashboard

## Overview
The Admin Dashboard (`src/app/admin/page.tsx`) renders an embedded `<ThemeToggle>` component in its top navigation header. Additionally, `src/app/layout.tsx` renders a global floating `<ThemeToggle>` at the bottom-right of every page (`fixed bottom-6 right-6`). This causes two mode switchers to appear simultaneously on the Admin Dashboard.

## Requirements
1. Remove the redundant inline `<ThemeToggle />` component and its import from `src/app/admin/page.tsx`.
2. Rely on the global floating `<ThemeToggle />` rendered in `src/app/layout.tsx` for consistent site-wide theme switching.

## Acceptance Criteria
- [x] Admin dashboard top navbar retains Action buttons ("Refresh Feed", "Logout Admin") without duplicate theme toggle.
- [x] Global floating theme switcher remains active on all pages, including the admin dashboard.
- [x] TypeScript compilation passes without errors.
