const SITE_CONFIG = {
  company: {
    name: 'MosPochin',
    phoneDisplay: '8 (999) 005-71-72',
    phoneLink: '+79990057172',
    whatsapp:
      'https://wa.me/79990057172?text=Здравствуйте!%20Нужен%20ремонт.%20Сайт%20MosPochin',
    email: 'mospochin@yandex.ru',
    experience: '15+ лет',
    legal: {
      name: 'Кудашов Александр Викторович',
      inn: '772503580362',
      ogrn: '',
      address: '',
    },
  },
};

const PAGE_METADATA_PATH = '/data/page-metadata.json';
const CONTACT_CONFIG_PATH = '/data/contact-config.json';
const SCHEMA_PROFILE_PATH = '/data/schema-profile.json';
const RESTAURANT_BRANCH_PATH = '/data/restaurant-branch.json';
const HOUSEHOLD_BRANCH_PATH = '/data/household-branch.json';
const RESTAURANT_SERVICES_PATH = '/data/restaurant-services.json';
const RESTAURANT_PAGE_SLOTS_PATH = '/data/restaurant-page-slots.json';
const RESTAURANT_PROOF_LAYER_PATH = '/data/restaurant-proof-layer.json';
const HOUSEHOLD_SERVICES_PATH = '/data/household-services.json';
const HOUSEHOLD_PAGE_SLOTS_PATH = '/data/household-page-slots.json';
const HOUSEHOLD_CARD_PRESETS_PATH = '/data/household-card-presets.json';
const HOUSEHOLD_PROOF_LAYER_PATH = '/data/household-proof-layer.json';
const DEFAULT_CONTACT_CONFIG = Object.freeze({
  phoneDisplay: SITE_CONFIG.company.phoneDisplay,
  phoneE164: SITE_CONFIG.company.phoneLink,
  whatsappNumber: SITE_CONFIG.company.phoneLink.replace(/[^\d]/g, ''),
  whatsappDefaultText: 'Здравствуйте! Нужен ремонт. Сайт MosPochin',
  telegramHref: 'tg://resolve?phone=79990057172',
  email: SITE_CONFIG.company.email,
});
const DEFAULT_SCHEMA_PROFILE = Object.freeze({
  global: {
    provider: {
      name: SITE_CONFIG.company.name,
      url: 'https://mospochin.ru',
      addressLocality: 'Москва',
      addressCountry: 'RU',
      openingHours: 'Mo-Su 00:00-24:00',
    },
    areaServed: 'Москва и Московская область',
    offers: {
      priceCurrency: 'RUB',
      price: 'По согласованию после диагностики',
      availability: 'https://schema.org/InStock',
    },
  },
  branches: {
    restaurant: {
      descriptionTemplate: '{serviceName} с выездом на объект в Москве и МО.',
    },
    household: {
      descriptionTemplate: '{serviceName} на дому в Москве и Московской области.',
      provider: {
        aggregateRating: {
          ratingValue: '4.9',
          reviewCount: '500',
        },
      },
    },
  },
  pages: {},
});
const DEFAULT_RESTAURANT_BRANCH = Object.freeze({
  subtitle: '🔧 Ресторанное оборудование',
  contactHint: '⚡ Работаем 24/7',
  topBarText: {
    icon: 'ri-flashlight-fill',
    text: '🚨 АВАРИЙНЫЙ ВЫЕЗД',
    sub: 'Мастер будет через 45 минут',
  },
  services: [
    { href: 'uslugi.html', icon: '🔧', name: 'Все услуги' },
    { href: 'parokonvektomaty.html', icon: '🔥', name: 'Пароконвектоматы' },
    { href: 'plity-pechi.html', icon: '🍳', name: 'Плиты и печи' },
    {
      href: 'holodilnoe-oborudovanie.html',
      icon: '❄️',
      name: 'Холодильное оборудование',
    },
    { href: 'posudomoechnye-mashiny.html', icon: '🍽️', name: 'Посудомойки' },
    { href: 'grili-mangaly.html', icon: '🍳', name: 'Грили и фритюр' },
    { href: 'ice-machines.html', icon: '🧊', name: 'Льдогенераторы' },
  ],
  footerLinks: [
    { href: 'index.html', label: 'Главная' },
    { href: 'uslugi.html', label: 'Услуги' },
    { href: 'parokonvektomaty.html', label: 'Пароконвектоматы' },
    { href: 'plity-pechi.html', label: 'Плиты и печи' },
    {
      href: 'holodilnoe-oborudovanie.html',
      label: 'Холодильное оборудование',
    },
    { href: 'posudomoechnye-mashiny.html', label: 'Посудомойки' },
    { href: 'grili-mangaly.html', label: 'Грили и фритюр' },
    { href: 'ice-machines.html', label: 'Льдогенераторы' },
    { href: 'about.html', label: 'О компании' },
    { href: 'contact.html', label: 'Контакты' },
  ],
  routeStrips: {
    index: {
      badge: 'БЫСТРЫЙ МАРШРУТ',
      title: 'Если уже знаете симптом, переходите сразу',
      description:
        'Не нужно читать весь лендинг подряд. Выберите, что именно встало на кухне, и попадёте в нужную сервисную страницу.',
      action: {
        href: 'uslugi.html',
        label: 'Полный каталог услуг',
        icon: 'ri-arrow-right-line',
      },
      cards: [
        {
          href: 'parokonvektomaty.html',
          title: 'Ошибка у пароконвектомата',
          description: 'Rational, Unox, Electrolux, Abat',
        },
        {
          href: 'plity-pechi.html',
          title: 'Не греет горячая линия',
          description: 'Плиты, печи, шкафы, индукция',
        },
        {
          href: 'holodilnoe-oborudovanie.html',
          title: 'Не морозит или течёт',
          description: 'Шкафы, столы, витрины, камеры',
        },
        {
          href: 'posudomoechnye-mashiny.html',
          title: 'Не моет или не греет воду',
          description: 'Купольные, фронтальные, туннельные',
        },
      ],
    },
    uslugi: {
      badge: 'БЫСТРЫЙ ВЫБОР',
      title: 'Начните с симптома, если техника уже встала',
      description:
        'Этот хаб должен вести в нужное направление, а не заставлять читать всё подряд. Ниже быстрые маршруты по типовой проблеме кухни.',
      action: {
        href: '#full-services',
        label: 'Открыть полный список',
        icon: 'ri-arrow-down-line',
      },
      cards: [
        {
          href: 'parokonvektomaty.html',
          title: 'Ошибка у пароконвектомата',
          description: 'Rational, Unox, Electrolux, Abat',
        },
        {
          href: 'plity-pechi.html',
          title: 'Не греет горячая линия',
          description: 'Плиты, печи, шкафы, индукция',
        },
        {
          href: 'holodilnoe-oborudovanie.html',
          title: 'Не морозит или течёт',
          description: 'Шкафы, столы, витрины, камеры',
        },
        {
          href: 'posudomoechnye-mashiny.html',
          title: 'Не моет или не греет воду',
          description: 'Фронтальные, купольные, туннельные',
        },
      ],
    },
  },
});
const DEFAULT_HOUSEHOLD_BRANCH = Object.freeze({
  subtitle: '🏠 Бытовая техника',
  contactHint: '🏠 Выезд на дом',
  topBarText: {
    icon: 'ri-flashlight-fill',
    text: '🚨 СРОЧНЫЙ ВЫЕЗД НА ДОМ',
    sub: 'Мастер будет через 60 минут',
  },
  services: [
    { href: 'bytovaya-uslugi.html', icon: '🏠', name: 'Все услуги' },
    { href: 'holodilniki.html', icon: '❄️', name: 'Холодильники' },
    { href: 'stiralnye-mashiny.html', icon: '🧺', name: 'Стиральные машины' },
    { href: 'posudomoyki.html', icon: '🍽️', name: 'Посудомойки' },
    { href: 'plity.html', icon: '🍳', name: 'Плиты и духовки' },
    { href: 'microwaves.html', icon: '📻', name: 'Встроенные СВЧ' },
    { href: 'water-heaters.html', icon: '🚿', name: 'Водонагреватели' },
  ],
  footerLinks: [
    { href: 'bytovaya-index.html', label: 'Главная' },
    { href: 'bytovaya-uslugi.html', label: 'Услуги' },
    { href: 'holodilniki.html', label: 'Холодильники' },
    { href: 'stiralnye-mashiny.html', label: 'Стиральные машины' },
    { href: 'posudomoyki.html', label: 'Посудомойки' },
    { href: 'plity.html', label: 'Плиты и духовки' },
    { href: 'microwaves.html', label: 'Встроенные СВЧ' },
    { href: 'water-heaters.html', label: 'Водонагреватели' },
    { href: 'bytovaya-about.html', label: 'О компании' },
    { href: 'bytovaya-contact.html', label: 'Контакты' },
  ],
});
const RESTAURANT_PAGES = new Set([
  'index',
  'uslugi',
  'about',
  'contact',
  'parokonvektomaty',
  'parokonvektomaty-promo',
  'plity-pechi',
  'holodilnoe-oborudovanie',
  'posudomoechnye-mashiny',
  'grili-mangaly',
  'ice-machines',
]);

const HOUSEHOLD_PAGES = new Set([
  'bytovaya-index',
  'bytovaya-uslugi',
  'bytovaya-about',
  'bytovaya-contact',
  'holodilniki',
  'stiralnye-mashiny',
  'posudomoyki',
  'plity',
  'microwaves',
  'kompyutery',
  'routery',
  'water-heaters',
]);
const PAGE_CLASS_ALIASES = Object.freeze({
  'stiralnye-mashiny.html': ['page-stiralki'],
  'holodilniki.html': ['page-holodilniki'],
  'posudomoyki.html': ['page-posudomoyki'],
  'plity.html': ['page-plity'],
  'kompyutery.html': ['page-kompyutery'],
  'parokonvektomaty-promo.html': ['page-parokonvektomaty'],
});
const PAGE_WHATSAPP_INTENTS = Object.freeze({
  'parokonvektomaty.html': 'Здравствуйте! Нужен ремонт пароконвектомата в Москве. Отправлю бренд, модель, симптом и адрес объекта.',
  'parokonvektomaty-promo.html': 'Здравствуйте! У пароконвектомата ошибка, кухня стоит. Хочу согласовать срочный выезд. Отправлю фото дисплея, шильдика и адрес объекта.',
  'parokonvektomat-unox-af02-af08.html': 'Здравствуйте! У пароконвектомата Unox ошибка AF02/AF08. Отправлю фото дисплея, шильдика, модель и адрес объекта.',
  'parokonvektomat-rational-e9.html': 'Здравствуйте! У пароконвектомата Rational ошибка E9. Отправлю фото дисплея, шильдика, модель и адрес объекта.',
  'parokonvektomat-e02-e07-e10.html': 'Здравствуйте! У пароконвектомата ошибка E02/E07/E10. Отправлю фото дисплея, шильдика, модель и адрес объекта.',
  'parokonvektomat-kod-oshibki.html': 'Здравствуйте! Нужно разобрать код ошибки пароконвектомата. Отправлю фото дисплея, шильдика, модель и адрес объекта.',
  'parokonvektomat-rational.html': 'Здравствуйте! Нужен ремонт пароконвектомата Rational. Отправлю фото дисплея, шильдика, модель и адрес объекта.',
  'parokonvektomat-unox.html': 'Здравствуйте! Нужен ремонт пароконвектомата Unox. Отправлю фото дисплея, шильдика, модель и адрес объекта.',
  'parokonvektomat-ne-greet.html': 'Здравствуйте! Пароконвектомат не греет или не набирает температуру. Отправлю модель, фото шильдика и адрес объекта.',
  'parokonvektomat-net-para.html': 'Здравствуйте! В пароконвектомате нет пара или не держится влажность. Отправлю модель, фото шильдика и адрес объекта.',
  'remont-oborudovaniya-restorana-parokonvektomat.html': 'Здравствуйте! Нужен ремонт оборудования кухни ресторана, пароконвектомат. Отправлю модель, проблему, адрес и реквизиты для договора.',
  'parokonvektomat-abat.html': 'Здравствуйте! Нужен ремонт пароконвектомата Abat. Отправлю фото дисплея, шильдика, модель и адрес объекта.',
  'parokonvektomat-convotherm.html': 'Здравствуйте! Нужен ремонт пароконвектомата Convotherm. Отправлю фото дисплея, шильдика, модель и адрес объекта.',
  'parokonvektomat-electrolux.html': 'Здравствуйте! Нужен ремонт пароконвектомата Electrolux Professional. Отправлю фото дисплея, шильдика, модель и адрес объекта.',
  'parokonvektomat-lainox.html': 'Здравствуйте! Нужен ремонт пароконвектомата Lainox. Отправлю фото дисплея, шильдика, модель и адрес объекта.',
  'parokonvektomat-obschuzhivanie.html': 'Здравствуйте! Нужно обслуживание пароконвектомата. Отправлю бренд, модель, состояние и адрес объекта.',
});

