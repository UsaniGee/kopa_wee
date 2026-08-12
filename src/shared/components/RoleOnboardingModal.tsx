"use client";

import React, { useState } from "react";
import { X, CheckCircle2, UserCheck, ShieldAlert, ShoppingBag, Home, Briefcase, Users, FileText, ArrowRight, Sparkles, Bell, Calendar, MapPin, Check } from "lucide-react";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: string;
}

export default function RoleOnboardingModal({ isOpen, onClose, defaultRole }: RoleModalProps) {
  const [step, setStep] = useState<"signup" | "role" | "preview">("role");
  const [selectedRole, setSelectedRole] = useState<string>(defaultRole || "serving");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  if (!isOpen) return null;

  const roles = [
    {
      id: "prospective",
      title: "Prospective Corps Member",
      subtitle: "Preparing for mobilization, call-up letter & orientation camp",
      badge: "Pre-Camp Flow",
      color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-600 dark:text-blue-400",
      features: [
        "Camp Countdown & Registration Timeline",
        "Smart Packing Checklist with progress tracking",
        "Orientation Camp & State Survival Guides",
        "Pre-Camp Travel Route Planner",
        "AI Assistant for Call-up & Relocation rules"
      ],
      hiddenModules: ["No PPA", "No CDS", "No LGA Clearance Attendance"]
    },
    {
      id: "serving",
      title: "Serving Corps Member",
      subtitle: "Active service year companion in your state & LGA",
      badge: "Active Service Flow",
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
      features: [
        "Today's Schedule & Smart LGA Clearance Alerts",
        "Corper Marketplace (Buy/Sell mattresses & gas cylinders)",
        "Accommodation Directory & Roommate Matching",
        "Interstate Travel Safety & SOS Emergency Trigger",
        "CDS Group Community & Chat Hub"
      ],
      hiddenModules: ["No Employer Portal", "No Admin Controls"]
    },
    {
      id: "ppa",
      title: "PPA Representative (Employer)",
      subtitle: "Host organization managing assigned corps members",
      badge: "Workplace Portal",
      color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-600 dark:text-purple-400",
      features: [
        "Today's Attendance (Present / Absent / Late / Clock-In)",
        "Staff List & Corps Member Management",
        "Leave Application Review (Approve / Reject)",
        "Workplace Announcements & Monthly Reports"
      ],
      hiddenModules: ["No Marketplace", "No Camp Guide", "No Roommate Finder"]
    },
    {
      id: "cds",
      title: "CDS Executive",
      subtitle: "Community Development Service group leadership",
      badge: "Community Exec",
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-600 dark:text-amber-400",
      features: [
        "CDS Meeting Attendance Register",
        "Community Project Tracker",
        "Group Dues & Announcement Board",
        "Event Gallery & Monthly Project Reports"
      ],
      hiddenModules: ["No PPA Management", "No Admin Portal"]
    },
    {
      id: "lga",
      title: "LGA Inspector / NYSC Official",
      subtitle: "Official oversight and monthly clearance verification",
      badge: "Official Admin",
      color: "from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-600 dark:text-rose-400",
      features: [
        "Today's LGA Clearance Overview",
        "Biometric & Clearance Attendance Log",
        "Corps Member Statistics by State/LGA",
        "Official Announcements & Incident Reports"
      ],
      hiddenModules: ["No Personal Marketplace", "No Travel SOS"]
    }
  ];

  const currentRoleObj = roles.find((r) => r.id === selectedRole) || roles[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/30 bg-slate-900/90 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-xl text-white">
            K+
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              KopaWee Onboarding Experience
            </h3>
            <p className="text-xs text-slate-400">
              Select a user role to see how the modular platform dynamically transforms the experience.
            </p>
          </div>
        </div>

        {/* Step Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-800/80 rounded-2xl mb-8 border border-slate-700">
          <button
            onClick={() => setStep("signup")}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all ${
              step === "signup" ? "bg-emerald-500 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            1. Sign Up & Auth
          </button>
          <button
            onClick={() => setStep("role")}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all ${
              step === "role" ? "bg-emerald-500 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            2. "Who Are You?" Selector
          </button>
          <button
            onClick={() => setStep("preview")}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all ${
              step === "preview" ? "bg-emerald-500 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            3. Dynamic Dashboard Preview
          </button>
        </div>

        {/* STEP 1: SIGN UP */}
        {step === "signup" && (
          <div className="flex flex-col gap-6 max-w-md mx-auto py-4">
            <div className="text-center space-y-1">
              <h4 className="text-lg font-bold text-white">First-Time User Registration</h4>
              <p className="text-xs text-slate-400">One account unlocks your custom modular experience.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="corper@kopawee.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (WhatsApp Ready)</label>
                <input
                  type="tel"
                  placeholder="+234 801 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={() => setStep("role")}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                Verify & Next: Select Role <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ROLE SELECTOR */}
        {step === "role" && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                This Answer Changes Everything
              </span>
              <h4 className="text-2xl font-black text-white">Who are you?</h4>
              <p className="text-xs text-slate-400">
                The platform dynamically presents only the mini-products and features relevant to your current state.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role.id);
                    setStep("preview");
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between hover:scale-[1.02] ${
                    selectedRole === role.id
                      ? "bg-slate-800/90 border-emerald-500 ring-2 ring-emerald-500/30"
                      : "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${role.color}`}>
                        {role.badge}
                      </span>
                      {selectedRole === role.id && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                    <h5 className="font-bold text-base text-white">{role.title}</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">{role.subtitle}</p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                    <span>Preview Flow</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: DYNAMIC DASHBOARD PREVIEW */}
        {step === "preview" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between bg-slate-800/70 p-4 rounded-2xl border border-slate-700">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Active Role Selected</span>
                <h4 className="text-lg font-extrabold text-white">{currentRoleObj.title}</h4>
                <p className="text-xs text-slate-400">{currentRoleObj.subtitle}</p>
              </div>
              <button
                onClick={() => setStep("role")}
                className="px-3 py-1.5 text-xs font-bold text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                Change Role
              </button>
            </div>

            {/* Rendered Modules for Selected Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visible Mini-Products */}
              <div className="space-y-3 bg-emerald-950/30 p-4 rounded-2xl border border-emerald-500/30">
                <h5 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Unlocked Mini-Products & Features
                </h5>
                <ul className="space-y-2">
                  {currentRoleObj.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hidden / Irrelevant Modules */}
              <div className="space-y-3 bg-slate-800/30 p-4 rounded-2xl border border-slate-700/60">
                <h5 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <X className="w-4 h-4 text-slate-500" /> Filtered Out (Uncluttered UX)
                </h5>
                <ul className="space-y-2">
                  {currentRoleObj.hiddenModules.map((hid, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-500 line-through">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                      <span>{hid}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-700/50">
                  "The user only sees what they need. Nothing breaks because each module is independent."
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Ready to experience KopaWee as a {currentRoleObj.title}?
              </span>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform"
              >
                Close Preview & Explore Landing Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
