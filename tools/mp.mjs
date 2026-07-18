#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getClusterContract } from './cluster-contract-lib.mjs';
import { PUBLIC_CLI_ROUTES } from './mp-routes.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NODE = process.execPath;
const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(command, args) {
  const result = spawnSync(command, args, { cwd: ROOT, stdio: 'inherit', env: process.env });
  if (result.error) {
    console.error(`❌ ${result.error.message}`);
    process.exit(1);
  }
  process.exit(result.status ?? 1);
}

function help(exitCode = 0) {
  console.log('MosPochin operator CLI');
  for (const route of PUBLIC_CLI_ROUTES) console.log(`  node tools/mp.mjs ${route}`);
  console.log('  build page requires <file.html>; visual cluster requires <cluster-id>');
  process.exit(exitCode);
}

const [domain, action, target] = process.argv.slice(2);
if (!domain || domain === 'help' || domain === '--help') help();

if (domain === 'check' && action === 'architecture') run(NODE, ['tools/check-profile.mjs', 'architecture']);
if (domain === 'check' && action === 'core') run(NODE, ['tools/check-profile.mjs', 'core']);
if (domain === 'check' && action === 'release') run(NODE, ['tools/ai-release.mjs']);

if (domain === 'build' && action === 'page') {
  if (!target || !/^[a-zA-Z0-9_-]+\.html$/.test(target)) {
    console.error('❌ build page requires a safe <file.html> target');
    help(2);
  }
  run(NODE, ['tools/build-site.mjs', '--page', target, '--write']);
}

if (domain === 'audit' && action === 'architecture') {
  const generated = spawnSync(NODE, ['tools/analyze-source-complexity.mjs'], { cwd: ROOT, stdio: 'inherit', env: process.env });
  if (generated.status !== 0) process.exit(generated.status ?? 1);
  run(NODE, ['tools/check-profile.mjs', 'architecture']);
}

if (domain === 'visual' && action === 'cluster') {
  const contract = target ? getClusterContract(target) : null;
  if (!contract) {
    console.error(`❌ Unknown cluster: ${target || '(missing)'}`);
    help(2);
  }
  const script = contract.visualCommand?.match(/^npm run ([a-zA-Z0-9:_-]+)$/)?.[1];
  if (!script) {
    console.error(`❌ ${contract.id}: visualCommand is not runnable`);
    process.exit(2);
  }
  run(NPM, ['run', script]);
}

console.error(`❌ Unknown route: ${[domain, action].filter(Boolean).join(' ')}`);
help(2);