function getCurrentPageSlug() {
  return (window.location.pathname.split('/').pop() || 'index.html').replace('.html', '');
}

function getCurrentPageFile() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

function getPageWhatsappText(pageFile = getCurrentPageFile()) {
  return PAGE_WHATSAPP_INTENTS[pageFile] || '';
}

function appendPageToWhatsappText(text) {
  const cleanText = String(text || '').trim();
  const pagePart = `Страница: ${window.location.href}`;
  if (!cleanText) return pagePart;
  if (cleanText.includes(window.location.href) || cleanText.includes('Страница:')) return cleanText;
  return `${cleanText}
${pagePart}`;
}

function toBodyPageClass(value) {
  return String(value || '')
    .trim()
    .replace(/[^a-z0-9-]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

let pageMetadataPromise = null;
let restaurantBranchPromise = null;
let householdBranchPromise = null;
let restaurantServicesPromise = null;
let restaurantPageSlotsPromise = null;
let restaurantProofLayerPromise = null;
let householdServicesPromise = null;
let householdPageSlotsPromise = null;
let householdCardPresetsPromise = null;
let householdProofLayerPromise = null;
let contactConfigPromise = null;
let schemaProfilePromise = null;

async function loadJson(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`${path} ${response.status}`);
  }

  return response.json();
}

async function loadCurrentPageMetadata() {
  if (!pageMetadataPromise) {
    pageMetadataPromise = (async () => {
      const json = await loadJson(PAGE_METADATA_PATH);
      return json.pages?.[getCurrentPageFile()] ?? null;
    })();
  }

  return pageMetadataPromise;
}

function toPhoneE164(value) {
  const compact = String(value ?? '').trim().replace(/[^\d+]/g, '');
  if (!compact) return DEFAULT_CONTACT_CONFIG.phoneE164;
  if (compact.startsWith('+')) return compact;
  return `+${compact}`;
}

function toWhatsappNumber(value, fallbackE164) {
  const fromValue = String(value ?? '').replace(/[^\d]/g, '');
  if (fromValue) return fromValue;
  return String(fallbackE164 ?? '').replace(/[^\d]/g, '');
}

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function withFallbackString(value, fallback) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function normalizeAggregateRating(value, fallback) {
  if (value === null) return null;
  if (!isRecord(value)) return fallback ?? null;

  const ratingValue = withFallbackString(value.ratingValue, fallback?.ratingValue ?? '');
  const reviewCount = withFallbackString(value.reviewCount, fallback?.reviewCount ?? '');
  if (!ratingValue || !reviewCount) return fallback ?? null;

  return {
    ratingValue,
    reviewCount,
  };
}

function normalizeSchemaLayer(layer, fallback = {}) {
  const source = isRecord(layer) ? layer : {};
  const fallbackProvider = isRecord(fallback.provider) ? fallback.provider : {};
  const fallbackOffers = isRecord(fallback.offers) ? fallback.offers : {};
  const sourceProvider = isRecord(source.provider) ? source.provider : {};
  const sourceOffers = isRecord(source.offers) ? source.offers : {};

  return {
    descriptionTemplate: withFallbackString(
      source.descriptionTemplate,
      withFallbackString(fallback.descriptionTemplate, '')
    ),
    provider: {
      name: withFallbackString(sourceProvider.name, withFallbackString(fallbackProvider.name, '')),
      url: withFallbackString(sourceProvider.url, withFallbackString(fallbackProvider.url, '')),
      addressLocality: withFallbackString(
        sourceProvider.addressLocality,
        withFallbackString(fallbackProvider.addressLocality, '')
      ),
      addressCountry: withFallbackString(
        sourceProvider.addressCountry,
        withFallbackString(fallbackProvider.addressCountry, '')
      ),
      openingHours: withFallbackString(
        sourceProvider.openingHours,
        withFallbackString(fallbackProvider.openingHours, '')
      ),
      aggregateRating: normalizeAggregateRating(
        sourceProvider.aggregateRating,
        normalizeAggregateRating(fallbackProvider.aggregateRating, null)
      ),
    },
    areaServed: withFallbackString(source.areaServed, withFallbackString(fallback.areaServed, '')),
    offers: {
      priceCurrency: withFallbackString(
        sourceOffers.priceCurrency,
        withFallbackString(fallbackOffers.priceCurrency, 'RUB')
      ),
      price: withFallbackString(sourceOffers.price, withFallbackString(fallbackOffers.price, '')),
      availability: withFallbackString(
        sourceOffers.availability,
        withFallbackString(fallbackOffers.availability, 'https://schema.org/InStock')
      ),
    },
  };
}

function mergeSchemaLayers(baseLayer, overrideLayer) {
  const base = isRecord(baseLayer) ? baseLayer : {};
  const override = isRecord(overrideLayer) ? overrideLayer : {};
  const mergedProvider = {
    ...(isRecord(base.provider) ? base.provider : {}),
    ...(isRecord(override.provider) ? override.provider : {}),
  };
  if (isRecord(override.provider) && Object.prototype.hasOwnProperty.call(override.provider, 'aggregateRating')) {
    mergedProvider.aggregateRating = override.provider.aggregateRating;
  }

  return {
    ...base,
    ...override,
    provider: mergedProvider,
    offers: {
      ...(isRecord(base.offers) ? base.offers : {}),
      ...(isRecord(override.offers) ? override.offers : {}),
    },
  };
}

function normalizeSchemaProfile(rawProfile) {
  const profile = isRecord(rawProfile) ? rawProfile : {};
  const defaultGlobal = normalizeSchemaLayer(DEFAULT_SCHEMA_PROFILE.global, DEFAULT_SCHEMA_PROFILE.global);
  const defaultRestaurant = normalizeSchemaLayer(
    DEFAULT_SCHEMA_PROFILE.branches.restaurant,
    defaultGlobal
  );
  const defaultHousehold = normalizeSchemaLayer(
    DEFAULT_SCHEMA_PROFILE.branches.household,
    defaultGlobal
  );

  const global = normalizeSchemaLayer(profile.global, defaultGlobal);
  const branches = {
    restaurant: normalizeSchemaLayer(profile.branches?.restaurant, defaultRestaurant),
    household: normalizeSchemaLayer(profile.branches?.household, defaultHousehold),
  };
  const pages = isRecord(profile.pages) ? profile.pages : {};

  return {
    global,
    branches,
    pages,
  };
}

function applyDescriptionTemplate(template, serviceName, fallback) {
  const preparedTemplate = withFallbackString(template, '');
  if (!preparedTemplate) return fallback;
  return preparedTemplate.replaceAll('{serviceName}', serviceName);
}

function normalizeContactConfig(rawConfig) {
  const phoneE164 = toPhoneE164(rawConfig?.phoneE164);
  return {
    phoneDisplay: String(rawConfig?.phoneDisplay ?? DEFAULT_CONTACT_CONFIG.phoneDisplay).trim(),
    phoneE164,
    whatsappNumber: toWhatsappNumber(rawConfig?.whatsappNumber, phoneE164),
    whatsappDefaultText: String(
      rawConfig?.whatsappDefaultText ?? DEFAULT_CONTACT_CONFIG.whatsappDefaultText
    ).trim(),
    telegramHref: normalizeTelegramHref(rawConfig?.telegramHref, phoneE164),
    email: String(rawConfig?.email ?? DEFAULT_CONTACT_CONFIG.email).trim(),
  };
}

function parseWhatsappTextFromHref(href) {
  if (typeof href !== 'string' || !href.includes('wa.me/')) return null;
  try {
    const url = new URL(href, window.location.origin);
    const text = url.searchParams.get('text');
    return text ? text.trim() : null;
  } catch {
    return null;
  }
}

function parseWhatsappTextFromToken(token) {
  if (typeof token !== 'string') return null;
  const trimmed = token.trim();
  if (!/^@contact-whatsapp(?:\?text=.*)?$/.test(trimmed)) return null;
  const query = trimmed.split('?', 2)[1];
  if (!query) return null;

  const params = new URLSearchParams(query);
  const text = params.get('text');
  return text ? text.trim() : null;
}

function buildWhatsappHref(number, text) {
  const sanitizedNumber = String(number ?? '').replace(/[^\d]/g, '');
  if (!sanitizedNumber) return '#';

  const message = String(text ?? '').trim();
  if (!message) return `https://wa.me/${sanitizedNumber}`;
  return `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(message)}`;
}

function normalizeTelegramHref(value, phoneE164) {
  const prepared = String(value ?? '').trim();
  if (/^tg:\/\/resolve\?phone=\d{10,15}$/.test(prepared)) return prepared;

  const fallbackNumber = String(phoneE164 ?? '').replace(/[^\d]/g, '');
  return fallbackNumber ? `tg://resolve?phone=${fallbackNumber}` : DEFAULT_CONTACT_CONFIG.telegramHref;
}

async function loadContactConfig() {
  if (!contactConfigPromise) {
    contactConfigPromise = (async () => {
      try {
        const json = await loadJson(CONTACT_CONFIG_PATH);
        return normalizeContactConfig(json);
      } catch (error) {
        console.error('Contact config unavailable:', error.message);
        return DEFAULT_CONTACT_CONFIG;
      }
    })();
  }

  return contactConfigPromise;
}

async function loadSchemaProfile() {
  if (!schemaProfilePromise) {
    schemaProfilePromise = (async () => {
      try {
        const json = await loadJson(SCHEMA_PROFILE_PATH);
        return normalizeSchemaProfile(json);
      } catch (error) {
        console.error('Schema profile unavailable:', error.message);
        return normalizeSchemaProfile(DEFAULT_SCHEMA_PROFILE);
      }
    })();
  }

  return schemaProfilePromise;
}

async function loadRestaurantBranchConfig() {
  if (!restaurantBranchPromise) {
    restaurantBranchPromise = (async () => {
      try {
        return await loadJson(RESTAURANT_BRANCH_PATH);
      } catch (error) {
        console.error('Restaurant branch config unavailable:', error.message);
        return DEFAULT_RESTAURANT_BRANCH;
      }
    })();
  }

  return restaurantBranchPromise;
}

async function loadHouseholdBranchConfig() {
  if (!householdBranchPromise) {
    householdBranchPromise = (async () => {
      try {
        return await loadJson(HOUSEHOLD_BRANCH_PATH);
      } catch (error) {
        console.error('Household branch config unavailable:', error.message);
        return DEFAULT_HOUSEHOLD_BRANCH;
      }
    })();
  }

  return householdBranchPromise;
}

async function loadRestaurantServicesRegistry() {
  if (!restaurantServicesPromise) {
    restaurantServicesPromise = (async () => {
      try {
        return await loadJson(RESTAURANT_SERVICES_PATH);
      } catch (error) {
        console.error('Restaurant services registry unavailable:', error.message);
        return { services: [] };
      }
    })();
  }

  return restaurantServicesPromise;
}

async function loadRestaurantPageSlots() {
  if (!restaurantPageSlotsPromise) {
    restaurantPageSlotsPromise = (async () => {
      try {
        return await loadJson(RESTAURANT_PAGE_SLOTS_PATH);
      } catch (error) {
        console.error('Restaurant page slots unavailable:', error.message);
        return { pages: {} };
      }
    })();
  }

  return restaurantPageSlotsPromise;
}

async function loadRestaurantProofLayer() {
  if (!restaurantProofLayerPromise) {
    restaurantProofLayerPromise = (async () => {
      try {
        return await loadJson(RESTAURANT_PROOF_LAYER_PATH);
      } catch (error) {
        console.error('Restaurant proof layer unavailable:', error.message);
        return { serviceDefaults: {} };
      }
    })();
  }

  return restaurantProofLayerPromise;
}

async function loadHouseholdServicesRegistry() {
  if (!householdServicesPromise) {
    householdServicesPromise = (async () => {
      try {
        return await loadJson(HOUSEHOLD_SERVICES_PATH);
      } catch (error) {
        console.error('Household services registry unavailable:', error.message);
        return { services: [] };
      }
    })();
  }

  return householdServicesPromise;
}

async function loadHouseholdPageSlots() {
  if (!householdPageSlotsPromise) {
    householdPageSlotsPromise = (async () => {
      try {
        return await loadJson(HOUSEHOLD_PAGE_SLOTS_PATH);
      } catch (error) {
        console.error('Household page slots unavailable:', error.message);
        return { pages: {} };
      }
    })();
  }

  return householdPageSlotsPromise;
}

