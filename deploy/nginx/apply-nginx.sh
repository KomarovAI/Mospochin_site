#!/usr/bin/env bash
set -euo pipefail

# MOSPOCHIN_NGINX_SERVER_SCOPE_INCLUDES_V4

SITE_NAME="mospochin.conf"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

SRC_CSP="$REPO_ROOT/deploy/nginx/mospochin-csp.conf"
DST_CSP="/etc/nginx/snippets/mospochin-csp.conf"

SRC_HARDENING="$REPO_ROOT/deploy/nginx/mospochin-runtime-hardening.conf"
DST_HARDENING="/etc/nginx/snippets/mospochin-runtime-hardening.conf"

SITE_AVAILABLE="/etc/nginx/sites-available/$SITE_NAME"
SITE_ENABLED="/etc/nginx/sites-enabled/$SITE_NAME"

echo "==> Applying MosPochin nginx config"

[[ -f "$SITE_AVAILABLE" ]] || {
  echo "ERROR: config not found: $SITE_AVAILABLE" >&2
  exit 1
}

sudo cp \
  "$SITE_AVAILABLE" \
  "$SITE_AVAILABLE.bak.$(date +%Y%m%d%H%M%S)"

sudo install -m 0644 "$SRC_CSP" "$DST_CSP"
sudo install -m 0644 "$SRC_HARDENING" "$DST_HARDENING"

if [[ -e "$SITE_ENABLED" && ! -L "$SITE_ENABLED" ]]; then
  sudo cp \
    "$SITE_ENABLED" \
    "$SITE_ENABLED.bak.$(date +%Y%m%d%H%M%S)"
  sudo rm "$SITE_ENABLED"
fi

if [[ ! -e "$SITE_ENABLED" ]]; then
  sudo ln -s "../sites-available/$SITE_NAME" "$SITE_ENABLED"
fi

sudo python3 \
  "$REPO_ROOT/deploy/nginx/repair-managed-includes.py" \
  "$SITE_AVAILABLE" \
  "$DST_CSP" \
  "$DST_HARDENING"

sudo nginx -t
sudo systemctl reload nginx

echo "==> Nginx config applied and verified successfully"
