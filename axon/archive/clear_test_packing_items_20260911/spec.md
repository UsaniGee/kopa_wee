# Spec: Clear Test Packing Items & DB Pre-Production Clean slate

## Overview
The user requested removing "Test item" from their user dashboard packing checklist prior to pushing to production. Analysis showed that a test item (`name: "Test item"`, `isCustom: false`) was previously seeded into the database for user `cmtmvt2va0000poeqoa0f79lg`. Because it had `isCustom: false`, no delete button was rendered on the UI, and it remained stuck on the user side.

## Requirements
1. Purge all test item records (such as `"Test item"`) from the `PackingItem` table in the database.
2. Verify that `DEFAULT_PACKING_ITEMS` in `src/app/api/packing-items/route.ts` remains pure, authentic, and free of test/dummy items for new users registering in production.
3. Ensure any custom items created by users can be safely deleted if needed.

## Acceptance Criteria
- [x] "Test item" record is permanently deleted from the database.
- [x] No lingering test packing items exist in the database.
- [x] Default packing items list verified clean for production.
