#!/usr/bin/env bash
set -euo pipefail
ARTIKK_ALIAS="${1:-artikk-local}"
LOCAL_OUT="${2:-./postdeploy_review_v9}"
mkdir -p "$LOCAL_OUT"
ssh "$ARTIKK_ALIAS" 'bash -lc "set -euo pipefail; /opt/mosanalytics/bin/mosanalytics-daily-run </dev/null; DAY=\$(date +%F); ZIP=/var/lib/mosanalytics/reports/mosanalytics_llm_brief_\$DAY.zip; test -s \$ZIP; echo \$ZIP"' | tail -1 > "$LOCAL_OUT/latest_zip_path.txt"
REMOTE_ZIP="$(cat "$LOCAL_OUT/latest_zip_path.txt")"
scp "$ARTIKK_ALIAS:$REMOTE_ZIP" "$LOCAL_OUT/"
ZIP_LOCAL="$LOCAL_OUT/$(basename "$REMOTE_ZIP")"
python3 "$(dirname "$0")/llm_brief_review_v9.py" "$ZIP_LOCAL" --out-prefix "$LOCAL_OUT/review_v9"
echo "Review written to: $LOCAL_OUT/review_v9.md and review_v9.json"
