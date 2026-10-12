"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FiMapPin, FiSave, FiLoader, FiCheck } from "react-icons/fi";

type StateOption = { id: string; name: string; lgas: string[] };

const FIELDS = ["phone", "stateOfOrigin", "deployedState", "lga", "ppaName", "stateCode", "callUpNo"] as const;
type Profile = Record<(typeof FIELDS)[number], string>;
const EMPTY: Profile = { phone: "", stateOfOrigin: "", deployedState: "", lga: "", ppaName: "", stateCode: "", callUpNo: "" };

const inputClass =
  "w-full px-4 py-3 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white text-xs focus:outline-none focus:border-emerald-600 disabled:opacity-50";
const labelClass = "text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-display";

/** Profile and deployment details, saved through PATCH /api/users/me (same checks as onboarding). */
export default function ProfileSection() {
  const { update } = useSession();
  const [profile, setProfile] = useState<Profile>(EMPTY);
  // What the server has; only fields that differ are sent, and nothing is sent if loading failed
  const [serverProfile, setSavedProfile] = useState<Profile | null>(null);
  const [states, setStates] = useState<StateOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetch("/api/users/me").then((r) => r.json()), fetch("/api/states").then((r) => r.json())])
      .then(([me, st]) => {
        if (me.success) {
          const loaded = Object.fromEntries(FIELDS.map((f) => [f, me.data[f] ?? ""])) as Profile;
          setProfile(loaded);
          setSavedProfile(loaded);
        } else {
          setError(me.error || "Could not load your profile. Refresh to try again.");
        }
        if (st.success && Array.isArray(st.data)) setStates(st.data);
        else setError(st.error || "Location data is not available right now.");
      })
      .catch(() => setError("Could not load your profile. Refresh to try again."))
      .finally(() => setLoading(false));
  }, []);

  const set = (patch: Partial<Profile>) => {
    setSaved(false);
    setProfile((p) => ({ ...p, ...patch }));
  };
  const lgaOptions = states.find((s) => s.name === profile.deployedState)?.lgas ?? [];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverProfile) return;
    const changes = Object.fromEntries(FIELDS.filter((f) => profile[f] !== serverProfile[f]).map((f) => [f, profile[f]]));
    if (Object.keys(changes).length === 0) {
      setSaved(true);
      return;
    }
    if (profile.deployedState && !profile.lga) {
      setError("Choose your LGA, or clear the deployment state.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      // Empty strings clear a field on the server
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(data.message || data.error || "Your changes were not saved.");
        return;
      }
      const updated = Object.fromEntries(FIELDS.map((f) => [f, data.data[f] ?? ""])) as Profile;
      setProfile(updated);
      setSavedProfile(updated);
      setSaved(true);
      await update();
    } catch {
      setError("Network error: your changes were not saved.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <FiLoader className="w-4 h-4 animate-spin" /> Loading profile...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
        <FiMapPin className="w-4 h-4 text-emerald-600" />
        <h2 className="text-sm font-bold text-[#121815] dark:text-white uppercase tracking-widest font-display">Profile &amp; Deployment</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="s-phone" className={labelClass}>Phone</label>
          <input id="s-phone" type="tel" autoComplete="tel" placeholder="0803 123 4567" value={profile.phone} onChange={(e) => set({ phone: e.target.value })} className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="s-origin" className={labelClass}>State of Origin</label>
          <select id="s-origin" value={profile.stateOfOrigin} onChange={(e) => set({ stateOfOrigin: e.target.value })} className={inputClass}>
            <option value="">Not set</option>
            {states.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="s-deployed" className={labelClass}>Deployed State</label>
          <select id="s-deployed" value={profile.deployedState} onChange={(e) => set({ deployedState: e.target.value, lga: "" })} className={inputClass}>
            <option value="">Not set</option>
            {states.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="s-lga" className={labelClass}>LGA</label>
          <select id="s-lga" value={profile.lga} onChange={(e) => set({ lga: e.target.value })} disabled={!profile.deployedState} className={inputClass}>
            <option value="">{profile.deployedState ? "Select LGA..." : "Choose a state first"}</option>
            {lgaOptions.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="s-ppa" className={labelClass}>Place of Primary Assignment (PPA)</label>
          <input id="s-ppa" type="text" maxLength={120} value={profile.ppaName} onChange={(e) => set({ ppaName: e.target.value })} className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="s-statecode" className={labelClass}>State Code</label>
          <input id="s-statecode" type="text" placeholder="LA/26A/1234" value={profile.stateCode} onChange={(e) => set({ stateCode: e.target.value.toUpperCase() })} className={`${inputClass} font-mono`} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="s-callup" className={labelClass}>Call-up Number</label>
          <input id="s-callup" type="text" placeholder="NYSC/UNN/2026/123456" value={profile.callUpNo} onChange={(e) => set({ callUpNo: e.target.value.toUpperCase() })} className={`${inputClass} font-mono`} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving || !serverProfile}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
          <span>{saving ? "Saving..." : "Save profile"}</span>
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <FiCheck className="w-4 h-4" /> Saved
          </span>
        )}
      </div>
      {error && <p role="alert" className="text-xs font-semibold text-red-600 dark:text-red-400">{error}</p>}
    </form>
  );
}
