#!/usr/bin/env python3
"""
HTML Partials Builder for MosPochin
Извлекает повторяющиеся блоки из HTML файлов в partials/
и заменяет их на контейнеры для JS-инжекции
"""

import os
import re
from pathlib import Path

ROOT = Path(__file__).parent.parent
PARTIALS_DIR = ROOT / 'partials'

# Создаём partials/ директорию
PARTIALS_DIR.mkdir(exist_ok=True)

print("═══════════════════════════════════════════════════════════")
print("🏗️  HTML PARTIALS BUILDER")
print("═══════════════════════════════════════════════════════════\n")

# === 1. MOBILE STICKY FOOTER ===
mobile_footer_html = """<!-- Mobile sticky footer -->
<div id="mobile-footer-container" class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 p-4 z-50 md:hidden shadow-lg">
    <div class="grid grid-cols-2 gap-3">
        <a href="tel:+79990057172" data-contact-link="phone" class="btn-click bg-brand-orange hover:bg-brand-orangeHover text-white text-center py-4 rounded-2xl font-bold transition shadow-lg flex items-center justify-center gap-2">
            <i class="ri-phone-line"></i>
            <span class="text-sm">Позвонить</span>
        </a>
        <a href="https://wa.me/79990057172" data-contact-link="whatsapp" rel="noopener noreferrer" target="_blank" class="btn-click bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-2xl font-bold transition shadow-lg flex items-center justify-center gap-2">
            <i class="ri-whatsapp-line"></i>
            <span class="text-sm">WhatsApp</span>
        </a>
    </div>
</div>"""

with open(PARTIALS_DIR / 'mobile-footer.html', 'w', encoding='utf-8') as f:
    f.write(mobile_footer_html)
print("✅ Создан: partials/mobile-footer.html")

# === 2. WHATSAPP FLOATING BUTTON ===
whatsapp_float_html = """<!-- WhatsApp floating button (mobile) -->
<div id="whatsapp-float-container" class="fixed bottom-24 right-4 z-50 md:hidden">
    <a href="https://wa.me/79990057172" data-contact-link="whatsapp" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95">
        <i class="ri-whatsapp-line text-2xl"></i>
    </a>
</div>"""

with open(PARTIALS_DIR / 'whatsapp-float.html', 'w', encoding='utf-8') as f:
    f.write(whatsapp_float_html)
print("✅ Создан: partials/whatsapp-float.html")

# === 3. NOSCRIPT FALLBACK ===
noscript_html = """<!-- Noscript fallback -->
<noscript>
    <style>
        .noscript-fallback{position:fixed;top:0;left:0;right:0;z-index:9999;background:#0f172a;color:#fff;padding:12px 16px;text-align:center;font-family:sans-serif}
        .noscript-fallback a{color:#f97316;font-weight:bold;text-decoration:none;margin:0 8px}
        .noscript-fallback .ns-phone{font-size:1.2em}
    </style>
    <div class="noscript-fallback">
        <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:12px">
            <strong style="font-size:1.3em">🔥 MosPochin</strong>
            <span style="opacity:0.5">|</span>
            <a href="uslugi.html">Услуги</a>
            <a href="about.html">О нас</a>
            <a href="contact.html">Контакты</a>
            <span style="opacity:0.5">|</span>
            <a href="tel:+79990057172" data-contact-link="phone" class="ns-phone">☎ 8 (999) 005-71-72</a>
        </div>
    </div>
</noscript>"""

with open(PARTIALS_DIR / 'noscript-fallback.html', 'w', encoding='utf-8') as f:
    f.write(noscript_html)
print("✅ Создан: partials/noscript-fallback.html")

# === 4. COUNTDOWN TIMER ===
countdown_html = """<!-- Countdown Timer -->
<div id="countdown-container">
    <script>
    (function() {
        const TIMER_KEY = 'mospochin_timer_end';
        const DURATION = 60 * 60 * 1000;
        let endTime = localStorage.getItem(TIMER_KEY);
        if (!endTime || parseInt(endTime) <= Date.now()) {
            endTime = Date.now() + DURATION;
            localStorage.setItem(TIMER_KEY, endTime);
        }
        endTime = parseInt(endTime);
        const minEl = document.getElementById('cd-min');
        const secEl = document.getElementById('cd-sec');
        if (!minEl || !secEl) return;
        const tick = () => {
            const remaining = Math.max(0, endTime - Date.now());
            const min = Math.floor(remaining / 60000);
            const sec = Math.floor((remaining % 60000) / 1000);
            minEl.textContent = String(min).padStart(2, '0');
            secEl.textContent = ':' + String(sec).padStart(2, '0');
            if (remaining <= 0) {
                endTime = Date.now() + DURATION;
                localStorage.setItem(TIMER_KEY, endTime);
            }
        };
        tick();
        setInterval(tick, 1000);
    })();
    </script>
</div>"""

with open(PARTIALS_DIR / 'countdown-timer.html', 'w', encoding='utf-8') as f:
    f.write(countdown_html)
