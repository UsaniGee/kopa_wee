"use client";

import { useEffect, useState } from "react";
import { FiLock } from "react-icons/fi";

interface Subscription {
  status: string;
  startsAt: string;
  endsAt: string | null;
  plan: { name: string; description: string; price: number; isEarlyAccess: boolean };
}

/** The user's real subscription from GET /api/subscription. */
export default function SubscriptionSection() {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/subscription")
      .then((res) => res.json())
      .then((data) => (data.success && data.data?.subscription ? setSub(data.data.subscription) : setError("Subscription details are not available.")))
      .catch(() => setError("Could not load your subscription."));
  }, []);

  const since = sub ? new Date(sub.startsAt).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" }) : "";

  return (
    <div className="space-y-5 pt-4 border-t border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2">
        <FiLock className="w-4 h-4 text-emerald-600" />
        <h2 className="text-sm font-bold text-[#121815] dark:text-white uppercase tracking-widest font-display">Subscription</h2>
      </div>

      {error && <p className="text-xs text-slate-500">{error}</p>}
      {!sub && !error && <p className="text-xs text-slate-500">Loading...</p>}
      {sub && (
        <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 border border-emerald-300 dark:border-emerald-700">
                {sub.plan.name}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-emerald-600 px-2 py-0.5">{sub.status}</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">{sub.plan.description}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              Since {since}
              {sub.endsAt ? ` · ends ${new Date(sub.endsAt).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}` : ""}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 font-display">
              {sub.plan.price === 0 ? "Free" : `₦${sub.plan.price.toLocaleString()}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
