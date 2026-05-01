/**
 * Seed: Accounting B1 + Accounting B1-C1
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/seed-esp-accounting.ts
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
const ACC_B1_ID   = 'c52350cf-0c6e-4e0d-83da-6e2668b2ba91'
const ACC_B1C1_ID = 'a1000000-0000-0000-0000-000000000006'

// ─── types ────────────────────────────────────────────────────────────────────
type W  = { en: string; ru: string }
type LD = { title: string; words: W[] }
type MD = { title: string; section: string; lessons: LD[] }

// ─── helpers ──────────────────────────────────────────────────────────────────
function w(en: string, ru: string): W { return { en, ru } }

// ─── Module 1 – Financial Fundamentals (B1) ───────────────────────────────────
const mod_financial_fundamentals: MD = {
  title: 'Financial Fundamentals', section: 'B1', lessons: [
    {
      title: 'Assets & Liabilities',
      words: [
        w('asset','актив'), w('liability','обязательство'), w('current asset','оборотный актив'),
        w('fixed asset','основное средство'), w('current liability','краткосрочное обязательство'),
        w('long-term liability','долгосрочное обязательство'), w('tangible','материальный'),
        w('intangible','нематериальный'), w('net assets','чистые активы'), w('liquid asset','ликвидный актив'),
        w('trade receivable','дебиторская задолженность'), w('trade payable','кредиторская задолженность'),
        w('depreciation','амортизация'), w('amortisation','амортизация нематериальных активов'),
        w('book value','балансовая стоимость'), w('fair value','справедливая стоимость'),
        w('balance','баланс'), w('creditor','кредитор'), w('debtor','дебитор'),
        w('inventory','товарно-материальные запасы'), w('prepayment','предоплата'),
        w('accrual','начисление'), w('capital','капитал'), w('property','имущество'),
        w('equipment','оборудование'),
      ],
    },
    {
      title: 'Revenue & Expenses',
      words: [
        w('revenue','выручка'), w('expense','расход'), w('income','доход'), w('cost','стоимость'),
        w('gross profit','валовая прибыль'), w('net profit','чистая прибыль'), w('turnover','оборот'),
        w('operating cost','операционные затраты'), w('overhead','накладные расходы'),
        w('direct cost','прямые затраты'), w('indirect cost','косвенные затраты'),
        w('fixed cost','постоянные затраты'), w('variable cost','переменные затраты'),
        w('sales revenue','выручка от продаж'), w('cost of goods sold','себестоимость продаж'),
        w('operating expense','операционные расходы'), w('administrative expense','административные расходы'),
        w('interest expense','расходы на проценты'), w('profit margin','маржа прибыли'),
        w('break-even','точка безубыточности'), w('loss','убыток'), w('expenditure','затраты'),
        w('budget','бюджет'), w('forecast','прогноз'), w('accrued expense','начисленный расход'),
      ],
    },
    {
      title: 'Equity',
      words: [
        w('equity','собственный капитал'), w('shareholder','акционер'), w('share capital','акционерный капитал'),
        w('retained earnings','нераспределённая прибыль'), w('dividend','дивиденд'),
        w('ownership','владение'), w('stake','доля'), w('common share','обыкновенная акция'),
        w('preferred share','привилегированная акция'), w('par value','номинальная стоимость'),
        w('share premium','эмиссионный доход'), w('buyback','выкуп акций'), w('dilution','разводнение'),
        w('net worth','чистая стоимость'), w('market capitalisation','рыночная капитализация'),
        w('return on equity','рентабельность собственного капитала'),
        w('equity financing','долевое финансирование'), w('venture capital','венчурный капитал'),
        w('private equity','частный акционерный капитал'), w('stock option','опцион на акции'),
        w('issue shares','выпускать акции'), w('allotment','распределение акций'),
        w('rights issue','выпуск прав'), w('bonus shares','бонусные акции'),
        w('book value per share','балансовая стоимость акции'),
      ],
    },
    {
      title: 'Double Entry',
      words: [
        w('double entry','двойная запись'), w('debit','дебет'), w('credit','кредит'),
        w('account','счёт'), w('journal entry','запись в журнале'), w('ledger','главная книга'),
        w('T-account','Т-счёт'), w('trial balance','пробный баланс'), w('bookkeeping','бухгалтерский учёт'),
        w('transaction','проводка'), w('posting','разноска'), w('balance','остаток'),
        w('contra account','контрарный счёт'), w('nominal account','номинальный счёт'),
        w('real account','реальный счёт'), w('personal account','личный счёт'),
        w('accounting equation','уравнение бухгалтерского учёта'), w('duality','двойственность'),
        w('matching principle','принцип соответствия'), w('accuracy','точность'),
        w('entry','запись'), w('record','записывать'), w('balance sheet equation','уравнение баланса'),
        w('assets equal liabilities plus equity','активы равны обязательствам плюс капитал'),
        w('arithmetic check','арифметическая проверка'),
      ],
    },
    {
      title: 'Chart of Accounts',
      words: [
        w('chart of accounts','план счетов'), w('account code','код счёта'), w('account number','номер счёта'),
        w('classification','классификация'), w('category','категория'), w('asset account','счёт активов'),
        w('liability account','счёт обязательств'), w('equity account','счёт капитала'),
        w('income account','счёт доходов'), w('expense account','счёт расходов'),
        w('sub-account','субсчёт'), w('parent account','родительский счёт'),
        w('numbering system','система нумерации'), w('nominal ledger','главная книга счетов'),
        w('general ledger','главная бухгалтерская книга'), w('structure','структура'),
        w('grouping','группировка'), w('mapping','сопоставление'), w('hierarchy','иерархия'),
        w('financial report','финансовый отчёт'),
        w('accounting software','бухгалтерское программное обеспечение'),
        w('account type','тип счёта'), w('balance sheet account','счёт баланса'),
        w('income statement account','счёт отчёта о прибылях'),
        w('control account','контрольный счёт'),
      ],
    },
    {
      title: 'Basic Transactions',
      words: [
        w('transaction','транзакция'), w('purchase','покупка'), w('sale','продажа'),
        w('payment','платёж'), w('receipt','квитанция'), w('invoice','счёт-фактура'),
        w('cash','наличные'), w('bank transfer','банковский перевод'), w('credit purchase','покупка в кредит'),
        w('cash purchase','покупка за наличные'), w('revenue transaction','выручка от операции'),
        w('expense transaction','расходная операция'), w('record','записывать'),
        w('document','документ'), w('source document','первичный документ'), w('voucher','ваучер'),
        w('authorisation','авторизация'), w('posting','разноска'), w('double entry','двойная запись'),
        w('bank reconciliation','банковская сверка'), w('petty cash','мелкая наличность'),
        w('reimbursement','возмещение'), w('advance','аванс'), w('settlement','расчёт'),
        w('clearance','погашение'),
      ],
    },
  ],
}

// ─── Module 2 – Bookkeeping Basics (B1) ──────────────────────────────────────
const mod_bookkeeping: MD = {
  title: 'Bookkeeping Basics', section: 'B1', lessons: [
    {
      title: 'Journals',
      words: [
        w('journal','журнал'), w('journal entry','запись в журнале'), w('general journal','общий журнал'),
        w('special journal','специальный журнал'), w('purchase journal','журнал покупок'),
        w('sales journal','журнал продаж'), w('cash receipts journal','журнал кассовых поступлений'),
        w('cash payments journal','журнал кассовых выплат'), w('date','дата'),
        w('description','описание'), w('debit','дебет'), w('credit','кредит'),
        w('reference','ссылка'), w('narration','пояснение'), w('source document','первичный документ'),
        w('posting reference','ссылка на разноску'), w('recurring entry','повторяющаяся запись'),
        w('adjusting entry','корректировочная запись'), w('correcting entry','исправительная запись'),
        w('compound entry','составная запись'), w('reversing entry','сторнировочная запись'),
        w('opening entry','вступительная запись'), w('closing entry','заключительная запись'),
        w('subsidiary journal','вспомогательный журнал'), w('page number','номер страницы'),
      ],
    },
    {
      title: 'Ledgers',
      words: [
        w('ledger','книга счетов'), w('general ledger','главная книга'),
        w('subsidiary ledger','вспомогательная книга'),
        w('accounts receivable ledger','книга дебиторской задолженности'),
        w('accounts payable ledger','книга кредиторской задолженности'),
        w('T-account','Т-счёт'), w('balance','остаток'), w('opening balance','начальный остаток'),
        w('closing balance','конечный остаток'), w('debit side','дебетовая сторона'),
        w('credit side','кредитовая сторона'), w('folio','фолио'), w('posting','разноска'),
        w('account number','номер счёта'), w('nominal ledger','номинальная книга'),
        w('real ledger','реальная книга'), w('personal ledger','личная книга'),
        w('carry forward','перенос на следующий период'),
        w('brought forward','перенесено с предыдущего периода'),
        w('balance off','закрыть счёт'), w('running balance','текущий остаток'),
        w('control account','контрольный счёт'), w('total','итог'), w('extract','выписка'),
        w('reconcile','сверять'),
      ],
    },
    {
      title: 'Trial Balance',
      words: [
        w('trial balance','пробный баланс'), w('debit total','итог по дебету'),
        w('credit total','итог по кредиту'), w('balance','баланс'), w('agree','совпадать'),
        w('discrepancy','расхождение'), w('error','ошибка'), w('omission','пропуск'),
        w('extraction error','ошибка извлечения'), w('transposition error','ошибка транспозиции'),
        w('compensating error','компенсирующая ошибка'), w('one-sided error','односторонняя ошибка'),
        w('adjusted trial balance','скорректированный пробный баланс'),
        w('post-closing trial balance','послезакрывочный пробный баланс'),
        w('suspense account','счёт невыясненных сумм'), w('errors of principle','ошибки принципа'),
        w('errors of commission','ошибки комиссии'), w('errors of omission','ошибки пропуска'),
        w('errors of original entry','ошибки первоначальной записи'),
        w('complete reversal of entries','полное сторнирование записей'),
        w('draft','черновик'), w('prepare','составлять'), w('list','перечень'),
        w('check','проверять'), w('column','столбец'),
      ],
    },
    {
      title: 'Reconciliation',
      words: [
        w('reconciliation','сверка'), w('bank reconciliation','банковская сверка'),
        w('statement','выписка'), w('bank statement','банковская выписка'), w('cash book','кассовая книга'),
        w('outstanding cheque','неоплаченный чек'), w('unpresented cheque','непредъявленный чек'),
        w('deposit in transit','транзитный депозит'), w('bank charges','банковские комиссии'),
        w('interest received','полученные проценты'), w('direct debit','прямое дебетование'),
        w('standing order','постоянное поручение'), w('timing difference','разница во времени'),
        w('balance','остаток'), w('adjust','корректировать'), w('error','ошибка'),
        w('omission','пропуск'), w('match','сопоставлять'), w('outstanding item','незакрытая статья'),
        w('cleared','проведённый'), w('uncleared','непроведённый'), w('overdraft','овердрафт'),
        w('credit balance','кредитовый остаток'), w('debit balance','дебетовый остаток'),
        w('agree','совпадать'),
      ],
    },
    {
      title: 'Petty Cash',
      words: [
        w('petty cash','мелкая наличность'), w('petty cash book','книга мелкой кассы'),
        w('imprest system','авансовая система'), w('float','остаток в кассе'),
        w('voucher','кассовый ордер'), w('receipt','квитанция'), w('reimbursement','возмещение'),
        w('top-up','пополнение'), w('cashier','кассир'), w('petty cash tin','кассовая коробка'),
        w('authorisation','авторизация'), w('limit','лимит'), w('small expense','мелкие расходы'),
        w('postage','почтовые расходы'), w('stationery','канцелярские товары'),
        w('travel','командировочные'), w('meal','питание'), w('sundry expense','прочие расходы'),
        w('record','записывать'), w('balance','остаток'), w('reconcile','сверять'),
        w('imprest amount','авансовая сумма'), w('petty cash fund','фонд мелкой кассы'),
        w('disbursement','выплата'), w('claim','требование'),
      ],
    },
    {
      title: 'Bank Statements',
      words: [
        w('bank statement','банковская выписка'), w('balance','остаток'),
        w('credit entry','кредитовая запись'), w('debit entry','дебетовая запись'),
        w('transaction date','дата операции'), w('description','описание'), w('reference','ссылка'),
        w('opening balance','начальный остаток'), w('closing balance','конечный остаток'),
        w('interest','проценты'), w('charges','комиссии'), w('direct debit','прямое дебетование'),
        w('standing order','постоянное поручение'), w('salary','заработная плата'),
        w('payment','платёж'), w('receipt','поступление'), w('overdraft','овердрафт'),
        w('available balance','доступный остаток'), w('statement period','период выписки'),
        w('sort code','сортировочный код'), w('account number','номер счёта'),
        w('bank charges','банковские комиссии'), w('interest earned','начисленные проценты'),
        w('electronic transfer','электронный перевод'), w('direct credit','прямой кредит'),
      ],
    },
  ],
}

// ─── Module 3 – Financial Statements (B1) ────────────────────────────────────
const mod_financial_statements: MD = {
  title: 'Financial Statements', section: 'B1', lessons: [
    {
      title: 'Balance Sheet',
      words: [
        w('balance sheet','бухгалтерский баланс'), w('asset','актив'), w('liability','обязательство'),
        w('equity','собственный капитал'), w('current asset','оборотный актив'),
        w('non-current asset','внеоборотный актив'), w('current liability','краткосрочное обязательство'),
        w('non-current liability','долгосрочное обязательство'), w('cash','денежные средства'),
        w('trade receivables','дебиторская задолженность'), w('inventory','запасы'),
        w('property','недвижимость'), w('plant','производственные мощности'), w('equipment','оборудование'),
        w('intangible asset','нематериальный актив'), w('goodwill','деловая репутация'),
        w('bank loan','банковский кредит'), w('trade payables','кредиторская задолженность'),
        w('share capital','акционерный капитал'), w('retained earnings','нераспределённая прибыль'),
        w('net assets','чистые активы'), w('total assets','итого активов'),
        w('total liabilities','итого обязательств'),
        w('shareholders equity','собственный капитал акционеров'), w('report date','дата отчёта'),
      ],
    },
    {
      title: 'Income Statement',
      words: [
        w('income statement','отчёт о прибылях и убытках'), w('revenue','выручка'),
        w('cost of goods sold','себестоимость продаж'), w('gross profit','валовая прибыль'),
        w('operating expense','операционные расходы'), w('operating profit','операционная прибыль'),
        w('finance cost','финансовые расходы'), w('profit before tax','прибыль до налогов'),
        w('income tax','налог на прибыль'), w('profit after tax','прибыль после налогов'),
        w('net profit','чистая прибыль'), w('earnings per share','прибыль на акцию'),
        w('dividend','дивиденд'), w('retained profit','нераспределённая прибыль'),
        w('turnover','оборот'), w('administrative expense','административные расходы'),
        w('distribution cost','расходы на сбыт'), w('other income','прочие доходы'),
        w('EBIT','EBIT'), w('EBITDA','EBITDA'), w('depreciation','амортизация'),
        w('amortisation','амортизация нематериальных активов'), w('exceptional item','исключительная статья'),
        w('discontinued operation','прекращённая деятельность'),
        w('comprehensive income','совокупный доход'),
      ],
    },
    {
      title: 'Cash Flow',
      words: [
        w('cash flow statement','отчёт о движении денежных средств'),
        w('operating activities','операционная деятельность'),
        w('investing activities','инвестиционная деятельность'),
        w('financing activities','финансовая деятельность'), w('net cash flow','чистый денежный поток'),
        w('opening cash balance','начальный остаток денежных средств'),
        w('closing cash balance','конечный остаток денежных средств'),
        w('cash inflow','приток денежных средств'), w('cash outflow','отток денежных средств'),
        w('receipts','поступления'), w('payments','выплаты'),
        w('depreciation adjustment','корректировка амортизации'),
        w('working capital change','изменение оборотного капитала'),
        w('capital expenditure','капитальные затраты'), w('proceeds from sale','выручка от продажи'),
        w('loan proceeds','поступления от кредита'), w('loan repayment','погашение кредита'),
        w('dividend paid','выплаченные дивиденды'), w('tax paid','уплаченный налог'),
        w('interest paid','уплаченные проценты'), w('free cash flow','свободный денежный поток'),
        w('indirect method','косвенный метод'), w('direct method','прямой метод'),
        w('cash equivalents','эквиваленты денежных средств'), w('net increase','чистый прирост'),
      ],
    },
    {
      title: 'Notes to Accounts',
      words: [
        w('notes to accounts','примечания к отчётности'), w('accounting policy','учётная политика'),
        w('disclosure','раскрытие информации'), w('contingent liability','условное обязательство'),
        w('post-balance sheet event','событие после даты баланса'), w('related party','связанная сторона'),
        w('segment information','информация по сегментам'), w('going concern','принцип непрерывности'),
        w('basis of preparation','основа подготовки'), w('measurement basis','основа оценки'),
        w('significant judgement','существенное суждение'),
        w('estimation uncertainty','неопределённость оценки'),
        w('prior year adjustment','корректировка предыдущего года'), w('restatement','пересмотр'),
        w('audit note','примечание аудитора'), w('tax note','налоговое примечание'),
        w('property note','примечание по имуществу'), w('financial instrument','финансовый инструмент'),
        w('fair value disclosure','раскрытие справедливой стоимости'),
        w('risk management','управление рисками'), w('capital commitment','капитальные обязательства'),
        w('lease','аренда'), w('dividend note','дивидендное примечание'),
        w('pension note','пенсионное примечание'), w('subsequent event','последующее событие'),
      ],
    },
    {
      title: 'Reading Reports',
      words: [
        w('annual report','годовой отчёт'), w('chairman statement','обращение председателя'),
        w('CEO review','обзор генерального директора'), w('strategic report','стратегический отчёт'),
        w('directors report','отчёт директоров'), w('auditors report','отчёт аудиторов'),
        w('financial highlights','финансовые показатели'), w('five-year summary','пятилетняя сводка'),
        w('key performance indicator','ключевой показатель эффективности'), w('ratio','коэффициент'),
        w('trend','тенденция'), w('segment','сегмент'), w('comparative figure','сравнительный показатель'),
        w('prior year','предыдущий год'), w('note reference','ссылка на примечание'),
        w('heading','заголовок'), w('total','итог'), w('subtotal','промежуточный итог'),
        w('rounding','округление'), w('currency','валюта'), w('unit','единица измерения'),
        w('footnote','сноска'), w('cross-reference','перекрёстная ссылка'),
        w('page number','номер страницы'), w('appendix','приложение'),
      ],
    },
    {
      title: 'Basic Analysis',
      words: [
        w('ratio analysis','анализ коэффициентов'), w('current ratio','коэффициент текущей ликвидности'),
        w('quick ratio','коэффициент быстрой ликвидности'), w('gross profit margin','маржа валовой прибыли'),
        w('net profit margin','маржа чистой прибыли'), w('return on assets','рентабельность активов'),
        w('return on equity','рентабельность собственного капитала'),
        w('asset turnover','оборачиваемость активов'), w('inventory days','дни запасов'),
        w('receivables days','дни дебиторской задолженности'),
        w('payables days','дни кредиторской задолженности'), w('debt-to-equity','долг к капиталу'),
        w('interest cover','покрытие процентов'), w('earnings per share','прибыль на акцию'),
        w('dividend yield','дивидендная доходность'), w('price-earnings ratio','коэффициент цена/прибыль'),
        w('working capital','оборотный капитал'), w('liquidity','ликвидность'),
        w('profitability','рентабельность'), w('efficiency','эффективность'),
        w('solvency','платёжеспособность'), w('leverage','финансовый рычаг'),
        w('benchmark','эталон'), w('industry average','среднеотраслевой показатель'), w('trend','тенденция'),
      ],
    },
  ],
}

// ─── Module 4 – Business Documents (B1) ──────────────────────────────────────
const mod_business_documents: MD = {
  title: 'Business Documents', section: 'B1', lessons: [
    {
      title: 'Invoices',
      words: [
        w('invoice','счёт-фактура'), w('invoice number','номер счёта-фактуры'),
        w('invoice date','дата выставления'), w('due date','срок оплаты'), w('seller','продавец'),
        w('buyer','покупатель'), w('description','описание'), w('quantity','количество'),
        w('unit price','цена за единицу'), w('subtotal','сумма без налога'), w('VAT','НДС'),
        w('total amount','итоговая сумма'), w('payment terms','условия оплаты'),
        w('bank details','банковские реквизиты'), w('reference number','справочный номер'),
        w('delivery address','адрес доставки'), w('billing address','платёжный адрес'),
        w('purchase order number','номер заказа на покупку'), w('discount','скидка'),
        w('net amount','сумма без НДС'), w('tax invoice','налоговый счёт-фактура'),
        w('pro forma invoice','проформа-инвойс'), w('credit note','кредит-нота'),
        w('debit note','дебет-нота'), w('remittance advice','уведомление о переводе'),
      ],
    },
    {
      title: 'Receipts',
      words: [
        w('receipt','квитанция'), w('payment receipt','квитанция об оплате'),
        w('official receipt','официальная квитанция'), w('date','дата'), w('amount','сумма'),
        w('payer','плательщик'), w('payee','получатель'), w('description','описание'),
        w('cash receipt','кассовый чек'), w('electronic receipt','электронная квитанция'),
        w('acknowledgement','подтверждение'), w('stamp','печать'), w('signature','подпись'),
        w('receipt number','номер квитанции'), w('total paid','итого уплачено'),
        w('VAT included','НДС включён'), w('transaction reference','справочный номер транзакции'),
        w('bank receipt','банковская квитанция'), w('point of sale','точка продаж'),
        w('till receipt','чек кассового аппарата'), w('itemised receipt','детализированная квитанция'),
        w('digital receipt','цифровая квитанция'), w('proof of payment','подтверждение оплаты'),
        w('serial number','серийный номер'), w('tax receipt','налоговая квитанция'),
      ],
    },
    {
      title: 'Purchase Orders',
      words: [
        w('purchase order','заказ на покупку'), w('PO number','номер заказа'),
        w('supplier','поставщик'), w('buyer','покупатель'), w('item','позиция'),
        w('description','описание'), w('quantity','количество'), w('unit price','цена за единицу'),
        w('total','итог'), w('delivery date','дата доставки'), w('delivery address','адрес доставки'),
        w('payment terms','условия оплаты'), w('authorisation','авторизация'), w('approval','одобрение'),
        w('reference','ссылка'), w('terms and conditions','условия и положения'),
        w('order confirmation','подтверждение заказа'), w('goods received note','накладная на получение'),
        w('matching','сопоставление'), w('three-way match','трёхстороннее сопоставление'),
        w('backorder','отложенный заказ'), w('partial delivery','частичная поставка'),
        w('cancellation','отмена'), w('amendment','изменение'), w('open order','открытый заказ'),
      ],
    },
    {
      title: 'Contracts',
      words: [
        w('contract','договор'), w('agreement','соглашение'), w('parties','стороны'),
        w('terms','условия'), w('conditions','положения'), w('obligations','обязательства'),
        w('rights','права'), w('duration','срок действия'), w('termination','расторжение'),
        w('breach','нарушение'), w('penalty','штраф'), w('dispute resolution','разрешение споров'),
        w('signature','подпись'), w('witness','свидетель'), w('date','дата'),
        w('schedule','приложение'), w('appendix','приложение'), w('warranty','гарантия'),
        w('indemnity','возмещение ущерба'), w('liability','ответственность'),
        w('confidentiality','конфиденциальность'),
        w('intellectual property','интеллектуальная собственность'),
        w('governing law','применимое право'), w('amendment','изменение'), w('renewal','продление'),
      ],
    },
    {
      title: 'Payslips',
      words: [
        w('payslip','расчётный лист'), w('employee','сотрудник'), w('employer','работодатель'),
        w('pay period','расчётный период'), w('gross pay','валовая заработная плата'),
        w('net pay','чистая заработная плата'), w('deduction','удержание'),
        w('income tax','подоходный налог'), w('national insurance','национальное страхование'),
        w('pension contribution','взнос в пенсионный фонд'), w('basic salary','базовый оклад'),
        w('overtime','сверхурочные'), w('bonus','премия'), w('commission','комиссия'),
        w('sick pay','пособие по болезни'), w('holiday pay','отпускные'),
        w('allowance','надбавка'), w('tax code','налоговый код'), w('NI number','номер НС'),
        w('payroll number','табельный номер'), w('cumulative earnings','накопленный заработок'),
        w('year to date','с начала года'), w('payroll date','дата начисления'),
        w('take-home pay','сумма на руки'), w('bank transfer','банковский перевод'),
      ],
    },
    {
      title: 'Business Correspondence',
      words: [
        w('business letter','деловое письмо'), w('email','электронное письмо'),
        w('subject line','тема письма'), w('salutation','приветствие'),
        w('Dear Sir/Madam','Уважаемый/ая'), w('body','основная часть'), w('closing','завершение'),
        w('yours faithfully','с уважением (незнакомый)'), w('yours sincerely','с уважением (знакомый)'),
        w('attachment','вложение'), w('enclosure','приложение'), w('cc','копия'), w('bcc','скрытая копия'),
        w('formal tone','официальный тон'), w('professional language','деловой язык'),
        w('reference','ссылка'), w('follow-up','контрольное письмо'), w('acknowledgement','подтверждение'),
        w('reply','ответ'), w('response','отклик'), w('memorandum','служебная записка'),
        w('minutes','протокол'), w('agenda','повестка дня'), w('report','отчёт'),
        w('circular','циркуляр'),
      ],
    },
  ],
}

// ─── Module 5 – Management Accounting (B2) ───────────────────────────────────
const mod_management_accounting: MD = {
  title: 'Management Accounting', section: 'B2', lessons: [
    {
      title: 'Budgeting',
      words: [
        w('budget','бюджет'), w('master budget','сводный бюджет'), w('operating budget','операционный бюджет'),
        w('capital budget','капитальный бюджет'), w('cash budget','кассовый бюджет'),
        w('budget variance','бюджетное отклонение'), w('favourable variance','благоприятное отклонение'),
        w('adverse variance','неблагоприятное отклонение'), w('budgetary control','бюджетный контроль'),
        w('zero-based budgeting','бюджетирование с нуля'), w('incremental budgeting','приростное бюджетирование'),
        w('rolling budget','скользящий бюджет'), w('budget holder','распорядитель бюджета'),
        w('budget setting','установление бюджета'), w('forecast','прогноз'),
        w('actual vs budget','факт против бюджета'), w('budget period','бюджетный период'),
        w('performance review','анализ результатов'), w('budget approval','утверждение бюджета'),
        w('departmental budget','бюджет подразделения'), w('sales budget','бюджет продаж'),
        w('production budget','производственный бюджет'),
        w('administration budget','административный бюджет'),
        w('budget revision','корректировка бюджета'), w('flexed budget','гибкий бюджет'),
      ],
    },
    {
      title: 'Cost Types',
      words: [
        w('direct cost','прямые затраты'), w('indirect cost','косвенные затраты'),
        w('fixed cost','постоянные затраты'), w('variable cost','переменные затраты'),
        w('semi-variable cost','полупеременные затраты'), w('product cost','производственная себестоимость'),
        w('period cost','затраты периода'), w('sunk cost','невозвратные затраты'),
        w('opportunity cost','альтернативные издержки'), w('marginal cost','предельные издержки'),
        w('average cost','средние затраты'), w('standard cost','нормативные затраты'),
        w('actual cost','фактические затраты'), w('budgeted cost','бюджетные затраты'),
        w('overhead','накладные расходы'), w('absorption','поглощение накладных расходов'),
        w('cost centre','центр затрат'), w('cost unit','единица затрат'),
        w('cost driver','носитель затрат'), w('cost pool','пул затрат'),
        w('stepped cost','ступенчатые затраты'), w('relevant cost','релевантные затраты'),
        w('incremental cost','приростные затраты'), w('avoidable cost','избегаемые затраты'),
        w('unavoidable cost','неизбегаемые затраты'),
      ],
    },
    {
      title: 'Variance Analysis',
      words: [
        w('variance','отклонение'), w('budget variance','бюджетное отклонение'),
        w('material variance','отклонение по материалам'), w('labour variance','отклонение по труду'),
        w('overhead variance','отклонение по накладным расходам'),
        w('price variance','ценовое отклонение'), w('quantity variance','количественное отклонение'),
        w('efficiency variance','отклонение по эффективности'), w('rate variance','отклонение по ставке'),
        w('volume variance','объёмное отклонение'), w('capacity variance','отклонение по мощности'),
        w('sales variance','отклонение по продажам'), w('favourable','благоприятное'),
        w('adverse','неблагоприятное'), w('investigate','исследовать'), w('root cause','первопричина'),
        w('corrective action','корректирующее действие'),
        w('controllable variance','контролируемое отклонение'),
        w('uncontrollable variance','неконтролируемое отклонение'),
        w('standard cost card','карточка нормативной себестоимости'),
        w('actual cost','фактические затраты'), w('flex budget','гибкий бюджет'),
        w('reconciliation','сверка'), w('profit variance','отклонение прибыли'),
        w('absorption variance','отклонение поглощения'),
      ],
    },
    {
      title: 'Break-even',
      words: [
        w('break-even point','точка безубыточности'), w('break-even analysis','анализ безубыточности'),
        w('fixed cost','постоянные затраты'), w('variable cost','переменные затраты'),
        w('selling price','цена продажи'), w('contribution','маржинальный доход'),
        w('margin of safety','запас прочности'), w('target profit','целевая прибыль'),
        w('break-even revenue','выручка в точке безубыточности'),
        w('break-even units','единицы в точке безубыточности'),
        w('contribution per unit','маржинальный доход на единицу'),
        w('contribution margin ratio','коэффициент маржинального дохода'),
        w('profit-volume ratio','коэффициент прибыль/объём'), w('operating leverage','операционный рычаг'),
        w('cost-volume-profit','затраты-объём-прибыль'), w('CVP graph','график CVP'),
        w('break-even chart','график безубыточности'), w('total revenue line','линия общей выручки'),
        w('total cost line','линия общих затрат'), w('intersection','точка пересечения'),
        w('above break-even','выше точки безубыточности'),
        w('below break-even','ниже точки безубыточности'), w('assumption','допущение'),
        w('limitation','ограничение'), w('multi-product','многопродуктовый'),
      ],
    },
    {
      title: 'Contribution Margin',
      words: [
        w('contribution','маржинальный доход'), w('contribution margin','маржа вклада'),
        w('contribution per unit','вклад на единицу'), w('total contribution','совокупный вклад'),
        w('contribution ratio','коэффициент вклада'),
        w('contribution margin ratio','коэффициент маржи вклада'), w('selling price','цена продажи'),
        w('variable cost','переменные затраты'), w('fixed cost','постоянные затраты'),
        w('profit','прибыль'), w('break-even','точка безубыточности'),
        w('margin of safety','запас прочности'), w('product mix','ассортимент продукции'),
        w('limiting factor','ограничивающий фактор'), w('scarce resource','дефицитный ресурс'),
        w('contribution per limiting factor','вклад на ограничивающий фактор'),
        w('rank','ранжировать'), w('allocate','распределять'), w('optimise','оптимизировать'),
        w('product decision','решение по продукту'), w('make or buy','производить или покупать'),
        w('discontinue','прекратить'), w('special order','специальный заказ'),
        w('shut down','закрыть'), w('relevant cost','релевантные затраты'),
      ],
    },
    {
      title: 'Forecasting',
      words: [
        w('forecast','прогноз'), w('sales forecast','прогноз продаж'), w('cost forecast','прогноз затрат'),
        w('cash flow forecast','прогноз денежного потока'), w('rolling forecast','скользящий прогноз'),
        w('driver-based forecast','прогноз на основе драйверов'), w('assumption','допущение'),
        w('trend','тенденция'), w('seasonal adjustment','сезонная корректировка'),
        w('growth rate','темп роста'), w('volume','объём'), w('price','цена'),
        w('sensitivity analysis','анализ чувствительности'), w('scenario','сценарий'),
        w('best case','оптимистичный сценарий'), w('worst case','пессимистичный сценарий'),
        w('base case','базовый сценарий'), w('forecast error','ошибка прогноза'),
        w('bias','систематическая ошибка'), w('accuracy','точность'),
        w('reforecast','пересмотр прогноза'), w('extrapolation','экстраполяция'),
        w('regression','регрессия'), w('moving average','скользящее среднее'),
        w('exponential smoothing','экспоненциальное сглаживание'),
      ],
    },
  ],
}

// ─── Module 6 – Taxation (B2) ─────────────────────────────────────────────────
const mod_taxation: MD = {
  title: 'Taxation', section: 'B2', lessons: [
    {
      title: 'VAT',
      words: [
        w('VAT','НДС'), w('value added tax','налог на добавленную стоимость'),
        w('standard rate','стандартная ставка'), w('reduced rate','пониженная ставка'),
        w('zero rate','нулевая ставка'), w('exempt','освобождённый'),
        w('output tax','исходящий НДС'), w('input tax','входящий НДС'),
        w('VAT return','декларация по НДС'), w('registration','регистрация'),
        w('threshold','порог'), w('VAT number','номер плательщика НДС'),
        w('tax period','налоговый период'), w('payment','уплата'), w('reclaim','возврат'),
        w('invoice','счёт-фактура'), w('taxable supply','облагаемая поставка'),
        w('exempt supply','освобождённая поставка'), w('partially exempt','частично освобождённый'),
        w('de minimis','де-минимис'), w('reverse charge','обратное начисление'),
        w('acquisition','приобретение'), w('import VAT','импортный НДС'),
        w('flat rate scheme','схема фиксированной ставки'),
        w('cash accounting scheme','кассовая схема учёта'),
      ],
    },
    {
      title: 'Corporate Tax',
      words: [
        w('corporation tax','налог на прибыль организаций'),
        w('taxable profit','налогооблагаемая прибыль'), w('accounting profit','бухгалтерская прибыль'),
        w('adjustment','корректировка'), w('disallowable expense','неразрешённые расходы'),
        w('capital allowance','амортизационная льгота'), w('trading loss','торговый убыток'),
        w('group relief','групповой зачёт'), w('tax liability','налоговые обязательства'),
        w('payment deadline','срок уплаты'), w('self-assessment','самооценка'),
        w('HMRC','Налоговая служба Великобритании'), w('tax return','налоговая декларация'),
        w('accounting period','отчётный период'), w('main rate','основная ставка'),
        w('small profits rate','ставка для малого бизнеса'),
        w('marginal relief','маргинальное облегчение'), w('R&D relief','налоговая льгота на НИОКР'),
        w('patent box','патентная льгота'), w('tax planning','налоговое планирование'),
        w('deferred tax','отложенный налог'), w('current tax','текущий налог'),
        w('tax provision','налоговое резервирование'), w('advance payment','авансовый платёж'),
        w('instalment','рассрочка'),
      ],
    },
    {
      title: 'Personal Tax',
      words: [
        w('personal tax','подоходный налог'), w('income tax','налог на доходы физических лиц'),
        w('personal allowance','личное необлагаемое пособие'), w('basic rate','базовая ставка'),
        w('higher rate','повышенная ставка'), w('additional rate','дополнительная ставка'),
        w('employment income','доход от трудоустройства'),
        w('self-employment income','доход от самозанятости'), w('dividend income','дивидендный доход'),
        w('rental income','доход от аренды'), w('capital gain','прирост капитала'),
        w('pension contribution','пенсионный взнос'), w('gift aid','благотворительное пособие'),
        w('tax band','налоговый диапазон'), w('PAYE','PAYE (налог у источника)'),
        w('self-assessment','самооценка'), w('tax return','налоговая декларация'),
        w('due date','срок подачи'), w('late filing penalty','штраф за позднюю подачу'),
        w('national insurance','национальное страхование'), w('class 1','класс 1'),
        w('class 2','класс 2'), w('class 4','класс 4'), w('tax credit','налоговый кредит'),
        w('child benefit','пособие на ребёнка'),
      ],
    },
    {
      title: 'Deductions',
      words: [
        w('deduction','вычет'), w('allowable expense','разрешённые расходы'),
        w('capital allowance','амортизационная льгота'),
        w('annual investment allowance','годовая инвестиционная льгота'),
        w('writing down allowance','ежегодная амортизационная льгота'),
        w('enhanced allowance','расширенная льгота'), w('trading expense','торговые расходы'),
        w('wholly and exclusively','полностью и исключительно'),
        w('pre-trading expense','расходы до начала торговли'), w('entertainment','представительские расходы'),
        w('depreciation','амортизация'), w('interest expense','расходы на проценты'),
        w('pension contribution','пенсионный взнос'), w('charitable donation','благотворительный взнос'),
        w('gift aid','благотворительное пособие'), w('relief','льгота'), w('claim','требование'),
        w('carry back','перенос назад'), w('carry forward','перенос вперёд'),
        w('restriction','ограничение'), w('cap','лимит'), w('limit','предельный размер'),
        w('offset','зачёт'), w('net income','чистый доход'), w('taxable income','налогооблагаемый доход'),
      ],
    },
    {
      title: 'Tax Returns',
      words: [
        w('tax return','налоговая декларация'), w('self-assessment','самооценка'),
        w('filing deadline','срок подачи'), w('payment deadline','срок уплаты'),
        w('online filing','подача в электронном виде'), w('paper return','бумажная декларация'),
        w('late filing penalty','штраф за позднюю подачу'),
        w('late payment interest','проценты за просрочку'), w('amendment','исправление'),
        w('correction','корректировка'), w('provisional figure','предварительная цифра'),
        w('estimate','оценка'), w('supplementary pages','дополнительные страницы'),
        w('employment page','страница трудоустройства'), w('property page','страница имущества'),
        w('capital gains page','страница прироста капитала'), w('foreign income','иностранный доход'),
        w('trust income','доход от траста'), w('HMRC','Налоговая служба'),
        w('government gateway','портал государственных услуг'), w('UTR','УНН'),
        w('national insurance','национальное страхование'), w('repayment','возврат'),
        w('tax calculation','расчёт налога'), w('summary','сводка'),
      ],
    },
    {
      title: 'Compliance',
      words: [
        w('compliance','соответствие'), w('tax compliance','налоговое соответствие'),
        w('regulatory requirement','нормативное требование'), w('obligation','обязательство'),
        w('deadline','срок'), w('penalty','штраф'), w('interest','проценты'),
        w('HMRC enquiry','запрос налоговой службы'), w('investigation','расследование'),
        w('disclosure','раскрытие'), w('voluntary disclosure','добровольное раскрытие'),
        w('regularisation','регуляризация'), w('Code of Practice','Кодекс практики'),
        w('time limit','временное ограничение'), w('tax avoidance','уклонение от уплаты налогов'),
        w('tax evasion','уход от уплаты налогов'), w('GAAR','GAAR'), w('DOTAS','DOTAS'),
        w('HMRC guidance','руководство налоговой службы'), w('practice note','практическое примечание'),
        w('extra-statutory concession','внеуставная концессия'), w('concession','концессия'),
        w('clearance','разрешение'), w('advance ruling','предварительное решение'),
        w('professional standards','профессиональные стандарты'),
      ],
    },
  ],
}

// ─── Module 7 – Auditing (B2) ─────────────────────────────────────────────────
const mod_auditing: MD = {
  title: 'Auditing', section: 'B2', lessons: [
    {
      title: 'Audit Types',
      words: [
        w('external audit','внешний аудит'), w('internal audit','внутренний аудит'),
        w('statutory audit','обязательный аудит'), w('compliance audit','аудит соответствия'),
        w('operational audit','операционный аудит'), w('financial audit','финансовый аудит'),
        w('forensic audit','судебный аудит'), w('performance audit','аудит эффективности'),
        w('IT audit','IT-аудит'), w('environmental audit','экологический аудит'),
        w('due diligence','дью-дилидженс'), w('review engagement','обзорное задание'),
        w('agreed-upon procedures','согласованные процедуры'), w('compilation','компиляция'),
        w('assurance','заверение'), w('audit opinion','аудиторское заключение'),
        w('scope','охват'), w('objective','цель'), w('independence','независимость'),
        w('objectivity','объективность'), w('professional scepticism','профессиональный скептицизм'),
        w('materiality','существенность'), w('risk-based audit','аудит на основе рисков'),
        w('cycle','цикл'), w('annual audit','ежегодный аудит'),
      ],
    },
    {
      title: 'Internal Controls',
      words: [
        w('internal control','внутренний контроль'), w('control environment','контрольная среда'),
        w('risk assessment','оценка рисков'), w('control activity','контрольная деятельность'),
        w('information and communication','информация и коммуникации'), w('monitoring','мониторинг'),
        w('segregation of duties','разделение обязанностей'), w('authorisation','авторизация'),
        w('physical control','физический контроль'), w('reconciliation','сверка'),
        w('review','проверка'), w('approval','одобрение'), w('access control','контроль доступа'),
        w('password','пароль'), w('audit trail','след аудита'), w('COSO','COSO'),
        w('preventive control','превентивный контроль'), w('detective control','выявляющий контроль'),
        w('corrective control','корректирующий контроль'),
        w('compensating control','компенсирующий контроль'), w('control weakness','слабость контроля'),
        w('deficiency','недостаток'), w('significant deficiency','значительный недостаток'),
        w('material weakness','существенная слабость'), w('remediation','устранение'),
      ],
    },
    {
      title: 'Risk Assessment',
      words: [
        w('audit risk','аудиторский риск'), w('inherent risk','неотъемлемый риск'),
        w('control risk','риск контроля'), w('detection risk','риск необнаружения'),
        w('risk assessment','оценка рисков'), w('risk factor','фактор риска'),
        w('high risk','высокий риск'), w('low risk','низкий риск'), w('risk matrix','матрица рисков'),
        w('risk register','реестр рисков'), w('fraud risk','риск мошенничества'),
        w('error risk','риск ошибки'), w('management override','обход контроля руководством'),
        w('significant account','существенный счёт'), w('assertion','утверждение'),
        w('completeness','полнота'), w('accuracy','точность'), w('existence','существование'),
        w('valuation','оценка'), w('rights and obligations','права и обязательства'),
        w('presentation','представление'), w('disclosure','раскрытие'),
        w('going concern risk','риск непрерывности деятельности'), w('sampling risk','риск выборки'),
        w('non-sampling risk','риск не-выборки'),
      ],
    },
    {
      title: 'Sampling',
      words: [
        w('sampling','выборка'), w('audit sampling','аудиторская выборка'),
        w('statistical sampling','статистическая выборка'),
        w('non-statistical sampling','нестатистическая выборка'),
        w('judgement sampling','выборка на основе суждения'), w('random sampling','случайная выборка'),
        w('systematic sampling','систематическая выборка'),
        w('stratified sampling','стратифицированная выборка'), w('sample size','размер выборки'),
        w('tolerable error','допустимая ошибка'), w('expected error','ожидаемая ошибка'),
        w('sampling risk','риск выборки'), w('confidence level','уровень доверия'),
        w('population','генеральная совокупность'), w('item','элемент'), w('test','тест'),
        w('evaluation','оценка'), w('extrapolation','экстраполяция'),
        w('projected error','прогнозируемая ошибка'), w('anomaly','аномалия'),
        w('accept','принять'), w('reject','отклонить'), w('conclusion','вывод'),
        w('limitation','ограничение'), w('approach','подход'),
      ],
    },
    {
      title: 'Evidence',
      words: [
        w('audit evidence','аудиторское свидетельство'),
        w('sufficient evidence','достаточные свидетельства'),
        w('appropriate evidence','надлежащие свидетельства'), w('relevance','релевантность'),
        w('reliability','надёжность'), w('source','источник'),
        w('external evidence','внешние свидетельства'), w('internal evidence','внутренние свидетельства'),
        w('direct evidence','прямые свидетельства'), w('indirect evidence','косвенные свидетельства'),
        w('observation','наблюдение'), w('inspection','инспекция'), w('inquiry','запрос'),
        w('confirmation','подтверждение'), w('recalculation','пересчёт'),
        w('reperformance','повторное выполнение'), w('analytical procedure','аналитическая процедура'),
        w('vouching','проверка по документам'), w('tracing','отслеживание'),
        w('cut-off test','тест отсечения'), w('physical verification','физическая проверка'),
        w('third-party confirmation','подтверждение третьей стороны'),
        w('bank letter','банковское письмо'), w('debtor circularisation','рассылка дебиторам'),
        w('management representation','заявление руководства'),
      ],
    },
    {
      title: 'Audit Reports',
      words: [
        w('audit report','аудиторский отчёт'), w('auditors opinion','заключение аудитора'),
        w('unmodified opinion','немодифицированное заключение'),
        w('modified opinion','модифицированное заключение'),
        w('qualified opinion','заключение с оговоркой'),
        w('adverse opinion','отрицательное заключение'),
        w('disclaimer of opinion','отказ от выражения мнения'),
        w('material misstatement','существенное искажение'), w('pervasive','всеобъемлющий'),
        w('emphasis of matter','особое обстоятельство'), w('other matter','прочие обстоятельства'),
        w('key audit matter','ключевой вопрос аудита'), w('going concern','непрерывность деятельности'),
        w('basis of opinion','основание мнения'), w('responsibilities','обязанности'),
        w('management responsibility','ответственность руководства'),
        w('auditor responsibility','ответственность аудитора'),
        w('financial statements','финансовая отчётность'), w('true and fair','достоверно и справедливо'),
        w('material','существенный'), w('independent','независимый'), w('signed','подписанный'),
        w('dated','датированный'), w('addressed','адресованный'), w('firm','аудиторская фирма'),
      ],
    },
  ],
}

// ─── Module 8 – Payroll & HR Finance (B2) ────────────────────────────────────
const mod_payroll: MD = {
  title: 'Payroll & HR Finance', section: 'B2', lessons: [
    {
      title: 'Salary Calculations',
      words: [
        w('gross salary','валовая заработная плата'), w('net salary','чистая заработная плата'),
        w('basic pay','базовый оклад'), w('hourly rate','почасовая ставка'),
        w('monthly salary','месячная заработная плата'), w('annual salary','годовая заработная плата'),
        w('overtime rate','ставка за сверхурочные'), w('regular hours','стандартные часы'),
        w('overtime hours','сверхурочные часы'), w('gross pay calculation','расчёт валовой оплаты'),
        w('deductions','удержания'), w('PAYE','PAYE'), w('NI','национальное страхование'),
        w('pension','пенсия'), w('take-home pay','сумма на руки'),
        w('payroll calculation','расчёт зарплаты'), w('pay structure','структура оплаты'),
        w('incremental scale','шкала надбавок'), w('salary band','диапазон оклада'),
        w('grade','грейд'), w('step increase','шаговое повышение'), w('merit pay','оплата за заслуги'),
        w('performance pay','оплата по результатам'), w('pay review','пересмотр оклада'),
        w('backdated pay','ретроактивная оплата'),
      ],
    },
    {
      title: 'Benefits',
      words: [
        w('employee benefit','льгота сотрудника'), w('fringe benefit','дополнительная льгота'),
        w('taxable benefit','налогооблагаемая льгота'), w('non-taxable benefit','необлагаемая льгота'),
        w('company car','служебный автомобиль'), w('private medical insurance','частная медицинская страховка'),
        w('life assurance','страхование жизни'), w('income protection','защита дохода'),
        w('critical illness','страхование от критических болезней'),
        w('dental cover','стоматологическое страхование'), w('eye care','офтальмологическая помощь'),
        w('gym membership','абонемент в спортзал'), w('cycle scheme','программа велосипеда'),
        w('childcare voucher','ваучер на уход за ребёнком'), w('staff discount','скидка для персонала'),
        w('season ticket loan','кредит на проездной'),
        w('share scheme','схема участия в акционерном капитале'),
        w('sharesave scheme','программа накопления акций'), w('EMI option','опцион EMI'),
        w('SAYE','SAYE'), w('benefit in kind','льгота в натуральной форме'), w('P11D','форма P11D'),
        w('benefit valuation','оценка льготы'), w('salary sacrifice','жертва зарплатой'),
        w('flexible benefits','гибкие льготы'),
      ],
    },
    {
      title: 'Pension',
      words: [
        w('pension','пенсия'), w('defined benefit pension','пенсия с установленными выплатами'),
        w('defined contribution pension','пенсия с установленными взносами'),
        w('employer contribution','взнос работодателя'), w('employee contribution','взнос работника'),
        w('auto-enrolment','автоматическое зачисление'),
        w('qualifying earnings','квалифицируемый заработок'), w('pension scheme','пенсионная схема'),
        w('pension pot','пенсионный фонд'), w('vesting','приобретение прав'),
        w('retirement age','пенсионный возраст'), w('pension forecast','пенсионный прогноз'),
        w('state pension','государственная пенсия'),
        w('additional state pension','дополнительная государственная пенсия'),
        w('national insurance','национальное страхование'), w('pension credit','пенсионный кредит'),
        w('annuity','аннуитет'), w('drawdown','изъятие средств'), w('SIPP','SIPP'),
        w('workplace pension','рабочая пенсионная схема'), w('NEST','NEST'),
        w('contribution rate','ставка взноса'), w('pensionable pay','пенсионная оплата'),
        w('opt-out','выход из схемы'), w('re-enrolment','повторное зачисление'),
      ],
    },
    {
      title: 'Deductions',
      words: [
        w('payroll deduction','удержание из заработной платы'), w('PAYE deduction','удержание PAYE'),
        w('national insurance deduction','удержание НС'), w('pension deduction','пенсионное удержание'),
        w('student loan','студенческий кредит'), w('attachment of earnings','арест заработка'),
        w('court order','судебный приказ'), w('advance repayment','погашение аванса'),
        w('charitable giving','благотворительные взносы'), w('union subscription','членский взнос'),
        w('cycle purchase','покупка велосипеда'), w('net pay','чистая оплата'),
        w('statutory deduction','обязательное удержание'), w('voluntary deduction','добровольное удержание'),
        w('deduction code','код удержания'), w('priority order','очерёдность'),
        w('protected earnings','защищённый заработок'), w('threshold','порог'),
        w('PAYE reference','справочный номер PAYE'), w('NI category','категория НС'),
        w('class A','класс A'), w('class B','класс B'), w('class C','класс C'),
        w('student loan plan 1','план студенческого кредита 1'),
        w('student loan plan 2','план студенческого кредита 2'),
      ],
    },
    {
      title: 'Payroll Systems',
      words: [
        w('payroll system','система расчёта заработной платы'),
        w('payroll software','ПО для зарплаты'), w('payroll run','расчёт заработной платы'),
        w('payroll cycle','цикл начисления'), w('weekly payroll','еженедельный расчёт'),
        w('monthly payroll','ежемесячный расчёт'), w('payroll bureau','служба расчёта заработной платы'),
        w('in-house payroll','внутренний расчёт'), w('RTI','RTI'),
        w('full payment submission','полная отчётность о выплатах'),
        w('employer payment summary','сводка выплат работодателя'),
        w('final submission','окончательная отчётность'), w('PAYE scheme','схема PAYE'),
        w('employer PAYE reference','справочный номер работодателя'),
        w('Basic PAYE Tools','базовые инструменты PAYE'),
        w('payslip generation','формирование расчётных листов'), w('BACS payment','платёж BACS'),
        w('net pay','чистая оплата'), w('gross pay','валовая оплата'),
        w('payroll journal','журнал расчёта заработной платы'),
        w('payroll report','отчёт по заработной плате'), w('year end','конец года'),
        w('P60','форма P60'), w('P45','форма P45'), w('P11D','форма P11D'),
      ],
    },
    {
      title: 'Employment Contracts',
      words: [
        w('employment contract','трудовой договор'), w('contract of employment','договор о найме'),
        w('permanent contract','бессрочный договор'), w('temporary contract','срочный договор'),
        w('fixed-term contract','договор с фиксированным сроком'),
        w('zero-hours contract','договор без гарантированных часов'),
        w('part-time contract','договор о неполной занятости'),
        w('full-time contract','договор о полной занятости'), w('probationary period','испытательный срок'),
        w('notice period','срок уведомления'), w('salary clause','оговорка об окладе'),
        w('job description','должностная инструкция'), w('duties','обязанности'),
        w('place of work','место работы'), w('working hours','рабочее время'),
        w('holiday entitlement','право на отпуск'), w('sick pay','пособие по болезни'),
        w('pension','пенсия'), w('confidentiality','конфиденциальность'),
        w('restrictive covenant','ограничительная оговорка'), w('termination','расторжение'),
        w('redundancy','сокращение'), w('dismissal','увольнение'),
        w('gross misconduct','грубый проступок'), w('grievance procedure','процедура рассмотрения жалоб'),
      ],
    },
  ],
}

// ─── Module 9 – Financial Analysis (C1) ──────────────────────────────────────
const mod_financial_analysis: MD = {
  title: 'Financial Analysis', section: 'C1', lessons: [
    {
      title: 'Ratio Analysis',
      words: [
        w('financial ratio','финансовый коэффициент'), w('ratio analysis','анализ коэффициентов'),
        w('liquidity ratio','коэффициент ликвидности'), w('profitability ratio','коэффициент рентабельности'),
        w('efficiency ratio','коэффициент эффективности'),
        w('solvency ratio','коэффициент платёжеспособности'),
        w('leverage ratio','коэффициент кредитного плеча'),
        w('current ratio','коэффициент текущей ликвидности'),
        w('quick ratio','коэффициент быстрой ликвидности'), w('gross margin','маржа валовой прибыли'),
        w('net margin','маржа чистой прибыли'),
        w('return on equity','рентабельность собственного капитала'),
        w('return on assets','рентабельность активов'), w('asset turnover','оборачиваемость активов'),
        w('debt ratio','коэффициент долга'), w('interest cover','покрытие процентов'),
        w('earnings per share','прибыль на акцию'), w('dividend cover','покрытие дивидендов'),
        w('dividend yield','дивидендная доходность'), w('price-earnings ratio','коэффициент P/E'),
        w('book value per share','балансовая стоимость на акцию'),
        w('net asset value','стоимость чистых активов'),
        w('market capitalisation','рыночная капитализация'), w('enterprise value','стоимость предприятия'),
        w('EBITDA multiple','мультипликатор EBITDA'),
      ],
    },
    {
      title: 'Liquidity',
      words: [
        w('liquidity','ликвидность'), w('current ratio','коэффициент текущей ликвидности'),
        w('quick ratio','коэффициент быстрой ликвидности'),
        w('acid test ratio','коэффициент кислотного теста'), w('cash ratio','коэффициент наличности'),
        w('current assets','оборотные активы'), w('current liabilities','краткосрочные обязательства'),
        w('net working capital','чистый оборотный капитал'), w('operating cycle','операционный цикл'),
        w('cash conversion cycle','цикл конверсии денежных средств'),
        w('inventory days','дни запасов'), w('receivables days','дни дебиторской задолженности'),
        w('payables days','дни кредиторской задолженности'), w('cash flow','денежный поток'),
        w('liquid assets','ликвидные активы'), w('near liquid','почти ликвидный'),
        w('cash equivalents','эквиваленты денежных средств'),
        w('short-term obligations','краткосрочные обязательства'),
        w('liquidity management','управление ликвидностью'), w('cash buffer','денежный буфер'),
        w('credit facility','кредитная линия'), w('overdraft','овердрафт'),
        w('liquidity risk','риск ликвидности'), w('stress test','стресс-тест'),
        w('liquidity coverage ratio','коэффициент покрытия ликвидности'),
      ],
    },
    {
      title: 'Profitability',
      words: [
        w('profitability','рентабельность'), w('gross profit margin','маржа валовой прибыли'),
        w('net profit margin','маржа чистой прибыли'), w('operating margin','операционная маржа'),
        w('EBIT margin','маржа EBIT'), w('EBITDA margin','маржа EBITDA'),
        w('return on assets','рентабельность активов'), w('return on equity','рентабельность капитала'),
        w('return on capital employed','рентабельность задействованного капитала'),
        w('return on investment','рентабельность инвестиций'), w('return on sales','рентабельность продаж'),
        w('profit growth','рост прибыли'), w('revenue growth','рост выручки'),
        w('cost efficiency','эффективность затрат'), w('pricing power','ценовая власть'),
        w('margin compression','сжатие маржи'), w('margin expansion','расширение маржи'),
        w('contribution margin','маржа вклада'), w('operating leverage','операционный рычаг'),
        w('earnings quality','качество прибыли'), w('sustainable profit','устойчивая прибыль'),
        w('profit trend','тенденция прибыли'), w('segment profitability','рентабельность сегмента'),
        w('product profitability','рентабельность продукта'),
        w('customer profitability','рентабельность клиента'),
      ],
    },
    {
      title: 'Solvency',
      words: [
        w('solvency','платёжеспособность'), w('debt-to-equity ratio','коэффициент долг/капитал'),
        w('debt ratio','коэффициент долга'), w('leverage','финансовый рычаг'),
        w('gearing','коэффициент заёмного капитала'), w('interest cover','покрытие процентов'),
        w('fixed charge cover','покрытие фиксированных платежей'), w('long-term debt','долгосрочный долг'),
        w('total debt','общий долг'), w('equity','собственный капитал'), w('net debt','чистый долг'),
        w('EBITDA','EBITDA'), w('debt-to-EBITDA','долг к EBITDA'), w('credit rating','кредитный рейтинг'),
        w('investment grade','инвестиционный рейтинг'), w('speculative grade','спекулятивный рейтинг'),
        w('financial distress','финансовые трудности'), w('default risk','риск дефолта'),
        w('covenant','ковенант'), w('breach','нарушение'), w('refinancing','рефинансирование'),
        w('debt maturity','срок погашения долга'), w('capital structure','структура капитала'),
        w('deleveraging','снижение долговой нагрузки'), w('net debt reduction','снижение чистого долга'),
      ],
    },
    {
      title: 'Benchmarking',
      words: [
        w('benchmarking','бенчмаркинг'), w('industry benchmark','отраслевой эталон'),
        w('peer comparison','сравнение с аналогами'), w('sector average','среднеотраслевой показатель'),
        w('best in class','лучший в классе'), w('key metric','ключевая метрика'),
        w('performance indicator','показатель результативности'),
        w('relative performance','относительные результаты'), w('outperform','превзойти'),
        w('underperform','отставать'), w('gap analysis','анализ разрывов'),
        w('competitive advantage','конкурентное преимущество'), w('internal benchmark','внутренний эталон'),
        w('historical comparison','историческое сравнение'), w('trend analysis','анализ тенденций'),
        w('quartile','квартиль'), w('median','медиана'), w('percentile','перцентиль'),
        w('ranking','ранжирование'), w('scorecard','система показателей'), w('dashboard','дашборд'),
        w('target','целевой показатель'), w('stretch target','амбициозная цель'),
        w('performance gap','разрыв в результатах'), w('improvement initiative','инициатива по улучшению'),
      ],
    },
    {
      title: 'KPIs',
      words: [
        w('KPI','КПЭ'), w('key performance indicator','ключевой показатель эффективности'),
        w('financial KPI','финансовый КПЭ'), w('non-financial KPI','нефинансовый КПЭ'),
        w('revenue KPI','КПЭ выручки'), w('profitability KPI','КПЭ рентабельности'),
        w('efficiency KPI','КПЭ эффективности'), w('growth KPI','КПЭ роста'),
        w('lagging indicator','запаздывающий индикатор'), w('leading indicator','опережающий индикатор'),
        w('SMART target','цель SMART'), w('dashboard','дашборд'), w('scorecard','система показателей'),
        w('balanced scorecard','сбалансированная система показателей'),
        w('target','целевой показатель'), w('threshold','порог'), w('RAG status','RAG статус'),
        w('trend','тенденция'), w('year-on-year','год к году'), w('month-on-month','месяц к месяцу'),
        w('cumulative','нарастающим итогом'), w('forecast','прогноз'), w('actual','факт'),
        w('variance','отклонение'), w('management report','управленческий отчёт'),
      ],
    },
  ],
}

// ─── Module 10 – IFRS & Standards (C1) ───────────────────────────────────────
const mod_ifrs: MD = {
  title: 'IFRS & Standards', section: 'C1', lessons: [
    {
      title: 'IFRS Principles',
      words: [
        w('IFRS','МСФО'),
        w('International Financial Reporting Standards','Международные стандарты финансовой отчётности'),
        w('IASB','СМСФО'), w('conceptual framework','концептуальная основа'),
        w('relevance','уместность'), w('faithful representation','правдивое представление'),
        w('comparability','сопоставимость'), w('verifiability','проверяемость'),
        w('timeliness','своевременность'), w('understandability','понятность'),
        w('going concern','непрерывность деятельности'), w('accrual basis','метод начисления'),
        w('materiality','существенность'), w('aggregation','агрегирование'),
        w('offsetting','взаимозачёт'), w('consistency','последовательность'),
        w('substance over form','приоритет содержания над формой'), w('prudence','осмотрительность'),
        w('neutrality','нейтральность'), w('completeness','полнота'),
        w('free from error','без существенных ошибок'),
        w('enhancing qualitative characteristics','улучшающие качественные характеристики'),
        w('recognition','признание'), w('derecognition','прекращение признания'),
        w('measurement','оценка'),
      ],
    },
    {
      title: 'Fair Value',
      words: [
        w('fair value','справедливая стоимость'), w('IFRS 13','МСФО 13'),
        w('fair value hierarchy','иерархия справедливой стоимости'),
        w('level 1 input','исходные данные уровня 1'), w('level 2 input','исходные данные уровня 2'),
        w('level 3 input','исходные данные уровня 3'), w('market-based measurement','рыночная оценка'),
        w('exit price','цена выхода'), w('principal market','основной рынок'),
        w('most advantageous market','наиболее выгодный рынок'), w('market participant','участник рынка'),
        w('observable input','наблюдаемые исходные данные'),
        w('unobservable input','ненаблюдаемые исходные данные'),
        w('valuation technique','метод оценки'), w('market approach','рыночный подход'),
        w('income approach','доходный подход'), w('cost approach','затратный подход'),
        w('present value','приведённая стоимость'), w('discount rate','ставка дисконтирования'),
        w('fair value measurement','оценка по справедливой стоимости'),
        w('fair value disclosure','раскрытие справедливой стоимости'),
        w('recurring measurement','периодическая оценка'), w('non-recurring measurement','разовая оценка'),
        w('sensitivity analysis','анализ чувствительности'), w('calibration','калибровка'),
      ],
    },
    {
      title: 'Consolidation',
      words: [
        w('consolidation','консолидация'), w('group accounts','консолидированная отчётность'),
        w('parent company','материнская компания'), w('subsidiary','дочерняя компания'),
        w('associate','ассоциированная компания'), w('joint venture','совместное предприятие'),
        w('control','контроль'), w('significant influence','значительное влияние'),
        w('IFRS 10','МСФО 10'), w('IAS 28','МСБУ 28'), w('business combination','объединение бизнеса'),
        w('goodwill','деловая репутация'), w('non-controlling interest','неконтролирующая доля'),
        w('acquisition method','метод приобретения'),
        w('purchase price allocation','распределение цены приобретения'),
        w('fair value adjustment','корректировка до справедливой стоимости'),
        w('intercompany elimination','исключение внутригрупповых операций'),
        w('intragroup transaction','внутригрупповая операция'),
        w('unrealised profit','нереализованная прибыль'),
        w('consolidation adjustment','консолидационная корректировка'),
        w('equity method','метод долевого участия'),
        w('proportionate consolidation','пропорциональная консолидация'),
        w('investment entity','инвестиционная организация'),
        w('consolidation exemption','исключение из консолидации'),
        w('effective interest','эффективная доля участия'),
      ],
    },
    {
      title: 'Leases',
      words: [
        w('lease','аренда'), w('IFRS 16','МСФО 16'), w('lessee','арендатор'), w('lessor','арендодатель'),
        w('right-of-use asset','актив в форме права пользования'),
        w('lease liability','арендное обязательство'), w('commencement date','дата начала'),
        w('lease term','срок аренды'), w('lease payment','арендный платёж'),
        w('discount rate','ставка дисконтирования'),
        w('incremental borrowing rate','ставка дополнительного заимствования'),
        w('short-term lease','краткосрочная аренда'), w('low-value asset','актив малой стоимости'),
        w('finance lease','финансовая аренда'), w('operating lease','операционная аренда'),
        w('sale and leaseback','продажа с обратной арендой'),
        w('variable lease payment','переменный арендный платёж'),
        w('lease modification','изменение аренды'), w('reassessment','переоценка'),
        w('renewal option','опцион на продление'), w('purchase option','опцион на покупку'),
        w('residual value','остаточная стоимость'), w('depreciation','амортизация'),
        w('interest expense','расходы на проценты'), w('derecognition','прекращение признания'),
      ],
    },
    {
      title: 'Revenue Recognition',
      words: [
        w('revenue recognition','признание выручки'), w('IFRS 15','МСФО 15'),
        w('performance obligation','обязательство к исполнению'), w('transaction price','цена сделки'),
        w('contract','контракт'), w('customer','покупатель'),
        w('satisfy obligation','выполнить обязательство'), w('point in time','в определённый момент'),
        w('over time','в течение времени'), w('variable consideration','переменное вознаграждение'),
        w('constraint','ограничение'), w('contract modification','изменение контракта'),
        w('principal vs agent','принципал против агента'), w('bill and hold','счёт и хранение'),
        w('consignment','консигнация'), w('licenses','лицензии'), w('warranties','гарантии'),
        w('financing component','финансовая составляющая'), w('contract costs','затраты на контракт'),
        w('incremental cost','дополнительные затраты'), w('cost to fulfil','затраты на выполнение'),
        w('allocate transaction price','распределить цену сделки'),
        w('standalone selling price','цена автономной продажи'),
        w('contract asset','актив по контракту'), w('contract liability','обязательство по контракту'),
      ],
    },
    {
      title: 'Disclosure',
      words: [
        w('disclosure','раскрытие информации'), w('note disclosure','раскрытие в примечании'),
        w('accounting policy note','примечание об учётной политике'),
        w('critical judgement','критическое суждение'),
        w('estimation uncertainty','неопределённость оценки'), w('IFRS 7','МСФО 7'),
        w('IFRS 8','МСФО 8'), w('segment reporting','сегментная отчётность'),
        w('operating segment','операционный сегмент'), w('geographic segment','географический сегмент'),
        w('related party disclosure','раскрытие о связанных сторонах'), w('IAS 24','МСБУ 24'),
        w('management commentary','управленческий комментарий'),
        w('going concern disclosure','раскрытие непрерывности деятельности'),
        w('subsequent event','последующее событие'), w('IAS 10','МСБУ 10'),
        w('contingent liability','условное обязательство'), w('IAS 37','МСБУ 37'),
        w('share-based payment','платёж на основе акций'), w('IFRS 2','МСФО 2'),
        w('earnings per share','прибыль на акцию'), w('IAS 33','МСБУ 33'),
        w('fair value disclosure','раскрытие справедливой стоимости'),
        w('sensitivity disclosure','раскрытие чувствительности'), w('risk disclosure','раскрытие рисков'),
      ],
    },
  ],
}

// ─── Module 11 – Corporate Finance (C1) ──────────────────────────────────────
const mod_corporate_finance: MD = {
  title: 'Corporate Finance', section: 'C1', lessons: [
    {
      title: 'Capital Structure',
      words: [
        w('capital structure','структура капитала'), w('equity finance','долевое финансирование'),
        w('debt finance','долговое финансирование'), w('leverage','финансовый рычаг'),
        w('gearing','заёмный капитал'), w('optimal capital structure','оптимальная структура капитала'),
        w('Modigliani-Miller','Модильяни-Миллер'), w('tax shield','налоговый щит'),
        w('financial distress','финансовые трудности'), w('pecking order theory','теория иерархии'),
        w('trade-off theory','теория компромисса'), w('cost of equity','стоимость собственного капитала'),
        w('cost of debt','стоимость заёмного капитала'), w('WACC','WACC'),
        w('weighted average cost of capital','средневзвешенная стоимость капитала'),
        w('capital market','рынок капитала'), w('market value','рыночная стоимость'),
        w('book value','балансовая стоимость'), w('debt capacity','долговая ёмкость'),
        w('covenants','ковенанты'), w('financial flexibility','финансовая гибкость'),
        w('rating agency','рейтинговое агентство'), w('credit spread','кредитный спред'),
        w('equity dilution','разводнение капитала'), w('recapitalisation','рекапитализация'),
      ],
    },
    {
      title: 'WACC',
      words: [
        w('WACC','WACC'), w('weighted average cost of capital','средневзвешенная стоимость капитала'),
        w('cost of equity','стоимость собственного капитала'), w('cost of debt','стоимость долга'),
        w('capital structure','структура капитала'), w('market value weights','веса по рыночной стоимости'),
        w('book value weights','веса по балансовой стоимости'), w('CAPM','CAPM'),
        w('beta','бета'), w('risk-free rate','безрисковая ставка'),
        w('equity risk premium','премия за риск капитала'), w('systematic risk','систематический риск'),
        w('unsystematic risk','несистематический риск'), w('levered beta','заёмная бета'),
        w('unlevered beta','незаёмная бета'), w('tax shield','налоговый щит'),
        w('marginal cost','предельная стоимость'), w('hurdle rate','пороговая ставка'),
        w('discount rate','ставка дисконтирования'), w('project evaluation','оценка проекта'),
        w('NPV','ЧПС'), w('IRR','ВНД'), w('investment decision','инвестиционное решение'),
        w('cost of preference shares','стоимость привилегированных акций'),
        w('hybrid instrument','гибридный инструмент'),
      ],
    },
    {
      title: 'Valuation',
      words: [
        w('valuation','оценка стоимости'), w('discounted cash flow','дисконтированный денежный поток'),
        w('DCF','ДДП'), w('free cash flow','свободный денежный поток'),
        w('terminal value','терминальная стоимость'), w('discount rate','ставка дисконтирования'),
        w('WACC','WACC'), w('enterprise value','стоимость предприятия'),
        w('equity value','стоимость капитала'), w('net debt','чистый долг'),
        w('comparables','сравнимые компании'), w('EV/EBITDA','EV/EBITDA'),
        w('P/E ratio','коэффициент P/E'), w('price-to-book','цена к балансовой стоимости'),
        w('dividend discount model','модель дисконтирования дивидендов'),
        w('Gordon growth model','модель роста Гордона'), w('LBO analysis','LBO-анализ'),
        w('precedent transactions','прецедентные сделки'), w('intrinsic value','внутренняя стоимость'),
        w('market value','рыночная стоимость'), w('book value','балансовая стоимость'),
        w('sum of the parts','сумма частей'), w('asset-based valuation','оценка на основе активов'),
        w('liquidation value','ликвидационная стоимость'),
        w('sensitivity analysis','анализ чувствительности'),
      ],
    },
    {
      title: 'M&A',
      words: [
        w('merger','слияние'), w('acquisition','поглощение'), w('M&A','слияния и поглощения'),
        w('target company','целевая компания'), w('acquirer','поглощающая компания'),
        w('strategic rationale','стратегическое обоснование'), w('synergy','синергия'),
        w('cost synergy','синергия затрат'), w('revenue synergy','синергия выручки'),
        w('due diligence','дью-дилидженс'), w('valuation','оценка стоимости'),
        w('offer price','цена предложения'), w('premium','премия'),
        w('control premium','премия за контроль'), w('takeover bid','предложение о поглощении'),
        w('hostile takeover','враждебное поглощение'), w('friendly takeover','дружественное поглощение'),
        w('scheme of arrangement','схема реорганизации'), w('earnout','отложенное вознаграждение'),
        w('consideration','вознаграждение'), w('cash deal','сделка за наличные'),
        w('share deal','сделка за акции'), w('integration','интеграция'),
        w('post-merger integration','интеграция после слияния'),
        w('regulatory approval','регуляторное одобрение'),
      ],
    },
    {
      title: 'Dividends',
      words: [
        w('dividend','дивиденд'), w('ordinary dividend','обычный дивиденд'),
        w('special dividend','специальный дивиденд'), w('interim dividend','промежуточный дивиденд'),
        w('final dividend','окончательный дивиденд'), w('dividend policy','дивидендная политика'),
        w('dividend yield','дивидендная доходность'), w('dividend cover','покрытие дивидендов'),
        w('payout ratio','коэффициент выплат'), w('retention ratio','коэффициент удержания'),
        w('earnings per share','прибыль на акцию'), w('dividend per share','дивиденд на акцию'),
        w('scrip dividend','дивиденд акциями'),
        w('dividend reinvestment plan','план реинвестирования дивидендов'),
        w('ex-dividend date','дата отсечения реестра'), w('record date','дата записи'),
        w('payment date','дата выплаты'), w('progressive dividend','прогрессивный дивиденд'),
        w('sustainable dividend','устойчивый дивиденд'), w('residual dividend','остаточный дивиденд'),
        w('dividend irrelevance','нерелевантность дивидендов'), w('share buyback','выкуп акций'),
        w('return of capital','возврат капитала'), w('dividend smoothing','сглаживание дивидендов'),
        w('signalling theory','теория сигнализации'),
      ],
    },
    {
      title: 'Investment Decisions',
      words: [
        w('investment decision','инвестиционное решение'),
        w('capital budgeting','составление инвестиционного бюджета'), w('NPV','ЧПС'),
        w('net present value','чистая приведённая стоимость'), w('IRR','ВНД'),
        w('internal rate of return','внутренняя норма доходности'),
        w('payback period','срок окупаемости'), w('discounted payback','дисконтированный срок окупаемости'),
        w('profitability index','индекс прибыльности'), w('hurdle rate','пороговая ставка'),
        w('discount rate','ставка дисконтирования'), w('cost of capital','стоимость капитала'),
        w('free cash flow','свободный денежный поток'), w('terminal value','терминальная стоимость'),
        w('sensitivity analysis','анализ чувствительности'), w('scenario analysis','сценарный анализ'),
        w('Monte Carlo simulation','симуляция Монте-Карло'), w('real options','реальные опционы'),
        w('strategic option','стратегический опцион'), w('abandonment option','опцион на отказ'),
        w('expansion option','опцион на расширение'), w('delay option','опцион на отсрочку'),
        w('capital rationing','нормирование капитала'), w('ranking','ранжирование'),
        w('mutually exclusive project','взаимоисключающий проект'),
      ],
    },
  ],
}

// ─── Module 12 – Professional Communication (C1) ─────────────────────────────
const mod_professional_comm: MD = {
  title: 'Professional Communication', section: 'C1', lessons: [
    {
      title: 'Board Reports',
      words: [
        w('board report','отчёт совету директоров'), w('board of directors','совет директоров'),
        w('executive summary','резюме для руководства'), w('financial summary','финансовая сводка'),
        w('key highlight','ключевой показатель'), w('risk summary','сводка рисков'),
        w('strategic update','стратегическое обновление'), w('KPI dashboard','дашборд КПЭ'),
        w('budget vs actual','бюджет против факта'), w('year-to-date','с начала года'),
        w('variance commentary','комментарий к отклонениям'), w('narrative','описательная часть'),
        w('recommendation','рекомендация'), w('action required','требуемые действия'),
        w('decision','решение'), w('governance','управление'), w('minutes','протокол'),
        w('appendix','приложение'), w('confidential','конфиденциальный'),
        w('management accounts','управленческая отчётность'),
        w('financial performance','финансовые результаты'), w('outlook','прогноз'),
        w('capital expenditure','капитальные затраты'), w('headcount','численность персонала'),
        w('conclusion','заключение'),
      ],
    },
    {
      title: 'Audit Opinions',
      words: [
        w('audit opinion','аудиторское заключение'),
        w('independent auditors report','отчёт независимых аудиторов'),
        w('true and fair view','достоверное и справедливое представление'),
        w('free from material misstatement','без существенных искажений'),
        w('unmodified opinion','немодифицированное заключение'),
        w('qualified opinion','заключение с оговоркой'), w('basis for opinion','основание для мнения'),
        w('key audit matter','ключевой вопрос аудита'), w('emphasis of matter','особое обстоятельство'),
        w('going concern','непрерывность деятельности'),
        w('material uncertainty','существенная неопределённость'), w('pervasive','всеобъемлющий'),
        w('except for','за исключением'), w('adverse opinion','отрицательное заключение'),
        w('disclaimer','отказ от мнения'), w('Auditing Standards','Стандарты аудита'), w('ISA','МСА'),
        w('PCAOB','PCAOB'), w('IAASB','СМАСД'), w('engagement partner','руководящий партнёр'),
        w('firm','аудиторская фирма'), w('addressee','адресат'),
        w('annual report','годовой отчёт'), w('statutory audit','обязательный аудит'),
        w('assurance','заверение'),
      ],
    },
    {
      title: 'Presentations',
      words: [
        w('financial presentation','финансовая презентация'),
        w('executive presentation','презентация для руководства'), w('slide deck','набор слайдов'),
        w('key message','ключевое сообщение'), w('executive summary','резюме для руководства'),
        w('headline number','ключевой показатель'), w('data visualisation','визуализация данных'),
        w('chart','диаграмма'), w('graph','график'), w('table','таблица'),
        w('commentary','комментарий'), w('narrative','повествование'), w('assumption','допущение'),
        w('driver','ключевой фактор'), w('bridge chart','мостовая диаграмма'),
        w('waterfall chart','водопадная диаграмма'), w('sensitivity table','таблица чувствительности'),
        w('recommendation','рекомендация'), w('next steps','следующие шаги'),
        w('Q&A','вопросы и ответы'), w('rehearsal','репетиция'), w('timing','хронометраж'),
        w('audience','аудитория'), w('clarity','ясность'), w('impact','воздействие'),
      ],
    },
    {
      title: 'Stakeholder Letters',
      words: [
        w('stakeholder letter','письмо заинтересованным сторонам'),
        w('shareholder letter','письмо акционерам'), w('investor letter','письмо инвесторам'),
        w('creditor communication','коммуникация с кредиторами'),
        w('banking covenant letter','письмо о банковском ковенанте'),
        w('regulatory submission','регуляторное представление'), w('formal letter','официальное письмо'),
        w('heading','заголовок'), w('reference','ссылка'), w('date','дата'),
        w('salutation','приветствие'), w('opening paragraph','вступительный абзац'),
        w('body','основная часть'), w('closing paragraph','заключительный абзац'),
        w('yours faithfully','с уважением'), w('yours sincerely','искренне ваш'),
        w('signatory','подписант'), w('enclosure','приложение'), w('distribution list','список рассылки'),
        w('confidentiality','конфиденциальность'), w('disclaimer','отказ от ответственности'),
        w('legal review','юридическая проверка'), w('translation','перевод'),
        w('version control','контроль версий'), w('filing','хранение документов'),
      ],
    },
    {
      title: 'Filings',
      words: [
        w('regulatory filing','регуляторная подача'), w('Companies House','Регистрационная палата'),
        w('annual return','ежегодный отчёт'), w('confirmation statement','подтверждающее заявление'),
        w('accounts filing','подача отчётности'), w('filing deadline','срок подачи'),
        w('late filing penalty','штраф за позднюю подачу'),
        w('abbreviated accounts','сокращённая отчётность'), w('full accounts','полная отчётность'),
        w('iXBRL tagging','разметка iXBRL'), w('XBRL','XBRL'), w('digital filing','цифровая подача'),
        w('Companies Act','Закон о компаниях'), w('statutory disclosure','обязательное раскрытие'),
        w('directors report','отчёт директоров'), w('strategic report','стратегический отчёт'),
        w('auditors report','аудиторский отчёт'),
        w('small company exemption','освобождение малых компаний'),
        w('micro-entity','микропредприятие'), w('dormant company','бездействующая компания'),
        w('group filing','групповая подача'), w('subsidiary disclosure','раскрытие дочерней компании'),
        w('filing agent','агент по подаче'), w('submission reference','справочный номер подачи'),
        w('acknowledgement','подтверждение'),
      ],
    },
    {
      title: 'Ethics',
      words: [
        w('professional ethics','профессиональная этика'), w('IESBA','СМСЭБ'),
        w('fundamental principles','основные принципы'), w('integrity','честность'),
        w('objectivity','объективность'), w('professional competence','профессиональная компетентность'),
        w('due care','должная осторожность'), w('confidentiality','конфиденциальность'),
        w('professional behaviour','профессиональное поведение'), w('ethical threat','этическая угроза'),
        w('self-interest threat','угроза личной заинтересованности'),
        w('self-review threat','угроза самопроверки'), w('advocacy threat','угроза защиты интересов'),
        w('familiarity threat','угроза близкого знакомства'),
        w('intimidation threat','угроза запугивания'), w('safeguard','защитная мера'),
        w('independence','независимость'), w('conflict of interest','конфликт интересов'),
        w('whistleblowing','разоблачение нарушений'), w('money laundering','отмывание денег'),
        w('anti-bribery','противодействие взяточничеству'), w('corruption','коррупция'),
        w('disciplinary action','дисциплинарное взыскание'), w('professional body','профессиональный орган'),
        w('ethics committee','комитет по этике'),
      ],
    },
  ],
}

// ─── assembled module lists ────────────────────────────────────────────────────

const ACC_B1_MODULES: MD[] = [
  mod_financial_fundamentals,
  mod_bookkeeping,
  mod_financial_statements,
  mod_business_documents,
]

const ACC_B1C1_MODULES: MD[] = [
  mod_financial_fundamentals,
  mod_bookkeeping,
  mod_financial_statements,
  mod_business_documents,
  mod_management_accounting,
  mod_taxation,
  mod_auditing,
  mod_payroll,
  mod_financial_analysis,
  mod_ifrs,
  mod_corporate_finance,
  mod_professional_comm,
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
  console.log('🚀 ESP Accounting seed script')
  console.log('   Supabase URL:', SUPABASE_URL)

  const ALL_IDS = [ACC_B1_ID, ACC_B1C1_ID]

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

  await seedCourse(ACC_B1_ID,   ACC_B1_MODULES,   'Accounting B1')
  await seedCourse(ACC_B1C1_ID, ACC_B1C1_MODULES, 'Accounting B1-C1')

  console.log('\n🎉 Done! Accounting seeded.')
  console.log(`   Accounting B1:    ${ACC_B1_MODULES.length} modules, ${ACC_B1_MODULES.length * 6} lessons`)
  console.log(`   Accounting B1-C1: ${ACC_B1C1_MODULES.length} modules, ${ACC_B1C1_MODULES.length * 6} lessons`)
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err)
  process.exit(1)
})
