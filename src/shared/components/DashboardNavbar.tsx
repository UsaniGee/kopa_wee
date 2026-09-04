"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiBell, FiSearch, FiUser, FiChevronDown, FiLogOut, FiCheckCircle } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

const Bell = FiBell;
const Search = FiSearch;
const User = FiUser;
const ChevronDown = FiChevronDown;
const LogOut = FiLogOut;
const Sparkles = HiSparkles;
const CheckCircle2 = FiCheckCircle;

export interface RoleOption {
  id: string;
  label: string;
  badge: string;
  subtitle: string;
}

export const DASHBOARD_ROLES: RoleOption[] = [
  { id: "pcm", label: "Prospective Corper", badge: "PCM", subtitle: "Mobilization & Orientation Camp" },
  { id: "serving", label: "Serving Corps Member", badge: "Serving", subtitle: "Daily PPA, Clearance & CDS" },
  { id: "alumni", label: "Ex-Corps Member", badge: "POP", subtitle: "Career, Gigs & Alumni Network" },
  { id: "cds_exec", label: "CDS Executive", badge: "CDS Exec", subtitle: "Attendance, Projects & Dues" },
  { id: "ppa", label: "PPA Representative", badge: "Employer", subtitle: "Staff Attendance & Leave Requests" },
  { id: "nysc_official", label: "LGA NYSC Official", badge: "Inspector", subtitle: "Biometrics & Bi-Monthly Reports" }
];

interface DashboardNavbarProps {
  currentRole: string;
  onRoleChange: (roleId: string) => void;
}

export default function DashboardNavbar({ currentRole, onRoleChange }: DashboardNavbarProps) {
  const activeRoleObj = DASHBOARD_ROLES.find(r => r.id === currentRole) || DASHBOARD_ROLES[1];

  const [userName, setUserName] = useState<string>("");
  const [stateCode, setStateCode] = useState<string>("");

  React.useEffect(() => {
    // 1. Initial load from local storage
    const storedName = localStorage.getItem("kopawee_user_name");
    const storedEmail = localStorage.getItem("kopawee_user_email");
    const storedProfileStr = localStorage.getItem("kopawee_user_profile");
    const userId = localStorage.getItem("kopawee_user_id");

    if (storedName) {
      setUserName(storedName.startsWith("Corper ") ? storedName : `Corper ${storedName.split(" ")[0]}`);
    } else if (storedEmail) {
      const nameFromEmail = storedEmail.split("@")[0].replace(".", " ");
      setUserName(`Corper ${nameFromEmail}`);
    }

    if (storedProfileStr) {
      try {
        const prof = JSON.parse(storedProfileStr);
        if (prof.fullName || prof.displayName) {
          const name = prof.displayName || prof.fullName;
          setUserName(name.startsWith("Corper ") ? name : `Corper ${name.split(" ")[0]}`);
        }
        if (prof.stateCode) {
          setStateCode(prof.stateCode);
        }
      } catch (e) {}
    }

    // 2. Fetch live profile from database API
    if (userId) {
      fetch(`/api/users/me?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            const dbUser = data.data;
            if (dbUser.name) {
              const formattedName = dbUser.name.startsWith("Corper ")
                ? dbUser.name
                : `Corper ${dbUser.name.split(" ")[0]}`;
              setUserName(formattedName);
              localStorage.setItem("kopawee_user_name", dbUser.name);
            }
            if (dbUser.stateCode) {
              setStateCode(dbUser.stateCode);
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("kopawee_auth_token");
    localStorage.removeItem("kopawee_active_role");
    localStorage.removeItem("kopawee_user_profile");
    localStorage.removeItem("kopawee_user_name");
    localStorage.removeItem("kopawee_user_email");
    localStorage.removeItem("kopawee_user_id");
    window.location.href = "/auth?mode=signup";
  };

  return (
    <header className="bg-[#121815] text-white sticky top-0 z-40 border-b border-slate-800 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-bold text-xl tracking-widest uppercase font-display text-white">
                KOPA<span className="text-emerald-500 font-extrabold">'WEE</span>
              </span>
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search LGA clearance, listings, roomies, SOS..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-sans"
              />
            </div>
          </div>

          {/* Right: Read-only NYSC Status Badge & User Controls */}
          <div className="flex items-center gap-4">
            
            {/* Read-Only Status Badge */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-bold font-mono uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{activeRoleObj.label}</span>
            </div>

            {/* Notifications */}
            <button 
              type="button"
              className="p-2.5 text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-bold text-slate-300 uppercase tracking-wider transition-colors hover:bg-slate-800 hover:text-white cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-tight font-display">{userName || "Corps Member"}</span>
                <span className="text-[10px] text-emerald-400 font-mono">{stateCode || "LA/26A/1234"}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
