#!/usr/bin/env node
/**
 * FAQ Registry
 *
 * Extracts visible FAQ/details content from Static Component Builder sections,
 * writes a compact content registry and removes retired FAQPage JSON-LD.
 * Google stopped showing FAQ rich results on 2026-05-07.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import {
  ROOT_DIR,
  hashContent,
  loadBuilderManifest,
  readJsonFile,
  readSectionContent,
  stableGeneratedAt,
  toPosix,
  writeProjectFile,
} from './site-builder-lib.mjs';
import { parseArgs } from './ai-maintenance-lib.mjs';

const REGISTRY_PATH = 'content/faq/page-faq-registry.json';
const SCHEMA_DIR = 'content/faq/schema';
const DOC_PATH = 'docs/FAQ_REGISTRY.md';
const GENERATED_MARKER = 'data-generated="faq-registry"';
const GENERATED_BLOCK_RE = /\n?\s*<script\b(?=[^>]*\btype=["']application\/ld\+json["'])(?=[^>]*\bdata-generated=["']faq-registry["'])[^>]*>[\s\S]*?<\/script>\s*/gi;
const JSON_LD_BLOCK_RE = /\n?\s*<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>\s*/gi;
const FAQPAGE_SCHEMA_ENABLED = false;
const FAQPAGE_RETIREMENT_SOURCE = 'https://developers.google.com/search/updates#removing-faq-rich-result';

const args = parseArgs();
const checkMode = Boolean(args.check);
const selectedPages = args.page
  ? new Set(String(args.page).split(',').map((item) => item.trim()).filter(Boolean))
  : null;

function usage() {
  console.log(`\n# FAQ Registry\n\nИспользование:\n  npm run generate:faq-registry\n  npm run check:faq-registry\n  npm run generate:faq-registry -- --page holodilniki.html\n\nЧто делает:\n  1. Извлекает visible FAQ/details из src/pages/* через site-builder model.\n  2. Пишет content/faq/page-faq-registry.json.\n  3. Удаляет устаревшую FAQPage JSON-LD, сохраняя видимый FAQ.\n`);
}

if (args.help) {
  usage();
  process.exit(0);
}

function ensureDir(path) {
  mkdirSync(join(ROOT_DIR, path), { recursive: true });
}

function readProject(path) {
  return readFileSync(join(ROOT_DIR, path), 'utf8');
}

function writeIfChanged(path, content) {
  const abs = join(ROOT_DIR, path);
  const current = existsSync(abs) ? readFileSync(abs, 'utf8') : null;
  if (current === content) return false;
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content);
  return true;
}

function compareFile(path, expected, errors) {
  const abs = join(ROOT_DIR, path);
  const current = existsSync(abs) ? readFileSync(abs, 'utf8') : null;
  if (current !== expected) {
    errors.push(`${path} неактуален. Запусти npm run generate:faq-registry${selectedPages ? ' для полного registry без --page' : ''}.`);
    return false;
  }
  return true;
}

function decodeEntities(value = '') {
  return String(value)
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…');
}

function stripTags(value = '') {
  return decodeEntities(String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());
}

function compactText(value = '') {
  return stripTags(value).replace(/\s+/g, ' ').trim();
}

function slugFromPage(page) {
  return page === 'index.html' ? 'index' : page.replace(/\.html$/i, '');
}

function htmlToSingleLine(value = '') {
  return String(value)
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractDetailsItems(html) {
  const items = [];
  const detailMatches = [...String(html).matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/gi)];
  let position = 0;
  for (const match of detailMatches) {
    const inner = match[1] || '';
    const summaryMatch = inner.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/i);
    if (!summaryMatch) continue;
    const question = compactText(summaryMatch[1]).replace(/\s*\+\s*$/, '').trim();
    const answerHtml = inner.slice((summaryMatch.index || 0) + summaryMatch[0].length).trim();
    const answerText = compactText(answerHtml);
    if (!question || !answerText) continue;
    position += 1;
    items.push({
      position,
      question,
      answerText,
      answerHtml: htmlToSingleLine(answerHtml),
      sourceHash: hashContent(`${question}\n${answerText}`).slice(0, 16),
    });
  }
  return items;
}

