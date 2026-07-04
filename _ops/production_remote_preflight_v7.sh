#!/usr/bin/env bash
set -euo pipefail
HOST="${1:?usage: ./production_remote_preflight_v7.sh user@host [/var/www/mospochin.ru]}"
DOCROOT="${2:-/var/www/mospochin.ru}"
MANIFEST="${3:-_ops/font_requirements_NOFONTS.csv}"
echo '===== PRODUCTION REMOTE PREFLIGHT V7 ====='
echo "host=$HOST"
echo "docroot=$DOCROOT"
ssh "$HOST" "bash -lc 'set -euo pipefail
  test -d \"$DOCROOT\"
  test -r \"$DOCROOT/index.html\"
  df -h \"$DOCROOT\"
  if command -v nginx >/dev/null 2>&1; then sudo nginx -t; fi
  grep -q analytics.js \"$DOCROOT/index.html\"
  grep -q telegram-form.js \"$DOCROOT/index.html\"
  echo OK_REMOTE_BASE
'"
./_ops/production_font_audit_v7.sh "$HOST" "$DOCROOT" "$MANIFEST"
echo 'PASS production remote preflight V7'
