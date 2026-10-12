# KopaWee Audit: Dummy Data, Frontend↔Backend Contracts and AXON Records (2026-10-08)

Read-only audit of the whole repository. Severity: **C** = Critical, **H** = High, **M** = Medium, **L** = Low.
Paths are relative to the repo root.

---

## A. Critical: fabricated or broken data written to the database

| # | Where | Problem | Sev |
|---|---|---|---|
| A1 | `src/app/onboarding/page.tsx:203` | Every user sends `stateCode: "LA/26A/1234"`, and `User.stateCode` is `@unique` (`prisma/schema.prisma:97`). The first user keeps the fake code. For every later user `/api/users/role` fails with a unique-constraint error (P2002), so nothing is saved: role, deployedState, lga and ppaName are all lost. The client never checks `res.ok`. | C |
| A2 | `src/app/onboarding/page.tsx:82,87,201-202` | `deployedState` is always `"Lagos"` and `lga` is always `"Ikeja"`, because there is no picker. `/api/states` is fetched (`:50-59`) but never rendered. | H |
| A3 | `src/app/onboarding/page.tsx:194-212` + `src/app/api/users/role/route.ts` | Onboarding only sets the old `role` field, never `nyscStatus`. `RoleContext.setRole` is a no-op, so users who pick "Serving" or "Alumni" still see PCM screens and get a 403 from `/api/clearance`. Phone, institution, fieldOfStudy, interests, batch and stream are collected but never saved. | H |
| A4 | `src/app/dashboard/safety/page.tsx:62-65` | Every SOS alert is stored at Lagos/Ikeja (6.5244, 3.3792). There is no geolocation. | C |
| A5 | `src/app/dashboard/safety/page.tsx:54,130-139` + `src/app/api/safety/sos/route.ts:41,56` | The UI and API both say "trusted contacts and NYSC reps notified", but the route only emails the user who pressed SOS, and the "contacts" are hard-coded in the page. The UI shows success before the request even returns. | C |
| A6 | `src/app/api/cron/journey-status/route.ts:67,116,208,242` | Writes `changedBy: "SYSTEM"`, but `UserStatusHistory.changedBy` must point to a real `User.id` (`schema.prisma:209-210`). The transaction always rolls back, so automatic PCM→SERVING→ALUMNI changes never happen. `vercel.json` has no `crons` entry either. POST `:158-275` has **no auth** and accepts any userId. | C |
| A7 | `prisma/seed.ts:96-111` | Seeds `admin@kopawee.ng` / `KopaWeeAdmin2026!`, prints the password to the console, and resets it on every seed run. | C |
| A8 | `src/app/dashboard/marketplace/page.tsx:448` | With no photo, a stock Unsplash shoe image is saved as the listing image. | H |
| A9 | `src/app/dashboard/accommodation/page.tsx:601-602` | Always saves `splitInfo: "Roommate Split Preferred"` and an Unsplash apartment photo. | H |
| A10 | `src/app/dashboard/workplace/page.tsx:39-40,43` | Every logbook entry saves "Completed daily PPA duties & attendance clock-in." and 8 hours. There is no summary input. The UI shows success even when the save fails. | H |
| A11 | `src/app/api/ai/listing/analyse/route.ts` (whole file) | Fake "AI": keyword matching with canned titles ("Binatone/OX Standing Fan", "NYSC Plain White Rubber Shoes"). It defaults to `state: "Lagos"` and `lga: "Ikeja"` and returns LGAs that don't exist (Yaba, Vi, Lekki). The description "Clean, verified item…" is made up. **No auth.** Its output fills the marketplace form (`marketplace/page.tsx:410-412`). | H |
| A12 | `src/app/dashboard/page.tsx:525-536` + `src/app/api/users/status/route.ts:8` | "Transition to Alumni" always fails, because SERVING→ALUMNI isn't allowed (`SERVING: []`). | H |
| A13 | `src/app/admin/login/page.tsx:19,63` | The email field is pre-filled with `admin@kopawee.ng`. Sign-out is a raw POST without a CSRF token, so it doesn't sign the user out. | H |

