"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRole } from "@/shared/context/RoleContext";
import { FiShield, FiArrowRight, FiArrowLeft, FiCheckCircle, FiPackage, FiBox, FiAward, FiMapPin, FiCompass, FiCheckSquare, FiLock, FiPhone, FiMail, FiBookOpen } from "react-icons/fi";
import { getRouteForRole } from "@/shared/utils/authNav";

const ShieldCheck = FiShield;
const ArrowRight = FiArrowRight;
const ArrowLeft = FiArrowLeft;
const CheckCircle2 = FiCheckCircle;
const Luggage = FiPackage;
const Building2 = FiBox;
const Award = FiAward;
const MapPin = FiMapPin;
const Compass = FiCompass;
const CheckSquare = FiCheckSquare;
const Lock = FiLock;
const Phone = FiPhone;
const Mail = FiMail;
const GraduationCap = FiBookOpen;

// NIGERIAN_STATES fetched dynamically from GET /api/states backend source of truth

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
  "Architecture / Fine Arts"
];

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const { setRole } = useRole();

  const [states, setStates] = useState<{ id: string; name: string; code: string }[]>([]);

  useEffect(() => {
    fetch("/api/states")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setStates(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    displayName: "",
    email: "",
    phone: "",
    nyscStatus: "prospective_corps_member" as "prospective_corps_member" | "serving_corps_member" | "alumni",

    pcmStage: "registered",
    expectedBatch: "Batch A 2026",
    stream: "Stream I",
    institution: "",
    institutionState: "Lagos",
    fieldOfStudy: "",
    knowsDeploymentState: false,
    deploymentState: "",
    hasCallUpLetter: false,
    interests: [] as string[],

    serviceState: "Lagos",
    serviceStage: "orientation_camp",
    orientationCamp: "",
    ppaName: "",
    ppaType: "School",
    ppaLGA: "Ikeja",
    ppaArea: "",
    lookingForAccommodation: true,

    serviceYear: "2026",
    alumniState: "Lagos",
    industry: "Information Technology",
  });

  const [fieldOfStudyOptions, setFieldOfStudyOptions] = useState<string[]>(FIELDS_OF_STUDY);
  const [customFieldOfStudy, setCustomFieldOfStudy] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/options?category=field_of_study")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setFieldOfStudyOptions(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const isStepValid = (() => {
    if (step === 1) {
      return Boolean(formData.fullName.trim() && formData.phone.trim());
    }
    if (step === 2) {
      return Boolean(formData.nyscStatus);
    }
    if (step === 3) {
      const fieldValid = formData.fieldOfStudy === "other"
        ? Boolean(customFieldOfStudy.trim())
        : Boolean(formData.fieldOfStudy.trim());
      return Boolean(formData.institution.trim() && fieldValid);
    }
    if (step === 4) {
      return formData.interests.length > 0;
    }
    return true;
  })();

  const handleNext = () => {
    if (!isStepValid || submitting) return;
    if (step < 4) setStep(s => s + 1);
    else finishOnboarding();
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const finishOnboarding = async () => {
    setSubmitting(true);
    let assignedRole: "pcm" | "serving" | "alumni" = "serving";
    let dbRole: "PCM" | "SERVING_CORPER" | "CDS_EXEC" | "EMPLOYER" | "LGA_INSPECTOR" | "ALUMNI" = "SERVING_CORPER";

    if (formData.nyscStatus === "prospective_corps_member") {
      assignedRole = "pcm";
      dbRole = "PCM";
    } else if (formData.nyscStatus === "serving_corps_member") {
      assignedRole = "serving";
      dbRole = "SERVING_CORPER";
    } else if (formData.nyscStatus === "alumni") {
      assignedRole = "alumni";
      dbRole = "ALUMNI";
    }

    let finalFieldOfStudy = formData.fieldOfStudy;

    // If user chose "other", post the new course to the backend dynamic options table
    if (formData.fieldOfStudy === "other" && customFieldOfStudy.trim()) {
      finalFieldOfStudy = customFieldOfStudy.trim();
      try {
        await fetch("/api/options", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: "field_of_study",
            value: finalFieldOfStudy,
          }),
        });
      } catch (e) {
        console.error("Failed to save custom field of study", e);
      }
    }

    const updatedFormData = {
      ...formData,
      fieldOfStudy: finalFieldOfStudy,
    };

    const userId = localStorage.getItem("kopawee_user_id");

    if (userId) {
      try {
        await fetch("/api/users/role", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            role: dbRole,
            deployedState: updatedFormData.deploymentState || updatedFormData.serviceState,
            lga: updatedFormData.ppaLGA,
            stateCode: "LA/26A/1234",
            ppaName: updatedFormData.ppaName,
          }),
        });
      } catch (err) {
        console.error("Failed to sync onboarding to database", err);
      }
    }

    setRole(assignedRole);
    localStorage.setItem("kopawee_user_profile", JSON.stringify(updatedFormData));
    localStorage.setItem("kopawee_active_role", assignedRole);
    
    const dest = redirectUrl ? getRouteForRole(redirectUrl, assignedRole) : "/dashboard";
    router.push(dest);
  };

  const toggleInterest = (item: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(item)
        ? prev.interests.filter(i => i !== item)
        : [...prev.interests, item]
    }));
  };

  return (
    <div className="min-h-screen bg-[#eaf5ed] dark:bg-[#0a0f0d] text-[#121815] dark:text-white flex flex-col font-sans transition-colors duration-500">
      
      {/* Top Bar */}
      <header className="bg-[#121815] text-white py-4 border-b border-slate-800">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-widest uppercase font-display text-white">
            KOPA<span className="text-emerald-500 font-extrabold">'WEE</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span>SETUP STEP 0{step} / 04</span>
          </div>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10 flex flex-col justify-center">
        
        {/* Progress Stepper */}
        <div className="mb-8 flex items-center justify-between border-b border-slate-300/60 dark:border-slate-800 pb-4">
          {[
            { s: 1, label: "Identity" },
            { s: 2, label: "NYSC Status" },
            { s: 3, label: "Academic" },
            { s: 4, label: "Personalize" },
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
        <div className="p-8 sm:p-12 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-8">
          
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
                  Verify your profile details to personalize your active companion.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-display">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name..."
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-display">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white text-xs focus:outline-none focus:border-emerald-600"
                  />
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
                  Select your active stage to isolate relevant mini-products.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-2">
                {[
                  { id: "prospective_corps_member", label: "Prospective Corps Member (PCM)", desc: "Awaiting call-up letter, registration, or camp orientation." },
                  { id: "serving_corps_member", label: "Serving Corps Member", desc: "Active service year — daily PPA, LGA biometrics, and CDS." },
                  { id: "alumni", label: "Ex-Corps Member (POP Alumni)", desc: "Completed service — sell household gear, jobs, and networking." },
                ].map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setFormData({ ...formData, nyscStatus: st.id as any })}
                    className={`p-5 border cursor-pointer transition-all ${
                      formData.nyscStatus === st.id
                        ? "bg-[#eaf5ed] dark:bg-[#0a0f0d] border-emerald-600 dark:border-emerald-500 shadow-sm"
                        : "bg-[#eaf5ed]/50 dark:bg-[#0a0f0d]/50 border-slate-300/40 dark:border-slate-800 hover:border-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-[#121815] dark:text-white font-display">{st.label}</span>
                      {formData.nyscStatus === st.id && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{st.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: ACADEMIC / DEPLOYMENT */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                  STEP 03 OF 04
                </span>
                <h2 className="text-2xl sm:text-3xl font-medium text-[#121815] dark:text-white font-display">
                  Academic & State Profile
                </h2>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-display">
                    Institution / University
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-4 py-3 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-display">
                    Field of Study
                  </label>
                  <select
                    value={formData.fieldOfStudy}
                    onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                    className="w-full px-4 py-3 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white text-xs focus:outline-none focus:border-emerald-600"
                  >
                    <option value="" disabled>Select Field of Study...</option>
                    {fieldOfStudyOptions.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                    <option value="other">Other (Specify)</option>
                  </select>

                  {formData.fieldOfStudy === "other" && (
                    <div className="pt-2 space-y-1 animate-fadeIn">
                      <label className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest font-mono">
                        Specify Custom Field of Study
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Cyber Security & Digital Forensics"
                        value={customFieldOfStudy}
                        onChange={(e) => setCustomFieldOfStudy(e.target.value)}
                        className="w-full px-4 py-3 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-emerald-600 dark:border-emerald-500 text-[#121815] dark:text-white text-xs focus:outline-none"
                      />
                      <p className="text-[10px] text-slate-500">
                        ✨ Your custom field will be saved to our backend database and available for future corpers!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PERSONALIZE */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                  STEP 04 OF 04
                </span>
                <h2 className="text-2xl sm:text-3xl font-medium text-[#121815] dark:text-white font-display">
                  Personalize Capabilities
                </h2>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-display block">
                  Select Immediate Priorities
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    "NYSC timeline and important dates",
                    "Camp packing checklist",
                    "Camp survival guide",
                    "Travel planning & SOS",
                    "Corper housing & P2P market",
                  ].map((interest) => {
                    const isChecked = formData.interests.includes(interest);
                    return (
                      <div
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`p-4 border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? "bg-[#eaf5ed] dark:bg-[#0a0f0d] border-emerald-600 dark:border-emerald-500 text-emerald-800 dark:text-emerald-300"
                            : "bg-[#eaf5ed]/50 dark:bg-[#0a0f0d]/50 border-slate-300/40 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span>{interest}</span>
                        {isChecked && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-300/60 dark:border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3 border border-slate-300 dark:border-slate-800 text-xs font-bold uppercase tracking-wider hover:border-slate-500 transition-colors flex items-center gap-1.5 cursor-pointer font-display"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid || submitting}
              className={`px-8 py-3.5 text-white text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 font-display ${
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
                  <span>{step === 4 ? "Complete Setup & Launch Dashboard" : "Continue"}</span>
                  <ArrowRight className="w-4 h-4" />
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
