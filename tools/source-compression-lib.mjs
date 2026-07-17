import { createHash } from 'crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { ROOT_DIR } from './ai-maintenance-lib.mjs';

export const SOURCE_COMPLEXITY_JSON = 'reports/source-complexity.json';
export const SOURCE_COMPLEXITY_MD = 'reports/source-complexity.md';
export const DIGEST_DIR = '.ai/digest';

export function toPosix(value) {
  return String(value).replace(/\\/g, '/');
}

export function readProjectFile(path) {
  return readFileSync(join(ROOT_DIR, path), 'utf8');
}

export function readJson(path) {
  return JSON.parse(readProjectFile(path));
}

export function writeProjectFile(path, content) {
  const abs = join(ROOT_DIR, path);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content);
}

export function ensureDir(path) {
  mkdirSync(join(ROOT_DIR, path), { recursive: true });
}

export function fileExists(path) {
  return existsSync(join(ROOT_DIR, path));
}

export function fileSize(path) {
  return statSync(join(ROOT_DIR, path)).size;
}

export function stableGeneratedAt() {
  return new Date(0).toISOString();
}

export function hashContent(content) {
  return createHash('sha256').update(content).digest('hex');
}

export function stripTags(value = '') {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function wordCount(text) {
  const normalized = String(text || '').trim();
  if (!normalized) return 0;
  return normalized.split(/\s+/).filter(Boolean).length;
}

export function walkFiles(root, options = {}) {
  const start = join(ROOT_DIR, root);
  if (!existsSync(start)) return [];
  const out = [];
  const skipDirs = new Set(options.skipDirs || []);
  const visit = (abs) => {
    const rel = toPosix(relative(ROOT_DIR, abs));
    const stat = statSync(abs);
    if (stat.isDirectory()) {
      if (skipDirs.has(rel) || skipDirs.has(rel.split('/').pop())) return;
      for (const name of readdirSync(abs).sort((a, b) => a.localeCompare(b))) visit(join(abs, name));
      return;
    }
    if (options.ext && !options.ext.some((ext) => rel.endsWith(ext))) return;
    out.push(rel);
  };
  visit(start);
  return out;
}

function getPathValue(object, path) {
  return String(path).split('.').reduce((acc, key) => (acc && Object.prototype.hasOwnProperty.call(acc, key) ? acc[key] : undefined), object);
}

function renderParametricTemplate(template, props = {}) {
  return String(template).replace(/\{\{\{?\s*([a-zA-Z0-9_.-]+)\s*\}?\}\}/g, (match, path) => {
    const value = getPathValue(props, path);
    if (value == null) return '';
    return String(value);
  });
}

function sectionContent(pageSlug, section) {
  if (section.componentMode === 'parametric' || section.templateRef) {
    if (!section.templateRef || !fileExists(section.templateRef)) return '';
    const props = section.propsRef && fileExists(section.propsRef) ? readJson(section.propsRef) : (section.props || {});
    return renderParametricTemplate(readProjectFile(section.templateRef), props);
  }
  if (section.componentRef) {
    return fileExists(section.componentRef) ? readProjectFile(section.componentRef) : '';
  }
  if (section.file) {
    const path = `src/pages/${pageSlug}/${section.file}`;
    return fileExists(path) ? readProjectFile(path) : '';
  }
  return '';
}

function sectionSourcePath(pageSlug, section) {
  if (section.componentMode === 'parametric' || section.templateRef) return section.templateRef || section.propsRef || null;
  if (section.componentRef) return section.componentRef;
  if (section.file) return `src/pages/${pageSlug}/${section.file}`;
  return null;
}

function sectionSourcePaths(pageSlug, section) {
  const paths = [];
  if (section.componentMode === 'parametric' || section.templateRef) {
    if (section.templateRef) paths.push(section.templateRef);
    if (section.propsRef) paths.push(section.propsRef);
    return paths;
  }
  const single = sectionSourcePath(pageSlug, section);
  return single ? [single] : [];
}

export function loadProjectMaps() {
  const aiIndex = fileExists('data/ai-project-index.json') ? readJson('data/ai-project-index.json') : { pages: {}, summary: {} };
  const siteBuilder = fileExists('src/site-builder.json') ? readJson('src/site-builder.json') : { pages: [] };
  const componentMap = fileExists('data/ai-component-map.json') ? readJson('data/ai-component-map.json') : { components: {} };
  return { aiIndex, siteBuilder, componentMap };
}

export function loadPageModelFromSlug(slug) {
  const modelPath = `src/pages/${slug}/page.json`;
  if (!fileExists(modelPath)) return null;
  return readJson(modelPath);
}

export function collectPageSectionMetrics(pageEntry) {
  const slug = pageEntry.slug;
  const model = loadPageModelFromSlug(slug);
  if (!model) return null;
  const sections = model.sections || [];
  const byComponent = {};
  const largestSections = [];
  let sharedRefs = 0;
  let parametricRefs = 0;
  let localSections = 0;
  let rawSections = 0;
  let localBytes = 0;
  let sharedBytesReferenced = 0;
  let textWords = 0;
  const sourceFiles = new Set([`src/pages/${slug}/page.json`, `src/pages/${slug}/head.html`, `src/pages/${slug}/body-open.html`, `src/pages/${slug}/after-body.html`]);
  const missing = [];

  for (const section of sections) {
    const component = section.component || 'unknown';
    byComponent[component] = (byComponent[component] || 0) + 1;
    const path = sectionSourcePath(slug, section);
    const declaredSources = sectionSourcePaths(slug, section);
    for (const sourcePath of declaredSources) {
      sourceFiles.add(sourcePath);
      if (!fileExists(sourcePath)) missing.push(sourcePath);
    }
    const content = sectionContent(slug, section);
    const bytes = Buffer.byteLength(content || '', 'utf8') || section.bytes || 0;
    const words = wordCount(stripTags(content));
    textWords += words;
    if (section.componentMode === 'parametric' || section.templateRef) {
      parametricRefs += 1;
      sharedBytesReferenced += bytes;
    } else if (section.componentRef) {
      sharedRefs += 1;
      sharedBytesReferenced += bytes;
    } else {
      localSections += 1;
      localBytes += bytes;
    }
    if (component === 'raw') rawSections += 1;
    largestSections.push({
      id: section.id,
      component,
      label: section.label || '—',
      bytes,
      words,
      source: path,
      shared: Boolean(section.componentRef),
      parametric: Boolean(section.componentMode === 'parametric' || section.templateRef),
    });
  }

  largestSections.sort((a, b) => b.bytes - a.bytes || a.id.localeCompare(b.id));
  return {
    page: pageEntry.page,
    slug,
    branch: model.branch || 'unknown',
    role: model.role || 'unknown',
    title: model.title || null,
    h1: model.h1 || null,
    sectionCount: sections.length,
    localSections,
    sharedRefs,
    parametricRefs,
    rawSections,
    localBytes,
    sharedBytesReferenced,
    totalReferencedBytes: localBytes + sharedBytesReferenced,
    textWords,
    sourceFiles: [...sourceFiles].sort((a, b) => a.localeCompare(b)),
    sourceFileCount: sourceFiles.size,
    byComponent: Object.fromEntries(Object.entries(byComponent).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))),
    largestSections: largestSections.slice(0, 8),
    missing,
  };
}

