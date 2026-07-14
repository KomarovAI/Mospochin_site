#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "Compatibility alias: using the project-wide local-native visual runtime." >&2
exec node tools/visual-local-capture.mjs \
  --manifest data/sous-vide-screenshot-audit.json \
  --mode both \
  --output .artifacts/screenshots/sous-vide/native \
  "$@"
