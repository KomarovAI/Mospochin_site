// ============================================
// 📦 MOSPOCHIN — ЕДИНЫЙ JS ФАЙЛ (config + components)
// ============================================

const CONFIG = {
  company: {
    name: 'MosPochin',
    phoneDisplay: '8 (999) 005-71-72',
    phoneLink: '79990057172',
    whatsapp: 'https://wa.me/79990057172',
    email: 'info@mspochin.ru',
    experience: '15+ лет',
    responseTime: '60 минут'
  },
  services: {
    restaurant: [
      {href:'uslugi.html', icon:'🔧', name:'Все услуги'},
      {href:'parokonvektomaty.html', icon:'🔥', name:'Пароконвектоматы'},
      {href:'plity-pechi.html', icon:'🍳', name:'Плиты и печи'},
      {href:'holodilnoe-oborudovanie.html', icon:'❄️', name:'Холодильное оборудование'},
      {href:'posudomoechnye-mashiny.html', icon:'🍽️', name:'Посудомойки'},
      {href:'grili-mangaly.html', icon:'🍖', name:'Грили и мангалы'},
      {href:'friturennitsy.html', icon:'🍟', name:'Фритюрницы'}
    ],
    bytovaya: [
      {href:'bytovaya-uslugi.html', icon:'🏠', name:'Все услуги'},
      {href:'holodilniki.html', icon:'❄️', name:'Холодильники'},
      {href:'stiralnye-mashiny.html', icon:'🧺', name:'Стиральные машины'},
      {href:'posudomoyki.html', icon:'🍽️', name:'Посудомойки'},
      {href:'plity.html', icon:'🔥', name:'Плиты'},
      {href:'kompyutery.html', icon:'💻', name:'Компьютеры'},
      {href:'routery.html', icon:'📶', name:'Роутеры'}
    ]
  }
};

