import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Persist state to the browser's localStorage. Data never leaves the machine —
 * no server, no cloud DB — which keeps sensitive discovery material client-side.
 *
 * Backed by useSyncExternalStore so it hydrates cleanly under Next.js SSR: the
 * server snapshot is empty (seed is used), then the client re-reads localStorage
 * after hydration. A synthetic "storage" event notifies same-tab subscribers when
 * we write (the native event only fires in other tabs).
 */
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function useLocalStorage<T>(key: string, seed: T) {
  const store = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null, // server snapshot — fall back to seed during SSR
  );

  const value = useMemo<T>(() => {
    if (store == null) return seed;
    try {
      return JSON.parse(store) as T;
    } catch {
      return seed;
    }
  }, [store, seed]);

  const setValue = useCallback(
    (updater: T | ((prev: T) => T)) => {
      const raw = readRaw(key);
      const prev = raw == null ? seed : (JSON.parse(raw) as T);
      const next = typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // ignore quota/availability errors
      }
      window.dispatchEvent(new StorageEvent("storage", { key }));
    },
    [key, seed],
  );

  return [value, setValue] as const;
}
