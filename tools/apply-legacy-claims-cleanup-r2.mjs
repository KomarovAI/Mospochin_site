#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  ROOT_DIR,
  hashContent,
  loadBuilderManifest,
  readSectionContent,
  renderPageFromModel,
  writeBuilderManifest,
  writeProjectFile
} from './site-builder-lib.mjs';

const configPath = path.join(ROOT_DIR, 'data', 'legacy-claims-cleanup-r2.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const targetPages = new Set([
  ...(config.parokonvektomatPages || []),
  ...(config.householdPages || []),
  ...(config.protectedCorePages || [])
]);
const manifest = loadBuilderManifest();
if (!manifest?.pages?.length) throw new Error('src/site-builder.json is missing or empty');

const householdLabels = {
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

function typicalSection(page) {
  const isPari = /parokonvektomat/.test(page);
  const labels = isPari
    ? ['Не нагревает или перегревает', 'Нет пара или не набирает воду', 'Ошибка на дисплее или цикл прерывается']
    : householdLabels[page] || ['Уточнить модель', 'Описать симптом', 'Прислать фото или код ошибки'];
  const heading = isPari
    ? 'Типовые обращения по пароконвектоматам'
    : (householdLabels[page] ? 'Типовые обращения по ремонту оборудования' : 'Как подготовить обращение');
  const intro = isPari
    ? 'Это примеры диагностических сценариев, а не отчёты о конкретных клиентах. Причину, сроки и состав работ определяем после проверки модели и оборудования.'
    : 'Это типовые ситуации, а не отзывы или отчёты о конкретных клиентах. Итоговый порядок работ определяем после уточнения модели и симптома.';
  const cards = labels.map((label, index) => `
        <article class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div class="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center font-extrabold mb-4">${index + 1}</div>
          <h3 class="text-lg font-display font-extrabold text-brand-blue mb-2">${label}</h3>
          <p class="text-slate-600">Инженер сверяет модель, условия возникновения симптома и доступ к узлам. Решение и стоимость согласовываются до начала работ.</p>
        </article>`).join('');
  return `<section class="py-12 lg:py-16 bg-slate-50" data-legacy-r2="typical-scenarios">
  <div class="container mx-auto px-4">
    <div class="max-w-3xl mx-auto text-center mb-10">
      <span class="inline-block bg-brand-orange/10 text-brand-orange px-4 py-2 rounded-full text-sm font-semibold mb-4">ДИАГНОСТИЧЕСКИЕ СЦЕНАРИИ</span>
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-brand-blue mb-4">${heading}</h2>
      <p class="text-slate-600 text-lg">${intro}</p>
    </div>
    <div class="grid md:grid-cols-3 gap-6">${cards}
    </div>
  </div>
</section>`;
}

const caseMarkers = [
  'реальные кейсы', 'свежие кейсы', 'реальные ремонты', 'реальные вызовы',
  'последние ремонты', 'свежие выезды', 'что говорят наши клиенты',
  'отзывы по ремонту', 'отзывы клиентов', 'клиенты говорят'
];

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

function normalizeCopy(input) {
  let text = String(input);
  const replacements = [
    [/Диагностика бесплатна при ремонте\.?/gi, 'Условия диагностики согласовываются до начала работ.'],
    [/Склад запчастей в Москве\.?/gi, 'Комплектующие подбираются по модели и серийному номеру.'],
    [/Запчасти с собой/gi, 'Подбор комплектующих'],
    [/Оригинальные запчасти/gi, 'Комплектующие по модели'],
    [/Используем только сертифицированные запчасти от производителей или качественные аналоги\.?/gi, 'Подбираем совместимые комплектующие по модели и согласовываем вариант до установки.'],
    [/Оригинальные запчасти от производителей или сертифицированные аналоги\.?/gi, 'Совместимые комплектующие подбираются по модели и согласовываются до установки.'],
    [/Опыт работы с каждым брендом\.?/gi, 'Совместимость и доступ к узлам уточняем по модели.'],
    [/Ремонтируем все марки/gi, 'Работаем с распространёнными марками'],
    [/Гарантия на всё\.?/gi, 'Условия гарантии фиксируются в документах.'],
    [/Гарантия до 2 лет/gi, 'Условия гарантии — по документам'],
    [/Гарантия до 24 месяцев/gi, 'Условия гарантии — по документам'],
    [/до 24 месяцев гарантии/gi, 'гарантия по согласованным документам'],
    [/706\+\s*ремонтов/gi, 'типовые обращения'],
    [/Отзывы клиентов с 2010 года/gi, 'Что важно при обращении'],
    [/Работаем с 2010 года/gi, 'Работаем по согласованному порядку'],
    [/Починим за\s*1\s*[-–]\s*3\s*часа(?:\s*на дому)?/gi, 'Согласуем сценарий ремонта после диагностики'],
    [/Восстановим кухню за\s*1\s*[-–]\s*3\s*часа/gi, 'Согласуем восстановление оборудования после диагностики'],
    [/Большинство ремонтов\s*[—-]\s*1\s*[-–]\s*3\s*часа на месте\.[^"<}]*/gi, 'Срок ремонта зависит от модели, доступности узла и результатов диагностики; его согласовываем до начала работ.'],
    [/Большинство\s*[—-]\s*1\s*[-–]\s*3\s*часа на месте\.?/gi, 'Срок ремонта зависит от результатов диагностики и согласовывается до начала работ.'],
    [/чиним при вас за\s*1\s*[-–]\s*3\s*часа/gi, 'приступаем после согласования состава работ'],
    [/Диагностика при ремонте\.?/gi, 'Условия диагностики согласовываются до начала работ.'],
    [/сертифицированные инженеры с допуском[^.<]*\.?/gi, 'Инженеры работают по модели и технической документации оборудования.'],
    [/\b(?:2 дня назад|5 дней назад|неделю назад)\b/gi, 'типовой сценарий'],
    [/\b(?:Алексей|Марина|Игорь|Анна|Дмитрий|Сергей)\s+[А-ЯЁ]\.\b/g, 'Типовое обращение'],
    [/\b(?:Арбат|Тверская|Хамовники|Бутово)\b/gi, 'Москва'],
    [/\b\d{1,2}\s+(?:января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s+2026\s*(?:года|г\.)?/gi, ''],
    [/\b\d+\s*[-–]\s*\d+\s*лет\b/gi, 'профильный опыт'],
    [/\bдо\s+\d+\s*(?:минут|минуты|часа|часов|дней)\b/gi, 'по согласованию после диагностики'],
    [/\b\d+\s*[-–]\s*\d+\s*(?:минут|минуты|часа|часов)\b/gi, 'по согласованию после диагностики'],
    [/\bот\s*\d[\d\s]*(?:\s*[-–]\s*\d[\d\s]*)?\s*₽/gi, 'по согласованию'],
    [/\b\d[\d\s]*\s*₽/g, 'по согласованию'],
    [/До 3 лет\s*\(гарантия\)\s*По согласованию\*/gi, 'Условия гарантии фиксируются в документах'],
    [/\b\d+\s*[-–]\s*\d+\s*летот\b/gi, 'профильный опыт'],
    [/12-по договору/gi, 'по договору'],
    [/Почему Рестораны выбрали нас/gi, 'Почему рестораны обращаются в сервис'],
    [/по результатам диагностики ремонтов/gi, 'по результатам диагностики'],
    [/до 50 км от МКАД/gi, 'по Москве и Московской области по согласованию'],
    [/в день обращения/gi, 'в согласованное время'],
    [/от по согласованию/gi, 'по согласованию'],
    [/\b\d[\d\s]*\s*[–-]\s*по согласованию/gi, 'по согласованию'],
    [/\b\d+\s*[-–]\s*\d+\s*мин\b/gi, 'по согласованию после диагностики'],
    [/\b\d+\s*[-–]\s*\d+\s*мес\b/gi, 'по документам'],
    [/\b60\s*мин\b/gi, 'по согласованию'],
    [/\b2\s*[-–]\s*4\s*часа\b/gi, 'по согласованию'],
    [/\bОригинал\b/gi, 'по модели'],
    [/\bКитай\b/gi, 'зависит от сервиса'],
    [/\bНе работают\b/gi, 'зависит от сервиса'],
    [/Описываем причины, симптомы и стоимость ремонта/gi, 'Описываем симптомы и порядок диагностики'],
    [/ПРАЙС-ЛИСТ/gi, 'СОСТАВ РАБОТ'],
    [/Цены на ремонт/gi, 'Как формируется стоимость ремонта'],
    [/покажем цену/gi, 'уточним сценарий'],
    [/\s{3,}/g, '  ']
  ];
  for (const [pattern, value] of replacements) text = text.replace(pattern, value);
  return text;
}

function filesForModel(modelPath, model) {
  const base = path.posix.dirname(modelPath);
  const files = new Set();
  for (const key of ['head', 'bodyOpen', 'afterBody']) {
    if (model.files?.[key]) files.add(path.posix.join(base, model.files[key]));
  }
  for (const section of model.sections || []) {
    if (section.componentRef) files.add(section.componentRef);
    else if (section.templateRef) files.add(section.templateRef);
    else if (section.file) files.add(path.posix.join(base, section.file));
    else if (section.sourceFile) files.add(path.posix.join(base, section.sourceFile));
  }
  return files;
}

const modelEntries = manifest.pages.map((entry) => {
  const model = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, entry.model), 'utf8'));
  return { entry, model, files: filesForModel(entry.model, model) };
});

const fileGroups = new Map();
for (const row of modelEntries) {
  if (!targetPages.has(row.entry.page)) continue;
  const group = /parokonvektomat/.test(row.entry.page) ? 'parokonvektomat' : 'household';
  for (const file of row.files) {
    if (!fileGroups.has(file)) fileGroups.set(file, new Set());
    fileGroups.get(file).add(`${group}:${row.entry.page}`);
  }
}

const changedFiles = new Set();
let replacedSections = 0;
let normalizedFiles = 0;

for (const [projectFile, groups] of fileGroups) {
  const abs = path.join(ROOT_DIR, projectFile);
  if (!fs.existsSync(abs) || !projectFile.endsWith('.html')) continue;
  const before = fs.readFileSync(abs, 'utf8');
  let after = before;
  const plain = stripTags(before).toLowerCase();
  const isSectionLike = /\/sections\//.test(projectFile) || /src\/components\/shared\//.test(projectFile);
  const marker = caseMarkers.find((item) => plain.includes(item));
  const isComparison = isSectionLike && plain.includes('почему нам доверяют') && plain.includes('другие');
  if (isComparison) {
    after = processSection();
    replacedSections += 1;
  } else if (isSectionLike && marker) {
    const pageHint = [...groups][0].split(':').slice(1).join(':');
    after = typicalSection(pageHint);
    replacedSections += 1;
  } else {
    after = normalizeCopy(after);
  }
  if (after !== before) {
    fs.writeFileSync(abs, after);
    changedFiles.add(projectFile);
    normalizedFiles += 1;
  }
}

const impacted = new Set();
for (const row of modelEntries) {
  if ([...row.files].some((file) => changedFiles.has(file))) impacted.add(row.entry.page);
}
for (const page of targetPages) impacted.add(page);

function upsertPageVersion(bodyOpen, version) {
  if (!/<body\b/i.test(bodyOpen)) return bodyOpen;
  if (/\sdata-page-version=["'][^"']*["']/i.test(bodyOpen)) {
    return bodyOpen.replace(/\sdata-page-version=["'][^"']*["']/i, ` data-page-version="${version}"`);
  }
  return bodyOpen.replace(/<body\b([^>]*)>/i, `<body$1 data-page-version="${version}">`);
}

const manifestMap = new Map(manifest.pages.map((entry) => [entry.page, entry]));
const metricsPath = path.join(ROOT_DIR, 'data', 'metrics-page-context.json');
const metrics = fs.existsSync(metricsPath) ? JSON.parse(fs.readFileSync(metricsPath, 'utf8')) : { pages: {} };

for (const page of [...impacted].sort()) {
  const entry = manifestMap.get(page);
  if (!entry) continue;
  const modelPath = path.join(ROOT_DIR, entry.model);
  const model = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
  const base = path.posix.dirname(entry.model);
  for (const section of model.sections || []) {
    const content = readSectionContent(entry.model, section);
    section.bytes = Buffer.byteLength(content);
    section.hash = hashContent(content).slice(0, 16);
  }
  const bodyOpenPath = path.join(ROOT_DIR, base, model.files.bodyOpen);
  let rendered = renderPageFromModel(entry.model).html;
  const version = crypto.createHash('sha256')
    .update(rendered.replace(/\sdata-page-version=["'][^"']*["']/gi, ''))
    .digest('hex')
    .slice(0, 16);
  const bodyOpen = fs.readFileSync(bodyOpenPath, 'utf8');
  const nextBodyOpen = upsertPageVersion(bodyOpen, version);
  if (nextBodyOpen !== bodyOpen) fs.writeFileSync(bodyOpenPath, nextBodyOpen);
  rendered = renderPageFromModel(entry.model).html;
  model.source = {
    ...(model.source || {}),
    extractedFrom: page,
    extractedAt: '1970-01-01T00:00:00.000Z',
    hash: hashContent(rendered),
    mode: 'lossless-section-snapshot'
  };
  fs.writeFileSync(modelPath, `${JSON.stringify(model, null, 2)}\n`);
  entry.sections = model.sections.length;
  entry.sourceHash = model.source.hash;
  writeProjectFile(page, rendered);
  writeProjectFile(`build/site-builder/${page}`, rendered);
  if (metrics.pages?.[page]) metrics.pages[page].page_version = version;
}

writeBuilderManifest(manifest.pages.map((entry) => manifestMap.get(entry.page) || entry));
if (metrics.pages) fs.writeFileSync(metricsPath, `${JSON.stringify(metrics, null, 2)}\n`);

const result = {
  release: config.release,
  targetPages: targetPages.size,
  changedSourceFiles: changedFiles.size,
  normalizedFiles,
  replacedSections,
  impactedPages: [...impacted].sort(),
  generatedAt: '2026-07-16T00:00:00.000Z'
};
fs.writeFileSync(path.join(ROOT_DIR, 'data', 'legacy-claims-cleanup-r2-result.json'), `${JSON.stringify(result, null, 2)}\n`);

console.log(`# Legacy Claims & Template Cleanup R2`);
console.log(`Target pages: ${targetPages.size}`);
console.log(`Changed source files: ${changedFiles.size}`);
console.log(`Replaced case/review sections: ${replacedSections}`);
console.log(`Impacted pages rebuilt: ${impacted.size}`);
