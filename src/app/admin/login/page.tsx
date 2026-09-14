"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  FiShield,
  FiLock,
  FiMail,
  FiArrowRight,
  FiAlertTriangle,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@kopawee.ng");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter admin credentials");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!result?.ok) {
        const errorCode = result?.code ?? result?.error ?? "";
        if (errorCode === "EMAIL_NOT_VERIFIED") {
          setErrorMsg("Your admin account email has not been verified yet.");
        } else if (errorCode === "FetchError" || result?.status === 500) {
          setErrorMsg("Network or server error. Please try again.");
        } else {
          setErrorMsg("Invalid email or password. Please try again.");
        }
        setLoading(false);
        return;
      }
      // Check if user has ADMIN applicationRole
      const res = await fetch("/api/users/me");
      if (!res.ok) {
        setErrorMsg("Failed to verify user permissions. Please try again.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.success && data.data?.applicationRole === "ADMIN") {
        router.push("/admin");
      } else {
        // Sign them out — authenticated but not admin
        await fetch("/api/auth/signout", { method: "POST" });
        setErrorMsg("Access denied. This portal is for platform administrators only.");
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0f0d] grid grid-cols-1 lg:grid-cols-2 font-sans overflow-hidden">

      {/* ── LEFT PANEL: Editorial ops identity ─────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between p-14 bg-[#080c0a] border-r border-red-900/30 relative overflow-hidden">

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 39px,#ef4444 39px,#ef4444 40px)," +
              "repeating-linear-gradient(90deg,transparent,transparent 39px,#ef4444 39px,#ef4444 40px)",
          }}
        />

        {/* Top: Logo + badge */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-widest uppercase font-display text-white">
            KOPA<span className="text-red-500 font-extrabold">&apos;WEE</span>
          </Link>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] px-2.5 py-1 bg-red-600/10 border border-red-500/40 text-red-400">
            RESTRICTED
          </span>
        </div>

        {/* Center: Editorial copy */}
        <div className="relative z-10 space-y-6">
          <div className="w-14 h-14 border border-red-500/40 bg-red-600/10 flex items-center justify-center">
            <FiShield className="w-7 h-7 text-red-400" />
          </div>
          <div className="space-y-3">
            <p className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-red-400">
              PLATFORM CONTROL CENTER
            </p>
            <h1 className="text-4xl lg:text-5xl font-medium tracking-tight leading-[1.06] text-white font-display">
              Authorised<br />Personnel<br />Only.
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Ad moderation, listing approvals, and user status management for the KopaWee platform.
            </p>
          </div>

          {/* Security notices */}
          <div className="space-y-2 pt-2">
            {[
              "All sessions are logged and audited",
              "Unauthorised access is a criminal offence",
              "2FA enforcement coming in v2.0",
            ].map((notice) => (
              <div key={notice} className="flex items-center gap-2.5 text-[11px] text-slate-500 font-mono">
                <span className="w-1 h-1 bg-red-500 rounded-full shrink-0" />
                {notice}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Version stamp */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-600 border-t border-red-900/20 pt-5">
          <span>KOPAWEE ADMIN v1.0</span>
          <span className="text-red-700">⬤ SECURE CHANNEL</span>
        </div>
      </div>

      {/* ── RIGHT PANEL: Login form ─────────────────────────────────────── */}
      <div className="flex flex-col justify-between p-8 sm:p-12 lg:p-14 bg-[#0a0f0d]">

        {/* Mobile top bar */}
        <div className="flex items-center justify-between lg:hidden mb-10">
          <Link href="/" className="font-bold text-xl tracking-widest uppercase font-display text-white">
            KOPA<span className="text-red-500 font-extrabold">&apos;WEE</span>
          </Link>
          <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest">
            ADMIN PORTAL
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-8">

          {/* Form header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 border border-red-500/40 bg-red-600/10 flex items-center justify-center">
                <FiLock className="w-4 h-4 text-red-400" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-red-400">
                ADMIN ACCESS
              </span>
            </div>
            <h2 className="text-3xl font-medium text-white font-display tracking-tight">
              Sign in to Control Center
            </h2>
            <p className="text-xs text-slate-500">
              Credentials are issued to platform administrators only.
            </p>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="flex items-center gap-3 p-3.5 bg-red-900/20 border border-red-700/60 text-red-400 text-xs font-semibold">
              <FiAlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-display">
                Admin Email
              </label>
              <div className="relative">
                <FiMail className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kopawee.ng"
                  className="w-full pl-10 pr-4 py-3 bg-[#121815] border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-display">
                Admin Password
              </label>
              <div className="relative">
                <FiLock className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#121815] border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-red-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full py-4 bg-red-700 hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 font-display mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <span>ACCESS CONTROL CENTER</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="flex items-center gap-2 text-[10px] text-slate-700 font-mono pt-2 border-t border-slate-900">
            <FiShield className="w-3 h-3 text-red-900" />
            <span>STRICTLY FOR KOPAWEE PLATFORM ADMINISTRATORS & MODERATORS</span>
          </div>
        </div>

        {/* Bottom link */}
        <div className="mt-8 lg:mt-0">
          <Link
            href="/"
            className="text-[11px] font-mono text-slate-700 hover:text-slate-500 uppercase tracking-widest transition-colors"
          >
            ← Return to KopaWee
          </Link>
        </div>
      </div>

    </div>
  );
}
