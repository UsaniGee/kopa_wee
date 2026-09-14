"use client";

import React, { createContext, useContext } from "react";
import { useSession } from "next-auth/react";

export type RoleType = "pcm" | "serving" | "cds_exec" | "ppa" | "nysc_official" | "alumni";
export type RoleStatus = "loading" | "ready";

function deriveRole(nyscStatus?: string, legacyRole?: string): RoleType {
  if (legacyRole === "CDS_EXEC") return "cds_exec";
  if (legacyRole === "EMPLOYER") return "ppa";
  if (legacyRole === "LGA_INSPECTOR") return "nysc_official";
  if (nyscStatus === "ALUMNI") return "alumni";
  if (nyscStatus === "SERVING") return "serving";
  return "pcm";
}

interface RoleContextType {
  currentRole: RoleType;
  roleStatus: RoleStatus;
  setRole: (role: RoleType) => void; // no-op — kept for compat
}

const RoleContext = createContext<RoleContextType>({
  currentRole: "pcm",
  roleStatus: "loading",
  setRole: () => {},
});

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();

  const currentRole = deriveRole(
    (session?.user as Record<string, string | undefined>)?.nyscStatus,
    (session?.user as Record<string, string | undefined>)?.role
  );

  const roleStatus: RoleStatus = status === "loading" ? "loading" : "ready";

  return (
    <RoleContext.Provider value={{ currentRole, roleStatus, setRole: () => {} }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
