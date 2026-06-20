#!/usr/bin/env python3
"""
MosPochin clean event aggregator for artikk.

Reads site_events.jsonl, site_event_rejects.jsonl, direct_leads.jsonl and optional
Yandex Direct TSV reports, then writes compact fact-only CSV/JSONL files for LLM brief.

Default paths match current mosanalytics layout:
  /var/lib/mosanalytics/raw/events/site_events.jsonl
  /var/lib/mosanalytics/raw/events/site_event_rejects.jsonl
  /var/lib/mosanalytics/raw/leads/direct_leads.jsonl
  /var/lib/mosanalytics/raw/direct/direct_search_queries_YYYY-MM-DD_YYYY-MM-DD.tsv
  /var/lib/mosanalytics/llm_brief/events/

The script intentionally does not copy raw event rows into the LLM outputs.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import os
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

DECISION_QUALITY = {"human_candidate"}
DECISION_EVENTS = {
    "phone_click",
    "whatsapp_click",
    "telegram_click",
    "email_click",
    "form_open",
    "form_start",
    "form_submit_attempt",
    "form_submit_success",
    "form_submit_error",
    "form_validation_error",
    "form_submit_blocked",
    "cta_view",
    "cta_click",
}
CONTACT_EVENTS = {"phone_click", "whatsapp_click", "telegram_click", "email_click"}
FORM_EVENTS = {
    "form_open",
    "form_start",
    "form_submit_attempt",
    "form_submit_success",
    "form_submit_error",
    "form_validation_error",
    "form_submit_blocked",
}

QUERY_ERROR_RE = re.compile(r"\b(ошибк|код|e\s?\d{1,2}|е\s?\d{1,2}|af\s?\d{1,2}|f\s?\d{1,2}|h20|н20)\b", re.I)
QUERY_SYMPTOM_RE = re.compile(r"не\s?греет|долго\s?греет|теч[её]т|выбивает|не\s?включ|нет\s?пара|сухой\s?ход", re.I)
QUERY_BRAND_RE = re.compile(r"rational|unox|abat|абат|кпэм|kpem|apach|atesy|iterma|mkn|alphatech|convotherm|electrolux|lainox", re.I)
QUERY_URGENT_RE = re.compile(r"срочн|выезд|сегодня|быстро", re.I)
QUERY_B2B_RE = re.compile(r"ресторан|кафе|столов|пищеблок|общепит", re.I)
QUERY_TRASH_RE = re.compile(r"купить|продажа|б\/?у|бу\b|инструкц|паспорт|скачать|схема|черт[её]ж|форум|своими\s+руками|самостоятельн|пароль|авито|запчасти\s+купить", re.I)


def today_iso() -> str:
    return dt.date.today().isoformat()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build clean MosPochin LLM event aggregates.")
    parser.add_argument("--date", default=today_iso(), help="Report date YYYY-MM-DD. Default: today.")
    parser.add_argument("--base", default=os.environ.get("MOS_BASE", "/var/lib/mosanalytics"), help="Mosanalytics base dir.")
    parser.add_argument("--events", default="", help="Path to site_events.jsonl override.")
    parser.add_argument("--rejected", default="", help="Path to site_event_rejects.jsonl override.")
    parser.add_argument("--leads", default="", help="Path to direct_leads.jsonl override.")
    parser.add_argument("--direct-search", default="", help="Path to direct_search_queries TSV override.")
    parser.add_argument("--out", default="", help="Output directory override.")
    parser.add_argument("--include-suspicious", action="store_true", help="Include suspicious quality rows in decision aggregates. Default: false.")
    return parser.parse_args()


def path_for(base: Path, kind: str, date: str) -> Path:
    if kind == "events":
        return base / "raw" / "events" / "site_events.jsonl"
    if kind == "rejected":
        return base / "raw" / "events" / "site_event_rejects.jsonl"
    if kind == "leads":
        return base / "raw" / "leads" / "direct_leads.jsonl"
    if kind == "direct_search":
        return base / "raw" / "direct" / f"direct_search_queries_{date}_{date}.tsv"
    if kind == "out":
        return base / "llm_brief" / "events"
    raise ValueError(kind)


def iter_jsonl(path: Path) -> Iterable[Dict[str, Any]]:
    if not path.exists():
        return
    with path.open("r", encoding="utf-8", errors="replace") as f:
        for line_no, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                data = json.loads(line)
            except json.JSONDecodeError:
                yield {"_parse_error": "json", "_line_no": line_no}
                continue
            if isinstance(data, dict):
                yield data


def event_date(row: Dict[str, Any]) -> str:
    ts = str(row.get("ts") or row.get("date") or "")
    return ts[:10] if len(ts) >= 10 else ""


def clean_key(value: Any, limit: int = 240) -> str:
    if value is None:
        return ""
    return re.sub(r"\s+", " ", str(value)).strip()[:limit]


def numeric(value: Any) -> float:
    if value is None or value == "":
        return 0.0
    text = str(value).replace(" ", "").replace(",", ".")
    try:
        return float(text)
    except ValueError:
        return 0.0


def is_clean_event(row: Dict[str, Any], include_suspicious: bool = False) -> bool:
    if row.get("_parse_error"):
        return False
    event = clean_key(row.get("event"), 80)
    if event not in DECISION_EVENTS:
        return False
    if row.get("is_decision_event") is False:
        return False
    quality = clean_key(row.get("quality"), 80) or "human_candidate"
    if quality in DECISION_QUALITY:
        return True
    return include_suspicious and quality == "suspicious"


def session_key(row: Dict[str, Any]) -> str:
    return clean_key(row.get("session_id_hash") or row.get("client_id_hash") or row.get("yclid_hash") or "", 80)


def write_csv(path: Path, rows: List[Dict[str, Any]], fieldnames: List[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def detect_query_intent(query: str) -> str:
    q = query.lower()
    if QUERY_TRASH_RE.search(q):
        return "trash_or_info"
    if QUERY_ERROR_RE.search(q) and QUERY_BRAND_RE.search(q):
        return "error_brand"
    if QUERY_ERROR_RE.search(q):
        return "error_code"
    if QUERY_SYMPTOM_RE.search(q):
        return "symptom"
    if QUERY_BRAND_RE.search(q):
        return "brand"
    if QUERY_URGENT_RE.search(q):
        return "urgent"
    if QUERY_B2B_RE.search(q):
        return "b2b"
    return "service"


def infer_landing_intent(path: str) -> str:
    p = path.lower()
    if re.search(r"kod-oshibki|e\d{2}|af\d{2}|h20|rational-e9|unox-af", p):
        return "error_code"
    if re.search(r"ne-greet|dolgo-greet|techet|vybivaet|ne-vklyuchaetsya|net-para|suhoy-hod", p):
        return "symptom"
    if re.search(r"rational|unox|abat|kpem|apach|atesy|iterma|convotherm|electrolux|lainox", p):
        return "brand"
    if re.search(r"promo|srochn", p):
        return "urgent"
    if re.search(r"restorana|stolov|b2b", p):
        return "b2b"
    if re.search(r"pishevarochnye-kotly|parokonvektomaty\.html|uslugi|index", p):
        return "hub"
    return "service"


def mismatch_flag(query_intent: str, landing_intent: str) -> str:
    if query_intent in {"trash_or_info"}:
        return "review_trash"
    if query_intent == "error_brand" and landing_intent not in {"error_code", "brand"}:
        return "yes"
    if query_intent in {"error_code", "symptom", "brand", "urgent", "b2b"} and landing_intent not in {query_intent, "service"}:
        return "yes"
    return "no"


def read_direct_search(path: Path) -> List[Dict[str, Any]]:
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8", errors="replace", newline="") as f:
        # Direct TSV can contain a title row before header. Find header with Query.
        lines = f.readlines()
    header_idx = 0
    for idx, line in enumerate(lines[:20]):
        if "Query" in line and "AdGroupId" in line:
            header_idx = idx
            break
    reader = csv.DictReader(lines[header_idx:], delimiter="\t")
    out = []
    for row in reader:
        if not row or not row.get("Query"):
            continue
        out.append(row)
    return out


def build_event_funnel(date: str, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    grouped: Dict[Tuple[str, str], Dict[str, Any]] = {}
    sessions: Dict[Tuple[str, str], set] = defaultdict(set)
    for row in events:
        page = clean_key(row.get("page_path") or row.get("page"), 240)
        intent = clean_key(row.get("page_intent") or infer_landing_intent(page), 80)
        key = (page, intent)
        if key not in grouped:
            grouped[key] = {
                "date": date,
                "page_path": page,
                "page_intent": intent,
                "sessions": 0,
                "cta_view": 0,
                "cta_click": 0,
                "phone_click": 0,
                "whatsapp_click": 0,
                "telegram_click": 0,
                "email_click": 0,
                "form_open": 0,
                "form_start": 0,
                "form_submit_attempt": 0,
                "form_submit_success": 0,
                "form_submit_error": 0,
                "form_validation_error": 0,
                "form_submit_blocked": 0,
            }
        event = clean_key(row.get("event"), 80)
        if event in grouped[key]:
            grouped[key][event] += 1
        sess = session_key(row)
        if sess:
            sessions[key].add(sess)
    for key, row in grouped.items():
        row["sessions"] = len(sessions[key])
    return sorted(grouped.values(), key=lambda r: (r["date"], r["page_path"], r["page_intent"]))


def build_cta_performance(date: str, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    grouped: Dict[Tuple[str, str, str], Dict[str, Any]] = {}
    success_by_session_after_click = defaultdict(set)
    click_sessions = defaultdict(set)

    for row in events:
        page = clean_key(row.get("page_path") or row.get("page"), 240)
        cta_id = clean_key(row.get("cta_id") or row.get("form_id") or row.get("contact_type") or "unknown", 120)
        block = clean_key(row.get("block") or "", 120)
        key = (page, cta_id, block)
        if key not in grouped:
            grouped[key] = {"date": date, "page_path": page, "cta_id": cta_id, "block": block, "views": 0, "clicks": 0, "ctr": "0.00", "lead_success_after_click": 0}
        event = clean_key(row.get("event"), 80)
        sess = session_key(row)
        if event == "cta_view":
            grouped[key]["views"] += 1
        elif event == "cta_click":
            grouped[key]["clicks"] += 1
            if sess:
                click_sessions[key].add(sess)
        elif event == "form_submit_success" and sess:
            success_by_session_after_click[key].add(sess)

    for key, row in grouped.items():
        row["ctr"] = f"{(row['clicks'] / row['views'] * 100) if row['views'] else 0:.2f}"
        row["lead_success_after_click"] = len(click_sessions[key] & success_by_session_after_click[key])
    return sorted(grouped.values(), key=lambda r: (r["page_path"], r["cta_id"], r["block"]))


def build_form_friction(date: str, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    grouped: Dict[Tuple[str, str], Dict[str, Any]] = {}
    reasons: Dict[Tuple[str, str], Counter] = defaultdict(Counter)
    for row in events:
        event = clean_key(row.get("event"), 80)
        if event not in FORM_EVENTS:
            continue
        page = clean_key(row.get("page_path") or row.get("page"), 240)
        form_id = clean_key(row.get("form_id") or row.get("form_context") or "unknown", 120)
        key = (page, form_id)
        if key not in grouped:
            grouped[key] = {"date": date, "page_path": page, "form_id": form_id, "opens": 0, "starts": 0, "attempts": 0, "success": 0, "errors": 0, "blocked": 0, "top_error_reason": ""}
        if event == "form_open": grouped[key]["opens"] += 1
        elif event == "form_start": grouped[key]["starts"] += 1
        elif event == "form_submit_attempt": grouped[key]["attempts"] += 1
        elif event == "form_submit_success": grouped[key]["success"] += 1
        elif event == "form_submit_error": grouped[key]["errors"] += 1
        elif event == "form_validation_error":
            grouped[key]["errors"] += 1
            reasons[key][clean_key(row.get("reason") or "unknown", 120)] += 1
        elif event == "form_submit_blocked":
            grouped[key]["blocked"] += 1
            reasons[key][clean_key(row.get("reason") or "blocked", 120)] += 1
    for key, row in grouped.items():
        if reasons[key]:
            row["top_error_reason"] = reasons[key].most_common(1)[0][0]
    return sorted(grouped.values(), key=lambda r: (r["page_path"], r["form_id"]))


def build_traffic_quality(date: str, all_events: List[Dict[str, Any]], clean_events: List[Dict[str, Any]], rejected: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    by_source = defaultdict(lambda: {"date": date, "source": "", "medium": "", "campaign": "", "total_events": 0, "clean_events": 0, "suspicious_events": 0, "unique_clean_sessions": 0, "rejected_events": 0})
    clean_sessions = defaultdict(set)

    for row in all_events:
        source = clean_key(row.get("utm_source") or "unknown", 120)
        medium = clean_key(row.get("utm_medium") or "unknown", 120)
        campaign = clean_key(row.get("utm_campaign") or "unknown", 180)
        key = (source, medium, campaign)
        by_source[key].update({"source": source, "medium": medium, "campaign": campaign})
        by_source[key]["total_events"] += 1
        if clean_key(row.get("quality"), 80) == "suspicious":
            by_source[key]["suspicious_events"] += 1

    for row in clean_events:
        source = clean_key(row.get("utm_source") or "unknown", 120)
        medium = clean_key(row.get("utm_medium") or "unknown", 120)
        campaign = clean_key(row.get("utm_campaign") or "unknown", 180)
        key = (source, medium, campaign)
        by_source[key].update({"source": source, "medium": medium, "campaign": campaign})
        by_source[key]["clean_events"] += 1
        sess = session_key(row)
        if sess:
            clean_sessions[key].add(sess)

    for row in rejected:
        source = clean_key(row.get("utm_source") or "unknown", 120)
        medium = clean_key(row.get("utm_medium") or "unknown", 120)
        campaign = clean_key(row.get("utm_campaign") or "unknown", 180)
        key = (source, medium, campaign)
        by_source[key].update({"source": source, "medium": medium, "campaign": campaign})
        by_source[key]["rejected_events"] += 1

    for key, row in by_source.items():
        row["unique_clean_sessions"] = len(clean_sessions[key])
    return sorted(by_source.values(), key=lambda r: (r["source"], r["medium"], r["campaign"]))


def build_rejected_summary(date: str, rejected: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    counter = Counter(clean_key(row.get("error") or row.get("reject_reason") or "unknown", 120) for row in rejected)
    return [{"date": date, "reject_reason": reason, "count": count} for reason, count in sorted(counter.items())]


def build_offline_conversions(date: str, leads: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    rows = []
    for row in leads:
        if event_date(row) != date:
            continue
        lead_hash = clean_key(row.get("lead_id_hash") or row.get("phone_hash") or "", 120)
        yclid_hash = clean_key(row.get("yclid_hash") or "", 120)
        status = clean_key(row.get("status") or "", 120)
        # This is a safe draft for internal CRM/LLM review. Real upload requires raw yclid/client_id and must not be sourced from hashes.
        rows.append({
            "date": date,
            "lead_id_hash": lead_hash,
            "yclid_hash": yclid_hash,
            "goal": "lead_created" if status == "delivered" else "lead_delivery_failed",
            "lead_status": status,
            "qualified": "",
            "status_sent_to_metrica": "not_sent_hash_only",
        })
    return rows


def build_query_landing_actions(date: str, events: List[Dict[str, Any]], direct_rows: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    # We cannot reliably map a Search Query row to a session unless utm_content/adgroup/ad ids are present.
    # This table joins at the best available safe grain: date + adgroup + query + observed landing paths for the same utm_campaign/utm_content.
    event_by_utm = defaultdict(lambda: Counter())
    event_sessions = defaultdict(set)
    event_leads = defaultdict(int)
    for row in events:
        utm_campaign = clean_key(row.get("utm_campaign"), 240)
        utm_content = clean_key(row.get("utm_content"), 240)
        landing = clean_key(row.get("landing_page") or row.get("session_landing_path") or row.get("page_path"), 240)
        key = (utm_campaign, utm_content, landing)
        event = clean_key(row.get("event"), 80)
        event_by_utm[key][event] += 1
        sess = session_key(row)
        if sess:
            event_sessions[key].add(sess)
        if event == "form_submit_success":
            event_leads[key] += 1

    query_rows = []
    mismatch_rows = []
    if not direct_rows:
        # Still emit event-only rows so the file is useful before Direct TSV is copied.
        for (utm_campaign, utm_content, landing), counter in event_by_utm.items():
            landing_intent = infer_landing_intent(landing)
            query_rows.append({
                "date": date,
                "campaign_id": "",
                "adgroup_id": "",
                "query": "",
                "detected_intent": "",
                "landing_path": landing,
                "landing_intent": landing_intent,
                "mismatch": "unknown_no_direct_tsv",
                "clicks": "",
                "cost": "",
                "sessions": len(event_sessions[(utm_campaign, utm_content, landing)]),
                "clean_sessions": len(event_sessions[(utm_campaign, utm_content, landing)]),
                "cta_view": counter.get("cta_view", 0),
                "cta_click": counter.get("cta_click", 0),
                "phone_click": counter.get("phone_click", 0),
                "whatsapp_click": counter.get("whatsapp_click", 0),
                "form_start": counter.get("form_start", 0),
                "form_submit_success": counter.get("form_submit_success", 0),
                "qualified_leads": "",
            })
        return query_rows, mismatch_rows

    # Direct-only rows become a watch matrix; event mapping remains optional/partial.
    observed_landings = list({key[2] for key in event_by_utm.keys() if key[2]}) or [""]
    for drow in direct_rows:
        query = clean_key(drow.get("Query"), 500)
        if not query:
            continue
        q_intent = detect_query_intent(query)
        campaign_id = clean_key(drow.get("CampaignId"), 80)
        adgroup_id = clean_key(drow.get("AdGroupId"), 80)
        landing = ""
        # If events exist, choose first observed landing for the same utm content group if possible; otherwise leave blank.
        if len(observed_landings) == 1:
            landing = observed_landings[0]
        landing_intent = infer_landing_intent(landing) if landing else ""
        mismatch = mismatch_flag(q_intent, landing_intent) if landing else "unknown_no_landing_match"
        row = {
            "date": date,
            "campaign_id": campaign_id,
            "adgroup_id": adgroup_id,
            "query": query,
            "detected_intent": q_intent,
            "landing_path": landing,
            "landing_intent": landing_intent,
            "mismatch": mismatch,
            "clicks": int(numeric(drow.get("Clicks"))),
            "cost": f"{numeric(drow.get('Cost')):.2f}",
            "sessions": "",
            "clean_sessions": "",
            "cta_view": "",
            "cta_click": "",
            "phone_click": "",
            "whatsapp_click": "",
            "form_start": "",
            "form_submit_success": "",
            "qualified_leads": "",
        }
        query_rows.append(row)
        if mismatch != "no":
            mismatch_rows.append({
                "date": date,
                "query": query,
                "detected_intent": q_intent,
                "landing_path": landing,
                "landing_intent": landing_intent,
                "mismatch": mismatch,
                "clicks": row["clicks"],
                "cost": row["cost"],
                "events": "",
                "leads": "",
            })
    return query_rows, mismatch_rows


def write_manifest(path: Path, date: str, files: List[Path], counts: Dict[str, int], sources: Dict[str, str]) -> None:
    manifest = {
        "date": date,
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "policy": {
            "no_raw_nginx_logs": True,
            "no_raw_site_events_in_llm": True,
            "no_plain_personal_data": True,
            "decision_quality": sorted(DECISION_QUALITY),
        },
        "counts": counts,
        "sources": sources,
        "files": [str(p.name) for p in files],
    }
    path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    args = parse_args()
    date = args.date
    base = Path(args.base)
    events_path = Path(args.events) if args.events else path_for(base, "events", date)
    rejected_path = Path(args.rejected) if args.rejected else path_for(base, "rejected", date)
    leads_path = Path(args.leads) if args.leads else path_for(base, "leads", date)
    direct_path = Path(args.direct_search) if args.direct_search else path_for(base, "direct_search", date)
    out_dir = Path(args.out) if args.out else path_for(base, "out", date)
    out_dir.mkdir(parents=True, exist_ok=True)

    all_events = [row for row in iter_jsonl(events_path) if event_date(row) == date]
    clean_events = [row for row in all_events if is_clean_event(row, include_suspicious=args.include_suspicious)]
    rejected = [row for row in iter_jsonl(rejected_path) if event_date(row) == date]
    leads = list(iter_jsonl(leads_path))
    direct_rows = read_direct_search(direct_path)

    outputs: List[Path] = []

    event_funnel = build_event_funnel(date, clean_events)
    p = out_dir / f"llm_event_funnel_{date}.csv"
    write_csv(p, event_funnel, ["date", "page_path", "page_intent", "sessions", "cta_view", "cta_click", "phone_click", "whatsapp_click", "telegram_click", "email_click", "form_open", "form_start", "form_submit_attempt", "form_submit_success", "form_submit_error", "form_validation_error", "form_submit_blocked"])
    outputs.append(p)

    cta = build_cta_performance(date, clean_events)
    p = out_dir / f"llm_cta_performance_{date}.csv"
    write_csv(p, cta, ["date", "page_path", "cta_id", "block", "views", "clicks", "ctr", "lead_success_after_click"])
    outputs.append(p)

    friction = build_form_friction(date, clean_events)
    p = out_dir / f"llm_form_friction_{date}.csv"
    write_csv(p, friction, ["date", "page_path", "form_id", "opens", "starts", "attempts", "success", "errors", "blocked", "top_error_reason"])
    outputs.append(p)

    quality = build_traffic_quality(date, all_events, clean_events, rejected)
    p = out_dir / f"llm_traffic_quality_{date}.csv"
    write_csv(p, quality, ["date", "source", "medium", "campaign", "total_events", "clean_events", "suspicious_events", "unique_clean_sessions", "rejected_events"])
    outputs.append(p)

    rejected_summary = build_rejected_summary(date, rejected)
    p = out_dir / f"llm_rejected_events_summary_{date}.csv"
    write_csv(p, rejected_summary, ["date", "reject_reason", "count"])
    outputs.append(p)

    offline = build_offline_conversions(date, leads)
    p = out_dir / f"llm_offline_conversions_{date}.csv"
    write_csv(p, offline, ["date", "lead_id_hash", "yclid_hash", "goal", "lead_status", "qualified", "status_sent_to_metrica"])
    outputs.append(p)

    query_actions, mismatch = build_query_landing_actions(date, clean_events, direct_rows)
    p = out_dir / f"llm_query_landing_actions_{date}.csv"
    write_csv(p, query_actions, ["date", "campaign_id", "adgroup_id", "query", "detected_intent", "landing_path", "landing_intent", "mismatch", "clicks", "cost", "sessions", "clean_sessions", "cta_view", "cta_click", "phone_click", "whatsapp_click", "form_start", "form_submit_success", "qualified_leads"])
    outputs.append(p)

    p = out_dir / f"llm_landing_mismatch_{date}.csv"
    write_csv(p, mismatch, ["date", "query", "detected_intent", "landing_path", "landing_intent", "mismatch", "clicks", "cost", "events", "leads"])
    outputs.append(p)

    manifest = out_dir / f"llm_events_manifest_{date}.json"
    write_manifest(manifest, date, outputs, {
        "raw_events_for_date": len(all_events),
        "clean_events_for_date": len(clean_events),
        "rejected_events_for_date": len(rejected),
        "leads_total_seen": len(leads),
        "direct_search_rows_seen": len(direct_rows),
    }, {
        "events": str(events_path),
        "rejected": str(rejected_path),
        "leads": str(leads_path),
        "direct_search": str(direct_path),
    })
    outputs.append(manifest)

    print(f"OK: wrote {len(outputs)} files to {out_dir}")
    for item in outputs:
        print(item)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
