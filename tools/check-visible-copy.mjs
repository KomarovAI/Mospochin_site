#!/usr/bin/env node
/**
 * Guardrail: fail when internal SEO/AI/dev labels leak into user-facing copy.
 *
 * This check intentionally scans user-facing surfaces only:
 * - generated root HTML visible body text + browser/search/accessibility attrs;
 * - source page HTML fragments visible text;
 * - selected JSON string values that feed page copy/meta/forms/FAQ.
 *
 * It does NOT scan CSS classes, ids, data attributes, comments, scripts, styles,
 * generated project maps or AI/handoff docs, because internal terms are valid there.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.ai',
  '.deploy',
  'reports',
  'screenshots',
  'dist',
  'build',
]);

const ROOT_HTML_EXCLUDE = new Set([]);

const JSON_SCAN_ROOTS = [
  'content/components/lead-form',
  'content/faq/schema',
  'data/page-metadata.json',
  'data/direct-landing-pages.json',
  'data/contact-config.json',
];

const HTML_SOURCE_ROOTS = [
  'src/pages',
  'src/components',
  'partials',
];

const BANNED_PATTERNS = [
  { id: 'seo-term', label: 'SEO / SEO-блок', re: /(?:^|[^a-zа-яё0-9])seo(?:$|[^a-zа-яё0-9])/i },
  { id: 'repair-bridge', label: 'repair bridge', re: /repair\s*bridge/i },
  { id: 'hub-en', label: 'hub', re: /(?:^|[^a-zа-яё0-9])hub(?:$|[^a-zа-яё0-9])/i },
  { id: 'hub-ru', label: 'хаб', re: /(?:^|[^a-zа-яё0-9])хаб(?:$|[^a-zа-яё0-9])/i },
  { id: 'cluster-ru', label: 'кластер', re: /(?:^|[^a-zа-яё0-9])кластер(?:а|е|ом|у|ы|ов)?(?:$|[^a-zа-яё0-9])/i },
  { id: 'landing-en', label: 'landing', re: /(?:^|[^a-zа-яё0-9])landing(?:$|[^a-zа-яё0-9])/i },
  { id: 'landing-ru', label: 'посадочная', re: /посадочн/i },
  { id: 'b2b-landing', label: 'B2B-посадочная', re: /b2b\s*[-–—]?\s*посадочн/i },
  { id: 'winner', label: 'winner', re: /(?:^|[^a-zа-яё0-9])winner(?:$|[^a-zа-яё0-9])/i },
  { id: 'neutral-branch', label: 'neutral-branch', re: /neutral\s*[-–—]?\s*branch/i },
  { id: 'page-strengthened', label: 'страница усилена', re: /страниц[ауы]\s+усилен/i },
  { id: 'clickable-landings', label: 'кликабельные переходы на посадочные', re: /кликабельн\w*\s+переход\w*\s+на\s+посадочн/i },
  { id: 'lead-term-en', label: 'lead/leads', re: /(?:^|[^a-zа-яё0-9])leads?(?:$|[^a-zа-яё0-9])/i },
  { id: 'lead-term-ru', label: 'лиды / сбор лидов', re: /(?:^|[^a-zа-яё0-9])лид(?:ы|ов|ам|ами|ах)?(?:$|[^a-zа-яё0-9])|лидогенерац/i },
  { id: 'conversion-term', label: 'конверсия / конверсионный', re: /конверси/i },
  { id: 'stage-label', label: 'Stage/P0/P1 labels', re: /(?:^|[^a-zа-яё0-9])stage\s*\d+|(?:^|[^a-zа-яё0-9])p[0-3](?:$|[^a-zа-яё0-9])/i },
  { id: 'ai-term-ru', label: 'нейронка / AI-friendly', re: /нейронк|ai[- ]?friendly/i },
  { id: 'handoff-term', label: 'handoff', re: /(?:^|[^a-zа-яё0-9])handoff(?:$|[^a-zа-яё0-9])/i },
  { id: 'runtime-term', label: 'runtime/generated/source/rollback', re: /(?:^|[^a-zа-яё0-9])(?:runtime|generated|rollback|source\s+of\s+truth)(?:$|[^a-zа-яё0-9])/i },
  { id: 'guardrail-term', label: 'guardrail', re: /guardrail/i },
  { id: 'dev-term-ru', label: 'рабочий дожим', re: /дожим/i },
];

function walkFiles(start, predicate, out = []) {
  const abs = path.resolve(ROOT_DIR, start);
  if (!fs.existsSync(abs)) return out;
  const stat = fs.statSync(abs);
  if (stat.isFile()) {
    if (predicate(abs)) out.push(abs);
    return out;
  }
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      walkFiles(path.relative(ROOT_DIR, path.join(abs, entry.name)), predicate, out);
    } else {
      const p = path.join(abs, entry.name);
      if (predicate(p)) out.push(p);
    }
  }
  return out;
}

function decodeEntities(text) {
  return String(text)
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => {
      const cp = Number(n);
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : _;
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => {
      const cp = Number.parseInt(n, 16);
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : _;
    });
}

function stripHtmlToVisibleText(html, { rootDocument = false } = {}) {
  let text = String(html);
  text = text.replace(/<!--([\s\S]*?)-->/g, ' ');
  text = text.replace(/<script\b[\s\S]*?<\/script>/gi, ' ');
  text = text.replace(/<style\b[\s\S]*?<\/style>/gi, ' ');
  text = text.replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ');
  if (rootDocument) {
    text = text.replace(/<head\b[\s\S]*?<\/head>/gi, ' ');
  }
  text = text.replace(/<[^>]+>/g, ' ');
  return normalizeText(decodeEntities(text));
}

function normalizeText(text) {
  return String(text).replace(/\s+/g, ' ').trim();
}

function extractAttrValues(html, attrName) {
  const values = [];
  const re = new RegExp(`${attrName}\\s*=\\s*("[^"]*"|'[^']*'|[^\\s>]+)`, 'gi');
  let match;
  while ((match = re.exec(html))) {
    let raw = match[1] || '';
    if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
      raw = raw.slice(1, -1);
    }
    const value = normalizeText(decodeEntities(raw));
    if (value) values.push(value);
  }
  return values;
}

function extractMetaContent(html) {
  const values = [];
  const metaRe = /<meta\b[^>]*>/gi;
  let tag;
  while ((tag = metaRe.exec(html))) {
    const t = tag[0];
    const name = extractAttrValues(t, 'name')[0] || '';
    const property = extractAttrValues(t, 'property')[0] || '';
    const content = extractAttrValues(t, 'content')[0] || '';
    if (!content) continue;
    const key = `${name} ${property}`.toLowerCase();
    if (/description|title|og:|twitter:/.test(key)) {
      values.push(content);
    }
  }
  return values;
}

function extractTitle(html) {
  const m = String(html).match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  return m ? normalizeText(decodeEntities(m[1])) : '';
}

function scanText({ file, surface, text, results }) {
  if (!text) return;
  for (const pattern of BANNED_PATTERNS) {
    pattern.re.lastIndex = 0;
    const match = pattern.re.exec(text);
    if (!match) continue;
    const index = Math.max(0, match.index || 0);
    const start = Math.max(0, index - 90);
    const end = Math.min(text.length, index + 160);
    results.push({
      file: path.relative(ROOT_DIR, file),
      surface,
      rule: pattern.id,
      label: pattern.label,
      snippet: text.slice(start, end).trim(),
    });
  }
}

function scanHtmlFile(file, { rootDocument = false, sourceFragment = false } = {}) {
  const html = fs.readFileSync(file, 'utf8');
  const results = [];
  scanText({ file, surface: rootDocument ? 'visible body text' : 'visible source fragment', text: stripHtmlToVisibleText(html, { rootDocument }), results });

  if (rootDocument || sourceFragment) {
    const attrs = [
      ...extractAttrValues(html, 'alt'),
      ...extractAttrValues(html, 'aria-label'),
      ...extractAttrValues(html, 'title'),
      ...extractAttrValues(html, 'placeholder'),
      ...extractAttrValues(html, 'value'),
    ].filter(Boolean).join(' ');
    scanText({ file, surface: 'user-facing attributes', text: attrs, results });
  }

  if (rootDocument) {
    scanText({ file, surface: 'html title', text: extractTitle(html), results });
    scanText({ file, surface: 'meta title/description', text: extractMetaContent(html).join(' '), results });
  }

  return results;
}

const USER_FACING_JSON_KEY_RE = /^(title|subtitle|description|metaDescription|ogDescription|heading|lead|text|label|cta|submitText|question|questionText|answer|answerText|answerHtml|placeholder|eyebrow|badge|kicker|note|copy|html)$/i;
const JSON_KEY_ALLOWLIST_CONTEXT_RE = /(?:^|\.)(placeholders|options|items|cards|questions|answers|faq|steps|features)(?:\.|$)/i;
const JSON_KEY_DENY_RE = /^(id|ids|idPrefix|component|variant|page|url|href|canonical|formContext|schemaVersion|tracking|goal|class|className|data|source|generated|updatedAt)$/i;

function collectJsonStrings(value, out = [], pathParts = []) {
  const key = pathParts[pathParts.length - 1] || '';
  const pathKey = pathParts.join('.');
  if (JSON_KEY_DENY_RE.test(key)) return out;

  if (typeof value === 'string') {
    const shouldScan = USER_FACING_JSON_KEY_RE.test(key) || JSON_KEY_ALLOWLIST_CONTEXT_RE.test(pathKey);
    if (shouldScan) {
      const normalized = normalizeText(value.replace(/<[^>]+>/g, ' '));
      if (normalized) out.push(normalized);
    }
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => collectJsonStrings(item, out, [...pathParts, String(index)]));
  } else if (value && typeof value === 'object') {
    for (const [childKey, item] of Object.entries(value)) collectJsonStrings(item, out, [...pathParts, childKey]);
  }
  return out;
}

function scanJsonFile(file) {
  const results = [];
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    console.error(`Failed to parse JSON ${path.relative(ROOT_DIR, file)}: ${error.message}`);
    process.exit(2);
  }
  const text = collectJsonStrings(parsed).join(' ');
  scanText({ file, surface: 'user-facing json values', text, results });
  return results;
}

function rootHtmlFiles() {
  return fs.readdirSync(ROOT_DIR)
    .filter((name) => name.endsWith('.html') && !ROOT_HTML_EXCLUDE.has(name))
    .map((name) => path.join(ROOT_DIR, name));
}

function sourceHtmlFiles() {
  const files = [];
  for (const root of HTML_SOURCE_ROOTS) {
    files.push(...walkFiles(root, (p) => p.endsWith('.html')));
  }
  return files;
}

function jsonFiles() {
  const files = [];
  for (const root of JSON_SCAN_ROOTS) {
    files.push(...walkFiles(root, (p) => p.endsWith('.json')));
  }
  return [...new Set(files)];
}

const results = [];
for (const file of rootHtmlFiles()) results.push(...scanHtmlFile(file, { rootDocument: true }));
for (const file of sourceHtmlFiles()) results.push(...scanHtmlFile(file, { sourceFragment: true }));
for (const file of jsonFiles()) results.push(...scanJsonFile(file));

const summary = {
  rootHtmlFiles: rootHtmlFiles().length,
  sourceHtmlFiles: sourceHtmlFiles().length,
  jsonFiles: jsonFiles().length,
  bannedHits: results.length,
};

console.log('== visible copy guard ==');
console.log(JSON.stringify(summary, null, 2));

if (results.length) {
  console.error('\n❌ Internal SEO/AI/dev terms leaked into user-facing copy.');
  for (const hit of results.slice(0, 50)) {
    console.error(`\n- ${hit.file}`);
    console.error(`  surface: ${hit.surface}`);
    console.error(`  rule: ${hit.rule} (${hit.label})`);
    console.error(`  snippet: ${hit.snippet}`);
  }
  if (results.length > 50) {
    console.error(`\n... ${results.length - 50} more hits omitted`);
  }
  process.exit(1);
}

console.log('✅ visible copy guard passed');
