import fs from 'fs';
import path from 'path';
import {
  SITE_ROOT,
  METADATA_PATH,
  REGISTRY_PATH,
  SLOTS_PATH,
  PROOF_LAYER_PATH,
  readJson,
} from './restaurant-authoring-lib.mjs';

export const POLICY_PATH = path.join(SITE_ROOT, 'data/restaurant-page-policy.json');
export const RESTAURANT_SYNC_ZONES = [
  'service-kpi',
  'request-overview',
  'faq-items',
  'service-proof',
  'related-links',
];
const RESTAURANT_REQUEST_FORM_CLASS =
  'telegram-form bg-white p-5 sm:p-6 lg:p-10 rounded-2xl shadow-lg border border-slate-200 scroll-reveal';
const DEFAULT_RESTAURANT_SERVICE_KPI = {
  badge: 'ПОНЯТНЫЙ СЦЕНАРИЙ',
  title: 'Что фиксируем до начала работ',
  description:
    'Сначала уточняем исходные данные, затем согласуем следующий шаг, смету и документы для объекта.',
  items: [
    {
      value: 'Фото',
      label: 'Ошибка и шильдик',
      note: 'Помогают уточнить модель и первичный симптом.',
    },
    {
      value: 'Адрес',
      label: 'Объекта',
      note: 'Нужен для согласования маршрута и времени связи.',
    },
    {
      value: 'Смета',
      label: 'До начала работ',
      note: 'Объём и стоимость обсуждаем до ремонта.',
    },
    {
      value: 'Документы',
      label: 'Договор и акт',
      note: 'Формат закрытия заявки согласуем с объектом.',
    },
  ],
};

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function normalizeClassValue(value) {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ');
}

function markerStart(zone) {
  return `<!-- sync:${zone}:start owner="tools/restaurant-sync-fallbacks.mjs" source="data/restaurant-page-slots.json,data/restaurant-proof-layer.json,data/restaurant-services.json" -->`;
}

function legacyMarkerStart(zone) {
  return `<!-- sync:${zone}:start -->`;
}

function markerEnd(zone) {
  return `<!-- sync:${zone}:end -->`;
}

function getToneClasses(tone) {
  return (
    {
      orange: {
        badge: 'bg-brand-orange/10 text-brand-orange',
        border: 'border-brand-orange/20',
        icon: 'text-brand-orange',
      },
      green: {
        badge: 'bg-green-100 text-green-700',
        border: 'border-green-200',
        icon: 'text-green-600',
      },
      blue: {
        badge: 'bg-brand-blue/10 text-brand-blue',
        border: 'border-brand-blue/20',
        icon: 'text-brand-blue',
      },
    }[tone] ?? {
      badge: 'bg-slate-100 text-slate-700',
      border: 'border-slate-200',
      icon: 'text-slate-500',
    }
  );
}

function renderBadgeList(items, tone = 'orange') {
  const toneClass =
    {
      orange: 'bg-brand-orange/10 text-brand-orange',
      green: 'bg-green-100 text-green-700',
      blue: 'bg-brand-blue/10 text-brand-blue',
      slate: 'bg-slate-100 text-slate-700',
    }[tone] ?? 'bg-slate-100 text-slate-700';

  return (items || [])
    .filter(Boolean)
    .map(
      (item) =>
        `<span class="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${toneClass}">${escapeHtml(item)}</span>`
    )
    .join('');
}

function hasSyncZoneMarker(html, zone) {
  return (html.includes(markerStart(zone)) || html.includes(legacyMarkerStart(zone))) && html.includes(markerEnd(zone));
}

function hasSyncZoneOwnershipMarker(html, zone) {
  return html.includes(markerStart(zone)) && html.includes(markerEnd(zone));
}

function hasSyncZoneAttr(html, zone) {
  return html.includes(`data-sync-zone="${zone}"`);
}

