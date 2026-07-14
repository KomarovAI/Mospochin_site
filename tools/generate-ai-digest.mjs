#!/usr/bin/env node
import { existsSync, rmSync, readFileSync } from 'fs';
import { join } from 'path';
import { parseArgs, ROOT_DIR } from './ai-maintenance-lib.mjs';
import {
  DIGEST_DIR,
  analyzeSourceComplexity,
  ensureDir,
  fileExists,
  formatBytes,
  loadProjectMaps,
  readJson,
  walkFiles,
  writeProjectFile,
} from './source-compression-lib.mjs';

const args = parseArgs();
const PAROKONVEKTOMAT_CLUSTER_MANIFEST = 'data/parokonvektomat-conversion-pages.json';
const CLUSTER_REGISTRY = 'data/cluster-registry.json';

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


function loadParokonvektomatCluster() {
  if (!fileExists(PAROKONVEKTOMAT_CLUSTER_MANIFEST)) return null;
  try {
    return readJson(PAROKONVEKTOMAT_CLUSTER_MANIFEST);
  } catch {
    return null;
  }
}

function loadClusterRegistry() {
  if (!fileExists(CLUSTER_REGISTRY)) return { clusters: {} };
  try {
    return readJson(CLUSTER_REGISTRY);
  } catch {
    return { clusters: {} };
  }
}

function loadClusterManifest(config) {
  if (!config?.manifest || !fileExists(config.manifest)) return null;
  try {
    return readJson(config.manifest);
  } catch {
    return null;
  }
}

