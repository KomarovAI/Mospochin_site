#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const read = (file) => JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
const write = (file, value) => fs.writeFileSync(path.join(ROOT, file), `${JSON.stringify(value, null, 2)}\n`);
const uniq = (items) => [...new Set(items)];

function setHtml(file, html) {
  const value = read(file);
  value.html = html.trim();
  write(file, value);
}

function addCaseContext(file, text) {
  const value = read(file);
  if (!value.html.includes('data-p4-case-context')) {
    value.html = value.html.replace(
      /(<h2[^>]*>Последовательность и детали<\/h2>)/,
      `$1<div data-p4-case-context class="mt-5 max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">${text}</div>`,
    );
  }
  write(file, value);
}

const richSections = {
  'content/components/water-heater-wh4/remont-platy-i-elektroniki-vodonagrevatelya-003-section-kogda-nuzhen-etot-scenariy.json': `
<section class="bg-slate-50 py-16"><div class="mx-auto max-w-7xl px-4"><h2 class="text-3xl font-display font-extrabold text-brand-blue">Когда проверяют плату и электронику</h2><p class="mt-4 max-w-3xl text-slate-600">Код ошибки или тёмный дисплей ещё не доказывают неисправность платы. Сначала отделяют питание, кабель, термозащиту, датчик и исполнительные узлы от самой электроники управления.</p><div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p class="font-bold text-brand-blue">Панель не включается</p><p class="mt-2 text-sm text-slate-600">Проверяется входное питание, сетевой кабель, защита и низковольтное питание платы.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p class="font-bold text-brand-blue">Команды не выполняются</p><p class="mt-2 text-sm text-slate-600">Разделяются кнопки, шлейф, дисплей, датчики и выход на реле.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p class="font-bold text-brand-blue">Нагрев нестабилен</p><p class="mt-2 text-sm text-slate-600">Проверяются контакты, реле, датчик температуры и фактическая нагрузка.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p class="font-bold text-brand-blue">Ошибка повторяется</p><p class="mt-2 text-sm text-slate-600">Код сверяется с руководством именно этой серии, а не с универсальной таблицей из интернета.</p></article></div></div></section>`,
  'content/components/water-heater-wh4/remont-platy-i-elektroniki-vodonagrevatelya-005-section-sekciya-stranicy.json': `
<section class="bg-white py-16"><div class="mx-auto max-w-7xl px-4"><h2 class="text-3xl font-display font-extrabold text-brand-blue">Что измеряет мастер до решения по плате</h2><div class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4"><article class="rounded-2xl bg-slate-50 p-5"><p class="font-bold text-brand-blue">Вход и питание</p><p class="mt-2 text-sm text-slate-600">Напряжение, клеммы, кабель, следы перегрева и питание цепей управления.</p></article><article class="rounded-2xl bg-slate-50 p-5"><p class="font-bold text-brand-blue">Датчики</p><p class="mt-2 text-sm text-slate-600">Соответствие показаний фактической температуре и состояние проводки.</p></article><article class="rounded-2xl bg-slate-50 p-5"><p class="font-bold text-brand-blue">Исполнительный выход</p><p class="mt-2 text-sm text-slate-600">Команда на реле, контактор или ТЭН проверяется под контролируемой нагрузкой.</p></article><article class="rounded-2xl bg-slate-50 p-5"><p class="font-bold text-brand-blue">Ремонтопригодность</p><p class="mt-2 text-sm text-slate-600">Сравниваются повреждение, номер платы, доступность компонента и цена замены узла.</p></article></div><div class="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800"><strong>Стоп-сигнал:</strong> запах гари, дым, оплавление или повторное отключение защиты — прибор не включают до диагностики.</div></div></section>`,
  'content/components/water-heater-wh4/remont-platy-i-elektroniki-vodonagrevatelya-006-section-kakie-raboty-mogut-potrebovat-sya.json': `
<section class="bg-slate-50 py-16"><div class="mx-auto max-w-7xl px-4"><h2 class="text-3xl font-display font-extrabold text-brand-blue">Ремонт платы или замена — как выбирается решение</h2><div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Контакты и разъёмы</p><p class="mt-2 text-sm text-slate-600">Локальное восстановление допустимо, если нет повреждения платы и причины перегрева устранены.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Реле и силовая часть</p><p class="mt-2 text-sm text-slate-600">Проверяется не только компонент, но и нагрузка, из-за которой он мог выйти из строя.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Датчик или шлейф</p><p class="mt-2 text-sm text-slate-600">Если плата исправна, меняется подтверждённый внешний узел, а не весь модуль управления.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Плата в сборе</p><p class="mt-2 text-sm text-slate-600">Замена подбирается по точному номеру и ревизии; похожий разъём не означает совместимость.</p></article></div></div></section>`,

  'content/components/water-heater-wh4/zamena-termostata-i-datchika-temperatury-vodonagrevatelya-003-section-kogda-nuzhen-etot-scenariy.json': `
<section class="bg-slate-50 py-16"><div class="mx-auto max-w-7xl px-4"><h2 class="text-3xl font-display font-extrabold text-brand-blue">Как проявляются разные неисправности температуры</h2><p class="mt-4 max-w-3xl text-slate-600">Термостат, аварийный термовыключатель и электронный датчик выполняют разные задачи. Их нельзя объединять в одну «таблетку температуры» и менять без измерений.</p><div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Не достигает настройки</p><p class="mt-2 text-sm text-slate-600">Сверяются режим, реальная температура, мощность ТЭНа и момент отключения.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Перегревает воду</p><p class="mt-2 text-sm text-slate-600">Проверяется регулирование, положение датчика и работа аварийной защиты.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Отключается слишком рано</p><p class="mt-2 text-sm text-slate-600">Причиной может быть датчик, контакт, накипь у гильзы или реальный локальный перегрев.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Неверная индикация</p><p class="mt-2 text-sm text-slate-600">Сопоставляются показания дисплея, датчик, проводка и обработка сигнала платой.</p></article></div></div></section>`,
  'content/components/water-heater-wh4/zamena-termostata-i-datchika-temperatury-vodonagrevatelya-005-section-sekciya-stranicy.json': `
<section class="bg-white py-16"><div class="mx-auto max-w-7xl px-4"><h2 class="text-3xl font-display font-extrabold text-brand-blue">Три разных узла в одной цепочке безопасности</h2><div class="mt-8 grid gap-4 md:grid-cols-3"><article class="rounded-2xl bg-slate-50 p-5"><p class="font-bold text-brand-blue">Термостат</p><p class="mt-2 text-sm text-slate-600">Поддерживает выбранную температуру и включает или отключает нагрев в рабочем режиме.</p></article><article class="rounded-2xl bg-slate-50 p-5"><p class="font-bold text-brand-blue">Термовыключатель</p><p class="mt-2 text-sm text-slate-600">Аварийно разрывает цепь при превышении допустимой температуры; его срабатывание требует поиска причины.</p></article><article class="rounded-2xl bg-slate-50 p-5"><p class="font-bold text-brand-blue">Датчик температуры</p><p class="mt-2 text-sm text-slate-600">Передаёт значение электронной плате; ошибка может быть в самом датчике, контакте или обработке сигнала.</p></article></div><div class="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800"><strong>Прекратить использование:</strong> если вода перегревается, слышно кипение, пахнет нагретой изоляцией или защита срабатывает повторно.</div></div></section>`,
  'content/components/water-heater-wh4/zamena-termostata-i-datchika-temperatury-vodonagrevatelya-006-section-kakie-raboty-mogut-potrebovat-sya.json': `
<section class="bg-slate-50 py-16"><div class="mx-auto max-w-7xl px-4"><h2 class="text-3xl font-display font-extrabold text-brand-blue">Что проверяют перед заменой</h2><div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Фактическая температура</p><p class="mt-2 text-sm text-slate-600">Сравнивается с настройкой и индикацией, чтобы подтвердить расхождение.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Цепь нагрева</p><p class="mt-2 text-sm text-slate-600">Проверяется момент включения и отключения, питание и управляющий выход.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Посадка датчика</p><p class="mt-2 text-sm text-slate-600">Важны контакт с гильзой, проводка, разъём и отсутствие повреждений.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Совместимость детали</p><p class="mt-2 text-sm text-slate-600">Температурный диапазон, длина, разъём и характеристика сверяются по модели.</p></article></div></div></section>`,

  'content/components/water-heater-wh4/remont-ploskih-dvuhbakovyh-vodonagrevateley-003-section-kogda-nuzhen-etot-scenariy.json': `
<section class="bg-slate-50 py-16"><div class="mx-auto max-w-7xl px-4"><h2 class="text-3xl font-display font-extrabold text-brand-blue">Почему двухбаковый водонагреватель диагностируют по ступеням</h2><p class="mt-4 max-w-3xl text-slate-600">В плоском корпусе могут работать два внутренних бака, несколько нагревателей, датчиков и соединительных узлов. Симптом «воды стало меньше» не равен автоматической замене обоих ТЭНов.</p><div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Греется только часть объёма</p><p class="mt-2 text-sm text-slate-600">Проверяется каждая ступень, её нагреватель, реле и датчик.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Температура нестабильна</p><p class="mt-2 text-sm text-slate-600">Сопоставляются показания датчиков, режим и последовательность включения.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Течь у одного фланца</p><p class="mt-2 text-sm text-slate-600">Источник локализуют отдельно: прокладка, фланец, патрубок или бак.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Ошибка на одной ступени</p><p class="mt-2 text-sm text-slate-600">Проверяется конкретная цепь, а не меняется вся электроника целиком.</p></article></div></div></section>`,
  'content/components/water-heater-wh4/remont-ploskih-dvuhbakovyh-vodonagrevateley-005-section-sekciya-stranicy.json': `
<section class="bg-white py-16"><div class="mx-auto max-w-7xl px-4"><h2 class="text-3xl font-display font-extrabold text-brand-blue">Что отличается от круглого однобакового бойлера</h2><div class="mt-8 grid gap-4 md:grid-cols-3"><article class="rounded-2xl bg-slate-50 p-5"><p class="font-bold text-brand-blue">Несколько нагревательных контуров</p><p class="mt-2 text-sm text-slate-600">Нужно измерить каждый ТЭН и проверить, как плата включает ступени мощности.</p></article><article class="rounded-2xl bg-slate-50 p-5"><p class="font-bold text-brand-blue">Больше внутренних соединений</p><p class="mt-2 text-sm text-slate-600">Течь может быть связана не только с внешней обвязкой, но и с межбаковой зоной или отдельным фланцем.</p></article><article class="rounded-2xl bg-slate-50 p-5"><p class="font-bold text-brand-blue">Зависимость от серии</p><p class="mt-2 text-sm text-slate-600">Компоновка, доступ и номера деталей отличаются; подбор выполняется по шильдику и ревизии.</p></article></div><div class="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800"><strong>Стоп-сигнал:</strong> вода внутри нижней крышки, течь корпуса, запах гари или повторное отключение защиты.</div></div></section>`,
  'content/components/water-heater-wh4/remont-ploskih-dvuhbakovyh-vodonagrevateley-006-section-kakie-raboty-mogut-potrebovat-sya.json': `
<section class="bg-slate-50 py-16"><div class="mx-auto max-w-7xl px-4"><h2 class="text-3xl font-display font-extrabold text-brand-blue">Возможные работы после диагностики</h2><div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Один нагревательный контур</p><p class="mt-2 text-sm text-slate-600">Замена подтверждённого ТЭНа без автоматической замены исправной второй ступени.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Датчик или термостат</p><p class="mt-2 text-sm text-slate-600">Сопоставление показаний и подбор совместимой детали.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Фланец и прокладка</p><p class="mt-2 text-sm text-slate-600">Очистка посадочного места, оценка коррозии и контроль равномерной сборки.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Электроника ступеней</p><p class="mt-2 text-sm text-slate-600">Проверка реле и выходов только после исключения нагрузки и проводки.</p></article></div></div></section>`,

  'content/components/water-heater-wh4/korroziya-baka-vodonagrevatelya-003-section-kogda-nuzhen-etot-scenariy.json': `
<section class="bg-slate-50 py-16"><div class="mx-auto max-w-7xl px-4"><h2 class="text-3xl font-display font-extrabold text-brand-blue">Где ржавчина ещё не означает течь бака</h2><p class="mt-4 max-w-3xl text-slate-600">Следы коррозии снаружи могут появиться на крепеже, фланце, патрубке или из-за воды, пришедшей сверху. Сначала источник очищают и локализуют; решение о замене прибора принимают по месту выхода воды и состоянию металла.</p><div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Крепёж и крышка</p><p class="mt-2 text-sm text-slate-600">Коррозия может быть следствием старой протечки или конденсата.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Фланец и прокладка</p><p class="mt-2 text-sm text-slate-600">Иногда ремонтопригодны после оценки посадочной поверхности.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Патрубок</p><p class="mt-2 text-sm text-slate-600">Нужно отличить резьбовое соединение от разрушения металла бака.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Шов или корпус</p><p class="mt-2 text-sm text-slate-600">Вода из оболочки или сварного шва обычно переводит решение к замене прибора.</p></article></div></div></section>`,
  'content/components/water-heater-wh4/korroziya-baka-vodonagrevatelya-005-section-sekciya-stranicy.json': `
<section class="bg-white py-16"><div class="mx-auto max-w-7xl px-4"><h2 class="text-3xl font-display font-extrabold text-brand-blue">Дерево решения: ремонтировать или менять</h2><div class="mt-8 grid gap-4 md:grid-cols-3"><article class="rounded-2xl bg-green-50 p-5"><p class="font-bold text-green-800">Чаще ремонтируют</p><p class="mt-2 text-sm text-green-900/80">Резьбовое соединение, исправное посадочное место фланца, заменяемая прокладка или локальная арматура.</p></article><article class="rounded-2xl bg-amber-50 p-5"><p class="font-bold text-amber-800">Нужен осмотр</p><p class="mt-2 text-sm text-amber-900/80">Сильная коррозия фланца, патрубка, крепежа или неизвестный источник воды под кожухом.</p></article><article class="rounded-2xl bg-red-50 p-5"><p class="font-bold text-red-800">Обычно рассматривают замену</p><p class="mt-2 text-sm text-red-900/80">Течь внутреннего бака, корпуса или шва, разрушенное посадочное место и множественная глубокая коррозия.</p></article></div><p class="mt-6 text-slate-600">Магниевый анод помогает защищать исправный бак, но не восстанавливает уже разрушенный металл. Поэтому замена анода не используется как способ скрыть течь корпуса.</p></div></section>`,
  'content/components/water-heater-wh4/korroziya-baka-vodonagrevatelya-006-section-kakie-raboty-mogut-potrebovat-sya.json': `
<section class="bg-slate-50 py-16"><div class="mx-auto max-w-7xl px-4"><h2 class="text-3xl font-display font-extrabold text-brand-blue">Что проверяют на месте</h2><div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Трассировка воды</p><p class="mt-2 text-sm text-slate-600">Поверхность высушивается, после чего определяется верхняя точка появления влаги.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Посадочное место</p><p class="mt-2 text-sm text-slate-600">Оценивается металл под прокладкой, геометрия и возможность герметичной сборки.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Внутренняя зона</p><p class="mt-2 text-sm text-slate-600">При доступе фиксируются осадок, анод и следы коррозии без обещания увидеть весь бак.</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="font-bold text-brand-blue">Экономика решения</p><p class="mt-2 text-sm text-slate-600">Возраст, доступ, цена деталей и риск повторной течи сопоставляются со стоимостью замены прибора.</p></article></div></div></section>`,
};