function extractSyncZoneContent(html, zone) {
  const start = html.includes(markerStart(zone)) ? markerStart(zone) : legacyMarkerStart(zone);
  const end = markerEnd(zone);
  const startIndex = html.indexOf(start);
  const endIndex = html.indexOf(end);
  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) return null;
  return html.slice(startIndex + start.length, endIndex).trim();
}

function replaceSyncZoneContent(html, zone, content) {
  const start = html.includes(markerStart(zone)) ? markerStart(zone) : legacyMarkerStart(zone);
  const end = markerEnd(zone);
  const startIndex = html.indexOf(start);
  const endIndex = html.indexOf(end);
  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    if (zone === 'service-kpi') {
      const legacySectionRegex =
        /<section\b[^>]*>[\s\S]*?Лет опыта[\s\S]*?Ремонтов[\s\S]*?(?:За 1 визит|За один визит)[\s\S]*?(?:Месяцев гарантия|Гарантия|мес)[\s\S]*?<\/section>/i;
      const kpiBlock = `${markerStart(zone)}\n${content}\n${end}`;
      if (legacySectionRegex.test(html)) {
        return html.replace(legacySectionRegex, kpiBlock);
      }

      const requestOverviewStart = markerStart('request-overview');
      const requestOverviewIndex = html.indexOf(requestOverviewStart);
      if (requestOverviewIndex !== -1) {
        return `${html.slice(0, requestOverviewIndex)}${kpiBlock}\n${html.slice(requestOverviewIndex)}`;
      }
    }
    throw new Error(`Missing sync markers for ${zone}`);
  }
  return `${html.slice(0, startIndex)}${markerStart(zone)}\n${content}\n${end}${html.slice(endIndex + end.length)}`;
}

function buildFaqMarkup(faq) {
  const items = (faq || [])
    .map(
      (item, index) => `                <details class="faq-item bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border-2 border-slate-100 cursor-pointer scroll-reveal" data-delay="${index + 1}"><summary class="font-bold text-brand-blue text-base sm:text-lg flex items-center justify-between"><span>${escapeHtml(item.question)}</span><span class="text-brand-orange transition-transform duration-300">+</span></summary><p class="mt-4 text-slate-600">${escapeHtml(item.answer)}</p></details>`
    )
    .join('\n');
  return `<div data-sync-zone="faq-items">\n${items}\n              </div>`;
}

function buildRequestOverview(service, slotEntry) {
  const overview = slotEntry?.requestOverview;
  const hintChips = Array.isArray(overview?.chips) ? overview.chips.filter(Boolean) : [];

  return `<div data-sync-zone="request-overview" class="mb-6 rounded-3xl border border-slate-200 bg-slate-50/90 p-4 sm:p-5 lg:p-6">
      <div class="flex flex-wrap items-center gap-2">
        <span class="inline-flex items-center rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-green-700">${escapeHtml(
          overview?.badge || 'Что полезно указать сразу'
        )}</span>
        ${renderBadgeList((service.primarySymptoms || []).slice(0, 2), 'slate')}
      </div>
      <h3 class="mt-4 text-xl sm:text-2xl font-display font-extrabold text-brand-blue">${escapeHtml(
        overview?.title || 'Чтобы быстрее понять сценарий по объекту'
      )}</h3>
      <p class="mt-3 text-slate-600">${escapeHtml(
        overview?.description || 'Чем точнее описание модели и симптома, тем быстрее можно определить срочность и подготовить выезд.'
      )}</p>
      <div class="mt-4 flex flex-wrap gap-2">
        ${renderBadgeList(hintChips, 'orange')}
      </div>
      <p class="mt-4 text-xs text-slate-500">Пример описания: ${escapeHtml(service.formExample || '')}</p>
    </div>`;
}

