#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { spawnSync, execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const NODE = process.execPath;

function parseArgs(argv = process.argv.slice(2)) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) out[key] = true;
    else { out[key] = next; i += 1; }
  }
  return out;
}

function gitFiles() {
  if (!fs.existsSync(path.join(ROOT, '.git'))) return null;
  const commands = [
    ['diff', '--name-only'],
    ['diff', '--name-only', '--cached'],
    ['ls-files', '--others', '--exclude-standard'],
  ];
  const files = [];
  for (const args of commands) {
    try {
      const text = execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' });
      files.push(...text.split(/\r?\n/).filter(Boolean));
    } catch {
      return null;
    }
  }
  return [...new Set(files.map((item) => item.replace(/\\/g, '/')))];
}

function npmRun(script, extra = []) {
  return { key: `npm:${script}:${extra.join(' ')}`, command: NPM, args: ['run', script, ...(extra.length ? ['--', ...extra] : [])], label: `npm run ${script}${extra.length ? ` -- ${extra.join(' ')}` : ''}` };
}
function nodeRun(file, extra = []) {
  return { key: `node:${file}:${extra.join(' ')}`, command: NODE, args: [file, ...extra], label: `node ${file}${extra.length ? ` ${extra.join(' ')}` : ''}` };
}

const args = parseArgs();
let files = [];
if (typeof args.files === 'string') files = args.files.split(',').map((item) => item.trim()).filter(Boolean);
else files = gitFiles() ?? [];
files = [...new Set(files.map((item) => item.replace(/^\.\//, '').replace(/\\/g, '/')))];

if (!files.length && !fs.existsSync(path.join(ROOT, '.git')) && !args.files) {
  console.error('❌ No Git metadata. Pass --files path/a,path/b in archive mode.');
  process.exit(2);
}

const steps = [];
const add = (step) => { if (!steps.some((item) => item.key === step.key)) steps.push(step); };
add(nodeRun('tools/check-instruction-hygiene.mjs'));
add(nodeRun('tools/check-repo-hygiene.mjs'));
add(nodeRun('tools/generate-ai-current-state.mjs', ['--check']));

const pages = new Set();
let shared = false;
let data = false;
let assets = false;
let runtime = false;
let server = false;
let tools = false;
let docs = false;
let seo = false;

for (const file of files) {
  if (/^[^/]+\.html$/.test(file)) pages.add(file);
  const pageMatch = file.match(/^src\/pages\/([^/]+)\//);
  if (pageMatch) pages.add(`${pageMatch[1]}.html`);
  if (/^(src\/components\/|content\/components\/|styles-combined\.css$|main\.js$)/.test(file)) shared = true;
  if (file.startsWith('data/') || file.startsWith('content/faq/')) data = true;
  if (file === 'data/page-metadata.json' || file === 'sitemap.xml') seo = true;
  if (file.startsWith('assets/') || /\.(png|jpe?g|webp|avif|svg|woff2?|ttf)$/i.test(file)) assets = true;
  if (/^(analytics\.js|telegram-form\.js|main\.js|styles-combined\.css)$/.test(file)) runtime = true;
  if (file.startsWith('server/')) server = true;
  if (file.startsWith('tools/') || ['package.json', 'package-lock.json'].includes(file)) tools = true;
  if (file.endsWith('.md') || file.startsWith('docs/') || file.startsWith('.github/')) docs = true;
}

for (const page of [...pages].sort()) {
  add(npmRun('check:site-builder', ['--page', page]));
  add(npmRun('doctor:page', ['--page', page]));
}
if (shared) {
  add(npmRun('check:site-builder'));
  add(npmRun('check:shared-components'));
  add(npmRun('check:parameterized-components'));
  add(npmRun('check:static-shell'));
}
if (data) add(npmRun('validate:data'));
if (seo) {
  add(npmRun('check:html-head'));
  add(npmRun('check:site-crawl'));
}
if (assets) {
  add(npmRun('check:images'));
  add(npmRun('check:assets'));
}
if (runtime) {
  add(npmRun('check:conversion-ui'));
  add(npmRun('check:metrics'));
  add(npmRun('check:safe-native'));
  add(npmRun('smoke:kutter-leads'));
}
if (server) {
  for (const file of files.filter((item) => item.startsWith('server/') && /\.m?js$/.test(item))) add(nodeRun('--check', [file]));
  add(npmRun('test:form-idempotency'));
  add(npmRun('smoke:kutter-leads'));
  add(npmRun('check:npm-audit'));
}
if (tools) {
  for (const file of files.filter((item) => item.startsWith('tools/') && /\.m?js$/.test(item))) add(nodeRun('--check', [file]));
  add(npmRun('check:ai'));
}
if (docs) add(npmRun('check:ai-control-lite-r5'));

console.log('# AI changed-only verification');
console.log(`Files: ${files.length}`);
for (const file of files) console.log(`- ${file}`);
console.log(`\nChecks: ${steps.length}`);
for (const step of steps) console.log(`- ${step.label}`);

if (args.plan || args['dry-run']) process.exit(0);

for (const step of steps) {
  console.log(`\n$ ${step.label}`);
  const result = spawnSync(step.command, step.args, { cwd: ROOT, stdio: 'inherit', env: process.env });
  if (result.status !== 0) {
    console.error(`\n❌ ai:verify failed at ${step.label}`);
    process.exit(result.status ?? 1);
  }
}

console.log('\n✅ changed-only verification passed');
