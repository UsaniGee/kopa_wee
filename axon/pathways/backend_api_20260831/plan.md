# Implementation Plan: Backend API & Database Infrastructure (`backend_api_20260831`)

Execution roadmap for setting up Prisma ORM, PostgreSQL schema, NextAuth v5 authentication, RBAC middleware, and REST API endpoints across all mini-products.

---

## Phase 1: Database Setup & Prisma Schema Foundation

- [x] Task: Initialize Prisma ORM & Database Connection Setup
  - [x] Install `@prisma/client` and `prisma` dependencies
  - [x] Configure `prisma/schema.prisma` with PostgreSQL provider
  - [x] Create database client singleton at `src/shared/lib/prisma.ts`
- [x] Task: Define Core Schema Models (Users, Roles & Profiles)
  - [x] Define `User` model with `Role` enum (`PCM`, `SERVING_CORPER`, `CDS_EXEC`, `EMPLOYER`, `LGA_INSPECTOR`, `ALUMNI`)
  - [x] Define `CampChecklist`, `AccommodationListing`, `MarketplaceItem` models
  - [x] Define `PPALogbookEntry`, `CDSEvent`, `SOSAlert` models
- [x] Task: Run Database Migration & Generate Client
  - [x] Execute `npx prisma db push` / `npx prisma generate`
  - [x] Verify Prisma Client type generation
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Authentication & RBAC Middleware

- [x] Task: Write Tests for Auth Service & API Routes (Red Phase)
  - [x] Create unit tests for password hashing (`bcryptjs`) & JWT session generation
  - [x] Create API route tests for `POST /api/auth/register` and `POST /api/auth/login`
- [x] Task: Implement NextAuth.js (Auth.js v5) & Credentials Provider (Green Phase)
  - [x] Configure `src/app/api/auth/[...nextauth]/route.ts` with Credentials Provider
  - [x] Implement bcrypt password hashing & JWT token callbacks
- [x] Task: Implement Role-Based Access Control (RBAC) Middleware
  - [x] Create `middleware.ts` for route protection
  - [x] Enforce role-isolated route access for `/dashboard/*` and `/api/*` endpoints
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: Core Mini-Product REST API Endpoints

- [x] Task: Write Tests for Mini-Product APIs (Red Phase)
  - [x] Create integration tests for Accommodation, Marketplace, Logbook, and SOS endpoints
- [x] Task: Implement Profile & Role Switch API (`/api/users`)
  - [x] Implement `GET /api/users/me` and `PATCH /api/users/role`
- [x] Task: Implement Camp Checklist API (`/api/checklist`)
  - [x] Implement `GET /api/checklist` and `POST /api/checklist`
- [x] Task: Implement Accommodation Directory API (`/api/accommodation`)
  - [x] Implement `GET /api/accommodation` with state/distance filtering and `POST /api/accommodation`
- [x] Task: Implement Marketplace API (`/api/marketplace`)
  - [x] Implement `GET /api/marketplace` and `POST /api/marketplace`
- [x] Task: Implement PPA Workplace Logbook API (`/api/workplace/logbook`)
  - [x] Implement `GET/POST /api/workplace/logbook` and `PATCH /api/workplace/logbook/[id]/approve`
- [x] Task: Implement Emergency Safety SOS API (`/api/safety/sos`)
  - [x] Implement `POST /api/safety/sos` for emergency alert broadcast
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 4: Frontend State Integration & Final Build Verification

- [x] Task: Connect Frontend Contexts to Live API Endpoints
  - [x] Wire `RoleContext` and Auth forms (`/auth/page.tsx`) to NextAuth API
  - [x] Replace mock data fallbacks with Prisma API calls across dashboard views
- [x] Task: End-to-End Build & API Test Suite Execution
  - [x] Run full TypeScript verification (`npm run build`)
  - [x] Verify 100% route generation and clean static page build
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)
