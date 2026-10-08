# Plan: Auth Startup Crash & Onboarding Name Pre-fill Bug

## Phase 1: NEXTAUTH_SECRET Guard Fix

- [x] Task: Fix empty-string detection in `src/auth.ts`
  - [x] Change guard from `!process.env.NEXTAUTH_SECRET` to
        `!process.env.NEXTAUTH_SECRET?.trim()`
  - [x] Update error message to include "or is empty" and clarify no quotes needed
- [x] Task: Update `.env.example` comment for `NEXTAUTH_SECRET`
  - [x] Add note: "Value must be a non-empty string — do not leave blank"
- [x] Task: Phase 1 Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Onboarding Name Pre-fill

- [x] Task: Pre-populate `formData.fullName` from session on mount
  - [x] Import `useSession` from `next-auth/react` in `onboarding/page.tsx`
  - [x] Add `useEffect` that runs once on mount:
        check `session.user.name` → fallback to `localStorage.getItem("kopawee_user_name")` → fallback to `""`
  - [x] Only set if `formData.fullName` is currently empty (don't overwrite user edits)
  - [x] Update field label from "Full Legal Name" to "Full Name"
- [x] Task: Phase 2 Verification & Checkpoint (Refer to workflow.md)