for (const [file, html] of Object.entries(richSections)) setHtml(file, html);

const corrosionDecision = 'content/components/water-heater-wh4/korroziya-baka-vodonagrevatelya-005-section-sekciya-stranicy.json';
const corrosionDecisionData = read(corrosionDecision);
if (!corrosionDecisionData.html.includes('zamena-magnievogo-anoda-vodonagrevatelya.html')) {
  corrosionDecisionData.html = corrosionDecisionData.html.replace('</div></section>', '<p class="mt-6"><a href="zamena-magnievogo-anoda-vodonagrevatelya.html" class="font-bold text-brand-orange hover:underline">Когда имеет смысл проверить и заменить магниевый анод →</a></p></div></section>');
  write(corrosionDecision, corrosionDecisionData);
}

addCaseContext('content/components/water-heater-wh4/case-chistka-boylera-s-silnoy-nakipyu-005-section-posledovatel-nost-i-detali.json', '<p><strong>Что доказывает серия:</strong> организованный слив, промывку снятого узла и фактический объём загрязнения. По фотографии нельзя назначить новую деталь: после очистки отдельно оценивают ТЭН, анод, прокладку и герметичность сборки.</p>');
addCaseContext('content/components/water-heater-wh4/case-remont-dvuhbakovogo-vodonagrevatelya-005-section-posledovatel-nost-i-detali.json', '<p><strong>Что доказывает серия:</strong> раздельный доступ к узлам плоской двухбаковой конструкции. Результат ремонта подтверждают проверкой обеих ступеней нагрева и отсутствием течи; фотографии сами по себе не определяют электрическую неисправность.</p>');
addCaseContext('content/components/water-heater-wh4/case-remont-boylera-v-tesnoy-nishe-005-section-posledovatel-nost-i-detali.json', '<p><strong>Главный вывод кейса:</strong> доступ влияет на состав и стоимость сильнее, чем объём бойлера. До разборки оценивают возможность слива, снятия крышки и извлечения фланца; если сервисной зоны нет, демонтаж согласуют отдельно.</p>');
addCaseContext('content/components/water-heater-wh4/case-trehfaznaya-sistema-gvs-chastnogo-doma-005-pricing-posledovatel-nost-i-detali.json', '<p><strong>Граница кейса:</strong> фотографии показывают сложную систему ГВС, но не заменяют однолинейную схему и измерения. MosPochin рассматривает водонагреватель, его автоматику и локальную обвязку; полный проект котельной и общая инженерная разводка остаются отдельной задачей.</p>');

