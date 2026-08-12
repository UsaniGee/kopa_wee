import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, MapPin, Globe, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-bold text-lg">
                K
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                KopaWee<span className="text-emerald-500">+</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The active personal companion & modular super-app for National Youth Service Corps (NYSC) members across Nigeria. Transforming passive administration into proactive alerts, corper marketplace, travel safety, and career growth.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" /> Supporting 36 States + FCT Abuja
            </div>
          </div>

          {/* Mini-Products */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Mini-Products</h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li><a href="#services" className="hover:text-emerald-400 transition-colors">Smart LGA Clearance</a></li>
              <li><a href="#services" className="hover:text-emerald-400 transition-colors">Corper Marketplace</a></li>
              <li><a href="#services" className="hover:text-emerald-400 transition-colors">Housing & Roommates</a></li>
              <li><a href="#services" className="hover:text-emerald-400 transition-colors">Orientation Camp Guide</a></li>
              <li><a href="#services" className="hover:text-emerald-400 transition-colors">Travel Safety SOS</a></li>
              <li><a href="#services" className="hover:text-emerald-400 transition-colors">Workplace & PPA Hub</a></li>
            </ul>
          </div>

          {/* User Roles */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Tailored Roles</h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li><span className="text-slate-300">Prospective Corps Member</span></li>
              <li><span className="text-slate-300">Serving Corps Member</span></li>
              <li><span className="text-slate-300">Ex-Corps Member / POP Alumni</span></li>
              <li><span className="text-slate-300">PPA Representative (Employer)</span></li>
              <li><span className="text-slate-300">CDS Executive</span></li>
              <li><span className="text-slate-300">LGA Inspector / Official</span></li>
            </ul>
          </div>

          {/* Infrastructure */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">LEGO Foundation</h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li><span className="text-slate-400">Single Sign-On Auth</span></li>
              <li><span className="text-slate-400">Push Notification Engine</span></li>
              <li><span className="text-slate-400">Location GPS & Routing</span></li>
              <li><span className="text-slate-400">Encrypted Document Vault</span></li>
              <li><span className="text-slate-400">NiYA Job Integration</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KopaWee. Built with pride for Nigerian Youth.</p>
          <div className="flex items-center gap-1">
            <span>Designed for seamless corper experience</span>
            <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
