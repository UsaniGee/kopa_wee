import {
  Bell,
  ShoppingBag,
  Home,
  ShieldAlert,
  Briefcase,
  Users,
  Bot,
  Compass,
  type LucideIcon,
} from "lucide-react";

export interface ServicePreviewContent {
  badge: string;
  title: string;
  detail: string;
  action: string;
}

export interface Service {
  id: string;
  title: string;
  tagline: string;
  category: string;
  icon: LucideIcon;
  color: string;
  accentBg: string;
  description: string;
  highlights: string[];
  previewContent: ServicePreviewContent;
  storyChapter: string;
  storyHeadline: string;
  storyNarrative: string;
  image: string;
  imageAlt: string;
}

/** Ordered as the corper's journey — camp → travel → settle → serve */
export const services: Service[] = [
  {
    id: "camp",
    title: "Pre-Camp & Orientation Camp Guide",
    tagline: "Offline Vault & Camp Survival Kit",
    category: "Companion Module",
    icon: Compass,
    color: "from-emerald-600 to-emerald-700",
    accentBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    description:
      "Everything a Prospective Corps Member needs before hitting camp. Features encrypted offline storage for green cards and call-up letters, plus interactive packing checklists.",
    highlights: [
      "Encrypted offline vault for call-up letters & green cards",
      "Interactive camp packing checklist with progress bar",
      "36 State Orientation Camp survival guides & platoon tips",
      "Pre-camp travel route planner",
    ],
    previewContent: {
      badge: "Offline Vault Ready",
      title: "NYSC Call-Up Letter & Medical Fitness PDF",
      detail: "Encrypted & stored locally · No internet needed",
      action: "Open Document Vault",
    },
    storyChapter: "Chapter 01",
    storyHeadline: "The call-up arrives. Are you ready?",
    storyNarrative:
      "Your green card is in hand, camp is three weeks away. Pack smart with state-specific survival guides and keep every document safe — even when there's no signal at camp.",
    image: "/images/hero/camp.png",
    imageAlt: "NYSC corps members in khaki uniform at orientation camp, Nigeria",
  },
  {
    id: "safety",
    title: "Travel Safety & Emergency SOS Tracker",
    tagline: "Real-Time Highway Trip Check-Ins & Alerts",
    category: "Safety Module",
    icon: ShieldAlert,
    color: "from-emerald-600 to-emerald-700",
    accentBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    description:
      "Interstate journeys to camp or PPA can be stressful. KopaWee features active status trip check-ins and one-tap SOS alerts sent to trusted contacts.",
    highlights: [
      "Highway trip status reporter (e.g. Lokoja-Abuja Expressway)",
      "One-tap SOS emergency trigger with location broadcasting",
      "Emergency contact tree (Family, LGA rep, CDS coordinator)",
      "Nearby police & accredited hospital directory",
    ],
    previewContent: {
      badge: "Active Journey Monitoring",
      title: "Enugu → Abuja Highway Travel",
      detail: "Last check-in: Lokoja Bypass (2:14 PM) · Status Normal",
      action: "Send Status Check-in",
    },
    storyChapter: "Chapter 02",
    storyHeadline: "The long road to your posting state",
    storyNarrative:
      "Lagos to Kaduna. Enugu to Abuja. Every corper knows the highway anxiety. Check in at each stop, and if anything goes wrong — one tap alerts your family and LGA rep.",
    image: "/images/hero/safety.png",
    imageAlt: "NYSC corps members travelling by coach bus to posting state, Nigeria",
  },
  {
    id: "housing",
    title: "Accommodation & Roommate Matching",
    tagline: "Corper Lodges & Compatibility Finder",
    category: "Housing Module",
    icon: Home,
    color: "from-emerald-600 to-emerald-800",
    accentBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    description:
      "Find corper-friendly apartments near your PPA and split rent with verified roommates using our preference compatibility quiz.",
    highlights: [
      "Directory of corper lodges near PPA & LGA centers",
      "Roommate compatibility finder (Budget, Gender, PPA distance)",
      "Rent split estimator & landlord rating system",
      "Verified corper tenant reviews",
    ],
    previewContent: {
      badge: "94% Match Found",
      title: "2-Bedroom Corper Lodge near Ikeja LGA",
      detail: "₦180,000/yr split · 2 Roommate slots open",
      action: "View Lodge & Connect Roommate",
    },
    storyChapter: "Chapter 03",
    storyHeadline: "Luggage in hand. Where will you sleep tonight?",
    storyNarrative:
      "Camp is over. You step off the bus with your travelling bag, posted to a city you've never lived in. Find corper-friendly lodges near your PPA and match with roommates who share your budget.",
    image: "/images/hero/housing.png",
    imageAlt: "NYSC corps member with travelling bag at Nigerian bus terminal",
  },
  {
    id: "clearance",
    title: "Smart LGA Clearance & Admin Assistant",
    tagline: "Proactive Notifications over Passive Portals",
    category: "Companion Module",
    icon: Bell,
    color: "from-emerald-500 to-teal-600",
    accentBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    description:
      "The official portal requires manual logins to discover clearance dates. KopaWee transforms passive data into proactive push notifications, Google Calendar sync, LGA office map routes, traffic estimations, and document checklists.",
    highlights: [
      "Push notifications 48h, 24h & 2h before LGA clearance",
      "One-tap Google Calendar integration & LGA route map",
      "Document checklist (Call-up, Green Card, PPA Letter)",
      "Clearance history log & monthly status tracking",
    ],
    previewContent: {
      badge: "Clearance Reminder Active",
      title: "Monthly Clearance Scheduled",
      detail: "Thursday, 2:00 PM - 3:30 PM at Ikeja LGA Office",
      action: "Add to Calendar & Get Map Route",
    },
    storyChapter: "Chapter 04",
    storyHeadline: "Clearance day shouldn't be a surprise",
    storyNarrative:
      "Every month, the same scramble — when is clearance? Which documents? KopaWee pushes reminders 48 hours ahead, syncs your calendar, and maps the route to your LGA office.",
    image: "/images/hero/clearance.png",
    imageAlt: "NYSC corps member with call-up letter and green card at LGA secretariat",
  },
  {
    id: "marketplace",
    title: "Peer-to-Peer Corper Marketplace",
    tagline: "Buy, Sell & Swap Household Gear Directly",
    category: "Marketplace Module",
    icon: ShoppingBag,
    color: "from-emerald-500 to-emerald-700",
    accentBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    description:
      "Passing out corpers hand off mattresses, gas cylinders, fans, and appliances directly to incoming corpers in the same LGA. Complete with verified state code badges and safe meetup locations.",
    highlights: [
      "Dedicated categories: Mattresses, Gas Cylinders, Fans, Books",
      "Verified seller badges with NYSC State Codes",
      "POP Deal bundles for full room hand-offs",
      "Direct chat & location-based filtering by LGA",
    ],
    previewContent: {
      badge: "POP Special Deal",
      title: "6kg Gas Cylinder + Double Mattress",
      detail: "₦35,000 · Seller: NY/25A/1429 (Surulere LGA)",
      action: "Contact Seller on WhatsApp",
    },
    storyChapter: "Chapter 05",
    storyHeadline: "Pass it on — don't pay full price twice",
    storyNarrative:
      "The corper before you is passing out. Their mattress, gas cylinder, and fan are still good. Buy directly from verified corpers in your LGA and save thousands on setup costs.",
    image: "/images/hero/marketplace.png",
    imageAlt: "NYSC corps members exchanging household items during POP handover",
  },
  {
    id: "workplace",
    title: "Workplace & PPA Management Portal",
    tagline: "Clock-In, Attendance & Leave Requests",
    category: "Workplace Module",
    icon: Briefcase,
    color: "from-emerald-600 to-teal-700",
    accentBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    description:
      "Allows Places of Primary Assignment (PPAs) to manage assigned corps members efficiently with digital clock-in, leave approval workflows, and monthly evaluations.",
    highlights: [
      "Corper clock-in & attendance verification",
      "Digital leave request application (Medical, Clearance, Annual)",
      "PPA employer feedback & rating repository",
      "Monthly attendance report generation",
    ],
    previewContent: {
      badge: "PPA Manager",
      title: "Leave Application: 3-Day Clearance Leave",
      detail: "Requested by: Grace Okafor (LA/25B/0812)",
      action: "Approve Leave Request",
    },
    storyChapter: "Chapter 06",
    storyHeadline: "Your PPA deserves a corper who shows up",
    storyNarrative:
      "Clock in digitally, request clearance leave without paper forms, and build a track record your PPA employer can vouch for when you need a reference letter.",
    image: "/images/hero/workplace.png",
    imageAlt: "NYSC corps member serving at Place of Primary Assignment office in Nigeria",
  },
  {
    id: "community",
    title: "CDS Community & Group Hub",
    tagline: "Meeting Manager & Attendance Register",
    category: "Community Module",
    icon: Users,
    color: "from-emerald-500 to-emerald-700",
    accentBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    description:
      "Connects CDS executives and group members with automated meeting reminders, dues collection tracking, project updates, and attendance logs.",
    highlights: [
      "CDS weekly meeting reminders & agenda feed",
      "Digital attendance barcode / QR scanner",
      "Group dues tracking & community project updates",
      "Photo gallery & event announcements",
    ],
    previewContent: {
      badge: "Editorial CDS Group",
      title: "Weekly Meeting: Thursday 8:00 AM",
      detail: "LGA Secretariat Hall · Agenda: Magazine Launch",
      action: "Mark Attendance & View Agenda",
    },
    storyChapter: "Chapter 07",
    storyHeadline: "Your CDS group is your second family",
    storyNarrative:
      "Thursday mornings at the LGA secretariat. Magazine launch this week. Track attendance, collect dues, and never miss a community project meeting again.",
    image: "/images/hero/community.png",
    imageAlt: "NYSC corps members on Community Development Service project in Nigeria",
  },
  {
    id: "ai",
    title: "AI Knowledge & Regulatory Assistant",
    tagline: "Instant Answers on NYSC Guidelines",
    category: "AI Module",
    icon: Bot,
    color: "from-emerald-700 to-emerald-900",
    accentBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    description:
      "Ask questions in natural language about NYSC bye-laws, relocation procedures, concessionary deployment, and monthly clearance guidelines.",
    highlights: [
      "Instant responses trained on official NYSC Bye-Laws",
      "Step-by-step relocation application guidance",
      "Concessionary deployment (marital / medical) advice",
      "Post-POP career transition tips",
    ],
    previewContent: {
      badge: "AI Assistant Query",
      title: "How do I process relocation on medical grounds?",
      detail: "Provides exact document requirements & step-by-step steps",
      action: "Ask AI Assistant",
    },
    storyChapter: "Chapter 08",
    storyHeadline: "Confused? Ask before you make a costly mistake",
    storyNarrative:
      "Can I relocate on medical grounds? What documents do I need for concessionary deployment? Get instant, accurate answers trained on official NYSC bye-laws — anytime.",
    image: "/images/hero/ai.png",
    imageAlt: "NYSC corps member using smartphone for instant NYSC guidance",
  },
];
