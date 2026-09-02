"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiCheckCircle, FiAlertTriangle, FiArrowRight, FiShield } from "react-icons/fi";

const CheckCircle2 = FiCheckCircle;
const AlertTriangle = FiAlertTriangle;
const ArrowRight = FiArrowRight;
const Shield = FiShield;

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token && !email) {
      setVerifying(false);
      setErrorMsg("Missing verification parameters.");
      return;
    }

    const query = token ? `token=${encodeURIComponent(token)}` : `email=${encodeURIComponent(email || "")}`;

    fetch(`/api/auth/verify?${query}`)
      .then((res) => res.json())
      .then((data) => {
        setVerifying(false);
        if (data.success) {
          setSuccess(true);
          if (data.data?.id) {
            localStorage.setItem("kopawee_user_id", data.data.id);
            localStorage.setItem("kopawee_user_email", data.data.email);
            localStorage.setItem("kopawee_user_name", data.data.name);
          }
        } else {
          setErrorMsg(data.error || "Verification failed");
        }
      })
      .catch(() => {
        setVerifying(false);
        setErrorMsg("Network error verifying email link");
      });
  }, [token, email]);

  return (
    <div className="min-h-screen bg-[#eaf5ed] dark:bg-[#0a0f0d] flex items-center justify-center p-6 text-[#121815] dark:text-white font-sans">
      <div className="max-w-md w-full bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 p-8 space-y-6 text-center animate-fadeIn shadow-2xl">
        <div className="flex justify-center">
          <Link href="/" className="font-bold text-2xl tracking-widest uppercase font-display text-slate-900 dark:text-white">
            KOPA<span className="text-emerald-600 font-extrabold">'WEE</span>
          </Link>
        </div>

        {verifying ? (
          <div className="space-y-4 py-6">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-lg font-bold font-display uppercase tracking-wider">Verifying Email Link...</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Authenticating secure email link and activating your profile...</p>
          </div>
        ) : success ? (
          <div className="space-y-5 py-4">
            <div className="w-14 h-14 bg-emerald-600/10 border border-emerald-600/30 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-display text-emerald-700 dark:text-emerald-400">
                Email Verified Successfully! 🎉
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Your email <strong className="text-[#121815] dark:text-white font-mono">{email}</strong> has been confirmed. You are ready to complete onboarding!
              </p>
            </div>

            <button
              onClick={() => router.push("/onboarding")}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Proceed to Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-5 py-4">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto text-red-600">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-display text-red-600">Verification Link Error</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">{errorMsg}</p>
            </div>

            <Link
              href="/auth?mode=signup"
              className="inline-block px-6 py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider"
            >
              Back to Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EmailVerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#eaf5ed] dark:bg-[#0a0f0d] flex items-center justify-center font-mono text-xs">Loading verification...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