const branch = read('data/household-branch.json');
const newPages = new Set([
  'zamena-magnievogo-anoda-vodonagrevatelya.html',
  'vodonagrevatel-shumit-pri-nagreve.html',
  'ustanovka-elektricheskogo-vodonagrevatelya.html',
]);
branch.services = (branch.services || []).filter((item) => !newPages.has(item.href));
branch.footerLinks = (branch.footerLinks || []).filter((item) => !newPages.has(item.href));
branch.brandClusters = (branch.brandClusters || []).filter((item) => !['Замена магниевого анода', 'Водонагреватель шумит при нагреве', 'Установка водонагревателя'].includes(item.category));
write('data/household-branch.json', branch);

const services = read('data/household-services.json');
const serviceByPage = new Map((services.services || []).map((item) => [item.page, item]));
serviceByPage.get('water-heaters.html').relatedPages = [
  'diagnostika-vodonagrevatelya.html',
  'vodonagrevatel-shumit-pri-nagreve.html',
  'zamena-magnievogo-anoda-vodonagrevatelya.html',
];
write('data/household-services.json', services);

const slots = read('data/household-page-slots.json');
slots.pages['water-heaters.html'].relatedLinks = {
  badge: 'ПО СИМПТОМУ И ЗАДАЧЕ',
  title: 'Продолжить по точному сценарию водонагревателя',
  description: 'Диагностика, шум при нагреве и обслуживание анода — без перехода в несвязанные категории техники.',
};
write('data/household-page-slots.json', slots);

