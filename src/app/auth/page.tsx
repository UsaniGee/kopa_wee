"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { FiArrowRight, FiLock, FiMail, FiUser, FiArrowLeft, FiShield, FiCheckCircle } from "react-icons/fi";
import { getRouteForRole } from "@/shared/utils/authNav";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signin" ? "signin" : "signup";
  const redirectUrl = searchParams.get("redirect");
  const justVerified = searchParams.get("verified") === "true";

  const [mode, setMode] = useState<"signup" | "signin" | "forgot">(initialMode);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const [showForgotSuccess, setShowForgotSuccess] = useState(false);
  const [showUnverifiedNotice, setShowUnverifiedNotice] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (mode === "signup") {
        // Register via API — creates DB user + sends verification email
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

        // Store non-sensitive UX state only (no auth token)
        const user = data.data;
        localStorage.setItem("kopawee_user_email", user.email);
        localStorage.setItem("kopawee_user_name", user.name);
        localStorage.setItem("kopawee_active_role", "pcm");

        setShowVerificationNotice(true);
        setLoading(false);
        return;
      } else {
        // Sign in via NextAuth CredentialsProvider — creates real HttpOnly session cookie
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (!result?.ok) {
          // NextAuth v5: specific error is in result.code, result.error is always "CredentialsSignin"
          const errorCode = result?.code ?? result?.error ?? "";
          if (errorCode === "EMAIL_NOT_VERIFIED") {
            // Show resend verification screen instead of inline error
            setUnverifiedEmail(email);
            setShowUnverifiedNotice(true);
            setLoading(false);
            return;
          }
          const errorMap: Record<string, string> = {
            INVALID_CREDENTIALS: "Incorrect email or password. Please try again.",
            EMAIL_AND_PASSWORD_REQUIRED: "Email and password are required.",
            CredentialsSignin: "Incorrect email or password. Please try again.",
          };
          setErrorMsg(errorMap[errorCode] || "Incorrect email or password. Please try again.");
          setLoading(false);
          return;
        }

        // Fetch user profile to set UX state in localStorage (non-security)
        try {
          const profileRes = await fetch("/api/users/me");
          const profileData = await profileRes.json();
          if (profileData.success && profileData.data) {
            const u = profileData.data;
            localStorage.setItem("kopawee_user_email", u.email);
            localStorage.setItem("kopawee_user_name", u.name);
            localStorage.setItem("kopawee_active_role",
              u.nyscStatus?.toLowerCase() === "pcm" ? "pcm"
              : u.nyscStatus?.toLowerCase() === "alumni" ? "alumni"
              : "serving"
            );
          }
        } catch {
          // Non-fatal — UX state defaults will apply
        }

        const dest = redirectUrl ? getRouteForRole(redirectUrl, localStorage.getItem("kopawee_active_role") || "serving") : "/dashboard";
        router.push(dest);
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const [resendErrorMsg, setResendErrorMsg] = useState("");

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendErrorMsg("");
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: unverifiedEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setResendSuccess(true);
        // Start 60-second cooldown
        setResendCooldown(60);
        const timer = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) { clearInterval(timer); return 0; }
            return prev - 1;
          });
        }, 1000);
      } else {
        setResendErrorMsg(data.error || "Failed to resend verification email.");
      }
    } catch {
      setResendErrorMsg("Network error. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };
  const handleGoogleAuth = () => {
    setLoading(true);
    const callbackUrl = mode === "signup"
      ? (redirectUrl ? `/onboarding?redirect=${encodeURIComponent(redirectUrl)}` : "/onboarding")
      : (redirectUrl ? getRouteForRole(redirectUrl, "serving") : "/dashboard");

    // NextAuth handles session creation after OAuth — no localStorage token
    signIn("google", { callbackUrl });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      // Always show success to prevent email enumeration
      setShowForgotSuccess(true);
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
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
            sizes="(max-width: 1024px) 100vw, 50vw"
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
            KOPA<span className="text-emerald-600 font-extrabold">&apos;WEE</span>
          </Link>
          <button onClick={() => router.push("/")} className="p-2 text-slate-700 dark:text-slate-300">
            <FiArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full max-w-md mx-auto my-auto space-y-8">

          {/* ── VERIFICATION NOTICE (post-signup) ── */}
          {showVerificationNotice ? (
            <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-emerald-600/60 dark:border-emerald-500/50 space-y-5 text-center animate-fadeIn shadow-xl">
              <div className="w-12 h-12 bg-emerald-600/10 border border-emerald-600/30 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <FiMail className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-display text-[#121815] dark:text-white">
                  Check Your Email Inbox ✉️
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  We sent a verification link to{" "}
                  <strong className="text-[#121815] dark:text-white font-mono">{email}</strong>.
                  Click the link in your email to verify your address and complete your registration.
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setShowVerificationNotice(false); setMode("signin"); }}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white uppercase tracking-wider"
              >
                Back to Sign In
              </button>
            </div>

          /* ── FORGOT PASSWORD SUCCESS ── */
          ) : showUnverifiedNotice ? (
            <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-amber-400/60 dark:border-amber-500/40 space-y-5 text-center animate-fadeIn">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
                <FiMail className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-display text-[#121815] dark:text-white">
                  Email Not Verified
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your account for <strong className="text-[#121815] dark:text-white font-mono">{unverifiedEmail}</strong> exists but hasn&apos;t been verified yet. Check your inbox for the original link or resend it below.
                </p>
              </div>

              {resendErrorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold">
                  {resendErrorMsg}
                </div>
              )}

              {resendSuccess ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                  ✓ Verification email sent! Check your inbox.
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendLoading || resendCooldown > 0}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider transition-all"
                >
                  {resendLoading ? "Sending..." : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Verification Email"}
                </button>
              )}

              <button
                type="button"
                onClick={() => { setShowUnverifiedNotice(false); setResendSuccess(false); setResendCooldown(0); setResendErrorMsg(""); }}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white uppercase tracking-wider"
              >
                ← Back to Sign In
              </button>
            </div>

          /* ── FORGOT SUCCESS ── */
          ) : showForgotSuccess ? (
            <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-emerald-600/60 space-y-5 text-center">
              <div className="w-12 h-12 bg-emerald-600/10 border border-emerald-600/30 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <FiMail className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-display text-[#121815] dark:text-white">
                  Reset Link Sent
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  If an account exists for <strong className="font-mono">{forgotEmail}</strong>, a password reset link has been sent. Check your inbox.
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setShowForgotSuccess(false); setMode("signin"); }}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white uppercase tracking-wider"
              >
                Back to Sign In
              </button>
            </div>

          /* ── FORGOT PASSWORD FORM ── */
          ) : mode === "forgot" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-medium text-[#121815] dark:text-white font-display tracking-tight">
                  Reset Password
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Enter your email and we&apos;ll send a reset link.
                </p>
              </div>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs font-semibold">
                    {errorMsg}
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
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter your email..."
                      className="w-full pl-10 pr-4 py-3 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-600 transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!forgotEmail.trim() || loading}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>SENDING...</span></>
                  ) : (
                    <><span>SEND RESET LINK</span><FiArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white uppercase tracking-wider"
              >
                ← Back to Sign In
              </button>
            </div>

          /* ── SIGN UP / SIGN IN FORM ── */
          ) : (
            <>
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-medium text-[#121815] dark:text-white font-display tracking-tight">
                  {mode === "signup" ? "Create Account" : "Sign In"}
                </h2>
                {justVerified && mode === "signin" && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mt-2">
                    <FiCheckCircle className="w-4 h-4 shrink-0" />
                    <span>Email verified successfully! You can now sign in.</span>
                  </div>
                )}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {mode === "signup" ? "Already registered?" : "Need an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setErrorMsg(""); }}
                    className="font-bold text-emerald-700 dark:text-emerald-400 underline hover:text-emerald-800 transition-colors uppercase tracking-wider text-xs ml-1 cursor-pointer"
                  >
                    {mode === "signup" ? "Sign In Here" : "Sign Up Free"}
                  </button>
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white font-semibold text-xs uppercase tracking-wider hover:border-emerald-600 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-300/60 dark:border-slate-800 w-full" />
                <span className="bg-[#eaf5ed] dark:bg-[#0a0f0d] px-3 text-[10px] uppercase font-bold text-slate-500 tracking-widest absolute">
                  OR EMAIL
                </span>
              </div>

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
                        placeholder="Enter full name..."
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
                      placeholder="Enter email address..."
                      className="w-full pl-10 pr-4 py-3 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-display">
                      Password
                    </label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => { setMode("forgot"); setErrorMsg(""); }}
                        className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline uppercase tracking-wider"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <FiLock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password..."
                      className="w-full pl-10 pr-4 py-3 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-600 transition-colors"
                    />
                  </div>
                </div>

                {(() => {
                  const isValid = mode === "signup"
                    ? Boolean(fullName.trim() && email.trim() && password.trim())
                    : Boolean(email.trim() && password.trim());
                  return (
                    <button
                      type="submit"
                      disabled={!isValid || loading}
                      className={`w-full py-4 text-white font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 font-display ${
                        isValid && !loading
                          ? "bg-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-md shadow-emerald-900/20"
                          : "bg-emerald-600/50 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      {loading ? (
                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>{mode === "signup" ? "CREATING ACCOUNT..." : "AUTHENTICATING..."}</span></>
                      ) : (
                        <><span>{mode === "signup" ? "CREATE FREE ACCOUNT" : "SIGN IN TO DASHBOARD"}</span><FiArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  );
                })()}
              </form>
            </>
          )}
        </div>

        <div className="text-center text-xs text-slate-500 pt-8 border-t border-slate-300/50 dark:border-slate-800 font-mono">
          BY CONTINUING, YOU AGREE TO KOPA&apos;WEE TERMS &amp; PRIVACY POLICY.
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
