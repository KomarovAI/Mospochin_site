#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const writeJson = (p, v) => fs.writeFileSync(path.join(root, p), `${JSON.stringify(v, null, 2)}\n`);
const pages = [
  {
    file: 'remont-promyshlennyh-posudomoechnyh-mashin-moskva.html',
    title: 'Ремонт промышленных посудомоечных машин в Москве | MosPochin',
    description: 'Срочная диагностика профессиональных посудомоечных машин в Москве: фронтальные, купольные, конвейерные и стаканомоечные модели. Передайте шильдик и симптом.',
    ogDescription: 'Заявка на диагностику промышленной посудомоечной машины: тип, модель, этап цикла и симптом.',
    h1Html: 'Срочный ремонт промышленной <span class="text-brand-orange">посудомоечной машины</span>',
    lead: 'Машина не запускается, не набирает или не сливает воду, не греет либо плохо моет.',
    leadStrong: 'Передайте тип, модель и этап цикла — согласуем диагностику без универсальных предположений.',
    quickFormTitle: 'Заявка по посудомоечной машине',
    hiddenProblem: 'Ремонт промышленной посудомоечной машины / заявка из рекламы',
    typePlaceholder: 'Тип и модель машины',
    problemPlaceholder: 'Этап цикла, код и описание симптома',
    heroSubmitLabel: 'Передать данные инженеру',
    mainSubmitLabel: 'Запросить диагностику',
    mobilePhoneLabel: 'Позвонить',
    mobileWhatsappLabel: 'Отправить шильдик',
    whatsappText: 'Здравствуйте! Нужен ремонт промышленной посудомоечной машины. Отправлю тип, модель, фото шильдика, код и описание симптома.',
    analysisTitle: 'Что подготовить перед выездом',
    analysisIntro: 'Тип машины, шильдик и точный этап сбоя позволяют отделить подачу воды, нагрев, циркуляцию, слив, дозирование и управление.',
    analysisCards: [
      { title: 'Тип и модель', text: 'Фронтальная, купольная, конвейерная или стаканомоечная машина; фото шильдика.' },
      { title: 'Этап цикла', text: 'Включение, наполнение, нагрев, мойка, ополаскивание или слив.' },
      { title: 'Симптом и код', text: 'Фото панели, код ошибки, наличие воды в баке и безопасное видео поведения.' },
    ],
    faqs: [
      ['Какие машины принимаете в диагностику?', 'Фронтальные, купольные, стаканомоечные, конвейерные и котломоечные модели после подтверждения типа и шильдика.'],
      ['Можно ли продолжать работу при протечке или запахе гари?', 'Нет. Отключите питание и воду, не выполняйте повторные запуски до диагностики.'],
      ['Зачем указывать этап цикла?', 'Одинаковое внешнее проявление может относиться к наполнению, нагреву, циркуляции, ополаскиванию или сливу.'],
      ['Можно ли назвать цену по телефону?', 'Предварительно можно определить состав проверки; итоговая стоимость согласуется после диагностики конкретной машины.'],
    ],
    directAdIds: ['dishwasher-general-repair-moscow-20260715'],
    campaignId: 'dishwasher_repair_moscow',
    adGroupId: 'general_repair',
    targetKeywords: ['ремонт промышленных посудомоечных машин москва', 'ремонт ресторанной посудомоечной машины', 'мастер по промышленным посудомойкам'],
    relatedLinks: [
      { href: 'posudomoechnye-mashiny.html', label: 'Ремонт посудомоечных машин', description: 'Основной сервисный хаб оборудования.' },
      { href: 'diagnostika-promyshlennoy-posudomoechnoy-mashiny.html', label: 'Диагностика', description: 'Проверка цикла, воды, нагрева, насосов и управления.' },
      { href: 'obsluzhivanie-promyshlennyh-posudomoechnyh-mashin.html', label: 'Обслуживание', description: 'Регламентная очистка и контроль рабочих узлов.' },
      { href: 'posudomoechnaya-mashina-ne-slivaet-vodu.html', label: 'Не сливает воду', description: 'Дренаж, перелив, фильтры и насос.' },
      { href: 'posudomoechnaya-mashina-ne-greet-vodu.html', label: 'Не греет воду', description: 'Бак, бойлер, ТЭНы, датчики и управление.' },
      { href: 'kody-oshibok-promyshlennyh-posudomoechnyh-mashin.html', label: 'Коды ошибок', description: 'Только model-scoped значения из официальных руководств.' },
    ],
    brand: '',
    eyebrow: 'Заявка на выезд инженера',
  },
  {
    file: 'posudomoechnaya-mashina-ne-slivaet-remont-moskva.html',
    title: 'Промышленная посудомоечная машина не сливает — ремонт в Москве | MosPochin',
    description: 'Профессиональная посудомоечная машина не сливает воду или завершает цикл с водой в баке. Передайте модель, уровень воды, код и фото дренажной зоны.',
    ogDescription: 'Заявка по отсутствию слива: фильтры, перелив, шланг, насос, уровень и управление.',
    h1Html: 'Посудомоечная машина не сливает — <span class="text-brand-orange">диагностика в Москве</span>',
    lead: 'После цикла в баке остаётся вода, слив идёт медленно или появляется ошибка дренажа.',
    leadStrong: 'Не запускайте повторные циклы при переполнении или протечке.',
    quickFormTitle: 'Заявка: машина не сливает',
    hiddenProblem: 'Промышленная посудомоечная машина не сливает / заявка из рекламы',
    typePlaceholder: 'Тип, бренд и модель машины',
    problemPlaceholder: 'Уровень воды, код, звук насоса и момент остановки',
    heroSubmitLabel: 'Передать симптом инженеру',
    mainSubmitLabel: 'Запросить проверку слива',
    mobilePhoneLabel: 'Позвонить',
    mobileWhatsappLabel: 'Отправить видео',
    whatsappText: 'Здравствуйте! Промышленная посудомоечная машина не сливает воду. Отправлю модель, фото уровня воды, код и безопасное видео.',
    analysisTitle: 'Что важно по отсутствию слива',
    analysisIntro: 'Нужно разделить внешнее засорение, переливную систему, сливной тракт, насос, датчик уровня и управляющий сигнал.',
    analysisCards: [
      { title: 'Вода в баке', text: 'Фактический уровень, наличие перелива и момент, когда цикл остановился.' },
      { title: 'Сливной тракт', text: 'Внешний шланг без разборки, доступный фильтр и состояние канализации.' },
      { title: 'Панель и звук', text: 'Код ошибки, слышен ли насос и срабатывает ли защита от переполнения.' },
    ],
    faqs: [
      ['Можно ли прочистить машину химией?', 'Не используйте случайные средства. Они могут вызвать пену, повредить материалы и не устранят неисправность насоса или контроля уровня.'],
      ['Почему насос слышно, но вода не уходит?', 'Возможны блокировка крыльчатки, пережатый тракт, обратный подпор, переливная трубка или недостаточная производительность насоса.'],
      ['Что делать при росте уровня воды?', 'Остановите цикл, отключите питание и перекройте подачу воды, если это безопасно и предусмотрено объектом.'],
      ['Код дренажа одинаков у всех брендов?', 'Нет. Значение кода проверяется только по точной серии и официальному руководству.'],
    ],
    directAdIds: ['dishwasher-no-drain-moscow-20260715'],
    campaignId: 'dishwasher_no_drain_moscow',
    adGroupId: 'no_drain',
    targetKeywords: ['промышленная посудомойка не сливает ремонт', 'посудомоечная машина вода в баке москва', 'ремонт сливного насоса промышленной посудомойки'],
    relatedLinks: [
      { href: 'posudomoechnaya-mashina-ne-slivaet-vodu.html', label: 'Почему машина не сливает', description: 'Полная диагностическая матрица дренажного контура.' },
      { href: 'diagnostika-promyshlennoy-posudomoechnoy-mashiny.html', label: 'Диагностика машины', description: 'Проверка этапов цикла и управляющих сигналов.' },
      { href: 'posudomoechnaya-mashina-postoyanno-nabiraet-vodu.html', label: 'Постоянно набирает воду', description: 'Впуск, уровень и риск переполнения.' },
      { href: 'promyshlennaya-posudomoechnaya-mashina-techet.html', label: 'Машина течёт', description: 'Поиск источника воды и условия отключения.' },
      { href: 'kody-oshibok-promyshlennyh-posudomoechnyh-mashin.html', label: 'Коды ошибок', description: 'Model-scoped таблицы по официальным документам.' },
      { href: 'posudomoechnye-mashiny.html', label: 'Весь кластер', description: 'Типы машин, обслуживание и другие неисправности.' },
    ],
    brand: '',
    eyebrow: 'Срочная заявка по дренажу',
  },
  {
    file: 'remont-posudomoechnoy-mashiny-winterhalter-moskva.html',
    title: 'Ремонт посудомоечных машин Winterhalter в Москве — заявка | MosPochin',
    description: 'Независимая диагностика посудомоечных машин Winterhalter серий UC, PT и CTR/C50. Передайте точную модель, серийный номер, код и этап цикла.',
    ogDescription: 'Заявка по Winterhalter: серия, модель, серийный номер, код и симптом без переноса данных между линейками.',
    h1Html: 'Ремонт посудомоечной машины <span class="whitespace-nowrap text-brand-orange">Winterhalter</span>',
    lead: 'Серии UC, PT и CTR/C50 различаются компоновкой, производительностью и сервисной документацией.',
    leadStrong: 'Передайте модель и серийный номер — диагностика будет привязана к конкретной машине.',
    quickFormTitle: 'Заявка по Winterhalter',
    hiddenProblem: 'Ремонт посудомоечной машины Winterhalter / заявка из рекламы',
    typePlaceholder: 'Серия и модель Winterhalter',
    problemPlaceholder: 'Код, этап цикла и описание симптома',
    heroSubmitLabel: 'Согласовать диагностику Winterhalter',
    mainSubmitLabel: 'Отправить данные инженеру',
    mobilePhoneLabel: 'Позвонить',
    mobileWhatsappLabel: 'Отправить шильдик',
    whatsappText: 'Здравствуйте! Нужен ремонт посудомоечной машины Winterhalter. Отправлю серию, модель, серийный номер, фото панели и описание симптома.',
    analysisTitle: 'Что подготовить по Winterhalter',
    analysisIntro: 'Для UC, PT и конвейерных серий требуются разные схемы и процедуры; главный идентификатор — шильдик конкретной машины.',
    analysisCards: [
      { title: 'Серия и номер', text: 'Фото шильдика с моделью, серийным номером и электрическим исполнением.' },
      { title: 'Панель', text: 'Фото кода, индикации температур и состояния программы.' },
      { title: 'Этап и симптом', text: 'Наполнение, нагрев, мойка, ополаскивание, слив либо транспорт кассеты.' },
    ],
    faqs: [
      ['Какие серии Winterhalter рассматриваются?', 'В registry подтверждены подстольные UC/U50, купольные PT и конвейерные CTR/C50; точная применимость определяется по модели.'],
      ['Можно ли расшифровать код без модели?', 'Нет. Коды и процедуры нельзя переносить между сериями без официального руководства для конкретного исполнения.'],
      ['Почему нужен серийный номер?', 'Он помогает определить ревизию, электрическое исполнение и подходящую техническую документацию.'],
      ['Вы авторизованный сервис Winterhalter?', 'Нет. Страница описывает независимую диагностику MosPochin и не заявляет статус авторизованного сервисного центра производителя.'],
    ],
    directAdIds: ['dishwasher-winterhalter-moscow-20260715'],
    campaignId: 'dishwasher_winterhalter_moscow',
    adGroupId: 'brand_winterhalter',
    targetKeywords: ['ремонт winterhalter москва', 'ремонт посудомоечной машины winterhalter', 'winterhalter сервис диагностика'],
    relatedLinks: [
      { href: 'remont-posudomoechnyh-mashin-winterhalter.html', label: 'Ремонт Winterhalter', description: 'Полная брендовая страница по подтверждённым сериям.' },
      { href: 'kody-oshibok-promyshlennyh-posudomoechnyh-mashin.html', label: 'Коды ошибок', description: 'Правила model-scoped расшифровки без универсализации.' },
      { href: 'posudomoechnaya-mashina-ne-slivaet-vodu.html', label: 'Не сливает воду', description: 'Дренаж, уровень, насос и управляющий сигнал.' },
      { href: 'posudomoechnaya-mashina-ne-greet-vodu.html', label: 'Не греет воду', description: 'Бак, бойлер, датчики и силовой контур.' },
      { href: 'posudomoechnaya-mashina-ne-nabiraet-vodu.html', label: 'Не набирает воду', description: 'Водоснабжение, клапан и контроль уровня.' },
      { href: 'posudomoechnye-mashiny.html', label: 'Промышленные посудомоечные машины', description: 'Главный сервисный хаб кластера.' },
    ],
    brand: 'winterhalter',
    eyebrow: 'Независимая заявка по Winterhalter',
  },
];

