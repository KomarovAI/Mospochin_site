import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');

const TAXONOMY_PATH = path.join(SITE_ROOT, 'data/household-taxonomy.json');
const POLICY_PATH = path.join(SITE_ROOT, 'data/household-page-policy.json');
const METADATA_PATH = path.join(SITE_ROOT, 'data/page-metadata.json');
const REGISTRY_PATH = path.join(SITE_ROOT, 'data/household-services.json');
const SLOTS_PATH = path.join(SITE_ROOT, 'data/household-page-slots.json');
const BRANCH_PATH = path.join(SITE_ROOT, 'data/household-branch.json');

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
  const insertAt = footerLinks.findIndex((link) =>
    ['bytovaya-about.html', 'bytovaya-contact.html'].includes(link.href)
  );
  if (insertAt === -1) {
    footerLinks.push(entry);
    return;
  }
  footerLinks.splice(insertAt, 0, entry);
}

function buildRelatedPages({ family, registry, taxonomy, page, isShadow }) {
  const familyMap = new Map((taxonomy.families ?? []).map((entry) => [entry.slug, entry]));
  const deviceMap = new Map((taxonomy.devices ?? []).map((entry) => [entry.page, entry]));
  const rules = taxonomy.relatedRules ?? {};
  const maxLinks = Number.isInteger(rules.maxLinks) ? rules.maxLinks : 3;
  const familyEntry = familyMap.get(family);
  const allowedFamilies = new Set([family, ...(familyEntry?.relatedFamilies ?? [])]);

  return (registry.services ?? [])
    .filter((entry) => entry.page !== page)
    .filter((entry) => (isShadow ? true : !entry.isShadow))
    .filter((entry) => {
      const device = deviceMap.get(entry.page);
      return device && allowedFamilies.has(device.family);
    })
    .slice(0, maxLinks)
    .map((entry) => entry.page);
}

function buildGenericFaq(deviceName, serviceName, primarySymptoms, brandCluster) {
  const firstBrand = brandCluster[0] ?? 'типовые модели';
  const firstSymptom = primarySymptoms[0] ?? 'основные симптомы';

  return [
    {
      question: `Сколько обычно занимает ${serviceName.toLowerCase()}?`,
      answer:
        'Большинство бытовых заявок закрываем за один визит. Если нужен сложный узловой ремонт или редкая запчасть, время согласуем после диагностики.',
    },
    {
      question: 'Диагностика действительно бесплатная при ремонте?',
      answer:
        'Да. Сначала объясняем причину, называем стоимость и только после вашего согласия переходим к работам.',
    },
    {
      question: `Что делать, если ${deviceName.toLowerCase()} ${firstSymptom}?`,
      answer:
        'Лучше не продолжать пользоваться техникой вслепую. По телефону подскажем безопасные шаги до приезда мастера.',
    },
    {
      question: `Работаете ли вы с ${firstBrand} и похожими бытовыми моделями?`,
      answer:
        'Да, берём в работу распространённые бытовые бренды и сразу говорим, когда ремонт разумен, а когда лучше не вкладываться.',
    },
    {
      question: 'Когда вы сразу говорите, что ремонт невыгоден?',
      answer:
        'Если видим, что стоимость ремонта несоразмерна состоянию техники или цене замены, честно проговариваем это до начала работ.',
    },
  ];
}

function buildFormHints(primarySymptoms, brandCluster) {
  const symptomPreview = primarySymptoms.join(', ');
  const brandPreview = brandCluster.slice(0, 4).join(', ');

  return {
    chips: [
      'Уточним симптомы до выезда',
      'Согласуем удобное окно визита',
      'Без навязанных замен и скрытых доплат',
    ],
    typePlaceholder: brandPreview ? `${brandPreview}...` : 'Бренд и модель...',
    problemPlaceholder: symptomPreview ? `${symptomPreview}...` : 'Что именно происходит с техникой...',
  };
}

function buildFormExample(deviceName, brandCluster, primarySymptoms) {
  const brand = brandCluster[0] ?? 'модель';
  const symptom = primarySymptoms[0] ?? 'не работает';
  return `${deviceName} ${brand} ${symptom}, Москва, нужен выезд на дом`;
}

