/**
 * Seed: Computer Science B1 + Computer Science B1-C1
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/seed-esp-cs.ts
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 */

import * as fs from 'fs'
import * as path from 'path'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ─── load .env.local ──────────────────────────────────────────────────────────
function loadEnv() {
  const envFile = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envFile)) return
  const lines = fs.readFileSync(envFile, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx < 0) continue
    const key = trimmed.slice(0, idx).trim()
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
    if (key && !(key in process.env)) process.env[key] = val
  }
}
loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const db: SupabaseClient = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
})

// ─── course IDs ───────────────────────────────────────────────────────────────
const CS_B1_ID    = '9d3d5a99-ba18-4136-807c-d1a347d438fa'
const CS_B1C1_ID  = 'a1000000-0000-0000-0000-000000000007'

// ─── types ────────────────────────────────────────────────────────────────────
type W  = { en: string; ru: string }
type LD = { title: string; words: W[] }
type MD = { title: string; section: string; lessons: LD[] }

// ─── helpers ──────────────────────────────────────────────────────────────────
function w(en: string, ru: string): W { return { en, ru } }

// ─── vocabulary data ──────────────────────────────────────────────────────────

// Module 1 – Computer Fundamentals (B1)
const mod_fundamentals: MD = {
  title: 'Computer Fundamentals', section: 'B1', lessons: [
    {
      title: 'Hardware',
      words: [
        w('processor','процессор'), w('motherboard','материнская плата'), w('RAM','оперативная память'),
        w('GPU','видеокарта'), w('SSD','твердотельный накопитель'), w('HDD','жёсткий диск'),
        w('power supply','блок питания'), w('cooling fan','вентилятор охлаждения'), w('USB port','порт USB'),
        w('circuit board','печатная плата'), w('bit','бит'), w('byte','байт'), w('chip','микросхема'),
        w('driver','драйвер'), w('firmware','прошивка'), w('cache','кэш'), w('component','компонент'),
        w('peripheral','периферийное устройство'), w('benchmark','тест производительности'),
        w('clock speed','тактовая частота'), w('thermal paste','термопаста'), w('heat sink','радиатор охлаждения'),
        w('NVMe','NVMe-накопитель'), w('BIOS','BIOS'), w('overclocking','разгон процессора'),
      ],
    },
    {
      title: 'Software',
      words: [
        w('application','приложение'), w('operating system','операционная система'), w('install','устанавливать'),
        w('update','обновление'), w('license','лицензия'), w('open-source','открытый исходный код'),
        w('malware','вредоносное ПО'), w('patch','патч / исправление'), w('plugin','плагин'),
        w('executable','исполняемый файл'), w('interface','интерфейс'), w('compatibility','совместимость'),
        w('subscription','подписка'), w('trial version','пробная версия'), w('uninstall','удалять программу'),
        w('background process','фоновый процесс'), w('system requirements','системные требования'),
        w('freeware','бесплатное ПО'), w('proprietary','проприетарный'), w('middleware','промежуточное ПО'),
        w('runtime','среда выполнения'), w('package manager','пакетный менеджер'), w('dependency','зависимость'),
        w('repository','репозиторий'), w('sandbox','изолированная среда'),
      ],
    },
    {
      title: 'Operating Systems',
      words: [
        w('boot','загрузка системы'), w('login','вход в систему'), w('user account','учётная запись'),
        w('desktop','рабочий стол'), w('file system','файловая система'), w('kernel','ядро ОС'),
        w('process','процесс'), w('multitasking','многозадачность'), w('administrator','администратор'),
        w('permissions','права доступа'), w('virtual memory','виртуальная память'), w('task manager','диспетчер задач'),
        w('system crash','сбой системы'), w('recovery mode','режим восстановления'), w('shell','командная оболочка'),
        w('log file','журнал событий'), w('shutdown','завершение работы'), w('registry','реестр системы'),
        w('update manager','менеджер обновлений'), w('network settings','сетевые настройки'),
        w('daemon','фоновая служба'), w('interrupt','прерывание'), w('swap space','файл подкачки'),
        w('paging','подкачка страниц'), w('system call','системный вызов'),
      ],
    },
    {
      title: 'Files & Storage',
      words: [
        w('folder','папка'), w('directory','директория'), w('file path','путь к файлу'),
        w('extension','расширение файла'), w('compression','сжатие данных'), w('archive','архив'),
        w('backup','резервная копия'), w('USB drive','флэш-накопитель'), w('cloud storage','облачное хранилище'),
        w('synchronisation','синхронизация'), w('recycle bin','корзина'), w('metadata','метаданные'),
        w('read-only','только для чтения'), w('encryption','шифрование'), w('partition','раздел диска'),
        w('file size','размер файла'), w('shortcut','ярлык'), w('format','форматирование'),
        w('RAID','RAID-массив'), w('NAS','сетевое хранилище'), w('symlink','символическая ссылка'),
        w('mount point','точка монтирования'), w('sector','сектор'), w('cluster','кластер диска'),
        w('version history','история версий'),
      ],
    },
    {
      title: 'Input & Output',
      words: [
        w('keyboard','клавиатура'), w('mouse','мышь'), w('monitor','монитор'), w('printer','принтер'),
        w('scanner','сканер'), w('webcam','веб-камера'), w('microphone','микрофон'),
        w('touchscreen','сенсорный экран'), w('resolution','разрешение экрана'), w('refresh rate','частота обновления'),
        w('input device','устройство ввода'), w('output device','устройство вывода'), w('cursor','курсор'),
        w('drag and drop','перетащить и отпустить'), w('connector','разъём'), w('cable','кабель'),
        w('gesture','жест'), w('display','дисплей'), w('accessibility','специальные возможности'),
        w('HDMI','порт HDMI'), w('DPI','DPI (точек на дюйм)'), w('touchpad','тачпад'),
        w('graphic tablet','графический планшет'), w('barcode scanner','сканер штрихкодов'),
        w('biometric reader','биометрический считыватель'),
      ],
    },
    {
      title: 'Computer History',
      words: [
        w('inventor','изобретатель'), w('mainframe','мэйнфрейм'), w('transistor','транзистор'),
        w('integrated circuit','интегральная схема'), w('personal computer','персональный компьютер'),
        w('vacuum tube','электронная лампа'), w('generation','поколение техники'), w('breakthrough','прорыв'),
        w('patent','патент'), w('prototype','прототип'), w('innovation','инновация'), w('milestone','веха'),
        w('pioneer','пионер'), w('digital age','цифровая эпоха'), w('computing power','вычислительная мощность'),
        w('legacy system','устаревшая система'), w('commercialise','коммерциализировать'),
        w('revolution','революция'), w('evolve','эволюционировать'), w('von Neumann architecture','архитектура фон Неймана'),
        w('Turing machine','машина Тьюринга'), w("Moore's law","Закон Мура"),
        w('microprocessor','микропроцессор'), w('GUI','графический интерфейс'), w('internet','интернет'),
      ],
    },
  ],
}

// Module 2 – Programming Basics (B1)
const mod_programming: MD = {
  title: 'Programming Basics', section: 'B1', lessons: [
    {
      title: 'Variables & Data Types',
      words: [
        w('variable','переменная'), w('integer','целое число'), w('string','строка'),
        w('boolean','логическое значение'), w('float','число с плавающей точкой'), w('array','массив'),
        w('constant','константа'), w('null','нулевое значение'), w('data type','тип данных'),
        w('declare','объявлять'), w('assign','присваивать'), w('value','значение'),
        w('type casting','преобразование типа'), w('scope','область видимости'),
        w('global variable','глобальная переменная'), w('local variable','локальная переменная'),
        w('initialise','инициализировать'), w('undefined','неопределённое значение'), w('mutable','изменяемый'),
        w('memory address','адрес памяти'), w('char','символьный тип'), w('double','число с двойной точностью'),
        w('pointer','указатель'), w('reference','ссылка'), w('type inference','вывод типа'),
      ],
    },
    {
      title: 'Conditions & Loops',
      words: [
        w('condition','условие'), w('if statement','условный оператор'), w('else','иначе'),
        w('loop','цикл'), w('iteration','итерация'), w('while loop','цикл while'),
        w('for loop','цикл for'), w('break','прерывание цикла'), w('continue','продолжить итерацию'),
        w('boolean expression','логическое выражение'), w('comparison operator','оператор сравнения'),
        w('logical operator','логический оператор'), w('nested','вложенный'), w('infinite loop','бесконечный цикл'),
        w('counter','счётчик'), w('increment','увеличивать'), w('decrement','уменьшать'),
        w('switch statement','оператор switch'), w('case','вариант'), w('flowchart','блок-схема'),
        w('ternary operator','тернарный оператор'), w('do-while loop','цикл do-while'),
        w('foreach','цикл foreach'), w('enum','перечисление'), w('short-circuit evaluation','короткое вычисление'),
      ],
    },
    {
      title: 'Functions',
      words: [
        w('function','функция'), w('parameter','параметр'), w('argument','аргумент'),
        w('return value','возвращаемое значение'), w('call','вызывать'), w('recursion','рекурсия'),
        w('built-in function','встроенная функция'), w('library','библиотека'), w('method','метод'),
        w('syntax','синтаксис'), w('code block','блок кода'), w('modular','модульный'),
        w('reusable','многократно используемый'), w('overload','перегружать'), w('callback','функция обратного вызова'),
        w('anonymous function','анонимная функция'), w('lambda','лямбда-функция'), w('void','без возвращаемого значения'),
        w('define','определять'), w('higher-order function','функция высшего порядка'),
        w('pure function','чистая функция'), w('side effect','побочный эффект'),
        w('closure','замыкание'), w('currying','каррирование'), w('first-class function','функция первого класса'),
      ],
    },
    {
      title: 'Debugging',
      words: [
        w('bug','ошибка в коде'), w('debug','отлаживать'), w('debugger','отладчик'),
        w('breakpoint','точка остановки'), w('error message','сообщение об ошибке'),
        w('stack trace','трассировка стека'), w('syntax error','синтаксическая ошибка'),
        w('runtime error','ошибка времени выполнения'), w('logic error','логическая ошибка'),
        w('exception','исключение'), w('try-catch','блок обработки ошибок'), w('log','журналировать'),
        w('console','консоль'), w('unit test','модульный тест'), w('fix','исправление'),
        w('reproduce','воспроизводить'), w('isolate','изолировать'), w('validate','проверять'),
        w('refactor','рефакторинг'), w('regression','регрессионная ошибка'),
        w('stack overflow','переполнение стека'), w('memory leak','утечка памяти'),
        w('null pointer exception','исключение нулевого указателя'), w('profiler','профилировщик'),
        w('linter','линтер'),
      ],
    },
    {
      title: 'First Programs',
      words: [
        w('print','вывести на экран'), w('input','ввод данных'), w('output','вывод данных'),
        w('compile','компилировать'), w('run','запускать'), w('execute','выполнять'),
        w('command line','командная строка'), w('terminal','терминал'), w('IDE','среда разработки'),
        w('source code','исходный код'), w('comment','комментарий'), w('indentation','отступ'),
        w('save','сохранять'), w('interpreter','интерпретатор'), w('compiler','компилятор'),
        w('editor','редактор кода'), w('error','ошибка'), w('success','успешное выполнение'),
        w('Hello World','первая программа'), w('output window','окно вывода'),
        w('shebang','шебанг'), w('entry point','точка входа'), w('main function','главная функция'),
        w('REPL','интерактивная оболочка'), w('exit code','код завершения'),
      ],
    },
    {
      title: 'Code Structure',
      words: [
        w('class','класс'), w('object','объект'), w('module','модуль'), w('package','пакет'),
        w('import','импорт'), w('export','экспорт'), w('interface','интерфейс'),
        w('inheritance','наследование'), w('encapsulation','инкапсуляция'), w('abstraction','абстракция'),
        w('polymorphism','полиморфизм'), w('constructor','конструктор'), w('instance','экземпляр'),
        w('attribute','атрибут'), w('public','открытый'), w('private','закрытый'),
        w('static','статический'), w('design pattern','паттерн проектирования'),
        w('namespace','пространство имён'), w('dependency','зависимость'),
        w('abstract class','абстрактный класс'), w('mixin','примесь'), w('enumeration','перечисление'),
        w('generic type','обобщённый тип'), w('coupling','зацепление'),
      ],
    },
  ],
}

