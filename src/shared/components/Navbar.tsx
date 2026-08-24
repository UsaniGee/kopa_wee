"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";

interface NavbarProps {
  onOpenRoleModal: (role?: string) => void;
  overHero?: boolean;
}

export default function Navbar({ onOpenRoleModal, overHero = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md py-3 text-slate-900 shadow-sm"
          : "bg-transparent py-5 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className={`w-10 h-10 flex items-center justify-center font-black text-xl transition-transform group-hover:scale-105 ${isScrolled ? "bg-black text-white" : "bg-white text-black"}`}>
              K
            </div>
            <div className="flex flex-col">
              <span className={`font-black text-xl tracking-tight flex items-center gap-1 ${isScrolled ? "text-black" : "text-white"}`}>
                KopaWee<span className={isScrolled ? "text-emerald-600 font-black" : "text-emerald-400 font-black"}>+</span>
              </span>
              <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${isScrolled ? "text-slate-600" : "text-emerald-100"}`}>
                NYSC Companion
              </span>
            </div>
          </Link>

          {/* Nav links with text-roll effect */}
          <nav className={`hidden md:flex items-center gap-1 px-3 py-1.5 ${isScrolled ? "bg-slate-100" : "bg-black/30 backdrop-blur-sm"}`}>
            {[
              { href: "#services", label: "Services & Modules" },
              { href: "#architecture", label: "LEGO Architecture" },
              { href: "#roadmap", label: "4-Year Rollout" },
              { href: "#calculator", label: "Corper Value Quiz" }
            ].map(link => (
              <a 
                key={link.href} 
                href={link.href} 
                className={`group px-3 py-1.5 text-xs font-bold transition-colors ${
                  isScrolled 
                    ? "text-black hover:text-emerald-600" 
                    : "text-white/90 hover:text-white"
                }`}
              >
                <span className="text-roll-wrapper">
                  <span className="text-roll-inner">
                    <span className="text-roll-text">{link.label}</span>
                    <span className="text-roll-text text-emerald-500">{link.label}</span>
                  </span>
                </span>
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {/* Secondary button: Sign In */}
            <Link
              href="/auth?mode=signin"
              className={`px-4 py-2 text-xs font-bold transition-all ${
                isScrolled
                  ? "text-black bg-slate-100 hover:bg-black hover:text-white"
                  : "text-white bg-white/20 hover:bg-white hover:text-black"
              }`}
            >
              Sign In
            </Link>
            {/* Primary button: Sign Up (Sharp green fill) */}
            <Link
              href="/auth?mode=signup"
              className="px-5 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center gap-1.5 group"
            >
              <span>Sign Up Free</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="p-2 text-black bg-slate-100 active:bg-slate-200 cursor-pointer touch-manipulation select-none"
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-4 py-6 mt-3 shadow-2xl z-50 relative">
          <div className="flex flex-col gap-3">
            {[
              ["#services", "Services & Mini-Products"],
              ["#architecture", "Modular Architecture"],
              ["#roadmap", "Rollout Roadmap"],
              ["#calculator", "Corper Value Calculator"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  const el = document.querySelector(href);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="group px-4 py-3 text-sm font-bold text-black bg-slate-50 active:bg-slate-200 flex items-center justify-between cursor-pointer touch-manipulation"
              >
                <span>{label}</span>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-2.5">
              <Link
                href="/auth?mode=signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-sm font-bold text-center text-white bg-emerald-500 active:bg-emerald-600 cursor-pointer touch-manipulation block"
              >
                Sign Up Free →
              </Link>
              <Link
                href="/auth?mode=signin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-sm font-bold text-center text-black bg-slate-100 active:bg-slate-200 cursor-pointer touch-manipulation block"
              >
                Sign In to Account
              </Link>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}

