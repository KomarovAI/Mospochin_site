import { createHash } from 'crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { ROOT_DIR as PROJECT_ROOT_DIR } from './ai-maintenance-lib.mjs';
import { injectStaticShell } from './static-shell-lib.mjs';
export const ROOT_DIR = PROJECT_ROOT_DIR;

export const SITE_BUILDER_MANIFEST = 'src/site-builder.json';
export const SHARED_COMPONENTS_DIR = 'src/components/shared';
export const DEFAULT_FALLBACK_PAGES = [
  'index.html',
  'holodilniki.html',
  'stiralnye-mashiny.html',
  'posudomoyki.html',
  'parokonvektomaty.html',
];

export function defaultBuilderPages() {
  try {
    const aiIndex = readJsonFile('data/ai-project-index.json');
    const pages = Object.keys(aiIndex?.pages || {}).filter((page) => page.endsWith('.html')).sort();
    if (pages.length) return pages;
  } catch {}
  return DEFAULT_FALLBACK_PAGES;
}

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

export function toPosix(path) {
  return String(path).replace(/\\/g, '/');
}

export function readProjectFile(path) {
  return readFileSync(join(ROOT_DIR, path), 'utf8');
}

export function writeProjectFile(path, content) {
  const abs = join(ROOT_DIR, path);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content);
}

export function readJsonFile(path) {
  return JSON.parse(readProjectFile(path));
}

export function hashContent(content) {
  return createHash('sha256').update(content).digest('hex');
}

export function stableGeneratedAt() {
  return new Date(0).toISOString();
}

export function slugFromPage(page) {
  if (page === 'index.html') return 'index';
  return page.replace(/\.html$/i, '').replace(/[^a-zA-Z0-9_-]+/g, '-');
}

export function findPageInfo(page) {
  let aiIndex = null;
  try { aiIndex = readJsonFile('data/ai-project-index.json'); } catch {}
  const entry = aiIndex?.pages?.[page] || null;
  return {
    branch: entry?.branch || 'unknown',
    role: entry?.role || 'unknown',
    title: entry?.title || null,
    h1: entry?.h1 || null,
    recommendedChecks: entry?.recommendedChecks || ['npm run validate:site'],
  };
}

function findHeadBoundary(html) {
  const match = html.match(/<body\b[^>]*>/i);
  if (!match || match.index == null) throw new Error('Не найден <body>');
  return { beforeBody: html.slice(0, match.index), bodyOpen: match[0], bodyStart: match.index + match[0].length };
}

function findBodyClose(html) {
  const close = html.match(/<\/body>/i);
  if (!close || close.index == null) throw new Error('Не найден </body>');
  return close.index;
}

function parseTagName(rawTag) {
  const match = rawTag.match(/^<\/?\s*([a-zA-Z0-9:-]+)/);
  return match ? match[1].toLowerCase() : null;
}

function isSelfClosingTag(rawTag, tagName) {
  return VOID_TAGS.has(tagName) || /\/\s*>$/.test(rawTag);
}

function tagEndIndex(content, start) {
  let quote = null;
  for (let i = start + 1; i < content.length; i += 1) {
    const ch = content[i];
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === '>') return i + 1;
  }
  return content.length;
}

function skipRawElement(content, start, tagName) {
  const closePattern = new RegExp(`</${tagName}\\s*>`, 'ig');
  closePattern.lastIndex = start;
  const match = closePattern.exec(content);
  return match ? closePattern.lastIndex : content.length;
}

function classifySection(html, index) {
  const lower = html.toLowerCase();
  if (/<header\b/i.test(html)) return 'hero';
  if (/breadcrumb|aria-label="breadcrumb"/i.test(html)) return 'breadcrumb';
  if (/telegram-form|data-slot="request-form"|<form\b/i.test(html)) return 'lead-form';
  if (/faq|<details\b/i.test(html)) return 'faq';
  if (/schema|application\/ld\+json/i.test(html)) return 'schema';
  if (/mobile-footer|fixed bottom-0|bottom-24|whatsapp-float|wa\.me/i.test(lower)) return 'mobile-contact';
  if (/footer-container/i.test(html)) return 'footer-anchor';
  if (/partials-injector/i.test(html)) return 'runtime-partials';
  if (/<noscript\b/i.test(html)) return 'noscript';
  if (/contact|contacts|href="tel:|data-contact-link/i.test(html)) return 'contact-cta';
  if (/price|стоимост|₽|руб/i.test(lower)) return 'pricing';
  if (/proof|гарант|довер|мастер|преимущ/i.test(lower)) return 'proof';
  if (/related|другие|похожие|категории/i.test(lower)) return 'related-links';
  if (/<section\b/i.test(html)) return 'section';
  if (/<nav\b/i.test(html)) return 'navigation';
  return index === 0 ? 'body-preamble' : 'raw';
}

function labelForSection(component, html, index) {
  const heading = html.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i)?.[1]
    ?.replace(/<[^>]+>/g, ' ')
    ?.replace(/\s+/g, ' ')
    ?.trim();
  if (heading) return heading.slice(0, 90);
  const known = {
    hero: 'Первый экран / hero',
    breadcrumb: 'Хлебные крошки',
    'lead-form': 'Форма заявки',
    faq: 'FAQ',
    'mobile-contact': 'Мобильные контактные элементы',
    'footer-anchor': 'Footer mount point',
    'runtime-partials': 'Подключение partials-injector',
    noscript: 'Noscript fallback',
    'contact-cta': 'Контактный CTA',
    pricing: 'Цены/стоимость',
    proof: 'Доказательства/гарантии',
    'related-links': 'Связанные страницы',
    navigation: 'Навигация',
    section: 'Секция страницы',
    raw: 'HTML-фрагмент',
  };
  return known[component] || `Секция ${index + 1}`;
}

