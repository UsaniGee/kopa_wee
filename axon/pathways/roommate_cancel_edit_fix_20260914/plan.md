# Pathway Implementation Plan: Roommate Request Fixes, Document Vault Upload, Calendar Sync, & UI Polish

## Phase 1: Roommate Request Cancel & Edit Fixes
- [ ] Task: Fix active roommate request query in accommodation page
  - [ ] Update GET fetch URL from `?userId=...` to `/api/roommates?my=true`
- [ ] Task: Build custom confirmation modal for request cancellation
  - [ ] Replace browser `confirm()` with custom modal state
  - [ ] Connect cancel confirm button to `DELETE /api/roommates`
- [ ] Task: Implement Edit Roommate Request button & PATCH flow
  - [ ] Render 'Edit Request' button on active request card
  - [ ] Pre-fill RoommateModal with request fields and submit via `PATCH /api/roommates`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Functional Document Vault Upload in Companion Page
- [ ] Task: Build Document Upload Modal and File Handler
  - [ ] Implement document upload modal with file input / name / category / notes
  - [ ] Persist uploaded documents to localStorage and update state
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Google Calendar Sync & UI Sentence Case Cleanup
- [ ] Task: Implement Google Calendar Event Link & Sync Handler
  - [ ] Build Google Calendar web URL generator for clearance dates & move-in dates
- [ ] Task: Apply sentence case typography to remaining UI components
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 4: Full Project Build & Type Check
- [ ] Task: Run typecheck (`npx tsc --noEmit`) and build test
- [ ] Task: Final Verification & Checkpoint (Refer to workflow.md)