const cluster = read('data/water-heater-cluster-pages.json');
cluster.release = 'WH5-CONTENT-P4';
cluster.contentRules = uniq([...(cluster.contentRules || []), 'new intent pages require unique diagnostic logic', 'manufacturer guidance is scoped to the cited model family']);
const byPage = new Map(cluster.pages.map((item) => [item.page, item]));
const addLinks = (page, links) => { const item = byPage.get(page); item.clusterLinks = uniq([...(item.clusterLinks || []), ...links]); };
addLinks('water-heaters.html', [...newPages]);
addLinks('diagnostika-vodonagrevatelya.html', ['vodonagrevatel-shumit-pri-nagreve.html']);
addLinks('chistka-vodonagrevatelya-ot-nakipi.html', ['vodonagrevatel-shumit-pri-nagreve.html', 'zamena-magnievogo-anoda-vodonagrevatelya.html']);
addLinks('zamena-tena-vodonagrevatelya.html', ['zamena-magnievogo-anoda-vodonagrevatelya.html']);
addLinks('vodonagrevatel-medlenno-greet-vodu.html', ['vodonagrevatel-shumit-pri-nagreve.html']);
addLinks('korroziya-baka-vodonagrevatelya.html', ['zamena-magnievogo-anoda-vodonagrevatelya.html']);
addLinks('podklyuchenie-i-obvyazka-vodonagrevatelya.html', ['ustanovka-elektricheskogo-vodonagrevatelya.html']);
const additions = [
  { page: 'zamena-magnievogo-anoda-vodonagrevatelya.html', slug: 'zamena-magnievogo-anoda-vodonagrevatelya', intent: 'service', title: 'Замена магниевого анода водонагревателя в Москве', h1: 'Замена магниевого анода водонагревателя', indexable: true, clusterLinks: ['water-heaters.html', 'chistka-vodonagrevatelya-ot-nakipi.html', 'zamena-tena-vodonagrevatelya.html', 'korroziya-baka-vodonagrevatelya.html'], evidenceIds: ['thermex_kit_maintenance_2026'], serviceBoundary: 'electric_water_heater_maintenance' },
  { page: 'vodonagrevatel-shumit-pri-nagreve.html', slug: 'vodonagrevatel-shumit-pri-nagreve', intent: 'symptom', title: 'Водонагреватель шумит при нагреве — диагностика в Москве', h1: 'Водонагреватель шумит при нагреве', indexable: true, clusterLinks: ['water-heaters.html', 'diagnostika-vodonagrevatelya.html', 'chistka-vodonagrevatelya-ot-nakipi.html', 'vodonagrevatel-medlenno-greet-vodu.html'], evidenceIds: ['thermex_kit_maintenance_2026'], serviceBoundary: 'electric_water_heater_diagnostics' },
  { page: 'ustanovka-elektricheskogo-vodonagrevatelya.html', slug: 'ustanovka-elektricheskogo-vodonagrevatelya', intent: 'installation', title: 'Установка электрического водонагревателя в Москве', h1: 'Установка электрического водонагревателя', indexable: true, clusterLinks: ['water-heaters.html', 'podklyuchenie-i-obvyazka-vodonagrevatelya.html', 'zamena-predohranitelnogo-klapana-vodonagrevatelya.html', 'ustanovka-slivnogo-krana-vodonagrevatelya.html'], evidenceIds: ['thermex_kit_maintenance_2026', 'thermex_storage_installation_manual'], serviceBoundary: 'electric_water_heater_installation' },
];
for (const item of additions) byPage.set(item.page, item);
cluster.pages = [...byPage.values()];
cluster.pageCount = cluster.pages.length;
write('data/water-heater-cluster-pages.json', cluster);

