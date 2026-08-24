"use client";

import React, { useState } from "react";
import { useRole } from "@/shared/context/RoleContext";
import { 
  Briefcase, 
  CheckCircle2, 
  Star, 
  Calendar, 
  FileText, 
  Clock, 
  AlertCircle,
  Building2,
  UserCheck,
  UserX,
  Luggage,
  Award,
  ExternalLink
} from "lucide-react";

export default function WorkplacePage() {
  const { currentRole } = useRole();
  const [loggedToday, setLoggedToday] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: "John Okoh", role: "ICT Assistant", reason: "Medical Leave (3 Days)", status: "pending" },
    { id: 2, name: "Amina Bello", role: "Research Associate", reason: "LGA Clearance Exemption", status: "pending" },
  ]);

  const handleLeaveAction = (id: number, status: "approved" | "rejected") => {
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
  };

  const logs = [
    { date: "Aug 20, 2026", status: "Present", timeIn: "08:15 AM", timeOut: "04:30 PM", supervisor: "Engr. A. Adeleke" },
    { date: "Aug 19, 2026", status: "Present", timeIn: "08:22 AM", timeOut: "04:45 PM", supervisor: "Engr. A. Adeleke" },
    { date: "Aug 16, 2026", status: "Present", timeIn: "08:10 AM", timeOut: "04:30 PM", supervisor: "Engr. A. Adeleke" },
    { date: "Aug 15, 2026", status: "Official Duty", timeIn: "09:00 AM", timeOut: "03:30 PM", supervisor: "Engr. A. Adeleke" },
  ];

  // =========================================================================
  // PCM VIEW (NO PPA YET)
  // =========================================================================
  if (currentRole === "pcm") {
    return (
      <div className="space-y-8">
        <div className="p-8 bg-white shadow-sm border-l-4 border-amber-500 space-y-4">
          <div className="flex items-center gap-3 text-amber-900 font-black text-sm uppercase tracking-wider">
            <Luggage className="w-5 h-5 text-amber-600" />
            PCM Stage: Workplace PPA Locked
          </div>
          <h1 className="text-2xl font-black text-black">Place of Primary Assignment (PPA)</h1>
          <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
            You have not received a PPA posting yet because you are still in the pre-deployment phase. Workplace features, logbook attendance, and supervisor ratings will automatically unlock when you transition to <strong>Serving Corps Member</strong>.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PPA REPRESENTATIVE (EMPLOYER) VIEW
  // =========================================================================
  if (currentRole === "ppa") {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-black text-white">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-slate-900 px-3 py-1 inline-block mb-2">
              • Employer Portal
            </span>
            <h1 className="text-2xl font-black text-white">Grace High School Corper Management</h1>
            <p className="text-xs text-slate-400 mt-1">
              Log daily presence for assigned corps members, approve leave requests, and dispatch monthly LGA clearance letters.
            </p>
          </div>
        </div>

        {/* Leave Applications Management */}
        <div className="p-6 bg-white shadow-sm space-y-4">
          <h2 className="text-base font-black text-black uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-600" /> Pending Corper Leave Applications
          </h2>

          <div className="space-y-3">
            {leaveRequests.map((req) => (
              <div key={req.id} className="p-4 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-black text-sm text-black flex items-center gap-2">
                    <span>{req.name}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-black font-mono">{req.role}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{req.reason}</p>
                </div>

                {req.status === "pending" ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => handleLeaveAction(req.id, "approved")}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black flex items-center gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button 
                      onClick={() => handleLeaveAction(req.id, "rejected")}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-black flex items-center gap-1"
                    >
                      <UserX className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                ) : (
                  <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 ${
                    req.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
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

  // =========================================================================
  // EX-CORPS MEMBER (ALUMNI) VIEW
  // =========================================================================
  if (currentRole === "alumni") {
    return (
      <div className="space-y-8">
        <div className="p-6 bg-black text-white space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-slate-900 px-3 py-1 inline-block">
            • Career Launchpad
          </span>
          <h1 className="text-2xl font-black text-white">Post-POP Jobs, NiYA Bank & Gigs</h1>
          <p className="text-xs text-slate-400">Discover job opportunities, remote tech gigs, and employer recommendations for ex-corpers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white shadow-sm space-y-3">
            <h3 className="text-base font-black text-black">NiYA Job Bank Integration</h3>
            <p className="text-xs text-slate-500">Official Federal Government job matching portal for ex-corpers.</p>
            <button className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold flex items-center gap-1">
              Browse NiYA Jobs <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 bg-white shadow-sm space-y-3">
            <h3 className="text-base font-black text-black">KopaWee CV Builder</h3>
            <p className="text-xs text-slate-500">Automatically package your NYSC experience, PPA achievements, and SAED skills into a ATS-ready CV.</p>
            <button className="px-4 py-2 bg-black text-white text-xs font-bold">
              Build CV ➔
            </button>
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
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-200 px-3 py-1 inline-block mb-2">
            • Serving Corper Module
          </span>
          <h1 className="text-2xl font-black text-black">Workplace & PPA Attendance Log</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track daily presence at your Place of Primary Assignment, log leaves, and view monthly supervisor scores.
          </p>
        </div>

        <button
          onClick={() => setLoggedToday(!loggedToday)}
          className={`px-5 py-3 text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
            loggedToday ? "bg-emerald-600 text-white" : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{loggedToday ? "PPA Attendance Logged Today" : "Log Today's PPA Attendance"}</span>
        </button>
      </div>

      {/* PPA Details Card */}
      <div className="p-6 bg-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Active PPA Assignment</span>
            <h2 className="text-xl font-black text-black">Lagos State Ministry of Innovation & Technology</h2>
            <p className="text-xs text-slate-600">Department of Software Systems, Alausa, Ikeja</p>
          </div>
          <div className="p-3 bg-white text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Supervisor Rating</span>
            <div className="flex items-center justify-center gap-1 text-amber-500 font-black text-sm">
              <Star className="w-4 h-4 fill-amber-500" /> 4.9 / 5.0 Excellent
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Monthly Allowance Top-up</span>
            <span className="text-sm font-black text-black block">₦20,000 / month</span>
          </div>
          <div className="p-4 bg-white space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Working Days</span>
            <span className="text-sm font-black text-black block">Monday — Thursday (CDS on Fri)</span>
          </div>
          <div className="p-4 bg-white space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Supervisor Contact</span>
            <span className="text-sm font-black text-slate-700 block">Engr. A. Adeleke</span>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="p-6 bg-white shadow-sm space-y-6">
        <h2 className="text-base font-black text-black">Recent Attendance Logbook</h2>

        <div className="divide-y divide-slate-100">
          {logs.map((log, i) => (
            <div key={i} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-black">{log.date}</span>
                  <span className="text-[10px] text-slate-400 block">{log.supervisor}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-slate-600 font-mono">{log.timeIn} – {log.timeOut}</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