function normalizeServiceKpiConfig(defaults, override) {
  const base = defaults && typeof defaults === 'object' ? defaults : DEFAULT_RESTAURANT_SERVICE_KPI;
  const custom = override && typeof override === 'object' ? override : {};
  const items = Array.isArray(custom.items) && custom.items.length > 0 ? custom.items : base.items;

  return {
    badge: custom.badge || base.badge || DEFAULT_RESTAURANT_SERVICE_KPI.badge,
    title: custom.title || base.title || DEFAULT_RESTAURANT_SERVICE_KPI.title,
    description: custom.description || base.description || DEFAULT_RESTAURANT_SERVICE_KPI.description,
    items: Array.isArray(items) ? items.filter(Boolean).slice(0, 4) : DEFAULT_RESTAURANT_SERVICE_KPI.items,
  };
}

function renderKpiCounterValue(rawValue) {
  const value = String(rawValue || '').trim();
  if (!value || /по подтверждённым данным/i.test(value)) {
    return null;
  }

  const match = value.match(/^(\d+)\s*(.*)$/);
  if (!match) {
    return escapeHtml(value);
  }

  const suffix = (match[2] || '').toLowerCase();
  if (suffix.includes('₽')) return 'По смете';
  if (suffix.includes('%')) return 'После осмотра';
  if (suffix.includes('мес')) return 'По договору';
  if (suffix.includes('+')) return null;
  if (suffix.includes('мин')) return 'По согласованию';
  return 'По согласованию';
}

function buildServiceKpi(slotEntry, slotsRoot) {
  const config = normalizeServiceKpiConfig(slotsRoot?.serviceKpiDefaults, slotEntry?.serviceKpi);

  return `<section data-sync-zone="service-kpi" class="py-14 lg:py-20 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-[2rem] border border-slate-200 bg-slate-50/80 p-6 sm:p-8 lg:p-10 shadow-sm">
          <div class="text-center">
            <span class="inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">${escapeHtml(config.badge)}</span>
            <h2 class="mt-4 text-2xl sm:text-3xl font-display font-extrabold text-brand-blue">${escapeHtml(config.title)}</h2>
            <p class="mt-3 text-slate-600">${escapeHtml(config.description)}</p>
          </div>
          <div class="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            ${config.items
              .map((item) => ({ item, value: renderKpiCounterValue(item.value) }))
              .filter(({ value }) => value !== null)
              .map(
                ({ item, value }) => `<article class="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 text-center">
                  <p class="text-3xl sm:text-4xl font-display font-extrabold text-brand-orange">${value}</p>
                  <p class="mt-2 text-sm font-semibold text-brand-blue">${escapeHtml(item.label || '')}</p>
                  <p class="mt-2 text-xs text-slate-500">${escapeHtml(item.note || '')}</p>
                </article>`
              )
              .join('')}
          </div>
        </div>
      </div>
    </section>`;
}

function buildSlaStrip(strip) {
  if (!strip) return '';

  return `<div class="rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-6 lg:p-8 shadow-sm">
      <div class="text-center">
        <span class="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-green-700">${escapeHtml(
          strip.badge || 'ПОНЯТНЫЙ СЦЕНАРИЙ'
        )}</span>
        <h2 class="mt-4 text-2xl sm:text-3xl font-display font-extrabold text-brand-blue">${escapeHtml(strip.title || '')}</h2>
        <p class="mt-3 text-slate-600">${escapeHtml(strip.description || '')}</p>
      </div>
      <div class="mt-8 grid gap-4 md:grid-cols-3">
        ${(strip.items || [])
          .map((item) => {
            const tone = getToneClasses(item.tone);
            return `<article class="rounded-2xl border ${tone.border} bg-slate-50/80 p-5">
              <p class="text-sm font-semibold uppercase tracking-[0.16em] ${tone.icon}">${escapeHtml(item.label || '')}</p>
              <p class="mt-3 text-2xl font-display font-extrabold text-brand-blue">${escapeHtml(item.value || '')}</p>
              <p class="mt-3 text-sm text-slate-600">${escapeHtml(item.description || '')}</p>
            </article>`;
          })
          .join('')}
      </div>
    </div>`;
}

