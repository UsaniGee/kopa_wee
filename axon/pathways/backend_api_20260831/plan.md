# Implementation Plan: Backend API & Database Infrastructure (`backend_api_20260831`)

Execution roadmap for setting up Prisma ORM, PostgreSQL schema, NextAuth v5 authentication, RBAC middleware, and REST API endpoints across all mini-products.

---

## Phase 1: Database Setup & Prisma Schema Foundation

- [ ] Task: Initialize Prisma ORM & Database Connection Setup
  - [ ] Install `@prisma/client` and `prisma` dependencies
  - [ ] Configure `prisma/schema.prisma` with PostgreSQL provider
  - [ ] Create database client singleton at `src/shared/lib/prisma.ts`
- [ ] Task: Define Core Schema Models (Users, Roles & Profiles)
  - [ ] Define `User` model with `Role` enum (`PCM`, `SERVING_CORPER`, `CDS_EXEC`, `EMPLOYER`, `LGA_INSPECTOR`, `ALUMNI`)
  - [ ] Define `CampChecklist`, `AccommodationListing`, `MarketplaceItem` models
  - [ ] Define `PPALogbookEntry`, `CDSEvent`, `SOSAlert` models
- [ ] Task: Run Database Migration & Generate Client
  - [ ] Execute `npx prisma db push` / `npx prisma generate`
  - [ ] Verify Prisma Client type generation
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Authentication & RBAC Middleware

- [ ] Task: Write Tests for Auth Service & API Routes (Red Phase)
  - [ ] Create unit tests for password hashing (`bcryptjs`) & JWT session generation
  - [ ] Create API route tests for `POST /api/auth/register` and `POST /api/auth/login`
- [ ] Task: Implement NextAuth.js (Auth.js v5) & Credentials Provider (Green Phase)
  - [ ] Configure `src/app/api/auth/[...nextauth]/route.ts` with Credentials Provider
  - [ ] Implement bcrypt password hashing & JWT token callbacks
- [ ] Task: Implement Role-Based Access Control (RBAC) Middleware
  - [ ] Create `middleware.ts` for route protection
  - [ ] Enforce role-isolated route access for `/dashboard/*` and `/api/*` endpoints
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: Core Mini-Product REST API Endpoints

- [ ] Task: Write Tests for Mini-Product APIs (Red Phase)
  - [ ] Create integration tests for Accommodation, Marketplace, Logbook, and SOS endpoints
- [ ] Task: Implement Profile & Role Switch API (`/api/users`)
  - [ ] Implement `GET /api/users/me` and `PATCH /api/users/role`
- [ ] Task: Implement Camp Checklist API (`/api/checklist`)
  - [ ] Implement `GET /api/checklist` and `POST /api/checklist`
- [ ] Task: Implement Accommodation Directory API (`/api/accommodation`)
  - [ ] Implement `GET /api/accommodation` with state/distance filtering and `POST /api/accommodation`
- [ ] Task: Implement Marketplace API (`/api/marketplace`)
  - [ ] Implement `GET /api/marketplace` and `POST /api/marketplace`
- [ ] Task: Implement PPA Workplace Logbook API (`/api/workplace/logbook`)
  - [ ] Implement `GET/POST /api/workplace/logbook` and `PATCH /api/workplace/logbook/[id]/approve`
- [ ] Task: Implement Emergency Safety SOS API (`/api/safety/sos`)
  - [ ] Implement `POST /api/safety/sos` for emergency alert broadcast
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 4: Frontend State Integration & Final Build Verification

- [ ] Task: Connect Frontend Contexts to Live API Endpoints
  - [ ] Wire `RoleContext` and Auth forms (`/auth/page.tsx`) to NextAuth API
  - [ ] Replace mock data fallbacks with Prisma API calls across dashboard views
- [ ] Task: End-to-End Build & API Test Suite Execution
  - [ ] Run full TypeScript verification (`npm run build`)
  - [ ] Verify 100% route generation and clean static page build
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