async function loadHouseholdCardPresets() {
  if (!householdCardPresetsPromise) {
    householdCardPresetsPromise = (async () => {
      try {
        return await loadJson(HOUSEHOLD_CARD_PRESETS_PATH);
      } catch (error) {
        console.error('Household card presets unavailable:', error.message);
        return {
          allowedTones: ['slate', 'orange', 'blue', 'green'],
          ctaVocabulary: [],
          variants: {},
          pageIcons: {},
          pageTones: {},
        };
      }
    })();
  }

  return householdCardPresetsPromise;
}

async function loadHouseholdProofLayer() {
  if (!householdProofLayerPromise) {
    householdProofLayerPromise = (async () => {
      try {
        return await loadJson(HOUSEHOLD_PROOF_LAYER_PATH);
      } catch (error) {
        console.error('Household proof layer unavailable:', error.message);
        return {
          serviceDefaults: {},
          branchPages: {},
        };
      }
    })();
  }

  return householdProofLayerPromise;
}

function inferBranchFromSlug() {
  const page = getCurrentPageSlug();
  if (HOUSEHOLD_PAGES.has(page)) return 'household';
  if (RESTAURANT_PAGES.has(page)) return 'restaurant';
  return 'restaurant';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function observeElements(selector, options, onIntersect) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      onIntersect(entry, observer);
    });
  }, options);

  elements.forEach((element) => observer.observe(element));
}

