import { 
  FiBell, 
  FiShoppingBag, 
  FiHome, 
  FiShield, 
  FiBriefcase, 
  FiUsers, 
  FiCompass, 
  FiCpu 
} from "react-icons/fi";
import type { IconType } from "react-icons";

export interface ServicePreviewContent {
  badge: string;
  title: string;
  detail: string;
  action: string;
}

/** live: works today; partial: some of it works today; soon: not built yet. */
export type ServiceStatus = "live" | "partial" | "soon";

export interface Service {
  id: string;
  status: ServiceStatus;
  title: string;
  tagline: string;
  category: string;
  icon: IconType;
  color: string;
  accentBg: string;
  description: string;
  /** What works today. */
  highlights: string[];
  /** Planned, not built yet. */
  comingSoon: string[];
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
    status: "live",
    title: "Pre-Camp & Orientation Camp Guide",
    tagline: "Camp Packing Checklist & Countdown",
    category: "Companion Module",
    icon: FiCompass,
    color: "from-emerald-600 to-emerald-700",
    accentBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    description:
      "Everything a Prospective Corps Member needs before camp: a packing checklist saved to your account and a countdown to your camp date.",
    highlights: [
      "Camp packing checklist saved to your account",
      "Add your own items and track progress",
      "Countdown to your camp entry date",
    ],
    comingSoon: [
      "Document vault for your call-up letter and green card",
      "State-by-state camp guides",
    ],
    previewContent: {
      badge: "Packing checklist",
      title: "Call-up Letter (3 colored copies)",
      detail: "Ticked items stay ticked on any device",
      action: "Start your checklist",
    },
    storyChapter: "Chapter 01",
    storyHeadline: "The call-up arrives. Are you ready?",
    storyNarrative:
      "Your call-up letter is in hand and camp is weeks away. Tick off what you have packed, add what you need, and see exactly how many days are left.",
    image: "/images/hero/camp.png",
    imageAlt: "NYSC corps members in khaki uniform at orientation camp, Nigeria",
  },
  {
    id: "safety",
    status: "partial",
    title: "Travel Safety & Emergency SOS Tracker",
    tagline: "One-Tap SOS With Your Real Location",
    category: "Safety Module",
    icon: FiShield,
    color: "from-emerald-600 to-emerald-700",
    accentBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    description:
      "Send an SOS that records your phone's current location and emails you a copy, with a one-tap link to call 112. KopaWee does not alert other people yet.",
    highlights: [
      "One-tap SOS with your phone's GPS location",
      "Email copy of every alert",
      "Quick link to call 112",
    ],
    comingSoon: [
      "Trip check-ins for interstate travel",
      "Alerts to trusted contacts",
    ],
    previewContent: {
      badge: "SOS",
      title: "Send SOS with my location",
      detail: "Logs your GPS position and emails you a copy · Call 112 in danger",
      action: "Set up your account",
    },
    storyChapter: "Chapter 02",
    storyHeadline: "The long road to your posting state",
    storyNarrative:
      "Long trips to camp and to your posting state can be stressful. Keep an SOS one tap away that records exactly where you are.",
    image: "/images/hero/safety.png",
    imageAlt: "NYSC corps members travelling by coach bus to posting state, Nigeria",
  },
  {
    id: "housing",
    status: "live",
    title: "Accommodation & Roommate Matching",
    tagline: "Corper Lodges & Roommate Requests",
    category: "Housing Module",
    icon: FiHome,
    color: "from-emerald-600 to-emerald-800",
    accentBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    description:
      "Browse lodges listed by corpers and hosts after a moderation check, post a roommate request with your budget, and share contact details only when both of you agree.",
    highlights: [
      "Lodge listings reviewed before they go live",
      "Roommate requests from corpers, with budget and preferences",
      "Phone and email shared only after a match",
      "WhatsApp or call hosts in one tap",
    ],
    comingSoon: [
      "Reviews from past tenants",
    ],
    previewContent: {
      badge: "Roommate request",
      title: "Self-contain near your PPA",
      detail: "Contact details are shared only after both of you agree",
      action: "Browse lodges",
    },
    storyChapter: "Chapter 03",
    storyHeadline: "Luggage in hand. Where will you sleep tonight?",
    storyNarrative:
      "Camp is over and you are posted to a city you have never lived in. Find a lodge near your PPA and a roommate who fits your budget.",
    image: "/images/hero/housing.png",
    imageAlt: "NYSC corps member with travelling bag at Nigerian bus terminal",
  },
  {
    id: "clearance",
    status: "partial",
    title: "Smart LGA Clearance & Admin Assistant",
    tagline: "Monthly Clearance Tracker",
    category: "Companion Module",
    icon: FiBell,
    color: "from-emerald-500 to-teal-600",
    accentBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    description:
      "Log each monthly clearance, see when the next one is due, and add that date to Google Calendar.",
    highlights: [
      "Log each monthly clearance",
      "See when your next clearance is due",
      "Add the date to Google Calendar",
    ],
    comingSoon: [
      "Reminders before clearance day",
    ],
    previewContent: {
      badge: "Clearance tracker",
      title: "Next clearance date",
      detail: "Worked out from your last logged clearance",
      action: "Track your clearance",
    },
    storyChapter: "Chapter 04",
    storyHeadline: "Clearance day shouldn't be a surprise",
    storyNarrative:
      "Every month the same question: when is clearance? Log it once and KopaWee tells you when the next one is due.",
    image: "/images/hero/clearance.png",
    imageAlt: "NYSC corps member with call-up letter and green card at LGA secretariat",
  },
  {
    id: "marketplace",
    status: "live",
    title: "Peer-to-Peer Corper Marketplace",
    tagline: "Buy & Sell Gear With Other Corpers",
    category: "Marketplace Module",
    icon: FiShoppingBag,
    color: "from-emerald-500 to-emerald-700",
    accentBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    description:
      "Corpers passing out sell mattresses, gas cylinders, fans and appliances to incoming corpers in the same state. Listings are reviewed before they go live; contact the seller on WhatsApp or by phone.",
    highlights: [
      "Listings reviewed before they go live",
      "Photos and an optional AI-written draft",
      "Filter by state and category",
      "WhatsApp or call the seller in one tap",
    ],
    comingSoon: [
      "Reporting a listing",
    ],
    previewContent: {
      badge: "Marketplace",
      title: "6kg gas cylinder + burner",
      detail: "Example listing · contact the seller on WhatsApp",
      action: "Browse the marketplace",
    },
    storyChapter: "Chapter 05",
    storyHeadline: "Pass it on — don't pay full price twice",
    storyNarrative:
      "The corper before you is passing out, and their mattress, gas cylinder and fan are still good. Buy directly from corpers in your state and save on setup costs.",
    image: "/images/hero/marketplace.png",
    imageAlt: "NYSC corps members exchanging household items during POP handover",
  },
  {
    id: "workplace",
    status: "partial",
    title: "Workplace & PPA Management Portal",
    tagline: "Daily PPA Logbook",
    category: "Workplace Module",
    icon: FiBriefcase,
    color: "from-emerald-600 to-teal-700",
    accentBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    description:
      "Keep a daily logbook of what you did at your place of primary assignment and how many hours you worked.",
    highlights: [
      "Daily logbook with summary and hours",
      "One entry per day, saved to your account",
    ],
    comingSoon: [
      "Employer tools for PPAs",
      "Leave requests",
    ],
    previewContent: {
      badge: "PPA logbook",
      title: "Today's log",
      detail: "What you did and how many hours",
      action: "Start your logbook",
    },
    storyChapter: "Chapter 06",
    storyHeadline: "Your PPA deserves a corper who shows up",
    storyNarrative:
      "Keep a simple record of your days at your PPA, so you have your own track record when you need it.",
    image: "/images/hero/workplace.png",
    imageAlt: "NYSC corps member serving at Place of Primary Assignment office in Nigeria",
  },
  {
    id: "community",
    status: "soon",
    title: "CDS Community & Group Hub",
    tagline: "CDS Group Hub (Coming Soon)",
    category: "Community Module",
    icon: FiUsers,
    color: "from-emerald-500 to-emerald-700",
    accentBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    description:
      "A hub for CDS groups to share meeting times, attendance and project updates. This is not built yet.",
    highlights: [],
    comingSoon: [
      "CDS meeting reminders",
      "Attendance register",
      "Group project updates",
    ],
    previewContent: {
      badge: "Coming soon",
      title: "CDS group hub",
      detail: "Not available yet",
      action: "Join KopaWee",
    },
    storyChapter: "Chapter 07",
    storyHeadline: "Your CDS group is your second family",
    storyNarrative:
      "Your CDS group is a big part of your service year. A hub for meetings and projects is on the way.",
    image: "/images/hero/community.png",
    imageAlt: "NYSC corps members on Community Development Service project in Nigeria",
  },
  {
    id: "ai",
    status: "partial",
    title: "AI Knowledge & Regulatory Assistant",
    tagline: "AI Assistant (Beta)",
    category: "AI Module",
    icon: FiCpu,
    color: "from-emerald-700 to-emerald-900",
    accentBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    description:
      "Ask general questions about the service year and get a quick answer from an AI model (Google Gemini). Answers can be wrong; always confirm with official NYSC sources.",
    highlights: [
      "Quick answers to general NYSC questions",
      "Help writing marketplace listings",
    ],
    comingSoon: [
      "Answers grounded in official NYSC documents",
    ],
    previewContent: {
      badge: "AI assistant",
      title: "How does monthly clearance work?",
      detail: "General guidance; confirm with official NYSC sources",
      action: "Try the assistant",
    },
    storyChapter: "Chapter 08",
    storyHeadline: "Confused? Ask before you make a costly mistake",
    storyNarrative:
      "Not sure about something? Ask the assistant for a quick explanation, then confirm the details with official NYSC sources.",
    image: "/images/hero/ai.png",
    imageAlt: "NYSC corps member using smartphone for instant NYSC guidance",
  },
];