function buildHtml({
  page,
  slug,
  title,
  description,
  canonical,
  robots,
  serviceName,
  deviceName,
  uiLabel,
  schemaName,
  primarySymptoms,
  brandCluster,
  formHints,
  faq,
}) {
  const symptomCards = primarySymptoms
    .map(
      (symptom) => `
                    <div class="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                        <p class="text-sm font-bold text-brand-blue">${escapeHtml(symptom)}</p>
                    </div>`
    )
    .join('\n');

  const brandChips = brandCluster
    .map(
      (brand) => `
                    <span class="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">${escapeHtml(brand)}</span>`
    )
    .join('\n');

  const faqItems = faq
    .map(
      (item) => `
                <details class="faq-item rounded-2xl border-2 border-slate-100 bg-white p-6">
                    <summary class="flex items-center justify-between text-lg font-bold text-brand-blue">
                        <span>${escapeHtml(item.question)}</span>
                        <span class="text-brand-orange">+</span>
                    </summary>
                    <p class="mt-4 text-slate-600">${escapeHtml(item.answer)}</p>
                </details>`
    )
    .join('\n');

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
    <link rel="preload" href="styles-built.css" as="style">
    <link rel="stylesheet" href="styles-built.css">
    <link rel="preload" href="styles.css" as="style">
    <link rel="stylesheet" href="styles.css">
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
    ${robots ? `<meta name="robots" content="${escapeHtml(robots)}">` : ''}
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

<body class="font-sans text-slate-800 antialiased bg-white page-household-service page-${slugToClass(slug)}">
    <!-- Normalized layout shell: ${page} -->
    <div id="header-container"></div>

    <header class="relative overflow-hidden bg-slate-950 text-white">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.18),_transparent_34%),radial-gradient(circle_at_left,_rgba(59,130,246,0.18),_transparent_36%)]"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div class="max-w-3xl">
                <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80">
                    <i class="ri-home-gear-line text-brand-orange"></i>${escapeHtml(uiLabel)}
                </span>
                <h1 class="mt-6 text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white">${escapeHtml(serviceName)} на дому</h1>
                <p class="mt-6 max-w-2xl text-lg text-white/75">Выезд по Москве и МО, диагностика причины до работ и спокойный бытовой сценарий без лишней логистики.</p>
                <div class="mt-8 flex flex-wrap gap-3">
                    <a href="#request" class="rounded-full bg-brand-orange px-6 py-3 font-bold text-white transition hover:bg-brand-orangeHover">Оставить заявку</a>
                    <a href="tel:+79990057172" class="rounded-full border border-white/15 bg-white/5 px-6 py-3 font-bold text-white transition hover:bg-white/10">8 (999) 005-71-72</a>
                </div>
            </div>
        </div>
    </header>

    <section id="problems" class="py-16 lg:py-24 bg-slate-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="max-w-3xl">
                <span class="inline-block rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-600">Частые ситуации</span>
                <h2 class="mt-4 text-3xl font-display font-extrabold text-brand-blue">С чем чаще всего обращаются по ${escapeHtml(deviceName.toLowerCase())}</h2>
                <p class="mt-4 text-slate-600">Этот scaffold создаёт базовый HTML-каркас. Дальше страницу можно гибко усиливать вручную, не ломая общий контракт household-ветки.</p>
            </div>
            <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
