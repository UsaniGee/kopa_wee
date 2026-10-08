# Plan: Change Password UI, Role Flash Fix, Admin Invite UI & Roommate Engagement Tracking

> **Retroactive record (written 2026-10-08 by dummy_data_purge_unification_20261008).** No spec or plan was committed when this pathway ran. This file was reconstructed from git history; each task cites the commit that did the work. No tests or phase checkpoints were recorded at the time.

## Phase 1: Implementation
- [x] Task: Role loading state and skeleton to prevent the PCM flash (`src/app/dashboard/layout.tsx`, `src/shared/context/RoleContext.tsx`) 5d74424
- [x] Task: `PATCH /api/users/password` plus a Security section in Account Settings cac8161
- [x] Task: Admin Invites tab, with a send form and a pending-invites list (`src/app/admin/page.tsx`) 3ad59b9
- [x] Task: Roommate engagement backend and UI: interest, accept/decline, my-request panel, interest count 2ff6fc8 (2026-09-12)
- ⏭ Not performed: Task: Phase Verification & Checkpoint (none recorded at the time)

> Follow-up found 2026-10-08: the accommodation UI no longer calls `/api/roommates/interest` (the "Contact" button is an `alert()`), so the engagement flow can't be reached. Rewired in dummy_data_purge_unification_20261008 Phase 5.
