const CONFIG = {
  company: {
    name: 'MosPochin',
    phoneDisplay: '8 (999) 005-71-72',
    phoneLink: '79990057172',
    whatsapp:
      'https://wa.me/79990057172?text=Здравствуйте!%20Нужен%20ремонт.%20Сайт%20MosPochin',
    email: 'info@mspochin.ru',
    experience: '15+ лет',
    responseTime: '60 минут',
  },
  services: {
    restaurant: [
      { href: 'uslugi.html', icon: '🔧', name: 'Все услуги' },
      { href: 'parokonvektomaty.html', icon: '🔥', name: 'Пароконвектоматы' },
      { href: 'plity.html', icon: '🍳', name: 'Плиты и печи' },
      {
        href: 'holodilnoe-oborudovanie.html',
        icon: '❄️',
        name: 'Холодильное оборудование',
      },
      { href: 'posudomoechnye-mashiny.html', icon: '🍽️', name: 'Посудомойки' },
      { href: 'grili-mangaly.html', icon: '🍳', name: 'Грили, фритюрницы, мелочёвка' },
      { href: 'ice-machines.html', icon: '🧊', name: 'Льдогенераторы' },
    ],
    bytovaya: [
      { href: 'bytovaya-uslugi.html', icon: '🏠', name: 'Все услуги' },
      { href: 'holodilniki.html', icon: '❄️', name: 'Холодильники' },
      { href: 'stiralnye-mashiny.html', icon: '🧺', name: 'Стиральные машины' },
      { href: 'posudomoyki.html', icon: '🍽️', name: 'Посудомойки' },
      { href: 'airconditioners.html', icon: '💨', name: 'Кондиционеры' },
      { href: 'microwaves.html', icon: '🔥', name: 'Плиты и микроволновки' },
      { href: 'kompyutery.html', icon: '💻', name: 'Компьютеры' },
      { href: 'routery.html', icon: '📶', name: 'Роутеры' },
      { href: 'water-heaters.html', icon: '🚿', name: 'Водонагреватели' },
    ],
  },
};

const RESTAURANT_PAGES = new Set([
  'index',
  'uslugi',
  'about',
  'contact',
  'parokonvektomaty',
  'plity',
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
  'microwaves',
  'airconditioners',
  'kompyutery',
  'routery',
  'water-heaters',
]);

