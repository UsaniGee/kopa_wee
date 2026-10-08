# Plan: Email Delivery Fix, Admin Invite 400 & Auth Error UX Polish

> **Superseded in part (2026-10-08):** email delivery moved from Resend to Nodemailer + Gmail SMTP in [nodemailer_gmail_smtp_20260914](../../pathways/nodemailer_gmail_smtp_20260914/index.md). Resend-specific tasks here are historical; the `sendEmail()` interface and React Email templates still apply.

## Phase 1: Email Delivery Fix
- [x] Task: Fix Resend sender domain in email.ts (changed from `no-reply@kopawee.ng` to `onboarding@resend.dev`)
- [x] Task: Fix email sending in register/route.ts (upgraded to `crypto.randomUUID()`, log warning with link on failure)

## Phase 2: Admin Invite 400 Inline UX
- [x] Task: Add inline error state and rendering to admin invite form (admin/page.tsx)

## Phase 3: Auth Error Message Polish
- [x] Task: Fix handleResendVerification error handling and render resend error message (auth/page.tsx)
- [x] Task: Improve admin login error messages (admin/login/page.tsx)

## Phase 4: Registry & Commit
- [x] Task: Commit, update pathway registry, mark complete
