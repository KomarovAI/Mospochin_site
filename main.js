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
  routeStrips: {
    index: {
      badge: 'БЫСТРЫЙ МАРШРУТ',
      title: 'Если уже знаете симптом, переходите сразу',
      description:
        'Этот хаб должен быстро уточнять бытовой сценарий. Каждая карточка ведёт в точную сервисную страницу без смешения разных типов техники.',
      action: {
        href: 'bytovaya-uslugi.html',
        label: 'Полный каталог услуг',
        icon: 'ri-arrow-right-line',
      },
      cards: [
        {
          href: 'stiralnye-mashiny.html',
          title: 'Не сливает',
          description: 'Стиральная машина: насос, фильтр, слив, отжим',
        },
        {
          href: 'holodilniki.html',
          title: 'Не морозит',
          description: 'Холодильник: компрессор, датчики, утечка, оттайка',
        },
        {
          href: 'plity.html',
          title: 'Не греет',
          description: 'Плита или духовка: конфорки, ТЭН, переключатели',
        },
        {
          href: 'stiralnye-mashiny.html',
          title: 'Шумит',
          description: 'Стиральная машина: подшипники, амортизаторы, вибрация',
        },
        {
          href: 'posudomoyki.html',
          title: 'Течёт',
          description: 'Посудомойка: шланги, насос, поддон, уплотнение',
        },
        {
          href: 'microwaves.html',
          title: 'Не включается',
          description: 'Микроволновка: питание, предохранители, плата',
        },
      ],
    },
    uslugi: {
      badge: 'БЫСТРЫЙ ВЫБОР',
      title: 'Начните с симптома, если техника уже встала',
      description:
        'Сначала симптом, потом точная страница услуги. Ниже только бытовые маршруты без компьютеров, роутеров и размытых объединений.',
      action: {
        href: '#full-services',
        label: 'Открыть полный список',
        icon: 'ri-arrow-down-line',
      },
      cards: [
        {
          href: 'stiralnye-mashiny.html',
          title: 'Не сливает',
          description: 'Стиральная машина: слив, насос, фильтр, прессостат',
        },
        {
          href: 'holodilniki.html',
          title: 'Не морозит',
          description: 'Холодильник: компрессор, термостат, датчики, утечка',
        },
        {
          href: 'plity.html',
          title: 'Не греет',
          description: 'Плита и духовка: конфорки, ТЭН, силовые элементы',
        },
        {
          href: 'stiralnye-mashiny.html',
          title: 'Шумит',
          description: 'Стиральная машина: барабан, подшипники, амортизаторы',
        },
        {
          href: 'posudomoyki.html',
          title: 'Течёт',
          description: 'Посудомойка: шланги, поддон, насос, уплотнители',
        },
        {
          href: 'microwaves.html',
          title: 'Не включается',
          description: 'Микроволновка: питание, дверь, плата, предохранители',
        },
      ],
    },
  },
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

function getCurrentPageSlug() {
  return (window.location.pathname.split('/').pop() || 'index.html').replace('.html', '');
}

function getCurrentPageFile() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

let pageMetadataPromise = null;
let restaurantBranchPromise = null;
let householdBranchPromise = null;

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

function inferBranchFromSlug() {
  const page = getCurrentPageSlug();
  if (HOUSEHOLD_PAGES.has(page)) return 'household';
  if (RESTAURANT_PAGES.has(page)) return 'restaurant';
  return 'restaurant';
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
    const routeStripSources = [
      {
        sections: document.querySelectorAll('[data-restaurant-route-strip]'),
        getRouteKey: (section) => section.dataset.restaurantRouteStrip,
        routeStrips: this.getRestaurantBranch().routeStrips || {},
      },
      {
        sections: document.querySelectorAll('[data-household-route-strip]'),
        getRouteKey: (section) => section.dataset.householdRouteStrip,
        routeStrips: this.getHouseholdBranch().routeStrips || {},
      },
    ];

    routeStripSources.forEach(({ sections, getRouteKey, routeStrips }) => {
      sections.forEach((section) => {
        const routeKey = getRouteKey(section);
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
    });
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

    document.body.classList.add(this.isBytovaya() ? 'branch-household' : 'branch-restaurant');

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
