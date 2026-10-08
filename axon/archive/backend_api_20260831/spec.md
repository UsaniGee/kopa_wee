# Pathway Specification: Backend API & Database Infrastructure (`backend_api_20260831`)

## Overview
This pathway defines the full backend architecture, PostgreSQL database schema with Prisma ORM, NextAuth.js (Auth.js v5) role-based authentication, and RESTful API Route Handlers for the **KopaWee** NYSC Companion platform. It powers data persistence, authentication, role isolation, and real-time operations across all 6 target user roles and 8 core mini-products.

---

## Architectural Decisions

1. **Framework & Runtime:** Next.js 16 App Router Route Handlers (`src/app/api/.../route.ts`).
2. **Database & ORM:** PostgreSQL database with Prisma ORM (`prisma/schema.prisma`) for type-safe database queries and automated migrations.
3. **Authentication & RBAC:** NextAuth.js (Auth.js v5) with JWT strategy and custom Role-Based Access Control middleware to enforce strict role isolation across API endpoints.
4. **API Design Standards:** Standardized JSON payload signatures with HTTP status codes, structured error handling (`{ success: boolean, data?: T, error?: string }`), and validation using Zod schemas.

---

## User Roles & Data Isolation

The backend supports 6 distinct roles:
1. `PCM` (Prospective Corps Member): Call-up info, orientation state, camp packing checklist state.
2. `SERVING_CORPER`: Deployed state, LGA, PPA details, monthly clearance status, PPA logbook entries.
3. `CDS_EXEC`: CDS group management, project register, attendance logs, announcements, dues tracking.
4. `EMPLOYER`: PPA company directory, corper staff roster, clock-in approvals, leave requests.
5. `LGA_INSPECTOR`: LGA clearance status monitoring, corper verification roster, clearance statistics.
6. `ALUMNI`: POP household hand-offs, job bank postings, CV builder data, alumni network connections.

---

## Data Models & Schema Design (`prisma/schema.prisma`)

### Core Entities:
- **User:** `id`, `email`, `passwordHash`, `name`, `phone`, `role` (Enum), `stateOfOrigin`, `deployedState`, `lga`, `avatarUrl`, `isVerified`, `createdAt`, `updatedAt`
- **Session / Token:** NextAuth session handling and refresh tokens.
- **CampChecklist:** `id`, `userId`, `completedItems` (Json array), `updatedAt`
- **AccommodationListing:** `id`, `title`, `description`, `location`, `state`, `lga`, `price`, `images` (String[]), `ownerId`, `isAvailable`, `contactPhone`, `roommateSpecs` (Json), `createdAt`
- **MarketplaceItem:** `id`, `title`, `category`, `price`, `description`, `state`, `lga`, `sellerId`, `images` (String[]), `status` (AVAILABLE, SOLD), `createdAt`
- **PPALogbookEntry:** `id`, `userId`, `date`, `summary`, `hoursWorked`, `status` (PENDING, APPROVED, REJECTED), `employerId`, `createdAt`
- **CDSEvent:** `id`, `title`, `cdsGroup`, `state`, `lga`, `date`, `location`, `creatorId`, `attendees` (Json), `createdAt`
- **SOSAlert:** `id`, `userId`, `locationLat`, `locationLng`, `state`, `lga`, `message`, `status` (ACTIVE, RESOLVED), `createdAt`

---

## API Endpoints Matrix

### Auth & User API (`src/app/api/auth/[...nextauth]/route.ts`, `src/app/api/users/...`)
- `POST /api/auth/register` — Create user account with initial role and profile.
- `GET /api/users/me` — Fetch currently authenticated user profile with active role permissions.
- `PATCH /api/users/role` — Switch active role / upgrade status from PCM to Serving Corper.

### Mini-Product APIs
- `GET/POST/PATCH /api/checklist` — Fetch and update Camp Essentials checklist items.
- `GET/POST /api/accommodation` — List lodges, query by distance/state, post new listing.
- `GET/POST/DELETE /api/marketplace` — P2P Corper marketplace listings, state filter, mark sold.
- `GET/POST/PATCH /api/workplace/logbook` — Submit PPA daily logbook, employer review & approval.
- `GET/POST /api/community/cds` — CDS projects, attendance register, announcements.
- `POST /api/safety/sos` — Trigger instant SOS alert with location coordinates and broadcast.

---

## Acceptance Criteria

1. **Schema Migration:** Running `npx prisma db push` or `npx prisma migrate dev` creates all relational tables cleanly without syntax or type conflicts.
2. **Auth Flow:** Users can register, log in via JWT, receive valid session tokens, and access protected API routes.
3. **Role Enforcement:** Middleware rejects unauthorized cross-role requests (e.g. non-employer attempting to approve logbook entries returns 403 Forbidden).
4. **Data Operations:** All 8 mini-products are backed by functional REST API endpoints returning typed JSON payloads.
5. **Quality Gate:** Automated tests for Auth and API endpoints pass with clean TypeScript checks and build verification.

---

## Out of Scope (For Future Pathways)
- Live payment gateway integration (Paystack/Flutterwave for marketplace escrow - simulated in MVP).
- Hardware biometric scanner drivers (simulated clearance status via API).
