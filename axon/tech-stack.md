# Technology Stack: KopaWee

## Core Architecture
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5.x
- **UI Library:** React 19

## Styling & Design System
- **CSS Framework:** TailwindCSS v4 (`@tailwindcss/postcss`)
- **Icons & Assets:** React Icons (`react-icons/fi`, `react-icons/hi2`, `react-icons/tb`, `react-icons/lu`)
- **Theme Support:** Dark & Light Mode via CSS variables and Tailwind classes

## Backend & Database Architecture
- **API Runtime:** Next.js 16 App Router RESTful Route Handlers (`src/app/api/.../route.ts`)
- **Database System:** PostgreSQL
- **ORM & Data Layer:** Prisma ORM (`prisma/schema.prisma`) & Prisma Client (`src/shared/lib/prisma.ts`)
- **Authentication & Security:** NextAuth.js (Auth.js v5) with JWT & Role-Based Access Control (RBAC)
- **Validation:** Zod Schema Validation

## Client-Side & Offline Data
- **State Management:** React Context API & React Hooks
- **Offline Vault & Storage:** IndexedDB / LocalStorage for cached documents, SOS data, and local state

## Package Manager & Tooling
- **Package Manager:** pnpm / npm
- **Linter & Code Quality:** ESLint 9 (`eslint-config-next`)
- **Runtime Target:** Modern web browsers & mobile web PWA readiness
