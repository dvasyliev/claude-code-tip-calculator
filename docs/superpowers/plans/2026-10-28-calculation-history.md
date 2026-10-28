# Calculation History Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A Save button stores the current calculation (bill, tip, people, total per person); the last 10 are listed under the form with a Clear button and survive a page reload.

**Architecture:** A `useHistory` hook owns the list and mirrors it to `localStorage` through `useSyncExternalStore` (server snapshot is empty, so SSR and hydration match). A presentational `HistoryList` renders it. Both are used only by the home route, so they live in `src/app/history/` (per `structure.md`). `page.tsx` adds a Save button next to Reset and renders `HistoryList` in a second card below the form card.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS modules, Vitest + Testing Library, Playwright.

**Spec:** The user's request (no doc in `docs/`): "save each result (bill, tip, people, total per person) and show the last 10 under the form with a Clear button. Keep the history after a page reload." Decisions taken with the user:

- An entry is added by a new **Save** button (no auto-save).
- When the split section is closed, the entry stores `people = 1` and `totalPerPerson = total`.

## Global Constraints

- At most **10** entries kept, newest first; the 11th save drops the oldest.
- Storage: `localStorage` key `"tip-calculator-history"`, value = JSON array of `HistoryEntry`.
- Copy: button labels `Save` and `Clear`; section heading `History`.
- Work on `main`, no branches. Commit messages via the `committing-with-commitlint` skill.

## Review Focus

1. Corrupt or non-array JSON under the storage key → history shows empty, page does not crash. (Task 1 test)
2. `localStorage.setItem` throws (quota / private mode) → Save keeps the in-memory list, no crash. (Task 1 test)
3. SSR/hydration: server renders no history; no hydration warning after reload with saved entries. (Task 4 browser check)
4. Saving with split closed while the hidden people field holds `"2"` → entry has `people: 1`. (Task 3 test)
5. Values are stored as numbers, not the raw form strings (`"50."` → `50`). (Task 3 test)

---

### Task 1: `useHistory` hook

**Files:**

- Create: `src/app/history/history.types.ts`
- Create: `src/app/history/use-history.ts`
- Test: `src/app/history/use-history.spec.ts`

**Interfaces:**

- Produces:
  - `interface HistoryEntry { bill: number; tip: number; people: number; totalPerPerson: number }`
  - `useHistory(): { entries: HistoryEntry[]; add(entry: HistoryEntry): void; clear(): void }`
  - `const HISTORY_KEY = "tip-calculator-history"`, `const HISTORY_LIMIT = 10`

- [ ] **Step 1: Write the failing tests** (`renderHook`, `act`; `beforeEach(() => localStorage.clear())`)
  - `starts empty when storage is empty` → `entries` equals `[]`.
  - `loads saved entries from storage` → pre-set key to `[e1]`, `entries` equals `[e1]`.
  - `add puts the newest entry first and persists it` → add e1, add e2: `entries` equals `[e2, e1]`, `JSON.parse(localStorage.getItem(HISTORY_KEY))` equals `[e2, e1]`.
  - `keeps only the last 10` → add 11 entries with `bill: 1..11`: length 10, `entries[0].bill === 11`, `entries[9].bill === 2`.
  - `clear empties the list and storage` → `entries` `[]`, `localStorage.getItem(HISTORY_KEY)` is `null`.
  - `ignores corrupt storage` → key set to `"not json"` and to `'{"a":1}'`: `entries` equals `[]`.
  - `survives a throwing setItem` → `vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("quota") })`; `add(e1)` does not throw and `entries` equals `[e1]`.

- [ ] **Step 2: Run** `npx vitest run src/app/history/use-history.spec.ts` → FAIL (module not found).

- [ ] **Step 3: Implement** with `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)`:
  - Module-level `let entries: HistoryEntry[] | null` cache plus a `Set` of listeners. `getSnapshot` reads/parses storage once (bad JSON or non-array → `[]`) and returns the cached array, so the reference is stable. `getServerSnapshot` returns a module constant `[]`.
  - `add`/`clear` update the cache, write storage inside `try/catch` (`clear` uses `removeItem`), then notify listeners.
  - Tests need a fresh cache per test: export nothing extra; instead reset the cache when `subscribe` gets its first listener (re-read storage), so each `renderHook` starts from storage.

- [ ] **Step 4: Run** the same command → PASS.

- [ ] **Step 5: Commit** (`committing-with-commitlint`).

### Task 2: `HistoryList` component

**Files:**

- Create: `src/app/history/history-list.tsx`, `src/app/history/history-list.module.css`
- Test: `src/app/history/history-list.spec.tsx`

**Interfaces:**

