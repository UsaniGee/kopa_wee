# Pathway Specification: Prisma Connection Pool Timeout, React Render Warning & Image Sizes Fix (`bug_fixes_prisma_react_images_20260902`)

## Overview
This pathway addresses three key technical issues identified in server runtime logs and browser console output:

1. **Prisma Connection Pool Timeout & Socket Disconnects (P2024 / Connection Pool Expiry):**
   - *Problem*: Neon PostgreSQL connection pooler (pgBouncer) timed out and closed sockets under concurrent Next.js dev server reloads (`Timed out fetching a new connection from connection pool`).
   - *Fix*: Update `DATABASE_URL` in `.env` with optimized PgBouncer connection pool parameters (`connection_limit=15&pool_timeout=30&pgbouncer=true`), and enhance `src/shared/lib/prisma.ts` with connection reuse and error handling.
2. **React `setState` During Render Phase Warning in `HeroCarousel.tsx`:**
   - *Problem*: `onSlideChange` callback was executed directly inside the state updater function `setActiveIndex((prev) => { onSlideChange?.(nextIdx); return nextIdx; })`.
   - *Fix*: Remove side-effects from state updaters; pass slide index changes strictly via `useEffect` with `onSlideChangeRef`.
3. **Next.js Image `sizes` Prop Optimization in `src/app/auth/page.tsx`:**
   - *Problem*: `Image` with `fill` attribute missing `sizes` prop causing performance warning.
   - *Fix*: Add `sizes="(max-width: 1024px) 100vw, 50vw"` to the background image.

---

## Acceptance Criteria

1. **Prisma Connection Stability:** API routes (`/api/marketplace`, `/api/accommodation`, `/api/roommates`, `/api/auth/login`) execute cleanly without P2024 connection pool timeout errors.
2. **Clean React Console Output:** No `Cannot update a component while rendering a different component` warnings in browser console.
3. **Next.js Image Compliance:** No missing `sizes` prop warnings for fill images.
4. **Clean Production Build:** `npm run build` succeeds cleanly across all 26 static & dynamic routes.
