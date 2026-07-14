#!/usr/bin/env node
/**
 * Remove only reproducible local artifacts from the project workspace.
 *
 * The default mode is a dry-run. Use `--apply` when the listed targets have
 * been reviewed. Source, data, assets, reports/handoff and the latest visual
 * pack are intentionally outside this cleanup policy.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APPLY = process.argv.includes('--apply');

const TARGETS = [
  ['.artifacts', 'ephemeral screenshots and audit outputs'],
  ['.cache', 'reinstallable Playwright/browser cache'],
  ['build', 'reproducible site-builder output'],
  ['reports/visual-final-20260712', 'superseded visual pass'],
  ['reports/visual-p0-20260713', 'superseded visual pass'],
  ['reports/visual-p0-final-20260713', 'superseded visual pass'],
  ['reports/visual-p1-final-20260713', 'superseded visual pass; visual-p2 is retained'],
];

function bytesOf(target) {
  if (!fs.existsSync(target)) return 0;
  const stat = fs.lstatSync(target);
  if (stat.isFile()) return stat.size;
  if (!stat.isDirectory()) return 0;
  return fs.readdirSync(target).reduce((total, name) => total + bytesOf(path.join(target, name)), 0);
}

function formatBytes(bytes) {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${bytes} B`;
}

const existing = TARGETS.map(([relative, reason]) => ({
  relative,
  reason,
  absolute: path.resolve(ROOT, relative),
  bytes: bytesOf(path.resolve(ROOT, relative)),
})).filter((item) => item.bytes > 0);

const reclaimed = existing.reduce((total, item) => total + item.bytes, 0);
console.log(`${APPLY ? 'Applying' : 'Dry-run'} workspace cleanup:`);
for (const item of existing) console.log(`- ${item.relative} — ${formatBytes(item.bytes)} — ${item.reason}`);
console.log(`Total: ${formatBytes(reclaimed)}`);

if (!APPLY) {
  console.log('\nNothing was deleted. Re-run with --apply after reviewing the list.');
  process.exit(0);
}

for (const item of existing) {
  if (!item.absolute.startsWith(`${ROOT}${path.sep}`)) throw new Error(`Unsafe cleanup target: ${item.relative}`);
  fs.rmSync(item.absolute, { recursive: true, force: true });
}
console.log(`\nDeleted ${existing.length} reproducible target(s), reclaimed ${formatBytes(reclaimed)}.`);
