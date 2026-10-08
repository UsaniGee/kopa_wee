# Plan: Theme FOUC, System Default, Admin Design, Dropdown Fix & Serving Tracker

> **Retroactive record (written 2026-10-08 by dummy_data_purge_unification_20261008).** No spec or plan was committed when this pathway ran. This file was reconstructed from git history; each task cites the commit that did the work. No tests or phase checkpoints were recorded at the time.

## Phase 1: Implementation
- [x] Task: Inline theme script in `src/app/layout.tsx` so the theme applies before first paint (FOUC fix) 1da4525
- [x] Task: Three-state light/dark/system toggle in `src/shared/components/ThemeToggle.tsx` 1da4525
- [x] Task: Theme-aware admin dashboard and login with the Scandi refresh (`src/app/admin/page.tsx`, `src/app/admin/login/page.tsx`) 1da4525
- [x] Task: `select` padding-right and native arrow in the `globals.css` base layer 1da4525
- [x] Task: Serving packing list reframed as a stock tracker (`src/app/dashboard/page.tsx`) 1da4525
- [x] Task: Mark the pathway complete 9594376
- ⏭ Not performed: Task: Phase Verification & Checkpoint (none recorded at the time)
