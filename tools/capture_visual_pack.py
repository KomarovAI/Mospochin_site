#!/usr/bin/env python3
"""Create a local screenshot ZIP pack for AI visual review.

This script is intentionally Python-first so it can be run outside the Node
visual pipeline. It serves the static site from the project root, captures
screenshots with Playwright for Python, writes a review manifest/template, and
optionally packs everything into a standalone ZIP that can be uploaded to
ChatGPT for image-based review.
"""
from __future__ import annotations

import argparse
import contextlib
import datetime as _dt
import hashlib
import html
import json
import os
import platform
import shutil
import socket
import sys
import threading
import time
import zipfile
from dataclasses import dataclass
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Iterable

ROOT_DEFAULT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = Path("data/visual-ai-capture-manifest.json")
DEFAULT_OUTPUT_ROOT = Path("reports/visual-ai-review")


@dataclass(frozen=True)
class Viewport:
    id: str
    width: int
    height: int
    device_scale_factor: float = 1
    is_mobile: bool = False
    has_touch: bool = False
    full_page: bool = False

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "Viewport":
        return cls(
            id=str(data["id"]),
            width=int(data["width"]),
            height=int(data["height"]),
            device_scale_factor=float(data.get("deviceScaleFactor", 1)),
            is_mobile=bool(data.get("isMobile", False)),
            has_touch=bool(data.get("hasTouch", False)),
            full_page=bool(data.get("fullPage", False)),
        )

    @property
    def label(self) -> str:
        suffix = "_full" if self.full_page else ""
        return f"{self.id}_{self.width}x{self.height}{suffix}"


def now_stamp() -> str:
    return _dt.datetime.now(_dt.UTC).strftime("%Y%m%dT%H%M%SZ")


def to_posix(path: Path | str) -> str:
    return str(path).replace(os.sep, "/")


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def load_json(path: Path) -> dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise SystemExit(f"Manifest not found: {path}")
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Invalid JSON manifest {path}: {exc}") from exc


def dump_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def normalize_page(page: str) -> str:
    page = page.strip().lstrip("/")
    if not page:
        page = "index.html"
    if page.endswith("/"):
        page += "index.html"
    return page


def page_slug(page: str) -> str:
    page = normalize_page(page)
    if page == "index.html":
        return "index"
    return page.replace(".html", "").replace("/", "__")


def read_manifest(manifest_path: Path, mode: str, custom_pages: list[str] | None) -> tuple[dict[str, Any], list[str], list[Viewport]]:
    manifest = load_json(manifest_path)
    raw_viewports = manifest.get("viewports") or []
    if not raw_viewports:
        raise SystemExit(f"No viewports in manifest: {manifest_path}")
    viewports = [Viewport.from_dict(v) for v in raw_viewports]

    if custom_pages:
        pages = [normalize_page(p) for p in custom_pages]
    elif mode == "all":
        root = manifest_path.parent.parent
        pages = sorted(p.name for p in root.glob("*.html"))
    else:
        modes = manifest.get("modes") or {}
        if mode not in modes:
            available = ", ".join(sorted([*modes.keys(), "all"]))
            raise SystemExit(f"Unknown mode '{mode}'. Available modes: {available}")
        pages = [normalize_page(p) for p in modes[mode]]

    # Preserve order and remove duplicates.
    seen: set[str] = set()
    ordered = []
    for page in pages:
        if page not in seen:
            ordered.append(page)
            seen.add(page)

    return manifest, ordered, viewports


def ensure_project_root(root: Path) -> Path:
    root = root.resolve()
    required = ["styles-combined.css", "main.js"]
    html_files = list(root.glob("*.html"))
    missing = [name for name in required if not (root / name).exists()]
    if missing:
        raise SystemExit(f"Not a MosPochin project root or missing files in {root}: {', '.join(missing)}")
    if not html_files:
        raise SystemExit(f"No root HTML files found in {root}")
    return root


def validate_pages(root: Path, pages: Iterable[str]) -> list[str]:
    missing = [p for p in pages if not (root / p).is_file()]
    if missing:
        raise SystemExit("Missing HTML pages:\n- " + "\n- ".join(missing))
    return list(pages)


