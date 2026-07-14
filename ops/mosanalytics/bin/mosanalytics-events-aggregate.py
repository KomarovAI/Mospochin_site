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
VISIBILITY_EVENTS = {"page_view", "cta_view"}
HUMAN_DECISION_EVENTS = {
    "phone_click",
    "whatsapp_click",
    "telegram_click",
    "email_click",
    "form_open",
    "form_start",
    "form_submit_attempt",
    "form_submit_success",
    "cta_click",
}
FORM_OUTCOME_EVENTS = {
    "form_submit_attempt",
    "form_submit_success",
    "form_submit_error",
    "form_validation_error",
    "form_submit_blocked",
}
BUSINESS_OUTCOME_EVENTS = {"qualified_lead", "call_answered", "repair_order_created", "service_contract_created"}
TRACKED_EVENTS = VISIBILITY_EVENTS | HUMAN_DECISION_EVENTS | FORM_OUTCOME_EVENTS | BUSINESS_OUTCOME_EVENTS
DECISION_EVENTS = TRACKED_EVENTS

LEGACY_DECISION_EVENTS = {
    "qualified_lead",
    "call_answered",
    "repair_order_created",
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
    parser.add_argument("--page-context", default="", help="Path to metrics-page-context.json override.")
    parser.add_argument("--policy", default="", help="Path to metrics-scorecard-policy.json override.")
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


def first_existing(paths: List[Path]) -> Optional[Path]:
    return next((path for path in paths if path.exists()), None)


def read_json_file(path: Optional[Path]) -> Dict[str, Any]:
    if not path or not path.exists():
        return {}
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}
    return value if isinstance(value, dict) else {}


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
    if event not in TRACKED_EVENTS:
        return False
    if row.get("is_decision_event") is False and event not in (VISIBILITY_EVENTS | FORM_OUTCOME_EVENTS | BUSINESS_OUTCOME_EVENTS):
        return False
    quality = clean_key(row.get("quality"), 80) or "human_candidate"
    if quality in DECISION_QUALITY or event in VISIBILITY_EVENTS or event in FORM_OUTCOME_EVENTS or (event in BUSINESS_OUTCOME_EVENTS and quality == "internal"):
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
                "page_view": 0,
                "qualified_lead": 0,
                "call_answered": 0,
                "repair_order_created": 0,
                "service_contract_created": 0,
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


def page_path_from_file(file_name: str) -> str:
    file_name = clean_key(file_name, 240)
    return "/" if file_name in {"", "index.html", "/"} else f"/{file_name.lstrip('/')}"


def canonical_page_path(value: Any) -> str:
    page = clean_key(value, 240)
    if page in {"", "index.html", "/index.html"}:
        return "/"
    return page if page.startswith("/") else f"/{page}"


def ratio(numerator: int, denominator: int) -> str:
    return f"{(numerator / denominator) if denominator else 0:.4f}"


