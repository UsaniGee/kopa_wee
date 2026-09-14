"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiCheckCircle, FiAlertTriangle, FiArrowRight, FiShield } from "react-icons/fi";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [alreadyVerified, setAlreadyVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let cancelled = false;

    if (!token) {
      // Batch state update via a microtask to avoid synchronous setState-in-effect
      Promise.resolve().then(() => {
        if (!cancelled) {
          setVerifying(false);
          setErrorMsg("Invalid verification link — token is missing. Please request a new verification email.");
        }
      });
      return () => { cancelled = true; };
    }

    fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setVerifying(false);
        if (data.success) {
          if (data.alreadyVerified) {
            setAlreadyVerified(true);
          } else {
            setSuccess(true);
            // Auto-redirect to sign-in with verified=true after 3 seconds
            let count = 3;
            const timer = setInterval(() => {
              count--;
              setCountdown(count);
              if (count <= 0) {
                clearInterval(timer);
                router.push("/auth?mode=signin&verified=true");
              }
            }, 1000);
          }
        } else {
          setErrorMsg(data.error || "Verification failed.");
        }
      })
      .catch(() => {
        if (cancelled) return;
        setVerifying(false);
        setErrorMsg("Network error. Please try again.");
      });

    return () => { cancelled = true; };
  }, [token, router]);


  return (
    <div className="min-h-screen bg-[#eaf5ed] dark:bg-[#0a0f0d] flex items-center justify-center p-6 text-[#121815] dark:text-white font-sans">
      <div className="max-w-md w-full bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 p-8 space-y-6 text-center shadow-2xl">
        <Link href="/" className="font-bold text-2xl tracking-widest uppercase font-display text-slate-900 dark:text-white block">
          KOPA<span className="text-emerald-600 font-extrabold">&apos;WEE</span>
        </Link>

        {verifying ? (
          <div className="space-y-4 py-6">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-lg font-bold font-display uppercase tracking-wider">Verifying your email...</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Please wait a moment.</p>
          </div>

        ) : success ? (
          <div className="space-y-5 py-4">
            <div className="w-14 h-14 bg-emerald-600/10 border border-emerald-600/30 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <FiCheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-display text-emerald-700 dark:text-emerald-400">
                Email Verified! 🎉
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Your email has been confirmed. You can now sign in to your KopaWee account.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 font-mono">
                Redirecting to sign in in {countdown}s...
              </p>
            </div>
            <button
              onClick={() => router.push("/auth?mode=signin&verified=true")}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In Now</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>

        ) : alreadyVerified ? (
          <div className="space-y-5 py-4">
            <div className="w-14 h-14 bg-emerald-600/10 border border-emerald-600/30 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <FiShield className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-display text-[#121815] dark:text-white">Already Verified</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">Your email is already verified. Sign in to continue.</p>
            </div>
            <button
              onClick={() => router.push("/auth?mode=signin")}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>

        ) : (
          <div className="space-y-5 py-4">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto text-red-600">
              <FiAlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-display text-red-600">Verification Failed</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{errorMsg}</p>
            </div>
            <button
              onClick={() => router.push("/auth?mode=signin")}
              className="w-full py-3 bg-[#121815] dark:bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Back to Sign In</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EmailVerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#eaf5ed] dark:bg-[#0a0f0d] flex items-center justify-center font-mono text-xs text-slate-500">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
