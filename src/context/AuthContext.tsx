"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo credentials — replace with a real identity provider before production
const DEMO_USERS = [{ email: "admin@e-unify.ai", password: "pmis2025", name: "Admin" }];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  function login(email: string, password: string): boolean {
    const match = DEMO_USERS.find((u) => u.email === email && u.password === password);
    if (match) {
      setUser({ name: match.name, email: match.email });
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
