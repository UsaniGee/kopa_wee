"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiShield, FiLock, FiUser, FiArrowRight } from "react-icons/fi";

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-sm font-semibold">Invalid invite link.</p>
          <Link href="/admin/login" className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider">
            ← Admin Login
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, name, password }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error || "Failed to create account."); return; }
      setSuccess(true);
      setTimeout(() => router.push("/admin/login"), 2500);
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center p-8 font-sans">
      <div className="max-w-md w-full space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-red-500/40 bg-red-600/10 flex items-center justify-center">
            <FiShield className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-widest uppercase font-display text-white">KOPA<span className="text-red-500">&apos;WEE</span></span>
            <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest">ADMIN SETUP</p>
          </div>
        </div>
        {success ? (
          <div className="p-6 border border-red-500/40 bg-red-600/10 text-center space-y-2">
            <p className="text-white font-bold font-display">Account created ✓</p>
            <p className="text-xs text-slate-400">Redirecting to admin login...</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h1 className="text-2xl font-medium text-white font-display">Set up your admin account</h1>
              <p className="text-xs text-slate-500">Create your password to complete the invitation.</p>
            </div>
            {error && <div className="p-3 bg-red-900/20 border border-red-700/60 text-red-400 text-xs font-semibold">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: "Full Name", value: name, setter: setName, type: "text", icon: FiUser, placeholder: "Your full name" },
                { label: "Password", value: password, setter: setPassword, type: "password", icon: FiLock, placeholder: "Min. 8 characters" },
                { label: "Confirm Password", value: confirm, setter: setConfirm, type: "password", icon: FiLock, placeholder: "Repeat password" },
              ].map(({ label, value, setter, type, icon: Icon, placeholder }) => (
                <div key={label} className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-display">{label}</label>
                  <div className="relative">
                    <Icon className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type={type} required value={value} onChange={(e) => setter(e.target.value)} placeholder={placeholder}
                      className="w-full pl-10 pr-4 py-3 bg-[#121815] border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-red-600 transition-colors" />
                  </div>
                </div>
              ))}
              <button type="submit" disabled={loading || !name || !password || !confirm}
                className="w-full py-4 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 mt-2">
                {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>CREATING...</span></>
                  : <><span>CREATE ADMIN ACCOUNT</span><FiArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center text-xs font-mono text-slate-500">Loading...</div>}>
      <AcceptInviteContent />
    </Suspense>
  );
}
