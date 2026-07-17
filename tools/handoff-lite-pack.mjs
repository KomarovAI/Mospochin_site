#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import os from 'os';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { createArtifactContract, stableJson, sha256File, toPosix } from './artifact-contract-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PROJECT_NAME = path.basename(ROOT);
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const ARCHIVES = path.join(ROOT, '.archives');

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] ?? fallback : fallback;
}

function stamp() {
  return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

const excludedTop = new Set([
  '.git', 'node_modules', '.archives', '.artifacts', '.cache', '.playwright-browsers',
  '.venv', '.venv-visual', 'venv', 'build', 'playwright-report', 'test-results',
]);

function shouldCopy(src) {
  const rel = toPosix(path.relative(ROOT, src));
  if (!rel) return true;
  const top = rel.split('/')[0];
  if (excludedTop.has(top)) return false;
  if (rel === '.deploy/dist' || rel.startsWith('.deploy/dist/')) return false;
  if (rel === 'src/media-source' || rel.startsWith('src/media-source/')) return false;
  if (rel.startsWith('reports/visual-') || rel.startsWith('reports/visual-audit/')) return false;
  if (/\.(?:zip|tar|tgz|tar\.gz|log)$/i.test(rel)) return false;
  if (rel.endsWith('/__pycache__') || rel.includes('/__pycache__/')) return false;
  return true;
}

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(abs));
    else if (entry.isFile()) files.push(abs);
  }
  return files;
}

function treeDigest(root) {
  const hash = crypto.createHash('sha256');
  const files = walk(root).sort((a, b) => a.localeCompare(b));
  let bytes = 0;
  for (const file of files) {
    const rel = toPosix(path.relative(root, file));
    const stat = fs.statSync(file);
    bytes += stat.size;
    hash.update(`${sha256File(file)}  ${rel}\n`);
  }
  return { files: files.length, bytes, sha256: hash.digest('hex') };
}

function zip(stageParent, projectDir, zipPath) {
  fs.rmSync(zipPath, { force: true });
  const result = spawnSync('zip', ['-qr', zipPath, path.basename(projectDir)], { cwd: stageParent, stdio: 'inherit' });
  if (result.status !== 0) throw new Error('zip command failed');
}

const baseName = argValue('--name', `mospochin-source-handoff-lite-${stamp()}` ).replace(/\.zip$/, '');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'mospochin-handoff-lite-'));
const stageParent = path.join(tempRoot, baseName);
const stageProject = path.join(stageParent, PROJECT_NAME);
const zipPath = path.join(ARCHIVES, `${baseName}.zip`);
const shaPath = `${zipPath}.sha256`;

fs.mkdirSync(ARCHIVES, { recursive: true });
fs.rmSync(stageParent, { recursive: true, force: true });
fs.mkdirSync(stageProject, { recursive: true });
fs.cpSync(ROOT, stageProject, { recursive: true, filter: shouldCopy, preserveTimestamps: true });

const digest = treeDigest(stageProject);
const contract = createArtifactContract({
  artifactType: 'source-handoff-lite',
  deployable: false,
  packageVersion: pkg.version,
  contents: {
    filesBeforeContract: digest.files,
    bytesBeforeContract: digest.bytes,
    sourceTreeSha256: digest.sha256,
    excluded: ['src/media-source', 'build', '.deploy/dist', '.artifacts', 'visual evidence', 'nested archives'],
  },
  notes: [
    'Compact AI/developer handoff. Media masters are shipped separately.',
    'Do not deploy this ZIP. Run release:prepare to create a public-deploy artifact.',
  ],
});
fs.writeFileSync(path.join(stageProject, 'artifact.json'), stableJson(contract));
zip(stageParent, stageProject, zipPath);
const sha = sha256File(zipPath);
fs.writeFileSync(shaPath, `${sha}  ${path.basename(zipPath)}\n`);
fs.rmSync(tempRoot, { recursive: true, force: true });

console.log('✅ lite handoff ready');
console.log(`ZIP: ${toPosix(path.relative(ROOT, zipPath))}`);
console.log(`SHA256: ${sha}`);
console.log(`SOURCE FILES: ${digest.files}`);
console.log(`SOURCE BYTES: ${digest.bytes}`);
