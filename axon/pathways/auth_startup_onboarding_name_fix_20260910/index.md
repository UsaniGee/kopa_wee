# Pathway: Auth Startup Crash & Onboarding Name Pre-fill Bug

**ID:** `auth_startup_onboarding_name_fix_20260910`
**Type:** Bug
**Status:** in_progress
**Created:** 2026-09-10

## Documents

- [Spec](./spec.md)
- [Plan](./plan.md)
- [Metadata](./metadata.json)

## Summary

Fixes two regressions in the auth/onboarding flow:
1. `NEXTAUTH_SECRET=""` empty string causes a misleading startup crash — guard updated to detect both missing and empty values.
2. Onboarding Step 1 "Full Name" field is blank even though the user provided it at signup — pre-populated from NextAuth session with localStorage fallback.