- Consumes: `HistoryEntry` (Task 1), `formatCurrency` from `@/utils/format`.
- Produces: `HistoryList({ entries, onClear }: { entries: HistoryEntry[]; onClear: () => void })`.

- [ ] **Step 1: Write the failing tests**
  - `renders nothing when empty` → `container` is empty.
  - `renders heading, one list item per entry` → 2 entries: `getByRole("heading", { name: "History" })`, `getAllByRole("listitem")` length 2.
  - `shows the entry values` → `{ bill: 50, tip: 15, people: 2, totalPerPerson: 28.75 }` → item text contains `50.00`, `15%`, `2 people`, `28.75`.
  - `shows "1 person" for a single person` → item contains `1 person`.
  - `Clear calls onClear` → click `getByRole("button", { name: "Clear" })`, mock called once.

- [ ] **Step 2: Run** `npx vitest run src/app/history/history-list.spec.tsx` → FAIL.

- [ ] **Step 3: Implement.** `<section>` with header row (`<h2>History</h2>` + Clear button) and `<ol>`; item text: `Bill {formatCurrency(bill)} · Tip {tip}% · {people} {people === 1 ? "person" : "people"} · {formatCurrency(totalPerPerson)} each`. Styles match `page.module.css` (card colours `#111827`/`#6b7280`, borders `#e5e7eb`).

- [ ] **Step 4: Run** the same command → PASS.

- [ ] **Step 5: Commit.**

### Task 3: Save button and history on the page

**Files:**

- Modify: `src/app/page.tsx` (button row near the Reset button, new card after `.card`)
- Modify: `src/app/page.module.css` (`.actions` row, `.save-btn`)
- Test: `src/app/page.spec.tsx` (new `describe("App – history")`)

**Interfaces:**

- Consumes: `useHistory` (Task 1), `HistoryList` (Task 2), `useTipCalculator` results already in `page.tsx`.

- [ ] **Step 1: Write the failing tests** (`beforeEach(() => localStorage.clear())`)
  - `Save adds the current calculation` → type bill `50`, tip `15`, open split (people stays `2`), click Save → one listitem containing `50.00`, `15%`, `2 people`, `28.75` (total 57.50 / 2).
  - `Save without split stores 1 person and the full total` → bill `50`, tip `15`, split closed, Save → item contains `1 person` and `57.50`.
  - `Clear removes all entries` → Save, then Clear → no `History` heading.
  - `history is still there after remount` → Save, `unmount()`, render again → one listitem.

- [ ] **Step 2: Run** `npx vitest run src/app/page.spec.tsx` → new tests FAIL.

- [ ] **Step 3: Implement.** `handleSave` calls `add({ bill: parseFloat(bill) || 0, tip: parseFloat(tip) || 0, people: splitOpen ? Math.max(1, parseInt(people) || 1) : 1, totalPerPerson: splitOpen ? totalPerPerson : total })`. Save and Reset sit in one `.actions` row (each `flex: 1`); Save styled as the primary button. Render `<HistoryList entries={entries} onClear={clear} />` after the form card. `HistoryList` returns `null` when empty and carries its own card styles in `history-list.module.css`.

- [ ] **Step 4: Run** `npx vitest run src/app` → all PASS.

- [ ] **Step 5: Commit.**

### Task 4: Browser check, measurements, e2e

**Files:**

- Create: `tests/history/save-and-reload.spec.ts`, `tests/history/clear.spec.ts`

Before Task 1, record the "before" numbers: `curl -s -o /dev/null -w "ttfb=%{time_starttransfer} total=%{time_total} size=%{size_download}\n" http://localhost:5173/` twice.

Scenario A — save and reload:

1. Open `/`, fill Bill `50`, Tip `15`, click Save.
   - expect: a `History` heading and one item `Bill 50.00 · Tip 15% · 1 person · 57.50 each`.
2. Open the split, keep 2 people, click Save.
   - expect: two items, the first `… 2 people · 28.75 each`.
3. Reload the page.
   - expect: the same two items, in the same order; no hydration error in the console.

Scenario B — clear:

1. Save one calculation, click Clear.
   - expect: no `History` heading, no items.
2. Reload.
   - expect: still no history.

- [ ] **Step 1:** Drive both scenarios with `playwright-cli` (snapshots, one element screenshot of the history card at 1280×800).
- [ ] **Step 2:** Measure `/` cold and warm again; compare with the before numbers.
- [ ] **Step 3:** Write the two e2e specs from the `- expect:` lines (`getByRole`/`getByLabel` only); run `npx playwright test tests/history`.
- [ ] **Step 4:** `npm run test:e2e` once → all PASS. Commit.