function renderGenericClusterDigest(name, config, manifest, index) {
  const pages = Array.isArray(manifest?.pages) ? manifest.pages : [];
  const lines = [];
  lines.push(`# Cluster Digest — ${name}`);
  lines.push('');
  lines.push(`Машинная сводка кластера для AI-правок. Registry: \`data/cluster-registry.json\`. Контракт страниц: \`${config.manifest}\`.`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(mdTable(['Metric', 'Value'], [
    ['Cluster', name],
    ['Pages', pages.length],
    ['Guide', config.guide || '—'],
    ['Screenshot manifest', config.screenshotManifest || '—'],
    ['Guard commands', (config.guardCommands || []).join(', ') || '—'],
  ]));
  lines.push('');
  lines.push('## Pages');
  lines.push('');
  lines.push(mdTable(['Page', 'Intent/type', 'Branch', 'Digest'], pages.map((page) => [
    page.page,
    page.intent || page.pageType || '—',
    page.branch || '—',
    index.pages?.[page.page] ? `.ai/digest/pages/${safeName(page.page)}.md` : '—',
  ])));
  lines.push('');
  lines.push('## AI editing rules');
  lines.push('');
  lines.push('- Определяй роль и поисковый интент страницы до добавления нового текста или URL.');
  lines.push('- Новые страницы должны быть представлены в cluster registry/manifest и иметь релевантную перелинковку.');
  lines.push('- Не дублируй общий технический текст между symptom/error/brand/service страницами.');
  lines.push('- После source-правок обнови production output и generated AI layer.');
  lines.push('');
  lines.push('## Mandatory checks');
  lines.push('');
  lines.push('```bash');
  for (const command of config.guardCommands || []) lines.push(command);
  lines.push('npm run check:core');
  lines.push('npm run check:ai');
  lines.push('```');
  lines.push('');
  return lines.join('\n');
}

function renderParokonvektomatClusterDigest(cluster, index) {
  const pages = Array.isArray(cluster?.pages) ? cluster.pages : [];
  const byIntent = new Map();
  for (const page of pages) {
    const key = page.intent || 'other';
    if (!byIntent.has(key)) byIntent.set(key, []);
    byIntent.get(key).push(page.page);
  }

  const lines = [];
  lines.push('# Cluster Digest — parokonvektomaty');
  lines.push('');
  lines.push('Машинная сводка для AI-редактирования пароконвектоматного кластера. Полные правила: `docs/PAROKONVEKTOMAT_CLUSTER_AI_GUIDE.md`. Контракт проверок: `data/parokonvektomat-conversion-pages.json`.');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(mdTable(['Metric', 'Value'], [
    ['Cluster', cluster?.cluster || 'parokonvektomaty'],
    ['Pages', pages.length],
    ['Canonical base', cluster?.canonicalBase || 'https://mospochin.ru/'],
    ['Default min forms', cluster?.defaults?.minForms ?? '—'],
    ['Default min cluster links', cluster?.defaults?.minClusterLinks ?? '—'],
    ['Requires mobile CTA containers', cluster?.defaults?.requireMobileContactContainers ? 'yes' : 'no'],
  ]));
  lines.push('');
  lines.push('## Pages');
  lines.push('');
  lines.push(mdTable(['Page', 'Intent', 'Indexable', 'Branch', 'Digest'], pages.map((page) => {
    const digest = index.pages?.[page.page] ? `.ai/digest/pages/${safeName(page.page)}.md` : '—';
    return [page.page, page.intent || '—', page.indexable ? 'index' : 'noindex', page.branch || '—', digest];
  })));
  lines.push('');
  lines.push('## Intent groups');
  lines.push('');
  for (const [intent, groupPages] of [...byIntent.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`- **${intent}**: ${groupPages.join(', ')}`);
  }
  lines.push('');
  lines.push('## AI editing rules');
  lines.push('');
  lines.push('- Do not create P1/P2 parokonvektomat pages without traffic/conversion data.');
  lines.push('- Do not edit direct landing root HTML without syncing `data/direct-landing-pages.json` / generator output.');
  lines.push('- Keep promo/noindex pages out of sitemap unless strategy changes.');
  lines.push('- Keep forms, phone, WhatsApp, mobile CTA containers, analytics and Telegram form script intact.');
  lines.push('- Keep internal links relevant: no self-link, no 404, no blind all-to-all spam.');
  lines.push('- For old brand pages marked `neutral`, do not change branch to restaurant until registry/slots migration is done.');
  lines.push('');
  lines.push('## Mandatory checks');
  lines.push('');
  lines.push('```bash');
  lines.push('npm run check:conversion-ui');
  lines.push('npm run verify:fast');
  lines.push('npm run ai:doctor');
  lines.push('```');
  lines.push('');
  return lines.join('\n');
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
    ['AI entrypoint', 'docs/AI_START_HERE.md'],
    ['Doc index', 'docs/DOC_INDEX.md'],
    ['Project map', 'data/project-map.generated.json'],
    ['AI operating guide', 'docs/AI_PROJECT_OPERATING_GUIDE.md'],
    ['AI editing manifest', 'data/ai-editing-manifest.json'],
    ['Пароконвектоматы AI guide', 'docs/PAROKONVEKTOMAT_CLUSTER_AI_GUIDE.md'],
    ['Владение файлами', 'data/file-ownership.json'],
    ['Гибкое редактирование', 'docs/AI_FLEXIBLE_EDITING.md'],
    ['Builder', 'docs/STATIC_COMPONENT_BUILDER.md'],
    ['Shared components', 'docs/DECLARATIVE_COMPONENTS.md'],
    ['Scale/source decisions', 'docs/PROJECT_DECISIONS.md'],
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
    schemaVersion: 2,
    generatedAt: '1970-01-01T00:00:00.000Z',
    note: 'Compact AI-readable digest index. Detailed section order and headings live in page digest files. Regenerate with npm run ai:digest after structure/content changes.',
    entrypoints: {
      projectDigest: `${DIGEST_DIR}/project.md`,
      sourceComplexity: 'reports/source-complexity.md',
      aiStartHere: 'docs/AI_START_HERE.md',
      docIndex: 'docs/DOC_INDEX.md',
      projectMap: 'data/project-map.generated.json',
      fileOwnership: 'data/file-ownership.json',
      aiContextCompatibility: 'AI-CONTEXT.md',
      aiOperatingGuide: 'docs/AI_PROJECT_OPERATING_GUIDE.md',
      aiEditingManifest: 'data/ai-editing-manifest.json',
      clusterRegistry: CLUSTER_REGISTRY,
      parokonvektomatClusterGuide: 'docs/PAROKONVEKTOMAT_CLUSTER_AI_GUIDE.md',
      flexibleEditing: 'docs/AI_FLEXIBLE_EDITING.md',
    },
    summary: report.summary,
    pages,
    components,
    clusters: (() => {
      const registry = loadClusterRegistry();
      return Object.fromEntries(Object.entries(registry.clusters || {}).map(([name, config]) => {
        const manifest = loadClusterManifest(config);
        return [name, {
          guide: config.guide || null,
          manifest: config.manifest,
          digest: config.digest || `${DIGEST_DIR}/clusters/${safeName(name)}.md`,
          screenshotManifest: config.screenshotManifest || null,
          guardCommands: config.guardCommands || [],
          pages: (manifest?.pages || []).map((page) => page.page).filter(Boolean),
        }];
      }));
    })(),
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

  const registry = loadClusterRegistry();
  for (const [name, config] of Object.entries(registry.clusters || {})) {
    const manifest = loadClusterManifest(config);
    if (!manifest) continue;
    const digestPath = config.digest || `${DIGEST_DIR}/clusters/${safeName(name)}.md`;
    const content = name === 'parokonvektomaty'
      ? renderParokonvektomatClusterDigest(manifest, aiIndex)
      : renderGenericClusterDigest(name, config, manifest, aiIndex);
    files.set(digestPath, content);
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
ensureDir(`${DIGEST_DIR}/clusters`);
for (const [file, content] of files) writeProjectFile(file, content);
console.log(`✅ AI digest записан: ${DIGEST_DIR}`);
console.log(`Files: ${files.size}`);
console.log(`Pages: ${Object.keys(JSON.parse(files.get(`${DIGEST_DIR}/content-map.json`)).pages).length}; components: ${Object.keys(JSON.parse(files.get(`${DIGEST_DIR}/content-map.json`)).components).length}`);
