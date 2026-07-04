#!/usr/bin/env bash
set -euo pipefail
HOST="${1:?usage: ./production_remote_preflight_v6.sh user@host [/var/www/mospochin.ru]}"
DOCROOT="${2:-/var/www/mospochin.ru}"
MANIFEST="${3:-_ops/font_requirements_NOFONTS.csv}"
echo '===== PRODUCTION REMOTE PREFLIGHT V6 ====='
echo "host=$HOST"
echo "docroot=$DOCROOT"
ssh "$HOST" "bash -lc 'set -euo pipefail
  test -d "$DOCROOT"
  test -r "$DOCROOT/index.html"
  df -h "$DOCROOT"
  if command -v nginx >/dev/null 2>&1; then sudo nginx -t; fi
  echo OK_REMOTE_BASE
'"
if [ -f "$MANIFEST" ]; then
  awk -F, 'NR>1 {print $3}' "$MANIFEST" | sort -u | while read -r rel; do
    [ -n "$rel" ] || continue
    ssh "$HOST" "test -s '$DOCROOT/$rel'" || {
      echo "MISSING PRODUCTION FONT: $DOCROOT/$rel" >&2
      echo "This is a NOFONTS package. Do not deploy until existing production font binary is restored or intentionally accepted." >&2
      exit 2
    }
  done
  echo 'PASS production font binaries exist'
fi
ssh "$HOST" "bash -lc 'set -euo pipefail
  grep -q analytics.js "$DOCROOT/index.html"
  grep -q telegram-form.js "$DOCROOT/index.html"
  echo OK_REMOTE_CURRENT_SITE
'"
echo 'PASS production remote preflight V6'
