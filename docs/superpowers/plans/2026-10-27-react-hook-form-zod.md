# React Hook Form + Zod Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hand-written validators in `src/utils/validation.ts` with Zod schemas and move the tip calculator's field state into React Hook Form, with no visible change to how the fields behave.

**Architecture:** Zod schemas hold every rule: one object schema (`tipFormSchema`) holds the per-keystroke rules, and three value schemas hold the on-blur normalisation. `page.tsx` uses `useForm` with `zodResolver(tipFormSchema)`. Each field is a `Controller` around the existing `FieldInput`. Its `onChange` drops the keystroke unless the field's schema accepts it, and its `onBlur` writes the normalised value back with `setValue`. `useWatch` passes the values to the unchanged `useTipCalculator`.

**Tech Stack:** Next.js 16, React 19, TypeScript, react-hook-form 7.x, zod 4.x, @hookform/resolvers 6.x, Vitest, Playwright.

**Spec:** No `docs/` spec exists. The spec is the user's request and the answers they gave: keep the current UX (keystroke filtering, clamping on blur, no error messages) and add all three dependencies.

## Global Constraints

- Behaviour stays the same: every test in `src/app/page.spec.tsx` passes unchanged.
- Bill: input regex `/^\d*\.?\d{0,2}$/` with value ≤ 100000. On blur it is clamped to 0–100000 and formatted with `toFixed(2)`, and an invalid or empty value becomes `"0.00"`.
- Tip: input regex `/^\d*$/` with value ≤ 100. On blur it is clamped to 0–100, and an invalid or empty value becomes `"0"`.
- People: input regex `/^\d*$/` with value ≤ 50. On blur it is clamped to 2–50, and an invalid or empty value becomes `"2"`.
- `FieldInput`, `useTipCalculator`, and `DEFAULTS` stay unchanged.
- Don't wrap the fields in a `<form>` element, so pressing Enter can't submit and reload the page.
- Work on `main` and make one commit at the end, named after the change.

## Review Focus

- Bill `"1."` then blur becomes `"1.00"`. The test is in Task 1 (`billValueSchema.parse("1.")`).
- People typed as `"1"` then blur becomes `"2"`. The test is in Task 2 (page-level, add it if missing).
- Pressing Enter in a field leaves the values as they are and doesn't reload the page. The test is in Task 2 (page-level).
- Reset after edits restores the defaults in the inputs, not only in the totals. Existing page test.
- A rejected keystroke (`"101"` in Tip) keeps the previous value. The test is in Task 2 (page-level, add it if missing).

---

### Task 1: Zod schemas replace the validators

**Files:**

- Modify: `src/utils/validation.ts` (replace the whole file)
- Modify: `src/utils/validation.spec.ts` (keep every case, call the schemas instead)
- Modify: `package.json` / lockfile (`npm i zod`)

**Interfaces:**

- Produces:
  - `tipFormSchema: z.ZodObject<{ bill: z.ZodString; tip: z.ZodString; people: z.ZodString }>`. Each field is a `z.string()` with the input regex and a `.refine` for the maximum.
  - `type TipForm = z.infer<typeof tipFormSchema>` (`{ bill: string; tip: string; people: string }`)
  - `billValueSchema`, `tipValueSchema`, `peopleValueSchema`: each takes a `string` and returns the normalised `string`. They are built as `z.coerce.number().catch(<fallback>).transform(clamp + format)` with fallbacks 0, 0 and 2.

- [ ] **Step 1: Rewrite the spec.** Keep every existing `it` name and expected value, and change only the calls:
      `isValidBillInput(v)` → `tipFormSchema.shape.bill.safeParse(v).success` (likewise `.tip` and `.people`);
      `normalizeBill(v)` → `billValueSchema.parse(v)` (likewise tip and people). Add `it('"1." becomes "1.00"', () => expect(billValueSchema.parse("1.")).toBe("1.00"))`.
