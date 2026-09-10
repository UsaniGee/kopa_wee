"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiLock, FiArrowRight, FiArrowLeft } from "react-icons/fi";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!data.success) {
        setErrorMsg(data.error || "Failed to reset password.");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/auth?mode=signin"), 2500);
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#eaf5ed] dark:bg-[#0a0f0d] flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-4 text-center">
          <p className="text-sm text-red-600 font-semibold">Invalid reset link. Please request a new one.</p>
          <Link href="/auth?mode=signin" className="text-xs font-bold text-emerald-700 uppercase tracking-wider hover:underline">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eaf5ed] dark:bg-[#0a0f0d] flex items-center justify-center p-8 font-sans">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="font-bold text-xl tracking-widest uppercase font-display text-[#121815] dark:text-white">
            KOPA<span className="text-emerald-600 font-extrabold">&apos;WEE</span>
          </Link>
        </div>

        {success ? (
          <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-emerald-600/60 text-center space-y-4">
            <p className="text-xl font-bold font-display text-[#121815] dark:text-white">Password Updated ✓</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Redirecting you to sign in...</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h1 className="text-3xl font-medium text-[#121815] dark:text-white font-display tracking-tight">
                Set New Password
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Choose a strong password for your KopaWee account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <FiLock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters..."
                    className="w-full pl-10 pr-4 py-3 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password..."
                    className="w-full pl-10 pr-4 py-3 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={!password || !confirm || loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>UPDATING...</span></>
                ) : (
                  <><span>UPDATE PASSWORD</span><FiArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <Link href="/auth?mode=signin" className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white uppercase tracking-wider">
              <FiArrowLeft className="w-3 h-3" /> Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#eaf5ed] flex items-center justify-center text-xs font-mono">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
