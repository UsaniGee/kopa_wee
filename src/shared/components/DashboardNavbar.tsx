"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Bell, 
  Search, 
  User, 
  ChevronDown, 
  ArrowLeft,
  Sparkles,
  CheckCircle2
} from "lucide-react";

export interface RoleOption {
  id: string;
  label: string;
  badge: string;
  subtitle: string;
}

export const DASHBOARD_ROLES: RoleOption[] = [
  { id: "pcm", label: "Prospective Corper", badge: "PCM", subtitle: "Mobilization & Orientation Camp" },
  { id: "serving", label: "Serving Corps Member", badge: "Serving", subtitle: "Daily PPA, Clearance & CDS" },
  { id: "cds_exec", label: "CDS Executive", badge: "CDS Exec", subtitle: "Attendance, Projects & Dues" },
  { id: "ppa", label: "PPA Representative", badge: "Employer", subtitle: "Staff Attendance & Leave Requests" },
  { id: "nysc_official", label: "LGA NYSC Official", badge: "Inspector", subtitle: "Biometrics & Bi-Monthly Reports" },
  { id: "alumni", label: "Ex-Corps Member", badge: "POP", subtitle: "Career, Gigs & Alumni Network" }
];

interface DashboardNavbarProps {
  currentRole: string;
  onRoleChange: (roleId: string) => void;
}

export default function DashboardNavbar({ currentRole, onRoleChange }: DashboardNavbarProps) {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const activeRoleObj = DASHBOARD_ROLES.find(r => r.id === currentRole) || DASHBOARD_ROLES[1];

  return (
    <header className="bg-black text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Landing backlink */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black text-base">
                K
              </div>
              <span className="font-black text-lg tracking-tight hidden sm:inline text-white">
                KopaWee<span className="text-emerald-500">+</span>
              </span>
            </Link>

            <Link 
              href="/"
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Landing Page</span>
            </Link>
          </div>

          {/* Center: Search bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search LGA clearance, listings, roomies, SOS..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900 text-white text-xs placeholder-slate-500 focus:outline-none focus:bg-slate-800 transition-all"
              />
            </div>
          </div>

          {/* Right: Role Switcher & User Control */}
          <div className="flex items-center gap-3">
            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all cursor-pointer touch-manipulation"
              >
                <Sparkles className="w-3.5 h-3.5 fill-white" />
                <span className="hidden sm:inline">Role:</span>
                <span className="font-black underline">{activeRoleObj.badge}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-black shadow-2xl z-50 p-2 space-y-1">
                  <div className="px-3 py-2 bg-slate-100 mb-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                      Switch Role View
                    </span>
                    <span className="text-xs text-slate-600">
                      Changes visible widgets across all dashboards.
                    </span>
                  </div>

                  {DASHBOARD_ROLES.map((r) => {
                    const isSelected = r.id === currentRole;
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          onRoleChange(r.id);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-all ${
                          isSelected 
                            ? "bg-emerald-100 font-bold text-black" 
                            : "hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <div>
                          <div className="font-black text-black flex items-center gap-1.5">
                            <span>{r.label}</span>
                            <span className="text-[9px] px-1.5 py-0.2 bg-black text-white font-mono">
                              {r.badge}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 block leading-tight">{r.subtitle}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notifications */}
            <button 
              type="button"
              className="p-2 text-slate-300 hover:text-white bg-slate-900 relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500" />
            </button>

            {/* User Profile avatar */}
            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-tight">Corper Chidi</span>
                <span className="text-[10px] text-emerald-400 font-mono">LA/24A/1042</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
