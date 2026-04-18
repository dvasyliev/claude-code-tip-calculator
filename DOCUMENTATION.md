# Tip Calculator — Documentation

## Project Overview

A React-based tip calculator that computes tip amounts, totals, and per-person splits. Built as course material for the "Claude Code: AI Crash Course for Developers" course.

## Main Features

- Calculate tip amount and total based on bill and tip percentage
- Split the bill across 2–50 people
- Real-time input validation with automatic clamping on blur
- Collapsible bill-split section
- Locale-aware currency formatting with thousands separators
- Reset all values to defaults

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19 |
| Language | TypeScript 6 |
| Build / Dev Server | Vite 8 |
| Testing | Vitest 4, React Testing Library, jsdom |
| Linting | ESLint 9 |

## File Structure

```
src/
├── App.tsx           # Main component — state, calculations, layout
├── types/            # TipState interface and default values
├── utils/            # Input validation and currency formatting
└── components/       # Field, FieldInput, ComputedField, SplitSection
```

## Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/dvasyliev/claude-code-tip-calculator.git
cd claude-code-tip-calculator

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
# → http://localhost:5173
```

## Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `vite` | Start development server with HMR |
| `npm run build` | `tsc -b && vite build` | Type-check and build for production |
| `npm run preview` | `vite preview` | Serve the production build locally |
| `npm run lint` | `eslint .` | Run ESLint across all files |
| `npm test` | `vitest` | Run tests in watch mode |
| `npm run test:run` | `vitest run` | Run tests once and exit |

## Running Tests

Tests use Vitest with React Testing Library in a jsdom environment.

```bash
# Watch mode (re-runs on file changes)
npm test

# Single run
npm run test:run
```

Test files live alongside their source files (e.g. `validation.spec.ts` next to `validation.ts`). The setup file at `src/vitest.setup.ts` loads `@testing-library/jest-dom` matchers globally.
