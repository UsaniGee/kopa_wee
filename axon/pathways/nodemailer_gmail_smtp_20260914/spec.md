# Spec: Nodemailer Gmail SMTP Email Delivery Migration

## Overview

Replace the `Resend` email provider with `Nodemailer` using Gmail SMTP so verification emails and other transactional emails can be sent without needing a custom domain. The existing email templates (React Email), verification token logic, and `sendEmail()` interface remain unchanged — only the delivery transport layer is swapped.

## Functional Requirements

1. Install `nodemailer` and `@types/nodemailer`.
2. Update `src/shared/lib/email.ts` to use a Nodemailer Gmail SMTP transporter instead of Resend.
3. Add required `.env` variables: `GMAIL_USER` and `GMAIL_APP_PASSWORD`.
4. Preserve the same `sendEmail({ to, subject, template })` interface so no call-sites break.
5. Graceful degradation: if `GMAIL_USER` or `GMAIL_APP_PASSWORD` are not configured, log a warning and return `{ success: false, error: "EMAIL_NOT_CONFIGURED" }`.
6. Comment out (not delete) `RESEND_API_KEY` and `RESEND_FROM_EMAIL` env vars as a future migration path.

## Non-Functional Requirements

- No changes to existing API routes or email templates.
- Build must pass (`npm run build`).

## Acceptance Criteria

- [ ] A user who registers receives a verification email in their Gmail inbox.
- [ ] The `sendEmail` function logs clearly on success and failure.
- [ ] `.env` is updated with Gmail SMTP vars and setup comments.

## Out of Scope

- Changing email templates.
- Adding new email types.
- Setting up a custom domain or Resend.
