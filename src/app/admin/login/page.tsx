"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiShield, FiLock, FiMail, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import ThemeToggle from "@/shared/components/ThemeToggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@kopawee.ng");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter admin credentials");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setTimeout(() => {
      if (password === "admin123" || password.length >= 4) {
        localStorage.setItem("kopawee_admin_token", "admin_auth_session_" + Date.now());
        localStorage.setItem("kopawee_admin_email", email);
        router.push("/admin");
      } else {
        setErrorMsg("Invalid platform admin credentials");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#eaf5ed] dark:bg-[#0a0f0d] text-[#121815] dark:text-white flex flex-col font-sans transition-colors duration-300">

      {/* Top bar */}
      <header className="bg-[#121815] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider font-display transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>KopaWee Home</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 bg-emerald-950 border border-emerald-800 uppercase tracking-widest">
            PLATFORM OWNER PORTAL
          </span>
          <ThemeToggle size="11px" />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 p-10 space-y-8 shadow-sm">

          {/* Header */}
          <div className="space-y-3 text-center">
            <div className="w-12 h-12 bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <FiShield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-[#121815] dark:text-white">
              Admin Login
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Platform Ad Moderation &amp; Listing Approval Center
            </p>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs font-semibold text-center">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-display">
                Admin Email
              </label>
              <div className="relative">
                <FiMail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kopawee.ng"
                  className="w-full pl-10 pr-4 py-3 bg-[#dcece1] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-display">
                Admin Password
              </label>
              <div className="relative">
                <FiLock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#dcece1] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-display"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>AUTHENTICATING...</span></>
              ) : (
                <><span>ENTER ADMIN DASHBOARD</span><FiArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="text-center text-[10px] text-slate-400 dark:text-slate-500 font-mono pt-2 border-t border-slate-200 dark:border-slate-800">
            STRICTLY FOR KOPAWEE PLATFORM ADMINISTRATORS
          </div>
        </div>
      </main>
    </div>
  );
}
