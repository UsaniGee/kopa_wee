"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/shared/components/Navbar";
import Footer from "@/shared/components/Footer";
import HeroCarousel from "@/shared/components/HeroCarousel";
import { services } from "@/shared/data/services";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";

const ArrowRight = FiArrowRight;
const CheckCircle2 = FiCheckCircle;

export default function LandingPage() {
  const [selectedService, setSelectedService] = useState<number>(0);
  const [navOverHero, setNavOverHero] = useState(true);

  const [monthlyAllowance, setMonthlyAllowance] = useState<number>(77000);
  const [monthsInService, setMonthsInService] = useState<number>(12);

  useEffect(() => {
    const handleScroll = () => {
      setNavOverHero(window.scrollY < window.innerHeight * 0.85);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentService = services[selectedService];

  return (
    <div className="min-h-screen flex flex-col bg-[#eaf5ed] dark:bg-[#0a0f0d] text-[#121815] dark:text-slate-100 selection:bg-emerald-600 selection:text-white transition-colors duration-500">
      <Navbar
        overHero={navOverHero}
        onOpenRoleModal={() => {}}
      />

      <main className="flex-1">
        {/* HERO CAROUSEL */}
        <HeroCarousel
          onSlideChange={setSelectedService}
        />

        {/* PROOF STRIP — MINIMALIST BORDERED GRID */}
        <section className="py-12 bg-[#dcece1] dark:bg-[#121a16] border-y border-slate-300/60 dark:border-slate-800">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "50,000+", label: "Active Corps Members" },
              { value: "36", label: "States + FCT Covered" },
              { value: "8", label: "Core Mini-Products" },
              { value: "100%", label: "Offline Ready Vault" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="px-6 py-8 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 text-left"
              >
                <span className="block text-4xl font-bold font-display text-[#121815] dark:text-white tracking-tight">{stat.value}</span>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] mt-1 block">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* JOURNEY INTRO SECTION */}
        <section className="py-24 bg-[#eaf5ed] dark:bg-[#0a0f0d]">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
            <div className="inline-flex items-center gap-2 border-b border-emerald-600 pb-1">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-800 dark:text-emerald-300 font-display">
                The Corper&apos;s Journey
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-medium text-[#121815] dark:text-white tracking-tight leading-[1.05] font-display">
              From call-up letter to POP —{" "}
              <span className="text-emerald-700 dark:text-emerald-400 italic">we walk every step with you</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              KopaWee is a purposeful companion designed for every stage of your service year — camp, travel safety, housing, LGA clearance, marketplace, PPA logbook, and CDS.
            </p>
          </div>
        </section>

        {/* SERVICES / CHAPTERS BREAKDOWN SECTION */}
        <section
          id="services"
          className="relative bg-[#dcece1] dark:bg-[#121a16] py-24 sm:py-32 border-t border-slate-300/60 dark:border-slate-800"
        >
          <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
            <div className="mb-16 grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7 space-y-3">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-800 dark:text-emerald-300 font-display">
                  8 Chapters · 8 Mini-Products
                </span>
                <h2 className="text-4xl sm:text-6xl font-medium tracking-tight text-[#121815] dark:text-white leading-[1.02] font-display">
                  Your Service Year, Chapter by Chapter
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  Each module functions as an independent mini-product tailored strictly to your active role — providing complete clarity without clutter.
                </p>
              </div>
            </div>

            {/* Story timeline chapter selector */}
            <div className="mb-12 flex items-center justify-between gap-3 overflow-x-auto pb-4 border-b border-slate-300/60 dark:border-slate-800">
              {services.map((svc, i) => {
                const IconComp = svc.icon;
                const isSelected = selectedService === i;
                return (
                  <button
                    key={svc.id}
                    onClick={() => setSelectedService(i)}
                    className={`flex items-center gap-3 px-5 py-3 border transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? "bg-emerald-700 text-white border-emerald-700"
                        : "bg-[#eaf5ed] dark:bg-[#0a0f0d] text-slate-700 dark:text-slate-300 border-slate-300/60 dark:border-slate-800 hover:border-emerald-600"
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider font-display">
                      Ch.{String(i + 1).padStart(2, "0")} — {svc.id}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Feature Preview Grid */}
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
              {/* Left Column: Chapter List */}
              <div className="flex flex-col gap-3 lg:col-span-5">
                {services.map((svc, index) => {
                  const IconComp = svc.icon;
                  const isSelected = selectedService === index;
                  return (
                    <button
                      key={svc.id}
                      onClick={() => setSelectedService(index)}
                      className={`w-full text-left p-6 border transition-all flex items-start gap-4 cursor-pointer ${
                        isSelected
                          ? "bg-[#eaf5ed] dark:bg-[#0a0f0d] border-emerald-600 dark:border-emerald-500 shadow-sm"
                          : "bg-transparent border-slate-300/50 dark:border-slate-800/80 hover:border-slate-400"
                      }`}
                    >
                      <div className={`p-3 text-white ${isSelected ? "bg-emerald-700" : "bg-slate-700 dark:bg-slate-800"}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-display">
                            {svc.storyChapter} · {svc.category}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        </div>
                        <h3 className="text-base font-bold text-[#121815] dark:text-white font-display">{svc.storyHeadline}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-1">{svc.tagline}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Active Chapter Detail Panel */}
              <div className="space-y-6 lg:sticky lg:top-28 lg:col-span-7">
                {/* Story Image */}
                <div className="relative h-72 sm:h-96 overflow-hidden border border-slate-300/60 dark:border-slate-800 shadow-md">
                  <Image
                    src={currentService.image}
                    alt={currentService.imageAlt}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center filter brightness-[0.97]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121815]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                    <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-300">
                      {currentService.storyChapter}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-medium text-white mt-1 font-display leading-tight">
                      {currentService.storyHeadline}
                    </h3>
                  </div>
                </div>

                {/* Chapter Description & Capabilities */}
                <div className="p-8 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 space-y-6">
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 italic border-l-2 border-emerald-600 pl-4 py-1">
                    &ldquo;{currentService.storyNarrative}&rdquo;
                  </p>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {currentService.description}
                  </p>

                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-[#121815] dark:text-white uppercase tracking-widest font-display">Key Capabilities</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentService.highlights.map((hl, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200 p-3 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/40 dark:border-slate-800"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-300/60 dark:border-slate-800">
                    <Link
                      href="/auth?mode=signup"
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-[0.18em] transition-colors flex items-center justify-center gap-2"
                    >
                      <span>{currentService.previewContent.action}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4-YEAR ROLLOUT ROADMAP */}
        <section id="roadmap" className="py-24 bg-[#dcece1] dark:bg-[#121a16] border-t border-slate-300/60 dark:border-slate-800">
          <div className="max-w-[360 mx-auto px-6 sm:px-10 lg:px-16">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-800 dark:text-emerald-300 font-display">
                Phased Strategy
              </span>
              <h2 className="text-4xl sm:text-6xl font-medium text-[#121815] dark:text-white tracking-tight font-display">
                The 4-Year Scaling Roadmap
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { year: "Year 1 (MVP)", title: "Companion + Safety + Marketplace", text: "50,000 corps members across 36 states with clearance reminders and P2P gear trade.", target: "50,000 Corps Members" },
                { year: "Year 2", title: "Workplace Module", text: "PPA employers join to streamline digital clock-in attendance and clearance leave approvals.", target: "2,500 PPAs Registered" },
                { year: "Year 3", title: "CDS Community Module", text: "Community Development Service groups onboard for barcode attendance and dues collection.", target: "Nationwide CDS Adoption" },
                { year: "Year 4", title: "Official Integration", text: "Direct API synchronization with NYSC Directorate HQ for automated biometric verification.", target: "Directorate Partnership" },
              ].map((item, idx) => (
                <div key={idx} className="p-8 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 space-y-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400 block">{item.year}</span>
                  <h3 className="text-lg font-bold text-[#121815] dark:text-white font-display">{item.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.text}</p>
                  <div className="pt-3 border-t border-slate-300/40 dark:border-slate-800 text-xs font-semibold text-[#121815] dark:text-white">
                    {item.target}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CORPER VALUE CALCULATOR */}
        <section id="calculator" className="py-24 bg-[#eaf5ed] dark:bg-[#0a0f0d]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="p-8 sm:p-12 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-800 dark:text-emerald-300 font-display">
                  Interactive Impact Quiz
                </span>
                <h3 className="text-3xl sm:text-4xl font-medium text-[#121815] dark:text-white font-display">Estimate Your Service Year Impact</h3>
              </div>

              <div className="space-y-6 max-w-xl mx-auto">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Monthly Allawee (₦)</span>
                    <span className="text-[#121815] dark:text-white font-mono font-bold">₦{monthlyAllowance.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="33000"
                    max="100000"
                    step="1000"
                    value={monthlyAllowance}
                    onChange={(e) => setMonthlyAllowance(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Service Duration</span>
                    <span className="text-[#121815] dark:text-white font-mono font-bold">{monthsInService} Months</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={monthsInService}
                    onChange={(e) => setMonthsInService(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="bg-[#eaf5ed] dark:bg-[#0a0f0d] p-6 text-center border border-slate-300/60 dark:border-slate-800">
                  <span className="block text-xs font-semibold text-slate-500">Est. Gear Savings</span>
                  <span className="text-2xl font-bold font-display text-[#121815] dark:text-white mt-1 block">
                    ₦{Math.round(monthlyAllowance * 0.45).toLocaleString()}
                  </span>
                </div>
                <div className="bg-[#eaf5ed] dark:bg-[#0a0f0d] p-6 text-center border border-slate-300/60 dark:border-slate-800">
                  <span className="block text-xs font-semibold text-slate-500">Clearance Hours Saved</span>
                  <span className="text-2xl font-bold font-display text-[#121815] dark:text-white mt-1 block">{monthsInService * 6} Hours</span>
                </div>
                <div className="bg-[#eaf5ed] dark:bg-[#0a0f0d] p-6 text-center border border-slate-300/60 dark:border-slate-800">
                  <span className="block text-xs font-semibold text-slate-500">Highway Travel Safety</span>
                  <span className="text-2xl font-bold font-display text-emerald-600 mt-1 block">100% Active</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EARLY ACCESS / PRICING SECTION */}
        <section id="pricing" className="py-24 bg-[#eaf5ed] dark:bg-[#0a0f0d] border-t border-slate-300/60 dark:border-slate-800">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-800 dark:text-emerald-300 font-display">
                Early Access Pricing
              </span>
              <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#121815] dark:text-white font-display">
                Free for now. Premium plans coming soon.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                We&apos;re currently giving users free access while we build and improve the platform. Premium features and subscription plans will be introduced in the future.
              </p>
            </div>

            <div className="max-w-xl mx-auto p-8 sm:p-10 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-8 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-800 pb-6">
                <div>
                  <div className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-emerald-700 text-white font-display mb-2">
                    Early Access Member
                  </div>
                  <h3 className="text-2xl font-bold text-[#121815] dark:text-white font-display">
                    Full Platform Access
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 font-display block">₦0</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Free Currently</span>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-[#121815] dark:text-white uppercase tracking-wider font-display block mb-2">
                  What&apos;s Included:
                </span>
                {[
                  "Core NYSC Mobilization & Camp Tools",
                  "Monthly LGA Clearance Tracker & Biometrics Reminders",
                  "Verified Corper Lodge & Roommate Finder",
                  "Peer-to-Peer Classifieds Marketplace",
                  "Highway Travel Safety SOS Monitor",
                  "AI Regulatory & Bye-law Assistant",
                  "Ex-Corpers Alumni Career Network",
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/auth?mode=signup"
                  className="w-full py-4 bg-[#121815] hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Get Early Access</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM HERO CTA */}
        <section className="py-24 bg-[#121815] text-white">
          <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
            <h2 className="text-4xl sm:text-6xl font-medium tracking-tight font-display">
              Ready to Navigate Your Service Year With Calm Precision?
            </h2>
            <p className="text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
              Join thousands of Nigerian corps members using KopaWee as their proactive companion.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/auth?mode=signup"
                className="w-full sm:w-auto px-10 py-4.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-3 group"
              >
                <span>GET STARTED FREE</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/auth?mode=signin"
                className="w-full sm:w-auto px-10 py-4.5 border border-white/30 hover:border-white text-white font-bold text-xs uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
              >
                <span>SIGN IN</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