function buildProofCards(section) {
  if (!section) return '';

  return `<div class="mt-8 rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-6 lg:p-8 shadow-sm">
      <div class="text-center">
        <span class="inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-orange">${escapeHtml(
          section.badge || 'Что важно до ремонта'
        )}</span>
        <h2 class="mt-4 text-2xl sm:text-3xl font-display font-extrabold text-brand-blue">${escapeHtml(section.title || '')}</h2>
        <p class="mt-3 text-slate-600">${escapeHtml(section.description || '')}</p>
      </div>
      <div class="mt-8 grid gap-4 lg:grid-cols-3">
        ${(section.cards || [])
          .map((card) => {
            const tone = getToneClasses(card.tone);
            return `<article class="rounded-2xl border ${tone.border} bg-slate-50/80 p-5">
              <div class="flex items-center justify-between gap-3">
                <span class="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${tone.badge}">${escapeHtml(
                  card.badge || 'Важно'
                )}</span>
                <i class="${escapeHtml(card.icon || 'ri-tools-line')} text-xl ${tone.icon}"></i>
              </div>
              <h3 class="mt-4 text-xl font-display font-extrabold text-brand-blue">${escapeHtml(card.title || '')}</h3>
              <p class="mt-3 text-slate-600">${escapeHtml(card.description || '')}</p>
              <p class="mt-4 text-sm font-semibold text-slate-700">${escapeHtml(card.outcome || '')}</p>
            </article>`;
          })
          .join('')}
      </div>
    </div>`;
}

function buildServiceProof(service, proofLayer) {
  const defaults = proofLayer?.serviceDefaults;
  if (!defaults) {
    return '<section data-sync-zone="service-proof" class="py-16 lg:py-20 bg-white"></section>';
  }

  return `<section data-sync-zone="service-proof" class="py-16 lg:py-20 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        ${buildSlaStrip(defaults.slaStrip)}
        <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span class="inline-flex items-center rounded-full bg-brand-blue/10 px-3 py-1.5 text-sm font-semibold text-brand-blue">Тип техники: ${escapeHtml(
            service.uiLabel
          )}</span>
          ${renderBadgeList((service.primarySymptoms || []).slice(0, 3), 'slate')}
        </div>
        ${buildProofCards(defaults.proofCards)}
      </div>
    </section>`;
}

function buildRelatedLinks(service, registry) {
  const serviceMap = new Map((registry?.services || []).map((entry) => [entry.page, entry]));
  const related = (service.relatedPages || [])
    .map((page) => serviceMap.get(page))
    .filter((entry) => entry && !entry.isShadow);

  return `<section data-sync-zone="related-links" class="py-16 lg:py-20 bg-slate-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
          <div class="text-center mb-8">
            <span class="inline-flex items-center rounded-full bg-brand-blue/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-blue">СОСЕДНИЕ КАТЕГОРИИ</span>
            <h2 class="mt-4 text-2xl sm:text-3xl font-display font-extrabold text-brand-blue">Если проблема в другом ресторанном оборудовании</h2>
            <p class="mt-3 text-slate-600">Ниже ближайшие категории, которые чаще всего смотрят рядом с этой страницей.</p>
          </div>
          <div class="grid gap-4 lg:grid-cols-3">
            ${related
              .map(
                (entry) => {
                  const relatedPageKey = entry.page.replace(/\.html$/i, '').replace(/[^a-z0-9]+/gi, '_');
                  const trackingAttrs = ` data-block="related_categories" data-cta-group="internal_link" data-cta-id="${service.slug}_internal_link_related_${relatedPageKey}"`;
                  const actionLabel = 'Перейти к ремонту оборудования';
                  return `<a href="${entry.page}" class="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 transition hover:-translate-y-0.5 hover:shadow-md"${trackingAttrs}>
                  <p class="text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange">По ресторанной категории</p>
                  <h3 class="mt-3 text-xl font-display font-extrabold text-brand-blue">${escapeHtml(entry.uiLabel)}</h3>
                  <p class="mt-3 text-sm text-slate-600">${escapeHtml((entry.primarySymptoms || []).slice(0, 3).join(', '))}</p>
                  <p class="mt-4 text-sm font-semibold text-slate-700">${actionLabel}</p>
                </a>`;
                }
              )
              .join('')}
          </div>
        </div>
      </div>
    </section>`;
}

