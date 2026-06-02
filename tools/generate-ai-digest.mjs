#!/usr/bin/env node
import { existsSync, rmSync, readFileSync } from 'fs';
import { join } from 'path';
import { parseArgs, ROOT_DIR } from './ai-maintenance-lib.mjs';
import {
  DIGEST_DIR,
  analyzeSourceComplexity,
  collectPageSectionMetrics,
  ensureDir,
  fileExists,
  formatBytes,
  loadPageModelFromSlug,
  loadProjectMaps,
  readJson,
  readProjectFile,
  stripTags,
  toPosix,
  walkFiles,
  writeProjectFile,
} from './source-compression-lib.mjs';

const args = parseArgs();

function safeName(value) {
  return String(value || 'item')
    .replace(/\.html$/i, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
}

function mdTable(headers, rows) {
  if (!rows.length) return '_Нет данных._\n';
  const esc = (value) => String(value ?? '—').replace(/\|/g, '\\|').replace(/\n/g, ' ');
  return [
    `| ${headers.map(esc).join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map(esc).join(' | ')} |`),
  ].join('\n') + '\n';
}

function firstTextFromHtml(html, selector = 'h2') {
  const re = new RegExp(`<${selector}[^>]*>([\\s\\S]*?)<\\/${selector}>`, 'i');
  return stripTags(html.match(re)?.[1] || '');
}

function componentRefPages(report) {
  const map = new Map();
  for (const shared of report.sharedComponents || []) {
    map.set(shared.file, shared.pages || []);
  }
  return map;
}

function renderProjectDigest(report, index, componentMap) {
  const s = report.summary;
  const lines = [];
  lines.push('# AI Digest — MosPochin Project');
  lines.push('');
  lines.push('Короткая машинная сводка проекта. Начинай работу отсюда, затем открывай только нужные page/component digest-файлы и конкретные source-файлы.');
  lines.push('');
  lines.push('## Быстрая карта');
  lines.push('');
  lines.push(mdTable(['Область', 'Источник'], [
    ['Главный контекст', 'AI-CONTEXT.md'],
    ['Владение файлами', 'docs/AI_FILE_OWNERSHIP.md'],
    ['Гибкое редактирование', 'docs/AI_FLEXIBLE_EDITING.md'],
    ['Builder', 'docs/STATIC_COMPONENT_BUILDER.md'],
    ['Shared components', 'docs/DECLARATIVE_COMPONENTS.md'],
    ['Сжатие source', 'docs/SOURCE_COMPRESSION_PLAN.md'],
    ['Страницы', '.ai/digest/pages/*.md'],
    ['Компоненты', '.ai/digest/components/*.md'],
    ['Машинная карта', '.ai/digest/content-map.json'],
  ]));
  lines.push('');
  lines.push('## Состояние source');
  lines.push('');
  lines.push(mdTable(['Метрика', 'Значение'], [
    ['Pages', index.summary?.totalPages || s.rootHtmlPages],
    ['Builder pages', s.builderPages],
    ['Total sections', s.totalSections],
    ['src/pages files', s.srcPageFiles],
    ['src/pages HTML section files', s.srcPageHtmlFiles],
    ['Shared component files', s.sharedComponentFiles],
    ['Shared refs', s.sharedSectionRefs],
    ['Shared coverage', `${(s.sharedCoverageRatio * 100).toFixed(1)}%`],
    ['Average sections/page', s.averageSectionsPerPage.toFixed(1)],
    ['Average source files/page', s.averageSourceFilesPerPage.toFixed(1)],
    ['AI component map entries', Object.keys(componentMap.components || {}).length],
  ]));
  lines.push('');
  lines.push('## Как работать AI');
  lines.push('');
  lines.push('1. Для задачи запусти `npm run ai:workspace -- --task "..."`.');
  lines.push('2. Открой `.ai/digest/project.md`, затем page/component digest по задаче.');
  lines.push('3. Редактируй гибко: `src/pages/<slug>/sections/*`, `src/components/shared/*`, CSS/JS/data при необходимости.');
  lines.push('4. После HTML-source правок собери root HTML: `npm run build:site -- --page <file.html> --write` или `npm run build:site -- --write`.');
  lines.push('5. Проверь: `npm run ai:review`, `npm run ai:semantic-diff -- --page <file.html>`, `npm run ai:check`.');
  lines.push('');
  lines.push('## Самые сложные страницы');
  lines.push('');
  lines.push(mdTable(['Page', 'Sections', 'Local', 'Shared'], report.topPages.bySections.slice(0, 10).map((p) => [p.page, p.sections, p.localSections, p.sharedRefs])));
  lines.push('');
  lines.push('## Крупнейшие кандидаты на сжатие смысла');
  lines.push('');
  for (const item of (report.compressionOpportunities || []).slice(0, 12)) {
    lines.push(`- **${item.priority}**: ${item.message}`);
  }
  if (!report.compressionOpportunities?.length) lines.push('- Крупных кандидатов нет.');
  lines.push('');
  lines.push('## Команды digest/source compression');
  lines.push('');
  lines.push('```bash');
  lines.push('npm run ai:digest');
  lines.push('npm run check:ai-digest');
  lines.push('npm run analyze:source-complexity');
  lines.push('npm run check:source-complexity');
  lines.push('```');
  lines.push('');
  return lines.join('\n');
}

