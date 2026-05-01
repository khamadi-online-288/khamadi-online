/**
 * Seed: Finance Industry B1 + Finance Industry B1-C1
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/seed-esp-finance.ts
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
const FIN_B1_ID   = '13f80caf-c0ea-4cae-bb68-225c418d6b7b'
const FIN_B1C1_ID = 'a1000000-0000-0000-0000-000000000010'

// ─── types ────────────────────────────────────────────────────────────────────
type W  = { en: string; ru: string }
type LD = { title: string; words: W[] }
type MD = { title: string; section: string; lessons: LD[] }

function w(en: string, ru: string): W { return { en, ru } }

// ─── Module 1 – Financial System (B1) ────────────────────────────────────────
const mod_financial_system: MD = {
  title: 'Financial System', section: 'B1', lessons: [
    {
      title: 'Banks & Institutions',
      words: [
        w('commercial bank','коммерческий банк'), w('investment bank','инвестиционный банк'),
        w('central bank','центральный банк'), w('credit union','кредитный союз'),
        w('savings bank','сберегательный банк'), w('building society','строительное общество'),
        w('financial institution','финансовое учреждение'), w('branch','отделение банка'),
        w('deposit','депозит'), w('withdrawal','снятие средств'), w('transaction','транзакция'),
        w('account holder','владелец счёта'), w('teller','кассир'), w('ATM','банкомат'),
        w('online banking','интернет-банкинг'), w('mobile banking','мобильный банкинг'),
        w('SWIFT code','SWIFT-код'), w('BIC','BIC'), w('sort code','сортировочный код'),
        w('account number','номер счёта'), w('IBAN','IBAN'), w('banking system','банковская система'),
        w('clearing house','расчётная палата'), w('interbank market','межбанковский рынок'),
        w('correspondent bank','банк-корреспондент'),
      ],
    },
    {
      title: 'Central Banks',
      words: [
        w('central bank','центральный банк'), w('monetary policy','денежно-кредитная политика'),
        w('interest rate','процентная ставка'), w('base rate','базовая ставка'),
        w('reserve requirement','норматив резервирования'),
        w('open market operations','операции на открытом рынке'),
        w('quantitative easing','количественное смягчение'),
        w('inflation target','цель по инфляции'),
        w('lender of last resort','кредитор последней инстанции'),
        w('currency issuance','эмиссия валюты'), w('bank supervision','банковский надзор'),
        w('financial stability','финансовая стабильность'), w('governor','управляющий'),
        w('monetary committee','денежный комитет'), w('policy meeting','заседание по политике'),
        w('rate decision','решение по ставке'), w('benchmark rate','базовая ставка эталона'),
        w('interbank rate','межбанковская ставка'), w('overnight rate','ставка овернайт'),
        w('Federal Reserve','Федеральная резервная система'),
        w('European Central Bank','Европейский центральный банк'),
        w('Bank of England','Банк Англии'), w('foreign exchange reserves','валютные резервы'),
        w('gold reserves','золотые резервы'), w('monetary transmission','денежная трансмиссия'),
      ],
    },
    {
      title: 'Financial Markets',
      words: [
        w('financial market','финансовый рынок'), w('stock market','фондовый рынок'),
        w('bond market','рынок облигаций'), w('money market','денежный рынок'),
        w('foreign exchange market','валютный рынок'), w('commodity market','товарный рынок'),
        w('primary market','первичный рынок'), w('secondary market','вторичный рынок'),
        w('capital market','рынок капитала'), w('derivatives market','рынок производных'),
        w('OTC market','внебиржевой рынок'), w('exchange-traded','биржевой'),
        w('liquidity','ликвидность'), w('market participant','участник рынка'),
        w('bid price','цена покупки'), w('ask price','цена продажи'), w('spread','спред'),
        w('volume','объём'), w('market maker','маркет-мейкер'), w('broker','брокер'),
        w('dealer','дилер'), w('clearing','клиринг'), w('settlement','расчёт'),
        w('trade execution','исполнение сделки'), w('order book','книга заявок'),
      ],
    },
    {
      title: 'Money & Currency',
      words: [
        w('currency','валюта'), w('exchange rate','обменный курс'),
        w('foreign exchange','иностранная валюта'), w('appreciation','укрепление'),
        w('depreciation','ослабление'), w('fixed exchange rate','фиксированный обменный курс'),
        w('floating exchange rate','плавающий обменный курс'), w('peg','привязка'),
        w('devaluation','девальвация'), w('revaluation','ревальвация'),
        w('money supply','денежная масса'), w('M1','М1'), w('M2','М2'),
        w('inflation','инфляция'), w('deflation','дефляция'),
        w('purchasing power','покупательная способность'), w('convertibility','конвертируемость'),
        w('reserve currency','резервная валюта'), w('fiat money','фиатные деньги'),
        w('paper money','бумажные деньги'), w('coin','монета'), w('banknote','банкнота'),
        w('monetary union','валютный союз'), w('currency risk','валютный риск'),
        w('cross rate','кросс-курс'),
      ],
    },
    {
      title: 'Interest Rates',
      words: [
        w('interest rate','процентная ставка'), w('base rate','базовая ставка'),
        w('prime rate','прайм-ставка'), w('LIBOR','LIBOR'), w('SOFR','SOFR'),
        w('fixed rate','фиксированная ставка'), w('variable rate','переменная ставка'),
        w('APR','годовая процентная ставка'), w('compound interest','сложный процент'),
        w('simple interest','простой процент'), w('nominal rate','номинальная ставка'),
        w('real rate','реальная ставка'), w('yield','доходность'), w('coupon rate','ставка купона'),
        w('discount rate','ставка дисконтирования'), w('repo rate','ставка РЕПО'),
        w('overnight rate','ставка овернайт'), w('mortgage rate','ипотечная ставка'),
        w('lending rate','ставка кредитования'), w('deposit rate','ставка депозита'),
        w('yield curve','кривая доходности'), w('inversion','инверсия кривой'),
        w('rate hike','повышение ставки'), w('rate cut','снижение ставки'),
        w('spread','спред'),
      ],
    },
    {
      title: 'Economic Indicators',
      words: [
        w('GDP','ВВП'), w('gross domestic product','валовой внутренний продукт'),
        w('inflation rate','уровень инфляции'), w('unemployment rate','уровень безработицы'),
        w('consumer price index','индекс потребительских цен'),
        w('producer price index','индекс цен производителей'),
        w('balance of trade','торговый баланс'), w('current account','счёт текущих операций'),
        w('budget deficit','бюджетный дефицит'), w('national debt','государственный долг'),
        w('economic growth','экономический рост'), w('recession','рецессия'),
        w('economic cycle','экономический цикл'), w('leading indicator','опережающий индикатор'),
        w('lagging indicator','запаздывающий индикатор'), w('PMI','индекс PMI'),
        w('retail sales','розничные продажи'), w('industrial production','промышленное производство'),
        w('consumer confidence','потребительская уверенность'), w('trade deficit','торговый дефицит'),
        w('fiscal policy','фискальная политика'), w('monetary policy','денежно-кредитная политика'),
        w('economic forecast','экономический прогноз'), w('business cycle','деловой цикл'),
        w('output gap','разрыв выпуска'),
      ],
    },
  ],
}

// ─── Module 2 – Banking Basics (B1) ──────────────────────────────────────────
const mod_banking_basics: MD = {
  title: 'Banking Basics', section: 'B1', lessons: [
    {
      title: 'Account Types',
      words: [
        w('current account','текущий счёт'), w('savings account','сберегательный счёт'),
        w('fixed deposit','срочный депозит'), w('notice account','счёт с уведомлением'),
        w('joint account','совместный счёт'), w('business account','бизнес-счёт'),
        w('offshore account','офшорный счёт'), w('overdraft facility','разрешённый овердрафт'),
        w('ISA','ISA'), w('pension account','пенсионный счёт'),
        w('money market account','счёт денежного рынка'),
        w('certificate of deposit','депозитный сертификат'), w('escrow account','счёт эскроу'),
        w('custodian account','кастодиальный счёт'), w('nominee account','номинальный счёт'),
        w('basic bank account','базовый банковский счёт'), w('premium account','премиальный счёт'),
        w('student account','студенческий счёт'), w('account features','условия счёта'),
        w('minimum balance','минимальный остаток'), w('monthly fee','ежемесячная плата'),
        w('interest rate','процентная ставка'), w('account statement','выписка по счёту'),
        w('account opening','открытие счёта'), w('account closure','закрытие счёта'),
      ],
    },
    {
      title: 'Loans & Deposits',
      words: [
        w('loan','кредит'), w('deposit','депозит'), w('mortgage','ипотека'),
        w('personal loan','потребительский кредит'), w('car loan','автокредит'),
        w('student loan','студенческий кредит'), w('home equity loan','кредит под залог жилья'),
        w('overdraft','овердрафт'), w('line of credit','кредитная линия'), w('term loan','срочный кредит'),
        w('secured loan','обеспеченный кредит'), w('unsecured loan','необеспеченный кредит'),
        w('collateral','залог'), w('guarantor','поручитель'), w('principal','основная сумма'),
        w('interest','проценты'), w('repayment','погашение'), w('maturity','срок погашения'),
        w('amortisation','амортизация кредита'), w('balloon payment','шаровой платёж'),
        w('prepayment','досрочное погашение'), w('default','дефолт'), w('arrears','задолженность'),
        w('credit score','кредитный рейтинг'), w('debt','долг'),
      ],
    },
    {
      title: 'Credit',
      words: [
        w('credit','кредит'), w('credit score','кредитный рейтинг'),
        w('credit rating','кредитный рейтинг'), w('credit limit','кредитный лимит'),
        w('credit card','кредитная карта'), w('credit history','кредитная история'),
        w('creditworthiness','кредитоспособность'), w('credit bureau','кредитное бюро'),
        w('credit report','кредитный отчёт'), w('credit check','кредитная проверка'),
        w('revolving credit','возобновляемый кредит'), w('instalment credit','рассрочка'),
        w('trade credit','торговый кредит'), w('credit risk','кредитный риск'),
        w('credit approval','одобрение кредита'), w('underwriting','андеррайтинг'),
        w('credit agreement','кредитное соглашение'), w('credit facility','кредитная линия'),
        w('credit utilisation','использование кредитного лимита'),
        w('over-limit','превышение лимита'), w('minimum payment','минимальный платёж'),
        w('credit freeze','заморозка кредита'), w('credit repair','восстановление кредита'),
        w('default','дефолт'), w('interest charge','начисление процентов'),
      ],
    },
    {
      title: 'Payments',
      words: [
        w('payment','платёж'), w('wire transfer','банковский перевод'), w('BACS','BACS'),
        w('CHAPS','CHAPS'), w('SEPA','SEPA'), w('direct debit','прямое дебетование'),
        w('standing order','постоянное поручение'), w('card payment','оплата картой'),
        w('contactless payment','бесконтактная оплата'), w('mobile payment','мобильный платёж'),
        w('cheque','чек'), w('bank draft','банковская тратта'), w('payment gateway','платёжный шлюз'),
        w('payment processor','платёжный процессор'), w('merchant','торговец'),
        w('transaction','транзакция'), w('settlement','расчёт'), w('clearing','клиринг'),
        w('payment reference','платёжный реквизит'), w('beneficiary','получатель'),
        w('payer','плательщик'), w('remittance','денежный перевод'),
        w('currency conversion','конвертация валюты'), w('payment confirmation','подтверждение платежа'),
        w('receipt','квитанция'),
      ],
    },
    {
      title: 'SWIFT',
      words: [
        w('SWIFT','SWIFT'), w('BIC','BIC'), w('SWIFT code','SWIFT-код'),
        w('message type','тип сообщения'), w('MT103','MT103'), w('MT202','MT202'),
        w('correspondent bank','банк-корреспондент'), w('nostro account','счёт ностро'),
        w('vostro account','счёт востро'), w('wire transfer','банковский перевод'),
        w('cross-border payment','трансграничный платёж'), w('IBAN','IBAN'),
        w('routing','маршрутизация'), w('financial messaging','финансовый обмен сообщениями'),
        w('secure network','защищённая сеть'), w('member bank','банк-участник'),
        w('payment instruction','платёжное поручение'), w('intermediary bank','банк-посредник'),
        w('beneficiary bank','банк получателя'), w('settlement','расчёт'),
        w('cut-off time','время окончания приёма'), w('value date','дата валютирования'),
        w('OUR charges','все расходы за счёт отправителя'),
        w('SHA charges','расходы разделяются'), w('BEN charges','расходы за счёт получателя'),
      ],
    },
    {
      title: 'Retail Banking',
      words: [
        w('retail bank','розничный банк'), w('branch','отделение'), w('ATM','банкомат'),
        w('internet banking','интернет-банкинг'), w('mobile app','мобильное приложение'),
        w('customer service','обслуживание клиентов'), w('personal banker','персональный банкир'),
        w('financial advisor','финансовый советник'), w('current account','текущий счёт'),
        w('savings','сбережения'), w('mortgage','ипотека'), w('insurance','страхование'),
        w('credit card','кредитная карта'), w('debit card','дебетовая карта'), w('PIN','PIN-код'),
        w('security','безопасность'), w('identity verification','верификация личности'),
        w('KYC','KYC'), w('statement','выписка'), w('balance inquiry','запрос баланса'),
        w('transfer','перевод'), w('bill payment','оплата счетов'),
        w('standing order','постоянное поручение'), w('loyalty scheme','программа лояльности'),
        w('bank charges','банковские комиссии'),
      ],
    },
  ],
}

// ─── Module 3 – Investment Basics (B1) ───────────────────────────────────────
const mod_investment_basics: MD = {
  title: 'Investment Basics', section: 'B1', lessons: [
    {
      title: 'Stocks',
      words: [
        w('stock','акция'), w('share','доля'), w('equity','капитал'), w('shareholder','акционер'),
        w('dividend','дивиденд'), w('capital gain','прирост капитала'), w('stock price','цена акции'),
        w('market capitalisation','рыночная капитализация'), w('P/E ratio','коэффициент P/E'),
        w('earnings per share','прибыль на акцию'), w('blue chip','голубая фишка'),
        w('growth stock','акция роста'), w('value stock','акция стоимости'),
        w('common stock','обыкновенная акция'), w('preferred stock','привилегированная акция'),
        w('IPO','IPO'), w('secondary offering','вторичное размещение'),
        w('stock split','дробление акций'), w('rights issue','выпуск прав'), w('buyback','выкуп акций'),
        w('volatility','волатильность'), w('listed company','публичная компания'),
        w('ticker symbol','тикер'), w('annual report','годовой отчёт'),
        w('shareholder meeting','собрание акционеров'),
      ],
    },
    {
      title: 'Bonds',
      words: [
        w('bond','облигация'), w('government bond','государственная облигация'),
        w('corporate bond','корпоративная облигация'), w('coupon','купон'),
        w('face value','номинальная стоимость'), w('maturity date','дата погашения'),
        w('yield','доходность'), w('yield to maturity','доходность к погашению'),
        w('duration','дюрация'), w('credit rating','кредитный рейтинг'),
        w('investment grade','инвестиционный рейтинг'), w('junk bond','мусорная облигация'),
        w('fixed income','фиксированный доход'), w('interest payment','выплата процентов'),
        w('principal','основная сумма'), w('issuer','эмитент'), w('bondholder','держатель облигаций'),
        w('callable bond','отзывная облигация'), w('convertible bond','конвертируемая облигация'),
        w('zero-coupon bond','бескупонная облигация'), w('bond price','цена облигации'),
        w('discount','дисконт'), w('premium','премия'), w('spread','спред'),
        w('default risk','риск дефолта'),
      ],
    },
    {
      title: 'Funds',
      words: [
        w('mutual fund','взаимный фонд'), w('index fund','индексный фонд'), w('ETF','ETF'),
        w('hedge fund','хедж-фонд'), w('pension fund','пенсионный фонд'),
        w('closed-end fund','закрытый фонд'), w('open-end fund','открытый фонд'),
        w('fund manager','управляющий фондом'), w('portfolio','портфель'),
        w('diversification','диверсификация'), w('NAV','СЧА'),
        w('expense ratio','коэффициент расходов'), w('management fee','комиссия за управление'),
        w('load','нагрузка'), w('no-load','без нагрузки'), w('benchmark','эталон'),
        w('performance','результативность'), w('unit trust','паевой инвестиционный фонд'),
        w('investment trust','инвестиционный траст'), w('capital growth','рост капитала'),
        w('income fund','доходный фонд'), w('balanced fund','сбалансированный фонд'),
        w('growth fund','фонд роста'), w('money market fund','фонд денежного рынка'),
        w('UCITS','UCITS'),
      ],
    },
    {
      title: 'Risk & Return',
      words: [
        w('risk','риск'), w('return','доходность'), w('expected return','ожидаемая доходность'),
        w('risk-adjusted return','доходность с поправкой на риск'), w('volatility','волатильность'),
        w('standard deviation','стандартное отклонение'), w('beta','бета'),
        w('correlation','корреляция'), w('diversification','диверсификация'),
        w('systematic risk','систематический риск'), w('unsystematic risk','несистематический риск'),
        w('market risk','рыночный риск'), w('credit risk','кредитный риск'),
        w('liquidity risk','риск ликвидности'), w('inflation risk','инфляционный риск'),
        w('currency risk','валютный риск'), w('interest rate risk','процентный риск'),
        w('risk premium','премия за риск'), w('Sharpe ratio','коэффициент Шарпа'),
        w('risk tolerance','терпимость к риску'), w('risk profile','профиль риска'),
        w('capital loss','потеря капитала'), w('downside risk','риск снижения'),
        w('upside potential','потенциал роста'), w('risk management','управление рисками'),
      ],
    },
    {
      title: 'Portfolio',
      words: [
        w('portfolio','портфель'), w('asset allocation','распределение активов'),
        w('diversification','диверсификация'), w('rebalancing','ребалансировка'),
        w('asset class','класс активов'), w('equity','акции'), w('fixed income','облигации'),
        w('cash','денежные средства'), w('alternatives','альтернативные инвестиции'),
        w('real estate','недвижимость'), w('commodities','сырьевые товары'),
        w('strategic allocation','стратегическое распределение'),
        w('tactical allocation','тактическое распределение'), w('overweight','с избыточным весом'),
        w('underweight','с недостаточным весом'), w('correlation','корреляция'),
        w('portfolio theory','теория портфеля'), w('efficient frontier','эффективная граница'),
        w('optimal portfolio','оптимальный портфель'), w('benchmark','эталон'),
        w('tracking error','ошибка слежения'), w('alpha','альфа'), w('return','доходность'),
        w('risk','риск'), w('performance review','анализ результатов'),
      ],
    },
    {
      title: 'Stock Exchange',
      words: [
        w('stock exchange','фондовая биржа'), w('NYSE','NYSE'), w('LSE','LSE'),
        w('Frankfurt Stock Exchange','Франкфуртская фондовая биржа'),
        w('Tokyo Stock Exchange','Токийская фондовая биржа'), w('listed company','листинговая компания'),
        w('delisting','делистинг'), w('market order','рыночный ордер'),
        w('limit order','лимитный ордер'), w('stop order','стоп-ордер'),
        w('market hours','торговые часы'), w('pre-market','доторговая сессия'),
        w('after-hours','постторговая сессия'), w('market index','биржевой индекс'),
        w('Dow Jones','Dow Jones'), w('S&P 500','S&P 500'), w('FTSE 100','FTSE 100'),
        w('DAX','DAX'), w('settlement','расчёт'), w('T+2','T+2'),
        w('order book','книга заявок'), w('bid','цена покупки'), w('ask','цена продажи'),
        w('spread','спред'), w('trading halt','торговая пауза'),
      ],
    },
  ],
}

// ─── Module 4 – Financial Documents (B1) ─────────────────────────────────────
const mod_financial_docs: MD = {
  title: 'Financial Documents', section: 'B1', lessons: [
    {
      title: 'Bank Statements',
      words: [
        w('bank statement','банковская выписка'), w('account number','номер счёта'),
        w('statement period','период выписки'), w('opening balance','начальный остаток'),
        w('closing balance','конечный остаток'), w('credit','кредит'), w('debit','дебет'),
        w('transaction','транзакция'), w('description','описание'), w('reference','ссылка'),
        w('date','дата'), w('interest','проценты'), w('charges','комиссии'),
        w('direct debit','прямое дебетование'), w('standing order','постоянное поручение'),
        w('salary','заработная плата'), w('payment','платёж'), w('overdraft','овердрафт'),
        w('available balance','доступный остаток'), w('sort code','сортировочный код'),
        w('IBAN','IBAN'), w('BIC','BIC'), w('reconciliation','сверка'),
        w('discrepancy','расхождение'), w('download statement','скачать выписку'),
      ],
    },
    {
      title: 'Loan Agreements',
      words: [
        w('loan agreement','кредитное соглашение'), w('parties','стороны'),
        w('principal','основная сумма'), w('interest rate','процентная ставка'),
        w('repayment schedule','график погашения'), w('maturity','срок погашения'),
        w('collateral','залог'), w('guarantee','гарантия'), w('covenants','ковенанты'),
        w('events of default','события дефолта'), w('prepayment','досрочное погашение'),
        w('late payment fee','штраф за просрочку'), w('grace period','льготный период'),
        w('drawdown','выборка средств'), w('facility','кредитная линия'), w('purpose','цель'),
        w('governing law','применимое право'), w('jurisdiction','юрисдикция'),
        w('amendment','изменение'), w('waiver','отказ от права'), w('representations','заявления'),
        w('warranties','гарантии'), w('indemnity','возмещение'), w('security','обеспечение'),
        w('subordination','субординация'),
      ],
    },
    {
      title: 'Investment Reports',
      words: [
        w('investment report','инвестиционный отчёт'), w('portfolio summary','сводка по портфелю'),
        w('asset allocation','распределение активов'), w('performance','результативность'),
        w('benchmark','эталон'), w('return','доходность'), w('gain','прибыль'), w('loss','убыток'),
        w('dividend','дивиденд'), w('income','доход'), w('capital growth','рост капитала'),
        w('valuation','оценка стоимости'), w('NAV','СЧА'), w('holdings','активы'),
        w('top positions','топ-позиции'), w('market commentary','комментарий рынка'),
        w('outlook','прогноз'), w('risk profile','профиль риска'),
        w('investment horizon','инвестиционный горизонт'), w('fees','комиссии'),
        w('net performance','чистая доходность'), w('gross performance','валовая доходность'),
        w('since inception','с момента создания'), w('YTD','с начала года'),
        w('quarterly review','квартальный обзор'),
      ],
    },
    {
      title: 'Prospectus',
      words: [
        w('prospectus','проспект'), w('offering document','эмиссионный документ'),
        w('issuer','эмитент'), w('securities','ценные бумаги'),
        w('investment objective','инвестиционная цель'), w('risk factors','факторы риска'),
        w('financial information','финансовая информация'), w('management team','команда менеджмента'),
        w('use of proceeds','использование поступлений'), w('underwriter','андеррайтер'),
        w('subscription','подписка'), w('minimum investment','минимальные инвестиции'),
        w('lock-up period','период ограничений'), w('redemption','погашение'),
        w('liquidity','ликвидность'), w('regulatory approval','регуляторное одобрение'),
        w('SEC filing','подача в SEC'), w('listing','листинг'), w('due diligence','дью-дилидженс'),
        w('disclosure','раскрытие информации'), w('material information','существенная информация'),
        w('forward-looking statements','прогнозные заявления'), w('disclaimer','отказ от ответственности'),
        w('legal notice','юридическое уведомление'), w('summary','резюме'),
      ],
    },
    {
      title: 'Term Sheets',
      words: [
        w('term sheet','лист условий'), w('indicative terms','ориентировочные условия'),
        w('parties','стороны'), w('transaction type','тип сделки'), w('deal size','размер сделки'),
        w('pricing','ценообразование'), w('interest rate','процентная ставка'), w('tenor','срок'),
        w('security','обеспечение'), w('covenants','ковенанты'),
        w('conditions precedent','предварительные условия'), w('closing date','дата закрытия'),
        w('exclusivity','эксклюзивность'), w('confidentiality','конфиденциальность'),
        w('break fee','плата за расторжение'), w('governing law','применимое право'),
        w('non-binding','необязательный'), w('heads of terms','основные условия'),
        w('letter of intent','письмо о намерениях'), w('LOI','LOI'),
        w('key terms','ключевые условия'), w('economics','экономика сделки'),
        w('timeline','временные рамки'), w('approval','одобрение'), w('signature','подпись'),
      ],
    },
    {
      title: 'Correspondence',
      words: [
        w('cover letter','сопроводительное письмо'), w('formal email','официальное электронное письмо'),
        w('subject','тема'), w('salutation','приветствие'), w('introduction','введение'),
        w('body','основная часть'), w('conclusion','заключение'), w('signature','подпись'),
        w('attachment','вложение'), w('reference','ссылка'), w('follow-up','последующее письмо'),
        w('acknowledgement','подтверждение'), w('instruction','инструкция'),
        w('confirmation','подтверждение'), w('amendment','изменение'), w('dispute','спор'),
        w('complaint','жалоба'), w('resolution','разрешение'), w('professional tone','деловой тон'),
        w('Dear Sir/Madam','Уважаемый/ая'), w('yours faithfully','с уважением'),
        w('yours sincerely','искренне ваш'), w('cc','копия'), w('bcc','скрытая копия'),
        w('confidential','конфиденциально'),
      ],
    },
  ],
}

// ─── Module 5 – Financial Markets (B2) ───────────────────────────────────────
const mod_financial_markets: MD = {
  title: 'Financial Markets', section: 'B2', lessons: [
    {
      title: 'Equities',
      words: [
        w('equity','акция'), w('stock','акция'), w('share','доля'),
        w('market capitalisation','рыночная капитализация'), w('price-to-earnings','коэффициент P/E'),
        w('earnings per share','прибыль на акцию'), w('dividend yield','дивидендная доходность'),
        w('return on equity','рентабельность капитала'), w('book value','балансовая стоимость'),
        w('growth stock','акция роста'), w('value stock','акция стоимости'),
        w('cyclical stock','цикличная акция'), w('defensive stock','защитная акция'),
        w('sector rotation','ротация секторов'), w('market sentiment','настроение рынка'),
        w('analyst rating','рейтинг аналитика'), w('buy/sell/hold','покупать/продавать/держать'),
        w('target price','целевая цена'), w('consensus estimate','консенсус-прогноз'),
        w('earnings surprise','сюрприз прибыли'), w('short selling','короткая продажа'),
        w('margin trading','маржинальная торговля'), w('share buyback','обратный выкуп акций'),
        w('rights issue','выпуск прав'), w('secondary offering','вторичное предложение'),
      ],
    },
    {
      title: 'Fixed Income',
      words: [
        w('fixed income','фиксированный доход'), w('bond','облигация'), w('yield','доходность'),
        w('duration','дюрация'), w('convexity','выпуклость'), w('spread','спред'),
        w('credit spread','кредитный спред'), w('investment grade','инвестиционный рейтинг'),
        w('high yield','высокая доходность'), w('sovereign bond','государственная облигация'),
        w('corporate bond','корпоративная облигация'), w('coupon','купон'),
        w('accrued interest','начисленные проценты'), w('yield to maturity','доходность к погашению'),
        w('yield curve','кривая доходности'), w('flat curve','плоская кривая'),
        w('steep curve','крутая кривая'), w('inverted curve','инвертированная кривая'),
        w('credit default swap','кредитный дефолтный своп'), w('CDS','CDS'),
        w('callable bond','отзывная облигация'), w('putable bond','облигация с правом досрочного погашения'),
        w('convertible bond','конвертируемая облигация'), w('TIPS','TIPS'),
        w('inflation-linked bond','инфляционно-привязанная облигация'),
      ],
    },
    {
      title: 'Derivatives',
      words: [
        w('derivative','производный инструмент'), w('option','опцион'), w('futures','фьючерс'),
        w('forward','форвард'), w('swap','своп'), w('call option','колл-опцион'),
        w('put option','пут-опцион'), w('strike price','цена исполнения'),
        w('expiry','дата экспирации'), w('premium','премия'), w('underlying asset','базовый актив'),
        w('hedge','хедж'), w('speculation','спекуляция'), w('leverage','кредитное плечо'),
        w('OTC derivative','внебиржевой производный инструмент'),
        w('exchange-traded derivative','биржевой производный инструмент'),
        w('delta','дельта'), w('gamma','гамма'), w('vega','вега'), w('theta','тета'),
        w('rho','ро'), w('intrinsic value','внутренняя стоимость'),
        w('time value','временная стоимость'), w('margin','маржа'), w('clearinghouse','клиринговый дом'),
      ],
    },
    {
      title: 'Forex',
      words: [
        w('foreign exchange','иностранная валюта'), w('forex','форекс'),
        w('currency pair','валютная пара'), w('base currency','базовая валюта'),
        w('quote currency','котируемая валюта'), w('exchange rate','обменный курс'),
        w('pip','пип'), w('spread','спред'), w('lot','лот'), w('leverage','кредитное плечо'),
        w('margin','маржа'), w('spot rate','спот-курс'), w('forward rate','форвардный курс'),
        w('swap point','своп-пункт'), w('carry trade','кэрри-трейд'),
        w('currency intervention','валютная интервенция'), w('reserve currency','резервная валюта'),
        w('USD','USD'), w('EUR','EUR'), w('GBP','GBP'), w('JPY','JPY'),
        w('safe haven','безопасная гавань'), w('volatility','волатильность'),
        w('liquidity','ликвидность'), w('interbank market','межбанковский рынок'),
      ],
    },
    {
      title: 'Commodities',
      words: [
        w('commodity','товар'), w('spot market','спотовый рынок'), w('futures market','фьючерсный рынок'),
        w('gold','золото'), w('silver','серебро'), w('oil','нефть'), w('natural gas','природный газ'),
        w('agricultural commodity','сельскохозяйственный товар'),
        w('soft commodity','мягкий товар'), w('hard commodity','твёрдый товар'),
        w('commodity index','товарный индекс'), w('contango','контанго'),
        w('backwardation','бэквардация'), w('commodity ETF','товарный ETF'),
        w('producer','производитель'), w('consumer','потребитель'), w('hedger','хеджер'),
        w('speculator','спекулянт'), w('warehouse receipt','складская квитанция'),
        w('delivery','поставка'), w('benchmark','эталон'), w('Brent crude','нефть Brent'),
        w('WTI','WTI'), w('CBOT','CBOT'), w('LME','LME'),
      ],
    },
    {
      title: 'Market Indices',
      words: [
        w('market index','рыночный индекс'), w('stock index','фондовый индекс'),
        w('Dow Jones','Dow Jones'), w('S&P 500','S&P 500'), w('NASDAQ','NASDAQ'),
        w('FTSE 100','FTSE 100'), w('DAX','DAX'), w('Nikkei','Nikkei'), w('Hang Seng','Hang Seng'),
        w('MSCI World','MSCI World'), w('price-weighted','взвешенный по цене'),
        w('market-cap weighted','взвешенный по капитализации'), w('equal-weighted','равновзвешенный'),
        w('index constituent','компонент индекса'), w('rebalancing','ребалансировка'),
        w('index fund','индексный фонд'), w('ETF','ETF'), w('tracker','трекер'),
        w('benchmark','эталон'), w('passive investing','пассивное инвестирование'),
        w('active investing','активное инвестирование'), w('index provider','провайдер индекса'),
        w('MSCI','MSCI'), w('FTSE Russell','FTSE Russell'), w('S&P Dow Jones','S&P Dow Jones'),
      ],
    },
  ],
}

// ─── Module 6 – Corporate Finance (B2) ───────────────────────────────────────
const mod_corp_finance: MD = {
  title: 'Corporate Finance', section: 'B2', lessons: [
    {
      title: 'Capital Structure',
      words: [
        w('capital structure','структура капитала'), w('equity','собственный капитал'),
        w('debt','заёмный капитал'), w('leverage','финансовый рычаг'), w('gearing','заёмный капитал'),
        w('WACC','WACC'), w('cost of equity','стоимость собственного капитала'),
        w('cost of debt','стоимость долга'), w('capital markets','рынки капитала'),
        w('credit rating','кредитный рейтинг'), w('financial flexibility','финансовая гибкость'),
        w('tax shield','налоговый щит'), w('Modigliani-Miller','Модильяни-Миллер'),
        w('pecking order','теория иерархии'), w('trade-off theory','теория компромисса'),
        w('market timing','рыночный тайминг'), w('debt capacity','долговая ёмкость'),
        w('covenant','ковенант'), w('recapitalisation','рекапитализация'),
        w('equity dilution','разводнение капитала'), w('credit spread','кредитный спред'),
        w('refinancing','рефинансирование'), w('subordinated debt','субординированный долг'),
        w('hybrid instrument','гибридный инструмент'), w('optimal structure','оптимальная структура'),
      ],
    },
    {
      title: 'IPO',
      words: [
        w('IPO','IPO'), w('initial public offering','первичное публичное предложение'),
        w('listing','листинг'), w('stock exchange','фондовая биржа'), w('underwriter','андеррайтер'),
        w('bookbuilding','букбилдинг'), w('price range','ценовой диапазон'), w('roadshow','роудшоу'),
        w('institutional investor','институциональный инвестор'),
        w('retail investor','розничный инвестор'), w('prospectus','проспект'),
        w('lock-up period','период ограничений'), w('quiet period','период молчания'),
        w('greenshoe','зелёный башмак'), w('overallotment','сверхприсвоение'),
        w('stabilisation','стабилизация'), w('first day trading','первый день торгов'),
        w('aftermarket','вторичный рынок'), w('listing requirements','требования к листингу'),
        w('sponsor','спонсор'), w('lead manager','ведущий менеджер'), w('syndicate','синдикат'),
        w('allocation','аллокация'), w('subscription','подписка'), w('valuation','оценка'),
      ],
    },
    {
      title: 'M&A',
      words: [
        w('merger','слияние'), w('acquisition','поглощение'), w('target','цель'),
        w('acquirer','поглощающая компания'), w('synergy','синергия'), w('due diligence','дью-дилидженс'),
        w('valuation','оценка'), w('offer premium','премия предложения'), w('takeover','поглощение'),
        w('hostile bid','враждебная оферта'), w('friendly acquisition','дружественное поглощение'),
        w('scheme of arrangement','схема реорганизации'),
        w('merger agreement','соглашение о слиянии'), w('regulatory approval','регуляторное одобрение'),
        w('antitrust','антимонопольный'), w('competition authority','антимонопольный орган'),
        w('earnout','отложенное вознаграждение'), w('consideration','вознаграждение'),
        w('all-cash deal','сделка за наличные'), w('all-share deal','сделка за акции'),
        w('strategic buyer','стратегический покупатель'), w('financial buyer','финансовый покупатель'),
        w('integration','интеграция'), w('post-merger','после слияния'), w('break fee','плата за расторжение'),
      ],
    },
    {
      title: 'Dividends',
      words: [
        w('dividend','дивиденд'), w('ordinary dividend','обычный дивиденд'),
        w('special dividend','специальный дивиденд'), w('interim dividend','промежуточный дивиденд'),
        w('final dividend','окончательный дивиденд'), w('dividend policy','дивидендная политика'),
        w('payout ratio','коэффициент выплат'), w('dividend yield','дивидендная доходность'),
        w('dividend cover','покрытие дивидендов'), w('DPS','дивиденд на акцию'), w('EPS','EPS'),
        w('scrip dividend','дивиденд акциями'), w('DRIP','DRIP'),
        w('ex-dividend date','дата отсечения'), w('record date','дата записи'),
        w('payment date','дата выплаты'), w('progressive dividend','прогрессивный дивиденд'),
        w('stable dividend','стабильный дивиденд'), w('residual dividend','остаточный дивиденд'),
        w('signalling','сигнализирование'), w('share buyback','обратный выкуп акций'),
        w('capital return','возврат капитала'), w('tax treatment','налогообложение'),
        w('retained earnings','нераспределённая прибыль'), w('dividend irrelevance','нерелевантность дивидендов'),
      ],
    },
    {
      title: 'WACC',
      words: [
        w('WACC','WACC'), w('weighted average cost of capital','средневзвешенная стоимость капитала'),
        w('cost of equity','стоимость собственного капитала'), w('cost of debt','стоимость долга'),
        w('CAPM','CAPM'), w('beta','бета'), w('risk-free rate','безрисковая ставка'),
        w('equity risk premium','премия за риск капитала'), w('systematic risk','систематический риск'),
        w('levered beta','левереджированная бета'), w('unlevered beta','нелевереджированная бета'),
        w('capital structure','структура капитала'), w('market value weights','веса рыночной стоимости'),
        w('tax shield','налоговый щит'), w('marginal cost','предельная стоимость'),
        w('hurdle rate','пороговая ставка'), w('project evaluation','оценка проекта'),
        w('NPV','ЧПС'), w('IRR','ВНД'), w('discount rate','ставка дисконтирования'),
        w('terminal value','терминальная стоимость'), w('DCF','ДДП'),
        w('investment decision','инвестиционное решение'),
        w('cost of preference shares','стоимость привилегированных акций'),
        w('hybrid','гибридный инструмент'),
      ],
    },
    {
      title: 'Leveraged Buyouts',
      words: [
        w('LBO','LBO'), w('leveraged buyout','выкуп с привлечением заёмных средств'),
        w('private equity','частный акционерный капитал'), w('target','целевая компания'),
        w('acquisition','поглощение'), w('leverage','кредитное плечо'),
        w('senior debt','старший долг'), w('mezzanine','мезонинное финансирование'),
        w('equity','акционерный капитал'), w('sponsor','спонсор'),
        w('management team','команда менеджмента'), w('EBITDA','EBITDA'),
        w('debt-to-EBITDA','долг к EBITDA'), w('free cash flow','свободный денежный поток'),
        w('debt repayment','погашение долга'), w('exit','выход'), w('IPO exit','выход через IPO'),
        w('trade sale','продажа стратегическому инвестору'),
        w('secondary buyout','вторичный выкуп'), w('returns','доходность'), w('IRR','ВНД'),
        w('multiple','мультипликатор'), w('entry multiple','входной мультипликатор'),
        w('exit multiple','выходной мультипликатор'), w('value creation','создание стоимости'),
      ],
    },
  ],
}

// ─── Module 7 – Risk Management (B2) ─────────────────────────────────────────
const mod_risk_management: MD = {
  title: 'Risk Management', section: 'B2', lessons: [
    {
      title: 'Market Risk',
      words: [
        w('market risk','рыночный риск'), w('equity risk','риск акционерного капитала'),
        w('interest rate risk','процентный риск'), w('currency risk','валютный риск'),
        w('commodity risk','товарный риск'), w('volatility','волатильность'), w('VaR','VaR'),
        w('expected shortfall','ожидаемые потери'), w('stress test','стресс-тест'),
        w('scenario analysis','сценарный анализ'), w('mark-to-market','переоценка по рынку'),
        w('P&L','прибыли и убытки'), w('delta','дельта'), w('gamma','гамма'),
        w('sensitivity','чувствительность'), w('hedging','хеджирование'),
        w('natural hedge','натуральный хедж'), w('portfolio risk','риск портфеля'),
        w('diversification','диверсификация'), w('correlation','корреляция'),
        w('risk limits','лимиты риска'), w('stop-loss','стоп-лосс'),
        w('position limit','лимит позиции'), w('risk reporting','отчётность по рискам'),
        w('trading book','торговая книга'),
      ],
    },
    {
      title: 'Credit Risk',
      words: [
        w('credit risk','кредитный риск'), w('default','дефолт'),
        w('probability of default','вероятность дефолта'), w('loss given default','убыток при дефолте'),
        w('exposure at default','подверженность при дефолте'),
        w('expected loss','ожидаемые потери'), w('unexpected loss','непредвиденные потери'),
        w('credit rating','кредитный рейтинг'), w('credit score','кредитный рейтинг'),
        w('credit assessment','кредитная оценка'), w('counterparty risk','риск контрагента'),
        w('concentration risk','концентрационный риск'), w('credit portfolio','кредитный портфель'),
        w('credit exposure','кредитная подверженность'), w('netting','взаимозачёт'),
        w('collateral','залог'), w('credit support annex','приложение о кредитной поддержке'),
        w('ISDA','ISDA'), w('credit derivative','кредитный дериватив'), w('CDS','CDS'),
        w('credit VaR','кредитный VaR'), w('Basel','Базель'), w('credit mitigation','снижение кредитного риска'),
        w('guarantee','гарантия'), w('credit insurance','кредитное страхование'),
      ],
    },
    {
      title: 'Operational Risk',
      words: [
        w('operational risk','операционный риск'), w('process failure','сбой процесса'),
        w('system failure','сбой системы'), w('people risk','риск персонала'),
        w('external event','внешнее событие'), w('fraud','мошенничество'),
        w('cyber risk','киберриск'), w('data breach','утечка данных'), w('model risk','модельный риск'),
        w('legal risk','правовой риск'), w('compliance risk','риск соблюдения'),
        w('reputational risk','репутационный риск'), w('key risk indicator','ключевой индикатор риска'),
        w('RCSA','RCSA'), w('loss event','событие потерь'), w('near miss','почти инцидент'),
        w('incident reporting','отчётность об инцидентах'),
        w('business continuity','непрерывность бизнеса'), w('disaster recovery','восстановление после сбоев'),
        w('risk culture','культура риска'), w('operational resilience','операционная устойчивость'),
        w('outsourcing risk','риск аутсорсинга'), w('third-party risk','риск третьих сторон'),
        w('Basel II','Базель II'), w('risk appetite','аппетит к риску'),
      ],
    },
    {
      title: 'Hedging',
      words: [
        w('hedge','хедж'), w('hedging strategy','стратегия хеджирования'),
        w('natural hedge','натуральный хедж'), w('financial hedge','финансовый хедж'),
        w('forward contract','форвардный контракт'), w('futures contract','фьючерсный контракт'),
        w('option','опцион'), w('swap','своп'), w('interest rate swap','процентный своп'),
        w('currency swap','валютный своп'), w('cross-currency swap','кросс-валютный своп'),
        w('basis risk','базисный риск'), w('hedge ratio','коэффициент хеджирования'),
        w('hedge effectiveness','эффективность хеджирования'),
        w('accounting hedge','учётный хедж'), w('fair value hedge','хедж справедливой стоимости'),
        w('cash flow hedge','хедж денежного потока'),
        w('net investment hedge','хедж чистых инвестиций'), w('economic hedge','экономический хедж'),
        w('delta hedge','дельта-хедж'), w('portfolio hedge','портфельный хедж'),
        w('macro hedge','макрохедж'), w('micro hedge','микрохедж'),
        w('hedge fund','хедж-фонд'), w('cost of hedging','стоимость хеджирования'),
      ],
    },
    {
      title: 'VaR',
      words: [
        w('VaR','VaR'), w('value at risk','стоимость под риском'),
        w('historical simulation','историческое моделирование'),
        w('parametric VaR','параметрический VaR'), w('Monte Carlo simulation','симуляция Монте-Карло'),
        w('confidence level','уровень доверия'), w('holding period','период удержания'),
        w('expected shortfall','ожидаемые потери'), w('CVaR','CVaR'), w('tail risk','хвостовой риск'),
        w('one-day VaR','однодневный VaR'), w('ten-day VaR','десятидневный VaR'),
        w('99% confidence','99% уровень доверия'), w('95% confidence','95% уровень доверия'),
        w('risk horizon','горизонт риска'), w('backtesting','бэктестинг'),
        w('model validation','валидация модели'), w('regulatory VaR','регуляторный VaR'),
        w('internal model','внутренняя модель'), w('standardised approach','стандартизированный подход'),
        w('market risk capital','капитал под рыночный риск'),
        w('stress VaR','стрессовый VaR'), w('incremental risk charge','плата за дополнительный риск'),
        w('stressed scenario','стрессовый сценарий'), w('risk limit','лимит риска'),
      ],
    },
    {
      title: 'Stress Testing',
      words: [
        w('stress test','стресс-тест'), w('scenario analysis','сценарный анализ'),
        w('adverse scenario','неблагоприятный сценарий'), w('severe scenario','жёсткий сценарий'),
        w('baseline scenario','базовый сценарий'), w('macro stress test','макрострессовый тест'),
        w('regulatory stress test','регуляторный стресс-тест'),
        w('supervisory review','надзорный обзор'), w('EBA','EBA'),
        w('Federal Reserve','Федеральная резервная система'), w('DFAST','DFAST'), w('CCAR','CCAR'),
        w('capital adequacy','достаточность капитала'), w('loss projection','прогноз потерь'),
        w('revenue impact','влияние на доходы'), w('RWA','RWA'),
        w('capital ratio','коэффициент капитала'), w('CET1','CET1'), w('Tier 1','Tier 1'),
        w('stress buffer','стрессовый буфер'), w('recovery planning','планирование восстановления'),
        w('reverse stress test','обратный стресс-тест'),
        w('internal stress test','внутренний стресс-тест'), w('liquidity stress','стресс ликвидности'),
        w('sensitivity analysis','анализ чувствительности'),
      ],
    },
  ],
}

// ─── Module 8 – Financial Analysis (B2) ──────────────────────────────────────
const mod_financial_analysis: MD = {
  title: 'Financial Analysis', section: 'B2', lessons: [
    {
      title: 'DCF',
      words: [
        w('discounted cash flow','дисконтированный денежный поток'), w('DCF','ДДП'),
        w('free cash flow','свободный денежный поток'), w('FCFF','FCFF'), w('FCFE','FCFE'),
        w('terminal value','терминальная стоимость'), w('discount rate','ставка дисконтирования'),
        w('WACC','WACC'), w('cost of equity','стоимость собственного капитала'),
        w('net present value','чистая приведённая стоимость'),
        w('enterprise value','стоимость предприятия'), w('equity value','стоимость капитала'),
        w('net debt','чистый долг'), w('sensitivity analysis','анализ чувствительности'),
        w('scenario analysis','сценарный анализ'), w('growth rate','темп роста'),
        w('perpetuity growth model','модель вечного роста'),
        w('exit multiple','выходной мультипликатор'), w('equity bridge','мост к стоимости капитала'),
        w('minority interest','неконтролирующая доля'), w('diluted shares','разводнённые акции'),
        w('implied share price','подразумеваемая цена акции'), w('football field','диаграмма диапазонов'),
        w('bridge','мост'), w('TV/EV ratio','соотношение TV/EV'),
      ],
    },
    {
      title: 'Ratio Analysis',
      words: [
        w('financial ratio','финансовый коэффициент'), w('liquidity ratio','коэффициент ликвидности'),
        w('current ratio','коэффициент текущей ликвидности'),
        w('quick ratio','коэффициент быстрой ликвидности'),
        w('profitability ratio','коэффициент рентабельности'),
        w('gross margin','маржа валовой прибыли'), w('EBIT margin','маржа EBIT'),
        w('EBITDA margin','маржа EBITDA'), w('return on equity','рентабельность капитала'),
        w('return on assets','рентабельность активов'),
        w('return on capital employed','рентабельность задействованного капитала'),
        w('efficiency ratio','коэффициент эффективности'), w('asset turnover','оборачиваемость активов'),
        w('receivables days','дни дебиторской задолженности'),
        w('payables days','дни кредиторской задолженности'), w('inventory days','дни запасов'),
        w('leverage ratio','коэффициент левериджа'), w('debt-to-equity','долг к капиталу'),
        w('interest cover','покрытие процентов'), w('net debt/EBITDA','чистый долг/EBITDA'),
        w('price-earnings','коэффициент цена/прибыль'), w('EV/EBITDA','EV/EBITDA'),
        w('dividend yield','дивидендная доходность'),
        w('book value per share','балансовая стоимость на акцию'), w('earnings per share','EPS'),
      ],
    },
    {
      title: 'Forecasting',
      words: [
        w('revenue forecast','прогноз выручки'), w('cost forecast','прогноз затрат'),
        w('EBITDA forecast','прогноз EBITDA'), w('free cash flow forecast','прогноз СДП'),
        w('working capital','оборотный капитал'), w('capex','капитальные затраты'),
        w('depreciation','амортизация'), w('amortisation','амортизация НМА'),
        w('revenue driver','драйвер выручки'), w('cost driver','драйвер затрат'),
        w('growth assumption','допущение роста'), w('margin assumption','допущение маржи'),
        w('sensitivity table','таблица чувствительности'), w('scenario','сценарий'),
        w('base case','базовый сценарий'), w('bull case','оптимистичный сценарий'),
        w('bear case','пессимистичный сценарий'), w('consensus estimate','консенсус-прогноз'),
        w('top-down','сверху вниз'), w('bottom-up','снизу вверх'), w('seasonality','сезонность'),
        w('cyclicality','цикличность'), w('one-time item','разовая статья'),
        w('run rate','аннуализированный показатель'), w('normalisation','нормализация'),
      ],
    },
    {
      title: 'Valuation Models',
      words: [
        w('valuation','оценка'), w('DCF','ДДП'), w('comparable companies','компании-аналоги'),
        w('precedent transactions','прецедентные сделки'), w('sum-of-parts','сумма частей'),
        w('LBO analysis','LBO-анализ'), w('DDM','DDM'), w('dividend discount model','модель дисконтирования дивидендов'),
        w('asset-based valuation','оценка на основе активов'),
        w('liquidation value','ликвидационная стоимость'), w('book value','балансовая стоимость'),
        w('replacement cost','стоимость замещения'), w('enterprise value','стоимость предприятия'),
        w('equity value','стоимость капитала'), w('bridge','мост'),
        w('control premium','премия за контроль'), w('minority discount','дисконт меньшинства'),
        w('liquidity discount','дисконт за ликвидность'), w('DLOM','DLOM'),
        w('synergy value','стоимость синергии'), w('standalone value','автономная стоимость'),
        w('intrinsic value','внутренняя стоимость'), w('market value','рыночная стоимость'),
        w('EV/EBITDA','EV/EBITDA'), w('EV/Revenue','EV/Revenue'),
      ],
    },
    {
      title: 'Comparable Companies',
      words: [
        w('comparable companies','компании-аналоги'), w('comps','компы'),
        w('peer group','группа аналогов'), w('selection criteria','критерии отбора'),
        w('EV/EBITDA','EV/EBITDA'), w('EV/EBIT','EV/EBIT'), w('EV/Revenue','EV/Revenue'),
        w('P/E ratio','коэффициент P/E'), w('P/B ratio','коэффициент цена/балансовая стоимость'),
        w('EV/FCF','EV/FCF'), w('enterprise value','стоимость предприятия'),
        w('market cap','рыночная капитализация'), w('net debt','чистый долг'),
        w('minority interest','неконтролирующая доля'), w('associate','ассоциированная компания'),
        w('preferred equity','привилегированный капитал'), w('options dilution','разводнение опционами'),
        w('LTM','последние 12 месяцев'), w('NTM','следующие 12 месяцев'),
        w('median','медиана'), w('mean','среднее'), w('quartile','квартиль'),
        w('premium/discount','премия/дисконт'), w('benchmark','эталон'),
        w('trading multiples','рыночные мультипликаторы'),
      ],
    },
    {
      title: 'KPIs',
      words: [
        w('KPI','КПЭ'), w('revenue','выручка'), w('EBITDA','EBITDA'), w('EBIT','EBIT'),
        w('net income','чистая прибыль'), w('EPS','EPS'), w('DPS','дивиденд на акцию'),
        w('free cash flow','свободный денежный поток'), w('capex','капитальные затраты'),
        w('working capital','оборотный капитал'), w('net debt','чистый долг'),
        w('gross margin','маржа валовой прибыли'), w('EBITDA margin','маржа EBITDA'),
        w('revenue growth','рост выручки'), w('EPS growth','рост EPS'),
        w('ROCE','ROCE'), w('ROE','ROE'), w('ROA','ROA'),
        w('dividend yield','дивидендная доходность'), w('payout ratio','коэффициент выплат'),
        w('total shareholder return','общая доходность для акционеров'),
        w('operating leverage','операционный рычаг'), w('financial leverage','финансовый рычаг'),
        w('net debt/EBITDA','чистый долг/EBITDA'), w('interest cover','покрытие процентов'),
      ],
    },
  ],
}

// ─── Module 9 – Investment Banking (C1) ──────────────────────────────────────
const mod_investment_banking: MD = {
  title: 'Investment Banking', section: 'C1', lessons: [
    {
      title: 'Deal Structuring',
      words: [
        w('deal structure','структура сделки'), w('transaction','транзакция'), w('M&A','M&A'),
        w('capital raise','привлечение капитала'), w('equity','акционерный капитал'),
        w('debt','долг'), w('hybrid','гибридный инструмент'), w('consideration','вознаграждение'),
        w('all-cash','полностью за наличные'), w('all-share','полностью за акции'),
        w('earn-out','отложенное вознаграждение'), w('deferred payment','отложенный платёж'),
        w('minority stake','миноритарный пакет'), w('majority stake','контрольный пакет'),
        w('control','контроль'), w('structuring','структурирование'), w('tax efficiency','налоговая эффективность'),
        w('regulatory approval','регуляторное одобрение'), w('financing condition','условие финансирования'),
        w('MAC clause','оговорка о существенных изменениях'),
        w('locked box','закрытый ящик'), w('completion accounts','счета завершения'),
        w('price adjustment','корректировка цены'), w('representations','заявления'),
        w('warranties','гарантии'),
      ],
    },
    {
      title: 'Due Diligence',
      words: [
        w('due diligence','дью-дилидженс'), w('financial due diligence','финансовый ДД'),
        w('commercial due diligence','коммерческий ДД'), w('legal due diligence','юридический ДД'),
        w('operational due diligence','операционный ДД'), w('data room','комната данных'),
        w('virtual data room','виртуальная комната данных'),
        w('management presentation','презентация менеджмента'), w('Q&A process','процесс Q&A'),
        w('red flag','красный флаг'), w('quality of earnings','качество прибыли'),
        w('normalisation','нормализация'), w('working capital','оборотный капитал'),
        w('debt-like items','долгоподобные статьи'), w('cash-like items','кэшоподобные статьи'),
        w('contingent liability','условное обязательство'), w('off-balance sheet','за балансом'),
        w('tax exposure','налоговый риск'), w('environmental liability','экологическая ответственность'),
        w('legal exposure','правовой риск'), w('IT risk','IT-риск'), w('HR risk','HR-риск'),
        w('vendor due diligence','ДД продавца'), w('confirmatory due diligence','подтверждающий ДД'),
        w('scope','охват'),
      ],
    },
    {
      title: 'Syndication',
      words: [
        w('syndication','синдикация'), w('loan syndication','синдикация кредита'),
        w('bond syndication','синдикация облигаций'), w('arranging bank','организующий банк'),
        w('underwriter','андеррайтер'), w('bookrunner','букраннер'),
        w('lead manager','ведущий менеджер'), w('co-manager','со-менеджер'),
        w('syndicate','синдикат'), w('allocation','аллокация'), w('book building','букбилдинг'),
        w('oversubscription','переподписка'), w('scaling','скейлинг'),
        w('institutional investor','институциональный инвестор'),
        w('anchor investor','якорный инвестор'), w('roadshow','роудшоу'),
        w('investor presentation','презентация для инвесторов'), w('NDR','NDR'),
        w('post-deal trading','торговля после сделки'), w('secondary market','вторичный рынок'),
        w('spread','спред'), w('OID','OID'), w('PIK','PIK'), w('toggle','переключатель'),
        w('unitranche','юнитранш'),
      ],
    },
    {
      title: 'Underwriting',
      words: [
        w('underwriting','андеррайтинг'), w('firm commitment','твёрдые обязательства'),
        w('best efforts','наилучшие усилия'), w('standby underwriting','резервный андеррайтинг'),
        w('underwriter','андеррайтер'), w('investment bank','инвестиционный банк'),
        w('syndicate','синдикат'), w('underwriting fee','комиссия за андеррайтинг'),
        w('gross spread','валовой спред'), w('manager fee','комиссия менеджера'),
        w('selling concession','комиссия за продажу'), w('reallowance','разрешение на реаллокацию'),
        w('tombstone','надгробие'), w('mandate','мандат'), w('engagement letter','письмо об участии'),
        w('underwriting agreement','соглашение об андеррайтинге'), w('lock-up','период ограничений'),
        w('stabilisation','стабилизация'), w('greenshoe option','опцион "зелёный башмак"'),
        w('overallotment','сверхраспределение'), w('short covering','покрытие коротких позиций'),
        w('aftermarket','послерыночный период'), w('price support','поддержка цены'),
        w('book runner','букраннер'), w('lead left','ведущий менеджер слева'),
      ],
    },
    {
      title: 'Advisory',
      words: [
        w('M&A advisory','консультирование по M&A'), w('buy-side advisory','консультирование покупателя'),
        w('sell-side advisory','консультирование продавца'), w('fairness opinion','заключение о справедливости'),
        w('valuation','оценка'), w('strategic options','стратегические варианты'),
        w('process management','управление процессом'), w('transaction timeline','временная шкала'),
        w('NDA','NDA'), w('process letter','процессное письмо'),
        w('management presentation','презентация менеджмента'), w('data room','комната данных'),
        w('bid','заявка'), w('offer','предложение'), w('negotiation','переговоры'),
        w('exclusivity','эксклюзивность'), w('signing','подписание'), w('closing','закрытие'),
        w('fee','комиссия'), w('success fee','комиссия за успех'), w('retainer','ретейнер'),
        w('break fee','плата за расторжение'), w('engagement letter','письмо об участии'),
        w('conflict of interest','конфликт интересов'), w('Chinese wall','китайская стена'),
      ],
    },
    {
      title: 'Pitchbooks',
      words: [
        w('pitchbook','питчбук'), w('investment banking presentation','презентация инвестиционного банка'),
        w('credentials','учётные данные'), w('league table','таблица лиги'),
        w('deal experience','опыт сделок'), w('market overview','обзор рынка'),
        w('sector trends','отраслевые тенденции'), w('valuation analysis','анализ оценки'),
        w('transaction structure','структура транзакции'), w('strategic rationale','стратегическое обоснование'),
        w('synergies','синергии'), w('comparable transactions','сопоставимые сделки'),
        w('process overview','обзор процесса'), w('indicative timeline','ориентировочные сроки'),
        w('fee proposal','предложение о комиссии'), w('team bios','биографии команды'),
        w('slide design','дизайн слайдов'), w('executive summary','резюме для руководства'),
        w('appendix','приложение'), w('tombstone','надгробие'), w('market data','рыночные данные'),
        w('financial model','финансовая модель'), w('sensitivity','чувствительность'),
        w('assumptions','допущения'), w('disclaimer','отказ от ответственности'),
      ],
    },
  ],
}

// ─── Module 10 – Asset Management (C1) ───────────────────────────────────────
const mod_asset_management: MD = {
  title: 'Asset Management', section: 'C1', lessons: [
    {
      title: 'Fund Types',
      words: [
        w('mutual fund','взаимный фонд'), w('hedge fund','хедж-фонд'),
        w('private equity fund','фонд прямых инвестиций'),
        w('venture capital fund','венчурный фонд'), w('real estate fund','фонд недвижимости'),
        w('infrastructure fund','инфраструктурный фонд'), w('pension fund','пенсионный фонд'),
        w('sovereign wealth fund','суверенный фонд благосостояния'),
        w('ETF','ETF'), w('index fund','индексный фонд'), w('UCITS','UCITS'), w('AIFMD','AIFMD'),
        w('closed-end fund','закрытый фонд'), w('open-end fund','открытый фонд'),
        w('interval fund','интервальный фонд'), w('fund of funds','фонд фондов'),
        w('feeder fund','фидерный фонд'), w('master fund','мастер-фонд'), w('REIT','REIT'),
        w('money market fund','фонд денежного рынка'), w('absolute return fund','фонд абсолютной доходности'),
        w('long-only fund','фонд только длинных позиций'),
        w('long-short fund','фонд длинных и коротких позиций'),
        w('multi-strategy','мультистратегия'), w('credit fund','кредитный фонд'),
      ],
    },
    {
      title: 'Portfolio Strategy',
      words: [
        w('investment strategy','инвестиционная стратегия'), w('asset allocation','распределение активов'),
        w('strategic allocation','стратегическое распределение'),
        w('tactical allocation','тактическое распределение'), w('core-satellite','ядро-спутник'),
        w('factor investing','факторное инвестирование'), w('smart beta','умная бета'),
        w('value','стоимость'), w('growth','рост'), w('momentum','моментум'),
        w('quality','качество'), w('low volatility','низкая волатильность'),
        w('thematic investing','тематическое инвестирование'), w('sector allocation','отраслевое распределение'),
        w('geographic allocation','географическое распределение'), w('currency overlay','валютное покрытие'),
        w('liability-driven investment','инвестирование с учётом обязательств'), w('LDI','LDI'),
        w('target-date fund','целевой фонд'), w('risk budget','бюджет риска'),
        w('risk parity','паритет риска'), w('portfolio construction','построение портфеля'),
        w('portfolio optimisation','оптимизация портфеля'), w('rebalancing','ребалансировка'),
        w('constraints','ограничения'),
      ],
    },
    {
      title: 'Benchmark',
      words: [
        w('benchmark','эталон'), w('index','индекс'), w('MSCI World','MSCI World'),
        w('S&P 500','S&P 500'), w('FTSE All-World','FTSE All-World'),
        w('Bloomberg Barclays Aggregate','Bloomberg Barclays Aggregate'),
        w('peer group','группа аналогов'), w('performance target','целевая доходность'),
        w('absolute return','абсолютная доходность'), w('relative return','относительная доходность'),
        w('tracking error','ошибка слежения'), w('active share','активная доля'),
        w('information ratio','информационный коэффициент'), w('active management','активное управление'),
        w('passive management','пассивное управление'), w('index replication','репликация индекса'),
        w('smart beta','умная бета'), w('factor exposure','факторная подверженность'),
        w('style box','стилевая коробка'), w('Morningstar rating','рейтинг Morningstar'),
        w('Lipper ranking','рейтинг Lipper'), w('benchmark deviation','отклонение от эталона'),
        w('mandate','мандат'), w('IPS','инвестиционная политика'), w('investment policy statement','заявление об инвестиционной политике'),
      ],
    },
    {
      title: 'Alpha & Beta',
      words: [
        w('alpha','альфа'), w('beta','бета'), w('active return','активная доходность'),
        w('systematic return','систематическая доходность'),
        w('idiosyncratic return','идиосинкратическая доходность'), w('CAPM','CAPM'),
        w('market exposure','подверженность рынку'), w('factor exposure','факторная подверженность'),
        w('Jensen\'s alpha','альфа Дженсена'), w('Treynor ratio','коэффициент Трейнора'),
        w('Sharpe ratio','коэффициент Шарпа'), w('information ratio','информационный коэффициент'),
        w('tracking error','ошибка слежения'), w('active risk','активный риск'),
        w('active share','активная доля'), w('portable alpha','портативная альфа'),
        w('alpha generation','генерация альфы'), w('skill vs luck','мастерство против удачи'),
        w('attribution','атрибуция'), w('returns-based attribution','атрибуция на основе доходности'),
        w('holdings-based attribution','атрибуция на основе позиций'),
        w('risk decomposition','декомпозиция риска'), w('factor model','факторная модель'),
        w('R-squared','R-квадрат'), w('long alpha','длинная альфа'),
      ],
    },
    {
      title: 'ESG',
      words: [
        w('ESG','ESG'), w('environmental','экологический'), w('social','социальный'),
        w('governance','управление'), w('responsible investing','ответственное инвестирование'),
        w('sustainable investing','устойчивое инвестирование'), w('SRI','SRI'),
        w('impact investing','импакт-инвестирование'), w('ESG integration','интеграция ESG'),
        w('ESG screening','ESG-скрининг'), w('positive screening','позитивный скрининг'),
        w('negative screening','негативный скрининг'), w('norms-based screening','скрининг на основе норм'),
        w('engagement','вовлечённость'), w('shareholder activism','акционерный активизм'),
        w('proxy voting','голосование по доверенности'), w('carbon footprint','углеродный след'),
        w('net zero','нулевые выбросы'), w('climate risk','климатический риск'),
        w('TCFD','TCFD'), w('SDGs','ЦУР'), w('PRI','PRI'), w('UNPRI','UNPRI'),
        w('ESG rating','ESG-рейтинг'), w('greenwashing','гринвошинг'),
      ],
    },
    {
      title: 'Performance Attribution',
      words: [
        w('performance attribution','атрибуция результатов'),
        w('total return','общая доходность'), w('benchmark return','доходность эталона'),
        w('active return','активная доходность'), w('sector allocation effect','эффект отраслевого распределения'),
        w('security selection effect','эффект отбора ценных бумаг'),
        w('interaction effect','эффект взаимодействия'), w('Brinson model','модель Бринсона'),
        w('attribution analysis','анализ атрибуции'), w('contribution','вклад'),
        w('absolute contribution','абсолютный вклад'), w('relative contribution','относительный вклад'),
        w('currency effect','валютный эффект'), w('residual','остаток'),
        w('attribution report','отчёт об атрибуции'),
        w('portfolio performance','результативность портфеля'),
        w('manager evaluation','оценка управляющего'), w('skill','мастерство'),
        w('style','стиль'), w('market timing','рыночный тайминг'),
        w('security picking','отбор ценных бумаг'), w('risk-adjusted return','доходность с поправкой на риск'),
        w('appraisal ratio','коэффициент оценки'), w('gross of fees','до вычета комиссий'),
        w('net of fees','после вычета комиссий'),
      ],
    },
  ],
}

// ─── Module 11 – Regulation & Compliance (C1) ────────────────────────────────
const mod_regulation: MD = {
  title: 'Regulation & Compliance', section: 'C1', lessons: [
    {
      title: 'Basel III',
      words: [
        w('Basel III','Базель III'), w('capital adequacy','достаточность капитала'), w('CET1','CET1'),
        w('Tier 1 capital','капитал 1-го уровня'), w('Tier 2 capital','капитал 2-го уровня'),
        w('risk-weighted assets','активы, взвешенные по риску'), w('leverage ratio','коэффициент левериджа'),
        w('liquidity coverage ratio','коэффициент покрытия ликвидности'), w('LCR','LCR'),
        w('net stable funding ratio','коэффициент чистого стабильного финансирования'), w('NSFR','NSFR'),
        w('systemically important bank','системно значимый банк'), w('G-SIB','G-SIB'),
        w('capital buffer','буфер капитала'), w('conservation buffer','буфер консервации'),
        w('countercyclical buffer','контрциклический буфер'), w('stress test','стресс-тест'),
        w('supervisory review','надзорный обзор'), w('Pillar 1','Опора 1'),
        w('Pillar 2','Опора 2'), w('Pillar 3','Опора 3'), w('disclosure','раскрытие'),
        w('BCBS','BCBS'), w('BIS','BIS'), w('credit risk capital','капитал под кредитный риск'),
      ],
    },
    {
      title: 'MiFID',
      words: [
        w('MiFID II','MiFID II'),
        w('Markets in Financial Instruments Directive','Директива о рынках финансовых инструментов'),
        w('best execution','наилучшее исполнение'), w('client categorisation','категоризация клиентов'),
        w('retail client','розничный клиент'), w('professional client','профессиональный клиент'),
        w('eligible counterparty','приемлемый контрагент'), w('suitability','пригодность'),
        w('appropriateness','соответствие'), w('product governance','управление продуктом'),
        w('target market','целевой рынок'), w('inducement','вознаграждение'),
        w('research unbundling','разделение аналитики'), w('transaction reporting','отчётность о транзакциях'),
        w('LEI','LEI'), w('trade repository','торговый репозиторий'),
        w('algorithmic trading','алгоритмическая торговля'), w('HFT','ВЧТ'),
        w('systematic internaliser','систематический интернализатор'), w('transparency','прозрачность'),
        w('pre-trade','предторговый'), w('post-trade','послеторговый'), w('position limit','лимит позиции'),
        w('commodity derivative','товарный дериватив'), w('ESMA','ESMA'),
      ],
    },
    {
      title: 'AML',
      words: [
        w('AML','ПОД'), w('anti-money laundering','противодействие отмыванию денег'),
        w('money laundering','отмывание денег'), w('terrorist financing','финансирование терроризма'),
        w('suspicious activity report','отчёт о подозрительной деятельности'), w('SAR','SAR'),
        w('MLRO','ответственный по ПОД'), w('placement','размещение'),
        w('layering','расслоение'), w('integration','интеграция'), w('risk-based approach','риск-ориентированный подход'),
        w('customer due diligence','должная осмотрительность'), w('enhanced due diligence','усиленная ДО'),
        w('simplified due diligence','упрощённая ДО'), w('PEP','ПЭЛ'),
        w('politically exposed person','политически значимое лицо'), w('sanction','санкция'),
        w('screening','скрининг'), w('transaction monitoring','мониторинг транзакций'),
        w('STR','STR'), w('FATF','ФАТФ'), w('40 recommendations','40 рекомендаций'),
        w('compliance programme','программа соблюдения'), w('three stages','три этапа'),
        w('financial intelligence','финансовая разведка'),
      ],
    },
    {
      title: 'KYC',
      words: [
        w('KYC','KYC'), w('know your customer','знай своего клиента'),
        w('customer identification','идентификация клиента'), w('identity verification','верификация личности'),
        w('beneficial owner','бенефициарный владелец'), w('UBO','ФПБ'),
        w('ultimate beneficial owner','конечный бенефициарный владелец'),
        w('corporate structure','корпоративная структура'), w('source of funds','источник средств'),
        w('source of wealth','источник состояния'), w('risk assessment','оценка риска'),
        w('customer risk rating','рейтинг риска клиента'), w('high risk','высокий риск'),
        w('medium risk','средний риск'), w('low risk','низкий риск'),
        w('ongoing monitoring','постоянный мониторинг'), w('periodic review','периодический обзор'),
        w('trigger event','триггерное событие'), w('adverse media','негативные СМИ'),
        w('PEP','ПЭЛ'), w('sanction list','санкционный список'),
        w('document verification','верификация документов'), w('biometric','биометрия'),
        w('digital identity','цифровая идентификация'), w('eKYC','eKYC'),
      ],
    },
    {
      title: 'FATF',
      words: [
        w('FATF','ФАТФ'), w('Financial Action Task Force','Группа разработки финансовых мер'),
        w('40 recommendations','40 рекомендаций'), w('mutual evaluation','взаимная оценка'),
        w('FATF member','член ФАТФ'), w('grey list','серый список'), w('black list','чёрный список'),
        w('AML/CFT','ПОД/ФТ'), w('risk-based approach','риск-ориентированный подход'),
        w('financial intelligence','финансовая разведка'), w('FIU','ПФР'),
        w('suspicious transaction report','отчёт о подозрительной транзакции'),
        w('predicate offence','предикатное преступление'),
        w('proceeds of crime','доходы от преступной деятельности'), w('confiscation','конфискация'),
        w('asset freezing','заморозка активов'), w('international cooperation','международное сотрудничество'),
        w('correspondent banking','корреспондентский банкинг'), w('de-risking','дериски'),
        w('virtual asset','виртуальный актив'), w('cryptocurrency','криптовалюта'),
        w('VASP','VASP'), w('beneficial ownership','бенефициарное владение'),
        w('transparency','прозрачность'), w('DNFBP','DNFBP'),
      ],
    },
    {
      title: 'Regulatory Reporting',
      words: [
        w('regulatory reporting','регуляторная отчётность'),
        w('supervisory reporting','надзорная отчётность'), w('COREP','COREP'), w('FINREP','FINREP'),
        w('EBA','EBA'), w('PRA','PRA'), w('FCA','FCA'), w('regulatory return','регуляторный отчёт'),
        w('reporting frequency','периодичность отчётности'), w('daily','ежедневный'),
        w('monthly','ежемесячный'), w('quarterly','ежеквартальный'), w('annual','ежегодный'),
        w('data quality','качество данных'), w('validation rule','правило валидации'),
        w('taxonomy','таксономия'), w('XBRL','XBRL'), w('iXBRL','iXBRL'),
        w('DPM','DPM'), w('data point model','модель точек данных'),
        w('reporting template','шаблон отчёта'), w('supervisory disclosure','надзорное раскрытие'),
        w('Pillar 3','Опора 3'), w('AnaCredit','AnaCredit'), w('submission deadline','срок подачи'),
      ],
    },
  ],
}

// ─── Module 12 – Financial Communication (C1) ────────────────────────────────
const mod_financial_comm: MD = {
  title: 'Financial Communication', section: 'C1', lessons: [
    {
      title: 'Investor Relations',
      words: [
        w('investor relations','связи с инвесторами'), w('IR','IR'),
        w('shareholder communication','коммуникация с акционерами'),
        w('analyst coverage','аналитическое покрытие'), w('equity story','история компании'),
        w('investment case','инвестиционный кейс'), w('roadshow','роудшоу'), w('NDR','NDR'),
        w('non-deal roadshow','роудшоу без сделки'), w('investor day','день инвестора'),
        w('capital markets day','день рынков капитала'), w('earnings call','звонок по результатам'),
        w('conference','конференция'), w('investor presentation','презентация для инвесторов'),
        w('FAQ document','документ FAQ'), w('Q&A','Q&A'),
        w('investor feedback','отзывы инвесторов'), w('consensus estimate','консенсус-прогноз'),
        w('guidance','прогноз'), w('earnings guidance','прогноз прибыли'),
        w('disclosure policy','политика раскрытия'), w('Regulation FD','Регулирование FD'),
        w('quiet period','период молчания'), w('analyst meeting','встреча с аналитиками'),
        w('IR website','сайт IR'),
      ],
    },
    {
      title: 'Earnings Calls',
      words: [
        w('earnings call','звонок по результатам'), w('quarterly results','квартальные результаты'),
        w('revenue','выручка'), w('EBITDA','EBITDA'), w('earnings per share','EPS'),
        w('guidance','прогноз'), w('full-year guidance','прогноз на весь год'),
        w('Q&A','Q&A'), w('management commentary','комментарий менеджмента'),
        w('CFO presentation','презентация CFO'), w('CEO commentary','комментарий CEO'),
        w('analyst question','вопрос аналитика'), w('consensus beat','превышение консенсуса'),
        w('consensus miss','промах консенсуса'), w('earnings surprise','сюрприз прибыли'),
        w('adjusted earnings','скорректированная прибыль'), w('non-GAAP','не-GAAP'),
        w('reconciliation','сверка'), w('operating highlights','операционные результаты'),
        w('divisional performance','результаты подразделений'), w('outlook','прогноз'),
        w('headwinds','встречный ветер'), w('tailwinds','попутный ветер'),
        w('one-time items','разовые статьи'), w('cost savings','экономия затрат'),
      ],
    },
    {
      title: 'Annual Reports',
      words: [
        w('annual report','годовой отчёт'), w('chairman\'s letter','письмо председателя'),
        w('CEO review','обзор CEO'), w('strategic report','стратегический отчёт'),
        w('financial highlights','финансовые показатели'), w('directors report','отчёт директоров'),
        w('auditors report','отчёт аудиторов'), w('financial statements','финансовая отчётность'),
        w('notes','примечания'), w('five-year summary','пятилетняя сводка'),
        w('KPI page','страница КПЭ'), w('ESG section','раздел ESG'),
        w('governance section','раздел управления'), w('remuneration report','отчёт о вознаграждении'),
        w('glossary','глоссарий'), w('forward-looking disclaimer','оговорка о прогнозах'),
        w('content summary','содержание'), w('narrative reporting','нарративная отчётность'),
        w('integrated reporting','интегрированная отчётность'), w('IFRS compliance','соответствие МСФО'),
        w('AGM notice','уведомление о ГОСА'), w('proxy statement','заявление о доверенности'),
        w('shareholder letter','письмо акционерам'), w('supplementary information','дополнительная информация'),
        w('digital report','цифровой отчёт'),
      ],
    },
    {
      title: 'Board Presentations',
      words: [
        w('board presentation','презентация для совета'), w('board pack','пакет для совета'),
        w('executive summary','резюме для руководства'), w('financial review','финансовый обзор'),
        w('strategic update','стратегическое обновление'), w('risk update','обновление по рискам'),
        w('KPI dashboard','дашборд КПЭ'), w('budget vs actual','бюджет против факта'),
        w('year-to-date performance','результаты с начала года'),
        w('variance analysis','анализ отклонений'), w('divisional review','обзор подразделений'),
        w('investment proposal','инвестиционное предложение'), w('M&A update','обновление по M&A'),
        w('regulatory update','регуляторное обновление'), w('governance item','вопрос управления'),
        w('for decision','для принятия решения'), w('for noting','для принятия к сведению'),
        w('for discussion','для обсуждения'), w('confidential','конфиденциальный'),
        w('appendix','приложение'), w('supplementary slide','дополнительный слайд'),
        w('management accounts','управленческая отчётность'), w('financial forecast','финансовый прогноз'),
        w('board minutes','протокол совета'), w('action log','журнал действий'),
      ],
    },
    {
      title: 'Media',
      words: [
        w('press release','пресс-релиз'), w('earnings announcement','объявление о результатах'),
        w('profit warning','предупреждение о прибыли'), w('trading update','торговое обновление'),
        w('ad hoc disclosure','разовое раскрытие'), w('regulatory news','регуляторные новости'),
        w('RNS','RNS'), w('financial journalist','финансовый журналист'),
        w('media briefing','брифинг для СМИ'), w('spokesperson','представитель'),
        w('interview','интервью'), w('on the record','официально'), w('off the record','неофициально'),
        w('embargo','эмбарго'), w('hold','задержка публикации'), w('financial PR','финансовый PR'),
        w('investor presentation','презентация для инвесторов'), w('media kit','медиакит'),
        w('Q&A preparation','подготовка к Q&A'), w('key message','ключевое сообщение'),
        w('messaging framework','коммуникационная структура'), w('crisis communication','кризисная коммуникация'),
        w('media monitoring','мониторинг СМИ'), w('social media','социальные сети'),
        w('digital channel','цифровой канал'),
      ],
    },
    {
      title: 'Ethics',
      words: [
        w('financial ethics','финансовая этика'), w('fiduciary duty','фидуциарная обязанность'),
        w('conflict of interest','конфликт интересов'), w('insider trading','инсайдерская торговля'),
        w('market manipulation','манипулирование рынком'), w('front running','фронт-ранниг'),
        w('churning','чёрная комиссия'), w('mis-selling','неправильная продажа'),
        w('suitability','пригодность'), w('duty of care','обязанность заботы'),
        w('professional standards','профессиональные стандарты'),
        w('CFA Institute','Институт CFA'), w('code of ethics','кодекс этики'),
        w('standards of professional conduct','стандарты профессионального поведения'),
        w('disclosure','раскрытие'), w('transparency','прозрачность'), w('fair dealing','справедливое обращение'),
        w('independence','независимость'), w('objectivity','объективность'), w('loyalty','лояльность'),
        w('prudence','осмотрительность'), w('diligence','добросовестность'),
        w('confidentiality','конфиденциальность'), w('regulatory compliance','регуляторное соответствие'),
        w('whistleblowing','разоблачение нарушений'),
      ],
    },
  ],
}

// ─── assembled module lists ────────────────────────────────────────────────────

const FIN_B1_MODULES: MD[] = [
  mod_financial_system,
  mod_banking_basics,
  mod_investment_basics,
  mod_financial_docs,
]

const FIN_B1C1_MODULES: MD[] = [
  mod_financial_system,
  mod_banking_basics,
  mod_investment_basics,
  mod_financial_docs,
  mod_financial_markets,
  mod_corp_finance,
  mod_risk_management,
  mod_financial_analysis,
  mod_investment_banking,
  mod_asset_management,
  mod_regulation,
  mod_financial_comm,
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
  console.log('🚀 ESP Finance Industry seed script')
  console.log('   Supabase URL:', SUPABASE_URL)

  const ALL_IDS = [FIN_B1_ID, FIN_B1C1_ID]

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

  await seedCourse(FIN_B1_ID,   FIN_B1_MODULES,   'Finance Industry B1')
  await seedCourse(FIN_B1C1_ID, FIN_B1C1_MODULES, 'Finance Industry B1-C1')

  console.log('\n🎉 Done! Finance Industry seeded.')
  console.log(`   Finance B1:    ${FIN_B1_MODULES.length} modules, ${FIN_B1_MODULES.length * 6} lessons`)
  console.log(`   Finance B1-C1: ${FIN_B1C1_MODULES.length} modules, ${FIN_B1C1_MODULES.length * 6} lessons`)
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err)
  process.exit(1)
})
