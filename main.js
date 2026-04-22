const SITE_CONFIG = {
  company: {
    name: 'MosPochin',
    phoneDisplay: '8 (999) 005-71-72',
    phoneLink: '+79990057172',
    whatsapp:
      'https://wa.me/79990057172?text=Здравствуйте!%20Нужен%20ремонт.%20Сайт%20MosPochin',
    email: 'info@mospochin.ru',
    experience: '15+ лет',
  },
};

const PAGE_METADATA_PATH = '/data/page-metadata.json';
const RESTAURANT_BRANCH_PATH = '/data/restaurant-branch.json';
const HOUSEHOLD_BRANCH_PATH = '/data/household-branch.json';
const HOUSEHOLD_SERVICES_PATH = '/data/household-services.json';
const HOUSEHOLD_PAGE_SLOTS_PATH = '/data/household-page-slots.json';
const HOUSEHOLD_CARD_PRESETS_PATH = '/data/household-card-presets.json';
const HOUSEHOLD_PROOF_LAYER_PATH = '/data/household-proof-layer.json';
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
    { href: 'microwaves.html', icon: '📻', name: 'Микроволновки' },
    { href: 'water-heaters.html', icon: '🚿', name: 'Водонагреватели' },
  ],
  footerLinks: [
    { href: 'bytovaya-index.html', label: 'Главная' },
    { href: 'bytovaya-uslugi.html', label: 'Услуги' },
    { href: 'holodilniki.html', label: 'Холодильники' },
    { href: 'stiralnye-mashiny.html', label: 'Стиральные машины' },
    { href: 'posudomoyki.html', label: 'Посудомойки' },
    { href: 'plity.html', label: 'Плиты и духовки' },
    { href: 'microwaves.html', label: 'Микроволновки' },
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
});

function getCurrentPageSlug() {
  return (window.location.pathname.split('/').pop() || 'index.html').replace('.html', '');
}

function getCurrentPageFile() {
  return window.location.pathname.split('/').pop() || 'index.html';
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
let householdServicesPromise = null;
let householdPageSlotsPromise = null;
let householdCardPresetsPromise = null;
let householdProofLayerPromise = null;

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
      services: isBytovaya ? householdBranch.services : restaurantBranch.services,
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
    const serviceItems = branch.services
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
    <a href="tel:${SITE_CONFIG.company.phoneLink}" class="hidden md:inline font-bold hover:text-yellow-300 transition">
      <i class="ri-phone-line mr-1"></i>${SITE_CONFIG.company.phoneDisplay}
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
        <div class="hidden md:block">
          <span class="font-extrabold text-xl lg:text-2xl text-brand-blue tracking-tight block leading-tight">MosPochin</span>
          <span class="text-xs text-slate-500 block font-medium leading-tight">${branch.subtitle}</span>
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
          <a href="tel:${SITE_CONFIG.company.phoneLink}" class="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg px-5 py-2.5 rounded-full transition-all shadow-lg">
            <i class="ri-phone-line animate-pulse"></i>
            <span>${SITE_CONFIG.company.phoneDisplay}</span>
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
            <a href="tel:${SITE_CONFIG.company.phoneLink}" class="hover:text-white transition font-bold">${SITE_CONFIG.company.phoneDisplay}</a>
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
    const serviceLinks = branch.services
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
<a href="tel:${SITE_CONFIG.company.phoneLink}" class="block w-full text-center bg-brand-orange text-white px-4 py-3 rounded-lg font-bold text-lg"><i class="ri-phone-line mr-2"></i>Позвонить</a>
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

      element.dataset.finalValue = finalValue;
      element.setAttribute('aria-label', finalValue);

      if (element.textContent.trim() === '0') {
        element.textContent = finalValue;
      }
    });

    observeElements('.counter', { threshold: 0.5 }, (entry, observer) => {
      const element = entry.target;
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
    return SITE_CONFIG.company.phoneDisplay;
  },

  getPhoneLink() {
    return SITE_CONFIG.company.phoneLink;
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
      actionNode.setAttribute('href', sectionConfig.action.href);
    }

    const actionLabelNode = document.querySelector(`[data-slot-copy="${sectionKey}.action.label"]`);
    if (actionLabelNode && sectionConfig.action?.label) {
      actionLabelNode.textContent = sectionConfig.action.label;
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
        const isExternal = /^https?:\/\//.test(action.href);
        return `
          <a href="${action.href}" class="household-card__button ${tone.button}" ${
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

  hydrateHouseholdCardSections(slotEntry, serviceMap, cardPresets) {
    const sections = slotEntry?.cardSections;
    if (!sections || typeof sections !== 'object') return;

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

    const schemaDescription =
      slotEntry?.serviceSchema?.description ||
      pageMetadata?.description ||
      `${service.serviceName} на дому в Москве и Московской области.`;
    const areaServed =
      slotEntry?.serviceSchema?.areaServed || 'Москва и Московская область';
    const priceLabel =
      slotEntry?.serviceSchema?.price || 'По согласованию после диагностики';

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.schemaName,
      description: schemaDescription,
      provider: {
        '@type': 'LocalBusiness',
        name: SITE_CONFIG.company.name,
        telephone: `+${SITE_CONFIG.company.phoneLink}`,
        url: 'https://mospochin.ru',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Москва',
          addressCountry: 'RU',
        },
        openingHours: 'Mo-Su 00:00-24:00',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '500',
        },
      },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: areaServed,
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'RUB',
        price: priceLabel,
        availability: 'https://schema.org/InStock',
      },
    };

    schemaScript.textContent = JSON.stringify(schema, null, 2);
  },

  hydrateHouseholdRequestForm(service, slotEntry) {
    const form = document.querySelector('form.telegram-form[data-slot="request-form"], form.telegram-form');
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
    this.hydrateHouseholdServiceProofLayer(service, proofLayer, anchorForm);
    this.hydrateHouseholdRelatedLinks(service, serviceMap, cardPresets, anchorForm);
  },

  async init() {
    const header = document.getElementById('header-container');
    const footer = document.getElementById('footer-container');
    const phoneTargets = document.querySelectorAll('[data-company-phone]');
    const phoneLinks = document.querySelectorAll('[href="tel:79990057172"], [href="tel:+79990057172"]');

    try {
      const pageMetadata = await loadCurrentPageMetadata();
      this.currentBranch = pageMetadata?.branch || inferBranchFromSlug();
    } catch (error) {
      console.error('Page metadata unavailable:', error.message);
      this.currentBranch = inferBranchFromSlug();
    }

    this.applyPageIdentityClasses();

    const [restaurantBranch, householdBranch] = await Promise.all([
      loadRestaurantBranchConfig(),
      loadHouseholdBranchConfig(),
    ]);
    this.restaurantBranch = restaurantBranch;
    this.householdBranch = householdBranch;

    if (header) header.innerHTML = this.getHeader();
    if (footer) footer.innerHTML = this.getFooter();
    phoneTargets.forEach((node) => {
      node.textContent = SITE_CONFIG.company.phoneDisplay;
    });
    phoneLinks.forEach((node) => {
      node.setAttribute('href', `tel:${SITE_CONFIG.company.phoneLink}`);
    });
    this.initBranchRouteStrips();
    await this.initHouseholdServiceSlots();

    window.setTimeout(() => {
      this.initMobileMenu();
      this.initScrollEffect();
      this.initFadeIn();
      this.initSmoothScroll();
      this.initCounters();
      this.initHeadingReveal();
      initStaggerAnimations();
      initScrollReveal();
    }, 50);
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

document.addEventListener('DOMContentLoaded', () => {
  void Components.init();
});