function renderPageDigest(pageMetric, indexPage) {
  const lines = [];
  lines.push(`# Page Digest — ${pageMetric.page}`);
  lines.push('');
  lines.push(`- Branch: ${pageMetric.branch}`);
  lines.push(`- Role: ${pageMetric.role}`);
  lines.push(`- Title: ${indexPage?.title || pageMetric.title || '—'}`);
  if (indexPage?.description) lines.push(`- Description: ${indexPage.description}`);
  lines.push(`- H1: ${pageMetric.h1 || indexPage?.h1 || '—'}`);
  if (indexPage?.canonical) lines.push(`- Canonical: ${indexPage.canonical}`);
  lines.push(`- Builder model: src/pages/${pageMetric.slug}/page.json`);
  lines.push(`- Sections: ${pageMetric.sectionCount} (${pageMetric.localSections} local, ${pageMetric.sharedRefs} shared refs, ${pageMetric.rawSections} raw)`);
  lines.push(`- Text words inside referenced sections: ${pageMetric.textWords}`);
  lines.push('');
  lines.push('## Component mix');
  lines.push('');
  lines.push(mdTable(['Component', 'Count'], Object.entries(pageMetric.byComponent).map(([component, count]) => [component, count])));
  lines.push('');
  lines.push('## Largest sections to inspect first');
  lines.push('');
  lines.push(mdTable(['Section', 'Component', 'Bytes', 'Words', 'Shared', 'Source'], pageMetric.largestSections.map((s) => [s.label || s.id, s.component, formatBytes(s.bytes), s.words, s.shared ? 'yes' : 'no', s.source])));
  lines.push('');
  lines.push('## Editable source files');
  lines.push('');
  const sources = [
    ...(indexPage?.sources || []),
    `src/pages/${pageMetric.slug}/page.json`,
    `src/pages/${pageMetric.slug}/sections/`,
  ];
  for (const source of [...new Set(sources)].slice(0, 30)) lines.push(`- ${source}`);
  lines.push('');
  lines.push('## Checks');
  lines.push('');
  for (const check of [...new Set([...(indexPage?.recommendedChecks || []), 'npm run check:site-builder', 'npm run ai:semantic-diff -- --page ' + pageMetric.page, 'npm run ai:check'])]) lines.push(`- ${check}`);
  lines.push('');
  lines.push('## AI notes');
  lines.push('');
  lines.push('- Для правки уникального блока открывай конкретный `sections/*.html`.');
  lines.push('- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.');
  lines.push('- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.');
  lines.push('');
  return lines.join('\n');
}

