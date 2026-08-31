# Pathway Specification: Purge Mock Data & Dynamic Live User Flow (`purge_dummy_data_20260831`)

## Overview
This pathway purges hardcoded fallback arrays (`SAMPLE_LODGES`, `SAMPLE_LISTINGS`, `SAMPLE_ROOMMATES`, `SAMPLE_LOGS`) across all dashboard modules (`/dashboard/accommodation`, `/dashboard/marketplace`, `/dashboard/workplace`, `/dashboard/community`, `/dashboard/safety`). It replaces them with elegant Scandinavian empty state cards with direct call-to-action buttons, resets the live Neon PostgreSQL database, and provides a production-grade database seeder (`prisma/seed.ts`).

---

## Key Requirements

1. **Purge Fallback Arrays:** Remove hardcoded fallback arrays from frontend components so rendering relies strictly on live data returned by Neon API endpoints (`/api/accommodation`, `/api/marketplace`, `/api/workplace/logbook`, `/api/safety/sos`).
2. **Scandinavian Empty States:** Add clean, minimalist empty state cards when no records exist (e.g., *"No Corper Lodges Listed in Ikeja Yet — Post the First Listing"*).
3. **Database Seed Script (`prisma/seed.ts`):** Implement a Prisma seed script that populates realistic Nigerian NYSC corper profiles, verified lodges, marketplace items, and PPA logbooks across Lagos, Abuja, and Kano.
4. **Neon Database Reset:** Reset live Neon PostgreSQL tables using `npx prisma db push --force-reset` to establish a 100% clean baseline.

---

## Acceptance Criteria

1. **Zero Hardcoded Mock Data:** Pages display empty states or live Neon database entries without fallback arrays overriding user actions.
2. **Seamless Live Data Creation:** Users can register accounts, complete onboarding, list housing, post marketplace items, and log attendance into a pristine database.
3. **Seed Utility:** Running `npx prisma db seed` successfully populates production-standard seed data.
4. **Build Verification:** 100% clean Next.js build output across all 21 routes.