// Module 3 – Web & Internet (B1)
const mod_web: MD = {
  title: 'Web & Internet', section: 'B1', lessons: [
    {
      title: 'How the Web Works',
      words: [
        w('server','сервер'), w('client','клиент'), w('request','запрос'), w('response','ответ'),
        w('protocol','протокол'), w('HTTP','протокол HTTP'), w('HTTPS','защищённый HTTP'),
        w('IP address','IP-адрес'), w('network','сеть'), w('bandwidth','пропускная способность'),
        w('latency','задержка'), w('packet','пакет данных'), w('router','маршрутизатор'),
        w('hosting','хостинг'), w('domain','домен'), w('firewall','брандмауэр'),
        w('ISP','интернет-провайдер'), w('proxy','прокси-сервер'), w('port','сетевой порт'),
        w('TCP handshake','TCP-рукопожатие'), w('DNS resolution','DNS-разрешение'),
        w('CORS','CORS'), w('session management','управление сессией'),
        w('cookie','куки'), w('same-origin policy','политика одного источника'),
      ],
    },
    {
      title: 'HTML & CSS Basics',
      words: [
        w('tag','тег'), w('element','элемент'), w('attribute','атрибут HTML'),
        w('heading','заголовок'), w('paragraph','абзац'), w('link','ссылка'), w('image','изображение'),
        w('selector','CSS-селектор'), w('property','свойство CSS'), w('class','класс CSS'),
        w('margin','внешний отступ'), w('padding','внутренний отступ'), w('layout','макет'),
        w('responsive','адаптивный'), w('flexbox','флексбокс'), w('grid','CSS-сетка'),
        w('colour scheme','цветовая схема'), w('stylesheet','таблица стилей'),
        w('semantic','семантический'), w('inline style','встроенный стиль'),
        w('DOCTYPE','объявление DOCTYPE'), w('HTML5','HTML5'), w('ARIA','ARIA'),
        w('viewport','область просмотра'), w('media query','медиа-запрос'),
      ],
    },
    {
      title: 'Browsers',
      words: [
        w('browser','браузер'), w('URL','адрес страницы'), w('address bar','адресная строка'),
        w('tab','вкладка'), w('bookmark','закладка'), w('history','история посещений'),
        w('cache','кэш браузера'), w('cookie','куки'), w('extension','расширение браузера'),
        w('private mode','приватный режим'), w('developer tools','инструменты разработчика'),
        w('rendering','отображение страницы'), w('download','скачивать'), w('homepage','домашняя страница'),
        w('refresh','обновить страницу'), w('search engine','поисковая система'),
        w('autofill','автозаполнение'), w('compatibility','совместимость браузеров'),
        w('JavaScript engine','движок JavaScript'), w('DOM','объектная модель документа'),
        w('CSSOM','объектная модель стилей'), w('render tree','дерево отображения'),
        w('service worker','сервис-воркер'), w('PWA','прогрессивное веб-приложение'),
        w('web assembly','WebAssembly'),
      ],
    },
    {
      title: 'URLs & DNS',
      words: [
        w('URL','адрес страницы'), w('domain name','доменное имя'), w('subdomain','поддомен'),
        w('path','путь к ресурсу'), w('query string','строка запроса'), w('DNS','система доменных имён'),
        w('DNS lookup','DNS-запрос'), w('registrar','регистратор доменов'), w('TLD','домен верхнего уровня'),
        w('nameserver','сервер имён'), w('redirect','перенаправление'), w('SSL certificate','SSL-сертификат'),
        w('CDN','сеть доставки контента'), w('resolve','разрешать DNS-запрос'),
        w('WHOIS','база данных WHOIS'), w('canonical URL','каноническая ссылка'),
        w('propagation','распространение DNS'), w('IP mapping','сопоставление с IP'),
        w('root nameserver','корневой сервер имён'), w('ICANN','ICANN'),
        w('DNSSEC','DNSSEC'), w('zone file','файл зоны DNS'),
        w('reverse DNS','обратный DNS'), w('anycast DNS','anycast DNS'),
        w('DNS cache poisoning','отравление кэша DNS'),
      ],
    },
    {
      title: 'Web Applications',
      words: [
        w('web application','веб-приложение'), w('frontend','фронтенд'), w('backend','бэкенд'),
        w('database','база данных'), w('API','программный интерфейс'), w('authentication','аутентификация'),
        w('session','сессия'), w('dynamic content','динамическое содержимое'),
        w('static site','статический сайт'), w('framework','фреймворк'),
        w('deployment','развёртывание'), w('environment','среда выполнения'),
        w('version','версия'), w('dependency','зависимость'), w('build','сборка'),
        w('staging','тестовая среда'), w('production','производственная среда'),
        w('scalability','масштабируемость'), w('performance','производительность'),
        w('user experience','пользовательский опыт'), w('SPA','одностраничное приложение'),
        w('SSR','серверный рендеринг'), w('SSG','статическая генерация'),
        w('hydration','гидратация'), w('state management','управление состоянием'),
      ],
    },
    {
      title: 'Email & Messaging',
      words: [
        w('inbox','входящие'), w('subject line','тема письма'), w('attachment','вложение'),
        w('reply','ответить'), w('forward','переслать'), w('CC','копия письма'),
        w('BCC','скрытая копия'), w('spam','спам'), w('phishing','фишинг'),
        w('email client','почтовый клиент'), w('SMTP','протокол SMTP'), w('signature','подпись'),
        w('draft','черновик'), w('filter','фильтр'), w('mailing list','список рассылки'),
        w('newsletter','новостная рассылка'), w('instant messaging','мгновенные сообщения'),
        w('notification','уведомление'), w('unsubscribe','отписаться'), w('thread','ветка переписки'),
        w('POP3','протокол POP3'), w('bounced email','возвращённое письмо'),
        w('DKIM','DKIM'), w('SPF','SPF'), w('DMARC','DMARC'),
      ],
    },
  ],
}