function replaceInputPlaceholder(html, fieldName, placeholder) {
  const regex = new RegExp(`(<input[^>]+name="${fieldName}"[^>]+placeholder=")([^"]*)(")`, 'i');
  if (!regex.test(html)) {
    throw new Error(`Missing input placeholder for field ${fieldName}`);
  }
  return html.replace(regex, `$1${escapeHtml(placeholder)}$3`);
}

function extractRequestFormClass(html) {
  return html.match(/<form\b(?=[^>]*data-slot="request-form")(?=[^>]*class="([^"]+)")[^>]*>/i)?.[1] ?? null;
}

function replaceRequestFormClass(html, className) {
  const regex = /(<form\b(?=[^>]*data-slot="request-form")[^>]*\bclass=")([^"]*)(")/i;
  if (!regex.test(html)) {
    throw new Error('Missing request-form shell class');
  }
  return html.replace(regex, `$1${escapeHtml(className)}$3`);
}

export function replaceServiceSchemaContent(html, schemaText) {
  const regex = /(<script[^>]*data-slot="service-schema"[^>]*>)([\s\S]*?)(<\/script>)/i;
  if (!regex.test(html)) {
    throw new Error('Missing service-schema script block');
  }
  return html.replace(regex, `$1\n${schemaText}\n    $3`);
}

export function extractServiceSchemaContent(html) {
  return html.match(/<script[^>]*data-slot="service-schema"[^>]*>([\s\S]*?)<\/script>/i)?.[1] ?? null;
}

export function normalizeComparableMarkup(value) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/>\s+</g, '><')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();
}

function buildServiceSchema({ pageMeta, service }) {
  return `    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "${escapeHtml(service.schemaName)}",
      "description": "${escapeHtml(pageMeta.description)}",
      "provider": {
        "@type": "LocalBusiness",
        "name": "MosPochin",
        "telephone": "+79990057172",
        "url": "https://mospochin.ru",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Москва",
          "addressCountry": "RU"
        },
      },
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": "Москва и Московская область"
      },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "RUB",
        "price": "По согласованию после диагностики",
        "availability": "https://schema.org/InStock"
      }
    }`;
}

function buildSyncPayload({ pageMeta, service, slotEntry, slotsRoot, registry, proofLayer }) {
  return {
    schema: buildServiceSchema({ pageMeta, service }),
    zones: {
      'service-kpi': buildServiceKpi(slotEntry, slotsRoot),
      'request-overview': buildRequestOverview(service, slotEntry),
      'faq-items': buildFaqMarkup(slotEntry.faq || []),
      'service-proof': buildServiceProof(service, proofLayer),
      'related-links': buildRelatedLinks(service, registry),
    },
    placeholders: {
      type: slotEntry.formHints?.typePlaceholder ?? '',
      problem: slotEntry.formHints?.problemPlaceholder ?? '',
    },
  };
}

export function loadRestaurantSyncState() {
  return {
    metadata: readJson(METADATA_PATH),
    registry: readJson(REGISTRY_PATH),
    slots: readJson(SLOTS_PATH),
    proofLayer: readJson(PROOF_LAYER_PATH),
    policy: readJson(POLICY_PATH),
  };
}

export function getPublicRestaurantServices(registry) {
  return (registry?.services || []).filter((entry) => !entry.isShadow);
}

