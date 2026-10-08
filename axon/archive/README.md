# Pathway Archive

Every finished or superseded KopaWee pathway from **2026-08-12 to 2026-09-14**, archived on 2026-10-08 by [dummy_data_purge_unification_20261008](../pathways/dummy_data_purge_unification_20261008/index.md). Live pathways are in the [registry](../pathways.md).

## Read this before relying on these records

- **Records were reconciled, not rewritten.** Statuses and open tasks were checked against the code on 2026-10-08. Tasks marked `⏭ Deferred` or `⏭ Not performed` never happened; they were not ticked after the fact. Specs and plans labelled *retroactive* were rebuilt from git history.
- **Traceability is thin before 2026-10-08.** Most tasks have no recorded commit SHA, there were no git notes, and the only phase checkpoint is `957af04`.
- **Design history.** The design went flat borderless → Rally Padel → soft-edge rounded and bordered (planned) → **sharp-edged and bordered**. The last step came from commit `c3a6671` (2026-08-31), which added a `border-radius: 0rem` base layer and removed 34 `rounded-*` classes inside a pathway-completion chore, with no pathway planning it. The product owner ratified sharp + bordered as canonical on 2026-10-08.
- **"Dummy data removed" claims were wrong.** The 2026-10-08 audit found about 250 dummy-data and contract findings after three pathways had reported it gone (flagged ⚠ below). See [the audit](../pathways/dummy_data_purge_unification_20261008/audit.md).

## Pathways (45)

