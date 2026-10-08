# Implementation Plan: Fresh Auth & Onboarding Clean Slate (`fresh_auth_clean_slate_20260831`)

Execution roadmap for clearing pre-filled form fields, creating the `POST /api/auth/login` endpoint, connecting real credentials login, and resetting the Neon PostgreSQL database.

---

## Phase 1: Build `POST /api/auth/login` API Route Handler

- [x] Task: Create `src/app/api/auth/login/route.ts`
  - [x] Look up user by email in Neon PostgreSQL via Prisma Client
  - [x] Verify password hash using `bcrypt.compare`
  - [x] Return user profile, active role, and `userId`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Refactor Auth & Onboarding Forms to Clean Initial State

- [x] Task: Clean `src/app/auth/page.tsx` Form State
  - [x] Clear default values for email, password, fullName, and phone
  - [x] Connect login submit handler to `POST /api/auth/login`
- [x] Task: Clean `src/app/onboarding/page.tsx` Form State
  - [x] Clear default values for fullName, displayName, email, phone, stateCode, and ppaName
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: Pure Neon Database Reset & Production Build Verification

- [x] Task: Execute Neon Database Reset (`npx prisma db push --force-reset`)
  - [x] Wipe database tables to present a 100% fresh baseline for real users
- [x] Task: End-to-End Build Verification (`npm run build`)
  - [x] Verify 100% clean compilation of all 21 routes with zero TypeScript errors
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

