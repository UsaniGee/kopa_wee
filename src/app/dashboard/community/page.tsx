"use client";

import React, { useState } from "react";
import { useRole } from "@/shared/context/RoleContext";
import { FiUsers, FiCheckCircle, FiDollarSign, FiCalendar, FiMapPin, FiDownload, FiAlertCircle, FiPackage, FiShield, FiUserCheck, FiUserX, FiClock } from "react-icons/fi";
const Users = FiUsers, CheckCircle2 = FiCheckCircle, DollarSign = FiDollarSign, Calendar = FiCalendar, MapPin = FiMapPin, Download = FiDownload, AlertCircle = FiAlertCircle, Luggage = FiPackage, ShieldCheck = FiShield, UserCheck = FiUserCheck, UserX = FiUserX, Clock = FiClock;

interface MemberAttendance {
  id: string;
  name: string;
  ppa: string;
  status: "present" | "absent" | "late";
  duesPaid: boolean;
}

export default function CommunityPage() {
  const { currentRole } = useRole();
  const [duesPaid, setDuesPaid] = useState(true);

  const [members, setMembers] = useState<MemberAttendance[]>([
    { id: "m1", name: "Corper Tunde Bakare", ppa: "Lagos State Secretariat", status: "present", duesPaid: true },
    { id: "m2", name: "Corper Aisha Mohammed", ppa: "Ikeja Junior High School", status: "present", duesPaid: true },
    { id: "m3", name: "Corper Emeka Nwosu", ppa: "First Bank Ikeja", status: "absent", duesPaid: false },
    { id: "m4", name: "Corper Blessing Okon", ppa: "Lagos State Ministry of Health", status: "late", duesPaid: true },
  ]);

  const handleMarkStatus = (id: string, status: "present" | "absent" | "late") => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const handleToggleDues = (id: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, duesPaid: !m.duesPaid } : m));
  };

  const duesHistory = [
    { month: "August 2026", amount: "₦1,000", status: "Paid", ref: "CDS-AUG-4819" },
    { month: "July 2026", amount: "₦1,000", status: "Paid", ref: "CDS-JUL-3210" },
    { month: "June 2026", amount: "₦1,000", status: "Paid", ref: "CDS-JUN-1092" },
  ];

  if (currentRole === "pcm") {
    return (
      <div className="space-y-8 font-sans">
        <div className="p-8 bg-[#121815] text-white border border-slate-800 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
            <Luggage className="w-3.5 h-3.5" /> PCM Portal
          </div>
          <h1 className="text-3xl font-medium text-white tracking-tight font-display">CDS Group Locked</h1>
          <p className="text-xs text-slate-300">CDS group assignments occur after orientation camp posting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="p-8 bg-[#121815] text-white border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
            <Users className="w-3.5 h-3.5" />
            <span>CDS GROUP MANAGEMENT</span>
          </div>
          <h1 className="text-3xl font-medium text-white tracking-tight font-display">
            Education & Publicity CDS Group
          </h1>
          <p className="text-xs text-slate-300">
            Ikeja LGA Secretariat · Every Thursday 09:00 AM · 42 Active Members.
          </p>
        </div>

        <button className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shrink-0">
          <Download className="w-4 h-4" />
          <span>Download Attendance PDF</span>
        </button>
      </div>

      {/* Attendance Register Table */}
      <div className="p-8 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-[#121815] dark:text-white uppercase tracking-widest font-display flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600" /> Weekly Attendance Register
        </h2>

        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.id} className="p-4 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div>
                <div className="font-bold text-[#121815] dark:text-white font-display">{m.name}</div>
                <div className="text-slate-500">{m.ppa}</div>
              </div>

              <div className="flex items-center gap-2">
                {(["present", "late", "absent"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleMarkStatus(m.id, st)}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                      m.status === st
                        ? "bg-emerald-700 text-white border-emerald-700"
                        : "bg-[#dcece1] dark:bg-[#121a16] text-slate-700 dark:text-slate-300 border-slate-300/60 dark:border-slate-800"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
