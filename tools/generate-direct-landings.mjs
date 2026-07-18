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
const pageFlagIndex = process.argv.indexOf('--page');
const selectedPage = pageFlagIndex >= 0 ? process.argv[pageFlagIndex + 1] : null;
const pagesToGenerate = selectedPage
  ? manifest.pages.filter((page) => page.file === selectedPage)
  : manifest.pages;
if (selectedPage && pagesToGenerate.length === 0) {
  throw new Error(`Direct landing not found in manifest: ${selectedPage}`);
}
const baseHtmlCache = new Map();

function sourcePageFor(page) {
  return page.sourcePage ?? manifest.sourcePage;
}

function baseHtmlFor(page) {
  const sourcePage = sourcePageFor(page);
  if (!sourcePage) throw new Error(`No sourcePage configured for ${page.file}`);
  if (!baseHtmlCache.has(sourcePage)) {
    baseHtmlCache.set(sourcePage, fs.readFileSync(path.join(rootDir, sourcePage), 'utf8'));
  }
  return baseHtmlCache.get(sourcePage);
}
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

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function setMeta(html, selector, content) {
  const escaped = escapeAttr(content);
  const pattern = new RegExp(`<meta\\b(?=[^>]*${escapeRegExp(selector)})[^>]*>`, 'gi');
  if (!pattern.test(html)) throw new Error(`Cannot update ${selector}`);
  pattern.lastIndex = 0;
  return html.replace(pattern, (tag) => {
    if (/\bcontent=["'][^"']*["']/i.test(tag)) {
      return tag.replace(/\bcontent=(["'])[^"']*\1/i, `content="${escaped}"`);
    }
    return tag.replace(/\s*\/?>(?=\s*$)/, ` content="${escaped}">`);
  });
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
  const pattern = /(<script type="application\/ld\+json" data-generated="faq-registry">)([\s\S]*?)(<\/script>)/;
  return html.replace(pattern, '');
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
    /<body\b([^>]*)\sclass="[^"]*"([^>]*)>/,
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
  const cards = (Array.isArray(page.analysisCards) ? page.analysisCards : []).map((card) => `
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


function renderCompactServicePage(page) {
  const canonical = canonicalFor(page.file);
  const slug = pageSlug(page.file);
  const cards = (Array.isArray(page.analysisCards) ? page.analysisCards : []).map((card) => `
              <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 class="font-display text-lg font-extrabold text-brand-blue">${escapeHtml(card.title)}</h3>
                <p class="mt-2 text-sm leading-relaxed text-slate-600">${escapeHtml(card.text)}</p>
              </article>`).join('');
  const links = (Array.isArray(page.relatedLinks) ? page.relatedLinks : []).map((link, index) => `
              <a class="block rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-brand-orange hover:bg-white" href="${escapeAttr(link.href)}" data-cta-id="${slug}_related_${String(index + 1).padStart(2, '0')}" data-cta-group="internal_link" data-block="related_cluster">
                <span class="font-display text-lg font-extrabold text-brand-blue">${escapeHtml(link.label)}</span>
                <span class="mt-2 block text-sm leading-relaxed text-slate-600">${escapeHtml(link.description)}</span>
              </a>`).join('');
  const whatsappHref = `https://wa.me/${phone}?text=${encodeURIComponent(page.whatsappText)}`;
  const formFields = Array.isArray(page.formFields) && page.formFields.length
    ? page.formFields
    : [
        { name: 'type', placeholder: page.typePlaceholder, type: 'text' },
        { name: 'details', placeholder: page.problemPlaceholder, type: 'text' },
      ];
  const formFieldsMarkup = formFields.map((field) => {
    const attrs = [
      `class="w-full rounded-xl border-2 border-slate-200 px-4 py-3"`,
      `type="${escapeAttr(field.type ?? 'text')}"`,
      `name="${escapeAttr(field.name)}"`,
      `placeholder="${escapeAttr(field.placeholder ?? '')}"`,
    ];
    if (field.required) attrs.push('required');
    if (field.autocomplete) attrs.push(`autocomplete="${escapeAttr(field.autocomplete)}"`);
    if (field.inputmode) attrs.push(`inputmode="${escapeAttr(field.inputmode)}"`);
    return `<input ${attrs.join(' ')}>`;
  }).join('');
  const faqItems = Array.isArray(page.faqs) && page.faqs.length ? page.faqs : [
    ['Что прислать инженеру?', 'Фото шильдика, панели управления, описание симптома и адрес объекта.'],
    ['Можно ли назвать точную цену заранее?', 'Точная стоимость определяется после диагностики и согласуется до начала ремонта.'],
    ['Работаете с ресторанами и юридическими лицами?', 'Да. Формат документов и порядок работ согласуются перед выездом.'],
  ];
  const faqMarkup = faqItems.map(([question, answer]) => `
            <details class="rounded-2xl border border-slate-200 bg-white p-5">
              <summary class="cursor-pointer font-bold text-brand-blue">${escapeHtml(question)}</summary>
              <p class="mt-3 leading-relaxed text-slate-600">${escapeHtml(answer)}</p>
            </details>`).join('');
  const serviceSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.title,
    description: page.description,
    provider: {
      '@type': 'LocalBusiness',
      name: 'MosPochin',
      telephone: '+79990057172',
      url: 'https://mospochin.ru',
    },
    areaServed: { '@type': 'City', name: 'Москва' },
  }, null, 2);
  const breadcrumbSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://mospochin.ru/index.html' },
      { '@type': 'ListItem', position: 2, name: page.title, item: canonical },
    ],
  }, null, 2);

  return `<!DOCTYPE html>
<html lang="ru" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="preload" href="/assets/fonts/manrope.css" as="style"><link rel="stylesheet" href="/assets/fonts/manrope.css">
  <link rel="preload" href="/assets/fonts/remixicon.css" as="style"><link rel="stylesheet" href="/assets/fonts/remixicon.css">
  <link rel="preload" href="styles-combined.css" as="style"><link rel="stylesheet" href="styles-combined.css">
  <script src="main.js" defer></script><script src="telegram-form.js" defer></script><script src="analytics.js" defer></script>
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeAttr(page.description)}">
  <meta property="og:title" content="${escapeAttr(page.title)}"><meta property="og:description" content="${escapeAttr(page.ogDescription ?? page.description)}">
  <meta property="og:image" content="https://mospochin.ru/og-image.svg"><meta property="og:url" content="${escapeAttr(canonical)}"><meta property="og:type" content="website"><meta property="og:locale" content="ru_RU">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="${escapeAttr(canonical)}">
  <meta name="robots" content="${escapeAttr(page.robots ?? 'noindex,follow')}">
  <script type="application/ld+json">${serviceSchema}</script>
  <script type="application/ld+json">${breadcrumbSchema}</script>
</head>
<body class="font-sans text-slate-800 antialiased bg-white branch-${escapeAttr(page.branch ?? 'restaurant')} ${escapeAttr(page.bodyClass ?? 'page-direct')} page-direct-landing page-${slug}" data-page-slug="${slug}" data-page-intent="promo" data-equipment="${escapeAttr(page.equipment ?? 'site')}" data-brand="${escapeAttr(page.brand ?? '')}" data-service="repair" data-commercial-segment="b2b_kitchen" data-page-version="${escapeAttr(page.pageVersion ?? '2026-07-14-direct-v1')}" data-direct-ad-ids="${escapeAttr((page.directAdIds ?? []).join(','))}">
  <div id="header-container" class="mt-12"></div>
  <main>
    <section class="bg-gradient-to-br from-brand-blue via-slate-900 to-slate-800 pb-16 pt-32 text-white lg:pb-20 lg:pt-44">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div><p class="text-sm font-extrabold uppercase tracking-[0.22em] text-brand-orange">${escapeHtml(page.eyebrow ?? 'Заявка из рекламы')}</p><h1 class="mt-4 text-3xl font-display font-extrabold leading-tight sm:text-5xl">${page.h1Html}</h1><p class="mt-5 text-lg leading-relaxed text-white/80">${escapeHtml(page.lead)} <strong class="text-white">${escapeHtml(page.leadStrong)}</strong></p><div class="mt-8 flex flex-wrap gap-3"><a class="rounded-xl bg-brand-orange px-6 py-4 font-extrabold text-white" href="#request" data-cta-id="${slug}_hero_form" data-cta-group="primary" data-block="hero">${escapeHtml(page.heroSubmitLabel)}</a><a class="rounded-xl border border-white/30 px-6 py-4 font-extrabold text-white" href="tel:+79990057172" data-contact-link="phone" data-cta-id="${slug}_hero_phone" data-cta-group="contact" data-block="hero">${escapeHtml(page.mobilePhoneLabel)}</a><a class="rounded-xl border border-green-400/40 bg-green-500/10 px-6 py-4 font-extrabold text-green-100" href="${escapeAttr(whatsappHref)}" data-contact-link="whatsapp" rel="noopener noreferrer" target="_blank" data-cta-id="${slug}_hero_whatsapp" data-cta-group="contact" data-block="hero">${escapeHtml(page.mobileWhatsappLabel)}</a></div></div>
          <form id="request" class="telegram-form rounded-3xl border border-white/15 bg-white p-6 text-slate-800 shadow-2xl" data-contact-form="true" data-cta-id="${slug}_form_01" data-cta-group="lead_form" data-block="hero_form"><input type="hidden" name="problem" value="${escapeAttr(page.hiddenProblem)}"><input type="hidden" name="campaign_id" value="${escapeAttr(page.campaignId ?? '')}"><input type="hidden" name="ad_group_id" value="${escapeAttr(page.adGroupId ?? '')}"><input type="hidden" name="direct_ad_ids" value="${escapeAttr((page.directAdIds ?? []).join(','))}"><h2 class="text-xl font-display font-extrabold text-brand-blue">${escapeHtml(page.quickFormTitle)}</h2><div class="mt-5 space-y-4"><input class="w-full rounded-xl border-2 border-slate-200 px-4 py-3" type="text" name="name" autocomplete="name" placeholder="Ваше имя"><input class="w-full rounded-xl border-2 border-slate-200 px-4 py-3" type="tel" name="phone" required autocomplete="tel" inputmode="tel" placeholder="+7 (___) ___-__-__">${formFieldsMarkup}</div><button class="mt-5 w-full rounded-xl bg-green-600 px-6 py-4 font-extrabold text-white" type="submit"><i class="ri-send-plane-line mr-2"></i>${escapeHtml(page.mainSubmitLabel)}</button></form>
        </div>
      </div>
    </section>
    <section class="bg-white py-14 lg:py-20"><div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div class="mx-auto max-w-3xl text-center"><p class="text-sm font-extrabold uppercase tracking-[0.22em] text-brand-orange">Перед выездом</p><h2 class="mt-3 text-3xl font-display font-extrabold text-brand-blue">${escapeHtml(page.analysisTitle)}</h2><p class="mt-4 leading-relaxed text-slate-600">${escapeHtml(page.analysisIntro)}</p></div><div class="mt-8 grid gap-4 md:grid-cols-3">${cards}</div></div></section>
    <section class="bg-slate-50 py-14 lg:py-20"><div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><h2 class="text-3xl font-display font-extrabold text-brand-blue">По теме</h2><div class="mt-8 grid gap-4 md:grid-cols-3">${links}</div></div></section>
    <section class="bg-white py-14"><div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"><h2 class="text-center text-3xl font-display font-extrabold text-brand-blue">Частые вопросы</h2><div class="mt-8 grid gap-4">${faqMarkup}</div></div></section>
  </main>
  <div id="footer-container"></div><div id="mobile-footer-container"></div><div id="whatsapp-float-container"></div>
</body>
</html>`;
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
  if (page.renderMode === 'compact-service-v1') return renderCompactServicePage(page);
  const slug = pageSlug(page.file);
  let html = baseHtmlFor(page);
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

for (const page of pagesToGenerate) {
  const outputPath = path.join(rootDir, page.file);
  fs.writeFileSync(outputPath, buildPage(page));
  upsertMetadata(page);
}

metadata.pages = Object.fromEntries(
  Object.entries(metadata.pages).sort(([left], [right]) => left.localeCompare(right, 'ru')),
);

fs.writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);

const sourcePages = [...new Set(pagesToGenerate.map((page) => page.renderMode ?? sourcePageFor(page)))];
console.log(`Generated ${pagesToGenerate.length} Direct landing page(s) using ${sourcePages.join(', ')}`);