function sum(items, pick) {
  return items.reduce((acc, item) => acc + Number(pick(item) || 0), 0);
}

function top(items, n, pick) {
  return [...items].sort((a, b) => Number(pick(b) || 0) - Number(pick(a) || 0) || String(a.page || a.file || '').localeCompare(String(b.page || b.file || ''))).slice(0, n);
}

export function analyzeSourceComplexity() {
  const { aiIndex, siteBuilder, componentMap } = loadProjectMaps();
  const pageEntries = (siteBuilder.pages || []).slice().sort((a, b) => a.page.localeCompare(b.page));
  const pages = pageEntries.map(collectPageSectionMetrics).filter(Boolean);

  const srcPageFiles = walkFiles('src/pages');
  const srcPageHtmlFiles = srcPageFiles.filter((file) => file.endsWith('.html'));
  const sharedFiles = walkFiles('src/components/shared', { ext: ['.html'] });
  const parametricTemplateFiles = walkFiles('src/components/parametric', { ext: ['.html'] });
  const parametricPropsFiles = walkFiles('content/components', { ext: ['.json'] });
  const rootHtmlPages = Object.keys(aiIndex.pages || {}).filter((file) => file.endsWith('.html')).sort((a, b) => a.localeCompare(b));

  const sharedUsage = new Map();
  const componentDistribution = {};
  const localByComponent = {};
  const sharedRefsByComponent = {};
  const parametricRefsByComponent = {};
  const rawByPage = [];
  const allMissing = [];

  for (const page of pages) {
    for (const [component, count] of Object.entries(page.byComponent)) {
      componentDistribution[component] = (componentDistribution[component] || 0) + count;
    }
    for (const section of loadPageModelFromSlug(page.slug)?.sections || []) {
      const component = section.component || 'unknown';
      if (section.componentMode === 'parametric' || section.templateRef) {
        parametricRefsByComponent[component] = (parametricRefsByComponent[component] || 0) + 1;
      } else if (section.componentRef) {
        sharedRefsByComponent[component] = (sharedRefsByComponent[component] || 0) + 1;
        const current = sharedUsage.get(section.componentRef) || { file: section.componentRef, component, refs: 0, pages: new Set(), bytes: 0 };
        current.refs += 1;
        current.pages.add(page.page);
        current.bytes = current.bytes || (fileExists(section.componentRef) ? fileSize(section.componentRef) : 0);
        sharedUsage.set(section.componentRef, current);
      } else {
        localByComponent[component] = (localByComponent[component] || 0) + 1;
      }
    }
    if (page.rawSections) rawByPage.push({ page: page.page, rawSections: page.rawSections, sectionCount: page.sectionCount });
    for (const missing of page.missing) allMissing.push({ page: page.page, file: missing });
  }

  const sharedUsageRows = [...sharedUsage.values()].map((item) => ({
    file: item.file,
    component: item.component,
    refs: item.refs,
    pages: [...item.pages].sort((a, b) => a.localeCompare(b)),
    bytes: item.bytes,
    effectiveSavedBytes: Math.max(0, item.refs - 1) * item.bytes,
  })).sort((a, b) => b.effectiveSavedBytes - a.effectiveSavedBytes || a.file.localeCompare(b.file));

  const componentRows = [...new Set([...Object.keys(componentDistribution), ...Object.keys(localByComponent), ...Object.keys(sharedRefsByComponent), ...Object.keys(parametricRefsByComponent)])]
    .sort((a, b) => a.localeCompare(b))
    .map((component) => ({
      component,
      total: componentDistribution[component] || 0,
      local: localByComponent[component] || 0,
      sharedRefs: sharedRefsByComponent[component] || 0,
      parametricRefs: parametricRefsByComponent[component] || 0,
      compressedRefs: (sharedRefsByComponent[component] || 0) + (parametricRefsByComponent[component] || 0),
      sharedRatio: (componentDistribution[component] || 0) ? ((sharedRefsByComponent[component] || 0) + (parametricRefsByComponent[component] || 0)) / componentDistribution[component] : 0,
    }))
    .sort((a, b) => b.total - a.total || a.component.localeCompare(b.component));

  const localHtmlBytes = sum(srcPageHtmlFiles, fileSize);
  const sharedHtmlBytes = sum(sharedFiles, fileSize);
  const htmlRootBytes = sum(rootHtmlPages, fileSize);
  const totalSections = sum(pages, (p) => p.sectionCount);
  const totalLocalSections = sum(pages, (p) => p.localSections);
  const totalSharedRefs = sum(pages, (p) => p.sharedRefs);
  const totalParametricRefs = sum(pages, (p) => p.parametricRefs);

  const compressionOpportunities = [];
  for (const row of componentRows) {
    if (row.local >= 20 && row.sharedRatio < 0.35) {
      compressionOpportunities.push({
        type: 'componentize-local-sections',
        priority: row.local >= 80 ? 'high' : 'medium',
        component: row.component,
        message: `${row.component}: ${row.local} локальных секций, shared ratio ${(row.sharedRatio * 100).toFixed(0)}% — кандидат на параметризованный компонент + props.`,
      });
    }
  }
  for (const page of top(pages, 10, (p) => p.sectionCount)) {
    if (page.sectionCount >= 70) {
      compressionOpportunities.push({
        type: 'page-blueprint',
        priority: 'high',
        page: page.page,
        message: `${page.page}: ${page.sectionCount} секций — кандидат на page blueprint вместо длинного списка sections.`,
      });
    }
  }
  for (const row of top(rawByPage, 10, (p) => p.rawSections)) {
    if (row.rawSections >= 10) {
      compressionOpportunities.push({
        type: 'raw-section-reduction',
        priority: row.rawSections >= 20 ? 'high' : 'medium',
        page: row.page,
        message: `${row.page}: ${row.rawSections} raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.`,
      });
    }
  }

  return {
    schemaVersion: 1,
    generatedAt: stableGeneratedAt(),
    summary: {
      rootHtmlPages: rootHtmlPages.length,
      builderPages: pages.length,
      srcPageFiles: srcPageFiles.length,
      srcPageHtmlFiles: srcPageHtmlFiles.length,
      sharedComponentFiles: sharedFiles.length,
      parametricTemplateFiles: parametricTemplateFiles.length,
      parametricPropsFiles: parametricPropsFiles.length,
      totalSections,
      localSections: totalLocalSections,
      sharedSectionRefs: totalSharedRefs,
      parametricSectionRefs: totalParametricRefs,
      compressedSectionRefs: totalSharedRefs + totalParametricRefs,
      sharedCoverageRatio: totalSections ? (totalSharedRefs + totalParametricRefs) / totalSections : 0,
      rootHtmlBytes: htmlRootBytes,
      srcPageHtmlBytes: localHtmlBytes,
      sharedHtmlBytes,
      averageSectionsPerPage: pages.length ? totalSections / pages.length : 0,
      averageSourceFilesPerPage: pages.length ? sum(pages, (p) => p.sourceFileCount) / pages.length : 0,
      estimatedSharedSavedBytes: sum(sharedUsageRows, (row) => row.effectiveSavedBytes),
      componentMapComponents: Object.keys(componentMap.components || {}).length,
    },
    pages,
    components: componentRows,
    sharedComponents: sharedUsageRows,
    topPages: {
      bySections: top(pages, 12, (p) => p.sectionCount).map((p) => ({ page: p.page, sections: p.sectionCount, localSections: p.localSections, sharedRefs: p.sharedRefs })),
      byLocalBytes: top(pages, 12, (p) => p.localBytes).map((p) => ({ page: p.page, localBytes: p.localBytes, sections: p.sectionCount })),
      byRawSections: top(rawByPage, 12, (p) => p.rawSections),
      bySourceFiles: top(pages, 12, (p) => p.sourceFileCount).map((p) => ({ page: p.page, sourceFiles: p.sourceFileCount, sections: p.sectionCount })),
    },
    compressionOpportunities: compressionOpportunities.slice(0, 40),
    missingFiles: allMissing,
  };
}

