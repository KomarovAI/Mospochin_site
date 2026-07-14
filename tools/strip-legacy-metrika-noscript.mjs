#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checkMode = process.argv.includes('--check');
const pattern = /\s*<noscript>\s*<div>\s*<img[^>]*mc\.yandex\.ru\/watch[^>]*>\s*<\/div>\s*<\/noscript>\s*/gi;
const pages = fs.readdirSync(root).filter((file) => file.endsWith('.html')).sort();
let found = 0;

for (const page of pages) {
  const file = path.join(root, page);
  const html = fs.readFileSync(file, 'utf8');
  const matches = html.match(pattern);
  if (!matches?.length) continue;
  found += matches.length;
  if (!checkMode) fs.writeFileSync(file, html.replace(pattern, '\n'));
}

if (checkMode && found) {
  console.error(`❌ legacy Yandex Metrika noscript remains: ${found}`);
  process.exit(1);
}

console.log(`Metrika noscript ${checkMode ? 'check' : 'cleanup'}: found=${found}`);
