#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { createArtifactContract, stableJson, sha256File, toPosix } from './artifact-contract-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MEDIA = path.join(ROOT, 'src/media-source');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const OUT = path.join(ROOT, '.archives');
const STAGING = path.join(OUT, 'staging');

function value(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] ?? fallback : fallback;
}
function stamp() { return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z'); }
function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(abs));
    else if (entry.isFile()) files.push(abs);
  }
  return files;
}

if (!fs.existsSync(MEDIA)) throw new Error('src/media-source is missing');
const baseName = value('--name', `mospochin-media-masters-${stamp()}`).replace(/\.zip$/, '');
const stage = path.join(STAGING, baseName);
const stagedMedia = path.join(stage, 'src/media-source');
const zipPath = path.join(OUT, `${baseName}.zip`);
const shaPath = `${zipPath}.sha256`;
fs.mkdirSync(stagedMedia, { recursive: true });
fs.cpSync(MEDIA, stagedMedia, { recursive: true, preserveTimestamps: true });

const files = walk(stagedMedia).sort((a, b) => a.localeCompare(b));
let bytes = 0;
const inventory = crypto.createHash('sha256');
for (const file of files) {
  const rel = toPosix(path.relative(stage, file));
  bytes += fs.statSync(file).size;
  inventory.update(`${sha256File(file)}  ${rel}\n`);
}
const contract = createArtifactContract({
  artifactType: 'media-masters',
  deployable: false,
  packageVersion: pkg.version,
  contents: { files: files.length, bytes, inventorySha256: inventory.digest('hex'), root: 'src/media-source' },
  notes: ['Original media masters. Keep separate from routine source handoffs and production deploys.'],
});
fs.writeFileSync(path.join(stage, 'artifact.json'), stableJson(contract));

fs.mkdirSync(OUT, { recursive: true });
fs.rmSync(zipPath, { force: true });
const result = spawnSync('zip', ['-qr', zipPath, '.'], { cwd: stage, stdio: 'inherit' });
if (result.status !== 0) throw new Error('zip command failed');
const sha = sha256File(zipPath);
fs.writeFileSync(shaPath, `${sha}  ${path.basename(zipPath)}\n`);
fs.rmSync(stage, { recursive: true, force: true });
console.log('✅ media masters ready');
console.log(`ZIP: ${toPosix(path.relative(ROOT, zipPath))}`);
console.log(`SHA256: ${sha}`);
console.log(`FILES: ${files.length}`);
console.log(`BYTES: ${bytes}`);
