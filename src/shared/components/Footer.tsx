"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiShield, FiHeart } from "react-icons/fi";
import { navigateWithAuthCheck } from "@/shared/utils/authNav";

export default function Footer() {
  const router = useRouter();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    navigateWithAuthCheck(router, href);
  };

  return (
    <footer className="bg-[#121815] text-white pt-20 pb-12 border-t border-slate-800 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-16 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-bold text-2xl tracking-widest uppercase font-display text-white">
                KOPA<span className="text-emerald-500 font-extrabold">'WEE</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The active personal companion & modular platform for National Youth Service Corps (NYSC) members across Nigeria. Transforming passive administration into proactive alerts, corper marketplace, travel safety, and career growth.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-slate-900 px-3 py-2 border border-slate-800 w-fit">
              <FiShield className="w-4 h-4 text-emerald-400" /> 
              <span>Supporting 36 States + FCT Abuja</span>
            </div>
          </div>

          {/* Mini-Products */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white font-display">App Modules</h4>
            <ul className="flex flex-col gap-2.5 text-xs">
              {[
                { label: "Main Dashboard", href: "/dashboard" },
                { label: "Smart Clearance", href: "/dashboard/companion" },
                { label: "Corper Marketplace", href: "/dashboard/marketplace" },
                { label: "Housing & Roommates", href: "/dashboard/accommodation" },
                { label: "Travel Safety SOS", href: "/dashboard/safety" },
                { label: "Workplace & PPA Hub", href: "/dashboard/workplace" },
              ].map((item) => (
                <li key={item.label}>
                  <a 
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className="group inline-block text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="text-roll-wrapper">
                      <span className="text-roll-inner">
                        <span className="text-roll-text">{item.label}</span>
                        <span className="text-roll-text text-emerald-400">{item.label}</span>
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* User Roles */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white font-display">Supported Roles</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
              <li>Prospective Corps Member</li>
              <li>Serving Corps Member</li>
              <li>Ex-Corps Member / POP Alumni</li>
              <li>PPA Representative (Employer)</li>
              <li>CDS Executive</li>
              <li>LGA Inspector / Official</li>
            </ul>
          </div>

          {/* Infrastructure */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white font-display">Core Platform</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
              <li>Single Sign-On Auth</li>
              <li>Push Notification Engine</li>
              <li>Location GPS & Routing</li>
              <li>Encrypted Document Vault</li>
              <li>NiYA Job Integration</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KopaWee. Built with functional precision for Nigerian Youth.</p>
          <div className="flex items-center gap-2">
            <span>Proactive NYSC Companion</span>
            <FiHeart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
