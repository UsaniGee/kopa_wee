"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { FiArrowRight, FiArrowLeft, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { deriveRole, getRouteForRole } from "@/shared/utils/authNav";

type NyscStatus = "PCM" | "SERVING" | "ALUMNI";
type StateOption = { id: string; name: string; code: string; lgas: string[] };

const FIELDS_OF_STUDY = [
  "Computer Science / Software Engineering",
  "Law / Legal Studies",
  "Medicine / Nursing / Public Health",
  "Accounting / Banking & Finance",
  "Electrical / Civil / Mechanical Engineering",
  "Education / Teaching",
  "Mass Communication / Journalism",
  "Biochemistry / Microbiology",
  "Economics / Political Science",
  "Architecture / Fine Arts",
];

const STATUS_OPTIONS: { id: NyscStatus; label: string; desc: string }[] = [
  { id: "PCM", label: "Prospective Corps Member (PCM)", desc: "Awaiting call-up letter, registration, or camp orientation." },
  { id: "SERVING", label: "Serving Corps Member", desc: "Active service year — daily PPA, LGA biometrics, and CDS." },
  { id: "ALUMNI", label: "Ex-Corps Member (POP Alumni)", desc: "Completed service — sell household gear, jobs, and networking." },
];

const ROLE_FOR_STATUS: Record<NyscStatus, "pcm" | "serving" | "alumni"> = { PCM: "pcm", SERVING: "serving", ALUMNI: "alumni" };

const thisYear = new Date().getFullYear();
const BATCH_OPTIONS = [thisYear - 1, thisYear, thisYear + 1].flatMap((y) => ["A", "B", "C"].map((b) => `${y} Batch ${b}`));
const STREAM_OPTIONS = ["Stream I", "Stream II"];

// Mirrors the server checks in /api/users/me so mistakes show before saving
const isNigerianPhone = (v: string) => {
  const digits = v.replace(/[\s-]/g, "");
  const normalised = digits.startsWith("0") ? `+234${digits.slice(1)}` : digits.startsWith("234") ? `+${digits}` : digits;
  return /^\+234[789][01]\d{8}$/.test(normalised);
};
const isStateCode = (v: string) => /^[A-Z]{2}\/\d{2}[A-C]\/\d{4,5}$/.test(v.trim().toUpperCase());

const inputClass =
  "w-full px-4 py-3 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white text-xs focus:outline-none focus:border-emerald-600 disabled:opacity-50";
