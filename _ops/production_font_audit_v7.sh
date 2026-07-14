#!/usr/bin/env bash
set -euo pipefail
HOST="${1:?usage: ./production_font_audit_v7.sh user@host [/var/www/mospochin.ru] [manifest]}"
DOCROOT="${2:-/var/www/mospochin.ru}"
MANIFEST="${3:-_ops/font_requirements_NOFONTS.csv}"
echo '===== PRODUCTION FONT AUDIT V7 ====='
echo "host=$HOST"
echo "docroot=$DOCROOT"
echo "manifest=$MANIFEST"
if [ ! -f "$MANIFEST" ]; then
  echo "MISSING LOCAL FONT MANIFEST: $MANIFEST" >&2
  exit 2
fi
missing=0
while IFS=, read -r css url rel present; do
  [ "$css" != "css" ] || continue
  [ -n "${rel:-}" ] || continue
  if ssh "$HOST" "test -s '$DOCROOT/$rel'"; then
    size=$(ssh "$HOST" "stat -c '%s' '$DOCROOT/$rel' 2>/dev/null || wc -c < '$DOCROOT/$rel'")
    echo "OK_FONT $rel bytes=$size"
  else
    echo "MISSING_FONT $rel" >&2
    missing=$((missing+1))
  fi
done < "$MANIFEST"
if [ "$missing" -ne 0 ]; then
  echo "FAIL missing_fonts=$missing" >&2
  exit 7
fi
echo 'PASS production font audit V7'