for (const item of additions) {
  const modelFile = `src/pages/${item.slug}/page.json`;
  const model = read(modelFile);
  model.branch = 'household';
  model.role = 'service';
  model.title = item.title;
  model.h1 = item.h1;
  const breadcrumb = (model.sections || []).find((section) => section.component === 'breadcrumb' && section.props);
  if (breadcrumb) breadcrumb.props.currentLabel = item.h1;
  write(modelFile, model);

  const headFile = path.join(ROOT, 'src', 'pages', item.slug, 'head.html');
  let head = fs.readFileSync(headFile, 'utf8');
  if (!head.includes('analytics.js')) {
    head = head.replace(/(<script src="telegram-form\.js" defer><\/script>)/, '$1\n    <script src="analytics.js" defer></script>');
  }
  fs.writeFileSync(headFile, head);
}

const graph = read('data/water-heater-link-graph.json');
const pageSet = new Set(cluster.pages.map((item) => item.page));
graph.release = 'WH5-CONTENT-P4';
graph.edges = cluster.pages.flatMap((item) => (item.clusterLinks || []).filter((target) => pageSet.has(target)).map((target) => ({ from: item.page, to: target, type: 'contextual_cluster' })));
write('data/water-heater-link-graph.json', graph);

const evidence = read('data/water-heater-fault-evidence.json');
evidence.sources = [...(evidence.sources || []).filter((item) => item.id !== 'thermex_kit_maintenance_2026'), {
  id: 'thermex_kit_maintenance_2026',
  type: 'manufacturer_manual',
  publisher: 'Thermex',
  url: 'https://thermex.ru/upload/iblock/24b/zc62s29j98mu3u0ejeh5yc9kwze0x05t.pdf',
  supports: [
    'maintenance checks the magnesium anode, scale on the heating element and sediment',
    'installation must account for filled appliance weight and service access',
    'the tank must be filled before electrical power is enabled',
    'the safety valve may discharge water while pressure rises during heating',
  ],
}];
write('data/water-heater-fault-evidence.json', evidence);

