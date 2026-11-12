import { useCallback, useEffect, useState } from "react";

const PREFIX = "nexlock:v1:";

function read<T>(key: string, seed: T): T {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return seed;
    return JSON.parse(raw) as T;
  } catch {
    return seed;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore quota
  }
}

/**
 * Collection hook with localStorage persistence.
 * Provides list + CRUD helpers + a short simulated loading state on mount
 * so tables can show skeletons on first render.
 */
export function useCollection<T extends { id: string }>(key: string, seed: T[]) {
  const [items, setItems] = useState<T[]>(() => read<T[]>(key, seed));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    write(key, items);
  }, [key, items]);

  const add = useCallback((row: T) => setItems((p) => [row, ...p]), []);
  const update = useCallback(
    (id: string, patch: Partial<T>) =>
      setItems((p) => p.map((r) => (r.id === id ? { ...r, ...patch } : r))),
    [],
  );
  const remove = useCallback(
    (id: string) => setItems((p) => p.filter((r) => r.id !== id)),
    [],
  );
  const removeMany = useCallback(
    (ids: string[]) => {
      const s = new Set(ids);
      setItems((p) => p.filter((r) => !s.has(r.id)));
    },
    [],
  );
  const reset = useCallback(() => setItems(seed), [seed]);

  return { items, setItems, loading, add, update, remove, removeMany, reset };
}

export function nextId(prefix: string, existing: { id: string }[], pad = 5): string {
  const nums = existing
    .map((r) => Number(r.id.replace(/[^\d]/g, "")))
    .filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${prefix}-${String(next).padStart(pad, "0")}`;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function nowStamp() {
  return new Date().toISOString().slice(0, 16).replace("T", " ");
}