// Module 4 – Digital Tools & Office (B1)
const mod_tools: MD = {
  title: 'Digital Tools & Office', section: 'B1', lessons: [
    {
      title: 'Spreadsheets',
      words: [
        w('cell','ячейка'), w('row','строка'), w('column','столбец'), w('formula','формула'),
        w('SUM','функция СУММ'), w('AVERAGE','среднее значение'), w('chart','диаграмма'),
        w('pivot table','сводная таблица'), w('conditional formatting','условное форматирование'),
        w('sort','сортировать'), w('filter','фильтровать'), w('merge','объединять ячейки'),
        w('freeze','закрепить строку'), w('worksheet','лист'), w('workbook','книга (файл)'),
        w('data validation','проверка данных'), w('VLOOKUP','функция ВПР'), w('macro','макрос'),
        w('absolute reference','абсолютная ссылка'), w('named range','именованный диапазон'),
        w('COUNTIF','функция СЧЁТЕСЛИ'), w('INDEX MATCH','INDEX + MATCH'),
        w('XLOOKUP','функция XLOOKUP'), w('dynamic array','динамический массив'),
        w('external data connection','внешнее подключение к данным'),
      ],
    },
    {
      title: 'Word Processing',
      words: [
        w('document','документ'), w('paragraph','абзац'), w('heading style','стиль заголовка'),
        w('font','шрифт'), w('bold','жирный'), w('italic','курсив'), w('underline','подчёркивание'),
        w('alignment','выравнивание'), w('indent','отступ'), w('bullet point','маркированный список'),
        w('numbered list','нумерованный список'), w('header','верхний колонтитул'),
        w('footer','нижний колонтитул'), w('page break','разрыв страницы'), w('comment','комментарий'),
        w('track changes','отслеживание изменений'), w('spell check','проверка орфографии'),
        w('word count','количество слов'), w('template','шаблон документа'),
        w('table of contents','оглавление'), w('style sheet','таблица стилей'),
        w('section break','разрыв раздела'), w('mail merge','слияние писем'),
        w('watermark','водяной знак'), w('cross-reference','перекрёстная ссылка'),
      ],
    },
    {
      title: 'Presentations',
      words: [
        w('slide','слайд'), w('slide deck','набор слайдов'), w('template','шаблон'),
        w('transition','переход между слайдами'), w('animation','анимация'),
        w('speaker notes','заметки докладчика'), w('design theme','тема оформления'),
        w('embed','встраивать'), w('presentation mode','режим презентации'),
        w('aspect ratio','соотношение сторон'), w('export','экспортировать'),
        w('thumbnail','миниатюра'), w('slideshow','показ слайдов'), w('handout','раздаточный материал'),
        w('rehearse','репетировать'), w('timing','хронометраж'), w('key message','ключевое сообщение'),
        w('slide master','мастер слайдов'), w('Presenter View','режим докладчика'),
        w('hidden slide','скрытый слайд'), w('custom show','настраиваемый показ'),
        w('widescreen','широкоэкранный'), w('action button','кнопка действия'),
        w('16:9 format','формат 16:9'), w('compress media','сжать медиафайлы'),
      ],
    },
    {
      title: 'Cloud Storage',
      words: [
        w('upload','загружать в облако'), w('download','скачивать'), w('sync','синхронизировать'),
        w('share','поделиться'), w('permissions','права доступа'), w('storage quota','квота хранилища'),
        w('backup','резервная копия'), w('version history','история версий'),
        w('offline access','доступ без интернета'), w('collaboration','совместная работа'),
        w('file size limit','ограничение размера файла'), w('encryption','шифрование'),
        w('recovery','восстановление'), w('cloud provider','облачный провайдер'),
        w('migrate','мигрировать данные'), w('two-factor authentication','двухфакторная аутентификация'),
        w('access token','токен доступа'), w('service account','сервисный аккаунт'),
        w('public link','публичная ссылка'), w('folder structure','структура папок'),
        w('shared drive','общий диск'), w('retention policy','политика хранения'),
        w('legal hold','юридическое удержание'), w('storage tier','уровень хранения'),
        w('data residency','резидентность данных'),
      ],
    },
    {
      title: 'Collaboration Tools',
      words: [
        w('workspace','рабочее пространство'), w('channel','канал'), w('thread','ветка сообщений'),
        w('mention','упоминание'), w('notification','уведомление'), w('video call','видеозвонок'),
        w('screen share','демонстрация экрана'), w('real-time editing','совместное редактирование'),
        w('task board','доска задач'), w('deadline','срок выполнения'), w('assign','назначать'),
        w('status','статус задачи'), w('integration','интеграция'), w('workflow','рабочий процесс'),
        w('bot','бот'), w('archive','архивировать'), w('comment','комментарий'),
        w('productivity','продуктивность'), w('Slack','Slack'), w('Microsoft Teams','Microsoft Teams'),
        w('Asana','Asana'), w('Jira','Jira'), w('Confluence','Confluence'),
        w('Notion','Notion'), w('Trello','Trello'),
      ],
    },
    {
      title: 'Digital Communication',
      words: [
        w('video conference','видеоконференция'), w('webinar','вебинар'), w('virtual meeting','виртуальная встреча'),
        w('mute','отключить звук'), w('breakout room','комната для группы'), w('participant','участник'),
        w('host','организатор'), w('record','записывать'), w('lag','задержка'), w('etiquette','этикет'),
        w('agenda','повестка дня'), w('follow-up','дальнейшие действия'),
        w('digital signature','электронная подпись'), w('Q&A','сессия вопросов и ответов'),
        w('reaction','реакция'), w('raise hand','поднять руку в звонке'), w('poll','опрос'),
        w('Zoom','Zoom'), w('Google Meet','Google Meet'), w('live transcription','живая транскрипция'),
        w('virtual background','виртуальный фон'), w('meeting summary','итоги встречи'),
        w('action items','задачи по итогам'), w('calendar integration','интеграция с календарём'),
        w('co-host','сo-организатор'),
      ],
    },
  ],
}

// Module 5 – Databases (B2)
const mod_databases: MD = {
  title: 'Databases', section: 'B2', lessons: [
    {
      title: 'Relational Databases',
      words: [
        w('database','база данных'), w('table','таблица'), w('row','строка / запись'),
        w('column','столбец / поле'), w('primary key','первичный ключ'), w('foreign key','внешний ключ'),
        w('relationship','связь'), w('schema','схема'), w('RDBMS','реляционная СУБД'),
        w('normalisation','нормализация'), w('data integrity','целостность данных'),
        w('constraint','ограничение'), w('null value','нулевое значение'), w('index','индекс'),
        w('query','запрос'), w('transaction','транзакция'), w('entity','сущность'),
        w('attribute','атрибут'), w('cardinality','кардинальность'), w('ACID','принципы ACID'),
        w('referential integrity','ссылочная целостность'), w('composite key','составной ключ'),
        w('surrogate key','суррогатный ключ'), w('view','представление'),
        w('stored procedure','хранимая процедура'),
      ],
    },
    {
      title: 'SQL Queries',
      words: [
        w('SELECT','оператор выборки'), w('FROM','из таблицы'), w('WHERE','условие фильтрации'),
        w('ORDER BY','сортировка'), w('GROUP BY','группировка'), w('JOIN','объединение таблиц'),
        w('INSERT INTO','вставить запись'), w('UPDATE','обновить запись'), w('DELETE','удалить запись'),
        w('CREATE TABLE','создать таблицу'), w('ALTER TABLE','изменить таблицу'),
        w('DROP','удалить объект БД'), w('aggregate function','агрегатная функция'),
        w('COUNT','количество записей'), w('SUM','сумма значений'), w('HAVING','фильтр для групп'),
        w('subquery','подзапрос'), w('alias','псевдоним'), w('wildcard','символ замены'),
        w('NULL','пустое значение'), w('DISTINCT','уникальные значения'), w('LIMIT','ограничение строк'),
        w('UNION','объединение результатов'), w('CASE expression','выражение CASE'),
        w('window function','оконная функция'),
      ],
    },
    {
      title: 'Data Modelling',
      words: [
        w('entity-relationship diagram','ER-диаграмма'), w('data model','модель данных'),
        w('conceptual model','концептуальная модель'), w('logical model','логическая модель'),
        w('physical model','физическая модель'), w('one-to-many','один ко многим'),
        w('many-to-many','многие ко многим'), w('one-to-one','один к одному'),
        w('normalisation','нормализация'), w('denormalisation','денормализация'),
        w('data dictionary','словарь данных'), w('schema design','проектирование схемы'),
        w('mapping','сопоставление полей'), w('UML class diagram','UML-диаграмма классов'),
        w("crow's foot notation","нотация «воронья лапа»"), w('bounded context','ограниченный контекст'),
        w('ORM','объектно-реляционное отображение'), w('domain model','доменная модель'),
        w('aggregate root','корень агрегата'), w('repository pattern','паттерн репозиторий'),
        w('entity','сущность'), w('value object','объект-значение'), w('domain event','доменное событие'),
        w('context map','карта контекстов'), w('ubiquitous language','единый язык'),
      ],
    },
    {
      title: 'Indexes',
      words: [
        w('index','индекс'), w('clustered index','кластеризованный индекс'),
        w('non-clustered index','некластеризованный индекс'), w('full-text index','полнотекстовый индекс'),
        w('unique index','уникальный индекс'), w('composite index','составной индекс'),
        w('query optimisation','оптимизация запросов'), w('execution plan','план выполнения'),
        w('scan','сканирование таблицы'), w('seek','поиск по индексу'),
        w('covering index','покрывающий индекс'), w('fragmentation','фрагментация индекса'),
        w('rebuild','перестроить индекс'), w('statistics','статистика запросов'),
        w('B-tree','дерево B-tree'), w('hash index','хэш-индекс'), w('selectivity','селективность'),
        w('overhead','накладные расходы'), w('cardinality','кардинальность индекса'),
        w('B+ tree','дерево B+ tree'), w('index hint','подсказка по индексу'),
        w('partial index','частичный индекс'), w('expression index','функциональный индекс'),
        w('fill factor','коэффициент заполнения'), w('index scan','сканирование индекса'),
      ],
    },
    {
      title: 'Joins',
      words: [
        w('INNER JOIN','внутреннее объединение'), w('LEFT JOIN','левое объединение'),
        w('RIGHT JOIN','правое объединение'), w('FULL OUTER JOIN','полное внешнее объединение'),
        w('CROSS JOIN','перекрёстное объединение'), w('SELF JOIN','самообъединение'),
        w('join condition','условие объединения'), w('matching rows','совпадающие строки'),
        w('result set','результирующий набор'), w('cartesian product','декартово произведение'),
        w('ON clause','условие ON'), w('NULL handling','обработка NULL'),
        w('table alias','псевдоним таблицы'), w('optimise','оптимизировать запрос'),
        w('equijoin','эквисоединение'), w('natural join','естественное объединение'),
        w('hash join','хэш-объединение'), w('merge join','объединение слиянием'),
        w('nested loop join','объединение вложенным циклом'), w('join elimination','устранение объединения'),
        w('driving table','управляющая таблица'), w('lateral join','латеральное объединение'),
        w('recursive CTE','рекурсивное CTE'), w('correlated subquery','коррелированный подзапрос'),
        w('join order','порядок объединения'),
      ],
    },
    {
      title: 'Transactions',
      words: [
        w('transaction','транзакция'), w('COMMIT','зафиксировать'), w('ROLLBACK','откатить'),
        w('atomicity','атомарность'), w('consistency','согласованность'), w('isolation','изолированность'),
        w('durability','долговечность'), w('savepoint','точка сохранения'), w('deadlock','взаимная блокировка'),
        w('lock','блокировка'), w('isolation level','уровень изоляции'), w('dirty read','грязное чтение'),
        w('phantom read','фантомное чтение'), w('concurrency','параллелизм'),
        w('transaction log','журнал транзакций'), w('two-phase commit','двухфазная фиксация'),
        w('MVCC','многоверсионное управление конкурентностью'),
        w('row-level lock','блокировка строки'), w('shared lock','разделяемая блокировка'),
        w('exclusive lock','исключительная блокировка'), w('deadlock detection','обнаружение взаимной блокировки'),
        w('optimistic locking','оптимистичная блокировка'), w('pessimistic locking','пессимистичная блокировка'),
        w('WAL','журнал упреждающей записи'), w('non-repeatable read','неповторяемое чтение'),
      ],
    },
  ],
}

