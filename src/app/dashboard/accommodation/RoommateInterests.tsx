"use client";

import { useCallback, useEffect, useState } from "react";
import { FiCheck, FiX, FiPhone, FiMail, FiMessageCircle } from "react-icons/fi";
import { telLink, whatsAppLink } from "@/shared/utils/phoneLinks";

type InterestStatus = "PENDING" | "ACCEPTED" | "DECLINED";

interface Person {
  id?: string;
  name: string;
  ppaName?: string | null;
  lga?: string | null;
  phone?: string | null;
  email?: string;
}

interface IncomingInterest {
  id: string;
  status: InterestStatus;
  message: string | null;
  interestedUser: Person;
}

interface MyInterest {
  id: string;
  status: InterestStatus;
  request: { id: string; state: string; lga: string; budget: string; accommodationType: string; status: string; user: Person };
}

const STATUS_LABEL: Record<InterestStatus, string> = { PENDING: "Waiting for reply", ACCEPTED: "Matched", DECLINED: "Not matched" };
const STATUS_CLASS: Record<InterestStatus, string> = {
  PENDING: "bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-400",
  ACCEPTED: "bg-emerald-600/10 border-emerald-600/40 text-emerald-700 dark:text-emerald-400",
  DECLINED: "bg-slate-500/10 border-slate-500/30 text-slate-600 dark:text-slate-400",
};

export function StatusBadge({ status }: { status: InterestStatus }) {
  return (
    <span className={`px-2 py-0.5 border text-[10px] font-mono font-bold uppercase ${STATUS_CLASS[status]}`}>{STATUS_LABEL[status]}</span>
  );
}

/** Phone/email links; the API only sends them after the owner accepts. */
export function ContactLinks({ person, context }: { person: Person; context: string }) {
  const wa = whatsAppLink(person.phone, `Hi ${person.name}, we matched as roommates on KopaWee (${context}).`);
  const tel = telLink(person.phone);
  if (!wa && !person.email) return <p className="text-[11px] text-slate-500">No contact details on file yet.</p>;
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      {wa && (
        <a href={wa} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5">
          <FiMessageCircle className="w-3.5 h-3.5" /> WhatsApp
        </a>
      )}
      {tel && (
        <a href={tel} className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
          <FiPhone className="w-3.5 h-3.5" /> {person.phone}
        </a>
      )}
      {person.email && (
        <a href={`mailto:${person.email}`} className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
          <FiMail className="w-3.5 h-3.5" /> {person.email}
        </a>
      )}
    </div>
  );
}

/** Interests other corpers sent on the user's own request, with accept/decline. */
export function IncomingInterests({ interests, context, onChanged }: { interests: IncomingInterest[]; context: string; onChanged: () => void }) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const respond = async (interestId: string, action: "ACCEPT" | "DECLINE") => {
    setBusyId(interestId);
    setError("");
    try {
      const res = await fetch("/api/roommates/interest", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interestId, action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) setError(data.error || "That didn't work. Please try again.");
      else onChanged();
    } catch {
      setError("Network error. Nothing was changed.");
    } finally {
      setBusyId(null);
    }
  };

  if (interests.length === 0) {
    return <p className="text-xs text-slate-500">No one has expressed interest yet.</p>;
  }

  return (
    <div className="space-y-2">
      {error && <p role="alert" className="text-xs font-semibold text-red-700 dark:text-red-400">{error}</p>}
      {interests.map((i) => (
        <div key={i.id} className="p-3 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-bold text-[#121815] dark:text-white font-display">{i.interestedUser.name}</div>
              <div className="text-slate-500">{[i.interestedUser.ppaName, i.interestedUser.lga].filter(Boolean).join(" · ")}</div>
            </div>
            <StatusBadge status={i.status} />
          </div>
          {i.message && <p className="text-slate-700 dark:text-slate-300">&ldquo;{i.message}&rdquo;</p>}
          {i.status === "PENDING" && (
            <div className="flex gap-2">
              <button
                type="button"
                disabled={busyId !== null}
                onClick={() => respond(i.id, "ACCEPT")}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <FiCheck className="w-3.5 h-3.5" /> Accept
              </button>
              <button
                type="button"
                disabled={busyId !== null}
                onClick={() => respond(i.id, "DECLINE")}
                className="px-3 py-1.5 border border-slate-400 dark:border-slate-700 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <FiX className="w-3.5 h-3.5" /> Decline
              </button>
            </div>
          )}
          {i.status === "ACCEPTED" && <ContactLinks person={i.interestedUser} context={context} />}
        </div>
      ))}
    </div>
  );
}

/** Button on a browse card: sends interest once, then shows its status. */
export function ExpressInterestButton({ requestId, status, onChanged }: { requestId: string; status: InterestStatus | null; onChanged: () => void }) {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  if (status) {
    return (
      <div className="flex items-center justify-between gap-2 text-xs">
        <StatusBadge status={status} />
        {status === "ACCEPTED" && <span className="text-slate-500">Contact details are under &ldquo;My interests&rdquo;.</span>}
      </div>
    );
  }

  const send = async () => {
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/roommates/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) setError(data.error || "Your interest was not sent.");
      else onChanged();
    } catch {
      setError("Network error: your interest was not sent.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={send}
        disabled={sending}
        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
      >
        {sending ? "Sending..." : "I'm interested ➔"}
      </button>
      <p className="text-[10px] text-slate-500">They see your name and PPA. Phone numbers are shared only if they accept.</p>
      {error && <p role="alert" className="text-xs font-semibold text-red-700 dark:text-red-400">{error}</p>}
    </div>
  );
}

/** Requests the user has expressed interest in, with the owner's contact once accepted. */
export function MyInterests({ refreshKey }: { refreshKey: number }) {
  const [items, setItems] = useState<MyInterest[] | null>(null);

  const load = useCallback(() => {
    fetch("/api/roommates/interest?mine=true")
      .then((res) => res.json())
      .then((data) => setItems(data.success && Array.isArray(data.data) ? data.data : []))
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  if (!items || items.length === 0) return null;

  return (
    <div className="p-4 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-3">
      <h4 className="font-bold text-xs tracking-wider uppercase text-[#121815] dark:text-white font-display">My interests</h4>
      {items.map((i) => (
        <div key={i.id} className="p-3 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-bold text-[#121815] dark:text-white font-display">{i.request.user.name}</div>
              <div className="text-slate-500">
                {i.request.lga}, {i.request.state} · {i.request.accommodationType} · {i.request.budget}
              </div>
            </div>
            <StatusBadge status={i.status} />
          </div>
          {i.status === "ACCEPTED" && <ContactLinks person={i.request.user} context={`${i.request.lga}, ${i.request.state}`} />}
        </div>
      ))}
    </div>
  );
}
