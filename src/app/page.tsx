"use client";

import React, { useState } from "react";
import Navbar from "@/shared/components/Navbar";
import Footer from "@/shared/components/Footer";
import RoleOnboardingModal from "@/shared/components/RoleOnboardingModal";
import {
  Bell,
  ShoppingBag,
  Home,
  ShieldCheck,
  Briefcase,
  Users,
  Bot,
  Compass,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  MapPin,
  Calendar,
  Smartphone,
  Zap,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Star,
  DollarSign,
  Clock,
  ShieldAlert,
  ChevronRight,
  Plus
} from "lucide-react";

export default function LandingPage() {
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("serving");
  const [activeTab, setActiveTab] = useState<"services" | "lego" | "rollout">("services");
  const [selectedService, setSelectedService] = useState<number>(0);

  // Calculator State
  const [monthlyAllowance, setMonthlyAllowance] = useState<number>(77000);
  const [monthsInService, setMonthsInService] = useState<number>(12);

  const services = [
    {
      id: "clearance",
      title: "Smart LGA Clearance & Admin Assistant",
      tagline: "Proactive Notifications over Passive Portals",
      category: "Companion Module",
      icon: Bell,
      color: "from-emerald-500 to-teal-600",
      accentBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
      description:
        "The official portal requires manual logins to discover clearance dates. KopaWee transforms passive data into proactive push notifications, Google Calendar sync, LGA office map routes, traffic estimations, and document checklists.",
      highlights: [
        "Push notifications 48h, 24h & 2h before LGA clearance",
        "One-tap Google Calendar integration & LGA route map",
        "Document checklist (Call-up, Green Card, PPA Letter)",
        "Clearance history log & monthly status tracking"
      ],
      previewContent: {
        badge: "Clearance Reminder Active",
        title: "Monthly Clearance Scheduled",
        detail: "Thursday, 2:00 PM - 3:30 PM at Ikeja LGA Office",
        action: "Add to Calendar & Get Map Route"
      }
    },
    {
      id: "marketplace",
      title: "Peer-to-Peer Corper Marketplace",
      tagline: "Buy, Sell & Swap Household Gear Directly",
      category: "Marketplace Module",
      icon: ShoppingBag,
      color: "from-blue-500 to-indigo-600",
      accentBg: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
      description:
        "Passing out corpers hand off mattresses, gas cylinders, fans, and appliances directly to incoming corpers in the same LGA. Complete with verified state code badges and safe meetup locations.",
      highlights: [
        "Dedicated categories: Mattresses, Gas Cylinders, Fans, Books",
        "Verified seller badges with NYSC State Codes",
        "POP Deal bundles for full room hand-offs",
        "Direct chat & location-based filtering by LGA"
      ],
      previewContent: {
        badge: "POP Special Deal",
        title: "6kg Gas Cylinder + Double Mattress",
        detail: "₦35,000 · Seller: NY/25A/1429 (Surulere LGA)",
        action: "Contact Seller on WhatsApp"
      }
    },
    {
      id: "housing",
      title: "Accommodation & Roommate Matching",
      tagline: "Corper Lodges & Compatibility Finder",
      category: "Housing Module",
      icon: Home,
      color: "from-purple-500 to-violet-600",
      accentBg: "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400",
      description:
        "Find corper-friendly apartments near your PPA and split rent with verified roommates using our preference compatibility quiz.",
      highlights: [
        "Directory of corper lodges near PPA & LGA centers",
        "Roommate compatibility finder (Budget, Gender, PPA distance)",
        "Rent split estimator & landlord rating system",
        "Verified corper tenant reviews"
      ],
      previewContent: {
        badge: "94% Match Found",
        title: "2-Bedroom Corper Lodge near Ikeja LGA",
        detail: "₦180,000/yr split · 2 Roommate slots open",
        action: "View Lodge & Connect Roommate"
      }
    },
    {
      id: "camp",
      title: "Pre-Camp & Orientation Camp Guide",
      tagline: "Offline Vault & Camp Survival Kit",
      category: "Companion Module",
      icon: Compass,
      color: "from-amber-500 to-orange-600",
      accentBg: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
      description:
        "Everything a Prospective Corps Member needs before hitting camp. Features encrypted offline storage for green cards and call-up letters, plus interactive packing checklists.",
      highlights: [
        "Encrypted offline vault for call-up letters & green cards",
        "Interactive camp packing checklist with progress bar",
        "36 State Orientation Camp survival guides & platoon tips",
        "Pre-camp travel route planner"
      ],
      previewContent: {
        badge: "Offline Vault Ready",
        title: "NYSC Call-Up Letter & Medical Fitness PDF",
        detail: "Encrypted & stored locally · No internet needed",
        action: "Open Document Vault"
      }
    },
    {
      id: "safety",
      title: "Travel Safety & Emergency SOS Tracker",
      tagline: "Real-Time Highway Trip Check-Ins & Alerts",
      category: "Safety Module",
      icon: ShieldAlert,
      color: "from-rose-500 to-red-600",
      accentBg: "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400",
      description:
        "Interstate journeys to camp or PPA can be stressful. KopaWee features active status trip check-ins and one-tap SOS alerts sent to trusted contacts.",
      highlights: [
        "Highway trip status reporter (e.g. Lokoja-Abuja Expressway)",
        "One-tap SOS emergency trigger with location broadcasting",
        "Emergency contact tree (Family, LGA rep, CDS coordinator)",
        "Nearby police & accredited hospital directory"
      ],
      previewContent: {
        badge: "Active Journey Monitoring",
        title: "Enugu → Abuja Highway Travel",
        detail: "Last check-in: Lokoja Bypass (2:14 PM) · Status Normal",
        action: "Send Status Check-in"
      }
    },
    {
      id: "workplace",
      title: "Workplace & PPA Management Portal",
      tagline: "Clock-In, Attendance & Leave Requests",
      category: "Workplace Module",
      icon: Briefcase,
      color: "from-cyan-500 to-blue-600",
      accentBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400",
      description:
        "Allows Places of Primary Assignment (PPAs) to manage assigned corps members efficiently with digital clock-in, leave approval workflows, and monthly evaluations.",
      highlights: [
        "Corper clock-in & attendance verification",
        "Digital leave request application (Medical, Clearance, Annual)",
        "PPA employer feedback & rating repository",
        "Monthly attendance report generation"
      ],
      previewContent: {
        badge: "PPA Manager",
        title: "Leave Application: 3-Day Clearance Leave",
        detail: "Requested by: Grace Okafor (LA/25B/0812)",
        action: "Approve Leave Request"
      }
    },
    {
      id: "community",
      title: "CDS Community & Group Hub",
      tagline: "Meeting Manager & Attendance Register",
      category: "Community Module",
      icon: Users,
      color: "from-teal-500 to-emerald-600",
      accentBg: "bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400",
      description:
        "Connects CDS executives and group members with automated meeting reminders, dues collection tracking, project updates, and attendance logs.",
      highlights: [
        "CDS weekly meeting reminders & agenda feed",
        "Digital attendance barcode / QR scanner",
        "Group dues tracking & community project updates",
        "Photo gallery & event announcements"
      ],
      previewContent: {
        badge: "Editorial CDS Group",
        title: "Weekly Meeting: Thursday 8:00 AM",
        detail: "LGA Secretariat Hall · Agenda: Magazine Launch",
        action: "Mark Attendance & View Agenda"
      }
    },
    {
      id: "ai",
      title: "AI Knowledge & Regulatory Assistant",
      tagline: "Instant Answers on NYSC Guidelines",
      category: "AI Module",
      icon: Bot,
      color: "from-indigo-500 to-purple-600",
      accentBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
      description:
        "Ask questions in natural language about NYSC bye-laws, relocation procedures, concessionary deployment, and monthly clearance guidelines.",
      highlights: [
        "Instant responses trained on official NYSC Bye-Laws",
        "Step-by-step relocation application guidance",
        "Concessionary deployment (marital / medical) advice",
        "Post-POP career transition tips"
      ],
      previewContent: {
        badge: "AI Assistant Query",
        title: "How do I process relocation on medical grounds?",
        detail: "Provides exact document requirements & step-by-step steps",
        action: "Ask AI Assistant"
      }
    }
  ];

  const currentService = services[selectedService];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#06090e] text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Navbar */}
      <Navbar onOpenRoleModal={(role) => {
        if (role) setSelectedRole(role);
        setRoleModalOpen(true);
      }} />

      <main className="flex-1 pt-24">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 hero-grid">
          {/* Subtle Glow Accents */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/20 to-teal-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
              {/* Status Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-emerald-500/30 text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow-sm animate-pulse">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>The Active NYSC Companion & Modular Super-App</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                One App. <br className="hidden sm:inline" />
                <span className="gradient-text-emerald">Multiple Mini-Products Inside.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-medium">
                Transforming passive NYSC administration into proactive smart clearance alerts, peer-to-peer corper marketplace, travel safety SOS, housing matching, and workplace management.
              </p>

              {/* Dual CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
                <button
                  onClick={() => setRoleModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" /> Try 5-Role Experience Demo
                </button>
                <a
                  href="#services"
                  className="w-full sm:w-auto px-8 py-4 glass-panel border border-slate-300 dark:border-slate-800 hover:border-emerald-500/50 text-slate-800 dark:text-slate-200 font-bold text-sm rounded-2xl transition-all hover:bg-emerald-500/10 flex items-center justify-center gap-2"
                >
                  Explore Services & Modules <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Live Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl pt-10 border-t border-slate-200 dark:border-slate-800/80">
                <div className="glass-card p-4 rounded-2xl text-center">
                  <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">50,000+</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target Corps Members</span>
                </div>
                <div className="glass-card p-4 rounded-2xl text-center">
                  <span className="block text-2xl font-black text-teal-600 dark:text-teal-400">2,000+</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Partner PPAs / Employers</span>
                </div>
                <div className="glass-card p-4 rounded-2xl text-center">
                  <span className="block text-2xl font-black text-blue-600 dark:text-blue-400">36 States</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">+ FCT Abuja Coverage</span>
                </div>
                <div className="glass-card p-4 rounded-2xl text-center">
                  <span className="block text-2xl font-black text-purple-600 dark:text-purple-400">100%</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Offline Vault Ready</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES BREAKDOWN SECTION */}
        <section id="services" className="py-20 bg-slate-100/50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Core Services & Mini-Products
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                Designed Around the Corps Member's Entire Journey
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl">
                Every service runs as an independent mini-product powered by a shared core foundation.
              </p>
            </div>

            {/* Interactive Service Selector & Feature Preview Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Service Tabs List */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                {services.map((svc, index) => {
                  const IconComp = svc.icon;
                  const isSelected = selectedService === index;
                  return (
                    <button
                      key={svc.id}
                      onClick={() => setSelectedService(index)}
                      className={`w-full text-left p-4 rounded-2xl transition-all border flex items-start gap-4 ${
                        isSelected
                          ? "glass-panel border-emerald-500 shadow-lg shadow-emerald-500/10 bg-white dark:bg-slate-800/90 scale-[1.02]"
                          : "bg-white/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className={`p-3 rounded-xl bg-gradient-to-tr ${svc.color} text-white shrink-0 shadow-md`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{svc.category}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{svc.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{svc.tagline}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Detailed Service Preview Card */}
              <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-slate-900/90 text-white space-y-6 shadow-2xl sticky top-28">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl bg-gradient-to-tr ${currentService.color} text-white shadow-lg`}>
                      <currentService.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${currentService.accentBg}`}>
                        {currentService.category}
                      </span>
                      <h3 className="text-xl font-black text-white mt-1">{currentService.title}</h3>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  {currentService.description}
                </p>

                {/* Feature Highlights Bullet Points */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Key Capabilities</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentService.highlights.map((hl, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-200 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulated Interactive Mobile Screen Preview */}
                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">Live Experience Preview</h4>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {currentService.previewContent.badge}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Live Demo State</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-white">{currentService.previewContent.title}</h5>
                      <p className="text-xs text-slate-400">{currentService.previewContent.detail}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedRole("serving");
                        setRoleModalOpen(true);
                      }}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-700"
                    >
                      {currentService.previewContent.action} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MODULAR "LEGO" ARCHITECTURE SECTION */}
        <section id="architecture" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <span className="text-xs font-extrabold uppercase tracking-widest text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                System Architecture
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                Built Like LEGO Pieces
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl">
                Instead of one giant monolithic app, KopaWee provides a unified core infrastructure that powers independent mini-products.
              </p>
            </div>

            {/* Architecture Visual Diagram */}
            <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-12">
              {/* Shared Foundation Bar */}
              <div className="space-y-4 text-center">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Shared LEGO Infrastructure Foundation</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {["Authentication", "Notification Engine", "Location & GPS", "P2P Payments", "Messaging System", "Document Vault"].map((infra, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 text-slate-200 border border-slate-700 text-xs font-bold shadow-md">
                      {infra}
                    </div>
                  ))}
                </div>
              </div>

              {/* Connecting Arrows */}
              <div className="flex justify-center text-emerald-500">
                <div className="w-0.5 h-10 bg-gradient-to-b from-slate-700 to-emerald-500" />
              </div>

              {/* Mini-Products Array */}
              <div className="space-y-4 text-center">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-500">Independent Mini-Product Modules</span>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {[
                    { name: "Companion", color: "bg-emerald-500/20 border-emerald-500 text-emerald-400" },
                    { name: "Safety", color: "bg-rose-500/20 border-rose-500 text-rose-400" },
                    { name: "Community", color: "bg-teal-500/20 border-teal-500 text-teal-400" },
                    { name: "Workplace", color: "bg-blue-500/20 border-blue-500 text-blue-400" },
                    { name: "Marketplace", color: "bg-purple-500/20 border-purple-500 text-purple-400" },
                    { name: "CDS Hub", color: "bg-amber-500/20 border-amber-500 text-amber-400" },
                    { name: "LGA Admin", color: "bg-pink-500/20 border-pink-500 text-pink-400" }
                  ].map((mod, i) => (
                    <div key={i} className={`p-3 rounded-xl border text-xs font-bold ${mod.color}`}>
                      {mod.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center pt-4">
                <p className="text-xs text-slate-500 max-w-xl mx-auto">
                  "Nothing breaks because each module is independent. The user only sees what they need based on their active role."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4-YEAR ROLLOUT ROADMAP SECTION */}
        <section id="roadmap" className="py-20 bg-slate-100/50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Scaling Strategy
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                The 4-Year Rollout Plan
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl">
                A phased deployment strategy ensuring adoption, reliability, and eventual official integration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Year 1 */}
              <div className="glass-card p-6 rounded-3xl border border-emerald-500/40 space-y-4 relative overflow-hidden">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500 text-white w-fit block">Year 1 (MVP)</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Companion + Safety + Marketplace</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Focus on 50,000 corps members. Smart clearance alerts, peer-to-peer marketplace, travel SOS, and housing finder.
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs font-bold text-emerald-500">
                  Target: 50,000 Users
                </div>
              </div>

              {/* Year 2 */}
              <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-800 text-slate-300 w-fit block">Year 2</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Workplace Module</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  PPAs (Employers) join the platform to manage corps member attendance, leave applications, and monthly reviews.
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400">
                  Target: 2,500 PPAs
                </div>
              </div>

              {/* Year 3 */}
              <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-800 text-slate-300 w-fit block">Year 3</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">CDS Community Module</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Community Development Service groups onboard for attendance registers, dues tracking, and project management.
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400">
                  Nationwide CDS Expansion
                </div>
              </div>

              {/* Year 4 */}
              <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-800 text-slate-300 w-fit block">Year 4</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Official NYSC Integration</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Direct API integrations with NYSC Directorate HQ for automated biometric verification and clearance synchronization.
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400">
                  Government Partnership
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORPER VALUE & SAVINGS CALCULATOR */}
        <section id="calculator" className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-500/30 bg-slate-900 text-white space-y-8 shadow-2xl">
              <div className="text-center space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Interactive Impact Quiz
                </span>
                <h3 className="text-2xl sm:text-4xl font-black">Estimate Your Service Year Savings</h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  See how KopaWee saves you time, money on housing/furniture, and clearance stress.
                </p>
              </div>

              {/* Sliders */}
              <div className="space-y-6 max-w-xl mx-auto">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-300">Monthly Allowance (Allawee)</span>
                    <span className="text-emerald-400">₦{monthlyAllowance.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="33000"
                    max="100000"
                    step="1000"
                    value={monthlyAllowance}
                    onChange={(e) => setMonthlyAllowance(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-300">Service Duration</span>
                    <span className="text-emerald-400">{monthsInService} Months</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={monthsInService}
                    onChange={(e) => setMonthsInService(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* Savings Results */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div className="bg-slate-800/80 p-4 rounded-2xl text-center border border-slate-700">
                  <span className="block text-xs font-bold text-slate-400">Est. Furniture Savings (P2P Market)</span>
                  <span className="text-xl font-black text-emerald-400 mt-1">₦{Math.round(monthlyAllowance * 0.45).toLocaleString()}</span>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-2xl text-center border border-slate-700">
                  <span className="block text-xs font-bold text-slate-400">Hours Saved (Clearance & Transport)</span>
                  <span className="text-xl font-black text-teal-400 mt-1">{monthsInService * 6} Hours</span>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-2xl text-center border border-slate-700">
                  <span className="block text-xs font-bold text-slate-400">Travel & Emergency Safety</span>
                  <span className="text-xl font-black text-purple-400 mt-1">100% Peace of Mind</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM HERO CTA */}
        <section className="py-20 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white border-t border-emerald-500/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Ready to Experience KopaWee?
            </h2>
            <p className="text-base text-slate-300 max-w-xl mx-auto">
              Join thousands of prospective, serving, and alumni corps members using Nigeria's premier active companion super-app.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setRoleModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                Launch Role Selector Demo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Role Onboarding Modal */}
      <RoleOnboardingModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        defaultRole={selectedRole}
      />
    </div>
  );
}
