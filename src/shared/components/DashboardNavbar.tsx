"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { FiBell, FiSearch, FiUser, FiLogOut, FiX, FiSettings, FiChevronDown } from "react-icons/fi";

const Bell = FiBell;
const Search = FiSearch;
const User = FiUser;
const LogOut = FiLogOut;
const X = FiX;

export interface RoleOption {
  id: string;
  label: string;
  badge: string;
  subtitle: string;
}

export const DASHBOARD_ROLES: RoleOption[] = [
  { id: "pcm", label: "Prospective Corper", badge: "PCM", subtitle: "Mobilization & Orientation Camp" },
  { id: "serving", label: "Serving Corps Member", badge: "SCM", subtitle: "Daily PPA, Clearance & CDS" },
  { id: "alumni", label: "Ex-Corps Member", badge: "POP", subtitle: "Career, Gigs & Alumni Network" },
  { id: "cds_exec", label: "CDS Executive", badge: "CDS Exec", subtitle: "Attendance, Projects & Dues" },
  { id: "ppa", label: "PPA Representative", badge: "Employer", subtitle: "Staff Attendance & Leave Requests" },
  { id: "nysc_official", label: "LGA NYSC Official", badge: "Inspector", subtitle: "Biometrics & Bi-Monthly Reports" },
];

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface DashboardNavbarProps {
  currentRole: string;
}

export default function DashboardNavbar({ currentRole }: DashboardNavbarProps) {
  const activeRoleObj = DASHBOARD_ROLES.find((r) => r.id === currentRole) || DASHBOARD_ROLES[1];

  const [userName, setUserName] = useState<string>("");
  const [stateCode, setStateCode] = useState<string>("");

  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const pollInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch unread notifications ─────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications?unread=false");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data.slice(0, 10));
        setUnreadCount(data.unreadCount ?? 0);
      }
    } catch {
      // Non-fatal — silently fail
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll every 60 seconds
    pollInterval.current = setInterval(fetchNotifications, 60_000);
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [fetchNotifications]);

  // Profile dropdown state
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Mark all read ──────────────────────────────────────────────────────────
  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // Non-fatal
    }
  };

  // ── User profile from localStorage ────────────────────────────────────────
  useEffect(() => {
    const storedName = localStorage.getItem("kopawee_user_name");
    const storedEmail = localStorage.getItem("kopawee_user_email");

    if (storedName) {
      setUserName(storedName.startsWith("Corper ") ? storedName : `Corper ${storedName.split(" ")[0]}`);
    } else if (storedEmail) {
      setUserName(`Corper ${storedEmail.split("@")[0].replace(".", " ")}`);
    }

    // Fetch live profile
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const dbUser = data.data;
          if (dbUser.name) {
            const formatted = dbUser.name.startsWith("Corper ") ? dbUser.name : `Corper ${dbUser.name.split(" ")[0]}`;
            setUserName(formatted);
            localStorage.setItem("kopawee_user_name", dbUser.name);
          }
          if (dbUser.stateCode) setStateCode(dbUser.stateCode);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("kopawee_active_role");
    localStorage.removeItem("kopawee_user_name");
    localStorage.removeItem("kopawee_user_email");
    localStorage.removeItem("kopawee_user_id");
    signOut({ callbackUrl: "/auth?mode=signin" });
  };

  const formatRelativeTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <header className="bg-[#121815] text-white sticky top-0 z-40 border-b border-slate-800 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-bold text-xl tracking-widest uppercase font-display text-white">
                KOPA<span className="text-emerald-500 font-extrabold">&apos;WEE</span>
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
                aria-label="Search"
              />
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-4">

            {/* Role badge — full label on sm+, short code on mobile */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-medium font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">{activeRoleObj.label}</span>
              <span className="sm:hidden">{activeRoleObj.badge}</span>
            </div>

            {/* ── Notification Bell ── */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                className="p-2.5 text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 relative cursor-pointer transition-colors"
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#121815] border border-slate-700 shadow-2xl z-50">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                    <span className="text-xs font-bold text-white">Notifications</span>
                    <div className="flex items-center gap-3">
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllRead}
                          className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300"
                        >
                          Mark all read
                        </button>
                      )}
                      <button type="button" onClick={() => setNotifOpen(false)} className="text-slate-400 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* List */}
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-slate-500">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 ${!n.isRead ? "bg-emerald-950/30" : ""}`}
                        >
                          <p className={`text-xs font-semibold mb-0.5 ${!n.isRead ? "text-white" : "text-slate-300"}`}>
                            {!n.isRead && <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 mb-0.5" />}
                            {n.title}
                          </p>
                          <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{n.message}</p>
                          <p className="text-[10px] text-slate-600 mt-1 font-mono">{formatRelativeTime(n.createdAt)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Logout (Desktop shortcut) */}
            <button
              type="button"
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-800 hover:text-white cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Profile Avatar & Interactive Menu */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 pl-2 border-l border-slate-800 cursor-pointer group text-left focus:outline-none"
                aria-label="User account menu"
              >
                <div className="w-8 h-8 bg-emerald-800 group-hover:bg-emerald-700 text-white flex items-center justify-center font-bold text-xs transition-colors">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-tight font-display group-hover:text-emerald-300 transition-colors">
                    {userName || "Corps Member"}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">{stateCode || "—"}</span>
                </div>
                <FiChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#121815] border border-slate-700 shadow-2xl z-50 py-1 divide-y divide-slate-800">
                  {/* Header Info */}
                  <div className="md:hidden px-4 py-3 bg-slate-900/50">
                    <p className="text-xs font-bold text-white font-display">{userName || "Corps Member"}</p>
                    <p className="text-[10px] text-emerald-400 font-mono mt-0.5">{stateCode ? `State Code: ${stateCode}` : "Mobilized Corps Member"}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-950 text-emerald-300 text-[9px] font-bold font-mono uppercase tracking-wider border border-emerald-800/80">
                      {activeRoleObj.badge} • {activeRoleObj.label}
                    </span>
                  </div>

                  {/* Account Settings link */}
                  <div className="py-1">
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-emerald-950/40 transition-colors"
                    >
                      <FiSettings className="w-4 h-4 text-emerald-400" />
                      <span>Account Settings</span>
                    </Link>
                  </div>

                  {/* Logout Action */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        handleLogout();
                      }}
                      className="md:hidden w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
