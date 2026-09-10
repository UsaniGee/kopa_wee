"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#121815] border border-slate-200 dark:border-slate-700 max-w-md w-full p-8 space-y-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-[#121815] dark:text-white font-display">
              Mark Monthly Clearance as Done?
            </h2>
          </div>
          <button
            onClick={onCancel}
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

// ─── Update Status Confirmation Modal ────────────────────────────────────────
interface StatusUpdateModalProps {
  fromStatus: string;
  toStatus: string;
  campExitDate?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

function StatusUpdateModal({ fromStatus, toStatus, campExitDate, onConfirm, onCancel, isLoading }: StatusUpdateModalProps) {
  const formattedExitDate = campExitDate
    ? new Date(campExitDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#121815] border border-slate-200 dark:border-slate-700 max-w-md w-full p-8 space-y-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30">
              <FiRefreshCw className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-[#121815] dark:text-white font-display">
              Update NYSC Status?
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">From:</span>
            <span className="text-sm font-bold text-[#121815] dark:text-white">{fromStatus}</span>
            <span className="text-slate-400">→</span>
            <span className="text-sm font-bold text-emerald-600">{toStatus}</span>
          </div>

          {formattedExitDate ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-1">
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                📅 Automatic Schedule Active
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                Your status is scheduled to automatically transition to <strong>Serving Corps Member</strong> on <strong>{formattedExitDate}</strong> when orientation camp ends. Would you like to update to Serving now anyway?
              </p>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-1">
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                ⚠️ No Camp Dates Found
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                You haven't set your orientation camp dates in Account Settings. You can update your status manually now, or add your camp dates in Settings to enable automatic status transitions.
              </p>
            </div>
          )}

          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-300 leading-relaxed font-medium">
              ⚠️ Manual transitions are non-reversible
            </p>
            <p className="text-xs text-red-700 dark:text-red-400 mt-1 leading-relaxed">
              Once updated to <strong>{toStatus}</strong>, you cannot revert to PCM yourself. Only an administrator can revert status corrections.
            </p>
          </div>
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
                <span>Updating...</span>
              </>
            ) : (
              <span>Yes, Update Status</span>
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

  const fetchItems = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/packing-items?userId=${userId}`);
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      console.error("Failed to fetch packing items:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const togglePcmCompleted = async (item: PackingItem) => {
    const updated = { ...item, pcmCompleted: !item.pcmCompleted };
    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    await fetch("/api/packing-items", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: item.id, userId, pcmCompleted: updated.pcmCompleted }),
    });
  };

  const setServingStatus = async (item: PackingItem, status: "INTACT" | "USED" | "MISSING") => {
    const updated = { ...item, servingTrackingStatus: status };
    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    await fetch("/api/packing-items", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: item.id, userId, servingTrackingStatus: status }),
    });
  };

  const addCustomItem = async () => {
    if (!newItemName.trim()) return;
    setAddingItem(true);
    try {
      const res = await fetch("/api/packing-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name: newItemName.trim(), category: "custom" }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => [...prev, data.data]);
        setNewItemName("");
        setShowAddForm(false);
      }
    } catch (err) {
      console.error("Failed to add item:", err);
    } finally {
      setAddingItem(false);
    }
  };

  const deleteItem = async (item: PackingItem) => {
    if (!item.isCustom) return;
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    await fetch("/api/packing-items", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: item.id, userId }),
    });
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
}

function ClearanceWidget({ userId }: ClearanceWidgetProps) {
  const { setRole } = useRole();
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
      const res = await fetch(`/api/clearance?userId=${userId}`);
      const data = await res.json();
      if (data.success) setClearanceData(data.data);
    } catch (err) {
      console.error("Failed to fetch clearance:", err);
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
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchClearance();
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
          userId,
          newStatus: "ALUMNI",
          reason: "Completed 12 monthly clearances and transitioned to Alumni status",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRole("alumni");
      } else {
        setError(data.message || "Failed to transition to Alumni");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
  const { currentRole, setRole } = useRole();

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: "John Okoh", role: "ICT Assistant", reason: "Medical Leave (3 Days)", status: "pending" },
    { id: 2, name: "Amina Bello", role: "Research Associate", reason: "LGA Clearance Exemption", status: "pending" },
  ]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string>("demo_user_id");
  const [journeyInfo, setJourneyInfo] = useState<any>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("kopawee_user_id") || "demo_user_id";
      setActiveUserId(id);
      fetch(`/api/users/journey?userId=${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data?.journey) {
            setJourneyInfo(data.data.journey);
          }
        })
        .catch(() => {});
    }
  }, []);

  const userId = activeUserId;

  const handleLeaveAction = (id: number, status: "approved" | "rejected") => {
    setLeaveRequests((prev) => prev.map((req) => req.id === id ? { ...req, status } : req));
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
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
    try {
      const res = await fetch("/api/users/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          newStatus: "SERVING",
          reason: "User self-initiated transition from PCM dashboard",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRole("serving");
        setShowStatusModal(false);
      } else {
        console.error("Status update failed:", data.message);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setStatusUpdating(false);
    }
  };

  /* =========================================================================
     1. PROSPECTIVE CORPS MEMBER (PCM) VIEW
     ========================================================================= */
  if (currentRole === "pcm") {
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
              Stream call-up release approaching. Manage mandatory documents and camp kit.
            </p>
          </div>

          <button
            onClick={() => setShowStatusModal(true)}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Update Status ➔ Serving Corper</span>
          </button>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase tracking-widest font-display">Orientation Countdown</span>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold font-display text-[#121815] dark:text-white">14 Days Left</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">KADUNA NYSC Permanent Camp, Mando.</p>
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
            <div className="text-base font-bold font-display text-[#121815] dark:text-white">Lagos ➔ Kaduna State</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Corper convoy leaves Jibowu Park Aug 28, 6:00 AM.</p>
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
                Instant answers trained on official NYSC Bye-laws.
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
                <button type="submit" className="px-5 py-3 bg-[#121815] text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors">
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
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block pt-1">{card.action}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Status Update Modal */}
        {showStatusModal && (
          <StatusUpdateModal
            fromStatus="Prospective Corps Member (PCM)"
            toStatus="Serving Corps Member"
            campExitDate={journeyInfo?.campExitDate}
            onConfirm={handleStatusUpdate}
            onCancel={() => setShowStatusModal(false)}
            isLoading={statusUpdating}
          />
        )}
      </div>
    );
  }

  /* =========================================================================
     2. SERVING CORPS MEMBER VIEW
     ========================================================================= */
  if (currentRole === "serving") {
    return (
      <div className="space-y-8 font-sans">
        <div className="p-8 bg-[#121815] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ROLE: SERVING CORPS MEMBER (LA/24A/1042)</span>
            </div>
            <h1 className="text-3xl font-medium text-white tracking-tight font-display">
              Welcome back, Corper Chidi
            </h1>
            <p className="text-xs text-slate-300">
              Monthly LGA Clearance in <strong className="text-white">4 days</strong> (Ikeja LGA Hub, Lagos State).
            </p>
          </div>

          <ClearanceWidget userId={userId} />
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
            <div className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-300" />
              <span>Your POP is approaching</span>
            </div>
          </div>
        )}

        {/* Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Next Clearance", val: "4 Days Left", sub: "Aug 25 · Ikeja Hub", icon: Clock },
            { label: "Allawee Savings", val: "₦77,000", sub: "Saved via P2P Market", icon: TrendingUp },
            { label: "CDS Attendance", val: "92% Rate", sub: "Education CDS Group", icon: Users },
            { label: "Safety Status", val: "Active & Safe", sub: "Last check-in: 2h ago", icon: ShieldAlert },
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
              { href: "/dashboard/companion", tag: "Clearance", title: "Smart Clearance Assistant", desc: "LGA biometric reminders, document vault, and route sync.", icon: Calendar },
              { href: "/dashboard/marketplace", tag: "Marketplace", title: "Corper Peer Marketplace", desc: "Buy, sell, or swap mattresses, fans, and gas cylinders.", icon: ShoppingBag },
              { href: "/dashboard/accommodation", tag: "Housing", title: "Lodge & Roommate Matcher", desc: "Find corper lodges near PPA and split rent easily.", icon: Home },
              { href: "/dashboard/safety", tag: "Safety", title: "Travel SOS Tracker", desc: "Active highway trip monitoring and emergency contact ping.", icon: ShieldAlert },
              { href: "/dashboard/workplace", tag: "Workplace", title: "PPA Logbook", desc: "Log work presence, request leave, and track evaluations.", icon: Briefcase },
              { href: "/dashboard/community", tag: "CDS", title: "CDS Group Manager", desc: "Meeting schedule, attendance register, and dues log.", icon: Users },
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
     3. PPA REPRESENTATIVE / EMPLOYER VIEW
     ========================================================================= */
  if (currentRole === "ppa") {
    return (
      <div className="space-y-8 font-sans">
        <div className="p-8 bg-[#121815] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
              <Building2 className="w-3.5 h-3.5" />
              <span>ROLE: PPA REPRESENTATIVE (EMPLOYER)</span>
            </div>
            <h1 className="text-3xl font-medium text-white tracking-tight font-display">
              Grace High School PPA Hub 🏫
            </h1>
            <p className="text-xs text-slate-300">
              Managing 8 Corps Members assigned for 2024 Service Year.
            </p>
          </div>
          <button className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Corper Slot
          </button>
        </div>

        <div className="p-8 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-[#121815] dark:text-white uppercase tracking-widest font-display flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-600" /> Corper Leave Applications
          </h2>

          <div className="space-y-3">
            {leaveRequests.map((req) => (
              <div key={req.id} className="p-4 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-sm text-[#121815] dark:text-white font-display flex items-center gap-2">
                    <span>{req.name}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono">{req.role}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{req.reason}</p>
                </div>

                {req.status === "pending" ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleLeaveAction(req.id, "approved")}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleLeaveAction(req.id, "rejected")}
                      className="px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 ${
                    req.status === "approved" ? "bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-600/40" : "bg-red-950/20 text-red-700 dark:text-red-300 border border-red-600/40"
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

  /* =========================================================================
     4. CDS EXECUTIVE VIEW
     ========================================================================= */
  if (currentRole === "cds_exec") {
    return (
      <div className="space-y-8 font-sans">
        <div className="p-8 bg-[#121815] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
              <Users className="w-3.5 h-3.5" />
              <span>ROLE: CDS EXECUTIVE</span>
            </div>
            <h1 className="text-3xl font-medium text-white tracking-tight font-display">
              Editorial & Publicity CDS Hub 📢
            </h1>
            <p className="text-xs text-slate-300">
              Ikeja LGA Branch · 42 Registered Members
            </p>
          </div>
          <Link href="/dashboard/community" className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shrink-0">
            Today&apos;s Attendance ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 font-display">Total Dues Collected</span>
            <div className="text-2xl font-bold font-display text-[#121815] dark:text-white">₦42,000</div>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">₦1,000 / Corper per month</span>
          </div>

          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 font-display">Active Projects</span>
            <div className="text-2xl font-bold font-display text-[#121815] dark:text-white">2 Projects</div>
            <span className="text-xs text-slate-600 dark:text-slate-400">Solar Library & School Renovation</span>
          </div>

          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 font-display">Next Meeting</span>
            <div className="text-2xl font-bold font-display text-[#121815] dark:text-white">Thursday, 9:00 AM</div>
            <span className="text-xs text-slate-600 dark:text-slate-400">Ikeja LGA Secretariat Hall</span>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     5. NYSC OFFICIAL / LGA INSPECTOR VIEW
     ========================================================================= */
  if (currentRole === "nysc_official") {
    return (
      <div className="space-y-8 font-sans">
        <div className="p-8 bg-[#121815] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ROLE: NYSC LGA INSPECTOR (LGI)</span>
            </div>
            <h1 className="text-3xl font-medium text-white tracking-tight font-display">
              Ikeja LGA Biometric Command Center 🏛️
            </h1>
            <p className="text-xs text-slate-300">
              Lagos Directorate · Monitoring 1,600 Active Corps Members
            </p>
          </div>
          <Link href="/dashboard/companion" className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shrink-0">
            Open Biometric Scanner ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 font-display">August Biometrics Verified</span>
            <div className="text-2xl font-bold font-display text-[#121815] dark:text-white">1,420 / 1,600</div>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">88.7% Clearance Completion</span>
          </div>

          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 font-display">PPA Employer Reports</span>
            <div className="text-2xl font-bold font-display text-[#121815] dark:text-white">148 Approved</div>
            <span className="text-xs text-slate-600 dark:text-slate-400">12 Pending Query</span>
          </div>

          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 font-display">Biometric Terminal</span>
            <div className="text-2xl font-bold font-display text-emerald-600">Online & Syncing</div>
            <span className="text-xs text-slate-600 dark:text-slate-400">HQ Server Ping: 12ms</span>
          </div>
        </div>
      </div>
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
            Sell relocation household items and explore post-service career opportunities.
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

        <Link href="/dashboard/workplace" className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 hover:border-emerald-600 transition-all space-y-3">
          <h3 className="text-base font-bold text-[#121815] dark:text-white font-display">Post-NYSC Career & Gigs</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">NiYA Job Bank integration, CV builder, remote tech gigs, and employer referrals.</p>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block pt-1">Explore Jobs ➔</span>
        </Link>
      </div>
    </div>
  );
}