const Components = {
  isBytovaya() {
    const path = window.location.pathname.split('/').pop().replace('.html', '');
    const restaurantPages = ['index', 'uslugi', 'about', 'contact', 'parokonvektomaty', 'plity-pechi', 'holodilnoe-oborudovanie', 'posudomoechnye-mashiny', 'grili-mangaly', 'friturennitsy'];
    const bytovayaPages = ['bytovaya-index', 'bytovaya-uslugi', 'bytovaya-about', 'bytovaya-contact', 'holodilniki', 'stiralnye-mashiny', 'posudomoyki', 'plity', 'microwaves', 'airconditioners', 'tvs', 'vacuums', 'small-appliances', 'kompyutery', 'routery'];

    // Сначала проверяем бытовую (точное совпадение)
    if (bytovayaPages.includes(path)) return true;

    // Потом ресторанную
    if (restaurantPages.includes(path)) return false;

    // По умолчанию — ресторанная (index.html)
    return false;
  },
  
  getHeader() {
    const isByt = this.isBytovaya();
    const subtitle = isByt ? '🏠 Бытовая техника' : '🔧 Ресторанное оборудование';
    const homeLink = isByt ? 'bytovaya-index.html' : 'index.html';
    const services = isByt ? CONFIG.services.bytovaya : CONFIG.services.restaurant;
    const serviceItems = services.map(s => 
      `<a href="${s.href}" class="dropdown-item"><span class="icon">${s.icon}</span>${s.name}</a>`
    ).join('');
    
    return `
      <nav class="fixed w-full z-50 bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-sm" id="navbar">
        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16 lg:h-20">
            <a href="${homeLink}" class="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              <div class="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-brand-orange to-orange-600 rounded-xl flex items-center justify-center text-white text-lg lg:text-xl shadow-lg flex-shrink-0">
                <i class="fa-solid fa-wrench"></i>
              </div>
              <div class="hidden md:block">
                <span class="font-extrabold text-xl lg:text-2xl text-brand-blue tracking-tight block leading-tight">MosPochin</span>
                <span class="text-xs text-slate-500 block font-medium leading-tight">${subtitle}</span>
              </div>
            </a>

            <!-- ✅ ПРОСТОЕ МЕНЮ С ВЫПАДАЮЩИМ СПИСКОМ -->
            <div class="hidden lg:flex items-center gap-6">
              <a href="${homeLink}" class="nav-link ${window.location.pathname.includes('index') ? 'active' : ''}">Главная</a>

              <!-- ВЫПАДАЮЩЕЕ МЕНЮ УСЛУГИ -->
              <div class="dropdown">
                <button class="nav-link dropdown-toggle ${window.location.pathname.includes('uslugi') ? 'active' : ''}">
                  Услуги <i class="fa-solid fa-chevron-down text-xs ml-1"></i>
                </button>
                <div class="dropdown-menu">
                  ${serviceItems}
                </div>
              </div>

              <a href="${isByt ? 'bytovaya-about.html' : 'about.html'}" class="nav-link ${window.location.pathname.includes('about') ? 'active' : ''}">О нас</a>
              <a href="${isByt ? 'bytovaya-contact.html' : 'contact.html'}" class="nav-link ${window.location.pathname.includes('contact') ? 'active' : ''}">Контакты</a>
            </div>

            <div class="hidden lg:flex items-center gap-4">
              <div class="text-right">
                <p class="text-xs text-slate-500 font-medium">${isByt ? '🏠 Выезд на дом' : '⚡ Работаем 24/7'}</p>
                <a href="tel:${CONFIG.company.phoneLink}" class="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg px-5 py-2.5 rounded-full transition-all shadow-lg">
                <i class="fa-solid fa-phone animate-pulse"></i>
                <span>${CONFIG.company.phoneDisplay}</span>
                </a>
              </div>
            </div>

            <button id="mobile-menu-btn" class="lg:hidden bg-brand-orange hover:bg-brand-orangeHover text-white font-bold px-4 py-2 lg:px-5 lg:py-2.5 rounded-lg transition-all shadow-md text-sm flex-shrink-0"
                    aria-label="Открыть меню"
                    aria-expanded="false"
                    aria-controls="mobile-menu"
                    aria-haspopup="true"
                    role="button">
              <i class="fa-solid fa-bars mr-2"></i>Меню
            </button>
          </div>
        </div>
        <div id="mobile-menu" class="hidden lg:hidden bg-white border-t border-slate-200 shadow-xl">
          <div class="px-4 py-4 space-y-3" id="mobile-menu-items"></div>
        </div>
          <div class="branch-switcher flex items-center gap-2 ml-4">
              <a href="index.html" class="text-xs font-semibold px-3 py-1.5 rounded-full transition ${isByt ? 'bg-slate-200 text-slate-600 hover:bg-brand-orange hover:text-white' : 'bg-brand-orange text-white'}">🔧 Ресторан</a>
              <a href="bytovaya-index.html" class="text-xs font-semibold px-3 py-1.5 rounded-full transition ${!isByt ? 'bg-slate-200 text-slate-600 hover:bg-brand-orange hover:text-white' : 'bg-brand-orange text-white'}">🏠 Бытовая</a>
          </div>
      </nav>`;
  },
  
  getFooter() {
    const isByt = this.isBytovaya();
    return `
      <footer class="bg-brand-blue text-slate-400 py-12 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-gradient-to-br from-brand-orange to-orange-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                  <i class="fa-solid fa-wrench"></i>
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
                <li><a href="plity-pechi.html" class="hover:text-white transition">Плиты и печи</a></li>
                <li><a href="holodilnoe-oborudovanie.html" class="hover:text-white transition">Холодильное оборудование</a></li>
                <li><a href="posudomoechnye-mashiny.html" class="hover:text-white transition">Посудомойки</a></li>
                <li><a href="grili-mangaly.html" class="hover:text-white transition">Грили и мангалы</a></li>
                <li><a href="friturennitsy.html" class="hover:text-white transition">Фритюрницы</a></li>
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
                <li><a href="plity.html" class="hover:text-white transition">Плиты</a></li>
                <li><a href="kompyutery.html" class="hover:text-white transition">Компьютеры</a></li>
                <li><a href="routery.html" class="hover:text-white transition">Роутеры</a></li>
                <li><a href="tvs.html" class="hover:text-white transition">Телевизоры</a></li>
                <li><a href="vacuums.html" class="hover:text-white transition">Пылесосы</a></li>
                <li><a href="microwaves.html" class="hover:text-white transition">Микроволновки</a></li>
                <li><a href="airconditioners.html" class="hover:text-white transition">Кондиционеры</a></li>
                <li><a href="small-appliances.html" class="hover:text-white transition">Мелкая техника</a></li>
                <li><a href="bytovaya-about.html" class="hover:text-white transition">О компании</a></li>
                <li><a href="bytovaya-contact.html" class="hover:text-white transition">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h5 class="text-white font-bold mb-4">📞 Контакты</h5>
              <ul class="space-y-3 text-sm">
                <li class="flex items-center gap-2">
                  <i class="fa-solid fa-phone text-brand-orange"></i>
                  <a href="tel:${CONFIG.company.phoneLink}" class="hover:text-white transition font-bold">${CONFIG.company.phoneDisplay}</a>
                </li>
                <li class="flex items-center gap-2">
                  <i class="fa-solid fa-clock text-brand-orange"></i>
                  <span>24/7 Без выходных</span>
                </li>
                <li class="flex items-center gap-2">
                  <i class="fa-solid fa-location-dot text-brand-orange"></i>
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
    
    const isByt = this.isBytovaya();
    const homeLink = isByt ? 'bytovaya-index.html' : 'index.html';
    const aboutLink = isByt ? 'bytovaya-about.html' : 'about.html';
    const contactLink = isByt ? 'bytovaya-contact.html' : 'contact.html';
    const services = isByt ? CONFIG.services.bytovaya : CONFIG.services.restaurant;
    const serviceLinks = services.map(s => 
      `<a href="${s.href}" class="block pl-8 py-2 text-sm text-slate-600 hover:text-brand-orange hover:bg-orange-50 rounded-lg">${s.name}</a>`
    ).join('');
    
    let html = `
      <a href="${homeLink}" class="block px-3 py-2 text-base font-medium ${window.location.pathname.includes('index') ? 'text-brand-orange bg-orange-50' : 'text-slate-700 hover:bg-slate-50'} rounded-lg">🏠 Главная</a>
      
      <div class="mt-3">
        <button class="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg" id="mobile-services-toggle">
          <span>🔧 Услуги</span>
          <i class="fa-solid fa-chevron-down text-xs transition-transform" id="mobile-services-icon"></i>
        </button>
        <div class="mt-2 space-y-1 hidden" id="mobile-services-list">
          ${serviceLinks}
        </div>
      </div>
      
      <a href="${aboutLink}" class="block px-3 py-2 text-base font-medium ${window.location.pathname.includes('about') ? 'text-brand-orange bg-orange-50' : 'text-slate-700 hover:bg-slate-50'} rounded-lg mt-3">ℹ️ О нас</a>
      <a href="${contactLink}" class="block px-3 py-2 text-base font-medium ${window.location.pathname.includes('contact') ? 'text-brand-orange bg-orange-50' : 'text-slate-700 hover:bg-slate-50'} rounded-lg">📞 Контакты</a>
      
      <div class="border-t border-slate-200 my-3"></div>
      <a href="tel:${CONFIG.company.phoneLink}" class="block w-full text-center bg-brand-orange text-white px-4 py-3 rounded-lg font-bold text-lg"><i class="fa-solid fa-phone mr-2"></i>Позвонить</a>
      <a href="${isByt ? 'index.html' : 'bytovaya-index.html'}" class="block w-full text-center bg-slate-100 text-slate-700 px-4 py-3 rounded-lg font-semibold text-sm mt-2">
        ${isByt ? '🔧 Ресторанное оборудование' : '🏠 Бытовая техника'}
      </a>
    `;
    
    items.innerHTML = html;
    
    // Mobile services dropdown
    const servicesToggle = document.getElementById('mobile-services-toggle');
    const servicesList = document.getElementById('mobile-services-list');
    const servicesIcon = document.getElementById('mobile-services-icon');
    if (servicesToggle && servicesList && servicesIcon) {
      servicesToggle.addEventListener('click', () => {
        servicesList.classList.toggle('hidden');
        servicesIcon.style.transform = servicesList.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
      });
    }
    
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', !menu.classList.contains('hidden'));
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menu.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    }));
  },
  
  initScrollEffect() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('shadow-md', window.scrollY > 50);
    });
  },
  
  initFadeIn() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Наблюдаем за ВСЕМИ анимационными классами
    document.querySelectorAll('.fade-in-section, .scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-scale').forEach(el => observer.observe(el));
  },
  
  initSmoothScroll() {
    document.addEventListener('click', e => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor || anchor.getAttribute('href') === '#') return;
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  },
  
  initRipple() {
    document.querySelectorAll('.btn, .cta-glow, .btn-glow, a[href^="tel:"]').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  },

  // ✅ COUNTER ANIMATION для статистики
  initCounters() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();
        const update = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.counter').forEach(el => observer.observe(el));
  },

  // ✅ HEADING REVEAL с blur эффектом
  initHeadingReveal() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.heading-reveal').forEach(el => observer.observe(el));
  },
  
  // ✅ Helper to get phone number
  getPhone() {
    return CONFIG.company.phoneDisplay;
  },
  
  getPhoneLink() {
    return CONFIG.company.phoneLink;
  },
  
  init() {
    const hdr = document.getElementById('header-container');
    const ftr = document.getElementById('footer-container');
    if (hdr) hdr.innerHTML = this.getHeader();
    if (ftr) ftr.innerHTML = this.getFooter();
    
    setTimeout(() => {
      this.initMobileMenu();
      this.initScrollEffect();
      this.initFadeIn();
      this.initSmoothScroll();
      this.initRipple();
      this.initCounters();
      this.initHeadingReveal();
    }, 50);
  }
};

// ✅ АВТОЗАПУСК
document.addEventListener('DOMContentLoaded', () => Components.init());
