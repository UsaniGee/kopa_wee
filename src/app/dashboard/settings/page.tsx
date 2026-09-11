"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { FiSave, FiLoader, FiCalendar, FiInfo, FiCheck, FiAlertTriangle, FiBook, FiPackage, FiLock } from "react-icons/fi";

import { useRole } from "@/shared/context/RoleContext";

interface JourneyData {
  campEntryDate: string | null;
  campExitDate: string | null;
  serviceStartDate: string | null;
  serviceEndDate: string | null;
  batch: string | null;
  stream: string | null;
  institution: string | null;
  courseOfStudy: string | null;
}

interface UserData {
  nyscStatus: string;
  deployedState: string | null;
  lga: string | null;
  ppaName: string | null;
  callUpNo: string | null;
  stateCode: string | null;
  stateOfOrigin: string | null;
}

export default function AccountSettingsPage() {
  const { currentRole } = useRole();
  const { data: session } = useSession();
  const [userStatus, setUserStatus] = useState<string>("PCM");

  const userId = session?.user?.id || "";

  const [journeyData, setJourneyData] = useState<JourneyData>({
    campEntryDate: "",
    campExitDate: "",
    serviceStartDate: "",
    serviceEndDate: "",
    batch: "",
    stream: "",
    institution: "",
    courseOfStudy: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDateForInput = (dateStr: string | null) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const fetchJourney = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/users/journey`);
      const data = await res.json();
      if (data.success) {
        if (data.data.user?.nyscStatus) {
          setUserStatus(data.data.user.nyscStatus);
        }
        if (data.data.journey) {
          const j = data.data.journey;
          setJourneyData({
            campEntryDate: formatDateForInput(j.campEntryDate),
            campExitDate: formatDateForInput(j.campExitDate),
            serviceStartDate: formatDateForInput(j.serviceStartDate),
            serviceEndDate: formatDateForInput(j.serviceEndDate),
            batch: j.batch || "",
            stream: j.stream || "",
            institution: j.institution || "",
            courseOfStudy: j.courseOfStudy || "",
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch journey:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchJourney();
  }, [fetchJourney]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const payload: Record<string, string | null> = { userId };

      // Only include dates that have a value
      if (journeyData.campEntryDate) {
        payload.campEntryDate = new Date(journeyData.campEntryDate).toISOString();
      } else {
        payload.campEntryDate = null;
      }
      if (journeyData.campExitDate) {
        payload.campExitDate = new Date(journeyData.campExitDate).toISOString();
      } else {
        payload.campExitDate = null;
      }
      if (journeyData.serviceStartDate) {
        payload.serviceStartDate = new Date(journeyData.serviceStartDate).toISOString();
      } else {
        payload.serviceStartDate = null;
      }
      if (journeyData.serviceEndDate) {
        payload.serviceEndDate = new Date(journeyData.serviceEndDate).toISOString();
      } else {
        payload.serviceEndDate = null;
      }
      if (journeyData.batch) payload.batch = journeyData.batch;
      if (journeyData.stream) payload.stream = journeyData.stream;
      if (journeyData.institution) payload.institution = journeyData.institution;
      if (journeyData.courseOfStudy) payload.courseOfStudy = journeyData.courseOfStudy;

      const res = await fetch("/api/users/journey", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(data.error || "Failed to save. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <FiLoader className="w-6 h-6 animate-spin mr-3" />
        <span className="text-sm">Loading account settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-10 font-sans max-w-2xl">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-[#121815] dark:text-white font-display tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Keep your NYSC journey details up-to-date. All fields are optional — you can update these at any time.
        </p>
      </div>

      {/* Progressive Profile Notice */}
      <div className="p-5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 flex gap-3">
        <FiInfo className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1">
            Progressive Profile — Fill in at your own pace
          </p>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
            These details are optional and help KopaWee track your NYSC journey automatically. For example, once your camp exit date arrives, your status will automatically update to Serving Corps Member — so you don&apos;t have to do it manually.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* NYSC Identity Section */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
            <FiPackage className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-[#121815] dark:text-white uppercase tracking-widest font-display">
              NYSC Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 block">
                Batch
              </label>
              <input
                type="text"
                value={journeyData.batch || ""}
                onChange={(e) => setJourneyData((p) => ({ ...p, batch: e.target.value }))}
                placeholder="e.g. 2024 Batch A"
                className="w-full px-4 py-3 text-xs bg-white dark:bg-[#0a0f0d] border border-slate-300 dark:border-slate-700 text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 block">
                Stream
              </label>
              <input
                type="text"
                value={journeyData.stream || ""}
                onChange={(e) => setJourneyData((p) => ({ ...p, stream: e.target.value }))}
                placeholder="e.g. Stream II"
                className="w-full px-4 py-3 text-xs bg-white dark:bg-[#0a0f0d] border border-slate-300 dark:border-slate-700 text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 block">
                Institution
              </label>
              <input
                type="text"
                value={journeyData.institution || ""}
                onChange={(e) => setJourneyData((p) => ({ ...p, institution: e.target.value }))}
                placeholder="e.g. University of Lagos"
                className="w-full px-4 py-3 text-xs bg-white dark:bg-[#0a0f0d] border border-slate-300 dark:border-slate-700 text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 block">
                Course of Study
              </label>
              <input
                type="text"
                value={journeyData.courseOfStudy || ""}
                onChange={(e) => setJourneyData((p) => ({ ...p, courseOfStudy: e.target.value }))}
                placeholder="e.g. Computer Science"
                className="w-full px-4 py-3 text-xs bg-white dark:bg-[#0a0f0d] border border-slate-300 dark:border-slate-700 text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Camp Dates Section (PCM & all) */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
            <FiCalendar className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-[#121815] dark:text-white uppercase tracking-widest font-display">
              Orientation Camp Dates
            </h2>
            <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1">
              Optional
            </span>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 mb-4">
            <p className="text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2 leading-relaxed">
              <FiAlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              When your Camp Exit Date arrives, KopaWee will automatically update your status to &quot;Serving Corps Member&quot;. Your packing checklist data will be preserved as your item stock for the serving phase.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 block">
                Camp Entry Date
              </label>
              <input
                type="date"
                value={journeyData.campEntryDate || ""}
                onChange={(e) => setJourneyData((p) => ({ ...p, campEntryDate: e.target.value }))}
                className="w-full px-4 py-3 text-xs bg-white dark:bg-[#0a0f0d] border border-slate-300 dark:border-slate-700 text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 block">
                Camp Exit Date (POP of Camp)
              </label>
              <input
                type="date"
                value={journeyData.campExitDate || ""}
                onChange={(e) => setJourneyData((p) => ({ ...p, campExitDate: e.target.value }))}
                className="w-full px-4 py-3 text-xs bg-white dark:bg-[#0a0f0d] border border-slate-300 dark:border-slate-700 text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Service Information Section (ONLY visible to Serving Corps Members & Alumni) */}
        {(currentRole === "serving" || currentRole === "alumni" || userStatus === "SERVING" || userStatus === "ALUMNI") && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
              <FiBook className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-[#121815] dark:text-white uppercase tracking-widest font-display">
                Service Information & Timeline
              </h2>
              <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-[#121815] dark:text-white bg-emerald-100 dark:bg-emerald-900/40 px-2 py-1 border border-emerald-300 dark:border-emerald-700">
                Serving Only
              </span>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 mb-4">
              <p className="text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2 leading-relaxed">
                <FiInfo className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                Add your service start date and expected end date (POP). When your Expected POP Date arrives, KopaWee will automatically update your status to &quot;Alumni&quot;.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 block">
                  Service Start Date / Year
                </label>
                <input
                  type="date"
                  value={journeyData.serviceStartDate || ""}
                  onChange={(e) => setJourneyData((p) => ({ ...p, serviceStartDate: e.target.value }))}
                  className="w-full px-4 py-3 text-xs bg-white dark:bg-[#0a0f0d] border border-slate-300 dark:border-slate-700 text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 block">
                  Expected Service End Date / POP Date
                </label>
                <input
                  type="date"
                  value={journeyData.serviceEndDate || ""}
                  onChange={(e) => setJourneyData((p) => ({ ...p, serviceEndDate: e.target.value }))}
                  className="w-full px-4 py-3 text-xs bg-white dark:bg-[#0a0f0d] border border-slate-300 dark:border-slate-700 text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saved ? (
              <>
                <FiCheck className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>

          {error && (
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        {/* Subscription Status Section */}
        <div className="space-y-5 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <FiLock className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-[#121815] dark:text-white uppercase tracking-widest font-display">
              Subscription
            </h2>
          </div>

          <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/10 border border-emerald-200 dark:border-emerald-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 border border-emerald-300 dark:border-emerald-700">
                  Early Access
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-emerald-600 px-2 py-0.5">
                  FREE
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                You joined during KopaWee Early Access. You have full access to all platform features at no cost.
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Premium plans will be introduced as the platform grows. Early Access members will receive special pricing.
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 font-display">₦0</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">/ month</div>
            </div>
          </div>
        </div>
      </form>

      {/* ── Security — Change Password ─────────────────────────────────── */}
      <ChangePasswordSection />
    </div>
  );
}

// ─── Change Password Section ──────────────────────────────────────────────────
function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/users/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to update password.");
      } else {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 space-y-6">
      <div className="flex items-center gap-2">
        <FiLock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-sm font-bold text-[#121815] dark:text-white uppercase tracking-widest font-display">
          Security — Change Password
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 text-xs font-semibold">
            <FiAlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <FiCheck className="w-4 h-4" />
            <span>Password updated successfully.</span>
          </div>
        )}

        {[
          { label: "Current Password", value: currentPassword, setter: setCurrentPassword, placeholder: "Enter current password" },
          { label: "New Password", value: newPassword, setter: setNewPassword, placeholder: "Min. 8 characters" },
          { label: "Confirm New Password", value: confirmPassword, setter: setConfirmPassword, placeholder: "Repeat new password" },
        ].map(({ label, value, setter, placeholder }) => (
          <div key={label} className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-display">
              {label}
            </label>
            <div className="relative">
              <FiLock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-3 text-xs bg-white dark:bg-[#0a0f0d] border border-slate-300 dark:border-slate-700 text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600 transition-colors placeholder-slate-400"
              />
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={saving || !currentPassword || !newPassword || !confirmPassword}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider transition-all font-display"
        >
          {saving ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>UPDATING...</span></>
          ) : (
            <><FiSave className="w-4 h-4" /><span>UPDATE PASSWORD</span></>
          )}
        </button>
      </form>
    </div>
  );
}
