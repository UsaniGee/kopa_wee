"use client";

import React, { createContext, useContext } from "react";
import { useSession } from "next-auth/react";

import { deriveRole, type RoleType } from "@/shared/utils/roleRoutes";

export type { RoleType };
export type RoleStatus = "loading" | "ready";

interface RoleContextType {
  currentRole: RoleType;
  roleStatus: RoleStatus;
}

const RoleContext = createContext<RoleContextType>({
  currentRole: "pcm",
  roleStatus: "loading",
});

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();

  const currentRole = deriveRole(
    (session?.user as Record<string, any>)?.nyscStatus,
    (session?.user as Record<string, any>)?.role
  );

  const roleStatus: RoleStatus = status === "loading" ? "loading" : "ready";

  return (
    <RoleContext.Provider value={{ currentRole, roleStatus }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
