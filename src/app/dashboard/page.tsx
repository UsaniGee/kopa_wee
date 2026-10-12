"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ComingSoon from "@/shared/components/ComingSoon";
import { useSession } from "next-auth/react";
import { useRole } from "@/shared/context/RoleContext";
import {
  FiCalendar, FiShield, FiShoppingBag, FiHome, FiAlertOctagon,
  FiBriefcase, FiUsers, FiArrowRight, FiCheckCircle, FiClock,
  FiMapPin, FiTrendingUp, FiFileText, FiCpu, FiPackage, FiCompass,
  FiCheckSquare, FiAlertCircle, FiBox, FiUserCheck, FiUserX,
  FiPlus, FiSend, FiAward, FiX, FiLoader, FiTrash2, FiRefreshCw,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

const Calendar = FiCalendar;
const ShieldCheck = FiShield;
const ShoppingBag = FiShoppingBag;
const Home = FiHome;
const ShieldAlert = FiAlertOctagon;
const Briefcase = FiBriefcase;
const Users = FiUsers;
const CheckCircle2 = FiCheckCircle;
const Clock = FiClock;
const TrendingUp = FiTrendingUp;
const Sparkles = HiSparkles;
const Bot = FiCpu;
const Luggage = FiPackage;
const Compass = FiCompass;
const CheckSquare = FiCheckSquare;
const AlertCircle = FiAlertCircle;
const Building2 = FiBox;
const Plus = FiPlus;
const Send = FiSend;
const Award = FiAward;
const X = FiX;

// ─── Clearance Confirmation Modal ─────────────────────────────────────────────
interface ClearanceModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

function ClearanceModal({ onConfirm, onCancel, isLoading }: ClearanceModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="clearance-modal-title">
      <div className="bg-white dark:bg-[#121815] border border-slate-200 dark:border-slate-700 max-w-md w-full p-8 space-y-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 id="clearance-modal-title" className="text-lg font-bold text-[#121815] dark:text-white font-display">
              Mark Monthly Clearance as Done?
            </h2>
          </div>
          <button
            onClick={onCancel}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
          <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
            Are you sure you want to mark your clearance as completed for this month?
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 font-medium">
            ⚠️ Once confirmed, you won&apos;t be able to mark another clearance as done until your next clearance, approximately{" "}
            <strong>20 days from now</strong>.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Yes, Mark Clearance Done</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Packing Checklist Component ─────────────────────────────────────────────
interface PackingItem {
  id: string;
  name: string;
  category: string;
  isCustom: boolean;
  pcmCompleted: boolean;
  servingTrackingStatus: "INTACT" | "USED" | "MISSING";
}

interface PackingChecklistProps {
  userId: string;
  isServing?: boolean;
}

function PackingChecklist({ userId, isServing = false }: PackingChecklistProps) {
  const [items, setItems] = useState<PackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState("");
  const [addingItem, setAddingItem] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [actionError, setActionError] = useState("");

  const fetchItems = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch("/api/packing-items");
      const data = await res.json();
      if (data.success) setItems(data.data);
      else setActionError(data.error || "Could not load your checklist. Refresh to try again.");
    } catch {
      setActionError("Could not load your checklist. Check your connection and refresh.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  /** Sends a change; true only when the server confirms it. */
  const save = async (method: "PATCH" | "DELETE", body: object) => {
    try {
      const res = await fetch("/api/packing-items", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      return res.ok && data.success === true;
    } catch {
      return false;
    }
  };

  // Optimistic update, rolled back if the save fails
  const updateItem = async (item: PackingItem, changes: Partial<PackingItem>) => {
    setActionError("");
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, ...changes } : i)));
    if (!(await save("PATCH", { itemId: item.id, ...changes }))) {
      // Undo only this change, and only if no later change replaced it
      const undo = Object.fromEntries(Object.keys(changes).map((k) => [k, item[k as keyof PackingItem]]));
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id && Object.entries(changes).every(([k, v]) => i[k as keyof PackingItem] === v) ? { ...i, ...undo } : i
        )
      );
      setActionError(`"${item.name}" was not updated. Please try again.`);
    }
  };

  const togglePcmCompleted = (item: PackingItem) => updateItem(item, { pcmCompleted: !item.pcmCompleted });

  const setServingStatus = (item: PackingItem, status: "INTACT" | "USED" | "MISSING") =>
    updateItem(item, { servingTrackingStatus: status });

  const addCustomItem = async () => {
    if (!newItemName.trim()) return;
    setAddingItem(true);
    try {
      const res = await fetch("/api/packing-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newItemName.trim(), category: "custom" }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => [...prev, data.data]);
        setNewItemName("");
        setShowAddForm(false);
      } else {
        setActionError(data.error || "The item was not added.");
      }
    } catch {
      setActionError("Network error: the item was not added.");
    } finally {
      setAddingItem(false);
    }
  };

  const deleteItem = async (item: PackingItem) => {
    if (!item.isCustom) return;
    setActionError("");
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    if (!(await save("DELETE", { itemId: item.id }))) {
      // Put back just this item; other edits made meanwhile stay
      setItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item]));
      setActionError(`"${item.name}" was not removed.`);
    }
  };

  const completedCount = items.filter((i) => i.pcmCompleted).length;
  const categories = [...new Set(items.map((i) => i.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-slate-400">
        <FiLoader className="w-5 h-5 animate-spin mr-2" />
        <span className="text-xs">Loading checklist...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actionError && <p role="alert" className="text-xs font-semibold text-red-700 dark:text-red-400">{actionError}</p>}

      {/* Serving notice banner */}
      {isServing && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1">
            Your Camp Item Stock Tracker
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
            Track the status of items you brought from camp — mark what&apos;s intact, used up, or missing.
          </p>
        </div>
      )}

      {/* Progress (PCM only) */}
      {!isServing && items.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-1.5">
            <div
              className="bg-emerald-600 h-1.5 transition-all"
              style={{ width: `${(completedCount / items.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 shrink-0">
            {completedCount}/{items.length}
          </span>
        </div>
      )}

      {/* Items by category */}
      {categories.map((cat) => (
        <div key={cat} className="space-y-1.5">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-display capitalize">
            {cat}
          </h4>
          {items
            .filter((i) => i.category === cat)
            .map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 text-xs border transition-all ${
                  !isServing && item.pcmCompleted
                    ? "bg-emerald-950/10 border-emerald-500/30 dark:bg-emerald-950/20"
                    : isServing && item.servingTrackingStatus === "MISSING"
                    ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                    : isServing && item.servingTrackingStatus === "USED"
                    ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                    : "bg-[#eaf5ed] dark:bg-[#0a0f0d] border-slate-200 dark:border-slate-800"
                }`}
              >
                {/* PCM checkbox */}
                {!isServing && (
                  <input
                    type="checkbox"
                    aria-label={`Packed: ${item.name}`}
                    checked={item.pcmCompleted}
                    onChange={() => togglePcmCompleted(item)}
                    className="accent-emerald-600 w-4 h-4 shrink-0 cursor-pointer"
                  />
                )}

                <span
                  className={`flex-1 font-medium ${
                    !isServing && item.pcmCompleted
                      ? "line-through text-slate-400"
                      : "text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {item.name}
                  {item.isCustom && (
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold uppercase tracking-wider">
                      Custom
                    </span>
                  )}
                </span>

                {/* Serving stock tracking buttons */}
                {isServing && (
                  <div className="flex items-center gap-1 shrink-0">
                    {(["INTACT", "USED", "MISSING"] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setServingStatus(item, status)}
                        className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border transition-all ${
                          item.servingTrackingStatus === status
                            ? status === "INTACT"
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : status === "USED"
                              ? "bg-amber-500 text-white border-amber-500"
                              : "bg-red-600 text-white border-red-600"
                            : "bg-transparent text-slate-500 border-slate-300 dark:border-slate-600 hover:border-slate-500"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}

                {/* Delete custom item */}
                {item.isCustom && (
                  <button
                    onClick={() => deleteItem(item)}
                    aria-label={`Remove ${item.name}`}
                    className="text-slate-400 hover:text-red-500 transition-colors shrink-0 ml-1"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
        </div>
      ))}

      {/* Add custom item */}
      {showAddForm ? (
        <div className="flex gap-2 pt-1">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomItem()}
            placeholder="Item name..."
            autoFocus
            className="flex-1 px-3 py-2 text-xs bg-white dark:bg-[#0a0f0d] border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-600"
          />
          <button
            onClick={addCustomItem}
            disabled={addingItem || !newItemName.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50 transition-colors"
          >
            {addingItem ? <FiLoader className="w-3.5 h-3.5 animate-spin" /> : "Add"}
          </button>
          <button
            onClick={() => { setShowAddForm(false); setNewItemName(""); }}
            aria-label="Cancel adding an item"
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors pt-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Item
        </button>
      )}
    </div>
  );
}

// ─── Clearance Status Widget ──────────────────────────────────────────────────
interface ClearanceWidgetProps {
  userId: string;
  /** Called after clearance is logged, so the page's cards refresh too. */
  onChange?: () => void;
}

function ClearanceWidget({ userId, onChange }: ClearanceWidgetProps) {
  const [loadFailed, setLoadFailed] = useState(false);
  const { update: refreshSession } = useSession();
  const [clearanceData, setClearanceData] = useState<{
    hasCleared: boolean;
    lastClearedAt: string | null;
    nextEligibleAt: string | null;
    isEligible: boolean;
    completedCount?: number;
    isCompletedService?: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClearance = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch("/api/clearance");
      const data = await res.json();
      setLoadFailed(!data.success);
      if (data.success) setClearanceData(data.data);
    } catch {
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchClearance();
  }, [fetchClearance]);

  const markClearanceDone = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/clearance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        await fetchClearance();
        onChange?.();
        setShowModal(false);
      } else {
        setError(data.message || data.error || "Failed to mark clearance");
        setShowModal(false);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setShowModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const transitionToAlumni = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/users/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newStatus: "ALUMNI",
          reason: "Completed 12 monthly clearances and transitioned to Alumni status",
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshSession(); // role comes from the session; this switches the dashboard
      } else {
        setError(data.message || "Failed to transition to Alumni");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadFailed) {
    return (
      <button
        type="button"
        onClick={() => { setLoading(true); fetchClearance(); }}
        className="px-6 py-3 border border-red-400 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider cursor-pointer"
      >
        Couldn&apos;t load clearance status · Retry
      </button>
    );
  }

  if (loading) {
    return (
      <button
        disabled
        className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
      >
        <FiLoader className="w-4 h-4 animate-spin" />
        <span>Loading...</span>
      </button>
    );
  }

  const isCompletedService = clearanceData?.isCompletedService || (clearanceData?.completedCount && clearanceData.completedCount >= 12);

  if (isCompletedService) {
    return (
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={transitionToAlumni}
          disabled={submitting}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg animate-pulse"
        >
          <Award className="w-4 h-4" />
          <span>🎓 Complete Service & Transition to Alumni ({clearanceData?.completedCount || 12}/12 Done)</span>
        </button>
        <p className="text-[10px] text-amber-400 font-mono">
          All 12 monthly clearances completed! Congratulations Corper!
        </p>
      </div>
    );
  }

  const isEligible = clearanceData?.isEligible ?? true;
  const nextEligibleDate = clearanceData?.nextEligibleAt
    ? new Date(clearanceData.nextEligibleAt).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={() => {
          if (isEligible) setShowModal(true);
        }}
        disabled={!isEligible || submitting}
        className={`px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
          clearanceData?.hasCleared && !isEligible
            ? "bg-emerald-800 text-white cursor-not-allowed opacity-80"
            : isEligible
            ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            : "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
        }`}
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>
          {clearanceData?.hasCleared && !isEligible
            ? `Clearance Done ✓ (${clearanceData?.completedCount || 1}/12)`
            : `Mark Clearance Done (${clearanceData?.completedCount || 0}/12)`}
        </span>
      </button>

      {clearanceData?.hasCleared && !isEligible && nextEligibleDate && (
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
          Next clearance window: {nextEligibleDate}
        </p>
      )}

      {error && (
        <p className="text-[10px] text-red-500 max-w-[200px] text-right">{error}</p>
      )}

      {showModal && (
        <ClearanceModal
          onConfirm={markClearanceDone}
          onCancel={() => setShowModal(false)}
          isLoading={submitting}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function DashboardOverviewPage() {
  const { currentRole } = useRole();
  const { data: session, update: refreshSession } = useSession();

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [journeyInfo, setJourneyInfo] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [clearanceInfo, setClearanceInfo] = useState<any>(null);

  const userId = session?.user?.id || "";

  const loadClearanceInfo = () =>
    fetch("/api/clearance")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setClearanceInfo(data.data);
      })
      .catch(() => {});

  React.useEffect(() => {
    if (!userId) return;
    fetch(`/api/users/journey`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.data?.journey) setJourneyInfo(data.data.journey);
          if (data.data?.user) setUserInfo(data.data.user);
        }
      })
      .catch(() => {});

    loadClearanceInfo();
  }, [userId]);


  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || aiAnswer === "Thinking...") return; // one question at a time
    setAiAnswer("Thinking...");
    try {
      const res = await fetch("/api/ai/listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: aiPrompt }),
      });
      const data = await res.json();
      if (data.success) {
        setAiAnswer(data.reply);
      } else if (data.error === "AI_NOT_CONFIGURED") {
        setAiAnswer("AI assistant is not configured yet. Please contact support.");
      } else if (data.error === "RATE_LIMIT_EXCEEDED") {
        setAiAnswer("You've reached the AI limit for this hour. Please try again later.");
      } else {
        setAiAnswer("Sorry, I couldn't process that request. Please try again.");
      }
    } catch {
      setAiAnswer("Network error. Please check your connection and try again.");
    }
  };

  const handleStatusUpdate = async () => {
    setStatusUpdating(true);
    setStatusError("");
    try {
      const res = await fetch("/api/users/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newStatus: "SERVING",
          reason: "User self-initiated transition from PCM dashboard",
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshSession(); // role comes from the session; this switches the dashboard
        setShowStatusModal(false);
      } else {
        setStatusError(data.message || data.error || "Your status was not changed.");
      }
    } catch {
      setStatusError("Network error: your status was not changed.");
    } finally {
      setStatusUpdating(false);
    }
  };

  /* =========================================================================
     1. PROSPECTIVE CORPS MEMBER (PCM) VIEW
     ========================================================================= */
  if (currentRole === "pcm") {
    const campEntry = journeyInfo?.campEntryDate ? new Date(journeyInfo.campEntryDate) : null;
    const daysToCamp = campEntry ? Math.ceil((campEntry.getTime() - Date.now()) / 86_400_000) : null;
    const campDateLabel = campEntry?.toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" });
    const campPlace = userInfo?.deployedState ? ` · ${userInfo.deployedState} camp` : "";
    const campCountdown =
      daysToCamp === null
        ? { value: "Date not set", sub: "Add your camp entry date in Settings once your call-up letter is out." }
        : daysToCamp > 0
          ? { value: `${daysToCamp} Day${daysToCamp === 1 ? "" : "s"} Left`, sub: `Camp starts ${campDateLabel}${campPlace}.` }
          : { value: "Camp has started", sub: `Camp began ${campDateLabel}${campPlace}.` };

    return (
      <div className="space-y-8 font-sans">
        {/* Banner */}
        <div className="p-8 bg-[#121815] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
              <Luggage className="w-3.5 h-3.5" />
              <span>ROLE: PROSPECTIVE CORPS MEMBER (PCM)</span>
            </div>
            <h1 className="text-3xl font-medium text-white tracking-tight font-display">
              Mobilization & Orientation Camp Preparation
            </h1>
            <p className="text-xs text-slate-300">
              Pack for camp and keep track of your camp date.
            </p>
          </div>

          <button
            onClick={() => setShowStatusModal(true)}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Update Status ➔ Serving Corper</span>
          </button>
        </div>

        {showStatusModal && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="status-modal-title">
            <div className="bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 max-w-md w-full p-6 space-y-4 text-[#121815] dark:text-white">
              <h2 id="status-modal-title" className="text-lg font-bold font-display uppercase tracking-wider">Switch to Serving Corps Member?</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Do this after camp, once you have your PPA. Your dashboard will show serving tools (clearance, logbook, lodges). You can&apos;t switch back yourself.
              </p>
              {statusError && <p role="alert" className="text-xs font-semibold text-red-700 dark:text-red-400">{statusError}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowStatusModal(false); setStatusError(""); }}
                  disabled={statusUpdating}
                  className="px-4 py-2 border border-slate-400 dark:border-slate-700 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStatusUpdate}
                  disabled={statusUpdating}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  {statusUpdating ? "Updating..." : "Yes, I'm serving"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase tracking-widest font-display">Orientation Countdown</span>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold font-display text-[#121815] dark:text-white">{campCountdown.value}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">{campCountdown.sub}</p>
          </div>

          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase tracking-widest font-display">Camp Prep Progress</span>
              <CheckSquare className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold font-display text-[#121815] dark:text-white">Camp Checklist Active</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Track your mandatory gear below</p>
          </div>

          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase tracking-widest font-display">Route Planner</span>
              <Compass className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-base font-bold font-display text-[#121815] dark:text-white">
              {userInfo?.stateOfOrigin && userInfo?.deployedState ? `${userInfo.stateOfOrigin} ➔ ${userInfo.deployedState}` : "Route not set"}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {userInfo?.deployedState
                ? "Plan your trip and tell family your route before you travel."
                : "Add your state of origin and deployment state in Settings."}
            </p>
          </div>
        </div>

        {/* Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Packing Checklist */}
          <div className="p-8 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-[#121815] dark:text-white uppercase tracking-widest font-display flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600" /> Camp Mandatory Gear Checklist
            </h2>
            <PackingChecklist userId={userId} isServing={false} />
          </div>

          {/* AI Assistant */}
          <div className="p-8 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest font-display mb-2">
                <Bot className="w-4 h-4" /> KopaWee AI Regulatory Assistant
              </div>
              <h2 className="text-base font-bold text-[#121815] dark:text-white font-display">Questions on Mobilization or Relocation?</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Quick general answers from an AI assistant. Confirm details with official NYSC sources.
              </p>
            </div>

            <form onSubmit={handleAskAI} className="space-y-3 mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Relocation on medical grounds?"
                  className="flex-1 px-4 py-3 text-xs bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600"
                />
                <button type="submit" disabled={aiAnswer === "Thinking..."} className="px-5 py-3 disabled:opacity-50 bg-[#121815] text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors">
                  Ask AI
                </button>
              </div>

              {aiAnswer && (
                <div className="p-4 bg-[#eaf5ed] dark:bg-[#0a0f0d] border-l-2 border-emerald-600 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  <strong>AI Response:</strong> {aiAnswer}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* PCM Modules Launchpad */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-display">
            PCM Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { href: "/dashboard/companion", title: "Camp Guide", text: "Platoon activities, morning drill routine, and SAED classes.", action: "Open Guide ➔" },
              { href: "/dashboard/marketplace", title: "Pre-Camp Market", text: "Buy white boots, waist bags, and power banks from ex-corpers.", action: "Browse Gear ➔" },
              { href: "/dashboard/safety", title: "Journey Safety", text: "Highway status check-in and emergency SOS contacts.", action: "Open Tracker ➔" },
            ].map((card, i) => (
              <Link key={i} href={card.href} className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 hover:border-emerald-600 transition-all space-y-3">
                <h3 className="text-base font-bold text-[#121815] dark:text-white font-display">{card.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{card.text}</p>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{card.action}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     2. SERVING CORPS MEMBER VIEW
     ========================================================================= */
  if (currentRole === "serving") {
    // Dynamic State Code & Role
    const displayStateCode = userInfo?.stateCode || (session?.user as any)?.stateCode || null;
    const stateCodeSuffix = displayStateCode ? `(${displayStateCode})` : "";
    const desktopRoleText = `ROLE: SERVING CORPS MEMBER ${stateCodeSuffix}`.trim();
    const mobileRoleText = `ROLE: SCM ${stateCodeSuffix}`.trim();

    // Dynamic Corper Name
    const rawName = session?.user?.name || userInfo?.name || "";
    const firstName = rawName ? rawName.trim().split(" ")[0] : "";
    const greetingName = firstName
      ? (firstName.toLowerCase().startsWith("corper") ? firstName : `Corper ${firstName}`)
      : "Corper";

    // Dynamic Hub Location — from userInfo (state + LGA set at sign-up or profile)
    const hubName = userInfo?.lga ? `${userInfo.lga} Hub` : "LGA Hub";
    const stateText = userInfo?.deployedState || userInfo?.state || "State";
    const lgaLabel = userInfo?.lga ? `${userInfo.lga} LGA Hub` : "LGA Hub";
    const hubLocation = `${lgaLabel}, ${stateText}`;

    // Dynamic Clearance Notice & Metric Card Data
    let clearanceNotice = `Monthly LGA Clearance (${hubLocation}).`;
    let clearanceVal = "Available";
    let nextDateStr = "Not scheduled";

    if (clearanceInfo?.nextEligibleAt) {
      const now = Date.now();
      const nextDate = new Date(clearanceInfo.nextEligibleAt);
      nextDateStr = nextDate.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
      const diffDays = Math.ceil((nextDate.getTime() - now) / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        clearanceNotice = `Monthly LGA Clearance in ${diffDays} day${diffDays === 1 ? "" : "s"} (${hubLocation}).`;
        clearanceVal = `${diffDays} Day${diffDays === 1 ? "" : "s"} Left`;
      } else if (clearanceInfo.isEligible) {
        clearanceNotice = `Monthly LGA Clearance window is OPEN NOW (${hubLocation}).`;
        clearanceVal = "Open Now";
      } else {
        clearanceNotice = `Monthly LGA Clearance completed for this window (${hubLocation}).`;
        clearanceVal = "Completed";
      }
    } else if (clearanceInfo?.hasCleared && clearanceInfo?.isEligible === false) {
      clearanceNotice = `Monthly LGA Clearance completed for this window (${hubLocation}).`;
      clearanceVal = "Completed";
    }

    const clearanceSub = `${nextDateStr} · ${hubName}`;

    const serviceEndDate = journeyInfo?.serviceEndDate ? new Date(journeyInfo.serviceEndDate) : null;
    const daysToPop = serviceEndDate ? Math.ceil((serviceEndDate.getTime() - Date.now()) / 86_400_000) : null;
    const serviceEnd =
      daysToPop === null
        ? { value: "Not set", sub: "Add your service end date in Settings" }
        : daysToPop > 0
          ? { value: `${daysToPop} day${daysToPop === 1 ? "" : "s"}`, sub: `Passing out ${serviceEndDate!.toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}` }
          : { value: "Completed", sub: "Your service year has ended" };

    return (
      <div className="space-y-8 font-sans">
        <div className="p-8 bg-[#121815] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{desktopRoleText}</span>
              <span className="sm:hidden">{mobileRoleText}</span>
            </div>
            <h1 className="text-3xl font-medium text-white tracking-tight font-display">
              Welcome back, {greetingName}
            </h1>
            <p className="text-xs text-slate-300">
              {clearanceNotice}
            </p>
          </div>

          <ClearanceWidget userId={userId} onChange={loadClearanceInfo} />
        </div>

        {/* Timeline Completion Prompt */}
        {(!journeyInfo?.serviceStartDate || !journeyInfo?.serviceEndDate) && (
          <div className="p-6 bg-emerald-950/40 border border-emerald-700/60 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-display text-emerald-300">Complete your service timeline</h3>
              <p className="text-xs text-slate-300">
                Add your service start and expected end dates so we can help you track your NYSC journey and upcoming POP.
              </p>
            </div>
            <Link
              href="/dashboard/settings"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors"
            >
              Update Service Information
            </Link>
          </div>
        )}

        {/* POP Journey Tracking Widget */}
        {journeyInfo?.serviceEndDate && (
          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-display">
                Your Service Journey
              </span>
              <h3 className="text-base font-bold text-[#121815] dark:text-white font-display">
                Expected POP: {new Date(journeyInfo.serviceEndDate).toLocaleDateString("en-NG", { month: "long", year: "numeric" })}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Service Start: {journeyInfo.serviceStartDate ? new Date(journeyInfo.serviceStartDate).toLocaleDateString("en-NG", { month: "short", year: "numeric" }) : "N/A"} · Expected Completion: {new Date(journeyInfo.serviceEndDate).toLocaleDateString("en-NG", { month: "short", year: "numeric" })}
              </p>
            </div>
            {daysToPop !== null && daysToPop > 0 && daysToPop <= 60 && (
              <div className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-300" />
                <span>POP in {daysToPop} day{daysToPop === 1 ? "" : "s"}</span>
              </div>
            )}
          </div>
        )}

        {/* Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Next Clearance", val: clearanceVal, sub: clearanceSub, icon: Clock },
            {
              label: "Clearances Logged",
              val: String(clearanceInfo?.completedCount ?? 0),
              sub: clearanceInfo?.hasCleared ? "Monthly clearances recorded" : "None logged yet",
              icon: TrendingUp,
            },
            {
              label: "Your LGA",
              val: userInfo?.lga ?? "Not set",
              sub: userInfo?.deployedState ?? "Add it in Settings",
              icon: Users,
            },
            { label: "Service Ends", val: serviceEnd.value, sub: serviceEnd.sub, icon: ShieldAlert },
          ].map((m, idx) => {
            const IconComp = m.icon;
            return (
              <div key={idx} className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-widest font-display">{m.label}</span>
                  <IconComp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold font-display text-[#121815] dark:text-white">{m.val}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{m.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Item Stock Tracking */}
        <div className="p-8 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-[#121815] dark:text-white uppercase tracking-widest font-display flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-600" /> Camp Item Stock Tracker
          </h2>
          <PackingChecklist userId={userId} isServing={true} />
        </div>

        {/* Modules Grid */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-display">
            Active Mini-Product Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { href: "/dashboard/companion", tag: "Clearance", title: "Clearance Tracker", desc: "Log monthly clearance and add the next date to your calendar.", icon: Calendar },
              { href: "/dashboard/marketplace", tag: "Marketplace", title: "Corper Peer Marketplace", desc: "Buy, sell, or swap mattresses, fans, and gas cylinders.", icon: ShoppingBag },
              { href: "/dashboard/accommodation", tag: "Housing", title: "Lodges & Roommates", desc: "Browse lodges and match with a roommate by state and LGA.", icon: Home },
              { href: "/dashboard/safety", tag: "Safety", title: "Safety SOS", desc: "One-tap SOS that records your location and emails you a copy.", icon: ShieldAlert },
              { href: "/dashboard/workplace", tag: "Workplace", title: "PPA Logbook", desc: "Record what you did each day and how many hours.", icon: Briefcase },
              { href: "/dashboard/community", tag: "CDS · Soon", title: "CDS Group Hub", desc: "Meetings, attendance and projects for your CDS group. Coming soon.", icon: Users },
            ].map((mod, idx) => {
              const IconComp = mod.icon;
              return (
                <Link key={idx} href={mod.href} className="group p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 hover:border-emerald-600 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-[#121815] text-white"><IconComp className="w-4 h-4" /></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-600/30">
                      {mod.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#121815] dark:text-white font-display group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{mod.desc}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block pt-1">Open Module ➔</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     3-5. EMPLOYER, CDS EXECUTIVE AND LGA INSPECTOR: not built yet
     ========================================================================= */
  if (currentRole === "ppa") {
    return (
      <ComingSoon
        icon={Briefcase}
        title="PPA employer portal"
        description="Tools for places of primary assignment to see their corps members' logbooks and handle leave requests."
        planned={["View your corps members' daily logbooks", "Approve or decline leave requests", "Monthly attendance summary"]}
        action={{ href: "/dashboard/settings", label: "Account settings" }}
      />
    );
  }

  if (currentRole === "cds_exec") {
    return (
      <ComingSoon
        icon={Users}
        title="CDS executive hub"
        description="Tools for CDS executives to run meetings, take attendance and track group projects and dues."
        planned={["Meeting schedule and reminders", "Attendance register", "Project updates", "Dues tracking"]}
        action={{ href: "/dashboard/safety", label: "Open Safety SOS" }}
      />
    );
  }

  if (currentRole === "nysc_official") {
    return (
      <ComingSoon
        icon={ShieldAlert}
        title="LGA inspector portal"
        description="Tools for LGA officials to see clearance activity for corps members in their LGA."
        planned={["Clearance activity by LGA", "Corps member lookup by state code"]}
        action={{ href: "/dashboard/settings", label: "Account settings" }}
      />
    );
  }

  /* =========================================================================
     6. EX-CORPS MEMBER (ALUMNI) VIEW
     ========================================================================= */
  return (
    <div className="space-y-8 font-sans">
      <div className="p-8 bg-[#121815] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
            <Award className="w-3.5 h-3.5" />
            <span>ROLE: EX-CORPS MEMBER (POP ALUMNI)</span>
          </div>
          <h1 className="text-3xl font-medium text-white tracking-tight font-display">
            KopaWee Alumni Launchpad 🎓
          </h1>
          <p className="text-xs text-slate-300">
            Sell the household items you no longer need to incoming corps members.
          </p>
        </div>
        <Link href="/dashboard/marketplace" className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shrink-0">
          Post POP Item ➔
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/marketplace" className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 hover:border-emerald-600 transition-all space-y-3">
          <h3 className="text-base font-bold text-[#121815] dark:text-white font-display">POP Household Deals Market</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">Directly hand off mattresses, gas cylinders, and appliances to incoming corpers.</p>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block pt-1">Open POP Market ➔</span>
        </Link>

        <ComingSoon
          compact
          title="Career & gigs"
          description="Job listings and a CV builder for corps members after passing out."
          planned={["Job and gig listings", "CV builder"]}
        />
      </div>
    </div>
  );
}
