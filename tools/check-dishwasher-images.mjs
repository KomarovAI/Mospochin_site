#!/usr/bin/env node
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const result = spawnSync(process.execPath, [path.join(ROOT,'tools/generate-dishwasher-images.mjs'),'--check'], { cwd: ROOT, stdio: 'inherit' });
process.exit(result.status ?? 1);
