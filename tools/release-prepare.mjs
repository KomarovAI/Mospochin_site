#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const skipVisual = process.argv.includes('--skip-visual');
const skipInstall = process.argv.includes('--skip-install');

function value(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] ?? fallback : fallback;
}
function run(command, args) {
  const label = [command, ...args].join(' ');
  console.log(`\n━━ ${label}`);
  const result = spawnSync(command, args, { cwd: ROOT, stdio: 'inherit', env: process.env });
  if (result.status !== 0) throw new Error(`failed: ${label}`);
}
function commandExists(command) {
  return spawnSync('bash', ['-lc', `command -v ${command}`], { stdio: 'ignore' }).status === 0;
}

for (const command of ['node', 'npm', 'zip', 'unzip']) {
  if (!commandExists(command)) throw new Error(`required command is missing: ${command}`);
}

const name = value('--name', `mospochin-public-deploy-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}.zip`);
if (!name.endsWith('.zip') || name.includes('/') || name.includes('\\')) {
  throw new Error('--name must be a plain .zip filename');
}

if (!skipInstall) run(NPM, ['ci', '--no-audit', '--no-fund']);
run(NPM, ['run', 'build:css']);
run(NPM, ['run', 'check:css-core']);
run(NPM, ['run', 'check:nginx-hardening']);
run(NPM, ['run', 'check:core']);
if (!skipVisual) run(NPM, ['run', 'audit:core-pages-css']);
run(NPM, ['run', 'generate:deploy-manifest']);
run(NPM, ['run', 'deploy:pack', '--', '--name', name]);

const zipPath = path.join(ROOT, '.deploy/dist', name);
if (!fs.existsSync(zipPath)) throw new Error(`deploy ZIP was not created: ${zipPath}`);
run('node', ['tools/verify-artifact.mjs', zipPath, '--expect-type', 'public-deploy', '--deployable']);
run('unzip', ['-tq', zipPath]);

console.log('\n════════════════════════════════════════');
console.log('RELEASE READY');
console.log('Artifact type: public-deploy');
console.log(`ZIP: ${path.relative(ROOT, zipPath)}`);
console.log(`SHA256: ${path.relative(ROOT, `${zipPath}.sha256`)}`);
console.log(`Dependencies: ${skipInstall ? 'REUSED BY FLAG' : 'npm ci PASS'}`);
console.log(`Visual smoke: ${skipVisual ? 'SKIPPED BY FLAG' : 'PASS'}`);
console.log('Core checks: PASS');
console.log('Artifact contract: PASS');
console.log('════════════════════════════════════════');
