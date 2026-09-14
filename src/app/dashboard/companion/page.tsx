"use client";

import React, { useState, useEffect } from "react";
import { useRole } from "@/shared/context/RoleContext";
import CampEssentialsChecklist from "@/shared/components/CampEssentialsChecklist";
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
  const [syncedCalendar, setSyncedCalendar] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [documents, setDocuments] = useState([
    { name: "NYSC Call-Up Letter", status: "Verified & stored", date: "Aug 10, 2026", type: "PDF" },
    { name: "Green Card Form", status: "Verified & stored", date: "Aug 12, 2026", type: "PDF" },
    { name: "Medical Fitness Certificate", status: "Pending verification", date: "Aug 15, 2026", type: "PDF" },
    { name: "Passport Photographs (8/8)", status: "Ready", date: "Aug 18, 2026", type: "JPG" },
  ]);

  // Upload Form State
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("PDF");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kopawee_offline_documents");
      if (saved) {
        setDocuments(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const handleGoogleCalendarSync = () => {
    const title = encodeURIComponent("NYSC Monthly LGA Biometric Clearance");
    const details = encodeURIComponent("Mandatory monthly LGA biometric clearance for serving corps members.");
    const location = encodeURIComponent("Ikeja LGA Secretariat Hub, Lagos");
    const dates = "20260925T140000Z/20260925T160000Z";
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    window.open(googleCalUrl, "_blank", "noopener,noreferrer");
    setSyncedCalendar(true);
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const newDoc = {
      name: docName.trim(),
      status: "Stored locally",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      type: docType,
    };

    const updated = [newDoc, ...documents];
    setDocuments(updated);
    try {
      localStorage.setItem("kopawee_offline_documents", JSON.stringify(updated));
    } catch (e) {}

    setDocName("");
    setDocType("PDF");
    setSelectedFile(null);
    setUploadModalOpen(false);
  };

  if (currentRole === "nysc_official") {
    return (
      <div className="space-y-8 font-sans">
        <div className="p-8 bg-[#121815] text-white border border-slate-800 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
            <ShieldCheck className="w-3.5 h-3.5" /> Official portal
          </div>
          <h1 className="text-3xl font-medium text-white tracking-tight font-display">Biometric clearance command portal</h1>
          <p className="text-xs text-slate-300">Ikeja LGA Branch · August Biometric Verification Window</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 font-display">Biometrics verified</span>
            <div className="text-2xl font-bold font-display text-[#121815] dark:text-white">1,420 / 1,600</div>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">88.7% clearance rate</span>
          </div>

          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 font-display">Pending biometric queue</span>
            <div className="text-2xl font-bold font-display text-[#121815] dark:text-white">180 Corpers</div>
            <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">Window closes in 4 days</span>
          </div>

          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 font-display">LGA hardware ping</span>
            <div className="text-2xl font-bold font-display text-emerald-600">Online & syncing</div>
            <span className="text-xs text-slate-600 dark:text-slate-400">HQ Server ping: 12ms</span>
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
            <Luggage className="w-3.5 h-3.5" /> PCM orientation companion
          </div>
          <h1 className="text-3xl font-medium text-white tracking-tight font-display">Pre-camp & orientation camp guide</h1>
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
            <CalendarCheck className="w-3.5 h-3.5" /> Serving corper companion
          </div>
          <h1 className="text-3xl font-medium text-white tracking-tight font-display">
            Monthly LGA biometric clearance
          </h1>
          <p className="text-xs text-slate-300">
            Next clearance window: Thursday, Sep 25 · 2:00 PM at Ikeja LGA Secretariat Hub.
          </p>
        </div>

        <button
          onClick={handleGoogleCalendarSync}
          className={`px-6 py-3.5 text-xs font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            syncedCalendar
              ? "bg-emerald-800 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>{syncedCalendar ? "Synced to Google Calendar" : "Sync to Google Calendar"}</span>
          <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
        </button>
      </div>

      {/* Encrypted Document Vault */}
      <div className="p-8 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest font-display">
              <Lock className="w-4 h-4" /> Encrypted offline document vault
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Securely access your mandatory clearance documents offline anytime.
            </p>
          </div>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold tracking-wider inline-flex items-center gap-2 cursor-pointer transition-colors shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span>Upload document</span>
          </button>
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

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 max-w-md w-full p-6 space-y-5 text-[#121815] dark:text-white font-sans animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-300/60 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold font-display">Upload document to vault</h2>
              </div>
              <button onClick={() => setUploadModalOpen(false)} className="p-1 hover:text-red-500 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-bold text-[10px] text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
                  Document title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PPA Acceptance Letter, Relocation Letter..."
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[10px] text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
                  Document type
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none"
                >
                  <option value="PDF">PDF document</option>
                  <option value="JPG">JPG image</option>
                  <option value="PNG">PNG image</option>
                  <option value="DOCX">Word document (DOCX)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[10px] text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
                  Select file
                </label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-300/60 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-wider cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Save to vault</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
