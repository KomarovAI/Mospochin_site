import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const manifestPath = path.join(rootDir, 'data', 'direct-landing-pages.json');
const metadataPath = path.join(rootDir, 'data', 'page-metadata.json');

const siteOrigin = 'https://mospochin.ru';
const phone = '79990057172';

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const basePath = path.join(rootDir, manifest.sourcePage);
const baseHtml = fs.readFileSync(basePath, 'utf8');
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

if (!Array.isArray(manifest.pages) || manifest.pages.length === 0) {
  throw new Error('data/direct-landing-pages.json must contain a non-empty pages array');
}

function escapeAttr(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function pageSlug(file) {
  return file.replace(/\.html$/i, '');
}

function canonicalFor(file) {
  return `${siteOrigin}/${file}`;
}

function replaceOrThrow(html, pattern, replacement, label) {
  if (!pattern.test(html)) {
    throw new Error(`Cannot update ${label}`);
  }
  return html.replace(pattern, replacement);
}

function setMeta(html, selector, content) {
  const escaped = escapeAttr(content);
  const pattern = new RegExp(`(<meta ${selector} content=")[^"]*(">)`);
  return replaceOrThrow(html, pattern, `$1${escaped}$2`, selector);
}

function setRobots(html, robots) {
  const robotsMeta = `<meta name="robots" content="${escapeAttr(robots)}">`;

  if (robots) {
    if (/<meta name="robots" content="[^"]*">\s*/.test(html)) {
      return html.replace(/<meta name="robots" content="[^"]*">\s*/, `${robotsMeta}\n`);
    }
    return html.replace(/(<link rel="canonical" href="[^"]*">\s*)/, `$1${robotsMeta}\n`);
  }

  return html.replace(/<meta name="robots" content="[^"]*">\s*/, '');
}


function updateFaqRegistrySchema(html, page) {
  const canonical = canonicalFor(page.file);
  const pattern = /(<script type="application\/ld\+json" data-generated="faq-registry">)([\s\S]*?)(<\/script>)/;
  const match = html.match(pattern);
  if (!match) return html;

  let schema = match[2];
  schema = schema.replace(/("@id":\s*")[^"]*("\s*,)/, `$1${escapeAttr(`${canonical}#faq`)}$2`);
  schema = schema.replace(/("url":\s*")[^"]*("\s*,)/, `$1${escapeAttr(canonical)}$2`);
  schema = schema.replace(/("name":\s*")[^"]*("\s*,)/, `$1${escapeAttr(page.title)}$2`);
  return html.replace(pattern, `${match[1]}${schema}${match[3]}`);
}

function updateJsonLdDescription(html, description) {
  const escaped = JSON.stringify(description);
  return replaceOrThrow(
    html,
    /("description":\s*)"[^"]*"(\s*,\s*"provider")/,
    `$1${escaped}$2`,
    'service schema description',
  );
}

function updateBodyClass(html, slug) {
  const bodyClass = [
    'font-sans',
    'text-slate-800',
    'antialiased',
    'bg-white',
    'branch-restaurant',
    'page-parokonvektomaty',
    'page-direct-landing',
    `page-${slug}`,
  ].join(' ');

  return replaceOrThrow(
    html,
    /<body([^>]*)\sclass="[^"]*"([^>]*)>/,
    `<body$1 class="${bodyClass}"$2>`,
    'body class',
  );
}

function updateHero(html, page) {
  let updated = replaceOrThrow(
    html,
    /(<h1 class="pariki-hero-title[^"]*">\s*)[\s\S]*?(\s*<\/h1>)/,
    `$1${page.h1Html}$2`,
    'hero H1',
  );

  const leadHtml = `${escapeHtml(page.lead)}\n                        <span class="text-white font-bold">${escapeHtml(page.leadStrong)}</span>`;
  updated = replaceOrThrow(
    updated,
    /(<p class="pariki-hero-copy[^"]*">\s*)[\s\S]*?(\s*<\/p>)/,
    `$1${leadHtml}$2`,
    'hero copy',
  );

  return updated;
}

function updateForms(html, page) {
  let updated = replaceOrThrow(
    html,
    /(<input type="hidden" name="problem" value=")[^"]*(")/,
    `$1${escapeAttr(page.hiddenProblem)}$2`,
    'hidden form problem',
  );

  updated = updated.replace(
    /(<input type="text" name="type" placeholder=")[^"]*(")/g,
    `$1${escapeAttr(page.typePlaceholder)}$2`,
  );

  updated = updated.replace(
    /(<input type="text" name="problem" placeholder=")[^"]*(")/g,
    `$1${escapeAttr(page.problemPlaceholder)}$2`,
  );

  updated = replaceOrThrow(
    updated,
    /(<h2 class="mt-1 text-base font-display font-extrabold text-brand-blue">)[\s\S]*?(<\/h2>)/,
    `$1${escapeHtml(page.quickFormTitle)}$2`,
    'quick form title',
  );

  updated = replaceOrThrow(
    updated,
    /(<i class="ri-send-plane-line mr-2"><\/i>)Согласовать выезд(?! инженера)/,
    `$1${escapeHtml(page.heroSubmitLabel)}`,
    'hero submit label',
  );

  updated = replaceOrThrow(
    updated,
    /(<i class="ri-send-plane-line mr-2"><\/i>)Согласовать выезд инженера/,
    `$1${escapeHtml(page.mainSubmitLabel)}`,
    'main submit label',
  );

  return updated;
}

function updateWhatsApp(html, page) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(page.whatsappText)}`;
  return html.replace(/https:\/\/wa\.me\/79990057172\?text=[^"]*/g, href);
}

function updateMobileSticky(html, page) {
  const blockPattern = /<!-- Mobile sticky footer -->[\s\S]*?<!-- WhatsApp floating button \(mobile\) -->/;
  const match = html.match(blockPattern);

  if (!match) {
    if (html.includes('id="mobile-footer-container"') || html.includes('id="whatsapp-float-container"')) {
      return html;
    }
    throw new Error('Cannot find mobile sticky footer block');
  }

  let block = match[0];

  block = replaceOrThrow(
    block,
    /(<a href="tel:\+79990057172"[\s\S]*?<span class="text-sm">)[\s\S]*?(<\/span>\s*<\/a>)/,
    `$1${escapeHtml(page.mobilePhoneLabel)}$2`,
    'mobile phone label',
  );

  block = replaceOrThrow(
    block,
    /(<a href="https:\/\/wa\.me\/79990057172\?text=[^"]*" data-contact-link="whatsapp" rel="noopener noreferrer" target="_blank" class="btn-click bg-green-600[\s\S]*?<span class="text-sm">)[\s\S]*?(<\/span>\s*<\/a>)/,
    `$1${escapeHtml(page.mobileWhatsappLabel)}$2`,
    'mobile WhatsApp label',
  );

  return html.replace(blockPattern, block);
}


function renderFaultDetails(page) {
  const details = page.faultDetails;
  if (!details || !Array.isArray(details.cards) || details.cards.length === 0) return '';

  const cards = details.cards.map((card) => `
                <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 class="font-display text-lg font-extrabold text-brand-blue">${escapeHtml(card.title)}</h3>
                    <p class="mt-2 text-sm leading-relaxed text-slate-600"><strong>Как проявляется:</strong> ${escapeHtml(card.symptom)}</p>
                    <p class="mt-2 text-sm leading-relaxed text-slate-600"><strong>Что может быть:</strong> ${escapeHtml(card.cause)}</p>
                    <p class="mt-2 text-sm leading-relaxed text-slate-600"><strong>Что сделать:</strong> ${escapeHtml(card.action)}</p>
                </article>`).join('');

  return `
            <div class="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 lg:p-6 shadow-sm" data-seo-block="fault-details">
                <div class="max-w-3xl">
                    <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-orange">${escapeHtml(details.eyebrow || 'Ошибки и поломки')}</p>
                    <h3 class="mt-2 font-display text-xl sm:text-2xl font-extrabold text-brand-blue">${escapeHtml(details.title)}</h3>
                    <p class="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">${escapeHtml(details.intro)}</p>
                </div>
                <div class="mt-5 grid gap-4 md:grid-cols-2">
${cards}
                </div>
            </div>`;
}

function renderBrandDetails(page) {
  const details = page.brandDetails;
  if (!details || !Array.isArray(details.cards) || details.cards.length === 0) return '';

  const cards = details.cards.map((card) => `
                <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 class="font-display text-lg font-extrabold text-brand-blue">${escapeHtml(card.title)}</h3>
                    <p class="mt-2 text-sm leading-relaxed text-slate-600">${escapeHtml(card.text)}</p>
                </article>`).join('');

  return `
            <div class="mt-8 rounded-3xl border border-slate-200 bg-white p-5 lg:p-6 shadow-sm" data-seo-block="brand-context">
                <div class="max-w-3xl">
                    <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-orange">${escapeHtml(details.eyebrow || 'По бренду')}</p>
                    <h3 class="mt-2 font-display text-xl sm:text-2xl font-extrabold text-brand-blue">${escapeHtml(details.title)}</h3>
                    <p class="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">${escapeHtml(details.intro)}</p>
                </div>
                <div class="mt-5 grid gap-4 md:grid-cols-3">
${cards}
                </div>
            </div>`;
}

function renderRelatedLinks(page) {
  if (!Array.isArray(page.relatedLinks) || page.relatedLinks.length === 0) return '';

  const links = page.relatedLinks.map((link) => `
                    <a class="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-brand-orange hover:bg-white" href="${escapeAttr(link.href)}">
                        <span class="font-display text-base font-extrabold text-brand-blue">${escapeHtml(link.label)}</span>
                        <span class="mt-1 block text-sm leading-relaxed text-slate-600">${escapeHtml(link.description)}</span>
                    </a>`).join('');

  return `
            <div class="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-orange">По теме</p>
                <h3 class="mt-2 font-display text-xl font-extrabold text-brand-blue">Связанные посадочные и симптомы</h3>
                <div class="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
${links}
                </div>
            </div>`;
}

function renderAnalysisSection(page) {
  const cards = page.analysisCards.map((card) => `
                <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 class="font-display text-lg font-extrabold text-brand-blue">${escapeHtml(card.title)}</h3>
                    <p class="mt-2 text-sm leading-relaxed text-slate-600">${escapeHtml(card.text)}</p>
                </article>`).join('');

  return `<!-- direct-landing-analysis:start -->
    <section class="py-12 lg:py-16 bg-white">
        <div class="container mx-auto px-4">
            <div class="mx-auto max-w-3xl text-center mb-8">
                <p class="text-sm font-extrabold uppercase tracking-[0.22em] text-brand-orange">Под запрос из рекламы</p>
                <h2 class="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-brand-blue">${escapeHtml(page.analysisTitle)}</h2>
                <p class="mt-4 text-base leading-relaxed text-slate-600">${escapeHtml(page.analysisIntro)}</p>
            </div>
            <div class="grid gap-4 md:grid-cols-3">
${cards}
            </div>${renderFaultDetails(page)}${renderBrandDetails(page)}${renderRelatedLinks(page)}
        </div>
    </section>
<!-- direct-landing-analysis:end -->`;
}

function updateAnalysisSection(html, page) {
  if (!Array.isArray(page.analysisCards) || page.analysisCards.length === 0) return html;
  const section = renderAnalysisSection(page);
  const markerPattern = /<!-- direct-landing-analysis:start -->[\s\S]*?<!-- direct-landing-analysis:end -->/;

  if (markerPattern.test(html)) {
    return html.replace(markerPattern, section);
  }

  return replaceOrThrow(
    html,
    /(<section class="pariki-priority-strip[\s\S]*?<\/section>)/,
    `$1\n\n${section}`,
    'analysis section insertion point',
  );
}

function updateHead(html, page) {
  const canonical = canonicalFor(page.file);
  let updated = replaceOrThrow(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`, 'title');
  updated = setMeta(updated, 'name="description"', page.description);
  updated = setMeta(updated, 'property="og:title"', page.title);
  updated = setMeta(updated, 'property="og:description"', page.ogDescription ?? page.description);
  updated = setMeta(updated, 'property="og:url"', canonical);
  updated = replaceOrThrow(
    updated,
    /(<link rel="canonical" href=")[^"]*(">)/
    ,
    `$1${escapeAttr(canonical)}$2`,
    'canonical',
  );
  updated = setRobots(updated, page.robots);
  updated = updateJsonLdDescription(updated, page.description);
  updated = updateFaqRegistrySchema(updated, page);
  return updated;
}

function buildPage(page) {
  const slug = pageSlug(page.file);
  let html = baseHtml;
  html = updateHead(html, page);
  html = updateBodyClass(html, slug);
  html = updateHero(html, page);
  html = updateForms(html, page);
  html = updateWhatsApp(html, page);
  html = updateMobileSticky(html, page);
  html = updateAnalysisSection(html, page);
  return html;
}

function upsertMetadata(page) {
  const canonical = canonicalFor(page.file);
  const record = {
    title: page.title,
    description: page.description,
    canonical,
    ogUrl: canonical,
    hasForm: page.hasForm ?? true,
    branch: page.branch ?? 'restaurant',
  };

  if (page.robots) {
    record.robots = page.robots;
  }

  metadata.pages[page.file] = record;
}

for (const page of manifest.pages) {
  const outputPath = path.join(rootDir, page.file);
  fs.writeFileSync(outputPath, buildPage(page));
  upsertMetadata(page);
}

metadata.pages = Object.fromEntries(
  Object.entries(metadata.pages).sort(([left], [right]) => left.localeCompare(right, 'ru')),
);

fs.writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);

console.log(`Generated ${manifest.pages.length} Direct landing pages from ${manifest.sourcePage}`);
