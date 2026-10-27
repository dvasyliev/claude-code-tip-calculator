# Building a feature

For every user-facing feature, go through the steps below in order. Work on `main`; no branches, worktrees or PRs, even when a skill suggests them.

## 1. Spec

Start from the feature's spec, if the project keeps one (CLAUDE.md says where). Note what existing code is reused and what the feature replaces.

Then decide what the request needs:

- **Intent unclear** (vague or garbled request, several readings): ask with `AskUserQuestion` before anything else, as many questions as it takes, with a recommended option first. Never ask what the code or existing patterns already answer.
- **Intent clear, but a real design choice is open:** use `superpowers:brainstorming`.
- **Intent and design both clear:** go straight to step 2.

## 2. Plan

Use `superpowers:writing-plans`. List each scenario's user steps with the expected outcome on `- expect:` lines.

## 3. Unit tests first

Use `superpowers:test-driven-development`: write the tests, watch them fail with `npm test`, then implement.

## Subagents

Subagents that implement a task run only the unit tests of the files they touch (`npx vitest run <files>`). They do not run `npm run check`; the Stop hook covers that.