function getCurrentPageSlug() {
  return (window.location.pathname.split('/').pop() || 'index.html').replace('.html', '');
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
  isBytovaya() {
    const page = getCurrentPageSlug();
    if (HOUSEHOLD_PAGES.has(page)) return true;
    if (RESTAURANT_PAGES.has(page)) return false;
    return false;
  },

  getBranchMeta() {
    const isBytovaya = this.isBytovaya();

    return {
      isBytovaya,
      subtitle: isBytovaya ? '🏠 Бытовая техника' : '🔧 Ресторанное оборудование',
      homeLink: isBytovaya ? 'bytovaya-index.html' : 'index.html',
      aboutLink: isBytovaya ? 'bytovaya-about.html' : 'about.html',
      contactLink: isBytovaya ? 'bytovaya-contact.html' : 'contact.html',
      servicesLink: isBytovaya ? 'bytovaya-uslugi.html' : 'uslugi.html',
      branchSwitchLink: isBytovaya ? 'index.html' : 'bytovaya-index.html',
      branchSwitchLabel: isBytovaya
        ? '🔧 Ресторанное оборудование'
        : '🏠 Бытовая техника',
      services: isBytovaya ? CONFIG.services.bytovaya : CONFIG.services.restaurant,
      topBarText: isBytovaya
        ? {
            icon: 'ri-flashlight-fill',
            text: '🚨 СРОЧНЫЙ ВЫЕЗД НА ДОМ',
            sub: 'Мастер будет через 60 минут',
          }
        : {
            icon: 'ri-flashlight-fill',
            text: '🚨 АВАРИЙНЫЙ ВЫЕЗД',
            sub: 'Мастер будет через 20 минут',
          },
      contactHint: isBytovaya ? '🏠 Выезд на дом' : '⚡ Работаем 24/7',
    };
  },

  isActivePage(fragment) {
    return window.location.pathname.includes(fragment);
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
    <a href="tel:${CONFIG.company.phoneLink}" class="hidden md:inline font-bold hover:text-yellow-300 transition">
      <i class="ri-phone-line mr-1"></i>${CONFIG.company.phoneDisplay}
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
          <a href="tel:${CONFIG.company.phoneLink}" class="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg px-5 py-2.5 rounded-full transition-all shadow-lg">
            <i class="ri-phone-line animate-pulse"></i>
            <span>${CONFIG.company.phoneDisplay}</span>
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
          <li><a href="index.html" class="hover:text-white transition">Главная</a></li>
          <li><a href="uslugi.html" class="hover:text-white transition">Услуги</a></li>
          <li><a href="parokonvektomaty.html" class="hover:text-white transition">Пароконвектоматы</a></li>
          <li><a href="plity.html" class="hover:text-white transition">Плиты и печи</a></li>
          <li><a href="holodilnoe-oborudovanie.html" class="hover:text-white transition">Холодильное оборудование</a></li>
          <li><a href="posudomoechnye-mashiny.html" class="hover:text-white transition">Посудомойки</a></li>
          <li><a href="grili-mangaly.html" class="hover:text-white transition">Грили, фритюрницы</a></li>
          <li><a href="ice-machines.html" class="hover:text-white transition">Льдогенераторы</a></li>
          <li><a href="about.html" class="hover:text-white transition">О компании</a></li>
          <li><a href="contact.html" class="hover:text-white transition">Контакты</a></li>
        </ul>
      </div>

      <div>
        <h5 class="text-white font-bold mb-4">🏠 Бытовая техника</h5>
        <ul class="space-y-2 text-sm">
          <li><a href="bytovaya-index.html" class="hover:text-white transition">Главная</a></li>
          <li><a href="bytovaya-uslugi.html" class="hover:text-white transition">Услуги</a></li>
          <li><a href="holodilniki.html" class="hover:text-white transition">Холодильники</a></li>
          <li><a href="stiralnye-mashiny.html" class="hover:text-white transition">Стиральные машины</a></li>
          <li><a href="posudomoyki.html" class="hover:text-white transition">Посудомойки</a></li>
          <li><a href="microwaves.html" class="hover:text-white transition">Плиты и микроволновки</a></li>
          <li><a href="kompyutery.html" class="hover:text-white transition">Компьютеры</a></li>
          <li><a href="routery.html" class="hover:text-white transition">Роутеры</a></li>
          <li><a href="airconditioners.html" class="hover:text-white transition">Кондиционеры</a></li>
          <li><a href="water-heaters.html" class="hover:text-white transition">Водонагреватели</a></li>
          <li><a href="bytovaya-about.html" class="hover:text-white transition">О компании</a></li>
          <li><a href="bytovaya-contact.html" class="hover:text-white transition">Контакты</a></li>
        </ul>
      </div>

      <div>
        <h5 class="text-white font-bold mb-4">📞 Контакты</h5>
        <ul class="space-y-3 text-sm">
          <li class="flex items-center gap-2">
            <i class="ri-phone-line text-brand-orange"></i>
            <a href="tel:${CONFIG.company.phoneLink}" class="hover:text-white transition font-bold">${CONFIG.company.phoneDisplay}</a>
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
<a href="tel:${CONFIG.company.phoneLink}" class="block w-full text-center bg-brand-orange text-white px-4 py-3 rounded-lg font-bold text-lg"><i class="ri-phone-line mr-2"></i>Позвонить</a>
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
    return CONFIG.company.phoneDisplay;
  },

  getPhoneLink() {
    return CONFIG.company.phoneLink;
  },

  init() {
    const header = document.getElementById('header-container');
    const footer = document.getElementById('footer-container');
    const phoneTargets = document.querySelectorAll('[data-company-phone]');
    const phoneLinks = document.querySelectorAll('[href="tel:79990057172"]');

    if (header) header.innerHTML = this.getHeader();
    if (footer) footer.innerHTML = this.getFooter();
    phoneTargets.forEach((node) => {
      node.textContent = CONFIG.company.phoneDisplay;
    });
    phoneLinks.forEach((node) => {
      node.setAttribute('href', `tel:${CONFIG.company.phoneLink}`);
    });

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

document.addEventListener('DOMContentLoaded', () => Components.init());
