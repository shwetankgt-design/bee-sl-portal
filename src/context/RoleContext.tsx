import { createContext, useContext, useState, type ReactNode } from "react";

export type Role = "manufacturer" | "consumer" | "officer";

export const ROLE_LABELS: Record<Role, string> = {
  manufacturer: "Manufacturer",
  consumer: "Consumer",
  officer: "BEE Officer",
};

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("manufacturer");
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within a RoleProvider");
  return ctx;
}
