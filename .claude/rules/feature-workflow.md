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

## 4. Browser check

With the `playwright-cli` skill, drive the feature on the running dev server and confirm the `- expect:` outcomes.

Then measure each page the feature touches as `performance.md` says (time cold and warm, HTML size, cards sent), and give the before and after numbers in the final message.

### Screenshots

Every screenshot stays in the conversation and is re-read on every later turn, so take few and small ones.

- Check behaviour with `playwright-cli snapshot` (text), not screenshots. Search it instead of reading it whole when you look for one thing.
- Take a screenshot only to judge how something looks: layout, colours, spacing.
- Screenshot the element in question (`playwright-cli screenshot e5`), not the whole page. Never use `--hires`.
- Fix the window size before screenshots: `playwright-cli resize 1280 800` for desktop, `playwright-cli open --mobile` for phone.
- One screenshot per state you need to judge. Do not re-take one to confirm a change a snapshot already shows.

## 5. End-to-end tests

Write them for the feature's happy paths only, one per main scenario.

While working, run only the feature's own spec files (`npx playwright test tests/x/y.spec.ts`). Run the whole suite with `npm run test:e2e` once, before the commit.

## 6. Review

Run `/superpowers:requesting-code-review ` on the diff and apply what it finds.

## 7. Improve the harness

Invoke the `improve-harness` skill.

## Subagents

Subagents that implement a task run only the unit tests of the files they touch (`npx vitest run <files>`). They do not run `npm run check`; the Stop hook covers that.
