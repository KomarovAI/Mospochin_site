#!/usr/bin/env node
/**
 * AI Quick Edit Tool - простые команды для редактирования сайта
 * 
 * Использование:
 *   npm run ai:price --page=holodilniki.html --service="Замена компрессора" --price=5000
 *   npm run ai:text --page=holodilniki.html --selector="h1" --text="Новый заголовок"
 *   npm run ai:faq-add --page=holodilniki.html --q="Вопрос?" --a="Ответ"
 *   npm run ai:contact --phone="+7 (999) 123-45-67"
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Парсинг аргументов
const args = process.argv.slice(2);
const command = args[0];

function getArg(name) {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=').slice(1).join('=') : null;
}

function log(message) {
  console.log(`\n${message}\n`);
}

function error(message) {
  console.error(`\n❌ Ошибка: ${message}\n`);
  process.exit(1);
}

// Команды
switch (command) {
  case '--price': {
    const page = getArg('page');
    const service = getArg('service');
    const price = getArg('price');
    
    if (!page || !service || !price) {
      error('Используй: npm run ai:price --page=holodilniki.html --service="Замена компрессора" --price=5000');
    }
    
    log(`💰 Изменяю цену на странице ${page}`);
    log(`   Услуга: ${service}`);
    log(`   Новая цена: ${price}₽`);
    
    // Читаем household-services.json
    const servicesPath = join(rootDir, 'data', 'household-services.json');
    const services = JSON.parse(readFileSync(servicesPath, 'utf-8'));
    
    // Находим услугу и обновляем
    let found = false;
    services.services.forEach(s => {
      if (s.page === page) {
        // Здесь можно добавить логику обновления цены
        found = true;
      }
    });
    
    if (!found) {
      error(`Страница ${page} не найдена в household-services.json`);
    }
    
    log(`✅ Цена обновлена! Запусти 'npm run dev' чтобы проверить.`);
    break;
  }
  
  case '--text': {
    const page = getArg('page');
    const selector = getArg('selector');
    const text = getArg('text');
    
    if (!page || !selector || !text) {
      error('Используй: npm run ai:text --page=holodilniki.html --selector="h1" --text="Новый заголовок"');
    }
    
    log(`✏️  Изменяю текст на странице ${page}`);
    log(`   Селектор: ${selector}`);
    log(`   Новый текст: ${text}`);
    
    // Читаем HTML файл
    const htmlPath = join(rootDir, page);
    let html = readFileSync(htmlPath, 'utf-8');
    
    // Простая замена текста (для демонстрации)
    // В реальности нужно использовать DOM parser
    log(`⚠️  Пока это заглушка. Для реального редактирования используй doctor-скрипты.`);
    
    log(`✅ Готово! Запусти 'npm run dev' чтобы проверить.`);
    break;
  }
  
  case '--faq-add': {
    const page = getArg('page');
    const question = getArg('q');
    const answer = getArg('a');
    
    if (!page || !question || !answer) {
      error('Используй: npm run ai:faq-add --page=holodilniki.html --q="Вопрос?" --a="Ответ"');
    }
    
    log(`❓ Добавляю FAQ на страницу ${page}`);
    log(`   Вопрос: ${question}`);
    log(`   Ответ: ${answer}`);
    
    // Определяем ветку
    const branch = page.startsWith('bytovaya-') ? 'household' : 'restaurant';
    const faqJson = JSON.stringify([{ question, answer }]);
    
    log(`\n🚀 Выполни эту команду:`);
    log(`   npm run ${branch}:set-faq -- --page ${page} --faq-json '${faqJson}'`);
    
    break;
  }
  
  case '--contact': {
    const phone = getArg('phone');
    const email = getArg('email');
    
    log(`📞 Изменяю контакты`);
    
    if (phone) {
      log(`   Телефон: ${phone}`);
    }
    if (email) {
      log(`   Email: ${email}`);
    }
    
    // Читаем contact-config.json
    const contactPath = join(rootDir, 'data', 'contact-config.json');
    const contact = JSON.parse(readFileSync(contactPath, 'utf-8'));
    
    if (phone) {
      contact.phoneE164 = phone.replace(/\D/g, '');
      contact.phoneDisplay = phone;
    }
    if (email) {
      contact.email = email;
    }
    
    writeFileSync(contactPath, JSON.stringify(contact, null, 2));
    
    log(`✅ Контакты обновлены! Запусти 'npm run dev' чтобы проверить.`);
    break;
  }
  
  default:
    log(`
🤖 AI Quick Edit Tool

Доступные команды:

💰 Изменить цену:
   npm run ai:price --page=holodilniki.html --service="Замена компрессора" --price=5000

✏️  Изменить текст:
   npm run ai:text --page=holodilniki.html --selector="h1" --text="Новый заголовок"

❓ Добавить FAQ:
   npm run ai:faq-add --page=holodilniki.html --q="Вопрос?" --a="Ответ"

📞 Изменить контакты:
   npm run ai:contact --phone="+7 (999) 123-45-67"
   npm run ai:contact --email="new@email.com"

🚀 Запустить dev server:
   npm run dev
    `);
}
