#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 /absolute/path/to/artifact.zip [expected-type]" >&2
  exit 2
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ZIP="$1"
EXPECTED_TYPE="${2:-public-deploy}"

[[ -f "$ZIP" ]] || { echo "ERROR: artifact not found: $ZIP" >&2; exit 1; }

ARGS=("$ROOT/tools/verify-artifact.mjs" "$ZIP" --expect-type "$EXPECTED_TYPE")
if [[ "$EXPECTED_TYPE" == "public-deploy" ]]; then
  ARGS+=(--deployable)
else
  ARGS+=(--not-deployable)
fi

node "${ARGS[@]}"
unzip -tq "$ZIP" >/dev/null
sha256sum "$ZIP"
echo "ARTIFACT GUARD: VERIFIED OK"
