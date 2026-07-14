"use client";
import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { supabase, discoveryBackend } from "@/lib/supabase";
import type { ArtifactConfig, RowRecord } from "@/components/pages/discovery/config";

// App field names are camelCase; DB columns are snake_case. Deterministic
// conversion with one special case (`function` is a SQL keyword -> unit_function).
function columnFor(name: string): string {
  if (name === "function") return "unit_function";
  return name.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase());
}

type DbRow = Record<string, unknown>;
type Values = Record<string, string | number>;

function toApp(config: ArtifactConfig, db: DbRow): RowRecord {
  const row: RowRecord = { id: String(db.id), isSample: Boolean(db.is_sample) };
  for (const f of config.fields) {
    const v = db[columnFor(f.name)];
    if (v !== null && v !== undefined) row[f.name] = v as string | number;
  }
  return row;
}

// Only the editable field columns (not owner_id / is_sample / id).
function fieldsToDb(config: ArtifactConfig, values: Values): DbRow {
  const row: DbRow = {};
  for (const f of config.fields) {
    if (values[f.name] !== undefined) row[columnFor(f.name)] = values[f.name];
  }
  return row;
}

export interface RecordsApi {
  rows: RowRecord[];
  loading: boolean;
  error: string | null;
  add: (values: Values) => Promise<void>;
  update: (id: string, values: Values) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

/**
 * Records for one Discovery artifact. Uses browser localStorage by default, or a
 * per-user Supabase table when NEXT_PUBLIC_DISCOVERY_BACKEND=supabase. Both hooks
 * are always instantiated (rules-of-hooks); only the selected one does real work.
 */
export function useRecords(config: ArtifactConfig): RecordsApi {
  // --- local backend (browser) ---
  const [localRows, setLocalRows] = useLocalStorage<RowRecord[]>(config.storageKey, config.seed);

  // --- supabase backend ---
  const [remoteRows, setRemoteRows] = useState<RowRecord[]>([]);
  const [loading, setLoading] = useState(discoveryBackend === "supabase");
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (discoveryBackend !== "supabase" || !supabase) return;
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user?.id;
    if (!uid) {
      setRemoteRows([]);
      setLoading(false);
      return;
    }
    const { data, error: selErr } = await supabase
      .from(config.table)
      .select("*")
      .order("created_at", { ascending: true });
    if (selErr) {
      setError(selErr.message);
      setLoading(false);
      return;
    }
    let dbRows = (data ?? []) as DbRow[];
    // First login for this user: seed their workspace with the sample rows.
    if (dbRows.length === 0) {
      const seed = config.seed.map((s) => ({
        ...fieldsToDb(config, s as unknown as Values),
        owner_id: uid,
        is_sample: true,
      }));
      const { data: inserted, error: seedErr } = await supabase
        .from(config.table)
        .insert(seed)
        .select("*");
      if (seedErr) {
        setError(seedErr.message);
        setLoading(false);
        return;
      }
      dbRows = (inserted ?? []) as DbRow[];
    }
    setRemoteRows(dbRows.map((r) => toApp(config, r)));
    setError(null);
    setLoading(false);
  }, [config]);

  useEffect(() => {
    if (discoveryBackend !== "supabase" || !supabase) return;
    // onAuthStateChange fires an INITIAL_SESSION event on subscribe, which covers
    // the first load — so we never call setState synchronously inside the effect.
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      reload();
    });
    return () => sub.subscription.unsubscribe();
  }, [reload]);

  const add = useCallback(
    async (values: Values) => {
      if (discoveryBackend !== "supabase" || !supabase) {
        const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `row-${Date.now()}`;
        setLocalRows((prev) => [...prev, { id, isSample: false, ...values }]);
        return;
      }
      const { data: sessionData } = await supabase.auth.getSession();
      const uid = sessionData.session?.user?.id;
      if (!uid) return;
      const { data, error: insErr } = await supabase
        .from(config.table)
        .insert({ ...fieldsToDb(config, values), owner_id: uid, is_sample: false })
        .select("*")
        .single();
      if (insErr) {
        setError(insErr.message);
        return;
      }
      setRemoteRows((prev) => [...prev, toApp(config, data as DbRow)]);
    },
    [config, setLocalRows],
  );

  const update = useCallback(
    async (id: string, values: Values) => {
      if (discoveryBackend !== "supabase" || !supabase) {
        setLocalRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...values } : r)));
        return;
      }
      const { data, error: updErr } = await supabase
        .from(config.table)
        .update(fieldsToDb(config, values))
        .eq("id", id)
        .select("*")
        .single();
      if (updErr) {
        setError(updErr.message);
        return;
      }
      setRemoteRows((prev) => prev.map((r) => (r.id === id ? toApp(config, data as DbRow) : r)));
    },
    [config, setLocalRows],
  );

  const remove = useCallback(
    async (id: string) => {
      if (discoveryBackend !== "supabase" || !supabase) {
        setLocalRows((prev) => prev.filter((r) => r.id !== id));
        return;
      }
      const { error: delErr } = await supabase.from(config.table).delete().eq("id", id);
      if (delErr) {
        setError(delErr.message);
        return;
      }
      setRemoteRows((prev) => prev.filter((r) => r.id !== id));
    },
    [config, setLocalRows],
  );

  if (discoveryBackend === "supabase") {
    return { rows: remoteRows, loading, error, add, update, remove };
  }
  return { rows: localRows, loading: false, error: null, add, update, remove };
}