## B. Dashboard dummy data (`src/app/dashboard/**`): 109 findings (57 H)

### B1. `dashboard/page.tsx` (Overview, all roles)
- Fake leave requests "John Okoh", "Amina Bello" `:639-642`; approving or rejecting only changes local state `:673-675`.
- PCM: "14 Days Left", "KADUNA NYSC Permanent Camp, Mando" `:764-765`; "Lagos ➔ Kaduna", "Jibowu Park Aug 28" `:782-783`. These should come from `/api/users/journey`.
- "Allawee Savings ₦77,000" `:969`, "CDS Attendance 92%" `:970`, "Active & Safe, last check-in 2h ago" `:971`.
- PPA view: "Grace High School PPA Hub" `:1048`, "Managing 8 Corps Members" `:1051`, a "Add Corper Slot" button that does nothing `:1054`.
- CDS view: "Editorial & Publicity CDS Hub" `:1118`, "Ikeja LGA · 42 members" `:1121`, "₦42,000 dues" `:1132`, "2 Projects" `:1138`, "Thursday 9AM Ikeja Secretariat" `:1144`.
- Inspector view: "Ikeja LGA Biometric Command Center" `:1165`, "1,600 corps members" `:1168`, "1,420/1,600, 88.7%" `:1178-1180`, "148 approved / 12 pending" `:1184`, "HQ Server Ping 12ms" `:1190`.
- Made-up fallbacks: `isEligible ?? true` `:579`, `completedCount || 12` / `|| 1` `:570,606`, "POP approaching" whenever any end date is set `:960`.
- Copy promising things that don't exist: "trained on official NYSC Bye-laws" `:805`, alumni "Job Bank / CV builder" `:1231`.

### B2. `dashboard/marketplace/page.tsx`
- `SAMPLE_LISTINGS` (7 fake sellers) `:43-51` and a partial `NIGERIAN_STATES` list `:53`, both unused.
- Display fallbacks: price `|| 5000` `:97`, `state || "Lagos"` `:98`, `distanceKm: 1.5` `:100`, `"Verified Corper"` `:101`, a hard-coded verified badge `:102-103`, "Good Condition" `:105`, a stock image `:107`.
- Unused `handlePostItem` full of "Lagos"/"Ikeja"/stock-image defaults `:116-168`.
- "Contact Seller" only changes its label `:292-296`, even though the API returns `seller.phone`.
- "Report" opens nothing and pretends to submit with `setTimeout` `:176-189,84-87`.
- Area and street inputs are never sent `:334-335,672-698`.

### B3. `dashboard/accommodation/page.tsx`
- `distanceKm: 1.5` drives the distance slider `:119,143,219-232`.
- Badge says "verified" `:120` while the card also says "Unverified" `:271-273`. `verificationStatus` is never used.
- Stock image fallback `:123`.
- Report pretends to submit with `setTimeout` `:148-161`.
- Roommate "WhatsApp" button only shows `alert("…Phone")` `:384-389`, even though `/api/roommates/interest` exists.
- The PostLodgeModal is rendered twice `:398-408` and `:526-536`.
- Lodge cards never show `contactPhone`.

### B4. `dashboard/safety/page.tsx`
- Hard-coded contacts "Mr. & Mrs. Okeke", "Corper President Ikeja", "NYSC HQ" `:36-40`, kept only in local state.
- "+ Add Contact" and "Configure Trip" buttons have no modal `:42-47,162-184`.
- `tripActive = true` `:34`, "Lagos State → Kaduna NYSC Camp" `:48-50`, "Convoy on schedule (12m ago)" `:159`.

### B5. `dashboard/community/page.tsx` (CDS)
- Fake members Tunde, Aisha, Emeka, Blessing `:20-25`. Attendance is marked in local state only `:27-29`.
- Fake dues history `:35-39`. "Education & Publicity CDS Group" `:66` (the overview page uses different names). "Ikeja · Thursday 9AM · 42 members" `:69`. "Download PDF" does nothing `:73-76`.

