"use client";

import React, { useState } from "react";
import { useRole } from "@/shared/context/RoleContext";
import CampEssentialsChecklist from "@/shared/components/CampEssentialsChecklist";
import { FiCalendar, FiFileText, FiDownload, FiUpload, FiLock, FiCheckCircle, FiAlertCircle, FiMapPin, FiClock, FiExternalLink, FiPackage, FiShield, FiBox } from "react-icons/fi";
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

export default function CompanionPage() {
  const { currentRole } = useRole();
  const [syncedCalendar, setSyncedCalendar] = useState(false);
  const [documents, setDocuments] = useState([
    { name: "NYSC Call-Up Letter", status: "Verified & Stored", date: "Aug 10, 2026", type: "PDF" },
    { name: "Green Card Form", status: "Verified & Stored", date: "Aug 12, 2026", type: "PDF" },
    { name: "Medical Fitness Certificate", status: "Pending Verification", date: "Aug 15, 2026", type: "PDF" },
    { name: "Passport Photographs (8/8)", status: "Ready", date: "Aug 18, 2026", type: "JPG" },
  ]);

  if (currentRole === "nysc_official") {
    return (
      <div className="space-y-8 font-sans">
        <div className="p-8 bg-[#121815] text-white border border-slate-800 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
            <ShieldCheck className="w-3.5 h-3.5" /> Official Portal
          </div>
          <h1 className="text-3xl font-medium text-white tracking-tight font-display">Biometric Clearance Command Portal</h1>
          <p className="text-xs text-slate-300">Ikeja LGA Branch · August Biometric Verification Window</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 font-display">Biometrics Verified</span>
            <div className="text-2xl font-bold font-display text-[#121815] dark:text-white">1,420 / 1,600</div>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">88.7% Clearance Rate</span>
          </div>

          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 font-display">Pending Biometric Queue</span>
            <div className="text-2xl font-bold font-display text-[#121815] dark:text-white">180 Corpers</div>
            <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">Window Closes in 4 Days</span>
          </div>

          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 font-display">LGA Hardware Ping</span>
            <div className="text-2xl font-bold font-display text-emerald-600">Online & Syncing</div>
            <span className="text-xs text-slate-600 dark:text-slate-400">HQ Server Ping: 12ms</span>
          </div>
        </div>
      </div>
    );
  }

  if (currentRole === "pcm") {
    return (
      <div className="space-y-8 font-sans">
        <div className="p-8 bg-[#121815] text-white border border-slate-800 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
            <Luggage className="w-3.5 h-3.5" /> PCM Orientation Companion
          </div>
          <h1 className="text-3xl font-medium text-white tracking-tight font-display">Pre-Camp & Orientation Camp Guide</h1>
          <p className="text-xs text-slate-300">Offline document vault and packing checklist for prospective corps members.</p>
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
            <CalendarCheck className="w-3.5 h-3.5" /> Serving Corper Companion
          </div>
          <h1 className="text-3xl font-medium text-white tracking-tight font-display">
            Monthly LGA Biometric Clearance
          </h1>
          <p className="text-xs text-slate-300">
            Next Clearance Window: Thursday, Aug 25 · 2:00 PM at Ikeja LGA Secretariat Hub.
          </p>
        </div>

        <button
          onClick={() => setSyncedCalendar(!syncedCalendar)}
          className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            syncedCalendar
              ? "bg-emerald-800 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>{syncedCalendar ? "Synced to Google Calendar" : "Sync to Google Calendar"}</span>
        </button>
      </div>

      {/* Encrypted Document Vault */}
      <div className="p-8 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest font-display">
            <Lock className="w-4 h-4" /> Encrypted Offline Document Vault
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase">AES-256 Encrypted Storage</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {documents.map((doc, i) => (
            <div key={i} className="p-5 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">{doc.type}</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#121815] dark:text-white font-display">{doc.name}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{doc.date}</p>
              </div>
              <div className="pt-2 border-t border-slate-300/50 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{doc.status}</span>
                <Download className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-600 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
