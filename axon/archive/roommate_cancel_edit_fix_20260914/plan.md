# Pathway Implementation Plan: Roommate Request Fixes, Document Vault Upload, Calendar Sync, & UI Polish

## Phase 1: Roommate Request Cancel & Edit Fixes
- [x] Task: Fix active roommate request query in accommodation page
  - [x] Update GET fetch URL from `?userId=...` to `/api/roommates?my=true`
- [x] Task: Build custom confirmation modal for request cancellation
  - [x] Replace browser `confirm()` with custom modal state
  - [x] Connect cancel confirm button to `DELETE /api/roommates`
- [x] Task: Implement Edit Roommate Request button & PATCH flow
  - [x] Render 'Edit Request' button on active request card
  - [x] Pre-fill RoommateModal with request fields and submit via `PATCH /api/roommates`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Functional Document Vault Upload in Companion Page
- [x] Task: Build Document Upload Modal and File Handler
  - [x] Implement document upload modal with file input / name / category / notes
  - [x] Persist uploaded documents to localStorage and update state
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Google Calendar Sync & UI Sentence Case Cleanup
- [x] Task: Implement Google Calendar Event Link & Sync Handler
  - [x] Build Google Calendar web URL generator for clearance dates & move-in dates
- [x] Task: Apply sentence case typography to remaining UI components
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 4: Full Project Build & Type Check
- [x] Task: Run typecheck (`npx tsc --noEmit`) and build test
- [x] Task: Final Verification & Checkpoint (Refer to workflow.md)