function renderComponentDigest(component, report, sharedByFile) {
  const lines = [];
  lines.push(`# Component Digest — ${component.id}`);
  lines.push('');
  lines.push(`- Name: ${component.name || component.id}`);
  lines.push(`- Appears in: ${component.appearsInCount || component.appearsIn?.length || 0} pages`);
  if (component.keywords?.length) lines.push(`- Keywords: ${component.keywords.join(', ')}`);
  if (component.cssSelectors?.length) lines.push(`- CSS selectors: ${component.cssSelectors.join(', ')}`);
  if (component.jsHooks?.length) lines.push(`- JS hooks: ${component.jsHooks.join(', ')}`);
  lines.push('');
  if (component.relatedFiles?.length) {
    lines.push('## Related files');
    lines.push('');
    for (const file of component.relatedFiles) lines.push(`- ${file}`);
    lines.push('');
  }
  const shared = (report.sharedComponents || []).filter((row) => row.component === component.id || row.file.includes(`/${component.id}/`));
  if (shared.length) {
    lines.push('## Shared HTML components');
    lines.push('');
    lines.push(mdTable(['File', 'Refs', 'Pages', 'Saved'], shared.slice(0, 20).map((row) => [row.file, row.refs, row.pages.length, formatBytes(row.effectiveSavedBytes)])));
    lines.push('');
  }
  const localRow = (report.components || []).find((row) => row.component === component.id);
  if (localRow) {
    lines.push('## Source compression signal');
    lines.push('');
    lines.push(mdTable(['Total sections', 'Local', 'Shared refs', 'Shared %'], [[localRow.total, localRow.local, localRow.sharedRefs, `${(localRow.sharedRatio * 100).toFixed(0)}%`]]));
    lines.push('');
  }
  if (component.risks?.length) {
    lines.push('## Risks');
    lines.push('');
    for (const risk of component.risks) lines.push(`- ${risk}`);
    lines.push('');
  }
  if (component.safeEditingNotes?.length) {
    lines.push('## Safe editing notes');
    lines.push('');
    for (const note of component.safeEditingNotes) lines.push(`- ${note}`);
    lines.push('');
  }
  if (component.appearsIn?.length) {
    lines.push('## Representative pages');
    lines.push('');
    for (const page of component.appearsIn.slice(0, 20)) lines.push(`- ${page}`);
    if (component.appearsIn.length > 20) lines.push(`- … ещё ${component.appearsIn.length - 20}`);
    lines.push('');
  }
  return lines.join('\n');
}

function extractSectionPreview(pageMetric) {
  const pageModel = loadPageModelFromSlug(pageMetric.slug);
  const out = [];
  for (const section of (pageModel?.sections || []).slice(0, 120)) {
    const path = section.componentRef || (section.file ? `src/pages/${pageMetric.slug}/${section.file}` : null);
    let heading = section.label || section.id;
    if (path && fileExists(path)) {
      const html = readProjectFile(path);
      heading = firstTextFromHtml(html, 'h1') || firstTextFromHtml(html, 'h2') || firstTextFromHtml(html, 'h3') || heading;
    }
    out.push({
      id: section.id,
      component: section.component || 'unknown',
      label: heading,
      shared: Boolean(section.componentRef),
      source: path,
    });
  }
  return out;
}