for (const p of pages) {
  p.renderMode = 'compact-service-v1';
  p.robots = 'noindex,follow';
  p.branch = 'restaurant';
  p.hasForm = true;
  p.equipment = 'commercial_dishwasher';
  p.bodyClass = 'page-dishwasher';
  p.formFields = [
    { name: 'equipment_model', placeholder: p.typePlaceholder, type: 'text', required: true },
    { name: 'serial_number', placeholder: 'Серийный номер (если доступен)', type: 'text' },
    { name: 'error_code', placeholder: 'Код ошибки или индикация', type: 'text' },
    { name: 'wash_stage', placeholder: 'Этап: наполнение, нагрев, мойка, слив...', type: 'text' },
    { name: 'details', placeholder: p.problemPlaceholder, type: 'text' },
  ];
  p.pageVersion = crypto.createHash('sha256').update(JSON.stringify(p)).digest('hex').slice(0, 16);
}

const directPath = 'data/direct-landing-pages.json';
const direct = readJson(directPath);
const map = new Map((direct.pages || []).map((p) => [p.file, p]));
for (const p of pages) map.set(p.file, p);
direct.pages = [...map.values()];
writeJson(directPath, direct);

const clusterPath = 'data/dishwasher-cluster-pages.json';
const cluster = readJson(clusterPath);
for (const row of cluster.pages) {
  if (pages.some((p) => p.file === row.page)) {
    row.status = 'published';
    row.indexable = false;
    row.publicationWave = 'DW7';
    row.metrics.pageIntent = 'promo';
  }
}
writeJson(clusterPath, cluster);

