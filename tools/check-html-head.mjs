#!/usr/bin/env node
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';

const root = process.cwd();
const pages = readdirSync(root).filter((name) => extname(name) === '.html').sort();
let errors = 0;

function count(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8');
  const titleMatches = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
  const descriptions = count(html, /<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/gi);
  const canonicals = count(html, /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi);
  if (titleMatches.length !== 1) {
    console.error(`❌ ${page}: title count ${titleMatches.length}`); errors += 1;
  } else if (/<[^>]+>/.test(titleMatches[0][1])) {
    console.error(`❌ ${page}: HTML tag inside title`); errors += 1;
  } else if (!titleMatches[0][1].trim()) {
    console.error(`❌ ${page}: empty title`); errors += 1;
  }
  if (descriptions !== 1) {
    console.error(`❌ ${page}: meta description count ${descriptions}`); errors += 1;
  }
  if (page !== '404.html' && canonicals !== 1) {
    console.error(`❌ ${page}: canonical count ${canonicals}`); errors += 1;
  }
}

if (errors) {
  console.error(`\nHTML head check failed: ${errors} issue(s).`);
  process.exit(1);
}
console.log(`✅ HTML head: ${pages.length}/${pages.length} pages valid`);
