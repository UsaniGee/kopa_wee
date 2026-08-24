"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DashboardNavbar from "@/shared/components/DashboardNavbar";
import { RoleProvider, useRole } from "@/shared/context/RoleContext";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  ShoppingBag, 
  Home, 
  ShieldAlert, 
  Briefcase, 
  Users 
} from "lucide-react";

export const ROLE_NAV_ITEMS: Record<string, { href: string; label: string; icon: React.ElementType }[]> = {
  pcm: [
    { href: "/dashboard", label: "PCM Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/companion", label: "Camp Guide & Packing", icon: CalendarCheck },
    { href: "/dashboard/marketplace", label: "Pre-Camp Gear Market", icon: ShoppingBag },
    { href: "/dashboard/safety", label: "Travel & Route Safety", icon: ShieldAlert },
  ],
  serving: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/companion", label: "Monthly LGA Clearance", icon: CalendarCheck },
    { href: "/dashboard/marketplace", label: "Corper Market", icon: ShoppingBag },
    { href: "/dashboard/accommodation", label: "Lodges & Roomies", icon: Home },
    { href: "/dashboard/safety", label: "Safety SOS", icon: ShieldAlert },
    { href: "/dashboard/workplace", label: "PPA Logbook", icon: Briefcase },
    { href: "/dashboard/community", label: "CDS Hub", icon: Users },
  ],
  cds_exec: [
    { href: "/dashboard", label: "CDS Executive Hub", icon: LayoutDashboard },
    { href: "/dashboard/community", label: "Attendance, Projects & Dues", icon: Users },
    { href: "/dashboard/safety", label: "Group Safety SOS", icon: ShieldAlert },
  ],
  ppa: [
    { href: "/dashboard", label: "PPA Employer Portal", icon: LayoutDashboard },
    { href: "/dashboard/workplace", label: "Corper Staff & Leave Requests", icon: Briefcase },
  ],
  nysc_official: [
    { href: "/dashboard", label: "LGA Inspector Portal", icon: LayoutDashboard },
    { href: "/dashboard/companion", label: "Biometric Clearance Portal", icon: CalendarCheck },
  ],
  alumni: [
    { href: "/dashboard", label: "Ex-Corper Hub", icon: LayoutDashboard },
    { href: "/dashboard/marketplace", label: "POP Household Deals", icon: ShoppingBag },
    { href: "/dashboard/workplace", label: "Career & Gigs", icon: Briefcase },
  ],
};

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentRole, setRole } = useRole();

  const activeNavItems = ROLE_NAV_ITEMS[currentRole] || ROLE_NAV_ITEMS.serving;

  // Auto-redirect if current pathname is invalid for the active role
  useEffect(() => {
    const isPathValidForRole = activeNavItems.some(item => item.href === pathname);
    if (!isPathValidForRole) {
      const firstTabHref = activeNavItems[0]?.href || "/dashboard";
      router.push(firstTabHref);
    }
  }, [currentRole, pathname, activeNavItems, router]);

  const handleRoleChange = (newRole: string) => {
    setRole(newRole as any);
    const newRoleItems = ROLE_NAV_ITEMS[newRole] || ROLE_NAV_ITEMS.serving;
    const firstTabHref = newRoleItems[0]?.href || "/dashboard";
    router.push(firstTabHref);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <DashboardNavbar 
        currentRole={currentRole} 
        onRoleChange={handleRoleChange} 
      />

      {/* Module sub-navigation bar (strictly filtered by role) */}
      <div className="bg-white sticky top-16 z-30 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 py-2 overflow-x-auto no-scrollbar">
            {activeNavItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComp = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-bold whitespace-nowrap transition-all touch-manipulation ${
                    isActive
                      ? "bg-black text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Mobile Sticky Bottom Navigation Bar (strictly filtered by role) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black text-white z-40 px-2 py-1.5 flex items-center justify-around">
        {activeNavItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          const IconComp = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2 text-[10px] font-bold touch-manipulation ${
                isActive ? "text-emerald-400 font-black" : "text-slate-400"
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span className="truncate max-w-[72px] text-[9px]">{item.label.split(" ")[0]}</span>
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
