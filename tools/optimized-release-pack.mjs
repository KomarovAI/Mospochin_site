#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const date = new Date().toISOString().slice(0, 10);
const run = (cmd, args) => {
  const result = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
};

run('node', ['tools/audit-unused-assets.mjs', '--prune']);
run('node', ['tools/generate-deploy-manifest.mjs']);
run('node', ['tools/check-image-budget.mjs']);
run('node', ['tools/crawl-site.mjs', '--check']);
run('node', ['tools/build-site.mjs', '--check']);
run('node', ['tools/generate-faq-registry.mjs', '--check']);
run('node', ['tools/deploy-pack.mjs', '--name', `mospochin-public-deploy-optimized-${date}.zip`]);
run('node', ['tools/handoff-lite-pack.mjs', '--name', `mospochin-source-handoff-lite-optimized-${date}`]);
run('node', ['tools/media-pack.mjs', '--name', `mospochin-media-masters-${date}`]);

console.log('\n✅ optimized release set ready');
