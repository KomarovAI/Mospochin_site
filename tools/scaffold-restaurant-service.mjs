import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');

const TAXONOMY_PATH = path.join(SITE_ROOT, 'data/restaurant-taxonomy.json');
const POLICY_PATH = path.join(SITE_ROOT, 'data/restaurant-page-policy.json');
const METADATA_PATH = path.join(SITE_ROOT, 'data/page-metadata.json');
const REGISTRY_PATH = path.join(SITE_ROOT, 'data/restaurant-services.json');
const SLOTS_PATH = path.join(SITE_ROOT, 'data/restaurant-page-slots.json');
const BRANCH_PATH = path.join(SITE_ROOT, 'data/restaurant-branch.json');

function parseArgs(argv) {
  const result = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      result._.push(token);
      continue;
    }
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      result[key] = true;
      continue;
    }
    result[key] = next;
    index += 1;
  }
  return result;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function toArray(value) {
  if (!value || value === true) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function ensureRequired(value, label) {
  if (!value || value === true) {
    throw new Error(`Missing required argument --${label}`);
  }
  return String(value).trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function slugToClass(slug) {
  return slug.replace(/[^a-z0-9-]/gi, '-');
}

function insertBeforeFooterLinks(footerLinks, entry) {
  const insertAt = footerLinks.findIndex((link) => ['about.html', 'contact.html'].includes(link.href));
  if (insertAt === -1) {
    footerLinks.push(entry);
    return;
  }
  footerLinks.splice(insertAt, 0, entry);
}

function buildRelatedPages({ family, registry, taxonomy, page }) {
  const rules = taxonomy.relatedRules ?? {};
  const maxLinks = Number.isInteger(rules.maxLinks) ? rules.maxLinks : 3;
  const devices = new Map((taxonomy.devices ?? []).map((entry) => [entry.page, entry]));

  return (registry.services ?? [])
    .filter((entry) => entry.page !== page && !entry.isShadow)
    .sort((a, b) => {
      const aFamily = devices.get(a.page)?.family;
      const bFamily = devices.get(b.page)?.family;
      if (aFamily === family && bFamily !== family) return -1;
      if (bFamily === family && aFamily !== family) return 1;
      return 0;
    })
    .slice(0, maxLinks)
    .map((entry) => entry.page);
}

function buildGenericFaq(deviceName, brandCluster) {
  const firstBrand = brandCluster[0] ?? 'типовые модели';
  return [
    {
      question: `Сколько обычно занимает ремонт ${deviceName.toLowerCase()}?`,
      answer: 'Большинство заявок закрываем за один выезд на объект. Если нужен сложный узловой ремонт, сразу проговариваем срок до начала работ.',
    },
    {
      question: 'Диагностика оплачивается отдельно?',
      answer: 'Сначала инженер определяет причину и только потом согласовывает стоимость. До начала работ называем понятный сценарий ремонта.',
    },
    {
      question: `Работаете ли вы с ${firstBrand}?`,
      answer: `Да, это одна из типовых линеек, с которыми работаем регулярно. До выезда уточняем модель, код ошибки и состояние оборудования.`,
    },
    {
      question: 'Работаете с ресторанами и юрлицами?',
      answer: 'Да. Работаем по договору, закрываем заявку актом и даём гарантию на выполненные работы и установленные запчасти.',
    },
  ];
}

function buildFormHints(primarySymptoms, deviceName) {
  return {
    chips: [
      'Уточним модель и код ошибки',
      'Скажем, насколько критичен простой',
      'Согласуем окно выезда на объект',
    ],
    typePlaceholder: `${deviceName} ${primarySymptoms[0] ? primarySymptoms[0] : ''}`.trim(),
    problemPlaceholder: primarySymptoms.length ? `${primarySymptoms.join(', ')}...` : 'Опишите проблему и код ошибки...',
  };
}

function buildRequestOverview(deviceName) {
  return {
    badge: 'ЧТО ПОЛЕЗНО УКАЗАТЬ СРАЗУ',
    title: 'Чтобы быстрее понять сценарий по объекту',
    description: `Для категории «${deviceName}» важно сразу получить модель, симптом и понять, насколько критичен простой для смены.`,
    chips: [
      'Модель и симптом',
      'Насколько критичен простой',
      'Окно выезда на объект',
    ],
  };
}

function buildFormExample(deviceName, primarySymptoms) {
  return `${deviceName} ${primarySymptoms[0] ?? 'не работает'}, ресторан в Москве, нужен выезд инженера`;
}

function buildFaqMarkup(faq) {
  return faq
    .map(
      (item, index) => `                    <details class="faq-item bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border-2 border-slate-100 cursor-pointer scroll-reveal" data-delay="${index + 1}"><summary class="font-bold text-brand-blue text-base sm:text-lg flex items-center justify-between"><span>${escapeHtml(item.question)}</span><span class="text-brand-orange transition-transform duration-300">+</span></summary><p class="mt-4 text-slate-600">${escapeHtml(item.answer)}</p></details>`
    )
    .join('\n');
}

function buildHtml({
  page,
  slug,
  title,
  description,
  canonical,
  serviceName,
  deviceName,
  schemaName,
  primarySymptoms,
  formHints,
  requestOverview,
  faq,
}) {
  return `<!DOCTYPE html>
<html lang="ru" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="favicon.svg" type="image/svg+xml">
    <link rel="preload" href="/assets/fonts/manrope.css" as="style">
    <link rel="stylesheet" href="/assets/fonts/manrope.css">
    <link rel="preload" href="/assets/fonts/remixicon.css" as="style">
    <link rel="stylesheet" href="/assets/fonts/remixicon.css">
    <link rel="preload" href="styles-combined.css" as="style">
    <link rel="stylesheet" href="styles-combined.css">
    <script src="main.js" defer></script>
    <script src="telegram-form.js" defer></script>
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="https://mospochin.ru/og-image.svg">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="ru_RU">
    <meta name="twitter:card" content="summary_large_image">
    <script type="application/ld+json" data-slot="service-schema">
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "${escapeHtml(schemaName)}",
      "description": "${escapeHtml(description)}",
      "provider": {
        "@type": "LocalBusiness",
        "name": "MosPochin",
        "telephone": "+79990057172",
        "url": "https://mospochin.ru",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Москва",
          "addressCountry": "RU"
        }
      },
      "areaServed": {
        "@type": "City",
        "name": "Москва"
      }
    }
    </script>
    <link rel="canonical" href="${escapeHtml(canonical)}">
</head>
<body class="font-sans text-slate-800 antialiased bg-white branch-restaurant page-restaurant-service page-${slugToClass(slug)}">
    <!-- Normalized layout shell: ${page} -->
    <div id="header-container"></div>
    <section class="pt-24 pb-16 bg-gradient-to-br from-slate-50 via-white to-green-50">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="max-w-3xl">
                <span class="inline-flex items-center rounded-full bg-green-100 text-green-700 px-4 py-2 text-sm font-bold mb-6">РЕСТОРАННАЯ ВЕТКА</span>
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-brand-blue leading-tight mb-6">${escapeHtml(serviceName)}</h1>
                <p class="text-slate-600 text-lg sm:text-xl max-w-2xl mb-8">${escapeHtml(description)}</p>
                <div class="flex flex-wrap gap-3">
                    ${primarySymptoms.map((symptom) => `<span class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">${escapeHtml(symptom)}</span>`).join('')}
                </div>
            </div>
        </div>
    </section>
    <section id="request" class="py-20 lg:py-28 bg-gradient-to-br from-slate-50 to-white">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <span class="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-4">ВЫЕЗД НА ОБЪЕКТ</span>
                <h2 class="text-3xl lg:text-4xl font-display font-extrabold text-brand-blue mb-4">Оставьте заявку на ремонт</h2>
                <p class="text-slate-600 text-lg max-w-2xl mx-auto">Укажите модель и проблему. Сразу скажем, как действовать по смене и насколько срочный выезд нужен.</p>
            </div>
            <form class="telegram-form bg-white p-6 lg:p-10 rounded-2xl shadow-lg border border-slate-200" data-slot="request-form">
<!-- sync:request-overview:start owner="tools/restaurant-sync-fallbacks.mjs" source="data/restaurant-page-slots.json,data/restaurant-proof-layer.json,data/restaurant-services.json" -->
                <div data-sync-zone="request-overview" class="mb-6 rounded-3xl border border-slate-200 bg-slate-50/90 p-4 sm:p-5 lg:p-6">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="inline-flex items-center rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-green-700">${escapeHtml(requestOverview.badge)}</span>
                    </div>
                    <h3 class="mt-4 text-xl sm:text-2xl font-display font-extrabold text-brand-blue">${escapeHtml(requestOverview.title)}</h3>
                    <p class="mt-3 text-slate-600">${escapeHtml(requestOverview.description)}</p>
                    <div class="mt-4 flex flex-wrap gap-2">
                        ${requestOverview.chips.map((chip) => `<span class="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium bg-brand-orange/10 text-brand-orange">${escapeHtml(chip)}</span>`).join('')}
                    </div>
                </div>
<!-- sync:request-overview:end -->
                <div class="grid md:grid-cols-2 gap-6 mb-6">
                    <div><label class="block text-sm font-medium text-slate-700 mb-2">Ваше имя *</label><input type="text" name="name" required placeholder="Дмитрий" class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition text-slate-700"></div>
                    <div><label class="block text-sm font-medium text-slate-700 mb-2">Телефон *</label><input type="tel" name="phone" required placeholder="+7 (___) ___-__-__" class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition text-slate-700"></div>
                </div>
                <div class="grid md:grid-cols-2 gap-6 mb-6">
                    <div><label class="block text-sm font-medium text-slate-700 mb-2">Тип оборудования</label><input type="text" name="type" placeholder="${escapeHtml(formHints.typePlaceholder)}" class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition text-slate-700"></div>
                    <div><label class="block text-sm font-medium text-slate-700 mb-2">Что случилось?</label><input type="text" name="problem" placeholder="${escapeHtml(formHints.problemPlaceholder)}" class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition text-slate-700"></div>
                </div>
                <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-bold px-8 py-4 rounded-xl transition shadow-lg">
                    <i class="ri-send-plane-line mr-2"></i>Отправить заявку
                </button>
            </form>
        </div>
    </section>
<!-- sync:service-proof:start owner="tools/restaurant-sync-fallbacks.mjs" source="data/restaurant-page-slots.json,data/restaurant-proof-layer.json,data/restaurant-services.json" -->
    <section data-sync-zone="service-proof" class="py-16 lg:py-20 bg-white"></section>
<!-- sync:service-proof:end -->
<!-- sync:related-links:start owner="tools/restaurant-sync-fallbacks.mjs" source="data/restaurant-page-slots.json,data/restaurant-proof-layer.json,data/restaurant-services.json" -->
    <section data-sync-zone="related-links" class="py-16 lg:py-20 bg-slate-50"></section>
<!-- sync:related-links:end -->
    <section class="py-20 bg-white">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <span class="inline-block bg-brand-orange/10 text-brand-orange px-4 py-2 rounded-full text-sm font-bold mb-4">FAQ</span>
                <h2 class="text-3xl lg:text-4xl font-display font-extrabold text-brand-blue mb-4">Частые вопросы по ремонту</h2>
            </div>
            <div class="grid lg:grid-cols-2 gap-4 lg:gap-6" data-sync-zone="faq-items">
<!-- sync:faq-items:start owner="tools/restaurant-sync-fallbacks.mjs" source="data/restaurant-page-slots.json,data/restaurant-proof-layer.json,data/restaurant-services.json" -->
${buildFaqMarkup(faq)}
<!-- sync:faq-items:end -->
            </div>
        </div>
    </section>
    <div id="footer-container"></div>
</body>
</html>`;
}

try {
  const args = parseArgs(process.argv.slice(2));
  const slug = ensureRequired(args.slug, 'slug');
  const page = `${slug}.html`;
  const deviceName = ensureRequired(args['device-name'], 'device-name');
  const uiLabel = ensureRequired(args['ui-label'], 'ui-label');
  const serviceName = ensureRequired(args['service-name'], 'service-name');
  const schemaName = args['schema-name'] ? String(args['schema-name']).trim() : serviceName;
  const family = ensureRequired(args.family, 'family');
  const icon = args.icon ? String(args.icon).trim() : '🔧';
  const title = args.title ? String(args.title).trim() : `${serviceName} в Москве | MosPochin`;
  const description = args.description
    ? String(args.description).trim()
    : `${serviceName} с выездом по Москве. Диагностика, понятная смета до работ, ремонт ресторанного оборудования на объекте.`;
  const canonical = args.canonical
    ? String(args.canonical).trim()
    : `https://mospochin.ru/${page}`;
  const primarySymptoms = toArray(args.symptoms);
  const brandCluster = toArray(args.brands);

  if (!primarySymptoms.length) {
    throw new Error('Pass --symptoms with at least one comma-separated symptom');
  }

  if (!brandCluster.length) {
    throw new Error('Pass --brands with at least one comma-separated brand');
  }

  const taxonomy = readJson(TAXONOMY_PATH);
  const policy = readJson(POLICY_PATH);
  const metadata = readJson(METADATA_PATH);
  const registry = readJson(REGISTRY_PATH);
  const slots = readJson(SLOTS_PATH);
  const branch = readJson(BRANCH_PATH);

  if (!Array.isArray(taxonomy.families) || !taxonomy.families.some((entry) => entry.slug === family)) {
    throw new Error(`Unknown restaurant family: ${family}`);
  }

  if (fs.existsSync(path.join(SITE_ROOT, page))) {
    throw new Error(`Page already exists: ${page}`);
  }

  if (metadata.pages?.[page]) {
    throw new Error(`Metadata entry already exists for ${page}`);
  }

  if ((registry.services ?? []).some((entry) => entry.page === page)) {
    throw new Error(`Registry entry already exists for ${page}`);
  }

  const sectionIds = Array.from(new Set(policy.publicPage?.requiredSectionIds ?? ['request']));
  const relatedPages = buildRelatedPages({ family, registry, taxonomy, page });
  const faq = buildGenericFaq(deviceName, brandCluster);
  const formHints = buildFormHints(primarySymptoms, deviceName);
  const requestOverview = buildRequestOverview(deviceName);
  const formExample = buildFormExample(deviceName, primarySymptoms);

  fs.writeFileSync(
    path.join(SITE_ROOT, page),
    buildHtml({
      page,
      slug,
      title,
      description,
      canonical,
      serviceName,
      deviceName,
      schemaName,
      primarySymptoms,
      formHints,
      requestOverview,
      faq,
    })
  );

  metadata.pages[page] = {
    title,
    description,
    canonical,
    ogUrl: canonical,
    branch: 'restaurant',
    hasForm: true,
  };

  registry.services.push({
    page,
    slug,
    uiLabel,
    deviceName,
    serviceName,
    schemaName,
    isShadow: false,
    primarySymptoms,
    brandCluster,
    relatedPages,
    formExample,
    sectionIds,
  });

  slots.pages[page] = {
    formHints,
    requestOverview,
    faq,
  };

  taxonomy.devices.push({
    page,
    slug,
    deviceName,
    family,
    isShadow: false,
  });

  branch.services.push({
    href: page,
    icon,
    name: uiLabel,
  });
  insertBeforeFooterLinks(branch.footerLinks, {
    href: page,
    label: uiLabel,
  });

  writeJson(METADATA_PATH, metadata);
  writeJson(REGISTRY_PATH, registry);
  writeJson(SLOTS_PATH, slots);
  writeJson(TAXONOMY_PATH, taxonomy);
  writeJson(BRANCH_PATH, branch);

  console.log(`Scaffolded restaurant service page ${page}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
