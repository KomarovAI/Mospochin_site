#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const cluster = JSON.parse(fs.readFileSync(path.join(root, 'data/sous-vide-cluster-pages.json'), 'utf8'));
const registry = JSON.parse(fs.readFileSync(path.join(root, 'data/sous-vide-symptom-pages.json'), 'utf8'));
const published = registry.pages.filter((item) => item.status === 'published');
let errors = 0;
let checks = 0;

function pass(message) { checks += 1; console.log(`PASS: ${message}`); }
function fail(message) { checks += 1; errors += 1; console.error(`FAIL: ${message}`); }
function assert(condition, message) { condition ? pass(message) : fail(message); }
function text(html) { return String(html).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/\s+/g, ' ').trim(); }
function tokens(value) { return text(value).toLowerCase().match(/[а-яёa-z0-9]{4,}/g) || []; }
function jaccard(a, b) { const A = new Set(tokens(a)); const B = new Set(tokens(b)); const union = new Set([...A, ...B]); if (!union.size) return 0; let common = 0; for (const item of A) if (B.has(item)) common += 1; return common / union.size; }
function componentHtml(page, component) {
  const slug = page.replace(/\.html$/, '');
  const model = JSON.parse(fs.readFileSync(path.join(root, 'src/pages', slug, 'page.json'), 'utf8'));
  const section = model.sections.find((item) => item.component === component);
  if (!section) return '';
  const file = section.file || section.sourceFile;
  return file ? fs.readFileSync(path.join(root, 'src/pages', slug, file), 'utf8') : '';
}

const titles = new Map();
const descriptions = new Map();
const h1s = new Map();
for (const entry of cluster.pages.filter((item) => item.indexable)) {
  const html = fs.readFileSync(path.join(root, entry.page), 'utf8');
  const title = text(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  const description = (html.match(/<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) || html.match(/<meta\b[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i))?.[1] || '';
  const h1 = text(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
  for (const [map, value, label] of [[titles, title, 'title'], [descriptions, description, 'description'], [h1s, h1, 'H1']]) {
    const owner = map.get(value);
    if (owner) fail(`${entry.page}: duplicate ${label} with ${owner}`); else { map.set(value, entry.page); pass(`${entry.page}: unique ${label}`); }
  }
}

const coreComponents = ['safe-self-check', 'decision-tree', 'cause-matrix', 'faq'];
for (const entry of published) {
  const html = fs.readFileSync(path.join(root, entry.page), 'utf8');
  const words = tokens(html).length;
  assert(words >= 350, `${entry.page}: at least 350 meaningful words (${words})`);
  const repair = componentHtml(entry.page, 'repair-scope');
  assert(!repair.includes('Решение принимается после измерений и проверки конкретной модели.'), `${entry.page}: repair cards contain node-specific explanations`);
  const paragraphs = [...repair.matchAll(/<article\b[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/article>/gi)].map((match) => text(match[1]));
  assert(paragraphs.length >= 4, `${entry.page}: repair scope contains at least four explained checks`);
  assert(new Set(paragraphs).size === paragraphs.length, `${entry.page}: repair explanations are unique inside page`);
  for (const paragraph of paragraphs) assert(paragraph.length >= 80, `${entry.page}: repair explanation is substantive`);
}

for (const component of coreComponents) {
  for (let i = 0; i < published.length; i += 1) {
    for (let j = i + 1; j < published.length; j += 1) {
      const a = componentHtml(published[i].page, component);
      const b = componentHtml(published[j].page, component);
      const overlap = jaccard(a, b);
      assert(overlap < 0.72, `${component}: ${published[i].page} vs ${published[j].page} overlap ${(overlap * 100).toFixed(1)}%`);
    }
  }
}

const hub = fs.readFileSync(path.join(root, 'sous-vide-restoranov.html'), 'utf8');
const h2s = [...hub.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map((match) => text(match[1]));
assert(new Set(h2s).size === h2s.length, `sous-vide-restoranov.html: H2 headings are unique`);
assert(hub.includes('Основные маршруты sous-vide'), `sous-vide-restoranov.html: primary navigation section is named`);
assert(hub.includes('Оборудование, сервис и технология'), `sous-vide-restoranov.html: equipment and guide section is named`);

if (errors) {
  console.error(`\nSous-vide SEO content failed: ${errors}/${checks} checks`);
  process.exit(1);
}
console.log(`\nSous-vide SEO content passed: ${checks} checks, ${published.length} symptom pages`);
