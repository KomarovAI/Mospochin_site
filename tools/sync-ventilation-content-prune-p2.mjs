#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APPLY = process.argv.includes('--apply');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/ventilation-cluster-pages.json'), 'utf8'));

const redundantHeadings = [
  'Что проверяем на объекте',
  'Как проходит проверка',
  'Частые причины проблемы',
  'Что важно не упустить',
  'Как двигаемся по заявке',
];
const redundantHeadingSet = new Set(redundantHeadings);

function textContent(fragment) {
  return fragment
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function heading(fragment) {
  const match = fragment.match(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/i);
  return match ? textContent(match[1]) : '';
}

function mainSections(html) {
  const mainStart = html.indexOf('<main');
  const mainEnd = html.lastIndexOf('</main>');
  if (mainStart < 0 || mainEnd < 0) return null;
  const openEnd = html.indexOf('>', mainStart) + 1;
  const body = html.slice(openEnd, mainEnd);
  const sections = [];
  let cursor = 0;

  while (cursor < body.length) {
    const start = body.indexOf('<section', cursor);
    if (start < 0) break;
    let depth = 0;
    let position = start;
    let closed = false;
    while (position < body.length) {
      const nextOpen = body.indexOf('<section', position);
      const nextClose = body.indexOf('</section>', position);
      if (nextClose < 0) throw new Error('Unclosed <section>');
      if (nextOpen >= 0 && nextOpen < nextClose) {
        depth += 1;
        position = nextOpen + 8;
      } else {
        depth -= 1;
        position = nextClose + 10;
        if (depth === 0) {
          sections.push({ start, end: position, html: body.slice(start, position) });
          cursor = position;
          closed = true;
          break;
        }
      }
    }
    if (!closed) throw new Error('Unable to parse direct <section>');
  }

  return { mainStart, mainEnd, openEnd, body, sections };
}

function prune(html) {
  const parsed = mainSections(html);
  if (!parsed) return { html, removed: [] };
  const removed = [];
  let body = '';
  let cursor = 0;
  for (const section of parsed.sections) {
    body += parsed.body.slice(cursor, section.start);
    const sectionHeading = heading(section.html);
    if (redundantHeadingSet.has(sectionHeading)) removed.push(sectionHeading);
    else body += section.html;
    cursor = section.end;
  }
  body += parsed.body.slice(cursor);
  return {
    html: html.slice(0, parsed.openEnd) + body + html.slice(parsed.mainEnd),
    removed,
  };
}

function sourceFragment(page) {
  const slug = page.replace(/\.html$/, '');
  const modelPath = path.join(ROOT, 'src/pages', slug, 'page.json');
  if (!fs.existsSync(modelPath)) throw new Error(`${page}: missing page model`);
  const model = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
  const candidates = model.sections
    .filter((section) => section.file)
    .map((section) => path.join(ROOT, 'src/pages', slug, section.file))
    .filter((file) => fs.existsSync(file))
    .sort((a, b) => fs.statSync(b).size - fs.statSync(a).size);
  if (!candidates.length) throw new Error(`${page}: no editable source fragment`);
  return candidates[0];
}

const rows = [];
const failures = [];
for (const { page } of manifest.pages) {
  const source = sourceFragment(page);
  const before = fs.readFileSync(source, 'utf8');
  const result = prune(before);
  if (APPLY && result.removed.length) fs.writeFileSync(source, result.html, 'utf8');

  const rootPath = path.join(ROOT, page);
  const rootHtml = fs.readFileSync(rootPath, 'utf8');
  const rootResult = prune(rootHtml);
  if (APPLY && rootResult.removed.length) fs.writeFileSync(rootPath, rootResult.html, 'utf8');
  const sourceRemaining = redundantHeadings.filter((value) => before.includes(`>${value}<`));
  const rootRemaining = redundantHeadings.filter((value) => rootHtml.includes(`>${value}<`));
  if (!APPLY && sourceRemaining.length) failures.push(`${page}: source still contains ${sourceRemaining.join(', ')}`);
  if (!APPLY && rootRemaining.length) failures.push(`${page}: output still contains ${rootRemaining.join(', ')}`);
  rows.push({
    page,
    source: path.relative(ROOT, source),
    sourceRemoved: result.removed.length,
    outputRemoved: rootResult.removed.length,
  });
}

if (failures.length) {
  console.error(`❌ Ventilation content prune P2 failed (${failures.length})`);
  for (const failure of failures.slice(0, 20)) console.error(`- ${failure}`);
  if (failures.length > 20) console.error(`- …and ${failures.length - 20} more`);
  process.exit(1);
}

if (APPLY) {
  const changed = rows.filter((row) => row.sourceRemoved > 0 || row.outputRemoved > 0);
  const sourceRemoved = changed.reduce((sum, row) => sum + row.sourceRemoved, 0);
  const outputRemoved = changed.reduce((sum, row) => sum + row.outputRemoved, 0);
  console.log(`✅ Ventilation content prune P2 applied: ${changed.length}/${rows.length} pages, source=${sourceRemoved}, output=${outputRemoved} sections removed`);
  console.log('Дальше: npm run site-builder:sync-manifest');
} else {
  console.log(`✅ Ventilation content prune P2 current: ${rows.length} pages, redundant sections=0`);
}
