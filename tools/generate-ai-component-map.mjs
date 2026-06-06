#!/usr/bin/env node
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { listProjectHtmlFiles, readProjectFile } from './ai-semantic-lib.mjs';
import { parseArgs, ROOT_DIR } from './ai-maintenance-lib.mjs';

const args = parseArgs();
const check = Boolean(args.check);

const definitions = {
  globalNavigation: {
    name: 'Глобальная навигация / header',
    keywords: ['меню', 'навигац', 'header', 'шапка', 'nav'],
    match: (html) => /<nav\b|mobile-menu|data-mobile|ri-menu|href=["']\/?.*contact/i.test(html),
    cssSelectors: ['nav', '.mobile-menu', '[data-mobile-menu]', '.btn-click'],
    jsHooks: ['mobile-menu', 'DOMContentLoaded'],
    relatedFiles: ['main.js', 'styles-combined.css'],
    risks: ['Может затронуть все страницы и мобильное меню.', 'Проверь tel/WhatsApp ссылки и active state.'],
    safeEditingNotes: ['Можно менять визуал и порядок ссылок, но сохраняй доступность, href и mobile behavior.'],
  },
  hero: {
    name: 'Hero / первый экран',
    keywords: ['hero', 'первый экран', 'обложка', 'главный блок', 'заголовок', 'h1'],
    match: (html) => /SECTION\s+1:\s+HERO|hero-animate|<header\b[^>]*class=["'][^"']*(pt-32|overflow-hidden)|fetchpriority=["']high/i.test(html),
    cssSelectors: ['.hero-animate', '.hero-animate-delay-*', 'header .glass-card'],
    jsHooks: [],
    relatedFiles: ['styles-combined.css'],
    risks: ['Hero часто содержит H1, CTA, high-priority image и background.', 'Не потеряй fetchpriority/eager для главного изображения, если оно действительно hero.'],
    safeEditingNotes: ['Это safe-to-redesign зона, но H1, CTA и контактные ссылки лучше сохранять.'],
  },
  leadForm: {
    name: 'Форма заявки / Telegram submit',
    keywords: ['форма', 'заявк', 'telegram', 'телеграм', 'лид', 'обратн', 'phone', 'телефон'],
    match: (html) => /telegram-form|data-slot=["']request-form|\/api\/send-telegram|name=["']phone/i.test(html),
    cssSelectors: ['.telegram-form', '.form-field', '[data-slot="request-form"]'],
    jsHooks: ['telegram-form', 'submit', '/api/send-telegram'],
    relatedFiles: ['telegram-form.js', 'server/telegram-api.mjs', 'data/contact-config.json'],
    risks: ['Форма собирает персональные данные.', 'Нельзя ломать name/phone, consent checkbox, action/method и endpoint.', 'Проверь label/id/for и autocomplete.'],
    safeEditingNotes: ['Можно менять UX/тексты, но сохраняй контракт полей и fallback action="/api/send-telegram".'],
  },
  contactLinks: {
    name: 'Контакты: телефон, WhatsApp, Telegram',
    keywords: ['контакты', 'телефон', 'whatsapp', 'ватсап', 'telegram', 'связь', 'позвонить'],
    match: (html) => /data-contact-link|href=["']tel:|wa\.me|ri-whatsapp|ri-phone/i.test(html),
    cssSelectors: ['[data-contact-link]', '.btn-click'],
    jsHooks: ['data-contact-link'],
    relatedFiles: ['data/contact-config.json', 'data/runtime-config.json', 'main.js'],
    risks: ['Телефон/мессенджеры должны быть синхронизированы по всему сайту.', 'Не менять один HTML вручную, если это глобальный контакт.'],
    safeEditingNotes: ['Для глобальной замены лучше менять contact-config/runtime-config и затем прогонять проверки.'],
  },
  countdown: {
    name: 'Countdown / таймер акции',
    keywords: ['таймер', 'countdown', 'акция', 'минут', 'секунд', 'скидк'],
    match: (html) => /data-countdown-min|data-countdown-sec/i.test(html),
    cssSelectors: ['[data-countdown-min]', '[data-countdown-sec]'],
    jsHooks: ['data-countdown-min', 'data-countdown-sec', 'querySelectorAll'],
    relatedFiles: ['main.js'],
    risks: ['На странице может быть несколько таймеров; обновлять нужно все элементы через querySelectorAll.'],
    safeEditingNotes: ['Не возвращай id="cd-min"/"cd-sec" — это ломает несколько таймеров.'],
  },
  faqAccordion: {
    name: 'FAQ / аккордеон вопросов',
    keywords: ['faq', 'вопрос', 'ответ', 'аккордеон', 'частые вопросы'],
    match: (html) => /FAQ|FAQPage|Частые вопросы|faq|toggleFAQ/i.test(html),
    cssSelectors: ['.faq', '[onclick*="toggleFAQ"]'],
    jsHooks: ['toggleFAQ'],
    relatedFiles: ['main.js', 'content/faq/page-faq-registry.json', 'tools/generate-faq-registry.mjs', 'data/household-page-slots.json', 'data/restaurant-page-slots.json'],
    risks: ['FAQ влияет на SEO и schema.org FAQPage.', 'Не оставляй вопрос без ответа.'],
    safeEditingNotes: ['После изменений FAQ запускай generate:faq-registry, build:site -- --write, validate:data и semantic diff страницы.'],
  },
  schemaJsonLd: {
    name: 'Schema.org JSON-LD',
    keywords: ['schema', 'json-ld', 'ld+json', 'structured data', 'микроразметка'],
    match: (html) => /application\/ld\+json/i.test(html),
    cssSelectors: [],
    jsHooks: [],
    relatedFiles: ['data/schema-profile.json', 'data/page-metadata.json', 'content/faq/schema/', 'tools/generate-faq-registry.mjs'],
    risks: ['Невалидный JSON-LD может сломать rich results.', 'Не удалять LocalBusiness/FAQPage без причины.'],
    safeEditingNotes: ['Любое изменение schema проверять validate:site и semantic diff.'],
  },
  responsiveImages: {
    name: 'Responsive images / srcset / WebP sidecars',
    keywords: ['картинка', 'изображ', 'фото', 'srcset', 'webp', 'avif', 'responsive', 'hero image'],
    match: (html) => /srcset=|<picture\b|\/assets\/images\/responsive\//i.test(html),
    cssSelectors: ['img[srcset]', 'picture source'],
    jsHooks: [],
    relatedFiles: ['tools/generate-responsive-images.mjs', 'tools/generate-webp-sidecars.mjs', 'assets/images/'],
    risks: ['Оригиналы не пережимаем; production-деривативы генерируются.', 'Не-hero изображения должны быть lazy, hero — eager/fetchpriority по месту.'],
    safeEditingNotes: ['После добавления/замены images запускай generate:responsive-images и check:webp-sidecars.'],
  },
  floatingWhatsApp: {
    name: 'Floating WhatsApp CTA',
    keywords: ['whatsapp float', 'плавающ', 'ватсап кнопка', 'whatsapp кнопка'],
    match: (html) => /whatsapp-float-container/i.test(html),
    cssSelectors: ['#whatsapp-float-container'],
    jsHooks: ['whatsapp-float-container'],
    relatedFiles: ['main.js', 'data/contact-config.json'],
    risks: ['Плавающая кнопка не должна перекрывать формы и mobile CTA.'],
    safeEditingNotes: ['После изменения проверяй мобильный layout и контактные ссылки.'],
  },
  deploySecurity: {
    name: 'Deploy / security headers / compression',
    keywords: ['deploy', 'деплой', 'nginx', 'headers', 'csp', 'brotli', 'gzip', 'безопасност'],
    match: () => false,
    cssSelectors: [],
    jsHooks: [],
    relatedFiles: ['deploy/post-activate.sh', '.deploy/include-files.txt', '.github/workflows/deploy.yml'],
    risks: ['High-risk зона: может сломать публикацию, сжатие, заголовки или rollback.'],
    safeEditingNotes: ['Всегда bash -n для shell и ручной review workflow/deploy.'],
  },
};

function sharedComponentUsage() {
  const manifestPath = join(ROOT_DIR, 'src/site-builder.json');
  if (!existsSync(manifestPath)) return { pages: [], refs: 0, files: 0 };
  try {
    const manifest = JSON.parse(readProjectFile('src/site-builder.json'));
    const pages = [];
    let refs = 0;
    const files = new Set();
    for (const entry of manifest.pages || []) {
      const model = JSON.parse(readProjectFile(entry.model));
      const pageRefs = (model.sections || []).filter((section) => section.componentRef);
      if (pageRefs.length) pages.push(entry.page);
      refs += pageRefs.length;
      for (const section of pageRefs) files.add(section.componentRef);
    }
    return { pages, refs, files: files.size };
  } catch {
    return { pages: [], refs: 0, files: 0 };
  }
}

function parametricComponentUsage() {
  const manifestPath = join(ROOT_DIR, 'src/site-builder.json');
  if (!existsSync(manifestPath)) return { pages: [], refs: 0, templates: 0, propsFiles: 0, byTemplate: {} };
  try {
    const manifest = JSON.parse(readProjectFile('src/site-builder.json'));
    const pages = [];
    let refs = 0;
    const templates = new Set();
    const propsFiles = new Set();
    const byTemplate = {};
    for (const entry of manifest.pages || []) {
      const model = JSON.parse(readProjectFile(entry.model));
      const pageRefs = (model.sections || []).filter((section) => section.componentMode === 'parametric' || section.templateRef);
      if (pageRefs.length) pages.push(entry.page);
      refs += pageRefs.length;
      for (const section of pageRefs) {
        if (section.templateRef) {
          templates.add(section.templateRef);
          byTemplate[section.templateRef] ||= { refs: 0, pages: [] };
          byTemplate[section.templateRef].refs += 1;
          if (!byTemplate[section.templateRef].pages.includes(entry.page)) byTemplate[section.templateRef].pages.push(entry.page);
        }
        if (section.propsRef) propsFiles.add(section.propsRef);
      }
    }
    return { pages, refs, templates: templates.size, propsFiles: propsFiles.size, byTemplate };
  } catch {
    return { pages: [], refs: 0, templates: 0, propsFiles: 0, byTemplate: {} };
  }
}

function buildMap() {
  const htmlFiles = listProjectHtmlFiles();
  const components = {};
  for (const [id, def] of Object.entries(definitions)) {
    const appearsIn = [];
    for (const page of htmlFiles) {
      const html = readProjectFile(page) || '';
      if (def.match(html, page)) appearsIn.push(page);
    }
    components[id] = {
      id,
      name: def.name,
      keywords: def.keywords,
      appearsIn,
      appearsInCount: appearsIn.length,
      cssSelectors: def.cssSelectors,
      jsHooks: def.jsHooks,
      relatedFiles: def.relatedFiles,
      risks: def.risks,
      safeEditingNotes: def.safeEditingNotes,
    };
  }
  const sharedUsage = sharedComponentUsage();

  const paramUsage = parametricComponentUsage();
  components.parametricComponents = {
    id: 'parametricComponents',
    name: 'Parameterized components / template + props',
    keywords: ['parametric', 'parameterized', 'templateRef', 'propsRef', 'content/components', 'параметризованные компоненты'],
    appearsIn: paramUsage.pages,
    appearsInCount: paramUsage.pages.length,
    cssSelectors: [],
    jsHooks: [],
    relatedFiles: ['src/components/parametric/', 'content/components/', 'tools/site-builder-parameterize-core.mjs', 'tools/site-builder-lib.mjs'],
    risks: ['Template может изменить сразу много страниц; props меняют конкретные page-specific значения.', 'Всегда проверяй hash/render через check:parameterized-components.'],
    safeEditingNotes: [
      `Parametric refs: ${paramUsage.refs}, templates: ${paramUsage.templates}, props files: ${paramUsage.propsFiles}.`,
      'Для текста конкретной страницы меняй content/components/*/*.json; для разметки меняй template.html.',
      'После правки запускай check:parameterized-components и check:site-builder.',
    ],
    templates: paramUsage.byTemplate,
  };
  components.sharedSectionComponents = {
    id: 'sharedSectionComponents',
    name: 'Shared section components / общие HTML-секции',
    keywords: ['shared', 'компонент', 'общие секции', 'дубли', 'src/components/shared'],
    appearsIn: sharedUsage.pages,
    appearsInCount: sharedUsage.pages.length,
    cssSelectors: [],
    jsHooks: [],
    relatedFiles: ['src/components/shared/', 'src/site-builder.json', 'tools/site-builder-extract-shared.mjs', 'tools/site-builder-lib.mjs'],
    risks: ['Один shared component может менять сразу несколько страниц.', 'Builder output должен оставаться синхронным с root HTML.'],
    safeEditingNotes: [
      `Сейчас shared refs: ${sharedUsage.refs}, shared files: ${sharedUsage.files}.`,
      'После правки src/components/shared/* запускай check:shared-components и check:site-builder.',
    ],
  };

  return {
    schemaVersion: 1,
    generatedAt: new Date(0).toISOString(),
    note: 'AI-readable component map. Regenerate with npm run generate:ai-component-map after broad markup/component changes.',
    components,
  };
}

const next = buildMap();
const outPath = join(ROOT_DIR, 'data/ai-component-map.json');
const json = `${JSON.stringify(next, null, 2)}\n`;

if (check) {
  const current = readProjectFile('data/ai-component-map.json');
  if (current !== json) {
    console.error('❌ data/ai-component-map.json устарел. Запусти npm run generate:ai-component-map');
    process.exit(1);
  }
  console.log('✅ data/ai-component-map.json актуален');
} else {
  writeFileSync(outPath, json);
  console.log('✅ generated data/ai-component-map.json');
}
