#!/usr/bin/env node
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const result = spawnSync(process.execPath, [path.join(ROOT, 'tools/generate-kutter-images.mjs'), '--check'], {
  cwd: ROOT,
  stdio: 'inherit',
});
process.exit(result.status ?? 1);
