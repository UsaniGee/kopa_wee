"use client";

import React, { useState, useEffect } from "react";
import { useRole } from "@/shared/context/RoleContext";
import CampEssentialsChecklist from "@/shared/components/CampEssentialsChecklist";
import ComingSoon from "@/shared/components/ComingSoon";
import { googleCalendarAllDayLink } from "@/shared/utils/calendarLink";
import {
  FiCalendar,
  FiFileText,
  FiDownload,
  FiUpload,
  FiLock,
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin,
  FiClock,
  FiExternalLink,
  FiPackage,
  FiShield,
  FiBox,
  FiX,
  FiPlus,
  FiCheck,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

const CalendarCheck = FiCalendar;
const FileText = FiFileText;
const Download = FiDownload;
const Upload = FiUpload;
const Lock = FiLock;
const CheckCircle2 = FiCheckCircle;
const AlertCircle = FiAlertCircle;
const MapPin = FiMapPin;
const Clock = FiClock;
const ExternalLink = FiExternalLink;
const Luggage = FiPackage;
const Sparkles = HiSparkles;
const ShieldCheck = FiShield;
const Building2 = FiBox;
const X = FiX;
const Plus = FiPlus;
const Check = FiCheck;

export default function CompanionPage() {
  const { currentRole } = useRole();
  const [clearance, setClearance] = useState<{ hasCleared: boolean; isEligible: boolean; nextEligibleAt: string | null } | null>(null);
  const [clearanceFailed, setClearanceFailed] = useState(false);
  const [place, setPlace] = useState<{ lga: string | null; deployedState: string | null } | null>(null);

  useEffect(() => {
    if (currentRole !== "serving") return;
    fetch("/api/clearance")
      .then((res) => res.json())
      .then((data) => (data.success ? setClearance(data.data) : setClearanceFailed(true)))
      .catch(() => setClearanceFailed(true));
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((data) => data.success && setPlace({ lga: data.data.lga, deployedState: data.data.deployedState }))
      .catch(() => {});
  }, [currentRole]);
  const placeLabel = place?.lga && place.deployedState ? `${place.lga} LGA, ${place.deployedState}` : null;
  const nextDate = clearance?.nextEligibleAt ? new Date(clearance.nextEligibleAt) : null;
  const nextDateLabel = nextDate?.toLocaleDateString("en-NG", { weekday: "long", month: "short", day: "numeric" });
  const clearanceSummary = clearanceFailed
    ? "Your clearance status could not be loaded. Refresh to try again."
    : !clearance
    ? "Loading your clearance status..."
    : !clearance.hasCleared
      ? "No clearance logged yet. Record it on your Overview after you clear at your LGA."
      : clearance.isEligible
        ? "Your next clearance window is open now."
        : `You can clear again from ${nextDateLabel}.`;
  // Only a future date is worth adding; an open window has no date to plan for
  const calendarUrl = nextDate && !clearance?.isEligible
    ? googleCalendarAllDayLink({
        title: "NYSC monthly LGA clearance",
        date: nextDate,
        details: "Your next monthly clearance is due from this day (from your KopaWee record).",
        location: placeLabel ?? undefined,
      })
    : null;

  if (currentRole === "nysc_official") {
    return (
      <ComingSoon
        icon={ShieldCheck}
        title="Clearance activity for your LGA"
        description="LGA officials will be able to see monthly clearance activity for corps members in their LGA."
        planned={["Clearance activity by LGA", "Corps member lookup by state code"]}
      />
    );
  }

  if (currentRole === "pcm") {
    return (
      <div className="space-y-8 font-sans">
        <div className="p-8 bg-[#121815] text-white border border-slate-800 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
            <Luggage className="w-3.5 h-3.5" /> PCM orientation companion
          </div>
          <h1 className="text-3xl font-medium text-white tracking-tight font-display">Pre-camp & orientation camp guide</h1>
          <p className="text-xs text-slate-300">Your camp packing checklist, saved to your account.</p>
        </div>

        <CampEssentialsChecklist />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="p-8 bg-[#121815] text-white border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
            <CalendarCheck className="w-3.5 h-3.5" /> Serving corper companion
          </div>
          <h1 className="text-3xl font-medium text-white tracking-tight font-display">
            Monthly LGA biometric clearance
          </h1>
          <p className="text-xs text-slate-300">
            {clearanceSummary}
            {placeLabel ? ` · ${placeLabel}` : " · Add your LGA in Settings."}
          </p>
        </div>

        {calendarUrl ? (
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-wider transition-all flex items-center gap-2"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Add to Google Calendar</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
          </a>
        ) : (
          <span className="text-[11px] text-slate-400 max-w-[14rem]">The calendar link appears once your first clearance is logged.</span>
        )}
      </div>

      <ComingSoon
        compact
        icon={Lock}
        title="Document vault"
        description="Keep copies of your call-up letter, green card and clearance documents in one place."
        planned={["Upload documents from your phone", "Open them without an internet connection"]}
      />
    </div>
  );
}
