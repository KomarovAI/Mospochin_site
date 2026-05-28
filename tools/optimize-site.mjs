#!/usr/bin/env node
/**
 * Скрипт оптимизации сайта для работы с нейронкой
 * Автоматически анализирует и оптимизирует большие HTML файлы
 */

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';

const PROJECT_ROOT = process.cwd();
const PARTIALS_DIR = join(PROJECT_ROOT, 'partials');

// Создаём папку partials если её нет
if (!existsSync(PARTIALS_DIR)) {
  mkdirSync(PARTIALS_DIR, { recursive: true });
  console.log('✅ Создана папка partials/');
}

/**
 * Находит все большие HTML файлы
 */
function findLargeHTMLFiles() {
  const files = readdirSync(PROJECT_ROOT)
    .filter(f => f.endsWith('.html'))
    .map(f => ({
      path: join(PROJECT_ROOT, f),
      name: f,
      size: statSync(join(PROJECT_ROOT, f)).size
    }))
    .filter(f => f.size > 50000) // Больше 50KB
    .sort((a, b) => b.size - a.size);
  
  return files;
}

/**
 * Создаёт переиспользуемые компоненты
 */
function createPartials() {
  console.log('\n📦 Создаю переиспользуемые компоненты...\n');
  
  // Mobile Sticky Footer
  const mobileFooter = `<!-- Mobile sticky footer -->
<div class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 p-4 z-50 md:hidden shadow-lg">
    <div class="grid grid-cols-2 gap-3">
        <a href="tel:+79990057172" data-contact-link="phone" class="btn-click bg-brand-orange hover:bg-brand-orangeHover text-white text-center py-4 rounded-2xl font-bold transition shadow-lg flex items-center justify-center gap-2">
            <i class="ri-phone-line"></i>
            <span class="text-sm">Выезд</span>
        </a>
        <a href="https://wa.me/79990057172?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!" data-contact-link="whatsapp" rel="noopener noreferrer" target="_blank" class="btn-click bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-2xl font-bold transition shadow-lg flex items-center justify-center gap-2">
            <i class="ri-whatsapp-line"></i>
            <span class="text-sm">B2B</span>
        </a>
    </div>
</div>`;
  
  writeFileSync(join(PARTIALS_DIR, 'mobile-sticky-footer.html'), mobileFooter);
  console.log('  ✅ mobile-sticky-footer.html');
  
  // WhatsApp Floating Button
  const whatsappButton = `<!-- WhatsApp floating button (mobile) -->
<div class="fixed bottom-24 right-4 z-50 md:hidden">
    <a href="https://wa.me/79990057172?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!" data-contact-link="whatsapp" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95">
        <i class="ri-whatsapp-line text-2xl"></i>
    </a>
</div>`;
  
  writeFileSync(join(PARTIALS_DIR, 'whatsapp-floating.html'), whatsappButton);
  console.log('  ✅ whatsapp-floating.html');
  
  // Noscript Fallback
  const noscriptFallback = `<!-- Noscript fallback -->
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
</noscript>`;
  
  writeFileSync(join(PARTIALS_DIR, 'noscript-fallback.html'), noscriptFallback);
  console.log('  ✅ noscript-fallback.html');
  
  console.log('\n✅ Компоненты созданы!\n');
}

/**
 * Оптимизирует HTML файл
 */
function optimizeHTMLFile(filePath) {
  console.log(`\n🔧 Оптимизирую ${basename(filePath)}...`);
  
  let html = readFileSync(filePath, 'utf-8');
  const originalSize = html.length;
  
  // 1. Заменяем Mobile sticky footer на компонент
  const mobileFooterPattern = /<!-- Mobile sticky footer -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
  if (mobileFooterPattern.test(html)) {
    html = html.replace(mobileFooterPattern, '<!-- INCLUDE: partials/mobile-sticky-footer.html -->');
    console.log('   ✅ Заменил mobile sticky footer на компонент');
  }
  
  // 2. Заменяем WhatsApp floating button на компонент
  const whatsappPattern = /<!-- WhatsApp floating button[\s\S]*?<\/div>\s*<\/div>/;
  if (whatsappPattern.test(html)) {
    html = html.replace(whatsappPattern, '<!-- INCLUDE: partials/whatsapp-floating.html -->');
    console.log('   ✅ Заменил WhatsApp button на компонент');
  }
  
  // 3. Заменяем Noscript fallback на компонент
  const noscriptPattern = /<!-- Noscript fallback -->[\s\S]*?<\/noscript>/;
  if (noscriptPattern.test(html)) {
    html = html.replace(noscriptPattern, '<!-- INCLUDE: partials/noscript-fallback.html -->');
    console.log('   ✅ Заменил noscript fallback на компонент');
  }
  
  const newSize = html.length;
  const saved = originalSize - newSize;
  const savedPercent = ((saved / originalSize) * 100).toFixed(1);
  
  if (saved > 0) {
    writeFileSync(filePath, html);
    console.log(`   📉 Уменьшил размер: ${(originalSize/1024).toFixed(1)}KB → ${(newSize/1024).toFixed(1)}KB (экономия ${savedPercent}%)`);
  } else {
    console.log('   ℹ️  Файл уже оптимизирован');
  }
  
  return { originalSize, newSize, saved };
}

/**
 * Основная функция
 */
function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🚀 Оптимизация сайта для работы с нейронкой');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  // Создаём компоненты
  createPartials();
  
  // Находим большие файлы
  const largeFiles = findLargeHTMLFiles();
  
  if (largeFiles.length === 0) {
    console.log('✅ Все файлы оптимизированы (меньше 50KB)');
    return;
  }
  
  console.log(`📊 Найдено ${largeFiles.length} больших файлов для оптимизации:\n`);
  largeFiles.slice(0, 5).forEach(f => {
    console.log(`   ${f.name.padEnd(50)} ${(f.size / 1024).toFixed(1).padStart(8)} KB`);
  });
  
  // Оптимизируем файлы
  console.log('\n🔧 Начинаю оптимизацию...');
  
  let totalSaved = 0;
  let filesOptimized = 0;
  
  largeFiles.forEach(file => {
    const result = optimizeHTMLFile(file.path);
    if (result.saved > 0) {
      totalSaved += result.saved;
      filesOptimized++;
    }
  });
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('✅ Оптимизация завершена!');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('📊 Результаты:');
  console.log(`   Оптимизировано файлов: ${filesOptimized}`);
  console.log(`   Общая экономия: ${(totalSaved / 1024).toFixed(1)} KB`);
  console.log('');
  
  console.log('📋 Следующие шаги:');
  console.log('   1. Создать скрипт для сборки компонентов (замена INCLUDE на реальное содержимое)');
  console.log('   2. Вынести inline стили в CSS');
  console.log('   3. Создать систему шаблонов для типовых секций');
  console.log('');
}

main();