export function analyzeRestaurantSyncState(
  html,
  { pageMeta, service, slotEntry, slotsRoot, registry, proofLayer }
) {
  const expected = buildSyncPayload({ pageMeta, service, slotEntry, slotsRoot, registry, proofLayer });
  const issues = [];

  const schemaContent = extractServiceSchemaContent(html);
  if (schemaContent == null) {
    issues.push('Missing service-schema script block');
  } else if (normalizeComparableMarkup(schemaContent) !== normalizeComparableMarkup(expected.schema)) {
    issues.push('service-schema fallback drift');
  }

  for (const zone of RESTAURANT_SYNC_ZONES) {
    if (!hasSyncZoneMarker(html, zone)) {
      issues.push(`Missing sync marker block for ${zone}`);
      continue;
    }
    if (!hasSyncZoneOwnershipMarker(html, zone)) {
      issues.push(`Missing sync ownership marker for ${zone}`);
      continue;
    }
    if (!hasSyncZoneAttr(html, zone)) {
      issues.push(`Missing data-sync-zone="${zone}"`);
      continue;
    }
    const actualContent = extractSyncZoneContent(html, zone);
    if (actualContent == null) {
      issues.push(`Empty sync marker block for ${zone}`);
      continue;
    }
    if (normalizeComparableMarkup(actualContent) !== normalizeComparableMarkup(expected.zones[zone])) {
      issues.push(`${zone} fallback drift`);
    }
  }

  const currentTypePlaceholder = html.match(/<input[^>]+name="type"[^>]+placeholder="([^"]*)"/i)?.[1] ?? null;
  const currentProblemPlaceholder = html.match(/<input[^>]+name="problem"[^>]+placeholder="([^"]*)"/i)?.[1] ?? null;
  if (currentTypePlaceholder == null || currentTypePlaceholder !== expected.placeholders.type) {
    issues.push('type placeholder drift');
  }
  if (currentProblemPlaceholder == null || currentProblemPlaceholder !== expected.placeholders.problem) {
    issues.push('problem placeholder drift');
  }

  const currentRequestFormClass = extractRequestFormClass(html);
  if (
    currentRequestFormClass == null ||
    normalizeClassValue(currentRequestFormClass) !== normalizeClassValue(RESTAURANT_REQUEST_FORM_CLASS)
  ) {
    issues.push('request-form shell class drift');
  }

  return { expected, issues };
}

export function syncRestaurantServiceHtml(html, context) {
  const { expected } = analyzeRestaurantSyncState(html, context);
  let nextHtml = replaceServiceSchemaContent(html, expected.schema);
  for (const zone of RESTAURANT_SYNC_ZONES) {
    nextHtml = replaceSyncZoneContent(nextHtml, zone, expected.zones[zone]);
  }
  nextHtml = replaceInputPlaceholder(nextHtml, 'type', expected.placeholders.type);
  nextHtml = replaceInputPlaceholder(nextHtml, 'problem', expected.placeholders.problem);
  nextHtml = replaceRequestFormClass(nextHtml, RESTAURANT_REQUEST_FORM_CLASS);
  return nextHtml.replace(/[ \t]+$/gm, '');
}

export function getPublicRestaurantServiceSyncContext(page, state = loadRestaurantSyncState()) {
  const pageMeta = state.metadata.pages?.[page] ?? null;
  const service = (state.registry.services || []).find((entry) => entry.page === page && !entry.isShadow) ?? null;
  const slotEntry = state.slots.pages?.[page] ?? null;

  if (!pageMeta) {
    throw new Error(`Unknown page in metadata: ${page}`);
  }
  if (!service) {
    throw new Error(`Unknown public restaurant service page: ${page}`);
  }
  if (!slotEntry) {
    throw new Error(`Missing restaurant slot entry for ${page}`);
  }

  return {
    pageMeta,
    service,
    slotEntry,
    slotsRoot: state.slots,
    registry: state.registry,
    proofLayer: state.proofLayer,
    policy: state.policy,
  };
}

export function readPageHtml(page) {
  return fs.readFileSync(path.join(SITE_ROOT, page), 'utf8');
}

export function writePageHtml(page, html) {
  fs.writeFileSync(path.join(SITE_ROOT, page), html);
}
