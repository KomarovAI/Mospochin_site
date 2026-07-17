#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const errors = [];

function walkHtml(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkHtml(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const rootHtml = fs.readdirSync(ROOT)
  .filter((name) => name.endsWith('.html'))
  .map((name) => path.join(ROOT, name));
const sourceHtml = walkHtml(path.join(ROOT, 'src'));

for (const file of [...rootHtml, ...sourceHtml]) {
  const html = fs.readFileSync(file, 'utf8');
  if (/partials-injector\.js/i.test(html)) {
    errors.push(`${path.relative(ROOT, file)}: retired partials-injector.js is still referenced`);
  }
}

const main = fs.readFileSync(path.join(ROOT, 'main.js'), 'utf8');
const form = fs.readFileSync(path.join(ROOT, 'telegram-form.js'), 'utf8');
const directGenerator = fs.readFileSync(path.join(ROOT, 'tools/generate-direct-landings.mjs'), 'utf8');
if (!main.includes('__MOSPOCHIN_JSON_PROMISES__')) errors.push('main.js: shared JSON promise registry missing');
if (!form.includes('__MOSPOCHIN_JSON_PROMISES__')) errors.push('telegram-form.js: shared JSON promise registry missing');
if (/TELEGRAM_PAGE_METADATA_PATH[\s\S]{0,900}cache:\s*['"]no-store['"]/.test(form)) {
  errors.push('telegram-form.js: static page metadata must not bypass browser cache');
}
if (!form.includes('loadSharedJson(TELEGRAM_PAGE_METADATA_PATH)')) {
  errors.push('telegram-form.js: page metadata does not use shared loader');
}
if (/partials-injector\.js/i.test(directGenerator)) {
  errors.push('tools/generate-direct-landings.mjs: generator would reintroduce retired partial injector');
}

if (errors.length) {
  console.error(`❌ Safe native runtime check failed (${errors.length})`);
  errors.slice(0, 30).forEach((error) => console.error(`- ${error}`));
  if (errors.length > 30) console.error(`- ... and ${errors.length - 30} more`);
  process.exit(1);
}

console.log('✅ Safe native runtime: no partial injector references; static JSON requests are shared and cacheable.');
