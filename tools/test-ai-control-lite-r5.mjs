#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NODE = process.execPath;

function run(file) {
  return spawnSync(NODE, [file], { cwd: ROOT, encoding: 'utf8' });
}
function expectFailure(label, fn) {
  const result = fn();
  if (result.status === 0) throw new Error(`${label}: guard unexpectedly passed`);
  console.log(`✅ ${label}`);
}
function expectSuccess(label, file) {
  const result = run(file);
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    throw new Error(`${label}: guard failed`);
  }
  console.log(`✅ ${label}`);
}

expectSuccess('baseline instruction hygiene', 'tools/check-instruction-hygiene.mjs');
expectSuccess('baseline repository hygiene', 'tools/check-repo-hygiene.mjs');

const stray = path.join(ROOT, 'src/pages/temporary-instructions/AGENTS.md');
fs.mkdirSync(path.dirname(stray), { recursive: true });
try {
  fs.writeFileSync(stray, '<!-- ai-instruction-file: true -->\n# Stray Instructions\n');
  expectFailure('rejects an unapproved instruction file', () => run('tools/check-instruction-hygiene.mjs'));
} finally {
  fs.rmSync(path.dirname(stray), { recursive: true, force: true });
}

const docsAgents = path.join(ROOT, 'docs/AGENTS.md');
const originalDocsAgents = fs.readFileSync(docsAgents, 'utf8');
try {
  fs.writeFileSync(docsAgents, `${originalDocsAgents}\n## Status\nCompleted release with checksum.\n`);
  expectFailure('rejects task output inside an instruction file', () => run('tools/check-instruction-hygiene.mjs'));
} finally {
  fs.writeFileSync(docsAgents, originalDocsAgents);
}

const rootJunk = path.join(ROOT, 'FINAL-FINAL-NOTES.md');
try {
  fs.writeFileSync(rootJunk, '# temporary notes\n');
  expectFailure('rejects a new root report', () => run('tools/check-repo-hygiene.mjs'));
} finally {
  fs.rmSync(rootJunk, { force: true });
}

const docsJunk = path.join(ROOT, 'docs/UNRELATED_NOTES.md');
try {
  fs.writeFileSync(docsJunk, '# unrelated notes\n');
  expectFailure('rejects a new unapproved docs note', () => run('tools/check-repo-hygiene.mjs'));
} finally {
  fs.rmSync(docsJunk, { force: true });
}

const archivedCandidates = fs.readdirSync(path.join(ROOT, 'docs/archive/root-history')).filter((name) => name !== 'README.md');
const overlayName = archivedCandidates[0];
if (overlayName) {
  const archivedPath = path.join(ROOT, 'docs/archive/root-history', overlayName);
  const rootOverlayPath = path.join(ROOT, overlayName);
  fs.copyFileSync(archivedPath, rootOverlayPath);
  const cleanup = run('tools/apply-ai-control-lite-r5.mjs');
  if (cleanup.status !== 0 || fs.existsSync(rootOverlayPath) || !fs.existsSync(archivedPath)) {
    throw new Error('overlay cleanup did not remove a grandfathered root handoff safely');
  }
  console.log('✅ no-delete overlay cleanup is idempotent');
}

const backup = path.join(ROOT, 'tools/example.backup.mjs');
try {
  fs.writeFileSync(backup, 'export {};\n');
  expectFailure('rejects a backup file', () => run('tools/check-repo-hygiene.mjs'));
} finally {
  fs.rmSync(backup, { force: true });
}

expectSuccess('restored instruction hygiene', 'tools/check-instruction-hygiene.mjs');
expectSuccess('restored repository hygiene', 'tools/check-repo-hygiene.mjs');
console.log('✅ AI Control Lite R5 guard fixtures passed');
