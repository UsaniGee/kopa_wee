"use client";

import React, { useState } from "react";
import { useRole } from "@/shared/context/RoleContext";
import CampEssentialsChecklist from "@/shared/components/CampEssentialsChecklist";
import { 
  CalendarCheck, 
  FileText, 
  Download, 
  Upload, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  Clock,
  ExternalLink,
  Luggage,
  Sparkles,
  ShieldCheck,
  Building2
} from "lucide-react";

export default function CompanionPage() {
  const { currentRole } = useRole();
  const [syncedCalendar, setSyncedCalendar] = useState(false);
  const [documents, setDocuments] = useState([
    { name: "NYSC Call-Up Letter", status: "Verified & Stored", date: "Aug 10, 2026", type: "PDF" },
    { name: "Green Card Form", status: "Verified & Stored", date: "Aug 12, 2026", type: "PDF" },
    { name: "Medical Fitness Certificate", status: "Pending Verification", date: "Aug 15, 2026", type: "PDF" },
    { name: "Passport Photographs (8/8)", status: "Ready", date: "Aug 18, 2026", type: "JPG" },
  ]);

  // =========================================================================
  // NYSC OFFICIAL / LGA INSPECTOR VIEW
  // =========================================================================
  if (currentRole === "nysc_official") {
    return (
      <div className="space-y-8">
        <div className="p-6 bg-black text-white space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white font-black text-xs uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Official Portal
          </div>
          <h1 className="text-2xl font-black text-white">Biometric Clearance Command Portal</h1>
          <p className="text-xs text-slate-300">Ikeja LGA Branch · August Biometric Verification Window</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-500">Biometrics Verified</span>
            <div className="text-2xl font-black text-black">1,420 / 1,600</div>
            <span className="text-xs text-emerald-700 font-bold">88.7% Clearance Rate</span>
          </div>

          <div className="p-6 bg-white shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-500">Pending Biometric Queue</span>
            <div className="text-2xl font-black text-black">180 Corpers</div>
            <span className="text-xs text-amber-600 font-bold">Window Closes in 4 Days</span>
          </div>

          <div className="p-6 bg-white shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-500">Terminal Scanner Status</span>
            <div className="text-2xl font-black text-emerald-600">Online & Active</div>
            <span className="text-xs text-slate-500">Device #BOOTH-03 Connected</span>
          </div>
        </div>

        <div className="p-6 bg-white shadow-sm space-y-4">
          <h2 className="text-base font-black text-black uppercase tracking-wider">LGI Official Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button className="px-5 py-2.5 bg-black text-white text-xs font-black hover:bg-slate-800">
              Trigger Biometric Scanner
            </button>
            <button className="px-5 py-2.5 bg-slate-100 text-black text-xs font-black hover:bg-slate-200">
              Download Biometric Roster (PDF)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PROSPECTIVE CORPS MEMBER (PCM) VIEW
  // =========================================================================
  if (currentRole === "pcm") {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white shadow-sm">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 inline-block mb-2">
              • PCM Dedicated Companion
            </span>
            <h1 className="text-2xl font-black text-black">Camp Essentials & Orientation Guide</h1>
            <p className="text-xs text-slate-500 mt-1">
              Interactive orientation packing checklist, document vault, and mobilization timeline.
            </p>
          </div>

          <button
            onClick={() => setSyncedCalendar(!syncedCalendar)}
            className={`px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              syncedCalendar ? "bg-emerald-500 text-white" : "bg-slate-100 text-black hover:bg-black hover:text-white"
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>{syncedCalendar ? "Synced to Google Calendar" : "Sync to Google Calendar"}</span>
          </button>
        </div>

        {/* Interactive Camp Essentials Checklist Component */}
        <CampEssentialsChecklist />

        {/* Encrypted Document Vault */}
        <div className="p-6 bg-white shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-black text-white">
                <Lock className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-base font-black text-black">PCM Encrypted Document Vault</h2>
                <p className="text-xs text-slate-500">Stored locally on your device for offline verification at orientation camp.</p>
              </div>
            </div>

            <button className="px-3 py-1.5 bg-slate-100 hover:bg-black hover:text-white text-black text-xs font-bold transition-all flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> Upload Document
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {documents.map((doc, idx) => (
              <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-black">{doc.name}</h3>
                    <span className="text-[10px] text-slate-400">Added {doc.date} · {doc.type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 ${
                    doc.status.includes("Verified") ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
                  }`}>
                    {doc.status}
                  </span>

                  <button className="p-1.5 bg-slate-100 hover:bg-slate-200 text-black text-xs font-bold transition-all flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" /> View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SERVING CORPS MEMBER VIEW
  // =========================================================================
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white shadow-sm">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 inline-block mb-2">
            • Serving Corper Module
          </span>
          <h1 className="text-2xl font-black text-black">Smart Clearance & Biometric Companion</h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated LGA clearance tracking, encrypted document vault, and biometric schedule.
          </p>
        </div>

        <button
          onClick={() => setSyncedCalendar(!syncedCalendar)}
          className={`px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            syncedCalendar ? "bg-emerald-500 text-white" : "bg-slate-100 text-black hover:bg-black hover:text-white"
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>{syncedCalendar ? "Synced to Google Calendar" : "Sync to Google Calendar"}</span>
        </button>
      </div>

      {/* Clearance Status Card */}
      <div className="p-6 bg-slate-100 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              August 2026 Biometric Clearance Window
            </span>
            <h2 className="text-xl font-black text-black">Ikeja LGA Primary Center, Lagos State</h2>
            <p className="text-xs text-slate-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> LGA Secretariat, Community Road, Ikeja
            </p>
          </div>
          <div className="px-4 py-2 bg-emerald-500 text-white text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider block">Time Remaining</span>
            <span className="text-lg font-black">4 Days 14 Hours</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Clearance Window</span>
            <span className="text-sm font-black text-black block">Aug 22 — Aug 27</span>
          </div>
          <div className="p-4 bg-white space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Est. Queue Wait Time</span>
            <span className="text-sm font-black text-emerald-600 block">15 – 25 Minutes (Morning Batch)</span>
          </div>
          <div className="p-4 bg-white space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Biometric Officer</span>
            <span className="text-sm font-black text-black block">Officer A. Bello (Booth 3)</span>
          </div>
        </div>
      </div>

      {/* Encrypted Offline Document Vault */}
      <div className="p-6 bg-white shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-black text-white">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-black">Encrypted Offline Document Vault</h2>
              <p className="text-xs text-slate-500">Stored locally on your device for instant offline access at LGA office.</p>
            </div>
          </div>

          <button className="px-3 py-1.5 bg-slate-100 hover:bg-black hover:text-white text-black text-xs font-bold transition-all flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" /> Upload Document
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {documents.map((doc, idx) => (
            <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-black">{doc.name}</h3>
                  <span className="text-[10px] text-slate-400">Added {doc.date} · {doc.type}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 ${
                  doc.status.includes("Verified") ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
                }`}>
                  {doc.status}
                </span>

                <button className="p-1.5 bg-slate-100 hover:bg-slate-200 text-black text-xs font-bold transition-all flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
