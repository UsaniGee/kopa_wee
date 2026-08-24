"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useRole } from "@/shared/context/RoleContext";
import { 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Luggage, 
  Building2, 
  Award,
  Sparkles,
  Star,
  MapPin,
  Compass,
  CheckSquare,
  Lock,
  Phone,
  Mail,
  GraduationCap
} from "lucide-react";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", 
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", 
  "Taraba", "Yobe", "Zamfara"
];

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

export default function ProgressiveOnboardingPage() {
  const router = useRouter();
  const { setRole } = useRole();

  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    // Auth & Basic
    fullName: "Chidi Okonkwo",
    displayName: "Corper Chidi",
    email: "chidi.okonkwo@example.ng",
    phone: "08012345678",
    password: "••••••••",

    // Journey Status
    nyscStatus: "prospective_corps_member" as "prospective_corps_member" | "serving_corps_member" | "alumni",

    // PCM Details
    pcmStage: "registered",
    expectedBatch: "Batch A 2026",
    stream: "Stream I",
    institution: "University of Lagos",
    institutionState: "Lagos",
    fieldOfStudy: "Computer Science / Software Engineering",
    knowsDeploymentState: false,
    deploymentState: "",
    hasCallUpLetter: false,
    interests: ["Camp packing checklist", "Travel planning", "NYSC timeline", "AI assistant"],

    // Serving Details
    serviceState: "Lagos",
    serviceStage: "orientation_camp",
    orientationCamp: "Iyana Ipaja Permanent Orientation Camp, Lagos",
    ppaName: "Grace High School",
    ppaType: "School",
    ppaLGA: "Ikeja",
    ppaArea: "Opebi",
    lookingForAccommodation: true,

    // Alumni Details
    serviceYear: "2023",
    alumniState: "Lagos",
    industry: "Information Technology",
  });

  const handleNext = () => {
    if (step < 4) setStep(s => s + 1);
    else finishOnboarding();
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
    else router.push("/auth");
  };

  const finishOnboarding = () => {
    let targetRole: any = "serving";
    if (formData.nyscStatus === "prospective_corps_member") targetRole = "pcm";
    else if (formData.nyscStatus === "serving_corps_member") targetRole = "serving";
    else if (formData.nyscStatus === "alumni") targetRole = "alumni";

    setRole(targetRole);
    localStorage.setItem("kopawee_user_profile", JSON.stringify(formData));
    router.push("/dashboard");
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => {
      const exists = prev.interests.includes(interest);
      const updated = exists ? prev.interests.filter(i => i !== interest) : [...prev.interests, interest];
      return { ...prev, interests: updated };
    });
  };

  return (
    <div className="min-h-screen w-full bg-white grid grid-cols-1 lg:grid-cols-12 font-sans overflow-x-hidden">
      {/* ===================================================================
          LEFT SIDE: FULL-HEIGHT VISUAL HERO OVERLAY PANEL (KOPA WEE PALETTE)
          =================================================================== */}
      <div className="hidden lg:flex lg:col-span-6 min-h-[500px] lg:min-h-screen p-8 sm:p-12 lg:p-16 text-white relative flex flex-col justify-between overflow-hidden">
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

        {/* Top Left Sparkle & Back */}
        <div className="relative z-10 flex items-center justify-between">

          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white backdrop-blur-md transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Center Copy & Live Progress Indicator */}
        <div className="relative z-10 space-y-6 my-12 lg:my-auto max-w-lg">
          

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] text-white">
            {step === 1 && "Personalize your profile & preferences."}
            {step === 2 && "Tailor your journey to your exact NYSC stage."}
            {step === 3 && "Unlock your location-aware modules & state tools."}
            {step === 4 && "Setup your dashboard & smart companion."}
          </h1>

          <p className="text-sm sm:text-base text-white leading-relaxed font-normal">
            We collect only what is relevant to your current stage. As your NYSC
            status evolves from PCM to Serving Corper, your features unlock
            progressively.
          </p>

          {/* Stepper Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-bold text-white uppercase tracking-wider">
              <span>Overall Completion</span>
              <span className="text-white font-mono">{step * 25}%</span>
            </div>
            <div className="w-full h-2.5 bg-white/50 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${step * 25}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Social Proof & Ratings */}
        <div className="relative z-10 pt-8 border-t border-white/10 flex flex-wrap items-center gap-6">
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
          RIGHT SIDE: FULL-HEIGHT FORM PANEL (4-STEP PROGRESSIVE WIZARD)
          =================================================================== */}
      <div className="lg:col-span-6 min-h-screen p-8 sm:p-12 lg:p-16 bg-white flex flex-col justify-between max-w-xl mx-auto w-full overflow-y-auto">
        {/* Header Badge */}
        <div className="space-y-8 my-auto w-full">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-xl font-black text-xl">
              K<span className="text-emerald-500">+</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-2.5 w-6 rounded-full transition-all ${step >= s ? "bg-emerald-500" : "bg-slate-300"}`}
                />
              ))}
            </div>
          </div>

          {/* ================================================================
             STEP 1: BASIC PROFILE
             ================================================================ */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  Basic Information
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
                  Set up your profile details. No call-up number required.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl text-sm bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Preferred Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData({ ...formData, displayName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl text-sm bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl text-sm bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl text-sm bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
             STEP 2: NYSC JOURNEY STATUS SELECTION
             ================================================================ */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  Select Your NYSC Stage
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
                  This answer dynamically unlocks features tailored specifically
                  to your role.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: "prospective_corps_member",
                    title: "I'm preparing for NYSC",
                    desc: "Waiting for mobilization, registration, or deployment letter.",
                    badge: "PCM",
                    icon: Luggage,
                  },
                  {
                    id: "serving_corps_member",
                    title: "I'm currently serving",
                    desc: "Currently in orientation camp or serving at my PPA.",
                    badge: "Serving",
                    icon: Building2,
                  },
                  {
                    id: "alumni",
                    title: "I've completed NYSC",
                    desc: "POP alumni / Completed service year.",
                    badge: "POP Alumni",
                    icon: Award,
                  },
                ].map((item) => {
                  const IconComp = item.icon;
                  const isSelected = formData.nyscStatus === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() =>
                        setFormData({ ...formData, nyscStatus: item.id as any })
                      }
                      className={`p-4 rounded-2xl transition-all cursor-pointer flex items-start gap-4 ${
                        isSelected
                          ? "bg-emerald-50"
                          : "bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-xl text-white shrink-0 ${isSelected ? "bg-emerald-500" : "bg-black"}`}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <span>{item.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-black text-white font-mono">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================
             STEP 3: ROLE DETAILS (WITH PPA DECISION FATIGUE PROTECTION)
             ================================================================ */}
          {step === 3 && formData.nyscStatus === "prospective_corps_member" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  PCM Preparation Details
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
                  Connect with graduates from your institution.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Current NYSC Stage
                  </label>
                  <select
                    value={formData.pcmStage}
                    onChange={(e) =>
                      setFormData({ ...formData, pcmStage: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl text-sm bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                  >
                    <option value="mobilization">
                      Waiting for mobilization
                    </option>
                    <option value="registration">
                      Waiting for registration
                    </option>
                    <option value="registered">
                      Registered and waiting for deployment
                    </option>
                    <option value="callup_received">
                      I have received my call-up letter
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Batch & Stream
                    </label>
                    <select
                      value={formData.expectedBatch}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expectedBatch: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-2xl text-sm bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                    >
                      <option value="Batch A 2026">
                        2026 Batch A Stream I
                      </option>
                      <option value="Batch B 2026">
                        2026 Batch B Stream I
                      </option>
                      <option value="Batch C 2026">
                        2026 Batch C Stream I
                      </option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Graduating Institution
                    </label>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          institution: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-2xl text-sm bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Course / Field of Study
                  </label>
                  <select
                    value={formData.fieldOfStudy}
                    onChange={(e) =>
                      setFormData({ ...formData, fieldOfStudy: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl text-sm bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                  >
                    {FIELDS_OF_STUDY.map((f, idx) => (
                      <option key={idx} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && formData.nyscStatus === "serving_corps_member" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  Serving Corper Context
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
                  Powers local accommodation, marketplace, and clearance
                  reminders.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    State of Service (Required)
                  </label>
                  <select
                    value={formData.serviceState}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceState: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl text-sm bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-bold"
                  >
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Current Service Stage
                  </label>
                  <select
                    value={formData.serviceStage}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceStage: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl text-sm bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-bold"
                  >
                    <option value="orientation_camp">
                      Currently in orientation camp
                    </option>
                    <option value="waiting_ppa">Waiting for PPA posting</option>
                    <option value="posted_ppa">
                      Posted to a PPA / Currently serving at PPA
                    </option>
                  </select>
                </div>

                {formData.serviceStage === "posted_ppa" ? (
                  <div className="space-y-1.5 pt-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      PPA Name / Primary Assignment
                    </label>
                    <input
                      type="text"
                      value={formData.ppaName}
                      onChange={(e) =>
                        setFormData({ ...formData, ppaName: e.target.value })
                      }
                      placeholder="e.g. Government Secondary School, Ikeja"
                      className="w-full px-4 py-3 rounded-2xl text-sm bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                    />
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs leading-relaxed font-medium">
                    💡 <strong>Decision Fatigue Protection:</strong> You are
                    currently in orientation camp or waiting for PPA posting.
                    You don't need to fill in PPA details now. Your dashboard
                    will prompt you when you receive your posting!
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && formData.nyscStatus === "alumni" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  Ex-Corper / Alumni Details
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
                  Connect with your service batch and explore career
                  opportunities.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Service Year
                  </label>
                  <input
                    type="text"
                    value={formData.serviceYear}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceYear: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl text-sm bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    State Served
                  </label>
                  <select
                    value={formData.alumniState}
                    onChange={(e) =>
                      setFormData({ ...formData, alumniState: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl text-sm bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                  >
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
             STEP 4: DEPLOYMENT & INTEREST PROFILING
             ================================================================ */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  Deployment & Interests
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
                  Customize your dashboard modules.
                </p>
              </div>

              {formData.nyscStatus === "prospective_corps_member" && (
                <div className="p-4 rounded-2xl bg-slate-100 space-y-3">
                  <label className="text-xs font-bold text-slate-800 block">
                    Do you know your state of deployment yet?
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, knowsDeploymentState: true })
                      }
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        formData.knowsDeploymentState
                          ? "bg-emerald-500 text-white shadow-md"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      Yes, I know my state
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          knowsDeploymentState: false,
                          deploymentState: "",
                        })
                      }
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        !formData.knowsDeploymentState
                          ? "bg-black text-white shadow-md"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      Not yet
                    </button>
                  </div>

                  {formData.knowsDeploymentState && (
                    <div className="space-y-1.5 pt-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Which state were you deployed to?
                      </label>
                      <select
                        value={formData.deploymentState}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            deploymentState: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-2xl text-sm bg-slate-100 text-slate-900 font-bold focus:outline-none"
                      >
                        <option value="">-- Select Deployed State --</option>
                        {NIGERIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  What would be most helpful right now?
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "NYSC timeline and important dates",
                    "Camp packing checklist",
                    "Camp survival guide",
                    "Travel planning",
                    "State guide & P2P marketplace",
                  ].map((interest) => {
                    const isChecked = formData.interests.includes(interest);
                    return (
                      <div
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`p-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? "bg-emerald-500 text-white shadow-md"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <span>{interest}</span>
                        {isChecked && (
                          <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-end pt-6 mt-6">
            {/* <button
              type="button"
              onClick={handleBack}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button> */}

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-xs font-black shadow-xl shadow-emerald-500/25 transition-all flex items-center gap-2"
            >
              <span>
                {step === 4 ? "Complete Setup & Launch Dashboard" : "Continue"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
