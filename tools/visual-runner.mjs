#!/usr/bin/env node
/**
 * Manual GitHub fallback runner for Firefox-based visual workflows.
 *
 * The primary project screenshot runtime is tools/visual-local-capture.mjs with
 * preinstalled system Chromium. This file exists only for explicit browser
 * installation/execution in manually dispatched CI fallback workflows.
 */
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_BROWSER_PATH = path.join(ROOT_DIR, '.cache', 'ms-playwright');
const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const args = process.argv.slice(2);

function usage() {
  console.error('Usage: node tools/visual-runner.mjs --install');
  console.error('   or: node tools/visual-runner.mjs tools/<visual-script>.mjs [args...]');
}

if (!args.length) {
  usage();
  process.exit(2);
}

const browserPath = process.env.PLAYWRIGHT_BROWSERS_PATH || DEFAULT_BROWSER_PATH;
const env = {
  ...process.env,
  PLAYWRIGHT_BROWSERS_PATH: browserPath,
};

let command;
let commandArgs;
if (args[0] === '--install') {
  command = NPM;
  commandArgs = ['exec', '--', 'playwright', 'install', 'firefox'];
  console.log(`Installing Firefox into ${browserPath}`);
} else {
  const target = args.shift();
  const playwrightPackage = path.join(ROOT_DIR, 'node_modules', 'playwright', 'package.json');
  if (!existsSync(playwrightPackage)) {
    console.error('❌ visual runner cannot start: Playwright is not installed.');
    console.error('Run npm ci. For manual GitHub fallback, run npm run setup:visual:github.');
    process.exit(1);
  }
  command = process.execPath;
  commandArgs = [path.resolve(ROOT_DIR, target), ...args];
  console.log(`Running visual command with PLAYWRIGHT_BROWSERS_PATH=${browserPath}`);
}

const result = spawnSync(command, commandArgs, {
  cwd: ROOT_DIR,
  env,
  stdio: 'inherit',
});

if (result.error) {
  console.error(`❌ visual runner failed: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