function extractAccordionItems(html) {
  const items = [];
  const pattern = /<button\b[^>]*class=["'][^"']*\bfaq-question\b[^"']*["'][^>]*>([\s\S]*?)<\/button>\s*<div\b[^>]*class=["'][^"']*\bfaq-answer\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;
  for (const match of String(html).matchAll(pattern)) {
    const question = compactText(match[1]);
    const answerHtml = String(match[2] || '').trim();
    const answerText = compactText(answerHtml);
    if (!question || !answerText) continue;
    items.push({
      position: items.length + 1,
      question,
      answerText,
      answerHtml: htmlToSingleLine(answerHtml),
      sourceHash: hashContent(`${question}\n${answerText}`).slice(0, 16),
    });
  }
  return items;
}

function extractFaqItems(html) {
  const items = [...extractDetailsItems(html), ...extractAccordionItems(html)];
  const seen = new Set();
  return items.filter((item) => {
    const key = item.question.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen.has(key)) return false;
    seen.add(key);
    item.position = seen.size;
    return true;
  });
}

function isSchemaEligibleBlock({ label, items, html }) {
  if (!items.length) return false;
  const labelText = String(label || '').toLowerCase();
  const htmlText = String(html || '').toLowerCase();
  const hasFaqSignal = /faq|частые вопросы|что обычно спрашивают|вопросы/.test(labelText) || />\s*(?:❓\s*)?(?:faq|частые вопросы|что обычно спрашивают)\s*</i.test(htmlText);
  const questionLikeCount = items.filter((item) => /\?\s*$/.test(item.question)).length;
  // Mini cases and scenario accordions are useful visible content but not always FAQPage-worthy.
  const looksLikeCases = /мини-кейс|сценарий|разобраться подробнее/.test(labelText) || items.some((item) => /^сценарий\s*\d+/i.test(item.question));
  return hasFaqSignal && !looksLikeCases && questionLikeCount >= Math.min(2, items.length);
}

function buildFaqPageSchema({ page, pageTitle, items }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `https://mospochin.ru/${page === 'index.html' ? '' : page}#faq`,
    url: `https://mospochin.ru/${page === 'index.html' ? '' : page}`,
    name: pageTitle || `FAQ — ${page}`,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answerText,
      },
    })),
  };
}

function generatedSchemaScript(schema) {
  const body = JSON.stringify(schema, null, 2);
  return `\n    <script type="application/ld+json" data-generated="faq-registry">\n${body.split('\n').map((line) => `      ${line}`).join('\n')}\n    </script>`;
}

function removeGeneratedFaqSchema(head) {
  return String(head).replace(GENERATED_BLOCK_RE, (match) => {
    // Preserve one newline when the generated block was between head elements.
    return match.startsWith('\n') ? '\n' : '';
  }).replace(/\n{3,}/g, '\n\n');
}

function removeStandaloneFaqSchemas(head) {
  return String(head).replace(JSON_LD_BLOCK_RE, (match, body) => {
    try {
      const schema = JSON.parse(body);
      const types = [].concat(schema?.['@type'] || []);
      return types.includes('FAQPage') ? (match.startsWith('\n') ? '\n' : '') : match;
    } catch {
      return match;
    }
  }).replace(/\n{3,}/g, '\n\n');
}

function injectGeneratedFaqSchema(head, schema) {
  const withoutGenerated = removeGeneratedFaqSchema(head);
  const clean = removeStandaloneFaqSchemas(withoutGenerated);
  if (!schema) return clean;
  const script = generatedSchemaScript(schema);
  if (!/<\/head>/i.test(clean)) throw new Error('head.html не содержит </head>');
  return clean.replace(/\s*<\/head>/i, `${script}\n</head>`);
}

function sourcePathForSection(modelPath, section) {
  if (section.templateRef) return section.templateRef;
  if (section.componentRef) return section.componentRef;
  if (section.file) return toPosix(join(dirname(modelPath), section.file));
  return null;
}

