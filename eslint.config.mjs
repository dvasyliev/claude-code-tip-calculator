// Helpers to build the config and to ignore folders.
import { defineConfig, globalIgnores } from "eslint/config";
// Plugin that checks which folder may import which.
import boundaries from "eslint-plugin-boundaries";
// Next.js rules for React, hooks and performance.
import nextVitals from "eslint-config-next/core-web-vitals";
// Next.js rules for TypeScript.
import nextTs from "eslint-config-next/typescript";
// Turns off rules that fight with Prettier.
import prettier from "eslint-config-prettier/flat";
// TypeScript rules, including the ones that read types.
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  // Next.js base rules: React, hooks, web performance, TypeScript.
  ...nextVitals,
  ...nextTs,
  // Type-aware TypeScript rules, so the linter catches bugs like a promise nobody awaits.
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  // Limits a file to 400 lines so the agent splits big files. Tests are exempt.
  {
    files: ["**/*.{ts,tsx,mts,mjs}"],
    ignores: ["**/*.spec.{ts,tsx}"],
    rules: {
      "max-lines": [
        "error",
        { max: 400, skipBlankLines: true, skipComments: true },
      ],
    },
  },
  // File placement (.claude/rules/structure.md): defines the project folders and bans `../` imports. Shared code is imported through
  // `@/`, never `../`. A route folder is private to its route: other routes,
  // shared components and lib/ may not import from it. lib/ imports nothing
  // from app/.
  {
    files: ["app/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        // shared: components used by more than one page.
        { type: "shared", pattern: "app/components", partialMatch: false },
        // api: the server endpoints.
        { type: "api", pattern: "app/api", partialMatch: false },
        // route: one page and all the code that only it uses.
        {
          type: "route",
          pattern: "app/*",
          capture: ["route"],
          partialMatch: false,
        },
        // lib: plain helper logic with no UI and no pages.
        { type: "lib", pattern: "lib", partialMatch: false },
      ],
    },
    rules: {
      // Why: `../` paths break when files move and are hard to read. The `@/` alias always points to the same place.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*"],
              message: "Import through `@/` instead of `../`.",
            },
          ],
        },
      ],
    },
  },
  // Enforces who may import from whom between these folders. Tests may import whatever they test.
  {
    files: ["app/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
    ignores: ["**/*.spec.{ts,tsx}"],
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "allow",
          policies: [
            // Why: a route's code is private. Changing or deleting one page must not break other pages.
            // If code is needed in two places, it moves to shared components.
            {
              from: {
                element: { types: { anyOf: ["route", "shared", "lib"] } },
              },
              disallow: { to: { element: { type: "route" } } },
            },
            // Why: lib is plain helper logic with no UI or pages, so it stays reusable and testable and there are no import loops.
            {
              from: { element: { type: "lib" } },
              disallow: {
                to: {
                  element: { types: { anyOf: ["shared", "api", "route"] } },
                },
              },
            },
          ],
        },
      ],
    },
  },
  // Must stay last: turns off rules that conflict with Prettier, so lint and format never fight.
  prettier,
  // Folders ESLint should skip: build output and Claude Code's own files.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Claude Code's own files, not the app's code.
    ".claude/**",
  ]),
]);

export default eslintConfig;
