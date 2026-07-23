#!/usr/bin/env python3
# MOSPOCHIN_MANAGED_INCLUDES_REPAIR_V4

from __future__ import annotations

from pathlib import Path
import re
import sys

if len(sys.argv) < 3:
    raise SystemExit(
        "usage: repair-managed-includes.py SITE_CONFIG SNIPPET [SNIPPET ...]"
    )

site_config = Path(sys.argv[1])
snippet_paths = [Path(value) for value in sys.argv[2:]]

if not site_config.is_file():
    raise SystemExit(f"site config not found: {site_config}")

text = site_config.read_text(encoding="utf-8")
managed = [
    (f"include snippets/{path.name};", path)
    for path in snippet_paths
]

for include_line, _ in managed:
    snippet_name = re.escape(include_line.split("snippets/", 1)[1].rstrip(";"))
    text = re.sub(
        rf"(?m)^[ \t]*include[ \t]+(?:/etc/nginx/)?snippets/{snippet_name};"
        rf"[ \t]*(?:\n|$)",
        "",
        text,
    )


def mask_nginx(source: str) -> str:
    chars = list(source)
    quote: str | None = None
    escaped = False
    comment = False

    for index, char in enumerate(source):
        if comment:
            if char == "\n":
                comment = False
            else:
                chars[index] = " "
            continue

        if quote is not None:
            if escaped:
                escaped = False
                chars[index] = " "
                continue
            if char == "\\":
                escaped = True
                chars[index] = " "
                continue
            if char == quote:
                quote = None
            chars[index] = " "
            continue

        if char in ("'", '"'):
            quote = char
            chars[index] = " "
        elif char == "#":
            comment = True
            chars[index] = " "

    return "".join(chars)


def server_blocks(source: str) -> list[tuple[int, int, str]]:
    masked = mask_nginx(source)
    result: list[tuple[int, int, str]] = []

    for match in re.finditer(r"\bserver\s*\{", masked):
        open_pos = masked.find("{", match.start(), match.end())
        depth = 0

        for pos in range(open_pos, len(masked)):
            if masked[pos] == "{":
                depth += 1
            elif masked[pos] == "}":
                depth -= 1
                if depth == 0:
                    result.append((open_pos, pos, source[open_pos : pos + 1]))
                    break

    return result


def is_mospochin_server(block: str) -> bool:
    return bool(
        re.search(
            r"(?im)^\s*server_name\s+[^;]*"
            r"(?:^|[\s.])mospochin\.ru(?:[\s;]|$)",
            block,
        )
    )


blocks = [item for item in server_blocks(text) if is_mospochin_server(item[2])]
ssl_blocks = [
    item
    for item in blocks
    if re.search(r"(?im)^\s*listen\s+[^;]*\b443\b", item[2])
    or re.search(r"(?im)^\s*ssl\s+on\s*;", item[2])
]

candidates = ssl_blocks or blocks
if not candidates:
    raise SystemExit("MosPochin server block not found")

active_includes = [
    include_line
    for include_line, snippet_path in managed
    if snippet_path.is_file()
]

if active_includes:
    open_pos, _, _ = candidates[0]
    line_start = text.rfind("\n", 0, open_pos) + 1
    server_indent = re.match(r"[ \t]*", text[line_start:open_pos]).group(0)
    child_indent = server_indent + "    "

    insertion = "\n" + "\n".join(
        child_indent + include_line for include_line in active_includes
    )

    text = text[: open_pos + 1] + insertion + text[open_pos + 1 :]

for include_line, snippet_path in managed:
    expected = 1 if snippet_path.is_file() else 0
    actual = text.count(include_line)
    if actual != expected:
        raise SystemExit(
            f"managed include count mismatch for {include_line}: "
            f"expected {expected}, got {actual}"
        )

tmp = site_config.with_name(site_config.name + ".managed-includes.tmp")
tmp.write_text(text.rstrip() + "\n", encoding="utf-8")
tmp.chmod(site_config.stat().st_mode)
tmp.replace(site_config)

for include_line in active_includes:
    print(include_line)
