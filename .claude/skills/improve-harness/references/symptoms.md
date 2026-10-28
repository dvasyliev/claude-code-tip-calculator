# Harness symptoms

Each entry: symptom, causes, and a check you can run yourself.

## An instruction in CLAUDE.md or a rule is ignored

- File is too long. Check: `wc -l CLAUDE.md`. Over 200 lines: move folder rules to `.claude/rules/`.
- Another file says the opposite. Check: `grep -rn "<word>" CLAUDE.md .claude/ ~/.claude/CLAUDE.md`. Keep one version.
- Wording is vague ("try to", "prefer", "if possible"). Fix: one clear action per line.
- It points to a moved or deleted path. Check: open every path it mentions.

## CLAUDE.md does not load

- Wrong name or place. Check: `ls CLAUDE.md .claude/CLAUDE.md`.

## A rule does not apply to its files

- `paths` does not match real folders. Check: `find <folder from the pattern> -name "*.tsx"`.
- No matching file was opened in this session. Expected, not a bug.

## A rule applies to every file

- Frontmatter does not parse. Check: the block starts and ends with `---` and `paths` is a list.

## A skill is not called

- Description does not match how the user asks. Fix: put the main use case and the user's words first.
- Model calls are off. Check: `grep -rn "disable-model-invocation" .claude/skills/`.

## A skill skips steps

- Steps are not numbered or hold several actions. Fix: one action and one check per step.

## A hook does not run

- Script is not executable. Check: `ls -l .claude/hooks/`. Fix: `chmod +x`.
- Matcher or event is wrong; matchers are case-sensitive. Check: `hooks` in `.claude/settings.json`.
- Path is relative. Check: the command starts with `"$CLAUDE_PROJECT_DIR"`.

## A hook runs but does not block

- Script exits with 1 instead of 2. Check: `echo '<event json>' | .claude/hooks/<name>.sh; echo "exit=$?"`.
- Pattern misses one spelling of the command. Check: pipe the exact command that got through.

## Lint errors after an edit do not reach Claude

- Hook does not print to stderr and exit 2. Check: `echo '{"tool_input":{"file_path":"<file>"}}' | CLAUDE_PROJECT_DIR="$PWD" .claude/hooks/format-lint-file.sh; echo "exit=$?"`.
- Hook runs out of time. Check: its `timeout` in `.claude/settings.json`.

## Work finished while checks are red

- Stop hook reused the last green state. Check: `npm run check`. Delete `.git/checks-green` to force a run.
- Only `.md` files changed. Expected, the Stop hook skips them.

## Claude keeps stopping and starting again

- Stop hook blocks its own retry. Check: the script exits 0 when `stop_hook_active` is `true`.

## A session starts without the project state

- SessionStart matcher has no `clear`. Check: the matcher in `.claude/settings.json`.

## Context7 is not used

- Server is not connected. Check: `claude mcp list`.
- Rule is unclear. Fix: a direct trigger in `.claude/rules/context7.md`.

## A command asks for permission it should not need

- Allow pattern does not match the exact command. Check: `permissions.allow` in `.claude/settings.json`.

## An allowed command is blocked

- A deny in another settings file wins. Check: `grep -n "deny" .claude/settings*.json ~/.claude/settings.json`.

## Lint passes on bad code

- File is ignored. Check: `npx eslint <file>`.
- Rule is off or a warning. Check: `npx eslint --print-config <file>`.

## Lint fails on code nobody touched

- An old warning fails `--max-warnings 0`. Check: `npm run lint`.

## A git hook does not run

- Git does not use `.githooks`. Check: `git config core.hooksPath`. Fix: `npm install`.
- Hook is not executable. Check: `ls -l .githooks/`.

## A bad commit message gets through

- commitlint rules are too loose. Check: `echo "fixed stuff" | npx commitlint` must fail.

## A push gets through with failing tests

- Another command runs after the tests and hides their exit code. Check: the test command is the last line of `.githooks/pre-push`.
