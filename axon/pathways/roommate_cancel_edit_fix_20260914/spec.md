# Pathway Specification: Roommate Request Fixes, Document Vault Upload, Calendar Sync, & UI Polish

## Overview
This pathway addresses key functional bugs and UI polish items across the application:
1. **Roommate Request Controls (`src/app/dashboard/accommodation/page.tsx`)**:
   - Replace native browser `confirm()` popup with a custom interactive confirmation modal.
   - Fix active request query (`/api/roommates?my=true`) so user's active roommate request renders properly on page load.
   - Add visible "Edit Request" button on the active roommate request card that opens the request modal in edit mode with prefilled values, calling `PATCH /api/roommates`.
   - Fix cancellation logic (`DELETE /api/roommates`) so active requests can be deleted properly.
2. **Offline Document Vault (`src/app/dashboard/companion/page.tsx`)**:
   - Fix document upload modal to allow uploading, storing (local state/storage), and managing offline documents.
3. **Google Calendar Sync (`src/app/dashboard/companion/page.tsx` & Accommodation)**:
   - Provide working Google Calendar export link generation for clearance and housing move-in dates.
4. **Typography & Styling Consistency**:
   - Ensure all buttons, headers, and UI text use normal sentence case instead of uppercase/caps.

## Functional Requirements
- **FR-1**: On `/dashboard/accommodation`, active roommate request must be fetched using `/api/roommates?my=true`.
- **FR-2**: Clicking "Cancel Request" on an active roommate request must open a styled confirmation modal (not `window.confirm`). Confirming must issue `DELETE /api/roommates` and update UI state cleanly.
- **FR-3**: Display a visible "Edit Request" button alongside "Cancel Request". Clicking "Edit Request" must open `RoommateModal` populated with existing request data, saving updates via `PATCH /api/roommates`.
- **FR-4**: In `/dashboard/companion`, document upload must allow users to upload document files/links, saving them locally for offline access with status badges.
- **FR-5**: Implement Google Calendar sync / link generator for clearance deadlines and accommodation move-in dates.
- **FR-6**: Clean up remaining uppercase text across accommodation and companion dashboards to standard sentence case typography.

## Non-Functional Requirements
- Maintain design system consistency (dark theme, glassmorphism, green accents).
- High responsiveness on mobile devices with proper icon button fallbacks.
- Zero TypeScript build errors (`npx tsc --noEmit`).

## Acceptance Criteria
1. Active roommate requests correctly load for the signed-in user on accommodation page load.
2. Canceling a roommate request triggers a custom modal, calls `DELETE /api/roommates`, removes the active request banner, and displays a success toast.
3. "Edit Request" button is clearly visible and pre-fills the modal; submitting updates the request via `PATCH /api/roommates`.
4. Companion document vault allows adding/uploading documents with immediate local state persistence.
5. Calendar sync button generates valid Google Calendar event URLs / export functionality.
6. All button labels and text headers use normal sentence case.
