import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT_DIR } from './ai-maintenance-lib.mjs';

function readJson(path) {
  return JSON.parse(readFileSync(join(ROOT_DIR, path), 'utf8'));
}

const restaurant = readJson('data/restaurant-branch.json');
const household = readJson('data/household-branch.json');
const contacts = readJson('data/contact-config.json');
const metadata = readJson('data/page-metadata.json');

const legal = Object.freeze({
  name: 'Кудашов Александр Викторович',
  inn: '772503580362',
  ogrn: '',
  address: '',
});

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function branchForPage(page) {
  return metadata.pages?.[page]?.branch === 'household' ? 'household' : 'restaurant';
}

function branchMeta(page) {
  const isHousehold = branchForPage(page) === 'household';
  const config = isHousehold ? household : restaurant;
  return {
    config,
    isHousehold,
    homeLink: isHousehold ? 'bytovaya-index.html' : 'index.html',
    servicesLink: isHousehold ? 'bytovaya-uslugi.html' : 'uslugi.html',
    aboutLink: isHousehold ? 'bytovaya-about.html' : 'about.html',
    contactLink: isHousehold ? 'bytovaya-contact.html' : 'contact.html',
    branchSwitchLink: isHousehold ? 'index.html' : 'bytovaya-index.html',
    branchSwitchLabel: isHousehold ? 'Ресторанное оборудование' : 'Бытовая техника',
  };
}

function shellCtaAttrs(page, id, block, group = 'phone') {
  const slug = String(page || 'page').replace(/\.html$/i, '').replace(/[^a-z0-9_-]+/gi, '_');
  return `data-cta-id="${escapeHtml(`${slug}_shell_${id}`)}" data-cta-group="${escapeHtml(group)}" data-block="${escapeHtml(block)}"`;
}

function currentAttrs(page, target) {
  return page === target ? ' aria-current="page"' : '';
}

function activeClass(page, target) {
  return page === target ? 'active' : '';
}

function mobileActiveClass(page, target) {
  return page === target ? 'text-brand-orange bg-orange-50 font-bold' : 'text-slate-700 hover:bg-slate-50';
}

function navigationGroups(config) {
  if (Array.isArray(config.navigationGroups) && config.navigationGroups.length) return config.navigationGroups;
  return [{ label: 'Услуги', items: config.primaryServices || config.services || [] }];
}

function allNavigationItems(config) {
  return navigationGroups(config).flatMap((group) => group.items || []);
}

function desktopServiceMenu(config, page, isHousehold) {
  const groups = navigationGroups(config);
  if (isHousehold || groups.length === 1) {
    return (groups[0]?.items || []).map((service) => (
      `<a href="${escapeHtml(service.href)}" class="dropdown-item ${activeClass(page, service.href)}"${currentAttrs(page, service.href)}><span class="icon">${escapeHtml(service.icon || '🔧')}</span>${escapeHtml(service.name)}</a>`
    )).join('');
  }

  const groupHtml = groups.map((group) => (
    `<div class="restaurant-menu-group"><p class="restaurant-menu-heading">${escapeHtml(group.label)}</p>${(group.items || []).map((service) => (
      `<a href="${escapeHtml(service.href)}" class="dropdown-item ${activeClass(page, service.href)}"${currentAttrs(page, service.href)}><span class="icon">${escapeHtml(service.icon || '🔧')}</span><span>${escapeHtml(service.name)}</span></a>`
    )).join('')}</div>`
  )).join('');

  return `<div class="restaurant-mega-menu"><a href="uslugi.html" class="restaurant-menu-catalog ${activeClass(page, 'uslugi.html')}"${currentAttrs(page, 'uslugi.html')}><span>Каталог ремонта ресторанного оборудования</span><i class="ri-arrow-right-line"></i></a><div class="restaurant-menu-grid">${groupHtml}</div></div>`;
}

function mobileServiceGroups(page, meta) {
  const groups = navigationGroups(meta.config);
  return groups.map((group) => (
    `<div class="mt-3"><p class="px-3 pb-1 text-xs font-bold uppercase tracking-wide text-slate-400">${escapeHtml(group.label)}</p>${(group.items || []).map((service) => (
      `<a href="${escapeHtml(service.href)}" class="block pl-5 pr-3 py-2 text-sm rounded-lg ${mobileActiveClass(page, service.href)}"${currentAttrs(page, service.href)}>${escapeHtml(service.name)}</a>`
    )).join('')}</div>`
  )).join('');
}

