#!/usr/bin/env bash
set -euo pipefail
SITE_NAME="mospochin.conf"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SRC_CSP="$REPO_ROOT/deploy/nginx/mospochin-csp.conf"
DST_CSP="/etc/nginx/snippets/mospochin-csp.conf"
SITE_AVAILABLE="/etc/nginx/sites-available/$SITE_NAME"
SITE_ENABLED="/etc/nginx/sites-enabled/$SITE_NAME"

echo "==> Applying Mospochin nginx config"
if [[ ! -f "$SITE_AVAILABLE" ]]; then echo "ERROR: config not found"; exit 1; fi

sudo cp "$SITE_AVAILABLE" "$SITE_AVAILABLE.bak.$(date +%Y%m%d%H%M%S)"
sudo install -m 0644 "$SRC_CSP" "$DST_CSP"

# ЖЕСТКО ЧИНИМ СИМЛИНК (убивает баг с обычным файлом навсегда)
if [[ -e "$SITE_ENABLED" && ! -L "$SITE_ENABLED" ]]; then
  sudo cp "$SITE_ENABLED" "$SITE_ENABLED.bak.$(date +%Y%m%d%H%M%S)"
  sudo rm "$SITE_ENABLED"
fi
if [[ ! -e "$SITE_ENABLED" ]]; then
  sudo ln -s "../sites-available/$SITE_NAME" "$SITE_ENABLED"
fi

# Вставляем include, если его нет
sudo python3 -c "
from pathlib import Path
conf = Path('/etc/nginx/sites-available/mospochin.conf')
text = conf.read_text()
if 'include snippets/mospochin-csp.conf;' not in text:
    lines = text.splitlines()
    out = []
    for line in lines:
        out.append(line)
        if 'add_header Strict-Transport-Security' in line and 'always' in line:
            out.append('        include snippets/mospochin-csp.conf;')
    conf.write_text('\n'.join(out) + '\n')
"

sudo nginx -t && sudo systemctl reload nginx
echo "==> Nginx config applied and verified successfully"
