/**
 * Canonical reference lists. The single source for the seed script and the API routes.
 * (States and LGAs live in ./nigeriaStatesLgas.ts.)
 */

/** Starter options for the onboarding "field of study" picker; users can add more via /api/options. */
export const DEFAULT_FIELDS_OF_STUDY: readonly string[] = [
  "Computer Science / Software Engineering",
  "Law / Legal Studies",
  "Medicine / Nursing / Public Health",
  "Accounting / Banking & Finance",
  "Electrical / Civil / Mechanical Engineering",
  "Education / Teaching",
  "Mass Communication / Journalism",
  "Biochemistry / Microbiology",
  "Economics / Political Science",
  "Architecture / Fine Arts",
];

/** Standard NYSC orientation-camp packing list, copied into each user's checklist on first visit. */
export const DEFAULT_PACKING_ITEMS: ReadonlyArray<{ name: string; category: string }> = [
  { name: "Call-up Letter (3 colored copies)", category: "documents" },
  { name: "Green Card & Statement of Result", category: "documents" },
  { name: "Medical Fitness Certificate", category: "documents" },
  { name: "Birth Certificate or Age Declaration", category: "documents" },
  { name: "Passport Photographs (12 copies)", category: "documents" },
  { name: "White Shorts (3 pairs)", category: "clothing" },
  { name: "Plain White T-Shirts (3)", category: "clothing" },
  { name: "NYSC Jungle Boot (white parade ground)", category: "clothing" },
  { name: "Crocs / Rubber Slippers (hostel use)", category: "clothing" },
  { name: "Vest / Singlet (5 pairs)", category: "clothing" },
  { name: "Towels (2)", category: "clothing" },
  { name: "Toothbrush & Toothpaste", category: "toiletries" },
  { name: "Soap & Body Wash", category: "toiletries" },
  { name: "Deodorant / Roll-on", category: "toiletries" },
  { name: "Shaving Stick / Razor", category: "toiletries" },
  { name: "Power Bank (10,000mAh minimum)", category: "electronics" },
  { name: "Torchlight & Batteries", category: "electronics" },
  { name: "Extension Cable", category: "electronics" },
  { name: "Waist Bag", category: "essentials" },
  { name: "Water Bottle (1.5L)", category: "essentials" },
  { name: "Padlock for locker", category: "essentials" },
  { name: "Mosquito Net / Repellent", category: "essentials" },
  { name: "First Aid Kit", category: "essentials" },
];

/** Marketplace listing categories (filter chips, post form and AI extraction). */
export const MARKETPLACE_CATEGORIES = ["Pre-Camp Gear", "Furniture", "Electronics", "Kitchenware", "Full House"] as const;
