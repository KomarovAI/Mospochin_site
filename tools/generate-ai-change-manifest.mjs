#!/usr/bin/env node
/**
 * Write a machine-readable handoff snapshot for AI work.
 *
 * Git remains the preferred diff source. ZIPs often do not contain .git, so
 * this file explicitly records that limitation and stores hashes of the
 * current source/generated layers for the next agent or external runner.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = path.join(ROOT_DIR, 'reports', 'handoff', 'ai-change-manifest.json');
const SKIP_DIRS = new Set(['.git', 'node_modules', '.cache', '.artifacts', 'dist']);

function rel(file) {
  return path.relative(ROOT_DIR, file).replaceAll(path.sep, '/');
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function patternToRegex(pattern) {
  const tokenDeepSlash = '___DOUBLE_STAR_SLASH___';
  const tokenDeep = '___DOUBLE_STAR___';
  const tokenStar = '___STAR___';
  const marked = String(pattern)
    .replaceAll('**/', tokenDeepSlash)
    .replaceAll('**', tokenDeep)
    .replaceAll('*', tokenStar);
  const escaped = marked.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escaped.replaceAll(tokenDeepSlash, '(?:.*\\/)?').replaceAll(tokenDeep, '.*').replaceAll(tokenStar, '[^/]*')}$`);
}

function matches(file, patterns) {
  return patterns.some((pattern) => patternToRegex(pattern).test(file));
}

function fileSnapshot(file) {
  const buffer = fs.readFileSync(path.join(ROOT_DIR, file));
  return {
    file,
    bytes: buffer.length,
    sha256: crypto.createHash('sha256').update(buffer).digest('hex'),
  };
}

function gitStatus() {
  if (!fs.existsSync(path.join(ROOT_DIR, '.git'))) return null;
  const result = spawnSync('git', ['status', '--porcelain'], { cwd: ROOT_DIR, encoding: 'utf8' });
  if (result.status !== 0) return null;
  return result.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

const ownership = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'file-ownership.json'), 'utf8'));
const files = walk(ROOT_DIR).map(rel);
const sourceFiles = files.filter((file) => matches(file, ownership.manual || []));
const generatedFiles = files.filter((file) => matches(file, ownership.generated || []));
const status = gitStatus();

const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  mode: status === null ? 'snapshot-no-git' : 'git-status-plus-snapshot',
  baselineAvailable: status !== null,
  note: status === null
    ? 'This package has no git baseline. Compare this snapshot with the next handoff manifest or provide an external patch.'
    : 'Git status is included; hashes make generated/source state auditable in the handoff archive.',
  changedFiles: status,
  sourceOfTruth: sourceFiles.sort().map(fileSnapshot),
  generated: generatedFiles.sort().map(fileSnapshot),
};

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, `${JSON.stringify(report, null, 2)}\n`);
console.log(`✅ ${rel(OUTPUT)} created: mode=${report.mode}, source=${sourceFiles.length}, generated=${generatedFiles.length}`);
