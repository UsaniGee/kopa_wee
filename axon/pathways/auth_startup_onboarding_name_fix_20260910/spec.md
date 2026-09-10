# Spec: Auth Startup Crash & Onboarding Name Pre-fill Bug

## Overview

Two bugs in the auth/onboarding user journey:

1. **NEXTAUTH_SECRET crash** — `src/auth.ts` throws at startup when
   `NEXTAUTH_SECRET` is set to an empty string `""` in `.env.local`. The
   guard `!process.env.NEXTAUTH_SECRET` correctly catches empty strings as
   falsy, but the error message misleads the user into thinking the variable
   is missing when it is actually present but unpopulated. The real fix is
   twofold: improve the error message to distinguish "missing" from "empty",
   and ensure the app startup guide clearly states the value must be a
   non-empty string.

2. **Onboarding Step 1 asks for Full Name again** — The user already
   provided their full name during signup (`/auth` page, `fullName` field).
   Onboarding Step 1 renders a blank "Full Legal Name" input, forcing the
   user to type their name a second time. The fix is to pre-populate
   `formData.fullName` from the NextAuth session (`session.user.name`) on
   page load so the field arrives pre-filled. The field is retained (not
   removed) so the user can correct it if needed.

---

## Functional Requirements

### FR-1: NEXTAUTH_SECRET Guard — Clearer Error + Empty String Detection

- Update the startup guard in `src/auth.ts` to explicitly check for both
  missing AND empty string:
  ```ts
  if (!process.env.NEXTAUTH_SECRET?.trim()) { throw ... }
  ```
- Update the error message to read:
  `"NEXTAUTH_SECRET is not set or is empty in .env.local. Generate one with: openssl rand -base64 32 and paste the result as the value (no quotes needed if using a .env file)."`
- Update `.env.example` comment to clarify the value must be non-empty.

### FR-2: Onboarding Name Pre-fill from Session

- In `src/app/onboarding/page.tsx`, call `useSession()` from `next-auth/react`
  to access the authenticated user's name.
- On component mount (inside a `useEffect`), if `session.user.name` is
  available AND `formData.fullName` is still empty, set
  `formData.fullName = session.user.name`.
- Fallback chain (in order of priority):
  1. `session.user.name` (NextAuth session — most authoritative)
  2. `localStorage.getItem("kopawee_user_name")` (set after login)
  3. Empty string (user must type manually)
- The "Full Legal Name" input field is **retained** — not removed — so
  users can correct the pre-filled value.
- The field label is updated from "Full Legal Name" to "Full Name" to match
  the signup form label and reduce perceived formality.

---

## Acceptance Criteria

- [ ] Starting the dev server with `NEXTAUTH_SECRET=""` in `.env.local`
      throws an error containing the word "empty" so the user knows the
      variable is present but blank.
- [ ] Starting the dev server with `NEXTAUTH_SECRET` set to a real value
      starts without error.
- [ ] After signing up with a full name, navigating to `/onboarding` shows
      Step 1 with the Full Name field pre-populated with the name entered
      at signup.
- [ ] After Google OAuth sign-in, the Full Name field on onboarding Step 1
      is pre-populated with the Google account name.
- [ ] The user can still edit the pre-filled name before proceeding.

---

## Out of Scope

- Removing the Full Name field entirely from onboarding.
- Changes to any other onboarding steps.
- Changes to any other env variable guards.
