# Plan: Nodemailer Gmail SMTP Email Delivery Migration

## Phase 1 — Install Nodemailer

- [x] Task: Install `nodemailer` and `@types/nodemailer` via npm/pnpm

## Phase 2 — Swap Transport Layer in `email.ts`

- [x] Task: Replace Resend import with Nodemailer Gmail SMTP transporter
  - [x] Create transporter with `nodemailer.createTransport({ service: 'gmail', auth: { user, pass } })`
  - [x] Render React Email template to HTML (keep existing `@react-email/render` call)
  - [x] Send via `transporter.sendMail()`
  - [x] Handle errors and graceful degradation (no credentials → warn + return `EMAIL_NOT_CONFIGURED`)

## Phase 3 — Environment Variables

- [x] Task: Add `GMAIL_USER` and `GMAIL_APP_PASSWORD` to `.env`
- [x] Task: Add setup instructions as comments in `.env`

## Phase 4 — Verification

- [ ] Task: User registers, checks inbox, confirms email arrives
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
