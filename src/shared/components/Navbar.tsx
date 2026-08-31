"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMenu, FiX, FiArrowRight } from "react-icons/fi";
import { navigateWithAuthCheck } from "@/shared/utils/authNav";

const Menu = FiMenu, X = FiX, ArrowRight = FiArrowRight;

interface NavbarProps {
  onOpenRoleModal: (role?: string) => void;
  overHero?: boolean;
}

export default function Navbar({ onOpenRoleModal, overHero = true }: NavbarProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) return; // allow anchor smooth scroll
    e.preventDefault();
    setMobileMenuOpen(false);
    navigateWithAuthCheck(router, href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/95 backdrop-blur-md py-3 text-slate-900 shadow-xs border-b border-slate-200"
          : "bg-transparent py-5 text-slate-900 dark:text-white"
      }`}
    >
      <div className="mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-bold text-xl sm:text-2xl tracking-widest uppercase font-display text-slate-900 dark:text-white">
              KOPA<span className="text-emerald-600 font-extrabold">'WEE</span>
            </span>
          </Link>

          {/* Desktop Navigation Links matching Screenshot */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: "#services", label: "Mini-Products" },
              { href: "/dashboard/companion", label: "Camp Guide" },
              { href: "/dashboard/accommodation", label: "Corper Housing" },
              { href: "/dashboard/marketplace", label: "P2P Market" },
              { href: "/dashboard/safety", label: "Safety SOS" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="group text-xs sm:text-sm font-medium tracking-wide text-slate-800 dark:text-emerald-100 hover:text-emerald-600 transition-colors cursor-pointer"
              >
                <span className="text-roll-wrapper">
                  <span className="text-roll-inner">
                    <span className="text-roll-text">{link.label}</span>
                    <span className="text-roll-text text-emerald-600 font-semibold">{link.label}</span>
                  </span>
                </span>
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/auth?mode=signin"
              className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white hover:text-emerald-600 transition-colors uppercase tracking-wider"
            >
              Sign In
            </Link>
            <Link
              href="/auth?mode=signup"
              className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white tracking-widest uppercase transition-all flex items-center gap-2 group rounded-none"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="p-2 text-slate-900 dark:text-white bg-slate-200/60 dark:bg-emerald-950 cursor-pointer touch-manipulation select-none"
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 px-6 py-6 mt-3 shadow-2xl z-50 relative border-b border-slate-200">
          <div className="flex flex-col gap-3">
            {[
              ["#services", "Mini-Products"],
              ["/dashboard/companion", "Camp Guide"],
              ["/dashboard/accommodation", "Corper Housing"],
              ["/dashboard/marketplace", "P2P Market"],
              ["/dashboard/safety", "Safety SOS"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleLinkClick(e, href)}
                className="group px-4 py-3 text-sm font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 active:bg-slate-200 flex items-center justify-between cursor-pointer touch-manipulation"
              >
                <span>{label}</span>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-2.5">
              <Link
                href="/auth?mode=signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-sm font-bold text-center text-white bg-emerald-600 active:bg-emerald-700 cursor-pointer uppercase tracking-wider block"
              >
                Get Started Free →
              </Link>
              <Link
                href="/auth?mode=signin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-sm font-bold text-center text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 cursor-pointer uppercase tracking-wider block"
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
