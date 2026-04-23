import fs from 'fs';
import path from 'path';
import {
  SITE_ROOT,
  METADATA_PATH,
  REGISTRY_PATH,
  SLOTS_PATH,
  PROOF_LAYER_PATH,
  readJson,
} from './household-authoring-lib.mjs';

export const CARD_PRESETS_PATH = path.join(SITE_ROOT, 'data/household-card-presets.json');
export const POLICY_PATH = path.join(SITE_ROOT, 'data/household-page-policy.json');

export const HOUSEHOLD_SYNC_ZONES = [
  'service-kpi',
  'request-overview',
  'faq-items',
  'service-proof',
  'related-links',
];
export const HOUSEHOLD_OPTIONAL_SYNC_ZONES = ['brand-groups'];
const HOUSEHOLD_REQUEST_FORM_CLASS =
  'telegram-form bg-white p-8 lg:p-10 rounded-2xl shadow-lg border border-slate-200 scroll-reveal';

const DEFAULT_HOUSEHOLD_SERVICE_KPI = {
  badge: 'СЕРВИСНЫЕ ОРИЕНТИРЫ',
  title: 'Что получаете по заявке до и после выезда',
  description:
    'Фиксируем понятные метрики сервиса, чтобы решение о ремонте принималось по фактам, а не по обещаниям.',
  items: [
    {
      value: '15+',
      label: 'Лет опыта',
      note: 'Работаем с бытовыми категориями ежедневно по Москве и МО.',
    },
    {
      value: '5000+',
      label: 'Ремонтов',
      note: 'Закрытые заявки по домашней технике в рабочем контуре сервиса.',
    },
    {
      value: '95%',
      label: 'За 1 визит',
      note: 'Типовой кейс закрываем без повторного выезда.',
    },
    {
      value: '12 мес',
      label: 'Гарантия',
      note: 'Подтверждаем результат актом и гарантийной фиксацией.',
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

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeClassValue(value) {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ');
}

function getHouseholdCardTone(tone) {
  return (
    {
      slate: {
        card: 'household-card--slate',
        badge: 'bg-slate-100 text-slate-700',
      },
      orange: {
        card: 'household-card--orange',
        badge: 'bg-brand-orange/10 text-brand-orange',
      },
      blue: {
        card: 'household-card--blue',
        badge: 'bg-brand-blue/10 text-brand-blue',
      },
      green: {
        card: 'household-card--green',
        badge: 'bg-green-100 text-green-700',
      },
    }[tone] ?? {
      card: 'household-card--slate',
      badge: 'bg-slate-100 text-slate-700',
    }
  );
}

function renderHouseholdBadgeList(items, tone = 'slate') {
  const toneClasses = {
    slate: 'bg-slate-100 text-slate-700',
    orange: 'bg-brand-orange/10 text-brand-orange',
    green: 'bg-green-100 text-green-700',
    blue: 'bg-brand-blue/10 text-brand-blue',
  };
  const className = toneClasses[tone] || toneClasses.slate;

  return (items || [])
    .filter(Boolean)
    .map(
      (item) =>
        `<span class="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${className}">${escapeHtml(item)}</span>`
    )
    .join('');
}

function renderHouseholdServiceCards(pages, serviceMap, cardPresets, mode = 'compact') {
  const icons = cardPresets?.pageIcons || {};
  const tones = cardPresets?.pageTones || {};

  return pages
    .map((page) => serviceMap.get(page))
    .filter((entry) => entry && !entry.isShadow)
    .map((entry) => {
      const tone = getHouseholdCardTone(tones[entry.page] || 'slate');
      const icon = icons[entry.page] || 'ri-settings-3-line';
      const symptomText = (entry.primarySymptoms || []).slice(0, mode === 'compact' ? 3 : 4).join(', ');
      const brandText = (entry.brandCluster || []).slice(0, 3).join(', ');

      return `
          <a href="${entry.page}" class="household-card household-card--service ${tone.card}">
            <div class="household-card__topline">
              <span class="household-card__eyebrow ${tone.badge}">По бытовой категории</span>
              <span class="household-card__icon"><i class="${icon}"></i></span>
            </div>
            <h3 class="household-card__title">${escapeHtml(entry.uiLabel)}</h3>
            <p class="household-card__description">${escapeHtml(symptomText)}</p>
            <p class="household-card__meta">${escapeHtml(brandText)}</p>
            <span class="household-card__cta">Открыть страницу</span>
          </a>
        `;
    })
    .join('');
}

function renderHouseholdProofCards(cards) {
  return (cards || [])
    .map((card) => {
      const tone = getHouseholdCardTone(card.tone || 'slate');
      return `
          <article class="household-card household-card--proof ${tone.card}">
            <div class="household-card__topline">
              <span class="household-card__eyebrow ${tone.badge}">${escapeHtml(card.badge || 'Без сюрпризов')}</span>
              <span class="household-card__icon"><i class="${escapeHtml(card.icon || 'ri-shield-check-line')}"></i></span>
            </div>
            <h3 class="household-card__title">${escapeHtml(card.title || '')}</h3>
            <p class="household-card__description">${escapeHtml(card.description || '')}</p>
            ${card.outcome ? `<p class="household-card__meta">${escapeHtml(card.outcome)}</p>` : ''}
          </article>
        `;
    })
    .join('');
}

function renderHouseholdSlaStrip(sectionConfig) {
  const items = Array.isArray(sectionConfig?.items) ? sectionConfig.items : [];
  if (!items.length) return '';

  return `
      <div class="household-proof-strip">
        <div class="household-proof-strip__copy">
          <span class="household-proof-strip__badge">${escapeHtml(sectionConfig.badge || 'Понятный сценарий')}</span>
          <h2 class="household-proof-strip__title">${escapeHtml(sectionConfig.title || '')}</h2>
          <p class="household-proof-strip__description">${escapeHtml(sectionConfig.description || '')}</p>
        </div>
        <div class="household-proof-strip__grid">
          ${items
            .map((item) => {
              const tone = getHouseholdCardTone(item.tone || 'slate');
              return `
                <article class="household-proof-strip__item ${tone.card}">
                  <p class="household-proof-strip__value">${escapeHtml(item.value || '')}</p>
                  <p class="household-proof-strip__label">${escapeHtml(item.label || '')}</p>
                  <p class="household-proof-strip__meta">${escapeHtml(item.description || '')}</p>
                </article>
              `;
            })
            .join('')}
        </div>
      </div>
    `;
}

export function buildHouseholdServiceSchema(service, pageMeta, slotEntry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.schemaName || service.serviceName,
    description: slotEntry?.serviceSchema?.description || pageMeta?.description || '',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: slotEntry?.serviceSchema?.areaServed || 'Москва и Московская область',
    },
    serviceType: slotEntry?.serviceSchema?.serviceType || service.deviceName || service.uiLabel,
    provider: {
      '@type': 'LocalBusiness',
      name: 'MosPochin',
      url: 'https://mospochin.ru',
      telephone: '+79990057172',
      openingHours: 'Mo-Su 09:00-21:00',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Москва',
        addressCountry: 'RU',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '128',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'RUB',
      price: slotEntry?.serviceSchema?.price || 'По согласованию после диагностики',
      availability: 'https://schema.org/InStock',
    },
  };
}

export function renderHouseholdRequestOverview(service, slotEntry) {
  const hintChips = Array.isArray(slotEntry?.formHints?.chips)
    ? slotEntry.formHints.chips.filter(Boolean)
    : [];

  return `<div data-sync-zone="request-overview" data-household-slot-zone="request-overview" class="mb-6 rounded-2xl border border-slate-200 bg-slate-50/90 p-4 sm:p-5">
      <div class="mb-4">
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Что полезно указать сразу</p>
        <div class="mt-3 flex flex-wrap gap-2">
          ${renderHouseholdBadgeList(hintChips, 'orange')}
        </div>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <p class="text-sm font-bold text-brand-blue">Частые симптомы</p>
          <div class="mt-2 flex flex-wrap gap-2">
            ${renderHouseholdBadgeList(service.primarySymptoms || [], 'slate')}
          </div>
        </div>
        <div>
          <p class="text-sm font-bold text-brand-blue">Частые бренды</p>
          <div class="mt-2 flex flex-wrap gap-2">
            ${renderHouseholdBadgeList(service.brandCluster || [], 'blue')}
          </div>
        </div>
      </div>
      <p class="mt-4 text-xs text-slate-500">Пример описания: ${escapeHtml(service.formExample || '')}</p>
    </div>`;
}

function normalizeServiceKpiConfig(defaults, override) {
  const base = defaults && typeof defaults === 'object' ? defaults : DEFAULT_HOUSEHOLD_SERVICE_KPI;
  const custom = override && typeof override === 'object' ? override : {};
  const items = Array.isArray(custom.items) && custom.items.length > 0 ? custom.items : base.items;

  return {
    badge: custom.badge || base.badge || DEFAULT_HOUSEHOLD_SERVICE_KPI.badge,
    title: custom.title || base.title || DEFAULT_HOUSEHOLD_SERVICE_KPI.title,
    description: custom.description || base.description || DEFAULT_HOUSEHOLD_SERVICE_KPI.description,
    items: Array.isArray(items) ? items.filter(Boolean).slice(0, 4) : DEFAULT_HOUSEHOLD_SERVICE_KPI.items,
  };
}

function renderKpiCounterValue(rawValue) {
  const value = String(rawValue || '').trim();
  const match = value.match(/^(\d+)\s*(.*)$/);
  if (!match) {
    return escapeHtml(value);
  }

  const target = Number.parseInt(match[1], 10);
  if (!Number.isFinite(target)) {
    return escapeHtml(value);
  }

  const suffix = match[2] || '';
  return `<span class="counter" data-target="${target}" data-suffix="${escapeHtml(suffix)}">0</span>`;
}

export function renderHouseholdServiceKpi(slotEntry, slotsRoot) {
  const config = normalizeServiceKpiConfig(
    slotsRoot?.serviceKpiDefaults,
    slotEntry?.serviceKpi
  );

  return `<section data-sync-zone="service-kpi" data-household-slot-generated="service-kpi" class="py-14 lg:py-20 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-[2rem] border border-slate-200 bg-slate-50/80 p-6 sm:p-8 lg:p-10 shadow-sm">
          <div class="text-center">
            <span class="inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">${escapeHtml(config.badge)}</span>
            <h2 class="mt-4 text-2xl sm:text-3xl font-display font-extrabold text-brand-blue">${escapeHtml(config.title)}</h2>
            <p class="mt-3 text-slate-600">${escapeHtml(config.description)}</p>
          </div>
          <div class="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            ${config.items
              .map(
                (item) => `<article class="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 text-center">
                  <p class="text-3xl sm:text-4xl font-display font-extrabold text-brand-orange">${renderKpiCounterValue(item.value)}</p>
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

export function renderHouseholdFaqItems(slotEntry) {
  return `<div class="mt-10 space-y-4" data-sync-zone="faq-items">
${(slotEntry?.faq || [])
  .map(
    (item, index) => `                <details class="faq-item bg-white p-6 rounded-2xl border-2 border-slate-100 cursor-pointer scroll-reveal" data-delay="${index + 1}">
                    <summary class="font-bold text-brand-blue text-lg flex items-center justify-between">
                        <span>${escapeHtml(item.question)}</span>
                        <span class="text-brand-orange transition-transform duration-300">+</span>
                    </summary>
                    <p class="mt-4 text-slate-600">${escapeHtml(item.answer)}</p>
                </details>`
  )
  .join('\n')}
            </div>`;
}

export function renderHouseholdServiceProof(service, proofLayer) {
  const defaults = proofLayer?.serviceDefaults;
  if (!defaults) {
    return '<section data-sync-zone="service-proof" data-household-slot-generated="service-proof" class="py-16 lg:py-20 bg-white"></section>';
  }

  return `<section data-sync-zone="service-proof" data-household-slot-generated="service-proof" class="py-16 lg:py-20 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-[2rem] border border-slate-200 bg-slate-50/90 p-6 sm:p-8 lg:p-10 shadow-sm">
          ${renderHouseholdSlaStrip(defaults.slaStrip)}
          ${defaults.priceClarity ? `<div class="mt-8">${renderHouseholdSlaStrip(defaults.priceClarity)}</div>` : ''}
          <div class="mt-8 flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center rounded-full bg-brand-orange/10 px-3 py-1.5 text-sm font-semibold text-brand-orange">По категории ${escapeHtml(service.uiLabel)}</span>
            ${renderHouseholdBadgeList((service.primarySymptoms || []).slice(0, 3), 'slate')}
          </div>
          <div class="mt-8 text-center">
            <span class="inline-flex items-center rounded-full bg-brand-blue/10 px-4 py-2 text-sm font-semibold text-brand-blue">${escapeHtml(defaults.proofCards?.badge || 'Почему это спокойнее')}</span>
            <h2 class="mt-4 text-2xl sm:text-3xl font-display font-extrabold text-brand-blue">${escapeHtml(defaults.proofCards?.title || '')}</h2>
            <p class="mt-3 text-slate-600">${escapeHtml(defaults.proofCards?.description || '')}</p>
          </div>
          <div class="mt-8 household-card-grid household-card-grid--proof">
            ${renderHouseholdProofCards(defaults.proofCards?.cards || [])}
          </div>
          ${
            defaults.objectionCards
              ? `
                <div class="mt-10 text-center">
                  <span class="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">${escapeHtml(defaults.objectionCards.badge || 'Что ещё важно')}</span>
                  <h2 class="mt-4 text-2xl sm:text-3xl font-display font-extrabold text-brand-blue">${escapeHtml(defaults.objectionCards.title || '')}</h2>
                  <p class="mt-3 text-slate-600">${escapeHtml(defaults.objectionCards.description || '')}</p>
                </div>
                <div class="mt-8 household-card-grid household-card-grid--proof">
                  ${renderHouseholdProofCards(defaults.objectionCards.cards || [])}
                </div>
              `
              : ''
          }
        </div>
      </div>
    </section>`;
}

export function renderHouseholdRelatedLinks(service, registry, cardPresets) {
  const serviceMap = new Map((registry?.services || []).map((entry) => [entry.page, entry]));
  const pages = (service.relatedPages || [])
    .map((page) => serviceMap.get(page))
    .filter((entry) => entry && !entry.isShadow)
    .map((entry) => entry.page);

  return `<section data-sync-zone="related-links" data-household-slot-generated="related-links" class="py-16 lg:py-20 bg-slate-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div class="text-center mb-8">
            <span class="inline-block rounded-full bg-brand-blue/10 px-4 py-2 text-sm font-semibold text-brand-blue">ДРУГИЕ БЫТОВЫЕ КАТЕГОРИИ</span>
            <h2 class="mt-4 text-2xl sm:text-3xl font-display font-extrabold text-brand-blue">Если проблема в другой технике</h2>
            <p class="mt-3 text-slate-600">Ниже ближайшие бытовые категории, которые чаще всего смотрят рядом с этой страницей.</p>
          </div>
          <div class="household-card-grid household-card-grid--related">
            ${renderHouseholdServiceCards(pages, serviceMap, cardPresets, 'compact')}
          </div>
        </div>
      </div>
    </section>`;
}

function normalizeBrandGroupItems(items) {
  return Array.isArray(items)
    ? items
        .filter((item) => isPlainObject(item))
        .filter((item) => String(item.nameEn ?? '').trim() && String(item.nameRu ?? '').trim())
    : [];
}

function normalizeBrandGroupConfig(slotEntry) {
  if (!isPlainObject(slotEntry?.brandGroups)) {
    return null;
  }

  const brandGroups = slotEntry.brandGroups;
  const segments = isPlainObject(brandGroups.segments) ? brandGroups.segments : {};
  const premium = isPlainObject(segments.premium) ? segments.premium : {};
  const mid = isPlainObject(segments.mid) ? segments.mid : {};

  const premiumItems = normalizeBrandGroupItems(premium.items);
  const midItems = normalizeBrandGroupItems(mid.items);
  if (premiumItems.length === 0 || midItems.length === 0) {
    return null;
  }

  return {
    badge: String(brandGroups.badge || '🏆 БРЕНДЫ'),
    title: String(brandGroups.title || 'Ремонтируем марки водонагревателей'),
    description: String(brandGroups.description || 'Работаем с популярными и премиальными брендами.'),
    segments: [
      {
        key: 'premium',
        title: String(premium.title || 'Премиум'),
        description: String(premium.description || 'Премиальные марки'),
        toneClass: 'border-purple-200 bg-purple-50/70 text-purple-700',
        chipClass: 'bg-purple-100 text-purple-700',
        items: premiumItems,
      },
      {
        key: 'mid',
        title: String(mid.title || 'Средние'),
        description: String(mid.description || 'Массовый средний сегмент'),
        toneClass: 'border-blue-200 bg-blue-50/70 text-blue-700',
        chipClass: 'bg-blue-100 text-blue-700',
        items: midItems,
      },
    ],
  };
}

function renderBrandGroupChip(item, chipClass) {
  return `<span class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${chipClass}">
      <span class="text-brand-blue">${escapeHtml(item.nameEn)}</span>
      <span class="text-xs font-medium text-slate-500">${escapeHtml(item.nameRu)}</span>
    </span>`;
}

export function renderHouseholdBrandGroups(slotEntry) {
  const config = normalizeBrandGroupConfig(slotEntry);
  if (!config) {
    return '';
  }

  return `<section id="brands" data-sync-zone="brand-groups" class="py-24 lg:py-32 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 scroll-reveal">
          <span class="inline-block bg-brand-orange/10 text-brand-orange px-4 py-2 rounded-full text-sm font-semibold mb-4">${escapeHtml(config.badge)}</span>
          <h2 class="text-3xl lg:text-4xl font-display font-extrabold text-brand-blue mb-4 heading-reveal">${escapeHtml(config.title)}</h2>
          <p class="text-slate-600 text-lg max-w-3xl mx-auto">${escapeHtml(config.description)}</p>
        </div>
        <div class="grid gap-6 lg:grid-cols-2">
          ${config.segments
            .map(
              (segment) => `<section class="rounded-3xl border p-6 sm:p-7 ${segment.toneClass}">
                <div class="mb-4">
                  <h3 class="text-xl font-display font-extrabold text-brand-blue">${escapeHtml(segment.title)}</h3>
                  <p class="mt-2 text-sm text-slate-600">${escapeHtml(segment.description)}</p>
                </div>
                <div class="flex flex-wrap gap-2">
                  ${segment.items.map((item) => renderBrandGroupChip(item, segment.chipClass)).join('')}
                </div>
              </section>`
            )
            .join('')}
        </div>
      </div>
    </section>`;
}

function buildSyncPayload({ pageMeta, service, slotEntry, slotsRoot, registry, cardPresets, proofLayer }) {
  const zones = {
    'service-kpi': renderHouseholdServiceKpi(slotEntry, slotsRoot),
    'request-overview': renderHouseholdRequestOverview(service, slotEntry),
    'faq-items': renderHouseholdFaqItems(slotEntry),
    'service-proof': renderHouseholdServiceProof(service, proofLayer),
    'related-links': renderHouseholdRelatedLinks(service, registry, cardPresets),
  };
  const brandGroupsSection = renderHouseholdBrandGroups(slotEntry);
  if (brandGroupsSection) {
    zones['brand-groups'] = brandGroupsSection;
  }

  return {
    schema: JSON.stringify(buildHouseholdServiceSchema(service, pageMeta, slotEntry), null, 2),
    zones,
  };
}

function markerStart(zone) {
  return `<!-- household-sync:${zone}:start -->`;
}

function markerEnd(zone) {
  return `<!-- household-sync:${zone}:end -->`;
}

export function extractSyncZoneContent(html, zone) {
  const regex = new RegExp(
    `${markerStart(zone).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*([\\s\\S]*?)\\s*${markerEnd(zone).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`
  );
  return html.match(regex)?.[1] ?? null;
}

export function hasSyncZoneMarker(html, zone) {
  return html.includes(markerStart(zone)) && html.includes(markerEnd(zone));
}

export function hasSyncZoneAttr(html, zone) {
  return html.includes(`data-sync-zone="${zone}"`);
}

export function replaceSyncZoneContent(html, zone, content) {
  const regex = new RegExp(
    `${markerStart(zone).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${markerEnd(zone).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`
  );
  if (!regex.test(html)) {
    if (zone === 'service-kpi') {
      const legacySectionRegex =
        /<section\b[^>]*>[\s\S]*?Лет опыта[\s\S]*?Ремонтов[\s\S]*?(?:За 1 визит|За один визит)[\s\S]*?(?:Месяцев гарантия|Гарантия|мес)[\s\S]*?<\/section>/i;
      const kpiBlock = `${markerStart(zone)}\n${content}\n${markerEnd(zone)}`;
      if (legacySectionRegex.test(html)) {
        return html.replace(legacySectionRegex, kpiBlock);
      }

      const requestOverviewStart = markerStart('request-overview');
      const requestOverviewIndex = html.indexOf(requestOverviewStart);
      if (requestOverviewIndex !== -1) {
        return `${html.slice(0, requestOverviewIndex)}${kpiBlock}\n${html.slice(requestOverviewIndex)}`;
      }
    }
    throw new Error(`Missing sync marker block for zone ${zone}`);
  }
  return html.replace(regex, `${markerStart(zone)}\n${content}\n${markerEnd(zone)}`);
}

export function replaceServiceSchemaContent(html, schemaText) {
  const regex = /(<script[^>]*data-slot="service-schema"[^>]*>)([\s\S]*?)(<\/script>)/i;
  if (!regex.test(html)) {
    throw new Error('Missing service-schema script block');
  }
  return html.replace(regex, `$1\n${schemaText}\n    $3`);
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

export function loadHouseholdSyncState() {
  return {
    metadata: readJson(METADATA_PATH),
    registry: readJson(REGISTRY_PATH),
    slots: readJson(SLOTS_PATH),
    proofLayer: readJson(PROOF_LAYER_PATH),
    cardPresets: readJson(CARD_PRESETS_PATH),
    policy: readJson(POLICY_PATH),
  };
}

export function getPublicHouseholdServices(registry) {
  return (registry?.services || []).filter((entry) => !entry.isShadow);
}

export function analyzeHouseholdSyncState(
  html,
  { pageMeta, service, slotEntry, slotsRoot, registry, cardPresets, proofLayer }
) {
  const expected = buildSyncPayload({
    pageMeta,
    service,
    slotEntry,
    slotsRoot,
    registry,
    cardPresets,
    proofLayer,
  });
  const issues = [];

  const schemaContent = extractServiceSchemaContent(html);
  if (schemaContent == null) {
    issues.push('Missing service-schema script block');
  } else if (normalizeComparableMarkup(schemaContent) !== normalizeComparableMarkup(expected.schema)) {
    issues.push('service-schema fallback drift');
  }

  for (const zone of HOUSEHOLD_SYNC_ZONES) {
    if (!hasSyncZoneMarker(html, zone)) {
      issues.push(`Missing sync marker block for ${zone}`);
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

  for (const zone of HOUSEHOLD_OPTIONAL_SYNC_ZONES) {
    const expectedContent = expected.zones[zone] ?? null;
    const hasMarker = hasSyncZoneMarker(html, zone);

    if (!expectedContent && !hasMarker) {
      continue;
    }
    if (!expectedContent && hasMarker) {
      issues.push(`Unexpected sync marker block for ${zone}`);
      continue;
    }
    if (expectedContent && !hasMarker) {
      issues.push(`Missing sync marker block for ${zone}`);
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
    if (normalizeComparableMarkup(actualContent) !== normalizeComparableMarkup(expectedContent)) {
      issues.push(`${zone} fallback drift`);
    }
  }

  const currentRequestFormClass = extractRequestFormClass(html);
  if (
    currentRequestFormClass == null ||
    normalizeClassValue(currentRequestFormClass) !== normalizeClassValue(HOUSEHOLD_REQUEST_FORM_CLASS)
  ) {
    issues.push('request-form shell class drift');
  }

  return { expected, issues };
}

export function syncHouseholdServiceHtml(html, context) {
  const { expected } = analyzeHouseholdSyncState(html, context);
  let nextHtml = replaceServiceSchemaContent(html, expected.schema);
  for (const zone of HOUSEHOLD_SYNC_ZONES) {
    nextHtml = replaceSyncZoneContent(nextHtml, zone, expected.zones[zone]);
  }
  for (const zone of HOUSEHOLD_OPTIONAL_SYNC_ZONES) {
    if (!expected.zones[zone]) continue;
    nextHtml = replaceSyncZoneContent(nextHtml, zone, expected.zones[zone]);
  }
  nextHtml = replaceRequestFormClass(nextHtml, HOUSEHOLD_REQUEST_FORM_CLASS);
  return nextHtml.replace(/[ \t]+$/gm, '');
}

export function getPublicServiceSyncContext(page, state = loadHouseholdSyncState()) {
  const pageMeta = state.metadata.pages?.[page] ?? null;
  const service = (state.registry.services || []).find((entry) => entry.page === page && !entry.isShadow) ?? null;
  const slotEntry = state.slots.pages?.[page] ?? null;

  if (!pageMeta) {
    throw new Error(`Unknown page in metadata: ${page}`);
  }
  if (!service) {
    throw new Error(`Unknown public household service page: ${page}`);
  }
  if (!slotEntry) {
    throw new Error(`Missing household slot entry for ${page}`);
  }

  return {
    pageMeta,
    service,
    slotEntry,
    slotsRoot: state.slots,
    registry: state.registry,
    cardPresets: state.cardPresets,
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
