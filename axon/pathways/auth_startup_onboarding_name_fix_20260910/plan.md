# Plan: Auth Startup Crash & Onboarding Name Pre-fill Bug

## Phase 1: NEXTAUTH_SECRET Guard Fix

- [ ] Task: Fix empty-string detection in `src/auth.ts`
  - [ ] Change guard from `!process.env.NEXTAUTH_SECRET` to
        `!process.env.NEXTAUTH_SECRET?.trim()`
  - [ ] Update error message to include "or is empty" and clarify no quotes needed
- [ ] Task: Update `.env.example` comment for `NEXTAUTH_SECRET`
  - [ ] Add note: "Value must be a non-empty string — do not leave blank"
- [ ] Task: Phase 1 Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Onboarding Name Pre-fill

- [ ] Task: Pre-populate `formData.fullName` from session on mount
  - [ ] Import `useSession` from `next-auth/react` in `onboarding/page.tsx`
  - [ ] Add `useEffect` that runs once on mount:
        check `session.user.name` → fallback to `localStorage.getItem("kopawee_user_name")` → fallback to `""`
  - [ ] Only set if `formData.fullName` is currently empty (don't overwrite user edits)
  - [ ] Update field label from "Full Legal Name" to "Full Name"
- [ ] Task: Phase 2 Verification & Checkpoint (Refer to workflow.md)
