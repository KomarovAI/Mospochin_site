#!/usr/bin/env node
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';

const root = process.cwd();
const pages = readdirSync(root).filter((name) => extname(name) === '.html').sort();
let errors = 0;
let shellPages = 0;
for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8');
  const hasMount = /id=["']header-container["']|id=["']footer-container["']/i.test(html);
  if (!hasMount) continue;
  shellPages += 1;
  for (const id of ['header-container', 'footer-container']) {
    const mountTag = html.match(new RegExp(`<div\\b[^>]*\\bid=[\"']${id}[\"'][^>]*>`, 'i'))?.[0] || '';
    const hasStaticShell = /\bdata-static-shell=["']true["']/i.test(mountTag);
    if (!mountTag || !hasStaticShell) {
      console.error(`❌ ${page}: ${id} is not build-time rendered`); errors += 1;
    }
  }
  if (!/<nav\b[^>]*id=["']navbar["']/i.test(html) || !/<footer\b/i.test(html)) {
    console.error(`❌ ${page}: static navigation/footer markup missing`); errors += 1;
  }
}
if (errors) process.exit(1);
console.log(`✅ Static shell: ${shellPages} pages have build-time header/footer`);
