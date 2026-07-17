#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {
  ROOT_DIR,
  extractPageToModel,
  loadBuilderManifest,
  writeBuilderManifest
} from './site-builder-lib.mjs';

const config = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'legacy-claims-cleanup-r2.json'), 'utf8'));
const pages = [...new Set([
  ...(config.parokonvektomatPages || []),
  ...(config.householdPages || []),
  ...(config.protectedCorePages || [])
])];

const equipmentCases = {
  'holodilniki.html': ['Не держит температуру', 'Шумит или обмерзает', 'Течёт или показывает ошибку'],
  'stiralnye-mashiny.html': ['Не запускается', 'Не сливает или не отжимает', 'Шумит или течёт'],
  'posudomoyki.html': ['Не набирает или не сливает', 'Не греет или плохо моет', 'Показывает ошибку или течёт'],
  'plity.html': ['Не нагревает', 'Выбивает автомат', 'Не работает управление'],
  'microwaves.html': ['Не включается', 'Не греет', 'Искрит или шумит'],
  'water-heaters.html': ['Не греет воду', 'Течёт', 'Выбивает автомат'],
  'kompyutery.html': ['Не включается', 'Перегревается или шумит', 'Не загружается система'],
  'routery.html': ['Нет подключения', 'Периодически пропадает сеть', 'Не включается или перегревается']
};