function buildContentMap(report, index, componentMap) {
  const pages = {};
  for (const p of report.pages) {
    const indexPage = index.pages?.[p.page] || {};
    pages[p.page] = {
      branch: p.branch,
      role: p.role,
      title: indexPage.title || p.title,
      h1: p.h1 || indexPage.h1,
      digest: `${DIGEST_DIR}/pages/${safeName(p.page)}.md`,
      builderModel: `src/pages/${p.slug}/page.json`,
      sections: p.sectionCount,
      localSections: p.localSections,
      sharedRefs: p.sharedRefs,
      rawSections: p.rawSections,
      componentMix: p.byComponent,
      largestSectionSources: p.largestSections.map((s) => s.source).filter(Boolean),
      sectionPreview: extractSectionPreview(p),
      checks: [...new Set([...(indexPage.recommendedChecks || []), 'npm run check:site-builder'])],
    };
  }
  const components = {};
  for (const component of Object.values(componentMap.components || {}).sort((a, b) => a.id.localeCompare(b.id))) {
    const row = report.components.find((item) => item.component === component.id);
    components[component.id] = {
      name: component.name,
      digest: `${DIGEST_DIR}/components/${safeName(component.id)}.md`,
      appearsInCount: component.appearsInCount || component.appearsIn?.length || 0,
      relatedFiles: component.relatedFiles || [],
      cssSelectors: component.cssSelectors || [],
      jsHooks: component.jsHooks || [],
      sourceCompression: row ? {
        total: row.total,
        local: row.local,
        sharedRefs: row.sharedRefs,
        sharedRatio: row.sharedRatio,
      } : null,
    };
  }
  return {
    schemaVersion: 1,
    generatedAt: '1970-01-01T00:00:00.000Z',
    note: 'AI-readable digest index. Regenerate with npm run ai:digest after structure/content changes.',
    entrypoints: {
      projectDigest: `${DIGEST_DIR}/project.md`,
      sourceComplexity: 'reports/source-complexity.md',
      aiContext: 'AI-CONTEXT.md',
      flexibleEditing: 'docs/AI_FLEXIBLE_EDITING.md',
    },
    summary: report.summary,
    pages,
    components,
    compressionOpportunities: report.compressionOpportunities,
  };
}

function generateDigestFiles() {
  const { aiIndex, componentMap } = loadProjectMaps();
  const report = analyzeSourceComplexity();
  const files = new Map();

  files.set(`${DIGEST_DIR}/project.md`, renderProjectDigest(report, aiIndex, componentMap));

  for (const pageMetric of report.pages) {
    files.set(`${DIGEST_DIR}/pages/${safeName(pageMetric.page)}.md`, renderPageDigest(pageMetric, aiIndex.pages?.[pageMetric.page] || null));
  }

  const sharedByFile = componentRefPages(report);
  for (const component of Object.values(componentMap.components || {}).sort((a, b) => a.id.localeCompare(b.id))) {
    files.set(`${DIGEST_DIR}/components/${safeName(component.id)}.md`, renderComponentDigest(component, report, sharedByFile));
  }

  files.set(`${DIGEST_DIR}/content-map.json`, `${JSON.stringify(buildContentMap(report, aiIndex, componentMap), null, 2)}\n`);
  return files;
}

function checkDigest(files) {
  let ok = true;
  for (const [file, expected] of files) {
    let actual = null;
    try { actual = readFileSync(join(ROOT_DIR, file), 'utf8'); } catch {}
    if (actual !== expected) {
      console.error(`❌ ${file} устарел. Запусти npm run ai:digest.`);
      ok = false;
    }
  }
  const expectedSet = new Set(files.keys());
  for (const file of walkFiles(DIGEST_DIR)) {
    if (!expectedSet.has(file)) {
      console.error(`❌ Лишний digest-файл: ${file}. Запусти npm run ai:digest.`);
      ok = false;
    }
  }
  if (!ok) process.exit(1);
  console.log(`✅ AI digest актуален (${files.size} файлов)`);
}

const files = generateDigestFiles();
if (args.check) {
  checkDigest(files);
  process.exit(0);
}

if (existsSync(join(ROOT_DIR, DIGEST_DIR))) rmSync(join(ROOT_DIR, DIGEST_DIR), { recursive: true, force: true });
ensureDir(`${DIGEST_DIR}/pages`);
ensureDir(`${DIGEST_DIR}/components`);
for (const [file, content] of files) writeProjectFile(file, content);
console.log(`✅ AI digest записан: ${DIGEST_DIR}`);
console.log(`Files: ${files.size}`);
console.log(`Pages: ${Object.keys(JSON.parse(files.get(`${DIGEST_DIR}/content-map.json`)).pages).length}; components: ${Object.keys(JSON.parse(files.get(`${DIGEST_DIR}/content-map.json`)).components).length}`);
