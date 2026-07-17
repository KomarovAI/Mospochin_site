#!/usr/bin/env node
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const steps = ['check:ai-control-lite-r5', 'check:handoff'];
for (const script of steps) {
  console.log(`\n$ npm run ${script}`);
  const result = spawnSync(NPM, ['run', script], { cwd: ROOT, stdio: 'inherit', env: process.env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log('\n✅ AI release verification passed');