function stripTags(value) {
  return String(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findSectionSpans(html) {
  const token = /<section\b[^>]*>|<\/section\s*>/gi;
  const stack = [];
  const spans = [];
  let match;
  while ((match = token.exec(html))) {
    if (/^<section\b/i.test(match[0])) stack.push(match.index);
    else if (stack.length) {
      const start = stack.pop();
      spans.push({ start, end: token.lastIndex, html: html.slice(start, token.lastIndex) });
    }
  }
  return spans.sort((a, b) => a.start - b.start);
}

function typicalSection(page) {
  const pari = /parokonvektomat/.test(page);
  const labels = pari
    ? ['Не нагревает или перегревает', 'Нет пара или не набирает воду', 'Ошибка на дисплее или цикл прерывается']
    : equipmentCases[page] || ['Уточнить модель', 'Описать симптом', 'Прислать фото или код ошибки'];
  const heading = pari
    ? 'Типовые обращения по пароконвектоматам'
    : (equipmentCases[page] ? 'Типовые обращения по ремонту оборудования' : 'Как подготовить обращение');
  return `<section class="py-12 lg:py-16 bg-slate-50" data-legacy-r2="typical-scenarios">
  <div class="container mx-auto px-4">
    <div class="max-w-3xl mx-auto text-center mb-10">
      <span class="inline-block bg-brand-orange/10 text-brand-orange px-4 py-2 rounded-full text-sm font-semibold mb-4">ДИАГНОСТИЧЕСКИЕ СЦЕНАРИИ</span>
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-brand-blue mb-4">${heading}</h2>
      <p class="text-slate-600 text-lg">Это типовые ситуации, а не отзывы или отчёты о конкретных клиентах. Итоговый порядок работ определяем после уточнения модели и симптома.</p>
    </div>
    <div class="grid md:grid-cols-3 gap-6">
      ${labels.map((label, index) => `<article class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"><div class="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center font-extrabold mb-4">${index + 1}</div><h3 class="text-lg font-display font-extrabold text-brand-blue mb-2">${label}</h3><p class="text-slate-600">Инженер сверяет модель, условия возникновения симптома и доступ к узлам. Решение и стоимость согласовываются до начала работ.</p></article>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function processSection() {
  return `<section class="py-12 lg:py-16 bg-white" data-legacy-r2="service-process">
  <div class="container mx-auto px-4">
    <div class="max-w-3xl mx-auto text-center mb-10">
      <span class="inline-block bg-brand-orange/10 text-brand-orange px-4 py-2 rounded-full text-sm font-semibold mb-4">ПОРЯДОК РАБОТЫ</span>
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-brand-blue mb-4">Как согласовываем ремонт</h2>
      <p class="text-slate-600 text-lg">Сначала уточняем модель и симптом, затем проводим диагностику и до начала ремонта согласовываем состав работ, комплектующие, стоимость и сроки.</p>
    </div>
    <div class="grid md:grid-cols-3 gap-6">
      <article class="bg-slate-50 rounded-2xl border border-slate-200 p-6"><h3 class="font-display font-extrabold text-brand-blue mb-2">1. Уточнение</h3><p class="text-slate-600">Запрашиваем модель, серийный номер, код ошибки и условия возникновения неисправности.</p></article>
      <article class="bg-slate-50 rounded-2xl border border-slate-200 p-6"><h3 class="font-display font-extrabold text-brand-blue mb-2">2. Диагностика</h3><p class="text-slate-600">Проверяем питание, автоматику, исполнительные узлы и доступ к оборудованию.</p></article>
      <article class="bg-slate-50 rounded-2xl border border-slate-200 p-6"><h3 class="font-display font-extrabold text-brand-blue mb-2">3. Согласование</h3><p class="text-slate-600">Фиксируем понятный состав работ и приступаем только после согласования.</p></article>
    </div>
  </div>
</section>`;
}

const sectionMarkers = [
  'реальные кейсы', 'свежие кейсы', 'реальные ремонты', 'реальные вызовы',
  'последние ремонты', 'свежие выезды', 'что говорят наши клиенты',
  'отзывы по ремонту', 'отзывы клиентов', 'клиенты говорят'
];

function costSection() {
  return `<section id="prices" class="py-12 lg:py-16 bg-white" data-legacy-r2="cost-formation">
  <div class="container mx-auto px-4">
    <div class="max-w-3xl mx-auto text-center mb-10">
      <span class="inline-block bg-brand-blue/10 text-brand-blue px-4 py-2 rounded-full text-sm font-semibold mb-4">СТОИМОСТЬ И СРОКИ</span>
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-brand-blue mb-4">Как формируются стоимость и срок ремонта</h2>
      <p class="text-slate-600 text-lg">До диагностики нельзя достоверно определить нужный узел и объём работ. Инженер проверяет оборудование, после чего согласовывает стоимость, комплектующие и срок до начала ремонта.</p>
    </div>
    <div class="grid md:grid-cols-3 gap-6">
      <article class="rounded-2xl border border-slate-200 bg-slate-50 p-6"><h3 class="font-display font-extrabold text-brand-blue mb-2">Модель и доступ</h3><p class="text-slate-600">На стоимость влияют серия оборудования, компоновка и доступ к узлам.</p></article>
      <article class="rounded-2xl border border-slate-200 bg-slate-50 p-6"><h3 class="font-display font-extrabold text-brand-blue mb-2">Результат диагностики</h3><p class="text-slate-600">Проверяем фактическую причину, а не назначаем замену по одному симптому.</p></article>
      <article class="rounded-2xl border border-slate-200 bg-slate-50 p-6"><h3 class="font-display font-extrabold text-brand-blue mb-2">Согласование</h3><p class="text-slate-600">Работы начинаются после подтверждения состава, стоимости и сроков.</p></article>
    </div>
  </div>
</section>`;
}

function replaceRiskySections(html, page) {
  const spans = findSectionSpans(html);
  const replacements = [];
  for (const span of spans) {
    const plain = stripTags(span.html).toLowerCase();
    const isCost = plain.includes('прайс-лист') || plain.includes('цены на ремонт') || plain.includes('сколько обычно стоит') || plain.includes('экономика ремонта') || (plain.includes('услуга') && plain.includes('цена') && plain.includes('диагностика'));
    const isRevenueClaim = /\d+[–-]\d+\s*тысяч/.test(plain) || plain.includes('потеря выручки') || plain.includes('потеря смены');
    if (sectionMarkers.some((marker) => plain.includes(marker))) {
      replacements.push({ ...span, replacement: typicalSection(page) });
    } else if (isCost) {
      replacements.push({ ...span, replacement: costSection() });
    } else if (plain.includes('почему нам доверяют') && plain.includes('другие')) {
      replacements.push({ ...span, replacement: processSection() });
    } else if (isRevenueClaim) {
      replacements.push({ ...span, replacement: processSection() });
    }
  }
  for (const item of replacements.sort((a, b) => b.start - a.start)) {
    html = html.slice(0, item.start) + item.replacement + html.slice(item.end);
  }
  return html;
}

function normalize(html) {
  const rules = [
    [/Диагностика бесплатна при ремонте\.?/gi, 'Условия диагностики согласовываются до начала работ.'],
    [/Диагностика при ремонте\.?/gi, 'Условия диагностики согласовываются до начала работ.'],
    [/по смете\*/gi, 'по согласованию'],
    [/Склад запчастей в Москве\.?/gi, 'Комплектующие подбираются по модели и серийному номеру.'],
    [/Запчасти с собой/gi, 'Подбор комплектующих'],
    [/Оригинальные запчасти/gi, 'Комплектующие по модели'],
    [/Используем только сертифицированные запчасти от производителей или качественные аналоги\.?/gi, 'Подбираем совместимые комплектующие по модели и согласовываем вариант до установки.'],
    [/Оригинальные запчасти от производителей или сертифицированные аналоги\.?/gi, 'Совместимые комплектующие подбираются по модели и согласовываются до установки.'],
    [/Опыт работы с каждым брендом\.?/gi, 'Совместимость и доступ к узлам уточняем по модели.'],
    [/Ремонтируем все марки/gi, 'Работаем с распространёнными марками'],
    [/Гарантия на всё\.?/gi, 'Условия гарантии фиксируются в документах.'],
    [/Гарантия до (?:2 лет|24 месяцев)/gi, 'Условия гарантии — по документам'],
    [/до 24 месяцев гарантии/gi, 'гарантия по согласованным документам'],
    [/До 3 лет\s*\(гарантия\)/gi, 'Условия гарантии'],
    [/\b(?:3\s*[-–]\s*6|6)\s*мес\.?\b/gi, 'по документам'],
    [/706\+\s*ремонтов/gi, 'типовые обращения'],
    [/Отзывы клиентов с 2010 года/gi, 'Что важно при обращении'],
    [/Работаем с 2010 года/gi, 'Работаем по согласованному порядку'],
    [/Починим за\s*1\s*[-–]\s*3\s*часа(?:\s*на дому)?/gi, 'Согласуем сценарий ремонта после диагностики'],
    [/Восстановим кухню за\s*1\s*[-–]\s*3\s*часа/gi, 'Согласуем восстановление оборудования после диагностики'],
    [/Большинство ремонтов\s*[—-]\s*1\s*[-–]\s*3\s*часа на месте\.[^"<}]*/gi, 'Срок ремонта зависит от модели, доступности узла и результатов диагностики; его согласовываем до начала работ.'],
    [/Большинство\s*[—-]\s*1\s*[-–]\s*3\s*часа на месте\.?/gi, 'Срок ремонта зависит от результатов диагностики и согласовывается до начала работ.'],
    [/По типовой заявке это около\s*\d+(?:[.,]\d+)?\s*[-–]\s*\d+(?:[.,]\d+)?\s*час(?:а|ов)\.?/gi, 'Срок зависит от результатов диагностики и согласовывается до начала работ.'],
    [/чиним при вас за\s*1\s*[-–]\s*3\s*часа/gi, 'приступаем после согласования состава работ'],
    [/сертифицированные инженеры с допуском[^.<]*\.?/gi, 'Инженеры работают по модели и технической документации оборудования.'],
    [/Инженеры с допуском к Rational, Unox, Electrolux\.?/gi, 'Инженеры работают по модели и технической документации оборудования.'],
    [/<h3([^>]*)>Сертифицированные<\/h3>/gi, '<h3$1>Профильная диагностика</h3>'],
    [/\b(?:2 дня назад|5 дней назад|неделю назад)\b/gi, 'типовой сценарий'],
    [/\b(?:Алексей|Марина|Игорь|Анна|Дмитрий|Сергей)\s+[А-ЯЁ]\.\b/g, 'Типовое обращение'],
    [/\b(?:Арбат|Тверская|Хамовники|Бутово)\b/gi, 'Москва'],
    [/\b\d{1,2}\s+(?:января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s+2026\s*(?:года|г\.)?/gi, ''],
    [/\b\d+(?:[.,]\d+)?\s*[-–]\s*\d+(?:[.,]\d+)?\s*лет\b/gi, 'профильный опыт'],
    [/\bдо\s+\d+(?:[.,]\d+)?\s*(?:минут|минуты|мин|часа|часов|дней)\b/gi, 'по согласованию после диагностики'],
    [/\b\d+(?:[.,]\d+)?\s*[-–]\s*\d+(?:[.,]\d+)?\s*(?:минут|минуты|мин|часа|часов)\b/gi, 'по согласованию после диагностики'],
    [/\b\d+\s*мин\b/gi, 'по согласованию после диагностики'],
    [/\bот\s*\d[\d\s.,]*(?:\s*[-–]\s*\d[\d\s.,]*)?\s*₽/gi, 'по согласованию'],
    [/\b\d[\d\s.,]*\s*₽/g, 'по согласованию'],
    [/\bот\s+по согласованию\b/gi, 'по согласованию'],
    [/\b\d[\d\s.,]*\s*[–-]\s*по согласованию\b/gi, 'по согласованию'],
    [/До 3 лет\s*\(гарантия\)\s*По согласованию\*/gi, 'Условия гарантии фиксируются в документах'],
    [/\b\d+\s*[-–]\s*\d+\s*летот\b/gi, 'профильный опыт'],
    [/12-по договору/gi, 'по договору'],
    [/Почему Рестораны выбрали нас/gi, 'Почему рестораны обращаются в сервис'],
    [/по результатам диагностики ремонтов/gi, 'по результатам диагностики'],
    [/до 50 км от МКАД/gi, 'по Москве и Московской области по согласованию'],
    [/в день обращения/gi, 'в согласованное время'],
    [/Фиксированная стоимость/gi, 'Согласованная стоимость'],
    [/Фиксированная цена/gi, 'Согласованная стоимость'],
    [/Без наценок\.?/gi, 'Без работ без согласования.'],
    [/Описываем причины, симптомы и стоимость ремонта/gi, 'Описываем симптомы и порядок диагностики'],
    [/ПРАЙС-ЛИСТ/gi, 'СОСТАВ РАБОТ'],
    [/Цены на ремонт/gi, 'Как формируется стоимость ремонта'],
    [/покажем цену/gi, 'уточним сценарий'],
    [/\bОригинал\b/gi, 'по модели'],
    [/\bКитай\b/gi, 'зависит от сервиса'],
    [/\bНе работают\b/gi, 'зависит от сервиса'],
    [/\d+(?:[.,]\d+)?\s*[-–]\s*\d+(?:[.,]\d+)?\s*(?:минут|минуты|мин|часа|часов)/gi, 'по согласованию после диагностики'],
    [/\d+\s*мин/gi, 'по согласованию после диагностики'],
    [/\d+(?:[.,]\d+)?\s*[-–]\s*\d+(?:[.,]\d+)?\s*мес\.?/gi, 'по документам'],
    [/\d+\s*мес\.?/gi, 'по документам'],
    [/от\s*\d[\d\s.,]*(?:\s*[-–]\s*\d[\d\s.,]*)?\s*₽/gi, 'по согласованию'],
    [/\d[\d\s.,]*\s*₽/g, 'по согласованию'],
    [/от\s*\d+,?\s*по согласованию/gi, 'по согласованию'],
    [/\d+[\d\s.,]*[–-]по согласованию/gi, 'по согласованию'],
    [/по согласованию[+*]/gi, 'по согласованию'],
    [/Только сертифицированные комплектации[^.<]*\.?/gi, 'Комплектующие подбираются по модели и согласовываются до установки.'],
    [/требует инженера с опытом и оригинальных запчастей/gi, 'требует диагностики по модели и технической документации'],
    [/ТЭНы, платы и датчики[^.<]*\.?/gi, 'Комплектующие подбираются по модели, серийному номеру и результатам диагностики.'],
    [/Без китайских аналогов/gi, 'Вариант согласовывается до установки'],
    [/ремонт на месте,\s*в согласованное время/gi, 'ремонт после диагностики и согласования'],
    [/\s{3,}/g, '  ']
  ];
  for (const [pattern, replacement] of rules) html = html.replace(pattern, replacement);
  return html;
}

let changed = 0;
for (const page of pages) {
  const file = path.join(ROOT_DIR, page);
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, 'utf8');
  let after = replaceRiskySections(before, page);
  after = normalize(after);
  if (after !== before) {
    fs.writeFileSync(file, after);
    changed += 1;
  }
}

const oldManifest = loadBuilderManifest();
const oldMap = new Map(oldManifest.pages.map((entry) => [entry.page, entry]));
for (const page of pages) {
  if (!fs.existsSync(path.join(ROOT_DIR, page))) continue;
  const entry = extractPageToModel(page);
  oldMap.set(page, {
    page: entry.page,
    slug: entry.slug,
    model: entry.model,
    sections: entry.sections,
    sourceHash: entry.hash
  });
}
writeBuilderManifest(oldManifest.pages.map((entry) => oldMap.get(entry.page) || entry));

console.log(`# Finalize Legacy Claims R2`);
console.log(`Root pages changed: ${changed}`);
console.log(`Source models synchronized: ${pages.length}`);