// Module 6 – Software Engineering (B2)
const mod_se: MD = {
  title: 'Software Engineering', section: 'B2', lessons: [
    {
      title: 'SDLC',
      words: [
        w('SDLC','жизненный цикл разработки ПО'), w('requirements','требования'),
        w('analysis','анализ'), w('design','проектирование'), w('implementation','реализация'),
        w('testing','тестирование'), w('deployment','развёртывание'), w('maintenance','сопровождение'),
        w('feasibility','осуществимость'), w('stakeholder','заинтересованная сторона'),
        w('deliverable','результат / артефакт'), w('milestone','веха проекта'),
        w('waterfall','каскадная модель'), w('iterative','итеративный'), w('prototype','прототип'),
        w('specification','спецификация'), w('scope','область охвата'), w('timeline','временная шкала'),
        w('resource allocation','распределение ресурсов'), w('technical debt','технический долг'),
        w('functional requirement','функциональное требование'),
        w('non-functional requirement','нефункциональное требование'),
        w('use case','вариант использования'), w('acceptance criteria','критерии приёмки'),
        w('release plan','план выпуска'),
      ],
    },
    {
      title: 'Agile & Scrum',
      words: [
        w('Agile','методология Agile'), w('Scrum','фреймворк Scrum'), w('sprint','спринт'),
        w('backlog','бэклог'), w('user story','пользовательская история'),
        w('sprint planning','планирование спринта'), w('daily standup','ежедневный стендап'),
        w('sprint review','обзор спринта'), w('retrospective','ретроспектива'),
        w('product owner','владелец продукта'), w('Scrum master','Scrum-мастер'),
        w('velocity','скорость команды'), w('burndown chart','диаграмма сгорания'),
        w('story point','пункт истории'), w('increment','инкремент'), w('Kanban','Канбан'),
        w('epic','эпик'), w('definition of done','определение готовности'),
        w('estimate','оценивать'), w('sprint goal','цель спринта'),
        w('team capacity','ёмкость команды'), w('planning poker','покер планирования'),
        w('relative sizing','относительная оценка'), w('burnup chart','диаграмма выгорания'),
        w('sprint backlog','бэклог спринта'),
      ],
    },
    {
      title: 'Version Control',
      words: [
        w('version control','контроль версий'), w('Git','система Git'), w('repository','репозиторий'),
        w('commit','фиксация изменений'), w('branch','ветка'), w('merge','слияние веток'),
        w('pull request','запрос на слияние'), w('conflict','конфликт слияния'), w('clone','клонировать'),
        w('push','отправить изменения'), w('pull','получить изменения'), w('fork','форк'),
        w('tag','метка версии'), w('revert','отменить изменения'), w('diff','разница изменений'),
        w('remote','удалённый репозиторий'), w('checkout','переключиться на ветку'),
        w('stash','спрятать изменения'), w('blame','история строки'), w('CI/CD','непрерывная интеграция и доставка'),
        w('branching strategy','стратегия ветвления'), w('GitFlow','GitFlow'),
        w('feature flag','флаг функции'), w('semantic versioning','семантическое версионирование'),
        w('release note','примечание к выпуску'),
      ],
    },
    {
      title: 'Testing',
      words: [
        w('unit test','модульный тест'), w('integration test','интеграционный тест'),
        w('end-to-end test','сквозной тест'), w('test case','тестовый случай'),
        w('test suite','набор тестов'), w('assertion','утверждение'), w('mock','имитация объекта'),
        w('stub','заглушка'), w('coverage','покрытие тестами'), w('regression testing','регрессионное тестирование'),
        w('smoke test','дымовой тест'), w('load testing','нагрузочное тестирование'),
        w('TDD','разработка через тестирование'), w('BDD','разработка через поведение'),
        w('test runner','запускатель тестов'), w('pass','тест пройден'), w('fail','тест не пройден'),
        w('automated testing','автоматизированное тестирование'), w('QA','обеспечение качества'),
        w('acceptance test','приёмочный тест'), w('test pyramid','пирамида тестирования'),
        w('mutation testing','мутационное тестирование'), w('property-based testing','тестирование на основе свойств'),
        w('test harness','тестовая обвязка'), w('fuzzing','фаззинг'),
      ],
    },
    {
      title: 'Code Review',
      words: [
        w('code review','проверка кода'), w('reviewer','рецензент'), w('approve','одобрить'),
        w('request changes','запросить изменения'), w('inline comment','встроенный комментарий'),
        w('suggestion','предложение'), w('best practices','лучшие практики'),
        w('readability','читаемость кода'), w('refactor','рефакторинг'), w('style guide','руководство по стилю'),
        w('DRY','принцип не повторяйся'), w('SOLID principles','принципы SOLID'),
        w('security','безопасность кода'), w('performance','производительность'),
        w('maintainability','сопровождаемость'), w('convention','соглашение'),
        w('nitpick','придирка к мелочам'), w('blocker','блокирующий вопрос'),
        w('pair programming','парное программирование'), w('knowledge sharing','обмен знаниями'),
        w('LGTM','LGTM'), w('PR template','шаблон пул-реквеста'), w('code owner','владелец кода'),
        w('review checklist','чеклист ревью'), w('branch protection','защита ветки'),
      ],
    },
    {
      title: 'Documentation',
      words: [
        w('README','файл README'), w('API documentation','документация API'),
        w('inline comment','встроенный комментарий'), w('docstring','строка документации'),
        w('technical specification','техническая спецификация'), w('user guide','руководство пользователя'),
        w('changelog','журнал изменений'), w('wiki','вики'), w('diagram','диаграмма'),
        w('flowchart','схема процесса'), w('architecture document','архитектурный документ'),
        w('glossary','глоссарий'), w('version','версия'), w('template','шаблон'),
        w('markdown','формат Markdown'), w('auto-generated docs','автодокументация'),
        w('knowledge base','база знаний'), w('tutorial','обучающее руководство'),
        w('update','обновлять документацию'), w('Swagger','Swagger'),
        w('decision record','запись о решении'), w('ADR','ADR'),
        w('runbook','операционный журнал'), w('playbook','руководство по реагированию'),
        w('docs-as-code','документация как код'),
      ],
    },
  ],
}

