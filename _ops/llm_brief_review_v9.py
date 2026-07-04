#!/usr/bin/env python3
"""Review MosPochin mosanalytics_llm_brief_YYYY-MM-DD.zip after deploy.
Reads the LLM brief zip and emits a compact Markdown and JSON decision report.
No network calls, no secrets.
"""
from __future__ import annotations
import argparse, csv, io, json, re, sys, zipfile
from pathlib import Path
from collections import defaultdict

EVENTS_AFTER_FORM_START = [
    'form_submit_click', 'form_validation_error', 'form_submit_attempt', 'form_submit_success',
    'form_submit_error', 'form_submit_blocked'
]
ACTION_EVENTS = ['phone_click','whatsapp_click','telegram_click','email_click','cta_click','form_open','form_start'] + EVENTS_AFTER_FORM_START


def read_csv_from_zip(zf: zipfile.ZipFile, pattern: str):
    names=[n for n in zf.namelist() if re.search(pattern, n)]
    if not names:
        return [], None
    name=names[0]
    data=zf.read(name).decode('utf-8-sig', errors='replace')
    rows=list(csv.DictReader(io.StringIO(data)))
    return rows, name


def num(v):
    try:
        if v is None or v=='': return 0.0
        return float(str(v).replace(',', '.'))
    except Exception:
        return 0.0


def row_event(row):
    for k in ('event','event_name','name','goal','type'):
        if row.get(k): return row[k]
    # fallback: first column if it looks textual
    for v in row.values():
        if isinstance(v,str) and re.search(r'click|form|view|lead|whatsapp|phone|cta', v): return v
    return ''


def row_count(row):
    for k in ('count','events','total','value','cnt','event_count'):
        if k in row: return num(row.get(k))
    for k,v in row.items():
        if k and re.search(r'count|total|events|cnt', k, re.I): return num(v)
    return 0.0


def summarize_event_funnel(rows):
    d=defaultdict(float)
    for r in rows:
        ev=row_event(r)
        if ev:
            d[ev]+=row_count(r)
    return dict(sorted(d.items()))


def decision_from_events(events):
    fs=events.get('form_start',0)
    sc=events.get('form_submit_click',0)
    fv=events.get('form_validation_error',0)
    fa=events.get('form_submit_attempt',0)
    ok=events.get('form_submit_success',0)
    phone=events.get('phone_click',0)
    wa=events.get('whatsapp_click',0)
    if ok>0:
        return 'PASS_LEADS: есть form_submit_success. Считать CPL/CPA и сверить backend/direct_leads.'
    if fa>0 and ok==0:
        return 'BACKEND_OR_HANDLER: есть form_submit_attempt, но нет success. Проверить backend validation / Telegram / lead handler.'
    if sc>0 and fv>0:
        return 'FORM_VALIDATION_FRICTION: пользователь нажимает submit, но его блокирует форма/consent/телефон.'
    if fs>0 and sc==0:
        return 'FORM_DROP_BEFORE_BUTTON: form_start есть, submit_click нет. Упростить форму, усилить WhatsApp fallback, проверить mobile UX.'
    if phone>0 or wa>0:
        return 'MICROCONVERSIONS_ONLY: есть phone/WhatsApp, но нет online lead. Сверить звонки/мессенджеры и offline conversion.'
    return 'NO_ACTION_SIGNAL: нет действий после просмотра CTA. Проверить видимость CTA, mobile first screen, релевантность landing.'


def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('zip_path', help='mosanalytics_llm_brief_YYYY-MM-DD.zip')
    ap.add_argument('--out-prefix', default=None, help='output prefix path without extension')
    args=ap.parse_args()
    zp=Path(args.zip_path)
    if not zp.exists():
        raise SystemExit(f'ZIP not found: {zp}')
    with zipfile.ZipFile(zp) as zf:
        event_rows, event_name = read_csv_from_zip(zf, r'llm_event_funnel_.*\.csv$')
        cta_rows, cta_name = read_csv_from_zip(zf, r'llm_cta_performance_.*\.csv$')
        form_rows, form_name = read_csv_from_zip(zf, r'llm_form_friction_.*\.csv$')
        query_rows, query_name = read_csv_from_zip(zf, r'llm_query_landing_actions_.*\.csv$')
        direct_rows, direct_name = read_csv_from_zip(zf, r'llm_direct_search_queries_.*\.csv$')
        traffic_rows, traffic_name = read_csv_from_zip(zf, r'llm_traffic_quality_.*\.csv$')
    events=summarize_event_funnel(event_rows)
    decision=decision_from_events(events)
    report={
        'zip': str(zp),
        'files_detected': {
            'event_funnel': event_name,
            'cta_performance': cta_name,
            'form_friction': form_name,
            'query_landing_actions': query_name,
            'direct_search_queries': direct_name,
            'traffic_quality': traffic_name,
        },
        'event_counts': events,
        'decision': decision,
        'row_counts': {
            'event_funnel': len(event_rows),
            'cta_performance': len(cta_rows),
            'form_friction': len(form_rows),
            'query_landing_actions': len(query_rows),
            'direct_search_queries': len(direct_rows),
            'traffic_quality': len(traffic_rows),
        },
        'next_checks': [
            'Если form_submit_click отсутствует при form_start > 0: проверить mobile UX формы и WhatsApp fallback.',
            'Если form_validation_error > 0: открыть form_friction и убрать конкретный блокер.',
            'Если form_submit_attempt > 0, но success = 0: проверить backend /api/send-telegram и direct_leads.jsonl.',
            'Если есть phone/whatsapp_click: сверить звонки/WhatsApp вручную и offline conversions.',
            'Если direct queries есть без action: не поднимать бюджет, проверить query -> landing -> CTA.',
        ]
    }
    md=[]
    md.append('# MosPochin post-deploy LLM brief review V9')
    md.append('')
    md.append(f'ZIP: `{zp.name}`')
    md.append('')
    md.append('## Files detected')
    for k,v in report['files_detected'].items():
        md.append(f'- {k}: `{v or "MISSING"}`')
    md.append('')
    md.append('## Event counts')
    if events:
        md.append('| event | count |')
        md.append('|---|---:|')
        for k,v in events.items():
            md.append(f'| `{k}` | {v:g} |')
    else:
        md.append('No event funnel rows parsed.')
    md.append('')
    md.append('## Decision')
    md.append(decision)
    md.append('')
    md.append('## Next checks')
    for x in report['next_checks']:
        md.append(f'- {x}')
    prefix=Path(args.out_prefix) if args.out_prefix else zp.with_suffix('')
    prefix.parent.mkdir(parents=True, exist_ok=True)
    (prefix.with_suffix('.json')).write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    (prefix.with_suffix('.md')).write_text('\n'.join(md)+'\n', encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, indent=2))

if __name__=='__main__':
    main()
