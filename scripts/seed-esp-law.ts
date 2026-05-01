/**
 * Seed: Law B1 + Law B1-C1
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/seed-esp-law.ts
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
const LAW_B1_ID   = '2c78884e-4b41-4dcd-b153-4b696bf89621'
const LAW_B1C1_ID = 'a1000000-0000-0000-0000-000000000012'

// ─── types ────────────────────────────────────────────────────────────────────
type W  = { en: string; ru: string }
type LD = { title: string; words: W[] }
type MD = { title: string; section: string; lessons: LD[] }

function w(en: string, ru: string): W { return { en, ru } }

// ─── Module 1 – Legal System Basics (B1) ─────────────────────────────────────
const mod_legal_system: MD = {
  title: 'Legal System Basics', section: 'B1', lessons: [
    {
      title: 'Courts & Jurisdiction',
      words: [
        w('court','суд'), w('jurisdiction','юрисдикция'), w('tribunal','трибунал'),
        w('magistrate','магистрат'), w('judge','судья'), w('magistrate court','мировой суд'),
        w('crown court','уголовный суд'), w('county court','окружной суд'),
        w('high court','высокий суд'), w('court of appeal','апелляционный суд'),
        w('supreme court','верховный суд'), w('competent court','компетентный суд'),
        w('civil court','гражданский суд'), w('criminal court','уголовный суд'),
        w('family court','семейный суд'), w('small claims','мелкие иски'),
        w('venue','место рассмотрения'), w('appellate','апелляционный'),
        w('original jurisdiction','первоначальная юрисдикция'),
        w('appellate jurisdiction','апелляционная юрисдикция'),
        w('territorial jurisdiction','территориальная юрисдикция'),
        w('in personam','в отношении лица'), w('in rem','в отношении вещи'),
        w('exclusive jurisdiction','исключительная юрисдикция'),
        w('concurrent jurisdiction','параллельная юрисдикция'),
      ],
    },
    {
      title: 'Types of Law',
      words: [
        w('civil law','гражданское право'), w('criminal law','уголовное право'),
        w('public law','публичное право'), w('private law','частное право'),
        w('common law','общее право'), w('statute law','статутное право'),
        w('case law','прецедентное право'), w('constitutional law','конституционное право'),
        w('administrative law','административное право'), w('contract law','договорное право'),
        w('tort law','деликтное право'), w('property law','имущественное право'),
        w('family law','семейное право'), w('employment law','трудовое право'),
        w('international law','международное право'), w('equity','право справедливости'),
        w('precedent','прецедент'), w('legislation','законодательство'),
        w('regulation','регулирование'), w('by-law','подзаконный акт'),
        w('delegated legislation','делегированное законодательство'),
        w('primary legislation','первичное законодательство'),
        w('secondary legislation','вторичное законодательство'),
        w('customary law','обычное право'), w('EU law','право ЕС'),
      ],
    },
    {
      title: 'Legal Persons',
      words: [
        w('legal person','юридическое лицо'), w('natural person','физическое лицо'),
        w('corporation','корпорация'), w('company','компания'), w('partnership','партнёрство'),
        w('sole trader','индивидуальный предприниматель'), w('limited liability','ограниченная ответственность'),
        w('unlimited liability','неограниченная ответственность'), w('legal capacity','правоспособность'),
        w('legal standing','правовой статус'), w('plaintiff','истец'), w('defendant','ответчик'),
        w('claimant','заявитель'), w('respondent','ответчик'), w('third party','третья сторона'),
        w('beneficiary','выгодоприобретатель'), w('trustee','доверенное лицо'),
        w('agent','агент'), w('principal','принципал'), w('nominee','номинальное лицо'),
        w('legal representative','законный представитель'), w('next friend','законный представитель несовершеннолетнего'),
        w('guardian','опекун'), w('executor','исполнитель завещания'),
        w('administrator','администратор наследства'),
      ],
    },
    {
      title: 'Rights & Duties',
      words: [
        w('right','право'), w('duty','обязанность'), w('obligation','обязательство'),
        w('legal right','юридическое право'), w('legal duty','юридическая обязанность'),
        w('civil right','гражданское право'), w('human right','право человека'),
        w('right to silence','право хранить молчание'), w('right to fair trial','право на справедливое судебное разбирательство'),
        w('freedom of expression','свобода слова'), w('right to privacy','право на неприкосновенность'),
        w('breach','нарушение'), w('remedy','средство защиты'), w('enforce','принудить к исполнению'),
        w('injunction','судебный запрет'), w('damages','ущерб'), w('specific performance','принудительное исполнение'),
        w('rescission','расторжение'), w('waiver','отказ от права'), w('limitation','ограничение'),
        w('absolute right','абсолютное право'), w('qualified right','квалифицированное право'),
        w('derogation','отступление'), w('proportionality','соразмерность'),
        w('positive obligation','позитивное обязательство'),
      ],
    },
    {
      title: 'Sources of Law',
      words: [
        w('source of law','источник права'), w('legislation','законодательство'),
        w('statute','статут'), w('act of parliament','акт парламента'),
        w('statutory instrument','нормативный акт'), w('delegated legislation','делегированное законодательство'),
        w('common law','общее право'), w('precedent','прецедент'),
        w('stare decisis','принцип прецедента'), w('ratio decidendi','правовая позиция решения'),
        w('obiter dicta','попутные суждения'), w('equity','право справедливости'),
        w('case law','прецедентное право'), w('treaty','договор'), w('EU law','право ЕС'),
        w('European Convention on Human Rights','Европейская конвенция о правах человека'),
        w('international law','международное право'), w('custom','обычай'),
        w('convention','конвенция'), w('practice direction','указание о порядке'),
        w('judicial review','судебный контроль'), w('codification','кодификация'),
        w('consolidation','консолидация'), w('repeal','отмена'), w('amendment','поправка'),
      ],
    },
    {
      title: 'Legal Procedure',
      words: [
        w('procedure','процедура'), w('claim','иск'), w('issue','предъявить иск'),
        w('serve','вручить'), w('particulars of claim','основание иска'), w('defence','защита'),
        w('counterclaim','встречный иск'), w('hearing','слушание'), w('trial','судебное разбирательство'),
        w('evidence','доказательство'), w('witness','свидетель'), w('expert witness','эксперт'),
        w('judge','судья'), w('jury','жюри присяжных'), w('verdict','приговор'),
        w('judgment','решение суда'), w('appeal','апелляция'), w('enforcement','исполнение'),
        w('costs','судебные издержки'), w('disclosure','раскрытие'), w('discovery','истребование доказательств'),
        w('directions hearing','слушание по процессуальным вопросам'),
        w('case management','управление делом'), w('summary judgment','суммарное решение'),
        w('strike out','прекращение производства'),
      ],
    },
  ],
}

// ─── Module 2 – Contract Law (B1) ────────────────────────────────────────────
const mod_contract_law: MD = {
  title: 'Contract Law', section: 'B1', lessons: [
    {
      title: 'Offer & Acceptance',
      words: [
        w('offer','оферта'), w('acceptance','акцепт'), w('counter-offer','встречная оферта'),
        w('invitation to treat','приглашение к оферте'), w('offeror','оферент'), w('offeree','акцептант'),
        w('revoke','отозвать'), w('lapse','истечение'), w('communication','уведомление'),
        w('postal rule','правило почтовой коробки'), w('mirror image rule','правило зеркального отражения'),
        w('battle of the forms','борьба форм'), w('terms','условия'), w('negotiate','вести переговоры'),
        w('binding','обязывающий'), w('agreement','соглашение'), w('contract','договор'),
        w('formation','формирование'), w('effective','вступивший в силу'), w('unconditional','безусловный'),
        w('conditional','условный'), w('silence','молчание'), w('conduct','поведение'),
        w('electronic contract','электронный договор'), w('cross-offer','перекрёстная оферта'),
      ],
    },
    {
      title: 'Consideration',
      words: [
        w('consideration','встречное удовлетворение'), w('bargain','сделка'), w('value','ценность'),
        w('past consideration','прошлое встречное удовлетворение'),
        w('present consideration','настоящее встречное удовлетворение'),
        w('future consideration','будущее встречное удовлетворение'),
        w('executed','исполненное'), w('executory','неисполненное'),
        w('sufficient','достаточное'), w('adequate','адекватное'), w('privity','относительность'),
        w('deed','акт'), w('promissory estoppel','промиссорный эстоппель'),
        w('economic duress','экономическое принуждение'), w('benefit','выгода'),
        w('detriment','ущерб'), w('legal value','юридическая ценность'),
        w('existing duty','существующая обязанность'), w('public duty','публичная обязанность'),
        w('contractual duty','договорная обязанность'), w('variation','изменение'),
        w('modification','модификация'), w('accord and satisfaction','соглашение и удовлетворение'),
        w('nominal consideration','номинальное встречное удовлетворение'), w('peppercorn','пустяковое'),
      ],
    },
    {
      title: 'Terms',
      words: [
        w('term','условие'), w('condition','существенное условие'), w('warranty','гарантийное условие'),
        w('innominate term','безымянное условие'), w('express term','явно выраженное условие'),
        w('implied term','подразумеваемое условие'), w('incorporate','включить'),
        w('notice','уведомление'), w('course of dealing','практика сделок'),
        w('trade usage','торговый обычай'), w('representation','заявление'),
        w('misrepresentation','искажение фактов'), w('exclusion clause','исключительная оговорка'),
        w('limitation clause','ограничительная оговорка'), w('UCTA','UCTA'),
        w('reasonableness test','тест разумности'), w('unfair terms','несправедливые условия'),
        w('consumer contract','потребительский договор'), w('collateral term','побочное условие'),
        w('condition precedent','отлагательное условие'), w('condition subsequent','отменительное условие'),
        w('severance','разделение'), w('boilerplate','стандартные условия'),
        w('entire agreement','полное соглашение'), w('main obligation','основное обязательство'),
      ],
    },
    {
      title: 'Breach',
      words: [
        w('breach','нарушение'), w('anticipatory breach','ожидаемое нарушение'),
        w('actual breach','фактическое нарушение'), w('repudiatory breach','отказное нарушение'),
        w('fundamental breach','существенное нарушение'), w('material breach','материальное нарушение'),
        w('minor breach','незначительное нарушение'), w('innocent party','добросовестная сторона'),
        w('right to terminate','право на расторжение'), w('affirm','подтвердить'),
        w('accept breach','принять нарушение'), w('damages','убытки'), w('loss','ущерб'),
        w('causation','причинно-следственная связь'), w('remoteness','отдалённость'),
        w('mitigation','смягчение'), w('reliance loss','убытки из доверия'),
        w('expectation loss','убытки ожидания'), w('restitution','реституция'),
        w('account of profits','отчёт о прибыли'), w('contributory negligence','совместная халатность'),
        w('penalty clause','штрафная оговорка'), w('liquidated damages','заранее оценённые убытки'),
        w('unlawful penalty','незаконный штраф'), w('wrongful party','нарушившая сторона'),
      ],
    },
    {
      title: 'Remedies',
      words: [
        w('remedy','средство защиты'), w('damages','убытки'), w('specific performance','принудительное исполнение'),
        w('injunction','судебный запрет'), w('rescission','расторжение'), w('rectification','исправление'),
        w('account of profits','отчёт о прибыли'), w('restitution','реституция'),
        w('causation','причинно-следственная связь'), w('but-for test','тест «но для»'),
        w('remoteness','отдалённость'), w('Hadley v Baxendale','Хэдли против Баксендейла'),
        w('limitation','исковая давность'), w('election','выбор средства'),
        w('equitable remedy','справедливое средство'), w('common law remedy','средство общего права'),
        w('compensatory damages','компенсаторные убытки'), w('nominal damages','номинальные убытки'),
        w('punitive damages','штрафные убытки'), w('aggravated damages','повышенные убытки'),
        w('contempt of court','неуважение к суду'), w('enforcement','принудительное исполнение'),
        w('execution','исполнение'), w('damages cap','предел убытков'), w('interest','проценты'),
      ],
    },
    {
      title: 'Void Contracts',
      words: [
        w('void','ничтожный'), w('voidable','оспоримый'), w('unenforceable','не имеющий исковой силы'),
        w('illegal contract','незаконный договор'), w('void for uncertainty','ничтожный по неопределённости'),
        w('lack of capacity','отсутствие дееспособности'), w('minor','несовершеннолетний'),
        w('intoxication','опьянение'), w('mental incapacity','психическая недееспособность'),
        w('misrepresentation','искажение фактов'), w('mistake','ошибка'),
        w('common mistake','общая ошибка'), w('mutual mistake','взаимная ошибка'),
        w('unilateral mistake','односторонняя ошибка'), w('duress','принуждение'),
        w('undue influence','ненадлежащее влияние'), w('unconscionable','несправедливый'),
        w('non est factum','это не мой акт'), w('frustration','невозможность исполнения'),
        w('supervening impossibility','последующая невозможность'), w('force majeure','форс-мажор'),
        w('illegality','незаконность'), w('restraint of trade','ограничение торговли'),
        w('public policy','публичный порядок'), w('severance','разделение'),
      ],
    },
  ],
}

// ─── Module 3 – Criminal Law (B1) ────────────────────────────────────────────
const mod_criminal_law: MD = {
  title: 'Criminal Law', section: 'B1', lessons: [
    {
      title: 'Offences & Elements',
      words: [
        w('offence','преступление'), w('actus reus','виновное деяние'), w('mens rea','виновный умысел'),
        w('intent','умысел'), w('recklessness','безрассудство'), w('negligence','халатность'),
        w('strict liability','строгая ответственность'), w('murder','убийство'),
        w('manslaughter','непредумышленное убийство'), w('assault','нападение'),
        w('battery','физическое нападение'), w('theft','кража'), w('fraud','мошенничество'),
        w('robbery','ограбление'), w('burglary','взлом'), w('criminal damage','уголовный вред'),
        w('drug offence','наркотическое преступление'), w('conspiracy','сговор'),
        w('attempt','покушение'), w('incitement','подстрекательство'),
        w('aiding and abetting','пособничество'), w('principal','исполнитель'),
        w('accessory','соучастник'), w('joint enterprise','совместное предприятие'),
        w('sexual offence','сексуальное преступление'),
      ],
    },
    {
      title: 'Evidence',
      words: [
        w('evidence','доказательство'), w('admissible','допустимое'), w('inadmissible','недопустимое'),
        w('hearsay','слухи'), w('witness statement','показания свидетеля'),
        w('confession','признание'), w('exhibit','вещественное доказательство'),
        w('documentary evidence','документальное доказательство'),
        w('real evidence','вещественное доказательство'),
        w('direct evidence','прямое доказательство'), w('circumstantial evidence','косвенное доказательство'),
        w('burden of proof','бремя доказывания'), w('standard of proof','стандарт доказывания'),
        w('beyond reasonable doubt','вне разумных сомнений'),
        w('balance of probabilities','баланс вероятностей'), w('exclusionary rule','правило исключения'),
        w('privilege','привилегия'), w('legal professional privilege','адвокатская тайна'),
        w('public interest immunity','иммунитет публичного интереса'),
        w('character evidence','доказательство о характере'), w('bad character','плохой характер'),
        w('expert evidence','экспертные доказательства'), w('DNA','ДНК'),
        w('fingerprint','отпечаток пальца'), w('CCTV','видеонаблюдение'),
      ],
    },
    {
      title: 'Arrest & Detention',
      words: [
        w('arrest','арест'), w('caution','предупреждение'), w('right to silence','право хранить молчание'),
        w('PACE','PACE'), w('police powers','полицейские полномочия'), w('warrant','ордер'),
        w('search','обыск'), w('detain','задержать'), w('custody','стражу'),
        w('custody sergeant','дежурный сержант'), w('cell','камера'),
        w('appropriate adult','надлежащий взрослый'), w('solicitor','поверенный'),
        w('legal advice','юридическая консультация'), w('interview','допрос'),
        w('tape record','аудиозапись'), w('charge','обвинение'), w('bail','залог'),
        w('remand','задержание до суда'), w('conditions of bail','условия залога'),
        w('police station','полицейский участок'), w('identification parade','опознание'),
        w('stop and search','остановить и обыскать'), w('breathalyser','алкотестер'),
        w('voluntary attendance','добровольная явка'),
      ],
    },
    {
      title: 'Trial Process',
      words: [
        w('indictment','обвинительное заключение'), w('charge','обвинение'), w('plea','признание вины'),
        w('guilty','виновен'), w('not guilty','не виновен'),
        w('crown prosecution service','Служба уголовного преследования'),
        w('prosecute','преследовать'), w('defend','защищать'), w('defence','защита'),
        w('jury','жюри присяжных'), w('jury selection','отбор присяжных'),
        w('opening speech','вступительная речь'),
        w('examination-in-chief','прямой допрос'), w('cross-examination','перекрёстный допрос'),
        w('re-examination','повторный допрос'), w('closing speech','заключительная речь'),
        w('direction','напутствие'), w('summing up','подведение итогов'),
        w('verdict','приговор'), w('acquittal','оправдание'), w('conviction','осуждение'),
        w('trial within a trial','суд в суде'), w('voir dire','вуар-дир'),
        w('public gallery','публичная галерея'), w('reporting restrictions','ограничения отчётности'),
      ],
    },
    {
      title: 'Sentencing',
      words: [
        w('sentence','приговор'), w('custodial sentence','лишение свободы'),
        w('community order','общественные работы'), w('fine','штраф'), w('discharge','освобождение'),
        w('conditional discharge','условное освобождение'),
        w('absolute discharge','безусловное освобождение'),
        w('suspended sentence','условный приговор'), w('probation','испытательный срок'),
        w('rehabilitation','реабилитация'), w('deterrence','устрашение'),
        w('punishment','наказание'), w('retribution','возмездие'),
        w('protection of public','защита общества'), w('Sentencing Council','Совет по приговорам'),
        w('guideline','руководство'), w('aggravating factor','отягчающее обстоятельство'),
        w('mitigating factor','смягчающее обстоятельство'), w('previous convictions','предыдущие судимости'),
        w('credit for guilty plea','скидка за признание вины'), w('totality','совокупность'),
        w('concurrent','одновременный'), w('consecutive','последовательный'),
        w('pre-sentence report','досудебный доклад'), w('parole','условно-досрочное освобождение'),
      ],
    },
    {
      title: 'Appeals',
      words: [
        w('appeal','апелляция'), w('right of appeal','право на апелляцию'),
        w('grounds of appeal','основания апелляции'), w('Court of Appeal','Апелляционный суд'),
        w('Supreme Court','Верховный суд'), w('leave to appeal','разрешение на апелляцию'),
        w('fresh evidence','новые доказательства'), w('unsafe conviction','небезопасное осуждение'),
        w('perverse verdict','извращённый приговор'), w('misdirection','ненадлежащее напутствие'),
        w('procedural error','процессуальная ошибка'), w('miscarriage of justice','судебная ошибка'),
        w('Criminal Cases Review Commission','Комиссия по пересмотру уголовных дел'),
        w('retrial','повторное рассмотрение'), w('reference','ходатайство'),
        w('quash','отменить'), w('substitute','заменить'), w('reduction','уменьшение'),
        w('dismissal','отклонение'), w('Attorney General reference','ссылка Генерального прокурора'),
        w('unduly lenient','чрезмерно мягкий'), w('sentence appeal','апелляция приговора'),
        w('prosecutor\'s appeal','апелляция прокурора'),
        w('European Court of Human Rights','Европейский суд по правам человека'),
        w('petition','петиция'),
      ],
    },
  ],
}

// ─── Module 4 – Legal Documents (B1) ─────────────────────────────────────────
const mod_legal_documents: MD = {
  title: 'Legal Documents', section: 'B1', lessons: [
    {
      title: 'Contracts',
      words: [
        w('contract','договор'), w('parties','стороны'), w('recitals','преамбула'),
        w('definitions','определения'), w('operative clauses','исполнительные пункты'),
        w('obligations','обязательства'), w('rights','права'), w('representations','заявления'),
        w('warranties','гарантии'), w('covenants','соглашения'), w('conditions','условия'),
        w('payment','оплата'), w('term','срок'), w('termination','расторжение'),
        w('boilerplate','стандартные условия'), w('governing law','применимое право'),
        w('jurisdiction','юрисдикция'), w('entire agreement','полное соглашение'),
        w('amendment','изменение'), w('waiver','отказ от права'), w('assignment','уступка'),
        w('notices','уведомления'), w('confidentiality','конфиденциальность'),
        w('force majeure','форс-мажор'), w('signature block','блок подписи'),
      ],
    },
    {
      title: 'Agreements',
      words: [
        w('agreement','соглашение'), w('heads of agreement','основные условия'),
        w('memorandum of understanding','меморандум о взаимопонимании'), w('MOU','МОВ'),
        w('letter of intent','письмо о намерениях'), w('LOI','ЛОН'), w('term sheet','лист условий'),
        w('shareholders agreement','акционерное соглашение'),
        w('joint venture agreement','соглашение о СП'),
        w('franchise agreement','договор франшизы'),
        w('distribution agreement','дистрибуционное соглашение'),
        w('service agreement','соглашение об оказании услуг'),
        w('non-disclosure agreement','соглашение о неразглашении'), w('NDA','НДА'),
        w('settlement agreement','мировое соглашение'),
        w('deed of assignment','акт уступки'), w('deed of trust','акт доверительного управления'),
        w('sale and purchase agreement','договор купли-продажи'), w('SPA','ДКП'),
        w('employment agreement','трудовое соглашение'), w('lease agreement','договор аренды'),
        w('loan agreement','кредитное соглашение'), w('agency agreement','агентское соглашение'),
        w('partnership agreement','соглашение о партнёрстве'), w('deed of covenant','акт соглашения'),
      ],
    },
    {
      title: 'Affidavits',
      words: [
        w('affidavit','аффидевит'), w('sworn statement','клятвенное заявление'),
        w('deponent','присягающий'), w('swear','присягать'), w('affirm','подтверждать'),
        w('oath','клятва'), w('affirmation','заверение'), w('jurat','юрат'),
        w('commissioner for oaths','уполномоченный по присяге'), w('notary public','нотариус'),
        w('exhibit','приложение'), w('heading','заголовок'),
        w('title of proceedings','название дела'), w('first person','первое лицо'),
        w('truthful','правдивый'), w('full disclosure','полное раскрытие'), w('perjury','лжесвидетельство'),
        w('false statement','ложное заявление'), w('serve','вручить'), w('file','подать'),
        w('court','суд'), w('supporting evidence','подтверждающие доказательства'),
        w('facts','факты'), w('belief','убеждение'), w('information','сведения'),
      ],
    },
    {
      title: 'Statements',
      words: [
        w('witness statement','показания свидетеля'), w('statement of truth','заявление об истинности'),
        w('claimant','заявитель'), w('defendant','ответчик'), w('solicitor','поверенный'),
        w('legal proceedings','судебное производство'), w('factual account','фактическое описание'),
        w('chronological','хронологический'), w('exhibit','приложение'), w('attachment','вложение'),
        w('reference','ссылка'), w('signature','подпись'), w('date','дата'),
        w('numbered paragraphs','пронумерованные абзацы'), w('first person','первое лицо'),
        w('truthful','правдивый'), w('personal knowledge','личные знания'), w('belief','убеждение'),
        w('hearsay','слухи'), w('discrepancy','расхождение'), w('supplementary','дополнительный'),
        w('cross-reference','перекрёстная ссылка'), w('civil proceedings','гражданское производство'),
        w('criminal proceedings','уголовное производство'), w('police statement','полицейское заявление'),
      ],
    },
    {
      title: 'Correspondence',
      words: [
        w('legal letter','юридическое письмо'), w('letter before action','досудебное письмо'),
        w('LBA','ЛБА'), w('without prejudice','без ущерба для прав'),
        w('open letter','открытое письмо'), w('privileged','привилегированный'),
        w('confidential','конфиденциальный'), w('reference','ссылка'), w('client matter','дело клиента'),
        w('solicitor','поверенный'), w('instructed','проинструктированный'), w('advise','советовать'),
        w('demand','требовать'), w('deadline','срок'), w('claim','требование'),
        w('response','ответ'), w('litigation','судебное разбирательство'),
        w('settlement','урегулирование'), w('payment','оплата'), w('interest','проценты'),
        w('costs','судебные издержки'), w('enclosure','приложение'), w('cc','копия'),
        w('registered post','заказная почта'), w('acknowledgement','подтверждение'),
      ],
    },
    {
      title: 'Court Forms',
      words: [
        w('court form','форма суда'), w('claim form','исковое заявление'),
        w('defence form','форма защиты'), w('acknowledgement of service','подтверждение вручения'),
        w('counterclaim','встречный иск'), w('application notice','уведомление о заявлении'),
        w('witness summons','повестка свидетелю'), w('subpoena','судебная повестка'),
        w('order','определение'), w('judgment','решение суда'), w('enforcement','исполнение'),
        w('warrant','ордер'), w('freezing order','обеспечительный арест'),
        w('search order','ордер обыска'), w('injunction','судебный запрет'),
        w('N1','N1'), w('N9','N9'), w('N244','N244'), w('file','подать'),
        w('serve','вручить'), w('court fee','судебная пошлина'), w('stamp','печать'),
        w('lodge','подать на регистрацию'), w('return date','дата возврата'), w('listing','регистрация'),
      ],
    },
  ],
}

// ─── Module 5 – Corporate Law (B2) ───────────────────────────────────────────
const mod_corporate_law: MD = {
  title: 'Corporate Law', section: 'B2', lessons: [
    {
      title: 'Company Types',
      words: [
        w('private limited company','частная компания с ограниченной ответственностью'),
        w('public limited company','публичная компания'), w('PLC','ПАО'),
        w('LLP','ТО партнёрство'), w('limited liability partnership','партнёрство с ограниченной ответственностью'),
        w('sole trader','индивидуальный предприниматель'), w('partnership','партнёрство'),
        w('general partnership','общее партнёрство'), w('unlimited company','компания без ограниченной ответственности'),
        w('community interest company','компания общественных интересов'), w('CIC','КОИ'),
        w('charity','благотворительная организация'), w('holding company','холдинговая компания'),
        w('subsidiary','дочерняя компания'), w('parent company','материнская компания'),
        w('incorporated','зарегистрированная'), w('unincorporated','незарегистрированная'),
        w('articles','устав'), w('memorandum','меморандум'), w('company number','номер компании'),
        w('registered office','зарегистрированный офис'),
        w('certificate of incorporation','свидетельство о регистрации'),
        w('Companies House','Регистрационная палата'), w('off-the-shelf company','готовая компания'),
        w('shell company','компания-пустышка'),
      ],
    },
    {
      title: 'Incorporation',
      words: [
        w('incorporation','регистрация'), w('register','зарегистрировать'),
        w('Companies House','Регистрационная палата'), w('articles of association','устав общества'),
        w('memorandum of association','учредительный договор'),
        w('share capital','акционерный капитал'), w('director','директор'),
        w('company secretary','секретарь компании'), w('subscriber','подписчик'),
        w('shareholder','акционер'), w('initial shares','начальные акции'),
        w('model articles','типовой устав'), w('bespoke articles','индивидуальный устав'),
        w('certificate of incorporation','свидетельство о регистрации'),
        w('registered office','зарегистрированный офис'), w('trading name','торговое название'),
        w('legal name','юридическое название'), w('SIC code','код деятельности'),
        w('annual return','ежегодный отчёт'), w('confirmation statement','подтверждающее заявление'),
        w('filing','подача документов'), w('compliance','соответствие'),
        w('strike off','ликвидация'), w('dissolution','роспуск'), w('liquidation','ликвидация'),
      ],
    },
    {
      title: 'Shareholders',
      words: [
        w('shareholder','акционер'), w('member','участник'), w('share','акция'),
        w('equity','капитал'), w('voting right','право голоса'), w('dividend','дивиденд'),
        w('share certificate','акционерный сертификат'), w('register of members','реестр участников'),
        w('ordinary shares','обыкновенные акции'), w('preference shares','привилегированные акции'),
        w('class A','класс A'), w('class B','класс B'), w('shareholder agreement','акционерное соглашение'),
        w('pre-emption right','право преимущественной покупки'),
        w('drag along','право принудительной продажи'),
        w('tag along','право присоединения к продаже'), w('good leaver','добросовестный акционер'),
        w('bad leaver','недобросовестный акционер'), w('squeeze out','принудительный выкуп'),
        w('compulsory acquisition','принудительное приобретение'),
        w('minority','меньшинство'), w('majority','большинство'), w('quorum','кворум'),
        w('resolution','решение'), w('general meeting','общее собрание'), w('AGM','ГОСА'),
      ],
    },
    {
      title: 'Directors',
      words: [
        w('director','директор'), w('board','совет директоров'),
        w('executive director','исполнительный директор'),
        w('non-executive director','независимый директор'), w('managing director','управляющий директор'),
        w('chair','председатель'), w('secretary','секретарь'), w('fiduciary duty','фидуциарная обязанность'),
        w('duty of care','обязанность заботы'), w('duty of loyalty','обязанность лояльности'),
        w('conflict of interest','конфликт интересов'),
        w('related party transaction','сделка со связанной стороной'),
        w('board resolution','решение совета'), w('minutes','протокол'), w('powers','полномочия'),
        w('delegation','делегирование'), w('company seal','печать компании'),
        w('indemnity','возмещение'), w('D&O insurance','страхование директоров'),
        w('disqualification','дисквалификация'), w('wrongful trading','незаконная торговля'),
        w('fraudulent trading','мошенническая торговля'), w('shadow director','теневой директор'),
        w('de facto director','фактический директор'), w('register of directors','реестр директоров'),
      ],
    },
    {
      title: 'Liability',
      words: [
        w('limited liability','ограниченная ответственность'),
        w('unlimited liability','неограниченная ответственность'),
        w('veil of incorporation','корпоративная завеса'), w('pierce the veil','снять корпоративную завесу'),
        w('alter ego','альтер эго'), w('fraud','мошенничество'), w('sham','фиктивная сделка'),
        w('group liability','групповая ответственность'), w('personal liability','личная ответственность'),
        w('guarantee','гарантия'), w('indemnity','возмещение'), w('wrongful trading','незаконная торговля'),
        w('fraudulent trading','мошенническая торговля'), w('insolvent','несостоятельный'),
        w('director liability','ответственность директора'),
        w('shareholder liability','ответственность акционера'),
        w('statutory liability','законодательная ответственность'),
        w('contractual liability','договорная ответственность'),
        w('tortious liability','деликтная ответственность'),
        w('vicarious liability','косвенная ответственность'),
        w('employer liability','ответственность работодателя'),
        w('product liability','ответственность за продукт'),
        w('environmental liability','экологическая ответственность'),
        w('regulatory liability','регуляторная ответственность'), w('criminal liability','уголовная ответственность'),
      ],
    },
    {
      title: 'Dissolution',
      words: [
        w('dissolution','роспуск'), w('strike off','ликвидация'),
        w('voluntary strike off','добровольная ликвидация'),
        w('compulsory strike off','принудительная ликвидация'),
        w('winding up','ликвидация'), w('liquidation','ликвидация'), w('insolvency','несостоятельность'),
        w('administration','внешнее управление'), w('receivership','конкурсное управление'),
        w('creditor','кредитор'), w('preferential creditor','привилегированный кредитор'),
        w('secured creditor','обеспеченный кредитор'), w('unsecured creditor','необеспеченный кредитор'),
        w('distribution','распределение'), w('assets','активы'), w('liabilities','обязательства'),
        w('proof of debt','требование кредитора'), w('final meeting','заключительное собрание'),
        w('gazette','официальный вестник'), w('deregistration','дерегистрация'),
        w('dormant company','бездействующая компания'), w('restoration','восстановление'),
        w('dissolution order','решение о роспуске'), w('Companies House','Регистрационная палата'),
        w('bona vacantia','выморочное имущество'),
      ],
    },
  ],
}

// ─── Module 6 – Property Law (B2) ────────────────────────────────────────────
const mod_property_law: MD = {
  title: 'Property Law', section: 'B2', lessons: [
    {
      title: 'Ownership',
      words: [
        w('ownership','право собственности'), w('freehold','абсолютное право собственности'),
        w('leasehold','арендное право'), w('title','право собственности на землю'),
        w('legal owner','юридический собственник'), w('beneficial owner','бенефициарный собственник'),
        w('registered land','зарегистрированная земля'), w('unregistered land','незарегистрированная земля'),
        w('possessory title','право владения'), w('absolute title','абсолютный титул'),
        w('co-ownership','совместная собственность'), w('joint tenancy','совместная аренда'),
        w('tenancy in common','долевая аренда'), w('beneficial interest','бенефициарный интерес'),
        w('trust of land','доверительное управление землёй'), w('overriding interest','преобладающий интерес'),
        w('overreachable interest','преодолимый интерес'), w('minor interest','незначительный интерес'),
        w('registered charge','зарегистрированный залог'), w('equitable interest','право справедливости'),
        w('legal interest','юридический интерес'), w('adverse possession','приобретательная давность'),
        w('easement','сервитут'), w('profit','извлечение выгоды'), w('covenant','соглашение'),
      ],
    },
    {
      title: 'Title',
      words: [
        w('title','право собственности'), w('register','реестр'), w('title number','номер титула'),
        w('title deeds','правоустанавливающие документы'), w('Land Registry','Земельный реестр'),
        w('HMLR','HMLR'), w('first registration','первичная регистрация'),
        w('title plan','план участка'), w('title register','реестр права собственности'),
        w('proprietorship register','реестр правообладателей'),
        w('charges register','реестр обременений'), w('property register','реестр имущества'),
        w('transfer','передача'), w('TR1','TR1'), w('completion','завершение'),
        w('conveyance','передача права собственности'), w('abstract of title','абстракт права собственности'),
        w('root of title','основание права'), w('search','поиск'),
        w('local authority search','поиск в органах власти'), w('drainage search','поиск дренажа'),
        w('environmental search','экологический поиск'), w('chancel repair','ремонт нефа'),
        w('restrictive covenant','ограничительное соглашение'), w('indemnity covenant','компенсационное соглашение'),
      ],
    },
    {
      title: 'Leases',
      words: [
        w('lease','аренда'), w('tenancy','найм'), w('landlord','арендодатель'),
        w('tenant','арендатор'), w('rent','аренда'), w('term','срок'), w('lease length','длина аренды'),
        w('break clause','условие о досрочном расторжении'),
        w('rent review','пересмотр арендной платы'), w('repairing obligation','обязательство по ремонту'),
        w('alienation','отчуждение'), w('subletting','субаренда'), w('assignment','уступка'),
        w('FRI lease','аренда FRI'), w('service charge','плата за услуги'),
        w('dilapidations','ухудшение состояния'), w('quiet enjoyment','спокойное пользование'),
        w('forfeiture','конфискация'), w('relief from forfeiture','освобождение от конфискации'),
        w('notice to quit','уведомление о выселении'), w('section 25 notice','уведомление по разделу 25'),
        w('section 26 notice','уведомление по разделу 26'),
        w('business tenancy','деловая аренда'), w('assured shorthold tenancy','гарантированный краткосрочный найм'),
        w('periodic tenancy','периодический найм'),
      ],
    },
    {
      title: 'Mortgages',
      words: [
        w('mortgage','ипотека'), w('charge','залог'), w('mortgagor','залогодатель'),
        w('mortgagee','залогодержатель'), w('lender','кредитор'), w('borrower','заёмщик'),
        w('residential mortgage','жилищная ипотека'), w('commercial mortgage','коммерческая ипотека'),
        w('legal charge','юридический залог'), w('equitable charge','справедливый залог'),
        w('LTV','LTV'), w('loan to value','соотношение кредита к стоимости'),
        w('repayment','погашение'), w('interest only','только проценты'),
        w('redemption','погашение'), w('discharge','освобождение от залога'),
        w('possession proceedings','судебное владение'), w('repossession','изъятие'),
        w('receiver','управляющий'), w('sale of mortgaged property','продажа заложенного имущества'),
        w('priority','приоритет'), w('second charge','второй залог'), w('remortgage','перекредитование'),
        w('endowment','накопительная страховка'), w('overpayment','переплата'),
      ],
    },
    {
      title: 'Easements',
      words: [
        w('easement','сервитут'), w('right of way','право прохода'), w('right of light','право на свет'),
        w('right to water','право на воду'), w('right of support','право на поддержку'),
        w('servient land','подчинённый участок'), w('dominant land','господствующий участок'),
        w('appurtenant','принадлежащий'), w('express grant','явное предоставление'),
        w('implied grant','подразумеваемое предоставление'), w('prescription','приобретательная давность'),
        w('lost modern grant','утраченное современное предоставление'),
        w('statutory easement','законодательный сервитут'), w('extinguishment','прекращение'),
        w('abandonment','отказ'), w('release','освобождение'), w('merger','слияние'),
        w('unity of ownership','единство собственности'), w('burden','обременение'),
        w('benefit','выгода'), w('register','реестр'), w('notice','уведомление'),
        w('land charges','земельные залоги'), w('overriding interest','преобладающий интерес'),
        w('equitable easement','справедливый сервитут'),
      ],
    },
    {
      title: 'Land Registration',
      words: [
        w('Land Registry','Земельный реестр'), w('register','реестр'),
        w('title register','реестр права собственности'), w('charges register','реестр обременений'),
        w('proprietorship register','реестр правообладателей'), w('property register','реестр имущества'),
        w('title plan','план участка'), w('first registration','первичная регистрация'),
        w('voluntary registration','добровольная регистрация'),
        w('compulsory registration','обязательная регистрация'),
        w('electronic conveyancing','электронный перевод права'),
        w('transfer','передача'), w('TR1','TR1'), w('discharge','освобождение'), w('DS1','DS1'),
        w('official search','официальный поиск'), w('priority period','приоритетный период'),
        w('freeze','заморозить'), w('AP1','AP1'), w('OC1','OC1'), w('OC2','OC2'),
        w('OS1','OS1'), w('register search','поиск в реестре'), w('rectification','исправление'),
        w('alteration','изменение'),
      ],
    },
  ],
}

// ─── Module 7 – Employment Law (B2) ──────────────────────────────────────────
const mod_employment_law: MD = {
  title: 'Employment Law', section: 'B2', lessons: [
    {
      title: 'Employment Contracts',
      words: [
        w('employment contract','трудовой договор'), w('written statement','письменное заявление'),
        w('terms and conditions','условия и положения'), w('probationary period','испытательный срок'),
        w('notice period','срок уведомления'), w('salary','зарплата'),
        w('working hours','рабочее время'), w('holiday entitlement','право на отпуск'),
        w('sick pay','пособие по болезни'), w('pension','пенсия'), w('TUPE','TUPE'),
        w('variation','изменение'), w('express term','явно выраженное условие'),
        w('implied term','подразумеваемое условие'), w('duty of fidelity','обязанность верности'),
        w('confidentiality','конфиденциальность'), w('restrictive covenant','ограничительное соглашение'),
        w('garden leave','отстранение от работы'), w('non-compete','ограничение конкуренции'),
        w('non-solicitation','запрет переманивания'), w('post-termination restriction','ограничение после увольнения'),
        w('intellectual property','интеллектуальная собственность'), w('staff handbook','справочник сотрудника'),
        w('grievance','жалоба'), w('disciplinary','дисциплинарный'),
      ],
    },
    {
      title: 'Termination',
      words: [
        w('termination','расторжение'), w('resignation','увольнение по собственному желанию'),
        w('dismissal','увольнение'), w('redundancy','сокращение'),
        w('constructive dismissal','вынужденное увольнение'), w('wrongful dismissal','незаконное увольнение'),
        w('unfair dismissal','несправедливое увольнение'), w('fair reason','законное основание'),
        w('capability','профессиональная пригодность'), w('conduct','поведение'),
        w('statutory illegality','законодательная незаконность'), w('SOSR','SOSR'),
        w('notice','уведомление'), w('payment in lieu of notice','выплата вместо уведомления'),
        w('PILON','PILON'), w('severance pay','выходное пособие'),
        w('statutory redundancy pay','установленное пособие по сокращению'),
        w('compromise agreement','мировое соглашение'),
        w('settlement agreement','соглашение об урегулировании'),
        w('without prejudice','без ущерба для прав'), w('protective award','защитная выплата'),
        w('reinstatement','восстановление на работе'), w('re-engagement','повторное трудоустройство'),
        w('S111A','раздел 111A'), w('compensation','компенсация'),
      ],
    },
    {
      title: 'Discrimination',
      words: [
        w('discrimination','дискриминация'), w('direct discrimination','прямая дискриминация'),
        w('indirect discrimination','косвенная дискриминация'), w('harassment','преследование'),
        w('victimisation','виктимизация'), w('protected characteristic','защищённая характеристика'),
        w('age','возраст'), w('disability','инвалидность'), w('gender reassignment','смена пола'),
        w('marriage','брак'), w('pregnancy','беременность'), w('race','раса'),
        w('religion','религия'), w('sex','пол'), w('sexual orientation','сексуальная ориентация'),
        w('reasonable adjustment','разумная корректировка'), w('burden of proof','бремя доказывания'),
        w('comparator','сравниваемое лицо'), w('justification','обоснование'),
        w('occupational requirement','профессиональное требование'), w('positive action','позитивные действия'),
        w('equal pay','равная оплата'), w('gender pay gap','гендерный разрыв в оплате'),
        w('Equality Act','Закон о равенстве'), w('EHRC','EHRC'),
      ],
    },
    {
      title: 'Health & Safety',
      words: [
        w('health and safety','здоровье и безопасность'), w('HSWA','HSWA'),
        w('duty of care','обязанность заботы'), w('risk assessment','оценка рисков'),
        w('safe system of work','безопасная система труда'), w('PPE','СИЗ'),
        w('manual handling','ручное перемещение грузов'), w('RIDDOR','RIDDOR'),
        w('COSHH','COSHH'), w('DSE','ДСЭ'), w('fire safety','пожарная безопасность'),
        w('electrical safety','электробезопасность'), w('lone working','работа в одиночку'),
        w('work-related stress','стресс на рабочем месте'), w('wellbeing','благополучие'),
        w('ergonomics','эргономика'), w('accident','несчастный случай'),
        w('investigation','расследование'), w('reportable incident','подлежащий отчётности инцидент'),
        w('improvement notice','уведомление об улучшении'),
        w('prohibition notice','запрещающее уведомление'), w('HSE','HSE'),
        w('enforcement','принудительное применение'),
        w('corporate manslaughter','корпоративное непредумышленное убийство'),
        w('occupier\'s liability','ответственность владельца помещения'),
      ],
    },
    {
      title: 'Disputes',
      words: [
        w('employment dispute','трудовой спор'), w('grievance','жалоба'),
        w('grievance procedure','процедура подачи жалобы'), w('formal grievance','официальная жалоба'),
        w('mediation','медиация'), w('ACAS','ACAS'), w('early conciliation','досудебное урегулирование'),
        w('employment tribunal','трудовой суд'), w('ET1','ET1'), w('ET3','ET3'),
        w('claim','иск'), w('response','ответ'), w('without prejudice','без ущерба для прав'),
        w('settlement','урегулирование'), w('conciliation','примирение'),
        w('compromise agreement','мировое соглашение'), w('COT3','COT3'),
        w('costs award','взыскание судебных издержек'), w('Polkey','Полки'),
        w('contributory fault','вина пострадавшего'), w('Calderbank offer','предложение Калдербанк'),
        w('litigation','судебное разбирательство'), w('employment judge','судья по трудовым спорам'),
        w('panel','комиссия'), w('hearing','слушание'),
      ],
    },
    {
      title: 'Tribunals',
      words: [
        w('employment tribunal','трудовой суд'),
        w('employment appeal tribunal','апелляционный трудовой суд'),
        w('judge','судья'), w('panel','комиссия'), w('lay member','непрофессиональный член'),
        w('ET1','ET1'), w('ET3','ET3'), w('case management','управление делом'),
        w('preliminary hearing','предварительное слушание'),
        w('full merits hearing','полное слушание по существу'),
        w('submission','ходатайство'), w('evidence','доказательство'),
        w('oral evidence','устные показания'), w('documentary evidence','документальные доказательства'),
        w('witness','свидетель'), w('cross-examination','перекрёстный допрос'),
        w('judgment','решение'), w('remedy hearing','слушание о мерах защиты'),
        w('reinstatement','восстановление на работе'), w('re-engagement','повторное трудоустройство'),
        w('compensation','компенсация'), w('basic award','базовая выплата'),
        w('compensatory award','компенсационная выплата'), w('uplift','надбавка'),
        w('Acas code','Кодекс ACAS'),
      ],
    },
  ],
}

// ─── Module 8 – Intellectual Property (B2) ───────────────────────────────────
const mod_ip: MD = {
  title: 'Intellectual Property', section: 'B2', lessons: [
    {
      title: 'Copyright',
      words: [
        w('copyright','авторское право'), w('literary work','литературное произведение'),
        w('artistic work','художественное произведение'), w('musical work','музыкальное произведение'),
        w('dramatic work','драматическое произведение'), w('film','фильм'),
        w('sound recording','звукозапись'), w('broadcast','трансляция'),
        w('typographical arrangement','типографское оформление'), w('database right','право на базу данных'),
        w('author','автор'), w('first owner','первоначальный правообладатель'),
        w('assignment','уступка'), w('licence','лицензия'), w('moral rights','личные неимущественные права'),
        w('fair dealing','добросовестное использование'), w('infringement','нарушение'),
        w('primary infringement','первичное нарушение'), w('secondary infringement','вторичное нарушение'),
        w('remedies','средства защиты'), w('injunction','судебный запрет'),
        w('damages','убытки'), w('account of profits','отчёт о прибыли'),
        w('delivery up','изъятие'), w('duration','срок действия'),
      ],
    },
    {
      title: 'Patents',
      words: [
        w('patent','патент'), w('invention','изобретение'), w('novel','новый'),
        w('inventive step','изобретательский шаг'), w('industrial application','промышленная применимость'),
        w('patent application','патентная заявка'), w('claims','формула изобретения'),
        w('description','описание'), w('prior art','предшествующий уровень техники'),
        w('patentee','патентообладатель'), w('grant','выдача'), w('EPO','ЕПВ'), w('UKIPO','UKIPO'),
        w('patent term','срок патента'), w('prosecution','процедура патентования'),
        w('examination','экспертиза'), w('opposition','возражение'), w('PCT application','заявка PCT'),
        w('national phase','национальная фаза'), w('European patent','европейский патент'),
        w('infringement','нарушение'), w('anticipation','предвосхищение'),
        w('obviousness','очевидность'), w('licences of right','лицензии по праву'),
        w('compulsory licence','обязательная лицензия'),
      ],
    },
    {
      title: 'Trademarks',
      words: [
        w('trademark','товарный знак'), w('registered mark','зарегистрированный знак'),
        w('unregistered mark','незарегистрированный знак'), w('distinctive','отличительный'),
        w('descriptive','описательный'), w('deceptive','вводящий в заблуждение'),
        w('similar mark','схожее обозначение'), w('identical mark','идентичное обозначение'),
        w('passing off','имитация'), w('Classes of Nice','классы Ниццы'),
        w('application','заявка'), w('examination','экспертиза'), w('opposition','возражение'),
        w('registration','регистрация'), w('renewal','продление'), w('revocation','аннулирование'),
        w('invalidity','недействительность'), w('infringement','нарушение'),
        w('likelihood of confusion','вероятность смешения'), w('well-known mark','общеизвестный знак'),
        w('comparative advertising','сравнительная реклама'), w('dilution','размывание'),
        w('co-existence','сосуществование'), w('collective mark','коллективный знак'),
        w('certification mark','знак сертификации'),
      ],
    },
    {
      title: 'Trade Secrets',
      words: [
        w('trade secret','коммерческая тайна'), w('confidential information','конфиденциальная информация'),
        w('know-how','ноу-хау'), w('NDA','НДА'),
        w('non-disclosure agreement','соглашение о неразглашении'),
        w('breach of confidence','нарушение конфиденциальности'), w('employee duty','обязанность сотрудника'),
        w('fiduciary duty','фидуциарная обязанность'), w('springboard injunction','запрет трамплина'),
        w('misappropriation','незаконное присвоение'), w('industrial espionage','промышленный шпионаж'),
        w('data theft','кража данных'), w('TRIPS','ТРИПС'),
        w('protectable','защищаемый'), w('reasonable steps','разумные меры'), w('identification','идентификация'),
        w('secrecy','секретность'), w('reverse engineering','обратная разработка'),
        w('employee restraint','ограничение сотрудника'), w('garden leave','отстранение от работы'),
        w('post-employment','после трудоустройства'),
        w('inevitable disclosure','неизбежное раскрытие'), w('legitimate interest','законный интерес'),
        w('enforcement','принудительное применение'), w('Defend Trade Secrets Act','DTSA'),
      ],
    },
    {
      title: 'Licensing',
      words: [
        w('licence','лицензия'), w('exclusive licence','исключительная лицензия'),
        w('non-exclusive licence','неисключительная лицензия'), w('sole licence','единственная лицензия'),
        w('licensor','лицензиар'), w('licensee','лицензиат'), w('royalty','роялти'),
        w('upfront fee','авансовый платёж'), w('milestone payment','поэтапный платёж'),
        w('territory','территория'), w('field of use','сфера использования'),
        w('sub-licence','сублицензия'), w('cross-licence','перекрёстная лицензия'),
        w('compulsory licence','обязательная лицензия'), w('patent licence','патентная лицензия'),
        w('trademark licence','лицензия на товарный знак'),
        w('copyright licence','лицензия на авторские права'),
        w('software licence','лицензия на программное обеспечение'), w('franchise','франшиза'),
        w('technology transfer','передача технологий'), w('FRAND','FRAND'),
        w('SEP','SEP'), w('standard essential patent','стандартно необходимый патент'),
        w('term','срок'), w('termination','расторжение'),
      ],
    },
    {
      title: 'Infringement',
      words: [
        w('infringement','нарушение'), w('direct infringement','прямое нарушение'),
        w('indirect infringement','косвенное нарушение'),
        w('contributory infringement','содействующее нарушение'),
        w('joint tortfeasor','совместный правонарушитель'),
        w('interim injunction','промежуточный судебный запрет'),
        w('final injunction','окончательный судебный запрет'), w('damages','убытки'),
        w('account of profits','отчёт о прибыли'), w('additional damages','дополнительные убытки'),
        w('delivery up','изъятие'), w('destruction','уничтожение'),
        w('search order','ордер обыска'), w('Anton Piller','Антон Пиллер'),
        w('freezing order','обеспечительный арест'), w('Mareva','Марева'),
        w('quia timet','quia timet'), w('defence','защита'), w('innocence','добросовестность'),
        w('fair use','добросовестное использование'), w('fair dealing','добросовестное использование'),
        w('exhaustion','исчерпание прав'), w('parallel imports','параллельный импорт'),
        w('cease and desist','прекрати и воздержись'), w('without prejudice','без ущерба для прав'),
      ],
    },
  ],
}

// ─── Module 9 – International Law (C1) ───────────────────────────────────────
const mod_international_law: MD = {
  title: 'International Law', section: 'C1', lessons: [
    {
      title: 'Treaties',
      words: [
        w('treaty','договор'), w('convention','конвенция'), w('agreement','соглашение'),
        w('protocol','протокол'), w('amendment','поправка'), w('signatory','подписант'),
        w('ratification','ратификация'), w('accession','присоединение'), w('reservation','оговорка'),
        w('derogation','отступление'), w('jus cogens','императивная норма'),
        w('pacta sunt servanda','договоры должны соблюдаться'),
        w('Vienna Convention','Венская конвенция'), w('bilateral treaty','двусторонний договор'),
        w('multilateral treaty','многосторонний договор'), w('human rights treaty','договор о правах человека'),
        w('trade treaty','торговый договор'), w('environmental treaty','экологический договор'),
        w('UNCLOS','ЮНКЛОС'), w('UN Charter','Устав ООН'),
        w('customary international law','обычное международное право'),
        w('opinio juris','правовое убеждение'), w('state practice','государственная практика'),
        w('erga omnes','в отношении всех'), w('entry into force','вступление в силу'),
      ],
    },
    {
      title: 'Arbitration',
      words: [
        w('international arbitration','международный арбитраж'), w('ICC','МТП'), w('LCIA','LCIA'),
        w('ICSID','МЦУРИС'), w('UNCITRAL','ЮНСИТРАЛ'), w('seat of arbitration','место арбитража'),
        w('governing law','применимое право'), w('arbitral tribunal','арбитражный трибунал'),
        w('arbitrator','арбитр'), w('claimant','заявитель'), w('respondent','ответчик'),
        w('statement of claim','заявление о требовании'),
        w('statement of defence','заявление о защите'), w('hearing','слушание'),
        w('award','решение'), w('final award','окончательное решение'),
        w('partial award','частичное решение'), w('enforcement','исполнение'),
        w('New York Convention','Нью-Йоркская конвенция'), w('recognition','признание'),
        w('set aside','отменить'), w('annulment','аннулирование'),
        w('investor-state dispute','инвестиционный спор'), w('BIT','ДИТ'),
        w('bilateral investment treaty','двусторонний инвестиционный договор'),
      ],
    },
    {
      title: 'WTO',
      words: [
        w('WTO','ВТО'), w('World Trade Organization','Всемирная торговая организация'),
        w('GATT','ГАТТ'), w('GATS','ГАТС'), w('TRIPS','ТРИПС'), w('DSB','ОРС'),
        w('dispute settlement','урегулирование споров'), w('panel','панель'),
        w('Appellate Body','Апелляционный орган'), w('retaliation','ответные меры'),
        w('most-favoured-nation','режим наибольшего благоприятствования'),
        w('national treatment','национальный режим'), w('tariff','тариф'),
        w('non-tariff barrier','нетарифный барьер'), w('safeguard','защитная мера'),
        w('anti-dumping','антидемпинг'), w('countervailing duty','компенсационная пошлина'),
        w('subsidy','субсидия'), w('trade facilitation','содействие торговле'),
        w('TBT','ТБТ'), w('SPS','СФС'), w('trade in services','торговля услугами'),
        w('intellectual property','интеллектуальная собственность'),
        w('developing country','развивающаяся страна'), w('dispute panel','панель по спорам'),
      ],
    },
    {
      title: 'Sanctions',
      words: [
        w('sanctions','санкции'), w('economic sanctions','экономические санкции'),
        w('arms embargo','эмбарго на поставку оружия'), w('travel ban','запрет на въезд'),
        w('asset freeze','заморозка активов'), w('financial sanction','финансовая санкция'),
        w('OFAC','OFAC'), w('EU sanctions','санкции ЕС'), w('UN sanctions','санкции ООН'),
        w('designation','включение в список'), w('listed person','лицо в санкционном списке'),
        w('listed entity','организация в санкционном списке'), w('SDN list','список SDN'),
        w('consolidated list','сводный список'), w('licence','лицензия'), w('derogation','отступление'),
        w('humanitarian exception','гуманитарное исключение'),
        w('sectoral sanction','секторальная санкция'), w('export control','экспортный контроль'),
        w('dual-use goods','товары двойного назначения'), w('end-user certificate','сертификат конечного пользователя'),
        w('re-export','реэкспорт'), w('supply chain','цепочка поставок'),
        w('compliance','соответствие'), w('due diligence','должная осмотрительность'),
      ],
    },
    {
      title: 'Human Rights',
      words: [
        w('human rights','права человека'), w('ECHR','ЕКПЧ'),
        w('European Court of Human Rights','Европейский суд по правам человека'),
        w('Universal Declaration','Всеобщая декларация'), w('ICCPR','МПГПП'), w('ICESCR','МПЭСКП'),
        w('right to life','право на жизнь'), w('prohibition of torture','запрет пыток'),
        w('right to liberty','право на свободу'), w('fair trial','справедливое судебное разбирательство'),
        w('privacy','конфиденциальность'), w('expression','выражение мнения'),
        w('assembly','собрание'), w('association','объединение'),
        w('non-discrimination','недискриминация'), w('margin of appreciation','пределы усмотрения'),
        w('proportionality','соразмерность'), w('positive obligation','позитивное обязательство'),
        w('negative obligation','негативное обязательство'), w('derogation','отступление'),
        w('limitation','ограничение'), w('protocol','протокол'), w('ratification','ратификация'),
        w('enforcement','принудительное применение'), w('remedy','средство защиты'),
      ],
    },
    {
      title: 'Diplomatic Law',
      words: [
        w('diplomatic law','дипломатическое право'),
        w('Vienna Convention on Diplomatic Relations','Венская конвенция о дипломатических сношениях'),
        w('diplomat','дипломат'), w('ambassador','посол'), w('embassy','посольство'),
        w('consulate','консульство'), w('diplomatic immunity','дипломатический иммунитет'),
        w('persona non grata','персона нон грата'), w('diplomatic bag','дипломатическая почта'),
        w('inviolability','неприкосновенность'), w('premises','помещение'),
        w('accreditation','аккредитация'), w('credentials','верительные грамоты'),
        w('host state','государство пребывания'), w('sending state','государство отправления'),
        w('consular officer','консульский сотрудник'), w('consular immunity','консульский иммунитет'),
        w('diplomatic protection','дипломатическая защита'), w('note verbale','вербальная нота'),
        w('aide-mémoire','аид-мемуар'), w('diplomatic cable','дипломатическая телеграмма'),
        w('protocol','протокол'), w('foreign ministry','министерство иностранных дел'),
        w('MFA','МИД'), w('bilateral relation','двусторонние отношения'),
      ],
    },
  ],
}

// ─── Module 10 – Litigation & Dispute (C1) ───────────────────────────────────
const mod_litigation: MD = {
  title: 'Litigation & Dispute', section: 'C1', lessons: [
    {
      title: 'Civil Procedure',
      words: [
        w('civil procedure','гражданский процесс'), w('CPR','ГПК'), w('Civil Procedure Rules','Гражданские процессуальные правила'),
        w('claim form','исковое заявление'), w('particulars of claim','основание иска'),
        w('defence','защита'), w('reply','ответ'), w('counterclaim','встречный иск'),
        w('allocation','распределение'), w('multi-track','многодорожечный'),
        w('fast track','ускоренный'), w('small claims','мелкие иски'),
        w('case management conference','конференция по управлению делом'), w('CMC','КУД'),
        w('disclosure','раскрытие'), w('inspection','ознакомление'),
        w('witness statements','показания свидетелей'), w('expert evidence','экспертное заключение'),
        w('trial','судебное разбирательство'), w('judgment','решение суда'),
        w('enforcement','исполнение'), w('costs','судебные издержки'),
        w('overriding objective','главная цель'), w('proportionality','соразмерность'),
        w('active case management','активное управление делом'),
      ],
    },
    {
      title: 'Mediation',
      words: [
        w('mediation','медиация'), w('mediator','медиатор'), w('BATNA','BATNA'), w('WATNA','WATNA'),
        w('without prejudice','без ущерба для прав'), w('open session','открытая сессия'),
        w('private session','приватная сессия'), w('caucus','отдельная встреча'),
        w('joint session','совместная сессия'), w('opening statement','вступительное заявление'),
        w('facilitative mediation','содействующая медиация'),
        w('evaluative mediation','оценочная медиация'),
        w('transformative mediation','трансформирующая медиация'),
        w('binding agreement','обязывающее соглашение'), w('settlement','урегулирование'),
        w('mediation agreement','медиационное соглашение'),
        w('confidentiality','конфиденциальность'), w('voluntary','добровольный'),
        w('neutral','нейтральный'), w('impartial','беспристрастный'),
        w('ADR','АРС'), w('alternative dispute resolution','альтернативное разрешение споров'),
        w('CEDR','CEDR'), w('ACAS','ACAS'), w('early neutral evaluation','ранняя нейтральная оценка'),
      ],
    },
    {
      title: 'Arbitration',
      words: [
        w('arbitration','арбитраж'), w('arbitral tribunal','арбитражный трибунал'),
        w('arbitrator','арбитр'), w('claimant','заявитель'), w('respondent','ответчик'),
        w('seat','место'), w('governing law','применимое право'), w('procedural rules','процессуальные правила'),
        w('award','решение'), w('interim award','промежуточное решение'),
        w('final award','окончательное решение'), w('enforcement','исполнение'),
        w('New York Convention','Нью-Йоркская конвенция'), w('Commercial Court','Коммерческий суд'),
        w('section 69 appeal','апелляция по разделу 69'),
        w('serious irregularity','серьёзная нарушения'), w('bias','предвзятость'),
        w('impartiality','беспристрастность'), w('appointment','назначение'),
        w('challenge','отвод'), w('removal','отстранение'),
        w('expedited procedure','ускоренная процедура'),
        w('emergency arbitrator','арбитр по чрезвычайным мерам'),
        w('institutional arbitration','институциональный арбитраж'),
        w('ad hoc arbitration','арбитраж ad hoc'),
      ],
    },
    {
      title: 'Discovery',
      words: [
        w('disclosure','раскрытие'), w('standard disclosure','стандартное раскрытие'),
        w('specific disclosure','конкретное раскрытие'), w('train of inquiry','цепочка запросов'),
        w('privilege','привилегия'), w('legal professional privilege','адвокатская тайна'),
        w('advice privilege','привилегия совета'), w('litigation privilege','привилегия судебного разбирательства'),
        w('without prejudice privilege','привилегия без ущерба для прав'), w('waiver','отказ от права'),
        w('inspection','ознакомление'), w('redaction','редактирование'),
        w('collateral use undertaking','обязательство о параллельном использовании'),
        w('electronic disclosure','электронное раскрытие'), w('e-disclosure','е-раскрытие'),
        w('document management','управление документами'), w('keyword search','поиск по ключевым словам'),
        w('review','проверка'), w('production','производство'),
        w('non-party disclosure','раскрытие третьей стороны'),
        w('Norwich Pharmacal order','ордер Норвич Фармасал'),
        w('Bankers Trust order','ордер Банкерс Траст'), w('data room','комната данных'),
        w('litigation hold','запрет на уничтожение документов'), w('custodian','хранитель'),
      ],
    },
    {
      title: 'Injunctions',
      words: [
        w('injunction','судебный запрет'), w('interim injunction','промежуточный запрет'),
        w('final injunction','окончательный запрет'), w('prohibitory injunction','запретительный запрет'),
        w('mandatory injunction','обязательный запрет'), w('freezing order','обеспечительный арест'),
        w('search order','ордер обыска'), w('anti-suit injunction','запрет судебного преследования'),
        w('Norwich Pharmacal order','ордер Норвич Фармасал'),
        w('worldwide freezing order','мировой обеспечительный арест'), w('WFO','ВОА'),
        w('asset disclosure','раскрытие активов'), w('penal notice','уведомление о санкциях'),
        w('contempt of court','неуважение к суду'), w('without notice','без уведомления'),
        w('on notice','с уведомлением'), w('balance of convenience','баланс удобства'),
        w('serious issue','серьёзный вопрос'), w('undertaking in damages','обязательство возместить убытки'),
        w('fortification','усиление'), w('discharge','освобождение'), w('variation','изменение'),
        w('springboard','трамплин'), w('quia timet','quia timet'), w('Bankers Trust order','ордер Банкерс Траст'),
      ],
    },
    {
      title: 'Enforcement',
      words: [
        w('enforcement','исполнение'), w('judgment','решение суда'), w('decree','постановление'),
        w('execution','исполнение'), w('writ of control','предписание об исполнении'),
        w('third-party debt order','ордер о долге третьей стороны'),
        w('charging order','ордер об обременении'), w('attachment of earnings','арест заработка'),
        w('receivership','конкурсное управление'), w('insolvency proceedings','процедура банкротства'),
        w('cross-border enforcement','трансграничное исполнение'),
        w('Hague Convention','Гаагская конвенция'),
        w('recognition of foreign judgment','признание иностранного решения'),
        w('service out of jurisdiction','вручение за пределами юрисдикции'),
        w('letter of request','судебное поручение'),
        w('Hague Evidence Convention','Гаагская конвенция о доказательствах'),
        w('contempt of court','неуважение к суду'), w('committal','заключение под стражу'),
        w('civil contempt','гражданское неуважение'), w('fine','штраф'),
        w('sequestration','секвестр'), w('compliance','исполнение'), w('discharge','освобождение'),
        w('EU Regulation','Регламент ЕС'), w('Lugano Convention','Луганская конвенция'),
        w('enforcement officer','судебный исполнитель'),
      ],
    },
  ],
}

// ─── Module 11 – Regulatory & Compliance (C1) ────────────────────────────────
const mod_regulatory: MD = {
  title: 'Regulatory & Compliance', section: 'C1', lessons: [
    {
      title: 'AML',
      words: [
        w('AML','ПОД'), w('anti-money laundering','противодействие отмыванию денег'),
        w('MLRO','ответственный по ПОД'), w('suspicious activity report','отчёт о подозрительной деятельности'),
        w('SAR','SAR'), w('NCA','NCA'), w('Proceeds of Crime Act','Закон о доходах от преступной деятельности'),
        w('POCA','POCA'), w('Terrorism Act','Закон о терроризме'), w('risk-based approach','риск-ориентированный подход'),
        w('CDD','CDD'), w('customer due diligence','должная осмотрительность в отношении клиента'),
        w('EDD','EDD'), w('enhanced due diligence','усиленная должная осмотрительность'),
        w('PEP','ПЭЛ'), w('sanctions screening','санкционный скрининг'),
        w('transaction monitoring','мониторинг транзакций'), w('consent','согласие'),
        w('tipping off','предупреждение'), w('prejudicing investigation','ущерб расследованию'),
        w('confiscation','конфискация'), w('civil recovery','гражданское взыскание'),
        w('unexplained wealth order','ордер о необъяснённом богатстве'), w('UWO','UWO'),
        w('nominated officer','назначенный офицер'),
      ],
    },
    {
      title: 'GDPR',
      words: [
        w('GDPR','ГДПР'), w('data protection','защита данных'), w('personal data','персональные данные'),
        w('special category data','данные особой категории'), w('data subject','субъект данных'),
        w('data controller','контролёр данных'), w('data processor','обработчик данных'),
        w('lawful basis','законное основание'), w('consent','согласие'),
        w('legitimate interests','законные интересы'), w('contract','договор'),
        w('legal obligation','юридическое обязательство'), w('vital interests','жизненно важные интересы'),
        w('public task','общественная задача'), w('data subject rights','права субъекта данных'),
        w('right of access','право доступа'), w('erasure','стирание'), w('restriction','ограничение'),
        w('portability','переносимость'), w('objection','возражение'),
        w('automated decision','автоматизированное решение'), w('DPA','DPA'), w('ICO','ICO'),
        w('data breach notification','уведомление о нарушении данных'),
        w('privacy impact assessment','оценка воздействия на конфиденциальность'),
      ],
    },
    {
      title: 'Financial Regulation',
      words: [
        w('financial regulation','финансовое регулирование'), w('FCA','FCA'), w('PRA','PRA'),
        w('regulated activity','регулируемая деятельность'), w('authorisation','авторизация'),
        w('permission','разрешение'), w('principle','принцип'), w('conduct of business','ведение бизнеса'),
        w('client money','деньги клиента'), w('client assets','активы клиента'), w('CASS','CASS'),
        w('market abuse','злоупотребление рынком'), w('MAR','MAR'),
        w('insider trading','инсайдерская торговля'), w('market manipulation','манипулирование рынком'),
        w('financial promotion','финансовое продвижение'),
        w('senior manager','старший менеджер'), w('SMCR','SMCR'),
        w('accountability','ответственность'), w('enforcement','принудительное применение'),
        w('fine','штраф'), w('ban','запрет'), w('public censure','публичный выговор'),
        w('consumer duty','потребительская обязанность'),
        w('treating customers fairly','справедливое обращение с клиентами'),
      ],
    },
    {
      title: 'Competition Law',
      words: [
        w('competition law','антимонопольное право'), w('antitrust','антимонопольный'),
        w('cartel','картель'), w('price fixing','фиксация цен'), w('market sharing','раздел рынка'),
        w('bid rigging','фиксация торгов'), w('vertical agreement','вертикальное соглашение'),
        w('horizontal agreement','горизонтальное соглашение'),
        w('abuse of dominance','злоупотребление доминирующим положением'),
        w('dominant position','доминирующее положение'), w('market definition','определение рынка'),
        w('merger control','контроль слияний'), w('CMA','CMA'),
        w('European Commission','Европейская комиссия'), w('DG COMP','DG COMP'),
        w('Article 101','Статья 101'), w('Article 102','Статья 102'),
        w('block exemption','блочное освобождение'), w('individual exemption','индивидуальное освобождение'),
        w('dawn raid','внезапная проверка'), w('leniency','снисхождение'),
        w('whistleblower','разоблачитель'), w('settlement','урегулирование'),
        w('commitment','обязательство'), w('behavioural remedy','поведенческое средство защиты'),
      ],
    },
    {
      title: 'Environmental Law',
      words: [
        w('environmental law','экологическое право'), w('Climate Change Act','Закон об изменении климата'),
        w('net zero','нулевые выбросы'), w('carbon emissions','выбросы углерода'),
        w('ETS','СТВ'), w('emission trading scheme','схема торговли выбросами'),
        w('environmental impact assessment','оценка воздействия на окружающую среду'), w('EIA','ОВОС'),
        w('planning permission','разрешение на строительство'), w('contaminated land','загрязнённая земля'),
        w('remediation','рекультивация'), w('statutory nuisance','законодательное неудобство'),
        w('Environment Agency','Агентство по окружающей среде'), w('EA','EA'),
        w('waste regulation','регулирование отходов'), w('producer responsibility','ответственность производителя'),
        w('EPR','РОП'), w('biodiversity net gain','чистый прирост биоразнообразия'),
        w('water framework directive','рамочная директива о воде'),
        w('abstraction licence','лицензия на водозабор'), w('environmental permit','экологическое разрешение'),
        w('pollution','загрязнение'), w('enforcement notice','предписание об устранении'),
        w('civil sanction','гражданская санкция'), w('criminal prosecution','уголовное преследование'),
      ],
    },
    {
      title: 'Corporate Governance',
      words: [
        w('corporate governance','корпоративное управление'), w('board','совет директоров'),
        w('chairman','председатель'), w('CEO','генеральный директор'),
        w('NEDs','независимые директора'), w('audit committee','комитет по аудиту'),
        w('remuneration committee','комитет по вознаграждению'),
        w('nomination committee','комитет по назначениям'),
        w('UK Corporate Governance Code','Кодекс корпоративного управления Великобритании'),
        w('comply or explain','соблюдай или объясняй'),
        w('stewardship code','Кодекс управления'),
        w('shareholder engagement','взаимодействие с акционерами'),
        w('proxy voting','голосование по доверенности'), w('say on pay','голосование по вознаграждению'),
        w('director remuneration','вознаграждение директора'), w('executive pay','оплата руководства'),
        w('ESG','ESG'), w('sustainability reporting','отчётность по устойчивому развитию'),
        w('TCFD','TCFD'), w('whistleblowing','разоблачение нарушений'),
        w('speak up','говорить вслух'), w('culture','культура'), w('purpose','цель'),
        w('stakeholder','заинтересованная сторона'), w('transparency','прозрачность'),
      ],
    },
  ],
}

// ─── Module 12 – Legal Writing (C1) ──────────────────────────────────────────
const mod_legal_writing: MD = {
  title: 'Legal Writing', section: 'C1', lessons: [
    {
      title: 'Case Briefs',
      words: [
        w('case brief','резюме дела'), w('citation','цитирование'), w('parties','стороны'),
        w('facts','факты'), w('procedural history','процессуальная история'), w('issue','вопрос'),
        w('holding','решение суда'), w('rule','правовая норма'), w('reasoning','обоснование'),
        w('analysis','анализ'), w('dicta','дополнительные высказывания'), w('significance','значение'),
        w('headnote','шапка'), w('judgment summary','краткое изложение решения'),
        w('precedent value','прецедентная ценность'), w('ratio','правовая позиция'),
        w('per curiam','от имени суда'), w('dissent','особое мнение'),
        w('concurrence','совпадающее мнение'), w('distinguishing','разграничение'),
        w('following','следование'), w('overruling','отмена прецедента'), w('applying','применение'),
        w('neutral citation','нейтральное цитирование'), w('law report','судебный отчёт'),
      ],
    },
    {
      title: 'Legal Memos',
      words: [
        w('legal memorandum','юридический меморандум'), w('memo','меморандум'), w('to','кому'),
        w('from','от'), w('date','дата'), w('re','касательно'), w('issue','вопрос'),
        w('brief answer','краткий ответ'), w('facts','факты'), w('discussion','обсуждение'),
        w('analysis','анализ'), w('conclusion','заключение'), w('IRAC','IRAC'),
        w('issue rule analysis conclusion','вопрос-норма-анализ-заключение'),
        w('objective tone','объективный тон'), w('avoid advocacy','избегать защиты'),
        w('plain English','простой английский'), w('headings','заголовки'), w('footnotes','сноски'),
        w('authority','авторитетный источник'), w('primary','первичный'), w('secondary','вторичный'),
        w('Bluebook','Голубая книга'), w('OSCOLA','OSCOLA'), w('peer review','рецензирование'),
      ],
    },
    {
      title: 'Opinion Letters',
      words: [
        w('opinion letter','письмо-заключение'), w('client advice','совет клиенту'),
        w('counsel\'s opinion','заключение адвоката'), w('QC','QC'), w('KC','KC'),
        w('barrister','барристер'), w('instruct','проинструктировать'), w('brief','бриф'),
        w('advice on merits','совет по существу'), w('prospects','перспективы'),
        w('liability','ответственность'), w('quantum','размер ущерба'), w('strategy','стратегия'),
        w('recommendation','рекомендация'), w('caveats','оговорки'), w('assumptions','допущения'),
        w('limitations','ограничения'), w('reliance','доверие'), w('addressee','адресат'),
        w('date','дата'), w('signature','подпись'), w('professional indemnity','профессиональное страхование'),
        w('legal professional privilege','адвокатская тайна'), w('duty of care','обязанность заботы'),
        w('fee','гонорар'),
      ],
    },
    {
      title: 'Court Submissions',
      words: [
        w('skeleton argument','скелетный аргумент'), w('grounds of appeal','основания апелляции'),
        w('position statement','заявление о позиции'), w('written submissions','письменные аргументы'),
        w('CPR','ГПК'), w('numbered paragraphs','пронумерованные абзацы'), w('headings','заголовки'),
        w('citations','цитирование'), w('case law','прецедентное право'),
        w('statutory authority','законодательный орган'), w('tab','вкладка'), w('bundle','пакет'),
        w('paginated','пронумерованный'), w('cross-reference','перекрёстная ссылка'),
        w('concise','краткий'), w('without argument','без аргументации'),
        w('chronology','хронология'), w('cast list','список действующих лиц'),
        w('glossary','глоссарий'), w('authorities','источники'), w('schedule','приложение'),
        w('claimant','заявитель'), w('defendant','ответчик'), w('court etiquette','судебный этикет'),
        w('respectfully submitted','с уважением представлено'),
      ],
    },
    {
      title: 'Research Papers',
      words: [
        w('legal research','юридическое исследование'), w('primary source','первичный источник'),
        w('secondary source','вторичный источник'), w('legislation','законодательство'),
        w('case law','прецедентное право'), w('journal article','статья в журнале'),
        w('textbook','учебник'), w('commentary','комментарий'), w('annotated','аннотированный'),
        w('LEXIS','LEXIS'), w('Westlaw','Westlaw'), w('BAILII','BAILII'),
        w('citation','цитирование'), w('footnote','сноска'), w('OSCOLA','OSCOLA'),
        w('bibliography','библиография'), w('research question','исследовательский вопрос'),
        w('hypothesis','гипотеза'), w('methodology','методология'),
        w('literature review','обзор литературы'), w('argument','аргумент'),
        w('counter-argument','контраргумент'), w('conclusion','заключение'),
        w('original research','оригинальное исследование'), w('peer review','рецензирование'),
      ],
    },
    {
      title: 'Ethics',
      words: [
        w('legal ethics','юридическая этика'),
        w('Solicitors Regulation Authority','Орган регулирования солиситоров'), w('SRA','SRA'),
        w('Bar Standards Board','Комитет по стандартам адвокатуры'), w('BSB','BSB'),
        w('professional conduct','профессиональное поведение'), w('duty to court','обязанность перед судом'),
        w('duty to client','обязанность перед клиентом'),
        w('confidentiality','конфиденциальность'), w('legal professional privilege','адвокатская тайна'),
        w('conflict of interest','конфликт интересов'), w('undertaking','обязательство'),
        w('money laundering','отмывание денег'), w('anti-bribery','противодействие взяточничеству'),
        w('client care','забота о клиенте'), w('complaints','жалобы'), w('oversight','надзор'),
        w('sanctions','санкции'), w('strike off','исключение из реестра'),
        w('suspension','приостановление'), w('wasted costs','напрасно потраченные издержки'),
        w('improper conduct','ненадлежащее поведение'), w('integrity','честность'),
        w('independence','независимость'), w('access to justice','доступ к правосудию'),
      ],
    },
  ],
}

// ─── assembled module lists ────────────────────────────────────────────────────

const LAW_B1_MODULES: MD[] = [
  mod_legal_system,
  mod_contract_law,
  mod_criminal_law,
  mod_legal_documents,
]

const LAW_B1C1_MODULES: MD[] = [
  mod_legal_system,
  mod_contract_law,
  mod_criminal_law,
  mod_legal_documents,
  mod_corporate_law,
  mod_property_law,
  mod_employment_law,
  mod_ip,
  mod_international_law,
  mod_litigation,
  mod_regulatory,
  mod_legal_writing,
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
  console.log('🚀 ESP Law seed script')
  console.log('   Supabase URL:', SUPABASE_URL)

  const ALL_IDS = [LAW_B1_ID, LAW_B1C1_ID]

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

  await seedCourse(LAW_B1_ID,   LAW_B1_MODULES,   'Law B1')
  await seedCourse(LAW_B1C1_ID, LAW_B1C1_MODULES, 'Law B1-C1')

  console.log('\n🎉 Done! Law seeded.')
  console.log(`   Law B1:    ${LAW_B1_MODULES.length} modules, ${LAW_B1_MODULES.length * 6} lessons`)
  console.log(`   Law B1-C1: ${LAW_B1C1_MODULES.length} modules, ${LAW_B1C1_MODULES.length * 6} lessons`)
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err)
  process.exit(1)
})