${symptomCards}
            </div>
        </div>
    </section>

    <section id="prices" class="py-16 lg:py-24 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div class="rounded-3xl border border-slate-200 bg-slate-50 p-8">
                    <h2 class="text-3xl font-display font-extrabold text-brand-blue">Как проходит заявка</h2>
                    <div class="mt-8 grid gap-4 md:grid-cols-3">
                        <div class="rounded-2xl bg-white p-5 shadow-sm">
                            <p class="text-sm font-bold text-brand-orange">1. Звонок или форма</p>
                            <p class="mt-3 text-sm text-slate-600">Уточняем модель, район и симптомы без длинной переписки.</p>
                        </div>
                        <div class="rounded-2xl bg-white p-5 shadow-sm">
                            <p class="text-sm font-bold text-brand-orange">2. Диагностика</p>
                            <p class="mt-3 text-sm text-slate-600">Сначала причина и стоимость, потом решение по ремонту.</p>
                        </div>
                        <div class="rounded-2xl bg-white p-5 shadow-sm">
                            <p class="text-sm font-bold text-brand-orange">3. Ремонт и гарантия</p>
                            <p class="mt-3 text-sm text-slate-600">Если ремонт разумен, закрываем заявку на месте и фиксируем результат.</p>
                        </div>
                    </div>
                </div>
                <div class="rounded-3xl bg-brand-blue p-8 text-white">
                    <p class="text-sm font-bold text-brand-orange">Базовый ценовой блок</p>
                    <h3 class="mt-3 text-2xl font-display font-extrabold">Цену называем после диагностики</h3>
                    <p class="mt-4 text-white/75">Сайт не обещает случайные цифры без осмотра. В HTML можно позже поставить детальную сетку работ именно для этой страницы.</p>
                    <ul class="mt-6 space-y-3 text-sm text-white/85">
                        <li><i class="ri-check-line mr-2 text-brand-orange"></i>Диагностика при ремонте бесплатно</li>
                        <li><i class="ri-check-line mr-2 text-brand-orange"></i>Согласование до начала работ</li>
                        <li><i class="ri-check-line mr-2 text-brand-orange"></i>Выезд по Москве и МО</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <section id="brands" class="py-16 lg:py-24 bg-slate-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="max-w-3xl">
                <span class="inline-block rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-bold text-brand-orange">Бренды</span>
                <h2 class="mt-4 text-3xl font-display font-extrabold text-brand-blue">С какими бытовыми моделями работаем</h2>
            </div>
            <div class="mt-10 flex flex-wrap gap-3">
${brandChips}
            </div>
        </div>
    </section>

    <section id="request" class="py-16 lg:py-24 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
                <div>
                    <span class="inline-block rounded-full bg-brand-blue/10 px-4 py-2 text-sm font-bold text-brand-blue">Заявка</span>
                    <h2 class="mt-4 text-3xl font-display font-extrabold text-brand-blue">Что лучше отправить сразу</h2>
                    <div class="mt-6 space-y-4 text-slate-600">
                        ${formHints.chips.map((chip) => `<p class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium">${escapeHtml(chip)}</p>`).join('\n                        ')}
                    </div>
                </div>
                <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
                    <form class="telegram-form space-y-5" data-slot="request-form">
                        <div class="grid gap-5 md:grid-cols-2">
                            <div>
                                <label class="mb-2 block text-sm font-medium text-slate-700">Ваше имя *</label>
                                <input type="text" name="name" required placeholder="Алексей" class="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-700 transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20">
                            </div>
                            <div>
                                <label class="mb-2 block text-sm font-medium text-slate-700">Телефон *</label>
                                <input type="tel" name="phone" required placeholder="+7 (___) ___-__-__" class="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-700 transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20">
                            </div>
                        </div>
                        <div>
                            <label class="mb-2 block text-sm font-medium text-slate-700">Техника или модель</label>
                            <input type="text" name="type" placeholder="${escapeHtml(formHints.typePlaceholder)}" class="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-700 transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20">
                        </div>
                        <div>
                            <label class="mb-2 block text-sm font-medium text-slate-700">Что происходит?</label>
                            <input type="text" name="problem" placeholder="${escapeHtml(formHints.problemPlaceholder)}" class="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-700 transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20">
                        </div>
                        <button type="submit" class="w-full rounded-xl bg-brand-orange px-8 py-4 text-lg font-bold text-white transition hover:bg-brand-orangeHover">
                            <i class="ri-send-plane-line mr-2"></i>Оставить заявку на звонок
                        </button>
                        <p class="text-center text-sm text-slate-400">Контакты используем только для связи по этой заявке.</p>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <section class="py-16 lg:py-24 bg-slate-50">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <span class="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">FAQ</span>
                <h2 class="mt-4 text-3xl font-display font-extrabold text-brand-blue">Частые вопросы по странице ${escapeHtml(uiLabel)}</h2>
            </div>
            <div class="mt-10 space-y-4">
${faqItems}
            </div>
        </div>
    </section>

    <div id="footer-container"></div>
</body>