const taxonomy = read('data/water-heater-fault-taxonomy.json');
taxonomy.symptoms = [...(taxonomy.symptoms || []).filter((item) => item.symptomId !== 'water_heater.noise_during_heating'), {
  symptomId: 'water_heater.noise_during_heating',
  page: 'vodonagrevatel-shumit-pri-nagreve.html',
  userSymptoms: ['гудит при нагреве', 'шипит или потрескивает', 'свистит у клапана', 'звук стал громче'],
  safeChecks: ['записать звук без снятия крышки', 'уточнить момент появления', 'зафиксировать режим и индикацию'],
  stopUseConditions: ['запах гари', 'течь возле электрической части', 'срабатывание автомата или УЗО'],
  probableNodes: ['scale', 'heating_element', 'safety_valve', 'pressure', 'mounting', 'terminals', 'relay'],
  technicianChecks: ['sound_timing', 'heating_rate', 'valve_discharge', 'pressure', 'mounting_transfer', 'electrical_connections'],
  prohibitedClaims: ['шум всегда означает накипь'],
}];
write('data/water-heater-fault-taxonomy.json', taxonomy);

const bounds = read('data/water-heater-intent-boundaries.json');
for (const boundary of [
  { intent: 'magnesium anode maintenance', status: 'included', reason: 'model-scoped maintenance of an electric storage water heater' },
  { intent: 'noise during electric water-heater operation', status: 'included', reason: 'symptom-led diagnostics without assuming scale' },
  { intent: 'electric water-heater installation', status: 'included', reason: 'appliance mounting, local piping and model-scoped connection checks' },
]) {
  bounds.boundaries = [...(bounds.boundaries || []).filter((item) => item.intent !== boundary.intent), boundary];
}
write('data/water-heater-intent-boundaries.json', bounds);

const registry = read('data/cluster-registry.json');
registry.clusters['water-heaters'].status = 'wh5-content-p4';
write('data/cluster-registry.json', registry);

const shots = read('data/water-heater-screenshot-audit.json');
shots.release = 'WH5-CONTENT-P4';
for (const item of additions) if (!shots.pages.some((page) => page.page === item.page)) shots.pages.push({ page: item.page, label: item.h1, branch: 'household', pageType: item.intent, fullPage: false });
write('data/water-heater-screenshot-audit.json', shots);

console.log(`Applied WH5 content P4: ${cluster.pages.length} pages, ${graph.edges.length} contextual links, ${evidence.sources.length} evidence sources`);
