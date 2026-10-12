# Technology Stack: KopaWee

## Core Architecture
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5.x
- **UI Library:** React 19

## Styling & Design System
- **CSS Framework:** TailwindCSS v4 (`@tailwindcss/postcss`)
- **Icons & Assets:** React Icons (`react-icons/fi`, `react-icons/hi2`, `react-icons/tb`, `react-icons/lu`)
- **Theme Support:** Dark & Light Mode via CSS variables and Tailwind classes
- **Design system:** sharp-edged (no border radius) and bordered; see `product-guidelines.md`

## Backend & Database Architecture
- **API Runtime:** Next.js 16 App Router route handlers (`src/app/api/.../route.ts`). Route files may only export HTTP handlers; shared helpers live in `src/shared/lib/`.
- **Database System:** PostgreSQL on Neon. `DATABASE_URL` is the pooled connection (app); `DIRECT_URL` is the direct connection (Prisma Migrate only).
- **ORM & Data Layer:** Prisma ORM 5 (`prisma/schema.prisma`) & Prisma Client (`src/shared/lib/prisma.ts`). Schema changes go through Prisma Migrate (`prisma/migrations/`, baseline `0_init`); `prisma db push` is no longer used.
- **Reference data:** states, LGAs, fields of study and the subscription plan are seeded by `pnpm prisma db seed` (`prisma/seed.ts`, `src/shared/lib/referenceSeed.ts`). The first admin comes from `SEED_ADMIN_*` env vars.
- **Authentication & Security:** NextAuth.js (Auth.js v5) with JWT session strategy — `CredentialsProvider` (email/password, bcrypt) + `GoogleProvider` (OAuth). Session stored in an HttpOnly cookie; `useSession().update()` re-reads role fields from the database. Route protection via `src/proxy.ts` (Next 16 rename of middleware). Server-side auth via `src/shared/lib/apiAuth.ts`. The session is the only client-side source of identity (no localStorage copies).
- **Email:** Nodemailer over Gmail SMTP (`GMAIL_USER`, `GMAIL_APP_PASSWORD`) with React Email (`@react-email/components`, `@react-email/render`) templates. Link base URL: `NEXTAUTH_URL` via `src/shared/lib/appUrl.ts`. A personal Gmail account sends at most ~500 emails/day and the app password needs 2-Step Verification kept on; move to a domain sender (e.g. Resend) before that limit matters. SMTP timeouts are 10–15 s so callers (SOS, sign-up) never hang.
- **AI:** Google Gemini (`@google/generative-ai`); model from `GEMINI_MODEL` (default `gemini-3.8-flash`, `src/shared/lib/gemini.ts`). Used for the assistant (`/api/ai/listing`, 20 requests/hour per user) and listing drafts with JSON-schema output (`/api/ai/listing/analyse`).
- **Scheduled jobs:** Vercel Cron calls `GET /api/cron/journey-status` daily with `CRON_SECRET`.
- **Validation:** Zod Schema Validation

## Client-Side Data
- **State Management:** React Context API & React Hooks; role from the NextAuth session (`RoleContext`, `src/shared/utils/roleRoutes.ts`).
- **Browser storage:** theme preference only. Legacy `kopawee_*` keys from older versions are cleared on sign-in and sign-out.
- **Images (known debt):** listing photos are downscaled to 1280 px JPEG in the browser and stored as base64 data URLs in Postgres `String[]` columns. Move to object storage before traffic grows.

## Testing
- **Vitest 5** for API routes and shared logic (`src/**/*.test.ts`), with shared Prisma and auth mocks in `src/test/`. Run with `CI=true pnpm test`. UI is checked manually at each phase checkpoint.

## Package Manager & Tooling
- **Package Manager:** pnpm
- **Linter & Code Quality:** ESLint 9 (`eslint-config-next`)
- **Runtime Target:** Modern web browsers on desktop and mobile