def build_page_scorecard(
    date: str,
    events: List[Dict[str, Any]],
    leads: List[Dict[str, Any]],
    page_context: Dict[str, Any],
    query_actions: List[Dict[str, Any]],
    policy: Dict[str, Any],
) -> List[Dict[str, Any]]:
    pages: Dict[str, Dict[str, Any]] = {}
    for file_name, context in (page_context.get("pages") or {}).items():
        if not isinstance(context, dict):
            continue
        page_path = page_path_from_file(file_name)
        pages[page_path] = {
            "page_path": page_path,
            "page_intent": clean_key(context.get("page_intent"), 80),
            "equipment": clean_key(context.get("equipment"), 80),
            "branch": clean_key(context.get("branch"), 40),
            "page_version": clean_key(context.get("page_version"), 80),
        }

    event_groups: Dict[str, Dict[str, Any]] = {}
    all_event_names = TRACKED_EVENTS
    for row in events:
        page_path = canonical_page_path(row.get("page_path") or row.get("page"))
        if page_path not in pages:
            pages[page_path] = {"page_path": page_path}
        item = event_groups.setdefault(page_path, {
            "page_views": 0,
            "page_view_sessions": set(),
            "observed_sessions": set(),
            "event_sessions": defaultdict(set),
            "counts": Counter(),
            "page_version": "",
            "page_intent": "",
            "equipment": "",
        })
        event = clean_key(row.get("event"), 80)
        if event not in all_event_names:
            continue
        item["counts"][event] += 1
        if event == "page_view":
            item["page_views"] += 1
        session = session_key(row)
        if session:
            item["observed_sessions"].add(session)
            item["event_sessions"][event].add(session)
            if event == "page_view":
                item["page_view_sessions"].add(session)
        item["page_version"] = item["page_version"] or clean_key(row.get("page_version"), 80)
        item["page_intent"] = item["page_intent"] or clean_key(row.get("page_intent"), 80)
        item["equipment"] = item["equipment"] or clean_key(row.get("equipment"), 80)

    leads_by_page = Counter()
    for row in leads:
        if event_date(row) != date:
            continue
        status = clean_key(row.get("status") or row.get("lead_status") or "lead_created", 120)
        if status not in {"lead_created", "delivered", "lead_qualified", "qualified"}:
            continue
        leads_by_page[canonical_page_path(row.get("page_path") or row.get("page"))] += 1

    query_by_page = Counter()
    mismatch_by_page = Counter()
    for row in query_actions:
        page_path = canonical_page_path(row.get("landing_path"))
        if page_path == "/" and not clean_key(row.get("landing_path"), 240):
            continue
        query_by_page[page_path] += 1
        if clean_key(row.get("mismatch"), 80) not in {"", "no", "unknown_no_landing_match"}:
            mismatch_by_page[page_path] += 1

    min_actionable = int(policy.get("minSessionsForActionable") or 5)
    min_confidence = int(policy.get("minSessionsForConfidence") or 30)
    thresholds = policy.get("thresholds") or {}
    actions = policy.get("actions") or {}
    rows = []
    contact_events = CONTACT_EVENTS
    for page_path, page in pages.items():
        item = event_groups.get(page_path, {
            "page_views": 0,
            "page_view_sessions": set(),
            "observed_sessions": set(),
            "event_sessions": defaultdict(set),
            "counts": Counter(),
            "page_version": "",
            "page_intent": "",
            "equipment": "",
        })
        counts = item["counts"]
        sessions = len(item["page_view_sessions"] or item["observed_sessions"]) or item["page_views"]
        cta_view_sessions = len(item["event_sessions"].get("cta_view", set()))
        cta_click_sessions = len(item["event_sessions"].get("cta_click", set()))
        contact_sessions = set().union(*(item["event_sessions"].get(event, set()) for event in contact_events))
        form_start_sessions = len(item["event_sessions"].get("form_start", set()))
        action_sessions = len(set().union(
            item["event_sessions"].get("cta_click", set()),
            contact_sessions,
            item["event_sessions"].get("form_start", set()),
        ))
        attempts = counts.get("form_submit_attempt", 0)
        success = counts.get("form_submit_success", 0)
        errors = counts.get("form_submit_error", 0) + counts.get("form_validation_error", 0)
        blocked = counts.get("form_submit_blocked", 0)
        blocked_or_error_rate = (errors + blocked) / attempts if attempts else 0
        cta_visibility_rate = cta_view_sessions / sessions if sessions else 0
        action_rate = action_sessions / sessions if sessions else 0
        form_start_rate = form_start_sessions / sessions if sessions else 0
        form_success_rate = success / attempts if attempts else 0
        lead_count = leads_by_page.get(page_path, 0)
        qualified_leads = counts.get("qualified_lead", 0)
        calls_answered = counts.get("call_answered", 0)
        repair_orders = counts.get("repair_order_created", 0)
        service_contracts = counts.get("service_contract_created", 0)
        outcome_sessions = len(set().union(*(
            item["event_sessions"].get(event, set()) for event in BUSINESS_OUTCOME_EVENTS
        )))

        if sessions < min_actionable:
            priority, action_code = "P3", "collect_more_data"
            evidence = f"clean_sessions={sessions}<{min_actionable}"
        elif item["page_views"] > 0 and cta_view_sessions == 0:
            priority, action_code = "P1", "instrumentation_gap"
            evidence = f"page_views={item['page_views']};cta_view_sessions=0"
        elif item["page_views"] == 0 and item["observed_sessions"]:
            priority, action_code = "P1", "instrumentation_gap"
            evidence = f"events_without_page_view;observed_sessions={len(item['observed_sessions'])}"
        elif attempts > 0 and success == 0 and blocked_or_error_rate >= float(thresholds.get("highBlockedOrErrorRate", 0.35)):
            priority, action_code = "P0", "form_friction"
            evidence = f"attempts={attempts};success=0;blocked_or_error_rate={blocked_or_error_rate:.4f}"
        elif attempts > 0 and success == 0:
            priority, action_code = "P0", "backend_delivery"
            evidence = f"attempts={attempts};success=0"
        elif form_start_sessions > 0 and success == 0:
            priority, action_code = "P2", "form_friction"
            evidence = f"form_start_sessions={form_start_sessions};success=0"
        elif cta_view_sessions > 0 and action_sessions == 0:
            priority, action_code = "P1", "cta_dead"
            evidence = f"cta_view_sessions={cta_view_sessions};action_sessions=0"
        elif cta_visibility_rate < float(thresholds.get("lowCtaVisibilityRate", 0.35)) or action_rate < float(thresholds.get("lowActionRate", 0.03)):
            priority, action_code = "P1", "cta_dead"
            evidence = f"cta_visibility_rate={cta_visibility_rate:.4f};action_rate={action_rate:.4f}"
        else:
            priority, action_code = "P3", "keep_monitoring"
            evidence = f"clean_sessions={sessions};action_sessions={action_sessions};leads={lead_count}"

        confidence = "high" if sessions >= min_confidence else "medium" if sessions >= min_actionable else "low"
        rows.append({
            "date": date,
            "page_path": page_path,
            "page_intent": page.get("page_intent") or item["page_intent"] or infer_landing_intent(page_path),
            "equipment": page.get("equipment") or item["equipment"],
            "branch": page.get("branch", ""),
            "page_version": page.get("page_version") or item["page_version"],
            "page_views": item["page_views"],
            "sessions": sessions,
            "cta_views": counts.get("cta_view", 0),
            "cta_view_sessions": cta_view_sessions,
            "cta_clicks": counts.get("cta_click", 0),
            "contact_clicks": sum(counts.get(event, 0) for event in contact_events),
            "action_sessions": action_sessions,
            "form_starts": counts.get("form_start", 0),
            "form_start_sessions": form_start_sessions,
            "form_submit_attempt": attempts,
            "form_submit_success": success,
            "form_submit_error": counts.get("form_submit_error", 0),
            "form_validation_error": counts.get("form_validation_error", 0),
            "form_submit_blocked": blocked,
            "leads": lead_count,
            "qualified_leads": qualified_leads,
            "calls_answered": calls_answered,
            "repair_orders": repair_orders,
            "service_contracts": service_contracts,
            "outcome_sessions": outcome_sessions,
            "direct_query_rows": query_by_page.get(page_path, 0),
            "direct_mismatch_rows": mismatch_by_page.get(page_path, 0),
            "cta_visibility_rate": ratio(cta_view_sessions, sessions),
            "action_rate": ratio(action_sessions, sessions),
            "form_start_rate": ratio(form_start_sessions, sessions),
            "form_success_rate": ratio(success, attempts),
            "lead_rate": ratio(lead_count, sessions),
            "qualified_lead_rate": ratio(qualified_leads, sessions),
            "repair_order_rate": ratio(repair_orders, sessions),
            "service_contract_rate": ratio(service_contracts, sessions),
            "blocked_or_error_rate": f"{blocked_or_error_rate:.4f}",
            "confidence": confidence,
            "priority": priority,
            "action_code": action_code,
            "evidence": evidence,
            "recommendation": actions.get(action_code, "Review page metrics."),
        })

    priority_order = {value: index for index, value in enumerate(policy.get("priorityOrder") or ["P0", "P1", "P2", "P3"])}
    return sorted(rows, key=lambda row: (priority_order.get(row["priority"], 99), -int(row["sessions"]), row["page_path"]))


