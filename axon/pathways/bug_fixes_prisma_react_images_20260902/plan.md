# Implementation Plan: Prisma Pooler, React Render & Image Bug Fixes (`bug_fixes_prisma_react_images_20260902`)

Execution roadmap for database connection pool parameters, Prisma client instantiation, HeroCarousel refactoring, and Next.js Image sizes prop.

---

## Phase 1: Database Connection Pool Tuning & Prisma Client Optimization

- [x] Task: Update `.env` `DATABASE_URL` Parameters
  - [x] Add `connection_limit=15&pool_timeout=30&pgbouncer=true` to Neon PostgreSQL URL
- [x] Task: Enhance `src/shared/lib/prisma.ts` Client
  - [x] Ensure singleton PrismaClient caching across HMR Fast Refresh
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Refactor HeroCarousel Component

- [x] Task: Update `src/shared/components/HeroCarousel.tsx`
  - [x] Remove `onSlideChange` side-effect from `setActiveIndex((prev) => ...)` updater function
  - [x] Manage `onSlideChange` execution safely via `useEffect` with `onSlideChangeRef`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: Next.js Image Performance Optimization

- [x] Task: Update `src/app/auth/page.tsx`
  - [x] Add `sizes="(max-width: 1024px) 100vw, 50vw"` to the background `<Image />` component
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 4: End-to-End Build & Verification

- [x] Task: End-to-End Build Verification (`npm run build`)
  - [x] Verify 100% clean compilation across all routes with zero TypeScript or runtime errors
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

