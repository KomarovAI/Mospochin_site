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

function normalizeBrandV1Items(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter((item) => isPlainObject(item))
    .map((item) => {
      const nameEn = String(item.nameEn ?? '').trim();
      const nameRu = String(item.nameRu ?? '').trim();
      const label = nameEn || nameRu;
      if (!label) return null;
      return { label };
    })
    .filter(Boolean);
}

function normalizeBrandV2Items(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      if (typeof item === 'string') {
        const label = item.trim();
        return label ? { label } : null;
      }
      if (!isPlainObject(item)) {
        return null;
      }

      const label = String(item.label ?? item.name ?? '').trim();
      if (!label) {
        return null;
      }
      const href = String(item.href ?? '').trim();
      return href ? { label, href } : { label };
    })
    .filter(Boolean);
}

function normalizeBrandLogoItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      if (typeof item === 'string') {
        const label = item.trim();
        return label ? { label } : null;
      }
      if (!isPlainObject(item)) {
        return null;
      }

      const label = String(item.label ?? item.name ?? '').trim();
      if (!label) {
        return null;
      }
      const logoSrc = String(item.logoSrc ?? '').trim();
      const logoAlt = String(item.logoAlt ?? '').trim() || `Логотип ${label}`;
      return logoSrc ? { label, logoSrc, logoAlt } : { label, logoAlt };
    })
    .filter(Boolean);
}

function normalizeBrandGroupsV2(brandGroups) {
  if (!Array.isArray(brandGroups.groups)) {
    return null;
  }

  const groups = brandGroups.groups
    .filter((group) => isPlainObject(group))
    .map((group, index) => {
      const brands = normalizeBrandV2Items(group.brands);
      if (!brands.length) {
        return null;
      }

      const title = String(group.title ?? '').trim();
      if (!title) {
        return null;
      }

      return {
        key: String(group.key ?? `group-${index + 1}`).trim() || `group-${index + 1}`,
        title,
        note: String(group.note ?? '').trim(),
        counterLabel: String(group.counterLabel ?? 'марок').trim() || 'марок',
        count: Number.isFinite(group.count) ? Number(group.count) : brands.length,
        toneClass: String(group.toneClass ?? 'border-slate-200 bg-slate-50/70'),
        chipClass: String(group.chipClass ?? 'bg-white text-slate-700'),
        brands,
      };
    })
    .filter(Boolean);

  if (!groups.length) {
    return null;
  }

  const counters = Array.isArray(brandGroups.counters)
    ? brandGroups.counters
        .filter((item) => isPlainObject(item))
        .map((item) => ({
          value: String(item.value ?? '').trim(),
          label: String(item.label ?? '').trim(),
        }))
        .filter((item) => item.value && item.label)
    : [];
  const logos = normalizeBrandLogoItems(brandGroups.logos);

  return {
    badge: String(brandGroups.badge ?? '').trim(),
    title: String(brandGroups.title ?? '').trim() || 'Ремонтируем марки водонагревателей',
    subtitle:
      String(brandGroups.subtitle ?? '').trim() ||
      String(brandGroups.description ?? '').trim() ||
      'Работаем с популярными и премиальными брендами.',
    note: String(brandGroups.note ?? '').trim(),
    counters,
    logos,
    groups,
  };
}

function normalizeBrandGroupsV1(brandGroups) {
  const segments = isPlainObject(brandGroups.segments) ? brandGroups.segments : {};
  const premium = isPlainObject(segments.premium) ? segments.premium : {};
  const mid = isPlainObject(segments.mid) ? segments.mid : {};

  const premiumBrands = normalizeBrandV1Items(premium.items);
  const midBrands = normalizeBrandV1Items(mid.items);
  if (!premiumBrands.length || !midBrands.length) {
    return null;
  }

  return {
    badge: String(brandGroups.badge ?? '🏆 БРЕНДЫ'),
    title: String(brandGroups.title ?? 'Ремонтируем марки водонагревателей'),
    subtitle:
      String(brandGroups.subtitle ?? '').trim() ||
      String(brandGroups.description ?? '').trim() ||
      'Работаем с популярными и премиальными брендами.',
    note: String(brandGroups.note ?? '').trim(),
    counters: [],
    logos: [],
    groups: [
      {
        key: 'premium',
        title: String(premium.title ?? 'Премиум'),
        note: String(premium.description ?? '').trim(),
        counterLabel: 'марок',
        count: premiumBrands.length,
        toneClass: 'border-amber-200 bg-amber-50/80',
        chipClass: 'bg-white text-slate-700',
        brands: premiumBrands,
      },
      {
        key: 'mid',
        title: String(mid.title ?? 'Средние'),
        note: String(mid.description ?? '').trim(),
        counterLabel: 'марок',
        count: midBrands.length,
        toneClass: 'border-sky-200 bg-sky-50/80',
        chipClass: 'bg-white text-slate-700',
        brands: midBrands,
      },
    ],
  };
}

