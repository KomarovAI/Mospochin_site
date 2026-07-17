#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = path.join(ROOT, 'src', 'pages');
const check = process.argv.includes('--check');
let changed = 0;
let duplicates = 0;

for (const slug of fs.readdirSync(PAGES).sort()) {
  const headPath = path.join(PAGES, slug, 'head.html');
  if (!fs.existsSync(headPath)) continue;
  const source = fs.readFileSync(headPath, 'utf8');
  const matches = [...source.matchAll(/<link\b(?=[^>]*\brel\s*=\s*(?:"[^"]*\bcanonical\b[^"]*"|'[^']*\bcanonical\b[^']*'|canonical\b))[^>]*>\s*/gi)];
  if (matches.length <= 1) continue;
  duplicates += matches.length - 1;
  let output = source;
  for (let index = matches.length - 1; index >= 1; index -= 1) {
    const match = matches[index];
    output = output.slice(0, match.index) + output.slice(match.index + match[0].length);
  }
  if (check) {
    console.error(`${slug}: ${matches.length} canonical tags`);
  } else {
    fs.writeFileSync(headPath, output);
    changed += 1;
  }
}

if (check && duplicates) {
  console.error(`❌ Duplicate canonical tags: ${duplicates}`);
  process.exit(1);
}
console.log(`${check ? 'Canonical check' : 'Canonical repair'}: ${duplicates} duplicates${check ? '' : ` removed in ${changed} pages`}`);