- [ ] **Step 2: Run** `npx vitest run src/utils/validation.spec.ts`. Expected: FAIL because the exports don't exist yet.
- [ ] **Step 3: Install and implement.** Run `npm i zod`, then replace the six functions with the exports above. Don't export the individual field schemas (knip flags unused exports), and reach them through `tipFormSchema.shape`.
- [ ] **Step 4: Run** `npx vitest run src/utils/validation.spec.ts`. Expected: all pass. (`page.tsx` breaks until Task 2, which is expected.)

### Task 2: The page uses React Hook Form

**Files:**

- Modify: `src/app/page.tsx`
- Modify: `src/app/page.spec.tsx` (only the additions listed below)
- Modify: `package.json` / lockfile (`npm i react-hook-form @hookform/resolvers`)

**Interfaces:**

- Consumes: `tipFormSchema`, `TipForm`, `billValueSchema`, `tipValueSchema`, `peopleValueSchema` from `@/utils/validation`.

- [ ] **Step 1: Add the missing page tests.** If they aren't already present, add them under `describe("App – invalid value handling")`:
  - `"rejects tip above 100 keystroke"`: type `"10"` then `"1"` in Tip, and expect the value `10`.
  - `"people below 2 normalizes to 2"`: open the split, clear People, type `"1"`, tab, and expect the value `2`.
  - `"Enter in bill keeps values"`: type `"50"` in Bill, press `{Enter}`, and expect Bill to have the value `"50"`.
- [ ] **Step 2: Run** `npx vitest run src/app/page.spec.tsx`. Expected: the new tests pass against the old implementation, because they pin the current behaviour. Then run `npx tsc -b` and expect it to fail on the removed imports, which shows the page needs migrating.
- [ ] **Step 3: Implement.** Run `npm i react-hook-form @hookform/resolvers`. In `App`:
  - `const { control, setValue, reset } = useForm<TipForm>({ resolver: zodResolver(tipFormSchema), defaultValues: DEFAULTS })`
  - `const { bill, tip, people } = useWatch({ control })` feeds `useTipCalculator`. (If `useWatch({ control })` returns partials, use `useWatch({ control, name: ["bill","tip","people"] })`.)
  - Wrap each `FieldInput` in a `Controller` with `onChange={(e) => { if (tipFormSchema.shape.<name>.safeParse(e.target.value).success) field.onChange(e.target.value); }}` and `onBlur={() => { setValue("<name>", <name>ValueSchema.parse(field.value)); field.onBlur(); }}`.
  - `handleReset` calls `reset(DEFAULTS)` and `setSplitOpen(false)`.
  - The People `Controller` unmounts when the split closes. Pass `shouldUnregister: false` (the default) so its value survives toggling.
- [ ] **Step 4: Run** `npx vitest run src/app/page.spec.tsx src/utils/validation.spec.ts` and `npx tsc -b`. Expected: all pass.
- [ ] **Step 5: Browser check.** Use the `playwright-cli` skill on `npm run dev` and check behaviour with `snapshot`:
  - Bill `100`, Tip `20`.
    - expect: Tip amount `20.00`, Total `120.00`.
  - Type `1.234` in Bill.
    - expect: Bill shows `1.23`.
  - Open the split, set People to `4`.
    - expect: Tip per person `5.00`, Total per person `30.00` (Bill 100, Tip 20).
  - Click Reset.
    - expect: Bill `0.00`, Tip `0`, split closed.
- [ ] **Step 6: Measure.** Time `/` with `curl -w "ttfb=%{time_starttransfer} total=%{time_total} size=%{size_download}"` twice (cold and warm), before the change (on `git stash` or from the first run) and after. Record the HTML size and the change in JS size from `npm run build` output.

### Task 3: End-to-end happy paths

**Files:**

- Create: `tests/tip-calculator/calculate-tip.spec.ts`, `tests/tip-calculator/split-bill.spec.ts`, `tests/tip-calculator/reset.spec.ts`

- [ ] **Step 1:** Start from `tests/seed.spec.ts` and write one test per file from the Task 2 Step 5 `expect:` lines, using `getByLabel` and `getByRole` only.
- [ ] **Step 2: Run** `npx playwright test tests/tip-calculator`. Expected: 3 passed.
- [ ] **Step 3: Run** `npm run test:e2e` and `npm run check`. Expected: everything is green.
- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Validate Forms with React Hook Form and Zod"
```
