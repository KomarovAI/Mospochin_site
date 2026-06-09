#!/usr/bin/env python3
"""Create a clean MosPochin full-project ZIP without nested deploy/debug artifacts.

Uses only Python standard library so it works on a plain local machine.
"""
from __future__ import annotations

import argparse
import fnmatch
import json
import os
from pathlib import Path
import sys
import time
import zipfile

DEFAULT_IGNORE = [
    ".git/",
    "node_modules/",
    ".venv/",
    ".venv-visual/",
    "venv/",
    "__pycache__/",
    ".pytest_cache/",
    ".cache/",
    ".deploy/dist/",
    ".artifacts/",
    ".archives/",
    "reports/visual-ai-review/",
    "playwright-report/",
    "test-results/",
    "*.zip",
    "*.tar",
    "*.tar.gz",
    "*.tgz",
    "*.log",
]

REQUIRED_FILES = [
    "package.json",
    "tools/build-site.mjs",
    "src/site-builder.json",
    "styles-combined.css",
    "main.js",
    ".deploy/include-files.txt",
]


def load_patterns(root: Path) -> list[str]:
    p = root / ".project-archiveignore"
    patterns = list(DEFAULT_IGNORE)
    if p.exists():
        patterns = []
        for line in p.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            patterns.append(line)
    return patterns


def norm_rel(path: Path, root: Path) -> str:
    return path.relative_to(root).as_posix()


def matches_pattern(rel: str, pattern: str) -> bool:
    pattern = pattern.strip()
    if not pattern:
        return False
    if pattern.endswith("/"):
        prefix = pattern.rstrip("/") + "/"
        return rel == pattern.rstrip("/") or rel.startswith(prefix)
    if "/" in pattern:
        return fnmatch.fnmatch(rel, pattern)
    return fnmatch.fnmatch(Path(rel).name, pattern)


def is_ignored(rel: str, patterns: list[str]) -> bool:
    return any(matches_pattern(rel, pattern) for pattern in patterns)


def collect_files(root: Path, output: Path | None, patterns: list[str]) -> list[Path]:
    files: list[Path] = []
    output_resolved = output.resolve() if output else None
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if output_resolved and path.resolve() == output_resolved:
            continue
        rel = norm_rel(path, root)
        if is_ignored(rel, patterns):
            continue
        files.append(path)
    return sorted(files, key=lambda p: norm_rel(p, root))


def human_size(num: int) -> str:
    n = float(num)
    for unit in ["B", "KB", "MB", "GB"]:
        if n < 1024 or unit == "GB":
            return f"{n:.1f}{unit}"
        n /= 1024
    return f"{n:.1f}GB"


def main() -> int:
    parser = argparse.ArgumentParser(description="Create clean MosPochin project archive")
    parser.add_argument("--root", default=".", help="Project root")
    parser.add_argument("--output", default="", help="Output ZIP path")
    parser.add_argument("--dry-run", action="store_true", help="Only print/archive report, do not write ZIP")
    parser.add_argument("--strict", action="store_true", help="Fail if nested archives/logs would be included")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    if not root.exists():
        print(f"ERROR: root does not exist: {root}", file=sys.stderr)
        return 2

    missing = [name for name in REQUIRED_FILES if not (root / name).exists()]
    if missing:
        print("ERROR: not a MosPochin project root; missing:", ", ".join(missing), file=sys.stderr)
        return 2

    patterns = load_patterns(root)
    timestamp = time.strftime("%Y%m%dT%H%M%SZ", time.gmtime())
    output = Path(args.output).resolve() if args.output else (root / ".archives" / f"mospochin-site-project-{timestamp}.zip").resolve()

    files = collect_files(root, output, patterns)
    raw_size = sum(p.stat().st_size for p in files)
    suspicious = []
    for p in files:
        rel = norm_rel(p, root)
        suffix = p.name.lower()
        if suffix.endswith((".zip", ".tar", ".tar.gz", ".tgz", ".log")):
            suspicious.append(rel)
        if rel.startswith(".deploy/dist/") or rel.startswith("reports/visual-ai-review/"):
            suspicious.append(rel)

    report = {
        "root": str(root),
        "output": str(output),
        "dryRun": args.dry_run,
        "patterns": patterns,
        "files": len(files),
        "rawBytes": raw_size,
        "rawSize": human_size(raw_size),
        "suspiciousIncluded": suspicious[:100],
        "suspiciousIncludedCount": len(suspicious),
    }

    print(json.dumps(report, ensure_ascii=False, indent=2))

    if args.strict and suspicious:
        print("ERROR: archive hygiene failed; suspicious artifacts would be included", file=sys.stderr)
        return 1

    if args.dry_run:
        return 0

    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        top = root.name
        for p in files:
            rel = norm_rel(p, root)
            zf.write(p, f"{top}/{rel}")

    print(f"created={output}")
    print(f"size={human_size(output.stat().st_size)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
