#!/usr/bin/env bash
set -euo pipefail
SITE_DIR="${1:-.}"
cd "$SITE_DIR"
echo '===== PREDEPLOY LOCAL CHECK V6 ====='
echo "site_dir=$(pwd)"
required=(index.html parokonvektomaty.html pishevarochnye-kotly.html analytics.js telegram-form.js sitemap.xml robots.txt)
for f in "${required[@]}"; do test -f "$f" || { echo "MISSING $f" >&2; exit 1; }; done
grep -q '/api/track-event' analytics.js
grep -q 'reachGoal' analytics.js
grep -q 'form_submit_click' analytics.js
grep -q 'form_validation_error' analytics.js
grep -q 'data-page-slug="index"' index.html
grep -q 'data-page-slug="parokonvektomaty"' parokonvektomaty.html
grep -q 'data-contact-form' parokonvektomaty.html
grep -q 'data-cta-id' parokonvektomaty.html
python3 - <<'PY'
from pathlib import Path
from html.parser import HTMLParser
import json
root=Path('.')
EXTERNAL_SCHEMES=('http://','https://','tel:','mailto:','whatsapp:','tg:','sms:','viber:','#','javascript:')
class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.body_attrs={}; self.cta=0; self.forms=0; self.forms_tracked=0; self.jsonld=[]; self.links=[]; self.ids=set(); self._in_json=False; self._buf=[]
    def handle_starttag(self, tag, attrs):
        d=dict(attrs)
        if tag=='body': self.body_attrs=d
        if 'data-cta-id' in d: self.cta += 1
        if tag=='form':
            self.forms += 1
            if d.get('data-form-id') or d.get('data-contact-form'): self.forms_tracked += 1
        if tag=='script' and d.get('type')=='application/ld+json': self._in_json=True; self._buf=[]
        if tag=='a' and d.get('href'): self.links.append(d['href'])
        if 'id' in d: self.ids.add(d['id'])
    def handle_data(self, data):
        if self._in_json: self._buf.append(data)
    def handle_endtag(self, tag):
        if tag=='script' and self._in_json:
            self.jsonld.append(''.join(self._buf).strip()); self._in_json=False
html=sorted(root.glob('*.html'))
if len(html) < 60: raise SystemExit(f'HTML pages too low: {len(html)}')
missing_slug=[]; missing_cta=[]; form_bad=[]; json_bad=[]; broken=[]; page_ids={}
parsed={}
for p in html:
    parser=PageParser(); parser.feed(p.read_text(errors='ignore'))
    parsed[p.name]=parser; page_ids[p.name]=parser.ids
    if not parser.body_attrs.get('data-page-slug'): missing_slug.append(p.name)
    if parser.cta==0 and p.name!='404.html': missing_cta.append(p.name)
    if parser.forms != parser.forms_tracked: form_bad.append((p.name, parser.forms, parser.forms_tracked))
    for i, raw in enumerate(parser.jsonld,1):
        try: json.loads(raw)
        except Exception as e: json_bad.append((p.name, i, str(e)))
for p, parser in parsed.items():
    for href in parser.links:
        if href.startswith(EXTERNAL_SCHEMES): continue
        path=href.split('#')[0].split('?')[0]
        frag=href.split('#',1)[1].split('?',1)[0] if '#' in href else ''
        target=(root/path.lstrip('/')) if path.startswith('/') else ((root/p).parent/path if path else root/p)
        if target.suffix=='' and not target.exists(): target=target.with_suffix('.html')
        if path and not target.exists(): broken.append((p, href, 'missing_file'))
        elif frag and target.name in page_ids and frag not in page_ids[target.name]: broken.append((p, href, 'missing_anchor'))
if missing_slug: raise SystemExit('missing data-page-slug: '+', '.join(missing_slug[:20]))
if missing_cta: raise SystemExit('pages without cta: '+', '.join(missing_cta[:20]))
if form_bad: raise SystemExit('forms without tracking attrs: '+str(form_bad[:10]))
if json_bad: raise SystemExit('invalid JSON-LD: '+str(json_bad[:5]))
if broken: raise SystemExit('broken internal links: '+str(broken[:20]))
print(f'PASS pages={len(html)} forms_ok jsonld_ok links_ok')
PY
if [ -f _ops/font_requirements_NOFONTS.csv ]; then
  echo 'NOTE: NOFONTS package. Run production_remote_preflight_v6.sh before rsync to ensure font binaries exist on server.'
fi
echo 'PASS predeploy local check V6'
