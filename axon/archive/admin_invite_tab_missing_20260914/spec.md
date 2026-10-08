# Spec: Admin Invites Tab — Missing Navigation Button

## Overview
The `invites` tab was implemented in `src/app/admin/page.tsx` (state, fetch logic, and full JSX content block) during a prior pathway, but the corresponding tab navigation button was never added to the tab bar. As a result, the Invites UI is unreachable.

## Root Cause
`src/app/admin/page.tsx` tab nav div contains only 3 buttons: Marketplace, Accommodation, Users. No "Invites" button exists, so `setActiveTab("invites")` is never called.

## Functional Requirements
1. Add an "Admin Invites" tab button to the tab navigation bar.
2. Button must visually match existing tab buttons (same className pattern).
3. Use `FiMail` icon (already imported).
4. Label: `Admin Invites ({pendingInvites.length})`.
5. Active state: `bg-emerald-600 text-white border-emerald-500`.
6. On click: `setActiveTab("invites")`.

## Out of Scope
- Changing invite send form or pending list layout
- Backend changes
- Any other tab

## Acceptance Criteria
- [ ] Clicking "Admin Invites" tab renders the send invite form and pending list
- [ ] Tab button shows correct pending invite count
- [ ] Active/inactive styling matches other tabs exactly
- [ ] No regressions on other tabs