</html>
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const slug = ensureRequired(args.slug, 'slug');
  const deviceName = ensureRequired(args['device-name'], 'device-name');
  const uiLabel = ensureRequired(args['ui-label'], 'ui-label');
  const serviceName = ensureRequired(args['service-name'], 'service-name');
  const family = ensureRequired(args.family, 'family');

  const isShadow = Boolean(args.shadow);
  const page = String(args.page || `${slug}.html`);
  const schemaName = String(args['schema-name'] || serviceName);
  const icon = String(args.icon || '🔧');
  const title = String(args.title || `${serviceName} на дому в Москве — MosPochin`);
  const description = String(
    args.description ||
      `${serviceName} на дому в Москве и МО. Диагностика причины, согласование работ и гарантия после ремонта.`
  );
  const canonical = `https://mospochin.ru/${page}`;
  const robots = isShadow ? 'noindex,follow' : null;

  const taxonomy = readJson(TAXONOMY_PATH);
  const policy = readJson(POLICY_PATH);
  const metadata = readJson(METADATA_PATH);
  const registry = readJson(REGISTRY_PATH);
  const slots = readJson(SLOTS_PATH);
  const branch = readJson(BRANCH_PATH);

  const familyEntry = (taxonomy.families ?? []).find((entry) => entry.slug === family);
  if (!familyEntry) {
    throw new Error(`Unknown household family: ${family}`);
  }

  const existingPages = new Set([
    ...Object.keys(metadata.pages ?? {}),
    ...(registry.services ?? []).map((entry) => entry.page),
    ...Object.keys(slots.pages ?? {}),
    ...(taxonomy.devices ?? []).map((entry) => entry.page),
  ]);
  if (existingPages.has(page) || fs.existsSync(path.join(SITE_ROOT, page))) {
    throw new Error(`Page already exists or is already registered: ${page}`);
  }

  const primarySymptoms = toArray(args.symptoms);
  const brandCluster = toArray(args.brands);
  const policyContract = isShadow ? policy.shadowPage : policy.publicPage;

  const finalSymptoms = primarySymptoms.length > 0 ? primarySymptoms : [...familyEntry.allowedSymptoms];
  const finalBrands = brandCluster.length > 0 ? brandCluster : [...familyEntry.brandPool];
  const relatedPages = toArray(args['related-pages']);
  const finalRelatedPages =
    relatedPages.length > 0
      ? relatedPages
      : buildRelatedPages({
          family,
          registry,
          taxonomy,
          page,
          isShadow,
        });
  const formExample =
    args['form-example'] && args['form-example'] !== true
      ? String(args['form-example'])
      : buildFormExample(deviceName, finalBrands, finalSymptoms);
  const faq = buildGenericFaq(deviceName, serviceName, finalSymptoms, finalBrands);
  const formHints = buildFormHints(finalSymptoms, finalBrands);

  metadata.pages[page] = {
    title,
    description,
    canonical,
    ogUrl: canonical,
    hasForm: true,
    branch: 'household',
    ...(robots ? { robots } : {}),
  };

  registry.services.push({
    page,
    slug,
    uiLabel,
    deviceName,
    serviceName,
    schemaName,
    isShadow,
    primarySymptoms: finalSymptoms,
    brandCluster: finalBrands,
    relatedPages: finalRelatedPages,
    formExample,
    sectionIds: [...policyContract.defaultSectionIds],
  });

  taxonomy.devices.push({
    page,
    slug,
    family,
    deviceName,
    uiLabel,
    isShadow,
  });

  if (!isShadow) {
    slots.pages[page] = { faq, formHints };

    branch.services.push({
      href: page,
      icon,
      name: uiLabel,
    });

    insertBeforeFooterLinks(branch.footerLinks, {
      href: page,
      label: uiLabel,
    });

    branch.brandClusters = Array.isArray(branch.brandClusters) ? branch.brandClusters : [];
    branch.brandClusters.push({
      category: uiLabel,
      brands: finalBrands.slice(0, 5),
    });
  }

  const html = buildHtml({
    page,
    slug,
    title,
    description,
    canonical,
    robots,
    serviceName,
    deviceName,
    uiLabel,
    schemaName,
    primarySymptoms: finalSymptoms,
    brandCluster: finalBrands,
    formHints,
    faq,
  });

  writeJson(METADATA_PATH, metadata);
  writeJson(REGISTRY_PATH, registry);
  writeJson(TAXONOMY_PATH, taxonomy);
  if (!isShadow) {
    writeJson(SLOTS_PATH, slots);
    writeJson(BRANCH_PATH, branch);
  }
  fs.writeFileSync(path.join(SITE_ROOT, page), `${html}\n`);

  console.log(`Scaffolded household page ${page}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
