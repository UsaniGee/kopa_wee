"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowRight, FiLock, FiMail, FiUser, FiArrowLeft, FiShield } from "react-icons/fi";
import { getRouteForRole } from "@/shared/utils/authNav";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signin" ? "signin" : "signup";
  const redirectUrl = searchParams.get("redirect");

  const [mode, setMode] = useState<"signup" | "signin">(initialMode);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState("");

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName || "New Corper",
            email,
            password,
            role: "PCM",
          }),
        });

        const data = await res.json();
        if (!data.success) {
          setErrorMsg(data.error || "Failed to create account");
          setLoading(false);
          return;
        }

        const user = data.data;
        localStorage.setItem("kopawee_user_id", user.id);
        localStorage.setItem("kopawee_auth_token", "jwt_token_" + user.id);
        localStorage.setItem("kopawee_user_email", user.email);
        localStorage.setItem("kopawee_user_name", user.name);
        localStorage.setItem("kopawee_active_role", "pcm");

        setVerificationUrl(data.verificationUrl || `/auth/verify?email=${encodeURIComponent(user.email)}`);
        setShowVerificationNotice(true);
        setLoading(false);
        return;
      } else {
        // Sign in flow — authenticate against Neon PostgreSQL API
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!data.success) {
          setErrorMsg(data.error || "Invalid email or password");
          setLoading(false);
          return;
        }

        const user = data.data;
        localStorage.setItem("kopawee_user_id", user.id);
        localStorage.setItem("kopawee_auth_token", "jwt_token_" + user.id);
        localStorage.setItem("kopawee_user_email", user.email);
        localStorage.setItem("kopawee_user_name", user.name);
        localStorage.setItem("kopawee_active_role", user.activeRole || "serving");

        const dest = redirectUrl ? getRouteForRole(redirectUrl, user.activeRole) : "/dashboard";
        router.push(dest);
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      // Synchronize session token and trigger standard NextAuth Google OAuth
      const callbackUrl = mode === "signup"
        ? (redirectUrl ? `/onboarding?redirect=${encodeURIComponent(redirectUrl)}` : "/onboarding")
        : (redirectUrl ? getRouteForRole(redirectUrl, "serving") : "/dashboard");

      localStorage.setItem("kopawee_auth_token", "google_oauth_token_" + Date.now());
      localStorage.setItem("kopawee_user_name", "Google Corper");
      localStorage.setItem("kopawee_active_role", "pcm");

      // Redirect to NextAuth Google Provider endpoint
      window.location.href = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    } catch (err) {
      setErrorMsg("Google authentication failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#eaf5ed] dark:bg-[#0a0f0d] grid grid-cols-1 lg:grid-cols-12 font-sans overflow-x-hidden transition-colors duration-500">
      
      {/* LEFT COLUMN: EDITORIAL VISUAL PANE */}
      <div className="hidden lg:flex lg:col-span-6 min-h-screen p-12 lg:p-16 text-white relative flex-col justify-between overflow-hidden bg-[#121815]">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://res.cloudinary.com/dnu4lxiie/image/upload/v1787322615/loginImage_ouju1n.jpg"
            alt="Login Background"
            fill
            className="object-cover object-center filter grayscale contrast-[1.1]"
            priority={true}
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#121815] via-[#121815]/70 to-transparent" />

        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/20 transition-all flex items-center gap-2 cursor-pointer uppercase tracking-widest font-display"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-emerald-400">
            KOPA&apos;WEE AUTH
          </span>
        </div>

        {/* Center Editorial Copy */}
        <div className="relative z-10 space-y-6 my-auto max-w-lg">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-[0.25em] font-display">
            NYSC COMPANION PLATFORM
          </p>
          <h1 className="text-4xl lg:text-6xl font-medium tracking-tight leading-[1.04] text-white font-display">
            {mode === "signup"
              ? "Start navigating your service year with calm precision."
              : "Welcome back to your active companion."}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {mode === "signup"
              ? "Create your account for instant access to orientation camp guides, clearance tracking, corper housing, and P2P marketplace."
              : "Access your monthly LGA clearance countdown, PPA workplace logbook, and CDS group hub."}
          </p>
        </div>

        {/* Bottom Metadata */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>SUPPORTING 36 STATES + FCT</span>
          <div className="flex items-center gap-2">
            <FiShield className="w-4 h-4 text-emerald-400" />
            <span>ENCRYPTED VAULT</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: SCANDINAVIAN AUTH FORM */}
      <div className="lg:col-span-6 flex flex-col justify-between p-8 sm:p-12 lg:p-16">
        <div className="flex items-center justify-between lg:hidden mb-8">
          <Link href="/" className="font-bold text-xl tracking-widest uppercase font-display text-[#121815] dark:text-white">
            KOPA<span className="text-emerald-600 font-extrabold">'WEE</span>
          </Link>
          <button
            onClick={() => router.push("/")}
            className="p-2 text-slate-700 dark:text-slate-300"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full max-w-md mx-auto my-auto space-y-8">
          {showVerificationNotice ? (
            <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-emerald-600/60 dark:border-emerald-500/50 space-y-5 text-center animate-fadeIn shadow-xl">
              <div className="w-12 h-12 bg-emerald-600/10 border border-emerald-600/30 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <FiMail className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-display text-[#121815] dark:text-white">
                  Check Your Email Inbox! ✉️
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  We sent a secure magic verification link to <strong className="text-[#121815] dark:text-white font-mono">{email}</strong>. Click the link in your email to verify your address and proceed to onboarding.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-300/60 dark:border-slate-800 space-y-3">
                <p className="text-[11px] text-slate-500 font-mono">
                  ✨ Demo Email Preview Trigger:
                </p>
                <Link
                  href={verificationUrl}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 block shadow-md"
                >
                  <span>Simulate Email Link Click ➔</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setShowVerificationNotice(false)}
                  className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white uppercase tracking-wider"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Mode Switcher */}
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-medium text-[#121815] dark:text-white font-display tracking-tight">
                  {mode === "signup" ? "Create Account" : "Sign In"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {mode === "signup"
                    ? "Already registered with KopaWee?"
                    : "Need a new corper companion account?"}{" "}
                  <button
                    type="button"
                    onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                    className="font-bold text-emerald-700 dark:text-emerald-400 underline hover:text-emerald-800 transition-colors uppercase tracking-wider text-xs ml-1 cursor-pointer"
                  >
                    {mode === "signup" ? "Sign In Here" : "Sign Up Free"}
                  </button>
                </p>
              </div>

          {/* Social Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full py-3.5 px-4 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white font-semibold text-xs uppercase tracking-wider hover:border-emerald-600 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-300/60 dark:border-slate-800 w-full" />
            <span className="bg-[#eaf5ed] dark:bg-[#0a0f0d] px-3 text-[10px] uppercase font-bold text-slate-500 tracking-widest absolute">
              OR EMAIL
            </span>
          </div>

          {/* Direct Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs font-semibold">
                {errorMsg}
              </div>
            )}
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-display">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Grace Okafor"
                    className="w-full pl-10 pr-4 py-3 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-display">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="corper@kopawee.ng"
                  className="w-full pl-10 pr-4 py-3 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-display">
                Password
              </label>
              <div className="relative">
                <FiLock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>
            </div>

            {(() => {
              const isAuthValid = mode === "signup"
                ? Boolean(fullName.trim() && email.trim() && password.trim())
                : Boolean(email.trim() && password.trim());

              return (
                <button
                  type="submit"
                  disabled={!isAuthValid || loading}
                  className={`w-full py-4 text-white font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 font-display ${
                    isAuthValid && !loading
                      ? "bg-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-md shadow-emerald-900/20"
                      : "bg-emerald-600/50 opacity-50 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{mode === "signup" ? "CREATING ACCOUNT..." : "AUTHENTICATING..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === "signup" ? "CREATE FREE ACCOUNT" : "SIGN IN TO DASHBOARD"}</span>
                      <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              );
            })()}
          </form>
            </>
          )}
        </div>

        <div className="text-center text-xs text-slate-500 pt-8 border-t border-slate-300/50 dark:border-slate-800 font-mono">
          BY CONTINUING, YOU AGREE TO KOPA&apos;WEE TERMS & PRIVACY POLICY.
        </div>
      </div>

    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#eaf5ed] dark:bg-[#0a0f0d] flex items-center justify-center font-mono text-xs">Loading Auth...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
