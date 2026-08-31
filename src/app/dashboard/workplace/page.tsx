"use client";

import React, { useState } from "react";
import { useRole } from "@/shared/context/RoleContext";
import { FiBriefcase, FiCheckCircle, FiStar, FiCalendar, FiFileText, FiClock, FiAlertCircle, FiBox, FiUserCheck, FiUserX, FiPackage, FiAward, FiExternalLink, FiX } from "react-icons/fi";

const Briefcase = FiBriefcase;
const CheckCircle2 = FiCheckCircle;
const Star = FiStar;
const Calendar = FiCalendar;
const FileText = FiFileText;
const Clock = FiClock;
const AlertCircle = FiAlertCircle;
const Building2 = FiBox;
const UserCheck = FiUserCheck;
const UserX = FiUserX;
const Luggage = FiPackage;
const Award = FiAward;
const ExternalLink = FiExternalLink;
const X = FiX;

export default function WorkplacePage() {
  const { currentRole } = useRole();
  const [loggedToday, setLoggedToday] = useState(false);
  const [logSummary, setLogSummary] = useState("");
  const [logging, setLogging] = useState(false);

  const handleLogTodaySubmit = async () => {
    const userId = localStorage.getItem("kopawee_user_id") || "cl_guest_corps";
    setLogging(true);

    try {
      await fetch("/api/workplace/logbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          date: new Date().toISOString().split("T")[0],
          summary: logSummary || "Completed daily PPA duties & attendance clock-in.",
          hoursWorked: 8,
        }),
      });
      setLoggedToday(true);
    } catch (err) {
      console.error("Failed to log workplace attendance", err);
    } finally {
      setLogging(false);
    }
  };

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: "John Okoh", role: "ICT Assistant", reason: "Medical Leave (3 Days)", status: "pending", note: "" },
    { id: 2, name: "Amina Bello", role: "Research Associate", reason: "LGA Clearance Exemption", status: "pending", note: "" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeReqId, setActiveReqId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"approved" | "rejected">("approved");
  const [actionNote, setActionNote] = useState("");

  const handleOpenActionModal = (id: number, type: "approved" | "rejected") => {
    setActiveReqId(id);
    setActionType(type);
    setActionNote("");
    setModalOpen(true);
  };

  const handleConfirmLeaveAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeReqId !== null) {
      setLeaveRequests(prev => prev.map(req => req.id === activeReqId ? { ...req, status: actionType, note: actionNote } : req));
    }
    setModalOpen(false);
  };

  interface LogEntry {
    date: string;
    status: string;
    summary: string;
    hoursWorked: number;
  }

  const [logs, setLogs] = useState<LogEntry[]>([]);

  React.useEffect(() => {
    const userId = localStorage.getItem("kopawee_user_id") || "cl_guest_corps";
    fetch(`/api/workplace/logbook?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const apiLogs: LogEntry[] = data.data.map((item: any) => ({
            date: item.date,
            status: item.status,
            summary: item.summary,
            hoursWorked: item.hoursWorked,
          }));
          setLogs(apiLogs);
        }
      })
      .catch(() => {});
  }, [loggedToday]);

  if (currentRole === "pcm") {
    return (
      <div className="space-y-8 font-sans">
        <div className="p-8 bg-[#121815] text-white border border-slate-800 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
            <Luggage className="w-3.5 h-3.5" /> PCM Portal
          </div>
          <h1 className="text-3xl font-medium text-white tracking-tight font-display">PPA Assignment Pending</h1>
          <p className="text-xs text-slate-300">PPA logbooks unlock after orientation camp posting.</p>
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
            <Briefcase className="w-3.5 h-3.5" />
            <span>PPA WORKPLACE & LOGBOOK</span>
          </div>
          <h1 className="text-3xl font-medium text-white tracking-tight font-display">
            Grace High School PPA Management
          </h1>
          <p className="text-xs text-slate-300">
            Log weekly work presence, submit leave applications, and view supervisor reviews.
          </p>
        </div>

        <button
          onClick={handleLogTodaySubmit}
          disabled={logging}
          className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            loggedToday
              ? "bg-emerald-800 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{logging ? "LOGGING..." : loggedToday ? "ATTENDANCE LOGGED TODAY" : "LOG TODAY'S ATTENDANCE"}</span>
        </button>
      </div>

      {/* Workplace Logs */}
      <div className="p-8 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-[#121815] dark:text-white uppercase tracking-widest font-display flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600" /> Recent PPA Log Entries
        </h2>

        <div className="space-y-2">
          {logs.length === 0 ? (
            <div className="p-6 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 text-center space-y-2">
              <Clock className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                No workplace log entries recorded yet.
              </p>
              <p className="text-[11px] text-slate-500">
                Click &quot;LOG TODAY&apos;S ATTENDANCE&quot; above to log your daily PPA work summary.
              </p>
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="p-4 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-[#121815] dark:text-white font-display">{log.date}</div>
                  <div className="text-slate-600 dark:text-slate-300 mt-0.5">{log.summary}</div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-emerald-700 text-white uppercase shrink-0">
                  {log.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
