#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/ai-control-lite-r5-cleanup.json'), 'utf8'));
const archiveDir = path.join(ROOT, manifest.archiveRoot);
fs.mkdirSync(archiveDir, { recursive: true });

let moved = 0;
let removed = 0;
for (const name of manifest.archive || []) {
  const source = path.join(ROOT, name);
  const target = path.join(archiveDir, name);
  if (!fs.existsSync(source)) continue;
  if (fs.existsSync(target)) fs.rmSync(source, { force: true });
  else fs.renameSync(source, target);
  moved += 1;
}
for (const name of manifest.delete || []) {
  const source = path.join(ROOT, name);
  if (!fs.existsSync(source)) continue;
  fs.rmSync(source, { force: true });
  removed += 1;
}

const items = fs.readdirSync(archiveDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name !== 'README.md')
  .map((entry) => entry.name)
  .sort();
const index = [
  '# Archived root handoffs',
  '',
  'These files are historical evidence moved out of the repository root. They are not current instructions or project status.',
  '',
  ...items.map((name) => `- [${name}](${name})`),
  '',
].join('\n');
fs.writeFileSync(path.join(archiveDir, 'README.md'), index);

console.log(`✅ AI Control Lite R5 overlay cleanup: archived=${moved}, removed=${removed}, indexed=${items.length}`);
