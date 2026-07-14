"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase, discoveryBackend } from "@/lib/supabase";

type User = { name: string; email: string } | null;

interface AuthContextType {
  user: User;
  mode: "local" | "supabase";
  initializing: boolean;
  login: (email: string, password: string) => boolean; // local (demo) only
  sendMagicLink: (email: string) => Promise<{ ok: boolean; error?: string }>; // supabase only
  logout: () => void | Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo credentials — used only in local mode. Replace with a real identity provider.
const DEMO_USERS = [{ email: "admin@e-unify.ai", password: "pmis2025", name: "Admin" }];

function userFromEmail(email: string | undefined | null): User {
  if (!email) return null;
  return { name: email.split("@")[0], email };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [initializing, setInitializing] = useState(discoveryBackend === "supabase");

  // In supabase mode, hydrate from the current session and follow auth changes.
  useEffect(() => {
    if (discoveryBackend !== "supabase" || !supabase) return;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(userFromEmail(data.session?.user?.email));
      setInitializing(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(userFromEmail(session?.user?.email));
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  function login(email: string, password: string): boolean {
    const match = DEMO_USERS.find((u) => u.email === email && u.password === password);
    if (match) {
      setUser({ name: match.name, email: match.email });
      return true;
    }
    return false;
  }

  async function sendMagicLink(email: string): Promise<{ ok: boolean; error?: string }> {
    if (!supabase) return { ok: false, error: "Login is not configured." };
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}${base}` },
    });
    return error ? { ok: false, error: error.message } : { ok: true };
  }

  async function logout() {
    if (discoveryBackend === "supabase" && supabase) await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, mode: discoveryBackend, initializing, login, sendMagicLink, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
