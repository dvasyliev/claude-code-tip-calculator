#!/usr/bin/env bash
# Formats and lints every file right after Claude edits it.

set -uo pipefail

# Find out which file Claude just changed.
input=$(cat)
path=$(jq -r '.tool_input.file_path // empty' <<<"$input")
[[ -z "$path" || ! -f "$path" ]] && exit 0

# Skip files that Prettier and ESLint do not understand.
case "$path" in
  *.ts|*.tsx|*.mts|*.js|*.jsx|*.mjs|*.css|*.json|*.md) ;;
  *) exit 0 ;;
esac

cd "$CLAUDE_PROJECT_DIR" || exit 0

# Fix the formatting silently.
npm run -s format:file -- "$path" >/dev/null 2>&1

# Lint the code; on errors make Claude fix them right away.
case "$path" in
  *.ts|*.tsx|*.mts|*.js|*.jsx|*.mjs)
    if ! out=$(npm run -s lint:file -- "$path" 2>&1); then
      {
        echo "Lint failed on $path. Fix these before moving on:"
        tail -n 40 <<<"$out"
      } >&2
      exit 2
    fi
    ;;
esac

exit 0
