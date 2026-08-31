"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRole } from "@/shared/context/RoleContext";
import { FiCalendar, FiShield, FiShoppingBag, FiHome, FiAlertOctagon, FiBriefcase, FiUsers, FiArrowRight, FiCheckCircle, FiClock, FiMapPin, FiTrendingUp, FiFileText, FiCpu, FiPackage, FiCompass, FiCheckSquare, FiAlertCircle, FiBox, FiUserCheck, FiUserX, FiPlus, FiSend, FiAward } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

const Calendar = FiCalendar;
const ShieldCheck = FiShield;
const ShoppingBag = FiShoppingBag;
const Home = FiHome;
const ShieldAlert = FiAlertOctagon;
const Briefcase = FiBriefcase;
const Users = FiUsers;
const ArrowRight = FiArrowRight;
const CheckCircle2 = FiCheckCircle;
const Clock = FiClock;
const MapPin = FiMapPin;
const TrendingUp = FiTrendingUp;
const FileText = FiFileText;
const Sparkles = HiSparkles;
const Bot = FiCpu;
const Luggage = FiPackage;
const Compass = FiCompass;
const CheckSquare = FiCheckSquare;
const AlertCircle = FiAlertCircle;
const Building2 = FiBox;
const UserCheck = FiUserCheck;
const UserX = FiUserX;
const Plus = FiPlus;
const Send = FiSend;
const Award = FiAward;

