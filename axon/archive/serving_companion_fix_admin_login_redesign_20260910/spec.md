# Spec: Serving Companion Checklist Removal & Admin Login Redesign

> **Retroactive record (written 2026-10-08 by dummy_data_purge_unification_20261008).** No spec or plan was committed when this pathway ran. This file was reconstructed from git history; each task cites the commit that did the work. No tests or phase checkpoints were recorded at the time.

## Overview
- **Bug:** serving corps members were shown the PCM camp packing checklist on the companion page.
- **Feature:** a distinct admin login page: a dark split-panel "ops console" with a red accent.

## Acceptance (as delivered)
- The serving companion view no longer renders `CampEssentialsChecklist`.
- `/admin/login` has its own institutional design, separate from the user auth page.
