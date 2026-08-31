# Implementation Plan: Fresh Auth & Onboarding Clean Slate (`fresh_auth_clean_slate_20260831`)

Execution roadmap for clearing pre-filled form fields, creating the `POST /api/auth/login` endpoint, connecting real credentials login, and resetting the Neon PostgreSQL database.

---

## Phase 1: Build `POST /api/auth/login` API Route Handler

- [ ] Task: Create `src/app/api/auth/login/route.ts`
  - [ ] Look up user by email in Neon PostgreSQL via Prisma Client
  - [ ] Verify password hash using `bcrypt.compare`
  - [ ] Return user profile, active role, and `userId`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Refactor Auth & Onboarding Forms to Clean Initial State

- [ ] Task: Clean `src/app/auth/page.tsx` Form State
  - [ ] Clear default values for email, password, fullName, and phone
  - [ ] Connect login submit handler to `POST /api/auth/login`
- [ ] Task: Clean `src/app/onboarding/page.tsx` Form State
  - [ ] Clear default values for fullName, displayName, email, phone, stateCode, and ppaName
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: Pure Neon Database Reset & Production Build Verification

- [ ] Task: Execute Neon Database Reset (`npx prisma db push --force-reset`)
  - [ ] Wipe database tables to present a 100% fresh baseline for real users
- [ ] Task: End-to-End Build Verification (`npm run build`)
  - [ ] Verify 100% clean compilation of all 21 routes with zero TypeScript errors
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
