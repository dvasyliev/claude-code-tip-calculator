# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Next.js 16 (App Router) + React 19 + TypeScript single-page tip calculator, used as course material for "Claude Code: AI Crash Course for Developers". Commits are named after course lessons (e.g. `S05. L10. ...`), so keep each change self-contained.

## Commands

```bash
npm run dev        # Next.js dev server at http://localhost:5173
npm run build      # next build (includes type-check)
npm start          # serve the production build at http://localhost:5173
npm run lint       # eslint .
npm test           # vitest in watch mode
npm run test:run   # vitest once

# Single file / single test
npx vitest run src/utils/validation.spec.ts
npx vitest run -t "test name substring"
```

The page lives in `src/app/page.tsx` (client component) with `src/app/layout.tsx` as root layout; shared code is imported via the `@/` alias (`src/*`). Vitest (`vitest.config.mts`) runs in jsdom with `globals: true`; `src/vitest.setup.ts` registers `@testing-library/jest-dom` matchers. Tests are colocated as `*.spec.ts(x)` next to their source.

## Rules in `.claude/rules/`

- `structure.md`: where new and moved files go.
- `performance.md`: how pages load fast (streaming, lists in batches, few data requests, caching, media) and how to measure it (loads when working in `app/` or `lib/`). Measure every change to a page.
- `tests.md`: unit and end-to-end test conventions (loads when working on test files).
