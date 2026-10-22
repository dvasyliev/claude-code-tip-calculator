#!/usr/bin/env bash
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

echo "Project state at session start:"

# Check 1: dependencies
if [ ! -d node_modules ]; then
  echo "- WARNING: dependencies are not installed. Run npm ci first."
else
  echo "- Dependencies: installed."
fi

# Check 2: dev server on port 5173
if lsof -ti :5173 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "- WARNING: a dev server is already running on port 5173. Do not start another one."
else
  echo "- Dev server: port 5173 is free."
fi

# Check 3: uncommitted files
changed=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
echo "- Uncommitted files: $changed. Do not discard or overwrite them."

exit 0
