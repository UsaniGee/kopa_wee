# Implementation Plan: Auth-Gated Navbar Navigation & Dashboard Protection (`auth_gated_navbar_navigation_20260902`)

Execution roadmap for updating `authNav.ts`, wiring `Navbar.tsx` links, and adding auth protection to `dashboard/layout.tsx`.

---

## Phase 1: Update Auth Nav Utilities & Navbar Links

- [ ] Task: Update `src/shared/utils/authNav.ts`
  - [ ] Expand `isUserAuthenticated()` to check `kopawee_user_id`, `kopawee_auth_token`, and `kopawee_user_profile`
- [ ] Task: Update `src/shared/components/Navbar.tsx`
  - [ ] Connect all navigation links (`Camp Guide`, `Corper Housing`, `P2P Market`, `Safety SOS`) to `navigateWithAuthCheck`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Protect Dashboard Routes

- [ ] Task: Update `src/app/dashboard/layout.tsx`
  - [ ] Add client-side check in `useEffect` to verify authentication
  - [ ] Redirect unauthenticated visitors to `/auth?mode=signup`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: End-to-End Build & Verification

- [ ] Task: End-to-End Build Verification (`npm run build`)
  - [ ] Verify 100% clean compilation of all 23 routes with zero TypeScript errors
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
