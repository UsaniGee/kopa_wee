"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type RoleType = "pcm" | "serving" | "cds_exec" | "ppa" | "nysc_official" | "alumni";

interface RoleContextType {
  currentRole: RoleType;
  setRole: (role: RoleType) => void;
}

const RoleContext = createContext<RoleContextType>({
  currentRole: "pcm",
  setRole: () => {},
});

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<RoleType>("pcm");

  useEffect(() => {
    const savedRole = localStorage.getItem("kopawee_active_role") as RoleType;
    if (savedRole) {
      setCurrentRoleState(savedRole);
    }
  }, []);

  const setRole = (role: RoleType) => {
    setCurrentRoleState(role);
    localStorage.setItem("kopawee_active_role", role);
  };

  return (
    <RoleContext.Provider value={{ currentRole, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
