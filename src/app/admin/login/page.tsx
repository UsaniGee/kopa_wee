"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiShield, FiLock, FiMail, FiArrowRight, FiArrowLeft } from "react-icons/fi";

const Shield = FiShield;
const Lock = FiLock;
const Mail = FiMail;
const ArrowRight = FiArrowRight;
const ArrowLeft = FiArrowLeft;

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
    <div className="min-h-screen bg-[#121815] text-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 space-y-6 animate-fadeIn shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <Link href="/" className="flex items-center gap-2 group text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider font-display">
            <ArrowLeft className="w-4 h-4" />
            <span>KopaWee Home</span>
          </Link>
          <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 bg-emerald-950 border border-emerald-800 uppercase tracking-widest">
            PLATFORM OWNER PORTAL
          </span>
        </div>

        <div className="space-y-2 text-center pt-2">
          <div className="w-12 h-12 bg-emerald-600/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-white">Product Owner Admin Login</h1>
          <p className="text-xs text-slate-400">
            Platform Ad Moderation & Classified Listing Approval Center
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs font-sans">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-display">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kopawee.ng"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-display">
              Admin Security Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 mt-2 font-display"
          >
            {loading ? (
              <span>AUTHENTICATING...</span>
            ) : (
              <>
                <span>ENTER ADMIN DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[10px] text-slate-500 font-mono pt-4 border-t border-slate-800">
          STRICTLY FOR KOPA&apos;WEE PLATFORM ADMINISTRATORS & MODERATORS
        </div>
      </div>
    </div>
  );
}