function normalizeBrandGroupConfig(slotEntry) {
  if (!isPlainObject(slotEntry?.brandGroups)) {
    return null;
  }

  const brandGroups = slotEntry.brandGroups;
  return normalizeBrandGroupsV2(brandGroups) ?? normalizeBrandGroupsV1(brandGroups);
}

function renderBrandGroupChip(item, chipClass) {
  const chipBody = item.href
    ? `<a href="${escapeHtml(item.href)}" class="inline-flex min-h-[44px] items-center rounded-xl px-3.5 py-2 text-sm font-medium ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 ${chipClass}">${escapeHtml(item.label)}</a>`
    : `<span class="inline-flex min-h-[44px] items-center rounded-xl px-3.5 py-2 text-sm font-medium ring-1 ring-inset ring-slate-200 ${chipClass}">${escapeHtml(item.label)}</span>`;
  return `<li>${chipBody}</li>`;
}

function renderBrandGroupCounter(counter) {
  return `<li class="min-w-[112px] rounded-2xl bg-slate-50 px-3.5 py-3 ring-1 ring-inset ring-slate-200">
      <span class="block text-lg font-semibold leading-none text-slate-900">${escapeHtml(counter.value)}</span>
      <span class="mt-1 block text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">${escapeHtml(counter.label)}</span>
    </li>`;
}

function renderBrandLogoTile(item) {
  const initials = item.label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? '')
    .join('');

  const media = item.logoSrc
    ? `<img src="${escapeHtml(item.logoSrc)}" alt="${escapeHtml(item.logoAlt || `Логотип ${item.label}`)}" class="max-h-9 max-w-[118px] w-auto object-contain" loading="lazy" decoding="async">`
    : `<span class="inline-flex items-center gap-2"><span class="inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-brand-blue/10 px-2 text-xs font-bold tracking-[0.08em] text-brand-blue">${escapeHtml(initials || item.label.slice(0, 2).toUpperCase())}</span><span class="text-sm font-semibold text-slate-700 whitespace-nowrap">${escapeHtml(item.label)}</span></span>`;

  return `<li class="flex h-16 min-w-[132px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div class="flex items-center justify-center">
        ${media}
      </div>
    </li>`;
}

function renderBrandGroupCard(group) {
  return `<article class="scroll-reveal rounded-2xl border p-4 sm:p-5 ${group.toneClass}">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <h3 class="text-base sm:text-lg font-display font-extrabold tracking-[-0.01em] text-brand-blue">${escapeHtml(group.title)}</h3>
          ${group.note ? `<p class="mt-1 text-sm leading-6 text-slate-600">${escapeHtml(group.note)}</p>` : ''}
        </div>
        <span class="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">${escapeHtml(String(group.count))} ${escapeHtml(group.counterLabel)}</span>
      </div>
      <ul class="mt-4 flex flex-wrap gap-2.5 sm:gap-3">
        ${group.brands.map((item) => renderBrandGroupChip(item, group.chipClass)).join('')}
      </ul>
    </article>`;
}

export function renderHouseholdBrandGroups(slotEntry) {
  const config = normalizeBrandGroupConfig(slotEntry);
  if (!config || !config.groups.length) {
    return '';
  }

  return `<section id="brands" data-sync-zone="brand-groups" class="py-20 lg:py-28 bg-gradient-to-b from-slate-100 to-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="rounded-3xl border border-slate-200 bg-white">
          <div class="p-5 sm:p-6 lg:p-8">
            <header class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div class="min-w-0 max-w-3xl scroll-reveal">
                ${config.badge ? `<span class="mb-3 inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium tracking-[0.04em] text-sky-800">${escapeHtml(config.badge)}</span>` : ''}
                <h2 class="text-2xl sm:text-3xl font-display font-extrabold tracking-[-0.02em] text-brand-blue">${escapeHtml(config.title)}</h2>
                ${config.subtitle ? `<p class="mt-2 text-sm sm:text-base leading-6 text-slate-600">${escapeHtml(config.subtitle)}</p>` : ''}
              </div>
              ${
                config.counters.length
                  ? `<ul class="flex flex-wrap gap-2.5 lg:max-w-[440px] lg:justify-end">
                ${config.counters.map((counter) => renderBrandGroupCounter(counter)).join('')}
              </ul>`
                  : ''
              }
            </header>
            ${config.note ? `<div class="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 ring-1 ring-inset ring-slate-200">${escapeHtml(config.note)}</div>` : ''}
            ${
              config.logos.length
                ? `<section class="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 scroll-reveal">
                <div class="flex items-center justify-between gap-3 mb-3">
                  <h3 class="text-sm sm:text-base font-display font-extrabold text-brand-blue">Логотипы брендов водонагревателей</h3>
                  <span class="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">${config.logos.length} логотипов</span>
                </div>
                <ul class="flex flex-wrap gap-2.5">
                  ${config.logos.map((item) => renderBrandLogoTile(item)).join('')}
                </ul>
              </section>`
                : ''
            }
            <div class="mt-6 lg:mt-8 grid gap-4 sm:gap-5 md:grid-cols-2">
              ${config.groups.map((group) => renderBrandGroupCard(group)).join('')}
            </div>
          </div>
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