| Created | Pathway | Status | Notes |
|---|---|---|---|
| 2026-08-12 | [KopaWee Frontend MVP](./kopa_wee_frontend_mvp_20260812/index.md) | completed |  |
| 2026-08-19 | [Hero Layout Fix](./hero_layout_fix_20260819/index.md) | completed | Checkpoint never performed |
| 2026-08-21 | [Flat Borderless Design Sweep (Full App Audit)](./flat_borderless_sweep_20260821/index.md) | superseded | Superseded: canonical design is sharp + bordered |
| 2026-08-21 | [Flat Borderless Design Refactor](./flat_design_refactor_20260821/index.md) | superseded | Superseded: canonical design is sharp + bordered |
| 2026-08-21 | [Modal & Carousel Fix](./modal_carousel_fix_20260821/index.md) | completed |  |
| 2026-08-21 | [Progressive Onboarding, NYSC Journey Lifecycle & Camp Essentials](./progressive_onboarding_lifecycle_20260821/index.md) | completed |  |
| 2026-08-21 | [Rally Padel Inspired Design Refactor](./rally_padel_refactor_20260821/index.md) | superseded | Superseded: canonical design is sharp + bordered |
| 2026-08-21 | [Role-Based Dashboards & App Modules](./role_dashboards_20260821/index.md) | completed | 4 visual checks never performed |
| 2026-08-27 | [Comprehensive Codebase & Documentation Alignment Audit](./comprehensive_alignment_audit_20260827/index.md) | completed |  |
| 2026-08-27 | [Replace Lucide React with React Icons Dependency Migration](./replace_lucide_with_react_icons_20260827/index.md) | completed |  |
| 2026-08-27 | [Smart AI Engine, Location Recommendations & Core Platform Interactivity](./smart_ai_location_engine_20260827/index.md) | completed |  |
| 2026-08-27 | [Modern Soft-Edge & Bordered Design System Alignment](./soft_edge_bordered_design_20260827/index.md) | completed | Borders kept; radius rules superseded (0rem since `c3a6671`) |
| 2026-08-31 | [Form Validation & Loading UX Enhancements](./auth_onboarding_loading_validation_20260831/index.md) | completed |  |
| 2026-08-31 | [Backend API, Prisma PostgreSQL Database & NextAuth RBAC Infrastructure](./backend_api_20260831/index.md) | completed |  |
| 2026-08-31 | [Dynamic Smart Form Options & Self-Learning Backend](./dynamic_smart_options_20260831/index.md) | completed |  |
| 2026-08-31 | [Dynamic User Profile & Header Sync](./dynamic_user_header_20260831/index.md) | completed |  |
| 2026-08-31 | [Fresh Auth & Onboarding Clean Slate](./fresh_auth_clean_slate_20260831/index.md) | completed |  |
| 2026-08-31 | [Google OAuth 2.0 Authentication Integration](./google_oauth_auth_20260831/index.md) | completed |  |
| 2026-08-31 | [Purge Mock Data & Dynamic Live User Flow](./purge_dummy_data_20260831/index.md) | completed | ⚠ Claimed complete, but much dummy data remained; finished by `dummy_data_purge_unification_20261008` |
| 2026-08-31 | [Purge Pre-Selected Options & Checked Defaults](./purge_preselected_options_20260831/index.md) | completed | ⚠ Fabricated onboarding defaults remained; finished by `dummy_data_purge_unification_20261008` |
| 2026-09-02 | [Dynamic Auth-Aware Navbar Action Buttons](./auth_aware_navbar_buttons_20260902/index.md) | completed |  |
| 2026-09-02 | [Auth-Gated Navbar Navigation & Dashboard Protection](./auth_gated_navbar_navigation_20260902/index.md) | completed |  |
| 2026-09-02 | [Prisma Connection Pool Timeout, React Render Warning & Image Sizes Fix](./bug_fixes_prisma_react_images_20260902/index.md) | completed |  |
| 2026-09-02 | [Cascading Backend States/LGAs & Clean Placeholders](./cascading_states_lgas_clean_placeholders_20260902/index.md) | completed |  |
| 2026-09-02 | [Classified Ads Posting, Product Owner `/admin` Dashboard & Email Verification](./classified_ads_admin_email_verify_20260902/index.md) | completed |  |
| 2026-09-02 | [Hydration, Theme & Scroll UX Fix](./hydration_theme_scroll_fix_20260902/index.md) | completed |  |
| 2026-09-02 | [Smart AI Posting, Backend States API, Roommate System & Posting Fixes](./smart_ai_posting_backend_states_roommates_20260902/index.md) | completed |  |
| 2026-09-04 | [NYSC Platform — Clearance, Packing Checklist, Role Status & Subscription Implementation](./clearance_checklist_role_subscription_20260904/index.md) | completed |  |
| 2026-09-04 | [NYSC Platform — Final Updates to Dashboard, Account Settings & Subscription](./dashboard_settings_subscription_20260904/index.md) | completed |  |
| 2026-09-10 | [Auth Startup Crash & Onboarding Name Pre-fill Bug](./auth_startup_onboarding_name_fix_20260910/index.md) | completed |  |
| 2026-09-10 | [Security Hardening, Unified Auth & Platform Completion](./security_hardening_unified_auth_20260910/index.md) | completed | Reconciled 2026-10-08: 143 verified, 36 deferred (tests, 2 email triggers); Resend parts superseded by Nodemailer |
| 2026-09-10 | [Serving Companion Checklist Removal & Admin Login Redesign](./serving_companion_fix_admin_login_redesign_20260910/index.md) | completed | Spec and plan reconstructed from git history |
| 2026-09-10 | [Theme FOUC, System Default, Admin Design, Dropdown Fix & Serving Tracker](./theme_fouc_admin_design_ux_fixes_20260910/index.md) | completed | Spec and plan reconstructed from git history |
| 2026-09-11 | [Admin Dashboard Responsive Header — Icon-Only Buttons on Mobile](./admin_navbar_mobile_icons_20260911/index.md) | completed |  |
| 2026-09-11 | [Clear Test Packing Items & DB Pre-Production Clean slate](./clear_test_packing_items_20260911/index.md) | completed | ⚠ Packing lists still duplicated 3×; unified by `dummy_data_purge_unification_20261008` |
| 2026-09-11 | [User-Adjustable Draggable Theme Toggle for Mobile Navigation](./draggable_user_adjustable_theme_toggle_20260911/index.md) | completed |  |
| 2026-09-11 | [Dynamic Clearance Metric Card & Responsive SCM Role Badge](./dynamic_clearance_metric_scm_badge_20260911/index.md) | completed |  |
| 2026-09-11 | [Purge Hardcoded Serving Dashboard Banner Data & Dynamic User Fetching](./dynamic_serving_dashboard_data_20260911/index.md) | completed |  |
| 2026-09-11 | [User Navigation Clean-Up — Hide Mobile Top Sub-Nav & Move Account Settings to User Profile Icon](./navbar_mobile_cleanup_profile_settings_20260911/index.md) | completed |  |
| 2026-09-11 | [Navbar Role Badge — Responsive Mobile Abbreviation (SCM)](./navbar_role_badge_mobile_20260911/index.md) | completed |  |
| 2026-09-11 | [Change Password, Role Flash Fix, Admin Invite UI & Roommate Engagement Tracking](./password_flash_invite_roommate_20260911/index.md) | completed | Spec, plan and index reconstructed from git history |
| 2026-09-11 | [Remove Duplicate Mode Switcher from Admin Dashboard](./remove_duplicate_admin_theme_switcher_20260911/index.md) | completed |  |
| 2026-09-14 | [Admin Invites Tab — Missing Navigation Button](./admin_invite_tab_missing_20260914/index.md) | completed |  |
| 2026-09-14 | [Email Delivery Fix, Admin Invite 400 & Auth Error UX Polish](./email_invite_auth_errors_20260914/index.md) | completed | Resend parts superseded by Nodemailer |
| 2026-09-14 | [Roommate Request Cancel Alert & Missing Edit UI Fix, Document Upload, & Calendar Sync](./roommate_cancel_edit_fix_20260914/index.md) | completed |  |
