#!/usr/bin/env bash
set -uo pipefail # Run this file with bash.

input=$(cat) # Turn on stricter error checks.
cmd=$(jq -r '.tool_input.command // empty' <<<"$input") # Read the JSON that Claude Code sends.
[[ -z "$cmd" ]] && exit 0 # Take the command text out of the JSON.

deny() { echo "Blocked: $1" >&2; exit 2; } # If there is no command, let it through.

shopt -s nocasematch # Ignore uppercase and lowercase.
# Check whether the command is a git push with a force flag.
[[ "$cmd" =~ git[[:space:]].*push.*(--force|--force-with-lease|-f([[:space:]]|$)) ]] \
  && deny "force push. Push a new branch instead." # If it is, block it and suggest a new branch.

# Check whether the command tries to skip git hooks.
[[ "$cmd" =~ (--no-verify|SKIP_VERIFY) ]] \
  && deny "skipping the git hooks is a human decision." # If it does, block it.

exit 0
