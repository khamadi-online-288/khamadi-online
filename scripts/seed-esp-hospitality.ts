/**
 * Seed: Hospitality A2 + Hospitality A2-B1
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/seed-esp-hospitality.ts
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
const HOS_A2_ID   = 'ee93b087-d1fe-4b85-838f-1cf7269877f1'
const HOS_A2B1_ID = 'a1000000-0000-0000-0000-000000000008'

// ─── types ────────────────────────────────────────────────────────────────────
type W  = { en: string; ru: string }
type LD = { title: string; words: W[] }
type MD = { title: string; section: string; lessons: LD[] }

function w(en: string, ru: string): W { return { en, ru } }

// ─── Module 1 – Front Office (A2) ────────────────────────────────────────────
const mod_front_office: MD = {
  title: 'Front Office', section: 'A2', lessons: [
    {
      title: 'Check-in & Check-out',
      words: [
        w('check-in','регистрация заезда'), w('check-out','регистрация выезда'),
        w('reception','стойка регистрации'), w('front desk','стойка администратора'),
        w('receptionist','администратор'), w('guest','гость'), w('ID','удостоверение личности'),
        w('passport','паспорт'), w('reservation','бронирование'), w('room key','ключ от номера'),
        w('room card','карта номера'), w('arrival','прибытие'), w('departure','отъезд'),
        w('registration form','регистрационная карта'), w('signature','подпись'),
        w('payment','оплата'), w('deposit','залог'), w('early check-in','ранний заезд'),
        w('late check-out','поздний выезд'), w('luggage','багаж'), w('welcome','добро пожаловать'),
        w('escort','сопроводить'), w('floor','этаж'), w('lift','лифт'), w('checkout time','время выезда'),
      ],
    },
    {
      title: 'Reservations',
      words: [
        w('reservation','бронирование'), w('booking','заказ'), w('confirm','подтвердить'),
        w('cancel','отменить'), w('modify','изменить'), w('availability','наличие мест'),
        w('room type','тип номера'), w('dates','даты'), w('arrival date','дата заезда'),
        w('departure date','дата выезда'), w('number of guests','количество гостей'),
        w('special request','особое пожелание'), w('rate','тариф'), w('price','цена'),
        w('non-refundable','невозвратный'), w('refundable','возвратный'), w('prepaid','предоплаченный'),
        w('hold','поставить в очередь'), w('waitlist','лист ожидания'), w('online booking','онлайн-бронирование'),
        w('direct booking','прямое бронирование'), w('OTA','OTA'),
        w('phone reservation','телефонное бронирование'),
        w('email reservation','бронирование по email'), w('confirmation number','номер подтверждения'),
      ],
    },
    {
      title: 'Room Types',
      words: [
        w('single room','одноместный номер'), w('double room','двухместный номер'),
        w('twin room','номер с двумя кроватями'), w('suite','сюит'), w('deluxe room','делюкс-номер'),
        w('standard room','стандартный номер'), w('superior room','улучшенный номер'),
        w('connecting rooms','смежные номера'), w('accessible room','номер для лиц с ОВЗ'),
        w('sea view','вид на море'), w('city view','вид на город'), w('garden view','вид на сад'),
        w('smoking','для курящих'), w('non-smoking','для некурящих'),
        w('king bed','кровать king-size'), w('queen bed','кровать queen-size'),
        w('balcony','балкон'), w('bathroom','ванная комната'), w('en suite','собственная ванная'),
        w('minibar','мини-бар'), w('air conditioning','кондиционер'), w('floor','этаж'),
        w('room number','номер комнаты'), w('occupancy','вместимость'), w('room size','размер номера'),
      ],
    },
    {
      title: 'Guest Requests',
      words: [
        w('request','запрос'), w('complaint','жалоба'), w('maintenance','техническое обслуживание'),
        w('extra pillow','дополнительная подушка'), w('extra towel','дополнительное полотенце'),
        w('wake-up call','звонок-будильник'), w('room service','обслуживание в номере'),
        w('laundry','стирка'), w('iron','утюг'), w('ironing board','гладильная доска'),
        w('adapter','переходник'), w('cot','детская кровать'), w('baby crib','колыбель'),
        w('rollaway bed','дополнительная кровать'), w('safe','сейф'),
        w('Wi-Fi password','пароль Wi-Fi'), w('do not disturb','не беспокоить'),
        w('make up room','убрать номер'), w('housekeeping','горничная'), w('noise','шум'),
        w('temperature','температура'), w('broken','сломан'), w('repair','ремонт'),
        w('urgent','срочно'), w('assistance','помощь'),
      ],
    },
    {
      title: 'Key Systems',
      words: [
        w('key card','карта-ключ'), w('magnetic stripe','магнитная полоса'),
        w('electronic lock','электронный замок'), w('room number','номер комнаты'),
        w('key deactivation','деактивация карты'), w('duplicate key','дубликат ключа'),
        w('master key','мастер-ключ'), w('key card reader','считыватель карт'),
        w('access control','контроль доступа'), w('door lock','дверной замок'),
        w('battery','батарея'), w('swipe','провести картой'), w('tap','приложить'),
        w('contactless','бесконтактный'), w('key packet','конверт для ключа'),
        w('key sleeve','чехол для ключа'), w('hotel key','гостиничный ключ'),
        w('lost key','потерянный ключ'), w('replacement','замена'),
        w('security','безопасность'), w('electronic entry','электронный вход'),
        w('PIN','PIN-код'), w('access level','уровень доступа'),
        w('staff key','ключ сотрудника'), w('front desk','стойка регистрации'),
      ],
    },
    {
      title: 'Lobby Services',
      words: [
        w('lobby','лобби'), w('concierge','консьерж'), w('porter','носильщик'),
        w('bellhop','посыльный'), w('luggage storage','хранение багажа'),
        w('valet parking','парковка с обслуживанием'), w('taxi','такси'), w('shuttle','шаттл'),
        w('directions','как проехать'), w('recommendation','рекомендация'), w('map','карта'),
        w('tourist information','туристическая информация'), w('local attractions','местные достопримечательности'),
        w('restaurant booking','бронирование ресторана'), w('ticket','билет'), w('tour','экскурсия'),
        w('business centre','бизнес-центр'), w('gift shop','сувенирный магазин'), w('ATM','банкомат'),
        w('pharmacy','аптека'), w('first aid','первая помощь'), w('lost property','бюро находок'),
        w('message','сообщение'), w('parcel','посылка'), w('delivery','доставка'),
      ],
    },
  ],
}

// ─── Module 2 – Guest Communication (A2) ─────────────────────────────────────
const mod_guest_communication: MD = {
  title: 'Guest Communication', section: 'A2', lessons: [
    {
      title: 'Greetings',
      words: [
        w('good morning','доброе утро'), w('good afternoon','добрый день'),
        w('good evening','добрый вечер'), w('welcome','добро пожаловать'), w('hello','здравствуйте'),
        w('how may I help','чем могу помочь'), w('my name is','меня зовут'),
        w('please','пожалуйста'), w('thank you','спасибо'), w('you\'re welcome','пожалуйста'),
        w('certainly','конечно'), w('of course','разумеется'), w('right away','сейчас же'),
        w('I understand','я понимаю'), w('no problem','нет проблем'), w('I apologise','я приношу извинения'),
        w('one moment','одну минуту'), w('please wait','подождите, пожалуйста'),
        w('how are you','как вы поживаете'), w('have a nice stay','приятного пребывания'),
        w('enjoy your meal','приятного аппетита'), w('good night','спокойной ночи'),
        w('see you soon','до скорого'), w('farewell','до свидания'), w('I\'m sorry','извините'),
      ],
    },
    {
      title: 'Phone Calls',
      words: [
        w('telephone','телефон'), w('call','звонок'), w('answer','ответить'), w('hold','удержать'),
        w('transfer','перевести'), w('message','сообщение'), w('voicemail','голосовая почта'),
        w('dial','набрать'), w('extension','добавочный номер'), w('reception','регистратура'),
        w('room number','номер комнаты'), w('caller','звонящий'), w('operator','оператор'),
        w('callback','перезвонить'), w('busy','занято'), w('ring','звонить'),
        w('pick up','поднять трубку'), w('hang up','положить трубку'), w('speak slowly','говорите медленнее'),
        w('repeat','повторить'), w('understand','понять'), w('spell','произнести по буквам'),
        w('confirm','подтвердить'), w('note down','записать'), w('goodbye','до свидания'),
      ],
    },
    {
      title: 'Complaints',
      words: [
        w('complaint','жалоба'), w('problem','проблема'), w('issue','вопрос'),
        w('apologise','извиниться'), w('sorry','сожалею'), w('understand','понимать'),
        w('resolve','решить'), w('fix','устранить'), w('maintenance','техобслуживание'),
        w('manager','менеджер'), w('escalate','эскалировать'), w('compensation','компенсация'),
        w('discount','скидка'), w('refund','возврат средств'), w('replace','заменить'),
        w('move room','переселить в другой номер'), w('inconvenience','неудобство'),
        w('customer satisfaction','удовлетворённость клиента'), w('feedback','отзыв'),
        w('follow up','связаться повторно'), w('solution','решение'), w('immediately','немедленно'),
        w('priority','приоритет'), w('noise','шум'), w('smell','запах'),
      ],
    },
    {
      title: 'Requests',
      words: [
        w('request','просьба'), w('need','нужно'), w('would like','хотел бы'),
        w('could you','не могли бы вы'), w('please','пожалуйста'), w('help','помочь'),
        w('assist','оказать помощь'), w('arrange','организовать'), w('book','забронировать'),
        w('order','заказать'), w('deliver','доставить'), w('bring','принести'),
        w('send','отправить'), w('collect','забрать'), w('inform','сообщить'),
        w('remind','напомнить'), w('prepare','подготовить'), w('provide','предоставить'),
        w('ensure','обеспечить'), w('confirm','подтвердить'), w('urgent','срочно'),
        w('special','особый'), w('preferred','предпочтительный'),
        w('guest preference','предпочтение гостя'), w('service','услуга'),
      ],
    },
    {
      title: 'Emails to Guests',
      words: [
        w('email','электронное письмо'), w('subject','тема'), w('salutation','приветствие'),
        w('Dear Guest','Уважаемый гость'), w('body','основная часть'), w('closing','заключение'),
        w('signature','подпись'), w('reservation confirmation','подтверждение бронирования'),
        w('booking details','данные бронирования'), w('arrival instructions','инструкции по прибытии'),
        w('directions','как добраться'), w('check-in time','время заезда'),
        w('check-out time','время выезда'), w('facility information','информация об удобствах'),
        w('dress code','дресс-код'), w('parking','парковка'), w('amenities','удобства'),
        w('local tips','советы по местности'), w('weather','погода'),
        w('cancellation policy','политика отмены'), w('attachment','вложение'),
        w('contact number','контактный номер'), w('reply','ответить'),
        w('feedback request','запрос отзыва'), w('thank you','спасибо'),
      ],
    },
    {
      title: 'Cultural Awareness',
      words: [
        w('culture','культура'), w('customs','обычаи'), w('tradition','традиция'),
        w('religion','религия'), w('diet','диета'), w('greeting','приветствие'), w('address','обращение'),
        w('title','титул'), w('respect','уважение'), w('sensitivity','чуткость'),
        w('language','язык'), w('translation','перевод'), w('preference','предпочтение'),
        w('gesture','жест'), w('dress code','дресс-код'), w('prayer','молитва'),
        w('room orientation','ориентация комнаты'), w('alcohol','алкоголь'), w('pork','свинина'),
        w('vegetarian','вегетарианец'), w('vegan','веган'), w('halal','халяль'),
        w('kosher','кошерный'), w('name','имя'), w('nationality','национальность'),
      ],
    },
  ],
}

// ─── Module 3 – Food & Beverage (A2) ─────────────────────────────────────────
const mod_food_beverage: MD = {
  title: 'Food & Beverage', section: 'A2', lessons: [
    {
      title: 'Menu Reading',
      words: [
        w('menu','меню'), w('starter','закуска'), w('main course','основное блюдо'),
        w('dessert','десерт'), w('beverage','напиток'), w('dish','блюдо'),
        w('ingredient','ингредиент'), w('description','описание'), w('price','цена'),
        w('portion','порция'), w('daily special','блюдо дня'), w('chef\'s recommendation','рекомендация шефа'),
        w('set menu','фиксированное меню'), w('à la carte','а-ля карт'), w('buffet','шведский стол'),
        w('allergy','аллергия'), w('vegan','веганский'), w('vegetarian','вегетарианский'),
        w('gluten-free','без глютена'), w('halal','халяль'), w('calories','калории'),
        w('spicy','острый'), w('mild','нежный'), w('seasonal','сезонный'), w('local','местный'),
      ],
    },
    {
      title: 'Taking Orders',
      words: [
        w('order','заказ'), w('table','стол'), w('waiter','официант'), w('waitress','официантка'),
        w('server','сервер'), w('ready','готов'), w('choose','выбрать'), w('recommend','рекомендовать'),
        w('preference','предпочтение'), w('starter','закуска'), w('main','основное блюдо'),
        w('dessert','десерт'), w('drink','напиток'), w('still water','негазированная вода'),
        w('sparkling water','газированная вода'), w('wine','вино'), w('beer','пиво'),
        w('juice','сок'), w('coffee','кофе'), w('tea','чай'), w('take away','навынос'),
        w('dine in','поесть в ресторане'), w('split bill','разделить счёт'),
        w('modify','изменить'), w('confirm','подтвердить'),
      ],
    },
    {
      title: 'Service Styles',
      words: [
        w('table service','обслуживание за столом'), w('buffet service','шведский стол'),
        w('counter service','обслуживание у стойки'), w('room service','обслуживание в номере'),
        w('silver service','серебряный сервис'), w('French service','французский сервис'),
        w('American service','американский сервис'), w('set up','сервировка'),
        w('napkin','салфетка'), w('cutlery','столовые приборы'), w('fork','вилка'),
        w('knife','нож'), w('spoon','ложка'), w('plate','тарелка'), w('glass','бокал'),
        w('tablecloth','скатерть'), w('place setting','сервировка на одну персону'),
        w('serve','подать'), w('clear','убрать'), w('refill','пополнить'), w('course','блюдо'),
        w('timing','хронометраж'), w('presentation','подача'), w('professionalism','профессионализм'),
        w('etiquette','этикет'),
      ],
    },
    {
      title: 'Dietary Requirements',
      words: [
        w('dietary requirement','диетические требования'), w('allergy','аллергия'),
        w('intolerance','непереносимость'), w('gluten','глютен'), w('lactose','лактоза'),
        w('nut','орех'), w('shellfish','моллюски'), w('egg','яйцо'), w('soy','соя'),
        w('vegetarian','вегетарианец'), w('vegan','веган'), w('pescatarian','пескетарианец'),
        w('halal','халяль'), w('kosher','кошерный'), w('diabetic','диабетик'),
        w('low sodium','низкое содержание натрия'), w('low fat','низкое содержание жиров'),
        w('sugar-free','без сахара'), w('dairy-free','без молочных продуктов'),
        w('celiac','целиакия'), w('anaphylaxis','анафилаксия'), w('inform','сообщить'),
        w('cross-contamination','перекрёстное заражение'), w('label','этикетка'),
        w('substitute','замена'),
      ],
    },
    {
      title: 'Kitchen Terms',
      words: [
        w('kitchen','кухня'), w('chef','шеф-повар'), w('sous-chef','су-шеф'), w('cook','повар'),
        w('prep','подготовка'), w('mise en place','подготовка ингредиентов'), w('service','отдача блюд'),
        w('order ticket','талон заказа'), w('fire','поставить на огонь'), w('plate up','оформить тарелку'),
        w('garnish','гарнир'), w('sauce','соус'), w('grill','гриль'), w('fry','жарить'),
        w('bake','запекать'), w('steam','готовить на пару'), w('boil','варить'), w('chop','нарезать'),
        w('dice','нарезать кубиками'), w('slice','нарезать ломтиками'), w('season','приправлять'),
        w('taste','пробовать'), w('waste','отходы'), w('hygiene','гигиена'),
        w('food safety','безопасность пищевых продуктов'),
      ],
    },
    {
      title: 'Billing',
      words: [
        w('bill','счёт'), w('check','чек'), w('invoice','инвойс'), w('total','итого'),
        w('subtotal','сумма без налога'), w('VAT','НДС'), w('service charge','плата за обслуживание'),
        w('tip','чаевые'), w('gratuity','чаевые'), w('split','разделить'),
        w('cash','наличные'), w('card','карта'), w('contactless','бесконтактно'),
        w('receipt','квитанция'), w('itemised bill','детализированный счёт'),
        w('payment','оплата'), w('discount','скидка'), w('voucher','ваучер'),
        w('promotion','акция'), w('loyalty points','баллы лояльности'), w('error','ошибка'),
        w('correct','исправить'), w('reprint','перепечатать'), w('signature','подпись'),
        w('settle','погасить'),
      ],
    },
  ],
}

// ─── Module 4 – Housekeeping (A2) ────────────────────────────────────────────
const mod_housekeeping: MD = {
  title: 'Housekeeping', section: 'A2', lessons: [
    {
      title: 'Room Cleaning',
      words: [
        w('clean','убирать'), w('tidy','приводить в порядок'), w('vacuum','пылесосить'),
        w('mop','мыть шваброй'), w('dust','вытирать пыль'), w('wipe','протереть'),
        w('sanitise','обеззараживать'), w('disinfect','дезинфицировать'), w('bathroom','ванная комната'),
        w('toilet','туалет'), w('shower','душ'), w('bathtub','ванна'), w('sink','раковина'),
        w('mirror','зеркало'), w('surface','поверхность'), w('carpet','ковёр'), w('floor','пол'),
        w('bin','мусорная корзина'), w('empty','опустошить'), w('change','сменить'),
        w('bed','кровать'), w('sheets','постельное бельё'), w('pillowcase','наволочка'),
        w('duvet','одеяло'), w('make the bed','застелить кровать'),
      ],
    },
    {
      title: 'Laundry',
      words: [
        w('laundry','стирка'), w('washing','стирать'), w('dry cleaning','химчистка'),
        w('iron','гладить'), w('press','прессовать'), w('fold','складывать'), w('hang','вешать'),
        w('bag','пакет'), w('label','этикетка'), w('collect','забрать'), w('deliver','доставить'),
        w('stain','пятно'), w('delicate','деликатная вещь'), w('machine wash','стиральная машина'),
        w('hand wash','ручная стирка'), w('temperature','температура'), w('fabric','ткань'),
        w('towel','полотенце'), w('bathrobe','халат'), w('sheets','простыни'), w('uniform','форма'),
        w('sorting','сортировка'), w('lost item','потерянная вещь'), w('damage','повреждение'),
        w('receipt','квитанция'),
      ],
    },
    {
      title: 'Amenities',
      words: [
        w('amenity','удобство'), w('toiletry','туалетные принадлежности'), w('shampoo','шампунь'),
        w('conditioner','кондиционер для волос'), w('shower gel','гель для душа'), w('soap','мыло'),
        w('lotion','лосьон'), w('toothbrush','зубная щётка'), w('toothpaste','зубная паста'),
        w('razor','бритва'), w('comb','расчёска'), w('cotton pads','ватные диски'),
        w('shower cap','шапочка для душа'), w('sewing kit','набор для шитья'),
        w('slippers','тапочки'), w('bathrobe','халат'), w('face towel','полотенце для лица'),
        w('hand towel','полотенце для рук'), w('bath towel','банное полотенце'),
        w('minibar','мини-бар'), w('tea','чай'), w('coffee','кофе'), w('kettle','чайник'),
        w('hairdryer','фен'), w('safe','сейф'),
      ],
    },
    {
      title: 'Maintenance Requests',
      words: [
        w('maintenance','техническое обслуживание'), w('repair','ремонт'), w('broken','сломан'),
        w('fix','починить'), w('report','сообщить'), w('technician','техник'), w('leak','утечка'),
        w('plumbing','водопровод'), w('electricity','электричество'), w('light bulb','лампочка'),
        w('air conditioning','кондиционер'), w('heating','отопление'), w('TV','телевизор'),
        w('remote control','пульт управления'), w('Wi-Fi','Wi-Fi'), w('door lock','дверной замок'),
        w('window','окно'), w('furniture','мебель'), w('scratch','царапина'), w('damage','повреждение'),
        w('urgent','срочно'), w('schedule','назначить'), w('inspect','осмотреть'),
        w('replace','заменить'), w('confirm','подтвердить'),
      ],
    },
    {
      title: 'Safety Standards',
      words: [
        w('safety','безопасность'), w('fire exit','пожарный выход'),
        w('fire extinguisher','огнетушитель'), w('smoke detector','датчик дыма'),
        w('sprinkler','спринклер'), w('emergency procedure','аварийная процедура'),
        w('evacuation plan','план эвакуации'), w('first aid','первая помощь'),
        w('accident report','отчёт о происшествии'), w('slip','поскользнуться'), w('trip','споткнуться'),
        w('hazard','опасность'), w('wet floor sign','знак мокрого пола'), w('chemical','химикат'),
        w('glove','перчатка'), w('mask','маска'), w('PPE','СИЗ'), w('COSHH','COSHH'),
        w('risk assessment','оценка рисков'), w('infection control','контроль инфекций'),
        w('cross-contamination','перекрёстное заражение'), w('hygiene','гигиена'),
        w('certification','сертификация'), w('training','обучение'), w('incident','инцидент'),
      ],
    },
    {
      title: 'Lost & Found',
      words: [
        w('lost property','бюро находок'), w('found item','найденная вещь'), w('guest','гость'),
        w('report','сообщить'), w('description','описание'), w('date','дата'), w('location','место'),
        w('room number','номер комнаты'), w('label','этикетка'), w('tag','бирка'),
        w('store','хранить'), w('log','журнал'), w('record','записать'), w('claim','потребовать'),
        w('identify','опознать'), w('return','вернуть'), w('valuables','ценности'),
        w('jewellery','ювелирные украшения'), w('phone','телефон'), w('passport','паспорт'),
        w('wallet','кошелёк'), w('bag','сумка'), w('handover','передача'), w('receipt','квитанция'),
        w('security','служба безопасности'),
      ],
    },
  ],
}

// ─── Module 5 – Tourism & Excursions (B1) ────────────────────────────────────
const mod_tourism: MD = {
  title: 'Tourism & Excursions', section: 'B1', lessons: [
    {
      title: 'Tour Types',
      words: [
        w('guided tour','экскурсия с гидом'), w('self-guided tour','самостоятельная экскурсия'),
        w('group tour','групповой тур'), w('private tour','частный тур'), w('day trip','однодневная поездка'),
        w('half-day tour','полудневная экскурсия'), w('overnight tour','тур с ночёвкой'),
        w('walking tour','пешеходная экскурсия'), w('bus tour','автобусная экскурсия'),
        w('boat tour','морская экскурсия'), w('cycling tour','велосипедная экскурсия'),
        w('cultural tour','культурный тур'), w('adventure tour','приключенческий тур'),
        w('eco-tour','экотур'), w('food tour','гастрономический тур'), w('wine tour','винный тур'),
        w('city tour','городская экскурсия'), w('countryside tour','загородная поездка'),
        w('historical tour','исторический тур'), w('themed tour','тематический тур'),
        w('audio guide','аудиогид'), w('tour operator','туроператор'), w('tour package','турпакет'),
        w('itinerary','маршрут'), w('off-the-beaten-path','нехоженые места'),
      ],
    },
    {
      title: 'Booking',
      words: [
        w('booking','бронирование'), w('reservation','резервирование'), w('confirm','подтвердить'),
        w('availability','наличие'), w('deposit','депозит'), w('full payment','полная оплата'),
        w('cancellation policy','политика отмены'), w('refund','возврат'), w('travel date','дата поездки'),
        w('number of participants','количество участников'), w('tour code','код тура'),
        w('voucher','ваучер'), w('e-ticket','электронный билет'), w('meeting point','место встречи'),
        w('departure time','время отправления'), w('inclusive','включено'), w('exclusive','не включено'),
        w('add-on','дополнительная услуга'), w('upgrade','улучшение'), w('group discount','групповая скидка'),
        w('early bird','ранняя птица'), w('last minute','последняя минута'),
        w('waitlist','лист ожидания'), w('booking reference','референс бронирования'),
        w('terms and conditions','условия и положения'),
      ],
    },
    {
      title: 'Transport',
      words: [
        w('transport','транспорт'), w('transfer','трансфер'), w('shuttle bus','шаттл-автобус'),
        w('taxi','такси'), w('minivan','минивэн'), w('coach','автобус'), w('train','поезд'),
        w('ferry','паром'), w('cruise','круиз'), w('car rental','аренда автомобиля'),
        w('bicycle rental','аренда велосипеда'), w('airport transfer','трансфер из аэропорта'),
        w('pick-up point','место посадки'), w('drop-off','место высадки'), w('route','маршрут'),
        w('timetable','расписание'), w('delay','задержка'), w('departure','отправление'),
        w('arrival','прибытие'), w('ticket','билет'), w('boarding pass','посадочный талон'),
        w('driver','водитель'), w('guide','гид'), w('accessible vehicle','адаптированный транспорт'),
        w('child seat','детское кресло'),
      ],
    },
    {
      title: 'Tourist Attractions',
      words: [
        w('attraction','достопримечательность'), w('landmark','ориентир'), w('monument','памятник'),
        w('museum','музей'), w('gallery','галерея'), w('cathedral','собор'), w('castle','замок'),
        w('palace','дворец'), w('national park','национальный парк'), w('beach','пляж'),
        w('viewpoint','смотровая площадка'), w('market','рынок'), w('street food','уличная еда'),
        w('local neighbourhood','местный квартал'), w('historic district','исторический район'),
        w('UNESCO site','объект ЮНЕСКО'), w('heritage site','объект наследия'),
        w('entrance fee','входная плата'), w('opening hours','часы работы'),
        w('guided tour','экскурсия с гидом'), w('photo spot','место для фото'),
        w('souvenir','сувенир'), w('map','карта'), w('audio guide','аудиогид'), w('must-see','must-see'),
      ],
    },
    {
      title: 'Guiding',
      words: [
        w('guide','гид'), w('tour guide','экскурсовод'), w('local guide','местный гид'),
        w('introduce','представить'), w('explain','объяснить'), w('narrate','рассказывать'),
        w('point out','указать на'), w('answer questions','отвечать на вопросы'), w('lead','вести'),
        w('group','группа'), w('pace','темп'), w('timing','хронометраж'),
        w('engagement','вовлечённость'), w('anecdote','анекдот'), w('fact','факт'),
        w('history','история'), w('culture','культура'), w('language','язык'),
        w('translation','перевод'), w('emergency','чрезвычайная ситуация'),
        w('safety briefing','инструктаж по безопасности'), w('gather','собраться'),
        w('meeting point','место встречи'), w('headset','наушники'), w('commentary','комментарий'),
      ],
    },
    {
      title: 'Travel Insurance',
      words: [
        w('travel insurance','туристическая страховка'), w('policy','полис'),
        w('coverage','покрытие'), w('medical','медицинский'), w('evacuation','эвакуация'),
        w('cancellation','отмена'), w('delay','задержка'), w('lost luggage','потерянный багаж'),
        w('theft','кража'), w('emergency','чрезвычайная ситуация'), w('claim','страховое требование'),
        w('excess','франшиза'), w('premium','страховой взнос'), w('insurer','страховщик'),
        w('beneficiary','выгодоприобретатель'), w('documentation','документация'),
        w('receipt','квитанция'), w('police report','полицейский отчёт'), w('hospital','больница'),
        w('repatriation','репатриация'), w('exclusion','исключение'),
        w('pre-existing condition','ранее существовавшее заболевание'),
        w('adventure activities','экстремальные виды спорта'),
        w('single trip','однократная поездка'), w('annual policy','годовой полис'),
      ],
    },
  ],
}

// ─── Module 6 – Events & Conferences (B1) ────────────────────────────────────
const mod_events: MD = {
  title: 'Events & Conferences', section: 'B1', lessons: [
    {
      title: 'Event Types',
      words: [
        w('conference','конференция'), w('seminar','семинар'), w('workshop','мастер-класс'),
        w('exhibition','выставка'), w('gala dinner','торжественный ужин'),
        w('wedding reception','свадебный приём'), w('product launch','презентация продукта'),
        w('corporate event','корпоративное мероприятие'), w('award ceremony','церемония награждения'),
        w('team building','тимбилдинг'), w('networking event','нетворкинг-мероприятие'),
        w('cocktail party','коктейльный приём'), w('press conference','пресс-конференция'),
        w('charity event','благотворительное мероприятие'),
        w('annual general meeting','ежегодное общее собрание'),
        w('incentive event','поощрительное мероприятие'), w('trade show','торговая выставка'),
        w('graduation ceremony','выпускная церемония'), w('birthday party','день рождения'),
        w('anniversary','годовщина'), w('private dining','частный ужин'),
        w('hybrid event','гибридное мероприятие'), w('virtual event','виртуальное мероприятие'),
        w('banquet','банкет'), w('retreat','выездной семинар'),
      ],
    },
    {
      title: 'Venue Setup',
      words: [
        w('venue','площадка'), w('room layout','планировка зала'), w('theatre style','театральный стиль'),
        w('classroom style','классный стиль'), w('U-shape','U-образная расстановка'),
        w('boardroom','переговорная'), w('cabaret','кабаре'), w('banquet round','банкетный стол'),
        w('cocktail','коктейльный'), w('exhibition','выставочный'), w('stage','сцена'),
        w('podium','подиум'), w('screen','экран'), w('projector','проектор'),
        w('flip chart','флипчарт'), w('whiteboard','белая доска'), w('lighting','освещение'),
        w('chairs','стулья'), w('tables','столы'), w('nameplate','табличка с именем'),
        w('registration desk','стойка регистрации'), w('signage','указатели'),
        w('cloakroom','гардероб'), w('car park','автостоянка'), w('capacity','вместимость'),
      ],
    },
    {
      title: 'Catering',
      words: [
        w('catering','кейтеринг'), w('menu','меню'), w('buffet','шведский стол'),
        w('sit-down dinner','ужин за столом'), w('canapés','канапе'), w('finger food','закуски'),
        w('coffee break','кофе-пауза'), w('morning tea','утреннее чаепитие'),
        w('afternoon tea','послеполуденное чаепитие'), w('lunch','обед'), w('dinner','ужин'),
        w('dietary requirement','диетические требования'), w('allergy','аллергия'),
        w('portion','порция'), w('presentation','сервировка'), w('service staff','обслуживающий персонал'),
        w('replenishment','пополнение'), w('clearing','уборка'), w('bar','бар'),
        w('beverages','напитки'), w('alcoholic','алкогольный'), w('non-alcoholic','безалкогольный'),
        w('waitstaff','официанты'), w('chef','шеф-повар'), w('quantities','количество'),
      ],
    },
    {
      title: 'AV Equipment',
      words: [
        w('AV equipment','аудиовизуальное оборудование'), w('projector','проектор'),
        w('screen','экран'), w('microphone','микрофон'), w('lapel mic','петличный микрофон'),
        w('handheld mic','ручной микрофон'), w('speaker','динамик'), w('sound system','звуковая система'),
        w('laptop','ноутбук'), w('HDMI cable','кабель HDMI'), w('clicker','кликер'),
        w('laser pointer','лазерная указка'), w('webcam','веб-камера'),
        w('live streaming','прямая трансляция'), w('recording','запись'), w('lighting','освещение'),
        w('spotlight','прожектор'), w('backdrop','задний план'), w('LED screen','LED-экран'),
        w('video wall','видеостена'), w('PA system','система озвучивания'),
        w('technician','техник'), w('setup','установка'), w('test','тест'), w('troubleshoot','устранение неполадок'),
      ],
    },
    {
      title: 'Client Brief',
      words: [
        w('client brief','бриф клиента'), w('requirements','требования'), w('objectives','цели'),
        w('target audience','целевая аудитория'), w('theme','тема'), w('budget','бюджет'),
        w('timeline','временные рамки'), w('guest list','список гостей'), w('seating plan','план рассадки'),
        w('programme','программа'), w('agenda','повестка дня'), w('keynote speaker','основной докладчик'),
        w('VIP','VIP'), w('entertainment','развлечения'), w('photography','фотография'),
        w('videography','видеосъёмка'), w('floral','флористика'), w('decoration','декорация'),
        w('branding','брендинг'), w('signage','указатели'), w('special request','особый запрос'),
        w('dietary','диетические требования'), w('accommodation','проживание'),
        w('transport','транспорт'), w('feedback','отзыв'),
      ],
    },
    {
      title: 'Event Coordination',
      words: [
        w('event coordinator','координатор мероприятий'), w('timeline','временная шкала'),
        w('checklist','чеклист'), w('run of show','порядок проведения'), w('briefing','брифинг'),
        w('supplier','поставщик'), w('vendor','вендор'), w('setup time','время подготовки'),
        w('rehearsal','репетиция'), w('on-the-day management','управление в день события'),
        w('registration','регистрация'), w('welcome desk','стойка приветствия'),
        w('name badges','именные бейджи'), w('programme','программа'),
        w('speaker coordination','координация спикеров'), w('stage management','управление сценой'),
        w('breakdown','разборка'), w('feedback','отзыв'), w('post-event report','пост-отчёт'),
        w('client satisfaction','удовлетворённость клиента'), w('invoice','инвойс'),
        w('payment','оплата'), w('next event','следующее мероприятие'),
        w('lessons learned','извлечённые уроки'), w('handover','передача'),
      ],
    },
  ],
}

// ─── Module 7 – Hotel Operations (B1) ────────────────────────────────────────
const mod_hotel_operations: MD = {
  title: 'Hotel Operations', section: 'B1', lessons: [
    {
      title: 'Departments',
      words: [
        w('front office','стойка регистрации'), w('housekeeping','служба горничных'),
        w('food and beverage','служба питания'), w('kitchen','кухня'), w('maintenance','техслужба'),
        w('security','служба безопасности'), w('human resources','отдел кадров'),
        w('finance','финансовый отдел'), w('sales and marketing','продажи и маркетинг'),
        w('IT','IT-отдел'), w('spa','СПА'), w('concierge','консьерж'),
        w('banqueting','банкетная служба'), w('reservations','отдел бронирования'),
        w('revenue management','управление доходами'), w('general manager','генеральный менеджер'),
        w('department head','начальник отдела'), w('supervisor','супервайзер'),
        w('team leader','руководитель команды'), w('staff','персонал'),
        w('cross-departmental','межотдельный'), w('coordination','координация'),
        w('briefing','брифинг'), w('handover','передача смены'), w('organogram','организационная схема'),
      ],
    },
    {
      title: 'Shift Management',
      words: [
        w('shift','смена'), w('morning shift','утренняя смена'), w('afternoon shift','дневная смена'),
        w('night shift','ночная смена'), w('handover','передача смены'), w('briefing','брифинг'),
        w('roster','расписание'), w('schedule','график'), w('overtime','сверхурочные'),
        w('break','перерыв'), w('start time','начало смены'), w('end time','конец смены'),
        w('cover','замещение'), w('absence','отсутствие'), w('sickness','болезнь'),
        w('replacement','замена'), w('duty manager','дежурный менеджер'),
        w('supervisor','супервайзер'), w('on call','дежурство'), w('log book','журнал'),
        w('incident report','отчёт об инциденте'), w('task list','список задач'),
        w('priorities','приоритеты'), w('communication','коммуникация'), w('feedback','обратная связь'),
      ],
    },
    {
      title: 'SOPs',
      words: [
        w('SOP','СОП'), w('standard operating procedure','стандартная рабочая процедура'),
        w('checklist','чеклист'), w('policy','политика'), w('guideline','руководство'),
        w('quality standard','стандарт качества'), w('step-by-step','пошаговый'),
        w('compliance','соответствие'), w('training','обучение'), w('consistency','единообразие'),
        w('brand standard','стандарт бренда'), w('audit','аудит'), w('review','проверка'),
        w('update','обновление'), w('version control','контроль версий'), w('sign-off','утверждение'),
        w('responsible','ответственный'), w('timeline','временные рамки'),
        w('photograph','фотография'), w('documentation','документация'),
        w('record keeping','ведение записей'), w('corrective action','корректирующее действие'),
        w('escalation','эскалация'), w('manager approval','одобрение менеджера'),
        w('staff training','обучение персонала'),
      ],
    },
    {
      title: 'Quality Standards',
      words: [
        w('quality standard','стандарт качества'), w('brand standard','стандарт бренда'),
        w('inspection','проверка'), w('audit','аудит'), w('mystery guest','тайный гость'),
        w('guest satisfaction score','оценка удовлетворённости'), w('TripAdvisor rating','рейтинг TripAdvisor'),
        w('review','отзыв'), w('feedback','обратная связь'), w('complaint','жалоба'),
        w('corrective action','корректирующее действие'), w('service recovery','восстановление сервиса'),
        w('benchmark','эталон'), w('KPI','КПЭ'), w('OTA rating','рейтинг OTA'),
        w('star rating','звёздный рейтинг'), w('accreditation','аккредитация'),
        w('hygiene','гигиена'), w('safety','безопасность'), w('cleanliness','чистота'),
        w('presentation','подача'), w('staff grooming','внешний вид персонала'),
        w('training','обучение'), w('consistency','единообразие'), w('improvement plan','план улучшения'),
      ],
    },
    {
      title: 'Occupancy',
      words: [
        w('occupancy rate','коэффициент загрузки'), w('rooms available','доступные номера'),
        w('rooms sold','проданные номера'), w('vacancy','вакантность'), w('full capacity','полная загрузка'),
        w('peak season','высокий сезон'), w('off-peak','низкий сезон'),
        w('shoulder season','межсезонье'), w('RevPAR','RevPAR'), w('ADR','ADR'),
        w('average daily rate','средняя суточная ставка'), w('revenue','выручка'),
        w('booking','бронирование'), w('cancellation','отмена'), w('no-show','не явился'),
        w('walk-in','гость без бронирования'), w('group booking','групповое бронирование'),
        w('block booking','блочное бронирование'), w('yield management','управление доходами'),
        w('demand forecast','прогноз спроса'), w('overbooking','сверхбронирование'),
        w('waitlist','лист ожидания'), w('availability','наличие'), w('room nights','ночи в номере'),
        w('night audit','ночной аудит'),
      ],
    },
    {
      title: 'Revenue',
      words: [
        w('revenue','выручка'), w('room revenue','выручка от номеров'),
        w('F&B revenue','выручка от питания'), w('spa revenue','выручка от СПА'),
        w('ancillary revenue','дополнительная выручка'), w('RevPAR','RevPAR'), w('ADR','ADR'),
        w('occupancy rate','коэффициент загрузки'),
        w('TRevPAR','общая выручка на доступный номер'), w('GOP','валовая операционная прибыль'),
        w('gross operating profit','валовая операционная прибыль'), w('profit margin','маржа прибыли'),
        w('cost','затраты'), w('expense','расходы'), w('payroll cost','расходы на персонал'),
        w('utility','коммунальные услуги'), w('food cost','стоимость продуктов'),
        w('budget','бюджет'), w('forecast','прогноз'), w('variance','отклонение'),
        w('P&L','отчёт о прибылях и убытках'), w('monthly report','ежемесячный отчёт'),
        w('yield management','управление доходами'), w('upselling','апселлинг'),
        w('channel mix','микс каналов'),
      ],
    },
  ],
}

// ─── Module 8 – Customer Experience (B1) ─────────────────────────────────────
const mod_customer_experience: MD = {
  title: 'Customer Experience', section: 'B1', lessons: [
    {
      title: 'Guest Journey',
      words: [
        w('guest journey','путь гостя'), w('pre-arrival','до прибытия'), w('arrival','прибытие'),
        w('check-in','заезд'), w('room experience','опыт проживания'), w('dining','питание'),
        w('activity','активность'), w('checkout','выезд'), w('post-stay','после пребывания'),
        w('touchpoint','точка контакта'), w('moment of truth','момент истины'),
        w('impression','впечатление'), w('expectation','ожидание'), w('satisfaction','удовлетворённость'),
        w('delight','восторг'), w('disappointment','разочарование'), w('gap','разрыв'),
        w('service blueprint','план предоставления услуг'), w('process mapping','карта процессов'),
        w('emotional journey','эмоциональный путь'), w('digital journey','цифровой путь'),
        w('communication','коммуникация'), w('personalisation','персонализация'),
        w('follow-up','связаться повторно'), w('loyalty','лояльность'),
      ],
    },
    {
      title: 'Loyalty Programs',
      words: [
        w('loyalty programme','программа лояльности'), w('member','участник'), w('tier','уровень'),
        w('points','баллы'), w('reward','вознаграждение'), w('redeem','использовать'),
        w('expiry','срок действия'), w('status','статус'), w('silver','серебряный'),
        w('gold','золотой'), w('platinum','платиновый'), w('elite','элитный'),
        w('benefit','преимущество'), w('upgrade','улучшение'), w('free night','бесплатная ночь'),
        w('late check-out','поздний выезд'), w('welcome amenity','приветственный подарок'),
        w('priority check-in','приоритетный заезд'), w('lounge access','доступ в лаунж'),
        w('earn','зарабатывать'), w('spend','тратить'), w('enroll','зарегистрироваться'),
        w('card','карта'), w('digital wallet','цифровой кошелёк'), w('partner','партнёр'),
      ],
    },
    {
      title: 'Reviews',
      words: [
        w('review','отзыв'), w('online review','онлайн-отзыв'), w('TripAdvisor','TripAdvisor'),
        w('Google review','отзыв в Google'), w('Booking.com','Booking.com'),
        w('rating','рейтинг'), w('star rating','звёздный рейтинг'), w('comment','комментарий'),
        w('positive','положительный'), w('negative','отрицательный'), w('response','ответ'),
        w('reply','ответить'), w('acknowledge','признать'), w('apologise','извиниться'),
        w('thank','поблагодарить'), w('manager response','ответ менеджера'),
        w('reputation management','управление репутацией'), w('ORM','управление онлайн-репутацией'),
        w('feedback','отзыв'), w('trend','тенденция'), w('analysis','анализ'),
        w('monitor','мониторить'), w('flag','отметить'), w('fake review','поддельный отзыв'),
        w('improve','улучшить'),
      ],
    },
    {
      title: 'Service Recovery',
      words: [
        w('service recovery','восстановление сервиса'), w('complaint','жалоба'),
        w('apologise','извиниться'), w('empathise','сочувствовать'), w('listen','слушать'),
        w('acknowledge','признать'), w('resolve','решить'), w('compensate','компенсировать'),
        w('follow up','связаться повторно'), w('escalate','эскалировать'), w('manager','менеджер'),
        w('satisfaction','удовлетворённость'), w('trust','доверие'), w('rebuild','восстановить'),
        w('gesture','жест'), w('upgrade','улучшение'), w('discount','скидка'),
        w('voucher','ваучер'), w('complimentary','бесплатный'), w('speed','скорость'),
        w('sincerity','искренность'), w('ownership','ответственность'), w('record','записать'),
        w('prevent','предотвратить'), w('learn','учиться на опыте'),
      ],
    },
    {
      title: 'Upselling',
      words: [
        w('upselling','апселлинг'), w('cross-selling','кросс-продажи'), w('upgrade','улучшение'),
        w('suggest','предложить'), w('recommend','рекомендовать'), w('benefit','преимущество'),
        w('value','ценность'), w('feature','характеристика'), w('room upgrade','улучшение номера'),
        w('suite','сюит'), w('sea view','вид на море'), w('package','пакет'),
        w('spa','СПА'), w('breakfast','завтрак'), w('dinner','ужин'),
        w('late check-out','поздний выезд'), w('tour','экскурсия'), w('transfer','трансфер'),
        w('add-on','дополнительная услуга'), w('personalised offer','персональное предложение'),
        w('guest preference','предпочтение гостя'), w('commission','комиссия'),
        w('incentive','стимул'), w('training','обучение'), w('conversion rate','коэффициент конверсии'),
      ],
    },
    {
      title: 'Personalization',
      words: [
        w('personalisation','персонализация'), w('guest preference','предпочтение гостя'),
        w('profile','профиль'), w('data','данные'), w('history','история'),
        w('name','имя'), w('occasion','повод'), w('birthday','день рождения'),
        w('anniversary','годовщина'), w('honeymoon','медовый месяц'), w('celebration','праздник'),
        w('special request','особый запрос'), w('food preference','пищевое предпочтение'),
        w('pillow menu','меню подушек'), w('room temperature','температура в номере'),
        w('newspaper','газета'), w('welcome letter','приветственное письмо'),
        w('amenity','подарок от отеля'), w('surprise','сюрприз'), w('delight','восторг'),
        w('CRM','CRM'), w('loyalty data','данные о лояльности'), w('communication','коммуникация'),
        w('tailor','настраивать под гостя'), w('memorable','незабываемый'),
      ],
    },
  ],
}

// ─── assembled module lists ────────────────────────────────────────────────────

const HOS_A2_MODULES: MD[] = [
  mod_front_office,
  mod_guest_communication,
  mod_food_beverage,
  mod_housekeeping,
]

const HOS_A2B1_MODULES: MD[] = [
  mod_front_office,
  mod_guest_communication,
  mod_food_beverage,
  mod_housekeeping,
  mod_tourism,
  mod_events,
  mod_hotel_operations,
  mod_customer_experience,
]

// ─── seeding logic ────────────────────────────────────────────────────────────

async function seedCourse(courseId: string, modules: MD[], courseName: string) {
  console.log(`\n🔷 Seeding: ${courseName}`)

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

    for (let li = 0; li < mod.lessons.length; li++) {
      const lesson      = mod.lessons[li]
      const globalOrder = mi * 6 + li + 1

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
  console.log('🚀 ESP Hospitality seed script')
  console.log('   Supabase URL:', SUPABASE_URL)

  const ALL_IDS = [HOS_A2_ID, HOS_A2B1_ID]

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

  await seedCourse(HOS_A2_ID,   HOS_A2_MODULES,   'Hospitality A2')
  await seedCourse(HOS_A2B1_ID, HOS_A2B1_MODULES, 'Hospitality A2-B1')

  console.log('\n🎉 Done! Hospitality seeded.')
  console.log(`   Hospitality A2:    ${HOS_A2_MODULES.length} modules, ${HOS_A2_MODULES.length * 6} lessons`)
  console.log(`   Hospitality A2-B1: ${HOS_A2B1_MODULES.length} modules, ${HOS_A2B1_MODULES.length * 6} lessons`)
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err)
  process.exit(1)
})