function mobileMenuItems(page, meta) {
  const whatsappHref = `https://wa.me/${escapeHtml(contacts.whatsappNumber)}?text=${encodeURIComponent(contacts.whatsappDefaultText || 'Здравствуйте! Нужен ремонт.')}`;
  return `<a href="${meta.homeLink}" class="block px-3 py-2 text-base font-medium ${mobileActiveClass(page, meta.homeLink)} rounded-lg"${currentAttrs(page, meta.homeLink)}>🏠 Главная</a>
<div class="grid grid-cols-2 gap-2">
  <a href="tel:${escapeHtml(contacts.phoneE164)}" ${shellCtaAttrs(page, 'mobile_phone', 'mobile_menu')} class="block text-center bg-brand-orange text-white px-3 py-3 rounded-lg font-bold text-sm"><i class="ri-phone-line mr-1"></i>Позвонить</a>
  <a href="${whatsappHref}" ${shellCtaAttrs(page, 'mobile_whatsapp', 'mobile_menu', 'whatsapp')} target="_blank" rel="noopener noreferrer" class="block text-center bg-green-600 text-white px-3 py-3 rounded-lg font-bold text-sm"><i class="ri-whatsapp-line mr-1"></i>WhatsApp</a>
</div>
<div class="mt-3">
  <button class="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg" id="mobile-services-toggle" type="button" aria-expanded="false" aria-controls="mobile-services-list">
    <span>🔧 ${meta.isHousehold ? 'Услуги' : 'Ремонт техники'}</span><i class="ri-arrow-down-s-line text-xs transition-transform" id="mobile-services-icon"></i>
  </button>
  <div class="mt-2 space-y-1 hidden" id="mobile-services-list">${mobileServiceGroups(page, meta)}</div>
</div>
<a href="${meta.aboutLink}" class="block px-3 py-2 text-base font-medium ${mobileActiveClass(page, meta.aboutLink)} rounded-lg mt-3"${currentAttrs(page, meta.aboutLink)}>ℹ️ О нас</a>
<a href="${meta.contactLink}" class="block px-3 py-2 text-base font-medium ${mobileActiveClass(page, meta.contactLink)} rounded-lg"${currentAttrs(page, meta.contactLink)}>📞 Контакты</a>
<div class="border-t border-slate-200 my-2"></div>
<a href="${meta.branchSwitchLink}" class="block w-full text-center bg-slate-100 text-slate-700 px-4 py-3 rounded-lg font-bold text-sm border border-slate-200">${meta.isHousehold ? '🔧 Ресторанное оборудование' : '🏠 Бытовая техника'}</a>`;
}