### B6. `dashboard/workplace/page.tsx`
- Fake leave requests `:51-54` (unused). "Grace High School PPA Management" for everyone `:128`. PPA and alumni users get the corper logbook UI `:117-183`.

### B7. `dashboard/companion/page.tsx`
- Fake documents "Call-Up Letter Verified Aug 10" `:48-53`. The "vault" is localStorage only and the file itself is discarded `:60-100`. "Encrypted vault" copy `:186-189`. The download icon does nothing `:215`.
- Calendar sync uses hard-coded "Ikeja LGA Secretariat" and a fixed date `:72-73`, and says "Synced" `:76`. Next clearance is hard-coded "Thu Sep 25 2PM" `:163`.
- Inspector stats "1,420/1,600", "180 Corpers", "12ms" `:110-129`.

### B8. `dashboard/settings/page.tsx`
- The subscription card is hard-coded `:383-404`, although `/api/subscription` exists.
- PPA name, LGA, state code and call-up number can't be edited, but other pages need them.

### B9. `dashboard/layout.tsx:19-53`
- Navigation labels promise features that don't exist: "Leave Requests", "Attendance, Projects & Dues", "Biometric Clearance Portal", "Career & Gigs".

## C. Rest of the frontend: 79 findings (9 H)

- **Landing `src/app/page.tsx`**:
  - Made-up stats "50,000+ Active Corps Members", "100% Offline Ready Vault" `:49-54`.
  - Roadmap implies an NYSC HQ API partnership `:243-248`.
  - Invented "impact calculator" formula `:306-320`.
  - Advertised features that don't exist `:361-369`.
  - "Join thousands" `:397`; typo "Allawee" `:276`.
- **`src/shared/data/services.ts`**: fake preview records (unrendered) with fake state codes "NY/25A/1429" `:174` and "Grace Okafor LA/25B/0812" `:204`. Highlights that oversell: encrypted vault, push notifications, QR scanner, police directory, bye-law training.
- **`src/app/auth/page.tsx`**: writes `kopawee_user_email/name/active_role` before verification and after sign-in `:79-81,119-125`. Redirect uses `kopawee_active_role || "serving"` `:131`. Google redirect is hard-coded to "serving" `:177`. Email sign-ups skip onboarding (only Google goes there, `:176`).
- **`src/app/admin/page.tsx`**:
  - Stale TODO `:101`.
  - Stock-image fallbacks `:408,468`; `"Corper User"` `:488`.
  - Lodges list also renders on the users and invites tabs `:456`.
  - Admins can only look up users by cuid (no email search).
- **`src/app/admin/login/page.tsx`**: false "sessions logged and audited" claim `:118-134`.
- **`src/shared/components/DashboardNavbar.tsx`**:
  - Name comes from localStorage and is invented ("Corper <x>") `:112-131`.
  - Search box does nothing `:172-181`.
  - Falls back to "Serving" `:43`.
- **`src/shared/utils/authNav.ts:28-43`**: `isUserAuthenticated()` reads a key nothing writes anymore. It drives Navbar/Footer auth UI: stale "Dashboard" for signed-out users, "Sign in" after Google login.
- **`src/shared/context/RoleContext.tsx`**: `setRole` no-op `:41`; ignores the old `SERVING_CORPER`/`ALUMNI` role values `:9-16`.
- **`src/shared/components/CampEssentialsChecklist.tsx:31-69`**: a third packing list that conflicts with `/api/packing-items`. Custom items are lost on reload.
- **`src/shared/components/RoleOnboardingModal.tsx`**: dead component; delete.
- **Footer**: claims "Push Notification Engine", "Encrypted Vault", "NiYA Job Integration" `:84-90`; "Smart Clearance" link points to the wrong page `:44`.
- **Emails**: VerificationEmail says "expires in 24h", but tokens never expire `:81`. AdminInviteEmail claims audit logging `:44`. `ClearanceDueEmail` and `LogbookApprovedEmail` are never sent.
- **Misc**: `public/{file,globe,next,vercel,window}.svg` and 4 `lagos-*.jpg` are unused. `next.config.ts` allows Unsplash only for fallbacks. `layout.tsx:20` title says "KopaWee+". `auth.ts:118` invents "Google Corper" as a name.

