import { useSyncExternalStore } from "react";
import type { HistoryEntry } from "./history.types";

export const HISTORY_KEY = "tip-calculator-history";
const HISTORY_LIMIT = 10;

const EMPTY: HistoryEntry[] = [];
const listeners = new Set<() => void>();
// Last raw storage value and its parsed entries, so the snapshot stays stable.
let raw: string | null = null;
let entries: HistoryEntry[] = EMPTY;

function isEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (["bill", "tip", "people", "totalPerPerson"] as const).every(
    (key) => typeof entry[key] === "number" && Number.isFinite(entry[key]),
  );
}

function parse(value: string | null): HistoryEntry[] {
  try {
    const parsed: unknown = JSON.parse(value ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isEntry) : EMPTY;
  } catch {
    return EMPTY;
  }
}

// Storage can be blocked entirely; reading it then throws.
function read() {
  try {
    return localStorage.getItem(HISTORY_KEY);
  } catch {
    return null;
  }
}

function getSnapshot() {
  const current = read();
  if (current !== raw) {
    raw = current;
    entries = parse(current);
  }
  return entries;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Keeps the in-memory list even when storage refuses the write.
function save(next: HistoryEntry[]) {
  entries = next;
  try {
    if (next.length) localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    else localStorage.removeItem(HISTORY_KEY);
  } catch {}
  raw = read();
  listeners.forEach((listener) => listener());
}

export function useHistory() {
  const current = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  return {
    entries: current,
    add: (entry: HistoryEntry) =>
      save([entry, ...getSnapshot()].slice(0, HISTORY_LIMIT)),
    clear: () => save(EMPTY),
  };
}