export function renderStaticHeader(page) {
  const meta = branchMeta(page);
  const top = meta.config.topBarText || {};
  const servicePages = new Set([meta.servicesLink, ...allNavigationItems(meta.config).map((item) => item.href)]);
  const serviceActive = servicePages.has(page) ? 'active' : '';
  return `<!-- build-time static shell -->
<div class="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 text-center fixed top-0 w-full z-[60] shadow-lg">
  <div class="max-w-7xl mx-auto px-4 flex items-center justify-center gap-4">
    <i class="${escapeHtml(top.icon || 'ri-flashlight-fill')} text-yellow-300"></i>
    <span class="font-bold">${escapeHtml(top.text || 'ЗАЯВКА НА РЕМОНТ')}</span>
    <span class="hidden sm:inline">•</span>
    <span class="hidden sm:inline font-semibold">${escapeHtml(top.sub || '')}</span>
    <span class="hidden md:inline">•</span>
    <a href="tel:${escapeHtml(contacts.phoneE164)}" ${shellCtaAttrs(page, 'top_phone', 'top_bar')} class="hidden md:inline font-bold hover:text-yellow-300 transition"><i class="ri-phone-line mr-1"></i>${escapeHtml(contacts.phoneDisplay)}</a>
  </div>
</div>
<nav class="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg glass-navbar" id="navbar" aria-label="Основная навигация">
  <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16 lg:h-20">
      <a href="${meta.homeLink}" class="flex items-center gap-2 lg:gap-3 flex-shrink-0" aria-label="MosPochin — главная"${currentAttrs(page, meta.homeLink)}>
        <div class="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-brand-orange to-orange-600 rounded-xl flex items-center justify-center text-white text-lg lg:text-xl shadow-lg flex-shrink-0"><i class="ri-tools-line"></i></div>
        <div class="hidden md:block"><span class="font-extrabold text-xl lg:text-2xl text-brand-blue tracking-tight block leading-tight">MosPochin</span><span class="text-xs text-slate-500 block font-medium leading-tight">${escapeHtml(meta.config.subtitle || '')}</span></div>
      </a>
      <div class="hidden lg:flex items-center gap-5">
        <a href="${meta.homeLink}" class="nav-link ${activeClass(page, meta.homeLink)}"${currentAttrs(page, meta.homeLink)}>Главная</a>
        <div class="dropdown"><a href="${meta.servicesLink}" class="nav-link dropdown-toggle ${serviceActive}" aria-haspopup="true">${meta.isHousehold ? 'Услуги' : 'Ремонт техники'} <i class="ri-arrow-down-s-line text-xs ml-1"></i></a><div class="dropdown-menu ${meta.isHousehold ? '' : 'restaurant-dropdown-menu'}" aria-label="${meta.isHousehold ? 'Услуги бытовой техники' : 'Категории ресторанного оборудования'}">${desktopServiceMenu(meta.config, page, meta.isHousehold)}</div></div>
        <a href="${meta.aboutLink}" class="nav-link ${activeClass(page, meta.aboutLink)}"${currentAttrs(page, meta.aboutLink)}>О нас</a>
        <a href="${meta.contactLink}" class="nav-link ${activeClass(page, meta.contactLink)}"${currentAttrs(page, meta.contactLink)}>Контакты</a>
      </div>
      <div class="hidden lg:flex items-center gap-3"><div class="text-right"><p class="text-xs text-slate-500 font-medium">${escapeHtml(meta.config.contactHint || '')}</p><a href="tel:${escapeHtml(contacts.phoneE164)}" ${shellCtaAttrs(page, 'desktop_phone', 'desktop_nav')} class="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg px-5 py-2.5 rounded-full transition-all shadow-lg"><i class="ri-phone-line"></i><span>${escapeHtml(contacts.phoneDisplay)}</span></a></div></div>
      <button id="mobile-menu-btn" class="lg:hidden bg-brand-orange hover:bg-brand-orangeHover text-white font-bold px-4 py-2 lg:px-5 lg:py-2.5 rounded-lg transition-all shadow-md text-sm flex-shrink-0" aria-label="Открыть меню" aria-expanded="false" aria-controls="mobile-menu" aria-haspopup="true" type="button"><i class="ri-menu-line mr-2"></i>Меню</button>
    </div>
  </div>
  <div id="mobile-menu" class="hidden lg:hidden bg-white border-t border-slate-200 shadow-xl"><div class="px-4 py-4 space-y-3" id="mobile-menu-items">${mobileMenuItems(page, meta)}</div></div>
</nav>`;
}

function footerLink(page, link) {
  return `<li><a href="${escapeHtml(link.href)}" class="hover:text-white transition ${page === link.href ? 'text-white font-semibold' : ''}"${currentAttrs(page, link.href)}>${escapeHtml(link.label)}</a></li>`;
}

function footerGroup(page, group, label) {
  return `<nav aria-label="${escapeHtml(label || group.title)}"><h5 class="text-white font-bold mb-4">${escapeHtml(group.title)}</h5><ul class="space-y-2 text-sm">${(group.items || []).map((link) => footerLink(page, link)).join('')}</ul></nav>`;
}