writeJson('data/dishwasher-conversion-pages.json', {
  schemaVersion: 1,
  cluster: 'dishwasher',
  checkedAt: '2026-07-15',
  status: 'published',
  canonicalBase: 'https://mospochin.ru/',
  defaults: {
    branch: 'restaurant',
    minForms: 1,
    minClusterLinks: 0,
    requirePhoneLink: true,
    requireWhatsappLink: true,
    requireAnalytics: true,
    requireTelegramFormScript: true,
    requireMobileContactContainers: true,
    requireFaqSchema: true,
    requireSingleH1: true,
    requireHiddenProblem: true,
  },
  pages: pages.map((p) => ({
    page: p.file,
    status: 'published',
    intent: p.file === 'remont-promyshlennyh-posudomoechnyh-mashin-moskva.html'
      ? 'direct-general-repair'
      : p.file === 'posudomoechnaya-mashina-ne-slivaet-remont-moskva.html'
        ? 'direct-no-drain'
        : 'direct-brand-winterhalter',
    indexable: false,
    branch: 'restaurant',
    renderMode: 'compact-service-v1',
    minForms: 1,
    minClusterLinks: 0,
  })),
});

for (const p of pages) {
  const result = spawnSync(process.execPath, ['tools/generate-direct-landings.mjs', '--page', p.file], { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const metrics = spawnSync(process.execPath, ['tools/apply-dishwasher-metrics-markup.mjs'], { cwd: root, stdio: 'inherit' });
if (metrics.status !== 0) process.exit(metrics.status ?? 1);

const ctxPath = 'data/metrics-page-context.json';
const ctx = readJson(ctxPath);
for (const p of pages) {
  const rec = ctx.pages[p.file];
  rec.brand = p.brand || '';
  rec.source = 'dishwasher_dw7_direct_contract';
}
writeJson(ctxPath, ctx);

const graphPath = 'data/dishwasher-link-graph.json';
const graph = readJson(graphPath);
for (const node of graph.nodes) {
  const cfg = pages.find((p) => p.file === node.page);
  if (!cfg) continue;
  node.status = 'published';
  node.indexable = false;
  node.pageType = 'direct';
  node.plannedOutgoing = cfg.relatedLinks.map((l) => l.href);
  node.actualOutgoing = [...node.plannedOutgoing];
}
graph.publicationWave = 'DW7';
graph.generatedAt = '2026-07-15';
writeJson(graphPath, graph);

const allScreenshotPath = 'data/dishwasher-screenshot-audit.json';
const allScreens = readJson(allScreenshotPath);
for (const p of pages) {
  if (!allScreens.pages.some((x) => x.page === p.file)) {
    allScreens.pages.push({ page: p.file, branch: 'restaurant', pageType: 'service', fullPage: true });
  }
}
writeJson(allScreenshotPath, allScreens);
writeJson('data/dishwasher-dw7-screenshot-audit.json', {
  schemaVersion: 1,
  cluster: 'dishwasher',
  wave: 'DW7',
  pages: pages.map((p) => ({ page: p.file, branch: 'restaurant', pageType: 'direct', fullPage: false })),
});

console.log(`DW7 generated: ${pages.length} Direct pages; dishwasher cluster is ${cluster.pages.filter((p) => p.status === 'published').length}/${cluster.pages.length}`);
