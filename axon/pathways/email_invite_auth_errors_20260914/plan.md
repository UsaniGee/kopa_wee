# Plan: Email Delivery Fix, Admin Invite 400 & Auth Error UX Polish

## Phase 1: Email Delivery Fix
- [ ] Task: Fix Resend sender domain in email.ts
  - [ ] Change from kopawee.ng to onboarding@resend.dev
- [ ] Task: Fix register/route.ts email handling
  - [ ] Upgrade token to crypto.randomUUID()
  - [ ] Check sendEmail() result and log failure with verificationUrl
- [ ] Phase Verification & Checkpoint: Register a test account, confirm email arrives

## Phase 2: Admin Invite Error UX
- [ ] Task: Add inline inviteError state in admin/page.tsx
  - [ ] Add useState inviteError string
  - [ ] Set inviteError from API 400 data.error
  - [ ] Clear inviteError on success
  - [ ] Render inline below the invite submit button
- [ ] Phase Verification & Checkpoint: Invite existing user, confirm inline error appears

## Phase 3: Auth Error Message Polish
- [ ] Task: Fix silent catch in handleResendVerification (auth/page.tsx)
- [ ] Task: Improve admin login error messaging (admin/login/page.tsx)
- [ ] Phase Verification & Checkpoint: Confirm all error paths show user-facing messages

## Phase 4: Registry & Commit
- [ ] Task: Commit, update pathway registry, mark complete
