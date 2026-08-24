import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white text-black flex items-center justify-center font-black text-lg">
                K
              </div>
              <span className="font-black text-2xl text-white tracking-tight">
                KopaWee<span className="text-emerald-500">+</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The active personal companion & modular super-app for National Youth Service Corps (NYSC) members across Nigeria. Transforming passive administration into proactive alerts, corper marketplace, travel safety, and career growth.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-slate-900 px-3 py-1.5 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Supporting 36 States + FCT Abuja
            </div>
          </div>

          {/* Mini-Products */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">App Dashboards</h4>
            <ul className="flex flex-col gap-2 text-xs">
              {[
                { label: "Main Dashboard", href: "/dashboard" },
                { label: "Smart Clearance", href: "/dashboard/companion" },
                { label: "Corper Marketplace", href: "/dashboard/marketplace" },
                { label: "Housing & Roommates", href: "/dashboard/accommodation" },
                { label: "Travel Safety SOS", href: "/dashboard/safety" },
                { label: "Workplace & PPA Hub", href: "/dashboard/workplace" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="group inline-block text-slate-400 hover:text-white">
                    <span className="text-roll-wrapper">
                      <span className="text-roll-inner">
                        <span className="text-roll-text">{item.label}</span>
                        <span className="text-roll-text text-emerald-400">{item.label}</span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* User Roles */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Tailored Roles</h4>
            <ul className="flex flex-col gap-2 text-xs text-slate-400">
              <li>Prospective Corps Member</li>
              <li>Serving Corps Member</li>
              <li>Ex-Corps Member / POP Alumni</li>
              <li>PPA Representative (Employer)</li>
              <li>CDS Executive</li>
              <li>LGA Inspector / Official</li>
            </ul>
          </div>

          {/* Infrastructure */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">LEGO Foundation</h4>
            <ul className="flex flex-col gap-2 text-xs text-slate-400">
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
          <p>© {new Date().getFullYear()} KopaWee. Built with pride for Nigerian Youth.</p>
          <div className="flex items-center gap-1.5">
            <span>Designed for seamless corper experience</span>
            <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}

