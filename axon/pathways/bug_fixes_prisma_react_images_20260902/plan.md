# Implementation Plan: Prisma Pooler, React Render & Image Bug Fixes (`bug_fixes_prisma_react_images_20260902`)

Execution roadmap for database connection pool parameters, Prisma client instantiation, HeroCarousel refactoring, and Next.js Image sizes prop.

---

## Phase 1: Database Connection Pool Tuning & Prisma Client Optimization

- [ ] Task: Update `.env` `DATABASE_URL` Parameters
  - [ ] Add `connection_limit=15&pool_timeout=30&pgbouncer=true` to Neon PostgreSQL URL
- [ ] Task: Enhance `src/shared/lib/prisma.ts` Client
  - [ ] Ensure singleton PrismaClient caching across HMR Fast Refresh
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Refactor HeroCarousel Component

- [ ] Task: Update `src/shared/components/HeroCarousel.tsx`
  - [ ] Remove `onSlideChange` side-effect from `setActiveIndex((prev) => ...)` updater function
  - [ ] Manage `onSlideChange` execution safely via `useEffect` with `onSlideChangeRef`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: Next.js Image Performance Optimization

- [ ] Task: Update `src/app/auth/page.tsx`
  - [ ] Add `sizes="(max-width: 1024px) 100vw, 50vw"` to the background `<Image />` component
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 4: End-to-End Build & Verification

- [ ] Task: End-to-End Build Verification (`npm run build`)
  - [ ] Verify 100% clean compilation across all routes with zero TypeScript or runtime errors
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