def is_port_free(host: str, port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.4)
        return sock.connect_ex((host, port)) != 0


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args: Any) -> None:  # noqa: A002 - inherited name
        return


def start_server(root: Path, host: str, port: int) -> ThreadingHTTPServer:
    if not is_port_free(host, port):
        raise SystemExit(f"Port {host}:{port} is busy. Retry with --port {port + 1}.")

    class Handler(QuietHandler):
        def __init__(self, *args: Any, **kwargs: Any) -> None:
            super().__init__(*args, directory=str(root), **kwargs)

    server = ThreadingHTTPServer((host, port), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server


def environment_info(root: Path, manifest_path: Path, mode: str, pages: list[str], viewports: list[Viewport], dry_run: bool) -> dict[str, Any]:
    return {
        "project": "mospochin-site",
        "generatedAt": _dt.datetime.now(_dt.UTC).isoformat().replace("+00:00", "Z"),
        "mode": mode,
        "dryRun": dry_run,
        "root": str(root),
        "manifestPath": to_posix(manifest_path),
        "python": sys.version.replace("\n", " "),
        "platform": platform.platform(),
        "pages": len(pages),
        "viewports": [v.__dict__ for v in viewports],
        "env": {
            "PLAYWRIGHT_CHROMIUM_EXECUTABLE": os.environ.get("PLAYWRIGHT_CHROMIUM_EXECUTABLE", ""),
        },
    }


def make_review_template(screenshots: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "schemaVersion": 1,
        "project": "mospochin-site",
        "reviewType": "ai-visual-screenshot-review",
        "finalStatus": "todo",
        "summary": "",
        "globalIssues": [],
        "screenshots": [
            {
                "id": item["id"],
                "page": item["page"],
                "viewport": item["viewport"],
                "path": item["path"],
                "status": "todo",
                "issues": [],
                "notes": "",
            }
            for item in screenshots
        ],
        "requiredChecklist": [
            "нет служебных слов: SEO-блок, hub, repair bridge, landing, Stage, P0/P1, generated, handoff",
            "первый экран понятен клиенту и не выглядит как внутренний ТЗ/SEO-дор",
            "видимый телефон: 8 (999) 005-71-72",
            "нет 0 ресторанов / 0 ремонтов / 0 лет / 0 выездов",
            "mobile sticky CTA не перекрывает важный контент или форму",
            "CTA звучат человечески и ведут к звонку/WhatsApp/форме",
            "брендовые страницы Rational/Unox отличаются от hub и друг от друга",
            "error/symptom страницы выглядят как ремонтный сценарий, а не служебный bridge",
            "desktop 1440 без налезаний, огромных дыр и визуального мусора",
            "mobile 393 без каши из chips и перегруза первого экрана",
        ],
    }


def make_ai_review_md(run_id: str, screenshots: list[dict[str, Any]], zip_name: str | None = None) -> str:
    rows = []
    for item in screenshots:
        rows.append(f"| `{item['id']}` | `{item['page']}` | `{item['viewport']}` | `{item['path']}` |")
    rows_text = "\n".join(rows) if rows else "| — | — | — | — |"
    zip_line = f"- ZIP: `{zip_name}`\n" if zip_name else ""
    return f"""# MosPochin visual AI review pack

Run ID: **{run_id}**
{zip_line}
## Как использовать в ChatGPT

Загрузи этот ZIP в ChatGPT и попроси:

> Проанализируй screenshots desktop/mobile/full-page, найди визуальные, UX и content-проблемы. Особенно проверь служебные слова, первый экран, CTA, sticky overlap, телефон, формы, странные блоки и клоновость страниц.

## Что обязательно проверить глазами

- Нет видимых служебных слов: `SEO-блок`, `hub`, `repair bridge`, `landing`, `Stage`, `P0/P1`, `generated`, `handoff`.
- Первый экран понятен обычному клиенту, а не разработчику.
- Телефон видимый: `8 (999) 005-71-72`.
- Нет `0 ресторанов`, `0 ремонтов`, `0 лет`, `0 выездов`.
- Mobile sticky CTA не перекрывает форму/CTA/важный текст.
- CTA человеческие: звонок, WhatsApp, заявка, фото ошибки/модели.
- Hub / Rational / Unox / error / symptom страницы визуально и смыслово различаются.
- Error/symptom страницы ведут к ремонту, а не выглядят как SEO-дор.
- Desktop 1440 без налезаний, дыр и странной сетки.
- Mobile 393 без каши из chips и перегруза.

## Screenshots

| ID | Page | Viewport | File |
|---|---|---|---|
{rows_text}

## Формат ответа нейронки

```text
PASS / FIX
page:
viewport:
priority: must / should / nice
issue:
why it matters:
fix:
```
"""


def zip_directory(source_dir: Path, zip_path: Path) -> None:
    if zip_path.exists():
        zip_path.unlink()
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for file in sorted(source_dir.rglob("*")):
            if file.is_file():
                if file.resolve() == zip_path.resolve():
                    continue
                zf.write(file, file.relative_to(source_dir))


def copy_html_snapshots(root: Path, pages: list[str], out_dir: Path) -> None:
    snap_dir = out_dir / "html-snapshots"
    snap_dir.mkdir(parents=True, exist_ok=True)
    for page in pages:
        src = root / page
        if src.exists():
            dest = snap_dir / page
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(src, dest)


def write_common_artifacts(
    out_dir: Path,
    run_id: str,
    env: dict[str, Any],
    manifest: dict[str, Any],
    pages: list[str],
    viewports: list[Viewport],
    screenshots: list[dict[str, Any]],
    logs: list[str],
    zip_name: str | None,
) -> None:
    dump_json(out_dir / "environment.json", env)
    dump_json(out_dir / "manifest.json", manifest)
    dump_json(out_dir / "pages.json", {"pages": pages, "viewports": [v.__dict__ for v in viewports]})
    dump_json(out_dir / "review-template.json", make_review_template(screenshots))
    (out_dir / "AI_VISUAL_REVIEW.md").write_text(make_ai_review_md(run_id, screenshots, zip_name), encoding="utf-8")
    log_dir = out_dir / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    (log_dir / "capture.log").write_text("\n".join(logs) + "\n", encoding="utf-8")


def capture_screenshots(
    root: Path,
    out_dir: Path,
    pages: list[str],
    viewports: list[Viewport],
    host: str,
    port: int,
    wait_after_load_ms: int,
    timeout_ms: int,
    executable_path: str | None,
    headful: bool,
    logs: list[str],
    overflow_tolerance_css_px: int,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]]]:
    try:
        from playwright.sync_api import sync_playwright  # type: ignore
    except Exception as exc:  # pragma: no cover - depends on local env
        raise SystemExit(
            "Playwright for Python is not installed. Run:\n"
            "  pip install -r requirements-visual.txt\n"
            "  python -m playwright install chromium\n"
            f"Original error: {exc}"
        ) from exc

    server = start_server(root, host, port)
    base_url = f"http://{host}:{port}"
    logs.append(f"server={base_url}")
    screenshots_dir = out_dir / "screenshots"
    screenshots_dir.mkdir(parents=True, exist_ok=True)

    screenshot_items: list[dict[str, Any]] = []
    errors: list[dict[str, Any]] = []
    visual_warnings: list[dict[str, Any]] = []

    launch_kwargs: dict[str, Any] = {
        "headless": not headful,
        "args": ["--no-sandbox", "--disable-dev-shm-usage"],
    }
    resolved_executable = executable_path or os.environ.get("PLAYWRIGHT_CHROMIUM_EXECUTABLE") or None
    if resolved_executable:
        launch_kwargs["executable_path"] = resolved_executable
        logs.append(f"chromiumExecutable={resolved_executable}")

    try:
        with sync_playwright() as p:
            try:
                browser = p.chromium.launch(**launch_kwargs)
            except Exception as exc:  # pragma: no cover - local browser dependent
                hint = """Could not launch Chromium. Try:
  python -m playwright install chromium
or on Linux with missing libraries:
  python -m playwright install --with-deps chromium
or use system Chromium:
  PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium python tools/capture_visual_pack.py --mode smoke --zip"""
                raise SystemExit(f"{hint}\nOriginal error: {exc}") from exc
            try:
                for page_name in pages:
                    for viewport in viewports:
                        context = browser.new_context(
                            viewport={"width": viewport.width, "height": viewport.height},
                            device_scale_factor=viewport.device_scale_factor,
                            is_mobile=viewport.is_mobile,
                            has_touch=viewport.has_touch,
                        )
                        page_obj = context.new_page()
                        url = f"{base_url}/{page_name}"
                        item_id = f"{page_slug(page_name)}__{viewport.label}"
                        rel_png = Path("screenshots") / f"{item_id}.png"
                        png_path = out_dir / rel_png
                        try:
                            page_obj.goto(url, wait_until="networkidle", timeout=timeout_ms)
                            if wait_after_load_ms > 0:
                                page_obj.wait_for_timeout(wait_after_load_ms)
                            metrics = page_obj.evaluate(
                                """() => {
                                    const de = document.documentElement;
                                    const body = document.body;
                                    const bodyScrollWidth = body ? body.scrollWidth : 0;
                                    const bodyOffsetWidth = body ? body.offsetWidth : 0;
                                    const scrollWidth = Math.max(de.scrollWidth || 0, bodyScrollWidth || 0);
                                    const clientWidth = de.clientWidth || window.innerWidth || 0;
                                    const overflowCssPx = Math.max(0, scrollWidth - clientWidth);
                                    return {
                                        innerWidth: window.innerWidth,
                                        innerHeight: window.innerHeight,
                                        clientWidth,
                                        scrollWidth,
                                        bodyScrollWidth,
                                        bodyOffsetWidth,
                                        devicePixelRatio: window.devicePixelRatio || 1,
                                        overflowCssPx,
                                        overflowRatio: clientWidth ? scrollWidth / clientWidth : 1
                                    };
                                }"""
                            )
                            if viewport.is_mobile and int(metrics.get("overflowCssPx", 0)) > overflow_tolerance_css_px:
                                warning = {
                                    "type": "horizontal_overflow",
                                    "page": page_name,
                                    "viewport": viewport.label,
                                    "url": url,
                                    "overflowCssPx": metrics.get("overflowCssPx"),
                                    "clientWidth": metrics.get("clientWidth"),
                                    "scrollWidth": metrics.get("scrollWidth"),
                                    "toleranceCssPx": overflow_tolerance_css_px,
                                }
                                visual_warnings.append(warning)
                                logs.append(
                                    "VISUAL_WARNING horizontal_overflow "
                                    f"{page_name} {viewport.label}: "
                                    f"scrollWidth={metrics.get('scrollWidth')} "
                                    f"clientWidth={metrics.get('clientWidth')} "
                                    f"overflowCssPx={metrics.get('overflowCssPx')}"
                                )
                            page_obj.screenshot(path=str(png_path), full_page=viewport.full_page)
                            screenshot_items.append({
                                "id": item_id,
                                "page": page_name,
                                "viewport": viewport.label,
                                "path": to_posix(rel_png),
                                "url": url,
                                "width": viewport.width,
                                "height": viewport.height,
                                "fullPage": viewport.full_page,
                                "visualMetrics": metrics,
                                "sha256": sha256_file(png_path),
                                "bytes": png_path.stat().st_size,
                            })
                            logs.append(f"captured {page_name} {viewport.label} -> {rel_png}")
                        except Exception as exc:  # pragma: no cover - env/page dependent
                            errors.append({
                                "page": page_name,
                                "viewport": viewport.label,
                                "url": url,
                                "error": str(exc),
                            })
                            logs.append(f"ERROR {page_name} {viewport.label}: {exc}")
                        finally:
                            context.close()
            finally:
                browser.close()
    finally:
        server.shutdown()
        server.server_close()

    return screenshot_items, errors, visual_warnings