// Module 7 – Networks & Infrastructure (B2)
const mod_networks: MD = {
  title: 'Networks & Infrastructure', section: 'B2', lessons: [
    {
      title: 'TCP/IP',
      words: [
        w('TCP','протокол TCP'), w('IP','интернет-протокол'), w('packet','пакет данных'),
        w('header','заголовок пакета'), w('port number','номер порта'), w('socket','сокет'),
        w('handshake','установление соединения'), w('ACK','подтверждение получения'),
        w('SYN','запрос синхронизации'), w('UDP','протокол UDP'),
        w('IPv4','адресация IPv4'), w('IPv6','адресация IPv6'),
        w('subnet mask','маска подсети'), w('gateway','шлюз'), w('TTL','время жизни пакета'),
        w('throughput','пропускная способность'), w('latency','задержка'), w('jitter','джиттер'),
        w('bandwidth','ширина канала'), w('congestion','перегрузка сети'),
        w('OSI model','модель OSI'), w('network layer','сетевой уровень'),
        w('transport layer','транспортный уровень'), w('encapsulation','инкапсуляция'),
        w('ICMP','протокол ICMP'),
      ],
    },
    {
      title: 'Protocols',
      words: [
        w('protocol','протокол'), w('HTTP','HTTP'), w('FTP','FTP'), w('SSH','SSH'),
        w('SMTP','SMTP'), w('IMAP','IMAP'), w('DNS','DNS'), w('DHCP','DHCP'),
        w('SSL/TLS','SSL/TLS'), w('WebSocket','веб-сокет'), w('REST','REST'),
        w('gRPC','gRPC'), w('OAuth','OAuth'), w('MQTT','MQTT'), w('NTP','протокол времени NTP'),
        w('authentication','аутентификация'), w('stateless','без сохранения состояния'),
        w('stateful','с сохранением состояния'), w('WebRTC','WebRTC'),
        w('LDAP','LDAP'), w('RADIUS','RADIUS'), w('BGP','BGP'), w('VLAN','VLAN'),
        w('tunnelling','туннелирование'), w('overlay network','оверлейная сеть'),
      ],
    },
    {
      title: 'DNS & HTTP',
      words: [
        w('A record','запись A'), w('CNAME','запись CNAME'), w('MX record','почтовая запись MX'),
        w('TTL','время жизни записи'), w('resolver','DNS-резольвер'),
        w('recursive query','рекурсивный запрос'), w('authoritative server','авторитативный сервер'),
        w('GET','запрос GET'), w('POST','запрос POST'), w('PUT','запрос PUT'),
        w('DELETE','запрос DELETE'), w('status code','код ответа'), w('200 OK','успешный ответ'),
        w('404 Not Found','ресурс не найден'), w('500 Internal Server Error','ошибка сервера'),
        w('HTTP header','HTTP-заголовок'), w('cookie','куки'), w('redirect','перенаправление'),
        w('HTTP/2','HTTP/2'), w('HTTP/3','HTTP/3'), w('QUIC protocol','протокол QUIC'),
        w('ETag','ETag'), w('cache-control','управление кэшем'),
        w('conditional GET','условный GET'), w('content negotiation','согласование содержимого'),
      ],
    },
    {
      title: 'Load Balancing',
      words: [
        w('load balancer','балансировщик нагрузки'), w('round-robin','алгоритм round-robin'),
        w('upstream server','вышестоящий сервер'), w('health check','проверка доступности'),
        w('failover','переключение при отказе'), w('sticky session','привязанная сессия'),
        w('traffic distribution','распределение трафика'),
        w('horizontal scaling','горизонтальное масштабирование'),
        w('vertical scaling','вертикальное масштабирование'), w('throughput','пропускная способность'),
        w('redundancy','резервирование'), w('NGINX','NGINX'), w('HAProxy','HAProxy'),
        w('weighted distribution','взвешенное распределение'), w('auto-scaling','автоматическое масштабирование'),
        w('cluster','кластер'), w('node','узел'), w('high availability','высокая доступность'),
        w('session persistence','сохранение сессии'), w('L4 load balancing','балансировка уровня L4'),
        w('L7 load balancing','балансировка уровня L7'), w('circuit breaker','автоматический выключатель'),
        w('canary deployment','канареечное развёртывание'), w('blue-green deployment','сине-зелёное развёртывание'),
        w('traffic shaping','формирование трафика'),
      ],
    },
    {
      title: 'Cloud Computing',
      words: [
        w('cloud computing','облачные вычисления'), w('IaaS','инфраструктура как услуга'),
        w('PaaS','платформа как услуга'), w('SaaS','ПО как услуга'),
        w('virtual machine','виртуальная машина'), w('container','контейнер'),
        w('Docker','Docker'), w('Kubernetes','Kubernetes'), w('region','регион'),
        w('availability zone','зона доступности'), w('elastic computing','эластичные вычисления'),
        w('pay-as-you-go','оплата по использованию'), w('managed service','управляемый сервис'),
        w('serverless','бессерверные вычисления'), w('lambda function','лямбда-функция'),
        w('object storage','объектное хранилище'), w('CDN','CDN'), w('cloud provider','облачный провайдер'),
        w('migration','миграция в облако'), w('on-demand','по требованию'),
        w('multi-cloud','мультиоблако'), w('hybrid cloud','гибридное облако'),
        w('cloud-native','облако-нативный'), w('FinOps','FinOps'), w('reserved instance','зарезервированный экземпляр'),
      ],
    },
    {
      title: 'APIs',
      words: [
        w('API','программный интерфейс'), w('endpoint','конечная точка'), w('REST API','REST-интерфейс'),
        w('JSON','JSON'), w('XML','XML'), w('request','запрос'), w('response','ответ'),
        w('authentication','аутентификация'), w('API key','API-ключ'), w('rate limiting','ограничение запросов'),
        w('versioning','версионирование'), w('documentation','документация'), w('OpenAPI','OpenAPI'),
        w('webhook','вебхук'), w('payload','полезная нагрузка'), w('status code','код статуса'),
        w('timeout','тайм-аут'), w('retry','повторный запрос'), w('mock API','имитация API'),
        w('integration','интеграция'), w('GraphQL','GraphQL'), w('idempotent','идемпотентный'),
        w('pagination','пагинация'), w('HATEOAS','HATEOAS'), w('backward compatibility','обратная совместимость'),
      ],
    },
  ],
}

// Module 8 – Data & Analytics (B2)
const mod_data: MD = {
  title: 'Data & Analytics', section: 'B2', lessons: [
    {
      title: 'Data Pipelines',
      words: [
        w('data pipeline','конвейер данных'), w('source','источник данных'), w('destination','получатель данных'),
        w('ingestion','загрузка данных'), w('batch processing','пакетная обработка'),
        w('streaming','потоковая обработка'), w('orchestration','оркестрация'), w('scheduler','планировщик'),
        w('workflow','рабочий процесс'), w('trigger','триггер'), w('dependency','зависимость'),
        w('idempotency','идемпотентность'), w('fault tolerance','отказоустойчивость'),
        w('monitoring','мониторинг'), w('data quality','качество данных'), w('latency','задержка'),
        w('throughput','производительность'), w('event-driven','событийно-ориентированный'),
        w('Apache Airflow','Apache Airflow'), w('data lineage','происхождение данных'),
        w('Kafka Connect','Kafka Connect'), w('schema registry','реестр схем'),
        w('data contract','контракт данных'), w('backpressure','обратное давление'),
        w('late-arriving data','данные с опозданием'),
      ],
    },
    {
      title: 'ETL',
      words: [
        w('ETL','извлечение, преобразование, загрузка'), w('extraction','извлечение данных'),
        w('transformation','преобразование данных'), w('loading','загрузка данных'),
        w('data warehouse','хранилище данных'), w('staging area','промежуточная область'),
        w('cleansing','очистка данных'), w('enrichment','обогащение данных'),
        w('deduplication','дедупликация'), w('mapping','сопоставление полей'), w('schema','схема данных'),
        w('incremental load','инкрементальная загрузка'), w('full load','полная загрузка'),
        w('change data capture','захват изменений данных'), w('data mart','витрина данных'),
        w('error handling','обработка ошибок'), w('audit log','журнал аудита'), w('ELT','ELT'),
        w('flat file','плоский файл'), w('OLAP','OLAP'), w('OLTP','OLTP'),
        w('dimensional model','размерная модель'), w('fact table','таблица фактов'),
        w('dimension table','таблица измерений'), w('star schema','схема звезды'),
      ],
    },
    {
      title: 'Visualization',
      words: [
        w('chart','диаграмма'), w('bar chart','столбчатая диаграмма'), w('line chart','линейный график'),
        w('pie chart','круговая диаграмма'), w('scatter plot','диаграмма рассеяния'),
        w('heatmap','тепловая карта'), w('dashboard','панель мониторинга'), w('KPI','ключевой показатель'),
        w('legend','легенда'), w('axis','ось'), w('label','подпись'), w('drill-down','детализация'),
        w('interactive','интерактивный'), w('tooltip','всплывающая подсказка'), w('filter','фильтр'),
        w('trend line','линия тренда'), w('Tableau','Tableau'), w('Power BI','Power BI'),
        w('colour coding','цветовое кодирование'), w('data range','диапазон данных'),
        w('choropleth map','хороплетная карта'), w('treemap','древовидная карта'),
        w('sankey diagram','диаграмма Sankey'), w('box plot','диаграмма ящик с усами'),
        w('funnel chart','воронкообразная диаграмма'),
      ],
    },
    {
      title: 'Statistics',
      words: [
        w('mean','среднее значение'), w('median','медиана'), w('mode','мода'),
        w('standard deviation','стандартное отклонение'), w('variance','дисперсия'),
        w('distribution','распределение'), w('normal distribution','нормальное распределение'),
        w('outlier','выброс'), w('correlation','корреляция'), w('regression','регрессия'),
        w('probability','вероятность'), w('sample','выборка'), w('population','генеральная совокупность'),
        w('hypothesis','гипотеза'), w('significance','значимость'), w('p-value','p-значение'),
        w('confidence interval','доверительный интервал'), w('percentile','перцентиль'),
        w('skewness','асимметрия'), w('kurtosis','эксцесс'), w('t-test','t-тест'),
        w('chi-square test','хи-квадрат тест'), w('ANOVA','ANOVA'),
        w('effect size','размер эффекта'), w('Bayesian inference','байесовский вывод'),
      ],
    },
    {
      title: 'Machine Learning Basics',
      words: [
        w('machine learning','машинное обучение'), w('algorithm','алгоритм'),
        w('training data','обучающие данные'), w('test data','тестовые данные'), w('feature','признак'),
        w('label','метка'), w('model','модель'), w('supervised learning','обучение с учителем'),
        w('unsupervised learning','обучение без учителя'), w('classification','классификация'),
        w('regression','регрессия'), w('clustering','кластеризация'), w('accuracy','точность'),
        w('overfitting','переобучение'), w('underfitting','недообучение'),
        w('neural network','нейронная сеть'), w('hyperparameter','гиперпараметр'),
        w('validation','валидация'), w('prediction','предсказание'), w('bias','смещение'),
        w('cross-validation','перекрёстная проверка'), w('confusion matrix','матрица ошибок'),
        w('precision','точность класса'), w('recall','полнота'), w('F1 score','F1-метрика'),
      ],
    },
    {
      title: 'Big Data',
      words: [
        w('Big Data','большие данные'), w('volume','объём данных'), w('velocity','скорость данных'),
        w('variety','разнообразие данных'), w('structured data','структурированные данные'),
        w('unstructured data','неструктурированные данные'), w('Hadoop','Hadoop'), w('Spark','Apache Spark'),
        w('data lake','озеро данных'), w('data warehouse','хранилище данных'), w('NoSQL','NoSQL'),
        w('MapReduce','MapReduce'), w('cluster','кластер'), w('distributed computing','распределённые вычисления'),
        w('scalability','масштабируемость'), w('real-time analytics','аналитика в реальном времени'),
        w('data governance','управление данными'), w('data catalogue','каталог данных'),
        w('semi-structured data','полуструктурированные данные'), w('data mesh','дата-меш'),
        w('data observability','наблюдаемость данных'), w('data quality rule','правило качества данных'),
        w('data product','продукт данных'), w('polyglot persistence','полиглотное хранение'),
        w('federated governance','федеративное управление'),
      ],
    },
  ],
}

