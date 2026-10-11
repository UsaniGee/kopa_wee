"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const [logSummary, setLogSummary] = useState("");
  const [logHours, setLogHours] = useState("");
  const [logging, setLogging] = useState(false);
  const [logError, setLogError] = useState("");

  // Local calendar day (en-CA formats as YYYY-MM-DD); toISOString() would use UTC
  const today = new Date().toLocaleDateString("en-CA");

  const hoursNumber = Number(logHours);
  const logFormValid = logSummary.trim().length >= 5 && Number.isInteger(hoursNumber) && hoursNumber >= 1 && hoursNumber <= 24;

  const handleLogTodaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logFormValid || logging) return;
    setLogging(true);
    setLogError("");

    try {
      const res = await fetch("/api/workplace/logbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, summary: logSummary.trim(), hoursWorked: hoursNumber }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setLogError(data.message || data.error || "Your entry was not saved. Please try again.");
        return;
      }
      setLogSummary("");
      setLogHours("");
      loadLogs();
    } catch {
      setLogError("Network error: your entry was not saved.");
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
  const todaysEntry = logs.find((l) => l.date === today);

  const loadLogs = () => {
    fetch("/api/workplace/logbook")
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
  };

  React.useEffect(() => {
    if (session?.user?.id) loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload when the signed-in user changes
  }, [session?.user?.id]);

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

      </div>

      {/* Today's entry */}
      <div className="p-6 sm:p-8 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-[#121815] dark:text-white uppercase tracking-widest font-display flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" /> Today&apos;s Log · {today}
        </h2>

        {todaysEntry ? (
          <div className="p-4 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-emerald-600/50 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400 font-display">
              <CheckCircle2 className="w-4 h-4" /> Logged · {todaysEntry.hoursWorked} h · {todaysEntry.status}
            </div>
            <p className="text-slate-600 dark:text-slate-300">{todaysEntry.summary}</p>
          </div>
        ) : (
          <form onSubmit={handleLogTodaySubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label htmlFor="logSummary" className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
                What did you do today? *
              </label>
              <textarea
                id="logSummary"
                rows={3}
                maxLength={1000}
                placeholder="e.g. Taught JSS2 mathematics, marked assignments, attended staff meeting."
                value={logSummary}
                onChange={(e) => setLogSummary(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="space-y-1 sm:w-40">
                <label htmlFor="logHours" className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
                  Hours worked *
                </label>
                <input
                  id="logHours"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={24}
                  step={1}
                  placeholder="e.g. 6"
                  value={logHours}
                  onChange={(e) => setLogHours(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600"
                />
              </div>
              <button
                type="submit"
                disabled={!logFormValid || logging}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{logging ? "Saving..." : "Save today's log"}</span>
              </button>
            </div>
            {logError && (
              <p role="alert" className="flex items-center gap-2 text-red-700 dark:text-red-400 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {logError}
              </p>
            )}
          </form>
        )}
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
                Use &quot;Today&apos;s Log&quot; above to record what you did and how many hours.
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
