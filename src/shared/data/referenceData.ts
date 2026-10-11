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

export interface PackingItemTemplate {
  name: string;
  category: string;
  /** Short tip shown under the item; not stored per user. */
  note?: string;
  /** Warning shown in amber, e.g. what an item does not replace. */
  disclaimer?: string;
}

/**
 * The one NYSC orientation-camp packing list. Copied into each user's PackingItem rows on first
 * visit (/api/packing-items); notes are looked up by name when the list is shown.
 * Items added later only reach users whose checklist is created after the change.
 */
export const DEFAULT_PACKING_ITEMS: ReadonlyArray<PackingItemTemplate> = [
  { name: "Call-up Letter (3 colored copies)", category: "documents", note: "Do not laminate the original." },
  { name: "Green Card & Statement of Result", category: "documents", note: "Print the green card from the NYSC portal; result signed by the registrar." },
  { name: "Medical Fitness Certificate", category: "documents", note: "From a government or military hospital." },
  { name: "Birth Certificate or Age Declaration", category: "documents" },
  { name: "Passport Photographs (12 copies)", category: "documents", note: "Recent, white background." },
  { name: "Clear Document Folder", category: "documents", note: "Keeps papers dry and together in the registration line." },
  { name: "White Shorts (3 pairs)", category: "clothing", note: "Plain white, no coloured logos." },
  { name: "Plain White T-Shirts (3)", category: "clothing", note: "Round-neck; extras help because drills are daily." },
  { name: "Plain White Socks (3–6 pairs)", category: "clothing", note: "All white, no stripes." },
  { name: "White Canvas / Tennis Shoes", category: "clothing", note: "Light and easy to wash after morning drills." },
  { name: "NYSC Jungle Boot (white parade ground)", category: "clothing" },
  {
    name: "Crocs / Rubber Slippers (hostel use)",
    category: "clothing",
    note: "For the hostel and bathroom.",
    disclaimer: "Not a replacement for white parade shoes. Follow camp officials' instructions.",
  },
  { name: "Vest / Singlet (5 pairs)", category: "clothing" },
  { name: "Towels (2)", category: "clothing" },
  { name: "Bedsheet & Pillowcase", category: "bedding", note: "Single-bed size for the camp bunk." },
  { name: "Light Blanket", category: "bedding", note: "Early mornings and nights can be cold." },
  { name: "Toothbrush & Toothpaste", category: "toiletries" },
  { name: "Soap & Body Wash", category: "toiletries" },
  { name: "Deodorant / Roll-on", category: "toiletries" },
  { name: "Shaving Stick / Razor", category: "toiletries" },
  { name: "Power Bank (10,000mAh minimum)", category: "electronics", note: "Charging points in the hostel are limited." },
  { name: "Torchlight & Batteries", category: "electronics" },
  { name: "Extension Cable", category: "electronics" },
  { name: "Waist Bag", category: "essentials", note: "Holds money, phone and keys during drills." },
  { name: "Water Bottle (1.5L)", category: "essentials" },
  { name: "Padlock for locker", category: "essentials", note: "Two if you can: bag and locker." },
  { name: "Mosquito Net / Repellent", category: "essentials", note: "Bring string to hang the net." },
  { name: "First Aid Kit", category: "essentials" },
];

const TEMPLATE_BY_NAME = new Map(DEFAULT_PACKING_ITEMS.map((t) => [t.name, t]));

/** Note/disclaimer for a standard item; custom items have none. */
export const packingItemTemplate = (name: string) => TEMPLATE_BY_NAME.get(name);

/** Marketplace listing categories (filter chips, post form and AI extraction). */
export const MARKETPLACE_CATEGORIES = ["Pre-Camp Gear", "Furniture", "Electronics", "Kitchenware", "Full House"] as const;
