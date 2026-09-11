"use client";

import React, { createContext, useContext } from "react";
import { useSession } from "next-auth/react";

export type RoleType = "pcm" | "serving" | "cds_exec" | "ppa" | "nysc_official" | "alumni";

function deriveRole(nyscStatus?: string, legacyRole?: string): RoleType {
  // Special organisational roles override lifecycle status
  if (legacyRole === "CDS_EXEC") return "cds_exec";
  if (legacyRole === "EMPLOYER") return "ppa";
  if (legacyRole === "LGA_INSPECTOR") return "nysc_official";
  // NYSC lifecycle progression (non-reversible)
  if (nyscStatus === "ALUMNI") return "alumni";
  if (nyscStatus === "SERVING") return "serving";
  return "pcm";
}

interface RoleContextType {
  currentRole: RoleType;
  setRole: (role: RoleType) => void; // no-op — role is derived from session
}

const RoleContext = createContext<RoleContextType>({
  currentRole: "pcm",
  setRole: () => {},
});

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const currentRole = deriveRole(
    (session?.user as any)?.nyscStatus,
    (session?.user as any)?.role
  );

  return (
    <RoleContext.Provider value={{ currentRole, setRole: () => {} }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
