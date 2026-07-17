#!/usr/bin/env node
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';

const forbidden = [
  /тонк(?:ого|ий) SEO-дубл/iu,
  /repair bridge/iu,
  /брендовая посадочная/iu,
  /коммерческий интент/iu,
  /развест[иь]? трафик/iu,
  /развел[аи]? трафик/iu,
  /без платного трафика/iu,
  /холодн(?:ый|ого) рекламн(?:ый|ого) трафик/iu,
  /помогает рекламе обучаться/iu,
  /не вед[её]м трафик/iu,
  /усиливаем трафик/iu,
  /B2B-посадочн/iu,
  /аварийная посадочная/iu,
  /узкая страница под ошибку/iu,
];

function visibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/\s+/g, ' ');
}

const root = process.cwd();
const pages = readdirSync(root).filter((name) => extname(name) === '.html').sort();
let errors = 0;
for (const page of pages) {
  const text = visibleText(readFileSync(join(root, page), 'utf8'));
  for (const pattern of forbidden) {
    const match = text.match(pattern);
    if (!match) continue;
    console.error(`❌ ${page}: public copy contains "${match[0]}"`);
    errors += 1;
  }
}
if (errors) process.exit(1);
console.log(`✅ Public copy: ${pages.length} pages contain no internal SEO wording`);
