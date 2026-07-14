#!/usr/bin/env bash
set -euo pipefail
LOCAL_SITE="${1:-.}"
SSH_ALIAS="${2:-mospochin-site-vps}"
REMOTE_DIR="${3:-/var/www/mospochin.ru}"
BASE_URL="${4:-https://mospochin.ru}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/deploy_control_v8.sh" "$LOCAL_SITE" "$SSH_ALIAS" "$REMOTE_DIR" "$BASE_URL"
"$SCRIPT_DIR/postdeploy_exact_event_smoke_v9.sh" "$BASE_URL"
echo "V9 deploy control finished. Now run: $SCRIPT_DIR/artikk_collect_and_review_v9.sh artikk-local ./postdeploy_review_v9"
