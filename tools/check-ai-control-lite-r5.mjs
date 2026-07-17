#!/usr/bin/env node
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NODE = process.execPath;
const steps = [
  ['tools/check-instruction-hygiene.mjs'],
  ['tools/check-repo-hygiene.mjs'],
  ['tools/test-ai-control-lite-r5.mjs'],
  ['tools/generate-ai-current-state.mjs', '--check'],
  ['tools/ai-brief.mjs', '--task', 'content', '--page', 'index.html'],
  ['tools/ai-verify.mjs', '--plan', '--files', 'AGENTS.md,src/pages/index/sections/001-section.html'],
];

for (const args of steps) {
  const label = `node ${args.join(' ')}`;
  console.log(`\n$ ${label}`);
  const result = spawnSync(NODE, args, { cwd: ROOT, stdio: 'inherit', env: process.env });
  if (result.status !== 0) {
    console.error(`\n❌ AI Control Lite R5 failed at ${label}`);
    process.exit(result.status ?? 1);
  }
}
console.log('\n✅ AI Control Lite R5 passed');
