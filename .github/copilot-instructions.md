<!-- ai-instruction-file: true -->
# Copilot Repository Instructions

## Start

Follow the root `AGENTS.md`. Before editing, run `npm run ai:brief -- --task <task> --page <file.html>`.

## Edit

Edit source-of-truth files only. Do not edit generated root HTML directly and do not create additional instruction files.

## Verify

Run `npm run ai:verify -- --changed` after changes and `npm run ai:release` before a production handoff.

## Do not add

Do not append task results, release notes, metrics, logs or unrelated project content to instruction files.
