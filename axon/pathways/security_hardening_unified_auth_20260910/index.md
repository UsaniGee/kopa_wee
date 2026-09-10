# Pathway: Security Hardening, Unified Auth & Platform Completion

**ID:** `security_hardening_unified_auth_20260910`
**Type:** Refactor/Security
**Status:** new
**Created:** 2026-09-10

## Documents

- [Spec](./spec.md)
- [Plan](./plan.md)
- [Metadata](./metadata.json)

## Summary

Resolves three production-blocking gaps in KopaWee:

1. Unifies auth under NextAuth v5 `CredentialsProvider` — real HttpOnly session
   cookies replace fake localStorage tokens.
2. Adds `middleware.ts` for server-side route protection on `/dashboard`,
   `/admin`, and `/onboarding`.
3. Audits all mutating API routes to validate the authenticated user's identity
   server-side via a shared `apiAuth.ts` helper.
4. Wires up Resend with React Email branded templates for verification, password
   reset, SOS alerts, clearance reminders, and logbook approvals.
5. Completes the Gemini AI assistant (`/api/ai/listing/route.ts`) and connects
   the dashboard widget to the live endpoint.
6. Activates the notification bell with live DB polling and a mark-all-read
   dropdown.
