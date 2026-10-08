# Spec: Email Delivery Fix, Admin Invite 400 & Auth Error UX Polish

## Overview
Three related bugs discovered in the email + auth system:
1. Users do not receive verification email on sign up
2. Admin invite endpoint returns 400 without clear UI feedback
3. Auth error messages are vague or silently swallowed

## Issue 1 — Sign-up Verification Email Not Delivered
**Root Cause:** `sendEmail()` return value is never checked in `register/route.ts`. If Resend rejects the email (e.g. unverified sender domain `kopawee.ng`), the failure is silently swallowed and the API still returns `success: true`.
**Fix:**
- Check sendEmail() result and log failure explicitly with the verification URL (for dev fallback)
- Change sender from `no-reply@kopawee.ng` → `onboarding@resend.dev` (Resend shared domain — works without custom domain verification)
- Upgrade register route token to use `crypto.randomUUID()` for consistency

## Issue 2 — Admin Invite Returns 400
**Root Cause:** Route correctly rejects inviting an email that already has a KopaWee account (HTTP 400), but the error is only shown in the top `actionMsg` banner, not inline in the invite form.
**Fix:** Add an `inviteError` state that renders inline below the invite submit button.

## Issue 3 — Poor Auth Error Messages
**Root Cause:** Several catch blocks silently swallow errors. Admin login shows generic "Invalid credentials" for all failures. `handleResendVerification` catch block in `auth/page.tsx` is completely silent.
**Fix:** Add meaningful error messages to all catch blocks across `auth/page.tsx` and `admin/login/page.tsx`.

## Acceptance Criteria
- [ ] Signing up triggers a real email delivery to the user's inbox
- [ ] Admin invite shows inline error when email already has an account
- [ ] Network errors on auth page show "Network error. Please try again."
- [ ] Resend verification failure shows an error message
- [ ] Admin login distinguishes invalid credentials from network failures