// Module 9 – Cybersecurity (C1)
const mod_security: MD = {
  title: 'Cybersecurity', section: 'C1', lessons: [
    {
      title: 'Threat Modelling',
      words: [
        w('threat','угроза'), w('vulnerability','уязвимость'), w('risk','риск'), w('asset','актив'),
        w('attack vector','вектор атаки'), w('threat actor','злоумышленник'), w('STRIDE','STRIDE'),
        w('attack surface','поверхность атаки'), w('mitigation','смягчение'),
        w('countermeasure','контрмера'), w('likelihood','вероятность'), w('impact','воздействие'),
        w('threat intelligence','разведка угроз'), w('zero-day','уязвимость нулевого дня'),
        w('exploit','эксплойт'), w('CVE','CVE'), w('security posture','уровень защищённости'),
        w('residual risk','остаточный риск'), w('risk register','реестр рисков'),
        w('control','мера контроля'), w('MITRE ATT&CK','MITRE ATT&CK'),
        w('kill chain','цепочка атаки'), w('abuse case','вариант злоупотребления'),
        w('attack tree','дерево атак'), w('adversary simulation','симуляция атаки'),
      ],
    },
    {
      title: 'Encryption',
      words: [
        w('encryption','шифрование'), w('decryption','расшифровка'), w('key','ключ шифрования'),
        w('symmetric encryption','симметричное шифрование'), w('asymmetric encryption','асимметричное шифрование'),
        w('public key','открытый ключ'), w('private key','закрытый ключ'), w('AES','AES'),
        w('RSA','RSA'), w('hash function','хэш-функция'), w('salt','соль'),
        w('SSL/TLS','SSL/TLS'), w('certificate','сертификат'), w('PKI','PKI'),
        w('cipher','шифр'), w('plaintext','открытый текст'), w('ciphertext','зашифрованный текст'),
        w('end-to-end encryption','сквозное шифрование'), w('brute-force attack','атака перебором'),
        w('key management','управление ключами'), w('elliptic curve cryptography','криптография на эллиптических кривых'),
        w('Diffie-Hellman','Диффи-Хеллман'), w('perfect forward secrecy','совершенная прямая секретность'),
        w('certificate authority','центр сертификации'), w('HSTS','HSTS'),
      ],
    },
    {
      title: 'Authentication',
      words: [
        w('authentication','аутентификация'), w('authorisation','авторизация'), w('password','пароль'),
        w('MFA','многофакторная аутентификация'), w('2FA','двухфакторная аутентификация'),
        w('biometrics','биометрия'), w('token','токен'), w('session','сессия'),
        w('OAuth','OAuth'), w('SAML','SAML'), w('SSO','единый вход'), w('JWT','JWT'),
        w('credential','учётные данные'), w('identity provider','провайдер удостоверений'),
        w('access control','управление доступом'), w('role-based access','ролевое управление'),
        w('password policy','политика паролей'), w('brute-force protection','защита от перебора'),
        w('account lockout','блокировка аккаунта'), w('audit trail','журнал аудита'),
        w('FIDO2','FIDO2'), w('WebAuthn','WebAuthn'), w('passkey','ключ доступа'),
        w('PKCE','PKCE'), w('OpenID Connect','OpenID Connect'),
      ],
    },
    {
      title: 'Penetration Testing',
      words: [
        w('penetration testing','тестирование на проникновение'), w('pentest','пентест'),
        w('white box','белый ящик'), w('black box','чёрный ящик'), w('grey box','серый ящик'),
        w('reconnaissance','разведка'), w('scanning','сканирование'), w('enumeration','перечисление'),
        w('exploitation','эксплуатация'), w('post-exploitation','постэксплуатация'),
        w('payload','полезная нагрузка'), w('privilege escalation','эскалация привилегий'),
        w('Metasploit','Metasploit'), w('Kali Linux','Kali Linux'),
        w('vulnerability scanner','сканер уязвимостей'), w('social engineering','социальная инженерия'),
        w('phishing','фишинг'), w('report','отчёт о пентесте'), w('remediation','устранение уязвимостей'),
        w('scope','область тестирования'), w('OWASP Top 10','OWASP Top 10'),
        w('SQL injection','SQL-инъекция'), w('XSS','межсайтовый скриптинг'),
        w('CSRF','CSRF'), w('lateral movement','горизонтальное перемещение'),
      ],
    },
    {
      title: 'Compliance',
      words: [
        w('compliance','соответствие требованиям'), w('GDPR','GDPR'), w('ISO 27001','ISO 27001'),
        w('PCI DSS','PCI DSS'), w('HIPAA','HIPAA'), w('SOC 2','SOC 2'),
        w('audit','аудит'), w('policy','политика'), w('procedure','процедура'),
        w('data protection','защита данных'), w('privacy','конфиденциальность'),
        w('breach notification','уведомление об утечке'), w('data retention','хранение данных'),
        w('right to erasure','право на удаление'), w('controller','контролёр данных'),
        w('processor','обработчик данных'), w('DPA','соглашение об обработке данных'),
        w('regulatory body','регулятор'), w('fine','штраф'), w('data inventory','реестр данных'),
        w('NIS2 directive','директива NIS2'), w('DORA','DORA'),
        w('supply chain security','безопасность цепочки поставок'),
        w('control framework','контрольная среда'), w('risk acceptance','принятие риска'),
      ],
    },
    {
      title: 'Incident Response',
      words: [
        w('incident','инцидент'), w('incident response','реагирование на инцидент'),
        w('SIEM','SIEM'), w('alert','оповещение'), w('triage','сортировка'),
        w('containment','сдерживание'), w('eradication','ликвидация'), w('recovery','восстановление'),
        w('forensics','форензика'), w('chain of custody','цепочка доказательств'),
        w('timeline','хронология'), w('root cause analysis','анализ первопричин'),
        w('post-mortem','разбор инцидента'), w('playbook','руководство по реагированию'),
        w('escalation','эскалация'), w('threat hunting','поиск угроз'), w('log analysis','анализ журналов'),
        w('IOC','индикатор компрометации'), w('remediation','устранение последствий'),
        w('lessons learned','извлечённые уроки'), w('SOAR','SOAR'),
        w('automated response','автоматический ответ'), w('malware analysis','анализ вредоносного ПО'),
        w('memory forensics','криминалистика памяти'), w('threat sharing','обмен угрозами'),
      ],
    },
  ],
}

