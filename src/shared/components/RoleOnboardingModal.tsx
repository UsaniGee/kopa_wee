"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  X,
  CheckCircle2,
  ArrowRight,
  Check,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: string;
}

type Step = "signup" | "role" | "preview";

interface Role {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  features: string[];
  hiddenModules: string[];
}

/* ─────────────────────────────────────────────
   Data (defined outside component to avoid re-creation)
───────────────────────────────────────────── */
const ROLES: Role[] = [
  {
    id: "prospective",
    title: "Prospective Corps Member",
    subtitle: "Preparing for mobilization, call-up letter & orientation camp",
    badge: "Pre-Camp Flow",
    features: [
      "Camp Countdown & Registration Timeline",
      "Smart Packing Checklist with progress tracking",
      "Orientation Camp & State Survival Guides",
      "Pre-Camp Travel Route Planner",
      "AI Assistant for Call-up & Relocation rules",
    ],
    hiddenModules: ["PPA portal", "CDS register", "LGA Clearance Attendance"],
  },
  {
    id: "serving",
    title: "Serving Corps Member",
    subtitle: "Active service year companion in your state & LGA",
    badge: "Active Service Flow",
    features: [
      "Today's Schedule & Smart LGA Clearance Alerts",
      "Corper Marketplace (Buy/Sell mattresses & gas cylinders)",
      "Accommodation Directory & Roommate Matching",
      "Interstate Travel Safety & SOS Emergency Trigger",
      "CDS Group Community & Chat Hub",
    ],
    hiddenModules: ["Employer portal", "Admin controls"],
  },
  {
    id: "ex-corper",
    title: "Ex-Corps Member (Alumni)",
    subtitle: "Completed service year — stay connected, mentor & trade",
    badge: "Alumni Network",
    features: [
      "Alumni Network & Corps Member Community Access",
      "Marketplace — Continue buying & selling post-service",
      "Mentor Hub — Connect with & guide active corps members",
      "Job Board & Post-NYSC Career Opportunities",
      "Service Year Memories Gallery & Certificate Archive",
    ],
    hiddenModules: ["LGA Clearance", "CDS Register", "PPA Attendance"],
  },
  {
    id: "ppa",
    title: "PPA Representative (Employer)",
    subtitle: "Host organization managing assigned corps members",
    badge: "Workplace Portal",
    features: [
      "Today's Attendance (Present / Absent / Late / Clock-In)",
      "Staff List & Corps Member Management",
      "Leave Application Review (Approve / Reject)",
      "Workplace Announcements & Monthly Reports",
    ],
    hiddenModules: ["Marketplace", "Camp guide", "Roommate Finder"],
  },
  {
    id: "cds",
    title: "CDS Executive",
    subtitle: "Community Development Service group leadership",
    badge: "Community Exec",
    features: [
      "CDS Meeting Attendance Register",
      "Community Project Tracker",
      "Group Dues & Announcement Board",
      "Event Gallery & Monthly Project Reports",
    ],
    hiddenModules: ["PPA management", "Admin portal"],
  },
  {
    id: "lga",
    title: "LGA Inspector / NYSC Official",
    subtitle: "Official oversight and monthly clearance verification",
    badge: "Official Admin",
    features: [
      "Today's LGA Clearance Overview",
      "Biometric & Clearance Attendance Log",
      "Corps Member Statistics by State/LGA",
      "Official Announcements & Incident Reports",
    ],
    hiddenModules: ["Personal Marketplace", "Travel SOS"],
  },
];

