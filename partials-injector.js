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