export function formatBytes(bytes) {
  const n = Number(bytes || 0);
  if (n >= 1024 * 1024) return `${(n / 1024 / 1024).toFixed(2)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${n} B`;
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

export function renderSourceComplexityMarkdown(report) {
  const s = report.summary;
  const lines = [];
  lines.push('# Source Complexity Report');
  lines.push('');
  lines.push('Детерминированный отчёт для сжатия исходного смысла проекта. Он не оценивает визуал, а показывает, где AI тратит больше всего контекста.');
  lines.push('');
  lines.push('## Сводка');
  lines.push('');
  lines.push(mdTable(['Метрика', 'Значение'], [
    ['Root HTML pages', s.rootHtmlPages],
    ['Builder pages', s.builderPages],
    ['src/pages files', s.srcPageFiles],
    ['src/pages HTML section files', s.srcPageHtmlFiles],
    ['Shared component files', s.sharedComponentFiles],
    ['Parametric template files', s.parametricTemplateFiles || 0],
    ['Parametric props files', s.parametricPropsFiles || 0],
    ['Total declared sections', s.totalSections],
    ['Local sections', s.localSections],
    ['Shared section refs', s.sharedSectionRefs],
    ['Parametric section refs', s.parametricSectionRefs || 0],
    ['Compressed refs', s.compressedSectionRefs || s.sharedSectionRefs],
    ['Shared/parametric coverage', `${(s.sharedCoverageRatio * 100).toFixed(1)}%`],
    ['Average sections/page', s.averageSectionsPerPage.toFixed(1)],
    ['Average source files/page', s.averageSourceFilesPerPage.toFixed(1)],
    ['Root HTML bytes', formatBytes(s.rootHtmlBytes)],
    ['src/pages HTML bytes', formatBytes(s.srcPageHtmlBytes)],
    ['Shared HTML bytes', formatBytes(s.sharedHtmlBytes)],
    ['Estimated duplicate bytes removed by shared components', formatBytes(s.estimatedSharedSavedBytes)],
  ]));
  lines.push('');
  lines.push('## Самые сложные страницы по количеству секций');
  lines.push('');
  lines.push(mdTable(['Page', 'Sections', 'Local', 'Shared refs'], report.topPages.bySections.map((p) => [p.page, p.sections, p.localSections, p.sharedRefs])));
  lines.push('');
  lines.push('## Самые тяжёлые страницы по локальному source HTML');
  lines.push('');
  lines.push(mdTable(['Page', 'Local source', 'Sections'], report.topPages.byLocalBytes.map((p) => [p.page, formatBytes(p.localBytes), p.sections])));
  lines.push('');
  lines.push('## Компоненты по количеству секций');
  lines.push('');
  lines.push(mdTable(['Component', 'Total', 'Local', 'Shared refs', 'Parametric refs', 'Compressed %'], report.components.slice(0, 20).map((c) => [c.component, c.total, c.local, c.sharedRefs, c.parametricRefs || 0, `${(c.sharedRatio * 100).toFixed(0)}%`])));
  lines.push('');
  lines.push('## Главные shared components по экономии');
  lines.push('');
  lines.push(mdTable(['Component file', 'Refs', 'Pages', 'Saved'], report.sharedComponents.slice(0, 12).map((c) => [c.file, c.refs, c.pages.length, formatBytes(c.effectiveSavedBytes)])));
  lines.push('');
  lines.push('## Возможности для следующего сжатия смысла');
  lines.push('');
  if (report.compressionOpportunities.length) {
    for (const item of report.compressionOpportunities.slice(0, 20)) {
      lines.push(`- **${item.priority}** / ${item.type}: ${item.message}`);
    }
  } else {
    lines.push('- Явных крупных возможностей не найдено.');
  }
  lines.push('');
  lines.push('## Как читать этот отчёт');
  lines.push('');
  lines.push('- Много `local` секций у компонента = кандидат на параметризованный компонент.');
  lines.push('- Много секций на странице = кандидат на page blueprint.');
  lines.push('- Много `raw` секций = AI хуже понимает смысл блока; стоит переклассифицировать или объединить.');
  lines.push('- Shared coverage — не цель сама по себе: важнее отделить смысловые props от HTML-разметки.');
  lines.push('');
  return lines.join('\n');
}

export function writeSourceComplexityReport(report) {
  writeProjectFile(SOURCE_COMPLEXITY_JSON, `${JSON.stringify(report, null, 2)}\n`);
  writeProjectFile(SOURCE_COMPLEXITY_MD, renderSourceComplexityMarkdown(report));
}
