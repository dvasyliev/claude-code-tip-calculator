# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

React 19 + TypeScript + Vite single-page tip calculator, used as course material for "Claude Code: AI Crash Course for Developers". Commits are named after course lessons (e.g. `S05. L10. ...`), so keep each change self-contained.

## Commands

```bash
npm run dev        # Vite dev server at http://localhost:5173
npm run build      # tsc -b (type-check) + vite build
npm run lint       # eslint .
npm test           # vitest in watch mode
npm run test:run   # vitest once

# Single file / single test
npx vitest run src/utils/validation.spec.ts
npx vitest run -t "test name substring"
```

Vitest runs in jsdom with `globals: true`; `src/vitest.setup.ts` registers `@testing-library/jest-dom` matchers. Tests are colocated as `*.spec.ts(x)` next to their source.

## Rules in `.claude/rules/`

- `structure.md`: where new and moved files go.
- `performance.md`: how pages load fast (streaming, lists in batches, few data requests, caching, media) and how to measure it (loads when working in `app/` or `lib/`). Measure every change to a page.
- `tests.md`: unit and end-to-end test conventions (loads when working on test files).
