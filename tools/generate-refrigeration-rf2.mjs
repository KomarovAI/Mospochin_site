#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const writeJson = (p,v) => fs.writeFileSync(path.join(root,p), JSON.stringify(v,null,2)+'\n');
const esc = (s='') => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const slugOf = (page) => page.replace(/\.html$/,'');

const manifest = readJson('data/refrigeration-cluster-pages.json');
const evidence = readJson('data/refrigeration-fault-evidence.json');
const taxonomy = readJson('data/refrigeration-fault-taxonomy.json');
const symptomPages = readJson('data/refrigeration-symptom-pages.json');
const evidenceById = new Map(evidence.records.map((x)=>[x.id,x]));
const manifestByPage = new Map(manifest.pages.map((x)=>[x.page,x]));
const taxonomyByPage = new Map(taxonomy.symptoms.map((x)=>[x.slug,x]));
const symptomPageByPage = new Map(symptomPages.pages.map((x)=>[x.page,x]));

const base = fs.readFileSync(path.join(root,'diagnostika-kuttera.html'),'utf8');
const headerStart = base.indexOf('<div class="mt-12" id="header-container"');
const mainStart = base.indexOf('<main', headerStart);
const footerStart = base.indexOf('<div id="footer-container"');
if(headerStart<0||mainStart<0||footerStart<0) throw new Error('Cannot extract static shell from diagnostika-kuttera.html');
const headerTemplate = base.slice(headerStart, mainStart);
const footerTemplate = base.slice(footerStart, base.indexOf('</body>'));

const commonLinks = [
  ['holodilnoe-oborudovanie.html','Ремонт холодильного оборудования','Главный раздел профессионального холода'],
  ['ice-machines.html','Ремонт льдогенераторов','Кубиковые, гранулированные и чешуйчатые машины'],
  ['obsluzhivanie-holodilnogo-oborudovaniya.html','Техническое обслуживание','Конденсатор, оттайка, дренаж, уплотнения и контроллер'],
  ['diagnostika-holodilnogo-oborudovaniya.html','Диагностика оборудования','Проверка воздушного тракта, автоматики и холодильного контура'],
  ['holodilnye-kamery-dlya-restoranov.html','Холодильные камеры','Камера, испаритель, агрегат, дверь и оттайка'],
  ['shokery-shkafy-shokovogo-okhlazhdeniya-i-zamorozki.html','Шокеры','Циклы охлаждения и заморозки по времени или термощупу'],
  ['holodilnoe-oborudovanie-ne-holodit.html','Оборудование не холодит','Температура растёт или не достигается уставка'],
  ['ldogenerator-ne-proizvodit-led.html','Льдогенератор не делает лёд','Вода, цикл замораживания, сброс и датчик бункера']
];

