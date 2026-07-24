#!/usr/bin/env python3
"""Detect a conservative invocation contract for mospochin-rollback."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: detect-mospochin-rollback-contract.py SOURCE", file=sys.stderr)
        return 2

    source_path = Path(sys.argv[1])
    source = source_path.read_text(encoding="utf-8", errors="replace")
    lower = source.lower()

    usage_lines = [
        line.strip()
        for line in source.splitlines()
        if re.search(r"\busage\b", line, flags=re.IGNORECASE)
    ]

    references_first_arg = bool(
        re.search(r"\$(?:1\b|\{1(?::[-+?][^}]*)?\})", source)
    )

    mode = "unknown"
    reason = "contract was not recognized conservatively"

    if re.search(r"--release(?:[=\s]|$)", lower):
        mode = "flag_release"
        reason = "rollback source advertises --release"
    elif re.search(r"--target(?:[=\s]|$)", lower):
        mode = "flag_target"
        reason = "rollback source advertises --target"
    elif (
        re.search(r"usage.*(?:<|\[)(?:target[-_ ]?)?release", lower)
        or re.search(r"(?:target_?release|release_?(?:dir|path)).*\$(?:1|\{1)", lower)
        or (
            references_first_arg
            and "/var/www/mospochin-releases" in source
        )
    ):
        mode = "positional_release"
        reason = "rollback source accepts a release path as argument 1"
    elif re.search(r"usage.*commit.*run", lower):
        mode = "commit_run"
        reason = "usage mentions commit and run arguments"
    elif re.search(r"usage.*run[_ -]?id", lower):
        mode = "run_id"
        reason = "usage mentions a run id"
    elif re.search(r"usage.*commit", lower):
        mode = "commit"
        reason = "usage mentions a commit"
    elif not references_first_arg:
        mode = "no_args"
        reason = "rollback source does not reference positional argument 1"

    result = {
        "mode": mode,
        "reason": reason,
        "usage_lines": usage_lines[:20],
        "references_first_arg": references_first_arg,
        "source_sha256": __import__("hashlib").sha256(
            source.encode("utf-8", errors="replace")
        ).hexdigest(),
    }

    print(json.dumps(result, ensure_ascii=False, sort_keys=True))

    return 0 if mode != "unknown" else 3


if __name__ == "__main__":
    raise SystemExit(main())
