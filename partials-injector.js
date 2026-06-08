// Partials Injector - загружает и вставляет partials в DOM
(function() {
  'use strict';

  const PARTIALS = {
    'mobile-footer': '/partials/mobile-footer.html',
    'whatsapp-float': '/partials/whatsapp-float.html',
    'noscript-fallback': '/partials/noscript-fallback.html',
    'countdown-timer': '/partials/countdown-timer.html'
  };

  const cache = {};


  function getCurrentPageFile() {
    return window.location.pathname.split('/').pop() || 'index.html';
  }

  function pageMobileIntent() {
    const page = getCurrentPageFile();
    const map = {
      'parokonvektomaty-promo.html': ['Срочно', 'WhatsApp', 'Заявка'],
      'parokonvektomat-unox-af02-af08.html': ['Позвонить', 'AF02/AF08', 'Заявка'],
      'parokonvektomat-rational-e9.html': ['Позвонить', 'E9', 'Заявка'],
      'parokonvektomat-kod-oshibki.html': ['Позвонить', 'Код ошибки', 'Заявка'],
      'parokonvektomat-e02-e07-e10.html': ['Позвонить', 'E02/E07', 'Заявка'],
      'parokonvektomat-ne-greet.html': ['Позвонить', 'Не греет', 'Заявка'],
      'parokonvektomat-net-para.html': ['Позвонить', 'Нет пара', 'Заявка'],
      'parokonvektomat-rational.html': ['Позвонить', 'Rational', 'Заявка'],
      'parokonvektomat-unox.html': ['Позвонить', 'Unox', 'Заявка'],
      'parokonvektomat-obschuzhivanie.html': ['Позвонить', 'ТО', 'Заявка'],
      'remont-oborudovaniya-restorana-parokonvektomat.html': ['Позвонить', 'B2B кухня', 'Заявка']
    };
    return map[page] || ['Позвонить', 'WhatsApp', 'Заявка'];
  }

  function personalizeMobileFooter() {
    const footer = document.querySelector('#mobile-footer-container');
    if (!footer) return;
    const [phone, whatsapp, request] = pageMobileIntent();
    footer.querySelector('[data-mobile-label="phone"]')?.replaceChildren(document.createTextNode(phone));
    footer.querySelector('[data-mobile-label="whatsapp"]')?.replaceChildren(document.createTextNode(whatsapp));
    footer.querySelector('[data-mobile-label="request"]')?.replaceChildren(document.createTextNode(request));
    const wa = footer.querySelector('a[data-contact-link="whatsapp"]');
    if (wa) {
      const page = getCurrentPageFile();
      const text = `Здравствуйте! Нужен ремонт пароконвектомата. Страница: ${page}. Отправлю фото панели, модель, симптом и адрес кухни.`;
      wa.setAttribute('href', `https://wa.me/79990057172?text=${encodeURIComponent(text)}`);
      wa.dataset.whatsappIntent = page;
    }
  }

  async function loadPartial(name) {
    if (cache[name]) return cache[name];
    try {
      const response = await fetch(PARTIALS[name]);
      if (!response.ok) return null;
      const html = await response.text();
      cache[name] = html;
      return html;
    } catch (err) {
      console.warn('Failed to load partial:', name, err);
      return null;
    }
  }

  async function injectPartials() {
    // Mobile footer - заменяем существующий или добавляем
    const mobileFooter = document.querySelector('#mobile-footer-container');
    if (mobileFooter) {
      const html = await loadPartial('mobile-footer');
      if (html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newFooter = doc.querySelector('#mobile-footer-container');
        if (newFooter) {
          mobileFooter.replaceWith(newFooter);
        }
      }
    }

    // WhatsApp float - заменяем существующий или добавляем
    const whatsappFloat = document.querySelector('#whatsapp-float-container');
    if (whatsappFloat) {
      const html = await loadPartial('whatsapp-float');
      if (html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newFloat = doc.querySelector('#whatsapp-float-container');
        if (newFloat) {
          whatsappFloat.replaceWith(newFloat);
        }
      }
    }

    personalizeMobileFooter();

    // Noscript fallback - уже в HTML, ничего не делаем
    // Countdown timer - уже в HTML, ничего не делаем
  }

  // Запускаем после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectPartials);
  } else {
    injectPartials();
  }
})();