function safeFileStem(text, fallback) {
  const translit = String(text || '')
    .toLowerCase()
    .replace(/[а-яё]/g, (ch) => ({
      а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
    }[ch] || ch))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 52);
  return translit || fallback;
}

export function splitHtmlPage(html) {
  const { beforeBody, bodyOpen, bodyStart } = findHeadBoundary(html);
  const bodyEnd = findBodyClose(html);
  const bodyContent = html.slice(bodyStart, bodyEnd);
  const afterBody = html.slice(bodyEnd);
  return { beforeBody, bodyOpen, bodyContent, afterBody };
}

export function splitTopLevelBody(bodyContent) {
  const chunks = [];
  const stack = [];
  let chunkStart = 0;
  let i = 0;

  function maybeCloseChunk(nextIndex) {
    if (stack.length === 0 && nextIndex > chunkStart) {
      chunks.push(bodyContent.slice(chunkStart, nextIndex));
      chunkStart = nextIndex;
    }
  }

  while (i < bodyContent.length) {
    if (bodyContent[i] !== '<') {
      i += 1;
      continue;
    }

    if (bodyContent.startsWith('<!--', i)) {
      const end = bodyContent.indexOf('-->', i + 4);
      i = end === -1 ? bodyContent.length : end + 3;
      if (stack.length === 0) maybeCloseChunk(i);
      continue;
    }

    if (bodyContent.startsWith('<!DOCTYPE', i) || bodyContent.startsWith('<![CDATA[', i)) {
      const end = tagEndIndex(bodyContent, i);
      i = end;
      if (stack.length === 0) maybeCloseChunk(i);
      continue;
    }

    const end = tagEndIndex(bodyContent, i);
    const rawTag = bodyContent.slice(i, end);
    const tagName = parseTagName(rawTag);
    if (!tagName) {
      i = end;
      continue;
    }

    const isClosing = /^<\//.test(rawTag);
    if (isClosing) {
      const lastIndex = stack.lastIndexOf(tagName);
      if (lastIndex !== -1) stack.splice(lastIndex, stack.length - lastIndex);
      i = end;
      maybeCloseChunk(i);
      continue;
    }

    if (tagName === 'script' || tagName === 'style') {
      if (!isSelfClosingTag(rawTag, tagName)) {
        i = skipRawElement(bodyContent, end, tagName);
        if (stack.length === 0) maybeCloseChunk(i);
        continue;
      }
    }

    if (!isSelfClosingTag(rawTag, tagName)) stack.push(tagName);
    i = end;
    if (stack.length === 0) maybeCloseChunk(i);
  }

  if (chunkStart < bodyContent.length) chunks.push(bodyContent.slice(chunkStart));
  return chunks.filter((chunk) => chunk.length > 0);
}

