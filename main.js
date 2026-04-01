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
    const restaurantPrefixes = ['parokonvektomaty', 'plity-pechi', 'holodilnoe', 'posudomoechnye', 'grili', 'friturennitsy', 'uslugi'];
    const bytovayaPrefixes = ['bytovaya', 'holodilniki', 'stiralnye', 'posudomoyki', 'plity', 'microwaves', 'airconditioners', 'tvs', 'vacuums', 'small', 'kompyutery', 'routery'];
    
    // Если ресторанная страница — возвращаем false
    if (restaurantPrefixes.some(p => path.includes(p))) return false;
    
    return bytovayaPrefixes.some(p => path.includes(p));
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
          <div class="flex justify-between items-center h-20">
            <a href="${homeLink}" class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gradient-to-br from-brand-orange to-orange-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                <i class="fa-solid fa-wrench"></i>
              </div>
              <div class="hidden sm:block">
                <span class="font-extrabold text-2xl text-brand-blue tracking-tight block">MosPochin</span>
                <span class="text-xs text-slate-500 block font-medium">${subtitle}</span>
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
            
            <button id="mobile-menu-btn" class="lg:hidden text-slate-600 hover:text-brand-orange p-2">
              <i class="fa-solid fa-bars text-2xl"></i>
            </button>
          </div>
        </div>
        <div id="mobile-menu" class="hidden lg:hidden bg-white border-t border-slate-200">
          <div class="px-4 py-4 space-y-3" id="mobile-menu-items"></div>
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
                <li><a href="holodilniki.html" class="hover:text-white transition">Холодильники</a></li>
                <li><a href="stiralnye-mashiny.html" class="hover:text-white transition">Стиральные машины</a></li>
                <li><a href="posudomoyki.html" class="hover:text-white transition">Посудомойки</a></li>
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
    
    btn.addEventListener('click', () => menu.classList.toggle('hidden'));
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.classList.add('hidden')));
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
    document.querySelectorAll('.fade-in-section').forEach(el => observer.observe(el));
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
    }, 50);
  }
};

// ✅ ТАЙЛВИНД КОНФИГ
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif']
      },
      colors: {
        brand: {
          orange: '#f97316',
          orangeHover: '#ea580c',
          blue: '#0f172a',
          lightBlue: '#1e293b',
          green: '#22c55e',
          gray: '#f8fafc',
          primary: '#f97316',
          primaryHover: '#ea580c',
          accent: '#ea580c'
        }
      }
    }
  }
};

// ✅ АВТОЗАПУСК
document.addEventListener('DOMContentLoaded', () => Components.init());