def main() -> int:
    parser = argparse.ArgumentParser(description="Capture MosPochin screenshots into an AI-review ZIP pack.")
    parser.add_argument("--mode", default="smoke", help="Manifest mode: smoke, pariki, all, or custom with --page.")
    parser.add_argument("--page", action="append", dest="pages", help="Custom page to capture. Can be passed multiple times.")
    parser.add_argument("--manifest", default=str(DEFAULT_MANIFEST), help="Path to visual capture manifest JSON.")
    parser.add_argument("--base-dir", default=str(ROOT_DEFAULT), help="Project root to serve.")
    parser.add_argument("--output-root", default=str(DEFAULT_OUTPUT_ROOT), help="Output root for review packs.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=9998)
    parser.add_argument("--timeout-ms", type=int, default=30000)
    parser.add_argument("--after-load-ms", type=int, default=None, help="Override post-load wait from manifest.")
    parser.add_argument("--zip", action="store_true", help="Create a standalone ZIP pack.")
    parser.add_argument("--dry-run", action="store_true", help="Validate manifest/pages and create metadata without launching a browser.")
    parser.add_argument("--skip-html-snapshots", action="store_true")
    parser.add_argument("--executable-path", default=None, help="Chromium executable path; also supports PLAYWRIGHT_CHROMIUM_EXECUTABLE env var.")
    parser.add_argument("--headful", action="store_true", help="Run browser in headed mode.")
    parser.add_argument("--overflow-tolerance-css-px", type=int, default=16, help="Warn when mobile document scrollWidth exceeds clientWidth by this many CSS pixels.")
    parser.add_argument("--fail-on-overflow", action="store_true", help="Exit with code 3 if mobile horizontal overflow warnings are detected.")
    args = parser.parse_args()

    root = ensure_project_root(Path(args.base_dir))
    manifest_path = (root / args.manifest).resolve() if not Path(args.manifest).is_absolute() else Path(args.manifest).resolve()
    manifest, pages, viewports = read_manifest(manifest_path, args.mode, args.pages)
    pages = validate_pages(root, pages)

    wait_cfg = manifest.get("wait") or {}
    wait_after_load_ms = int(args.after_load_ms if args.after_load_ms is not None else wait_cfg.get("afterLoadMs", 1800))

    run_id = now_stamp()
    output_root = root / args.output_root if not Path(args.output_root).is_absolute() else Path(args.output_root)
    out_dir = output_root / run_id
    out_dir.mkdir(parents=True, exist_ok=True)
    logs = [f"runId={run_id}", f"mode={args.mode}", f"root={root}"]

    if not args.skip_html_snapshots:
        copy_html_snapshots(root, pages, out_dir)

    screenshots: list[dict[str, Any]] = []
    errors: list[dict[str, Any]] = []
    visual_warnings: list[dict[str, Any]] = []
    if args.dry_run:
        logs.append("dryRun=true; browser capture skipped")
    else:
        screenshots, errors, visual_warnings = capture_screenshots(
            root=root,
            out_dir=out_dir,
            pages=pages,
            viewports=viewports,
            host=args.host,
            port=args.port,
            wait_after_load_ms=wait_after_load_ms,
            timeout_ms=args.timeout_ms,
            executable_path=args.executable_path,
            headful=args.headful,
            logs=logs,
            overflow_tolerance_css_px=args.overflow_tolerance_css_px,
        )

    env = environment_info(root, manifest_path, args.mode, pages, viewports, args.dry_run)
    zip_name = f"mospochin-visual-ai-review-pack-{run_id}.zip" if args.zip else None
    write_common_artifacts(out_dir, run_id, env, manifest, pages, viewports, screenshots, logs, zip_name)
    dump_json(out_dir / "logs" / "errors.json", {"errors": errors})
    dump_json(out_dir / "logs" / "visual-warnings.json", {"warnings": visual_warnings})
    dump_json(out_dir / "logs" / "visual-metrics.json", {"screenshots": screenshots})

    zip_path = None
    if args.zip:
        zip_path = out_dir / zip_name  # type: ignore[arg-type]
        zip_directory(out_dir, zip_path)
        print(f"ZIP: {zip_path}")
    print(f"OUT: {out_dir}")
    print(f"screenshots={len(screenshots)} errors={len(errors)} visualWarnings={len(visual_warnings)} pages={len(pages)} viewports={len(viewports)} dryRun={args.dry_run}")
    if visual_warnings:
        print(f"VISUAL_WARNINGS: see {out_dir / 'logs/visual-warnings.json'}", file=sys.stderr)
    if errors:
        print(f"ERRORS: see {out_dir / 'logs/errors.json'}", file=sys.stderr)
        return 2
    if visual_warnings and args.fail_on_overflow:
        return 3
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
