#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const css = fs.readFileSync(path.join(root, 'styles-combined.css'), 'utf8');

const criticalSelectors = [
  '.bg-gradient-to-br',
  '.from-slate-950',
  '.via-brand-blue',
  '.to-blue-900',
  '.text-blue-100',
  '.text-orange-300',
  '.pt-28',
  '.py-3\\.5',
  '.rounded-3xl',
  '.shadow-2xl',
  '.sm\\:grid-cols-3',
  '.lg\\:pt-36',
  '.lg\\:pb-28'
];

function hasExactSelector(selector) {
  let offset = 0;
  while (offset < css.length) {
    const index = css.indexOf(selector, offset);
    if (index === -1) return false;
    const next = css[index + selector.length];
    if (next === '{' || next === ',') return true;
    offset = index + selector.length;
  }
  return false;
}

const missingSelectors = criticalSelectors.filter((selector) => !hasExactSelector(selector));

const corePages = ['index.html', 'uslugi.html', 'about.html', 'contact.html'];
const requiredHeroClasses = [
  'bg-gradient-to-br',
  'from-slate-950',
  'via-brand-blue',
  'to-blue-900',
  'text-white'
];
const pageIssues = [];

for (const page of corePages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  const hero = html.match(/<header\b[^>]*class="([^"]*)"/i);
  if (!hero) {
    pageIssues.push(`${page}: hero <header> not found`);
    continue;
  }
  const classes = new Set(hero[1].split(/\s+/).filter(Boolean));
  const missing = requiredHeroClasses.filter((name) => !classes.has(name));
  if (missing.length) pageIssues.push(`${page}: missing hero classes ${missing.join(', ')}`);
}

if (missingSelectors.length || pageIssues.length) {
  console.error('Core CSS guard failed.');
  for (const selector of missingSelectors) console.error(`Missing selector: ${selector}`);
  for (const issue of pageIssues) console.error(issue);
  process.exit(1);
}

console.log(`Core CSS guard passed: ${criticalSelectors.length} selectors, ${corePages.length} pages.`);