### localStorage keys
| Key | Verdict |
|---|---|
| `kopawee_user_id` | Never written, still read (authNav). Delete. |
| `kopawee_user_email`, `kopawee_user_name` | A copy of the session. Delete. |
| `kopawee_active_role` | A copy of the role that can disagree with the DB. Delete. |
| `kopawee_user_profile` | Written but never read; stores the fake onboarding defaults. Delete. |
| `kopawee_offline_documents` | The only thing behind the "vault". Replace or remove the feature. |
| `kopawee_theme`, `kopawee_theme_pos` | Real UI preferences. Keep. |

## D. Backend dummy data and stubs

- `api/ai/listing/route.ts`: rate limiter lives in memory `:10-31`; model and limits hard-coded `:13,92`; `context` field unused; the path name is misleading.
- `api/auth/resend-verification`: rate limiter in memory `:14`; says "sent" even when sending failed `:62-77`; reveals that the account is verified `:44`.
- `api/auth/register`:
  - Clients can choose privileged roles (EMPLOYER, CDS_EXEC, LGA_INSPECTOR) `:13`.
  - Password minimum is 6 here but 8 elsewhere `:12`.
  - The verification token never expires `:54`.
  - The token URL is written to the server log `:96`.
- The `NEXTAUTH_URL || "http://localhost:3000"` fallback appears in 4 routes. Production emails would link to localhost.
- `api/admin/invite`: says success even when the email failed `:47-61`; expiry duplicated `:32,54`; `void invite` leftover.
- `api/states`: seeds 37 states and 774 LGAs during a public GET `:15-45`. On any DB error it returns `success:true` with fake IDs `:65-86`.
- `api/options`: **unauthenticated POST** writes any FormOption `:57-97`; the field-of-study defaults are seeded lazily.
- `api/packing-items`: `DEFAULT_PACKING_ITEMS` is copied in 3 places (the route, the seed, and the component list). The seeded `default_packing_item` rows are never read. Duplicate inserts on concurrent first loads.
- `api/clearance`: still reads body `userId`; limits hard-coded.
- `api/users/status`: still *requires* body `userId` `:13`.
- `api/accommodation` and `api/marketplace` GET: seller/owner **email, phone and stateCode exposed without auth**.
- `api/workplace/logbook`: `hoursWorked` defaults to 8; no approval flow; duplicate daily entries allowed.
- `api/health`: always says "ok" and reports version 1.0.0 (package.json says 0.1.0).
- `api/subscription`: writes inside a GET; no client calls it.
- `auth.ts`:
  - If the Google DB upsert fails, the error is swallowed and the token ends up with the provider's ID instead of the database ID `:126-136`.
  - `GOOGLE_CLIENT_ID!` is not checked at startup.
- `shared/lib/email.ts`: Gmail service hard-coded and the transporter rebuilt on every send. `resend` is still in `package.json`.
- Marketplace images are stored as base64 strings in `String[]` with no upload storage and no size limit.

## E. Frontend↔backend contract mismatches