const Components = {
  currentBranch: null,
  restaurantBranch: DEFAULT_RESTAURANT_BRANCH,
  householdBranch: DEFAULT_HOUSEHOLD_BRANCH,
  contactConfig: DEFAULT_CONTACT_CONFIG,
  schemaProfile: normalizeSchemaProfile(DEFAULT_SCHEMA_PROFILE),

  isBytovaya() {
    return (this.currentBranch || inferBranchFromSlug()) === 'household';
  },

  getRestaurantBranch() {
    return this.restaurantBranch || DEFAULT_RESTAURANT_BRANCH;
  },

  getHouseholdBranch() {
    return this.householdBranch || DEFAULT_HOUSEHOLD_BRANCH;
  },

  getBranchMeta() {
    const isBytovaya = this.isBytovaya();
    const restaurantBranch = this.getRestaurantBranch();
    const householdBranch = this.getHouseholdBranch();

    return {
      isBytovaya,
      subtitle: isBytovaya ? householdBranch.subtitle : restaurantBranch.subtitle,
      homeLink: isBytovaya ? 'bytovaya-index.html' : 'index.html',
      aboutLink: isBytovaya ? 'bytovaya-about.html' : 'about.html',
      contactLink: isBytovaya ? 'bytovaya-contact.html' : 'contact.html',
      servicesLink: isBytovaya ? 'bytovaya-uslugi.html' : 'uslugi.html',
      branchSwitchLink: isBytovaya ? 'index.html' : 'bytovaya-index.html',
      branchSwitchLabel: isBytovaya
        ? '🔧 Ресторанное оборудование'
        : '🏠 Бытовая техника',
      isBytovaya,
      services: isBytovaya ? householdBranch.services : restaurantBranch.services,
      primaryServices: isBytovaya
        ? householdBranch.primaryServices || householdBranch.services
        : restaurantBranch.primaryServices || restaurantBranch.services,
      topBarText: isBytovaya ? householdBranch.topBarText : restaurantBranch.topBarText,
      contactHint: isBytovaya ? householdBranch.contactHint : restaurantBranch.contactHint,
    };
  },

  isActivePage(fragment) {
    const currentPage = getCurrentPageSlug();
    const branch = this.getBranchMeta();
    const exactPages = {
      index: branch.homeLink.replace('.html', ''),
      uslugi: branch.servicesLink.replace('.html', ''),
      about: branch.aboutLink.replace('.html', ''),
      contact: branch.contactLink.replace('.html', ''),
    };

    return exactPages[fragment] === currentPage;
  },

  getHeader() {
    const branch = this.getBranchMeta();
    const serviceItems = branch.primaryServices
      .map(
        (service) =>
          `<a href="${service.href}" class="dropdown-item"><span class="icon">${service.icon}</span>${service.name}</a>`
      )
      .join('');

    return `
<!-- Top bar -->
<div class="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 text-center fixed top-0 w-full z-[60] shadow-lg">
  <div class="max-w-7xl mx-auto px-4 flex items-center justify-center gap-4">
    <i class="${branch.topBarText.icon} text-yellow-300"></i>
    <span class="font-bold">${branch.topBarText.text}</span>
    <span class="hidden sm:inline">•</span>
    <span class="hidden sm:inline font-semibold">${branch.topBarText.sub}</span>
    <span class="hidden md:inline">•</span>
    <a href="tel:${this.getPhoneLink()}" class="hidden md:inline font-bold hover:text-yellow-300 transition">
      <i class="ri-phone-line mr-1"></i>${this.getPhone()}
    </a>
  </div>
</div>
<nav class="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg glass-navbar" id="navbar">
  <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16 lg:h-20">
      <a href="${branch.homeLink}" class="flex items-center gap-2 lg:gap-3 flex-shrink-0">
        <div class="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-brand-orange to-orange-600 rounded-xl flex items-center justify-center text-white text-lg lg:text-xl shadow-lg flex-shrink-0">
          <i class="ri-tools-line"></i>
        </div>
        <div class="min-w-0 block">
          <span class="font-extrabold text-base sm:text-xl lg:text-2xl text-brand-blue tracking-tight block leading-tight">MosPochin</span>
          <span class="hidden sm:block text-xs text-slate-500 font-medium leading-tight truncate max-w-[12rem] lg:max-w-none">${branch.subtitle}</span>
        </div>
      </a>

      <div class="hidden lg:flex items-center gap-6">
        <a href="${branch.homeLink}" class="nav-link ${this.isActivePage('index') ? 'active' : ''}">Главная</a>
        <div class="dropdown">
          <a href="${branch.servicesLink}" class="nav-link dropdown-toggle ${this.isActivePage('uslugi') ? 'active' : ''}">
            Услуги <i class="ri-arrow-down-s-line text-xs ml-1"></i>
          </a>
          <div class="dropdown-menu">
            ${serviceItems}
          </div>
        </div>
        <a href="${branch.aboutLink}" class="nav-link ${this.isActivePage('about') ? 'active' : ''}">О нас</a>
        <a href="${branch.contactLink}" class="nav-link ${this.isActivePage('contact') ? 'active' : ''}">Контакты</a>
      </div>

      <div class="hidden lg:flex items-center gap-4">
        <div class="text-right">
          <p class="text-xs text-slate-500 font-medium">${branch.contactHint}</p>
          <a href="tel:${this.getPhoneLink()}" class="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg px-5 py-2.5 rounded-full transition-all shadow-lg">
            <i class="ri-phone-line animate-pulse"></i>
            <span>${this.getPhone()}</span>
          </a>
        </div>
      </div>

      <button
        id="mobile-menu-btn"
        class="lg:hidden bg-brand-orange hover:bg-brand-orangeHover text-white font-bold px-4 py-2 lg:px-5 lg:py-2.5 rounded-lg transition-all shadow-md text-sm flex-shrink-0"
        aria-label="Открыть меню"
        aria-expanded="false"
        aria-controls="mobile-menu"
        aria-haspopup="true"
        role="button"
      >
        <i class="ri-menu-line mr-2"></i>Меню
      </button>
    </div>
  </div>

  <div id="mobile-menu" class="hidden lg:hidden bg-white border-t border-slate-200 shadow-xl">
    <div class="px-4 py-4 space-y-3" id="mobile-menu-items"></div>
  </div>

  <div class="branch-switcher flex items-center gap-2 ml-4">
    <a href="${branch.branchSwitchLink}" class="text-xs font-semibold px-4 py-2 rounded-full bg-slate-100 text-slate-600 hover:bg-brand-orange hover:text-white transition border border-slate-200">
      ${branch.branchSwitchLabel}
    </a>
  </div>
</nav>`;
  },

  getFooter() {
    const restaurantLinks = this.getRestaurantBranch().footerLinks
      .map(
        (link) => `<li><a href="${link.href}" class="hover:text-white transition">${link.label}</a></li>`
      )
      .join('');
    const householdLinks = this.getHouseholdBranch().footerLinks
      .map(
        (link) => `<li><a href="${link.href}" class="hover:text-white transition">${link.label}</a></li>`
      )
      .join('');
    const legal = SITE_CONFIG.company.legal || {};
    const hasLegal = legal.name && legal.inn;
    const legalBlock = hasLegal
      ? `
    <div class="mt-6 border-t border-slate-800 pt-6 text-left text-xs leading-relaxed" data-legal-requisites>
      <p class="mb-2 font-bold text-slate-300">Рекламодатель</p>
      <ul class="space-y-1">
        <li>${escapeHtml(legal.name)}</li>
        <li>ИНН: ${escapeHtml(legal.inn)}</li>
        ${legal.ogrn ? `<li>ОГРН/ОГРНИП: ${escapeHtml(legal.ogrn)}</li>` : ''}
        ${legal.address ? `<li>${escapeHtml(legal.address)}</li>` : ''}
      </ul>
    </div>`
      : '';

    return `
<footer class="bg-brand-blue text-slate-400 py-12 border-t border-slate-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid md:grid-cols-4 gap-8 mb-8">
      <div>
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-brand-orange to-orange-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <i class="ri-tools-line"></i>
          </div>
          <span class="font-extrabold text-xl text-white">MosPochin</span>
        </div>
        <p class="text-sm max-w-sm">Профессиональный ремонт техники в Москве и МО. Быстро, честно, с гарантией.</p>
      </div>

      <div>
        <h5 class="text-white font-bold mb-4">🔧 Ресторанное</h5>
        <ul class="space-y-2 text-sm">
          ${restaurantLinks}
        </ul>
      </div>

      <div>
        <h5 class="text-white font-bold mb-4">🏠 Бытовая техника</h5>
        <ul class="space-y-2 text-sm">
          ${householdLinks}
        </ul>
      </div>

      <div>
        <h5 class="text-white font-bold mb-4">📞 Контакты</h5>
        <ul class="space-y-3 text-sm">
          <li class="flex items-center gap-2">
            <i class="ri-phone-line text-brand-orange"></i>
            <a href="tel:${this.getPhoneLink()}" class="hover:text-white transition font-bold">${this.getPhone()}</a>
          </li>
          <li class="flex items-center gap-2">
            <i class="ri-time-line text-brand-orange"></i>
            <span>24/7 Без выходных</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="ri-map-pin-line text-brand-orange"></i>
            <span>Москва и МО</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-slate-800 pt-8 text-center text-xs">
      <p>&copy; ${new Date().getFullYear()} MosPochin. Все права защищены.</p>
      ${legalBlock}
    </div>
  </div>
</footer>`;
  },

  initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const items = document.getElementById('mobile-menu-items');

    if (!btn || !menu || !items) return;

    const branch = this.getBranchMeta();
    const serviceLinks = branch.primaryServices
      .map(
        (service) =>
          `<a href="${service.href}" class="block pl-8 py-2 text-sm text-slate-600 hover:text-brand-orange hover:bg-orange-50 rounded-lg">${service.name}</a>`
      )
      .join('');

    items.innerHTML = `
<a href="${branch.homeLink}" class="block px-3 py-2 text-base font-medium ${this.isActivePage('index') ? 'text-brand-orange bg-orange-50' : 'text-slate-700 hover:bg-slate-50'} rounded-lg">🏠 Главная</a>
<div class="mt-3">
  <button class="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg" id="mobile-services-toggle">
    <span>🔧 Услуги</span>
    <i class="ri-arrow-down-s-line text-xs transition-transform" id="mobile-services-icon"></i>
  </button>
  <div class="mt-2 space-y-1 hidden" id="mobile-services-list">
    ${serviceLinks}
  </div>
</div>
<a href="${branch.aboutLink}" class="block px-3 py-2 text-base font-medium ${this.isActivePage('about') ? 'text-brand-orange bg-orange-50' : 'text-slate-700 hover:bg-slate-50'} rounded-lg mt-3">ℹ️ О нас</a>
<a href="${branch.contactLink}" class="block px-3 py-2 text-base font-medium ${this.isActivePage('contact') ? 'text-brand-orange bg-orange-50' : 'text-slate-700 hover:bg-slate-50'} rounded-lg">📞 Контакты</a>
<div class="border-t border-slate-200 my-3"></div>
<a href="tel:${this.getPhoneLink()}" class="block w-full text-center bg-brand-orange text-white px-4 py-3 rounded-lg font-bold text-lg"><i class="ri-phone-line mr-2"></i>Позвонить</a>
<div class="border-t border-slate-200 my-2"></div>
<a href="${branch.branchSwitchLink}" class="block w-full text-center bg-brand-orange/10 text-brand-orange px-4 py-3 rounded-lg font-bold text-sm border-2 border-brand-orange/30">
  ${branch.isBytovaya ? '🔧 Перейти: Ресторанное оборудование' : '🏠 Перейти: Бытовая техника'}
</a>`;

    const servicesToggle = document.getElementById('mobile-services-toggle');
    const servicesList = document.getElementById('mobile-services-list');
    const servicesIcon = document.getElementById('mobile-services-icon');

    if (servicesToggle && servicesList && servicesIcon) {
      servicesToggle.addEventListener('click', () => {
        servicesList.classList.toggle('hidden');
        servicesIcon.style.transform = servicesList.classList.contains('hidden')
          ? 'rotate(0deg)'
          : 'rotate(180deg)';
      });
    }

    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', String(!menu.classList.contains('hidden')));
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  },

  initScrollEffect() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('shadow-md', window.scrollY > 50);
    });
  },

  initFadeIn() {
    observeElements(
      '.fade-in-section, .scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-scale',
      { threshold: 0.1 },
      (entry, observer) => {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    );
  },

  initSmoothScroll() {
    document.addEventListener('click', (event) => {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor || anchor.getAttribute('href') === '#') return;

      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  },

  initCounters() {
    document.querySelectorAll('.counter').forEach((element) => {
      const target = Number.parseInt(element.dataset.target || '0', 10);
      if (!Number.isFinite(target)) return;

      const suffix = element.dataset.suffix || '';
      const finalValue = `${target}${suffix}`;
      const fallbackValue = element.textContent.trim() || finalValue;

      element.dataset.finalValue = fallbackValue;
      element.setAttribute('aria-label', fallbackValue);

      // P0 trust fix: keep the HTML fallback value intact.
      // No-JS/text-only/render-before-animation must show the real number,
      // not a temporary 0{suffix} state.
      if (!element.textContent.trim()) {
        element.textContent = fallbackValue;
      }
    });

    observeElements('.counter', { threshold: 0.5 }, (entry, observer) => {
      const element = entry.target;
      if (element.dataset.counterAnimated === 'true') {
        observer.unobserve(element);
        return;
      }

      const target = Number.parseInt(element.dataset.target || '0', 10);
      const suffix = element.dataset.suffix || '';
      const finalValue = element.dataset.finalValue || `${target}${suffix}`;
      const duration = 2000;
      const start = performance.now();

      element.classList.add('is-visible');

      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        element.textContent = progress === 1 ? finalValue : `${Math.floor(eased * target)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          element.dataset.counterAnimated = 'true';
        }
      };

      requestAnimationFrame(update);
      observer.unobserve(element);
    });
  },

  initHeadingReveal() {
    observeElements('.heading-reveal', { threshold: 0.2 }, (entry, observer) => {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },

  getPhone() {
    return this.contactConfig.phoneDisplay || DEFAULT_CONTACT_CONFIG.phoneDisplay;
  },

  getPhoneLink() {
    return this.contactConfig.phoneE164 || DEFAULT_CONTACT_CONFIG.phoneE164;
  },

  getWhatsappHref(preferredText = '') {
    const message =
      typeof preferredText === 'string' && preferredText.trim()
        ? preferredText.trim()
        : this.contactConfig.whatsappDefaultText;
    return buildWhatsappHref(this.contactConfig.whatsappNumber, message);
  },

  getTelegramHref() {
    return this.contactConfig.telegramHref || DEFAULT_CONTACT_CONFIG.telegramHref;
  },

  getSchemaProfileForPage() {
    const branchKey = this.isBytovaya() ? 'household' : 'restaurant';
    const pageKey = getCurrentPageFile();
    const profile = this.schemaProfile || normalizeSchemaProfile(DEFAULT_SCHEMA_PROFILE);
    const globalLayer = profile.global || DEFAULT_SCHEMA_PROFILE.global;
    const branchLayer = profile.branches?.[branchKey] || {};
    const pageLayer = profile.pages?.[pageKey];
    const mergedBase = mergeSchemaLayers(globalLayer, branchLayer);
    const merged = mergeSchemaLayers(mergedBase, pageLayer);
    return normalizeSchemaLayer(merged, mergedBase);
  },

  resolveContactHref(rawHref, preferredWhatsappText = '') {
    if (typeof rawHref !== 'string' || !rawHref.trim()) return '#';

    const href = rawHref.trim();
    if (href === '@contact-phone') {
      return `tel:${this.getPhoneLink()}`;
    }

    if (/^@contact-whatsapp(?:\?text=.*)?$/.test(href)) {
      const tokenText = parseWhatsappTextFromToken(href);
      return this.getWhatsappHref(tokenText || preferredWhatsappText);
    }

    if (href === '@contact-telegram' || href.startsWith('tg://')) {
      return this.getTelegramHref();
    }

    if (href.startsWith('tel:')) {
      return `tel:${this.getPhoneLink()}`;
    }

    if (href.includes('wa.me/')) {
      const hrefText = parseWhatsappTextFromHref(href);
      return this.getWhatsappHref(preferredWhatsappText || hrefText || '');
    }

    return href;
  },

  hydrateContactLinks() {
    const phoneTargets = document.querySelectorAll('[data-company-phone]');
    const phoneLinks = document.querySelectorAll('a[data-contact-link="phone"]');
    const whatsappLinks = document.querySelectorAll('a[data-contact-link="whatsapp"]');
    const telegramLinks = document.querySelectorAll('a[data-contact-link="telegram"]');

    phoneTargets.forEach((node) => {
      node.textContent = this.getPhone();
    });

    phoneLinks.forEach((node) => {
      node.setAttribute('href', this.resolveContactHref(node.getAttribute('href') || 'tel:'));
    });

    whatsappLinks.forEach((node) => {
      const currentHref = node.getAttribute('href') || 'https://wa.me/';
      const hrefText = parseWhatsappTextFromHref(currentHref) || parseWhatsappTextFromToken(currentHref) || '';
      const pageText = getPageWhatsappText();
      const preferredText = node.dataset.whatsappText || hrefText || pageText || '';
      if (pageText && !node.dataset.whatsappIntent) node.dataset.whatsappIntent = getCurrentPageFile();
      node.setAttribute(
        'href',
        this.resolveContactHref(currentHref, appendPageToWhatsappText(preferredText))
      );
    });

    telegramLinks.forEach((node) => {
      node.setAttribute('href', this.resolveContactHref(node.getAttribute('href') || '@contact-telegram'));
    });
  },

  initBranchRouteStrips() {
    const sections = document.querySelectorAll('[data-restaurant-route-strip]');
    const routeStrips = this.getRestaurantBranch().routeStrips || {};

    sections.forEach((section) => {
      const routeKey = section.dataset.restaurantRouteStrip;
      const routeStrip = routeStrips[routeKey];
      if (!routeStrip) return;

      const badge = section.querySelector('[data-route-strip-badge]');
      const title = section.querySelector('[data-route-strip-title]');
      const description = section.querySelector('[data-route-strip-description]');
      const action = section.querySelector('[data-route-strip-action]');
      const actionLabel = section.querySelector('[data-route-strip-action-label]');
      const actionIcon = section.querySelector('[data-route-strip-action-icon]');
      const grid = section.querySelector('[data-route-strip-grid]');

      if (badge) badge.textContent = routeStrip.badge;
      if (title) title.textContent = routeStrip.title;
      if (description) description.textContent = routeStrip.description;
      if (action) action.setAttribute('href', routeStrip.action.href);
      if (actionLabel) actionLabel.textContent = routeStrip.action.label;
      if (actionIcon) actionIcon.className = routeStrip.action.icon;
      if (grid) {
        grid.innerHTML = routeStrip.cards
          .map(
            (card) => `
              <a href="${card.href}" class="rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-brand-orange hover:shadow-md">
                <p class="text-sm font-bold text-brand-blue">${card.title}</p>
                <p class="mt-1 text-sm text-slate-500">${card.description}</p>
              </a>
            `
          )
          .join('');
      }
    });
  },

  renderHouseholdBadgeList(items, tone = 'slate') {
    const toneClasses = {
      slate: 'bg-slate-100 text-slate-700',
      orange: 'bg-brand-orange/10 text-brand-orange',
      blue: 'bg-brand-blue/10 text-brand-blue',
    };
    const className = toneClasses[tone] || toneClasses.slate;

    return items
      .map(
        (item) =>
          `<span class="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${className}">${escapeHtml(item)}</span>`
      )
      .join('');
  },

  getHouseholdCardTone(tone) {
    return {
      slate: {
        card: 'household-card--slate',
        badge: 'bg-slate-100 text-slate-700',
        button: 'household-card__button--slate',
      },
      orange: {
        card: 'household-card--orange',
        badge: 'bg-brand-orange/10 text-brand-orange',
        button: 'household-card__button--orange',
      },
      blue: {
        card: 'household-card--blue',
        badge: 'bg-brand-blue/10 text-brand-blue',
        button: 'household-card__button--blue',
      },
      green: {
        card: 'household-card--green',
        badge: 'bg-green-100 text-green-700',
        button: 'household-card__button--green',
      },
    }[tone] || {
      card: 'household-card--slate',
      badge: 'bg-slate-100 text-slate-700',
      button: 'household-card__button--slate',
    };
  },

  updateHouseholdCardSectionCopy(sectionKey, sectionConfig) {
    if (!sectionConfig) return;

    for (const fieldName of ['badge', 'title', 'description']) {
      const node = document.querySelector(`[data-slot-copy="${sectionKey}.${fieldName}"]`);
      if (node && sectionConfig[fieldName]) {
        node.textContent = sectionConfig[fieldName];
      }
    }

    const actionNode = document.querySelector(`[data-slot-action="${sectionKey}.action"]`);
    if (actionNode && sectionConfig.action?.href) {
      actionNode.setAttribute('href', this.resolveContactHref(sectionConfig.action.href));
    }

    const actionLabelNode = document.querySelector(`[data-slot-copy="${sectionKey}.action.label"]`);
    if (actionLabelNode && sectionConfig.action?.label) {
      actionLabelNode.textContent = sectionConfig.action.label;
    }
  },

  updateRestaurantCardSectionCopy(sectionKey, sectionConfig) {
    if (!sectionConfig) return;

    for (const fieldName of ['badge', 'title', 'description']) {
      const node = document.querySelector(`[data-slot-copy="${sectionKey}.${fieldName}"]`);
      if (node && sectionConfig[fieldName]) {
        node.textContent = sectionConfig[fieldName];
      }
    }
  },

  renderHouseholdServiceCards(pages, serviceMap, cardPresets, mode = 'full') {
    const icons = cardPresets?.pageIcons || {};
    const tones = cardPresets?.pageTones || {};

    return pages
      .map((page) => serviceMap.get(page))
      .filter((entry) => entry && !entry.isShadow)
      .map((entry) => {
        const toneKey = tones[entry.page] || 'slate';
        const tone = this.getHouseholdCardTone(toneKey);
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
  },

  renderHouseholdTrustCards(cards) {
    return cards
      .map((card) => {
        const tone = this.getHouseholdCardTone(card.tone || 'slate');

        return `
          <article class="household-card household-card--trust ${tone.card}">
            <div class="household-card__topline">
              <span class="household-card__eyebrow ${tone.badge}">Без лишней суеты</span>
              <span class="household-card__icon"><i class="${escapeHtml(card.icon || 'ri-checkbox-circle-line')}"></i></span>
            </div>
            <h3 class="household-card__title">${escapeHtml(card.title)}</h3>
            <p class="household-card__description">${escapeHtml(card.description)}</p>
            ${card.outcome ? `<p class="household-card__meta">${escapeHtml(card.outcome)}</p>` : ''}
          </article>
        `;
      })
      .join('');
  },

  renderHouseholdProofCards(cards) {
    return (cards || [])
      .map((card) => {
        const tone = this.getHouseholdCardTone(card.tone || 'slate');

        return `
          <article class="household-card household-card--proof ${tone.card}">
            <div class="household-card__topline">
              <span class="household-card__eyebrow ${tone.badge}">${escapeHtml(card.badge || 'Без сюрпризов')}</span>
              <span class="household-card__icon"><i class="${escapeHtml(card.icon || 'ri-shield-check-line')}"></i></span>
            </div>
            <h3 class="household-card__title">${escapeHtml(card.title)}</h3>
            <p class="household-card__description">${escapeHtml(card.description)}</p>
            ${card.outcome ? `<p class="household-card__meta">${escapeHtml(card.outcome)}</p>` : ''}
          </article>
        `;
      })
      .join('');
  },

  renderHouseholdReviewCards(cards) {
    return (cards || [])
      .map((card) => {
        const tone = this.getHouseholdCardTone(card.tone || 'slate');

        return `
          <article class="household-card household-card--review ${tone.card}">
            <div class="household-card__topline">
              <span class="household-card__eyebrow ${tone.badge}">${escapeHtml(card.badge || 'Отзыв')}</span>
              <span class="household-card__stars" aria-hidden="true">★★★★★</span>
            </div>
            <p class="household-card__quote">«${escapeHtml(card.quote || '')}»</p>
            <div class="household-card__reviewer">
              <strong>${escapeHtml(card.author || '')}</strong>
              <span>${escapeHtml(card.meta || '')}</span>
            </div>
          </article>
        `;
      })
      .join('');
  },

  renderHouseholdCaseCards(cards) {
    return (cards || [])
      .map((card) => {
        const tone = this.getHouseholdCardTone(card.tone || 'slate');

        return `
          <article class="household-card household-card--case ${tone.card}">
            <div class="household-card__topline">
              <span class="household-card__eyebrow ${tone.badge}">${escapeHtml(card.badge || 'Кейс')}</span>
              <span class="household-card__icon"><i class="${escapeHtml(card.icon || 'ri-file-list-3-line')}"></i></span>
            </div>
            <h3 class="household-card__title">${escapeHtml(card.title || '')}</h3>
            <p class="household-card__description">${escapeHtml(card.description || '')}</p>
            ${card.result ? `<p class="household-card__meta">${escapeHtml(card.result)}</p>` : ''}
            ${card.meta ? `<p class="household-card__case-meta">${escapeHtml(card.meta)}</p>` : ''}
          </article>
        `;
      })
      .join('');
  },

  renderHouseholdSlaStrip(sectionConfig) {
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
              const tone = this.getHouseholdCardTone(item.tone || 'slate');
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
  },

  renderHouseholdCardActions(actions, inheritedTone = 'slate') {
    return (actions || [])
      .map((action) => {
        const tone = this.getHouseholdCardTone(action.tone || inheritedTone);
        const resolvedHref = this.resolveContactHref(action.href || '#');
        const isExternal = /^(?:https?:\/\/|tg:\/\/)/.test(resolvedHref);
        return `
          <a href="${resolvedHref}" class="household-card__button ${tone.button}" ${
            isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''
          }>
            <span>${escapeHtml(action.label)}</span>
          </a>
        `;
      })
      .join('');
  },

  renderHouseholdContactCards(cards) {
    return cards
      .map((card) => {
        const toneKey = card.tone || 'slate';
        const tone = this.getHouseholdCardTone(toneKey);
        return `
          <article class="household-card household-card--contact ${tone.card}">
            <div class="household-card__topline">
              <span class="household-card__eyebrow ${tone.badge}">${escapeHtml(card.badge)}</span>
              <span class="household-card__icon"><i class="${escapeHtml(card.icon || 'ri-chat-check-line')}"></i></span>
            </div>
            <h3 class="household-card__title">${escapeHtml(card.title)}</h3>
            <p class="household-card__description">${escapeHtml(card.description)}</p>
            <ul class="household-card__list">
              ${(card.bullets || [])
                .map(
                  (item) => `
                    <li><i class="ri-check-line"></i><span>${escapeHtml(item)}</span></li>
                  `
                )
                .join('')}
            </ul>
            ${card.note ? `<p class="household-card__note">${escapeHtml(card.note)}</p>` : ''}
            <div class="household-card__actions">
              ${this.renderHouseholdCardActions(card.actions, toneKey)}
            </div>
          </article>
        `;
      })
      .join('');
  },

  renderHouseholdRoutingHint(section) {
    if (!section || !Array.isArray(section.cards) || section.cards.length === 0) return '';

    return `
      <div class="rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-6 lg:p-8 shadow-sm">
        <div class="household-section-intro household-section-intro--left">
          <span class="inline-flex items-center rounded-full bg-brand-blue/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-brand-blue">${escapeHtml(section.badge || 'Как выбрать страницу')}</span>
          <h3 class="mt-4 text-2xl sm:text-3xl font-display font-extrabold text-brand-blue">${escapeHtml(section.title || '')}</h3>
          <p class="mt-3 max-w-3xl text-slate-600">${escapeHtml(section.description || '')}</p>
        </div>
        <div class="mt-6 household-card-grid household-card-grid--proof">
          ${this.renderHouseholdProofCards(section.cards)}
        </div>
      </div>
    `;
  },

  renderHouseholdAdvisorySection(section) {
    if (!section) return '';

    const renderGuidanceList = (items, tone, icon, title) => {
      if (!Array.isArray(items) || items.length === 0) return '';
      const cardTone = this.getHouseholdCardTone(tone);

      return `
        <article class="household-card household-card--proof ${cardTone.card}">
          <div class="household-card__topline">
            <span class="household-card__eyebrow ${cardTone.badge}">${escapeHtml(title)}</span>
            <span class="household-card__icon"><i class="${escapeHtml(icon)}"></i></span>
          </div>
          <ul class="household-card__list">
            ${items
              .map(
                (item) => `
                  <li><i class="ri-check-line"></i><span>${escapeHtml(item)}</span></li>
                `
              )
              .join('')}
          </ul>
        </article>
      `;
    };

    return `
      <div class="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
        <div class="household-section-intro household-section-intro--left">
          <span class="inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-brand-orange">${escapeHtml(section.badge || 'Перед заявкой')}</span>
          <h2 class="mt-4 text-2xl sm:text-3xl font-display font-extrabold text-brand-blue">${escapeHtml(section.title || '')}</h2>
          <p class="mt-3 max-w-3xl text-slate-600">${escapeHtml(section.description || '')}</p>
        </div>
        <div class="mt-6 household-card-grid household-card-grid--proof">
          ${renderGuidanceList(section.safeChecks, 'blue', 'ri-search-eye-line', 'Можно проверить самому')}
          ${renderGuidanceList(section.dontDoList, 'slate', 'ri-forbid-2-line', 'Лучше не делать')}
          ${renderGuidanceList(section.urgencySignals, 'orange', 'ri-alarm-warning-line', 'Когда уже лучше не тянуть')}
        </div>
      </div>
    `;
  },

  hydrateHouseholdCardSections(slotEntry, serviceMap, cardPresets) {
    const sections = slotEntry?.cardSections;
    if (sections && typeof sections === 'object') {
      if (sections.categoryCards) {
        this.updateHouseholdCardSectionCopy('category-cards', sections.categoryCards);
        const container = document.querySelector('[data-slot="category-cards"]');
        if (container) {
          container.className = 'household-card-grid household-card-grid--services';
          container.innerHTML = this.renderHouseholdServiceCards(
            sections.categoryCards.pages || [],
            serviceMap,
            cardPresets
          );
        }
      }

      if (sections.trustCards) {
        this.updateHouseholdCardSectionCopy('trust-cards', sections.trustCards);
        const container = document.querySelector('[data-slot="trust-cards"]');
        if (container) {
          container.className = 'household-card-grid household-card-grid--trust';
          container.innerHTML = this.renderHouseholdTrustCards(sections.trustCards.cards || []);
        }
      }

      if (sections.contactChannels) {
        this.updateHouseholdCardSectionCopy('contact-channels', sections.contactChannels);
        const container = document.querySelector('[data-slot="contact-channels"]');
        if (container) {
          container.className = 'household-card-grid household-card-grid--contact';
          container.innerHTML = this.renderHouseholdContactCards(
            sections.contactChannels.cards || []
          );
        }
      }
    }

    if (slotEntry?.routingHint) {
      const container = document.querySelector('[data-slot="routing-hint"]');
      if (container) {
        container.className = 'mt-6';
        container.innerHTML = this.renderHouseholdRoutingHint(slotEntry.routingHint);
      }
    }
  },

  hydrateHouseholdProofSections(currentPage, proofLayer) {
    const sections = proofLayer?.branchPages?.[currentPage];
    if (!sections || typeof sections !== 'object') return;

    if (sections.proofCards) {
      this.updateHouseholdCardSectionCopy('proof-cards', sections.proofCards);
      const container = document.querySelector('[data-slot="proof-cards"]');
      if (container) {
        container.className = 'household-card-grid household-card-grid--proof';
        container.innerHTML = this.renderHouseholdProofCards(sections.proofCards.cards || []);
      }
    }

    if (sections.reviewCards) {
      this.updateHouseholdCardSectionCopy('review-cards', sections.reviewCards);
      const container = document.querySelector('[data-slot="review-cards"]');
      if (container) {
        container.className = 'household-card-grid household-card-grid--reviews';
        container.innerHTML = this.renderHouseholdReviewCards(sections.reviewCards.cards || []);
      }
    }

    if (sections.caseCards) {
      this.updateHouseholdCardSectionCopy('case-cards', sections.caseCards);
      const container = document.querySelector('[data-slot="case-cards"]');
      if (container) {
        container.className = 'household-card-grid household-card-grid--cases';
        container.innerHTML = this.renderHouseholdCaseCards(sections.caseCards.cards || []);
      }
    }

    if (sections.objectionCards) {
      this.updateHouseholdCardSectionCopy('objection-cards', sections.objectionCards);
      const container = document.querySelector('[data-slot="objection-cards"]');
      if (container) {
        container.className = 'household-card-grid household-card-grid--proof';
        container.innerHTML = this.renderHouseholdProofCards(sections.objectionCards.cards || []);
      }
    }
  },

  hydrateHouseholdServiceSchema(service, pageMetadata, slotEntry) {
    const schemaScript = document.querySelector('script[data-slot="service-schema"]');
    if (!schemaScript || !service) return;
    const schemaProfile = this.getSchemaProfileForPage();

    const schemaDescription =
      slotEntry?.serviceSchema?.description ||
      pageMetadata?.description ||
      applyDescriptionTemplate(
        schemaProfile.descriptionTemplate,
        service.serviceName,
        `${service.serviceName} на дому в Москве и Московской области.`
      );
    const areaServed = slotEntry?.serviceSchema?.areaServed || schemaProfile.areaServed;
    const priceLabel = slotEntry?.serviceSchema?.price || schemaProfile.offers.price;
    const aggregateRating = schemaProfile.provider.aggregateRating;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.schemaName,
      description: schemaDescription,
      provider: {
        '@type': 'LocalBusiness',
        name: schemaProfile.provider.name,
        telephone: this.getPhoneLink(),
        url: schemaProfile.provider.url,
        address: {
          '@type': 'PostalAddress',
          addressLocality: schemaProfile.provider.addressLocality,
          addressCountry: schemaProfile.provider.addressCountry,
        },
        openingHours: schemaProfile.provider.openingHours,
        ...(aggregateRating
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: aggregateRating.ratingValue,
                reviewCount: aggregateRating.reviewCount,
              },
            }
          : {}),
      },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: areaServed,
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: schemaProfile.offers.priceCurrency,
        price: priceLabel,
        availability: schemaProfile.offers.availability,
      },
    };

    schemaScript.textContent = JSON.stringify(schema, null, 2);
  },

  hydrateHouseholdRequestForm(service, slotEntry) {
    const form =
      document.querySelector('form.telegram-form[data-slot="request-form"]') ||
      document.querySelector('form.telegram-form');
    if (!form || !service || !slotEntry?.formHints) return null;

    const typeInput = form.querySelector('input[name="type"]');
    const problemInput = form.querySelector('input[name="problem"]');

    if (typeInput && slotEntry.formHints.typePlaceholder) {
      typeInput.setAttribute('placeholder', slotEntry.formHints.typePlaceholder);
    }

    if (problemInput && slotEntry.formHints.problemPlaceholder) {
      problemInput.setAttribute('placeholder', slotEntry.formHints.problemPlaceholder);
    }

    let slotZone = form.querySelector('[data-household-slot-zone="request-overview"]');
    if (!slotZone) {
      slotZone = document.createElement('div');
      slotZone.dataset.householdSlotZone = 'request-overview';
      slotZone.className =
        'mb-6 rounded-2xl border border-slate-200 bg-slate-50/90 p-4 sm:p-5';
      form.insertBefore(slotZone, form.firstElementChild);
    }

    const hintChips = Array.isArray(slotEntry.formHints.chips)
      ? slotEntry.formHints.chips.filter(Boolean)
      : [];

    slotZone.innerHTML = `
      <div class="mb-4">
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Что полезно указать сразу</p>
        <div class="mt-3 flex flex-wrap gap-2">
          ${this.renderHouseholdBadgeList(hintChips, 'orange')}
        </div>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <p class="text-sm font-bold text-brand-blue">Частые симптомы</p>
          <div class="mt-2 flex flex-wrap gap-2">
            ${this.renderHouseholdBadgeList(service.primarySymptoms || [], 'slate')}
          </div>
        </div>
        <div>
          <p class="text-sm font-bold text-brand-blue">Частые бренды</p>
          <div class="mt-2 flex flex-wrap gap-2">
            ${this.renderHouseholdBadgeList(service.brandCluster || [], 'blue')}
          </div>
        </div>
      </div>
      <p class="mt-4 text-xs text-slate-500">Пример описания: ${escapeHtml(service.formExample || '')}</p>
    `;

    return form;
  },

  hydrateHouseholdFaq(slotEntry) {
    if (!Array.isArray(slotEntry?.faq) || slotEntry.faq.length === 0) return;

    const faqSection = [...document.querySelectorAll('section')]
      .filter((section) => section.querySelector('.faq-item'))
      .at(-1);
    if (!faqSection) return;

    const faqContainer =
      faqSection.querySelector('.space-y-4') ||
      faqSection.querySelector('.space-y-5') ||
      faqSection.querySelector('.grid') ||
      faqSection.querySelector('.faq-item')?.parentElement;

    if (!faqContainer) return;

    faqContainer.className = 'space-y-4';
    faqContainer.innerHTML = slotEntry.faq
      .map(
        (item, index) => `
          <details class="faq-item bg-white p-6 rounded-2xl border-2 border-slate-100 cursor-pointer scroll-reveal" data-delay="${index + 1}">
            <summary class="font-bold text-brand-blue text-lg flex items-center justify-between">
              <span>${escapeHtml(item.question)}</span>
              <span class="text-brand-orange transition-transform duration-300">+</span>
            </summary>
            <p class="mt-4 text-slate-600">${escapeHtml(item.answer)}</p>
          </details>
        `
      )
      .join('');
  },

  hydrateHouseholdServiceAdvisory(slotEntry, anchorForm) {
    if (!slotEntry?.advisoryCards || !anchorForm) return;

    const container = document.querySelector('[data-slot="service-advisory"]');
    if (!container) return;

    container.className = 'mt-8 mb-8';
    container.innerHTML = this.renderHouseholdAdvisorySection(slotEntry.advisoryCards);
  },

  hydrateHouseholdServiceProofLayer(service, proofLayer, anchorForm) {
    const defaults = proofLayer?.serviceDefaults;
    if (!defaults || !anchorForm) return;

    const requestSection = anchorForm.closest('section');
    if (!requestSection) return;

    let proofSection = document.querySelector('[data-household-slot-generated="service-proof"]');
    if (!proofSection) {
      proofSection = document.createElement('section');
      proofSection.dataset.householdSlotGenerated = 'service-proof';
      proofSection.className = 'py-16 lg:py-20 bg-white';
      requestSection.insertAdjacentElement('afterend', proofSection);
    }

    proofSection.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-[2rem] border border-slate-200 bg-slate-50/90 p-6 sm:p-8 lg:p-10 shadow-sm">
          ${this.renderHouseholdSlaStrip(defaults.slaStrip)}
          ${defaults.priceClarity ? `<div class="mt-8">${this.renderHouseholdSlaStrip(defaults.priceClarity)}</div>` : ''}
          <div class="mt-8 flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center rounded-full bg-brand-orange/10 px-3 py-1.5 text-sm font-semibold text-brand-orange">По категории ${escapeHtml(service.uiLabel)}</span>
            ${this.renderHouseholdBadgeList((service.primarySymptoms || []).slice(0, 3), 'slate')}
          </div>
          <div class="mt-8 text-center">
            <span class="inline-flex items-center rounded-full bg-brand-blue/10 px-4 py-2 text-sm font-semibold text-brand-blue">${escapeHtml(defaults.proofCards?.badge || 'Почему это спокойнее')}</span>
            <h2 class="mt-4 text-2xl sm:text-3xl font-display font-extrabold text-brand-blue">${escapeHtml(defaults.proofCards?.title || '')}</h2>
            <p class="mt-3 text-slate-600">${escapeHtml(defaults.proofCards?.description || '')}</p>
          </div>
          <div class="mt-8 household-card-grid household-card-grid--proof">
            ${this.renderHouseholdProofCards(defaults.proofCards?.cards || [])}
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
                  ${this.renderHouseholdProofCards(defaults.objectionCards.cards || [])}
                </div>
              `
              : ''
          }
        </div>
      </div>
    `;
  },

  hydrateHouseholdRelatedLinks(service, serviceMap, cardPresets, anchorForm) {
    const relatedServices = (service.relatedPages || [])
      .map((page) => serviceMap.get(page))
      .filter((entry) => entry && !entry.isShadow);
    if (!relatedServices.length || !anchorForm) return;

    const requestSection = anchorForm.closest('section');
    if (!requestSection) return;

    let relatedSection = document.querySelector('[data-household-slot-generated="related-links"]');
    if (!relatedSection) {
      relatedSection = document.createElement('section');
      relatedSection.dataset.householdSlotGenerated = 'related-links';
      relatedSection.className = 'py-16 lg:py-20 bg-slate-50';
      const proofSection = document.querySelector('[data-household-slot-generated="service-proof"]');
      (proofSection || requestSection).insertAdjacentElement('afterend', relatedSection);
    }

    relatedSection.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div class="text-center mb-8">
            <span class="inline-block rounded-full bg-brand-blue/10 px-4 py-2 text-sm font-semibold text-brand-blue">ДРУГИЕ БЫТОВЫЕ КАТЕГОРИИ</span>
            <h2 class="mt-4 text-2xl sm:text-3xl font-display font-extrabold text-brand-blue">Если проблема в другой технике</h2>
            <p class="mt-3 text-slate-600">Ниже ближайшие бытовые категории, которые чаще всего смотрят рядом с этой страницей.</p>
          </div>
          <div class="household-card-grid household-card-grid--related">
            ${this.renderHouseholdServiceCards(
              relatedServices.map((entry) => entry.page),
              serviceMap,
              cardPresets,
              'compact'
            )}
          </div>
        </div>
      </div>
    `;
  },

  renderRestaurantBadgeList(items, tone = 'orange') {
    const toneClasses = {
      orange: 'bg-brand-orange/10 text-brand-orange',
      green: 'bg-green-100 text-green-700',
      blue: 'bg-brand-blue/10 text-brand-blue',
      slate: 'bg-slate-100 text-slate-700',
    };
    const className = toneClasses[tone] || toneClasses.slate;

    return (items || [])
      .filter(Boolean)
      .map(
        (item) =>
          `<span class="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${className}">${escapeHtml(item)}</span>`
      )
      .join('');
  },

  renderRestaurantRequestOverview(service, slotEntry) {
    const overview = slotEntry?.requestOverview || {};
    const chips = Array.isArray(overview.chips) ? overview.chips.filter(Boolean) : [];

    return `
      <div data-sync-zone="request-overview" class="mb-6 rounded-3xl border border-slate-200 bg-slate-50/90 p-4 sm:p-5 lg:p-6">
        <div class="flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-green-700">${escapeHtml(
            overview.badge || 'Что полезно указать сразу'
          )}</span>
          ${this.renderRestaurantBadgeList((service.primarySymptoms || []).slice(0, 2), 'slate')}
        </div>
        <h3 class="mt-4 text-xl sm:text-2xl font-display font-extrabold text-brand-blue">${escapeHtml(
          overview.title || 'Чтобы быстрее понять сценарий по объекту'
        )}</h3>
        <p class="mt-3 text-slate-600">${escapeHtml(
          overview.description || 'Чем точнее описание модели и симптома, тем быстрее можно оценить срочность выезда.'
        )}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          ${this.renderRestaurantBadgeList(chips, 'orange')}
        </div>
        <p class="mt-4 text-xs text-slate-500">Пример описания: ${escapeHtml(service.formExample || '')}</p>
      </div>
    `;
  },

  renderRestaurantSlaStrip(strip) {
    if (!strip) return '';

    const items = Array.isArray(strip.items) ? strip.items : [];
    return `
      <div class="rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-6 lg:p-8 shadow-sm">
        <div class="text-center">
          <span class="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-green-700">${escapeHtml(
            strip.badge || 'ПОНЯТНЫЙ СЦЕНАРИЙ'
          )}</span>
          <h2 class="mt-4 text-2xl sm:text-3xl font-display font-extrabold text-brand-blue">${escapeHtml(strip.title || '')}</h2>
          <p class="mt-3 text-slate-600">${escapeHtml(strip.description || '')}</p>
        </div>
        <div class="mt-8 grid gap-4 md:grid-cols-3">
          ${items
            .map((item) => {
              const iconClass =
                {
                  orange: 'text-brand-orange border-brand-orange/20',
                  green: 'text-green-600 border-green-200',
                  blue: 'text-brand-blue border-brand-blue/20',
                }[item.tone] || 'text-slate-500 border-slate-200';
              return `
                <article class="rounded-2xl border ${iconClass.split(' ')[1]} bg-slate-50/80 p-5">
                  <p class="text-sm font-semibold uppercase tracking-[0.16em] ${iconClass.split(' ')[0]}">${escapeHtml(item.label || '')}</p>
                  <p class="mt-3 text-2xl font-display font-extrabold text-brand-blue">${escapeHtml(item.value || '')}</p>
                  <p class="mt-3 text-sm text-slate-600">${escapeHtml(item.description || '')}</p>
                </article>
              `;
            })
            .join('')}
        </div>
      </div>
    `;
  },

  renderRestaurantProofCards(cards) {
    return (cards || [])
      .map((card) => {
        const tone =
          {
            orange: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
            green: 'bg-green-100 text-green-700 border-green-200',
            blue: 'bg-brand-blue/10 text-brand-blue border-brand-blue/20',
          }[card.tone] || 'bg-slate-100 text-slate-700 border-slate-200';
        const [badgeClass, textClass, borderClass] = tone.split(' ');
        return `
          <article class="rounded-2xl border ${borderClass} bg-slate-50/80 p-5">
            <div class="flex items-center justify-between gap-3">
              <span class="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${badgeClass} ${textClass}">${escapeHtml(
                card.badge || 'Важно'
              )}</span>
              <i class="${escapeHtml(card.icon || 'ri-tools-line')} text-xl ${textClass}"></i>
            </div>
            <h3 class="mt-4 text-xl font-display font-extrabold text-brand-blue">${escapeHtml(card.title || '')}</h3>
            <p class="mt-3 text-slate-600">${escapeHtml(card.description || '')}</p>
            <p class="mt-4 text-sm font-semibold text-slate-700">${escapeHtml(card.outcome || '')}</p>
          </article>
        `;
      })
      .join('');
  },

  renderRestaurantServiceCards(pages, serviceMap) {
    const iconMap = {
      'parokonvektomaty.html': 'ri-fire-line',
      'plity-pechi.html': 'ri-fire-line',
      'holodilnoe-oborudovanie.html': 'ri-fridge-line',
      'posudomoechnye-mashiny.html': 'ri-drop-line',
      'grili-mangaly.html': 'ri-restaurant-line',
      'ice-machines.html': 'ri-box-3-line',
    };

    return (pages || [])
      .map((page) => serviceMap.get(page))
      .filter((entry) => entry && !entry.isShadow)
      .map((entry) => `
        <a href="${entry.page}" class="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-orange hover:shadow-lg">
          <div class="flex items-start justify-between gap-4">
            <div class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange/10 text-2xl text-brand-orange">
              <i class="${iconMap[entry.page] || 'ri-tools-line'}"></i>
            </div>
            <span class="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">По категории</span>
          </div>
          <h3 class="mt-5 text-xl font-display font-extrabold text-brand-blue transition group-hover:text-brand-orange">${escapeHtml(entry.uiLabel)}</h3>
          <p class="mt-3 text-sm text-slate-600">${escapeHtml((entry.primarySymptoms || []).slice(0, 3).join(', '))}</p>
          <p class="mt-3 text-sm text-slate-500">${escapeHtml((entry.brandCluster || []).slice(0, 3).join(', '))}</p>
          <p class="mt-5 text-sm font-semibold text-slate-700">Открыть страницу</p>
        </a>
      `)
      .join('');
  },

  renderRestaurantTrustCards(cards) {
    return (cards || [])
      .map((card) => {
        const toneClass =
          {
            orange: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
            blue: 'bg-brand-blue/10 text-brand-blue border-brand-blue/20',
            green: 'bg-green-100 text-green-700 border-green-200',
          }[card.tone] || 'bg-slate-100 text-slate-700 border-slate-200';
        const [badgeClass, textClass, borderClass] = toneClass.split(' ');

        return `
          <article class="rounded-3xl border ${borderClass} bg-white/95 p-6 shadow-sm">
            <div class="flex items-start justify-between gap-4">
              <div class="inline-flex h-14 w-14 items-center justify-center rounded-2xl ${badgeClass} ${textClass}">
                <i class="${escapeHtml(card.icon || 'ri-tools-line')} text-2xl"></i>
              </div>
              <span class="inline-flex rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${badgeClass} ${textClass}">${escapeHtml(card.badge || 'Важно')}</span>
            </div>
            <h3 class="mt-6 text-xl font-display font-extrabold text-brand-blue leading-tight">${escapeHtml(card.title || '')}</h3>
            <p class="mt-3 text-slate-600 leading-relaxed">${escapeHtml(card.description || '')}</p>
            <div class="mt-5 rounded-2xl bg-slate-50 px-4 py-3">
              <p class="text-sm font-semibold text-slate-700">${escapeHtml(card.outcome || '')}</p>
            </div>
          </article>
        `;
      })
      .join('');
  },

  applyRestaurantCardSectionLayout(container, sectionName, sectionConfig) {
    if (!container || sectionName !== 'trustCards') return;

    const layoutVariant =
      {
        default: 'grid md:grid-cols-2 lg:grid-cols-3 gap-8',
        'balanced-four': 'grid gap-8 md:grid-cols-2 xl:grid-cols-4',
      }[sectionConfig?.layoutVariant || 'default'] || 'grid md:grid-cols-2 lg:grid-cols-3 gap-8';

    container.className = layoutVariant;
  },

  renderRestaurantContactCards(cards) {
    return (cards || [])
      .map((card) => {
        const toneClass =
          {
            orange: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
            blue: 'bg-brand-blue/10 text-brand-blue border-brand-blue/20',
            green: 'bg-green-100 text-green-700 border-green-200',
          }[card.tone] || 'bg-slate-100 text-slate-700 border-slate-200';
        const [badgeClass, textClass, borderClass] = toneClass.split(' ');

        return `
          <article class="rounded-3xl border ${borderClass} bg-white p-6 shadow-sm">
            <div class="flex items-start justify-between gap-4">
              <div>
                <span class="inline-flex rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${badgeClass} ${textClass}">${escapeHtml(card.badge || 'Связь')}</span>
                <h3 class="mt-4 text-xl font-display font-extrabold text-brand-blue">${escapeHtml(card.title || '')}</h3>
              </div>
              <div class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-xl ${textClass}">
                <i class="${escapeHtml(card.icon || 'ri-chat-3-line')}"></i>
              </div>
            </div>
            <p class="mt-4 text-slate-600">${escapeHtml(card.description || '')}</p>
            <ul class="mt-4 space-y-2">
              ${(card.bullets || [])
                .map(
                  (item) => `<li class="flex items-start gap-2 text-sm text-slate-600"><i class="ri-check-line mt-0.5 text-green-600"></i><span>${escapeHtml(item)}</span></li>`
                )
                .join('')}
            </ul>
            <p class="mt-4 text-xs text-slate-500">${escapeHtml(card.note || '')}</p>
            <div class="mt-5 flex flex-wrap gap-3">
              ${(card.actions || [])
                .map((action) => {
                  const resolvedHref = this.resolveContactHref(action.href || '#');
                  const externalAttrs = /^(?:https?:\/\/|tg:\/\/)/.test(resolvedHref)
                    ? 'target="_blank" rel="noopener noreferrer"'
                    : '';
                  return `
                    <a href="${escapeHtml(resolvedHref)}" ${externalAttrs} class="inline-flex items-center justify-center rounded-full bg-brand-orange px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-orangeHover">
                      ${escapeHtml(action.label || 'Открыть')}
                    </a>
                  `;
                })
                .join('')}
            </div>
          </article>
        `;
      })
      .join('');
  },

  renderRestaurantReviewCards(cards) {
    return (cards || [])
      .map(
        (card) => `
          <article class="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
            <p class="text-lg font-medium leading-relaxed text-white">“${escapeHtml(card.quote || '')}”</p>
            <p class="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-brand-orange">${escapeHtml(card.author || '')}</p>
            <p class="mt-2 text-sm text-slate-300">${escapeHtml(card.meta || '')}</p>
          </article>
        `
      )
      .join('');
  },

  renderRestaurantCaseCards(cards) {
    return (cards || [])
      .map(
        (card) => `
          <article class="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
            <span class="inline-flex rounded-full bg-brand-orange/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange">${escapeHtml(card.badge || 'Кейс')}</span>
            <h3 class="mt-4 text-xl font-display font-extrabold text-brand-blue">${escapeHtml(card.title || '')}</h3>
            <p class="mt-3 text-slate-600">${escapeHtml(card.description || '')}</p>
            <p class="mt-4 text-sm font-semibold text-slate-700">${escapeHtml(card.result || '')}</p>
            <p class="mt-2 text-xs text-slate-500">${escapeHtml(card.meta || '')}</p>
          </article>
        `
      )
      .join('');
  },

  renderRestaurantRoutingHint(routingHint) {
    const cards = Array.isArray(routingHint?.cards) ? routingHint.cards : [];
    return `
      <div class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div class="text-center">
          <span class="inline-flex rounded-full bg-brand-blue/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-blue">${escapeHtml(
            routingHint?.badge || 'Маршрут'
          )}</span>
          <h3 class="mt-4 text-2xl font-display font-extrabold text-brand-blue">${escapeHtml(routingHint?.title || '')}</h3>
          <p class="mt-3 text-slate-600">${escapeHtml(routingHint?.description || '')}</p>
        </div>
        <div class="mt-6 grid gap-4 md:grid-cols-2">
          ${cards
            .map(
              (card) => `
                <article class="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                  <h4 class="text-lg font-display font-extrabold text-brand-blue">${escapeHtml(card.title || '')}</h4>
                  <p class="mt-3 text-sm text-slate-600">${escapeHtml(card.description || '')}</p>
                </article>
              `
            )
            .join('')}
        </div>
      </div>
    `;
  },

  hydrateRestaurantBranchCardSections(currentPage, slotEntry, serviceMap) {
    const sections = slotEntry?.cardSections;
    if (sections?.categoryCards) {
      this.updateRestaurantCardSectionCopy('category-cards', sections.categoryCards);
      const container = document.querySelector('[data-slot="category-cards"]');
      if (container) {
        container.innerHTML = this.renderRestaurantServiceCards(sections.categoryCards.pages || [], serviceMap);
      }
    }

    if (sections?.trustCards) {
      this.updateRestaurantCardSectionCopy('trust-cards', sections.trustCards);
      const container = document.querySelector('[data-slot="trust-cards"]');
      if (container) {
        this.applyRestaurantCardSectionLayout(container, 'trustCards', sections.trustCards);
        container.innerHTML = this.renderRestaurantTrustCards(sections.trustCards.cards || []);
      }
    }

    if (sections?.contactChannels) {
      this.updateRestaurantCardSectionCopy('contact-channels', sections.contactChannels);
      const container = document.querySelector('[data-slot="contact-channels"]');
      if (container) {
        container.innerHTML = this.renderRestaurantContactCards(sections.contactChannels.cards || []);
      }
    }

    if (slotEntry?.routingHint) {
      const container = document.querySelector('[data-slot="routing-hint"]');
      if (container) {
        container.innerHTML = this.renderRestaurantRoutingHint(slotEntry.routingHint);
      }
    }
  },

  hydrateRestaurantBranchProofSections(currentPage, proofLayer) {
    const sections = proofLayer?.branchPages?.[currentPage];
    if (!sections || typeof sections !== 'object') return;

    if (sections.proofCards) {
      this.updateRestaurantCardSectionCopy('proof-cards', sections.proofCards);
      const container = document.querySelector('[data-slot="proof-cards"]');
      if (container) {
        container.innerHTML = this.renderRestaurantProofCards(sections.proofCards.cards || []);
      }
    }

    if (sections.reviewCards) {
      this.updateRestaurantCardSectionCopy('review-cards', sections.reviewCards);
      const container = document.querySelector('[data-slot="review-cards"]');
      if (container) {
        container.innerHTML = this.renderRestaurantReviewCards(sections.reviewCards.cards || []);
      }
    }

    if (sections.caseCards) {
      this.updateRestaurantCardSectionCopy('case-cards', sections.caseCards);
      const container = document.querySelector('[data-slot="case-cards"]');
      if (container) {
        container.innerHTML = this.renderRestaurantCaseCards(sections.caseCards.cards || []);
      }
    }
  },

  async initRestaurantBranchSlots() {
    const currentPage = getCurrentPageFile();
    if (this.isBytovaya()) return;
    if (!['index.html', 'uslugi.html', 'about.html', 'contact.html'].includes(currentPage)) return;

    const [serviceRegistry, pageSlots, proofLayer] = await Promise.all([
      loadRestaurantServicesRegistry(),
      loadRestaurantPageSlots(),
      loadRestaurantProofLayer(),
    ]);

    const services = Array.isArray(serviceRegistry?.services) ? serviceRegistry.services : [];
    const serviceMap = new Map(services.map((entry) => [entry.page, entry]));
    const slotEntry = pageSlots?.pages?.[currentPage];

    if (!slotEntry) return;

    this.hydrateRestaurantBranchCardSections(currentPage, slotEntry, serviceMap);
    this.hydrateRestaurantBranchProofSections(currentPage, proofLayer);
  },

  hydrateRestaurantServiceSchema(service, pageMetadata) {
    const schemaScript = document.querySelector('script[data-slot="service-schema"]');
    if (!schemaScript || !service) return;
    const schemaProfile = this.getSchemaProfileForPage();

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.schemaName,
      description:
        pageMetadata?.description ||
        applyDescriptionTemplate(
          schemaProfile.descriptionTemplate,
          service.serviceName,
          `${service.serviceName} с выездом на объект в Москве и МО.`
        ),
      provider: {
        '@type': 'LocalBusiness',
        name: schemaProfile.provider.name,
        telephone: this.getPhoneLink(),
        url: schemaProfile.provider.url,
        address: {
          '@type': 'PostalAddress',
          addressLocality: schemaProfile.provider.addressLocality,
          addressCountry: schemaProfile.provider.addressCountry,
        },
        openingHours: schemaProfile.provider.openingHours,
      },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: schemaProfile.areaServed,
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: schemaProfile.offers.priceCurrency,
        price: schemaProfile.offers.price,
        availability: schemaProfile.offers.availability,
      },
    };

    schemaScript.textContent = JSON.stringify(schema, null, 2);
  },

  hydrateRestaurantRequestForm(service, slotEntry) {
    const form =
      document.querySelector('form.telegram-form[data-slot="request-form"]') ||
      document.querySelector('form.telegram-form');
    if (!form || !service || !slotEntry?.formHints) return null;

    const typeInput = form.querySelector('input[name="type"]');
    const problemInput = form.querySelector('input[name="problem"]');

    if (typeInput && slotEntry.formHints.typePlaceholder) {
      typeInput.setAttribute('placeholder', slotEntry.formHints.typePlaceholder);
    }

    if (problemInput && slotEntry.formHints.problemPlaceholder) {
      problemInput.setAttribute('placeholder', slotEntry.formHints.problemPlaceholder);
    }

    let slotZone = form.querySelector('[data-sync-zone="request-overview"]');
    if (!slotZone) {
      slotZone = document.createElement('div');
      form.insertBefore(slotZone, form.firstElementChild);
    }

    slotZone.outerHTML = this.renderRestaurantRequestOverview(service, slotEntry);
    return form;
  },

  hydrateRestaurantFaq(slotEntry) {
    const faqZone = document.querySelector('[data-sync-zone="faq-items"]');
    if (!faqZone || !Array.isArray(slotEntry?.faq)) return;

    faqZone.innerHTML = slotEntry.faq
      .map(
        (item, index) => `
          <details class="faq-item bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border-2 border-slate-100 cursor-pointer scroll-reveal" data-delay="${index + 1}">
            <summary class="font-bold text-brand-blue text-base sm:text-lg flex items-center justify-between">
              <span>${escapeHtml(item.question)}</span>
              <span class="text-brand-orange transition-transform duration-300">+</span>
            </summary>
            <p class="mt-4 text-slate-600">${escapeHtml(item.answer)}</p>
          </details>
        `
      )
      .join('');
  },

  hydrateRestaurantServiceProofLayer(service, proofLayer, anchorForm) {
    const defaults = proofLayer?.serviceDefaults;
    if (!defaults || !anchorForm) return;

    let proofSection = document.querySelector('[data-sync-zone="service-proof"]');
    if (!proofSection) {
      proofSection = document.createElement('section');
      anchorForm.closest('section')?.insertAdjacentElement('afterend', proofSection);
    }

    proofSection.outerHTML = `
      <section data-sync-zone="service-proof" class="py-16 lg:py-20 bg-white">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          ${this.renderRestaurantSlaStrip(defaults.slaStrip)}
          <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span class="inline-flex items-center rounded-full bg-brand-blue/10 px-3 py-1.5 text-sm font-semibold text-brand-blue">По категории ${escapeHtml(
              service.uiLabel
            )}</span>
            ${this.renderRestaurantBadgeList((service.primarySymptoms || []).slice(0, 3), 'slate')}
          </div>
          <div class="mt-8 rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-6 lg:p-8 shadow-sm">
            <div class="text-center">
              <span class="inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-orange">${escapeHtml(
                defaults.proofCards?.badge || 'Что важно до ремонта'
              )}</span>
              <h2 class="mt-4 text-2xl sm:text-3xl font-display font-extrabold text-brand-blue">${escapeHtml(
                defaults.proofCards?.title || ''
              )}</h2>
              <p class="mt-3 text-slate-600">${escapeHtml(defaults.proofCards?.description || '')}</p>
            </div>
            <div class="mt-8 grid gap-4 lg:grid-cols-3">
              ${this.renderRestaurantProofCards(defaults.proofCards?.cards || [])}
            </div>
          </div>
        </div>
      </section>
    `;
  },

  hydrateRestaurantRelatedLinks(service, serviceMap, anchorForm) {
    if (!service || !anchorForm) return;

    const relatedServices = (service.relatedPages || [])
      .map((page) => serviceMap.get(page))
      .filter((entry) => entry && !entry.isShadow);

    let relatedSection = document.querySelector('[data-sync-zone="related-links"]');
    if (!relatedSection) {
      relatedSection = document.createElement('section');
      const proofSection = document.querySelector('[data-sync-zone="service-proof"]');
      if (proofSection) {
        proofSection.insertAdjacentElement('afterend', relatedSection);
      } else {
        anchorForm.closest('section')?.insertAdjacentElement('afterend', relatedSection);
      }
    }

    relatedSection.outerHTML = `
      <section data-sync-zone="related-links" class="py-16 lg:py-20 bg-slate-50">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
            <div class="text-center mb-8">
              <span class="inline-flex items-center rounded-full bg-brand-blue/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-blue">СОСЕДНИЕ КАТЕГОРИИ</span>
              <h2 class="mt-4 text-2xl sm:text-3xl font-display font-extrabold text-brand-blue">Если проблема в другом ресторанном оборудовании</h2>
              <p class="mt-3 text-slate-600">Ниже ближайшие категории, которые чаще всего смотрят рядом с этой страницей.</p>
            </div>
            <div class="grid gap-4 lg:grid-cols-3">
              ${relatedServices
                .map(
                  (entry) => `
                    <a href="${entry.page}" class="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange">По ресторанной категории</p>
                      <h3 class="mt-3 text-xl font-display font-extrabold text-brand-blue">${escapeHtml(entry.uiLabel)}</h3>
                      <p class="mt-3 text-sm text-slate-600">${escapeHtml((entry.primarySymptoms || []).slice(0, 3).join(', '))}</p>
                      <p class="mt-4 text-sm font-semibold text-slate-700">Открыть страницу</p>
                    </a>
                  `
                )
                .join('')}
            </div>
          </div>
        </div>
      </section>
    `;
  },

  async initRestaurantServiceSlots() {
    const currentPage = getCurrentPageFile();
    if (this.isBytovaya()) return;
    if (['index.html', 'uslugi.html', 'about.html', 'contact.html'].includes(currentPage)) return;

    const [pageMetadata, serviceRegistry, pageSlots, proofLayer] = await Promise.all([
      loadCurrentPageMetadata(),
      loadRestaurantServicesRegistry(),
      loadRestaurantPageSlots(),
      loadRestaurantProofLayer(),
    ]);

    const services = Array.isArray(serviceRegistry?.services) ? serviceRegistry.services : [];
    const serviceMap = new Map(services.map((entry) => [entry.page, entry]));
    const service = services.find((entry) => entry.page === currentPage && !entry.isShadow);
    const slotEntry = pageSlots?.pages?.[currentPage];

    if (!service) return;

    this.applyRestaurantServiceMobileVisibility(service);

    if (!slotEntry) return;

    const anchorForm = this.hydrateRestaurantRequestForm(service, slotEntry);
    this.hydrateRestaurantServiceSchema(service, pageMetadata);
    this.hydrateRestaurantFaq(slotEntry);
    this.hydrateRestaurantServiceProofLayer(service, proofLayer, anchorForm);
    this.hydrateRestaurantRelatedLinks(service, serviceMap, anchorForm);
  },

  applyRestaurantServiceMobileVisibility(service) {
    const hiddenSectionIds = new Set(
      Array.isArray(service?.mobileHiddenSectionIds)
        ? service.mobileHiddenSectionIds
            .filter((value) => typeof value === 'string')
            .map((value) => value.trim())
            .filter(Boolean)
        : []
    );

    document.querySelectorAll('[data-mobile-section]').forEach((section) => {
      const sectionId = section.getAttribute('data-mobile-section')?.trim();
      if (!sectionId) return;

      const shouldHideOnMobile = hiddenSectionIds.has(sectionId);
      section.classList.toggle('restaurant-mobile-optional', shouldHideOnMobile);

      if (shouldHideOnMobile) {
        section.setAttribute('data-mobile-hidden', 'true');
        return;
      }

      section.removeAttribute('data-mobile-hidden');
    });
  },

  applyPageIdentityClasses() {
    const currentPage = getCurrentPageFile();
    const currentSlug = toBodyPageClass(getCurrentPageSlug());
    const classes = new Set();

    if (currentSlug) {
      classes.add(`page-${currentSlug}`);
    }

    (PAGE_CLASS_ALIASES[currentPage] || []).forEach((className) => classes.add(className));
    classes.add(this.isBytovaya() ? 'branch-household' : 'branch-restaurant');

    if (this.isBytovaya()) {
      classes.add(currentPage.startsWith('bytovaya-') ? 'page-household-branch' : 'page-household-service');
    } else {
      classes.add(['index.html', 'uslugi.html', 'about.html', 'contact.html'].includes(currentPage) ? 'page-restaurant-branch' : 'page-restaurant-service');
    }

    if (classes.size > 0) {
      document.body.classList.add(...classes);
    }
  },

  async initHouseholdServiceSlots() {
    const currentPage = getCurrentPageFile();
    if (!this.isBytovaya()) return;

    const [pageMetadata, serviceRegistry, pageSlots, cardPresets, proofLayer] = await Promise.all([
      loadCurrentPageMetadata(),
      loadHouseholdServicesRegistry(),
      loadHouseholdPageSlots(),
      loadHouseholdCardPresets(),
      loadHouseholdProofLayer(),
    ]);

    const services = Array.isArray(serviceRegistry?.services) ? serviceRegistry.services : [];
    const serviceMap = new Map(services.map((entry) => [entry.page, entry]));
    const slotEntry = pageSlots?.pages?.[currentPage];
    this.hydrateHouseholdCardSections(slotEntry, serviceMap, cardPresets);
    this.hydrateHouseholdProofSections(currentPage, proofLayer);

    if (currentPage.startsWith('bytovaya-')) return;

    const service = services.find((entry) => entry.page === currentPage && !entry.isShadow);

    if (!service || !slotEntry) return;

    const anchorForm = this.hydrateHouseholdRequestForm(service, slotEntry);

    this.hydrateHouseholdServiceSchema(service, pageMetadata, slotEntry);
    this.hydrateHouseholdFaq(slotEntry);
    this.hydrateHouseholdServiceAdvisory(slotEntry, anchorForm);
    this.hydrateHouseholdServiceProofLayer(service, proofLayer, anchorForm);
    this.hydrateHouseholdRelatedLinks(service, serviceMap, cardPresets, anchorForm);
  },

  async init() {
    const header = document.getElementById('header-container');
    const footer = document.getElementById('footer-container');

    try {
      const pageMetadata = await loadCurrentPageMetadata();
      this.currentBranch = pageMetadata?.branch || inferBranchFromSlug();
    } catch (error) {
      console.error('Page metadata unavailable:', error.message);
      this.currentBranch = inferBranchFromSlug();
    }

    this.applyPageIdentityClasses();

    const [restaurantBranch, householdBranch, contactConfig, schemaProfile] = await Promise.all([
      loadRestaurantBranchConfig(),
      loadHouseholdBranchConfig(),
      loadContactConfig(),
      loadSchemaProfile(),
    ]);
    this.restaurantBranch = restaurantBranch;
    this.householdBranch = householdBranch;
    this.contactConfig = contactConfig;
    this.schemaProfile = schemaProfile;

    if (header) header.innerHTML = this.getHeader();
    if (footer) footer.innerHTML = this.getFooter();
    this.hydrateContactLinks();
    this.initBranchRouteStrips();
    await this.initRestaurantBranchSlots();
    await this.initHouseholdServiceSlots();
    await this.initRestaurantServiceSlots();

    this.initMobileMenu();
    this.initSmoothScroll();

    const runDeferredUi = () => {
      this.initScrollEffect();
      this.initFadeIn();
      this.initCounters();
      this.initHeadingReveal();
      initStaggerAnimations();
      initScrollReveal();
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(runDeferredUi, { timeout: 700 });
    } else {
      window.setTimeout(runDeferredUi, 120);
    }
  },
};

