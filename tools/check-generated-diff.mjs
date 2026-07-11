#!/usr/bin/env node
import { execFileSync } from 'node:child_process';

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function unique(items) {
  return [...new Set(items)];
}

let files;
try {
  const base = process.env.GITHUB_BASE_SHA || process.env.GITHUB_BEFORE || '';
  const head = process.env.GITHUB_SHA || 'HEAD';
  if (base && !/^0+$/.test(base)) files = git(['diff', '--name-only', `${base}...${head}`]);
  else files = unique([...git(['diff', '--name-only']), ...git(['diff', '--cached', '--name-only'])]);
} catch {
  console.log('Generated diff guard skipped: git repository not available.');
  process.exit(0);
}

const generatedPages = files.filter((file) => /^.+\.html$/i.test(file) && !file.startsWith('src/'));
const sourceFiles = files.filter((file) => (
  file.startsWith('src/') ||
  file.startsWith('data/') ||
  file.startsWith('content/') ||
  file.startsWith('tools/') ||
  file.startsWith('server/') ||
  ['main.js', 'telegram-form.js', 'analytics.js', 'styles-combined.css', 'package.json', 'package-lock.json'].includes(file)
));

if (generatedPages.length && !sourceFiles.length) {
  console.error('FAIL: root HTML changed without a source/data/runtime change. Edit src/data/tools first, then rebuild.');
  console.error(generatedPages.join('\n'));
  process.exit(1);
}

console.log(`Generated diff guard passed: root_html=${generatedPages.length} source_changes=${sourceFiles.length}`);
