"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DashboardNavbar from "@/shared/components/DashboardNavbar";
import { RoleProvider, useRole } from "@/shared/context/RoleContext";
import { FiGrid, FiCalendar, FiShoppingBag, FiHome, FiAlertOctagon, FiBriefcase, FiUsers, FiSettings } from "react-icons/fi";

const LayoutDashboard = FiGrid;
const CalendarCheck = FiCalendar;
const ShoppingBag = FiShoppingBag;
const Home = FiHome;
const ShieldAlert = FiAlertOctagon;
const Briefcase = FiBriefcase;
const Users = FiUsers;
const Settings = FiSettings;

export const ROLE_NAV_ITEMS: Record<string, { href: string; label: string; icon: React.ElementType }[]> = {
  pcm: [
    { href: "/dashboard", label: "PCM Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/companion", label: "Camp Guide & Packing", icon: CalendarCheck },
    { href: "/dashboard/marketplace", label: "Pre-Camp Gear Market", icon: ShoppingBag },
    { href: "/dashboard/safety", label: "Travel & Route Safety", icon: ShieldAlert },
    { href: "/dashboard/settings", label: "Account Settings", icon: Settings },
  ],
  serving: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/companion", label: "Monthly LGA Clearance", icon: CalendarCheck },
    { href: "/dashboard/marketplace", label: "Corper Market", icon: ShoppingBag },
    { href: "/dashboard/accommodation", label: "Lodges & Roomies", icon: Home },
    { href: "/dashboard/safety", label: "Safety SOS", icon: ShieldAlert },
    { href: "/dashboard/workplace", label: "PPA Logbook", icon: Briefcase },
    { href: "/dashboard/community", label: "CDS Hub", icon: Users },
    { href: "/dashboard/settings", label: "Account Settings", icon: Settings },
  ],
  cds_exec: [
    { href: "/dashboard", label: "CDS Executive Hub", icon: LayoutDashboard },
    { href: "/dashboard/community", label: "Attendance, Projects & Dues", icon: Users },
    { href: "/dashboard/safety", label: "Group Safety SOS", icon: ShieldAlert },
    { href: "/dashboard/settings", label: "Account Settings", icon: Settings },
  ],
  ppa: [
    { href: "/dashboard", label: "PPA Employer Portal", icon: LayoutDashboard },
    { href: "/dashboard/workplace", label: "Corper Staff & Leave Requests", icon: Briefcase },
    { href: "/dashboard/settings", label: "Account Settings", icon: Settings },
  ],
  nysc_official: [
    { href: "/dashboard", label: "LGA Inspector Portal", icon: LayoutDashboard },
    { href: "/dashboard/companion", label: "Biometric Clearance Portal", icon: CalendarCheck },
    { href: "/dashboard/settings", label: "Account Settings", icon: Settings },
  ],
  alumni: [
    { href: "/dashboard", label: "Ex-Corper Hub", icon: LayoutDashboard },
    { href: "/dashboard/marketplace", label: "POP Household Deals", icon: ShoppingBag },
    { href: "/dashboard/workplace", label: "Career & Gigs", icon: Briefcase },
    { href: "/dashboard/settings", label: "Account Settings", icon: Settings },
  ],
};

import { useSession } from "next-auth/react";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentRole, roleStatus } = useRole();
  const { status } = useSession();

  const activeNavItems = ROLE_NAV_ITEMS[currentRole] || ROLE_NAV_ITEMS.serving;

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push(`/auth?mode=signin&redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    const isSettingsPage = pathname === "/dashboard/settings";
    const isPathValidForRole = isSettingsPage || activeNavItems.some(item => item.href === pathname);
    if (!isPathValidForRole) {
      const firstTabHref = activeNavItems[0]?.href || "/dashboard";
      router.push(firstTabHref);
    }
  }, [status, currentRole, pathname, activeNavItems, router]);

  // Render skeleton while session resolves — prevents PCM nav flash for SCM users
  if (roleStatus === "loading") {
    return (
      <div className="min-h-screen bg-[#eaf5ed] dark:bg-[#0a0f0d] flex flex-col font-sans">
        {/* Dark navbar shell — matches real navbar height so layout doesn't jump */}
        <div className="h-16 bg-[#121815] border-b border-slate-800 sticky top-0 z-40" />
        {/* Sub-nav shell */}
        <div className="h-12 bg-[#dcece1] dark:bg-[#121a16] border-b border-slate-300/60 dark:border-slate-800 sticky top-16 z-30" />
        {/* Blank content — no flash of wrong role */}
        <div className="flex-1" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eaf5ed] dark:bg-[#0a0f0d] text-[#121815] dark:text-slate-100 flex flex-col font-sans transition-colors duration-500">
      {/* Top Navbar */}
      <DashboardNavbar currentRole={currentRole} />

      {/* Module Sub-Navigation Bar */}
      <div className="bg-[#dcece1] dark:bg-[#121a16] border-b border-slate-300/60 dark:border-slate-800 sticky top-16 z-30 overflow-x-auto">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <nav className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
            {activeNavItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComp = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-4 py-2 text-xs font-bold font-display uppercase tracking-wider whitespace-nowrap transition-all border ${
                    isActive
                      ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                      : "bg-[#eaf5ed] dark:bg-[#0a0f0d] text-slate-700 dark:text-slate-300 border-slate-300/60 dark:border-slate-800 hover:border-emerald-600"
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? "text-emerald-300" : "text-slate-500 dark:text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 sm:px-10 lg:px-16 py-10">
        {children}
      </main>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#121815] text-white z-40 px-3 py-2 flex items-center justify-around border-t border-slate-800">
        {activeNavItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          const IconComp = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2 text-[10px] font-bold font-display tracking-wider ${
                isActive ? "text-emerald-400 font-extrabold" : "text-slate-400"
              }`}
            >
              <IconComp className="w-4 h-4 mb-0.5" />
              <span className="truncate max-w-[72px] text-[9px] uppercase">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </RoleProvider>
  );
}
