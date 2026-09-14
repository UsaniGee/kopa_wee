# Plan: Admin Invites Tab — Missing Navigation Button

## Phase 1: Fix — Add Invites Tab Button
- [x] Task: Add the "Admin Invites" tab button to the tab navigation bar a63b9d0
  - [x] Insert button after the "User Status Management" button in `src/app/admin/page.tsx`
  - [x] Use FiMail icon (already imported)
  - [x] Match className pattern of existing tabs with activeTab === "invites" active state
  - [x] Label: "Admin Invites ({pendingInvites.length})"
  - [x] Phase Verification & Checkpoint: Confirm all 4 tabs render and switch correctly

## Phase 2: Registry & Commit
- [x] Task: Commit fix and update pathway registry a63b9d0
  - [x] Stage and commit: fix(admin): add missing Invites tab nav button
  - [x] Mark pathway complete in pathways.md
