import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHistory, HISTORY_KEY } from "./use-history";
import type { HistoryEntry } from "./history.types";

const e1: HistoryEntry = {
  bill: 50,
  tip: 15,
  people: 2,
  totalPerPerson: 28.75,
};
const e2: HistoryEntry = { bill: 20, tip: 10, people: 1, totalPerPerson: 22 };

function stored() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "null") as unknown;
}

describe("useHistory", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("starts empty when storage is empty", () => {
    const { result } = renderHook(() => useHistory());
    expect(result.current.entries).toEqual([]);
  });

  it("loads saved entries from storage", () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([e1]));
    const { result } = renderHook(() => useHistory());
    expect(result.current.entries).toEqual([e1]);
  });

  it("add puts the newest entry first and persists it", () => {
    const { result } = renderHook(() => useHistory());
    act(() => result.current.add(e1));
    act(() => result.current.add(e2));
    expect(result.current.entries).toEqual([e2, e1]);
    expect(stored()).toEqual([e2, e1]);
  });

  it("keeps only the last 10", () => {
    const { result } = renderHook(() => useHistory());
    for (let bill = 1; bill <= 11; bill++) {
      act(() => result.current.add({ ...e1, bill }));
    }
    expect(result.current.entries).toHaveLength(10);
    expect(result.current.entries[0].bill).toBe(11);
    expect(result.current.entries[9].bill).toBe(2);
  });

  it("clear empties the list and storage", () => {
    const { result } = renderHook(() => useHistory());
    act(() => result.current.add(e1));
    act(() => result.current.clear());
    expect(result.current.entries).toEqual([]);
    expect(localStorage.getItem(HISTORY_KEY)).toBeNull();
  });

  it.each(["not json", '{"a":1}', "[1,null]", '[{"bill":null}]'])(
    "ignores corrupt storage: %s",
    (raw) => {
      localStorage.setItem(HISTORY_KEY, raw);
      const { result } = renderHook(() => useHistory());
      expect(result.current.entries).toEqual([]);
    },
  );

  it("survives a throwing setItem", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    const { result } = renderHook(() => useHistory());
    expect(() => act(() => result.current.add(e1))).not.toThrow();
    expect(result.current.entries).toEqual([e1]);
  });

  it("works in memory when storage cannot be read", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    const { result } = renderHook(() => useHistory());
    act(() => result.current.add(e2));
    expect(result.current.entries[0]).toEqual(e2);
  });
});