// Module 10 – System Architecture (C1)
const mod_architecture: MD = {
  title: 'System Architecture', section: 'C1', lessons: [
    {
      title: 'Microservices',
      words: [
        w('microservices','микросервисы'), w('monolith','монолит'), w('service','сервис'),
        w('API gateway','API-шлюз'), w('service discovery','обнаружение сервисов'),
        w('container','контейнер'), w('Docker','Docker'), w('Kubernetes','Kubernetes'),
        w('deployment','развёртывание'), w('orchestration','оркестрация'),
        w('decoupling','разделение сервисов'), w('scalability','масштабируемость'),
        w('fault isolation','изоляция ошибок'), w('service mesh','сервисная сетка'),
        w('eventual consistency','согласованность в конечном счёте'),
        w('circuit breaker','автоматический выключатель'), w('retry','повторный запрос'),
        w('observability','наблюдаемость'), w('distributed tracing','распределённая трассировка'),
        w('service contract','контракт сервиса'), w('saga pattern','паттерн Saga'),
        w('choreography','хореография'), w('bounded context','ограниченный контекст'),
        w('domain event','доменное событие'), w('outbox pattern','паттерн Outbox'),
      ],
    },
    {
      title: 'Scalability',
      words: [
        w('scalability','масштабируемость'), w('horizontal scaling','горизонтальное масштабирование'),
        w('vertical scaling','вертикальное масштабирование'), w('load balancing','балансировка нагрузки'),
        w('auto-scaling','автомасштабирование'), w('throughput','пропускная способность'),
        w('latency','задержка'), w('bottleneck','узкое место'), w('capacity planning','планирование мощностей'),
        w('peak load','пиковая нагрузка'), w('caching','кэширование'), w('CDN','CDN'),
        w('database sharding','шардирование базы данных'), w('replication','репликация'),
        w('stateless','без сохранения состояния'), w('distributed','распределённый'),
        w('elasticity','эластичность'), w('availability','доступность'), w('SLA','SLA'),
        w('performance testing','нагрузочное тестирование'), w('connection pool','пул соединений'),
        w('N+1 problem','проблема N+1'), w('read replica','реплика для чтения'),
        w('CQRS','CQRS'), w('cache aside','паттерн cache-aside'),
      ],
    },
    {
      title: 'Distributed Systems',
      words: [
        w('distributed system','распределённая система'), w('node','узел'), w('cluster','кластер'),
        w('consensus','консенсус'), w('leader election','выбор лидера'), w('replication','репликация'),
        w('partition','раздел'), w('fault tolerance','отказоустойчивость'), w('CAP theorem','теорема CAP'),
        w('consistency','согласованность'), w('availability','доступность'),
        w('partition tolerance','устойчивость к разделению'),
        w('eventual consistency','согласованность в конечном счёте'),
        w('distributed transaction','распределённая транзакция'), w('idempotency','идемпотентность'),
        w('network partition','сетевое разделение'), w('quorum','кворум'),
        w('vector clock','векторные часы'), w('Raft algorithm','алгоритм Raft'), w('Paxos','Paxos'),
        w('Byzantine fault','византийская ошибка'), w('clock synchronisation','синхронизация часов'),
        w('gossip protocol','протокол Gossip'), w('anti-entropy','анти-энтропия'),
        w('state replication','репликация состояния'),
      ],
    },
    {
      title: 'Caching',
      words: [
        w('cache','кэш'), w('in-memory cache','кэш в памяти'), w('Redis','Redis'),
        w('Memcached','Memcached'), w('TTL','время жизни кэша'), w('cache hit','попадание в кэш'),
        w('cache miss','промах кэша'), w('eviction policy','политика вытеснения'), w('LRU','LRU'),
        w('LFU','LFU'), w('distributed cache','распределённый кэш'), w('write-through','сквозная запись'),
        w('write-behind','отложенная запись'), w('cache invalidation','инвалидация кэша'),
        w('warm-up','прогрев кэша'), w('cache coherence','согласованность кэша'),
        w('CDN caching','кэширование CDN'), w('browser cache','кэш браузера'),
        w('cache stampede','шторм кэша'), w('key-value store','хранилище ключ-значение'),
        w('cache hit rate','процент попаданий'), w('Bloom filter','фильтр Блума'),
        w('multi-level cache','многоуровневый кэш'), w('hot spot','горячая точка'),
        w('consistent hashing','согласованное хэширование'),
      ],
    },
    {
      title: 'Message Queues',
      words: [
        w('message queue','очередь сообщений'), w('producer','производитель'),
        w('consumer','потребитель'), w('broker','брокер'), w('topic','топик'),
        w('partition','раздел'), w('offset','смещение'), w('Kafka','Kafka'),
        w('RabbitMQ','RabbitMQ'), w('publish-subscribe','паттерн pub-sub'),
        w('dead letter queue','очередь недоставленных'), w('message retention','хранение сообщений'),
        w('acknowledgement','подтверждение получения'), w('at-least-once delivery','доставка минимум раз'),
        w('exactly-once delivery','точно один раз'), w('FIFO','FIFO'),
        w('asynchronous','асинхронный'), w('throughput','производительность'),
        w('durability','долговечность'), w('rebalancing','перебалансировка'),
        w('message ordering','порядок сообщений'), w('idempotent consumer','идемпотентный потребитель'),
        w('Avro','Avro'), w('Protocol Buffers','Protocol Buffers'), w('consumer group','группа потребителей'),
      ],
    },
    {
      title: 'Design Patterns',
      words: [
        w('design pattern','паттерн проектирования'), w('Singleton','одиночка'), w('Factory','фабрика'),
        w('Observer','наблюдатель'), w('Strategy','стратегия'), w('Decorator','декоратор'),
        w('Adapter','адаптер'), w('Repository','репозиторий'), w('CQRS','CQRS'),
        w('Event Sourcing','источник событий'), w('MVC','MVC'), w('SOLID','принципы SOLID'),
        w('DRY','не повторяйся'), w('abstraction','абстракция'), w('encapsulation','инкапсуляция'),
        w('composition','композиция'), w('anti-pattern','антипаттерн'), w('refactoring','рефакторинг'),
        w('code smell','запах кода'), w('domain-driven design','доменно-ориентированное проектирование'),
        w('hexagonal architecture','гексагональная архитектура'), w('clean architecture','чистая архитектура'),
        w('ports and adapters','порты и адаптеры'), w('aggregate root','корень агрегата'),
        w('vertical slice','вертикальный срез'),
      ],
    },
  ],
}

// Module 11 – AI & Emerging Tech (C1)
const mod_ai: MD = {
  title: 'AI & Emerging Tech', section: 'C1', lessons: [
    {
      title: 'Neural Networks',
      words: [
        w('neural network','нейронная сеть'), w('neuron','нейрон'), w('layer','слой'),
        w('input layer','входной слой'), w('hidden layer','скрытый слой'),
        w('output layer','выходной слой'), w('weight','вес'), w('bias','смещение'),
        w('activation function','функция активации'), w('backpropagation','обратное распространение'),
        w('gradient descent','градиентный спуск'), w('deep learning','глубокое обучение'),
        w('CNN','свёрточная нейросеть'), w('RNN','рекуррентная нейросеть'), w('transformer','трансформер'),
        w('training','обучение'), w('epoch','эпоха'), w('batch','пакет'),
        w('loss function','функция потерь'), w('overfitting','переобучение'),
        w('transfer learning','трансфертное обучение'), w('pre-training','предобучение'),
        w('self-supervised learning','самоконтролируемое обучение'), w('embedding','эмбеддинг'),
        w('attention mechanism','механизм внимания'),
      ],
    },
    {
      title: 'NLP',
      words: [
        w('NLP','обработка естественного языка'), w('tokenisation','токенизация'), w('token','токен'),
        w('embedding','векторное представление'), w('sentiment analysis','анализ тональности'),
        w('named entity recognition','распознавание именованных сущностей'),
        w('text classification','классификация текста'), w('language model','языковая модель'),
        w('LLM','большая языковая модель'), w('prompt','промпт'), w('fine-tuning','тонкая настройка'),
        w('context window','контекстное окно'), w('chatbot','чат-бот'),
        w('text generation','генерация текста'), w('translation','машинный перевод'),
        w('summarisation','суммаризация'), w('BERT','BERT'), w('GPT','GPT'), w('RAG','RAG'),
        w('semantic search','семантический поиск'), w('vector database','векторная база данных'),
        w('cosine similarity','косинусное сходство'), w('prompt engineering','инженерия промптов'),
        w('hallucination','галлюцинация модели'), w('grounding','заземление модели'),
      ],
    },
    {
      title: 'Computer Vision',
      words: [
        w('computer vision','компьютерное зрение'), w('image recognition','распознавание изображений'),
        w('object detection','обнаружение объектов'), w('classification','классификация'),
        w('segmentation','сегментация'), w('CNN','свёрточная нейросеть'),
        w('feature extraction','извлечение признаков'), w('bounding box','ограничивающий прямоугольник'),
        w('label','метка'), w('dataset','набор данных'), w('augmentation','аугментация данных'),
        w('YOLO','YOLO'), w('ResNet','ResNet'), w('precision','точность'), w('recall','полнота'),
        w('IoU','IoU'), w('real-time detection','обнаружение в реальном времени'),
        w('face recognition','распознавание лиц'), w('OCR','распознавание символов'),
        w('training data','обучающие данные'), w('pose estimation','оценка поз'),
        w('depth estimation','оценка глубины'), w('optical flow','оптический поток'),
        w('tracking','отслеживание объектов'), w('generative adversarial network','генеративно-состязательная сеть'),
      ],
    },
    {
      title: 'Blockchain',
      words: [
        w('blockchain','блокчейн'), w('block','блок'), w('chain','цепочка'),
        w('distributed ledger','распределённый реестр'), w('consensus mechanism','механизм консенсуса'),
        w('proof of work','доказательство работы'), w('proof of stake','доказательство доли'),
        w('smart contract','смарт-контракт'), w('wallet','кошелёк'), w('transaction','транзакция'),
        w('hash','хэш'), w('node','узел'), w('mining','майнинг'), w('cryptocurrency','криптовалюта'),
        w('DeFi','децентрализованные финансы'), w('NFT','NFT'), w('immutable','неизменяемый'),
        w('transparency','прозрачность'), w('Ethereum','Ethereum'), w('Web3','Web3'),
        w('layer 2 scaling','масштабирование 2-го уровня'), w('rollup','роллап'),
        w('cross-chain','кросс-чейн'), w('bridge','мост'), w('liquidity pool','пул ликвидности'),
      ],
    },
    {
      title: 'IoT',
      words: [
        w('IoT','интернет вещей'), w('sensor','датчик'), w('actuator','исполнительный механизм'),
        w('embedded system','встраиваемая система'), w('firmware','прошивка'),
        w('gateway','шлюз IoT'), w('MQTT','MQTT'), w('edge computing','граничные вычисления'),
        w('smart device','умное устройство'), w('connectivity','подключение'),
        w('low-power','малопотребляющий'), w('microcontroller','микроконтроллер'),
        w('Arduino','Arduino'), w('Raspberry Pi','Raspberry Pi'), w('data collection','сбор данных'),
        w('remote monitoring','удалённый мониторинг'), w('automation','автоматизация'),
        w('bandwidth','пропускная способность'), w('security vulnerability','уязвимость IoT'),
        w('LoRaWAN','LoRaWAN'), w('Zigbee','Zigbee'), w('digital twin','цифровой двойник'),
        w('predictive maintenance','предиктивное обслуживание'),
        w('over-the-air update','OTA-обновление'), w('device provisioning','подготовка устройств'),
      ],
    },
    {
      title: 'Ethics in AI',
      words: [
        w('AI ethics','этика ИИ'), w('bias','предвзятость'), w('fairness','справедливость'),
        w('transparency','прозрачность'), w('explainability','объяснимость'),
        w('accountability','ответственность'), w('privacy','конфиденциальность'),
        w('consent','согласие'), w('algorithmic discrimination','алгоритмическая дискриминация'),
        w('regulation','регулирование'), w('governance','управление'),
        w('human oversight','надзор человека'), w('autonomous system','автономная система'),
        w('deepfake','дипфейк'), w('misinformation','дезинформация'), w('AI safety','безопасность ИИ'),
        w('responsible AI','ответственный ИИ'), w('digital rights','цифровые права'),
        w('trust','доверие'), w('AI Act','Закон об ИИ'), w('prohibited AI','запрещённый ИИ'),
        w('explainable AI','объяснимый ИИ'), w('model card','карточка модели'),
        w('red teaming','красная команда'), w('algorithmic impact assessment','оценка воздействия алгоритма'),
      ],
    },
  ],
}