const STEPS: { id: Step; label: string }[] = [
  { id: "signup", label: "1. Sign Up & Auth" },
  { id: "role", label: "2. Who Are You?" },
  { id: "preview", label: "3. Dashboard Preview" },
];

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export default function RoleOnboardingModal({
  isOpen,
  onClose,
  defaultRole,
}: RoleModalProps) {
  /* All hooks declared unconditionally (Rules of Hooks) */
  const [step, setStep] = useState<Step>("role");
  const [selectedRole, setSelectedRole] = useState<string>(
    defaultRole || "serving"
  );
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [animKey, setAnimKey] = useState(0); // bump to re-trigger step animation

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  /* Sync defaultRole when prop changes */
  useEffect(() => {
    if (defaultRole) setSelectedRole(defaultRole);
  }, [defaultRole]);

  /* Focus the close button when modal opens */
  useEffect(() => {
    if (isOpen) {
      closeRef.current?.focus();
    }
  }, [isOpen]);

  /* Keyboard: Escape to close */
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  /* Prevent body scroll while open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const changeStep = useCallback((next: Step) => {
    setAnimKey((k) => k + 1);
    setStep(next);
  }, []);

  const currentRoleObj =
    ROLES.find((r) => r.id === selectedRole) ?? ROLES[1];

  /* Early return AFTER all hooks */
  if (!isOpen) return null;

  /* ── Helpers ── */
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
      aria-hidden="false"
    >
      {/* Dialog panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="KopaWee Onboarding Experience"
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white text-black shadow-2xl modal-slide-in"
      >
        {/* ── Progress bar ── */}
        <div
          className="absolute top-0 left-0 h-1.5 bg-emerald-500 transition-all duration-500"
          style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          role="progressbar"
          aria-valuenow={stepIndex + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-label={`Step ${stepIndex + 1} of ${STEPS.length}`}
        />

        {/* ── Close button ── */}
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 bg-slate-100 text-black hover:bg-black hover:text-white transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          {/* ── Header ── */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 bg-black flex items-center justify-center font-black text-lg text-white shrink-0"
              aria-hidden="true"
            >
              K
            </div>
            <div>
              <h2 className="text-lg font-black text-black">
                KopaWee Onboarding Experience
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select a user role to see how the platform dynamically
                transforms.
              </p>
            </div>
          </div>

          {/* ── Step tabs ── */}
          <nav
            aria-label="Onboarding steps"
            className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 mb-8"
          >
            {STEPS.map((s, i) => {
              const isActive = step === s.id;
              const isPast = i < stepIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => changeStep(s.id)}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`${s.label}${isPast ? " (completed)" : ""}`}
                  className={`py-2 px-3 text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    isActive
                      ? "bg-emerald-500 text-white shadow-sm"
                      : isPast
                      ? "bg-white text-black hover:bg-slate-200"
                      : "text-slate-500 hover:text-black"
                  }`}
                >
                  {isPast && <Check className="w-3 h-3 shrink-0" />}
                  {s.label}
                </button>
              );
            })}
          </nav>

          {/* ── Step content (animated) ── */}
          <div key={animKey} className="step-fade-in">
            {/* STEP 1: SIGN UP */}
            {step === "signup" && (
              <div className="flex flex-col gap-6 max-w-md mx-auto py-4">
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-2 text-emerald-800 bg-emerald-100 px-3 py-1 text-xs font-bold mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Secure & Private
                  </div>
                  <h3 className="text-lg font-black text-black">
                    First-Time User Registration
                  </h3>
                  <p className="text-xs text-slate-500">
                    One account unlocks your custom modular experience.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="modal-email"
                      className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider"
                    >
                      Email Address
                    </label>
                    <input
                      id="modal-email"
                      type="email"
                      placeholder="corper@kopawee.ng"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-100 focus:bg-slate-200 text-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="modal-phone"
                      className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider"
                    >
                      Phone Number{" "}
                      <span className="font-normal text-slate-400 normal-case">
                        (WhatsApp Ready)
                      </span>
                    </label>
                    <input
                      id="modal-phone"
                      type="tel"
                      placeholder="+234 801 234 5678"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-100 focus:bg-slate-200 text-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="modal-password"
                      className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider"
                    >
                      Password
                    </label>
                    <input
                      id="modal-password"
                      type="password"
                      placeholder="••••••••••••"
                      autoComplete="new-password"
                      className="w-full px-4 py-2.5 bg-slate-100 focus:bg-slate-200 text-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  {/* Primary CTA — green */}
                  <button
                    onClick={() => changeStep("role")}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Verify & Next: Select Role{" "}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ROLE SELECTOR */}
            {step === "role" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-[0.2em] bg-emerald-100 px-3 py-1">
                    <Sparkles className="w-3 h-3" />
                    This Answer Changes Everything
                  </span>
                  <h3 className="text-2xl font-black text-black">
                    Who are you?
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    The platform dynamically presents only the mini-products and
                    features relevant to your current state.
                  </p>
                </div>

                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  role="radiogroup"
                  aria-label="Select your role"
                >
                  {ROLES.map((role) => {
                    const isSelected = selectedRole === role.id;
                    return (
                      <div
                        key={role.id}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onClick={() => {
                          setSelectedRole(role.id);
                          changeStep("preview");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedRole(role.id);
                            changeStep("preview");
                          }
                        }}
                        className={`p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:scale-[1.01] ${
                          isSelected
                            ? "bg-emerald-100 text-black shadow-md ring-2 ring-emerald-500"
                            : "bg-slate-100 hover:bg-slate-200 text-black"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 text-white bg-black">
                              {role.badge}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            )}
                          </div>
                          <h4 className="font-bold text-sm text-black">
                            {role.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {role.subtitle}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 flex items-center justify-between text-xs text-emerald-700 font-bold">
                          <span>Preview Flow</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: DYNAMIC DASHBOARD PREVIEW */}
            {step === "preview" && (
              <div className="space-y-6">
                {/* Role banner */}
                <div className="flex items-center justify-between bg-emerald-500 text-white p-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                      Active Role Selected
                    </span>
                    <h3 className="text-base font-black">
                      {currentRoleObj.title}
                    </h3>
                    <p className="text-xs opacity-90 mt-0.5">
                      {currentRoleObj.subtitle}
                    </p>
                  </div>
                  {/* Secondary button */}
                  <button
                    onClick={() => changeStep("role")}
                    className="px-3 py-1.5 text-xs font-bold text-black bg-white hover:bg-slate-100 transition-all duration-200 shrink-0"
                  >
                    Change Role
                  </button>
                </div>

                {/* Module grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Unlocked features */}
                  <div className="space-y-3 bg-emerald-50 p-4">
                    <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Unlocked Features
                    </h4>
                    <ul className="space-y-2">
                      {currentRoleObj.features.map((feat, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-700 font-medium"
                        >
                          <span
                            className="w-1.5 h-1.5 bg-emerald-500 mt-1.5 shrink-0"
                            aria-hidden="true"
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Filtered out */}
                  <div className="space-y-3 bg-slate-100 p-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <X className="w-4 h-4" /> Filtered Out
                    </h4>
                    <ul className="space-y-2">
                      {currentRoleObj.hiddenModules.map((hid, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-400 line-through"
                        >
                          <span
                            className="w-1.5 h-1.5 bg-slate-300 mt-1.5 shrink-0"
                            aria-hidden="true"
                          />
                          <span>{hid}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-slate-500 italic pt-2">
                      "The user only sees what they need. Nothing breaks because
                      each module is independent."
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4">
                  <span className="text-xs text-slate-600 text-center sm:text-left">
                    Ready to experience KopaWee as a{" "}
                    <strong className="text-black font-black">{currentRoleObj.title}</strong>?
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Secondary button */}
                    <button
                      onClick={() => changeStep("role")}
                      className="px-4 py-2 text-xs font-bold text-black bg-slate-200 hover:bg-black hover:text-white transition-all duration-200"
                    >
                      Back to Roles
                    </button>
                    {/* Primary — green */}
                    <Link
                      href="/dashboard"
                      onClick={onClose}
                      className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-all duration-200 block text-center"
                    >
                      Enter App Dashboard →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scoped keyframe animations */}
      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        .modal-slide-in {
          animation: modalSlideIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes stepFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .step-fade-in {
          animation: stepFadeIn 0.22s ease-out both;
        }
      `}</style>
    </div>
  );
}
