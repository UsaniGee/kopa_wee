"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/shared/components/Navbar";
import Footer from "@/shared/components/Footer";
import RoleOnboardingModal from "@/shared/components/RoleOnboardingModal";
import HeroCarousel from "@/shared/components/HeroCarousel";
import { services } from "@/shared/data/services";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("serving");
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
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[var(--nysc-green)] selection:text-white">
      <Navbar
        overHero={navOverHero}
        onOpenRoleModal={(role) => {
          if (role) setSelectedRole(role);
          setRoleModalOpen(true);
        }}
      />

      <main className="flex-1">
        {/* STORY CAROUSEL HERO */}
        <HeroCarousel
          onOpenRoleModal={() => setRoleModalOpen(true)}
          onSlideChange={setSelectedService}
        />

        {/* Proof strip — below hero, not inside first viewport */}
        <section className="py-10 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: "50,000+", label: "Corps Members" },
              { value: "36", label: "States + FCT" },
              { value: "8", label: "Mini-Products" },
              { value: "100%", label: "Offline Ready" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="px-4 py-6 bg-white text-center shadow-sm"
              >
                <span className="block text-3xl font-black text-black">{stat.value}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* JOURNEY INTRO STRIP */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-emerald-800 bg-emerald-100 px-3 py-1 inline-block">
              • The Corper&apos;s Journey
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight">
              From call-up letter to POP —{" "}
              <span className="text-emerald-600">we walk every step with you</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              KopaWee isn&apos;t just another app. It&apos;s the story of your service year — camp,
              travel, housing, clearance, marketplace, PPA, CDS, and beyond.
            </p>
          </div>
        </section>

        {/* SERVICES BREAKDOWN SECTION */}
        <section
          id="services"
          className="py-20 bg-slate-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-black bg-slate-200 px-3 py-1">
                • 8 Chapters · 8 Mini-Products
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight">
                Your Service Year, Chapter by Chapter
              </h2>
              <p className="text-base text-slate-600 max-w-2xl">
                Each module is a chapter in your NYSC story — independent, but connected through one app.
              </p>
            </div>

            {/* Story timeline on desktop */}
            <div className="hidden lg:flex items-center justify-between mb-12 px-4 overflow-x-auto gap-1">
              {services.map((svc, i) => {
                const IconComp = svc.icon;
                return (
                  <button
                    key={svc.id}
                    onClick={() => setSelectedService(i)}
                    className={`flex flex-col items-center gap-3 min-w-[72px] group transition-all ${
                      selectedService === i ? "opacity-100" : "opacity-40 hover:opacity-100"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 flex items-center justify-center transition-all ${
                        selectedService === i ? "bg-black text-white shadow-md" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold text-center leading-tight ${selectedService === i ? "text-black" : "text-slate-400"}`}>
                      Ch.{String(i + 1).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Service Selector & Feature Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Service Tabs */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                {services.map((svc, index) => {
                  const IconComp = svc.icon;
                  const isSelected = selectedService === index;
                  return (
                    <button
                      key={svc.id}
                      onClick={() => setSelectedService(index)}
                      className={`w-full text-left p-4 transition-all flex items-start gap-4 ${
                        isSelected
                          ? "bg-emerald-100 text-black shadow-md"
                          : "bg-white hover:bg-slate-100 text-black"
                      }`}
                    >
                      <div className={`p-3 text-white shrink-0 shadow-sm ${isSelected ? "bg-black" : "bg-slate-400"}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                            {svc.storyChapter} · {svc.category}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        </div>
                        <h3 className="text-sm font-black text-black">{svc.storyHeadline}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1">{svc.tagline}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Story Preview with Image */}
              <div className="lg:col-span-7 space-y-4 sticky top-28">
                {/* Story image banner */}
                <div className="service-image-card relative h-52 sm:h-64 overflow-hidden shadow-2xl">
                  <Image
                    src={currentService.image}
                    alt={currentService.imageAlt}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                      {currentService.storyChapter}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-1 leading-tight">
                      {currentService.storyHeadline}
                    </h3>
                  </div>
                </div>

                {/* Detail card */}
                <div className="p-6 sm:p-8 bg-white text-black space-y-6 shadow-md">
                  <div className="flex items-center gap-3 pb-4 bg-slate-50 p-4">
                    <div className="p-3 bg-black text-white">
                      <currentService.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black px-2 py-0.5 text-white bg-black uppercase tracking-wider">
                        {currentService.category}
                      </span>
                      <h3 className="text-lg font-black text-black mt-1">{currentService.title}</h3>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed italic bg-emerald-50 p-4">
                    &ldquo;{currentService.storyNarrative}&rdquo;
                  </p>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {currentService.description}
                  </p>

                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-black uppercase tracking-wider">Key Capabilities</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentService.highlights.map((hl, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs text-slate-800 p-3 bg-slate-100 font-semibold"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">
                      Live Experience Preview
                    </h4>
                    <div className="p-4 bg-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-black uppercase tracking-wider">
                          {currentService.previewContent.badge}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Live Demo State</span>
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-black">{currentService.previewContent.title}</h5>
                        <p className="text-xs text-slate-500">{currentService.previewContent.detail}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedRole("serving");
                          setRoleModalOpen(true);
                        }}
                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        {currentService.previewContent.action} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MODULAR "LEGO" ARCHITECTURE SECTION */}
        <section id="architecture" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-black bg-slate-100 px-3 py-1">
                • System Architecture
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight">
                Built Like LEGO Pieces
              </h2>
              <p className="text-base text-slate-600 max-w-2xl">
                Instead of one giant monolithic app, KopaWee provides a unified core infrastructure that powers independent mini-products.
              </p>
            </div>

            <div className="p-8 sm:p-12 bg-slate-50 space-y-12 shadow-md">
              <div className="space-y-4 text-center">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  Shared LEGO Infrastructure Foundation
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {["Authentication", "Notification Engine", "Location & GPS", "P2P Payments", "Messaging System", "Document Vault"].map(
                    (infra, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white text-black text-xs font-black shadow-sm"
                      >
                        {infra}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-center text-black">
                <div className="w-0.5 h-10 bg-black" />
              </div>

              <div className="space-y-4 text-center">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  Independent Mini-Product Modules
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {[
                    "Companion", "Safety", "Community", "Workplace", "Marketplace", "CDS Hub", "LGA Admin"
                  ].map((mod, i) => (
                    <div key={i} className="p-3 bg-emerald-500 text-white text-xs font-black shadow-sm">
                      {mod}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center pt-4">
                <p className="text-xs text-slate-600 max-w-xl mx-auto font-medium">
                  &ldquo;Nothing breaks because each module is independent. The user only sees what they need based on their active role.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4-YEAR ROLLOUT ROADMAP SECTION */}
        <section id="roadmap" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-black bg-slate-200 px-3 py-1">
                • Scaling Strategy
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight">
                The 4-Year Rollout Plan
              </h2>
              <p className="text-base text-slate-600 max-w-2xl">
                A phased deployment strategy ensuring adoption, reliability, and eventual official integration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-emerald-100 space-y-4 shadow-sm">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-800 block">Year 1 (MVP)</span>
                <h3 className="text-lg font-black text-black">Companion + Safety + Marketplace</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Focus on 50,000 corps members. Smart clearance alerts, peer-to-peer marketplace, travel SOS, and housing finder.
                </p>
                <div className="pt-2 text-xs font-black text-black">
                  Target: 50,000 Users
                </div>
              </div>

              <div className="p-6 bg-white space-y-4 shadow-sm">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-black block">Year 2</span>
                <h3 className="text-lg font-black text-black">Workplace Module</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  PPAs (Employers) join the platform to manage corps member attendance, leave applications, and monthly reviews.
                </p>
                <div className="pt-2 text-xs font-bold text-slate-500">
                  Target: 2,500 PPAs
                </div>
              </div>

              <div className="p-6 bg-white space-y-4 shadow-sm">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-black block">Year 3</span>
                <h3 className="text-lg font-black text-black">CDS Community Module</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Community Development Service groups onboard for attendance registers, dues tracking, and project management.
                </p>
                <div className="pt-2 text-xs font-bold text-slate-500">
                  Nationwide CDS Expansion
                </div>
              </div>

              <div className="p-6 bg-white space-y-4 shadow-sm">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-black block">Year 4</span>
                <h3 className="text-lg font-black text-black">Official NYSC Integration</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct API integrations with NYSC Directorate HQ for automated biometric verification and clearance synchronization.
                </p>
                <div className="pt-2 text-xs font-bold text-slate-500">
                  Government Partnership
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORPER VALUE & SAVINGS CALCULATOR */}
        <section id="calculator" className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 bg-slate-100 text-black space-y-8 shadow-md">
              <div className="text-center space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.25em] text-emerald-800 bg-emerald-100 px-3 py-1 inline-block">
                  • Interactive Impact Quiz
                </span>
                <h3 className="text-2xl sm:text-4xl font-black text-black">Estimate Your Service Year Savings</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  See how KopaWee saves you time, money on housing/furniture, and clearance stress.
                </p>
              </div>

              <div className="space-y-6 max-w-xl mx-auto">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-600">Monthly Allowance (Allawee)</span>
                    <span className="text-black font-black">₦{monthlyAllowance.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="33000"
                    max="100000"
                    step="1000"
                    value={monthlyAllowance}
                    onChange={(e) => setMonthlyAllowance(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-600">Service Duration</span>
                    <span className="text-black font-black">{monthsInService} Months</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={monthsInService}
                    onChange={(e) => setMonthsInService(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="bg-white p-4 text-center shadow-sm">
                  <span className="block text-xs font-bold text-slate-500">Est. Furniture Savings (P2P Market)</span>
                  <span className="text-xl font-black text-black mt-1 block">
                    ₦{Math.round(monthlyAllowance * 0.45).toLocaleString()}
                  </span>
                </div>
                <div className="bg-white p-4 text-center shadow-sm">
                  <span className="block text-xs font-bold text-slate-500">Hours Saved (Clearance & Transport)</span>
                  <span className="text-xl font-black text-black mt-1 block">{monthsInService * 6} Hours</span>
                </div>
                <div className="bg-white p-4 text-center shadow-sm">
                  <span className="block text-xs font-bold text-slate-500">Travel & Emergency Safety</span>
                  <span className="text-xl font-black text-emerald-600 mt-1 block">100% Peace of Mind</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM HERO CTA */}
        <section className="py-20 bg-black text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Ready to Write Your Service Year Story?
            </h2>
            <p className="text-base text-slate-400 max-w-xl mx-auto">
              Join thousands of prospective, serving, and alumni corps members using Nigeria&apos;s premier active companion super-app.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth?mode=signup"
                className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Sign Up Free</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/auth?mode=signin"
                className="w-full sm:w-auto px-8 py-4 bg-white/20 hover:bg-white hover:text-black text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>      <Footer />

      <RoleOnboardingModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        defaultRole={selectedRole}
      />
    </div>
  );
}