export function renderStaticFooter(page) {
  const meta = branchMeta(page);
  const legalBlock = legal.name && legal.inn ? `<div class="text-xs leading-relaxed text-slate-500" data-legal-requisites><p class="font-bold text-slate-300">Рекламодатель</p><p>${escapeHtml(legal.name)} · ИНН ${escapeHtml(legal.inn)}</p></div>` : '';
  const whatsappHref = `https://wa.me/${escapeHtml(contacts.whatsappNumber)}?text=${encodeURIComponent(contacts.whatsappDefaultText || 'Здравствуйте! Нужен ремонт.')}`;

  let middleColumns = '';
  if (!meta.isHousehold && Array.isArray(restaurant.footerGroups)) {
    middleColumns = restaurant.footerGroups.map((group, index) => footerGroup(page, group, index === 0 ? 'Основные направления ремонта ресторанного оборудования' : 'Дополнительные направления и информация')).join('');
  } else {
    const householdGroups = [
      { title: 'Бытовая техника', items: (household.footerLinks || []).slice(0, 8) },
      { title: 'Информация', items: [
        { href: 'bytovaya-about.html', label: 'О компании' },
        { href: 'bytovaya-contact.html', label: 'Контакты' },
        { href: 'index.html', label: 'Ресторанное оборудование' },
      ] },
    ];
    middleColumns = householdGroups.map((group, index) => footerGroup(page, group, index === 0 ? 'Категории бытовой техники' : 'Информация и другие направления')).join('');
  }

  return `<!-- build-time static shell -->
<footer class="bg-brand-blue text-slate-400 py-12 border-t border-slate-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
      <div><div class="flex items-center gap-3 mb-4"><div class="w-10 h-10 bg-gradient-to-br from-brand-orange to-orange-600 rounded-lg flex items-center justify-center text-white shadow-lg"><i class="ri-tools-line"></i></div><span class="font-extrabold text-xl text-white">MosPochin</span></div><p class="text-sm max-w-sm">${meta.isHousehold ? 'Ремонт бытовой техники в Москве и Московской области.' : 'Ремонт профессионального ресторанного оборудования в Москве и Московской области.'}</p><a href="${meta.branchSwitchLink}" class="inline-flex mt-4 text-sm font-semibold text-slate-300 hover:text-white transition">${meta.isHousehold ? 'Перейти к ресторанному оборудованию' : 'Перейти к бытовой технике'} <i class="ri-arrow-right-line ml-1"></i></a></div>
      ${middleColumns}
      <div><h5 class="text-white font-bold mb-4">Связаться</h5><ul class="space-y-3 text-sm"><li class="flex items-center gap-2"><i class="ri-phone-line text-brand-orange"></i><a href="tel:${escapeHtml(contacts.phoneE164)}" ${shellCtaAttrs(page, 'footer_phone', 'footer')} class="hover:text-white transition font-bold">${escapeHtml(contacts.phoneDisplay)}</a></li><li class="flex items-center gap-2"><i class="ri-whatsapp-line text-brand-orange"></i><a href="${whatsappHref}" ${shellCtaAttrs(page, 'footer_whatsapp', 'footer', 'whatsapp')} target="_blank" rel="noopener noreferrer" class="hover:text-white transition">Написать в WhatsApp</a></li><li class="flex items-center gap-2"><i class="ri-mail-line text-brand-orange"></i><a href="mailto:${escapeHtml(contacts.email)}" ${shellCtaAttrs(page, 'footer_email', 'footer', 'email')} class="hover:text-white transition">${escapeHtml(contacts.email)}</a></li><li class="flex items-center gap-2"><i class="ri-time-line text-brand-orange"></i><span>График — по согласованию</span></li><li class="flex items-center gap-2"><i class="ri-map-pin-line text-brand-orange"></i><span>Москва и МО</span></li></ul></div>
    </div>
    <div class="border-t border-slate-800 pt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4"><p class="text-xs">&copy; ${new Date().getFullYear()} MosPochin. Все права защищены.</p>${legalBlock}</div>
  </div>
</footer>`;
}

export function optimizeStaticHead(html) {
  let result = String(html);
  result = result.replace(/<title([^>]*)>([\s\S]*?)<\/title>/i, (match, attrs, content) => {
    const clean = String(content).split('<', 1)[0].trim();
    return `<title${attrs}>${clean}</title>`;
  });
  if (!/href=["']\/?assets\/fonts\/manrope\.css["'][^>]*rel=["']stylesheet["']|rel=["']stylesheet["'][^>]*href=["']\/?assets\/fonts\/manrope\.css["']/i.test(result)) {
    const link = '<link href="/assets/fonts/manrope.css" rel="stylesheet"/>';
    result = result.replace(/(<link[^>]+href=["'][^"']*styles-combined\.css["'][^>]*rel=["']stylesheet["'][^>]*>)/i, `${link}$1`);
    if (!result.includes(link)) result = result.replace(/<\/head>/i, `${link}</head>`);
  }
  if (!/href=["']\/?assets\/fonts\/manrope-700\.woff2["']/i.test(result)) {
    const preload = '<link rel="preload" href="/assets/fonts/manrope-700.woff2" as="font" type="font/woff2" crossorigin/>';
    result = result.replace(/<head>/i, `<head>${preload}`);
  }
  return result;
}

export function injectStaticShell(html, page) {
  let result = optimizeStaticHead(html);
  const header = renderStaticHeader(page);
  const footer = renderStaticFooter(page);
  result = result.replace(/<div([^>]*\bid=["']header-container["'][^>]*)>\s*<\/div>/i, `<div$1 data-static-shell="true">${header}</div>`);
  result = result.replace(/<div([^>]*\bid=["']footer-container["'][^>]*)>\s*<\/div>/i, `<div$1 data-static-shell="true">${footer}</div>`);
  return result;
}