| Client | Route | Mismatch | Sev |
|---|---|---|---|
| onboarding `:196-212` | PATCH /api/users/role | A1–A3 above | C |
| dashboard `:525` | POST /api/users/status ALUMNI | Always 400 | H |
| dashboard `:705-716` | POST /api/users/status SERVING | Saves, but the UI stays stale for up to 5 min (setRole no-op) | M |
| dashboard `:860-874` | GET /api/users/journey | Reads `name`, `state` and `session.user.stateCode`, none of which the route returns | L |
| dashboard `:230` | GET /api/packing-items | Spinner never stops if userId is empty | L |
| dashboard (several) | packing-items PATCH/POST/DELETE | Responses never checked; optimistic UI never rolls back | L |
| marketplace `:124-160` | POST /api/marketplace | Hard-coded Ikeja, stock image, "Lagos"; inserted into the live list as "verified" although the server set it to PENDING | H |
| marketplace `:437` | POST /api/marketplace | base64 images straight into the DB; LGA may be fake | M |
| accommodation `:87,309` | GET /api/roommates?my=true | MATCHED requests shown as active; edit/cancel fails; interests never shown | M |
| accommodation `:385` | GET /api/roommates | Reads `user.phone`, which the route doesn't return | M |
| safety `:57-67` | POST /api/safety/sos | Fixed location; response never checked | C |
| workplace `:34-43` | POST /api/workplace/logbook | No `res.ok` check; made-up summary | M |
| CampEssentialsChecklist | /api/checklist | A second checklist system running alongside PackingItem | M |
| admin/login `:63` | POST /api/auth/signout | Missing CSRF token, so the user stays signed in | M |
| admin `:176` | POST /api/admin/invite | Says success even when the email failed | M |
| Leftover client ids | many | `sellerId`, `ownerId`, `userId` still sent (ignored by the server) at marketplace `:128,441`, accommodation `:593,859`, safety `:61`, settings `:103`, dashboard `:230,250,260,271,292,482,503,529,665,709` | L |

**Endpoints nothing calls:**
- `/api/subscription`
- `/api/roommates/interest` (POST, PATCH, GET)
- `/api/cron/journey-status` (POST, and GET is unscheduled)
- `/api/health` (monitoring only)

**Schema fields and models never written or never read:**
- Models and fields: `CDSEvent`; `User.callUpNo`; `User.phone`; `User.stateOfOrigin`; `AccommodationListing.verificationStatus`; logbook approval (`employerId`, APPROVED/REJECTED); `SOSAlert.status` (RESOLVED); `UserSubscription.endsAt`; `SubscriptionPlan.isEarlyAccess`; `DateSource` values other than USER_PROVIDED; `RoommateRequest.moveInDate`; the `default_packing_item` FormOption rows.
- Statuses: `ListingStatus` RESERVED, SOLD and AVAILABLE are never set.

**Features with no model or API at all:** trusted contacts, trips and check-ins, document vault and file storage, leave requests, CDS groups/attendance/dues/projects, listing reports, PPA employer roster, LGA inspector aggregates, savings stats, a GET for SOS status, a search API.

## F. AXON records

### F1. Registry and folders
- 46 pathways registered. All folders exist, there are no unregistered folders, and there are no duplicates.
- 3 registry links point to `plan.md` instead of `index.md`: `kopa_wee_frontend_mvp_20260812`, `progressive_onboarding_lifecycle_20260821`, `flat_borderless_sweep_20260821`.
- 3 stray blank-line gaps in `axon/pathways.md`.
- **No plan.md**: `theme_fouc_admin_design_ux_fixes_20260910`, `serving_companion_fix_admin_login_redesign_20260910` (index and metadata only); `password_flash_invite_roommate_20260911` (metadata only).
- **No metadata.json**: `modal_carousel_fix_20260821`. **No index.md**: `flat_borderless_sweep_20260821`.

### F2. Status drift
- `metadata.json` status was never updated: **44 of 45 completed pathways** say `new` (27) or in progress (17). The in-progress value is spelled two ways: `in_progress` and `in-progress`. Only `roommate_cancel_edit_fix_20260914` says `completed`.
- Registry marks these done while their plans still have open tasks:

| Pathway | Open tasks |
|---|---|
| `security_hardening_unified_auth_20260910` | 147 (most were verified as built in the review on 2026-10-06) |
| `soft_edge_bordered_design_20260827` | 0 of 8 ticked |
| `role_dashboards_20260821` | 5 |
| `hero_layout_fix_20260819` | 1 |

