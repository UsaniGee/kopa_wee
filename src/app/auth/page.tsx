"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation";
import { useRole } from "@/shared/context/RoleContext";
import { 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  ArrowLeft,
  Sparkles,
  Star,
  ShieldCheck
} from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signin" ? "signin" : "signup";

  const [mode, setMode] = useState<"signup" | "signin">(initialMode);
  const { setRole } = useRole();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      localStorage.setItem("kopawee_auth_token", "mock_token_" + Date.now());
      localStorage.setItem("kopawee_user_email", email || "user@kopawee.ng");
      localStorage.setItem("kopawee_user_name", fullName || "New Corper");
      router.push("/onboarding");
    } else {
      localStorage.setItem("kopawee_auth_token", "mock_token_" + Date.now());
      const savedRole = localStorage.getItem("kopawee_active_role") || "serving";
      setRole(savedRole as any);
      router.push("/dashboard");
    }
  };

  const handleGoogleAuth = () => {
    localStorage.setItem("kopawee_auth_token", "google_token_" + Date.now());
    if (mode === "signup") {
      router.push("/onboarding");
    } else {
      const savedRole = localStorage.getItem("kopawee_active_role") || "serving";
      setRole(savedRole as any);
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white grid grid-cols-1 lg:grid-cols-12 font-sans overflow-x-hidden">
      {/* ===================================================================
          LEFT SIDE: FULL-HEIGHT VISUAL HERO OVERLAY PANEL (EMERALD/BLACK)
          =================================================================== */}
      <div className="hidden lg:flex lg:col-span-6 min-h-125 lg:min-h-screen p-8 sm:p-12 lg:p-16 text-white relative lg:flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-10 blur-sm scale-105">
          <Image
            src="https://res.cloudinary.com/dnu4lxiie/image/upload/v1787322615/loginImage_ouju1n.jpg"
            alt="Login Background"
            fill
            className="object-cover object-center"
            priority={true}
          />
        </div>
        <div className="absolute inset-0 z-10 bg-green-500/30" />
      
        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white backdrop-blur-md transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Center Copy */}
        {/* relative z-10 ensures it stays above the detached bg layer. */}
        <div className="relative z-10 space-y-6 my-12 lg:my-auto max-w-lg">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] text-white">
            {mode === "signup"
              ? "Start turning your NYSC journey into reality."
              : "Welcome back to your NYSC companion."}
          </h1>
          <p className="text-sm sm:text-base text-white leading-relaxed font-normal">
            {mode === "signup"
              ? "Create a free account and get full access to orientation camp guides, clearance tracking, accommodation, and marketplace."
              : "Log in to track your monthly LGA clearance countdown, workplace logbook, and community CDS dues."}
          </p>
        </div>

        {/* Bottom Social Proof & Ratings */}
        {/* relative z-10 ensures it stays above the detached bg layer. */}
        <div className="relative z-10 pt-8 border-t border-white/10 flex flex-wrap items-center gap-6">
          {/* Avatar Stack */}
          <div className="flex -space-x-3 overflow-hidden">
            {[
              "bg-emerald-600",
              "bg-amber-500",
              "bg-slate-700",
              "bg-emerald-800",
              "bg-emerald-500",
            ].map((color, i) => (
              <div
                key={i}
                className={`w-9 h-9 rounded-full border-2 border-slate-900 ${color} flex items-center justify-center text-[10px] font-black text-white uppercase shadow-md`}
              >
                {["CO", "TB", "AO", "OK", "JN"][i]}
              </div>
            ))}
          </div>

          {/* Star Rating */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400" />
              ))}
              <span className="text-sm font-black text-white ml-1.5">
                4.9 / 5.0
              </span>
            </div>
            <span className="text-xs text-slate-400 block">
              from 10,000+ Nigerian Corps Members
            </span>
          </div>
        </div>
      </div>

      {/* ===================================================================
          RIGHT SIDE: FULL-HEIGHT CLEAN AUTHENTICATION FORM PANEL
          =================================================================== */}
      <div className="lg:col-span-6 min-h-screen p-8 sm:p-12 lg:p-16 bg-white flex flex-col justify-between max-w-xl mx-auto w-full">
        {/* Header & Logo Badge */}
        <div className="space-y-8 my-auto w-full">
          <div className="flex items-center justify-between">
            {/* Brand App Badge */}
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-xl font-black text-xl">
              K<span className="text-emerald-500">+</span>
            </div>

            {/* Mode Toggle Pills */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`px-4 py-2 rounded-xl transition-all ${
                  mode === "signup"
                    ? "bg-emerald-500 text-white shadow-md font-bold"
                    : "hover:text-slate-900"
                }`}
              >
                Sign up
              </button>
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`px-4 py-2 rounded-xl transition-all ${
                  mode === "signin"
                    ? "bg-black text-white shadow-md font-bold"
                    : "hover:text-slate-900"
                }`}
              >
                Log in
              </button>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {mode === "signup" ? "Sign up" : "Log in"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
              {mode === "signup"
                ? "Start your free account with KopaWee+."
                : "Welcome back! Please enter your details."}
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-5">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Name*
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-2xl text-sm bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email*
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-2xl text-sm bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password*
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full px-4 py-3 rounded-2xl text-sm bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent transition-all placeholder:text-slate-400 font-medium"
              />
              {mode === "signup" && (
                <span className="text-xs text-slate-400 block pt-0.5 font-medium">
                  Must be at least 8 characters.
                </span>
              )}
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              className={`w-full py-3.5 px-4 rounded-2xl text-sm font-black text-white shadow-xl transition-all flex items-center justify-center gap-2 mt-2 ${
                mode === "signup"
                  ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25"
                  : "bg-black hover:bg-slate-800 shadow-black/25"
              }`}
            >
              <span>{mode === "signup" ? "Create account" : "Log in"}</span>
            </button>

            {/* Google SSO Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-3 px-4 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>
                {mode === "signup"
                  ? "Sign up with Google"
                  : "Sign in with Google"}
              </span>
            </button>
          </form>

          {/* Footer Switcher */}
          <div className="pt-6 text-center mt-6">
            {mode === "signup" ? (
              <p className="text-xs text-slate-500 font-medium">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="font-bold text-emerald-600 hover:text-emerald-700 underline"
                >
                  Log in
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500 font-medium">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="font-bold text-emerald-600 hover:text-emerald-700 underline"
                >
                  Sign up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
