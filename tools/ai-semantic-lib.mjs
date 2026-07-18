import { existsSync, readFileSync, readdirSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { ROOT_DIR, listHtmlFiles } from './ai-maintenance-lib.mjs';

export function readProjectFile(path, { ref = null } = {}) {
  if (ref) {
    try {
      return execSync(`git show ${ref}:${shellQuote(path)}`, { cwd: ROOT_DIR, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    } catch {
      return null;
    }
  }
  const abs = join(ROOT_DIR, path);
  if (!existsSync(abs)) return null;
  return readFileSync(abs, 'utf8');
}

function shellQuote(value) {
  return String(value).replace(/'/g, "'\\''");
}

export function hasGit() {
  if (!existsSync(join(ROOT_DIR, '.git'))) return false;
  try {
    execSync('git rev-parse --is-inside-work-tree', { cwd: ROOT_DIR, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export function getGitChangedFiles() {
  if (!hasGit()) return null;
  const out = execSync('git status --short', { cwd: ROOT_DIR, encoding: 'utf8' }).trim();
  if (!out) return [];
  return out.split('\n').map((line) => line.replace(/^..\s+/, '').replace(/^\?\?\s+/, '').trim()).filter(Boolean);
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

function attr(tag, name) {
  const re = new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i');
  const match = tag.match(re);
  return match ? (match[2] || match[3] || match[4] || '') : null;
}

function attrs(tag, name) {
  return attr(tag, name);
}

function unique(items) {
  return [...new Set(items.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function compactHash(value) {
  let hash = 0;
  const str = String(value || '');
  for (let i = 0; i < str.length; i += 1) hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  return Math.abs(hash).toString(36);
}

export function extractJsonLdTypes(html) {
  const types = [];
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const match of scripts) {
    try {
      const parsed = JSON.parse(match[1].trim());
      const nodes = Array.isArray(parsed) ? parsed : [parsed, ...(Array.isArray(parsed?.['@graph']) ? parsed['@graph'] : [])];
      for (const node of nodes) {
        const type = node?.['@type'];
        if (Array.isArray(type)) types.push(...type.map(String));
        else if (type) types.push(String(type));
      }
    } catch {
      types.push('INVALID_JSON_LD');
    }
  }
  return unique(types);
}

export function getPageSemantic(page, { html = null, ref = null } = {}) {
  const source = html ?? readProjectFile(page, { ref });
  if (source === null) return null;

  const title = stripTags(source.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
  const description = source.match(/<meta\s+name=["']description["'][^>]*>/i)?.[0];
  const canonical = source.match(/<link\s+rel=["']canonical["'][^>]*>/i)?.[0];
  const h1 = stripTags(source.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');

  const formTags = [...source.matchAll(/<form\b[^>]*>/gi)].map((m) => m[0]);
  const forms = formTags.map((tag) => ({
    action: attr(tag, 'action') || '',
    method: (attr(tag, 'method') || 'get').toLowerCase(),
    className: attr(tag, 'class') || '',
    dataSlot: attr(tag, 'data-slot') || '',
  }));
  const requiredNames = unique([...source.matchAll(/<(input|select|textarea)\b[^>]*\brequired\b[^>]*>/gi)].map((m) => attr(m[0], 'name') || attr(m[0], 'id') || m[1]));
  const fieldNames = unique([...source.matchAll(/<(input|select|textarea)\b[^>]*>/gi)].map((m) => attr(m[0], 'name') || attr(m[0], 'id')).filter(Boolean));

  const imgTags = [...source.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const imageSrcs = unique(imgTags.map((tag) => attr(tag, 'src')).filter(Boolean));
  const missingAlt = imgTags.filter((tag) => attr(tag, 'alt') === null).length;
  const missingSize = imgTags.filter((tag) => !attr(tag, 'width') || !attr(tag, 'height')).length;
  const lazyImages = imgTags.filter((tag) => (attr(tag, 'loading') || '').toLowerCase() === 'lazy').length;
  const eagerImages = imgTags.filter((tag) => (attr(tag, 'loading') || '').toLowerCase() === 'eager').length;
  const backgroundImages = unique([...source.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/gi)].map((m) => m[1]).filter((src) => src.includes('/assets/images/')));

  const internalLinks = unique([...source.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)]
    .map((m) => m[1])
    .filter((href) => href && !href.startsWith('#') && !href.startsWith('tel:') && !href.startsWith('mailto:') && !href.startsWith('http') && !href.startsWith('javascript:')));

  const scriptSrcs = unique([...source.matchAll(/<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi)].map((m) => m[1]));
  const cssHrefs = unique([...source.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)].map((m) => m[1]));
  const jsonLdTypes = extractJsonLdTypes(source);

  return {
    page,
    htmlHash: compactHash(source),
    seo: {
      title,
      description: description ? attrs(description, 'content') || '' : '',
      canonical: canonical ? attrs(canonical, 'href') || '' : '',
      h1,
    },
    forms: {
      count: forms.length,
      endpoints: unique(forms.map((f) => f.action || '(no action)')),
      methods: unique(forms.map((f) => f.method || 'get')),
      classes: unique(forms.flatMap((f) => f.className.split(/\s+/))),
      dataSlots: unique(forms.map((f) => f.dataSlot)),
      fieldNames,
      requiredNames,
      hasConsentCheckbox: /type=["']checkbox["'][^>]*(consent|personal|policy|agree)|соглас/i.test(source),
    },
    images: {
      imgCount: imgTags.length,
      pictureCount: (source.match(/<picture\b/gi) || []).length,
      sourceCount: (source.match(/<source\b/gi) || []).length,
      srcsetCount: (source.match(/\bsrcset=/gi) || []).length,
      backgroundCount: backgroundImages.length,
      missingAlt,
      missingSize,
      lazyImages,
      eagerImages,
      srcs: imageSrcs.slice(0, 60),
      backgroundImages,
    },
    schema: {
      jsonLdBlocks: (source.match(/application\/ld\+json/gi) || []).length,
      types: jsonLdTypes,
    },
    assets: {
      scriptSrcs,
      cssHrefs,
    },
    links: {
      internalCount: internalLinks.length,
      internalLinks: internalLinks.slice(0, 80),
      phoneLinks: (source.match(/href=["']tel:/gi) || []).length,
      whatsappLinks: (source.match(/wa\.me|whatsapp/i) || []).length,
    },
    criticalSignals: {
      hasCanonical: Boolean(canonical),
      hasMetaDescription: Boolean(description),
      hasTelegramForm: /class=["'][^"']*telegram-form|data-slot=["']request-form|\/api\/send-telegram/.test(source),
      hasCountdown: /data-countdown-(min|sec)/.test(source),
      hasWhatsappFloat: /whatsapp-float-container/.test(source),
      hasContactLinks: /data-contact-link=/.test(source),
    },
  };
}

export function compareSemantics(before, after) {
  if (!before && !after) return [];
  if (!before) return [{ level: 'info', area: 'file', message: 'Страница добавлена' }];
  if (!after) return [{ level: 'warn', area: 'file', message: 'Страница удалена' }];
  const changes = [];
  const add = (level, area, message) => changes.push({ level, area, message });

  for (const key of ['title', 'description', 'canonical', 'h1']) {
    if (before.seo[key] !== after.seo[key]) add(key === 'canonical' ? 'warn' : 'info', 'seo', `${key}: изменено`);
  }

  if (before.forms.count !== after.forms.count) add('warn', 'forms', `количество форм: ${before.forms.count} → ${after.forms.count}`);
  for (const key of ['endpoints', 'methods', 'fieldNames', 'requiredNames', 'dataSlots']) {
    const a = JSON.stringify(before.forms[key]);
    const b = JSON.stringify(after.forms[key]);
    if (a !== b) add(key === 'endpoints' || key === 'requiredNames' ? 'warn' : 'info', 'forms', `${key}: изменено`);
  }
  if (before.forms.hasConsentCheckbox !== after.forms.hasConsentCheckbox) add('warn', 'forms', `consent checkbox: ${before.forms.hasConsentCheckbox} → ${after.forms.hasConsentCheckbox}`);

  for (const key of ['imgCount', 'pictureCount', 'sourceCount', 'srcsetCount', 'backgroundCount', 'missingAlt', 'missingSize']) {
    if (before.images[key] !== after.images[key]) add(key.startsWith('missing') ? 'warn' : 'info', 'images', `${key}: ${before.images[key]} → ${after.images[key]}`);
  }

  if (JSON.stringify(before.schema.types) !== JSON.stringify(after.schema.types)) add('warn', 'schema', `JSON-LD types: ${before.schema.types.join(', ') || '—'} → ${after.schema.types.join(', ') || '—'}`);
  if (before.schema.jsonLdBlocks !== after.schema.jsonLdBlocks) add('warn', 'schema', `JSON-LD blocks: ${before.schema.jsonLdBlocks} → ${after.schema.jsonLdBlocks}`);

  if (JSON.stringify(before.assets.scriptSrcs) !== JSON.stringify(after.assets.scriptSrcs)) add('warn', 'assets', 'script src list: изменено');
  if (JSON.stringify(before.assets.cssHrefs) !== JSON.stringify(after.assets.cssHrefs)) add('info', 'assets', 'stylesheet list: изменено');
  if (before.links.internalCount !== after.links.internalCount) add('info', 'links', `internal links: ${before.links.internalCount} → ${after.links.internalCount}`);
  if (before.links.phoneLinks !== after.links.phoneLinks) add('warn', 'links', `phone links: ${before.links.phoneLinks} → ${after.links.phoneLinks}`);
  if (before.links.whatsappLinks !== after.links.whatsappLinks) add('info', 'links', `WhatsApp mentions/links: ${before.links.whatsappLinks} → ${after.links.whatsappLinks}`);

  for (const [key, value] of Object.entries(before.criticalSignals)) {
    if (value !== after.criticalSignals[key]) add('warn', 'critical', `${key}: ${value} → ${after.criticalSignals[key]}`);
  }

  if (!changes.length && before.htmlHash !== after.htmlHash) add('info', 'html', 'HTML изменён, но ключевые семантические контракты не поменялись');
  return changes;
}

export function printSemanticSnapshot(snapshot) {
  if (!snapshot) {
    console.log('Семантический снимок недоступен');
    return;
  }
  console.log(`Страница: ${snapshot.page}`);
  console.log(`Title: ${snapshot.seo.title || '—'}`);
  console.log(`Description: ${snapshot.seo.description || '—'}`);
  console.log(`Canonical: ${snapshot.seo.canonical || '—'}`);
  console.log(`H1: ${snapshot.seo.h1 || '—'}`);
  console.log(`Forms: ${snapshot.forms.count}; endpoints: ${snapshot.forms.endpoints.join(', ') || '—'}; required: ${snapshot.forms.requiredNames.join(', ') || '—'}`);
  console.log(`Images: img=${snapshot.images.imgCount}, picture=${snapshot.images.pictureCount}, srcset=${snapshot.images.srcsetCount}, missingAlt=${snapshot.images.missingAlt}, missingSize=${snapshot.images.missingSize}`);
  console.log(`Schema: blocks=${snapshot.schema.jsonLdBlocks}; types=${snapshot.schema.types.join(', ') || '—'}`);
  console.log(`Links: internal=${snapshot.links.internalCount}, tel=${snapshot.links.phoneLinks}, whatsapp=${snapshot.links.whatsappLinks}`);
  console.log(`Scripts: ${snapshot.assets.scriptSrcs.join(', ') || '—'}`);
}

export function classifyFile(file, index = null) {
  const normalized = file.replace(/^\.\//, '');
  const checks = new Set(['npm run ai:check -- --fast']);
  let risk = 'medium';
  let type = 'unknown';
  const notes = [];
  const affectedPages = new Set();

  if (normalized === 'src/site-builder.json' || normalized.startsWith('src/pages/')) {
    type = 'site-builder-source';
    risk = normalized.includes('/sections/') ? 'medium' : 'high';
    checks.add('npm run check:site-builder');
    checks.add('npm run check:shared-components');
    checks.add('npm run validate:site');
    notes.push('Static Component Builder source: после правки нужно собрать root HTML командой build:site -- --write для нужной страницы.');
    const match = normalized.match(/^src\/pages\/([^/]+)/);
    if (match && index?.pages) {
      for (const page of Object.values(index.pages)) {
        if (page.siteBuilder?.slug === match[1]) affectedPages.add(page.page);
      }
    }
  } else if (normalized.startsWith('src/components/')) {
    type = normalized.startsWith('src/components/parametric/') ? 'parametric-component-template' : 'shared-static-component';
    risk = 'high';
    checks.add('npm run check:shared-components');
    checks.add('npm run check:parameterized-components');
    checks.add('npm run check:site-builder');
    checks.add('npm run validate:site');
    notes.push(normalized.startsWith('src/components/parametric/')
      ? 'Parametric template может влиять на все страницы, которые ссылаются на templateRef; props лежат отдельно в content/components/*.'
      : 'Shared component может влиять на несколько страниц; после изменения пересобери затронутые root HTML и проверь site-builder.');
    try {
      const manifest = JSON.parse(readProjectFile('src/site-builder.json') || '{}');
      for (const entry of manifest.pages || []) {
        const model = JSON.parse(readProjectFile(entry.model) || '{}');
        if ((model.sections || []).some((section) => section.componentRef === normalized || section.templateRef === normalized)) affectedPages.add(entry.page);
      }
    } catch {}
    if (!affectedPages.size && index?.pages) {
      notes.push('Не удалось точно определить usage; считаю impact потенциально глобальным.');
      for (const page of Object.values(index.pages)) affectedPages.add(page.page);
    }
  } else if (normalized.endsWith('.html')) {
    type = 'public-html-page';
    risk = 'medium';
    affectedPages.add(normalized);
    checks.add(`npm run doctor:page -- --page ${normalized}`);
    checks.add(`npm run validate:data -- --page ${normalized}`);
    checks.add('npm run validate:site');
    checks.add(`npm run ai:semantic-diff -- --page ${normalized}`);
    notes.push('Проверь canonical, schema.org, формы, CTA, изображения и мобильную вёрстку.');
  } else if (normalized === 'styles-combined.css' || normalized.endsWith('.css')) {
    type = 'global-style';
    risk = 'high';
    checks.add('npm run validate:site');
    notes.push('Глобальный CSS влияет на все страницы; нужен визуальный smoke review ключевых страниц.');
  } else if (normalized === 'main.js' || normalized === 'telegram-form.js' || normalized === 'analytics.js') {
    type = 'global-client-js';
    risk = normalized === 'telegram-form.js' ? 'high' : 'high';
    checks.add(`node --check ${normalized}`);
    checks.add('npm run validate:site');
    notes.push('Проверь формы, меню, модалки, таймеры, контактные ссылки и отсутствие JS errors.');
  } else if (normalized.startsWith('content/faq/')) {
    type = normalized.includes('/schema/') ? 'generated-faq-schema' : 'faq-registry';
    risk = normalized.includes('/schema/') ? 'medium' : 'high';
    checks.add('npm run check:faq-registry');
    checks.add('npm run check:site-builder');
    checks.add('npm run validate:site');
    notes.push(normalized.includes('/schema/')
      ? 'Retired FAQPage JSON-LD: файл не должен существовать; запусти generate:faq-registry.'
      : 'FAQ registry индексирует видимые FAQ-блоки; FAQPage schema отключена.');
    try {
      const registry = JSON.parse(readProjectFile('content/faq/page-faq-registry.json') || '{}');
      if (normalized === 'content/faq/page-faq-registry.json') {
        Object.keys(registry.pages || {}).forEach((page) => affectedPages.add(page));
      } else {
        for (const [page, entry] of Object.entries(registry.pages || {})) {
          if (entry?.schema?.output === normalized) affectedPages.add(page);
        }
      }
    } catch {}
  } else if (normalized.startsWith('content/components/')) {
    type = 'parametric-component-props';
    risk = 'medium';
    checks.add('npm run check:parameterized-components');
    checks.add('npm run check:site-builder');
    checks.add('npm run validate:site');
    notes.push('Props для параметризованного компонента: меняет текст/placeholder/button без правки HTML-template.');
    try {
      const manifest = JSON.parse(readProjectFile('src/site-builder.json') || '{}');
      for (const entry of manifest.pages || []) {
        const model = JSON.parse(readProjectFile(entry.model) || '{}');
        if ((model.sections || []).some((section) => section.propsRef === normalized)) affectedPages.add(entry.page);
      }
    } catch {}
  } else if (normalized.startsWith('data/')) {
    type = 'project-data';
    risk = 'medium';
    checks.add('npm run validate:data');
    checks.add('npm run generate:ai-index');
    if (normalized === 'data/page-metadata.json') {
      checks.add('npm run sync:metadata');
      checks.add('npm run generate:sitemap');
      notes.push('SEO-данные синхронизируются в HTML отдельной командой.');
    }
    if (normalized.includes('restaurant')) notes.push('Влияет на ресторанную ветку.');
    if (normalized.includes('household')) notes.push('Влияет на бытовую ветку.');
  } else if (normalized.startsWith('assets/images/responsive/') || normalized.endsWith('.webp') || normalized.endsWith('.avif')) {
    type = 'generated-image';
    risk = 'medium';
    checks.add('npm run check:responsive-images');
    checks.add('npm run check:webp-sidecars');
    notes.push('Похоже на generated asset: лучше пересоздавать генератором, а не править вручную.');
  } else if (normalized.startsWith('assets/images/')) {
    type = 'source-image';
    risk = 'medium';
    checks.add('npm run generate:responsive-images');
    checks.add('npm run generate:webp-sidecars');
    checks.add('npm run check:image-budget');
    notes.push('Оригинал изображения; production-деривативы нужно пересоздать.');
  } else if (normalized.startsWith('deploy/') || normalized.startsWith('.github/') || normalized === 'server/telegram-api.mjs') {
    type = 'deploy-or-server';
    risk = 'high';
    if (normalized.endsWith('.sh')) checks.add(`bash -n ${normalized}`);
    if (normalized.endsWith('.mjs') || normalized.endsWith('.js')) checks.add(`node --check ${normalized}`);
    notes.push('High-risk зона: нужен ручной review, особенно secrets, headers, endpoint и rollback.');
  } else if (normalized.startsWith('tools/') || normalized === 'package.json') {
    type = 'tooling';
    risk = 'high';
    if (normalized.endsWith('.mjs') || normalized.endsWith('.js')) checks.add(`node --check ${normalized}`);
    checks.add('npm run ai:check -- --fast');
    notes.push('Изменение tooling может изменить проверки/генерацию проекта.');
  } else if (normalized.startsWith('docs/') || normalized.endsWith('.md')) {
    type = 'documentation';
    risk = 'low';
    notes.push('Документация влияет на будущую работу человека/AI, но обычно не на public-сайт.');
  }

  if (index?.pages) {
    if (index.pages[normalized]) affectedPages.add(normalized);
    if (normalized === 'data/page-metadata.json') Object.keys(index.pages).forEach((p) => affectedPages.add(p));
    if ((normalized.startsWith('data/') || normalized.startsWith('content/')) && normalized.includes('household')) Object.values(index.pages).filter((p) => p.branch === 'household').forEach((p) => affectedPages.add(p.page));
    if ((normalized.startsWith('data/') || normalized.startsWith('content/')) && normalized.includes('restaurant')) Object.values(index.pages).filter((p) => p.branch === 'restaurant').forEach((p) => affectedPages.add(p.page));
    if (normalized === 'data/contact-config.json' || normalized === 'data/runtime-config.json') Object.values(index.pages).filter((p) => p.hasForm || p.page.includes('contact')).forEach((p) => affectedPages.add(p.page));
  }

  return {
    file: normalized,
    exists: existsSync(join(ROOT_DIR, normalized)),
    type,
    risk,
    notes,
    affectedPages: [...affectedPages].sort((a, b) => a.localeCompare(b)),
    recommendedChecks: [...checks],
  };
}

export function loadAiIndexSafe() {
  const path = join(ROOT_DIR, 'data/ai-project-index.json');
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function loadComponentMapSafe() {
  const path = join(ROOT_DIR, 'data/ai-component-map.json');
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function componentsForFile(file, componentMap = null) {
  if (!componentMap?.components) return [];
  const result = [];
  for (const [id, component] of Object.entries(componentMap.components)) {
    const files = new Set([...(component.ownedFiles || []), ...(component.relatedFiles || [])]);
    if (files.has(file)) result.push({ id, ...component });
    if (file.endsWith('.html') && (component.appearsIn || []).includes(file)) result.push({ id, ...component });
    if (file === 'styles-combined.css' && (component.cssSelectors || []).length) result.push({ id, ...component });
    if ((file === 'main.js' || file === 'telegram-form.js') && (component.jsHooks || []).length) result.push({ id, ...component });
  }
  const seen = new Set();
  return result.filter((item) => (seen.has(item.id) ? false : (seen.add(item.id), true)));
}

export function guessPagesFromTask(task, index, limit = 8) {
  const q = String(task || '').toLowerCase();
  if (!index?.pages || !q.trim()) return [];
  return Object.values(index.pages)
    .map((page) => {
      const haystack = [
        page.page,
        page.branch,
        page.role,
        page.title,
        page.description,
        page.h1,
        page.service?.serviceName,
        page.service?.deviceName,
        page.service?.uiLabel,
      ].filter(Boolean).join(' ').toLowerCase();
      let score = 0;
      for (const token of q.split(/[\s,.;:!?()"'«»]+/).filter((t) => t.length >= 4)) {
        if (page.page.toLowerCase().includes(token)) score += 5;
        if ((page.title || '').toLowerCase().includes(token)) score += 4;
        if (haystack.includes(token)) score += 2;
      }
      if (q.includes('главн') && page.page === 'index.html') score += 10;
      if (q.includes('контакт') && page.page.includes('contact')) score += 8;
      if (q.includes('холод') && page.page.includes('holodil')) score += 8;
      if (q.includes('стирал') && page.page.includes('stiral')) score += 8;
      if (q.includes('пароконвект') && page.page.includes('parokonvektomat')) score += 8;
      return { page, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.page.page.localeCompare(b.page.page))
    .slice(0, limit)
    .map((item) => item.page);
}

export function guessComponentsFromTask(task, componentMap = null) {
  const q = String(task || '').toLowerCase();
  const out = [];
  if (!componentMap?.components) return out;
  for (const [id, component] of Object.entries(componentMap.components)) {
    const keywords = [id, component.name, ...(component.keywords || [])].filter(Boolean).map((v) => String(v).toLowerCase());
    if (keywords.some((k) => k && q.includes(k))) out.push({ id, ...component });
  }
  return out;
}

export function listProjectHtmlFiles() {
  return listHtmlFiles().filter((file) => !file.startsWith('.'));
}