export function extractPageToModel(page) {
  const html = readProjectFile(page);
  const split = splitHtmlPage(html);
  const bodyChunks = splitTopLevelBody(split.bodyContent);
  const info = findPageInfo(page);
  const slug = slugFromPage(page);
  const baseDir = `src/pages/${slug}`;
  const sectionsDir = `${baseDir}/sections`;

  rmSync(join(ROOT_DIR, baseDir), { recursive: true, force: true });
  mkdirSync(join(ROOT_DIR, sectionsDir), { recursive: true });

  writeProjectFile(`${baseDir}/head.html`, split.beforeBody);
  writeProjectFile(`${baseDir}/body-open.html`, `${split.bodyOpen}`);
  writeProjectFile(`${baseDir}/after-body.html`, split.afterBody);

  const sections = [];
  bodyChunks.forEach((chunk, index) => {
    const component = classifySection(chunk, index);
    const label = labelForSection(component, chunk, index);
    const stem = safeFileStem(`${component}-${label}`, `${component}-${index + 1}`);
    const file = `sections/${String(index + 1).padStart(3, '0')}-${stem}.html`;
    writeProjectFile(`${baseDir}/${file}`, chunk);
    sections.push({
      id: `${String(index + 1).padStart(3, '0')}-${stem}`,
      component,
      label,
      file,
      bytes: Buffer.byteLength(chunk),
      hash: hashContent(chunk).slice(0, 16),
    });
  });

  const model = {
    schemaVersion: 1,
    template: 'sectioned-html-v1',
    page,
    slug,
    route: page === 'index.html' ? '/' : `/${page}`,
    branch: info.branch,
    role: info.role,
    title: info.title,
    h1: info.h1,
    source: {
      extractedFrom: page,
      extractedAt: stableGeneratedAt(),
      hash: hashContent(html),
      mode: 'lossless-section-snapshot',
    },
    files: {
      head: 'head.html',
      bodyOpen: 'body-open.html',
      afterBody: 'after-body.html',
    },
    sections,
    recommendedChecks: [
      ...new Set([
        ...info.recommendedChecks,
        `npm run ai:semantic-diff -- --page ${page}`,
        'npm run check:site-builder',
      ]),
    ],
    aiNotes: [
      'Эта страница подключена к Static Component Builder: редактируй секции в src/pages/<slug>/sections/*, затем запускай npm run build:site -- --page <file> --write.',
      'Root HTML остаётся production-артефактом и должен совпадать с builder output.',
      'Если правишь root HTML вручную, синхронизируй src через npm run site-builder:bootstrap -- --pages <file>.',
    ],
  };
  writeProjectFile(`${baseDir}/page.json`, `${JSON.stringify(model, null, 2)}\n`);

  return { page, slug, model: `${baseDir}/page.json`, sections: sections.length, bytes: Buffer.byteLength(html), hash: model.source.hash };
}

export function loadBuilderManifest() {
  if (!existsSync(join(ROOT_DIR, SITE_BUILDER_MANIFEST))) return null;
  return readJsonFile(SITE_BUILDER_MANIFEST);
}

export function writeBuilderManifest(entries) {
  const manifest = {
    schemaVersion: 1,
    generatedAt: stableGeneratedAt(),
    mode: 'parallel-static-component-builder',
    status: 'full-html-baseline',
    note: 'All indexed HTML pages are rebuilt from src/pages/* section components. Root HTML remains static production output.',
    template: 'sectioned-html-v1',
    defaultOutputDir: 'build/site-builder',
    pages: entries.map((entry) => ({
      page: entry.page,
      slug: entry.slug,
      model: entry.model,
      sections: entry.sections,
      sourceHash: entry.hash,
    })),
    workflow: {
      inspect: 'npm run ai:workspace -- --task "..."',
      edit: 'edit src/pages/<slug>/sections/*.html or page.json; root HTML is rebuilt from src',
      buildPreview: 'npm run build:site',
      writeProduction: 'npm run build:site -- --page <page.html> --write',
      check: 'npm run check:site-builder && npm run ai:check',
    },
  };
  writeProjectFile(SITE_BUILDER_MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

export function pageModelMap() {
  const manifest = loadBuilderManifest();
  const map = new Map();
  for (const page of manifest?.pages || []) map.set(page.page, page);
  return map;
}

function getPathValue(object, path) {
  return String(path).split('.').reduce((acc, key) => (acc && Object.prototype.hasOwnProperty.call(acc, key) ? acc[key] : undefined), object);
}

export function renderParametricTemplate(template, props = {}) {
  return String(template).replace(/\{\{\{?\s*([a-zA-Z0-9_.-]+)\s*\}?\}\}/g, (match, path) => {
    const value = getPathValue(props, path);
    if (value == null) return '';
    return String(value);
  });
}

export function readSectionContent(modelPath, section) {
  const base = dirname(modelPath);
  if (section.componentMode === 'parametric' || section.templateRef) {
    if (!section.templateRef) throw new Error(`Section ${section.id || '(без id)'}: parametric section без templateRef`);
    const template = readProjectFile(section.templateRef);
    const props = section.propsRef ? readJsonFile(section.propsRef) : (section.props || {});
    return renderParametricTemplate(template, props);
  }
  if (section.componentRef) return readProjectFile(section.componentRef);
  if (section.file) return readProjectFile(toPosix(join(base, section.file)));
  throw new Error(`Section ${section.id || '(без id)'} не содержит file, componentRef или templateRef`);
}

export function renderPageFromModel(modelPath) {
  const model = readJsonFile(modelPath);
  const base = dirname(modelPath);
  const head = readProjectFile(toPosix(join(base, model.files.head)));
  const bodyOpen = readProjectFile(toPosix(join(base, model.files.bodyOpen)));
  const sections = (model.sections || []).map((section) => readSectionContent(modelPath, section));
  const afterBody = readProjectFile(toPosix(join(base, model.files.afterBody)));
  return { model, html: injectStaticShell(`${head}${bodyOpen}${sections.join('')}${afterBody}`, model.page) };
}

export function ensureWithinProject(path) {
  const abs = join(ROOT_DIR, path);
  const rel = relative(ROOT_DIR, abs);
  if (rel.startsWith('..')) throw new Error(`Path outside project: ${path}`);
  return abs;
}