const pages = {
  'holodilnoe-oborudovanie.html': {
    title:'Ремонт профессионального холодильного оборудования в Москве | MosPochin',
    h1:'Ремонт профессионального холодильного оборудования',
    description:'Ремонт профессионального холодильного оборудования в Москве: шкафы, столы, камеры, моноблоки, сплит-системы, шокеры и льдогенераторы.',
    eyebrow:'Профессиональный холод для кухни и хранения',
    lead:'Диагностируем оборудование по типу, фактической температуре, этапу цикла и состоянию воздушного и холодильного контуров — без назначения деталей по одному симптому.',
    kind:'hub', equipment:'commercial_refrigeration',
    introTitle:'Один кластер — четыре разных режима работы',
    intro:[
      'Холодильный шкаф и камера поддерживают температуру хранения, шокер выполняет управляемое быстрое охлаждение или заморозку, а льдогенератор производит и сбрасывает лёд. Общие элементы холодильного контура не делают эти машины взаимозаменяемыми по диагностике.',
      'До ремонта фиксируют тип оборудования, производителя, модель, серийный номер, контроллер, уставку и фактическую температуру. Для шокеров и льдогенераторов дополнительно важен этап технологического цикла.'
    ],
    cards:[
      ['ri-fridge-line','Хранение холода','Шкафы, столы, витрины и морозильное оборудование.'],
      ['ri-home-gear-line','Холодильные камеры','Панели, двери, испаритель, моноблок или сплит-система.'],
      ['ri-snowflake-line','Шоковое охлаждение','Циклы по времени и температуре продукта, термощуп и вентиляторы.'],
      ['ri-cup-line','Льдогенераторы','Вода, замораживание, сброс, дренаж и контроль бункера.']
    ],
    steps:[
      'Зафиксировать модель, серийный номер, контроллер и хладагент по шильдику, не угадывая их.',
      'Записать уставку, фактическую температуру и время, за которое возникло отклонение.',
      'Указать, что работает: компрессор, вентиляторы, дисплей, оттайка, насос воды или механизм сброса.',
      'При запахе гари, повторном срабатывании автомата, повреждении кабеля или воде возле электрики обесточить оборудование.'
    ],
    matrix:[
      ['Воздушный тракт','Температура распределяется неравномерно или медленно снижается','Конденсатор, испаритель, вентиляторы и свободный поток воздуха'],
      ['Автоматика','Неверная температура, код или отсутствие команды','Датчики, контроллер, реле, контакторы и дверной сигнал'],
      ['Холодильный контур','Компрессор работает, но холодопроизводительность недостаточна','Компрессор, теплообменники, расширительное устройство и герметичность'],
      ['Оттайка и дренаж','Лёд на испарителе или вода внутри оборудования','Нагреватель, датчик, расписание, слив и обогрев дренажа'],
      ['Технологический цикл','Шокер или льдогенератор не завершает программу','Термощуп, вода, сброс, датчик бункера и программные условия']
    ],
    faq:[
      ['Какое холодильное оборудование ремонтируется?','Профессиональные шкафы, столы, камеры, моноблоки и сплит-системы, шокеры и льдогенераторы. Возможность работ уточняется по модели и шильдику.'],
      ['Можно ли определить неисправность по температуре?','Температура показывает результат, но не единственную причину. Нужны состояние вентиляторов, компрессора, оттайки, дверей, датчиков и условия загрузки.'],
      ['Нужно ли сразу заправлять хладагент?','Нет. Потерю хладагента подтверждают измерениями и поиском герметичности; без устранения утечки дозаправка не является ремонтом.']
    ]
  },
  'ice-machines.html': {
    title:'Ремонт профессиональных льдогенераторов в Москве | MosPochin',
    h1:'Ремонт профессиональных льдогенераторов',
    description:'Ремонт профессиональных льдогенераторов: кубиковые, гранулированные и чешуйчатые модели, диагностика воды, замораживания, сброса и дренажа.',
    eyebrow:'Отдельный подкластер производства льда',
    lead:'Определяем тип льда и этап остановки: набор воды, замораживание, сброс, дренаж или заполнение бункера.',
    kind:'subhub', equipment:'ice_machine',
    introTitle:'Тип льда определяет устройство машины',
    intro:[
      'Кубиковые машины используют поверхность или форму замораживания и отдельный цикл сброса. Чешуйчатые и гранулированные модели могут применять шнек, редуктор и ледяной цилиндр. Поэтому шум шнека не относится к каждой машине, а проблема сброса кубиков не описывает шнековую модель.',
      'Диагностика начинается с подачи воды и состояния фильтра, затем проверяются замораживание, циркуляция воды, механизм harvest или шнек, дренаж и датчик заполнения бункера.'
    ],
    cards:[
      ['ri-water-flash-line','Водяной контур','Кран, фильтр, клапан, резервуар, насос и распыление.'],
      ['ri-snowflake-line','Замораживание','Испаритель, компрессор, конденсатор и датчики цикла.'],
      ['ri-loop-left-line','Сброс льда','Горячий газ, водяная пластина, механика или шнек.'],
      ['ri-inbox-archive-line','Бункер и дренаж','Датчик заполнения, желоб, слив и санитарное состояние.']
    ],
    steps:[
      'Записать марку, модель, тип получаемого льда и серийный номер.',
      'Проверить внешний кран, доступный водяной фильтр и отсутствие перегиба слива.',
      'Зафиксировать, появляется ли вода и начинается ли замораживание.',
      'Не вскрывать холодильный контур и не обходить датчик заполнения бункера.'
    ],
    matrix:[
      ['Подача воды','Резервуар не заполняется или лёд формируется неполным','Кран, давление, фильтр, клапан и датчик уровня'],
      ['Водяной насос','Нет циркуляции или распыления','Питание, крыльчатка, загрязнение и трубки'],
      ['Холодильная система','Вода есть, но замораживание не начинается','Компрессор, конденсатор, испаритель и управление'],
      ['Система сброса','Лёд сформирован, но не попадает в бункер','Клапан горячего газа, датчик, пластина, привод или шнек'],
      ['Датчик бункера','Машина считает бункер полным','Чистота, положение, сигнал и проводка']
    ],
    faq:[
      ['Почему важно указать тип льда?','Кубиковые, гранулированные и чешуйчатые машины имеют разные механизмы формирования и выдачи льда.'],
      ['Может ли водяной фильтр остановить производство?','Ограниченный поток воды способен замедлить или сорвать цикл, но проверяются также клапан, насос, замораживание и управление.'],
      ['Можно ли пользоваться льдом с запахом или загрязнением?','Нет. Производство останавливают до очистки, санитарной обработки и проверки источника загрязнения по инструкции модели.']
    ]
  },
  'obsluzhivanie-holodilnogo-oborudovaniya.html': {
    title:'Обслуживание профессионального холодильного оборудования | MosPochin',
    h1:'Обслуживание профессионального холодильного оборудования',
    description:'Техническое обслуживание холодильных шкафов, столов и камер: конденсатор, вентиляторы, оттайка, дренаж, уплотнения, датчики и контроллер.',
    eyebrow:'Профилактика перегрева и потери холода',
    lead:'Обслуживание строится по типу оборудования, условиям кухни и фактическому состоянию теплообменников, дренажа, дверей и автоматики.',
    kind:'service', equipment:'commercial_refrigeration',
    introTitle:'Ежедневный уход и инженерное ТО — разные работы',
    intro:[
      'Персонал контролирует чистоту камеры, закрытие дверей, свободный воздушный поток и доступные сливные элементы. Инженерное обслуживание включает конденсатор, вентиляторы, оттайку, электрические соединения, датчики и работу контроллера.',
      'Фиксированный интервал без учёта жира, пыли, температуры помещения, загрузки и режима эксплуатации ненадёжен. На горячей кухне конденсатор загрязняется и перегревается быстрее, чем в прохладной подготовительной зоне.'
    ],
    cards:[
      ['ri-windy-line','Конденсатор','Очистка воздушного тракта и контроль перегрева.'],
      ['ri-fan-line','Вентиляторы','Свободное вращение, шум, питание и направление потока.'],
      ['ri-snowy-line','Оттайка','Нагреватель, датчик испарителя, расписание и завершение цикла.'],
      ['ri-door-line','Двери и дренаж','Уплотнение, петли, дверной сигнал, слив и обогрев.']
    ],
    steps:[
      'Зафиксировать температуры и журнал тревог до обслуживания.',
      'Оценить загрязнение конденсатора и доступ воздуха к агрегату.',
      'Проверить испаритель, вентиляторы, оттайку и дренаж.',
      'Проверить двери, уплотнения, датчики и электрические соединения.'
    ],
    matrix:[
      ['Конденсатор','Компрессор перегревается, холод набирается медленно','Загрязнение, температура воздуха и работа вентилятора'],
      ['Испаритель','Воздушный поток слабый или теплообменник обмерзает','Чистота, лёд, вентилятор и оттайка'],
      ['Дренаж','Вода под оборудованием или лёд в канале','Проходимость, уклон, обогрев и герметичность'],
      ['Дверь','Частая работа компрессора и иней возле проёма','Уплотнение, петли, геометрия и дверной вход'],
      ['Контроллер','Повторяющиеся тревоги или неверное управление','Датчики, параметры и исполнительные выходы по документации']
    ],
    faq:[
      ['Как часто чистить конденсатор?','Периодичность определяют по инструкции и фактическому загрязнению. На кухне с жиром и высокой температурой контроль требуется чаще.'],
      ['Нужно ли размораживать оборудование вручную?','Только если это предусмотрено инструкцией и выполнено безопасно. Повторное обмерзание требует проверки оттайки, двери и воздушного потока.'],
      ['Обслуживание заменяет ремонт?','Нет. ТО предупреждает часть отказов и выявляет отклонения, но неисправные компоненты требуют отдельной диагностики и ремонта.']
    ]
  },
  'diagnostika-holodilnogo-oborudovaniya.html': {
    title:'Диагностика профессионального холодильного оборудования | MosPochin',
    h1:'Диагностика профессионального холодильного оборудования',
    description:'Диагностика холодильного оборудования по температуре, воздушному тракту, оттайке, контроллеру, компрессору и холодильному контуру.',
    eyebrow:'Причина подтверждается измерениями',
    lead:'Разделяем недостаток холода на внешние условия, воздушный тракт, автоматику и холодильный контур — до замены компрессора, датчика или контроллера.',
    kind:'service', equipment:'commercial_refrigeration',
    introTitle:'Диагностика от простого к герметичному контуру',
    intro:[
      'Сначала проверяют питание, уставку, двери, загрузку, загрязнение теплообменников, вентиляторы и оттайку. Затем оценивают команды контроллера и работу исполнительных элементов. Только после этого переходят к параметрам холодильного контура.',
      'Показание манометра без данных о хладагенте, температуре окружающей среды и режиме работы недостаточно. Универсальные давления и объём дозаправки не публикуются.'
    ],
    cards:[
      ['ri-temp-cold-line','Температура','Уставка, фактические значения и динамика снижения.'],
      ['ri-windy-line','Воздушный тракт','Теплообменники, вентиляторы, загрузка и двери.'],
      ['ri-cpu-line','Автоматика','Датчики, контроллер, реле, контакторы и защиты.'],
      ['ri-gauge-line','Холодильный контур','Компрессор, расширение, герметичность и теплообмен.']
    ],
    steps:[
      'Считать код и сохранить параметры до сброса питания.',
      'Сравнить уставку, фактическую температуру и показания независимого прибора.',
      'Проверить вентиляторы, загрязнение, двери, лёд и цикл оттайки.',
      'Измерить электрические и холодильные параметры по схеме и шильдику модели.'
    ],
    matrix:[
      ['Датчик температуры','Показание скачет или не совпадает с независимым измерением','Сопротивление, подключение, место установки и тип датчика'],
      ['Контроллер','Нет команды на компрессор, вентилятор или оттайку','Входы, параметры, выходные реле и журнал тревог'],
      ['Компрессор','Не запускается, перегревается или не создаёт производительность','Питание, защита, ток, температуры и параметры контура'],
      ['Расширительное устройство','Испаритель питается неравномерно','Перегрев, обмерзание, загрязнение и условия нагрузки'],
      ['Герметичность','Холодопроизводительность падает после периода работы','Поиск утечки, вакуумирование и заправка по данным модели']
    ],
    faq:[
      ['Можно ли диагностировать утечку по инею?','Иней может быть косвенным признаком, но не подтверждает место и причину утечки. Требуется проверка герметичности.'],
      ['Почему код не означает готовый диагноз?','Код указывает на обнаруженное контроллером состояние. Причина может находиться в датчике, проводке, механике или внешних условиях.'],
      ['Зачем указывать модель контроллера?','Одинаковые обозначения и параметры могут отличаться между контроллерами даже на оборудовании одного типа.']
    ]
  },
  'holodilnye-kamery-dlya-restoranov.html': {
    title:'Ремонт холодильных камер для ресторанов | MosPochin',
    h1:'Холодильные камеры для ресторанов и пищеблоков',
    description:'Ремонт холодильных и морозильных камер: двери, панели, испаритель, оттайка, дренаж, моноблоки и сплит-системы.',
    eyebrow:'Холодильные и морозильные помещения',
    lead:'Камера диагностируется как система: теплоизоляционный контур, дверь, испаритель, агрегат, автоматика, оттайка и распределение воздуха.',
    kind:'equipment', equipment:'cold_room',
    introTitle:'Камера — это не увеличенный холодильный шкаф',
    intro:[
      'Холодильная камера объединяет ограждающие панели, герметичный дверной проём и отдельную холодильную машину. Моноблок располагает основные части в одном корпусе, а сплит-система разделяет испарительный и конденсаторный блоки.',
      'Контроллер камеры может управлять компрессором, оттайкой, вентиляторами, светом и дверной тревогой. Высокая температура внутри не означает автоматически неисправность компрессора.'
    ],
    cards:[
      ['ri-layout-masonry-line','Панели и стыки','Теплопритоки, повреждения, герметичность и промерзание.'],
      ['ri-door-lock-line','Дверной блок','Уплотнение, петли, обогрев, замок и датчик двери.'],
      ['ri-snowflake-line','Испаритель','Вентиляторы, обмерзание, оттайка и дренаж.'],
      ['ri-settings-5-line','Холодильная машина','Моноблок или сплит-система, конденсатор и компрессор.']
    ],
    steps:[
      'Зафиксировать температуру воздуха и продукта в разных точках камеры.',
      'Проверить закрытие двери, уплотнение и отсутствие длительного открывания.',
      'Оценить работу вентиляторов и наличие льда на испарителе.',
      'Записать код контроллера и режим: охлаждение, ожидание или оттайка.'
    ],
    matrix:[
      ['Дверь и панели','Иней у проёма, локальное потепление, длительная работа','Уплотнение, петли, стыки, обогрев и дверной сигнал'],
      ['Испаритель','Слабый поток или неравномерная температура','Лёд, вентиляторы, загрязнение и распределение загрузки'],
      ['Оттайка','Испаритель постепенно зарастает льдом','Нагреватель, датчик, контроллер и дренаж'],
      ['Конденсаторный блок','Высокая температура конденсации и перегрев','Загрязнение, вентиляция помещения и вентилятор'],
      ['Контроллер камеры','Тревога двери, датчика или высокой температуры','Настройки, входы, выходы и документация модели']
    ],
    faq:[
      ['Чем моноблок отличается от сплит-системы?','У моноблока основные части собраны в одном корпусе, у сплит-системы испарительный и конденсаторный блоки соединены трассой.'],
      ['Почему камера холодная возле испарителя и тёплая у двери?','Проверяют воздушный поток, загрузку, вентиляторы, дверь, теплопритоки и расположение датчика.'],
      ['Можно ли отключить дверную тревогу?','Параметры меняют только по документации и без отключения защитной функции. Сначала устраняют дверь, датчик или режим эксплуатации.']
    ]
  },
  'shokery-shkafy-shokovogo-okhlazhdeniya-i-zamorozki.html': {
    title:'Ремонт шкафов шокового охлаждения и заморозки | MosPochin',
    h1:'Шкафы шокового охлаждения и заморозки',
    description:'Ремонт профессиональных шокеров: циклы охлаждения и заморозки, термощуп, вентиляторы, испаритель, контроллер и холодильный контур.',
    eyebrow:'Управляемый технологический цикл',
    lead:'Проверяем не только конечную температуру камеры, но и выбранную программу, температуру продукта, термощуп, скорость вентиляции и завершение цикла.',
    kind:'subhub', equipment:'blast_chiller',
    introTitle:'Шокер не предназначен для обычного хранения',
    intro:[
      'Шкаф шокового охлаждения быстро отводит тепло от продукта и завершает цикл по времени либо по температуре сердцевины. После цикла оборудование может перейти в поддержание, но это не заменяет постоянную холодильную камеру.',
      'Результат зависит от загрузки, размера порций, положения термощупа, воздушного потока и выбранной программы. Поэтому «камера холодная» ещё не подтверждает, что продукт проходит цикл правильно.'
    ],
    cards:[
      ['ri-timer-flash-line','Цикл по времени','Контроль заданной длительности и перехода в хранение.'],
      ['ri-temp-cold-line','Цикл по термощупу','Температура сердцевины продукта определяет завершение.'],
      ['ri-windy-line','Интенсивный поток','Вентиляторы и испаритель обеспечивают быстрый теплообмен.'],
      ['ri-dashboard-3-line','Программа и журнал','Контроллер хранит режимы, тревоги и условия остановки.']
    ],
    steps:[
      'Указать программу: охлаждение, заморозка или поддержание.',
      'Зафиксировать исходную и конечную температуру продукта и длительность цикла.',
      'Проверить правильное положение чистого термощупа, если цикл выполняется по продукту.',
      'Не перегружать направляющие и не перекрывать воздушный поток.'
    ],
    matrix:[
      ['Термощуп','Цикл не завершается или завершается слишком рано','Положение, температура, кабель, разъём и калибровка'],
      ['Вентиляторы','Продукт охлаждается неравномерно','Вращение, скорость, лёд и свободный поток'],
      ['Испаритель и оттайка','Производительность падает между циклами','Обмерзание, датчик, оттайка и дренаж'],
      ['Контроллер','Неверная программа или остановка с тревогой','Режим, параметры, датчики и журнал сообщений'],
      ['Холодильный контур','Камера не достигает мощности под нагрузкой','Компрессор, конденсатор, расширение и герметичность']
    ],
    faq:[
      ['Почему шокер нельзя оценивать только по температуре воздуха?','Цель цикла — температура продукта за заданное время. Воздух меняется быстрее и не заменяет измерение сердцевины.'],
      ['Что делать, если шокер не видит термощуп?','Проверить чистоту, подключение и отсутствие видимого повреждения. Внутреннюю цепь и калибровку проверяет специалист по документации модели.'],
      ['Можно ли использовать шокер как морозильный шкаф?','Режим поддержания зависит от модели, но основной назначенный процесс — быстрое охлаждение или заморозка. Постоянное хранение проектируют отдельно.']
    ]
  },
  'holodilnoe-oborudovanie-ne-holodit.html': {
    title:'Холодильное оборудование не холодит — диагностика | MosPochin',
    h1:'Холодильное оборудование не холодит',
    description:'Что проверить, если профессиональное холодильное оборудование не холодит: двери, вентиляторы, конденсатор, оттайка, датчики, компрессор и контур.',
    eyebrow:'Симптом: температура не снижается',
    lead:'Разделяем полный отказ охлаждения, медленный набор температуры и неравномерный холод — это разные диагностические сценарии.',
    kind:'symptom', equipment:'commercial_refrigeration',
    introTitle:'Сначала исключить условия, которые имитируют неисправность',
    intro:[
      'Температура может расти из-за длительно открытой двери, горячей загрузки, перекрытого воздушного потока, загрязнённого конденсатора или обмерзания испарителя. Эти причины проверяют до вмешательства в герметичный контур.',
      'Если компрессор не запускается, проверяют питание, контроллер, реле, контактор и защиту. Если работает без остановки, но холода недостаточно, диагностируют теплообмен и холодильный контур по модели и хладагенту.'
    ],
    cards:[
      ['ri-door-open-line','Дверь и загрузка','Теплоприток, уплотнение и перекрытие циркуляции.'],
      ['ri-windy-line','Воздушный тракт','Конденсатор, испаритель и вентиляторы.'],
      ['ri-cpu-line','Управление','Уставка, датчик, контроллер и исполнительные выходы.'],
      ['ri-settings-3-line','Холодильный контур','Компрессор, расширение, герметичность и хладагент.']
    ],
    steps:[
      'Проверить уставку, фактическую температуру и закрытие двери.',
      'Убедиться, что продукты не закрывают решётки и вентиляторы.',
      'Зафиксировать работу компрессора, вентиляторов и наличие льда.',
      'Не выполнять дозаправку без поиска причины и данных шильдика.'
    ],
    matrix:[
      ['Датчик или уставка','Контроллер показывает неверную температуру или не включает охлаждение','Сравнение с прибором, датчик, параметры и проводка'],
      ['Конденсатор','Компрессор горячий, холод набирается медленно','Загрязнение, воздух, вентилятор и температура помещения'],
      ['Испаритель','Слабый поток, лёд или локальный холод','Вентилятор, оттайка, загрязнение и питание хладагента'],
      ['Компрессор и защита','Не запускается или выключается по защите','Напряжение, ток, пусковые элементы, температура и защита'],
      ['Герметичный контур','Компрессор работает постоянно без результата','Герметичность, расширительное устройство, параметры и масса заправки']
    ],
    faq:[
      ['Почему оборудование не холодит после разморозки?','Проверяют, завершилась ли оттайка, включились ли вентиляторы и компрессор, а также датчики и дренаж.'],
      ['Можно ли продолжать хранить продукты?','Продукты переносят в исправное оборудование, если температура выходит из установленного режима хранения.'],
      ['Всегда ли причина в хладагенте?','Нет. Частые причины находятся в дверях, воздушном потоке, загрязнении, вентиляторах, оттайке, датчиках и управлении.']
    ]
  },
  'ldogenerator-ne-proizvodit-led.html': {
    title:'Льдогенератор не производит лёд — диагностика | MosPochin',
    h1:'Льдогенератор не производит лёд',
    description:'Льдогенератор не производит лёд: проверка воды, фильтра, насоса, замораживания, сброса, датчика бункера и холодильной системы.',
    eyebrow:'Симптом: цикл не даёт готового льда',
    lead:'Определяем, на каком этапе остановилась машина: нет воды, нет замораживания, лёд не сбрасывается или контроллер считает бункер полным.',
    kind:'symptom', equipment:'ice_machine',
    introTitle:'Одинаковый результат — четыре разных этапа отказа',
    intro:[
      'Если вода не поступает, проверяются кран, фильтр, клапан и уровень. Если вода циркулирует, но не замерзает, внимание смещается к холодильной системе и управлению. Сформированный лёд может не попасть в бункер из-за harvest-системы, механики или шнека.',
      'У некоторых машин производство блокируется датчиком заполнения. Загрязнение или лёд перед оптическим датчиком способны имитировать полный бункер, но конкретная процедура зависит от модели.'
    ],
    cards:[
      ['ri-drop-line','Нет воды','Кран, фильтр, клапан, резервуар и датчик уровня.'],
      ['ri-snowflake-line','Нет замораживания','Компрессор, конденсатор, испаритель и контроллер.'],
      ['ri-loop-left-line','Нет сброса','Горячий газ, пластина, датчик, привод или шнек.'],
      ['ri-inbox-archive-line','Ложный полный бункер','Датчик, желоб, загрязнение или положение льда.']
    ],
    steps:[
      'Указать модель, тип льда и серийный номер.',
      'Проверить внешний кран и доступный фильтр воды.',
      'Зафиксировать, появляется ли вода, холодеет ли испаритель и формируется ли лёд.',
      'Не обходить датчики и не запускать машину с водой возле электрической части.'
    ],
    matrix:[
      ['Впуск и фильтр','Цикл не получает требуемый объём воды','Давление, фильтр, клапан, резервуар и уровень'],
      ['Водяной насос','Вода есть, но не циркулирует по испарителю','Питание, крыльчатка, загрязнение и трубки'],
      ['Холодильная система','Испаритель не замораживает воду','Компрессор, конденсатор, расширение и герметичность'],
      ['Harvest или шнек','Лёд сформирован, но не выдаётся','Клапан горячего газа, датчик, привод, редуктор или механика'],
      ['Датчик бункера','Производство не начинается при пустом бункере','Чистота, положение, сигнал и проводка']
    ],
    faq:[
      ['Почему машина гудит, но лёд не появляется?','Звук не подтверждает исправность насоса, компрессора или привода. Нужно определить работающий узел и этап остановки.'],
      ['Можно ли очистить датчик бункера самостоятельно?','Только доступным способом из руководства конкретной модели, после безопасного отключения и без изменения положения или проводки датчика.'],
      ['Почему после замены фильтра лёд не появился?','Остаются другие контуры: клапан, насос, замораживание, сброс, дренаж, датчики и управление.']
    ]
  }
};

