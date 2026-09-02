# Implementation Plan: Classified Ads Posting, Product Owner `/admin` Dashboard & Email Verification (`classified_ads_admin_email_verify_20260902`)

Execution roadmap for Prisma schema sync, posting modals, API endpoints, `/admin` portal, and email link verification sign-up.

---

## Phase 1: Prisma Schema Sync & API Endpoint Updates

- [ ] Task: Update `prisma/schema.prisma`
  - [ ] Add `PENDING_APPROVAL`, `ACTIVE`, `REJECTED` to `ListingStatus` enum
  - [ ] Add `verificationToken` String? to `User` model
  - [ ] Run `npx prisma db push` to update Neon PostgreSQL
- [ ] Task: Update `/api/marketplace` and `/api/accommodation` Route Handlers
  - [ ] Support `POST` creation with `PENDING_APPROVAL` status
  - [ ] Support `PATCH` admin approval/rejection status transitions
- [ ] Task: Create `/api/auth/verify` Endpoint & Update `/api/auth/register`
  - [ ] Generate verification token on registration
  - [ ] Handle token verification at `GET /api/auth/verify?token=...`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Build Classified Ads Posting Modals

- [ ] Task: Build `PostItemModal` in `src/app/dashboard/marketplace/page.tsx`
  - [ ] Add title, category, price, state, lga, condition, image URL, and description fields
  - [ ] Connect modal to `POST /api/marketplace` and show confirmation banner
- [ ] Task: Build `PostLodgeModal` in `src/app/dashboard/accommodation/page.tsx`
  - [ ] Add title, rent, state, lga, address, bedrooms, bathrooms, split info, images, and description fields
  - [ ] Connect modal to `POST /api/accommodation` and show confirmation banner
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: Build Email Magic Link Verification Screen

- [ ] Task: Refactor `src/app/auth/page.tsx` Sign-Up Flow
  - [ ] Show *"Check Your Email"* screen with simulated email inbox / link click trigger
- [ ] Task: Build `src/app/auth/verify/page.tsx` Token Verification Route
  - [ ] Verify token with `/api/auth/verify`, mark user as verified, and redirect to `/onboarding`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 4: Build Platform Owner `/admin` Dashboard Portal

- [ ] Task: Create `src/app/admin/login/page.tsx`
  - [ ] Build admin authentication login screen (`admin@kopawee.ng`)
- [ ] Task: Create `src/app/admin/page.tsx` Admin Dashboard
  - [ ] Build moderation tabs for Pending Marketplace Ads, Pending Lodges, Active Ads, and User Verifications
  - [ ] Implement **Approve Ad** and **Reject Ad** actions with live DB updates
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 5: End-to-End Build & Verification

- [ ] Task: End-to-End Build Verification (`npm run build`)
  - [ ] Verify 100% clean compilation of all routes with zero TypeScript errors
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