export default function DashboardOverviewPage() {
  const { currentRole, setRole } = useRole();

  const [clearanceDone, setClearanceDone] = useState(false);
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Call-up Letter (3 colored copies)", checked: true },
    { id: 2, text: "Green Card & Statement of Result", checked: true },
    { id: 3, text: "Medical Fitness Certificate", checked: true },
    { id: 4, text: "White Shorts (3 pairs) & Plain White Tees", checked: false },
    { id: 5, text: "Waist Bag & Rubber Shoes", checked: false },
  ]);
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: "John Okoh", role: "ICT Assistant", reason: "Medical Leave (3 Days)", status: "pending" },
    { id: 2, name: "Amina Bello", role: "Research Associate", reason: "LGA Clearance Exemption", status: "pending" },
  ]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const toggleChecklist = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleLeaveAction = (id: number, status: "approved" | "rejected") => {
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
  };

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    if (aiPrompt.toLowerCase().includes("relocat")) {
      setAiAnswer("To apply for relocation, submit your medical certificate or marital proof via the NYSC Portal during camp orientation. Approval takes 7–14 days after camp.");
    } else {
      setAiAnswer("NYSC Policy Guide: Always inform your Local Government Inspector (LGI) before traveling outside your state of deployment.");
    }
  };

  /* =========================================================================
     1. PROSPECTIVE CORPS MEMBER (PCM) VIEW
     ========================================================================= */
  if (currentRole === "pcm") {
    const completedItems = checklist.filter(c => c.checked).length;
    return (
      <div className="space-y-8 font-sans">
        {/* Banner */}
        <div className="p-8 bg-[#121815] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
              <Luggage className="w-3.5 h-3.5" />
              <span>ROLE: PROSPECTIVE CORPS MEMBER (PCM)</span>
            </div>
            <h1 className="text-3xl font-medium text-white tracking-tight font-display">
              Mobilization & Orientation Camp Preparation
            </h1>
            <p className="text-xs text-slate-300">
              Stream call-up release approaching. Manage mandatory documents and camp kit.
            </p>
          </div>

          <button
            onClick={() => setRole("serving")}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Update Status ➔ Serving Corper</span>
          </button>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase tracking-widest font-display">Orientation Countdown</span>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold font-display text-[#121815] dark:text-white">14 Days Left</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">KADUNA NYSC Permanent Camp, Mando.</p>
          </div>

          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase tracking-widest font-display">Packing Checklist</span>
              <CheckSquare className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold font-display text-[#121815] dark:text-white">{completedItems} of {checklist.length} Ready</div>
            <div className="w-full bg-slate-300 dark:bg-slate-800 h-1.5">
              <div 
                className="bg-emerald-600 h-1.5 transition-all"
                style={{ width: `${(completedItems / checklist.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase tracking-widest font-display">Route Planner</span>
              <Compass className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-base font-bold font-display text-[#121815] dark:text-white">Lagos ➔ Kaduna State</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Corper convoy leaves Jibowu Park Aug 28, 6:00 AM.</p>
          </div>
        </div>

        {/* Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-8 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-[#121815] dark:text-white uppercase tracking-widest font-display flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600" /> Camp Mandatory Gear Checklist
            </h2>
            <div className="space-y-2">
              {checklist.map((item) => (
                <label 
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`flex items-center gap-3 p-3.5 text-xs font-semibold transition-all cursor-pointer border ${
                    item.checked 
                      ? "bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-600/40 line-through" 
                      : "bg-[#eaf5ed] dark:bg-[#0a0f0d] text-slate-800 dark:text-slate-200 border-slate-300/60 dark:border-slate-800"
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={item.checked} 
                    onChange={() => {}} 
                    className="accent-emerald-600 w-4 h-4"
                  />
                  <span>{item.text}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-8 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest font-display mb-2">
                <Bot className="w-4 h-4" /> KopaWee AI Regulatory Assistant
              </div>
              <h2 className="text-base font-bold text-[#121815] dark:text-white font-display">Questions on Mobilization or Relocation?</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Instant answers trained on official NYSC Bye-laws.
              </p>
            </div>

            <form onSubmit={handleAskAI} className="space-y-3 mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Relocation on medical grounds?"
                  className="flex-1 px-4 py-3 text-xs bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600"
                />
                <button type="submit" className="px-5 py-3 bg-[#121815] text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors">
                  Ask AI
                </button>
              </div>

              {aiAnswer && (
                <div className="p-4 bg-[#eaf5ed] dark:bg-[#0a0f0d] border-l-2 border-emerald-600 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  <strong>AI Response:</strong> {aiAnswer}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* PCM Modules Launchpad */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-display">
            PCM Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { href: "/dashboard/companion", title: "Camp Guide", text: "Platoon activities, morning drill routine, and SAED classes.", action: "Open Guide ➔" },
              { href: "/dashboard/marketplace", title: "Pre-Camp Market", text: "Buy white boots, waist bags, and power banks from ex-corpers.", action: "Browse Gear ➔" },
              { href: "/dashboard/safety", title: "Journey Safety", text: "Highway status check-in and emergency SOS contacts.", action: "Open Tracker ➔" },
            ].map((card, i) => (
              <Link key={i} href={card.href} className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 hover:border-emerald-600 transition-all space-y-3">
                <h3 className="text-base font-bold text-[#121815] dark:text-white font-display">{card.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{card.text}</p>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block pt-1">{card.action}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     2. SERVING CORPS MEMBER VIEW
     ========================================================================= */
  if (currentRole === "serving") {
    return (
      <div className="space-y-8 font-sans">
        <div className="p-8 bg-[#121815] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ROLE: SERVING CORPS MEMBER (LA/24A/1042)</span>
            </div>
            <h1 className="text-3xl font-medium text-white tracking-tight font-display">
              Welcome back, Corper Chidi
            </h1>
            <p className="text-xs text-slate-300">
              Monthly LGA Clearance in <strong className="text-white">4 days</strong> (Ikeja LGA Hub, Lagos State).
            </p>
          </div>

          <button
            onClick={() => setClearanceDone(!clearanceDone)}
            className={`px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              clearanceDone ? "bg-emerald-800 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{clearanceDone ? "Biometrics Verified" : "Mark Clearance Done"}</span>
          </button>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Next Clearance", val: "4 Days Left", sub: "Aug 25 · Ikeja Hub", icon: Clock },
            { label: "Allawee Savings", val: "₦77,000", sub: "Saved via P2P Market", icon: TrendingUp },
            { label: "CDS Attendance", val: "92% Rate", sub: "Education CDS Group", icon: Users },
            { label: "Safety Status", val: "Active & Safe", sub: "Last check-in: 2h ago", icon: ShieldAlert },
          ].map((m, idx) => {
            const IconComp = m.icon;
            return (
              <div key={idx} className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-widest font-display">{m.label}</span>
                  <IconComp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold font-display text-[#121815] dark:text-white">{m.val}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{m.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Modules Grid */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-display">
            Active Mini-Product Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { href: "/dashboard/companion", tag: "Clearance", title: "Smart Clearance Assistant", desc: "LGA biometric reminders, document vault, and route sync.", icon: Calendar },
              { href: "/dashboard/marketplace", tag: "Marketplace", title: "Corper Peer Marketplace", desc: "Buy, sell, or swap mattresses, fans, and gas cylinders.", icon: ShoppingBag },
              { href: "/dashboard/accommodation", tag: "Housing", title: "Lodge & Roommate Matcher", desc: "Find corper lodges near PPA and split rent easily.", icon: Home },
              { href: "/dashboard/safety", tag: "Safety", title: "Travel SOS Tracker", desc: "Active highway trip monitoring and emergency contact ping.", icon: ShieldAlert },
              { href: "/dashboard/workplace", tag: "Workplace", title: "PPA Logbook", desc: "Log work presence, request leave, and track evaluations.", icon: Briefcase },
              { href: "/dashboard/community", tag: "CDS", title: "CDS Group Manager", desc: "Meeting schedule, attendance register, and dues log.", icon: Users },
            ].map((mod, idx) => {
              const IconComp = mod.icon;
              return (
                <Link key={idx} href={mod.href} className="group p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 hover:border-emerald-600 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-[#121815] text-white"><IconComp className="w-4 h-4" /></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-600/30">
                      {mod.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#121815] dark:text-white font-display group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{mod.desc}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block pt-1">Open Module ➔</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     3. PPA REPRESENTATIVE / EMPLOYER VIEW
     ========================================================================= */
  if (currentRole === "ppa") {
    return (
      <div className="space-y-8 font-sans">
        <div className="p-8 bg-[#121815] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
              <Building2 className="w-3.5 h-3.5" />
              <span>ROLE: PPA REPRESENTATIVE (EMPLOYER)</span>
            </div>
            <h1 className="text-3xl font-medium text-white tracking-tight font-display">
              Grace High School PPA Hub 🏫
            </h1>
            <p className="text-xs text-slate-300">
              Managing 8 Corps Members assigned for 2024 Service Year.
            </p>
          </div>
          <button className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Corper Slot
          </button>
        </div>

        <div className="p-8 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-[#121815] dark:text-white uppercase tracking-widest font-display flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-600" /> Corper Leave Applications
          </h2>

          <div className="space-y-3">
            {leaveRequests.map((req) => (
              <div key={req.id} className="p-4 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-sm text-[#121815] dark:text-white font-display flex items-center gap-2">
                    <span>{req.name}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono">{req.role}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{req.reason}</p>
                </div>

                {req.status === "pending" ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => handleLeaveAction(req.id, "approved")}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleLeaveAction(req.id, "rejected")}
                      className="px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 ${
                    req.status === "approved" ? "bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-600/40" : "bg-red-950/20 text-red-700 dark:text-red-300 border border-red-600/40"
                  }`}>
                    {req.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     4. CDS EXECUTIVE VIEW
     ========================================================================= */
  if (currentRole === "cds_exec") {
    return (
      <div className="space-y-8 font-sans">
        <div className="p-8 bg-[#121815] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
              <Users className="w-3.5 h-3.5" />
              <span>ROLE: CDS EXECUTIVE</span>
            </div>
            <h1 className="text-3xl font-medium text-white tracking-tight font-display">
              Editorial & Publicity CDS Hub 📢
            </h1>
            <p className="text-xs text-slate-300">
              Ikeja LGA Branch · 42 Registered Members
            </p>
          </div>
          <Link href="/dashboard/community" className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shrink-0">
            Today&apos;s Attendance ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 font-display">Total Dues Collected</span>
            <div className="text-2xl font-bold font-display text-[#121815] dark:text-white">₦42,000</div>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">₦1,000 / Corper per month</span>
          </div>

          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 font-display">Active Projects</span>
            <div className="text-2xl font-bold font-display text-[#121815] dark:text-white">2 Projects</div>
            <span className="text-xs text-slate-600 dark:text-slate-400">Solar Library & School Renovation</span>
          </div>

          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 font-display">Next Meeting</span>
            <div className="text-2xl font-bold font-display text-[#121815] dark:text-white">Thursday, 9:00 AM</div>
            <span className="text-xs text-slate-600 dark:text-slate-400">Ikeja LGA Secretariat Hall</span>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     5. NYSC OFFICIAL / LGA INSPECTOR VIEW
     ========================================================================= */
  if (currentRole === "nysc_official") {
    return (
      <div className="space-y-8 font-sans">
        <div className="p-8 bg-[#121815] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ROLE: NYSC LGA INSPECTOR (LGI)</span>
            </div>
            <h1 className="text-3xl font-medium text-white tracking-tight font-display">
              Ikeja LGA Biometric Command Center 🏛️
            </h1>
            <p className="text-xs text-slate-300">
              Lagos Directorate · Monitoring 1,600 Active Corps Members
            </p>
          </div>
          <Link href="/dashboard/companion" className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shrink-0">
            Open Biometric Scanner ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 font-display">August Biometrics Verified</span>
            <div className="text-2xl font-bold font-display text-[#121815] dark:text-white">1,420 / 1,600</div>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">88.7% Clearance Completion</span>
          </div>

          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 font-display">PPA Employer Reports</span>
            <div className="text-2xl font-bold font-display text-[#121815] dark:text-white">148 Approved</div>
            <span className="text-xs text-slate-600 dark:text-slate-400">12 Pending Query</span>
          </div>

          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 font-display">Biometric Terminal</span>
            <div className="text-2xl font-bold font-display text-emerald-600">Online & Syncing</div>
            <span className="text-xs text-slate-600 dark:text-slate-400">HQ Server Ping: 12ms</span>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     6. EX-CORPS MEMBER (ALUMNI) VIEW
     ========================================================================= */
  return (
    <div className="space-y-8 font-sans">
      <div className="p-8 bg-[#121815] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
            <Award className="w-3.5 h-3.5" />
            <span>ROLE: EX-CORPS MEMBER (POP ALUMNI)</span>
          </div>
          <h1 className="text-3xl font-medium text-white tracking-tight font-display">
            KopaWee Alumni Launchpad 🎓
          </h1>
          <p className="text-xs text-slate-300">
            Sell relocation household items and explore post-service career opportunities.
          </p>
        </div>
        <Link href="/dashboard/marketplace" className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shrink-0">
          Post POP Item ➔
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/marketplace" className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 hover:border-emerald-600 transition-all space-y-3">
          <h3 className="text-base font-bold text-[#121815] dark:text-white font-display">POP Household Deals Market</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">Directly hand off mattresses, gas cylinders, and appliances to incoming corpers.</p>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block pt-1">Open POP Market ➔</span>
        </Link>

        <Link href="/dashboard/workplace" className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 hover:border-emerald-600 transition-all space-y-3">
          <h3 className="text-base font-bold text-[#121815] dark:text-white font-display">Post-NYSC Career & Gigs</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">NiYA Job Bank integration, CV builder, remote tech gigs, and employer referrals.</p>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block pt-1">Explore Jobs ➔</span>
        </Link>
      </div>
    </div>
  );
}
