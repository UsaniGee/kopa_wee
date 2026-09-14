# Plan: Admin Invites Tab — Missing Navigation Button

## Phase 1: Fix — Add Invites Tab Button
- [ ] Task: Add the "Admin Invites" tab button to the tab navigation bar
  - [ ] Insert button after the "User Status Management" button in `src/app/admin/page.tsx`
  - [ ] Use FiMail icon (already imported)
  - [ ] Match className pattern of existing tabs with activeTab === "invites" active state
  - [ ] Label: "Admin Invites ({pendingInvites.length})"
  - [ ] Phase Verification & Checkpoint: Confirm all 4 tabs render and switch correctly

## Phase 2: Registry & Commit
- [ ] Task: Commit fix and update pathway registry
  - [ ] Stage and commit: fix(admin): add missing Invites tab nav button
  - [ ] Mark pathway complete in pathways.md