// Module 12 – Technical Communication (C1)
const mod_communication: MD = {
  title: 'Technical Communication', section: 'C1', lessons: [
    {
      title: 'Technical Writing',
      words: [
        w('technical writing','техническое писательство'), w('audience','аудитория'),
        w('clarity','ясность'), w('conciseness','краткость'), w('structure','структура'),
        w('tone','тон'), w('active voice','активный залог'), w('jargon','жаргон'),
        w('glossary','глоссарий'), w('manual','руководство'), w('procedure','процедура'),
        w('warning','предупреждение'), w('note','примечание'), w('revision','редакция'),
        w('template','шаблон'), w('heading','заголовок'), w('numbered list','нумерованный список'),
        w('review','рецензирование'), w('formatting','форматирование'), w('user guide','руководство пользователя'),
        w('information architecture','информационная архитектура'),
        w('content strategy','контент-стратегия'), w('docs-as-code','документация как код'),
        w('style guide','руководство по стилю'), w('plain English','простой английский'),
      ],
    },
    {
      title: 'API Docs',
      words: [
        w('API reference','справочник API'), w('endpoint','конечная точка'), w('method','метод'),
        w('parameter','параметр'), w('request body','тело запроса'), w('response','ответ'),
        w('error code','код ошибки'), w('authentication','аутентификация'), w('example','пример'),
        w('SDK','SDK'), w('OpenAPI','OpenAPI'), w('JSON schema','JSON-схема'),
        w('versioning','версионирование'), w('rate limit','ограничение запросов'),
        w('deprecation','устаревание'), w('changelog','журнал изменений'),
        w('sandbox','тестовая среда'), w('tutorial','обучающий материал'), w('quickstart','быстрый старт'),
        w('playground','интерактивная среда'), w('Swagger UI','Swagger UI'), w('Redoc','Redoc'),
        w('interactive try-it','интерактивный запуск'), w('code sample','образец кода'),
        w('API blueprint','API Blueprint'),
      ],
    },
    {
      title: 'Architecture Diagrams',
      words: [
        w('architecture diagram','архитектурная диаграмма'), w('component diagram','диаграмма компонентов'),
        w('sequence diagram','диаграмма последовательности'), w('flowchart','схема процесса'),
        w('ER diagram','ER-диаграмма'), w('deployment diagram','диаграмма развёртывания'),
        w('UML','UML'), w('C4 model','C4-модель'), w('box','блок'), w('arrow','стрелка'),
        w('label','подпись'), w('legend','обозначения'), w('swimlane','дорожка'),
        w('notation','нотация'), w('abstraction level','уровень абстракции'), w('boundary','граница'),
        w('actor','актор'), w('context diagram','контекстная диаграмма'),
        w('container diagram','диаграмма контейнеров'), w('draw.io','draw.io'),
        w('PlantUML','PlantUML'), w('Mermaid','Mermaid'), w('Structurizr','Structurizr'),
        w('data flow diagram','диаграмма потоков данных'), w('threat model diagram','диаграмма угроз'),
      ],
    },
    {
      title: 'Code Reviews',
      words: [
        w('feedback','обратная связь'), w('constructive criticism','конструктивная критика'),
        w('suggestion','предложение'), w('explain','объяснять'), w('rationale','обоснование'),
        w('acknowledge','признавать'), w('tone','тон комментария'), w('nitpick','придирка'),
        w('blocker','блокер'), w('optional','необязательно'), w('praise','похвала'),
        w('consistency','единообразие'), w('standard','стандарт'), w('guideline','руководящий принцип'),
        w('async review','асинхронное ревью'), w('pair programming','парное программирование'),
        w('knowledge sharing','обмен знаниями'), w('team norm','норма команды'),
        w('question','вопрос для уточнения'), w('approve','одобрить'),
        w('inclusive review','инклюзивное ревью'), w('review fatigue','усталость от ревью'),
        w('PR aging','устаревание PR'), w('PR checklist','чеклист PR'),
        w('conventional commits','конвенциональные коммиты'),
      ],
    },
    {
      title: 'Research Papers',
      words: [
        w('abstract','аннотация'), w('introduction','введение'), w('methodology','методология'),
        w('results','результаты'), w('discussion','обсуждение'), w('conclusion','заключение'),
        w('reference','ссылка'), w('citation','цитирование'), w('literature review','обзор литературы'),
        w('hypothesis','гипотеза'), w('experiment','эксперимент'), w('dataset','набор данных'),
        w('peer review','рецензирование'), w('journal','журнал'), w('conference paper','материал конференции'),
        w('DOI','цифровой идентификатор объекта'), w('preprint','препринт'),
        w('open access','открытый доступ'), w('plagiarism','плагиат'), w('contribution','вклад'),
        w('systematic review','систематический обзор'), w('PRISMA','PRISMA'),
        w('inclusion criteria','критерии включения'), w('evidence synthesis','синтез доказательств'),
        w('reproducibility','воспроизводимость'),
      ],
    },
    {
      title: 'Presentations',
      words: [
        w('slide deck','набор слайдов'), w('demo','демонстрация'), w('live coding','написание кода в прямом эфире'),
        w('technical audience','техническая аудитория'), w('whiteboard','доска'),
        w('Q&A session','сессия вопросов и ответов'), w('key takeaway','ключевой вывод'),
        w('narrative','нарративная линия'), w('simplify','упрощать'), w('visualise','визуализировать'),
        w('elevator pitch','краткая презентация'), w('talk track','план выступления'),
        w('timing','хронометраж'), w('rehearse','репетировать'), w('handout','раздаточный материал'),
        w('recording','запись'), w('virtual presentation','онлайн-презентация'),
        w('technical depth','техническая глубина'), w('diagram','диаграмма'),
        w('follow-up','дальнейшие действия'), w('technical storytelling','техническое сторителлинг'),
        w('architecture overview','обзор архитектуры'), w('tradeoff analysis','анализ компромиссов'),
        w('demo environment','демонстрационная среда'), w('lightning talk','блиц-доклад'),
      ],
    },
  ],
}

// ─── assembled module lists ────────────────────────────────────────────────────

// CS B1 — 4 modules, all B1
const CS_B1_MODULES: MD[] = [
  mod_fundamentals,
  mod_programming,
  mod_web,
  mod_tools,
]

// CS B1-C1 — 12 modules: first 4 = B1, next 4 = B2, last 4 = C1
const CS_B1C1_MODULES: MD[] = [
  mod_fundamentals,
  mod_programming,
  mod_web,
  mod_tools,
  mod_databases,
  mod_se,
  mod_networks,
  mod_data,
  mod_security,
  mod_architecture,
  mod_ai,
  mod_communication,
]

// ─── seeding logic ────────────────────────────────────────────────────────────

async function seedCourse(courseId: string, modules: MD[], courseName: string) {
  console.log(`\n🔷 Seeding: ${courseName}`)

  // Insert modules
  for (let mi = 0; mi < modules.length; mi++) {
    const mod = modules[mi]
    const { data: modRow, error: modErr } = await db
      .from('english_modules')
      .insert({
        course_id:   courseId,
        title:       mod.title,
        order_index: mi + 1,
        is_active:   true,
        section:     mod.section,
      })
      .select('id')
      .single()

    if (modErr || !modRow) {
      console.error(`  ❌ Module "${mod.title}":`, modErr?.message)
      continue
    }

    const modId = modRow.id
    console.log(`  ✅ Module ${mi + 1}: ${mod.title} [${mod.section}]`)

    // Insert lessons for this module
    for (let li = 0; li < mod.lessons.length; li++) {
      const lesson  = mod.lessons[li]
      const globalOrder = mi * 6 + li + 1  // 1-based lesson order across course

      const { error: lessonErr } = await db
        .from('english_lessons')
        .insert({
          course_id:    courseId,
          module_id:    modId,
          title:        lesson.title,
          order_index:  li + 1,
          lesson_order: globalOrder,
          lesson_type:  'vocabulary',
          is_published: true,
          is_active:    true,
          vocabulary:   lesson.words,
        })

      if (lessonErr) {
        console.error(`    ❌ Lesson "${lesson.title}":`, lessonErr.message)
      } else {
        console.log(`    ✅ Lesson ${li + 1}: ${lesson.title} (${lesson.words.length} words)`)
      }
    }
  }
}

async function main() {
  console.log('🚀 ESP Computer Science seed script')
  console.log('   Supabase URL:', SUPABASE_URL)

  const ALL_IDS = [CS_B1_ID, CS_B1C1_ID]

  // ─── delete old data ───────────────────────────────────────────────────────
  console.log('\n🗑️  Deleting old data...')

  const { error: delLessons } = await db
    .from('english_lessons')
    .delete()
    .in('course_id', ALL_IDS)

  if (delLessons) {
    console.error('❌ Error deleting lessons:', delLessons.message)
    process.exit(1)
  }

  const { error: delModules } = await db
    .from('english_modules')
    .delete()
    .in('course_id', ALL_IDS)

  if (delModules) {
    console.error('❌ Error deleting modules:', delModules.message)
    process.exit(1)
  }

  console.log('   ✅ Old data cleared')

  // ─── seed ─────────────────────────────────────────────────────────────────
  await seedCourse(CS_B1_ID,   CS_B1_MODULES,   'Computer Science B1')
  await seedCourse(CS_B1C1_ID, CS_B1C1_MODULES, 'Computer Science B1-C1')

  console.log('\n🎉 Done! Computer Science seeded.')
  console.log(`   CS B1:     ${CS_B1_MODULES.length} modules, ${CS_B1_MODULES.length * 6} lessons`)
  console.log(`   CS B1-C1: ${CS_B1C1_MODULES.length} modules, ${CS_B1C1_MODULES.length * 6} lessons`)
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err)
  process.exit(1)
})