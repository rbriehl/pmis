import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Created only when both env vars are present, so a missing/partial config never
// throws at import — the app simply falls back to the local (browser) backend.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      })
    : null;

// Which data backend the Discovery module uses.
// 'supabase' only when explicitly enabled AND the client is configured;
// otherwise 'local' (browser localStorage) — the safe default.
export const discoveryBackend: "local" | "supabase" =
  process.env.NEXT_PUBLIC_DISCOVERY_BACKEND === "supabase" && supabase ? "supabase" : "local";