function buildRegistry() {
  const manifest = loadBuilderManifest();
  if (!manifest) throw new Error('src/site-builder.json не найден');
  const pages = {};
  const schemaFiles = new Map();
  const headUpdates = new Map();
  let totalBlocks = 0;
  let totalItems = 0;
  let schemaPages = 0;
  let schemaItems = 0;

  for (const entry of manifest.pages || []) {
    if (selectedPages && !selectedPages.has(entry.page)) continue;
    const model = readJsonFile(entry.model);
    const headPath = toPosix(join(dirname(entry.model), model.files.head));
    const currentHead = readProject(headPath);
    const blocks = [];
    const schemaCandidates = [];
    for (const section of model.sections || []) {
      const html = readSectionContent(entry.model, section);
      const items = extractFaqItems(html);
      if (!items.length) continue;
      const source = sourcePathForSection(entry.model, section);
      const schemaEligible = isSchemaEligibleBlock({ label: section.label, items, html });
      const block = {
        id: section.id,
        label: section.label,
        source,
        sourceMode: section.templateRef ? 'parametric-template' : section.componentRef ? 'shared-component' : 'page-section',
        sourceHash: hashContent(html).slice(0, 16),
        itemCount: items.length,
        schemaEligible,
        items,
      };
      blocks.push(block);
      totalBlocks += 1;
      totalItems += items.length;
      if (schemaEligible) schemaCandidates.push(...items.map((item) => ({ ...item, blockId: section.id })));
    }

    if (!blocks.length) {
      headUpdates.set(headPath, injectGeneratedFaqSchema(currentHead, null));
      continue;
    }

    const dedupedSchemaItems = [];
    const seenQuestions = new Set();
    for (const item of schemaCandidates) {
      const key = item.question.toLowerCase().replace(/\s+/g, ' ').trim();
      if (seenQuestions.has(key)) continue;
      seenQuestions.add(key);
      dedupedSchemaItems.push(item);
    }

    const schemaEnabled = FAQPAGE_SCHEMA_ENABLED && dedupedSchemaItems.length >= 2;
    const schema = schemaEnabled ? buildFaqPageSchema({ page: entry.page, pageTitle: model.title || model.h1, items: dedupedSchemaItems }) : null;
    if (schema) {
      schemaPages += 1;
      schemaItems += dedupedSchemaItems.length;
      schemaFiles.set(`${SCHEMA_DIR}/${slugFromPage(entry.page)}.json`, `${JSON.stringify(schema, null, 2)}\n`);
    }

    pages[entry.page] = {
      page: entry.page,
      slug: model.slug,
      branch: model.branch,
      role: model.role,
      title: model.title,
      h1: model.h1,
      blockCount: blocks.length,
      itemCount: blocks.reduce((sum, block) => sum + block.itemCount, 0),
      schema: {
        enabled: schemaEnabled,
        retired: !FAQPAGE_SCHEMA_ENABLED,
        retirementSource: FAQPAGE_RETIREMENT_SOURCE,
        itemCount: schemaEnabled ? dedupedSchemaItems.length : 0,
        output: schema ? `${SCHEMA_DIR}/${slugFromPage(entry.page)}.json` : null,
        generatedHead: schema ? `src/pages/${model.slug}/head.html` : null,
        sourceBlocks: schemaEnabled ? [...new Set(dedupedSchemaItems.map((item) => item.blockId))] : [],
      },
      blocks,
    };

    headUpdates.set(headPath, injectGeneratedFaqSchema(currentHead, schema));
  }

  const registry = {
    schemaVersion: 1,
    generatedAt: stableGeneratedAt(),
    source: 'src/pages/* FAQ sections via Static Component Builder',
    policy: {
      visibleFaqSource: 'src/pages/<slug>/sections/* or shared/parametric components',
      registryRole: 'machine-readable content index for visible FAQ blocks',
      schemaSync: 'FAQPage JSON-LD retired after Google stopped showing FAQ rich results on 2026-05-07',
      retirementSource: FAQPAGE_RETIREMENT_SOURCE,
      noManualSchemaEdits: 'Do not add FAQPage JSON-LD; keep useful answers visible and rerun npm run generate:faq-registry.',
    },
    summary: {
      pagesWithFaq: Object.keys(pages).length,
      blocks: totalBlocks,
      items: totalItems,
      pagesWithFaqPageSchema: schemaPages,
      schemaItems,
    },
    pages,
  };

  return { registry, schemaFiles, headUpdates };
}

function expectedSchemaFileSet(schemaFiles) {
  return new Set([...schemaFiles.keys()]);
}

function currentSchemaFiles() {
  const dir = join(ROOT_DIR, SCHEMA_DIR);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((file) => file.endsWith('.json')).map((file) => `${SCHEMA_DIR}/${file}`).sort();
}