function initStaggerAnimations() {
  observeElements('.grid, .space-y-4', { threshold: 0.1 }, (entry, observer) => {
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });

  document.querySelectorAll('.grid, .space-y-4').forEach((container) => {
    container.classList.add('stagger-container');
  });
}

function initScrollReveal() {
  observeElements(
    '.scroll-reveal',
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    (entry, observer) => {
      const delay = Number(entry.target.dataset.delay || 0);
      window.setTimeout(() => {
        entry.target.classList.add('is-visible');
      }, delay * 100);
      observer.unobserve(entry.target);
    }
  );
}

function readDebugStorageJson(key) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function initLeadDebugMode() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('lead_debug') !== '1') return;

  const attribution = readDebugStorageJson('mospochin_attribution_v1');
  const draft = readDebugStorageJson('mospochin_last_lead_draft_v2');
  const touch = attribution?.last_touch || attribution?.first_touch || {};
  const query = Object.fromEntries(params.entries());
  const checks = [
    ['analytics.js', typeof window.mospochinTrackGoal === 'function'],
    ['mospochinGetAttribution', typeof window.mospochinGetAttribution === 'function'],
    ['yclid', Boolean(touch.yclid || query.yclid)],
    ['ym_client_id / metrika_client_id', Boolean(touch.ym_client_id || touch.metrika_client_id)],
    ['last lead draft', Boolean(draft)],
    ['production host', Boolean(window.mospochinIsProductionHost?.())]
  ];

  const panel = document.createElement('aside');
  panel.id = 'lead-debug-panel';
  panel.className = 'fixed inset-x-3 bottom-3 z-[9999] max-h-[70vh] overflow-auto rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-2xl md:left-auto md:w-[560px]';
  panel.innerHTML = `
    <div class="flex items-center justify-between gap-3">
      <strong class="text-sm text-brand-blue">Lead debug / MosPochin</strong>
      <button type="button" data-debug-close class="rounded-full bg-slate-100 px-3 py-1 font-bold text-slate-700">Закрыть</button>
    </div>
    <div class="mt-3 grid gap-2 sm:grid-cols-2">
      ${checks.map(([label, ok]) => `<div class="rounded-xl ${ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} px-3 py-2"><b>${ok ? '✓' : '×'} ${escapeHtml(label)}</b></div>`).join('')}
    </div>
    <details class="mt-3" open>
      <summary class="cursor-pointer font-bold">Query</summary>
      <pre class="mt-2 max-h-40 overflow-auto rounded-xl bg-slate-950 p-3 text-slate-100">${escapeHtml(JSON.stringify(query, null, 2))}</pre>
    </details>
    <details class="mt-3">
      <summary class="cursor-pointer font-bold">Attribution localStorage</summary>
      <pre class="mt-2 max-h-52 overflow-auto rounded-xl bg-slate-950 p-3 text-slate-100">${escapeHtml(JSON.stringify(attribution || null, null, 2))}</pre>
    </details>
    <details class="mt-3">
      <summary class="cursor-pointer font-bold">Last lead draft</summary>
      <pre class="mt-2 max-h-52 overflow-auto rounded-xl bg-slate-950 p-3 text-slate-100">${escapeHtml(JSON.stringify(draft || null, null, 2))}</pre>
    </details>
  `;
  panel.querySelector('[data-debug-close]')?.addEventListener('click', () => panel.remove());
  document.body.append(panel);
}

document.addEventListener('DOMContentLoaded', () => {
  void Components.init();
  window.setTimeout(initLeadDebugMode, 500);
});