print("✅ Создан: partials/countdown-timer.html")

print("\n═══════════════════════════════════════════════════════════")
print("📊 Создаём JS инжектор для partials")
print("═══════════════════════════════════════════════════════════\n")

# === 5. PARTIALS INJECTOR JS ===
partials_injector_js = """// Partials Injector - загружает и вставляет partials в DOM
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
"""

with open(ROOT / 'partials-injector.js', 'w', encoding='utf-8') as f:
    f.write(partials_injector_js)
print("✅ Создан: partials-injector.js")

print("\n═══════════════════════════════════════════════════════════")
print("📊 ОБРАБОТКА HTML ФАЙЛОВ")
print("═══════════════════════════════════════════════════════════\n")

# === 6. ОБРАБОТКА HTML ФАЙЛОВ ===
html_files = list(ROOT.glob('*.html'))
print(f"📄 Найдено {len(html_files)} HTML файлов\n")

# Регулярные выражения для поиска блоков
mobile_footer_pattern = re.compile(
    r'<!-- Mobile sticky footer -->\s*<div class="fixed bottom-0[^>]*>.*?</div>\s*</div>',
    re.DOTALL
)

whatsapp_float_pattern = re.compile(
    r'<!-- WhatsApp floating button[^>]*-->\s*<div class="fixed bottom-24[^>]*>.*?</a>\s*</div>',
    re.DOTALL
)

noscript_pattern = re.compile(
    r'<!-- Noscript fallback -->\s*<noscript>.*?</noscript>',
    re.DOTALL
)

countdown_pattern = re.compile(
    r'<!-- Countdown Timer Script -->\s*<script>.*?\(\)\(\);\s*</script>',
    re.DOTALL
)

stats = {
    'mobile_footer': 0,
    'whatsapp_float': 0,
    'noscript': 0,
    'countdown': 0,
    'bytes_saved': 0
}

for html_file in html_files:
    filename = html_file.name
    print(f"🔧 Обрабатываю: {filename}")
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_size = len(content)
    modified = False
    
    # Заменяем mobile footer
    if mobile_footer_pattern.search(content):
        content = mobile_footer_pattern.sub(
            '<!-- Mobile footer injected via JS -->',
            content
        )
        stats['mobile_footer'] += 1
        modified = True
        print(f"   ✓ Mobile footer → контейнер")
    
    # Заменяем WhatsApp float
    if whatsapp_float_pattern.search(content):
        content = whatsapp_float_pattern.sub(
            '<!-- WhatsApp float injected via JS -->',
            content
        )
        stats['whatsapp_float'] += 1
        modified = True
        print(f"   ✓ WhatsApp float → контейнер")
    
    # Заменяем noscript
    if noscript_pattern.search(content):
        content = noscript_pattern.sub(
            '<!-- Noscript fallback inline -->',
            content
        )
        stats['noscript'] += 1
        modified = True
        print(f"   ✓ Noscript → комментарий")
    
    # Заменяем countdown
    if countdown_pattern.search(content):
        content = countdown_pattern.sub(
            '<!-- Countdown timer inline -->',
            content
        )
        stats['countdown'] += 1
        modified = True
        print(f"   ✓ Countdown → комментарий")
    
    # Добавляем partials-injector.js если его нет
    if 'partials-injector.js' not in content and modified:
        # Вставляем перед закрывающим </body>
        content = content.replace(
            '</body>',
            '    <script src="partials-injector.js" defer></script>\n</body>'
        )
        print(f"   ✓ Добавлен partials-injector.js")
    
    if modified:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        new_size = len(content)
        saved = original_size - new_size
        stats['bytes_saved'] += saved
        print(f"   💾 Сохранено: {saved} bytes")
    else:
        print(f"   ⚠️  Изменений нет")
    
    print()

print("═══════════════════════════════════════════════════════════")
print("📊 СТАТИСТИКА")
print("═══════════════════════════════════════════════════════════\n")

print(f"✅ Mobile footer заменён: {stats['mobile_footer']} файлов")
print(f"✅ WhatsApp float заменён: {stats['whatsapp_float']} файлов")
print(f"✅ Noscript заменён: {stats['noscript']} файлов")
print(f"✅ Countdown заменён: {stats['countdown']} файлов")
print(f"\n💾 Общая экономия: {stats['bytes_saved']:,} bytes ({stats['bytes_saved'] // 1024} KB)")

print("\n═══════════════════════════════════════════════════════════")
print("✅ ГОТОВО!")
print("═══════════════════════════════════════════════════════════\n")

print("📁 Созданные файлы:")
print("   • partials/mobile-footer.html")
print("   • partials/whatsapp-float.html")
print("   • partials/noscript-fallback.html")
print("   • partials/countdown-timer.html")
print("   • partials-injector.js")
print()
print("🔄 Следующие шаги:")
print("   1. npm run dev")
print("   2. Проверить сайт: http://127.0.0.1:9999")
print("   3. Если всё ок: git add -A && git commit -m 'refactor: extract HTML partials'")
print()