const labelClass = "text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-display";
const hintClass = "text-[10px] text-slate-500";
const fieldErrorClass = "text-[10px] font-semibold text-red-600 dark:text-red-400";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  // ?check=1 (after Google sign-in): forward complete profiles instead of showing the form
  const [checking, setChecking] = useState(searchParams.get("check") === "1");
  const { update } = useSession();

  const [step, setStep] = useState(1);
  const [states, setStates] = useState<StateOption[]>([]);
  const [statesError, setStatesError] = useState("");
  const [fieldOfStudyOptions, setFieldOfStudyOptions] = useState<string[]>(FIELDS_OF_STUDY);
  const [customFieldOfStudy, setCustomFieldOfStudy] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    nyscStatus: "" as NyscStatus | "",
    institution: "",
    fieldOfStudy: "",
    batch: "",
    stream: "",
    deployedState: "",
    lga: "",
    stateCode: "",
    ppaName: "",
  });
  const set = (patch: Partial<typeof formData>) => setFormData((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    fetch("/api/states")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) setStates(data.data);
        else setStatesError(data.error || "Location data is not available right now.");
      })
      .catch(() => setStatesError("Could not load states. Check your connection and refresh."));

    fetch("/api/options?category=field_of_study")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) setFieldOfStudyOptions(data.data);
      })
      .catch(() => {});

    // Pre-fill from the saved profile, so returning users see what they already entered
    fetch("/api/users/me")
      .then((res) => res.json())
      .then(({ success, data: u }) => {
        if (!success || !u) return setChecking(false);
        if (checking && u.onboardingComplete) {
          router.replace(redirectUrl ? getRouteForRole(redirectUrl, deriveRole(u.nyscStatus, u.role)) : "/dashboard");
          return;
        }
        setChecking(false);
        setFormData((prev) => ({
          ...prev,
          fullName: prev.fullName || u.name || "",
          phone: prev.phone || u.phone || "",
          // A status other than the PCM default was set before (it can't be self-changed here again)
          nyscStatus: prev.nyscStatus || (u.onboardingComplete || u.nyscStatus !== "PCM" ? u.nyscStatus : ""),
          institution: prev.institution || u.journey?.institution || "",
          fieldOfStudy: prev.fieldOfStudy || u.journey?.courseOfStudy || "",
          batch: prev.batch || u.journey?.batch || "",
          stream: prev.stream || u.journey?.stream || "",
          deployedState: prev.deployedState || u.deployedState || "",
          lga: prev.lga || u.lga || "",
          stateCode: prev.stateCode || u.stateCode || "",
          ppaName: prev.ppaName || u.ppaName || "",
        }));
        if (u.journey?.courseOfStudy) {
          setFieldOfStudyOptions((opts) => (opts.includes(u.journey.courseOfStudy) ? opts : [...opts, u.journey.courseOfStudy]));
        }
      })
      .catch(() => setChecking(false));
    // Runs once on mount; `checking` is read at that moment only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lgaOptions = states.find((s) => s.name === formData.deployedState)?.lgas ?? [];
  const deploymentRequired = formData.nyscStatus === "SERVING";
  const phoneInvalid = formData.phone.trim() !== "" && !isNigerianPhone(formData.phone);
  const stateCodeInvalid = formData.stateCode.trim() !== "" && !isStateCode(formData.stateCode);

  const isStepValid = (() => {
    if (step === 1) return Boolean(formData.fullName.trim().length >= 2 && formData.phone.trim() && !phoneInvalid);
    if (step === 2) return Boolean(formData.nyscStatus);
    if (step === 3) {
      const fieldValid = formData.fieldOfStudy === "other" ? Boolean(customFieldOfStudy.trim()) : Boolean(formData.fieldOfStudy);
      return Boolean(formData.institution.trim() && fieldValid);
    }
    if (step === 4) {
      if (stateCodeInvalid) return false;
      if (formData.deployedState && !formData.lga) return false;
      return deploymentRequired ? Boolean(formData.deployedState && formData.lga) : true;
    }
    return true;
  })();

  const handleNext = () => {
    if (!isStepValid || submitting) return;
    if (step < 4) setStep((s) => s + 1);
    else finishOnboarding();
  };

  const finishOnboarding = async () => {
    if (!formData.nyscStatus) return;
    setSubmitting(true);
    setSaveError("");

    let courseOfStudy = formData.fieldOfStudy;
    if (formData.fieldOfStudy === "other") {
      courseOfStudy = customFieldOfStudy.trim();
      // Adds the course to the shared picker; the profile save below does not depend on it
      await fetch("/api/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: "field_of_study", value: courseOfStudy }),
      }).catch(() => {});
    }

    // Blank optional fields are left out rather than sent, so nothing is saved for them
    const optional = (v: string) => v.trim() || undefined;

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName.trim(),
          phone: formData.phone.trim(),
          nyscStatus: formData.nyscStatus,
          institution: formData.institution.trim(),
          courseOfStudy,
          batch: optional(formData.batch),
          stream: optional(formData.stream),
          deployedState: optional(formData.deployedState),
          lga: optional(formData.lga),
          stateCode: optional(formData.stateCode),
          ppaName: optional(formData.ppaName),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setSaveError(data.message || data.error || "Could not save your profile. Please try again.");
        setSubmitting(false);
        return;
      }

      // Re-reads status and role from the database into the session
      await update();

      const role = ROLE_FOR_STATUS[data.data.nyscStatus as NyscStatus] ?? "pcm";

      router.push(redirectUrl ? getRouteForRole(redirectUrl, role) : "/dashboard");
    } catch {
      setSaveError("Network error. Your profile was not saved. Please try again.");
      setSubmitting(false);
    }
  };

  if (checking) {
    return <div className="min-h-screen bg-[#eaf5ed] dark:bg-[#0a0f0d] flex items-center justify-center font-mono text-xs">Checking your profile...</div>;
  }

  return (
    <div className="min-h-screen bg-[#eaf5ed] dark:bg-[#0a0f0d] text-[#121815] dark:text-white flex flex-col font-sans transition-colors duration-500">

      {/* Top Bar */}
      <header className="bg-[#121815] text-white py-4 border-b border-slate-800">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-widest uppercase font-display text-white">
            KOPA<span className="text-emerald-500 font-extrabold">&apos;WEE</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span>SETUP STEP 0{step} / 04</span>
          </div>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col justify-center">

        {/* Progress Stepper */}
        <div className="mb-8 flex items-center justify-between border-b border-slate-300/60 dark:border-slate-800 pb-4">
          {[
            { s: 1, label: "Identity" },
            { s: 2, label: "NYSC Status" },
            { s: 3, label: "Academic" },
            { s: 4, label: "Deployment" },
          ].map((item) => (
            <div key={item.s} className="flex items-center gap-2">
              <span className={`w-6 h-6 flex items-center justify-center font-mono text-xs font-bold ${
                step === item.s
                  ? "bg-emerald-600 text-white"
                  : step > item.s
                    ? "bg-slate-800 text-emerald-400"
                    : "bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}>
                {item.s}
              </span>
              <span className={`text-xs font-bold font-display uppercase tracking-wider hidden sm:inline ${
                step === item.s ? "text-[#121815] dark:text-white" : "text-slate-500"
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Wizard Form Panel */}
        <div className="p-6 sm:p-12 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-8">

          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                  STEP 01 OF 04
                </span>
                <h2 className="text-2xl sm:text-3xl font-medium text-[#121815] dark:text-white font-display">
                  Welcome to KopaWee
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Confirm your name and add a phone number other corpers can reach you on.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className={labelClass}>Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter full name..."
                    value={formData.fullName}
                    onChange={(e) => set({ fullName: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className={labelClass}>Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="0803 123 4567"
                    value={formData.phone}
                    onChange={(e) => set({ phone: e.target.value })}
                    aria-invalid={phoneInvalid}
                    className={inputClass}
                  />
                  {phoneInvalid ? (
                    <p className={fieldErrorClass}>Enter a Nigerian mobile number, e.g. 0803 123 4567 or +234 803 123 4567.</p>
                  ) : (
                    <p className={hintClass}>Shown only to signed-in users when you list an item or lodge.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: STATUS */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                  STEP 02 OF 04
                </span>
                <h2 className="text-2xl sm:text-3xl font-medium text-[#121815] dark:text-white font-display">
                  What is your current NYSC status?
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  This decides which tools you see. Later changes go through your dashboard.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-2" role="radiogroup" aria-label="NYSC status">
                {STATUS_OPTIONS.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    role="radio"
                    aria-checked={formData.nyscStatus === st.id}
                    onClick={() => set({ nyscStatus: st.id })}
                    className={`p-5 border text-left cursor-pointer transition-all ${
                      formData.nyscStatus === st.id
                        ? "bg-[#eaf5ed] dark:bg-[#0a0f0d] border-emerald-600 dark:border-emerald-500 shadow-sm"
                        : "bg-[#eaf5ed]/50 dark:bg-[#0a0f0d]/50 border-slate-300/40 dark:border-slate-800 hover:border-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-[#121815] dark:text-white font-display">{st.label}</span>
                      {formData.nyscStatus === st.id && <FiCheckCircle className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{st.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: ACADEMIC */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                  STEP 03 OF 04
                </span>
                <h2 className="text-2xl sm:text-3xl font-medium text-[#121815] dark:text-white font-display">
                  Academic Profile
                </h2>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label htmlFor="institution" className={labelClass}>Institution / University</label>
                  <input
                    id="institution"
                    type="text"
                    placeholder="e.g. University of Nigeria, Nsukka"
                    value={formData.institution}
                    onChange={(e) => set({ institution: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="fieldOfStudy" className={labelClass}>Field of Study</label>
                  <select
                    id="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={(e) => set({ fieldOfStudy: e.target.value })}
                    className={inputClass}
                  >
                    <option value="" disabled>Select Field of Study...</option>
                    {fieldOfStudyOptions.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                    <option value="other">Other (Specify)</option>
                  </select>

                  {formData.fieldOfStudy === "other" && (
                    <div className="pt-2 space-y-1">
                      <label htmlFor="customField" className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest font-mono">
                        Specify Custom Field of Study
                      </label>
                      <input
                        id="customField"
                        type="text"
                        maxLength={80}
                        placeholder="e.g. Cyber Security & Digital Forensics"
                        value={customFieldOfStudy}
                        onChange={(e) => setCustomFieldOfStudy(e.target.value)}
                        className={inputClass}
                      />
                      <p className={hintClass}>It will also be added to this list for other corpers.</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="batch" className={labelClass}>Batch <span className="normal-case font-normal text-slate-500">(optional)</span></label>
                    <select id="batch" value={formData.batch} onChange={(e) => set({ batch: e.target.value })} className={inputClass}>
                      <option value="">Not sure yet</option>
                      {[...new Set([...BATCH_OPTIONS, ...(formData.batch ? [formData.batch] : [])])].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="stream" className={labelClass}>Stream <span className="normal-case font-normal text-slate-500">(optional)</span></label>
                    <select id="stream" value={formData.stream} onChange={(e) => set({ stream: e.target.value })} className={inputClass}>
                      <option value="">Not sure yet</option>
                      {[...new Set([...STREAM_OPTIONS, ...(formData.stream ? [formData.stream] : [])])].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DEPLOYMENT */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                  STEP 04 OF 04
                </span>
                <h2 className="text-2xl sm:text-3xl font-medium text-[#121815] dark:text-white font-display">
                  {deploymentRequired ? "Where are you serving?" : "Deployment (if known)"}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {deploymentRequired
                    ? "Your state and LGA decide which listings, roommates and alerts you see."
                    : "Skip anything you don't know yet. You can add it later in Settings."}
                </p>
              </div>

              {statesError && (
                <p role="alert" className="flex items-start gap-2 p-3 border border-red-300 dark:border-red-900 text-xs text-red-700 dark:text-red-400">
                  <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{statesError}</span>
                </p>
              )}

              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="deployedState" className={labelClass}>
                      State of Deployment {!deploymentRequired && <span className="normal-case font-normal text-slate-500">(optional)</span>}
                    </label>
                    <select
                      id="deployedState"
                      value={formData.deployedState}
                      onChange={(e) => set({ deployedState: e.target.value, lga: "" })}
                      disabled={states.length === 0}
                      className={inputClass}
                    >
                      <option value="">{states.length === 0 ? "Loading states..." : "Select state..."}</option>
                      {states.map((s) => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="lga" className={labelClass}>
                      LGA {!deploymentRequired && <span className="normal-case font-normal text-slate-500">(optional)</span>}
                    </label>
                    <select
                      id="lga"
                      value={formData.lga}
                      onChange={(e) => set({ lga: e.target.value })}
                      disabled={!formData.deployedState}
                      className={inputClass}
                    >
                      <option value="">{formData.deployedState ? "Select LGA..." : "Choose a state first"}</option>
                      {lgaOptions.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {formData.nyscStatus !== "PCM" && (
                  <>
                    <div className="space-y-1.5">
                      <label htmlFor="stateCode" className={labelClass}>
                        State Code <span className="normal-case font-normal text-slate-500">(optional)</span>
                      </label>
                      <input
                        id="stateCode"
                        type="text"
                        autoCapitalize="characters"
                        placeholder="LA/26A/1234"
                        value={formData.stateCode}
                        onChange={(e) => set({ stateCode: e.target.value.toUpperCase() })}
                        aria-invalid={stateCodeInvalid}
                        className={`${inputClass} font-mono`}
                      />
                      {stateCodeInvalid ? (
                        <p className={fieldErrorClass}>Use the format on your ID card: state / year + batch / number, e.g. LA/26A/1234.</p>
                      ) : (
                        <p className={hintClass}>Issued at camp. Format: LA/26A/1234.</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="ppaName" className={labelClass}>
                        Place of Primary Assignment (PPA) <span className="normal-case font-normal text-slate-500">(optional)</span>
                      </label>
                      <input
                        id="ppaName"
                        type="text"
                        maxLength={120}
                        placeholder="e.g. Government Secondary School, Ikeja"
                        value={formData.ppaName}
                        onChange={(e) => set({ ppaName: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {saveError && (
            <p role="alert" className="flex items-start gap-2 p-3 border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-400">
              <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{saveError}</span>
            </p>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3 pt-6 border-t border-slate-300/60 dark:border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                disabled={submitting}
                className="px-5 py-3 border border-slate-300 dark:border-slate-800 text-xs font-bold uppercase tracking-wider hover:border-slate-500 transition-colors flex items-center gap-1.5 cursor-pointer font-display"
              >
                <FiArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid || submitting}
              className={`px-6 sm:px-8 py-3.5 text-white text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 font-display ${
                isStepValid && !submitting
                  ? "bg-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-md shadow-emerald-900/20"
                  : "bg-emerald-600/50 opacity-50 cursor-not-allowed"
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>SAVING PROFILE...</span>
                </>
              ) : (
                <>
                  <span>{step === 4 ? "Save & Open Dashboard" : "Continue"}</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>
      </main>

    </div>
  );
}

export default function ProgressiveOnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#eaf5ed] dark:bg-[#0a0f0d] flex items-center justify-center font-mono text-xs">Loading Onboarding...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