function evidenceList(ids){
  return ids.map((id)=>{const e=evidenceById.get(id); if(!e) throw new Error(`Unknown evidence ${id}`);return `<li class="rounded-2xl border border-slate-200 bg-white p-5" data-evidence-id="${esc(id)}"><a class="font-bold text-brand-blue underline" href="${esc(e.url)}" rel="noopener noreferrer" target="_blank">${esc(e.manufacturer)} — ${esc(e.title)}</a><span class="mt-2 block text-sm text-slate-600">Применимость: ${esc((e.modelScope||[]).join(', '))}</span></li>`;}).join('');
}
function faqSchema(page,title,faq){return `<script type="application/ld+json" data-generated="faq-registry">${JSON.stringify({'@context':'https://schema.org','@type':'FAQPage','@id':`https://mospochin.ru/${page}#faq`,url:`https://mospochin.ru/${page}`,name:title,mainEntity:faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))},null,2)}</script>`;}
function head(page, entry, spec){
  const type=spec.kind==='article'?'Article':'Service';
  const primary=type==='Article'?{'@context':'https://schema.org','@type':'Article','@id':`https://mospochin.ru/${page}#article`,url:`https://mospochin.ru/${page}`,headline:spec.h1,description:spec.description,inLanguage:'ru-RU',author:{'@id':'https://mospochin.ru/#organization'},publisher:{'@id':'https://mospochin.ru/#organization'}}:{'@context':'https://schema.org','@type':'Service','@id':`https://mospochin.ru/${page}#service`,url:`https://mospochin.ru/${page}`,name:spec.h1,description:spec.description,serviceType:spec.h1,provider:{'@type':'LocalBusiness','@id':'https://mospochin.ru/#organization'},areaServed:'Москва и Московская область',inLanguage:'ru-RU'};
  const parent=page==='ice-machines.html'?'holodilnoe-oborudovanie.html':(page==='ldogenerator-ne-proizvodit-led.html'?'ice-machines.html':'holodilnoe-oborudovanie.html');
  const parentName=parent==='ice-machines.html'?'Льдогенераторы':'Холодильное оборудование';
  const crumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Главная',item:'https://mospochin.ru/'},{'@type':'ListItem',position:2,name:'Профессиональное холодильное оборудование',item:'https://mospochin.ru/holodilnoe-oborudovanie.html'},...(page==='holodilnoe-oborudovanie.html'?[]:(parent==='ice-machines.html'?[{'@type':'ListItem',position:3,name:parentName,item:`https://mospochin.ru/${parent}`},{'@type':'ListItem',position:4,name:spec.h1,item:`https://mospochin.ru/${page}`}]:[{'@type':'ListItem',position:3,name:spec.h1,item:`https://mospochin.ru/${page}`}]))]};
  return `<!DOCTYPE html><html lang="ru" class="scroll-smooth"><head><link rel="preload" href="/assets/fonts/manrope-700.woff2" as="font" type="font/woff2" crossorigin><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="preload" href="/assets/fonts/manrope.css" as="style"><link rel="stylesheet" href="/assets/fonts/manrope.css"><link rel="preload" href="/assets/fonts/remixicon.css" as="style"><link rel="stylesheet" href="/assets/fonts/remixicon.css"><link rel="preload" href="styles-combined.css" as="style"><link rel="stylesheet" href="styles-combined.css"><script src="main.js" defer></script><script src="telegram-form.js" defer></script><script src="analytics.js" defer></script><title>${esc(spec.title)}</title><meta name="description" content="${esc(spec.description)}"><meta property="og:title" content="${esc(spec.title)}"><meta property="og:description" content="${esc(spec.description)}"><meta property="og:image" content="https://mospochin.ru/og-image.svg"><meta property="og:url" content="https://mospochin.ru/${page}"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(spec.title)}"><meta name="twitter:description" content="${esc(spec.description)}"><meta name="twitter:image" content="https://mospochin.ru/og-image.svg"><link rel="canonical" href="https://mospochin.ru/${page}"><script type="application/ld+json">${JSON.stringify(primary,null,2)}</script><script type="application/ld+json">${JSON.stringify(crumb,null,2)}</script>${faqSchema(page,spec.h1,spec.faq)}</head>`;
}
function cards(items){return `<div class="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">${items.map(([icon,t,d])=>`<article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><i class="${icon} text-3xl text-brand-orange"></i><h3 class="mt-4 text-lg font-extrabold text-brand-blue">${esc(t)}</h3><p class="mt-2 leading-relaxed text-slate-600">${esc(d)}</p></article>`).join('')}</div>`;}
function list(items){return items.map((x,i)=>`<li class="rounded-2xl border border-slate-200 bg-white p-5"><span class="text-sm font-extrabold text-brand-orange">${String(i+1).padStart(2,'0')}</span><p class="mt-2 leading-relaxed text-slate-700">${esc(x)}</p></li>`).join('');}
function matrix(rows){return `<div class="mt-8 overflow-x-auto rounded-2xl border border-slate-200"><table class="min-w-full bg-white text-left"><thead class="bg-slate-100"><tr><th class="px-4 py-4">Контур или узел</th><th class="px-4 py-4">Проявление</th><th class="px-4 py-4">Что проверяется</th></tr></thead><tbody>${rows.map(r=>`<tr class="border-t border-slate-200"><td class="px-4 py-4 font-bold text-brand-blue">${esc(r[0])}</td><td class="px-4 py-4 text-slate-600">${esc(r[1])}</td><td class="px-4 py-4 text-slate-600">${esc(r[2])}</td></tr>`).join('')}</tbody></table></div>`;}
function related(page,slug){return `<section class="bg-slate-50 py-16"><div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><p class="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-orange">Связанные страницы</p><h2 class="mt-3 text-3xl font-display font-extrabold text-brand-blue">Перейти к типу оборудования или симптому</h2><div class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">${commonLinks.filter(x=>x[0]!==page).map(([href,t,d],i)=>`<a class="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-orange hover:shadow-md" href="${href}" data-block="related_links" data-cta-group="internal_link" data-cta-id="${slug}_related_${i+1}"><span class="block font-bold text-brand-blue">${esc(t)}</span><span class="mt-1 block text-sm text-slate-500">${esc(d)}</span></a>`).join('')}</div></div></section>`;}
function form(spec,slug){return `<section class="bg-brand-blue py-16" id="request"><div class="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8"><div class="text-white"><p class="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-orange">Заявка на диагностику</p><h2 class="mt-3 text-3xl font-display font-extrabold">Передайте шильдик и параметры работы</h2><p class="mt-4 leading-relaxed text-white/75">Модель, контроллер, уставка, фактическая температура и этап сбоя позволяют подготовить корректный диагностический сценарий.</p><a href="tel:+79990057172" class="mt-6 inline-flex items-center gap-2 font-extrabold text-white" data-block="request" data-cta-group="phone" data-cta-id="${slug}_request_phone"><i class="ri-phone-line"></i>8 (999) 005-71-72</a></div><form class="telegram-form rounded-3xl border border-slate-200 bg-white p-6 shadow-xl lg:p-8" data-block="lead_form" data-contact-form="primary" data-cta-group="lead_form" data-cta-id="${slug}_form_01"><input name="problem" type="hidden" value="${esc(spec.h1)}"><input name="cluster" type="hidden" value="refrigeration"><div class="grid gap-5 md:grid-cols-2"><div><label class="mb-2 block text-sm font-bold text-slate-700">Ваше имя</label><input autocomplete="name" class="w-full rounded-xl border-2 border-slate-200 px-4 py-3" name="name" type="text"></div><div><label class="mb-2 block text-sm font-bold text-slate-700">Телефон *</label><input autocomplete="tel" class="w-full rounded-xl border-2 border-slate-200 px-4 py-3" inputmode="tel" name="phone" required type="tel"></div><div><label class="mb-2 block text-sm font-bold text-slate-700">Производитель и модель</label><input class="w-full rounded-xl border-2 border-slate-200 px-4 py-3" name="equipment_model" placeholder="Polair, IRINOX, Hoshizaki..." type="text"></div><div><label class="mb-2 block text-sm font-bold text-slate-700">Контроллер или код</label><input class="w-full rounded-xl border-2 border-slate-200 px-4 py-3" name="error_code" placeholder="По дисплею или шильдику" type="text"></div><div><label class="mb-2 block text-sm font-bold text-slate-700">Этап работы</label><select class="w-full rounded-xl border-2 border-slate-200 px-4 py-3" name="cycle_stage"><option value="">Выберите этап</option><option value="pull_down">Набор температуры</option><option value="holding">Поддержание</option><option value="defrost">Оттайка</option><option value="blast_chilling">Шоковое охлаждение</option><option value="blast_freezing">Шоковая заморозка</option><option value="ice_production">Производство льда</option><option value="harvest">Сброс льда</option></select></div><div><label class="mb-2 block text-sm font-bold text-slate-700">Серийный номер</label><input class="w-full rounded-xl border-2 border-slate-200 px-4 py-3" name="serial_number" type="text"></div><div><label class="mb-2 block text-sm font-bold text-slate-700">Уставка</label><input class="w-full rounded-xl border-2 border-slate-200 px-4 py-3" name="temperature_setpoint" placeholder="Например, +2 °C" type="text"></div><div><label class="mb-2 block text-sm font-bold text-slate-700">Фактическая температура</label><input class="w-full rounded-xl border-2 border-slate-200 px-4 py-3" name="temperature_actual" placeholder="По дисплею или термометру" type="text"></div><div class="md:col-span-2"><label class="mb-2 block text-sm font-bold text-slate-700">Что происходит</label><textarea class="w-full rounded-xl border-2 border-slate-200 px-4 py-3" name="details" placeholder="Опишите температуру, звук, лёд, воду и повторяемость" rows="4"></textarea></div></div><button class="mt-5 w-full rounded-xl bg-green-600 px-6 py-4 text-lg font-extrabold text-white" type="submit"><i class="ri-send-plane-line mr-2"></i>Отправить заявку</button></form></div></section>`;}
function faqSection(faq){return `<section class="bg-white py-16"><div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"><p class="text-center text-sm font-extrabold uppercase tracking-[0.2em] text-brand-orange">FAQ</p><h2 class="mt-3 text-center text-3xl font-display font-extrabold text-brand-blue">Частые вопросы</h2><div class="mt-8 grid gap-4">${faq.map(([q,a])=>`<details class="rounded-2xl border border-slate-200 bg-white p-5"><summary class="cursor-pointer font-bold text-brand-blue">${esc(q)}</summary><p class="mt-3 leading-relaxed text-slate-600">${esc(a)}</p></details>`).join('')}</div></div></section>`;}
function main(page,entry,spec){const slug=slugOf(page);const isHub=page==='holodilnoe-oborudovanie.html';const parent=page==='ldogenerator-ne-proizvodit-led.html'?'ice-machines.html':'holodilnoe-oborudovanie.html';return `<main><nav class="border-b border-slate-100 bg-white"><div class="mx-auto max-w-6xl px-4 py-4 text-sm text-slate-500 sm:px-6 lg:px-8"><a class="hover:text-brand-blue" href="${isHub?'uslugi.html':parent}" data-block="breadcrumb" data-cta-group="internal_link" data-cta-id="${slug}_breadcrumb_parent">${isHub?'Ресторанное оборудование':(parent==='ice-machines.html'?'Льдогенераторы':'Холодильное оборудование')}</a>${isHub?'':'<span class="mx-2">/</span><span>'+esc(spec.h1)+'</span>'}</div></nav><section class="bg-gradient-to-br from-brand-blue via-slate-900 to-slate-800 py-20 text-white lg:py-28"><div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><p class="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-orange">${esc(spec.eyebrow)}</p><h1 class="mt-4 max-w-5xl text-4xl font-display font-extrabold leading-tight sm:text-5xl lg:text-6xl">${esc(spec.h1)}</h1><p class="mt-6 max-w-3xl text-lg leading-relaxed text-white/80 sm:text-xl">${esc(spec.lead)}</p><div class="mt-8 flex flex-wrap gap-3"><a class="rounded-xl bg-brand-orange px-6 py-4 font-extrabold text-white" href="#diagnostics" data-block="hero" data-cta-group="diagnostic" data-cta-id="${slug}_hero_diagnostics">Разобрать симптом</a><a class="rounded-xl border border-white/30 px-6 py-4 font-extrabold text-white" href="#request" data-block="hero" data-cta-group="lead_form" data-cta-id="${slug}_hero_request">Передать данные инженеру</a></div></div></section><section class="bg-white py-16 lg:py-24"><div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><p class="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-orange">Технический контекст</p><h2 class="mt-3 text-3xl font-display font-extrabold text-brand-blue">${esc(spec.introTitle)}</h2><div class="mt-6 max-w-4xl space-y-4 text-lg leading-relaxed text-slate-600">${spec.intro.map(x=>`<p>${esc(x)}</p>`).join('')}</div>${cards(spec.cards)}</div></section><section class="bg-slate-50 py-16" id="diagnostics"><div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><p class="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-orange">Порядок проверки</p><h2 class="mt-3 text-3xl font-display font-extrabold text-brand-blue">Что зафиксировать до разборки</h2><ol class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">${list(spec.steps)}</ol></div></section><section class="bg-white py-16" data-site-view-event="refrigeration_cause_matrix_viewed"><div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><p class="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-orange">Матрица диагностики</p><h2 class="mt-3 text-3xl font-display font-extrabold text-brand-blue">Какие контуры проверяются</h2>${matrix(spec.matrix)}</div></section>${related(page,slug)}${form(spec,slug)}<section class="border-t border-slate-200 bg-white py-12"><div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"><h2 class="text-2xl font-display font-extrabold text-brand-blue">Официальные материалы по оборудованию</h2><p class="mt-3 text-slate-600">Технические утверждения и процедуры применяются только в пределах указанных типов, серий и контроллеров.</p><ul class="mt-6 grid gap-4 md:grid-cols-2">${evidenceList(entry.evidenceIds)}</ul></div></section></main>`;}

for(const [page,spec] of Object.entries(pages)){
  const entry=manifestByPage.get(page); if(!entry) throw new Error(`Manifest missing ${page}`);
  entry.title=spec.title; entry.h1=spec.h1; entry.status='published'; entry.publicationWave='RF2';
  const slug=slugOf(page);
  const header=headerTemplate.replaceAll('diagnostika-kuttera',slug);
  const footer=footerTemplate.replaceAll('diagnostika-kuttera',slug);
  const body=`<body class="font-sans text-slate-800 antialiased bg-white branch-restaurant page-refrigeration page-refrigeration-${esc(spec.kind)} page-${slug}" data-page-slug="${slug}" data-page-intent="${esc(entry.metrics.pageIntent)}" data-equipment="${esc(spec.equipment)}" data-service="${esc(entry.metrics.service)}" data-commercial-segment="b2b_kitchen">${header}${main(page,entry,spec)}${faqSection(spec.faq)}${footer}</body></html>`;
  fs.writeFileSync(path.join(root,page),head(page,entry,spec)+body+'\n');
  if(taxonomyByPage.has(page)){const t=taxonomyByPage.get(page);t.status='published';t.publicationState='published';}
  if(symptomPageByPage.has(page)) symptomPageByPage.get(page).status='published';
}
manifest.checkedAt='2026-07-15';writeJson('data/refrigeration-cluster-pages.json',manifest);writeJson('data/refrigeration-fault-taxonomy.json',taxonomy);writeJson('data/refrigeration-symptom-pages.json',symptomPages);
const graph=readJson('data/refrigeration-link-graph.json');graph.mode='published-pilot-rf2';for(const n of graph.nodes){const entry=manifestByPage.get(n.page);if(entry){n.status=entry.status;n.indexable=entry.indexable;n.pageType=entry.pageType;}if(pages[n.page]){n.actualOutgoing=commonLinks.filter(([p])=>p!==n.page).map(([p])=>p);n.plannedOutgoing=n.actualOutgoing;}}graph.checkedAt='2026-07-15';writeJson('data/refrigeration-link-graph.json',graph);
const shots=readJson('data/refrigeration-screenshot-audit.json');shots.status='pilot-rf2';shots.pages=Object.keys(pages).map(page=>({page,branch:'restaurant',pageType:'service',fullPage:true}));shots.checkedAt='2026-07-15';writeJson('data/refrigeration-screenshot-audit.json',shots);
const registry=readJson('data/cluster-registry.json');registry.clusters.refrigeration.status='pilot';writeJson('data/cluster-registry.json',registry);
const metadata=readJson('data/page-metadata.json');for(const [page,spec] of Object.entries(pages)){metadata.pages[page]={title:spec.title,description:spec.description,canonical:`https://mospochin.ru/${page}`,ogUrl:`https://mospochin.ru/${page}`,hasForm:true,branch:'restaurant'};}writeJson('data/page-metadata.json',metadata);
const metrics=readJson('data/metrics-page-context.json');for(const [page,spec] of Object.entries(pages)){const e=manifestByPage.get(page);metrics.pages[page]={page_slug:slugOf(page),page_intent:e.pageType==='hub'?'hub':e.pageType==='subhub'?'hub':e.pageType==='symptom_service'?'symptom_service':'service',equipment:spec.equipment,brand:'',service:e.metrics.service,commercial_segment:'b2b_kitchen',branch:'restaurant',source:'refrigeration_manifest'};}writeJson('data/metrics-page-context.json',metrics);
console.log(`Generated RF2 pilot: ${Object.keys(pages).length} published refrigeration pages.`);