def build_page_improvement_actions(scorecard: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [
        {
            "date": row["date"],
            "page_path": row["page_path"],
            "page_intent": row["page_intent"],
            "branch": row["branch"],
            "page_version": row["page_version"],
            "priority": row["priority"],
            "confidence": row["confidence"],
            "sessions": row["sessions"],
            "action_code": row["action_code"],
            "evidence": row["evidence"],
            "next_step": row["recommendation"],
        }
        for row in scorecard
        if row["priority"] in {"P0", "P1", "P2"}
    ]


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


def event_timestamp(row: Dict[str, Any]) -> Optional[dt.datetime]:
    value = clean_key(row.get("ts") or row.get("client_event_ts"), 80)
    if not value:
        return None
    try:
        return dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def build_internal_link_funnel(date: str, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Measure related-category clicks through the next same-session decision.

    The report intentionally uses only page paths, CTA ids, and session hashes.
    A chain is attributed when a contact/form event occurs on a different page
    within 30 minutes after the internal-link click.
    """
    grouped: Dict[Tuple[str, str, str, str], Dict[str, Any]] = {}
    session_rows: Dict[str, List[Tuple[int, Dict[str, Any], Optional[dt.datetime]]]] = defaultdict(list)
    click_rows: List[Tuple[Tuple[str, str, str, str], str, int, Optional[dt.datetime]]] = []

    for index, row in enumerate(events):
        session = session_key(row)
        timestamp = event_timestamp(row)
        if session:
            session_rows[session].append((index, row, timestamp))

        event = clean_key(row.get("event"), 80)
        cta_group = clean_key(row.get("cta_group"), 80)
        block = clean_key(row.get("block"), 120)
        if event not in {"cta_view", "cta_click"}:
            continue
        if cta_group != "internal_link" and block != "related_categories":
            continue

        source_page = canonical_page_path(row.get("page_path") or row.get("page"))
        cta_id = clean_key(row.get("cta_id") or "unknown", 160)
        key = (source_page, cta_id, block or "related_categories", cta_group or "internal_link")
        if key not in grouped:
            grouped[key] = {
                "date": date,
                "source_page_path": source_page,
                "cta_id": cta_id,
                "block": block or "related_categories",
                "cta_group": cta_group or "internal_link",
                "views": 0,
                "view_sessions": set(),
                "clicks": 0,
                "click_sessions": set(),
                "next_page_sessions": set(),
                "next_contact_sessions": set(),
                "next_form_start_sessions": set(),
                "next_form_submit_success_sessions": set(),
                "next_decision_sessions": set(),
                "next_page_paths": set(),
            }
        item = grouped[key]
        if event == "cta_view":
            item["views"] += 1
            if session:
                item["view_sessions"].add(session)
        elif event == "cta_click":
            item["clicks"] += 1
            if session:
                item["click_sessions"].add(session)
                click_rows.append((key, session, index, timestamp))

    def within_window(click_ts: Optional[dt.datetime], candidate_ts: Optional[dt.datetime], click_index: int, candidate_index: int) -> bool:
        if candidate_index <= click_index:
            return False
        if click_ts is None or candidate_ts is None:
            return True
        delta = (candidate_ts - click_ts).total_seconds()
        return 0 <= delta <= 30 * 60

    for key, session, click_index, click_ts in click_rows:
        source_page = key[0]
        for candidate_index, candidate, candidate_ts in session_rows.get(session, []):
            if not within_window(click_ts, candidate_ts, click_index, candidate_index):
                continue
            candidate_event = clean_key(candidate.get("event"), 80)
            candidate_page = canonical_page_path(candidate.get("page_path") or candidate.get("page"))
            if candidate_page == source_page:
                continue
            if candidate_event == "page_view":
                grouped[key]["next_page_sessions"].add(session)
                grouped[key]["next_page_paths"].add(candidate_page)
            if candidate_event in CONTACT_EVENTS:
                grouped[key]["next_contact_sessions"].add(session)
            if candidate_event == "form_start":
                grouped[key]["next_form_start_sessions"].add(session)
            if candidate_event == "form_submit_success":
                grouped[key]["next_form_submit_success_sessions"].add(session)
            if candidate_event in HUMAN_DECISION_EVENTS:
                grouped[key]["next_decision_sessions"].add(session)

    rows = []
    for item in grouped.values():
        click_sessions = len(item["click_sessions"])
        rows.append({
            "date": item["date"],
            "source_page_path": item["source_page_path"],
            "cta_id": item["cta_id"],
            "block": item["block"],
            "cta_group": item["cta_group"],
            "views": item["views"],
            "view_sessions": len(item["view_sessions"]),
            "clicks": item["clicks"],
            "click_sessions": click_sessions,
            "next_page_sessions": len(item["next_page_sessions"]),
            "next_page_paths": "|".join(sorted(item["next_page_paths"])),
            "next_contact_sessions": len(item["next_contact_sessions"]),
            "next_form_start_sessions": len(item["next_form_start_sessions"]),
            "next_form_submit_success_sessions": len(item["next_form_submit_success_sessions"]),
            "next_decision_sessions": len(item["next_decision_sessions"]),
            "view_to_click_rate": ratio(item["clicks"], item["views"]),
            "click_to_next_page_rate": ratio(len(item["next_page_sessions"]), click_sessions),
            "click_to_contact_rate": ratio(len(item["next_contact_sessions"]), click_sessions),
            "click_to_decision_rate": ratio(len(item["next_decision_sessions"]), click_sessions),
            "confidence": "high" if click_sessions >= 30 else "medium" if click_sessions >= 5 else "low",
        })
    return sorted(rows, key=lambda row: (row["source_page_path"], row["cta_id"], row["block"]))


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
        status = clean_key(row.get("status") or row.get("lead_status") or "", 120)
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
        if event == "form_submit_success" or event in BUSINESS_OUTCOME_EVENTS:
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
                "qualified_leads": event_leads[(utm_campaign, utm_content, landing)],
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
            "outcome_quality": ["internal"],
            "page_scorecard_policy": "data/metrics-scorecard-policy.json",
            "no_raw_page_scorecard": True,
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
    page_context_path = Path(args.page_context) if args.page_context else first_existing([
        base / "raw" / "context" / "metrics-page-context.json",
        base / "config" / "metrics-page-context.json",
    ])
    policy_path = Path(args.policy) if args.policy else first_existing([
        base / "raw" / "context" / "metrics-scorecard-policy.json",
        base / "config" / "metrics-scorecard-policy.json",
    ])
    page_context = read_json_file(page_context_path)
    scorecard_policy = read_json_file(policy_path)
    out_dir.mkdir(parents=True, exist_ok=True)

    all_events = [row for row in iter_jsonl(events_path) if event_date(row) == date]
    clean_events = [row for row in all_events if is_clean_event(row, include_suspicious=args.include_suspicious)]
    rejected = [row for row in iter_jsonl(rejected_path) if event_date(row) == date]
    leads = list(iter_jsonl(leads_path))
    direct_rows = read_direct_search(direct_path)

    outputs: List[Path] = []

    event_funnel = build_event_funnel(date, clean_events)
    p = out_dir / f"llm_event_funnel_{date}.csv"
    write_csv(p, event_funnel, ["date", "page_path", "page_intent", "sessions", "page_view", "qualified_lead", "call_answered", "repair_order_created", "service_contract_created", "cta_view", "cta_click", "phone_click", "whatsapp_click", "telegram_click", "email_click", "form_open", "form_start", "form_submit_attempt", "form_submit_success", "form_submit_error", "form_validation_error", "form_submit_blocked"])
    outputs.append(p)

    cta = build_cta_performance(date, clean_events)
    p = out_dir / f"llm_cta_performance_{date}.csv"
    write_csv(p, cta, ["date", "page_path", "cta_id", "block", "views", "clicks", "ctr", "lead_success_after_click"])
    outputs.append(p)

    internal_link_funnel = build_internal_link_funnel(date, clean_events)
    p = out_dir / f"llm_internal_link_funnel_{date}.csv"
    write_csv(p, internal_link_funnel, [
        "date", "source_page_path", "cta_id", "block", "cta_group", "views", "view_sessions", "clicks",
        "click_sessions", "next_page_sessions", "next_page_paths", "next_contact_sessions",
        "next_form_start_sessions", "next_form_submit_success_sessions", "next_decision_sessions",
        "view_to_click_rate", "click_to_next_page_rate", "click_to_contact_rate", "click_to_decision_rate", "confidence",
    ])
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

    scorecard = build_page_scorecard(date, clean_events, leads, page_context, query_actions, scorecard_policy)
    p = out_dir / f"llm_page_scorecard_{date}.csv"
    write_csv(p, scorecard, [
        "date", "page_path", "page_intent", "equipment", "branch", "page_version", "page_views", "sessions",
        "cta_views", "cta_view_sessions", "cta_clicks", "contact_clicks", "action_sessions", "form_starts",
        "form_start_sessions", "form_submit_attempt", "form_submit_success", "form_submit_error",
        "form_validation_error", "form_submit_blocked", "leads", "qualified_leads", "calls_answered", "repair_orders", "service_contracts", "outcome_sessions", "direct_query_rows", "direct_mismatch_rows",
        "cta_visibility_rate", "action_rate", "form_start_rate", "form_success_rate", "lead_rate", "qualified_lead_rate", "repair_order_rate", "service_contract_rate",
        "blocked_or_error_rate", "confidence", "priority", "action_code", "evidence", "recommendation",
    ])
    outputs.append(p)

    improvement_actions = build_page_improvement_actions(scorecard)
    p = out_dir / f"llm_page_improvement_actions_{date}.csv"
    write_csv(p, improvement_actions, [
        "date", "page_path", "page_intent", "branch", "page_version", "priority", "confidence", "sessions",
        "action_code", "evidence", "next_step",
    ])
    outputs.append(p)

    manifest = out_dir / f"llm_events_manifest_{date}.json"
    write_manifest(manifest, date, outputs, {
        "raw_events_for_date": len(all_events),
        "clean_events_for_date": len(clean_events),
        "rejected_events_for_date": len(rejected),
        "leads_total_seen": len(leads),
        "direct_search_rows_seen": len(direct_rows),
        "outcome_events_for_date": sum(1 for row in clean_events if clean_key(row.get("event"), 80) in BUSINESS_OUTCOME_EVENTS),
        "page_context_pages": len(page_context.get("pages") or {}),
        "scorecard_pages": len(scorecard),
        "improvement_actions": len(improvement_actions),
        "internal_link_funnel_rows": len(internal_link_funnel),
    }, {
        "events": str(events_path),
        "rejected": str(rejected_path),
        "leads": str(leads_path),
        "direct_search": str(direct_path),
        "page_context": str(page_context_path) if page_context_path else "",
        "policy": str(policy_path) if policy_path else "",
    })
    outputs.append(manifest)

    print(f"OK: wrote {len(outputs)} files to {out_dir}")
    for item in outputs:
        print(item)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