### F3. Traceability (`axon/workflow.md` requires a SHA and a git note per task)
- 659 tasks are ticked done, but only **4 commit SHAs** are recorded in any plan (all 4 are valid).
- **0 git notes.** No phase checkpoints except `957af04`.
- Commit messages like "New changes" (`051cb15`) don't follow the commit format.

### F4. Decisions that contradict each other
| Topic | Conflicting pathways | Reality in code | Verdict |
|---|---|---|---|
| Design system | `flat_design_refactor_20260821` + `flat_borderless_sweep_20260821` (flat, borderless) vs `soft_edge_bordered_design_20260827` (rounded + bordered) vs an unplanned change in commit `c3a6671` (2026-08-31, labelled as a backend_api completion chore: added the 0rem base layer, removed 34 `rounded-*` classes) | 247 `border border-*` uses; **zero** `rounded-xl/2xl/3xl`; `globals.css` base layer forces `border-radius: 0rem`. Sharp + bordered is what ships. | *(Corrected 2026-10-08 during Phase 2.)* Owner confirmed **sharp + bordered** as canonical. Flat/rally pathways superseded; the soft-edge radius rules superseded, its borders kept; guidelines rewritten in Phase 8 |
| Design inspiration | `rally_padel_refactor_20260821` | Superseded by soft-edge | Mark superseded |
| Email provider | security_hardening and email_invite_auth_errors (Resend) vs nodemailer_gmail_smtp | Nodemailer in code; `resend` still in package.json | Resend plans superseded; remove the dependency |
| Dummy data | `purge_dummy_data_20260831`, `purge_preselected_options_20260831`, `clear_test_packing_items_20260911` say dummy data is gone | Sections A–C show 180+ dummy-data findings | Claims are false; reopen the work in the new pathway |
| Icons | `replace_lucide_with_react_icons_20260827` | 0 lucide references | Consistent ✓ |

### F5. Docs vs code
| Claim | Where | Reality | Verdict |
|---|---|---|---|
| Email = Resend | `axon/tech-stack.md:18` | Nodemailer + Gmail | False |
| Offline vault = IndexedDB | `tech-stack.md:24` | No IndexedDB anywhere; localStorage only | False |
| Package manager "pnpm / npm" | `tech-stack.md:27` | Only `pnpm-lock.yaml` exists | Partial; say pnpm |
| Zod validation | `tech-stack.md:20` | Used in 20 files | True |
| Route protection `src/proxy.ts`, Gemini 3.8 Flash | `tech-stack.md` | Updated 2026-10-06 | True |
| Colour tokens #66bb6a / #a5d6a7 / #1b5e20 / #ffffff / #e8f5e9 | `axon/product-guidelines.md` table | `globals.css:49-64` uses #1c5d2b / #eaf5ed / #164a22 / #eaf5ed / #dcece1 | False: none match |
| "Obsidian Black & NYSC Emerald" | `product.md` | Mint/forest-green tokens | Partial |
| 6 role dashboards (PCM, Serving, CDS Exec, Employer/PPA, LGA Inspector, Alumni) | `product.md` | CDS, PPA and Inspector views are fully hard-coded mockups; no onboarding path sets those roles | False for 3 of 6 |
| CDS Hub, PPA leave requests, Inspector portal, Job Bank/CV builder, Travel monitor, SOS broadcast to contacts, Document vault | `product.md` pillars 6–8 | Mockups or not built (sections B and D) | False |
| Marketplace, accommodation, roommates, clearance, packing checklist, logbook, notifications, AI assistant | `product.md` | Built (with the dummy-data defects above) | True |
| TDD, >80% coverage, git notes, checkpoints | `axon/workflow.md` | No test framework, 0 tests, 0 notes | False |
| "Development Commands" section | `workflow.md` | Still the template placeholder | Not filled in |
