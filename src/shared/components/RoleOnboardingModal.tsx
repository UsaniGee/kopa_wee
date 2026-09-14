"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { FiX, FiCheckCircle, FiArrowRight, FiCheck, FiShield } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

const X = FiX;
const CheckCircle2 = FiCheckCircle;
const ArrowRight = FiArrowRight;
const Check = FiCheck;
const ShieldCheck = FiShield;
const Sparkles = HiSparkles;

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
      "Corper Lodges & Roommate Finder",
      "Travel SOS & Highway Check-ins",
      "PPA Logbook & CDS Attendance",
    ],
    hiddenModules: ["Employer Admin Tools", "Inspector Biometrics Portal"],
  },
  {
    id: "alumni",
    title: "Ex-Corps Member (Alumni)",
    subtitle: "Completed service year — stay connected, mentor & trade",
    badge: "Alumni Network",
    features: [
      "POP Household Items Marketplace",
      "NiYA Job Bank & Career Opportunities",
      "Corper Alumni Directory & Mentorship",
      "Post-POP Business Directory",
    ],
    hiddenModules: ["Camp Countdown", "Biometric Clearance Alerts", "PPA Logbook"],
  },
  {
    id: "ppa",
    title: "PPA Representative (Employer)",
    subtitle: "Host organization managing assigned corps members",
    badge: "Workplace Portal",
    features: [
      "Assigned Corpers Directory",
      "Digital Attendance & Clock-in Log",
      "Leave Requests Review & Approval",
      "Monthly Employer Evaluation Submission",
    ],
    hiddenModules: ["Marketplace", "Camp Checklist", "Roommate Finder"],
  },
  {
    id: "cds_exec",
    title: "CDS Executive",
    subtitle: "Community Development Service group leadership",
    badge: "Community Exec",
    features: [
      "Group Register & Attendance Barcode Scanner",
      "CDS Dues Collection & Finance Log",
      "Group Announcements & Broadcast",
      "Community Project Management",
    ],
    hiddenModules: ["PPA Admin", "Roommate Finder"],
  },
  {
    id: "nysc_official",
    title: "LGA Inspector / NYSC Official",
    subtitle: "Official oversight and monthly clearance verification",
    badge: "Official Admin",
    features: [
      "Monthly Biometric Clearance Dashboard",
      "Employer Review Approvals",
      "LGA Corper Statistics & Demographics",
      "Official Notices Broadcast",
    ],
    hiddenModules: ["P2P Marketplace", "Housing Finder"],
  },
];

export default function RoleOnboardingModal({
  isOpen,
  onClose,
  defaultRole = "serving",
}: RoleModalProps) {
  const [step, setStep] = useState<Step>("role");
  const [selectedRoleId, setSelectedRoleId] = useState<string>(defaultRole);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (defaultRole) setSelectedRoleId(defaultRole);
  }, [defaultRole]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const selectedRole = ROLES.find((r) => r.id === selectedRoleId) ?? ROLES[1];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
      <div className="fixed inset-0 bg-[#0a0f0d]/80 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div
        ref={modalRef}
        className="relative w-full max-w-4xl bg-[#121815] text-white border border-slate-800 shadow-2xl z-10 my-auto overflow-hidden p-8 sm:p-12 space-y-8"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <span className="font-bold text-xl tracking-widest uppercase font-display text-white">
              KOPA<span className="text-emerald-500 font-extrabold">'WEE</span>
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">
              · Role experience
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-semibold text-emerald-400">
              Dynamic platform adaptation
            </span>
            <h2 className="text-3xl sm:text-4xl font-medium text-white font-display">Select Your Active NYSC Role</h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              KopaWee isolates features for your current state — removing clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROLES.map((role) => {
              const isSelected = role.id === selectedRoleId;
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`p-6 border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? "bg-[#1a2520] border-emerald-500"
                      : "bg-[#161f1b]/50 border-slate-800 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-slate-800 text-emerald-400">
                      {role.badge}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <h3 className="text-base font-bold text-white font-display">{role.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{role.subtitle}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end pt-6 border-t border-slate-800">
          <Link
            href="/auth?mode=signup"
            onClick={onClose}
            className="px-6 sm:px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer font-display"
          >
            <span>Launch role experience</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