function buildDocs(registry) {
  return `# FAQ Registry\n\nЭтот слой индексирует видимые FAQ-блоки. Генерация \`FAQPage\` JSON-LD отключена: Google перестал показывать FAQ rich results 7 мая 2026 года и удалил документацию функции.\n\nИсточник: ${FAQPAGE_RETIREMENT_SOURCE}\n\n## Источник правды\n\n- Видимый FAQ остаётся в Static Component Builder source: \`src/pages/<slug>/sections/*\`, \`src/components/shared/*\` или \`src/components/parametric/*\`.\n- \`content/faq/page-faq-registry.json\` — машинный индекс видимых FAQ-блоков.\n- \`content/faq/schema/*.json\` должен оставаться пустым.\n- В \`src/pages/<slug>/head.html\` не должно быть \`FAQPage\` JSON-LD.\n\n## Команды\n\n\`\`\`bash\nnpm run generate:faq-registry\nnpm run check:faq-registry\nnpm run build:site -- --write\nnpm run ai:semantic-diff -- --page holodilniki.html\nnpm run ai:check\n\`\`\`\n\n## Метрики текущего registry\n\n- Страниц с FAQ: ${registry.summary.pagesWithFaq}\n- FAQ-блоков: ${registry.summary.blocks}\n- Вопросов/ответов: ${registry.summary.items}\n- Страниц с FAQPage schema: ${registry.summary.pagesWithFaqPageSchema}\n- Вопросов в schema: ${registry.summary.schemaItems}\n\n## Workflow для AI\n\n1. Для понимания FAQ страницы сначала читать \`content/faq/page-faq-registry.json\`, а не весь HTML.\n2. Менять только полезный видимый FAQ в соответствующем section/component source.\n3. После правки запускать \`npm run generate:faq-registry\`, затем \`npm run build:site -- --write\`.\n4. Проверять \`npm run check:faq-registry && npm run check:site-builder && npm run ai:semantic-diff -- --page <page.html>\`.\n\nFAQPage-разметку не возвращать без нового подтверждённого изменения в документации Google.\n`;
}

let errors = [];
let writes = 0;
let registry;
let schemaFiles;
let headUpdates;

try {
  ({ registry, schemaFiles, headUpdates } = buildRegistry());
} catch (error) {
  console.error(`❌ ${error.message}`);
  process.exit(1);
}

const registryContent = `${JSON.stringify(registry, null, 2)}\n`;
const docsContent = buildDocs(registry);
const expectedSchemas = expectedSchemaFileSet(schemaFiles);

if (checkMode) {
  compareFile(REGISTRY_PATH, registryContent, errors);
  compareFile(DOC_PATH, docsContent, errors);
  for (const [file, content] of schemaFiles) compareFile(file, content, errors);
  for (const existing of currentSchemaFiles()) {
    if (!expectedSchemas.has(existing)) errors.push(`${existing} лишний или устарел. Запусти npm run generate:faq-registry.`);
  }
  for (const [file, content] of headUpdates) compareFile(file, content, errors);

  if (errors.length) {
    console.error('\n# FAQ Registry check failed\n');
    for (const error of errors) console.error(`❌ ${error}`);
    process.exit(1);
  }
  console.log('✅ FAQ registry актуален');
  console.log(`   pages=${registry.summary.pagesWithFaq}, blocks=${registry.summary.blocks}, items=${registry.summary.items}, schemaPages=${registry.summary.pagesWithFaqPageSchema}`);
  process.exit(0);
}

ensureDir('content/faq');
ensureDir(SCHEMA_DIR);
if (writeIfChanged(REGISTRY_PATH, registryContent)) writes += 1;
if (writeIfChanged(DOC_PATH, docsContent)) writes += 1;

// Remove stale schema files before writing expected ones.
if (existsSync(join(ROOT_DIR, SCHEMA_DIR))) {
  for (const existing of currentSchemaFiles()) {
    if (!expectedSchemas.has(existing)) {
      rmSync(join(ROOT_DIR, existing), { force: true });
      writes += 1;
    }
  }
}
for (const [file, content] of schemaFiles) {
  if (writeIfChanged(file, content)) writes += 1;
}
for (const [file, content] of headUpdates) {
  if (writeIfChanged(file, content)) writes += 1;
}

console.log('✅ FAQ Registry обновлён; FAQPage schema retired');
console.log(`   pages=${registry.summary.pagesWithFaq}, blocks=${registry.summary.blocks}, items=${registry.summary.items}`);
console.log(`   schemaPages=${registry.summary.pagesWithFaqPageSchema}, schemaItems=${registry.summary.schemaItems}`);
console.log(`   changedFiles=${writes}`);
console.log('\nСледующие шаги:');
console.log('- npm run build:site -- --write');
console.log('- npm run check:faq-registry');
console.log('- npm run check:site-builder');
