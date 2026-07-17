#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const config = JSON.parse(fs.readFileSync(path.join(root, 'data', 'legacy-claims-cleanup-r2.json'), 'utf8'));
const pages = [...new Set([
  ...(config.parokonvektomatPages || []),
  ...(config.householdPages || []),
  ...(config.protectedCorePages || [])
])];
const forbidden = [
  ...(config.bannedPatterns || []),
  '15 сертифицированных инженеров', '+12 мастеров', 'ответ за 30 секунд',
  'оригинальные запчасти и сертификаты на все бренды', 'работаем со всеми производителями',
  'скидки 15-30%', 'до 50 км от МКАД', 'в день обращения'
];
const regexes = [
  /\bот\s*\d[\d\s]*(?:\s*[-–]\s*\d[\d\s]*)?\s*₽/i,
  /\b\d[\d\s]*\s*₽/,
  /\b(?:2 дня назад|5 дней назад|неделю назад)\b/i,
  /\d+(?:[.,]\d+)?\s*[-–]\s*\d+(?:[.,]\d+)?\s*(?:минут|минуты|мин|часа|часов)/i,
  /\b(?:Алексей|Марина|Игорь|Анна|Дмитрий|Сергей)\s+[А-ЯЁ]\./,
  /\b\d{1,2}\s+(?:января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s+2026/i,
  /летот|12-по договору|по результатам диагностики ремонтов|от\s*\d+,?\s*по согласованию|\d+[\d\s.,]*[–-]по согласованию|по согласованию[+*]/i
];
let errors = 0;
for (const page of pages) {
  const file = path.join(root, page);
  if (!fs.existsSync(file)) {
    console.error(`❌ ${page}: missing`);
    errors += 1;
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  for (const phrase of forbidden) {
    if (html.toLowerCase().includes(String(phrase).toLowerCase())) {
      console.error(`❌ ${page}: forbidden phrase: ${phrase}`);
      errors += 1;
    }
  }
  for (const regex of regexes) {
    if (regex.test(html)) {
      console.error(`❌ ${page}: forbidden pattern: ${regex}`);
      errors += 1;
    }
  }
}
if (errors) {
  console.error(`\nLegacy R2: ${errors} issue(s)`);
  process.exit(1);
}
console.log(`✅ Legacy R2: ${pages.length} pages, no stale claims/case markers/fixed prices`);
