/**
 * Content data for ESP (English for Specific Purposes) textbooks.
 */

import { VocabEntry, Exercise } from './pdf-builder'

export interface EspModule {
  number: number
  title: string
  ruTitle: string
  objectives: string[]
  introduction: string        // EN
  ruIntroduction: string      // RU
  theory: string              // EN theoretical text
  ruTheory: string            // RU translation of key points
  vocabulary: VocabEntry[]
  caseStudy: { title: string; text: string; questions: string[] }
  exercises: Exercise[]
  professionalNote: string
  ruProfessionalNote: string
}

export interface EspTextbook {
  id: string
  title: string
  subtitle: string
  level: string
  field: string
  descriptionEn: string
  descriptionRu: string
  prefaceRu: string
  modules: EspModule[]
  appendixGlossary: VocabEntry[]
  resources: string[]
}

// ────────────────────────────────────────────────────────────────────────────
// ACCOUNTING B1-C1
// ────────────────────────────────────────────────────────────────────────────

export const ESP_ACCOUNTING: EspTextbook = {
  id: 'esp-accounting',
  title: 'Accounting Vocabulary',
  subtitle: 'English for Accounting Professionals',
  level: 'B1–C1',
  field: 'Accounting & Finance',
  descriptionEn: 'A comprehensive bilingual textbook covering essential accounting and financial reporting vocabulary for university students and professionals.',
  descriptionRu: 'Комплексный двуязычный учебник по бухгалтерской и финансово-отчётной лексике для студентов экономических специальностей и специалистов.',
  prefaceRu: `Данный учебник предназначен для студентов экономических факультетов, изучающих профессиональный английский язык в области бухгалтерского учёта.

После прохождения курса вы сможете:
• Читать финансовую отчётность (financial statements) на английском языке
• Понимать международные стандарты финансовой отчётности (IFRS/GAAP)
• Вести профессиональную переписку с иностранными партнёрами
• Успешно проходить собеседования в международных компаниях
• Работать с бухгалтерским программным обеспечением на английском

Структура учебника: 8 модулей, каждый посвящён отдельному разделу бухгалтерского учёта. Все профессиональные термины даны с английским определением и русским переводом. Примеры взяты из реальной финансовой документации международных компаний.`,
  modules: [
    {
      number: 1,
      title: 'Financial Fundamentals',
      ruTitle: 'Основы финансового учёта',
      objectives: [
        'Understand the purpose and scope of accounting',
        'Distinguish between different types of financial statements',
        'Use key accounting terminology accurately in context',
        'Explain the accounting equation and double-entry system',
      ],
      introduction: 'Accounting is the systematic process of recording, classifying, and summarising financial transactions. It provides stakeholders — investors, creditors, management, and regulators — with reliable information about an organisation\'s financial position and performance.',
      ruIntroduction: 'Бухгалтерский учёт — это систематический процесс регистрации, классификации и обобщения финансовых операций. Он предоставляет заинтересованным сторонам надёжную информацию о финансовом положении и результатах деятельности организации.',
      theory: `The Accounting Equation
The foundation of all accounting is the accounting equation:

    Assets = Liabilities + Equity

Assets are resources owned or controlled by the entity that are expected to generate future economic benefits. Liabilities represent obligations of the entity — amounts owed to external parties such as creditors, banks, or suppliers. Equity (also called shareholders' equity or net assets) represents the residual interest in the assets after deducting all liabilities.

Double-Entry Bookkeeping
Developed in 15th-century Italy by Luca Pacioli, the double-entry system records every transaction in at least two accounts. The total of all debit entries must always equal the total of all credit entries. This self-balancing mechanism helps detect errors.

Types of Financial Statements
The four principal financial statements are:
1. Income Statement (Statement of Profit or Loss) — shows revenues and expenses over a period
2. Balance Sheet (Statement of Financial Position) — shows assets, liabilities, and equity at a point in time
3. Cash Flow Statement — shows cash inflows and outflows during a period
4. Statement of Changes in Equity — shows movements in equity accounts

Under IFRS (International Financial Reporting Standards), these statements are required for public companies worldwide. In the United States, GAAP (Generally Accepted Accounting Principles) is the standard framework.`,
      ruTheory: `Уравнение бухгалтерского баланса: Активы = Обязательства + Капитал. Это фундамент всей системы учёта. Метод двойной записи (double-entry bookkeeping), разработанный в XV веке Лукой Пачиоли, требует, чтобы каждая операция записывалась в дебет одного и кредит другого счёта. Сумма всех дебетов всегда равна сумме всех кредитов.`,
      vocabulary: [
        { en: 'accounting', pos: 'n.', def: 'The systematic process of recording, classifying, and reporting financial transactions', ru: 'бухгалтерский учёт', example: 'Accounting provides reliable financial information to stakeholders.' },
        { en: 'assets', pos: 'n.pl.', def: 'Resources owned or controlled by an entity expected to generate future economic benefits', ru: 'активы', example: 'Total assets include both current and non-current items.' },
        { en: 'liabilities', pos: 'n.pl.', def: 'Present obligations of an entity arising from past events, expected to result in an outflow of resources', ru: 'обязательства/пассивы', example: 'Current liabilities are due within one year.' },
        { en: 'equity', pos: 'n.', def: 'The residual interest in assets after deducting all liabilities; shareholders\' ownership', ru: 'собственный капитал', example: 'Equity equals assets minus liabilities.' },
        { en: 'revenue', pos: 'n.', def: 'Income earned from the entity\'s primary business activities', ru: 'выручка/доход', example: 'Revenue increased by 15% this quarter.' },
        { en: 'expenses', pos: 'n.pl.', def: 'Costs incurred in generating revenue; decreases in economic benefits', ru: 'расходы', example: 'Operating expenses include rent and salaries.' },
        { en: 'profit', pos: 'n.', def: 'The financial gain when revenue exceeds expenses; net income', ru: 'прибыль', example: 'Net profit is calculated after tax deductions.' },
        { en: 'loss', pos: 'n.', def: 'When expenses exceed revenue; negative net income', ru: 'убыток', example: 'The company reported a net loss of $2 million.' },
        { en: 'balance sheet', pos: 'n.', def: 'A financial statement showing assets, liabilities, and equity at a specific date', ru: 'бухгалтерский баланс', example: 'The balance sheet must always balance.' },
        { en: 'income statement', pos: 'n.', def: 'A financial statement showing revenues and expenses over a period', ru: 'отчёт о прибылях и убытках', example: 'The income statement shows the company\'s profitability.' },
        { en: 'cash flow statement', pos: 'n.', def: 'A financial statement showing cash inflows and outflows during a period', ru: 'отчёт о движении денежных средств', example: 'The cash flow statement is divided into operating, investing, and financing activities.' },
        { en: 'debit', pos: 'n./v.', def: 'An entry on the left side of an account; to record an increase in assets or decrease in liabilities', ru: 'дебет; дебетовать', example: 'Debit the cash account when money is received.' },
        { en: 'credit', pos: 'n./v.', def: 'An entry on the right side of an account; to record an increase in liabilities or decrease in assets', ru: 'кредит; кредитовать', example: 'Credit the revenue account when a sale is made.' },
        { en: 'double-entry bookkeeping', pos: 'n.', def: 'A system where every transaction is recorded in at least two accounts, keeping debits equal to credits', ru: 'метод двойной записи', example: 'Double-entry bookkeeping was developed in 15th-century Italy.' },
        { en: 'ledger', pos: 'n.', def: 'A book or computerised record containing all financial accounts', ru: 'главная книга/бухгалтерский регистр', example: 'All transactions are posted to the general ledger.' },
        { en: 'journal', pos: 'n.', def: 'A chronological record of all financial transactions before they are posted to the ledger', ru: 'журнал хозяйственных операций', example: 'First record the transaction in the journal.' },
        { en: 'audit', pos: 'n./v.', def: 'An independent examination of financial records to verify accuracy and compliance', ru: 'аудит; проводить аудит', example: 'The annual audit confirmed the financial statements were accurate.' },
        { en: 'IFRS', pos: 'abbr.', def: 'International Financial Reporting Standards — global accounting rules issued by IASB', ru: 'МСФО — Международные стандарты финансовой отчётности', example: 'Kazakhstan adopted IFRS for large public companies.' },
        { en: 'GAAP', pos: 'abbr.', def: 'Generally Accepted Accounting Principles — US accounting framework', ru: 'ОПБУ — общепринятые принципы бухгалтерского учёта (США)', example: 'US companies must follow GAAP when reporting to the SEC.' },
        { en: 'accrual basis', pos: 'n.', def: 'Recording revenues and expenses when they are earned or incurred, not when cash is exchanged', ru: 'метод начисления', example: 'Under accrual basis, revenue is recognised when earned.' },
        { en: 'cash basis', pos: 'n.', def: 'Recording transactions only when cash is received or paid', ru: 'кассовый метод', example: 'Small businesses may use cash basis accounting.' },
        { en: 'depreciation', pos: 'n.', def: 'The systematic allocation of the cost of a tangible asset over its useful life', ru: 'амортизация', example: 'Depreciation reduces the book value of equipment annually.' },
        { en: 'amortisation', pos: 'n.', def: 'The systematic write-off of an intangible asset\'s cost over its useful life', ru: 'амортизация нематериальных активов', example: 'Goodwill amortisation is required under some accounting standards.' },
        { en: 'provision', pos: 'n.', def: 'A liability of uncertain timing or amount recognised in the accounts', ru: 'резерв/оценочное обязательство', example: 'The company created a provision for doubtful debts.' },
        { en: 'accrual', pos: 'n.', def: 'An expense or revenue recognised before cash is paid or received', ru: 'начисление/накопленные обязательства', example: 'Salary accruals are recorded at month-end.' },
        { en: 'prepayment', pos: 'n.', def: 'A payment made in advance for goods or services not yet received', ru: 'предоплата/авансовый платёж', example: 'Rent paid in advance is recorded as a prepayment.' },
        { en: 'inventory', pos: 'n.', def: 'Goods held for sale or used in production', ru: 'товарно-материальные запасы', example: 'FIFO and LIFO are inventory costing methods.' },
        { en: 'receivables', pos: 'n.pl.', def: 'Amounts owed to the company by customers', ru: 'дебиторская задолженность', example: 'Accounts receivable are collected within 30-60 days.' },
        { en: 'payables', pos: 'n.pl.', def: 'Amounts owed by the company to suppliers or creditors', ru: 'кредиторская задолженность', example: 'Accounts payable must be settled promptly.' },
        { en: 'net income', pos: 'n.', def: 'Total profit after all expenses and taxes have been deducted', ru: 'чистая прибыль', example: 'Net income is the bottom line of the income statement.' },
        { en: 'gross profit', pos: 'n.', def: 'Revenue minus the cost of goods sold, before operating expenses', ru: 'валовая прибыль', example: 'Gross profit margin = gross profit / revenue × 100%.' },
        { en: 'operating profit', pos: 'n.', def: 'Profit from core business operations before interest and tax', ru: 'операционная прибыль', example: 'EBIT is another term for operating profit.' },
        { en: 'EBITDA', pos: 'abbr.', def: 'Earnings Before Interest, Taxes, Depreciation, and Amortisation — a measure of core profitability', ru: 'EBITDA — прибыль до вычета процентов, налогов, износа и амортизации', example: 'EBITDA is widely used to compare companies\' operating performance.' },
        { en: 'working capital', pos: 'n.', def: 'Current assets minus current liabilities; measures short-term liquidity', ru: 'оборотный капитал', example: 'Positive working capital means the company can meet short-term obligations.' },
        { en: 'liquidity', pos: 'n.', def: 'The ability to meet short-term financial obligations using available cash', ru: 'ликвидность', example: 'A liquidity crisis occurs when a company cannot pay its bills.' },
        { en: 'solvency', pos: 'n.', def: 'The ability to meet long-term financial obligations', ru: 'платёжеспособность', example: 'The solvency ratio shows whether assets cover all liabilities.' },
        { en: 'going concern', pos: 'n.', def: 'The assumption that a business will continue operating for the foreseeable future', ru: 'допущение о непрерывности деятельности', example: 'Auditors assess whether the company is a going concern.' },
        { en: 'materiality', pos: 'n.', def: 'The concept that only significant information must be disclosed in financial statements', ru: 'существенность', example: 'A $50 error in a billion-dollar company lacks materiality.' },
        { en: 'disclosure', pos: 'n.', def: 'The act of making financial information available to relevant parties', ru: 'раскрытие информации', example: 'Full disclosure is required for public companies.' },
        { en: 'consolidation', pos: 'n.', def: 'Combining financial statements of a parent and its subsidiaries', ru: 'консолидация', example: 'Consolidation eliminates intercompany transactions.' },
        { en: 'subsidiary', pos: 'n.', def: 'A company controlled by a parent company (holding more than 50% voting rights)', ru: 'дочерняя компания', example: 'The subsidiary\'s results are included in the group accounts.' },
        { en: 'goodwill', pos: 'n.', def: 'An intangible asset representing the excess paid over fair value in an acquisition', ru: 'деловая репутация/гудвил', example: 'Goodwill is tested annually for impairment under IFRS.' },
        { en: 'impairment', pos: 'n.', def: 'A reduction in the carrying amount of an asset below its recoverable amount', ru: 'обесценение активов', example: 'The company recognised an impairment loss on its property.' },
        { en: 'fair value', pos: 'n.', def: 'The price at which an asset could be exchanged between knowledgeable parties', ru: 'справедливая стоимость', example: 'IFRS 13 defines how to measure fair value.' },
        { en: 'carrying amount', pos: 'n.', def: 'The value at which an asset or liability is recognised in the balance sheet', ru: 'балансовая стоимость', example: 'The carrying amount of equipment decreases with depreciation.' },
        { en: 'variance', pos: 'n.', def: 'The difference between actual and budgeted (planned) figures', ru: 'отклонение', example: 'A favourable variance means actual costs were lower than budget.' },
        { en: 'budget', pos: 'n.', def: 'A financial plan expressing expected revenues and expenses for a future period', ru: 'бюджет', example: 'The annual budget is approved by the board of directors.' },
        { en: 'forecast', pos: 'n.', def: 'A prediction of future financial results based on current data', ru: 'прогноз', example: 'Q3 forecast suggests revenue will exceed targets.' },
        { en: 'statement of financial position', pos: 'n.', def: 'The IFRS term for the balance sheet', ru: 'отчёт о финансовом положении (МСФО)', example: 'IFRS requires the statement of financial position, not balance sheet.' },
      ],
      caseStudy: {
        title: 'Analysing the Financial Statements of a Kazakh Manufacturing Company',
        text: `KazMetal JSC is a medium-sized steel manufacturer based in Karaganda. For the year ended 31 December 2025, the company reported the following key figures:

Revenue:                  KZT 48,500 million
Cost of goods sold:       KZT 31,200 million
Operating expenses:       KZT  8,400 million
Finance costs:            KZT  1,800 million
Income tax expense:       KZT  1,425 million

Total assets:             KZT 95,000 million
Total liabilities:        KZT 38,000 million
Total equity:             KZT 57,000 million

The company prepares its financial statements in accordance with IFRS.`,
        questions: [
          'Calculate the gross profit and gross profit margin.',
          'Calculate the operating profit (EBIT).',
          'Calculate the net profit.',
          'Verify that the accounting equation holds (Assets = Liabilities + Equity).',
          'What does a gross profit margin of approximately 35% suggest about KazMetal\'s pricing power?',
        ],
      },
      exercises: [
        {
          instruction: 'Match each accounting term with its correct definition.',
          ruHint: 'Соотнесите термин с его определением.',
          items: [
            'Assets         a) Amount owed to suppliers',
            'Liabilities    b) Income from sales',
            'Equity         c) Resources controlled by the entity',
            'Revenue        d) Residual interest after liabilities',
            'Payables       e) Obligations to external parties',
          ],
        },
        {
          instruction: 'Complete these sentences with the correct accounting term.',
          ruHint: 'Заполните пропуски правильным термином.',
          items: [
            'The _______ equation states that Assets = Liabilities + Equity.',
            'In _______ bookkeeping, every transaction affects two accounts.',
            'The _______ statement shows the company\'s financial position at a specific date.',
            'Revenue minus all expenses equals _______ income.',
            'The _______ method recognises revenue when earned, not when cash is received.',
          ],
        },
        {
          instruction: 'Translate these sentences into English using correct accounting terminology.',
          ruHint: 'Переведите предложения на английский, используя бухгалтерские термины.',
          items: [
            'Валовая прибыль = выручка - себестоимость реализованной продукции.',
            'Дебиторская задолженность — это сумма, причитающаяся компании от клиентов.',
            'Амортизация снижает балансовую стоимость основных средств ежегодно.',
            'Отчёт о движении денежных средств делится на три раздела.',
          ],
        },
      ],
      professionalNote: 'In international accounting firms (Big Four: Deloitte, PwC, EY, KPMG), English is the working language for all cross-border engagements. Mastery of accounting vocabulary is essential for passing professional qualifications such as ACCA (Association of Chartered Certified Accountants) and CPA (Certified Public Accountant).',
      ruProfessionalNote: 'В международных аудиторских фирмах (Большая четвёрка: Deloitte, PwC, EY, KPMG) английский — рабочий язык для всех международных проектов. Владение бухгалтерской терминологией необходимо для сдачи профессиональных квалификационных экзаменов ACCA и CPA.',
    },
    {
      number: 2,
      title: 'Assets and Liabilities',
      ruTitle: 'Активы и обязательства',
      objectives: [
        'Classify assets as current or non-current',
        'Distinguish between financial and non-financial liabilities',
        'Apply the recognition criteria for assets and liabilities',
        'Read and interpret a balance sheet in English',
      ],
      introduction: 'The balance sheet presents a snapshot of an organisation\'s financial health at a single point in time. Understanding how assets and liabilities are classified, measured, and presented is fundamental to financial analysis.',
      ruIntroduction: 'Баланс представляет собой моментальный снимок финансового состояния организации на определённую дату. Понимание классификации и оценки активов и обязательств — основа финансового анализа.',
      theory: `Classification of Assets

Assets are classified as either current or non-current (long-term).

CURRENT ASSETS are expected to be converted to cash or used within one year or the normal operating cycle:
• Cash and cash equivalents — the most liquid assets
• Trade receivables (accounts receivable) — money owed by customers
• Inventories — goods held for sale or for use in production
• Prepayments — advance payments for future services
• Short-term investments

NON-CURRENT ASSETS are held for longer than one year:
• Property, Plant and Equipment (PP&E) — tangible assets used in operations
• Intangible assets — patents, trademarks, goodwill, software
• Long-term investments
• Deferred tax assets

Classification of Liabilities

CURRENT LIABILITIES are due within one year:
• Trade payables (accounts payable) — money owed to suppliers
• Short-term borrowings — bank overdrafts, current portion of long-term debt
• Tax payable
• Accrued expenses — costs incurred but not yet paid

NON-CURRENT LIABILITIES are due after more than one year:
• Long-term loans and bonds payable
• Finance lease obligations
• Deferred tax liabilities
• Pension obligations

Asset Recognition Criteria (IFRS Conceptual Framework)
An asset is recognised in the balance sheet when:
1. It is probable that future economic benefits will flow to the entity
2. The cost can be measured reliably`,
      ruTheory: `Активы делятся на оборотные (current — до 1 года) и внеоборотные (non-current — свыше 1 года). Обязательства — на краткосрочные (current liabilities — до 1 года) и долгосрочные (non-current liabilities). Актив признаётся в балансе, когда: (1) вероятно получение будущих экономических выгод; (2) стоимость можно надёжно измерить.`,
      vocabulary: [
        { en: 'current assets', pos: 'n.', def: 'Assets expected to be converted to cash within one year', ru: 'оборотные активы', example: 'Current assets include cash, receivables, and inventory.' },
        { en: 'non-current assets', pos: 'n.', def: 'Long-term assets held for more than one year', ru: 'внеоборотные активы', example: 'Property is classified as a non-current asset.' },
        { en: 'cash equivalents', pos: 'n.pl.', def: 'Short-term, highly liquid investments readily convertible to cash', ru: 'денежные эквиваленты', example: 'Treasury bills are typical cash equivalents.' },
        { en: 'trade receivables', pos: 'n.pl.', def: 'Amounts owed by customers for goods or services delivered on credit', ru: 'торговая дебиторская задолженность', example: 'Trade receivables are collected within the credit period.' },
        { en: 'inventories', pos: 'n.pl.', def: 'Assets held for sale in the ordinary course of business or used in production', ru: 'запасы', example: 'Inventories are valued at the lower of cost and net realisable value.' },
        { en: 'PP&E', pos: 'abbr.', def: 'Property, Plant and Equipment — tangible non-current assets used in business operations', ru: 'основные средства', example: 'PP&E is depreciated over its estimated useful life.' },
        { en: 'intangible assets', pos: 'n.pl.', def: 'Non-physical assets with economic value (patents, trademarks, goodwill)', ru: 'нематериальные активы', example: 'Software is recognised as an intangible asset.' },
        { en: 'net realisable value', pos: 'n.', def: 'The expected selling price minus costs to complete and sell', ru: 'чистая стоимость реализации', example: 'Inventories are written down to net realisable value when impaired.' },
        { en: 'book value', pos: 'n.', def: 'The value of an asset as recorded in the accounts after depreciation', ru: 'балансовая стоимость', example: 'Book value may differ significantly from market value.' },
        { en: 'market value', pos: 'n.', def: 'The price at which an asset would sell in an open market', ru: 'рыночная стоимость', example: 'Market value of listed shares changes daily.' },
        { en: 'historical cost', pos: 'n.', def: 'The original purchase price of an asset', ru: 'историческая стоимость', example: 'Under historical cost, land is still carried at its purchase price.' },
        { en: 'revaluation', pos: 'n.', def: 'Adjusting an asset\'s carrying amount to its current fair value', ru: 'переоценка', example: 'IFRS permits revaluation of PP&E to fair value.' },
        { en: 'useful life', pos: 'n.', def: 'The expected period over which an asset will be used', ru: 'срок полезного использования', example: 'A machine with a 10-year useful life is depreciated over 10 years.' },
        { en: 'residual value', pos: 'n.', def: 'The estimated remaining value of an asset at the end of its useful life', ru: 'остаточная стоимость', example: 'Residual value is deducted before calculating depreciation.' },
        { en: 'straight-line depreciation', pos: 'n.', def: 'A depreciation method allocating equal amounts each year', ru: 'линейный метод амортизации', example: 'Straight-line depreciation = (Cost − Residual value) / Useful life.' },
        { en: 'accelerated depreciation', pos: 'n.', def: 'Higher depreciation charges in early years of an asset\'s life', ru: 'ускоренная амортизация', example: 'The reducing balance method produces accelerated depreciation.' },
        { en: 'finance lease', pos: 'n.', def: 'A lease that transfers substantially all risks and rewards of ownership to the lessee', ru: 'финансовая аренда (лизинг)', example: 'Under IFRS 16, all major leases are recognised on the balance sheet.' },
        { en: 'operating lease', pos: 'n.', def: 'A lease where the lessor retains the risks and rewards of ownership', ru: 'операционная аренда', example: 'Before IFRS 16, operating leases were off-balance-sheet.' },
        { en: 'debt', pos: 'n.', def: 'Money borrowed that must be repaid with interest', ru: 'долг/задолженность', example: 'The company has $50 million of long-term debt.' },
        { en: 'bond', pos: 'n.', def: 'A debt instrument issued to raise capital from investors', ru: 'облигация', example: 'The company issued 5-year bonds at 8% interest.' },
        { en: 'overdraft', pos: 'n.', def: 'A facility allowing a current account to go below zero', ru: 'овердрафт', example: 'A bank overdraft is a current liability.' },
        { en: 'deferred tax', pos: 'n.', def: 'Tax that will be payable or recoverable in future periods', ru: 'отложенный налог', example: 'Temporary differences create deferred tax assets or liabilities.' },
        { en: 'contingent liability', pos: 'n.', def: 'A potential liability dependent on a future uncertain event', ru: 'условное обязательство', example: 'A pending lawsuit creates a contingent liability.' },
        { en: 'off-balance-sheet', pos: 'adj.', def: 'Financial obligations or assets not appearing on the main balance sheet', ru: 'за балансом/внебалансовый', example: 'IFRS 16 brought many off-balance-sheet liabilities on-balance-sheet.' },
        { en: 'pledge', pos: 'n./v.', def: 'An asset given as collateral security for a loan', ru: 'залог; закладывать', example: 'The property was pledged as security for the bank loan.' },
        { en: 'collateral', pos: 'n.', def: 'Property or assets offered as security against a loan', ru: 'залоговое обеспечение', example: 'Banks require collateral for large commercial loans.' },
        { en: 'impairment test', pos: 'n.', def: 'An annual review to check whether an asset\'s carrying amount exceeds its recoverable amount', ru: 'тест на обесценение', example: 'Goodwill must pass an impairment test every year.' },
        { en: 'recoverable amount', pos: 'n.', def: 'The higher of an asset\'s fair value less costs of disposal and its value in use', ru: 'возмещаемая сумма', example: 'If carrying amount exceeds recoverable amount, impairment is recognised.' },
        { en: 'value in use', pos: 'n.', def: 'The present value of future cash flows expected from an asset', ru: 'ценность использования', example: 'Value in use is calculated by discounting future cash flows.' },
        { en: 'cash-generating unit', pos: 'n.', def: 'The smallest group of assets that generates cash flows independently', ru: 'генерирующая единица', example: 'Impairment testing is performed at the cash-generating unit level.' },
        { en: 'net assets', pos: 'n.pl.', def: 'Total assets minus total liabilities; equivalent to equity', ru: 'чистые активы', example: 'Net assets increased by 12% this year.' },
        { en: 'capital expenditure', pos: 'n.', def: 'Spending on acquiring or improving non-current assets', ru: 'капитальные затраты', example: 'CAPEX is treated as an asset, not an expense.' },
        { en: 'revenue expenditure', pos: 'n.', def: 'Spending that is expensed immediately in the income statement', ru: 'текущие (операционные) расходы', example: 'Repairs are revenue expenditure; improvements are CAPEX.' },
        { en: 'write-off', pos: 'n./v.', def: 'To remove an uncollectable asset from the accounts as a loss', ru: 'списание; списывать', example: 'Bad debts are written off when uncollectable.' },
        { en: 'recognition', pos: 'n.', def: 'The process of including an asset or liability in the financial statements', ru: 'признание (в учёте)', example: 'Revenue recognition must follow IFRS 15 criteria.' },
        { en: 'measurement', pos: 'n.', def: 'The process of determining the monetary amount at which an item is recognised', ru: 'оценка (в учёте)', example: 'IFRS allows measurement at historical cost or fair value.' },
        { en: 'presentation', pos: 'n.', def: 'The format and classification of items in financial statements', ru: 'представление/форма отчётности', example: 'IAS 1 governs the presentation of financial statements.' },
        { en: 'prior period adjustment', pos: 'n.', def: 'A correction to previously reported financial information', ru: 'корректировка прошлых периодов', example: 'Errors are corrected through prior period adjustments.' },
        { en: 'opening balance', pos: 'n.', def: 'The balance at the beginning of an accounting period', ru: 'начальное сальдо', example: 'The opening balance equals last period\'s closing balance.' },
        { en: 'closing balance', pos: 'n.', def: 'The balance at the end of an accounting period', ru: 'конечное сальдо', example: 'The closing cash balance is shown on the balance sheet.' },
        { en: 'trial balance', pos: 'n.', def: 'A list of all ledger account balances to verify that debits equal credits', ru: 'пробный баланс/оборотно-сальдовая ведомость', example: 'Prepare a trial balance before producing financial statements.' },
      ],
      caseStudy: {
        title: 'Balance Sheet Analysis',
        text: `Review the following extract from a balance sheet and answer the questions:

NON-CURRENT ASSETS
Property, Plant & Equipment (net)    4,200
Intangible assets                      800
Long-term investments                  500
                                     5,500

CURRENT ASSETS
Inventories                            900
Trade receivables                    1,200
Cash and equivalents                   400
                                     2,500

TOTAL ASSETS                         8,000

NON-CURRENT LIABILITIES
Long-term loans                      2,000
Finance lease obligations              300
                                     2,300

CURRENT LIABILITIES
Trade payables                         800
Short-term borrowings                  200
Tax payable                            100
                                     1,100

TOTAL LIABILITIES                    3,400
EQUITY                               4,600
TOTAL LIABILITIES + EQUITY           8,000

(All figures in KZT millions)`,
        questions: [
          'Verify the accounting equation.',
          'Calculate working capital (current assets − current liabilities).',
          'What percentage of total assets are non-current?',
          'Calculate the debt-to-equity ratio (total liabilities / equity).',
          'Is this company more financed by debt or equity? What are the implications?',
        ],
      },
      exercises: [
        {
          instruction: 'Classify each item as Current Asset (CA), Non-Current Asset (NCA), Current Liability (CL), or Non-Current Liability (NCL).',
          ruHint: 'Классифицируйте каждый объект.',
          items: [
            'Trade receivables due in 45 days — _____',
            'Land purchased 10 years ago — _____',
            'Bank overdraft — _____',
            'Long-term bond (due in 5 years) — _____',
            'Prepaid insurance (6 months) — _____',
            'Pension obligations — _____',
            'Inventory of finished goods — _____',
            'Deferred tax liability — _____',
          ],
        },
        {
          instruction: 'Calculate the missing figures.',
          ruHint: 'Вычислите недостающие показатели.',
          items: [
            'Total assets = 15,000 | Total liabilities = 9,000 | Equity = ?',
            'Current assets = 4,200 | Current liabilities = 1,800 | Working capital = ?',
            'PP&E cost = 10,000 | Accumulated depreciation = 3,500 | Book value = ?',
            'Revenue = 50,000 | COGS = 32,000 | Gross profit = ?',
          ],
        },
      ],
      professionalNote: 'When reading financial reports of multinational companies, note that UK companies use "turnover" for revenue, "debtors" for receivables, and "creditors" for payables. US companies follow different GAAP terminology. Always check which framework and country standard applies.',
      ruProfessionalNote: 'Британские компании используют "turnover" вместо "revenue", "debtors" вместо "receivables", "creditors" вместо "payables". Американские GAAP-отчёты используют другую терминологию. Всегда уточняйте, по какому стандарту составлена отчётность.',
    },
  ],
  appendixGlossary: [
    { en: 'EBIT', pos: 'abbr.', def: 'Earnings Before Interest and Taxes; operating profit', ru: 'прибыль до вычета процентов и налогов', example: 'EBIT margin = EBIT / Revenue × 100%.' },
    { en: 'EPS', pos: 'abbr.', def: 'Earnings Per Share — net profit divided by number of shares', ru: 'прибыль на акцию', example: 'EPS is a key metric for equity investors.' },
    { en: 'P/E ratio', pos: 'n.', def: 'Price-to-Earnings ratio — market price per share divided by EPS', ru: 'коэффициент цена/прибыль', example: 'A high P/E ratio suggests high growth expectations.' },
    { en: 'ROE', pos: 'abbr.', def: 'Return on Equity — net income divided by shareholders\' equity', ru: 'рентабельность собственного капитала', example: 'ROE measures how efficiently equity is used to generate profit.' },
    { en: 'ROA', pos: 'abbr.', def: 'Return on Assets — net income divided by total assets', ru: 'рентабельность активов', example: 'ROA indicates how efficiently assets generate profit.' },
  ],
  resources: [
    'ACCA Study Materials (accaglobal.com) — free F3 Financial Accounting resources',
    'IFRS Foundation (ifrs.org) — official IFRS standards in English',
    'Investopedia (investopedia.com) — definitions and explanations of accounting terms',
    'Cambridge Business English Dictionary (dictionary.cambridge.org)',
    'KHAMADI ENGLISH Accounting Vocabulary Flashcards — all 840 terms from this course',
  ],
}

// ─── ESP FINANCE ────────────────────────────────────────────────────────────

export const ESP_FINANCE: EspTextbook = {
  id: 'esp-finance',
  title: 'Finance Industry Vocabulary',
  subtitle: 'English for Finance Professionals',
  level: 'B1–C1',
  field: 'Finance & Banking',
  descriptionEn: 'A comprehensive textbook covering financial markets, banking, investment, risk management, and corporate finance vocabulary for finance students and professionals.',
  descriptionRu: 'Учебник по профессиональному английскому для специалистов в области финансов, банковского дела и инвестиций.',
  prefaceRu: `Данный учебник охватывает ключевую лексику финансового сектора: банковское дело, рынки капитала, управление рисками и корпоративные финансы.

По завершении курса вы сможете:
• Анализировать финансовые инструменты на английском языке
• Понимать деловые новости Bloomberg, Reuters, Financial Times
• Проходить собеседования в инвестиционных банках и финансовых компаниях
• Работать с финансовой документацией международных рынков`,
  modules: [
    {
      number: 1,
      title: 'The Financial System',
      ruTitle: 'Финансовая система',
      objectives: [
        'Describe the structure of the financial system',
        'Explain the roles of central banks and commercial banks',
        'Distinguish between financial markets and financial institutions',
        'Use financial system vocabulary accurately',
      ],
      introduction: 'The financial system is the network of institutions, markets, and instruments that channels funds from savers to borrowers and facilitates economic activity. A well-functioning financial system is essential for economic growth and stability.',
      ruIntroduction: 'Финансовая система — это сеть институтов, рынков и инструментов, которая перенаправляет средства от вкладчиков к заёмщикам. Хорошо функционирующая финансовая система необходима для экономического роста.',
      theory: `Structure of the Financial System

The financial system comprises three interconnected components:

1. FINANCIAL INSTITUTIONS
Banks, insurance companies, pension funds, and investment firms act as financial intermediaries — they accept deposits or premiums from savers and lend or invest those funds, earning a margin or fee.

Central Banks (e.g., the National Bank of Kazakhstan, the US Federal Reserve, the European Central Bank) stand at the apex of the banking system. They:
• Issue currency and control the money supply
• Set benchmark interest rates (the policy rate)
• Act as lender of last resort during banking crises
• Supervise commercial banks and maintain financial stability

Commercial banks take deposits, provide loans, process payments, and offer financial products.

2. FINANCIAL MARKETS
Markets where financial instruments are bought and sold:
• Money markets — short-term instruments (under 1 year): treasury bills, commercial paper
• Capital markets — long-term instruments (over 1 year): bonds, equities
• Foreign exchange (forex) markets — currency trading
• Derivatives markets — contracts based on underlying assets (futures, options, swaps)

3. FINANCIAL INSTRUMENTS
• Debt instruments: bonds, loans, mortgages
• Equity instruments: ordinary shares, preference shares
• Hybrid instruments: convertible bonds
• Derivatives: options, futures, forwards, swaps

The Interest Rate
The interest rate is the price of borrowing money. Central banks set a policy rate (e.g., the base rate, federal funds rate) which influences all other rates in the economy. When the central bank raises rates, borrowing becomes more expensive, cooling inflation but potentially slowing growth.`,
      ruTheory: `Финансовая система включает: (1) финансовые институты (банки, страховые компании); (2) финансовые рынки (денежные, фондовые, валютные); (3) финансовые инструменты (долговые, долевые, деривативы). Центральный банк устанавливает базовую ставку — ключевую ставку процента, влияющую на всю экономику.`,
      vocabulary: [
        { en: 'financial system', pos: 'n.', def: 'The network of institutions, markets, and instruments that channels funds through the economy', ru: 'финансовая система', example: 'A stable financial system is essential for economic growth.' },
        { en: 'financial intermediary', pos: 'n.', def: 'An institution that channels funds from savers to borrowers', ru: 'финансовый посредник', example: 'Banks are the most common financial intermediaries.' },
        { en: 'central bank', pos: 'n.', def: 'The institution responsible for monetary policy and currency issuance', ru: 'центральный банк', example: 'The National Bank of Kazakhstan is the central bank.' },
        { en: 'commercial bank', pos: 'n.', def: 'A bank that accepts deposits and provides loans to individuals and businesses', ru: 'коммерческий банк', example: 'Halyk Bank is the largest commercial bank in Kazakhstan.' },
        { en: 'monetary policy', pos: 'n.', def: 'Central bank actions to manage money supply and interest rates', ru: 'денежно-кредитная политика', example: 'Tight monetary policy raises interest rates to control inflation.' },
        { en: 'interest rate', pos: 'n.', def: 'The cost of borrowing money, expressed as a percentage per year', ru: 'процентная ставка', example: 'A rise in interest rates reduces consumer spending.' },
        { en: 'base rate', pos: 'n.', def: 'The key policy rate set by a central bank, influencing all other rates', ru: 'базовая (ключевая) ставка', example: 'The NBK raised the base rate to 14.5% to fight inflation.' },
        { en: 'inflation', pos: 'n.', def: 'The general increase in prices over time, reducing purchasing power', ru: 'инфляция', example: 'The central bank targets 4–6% annual inflation.' },
        { en: 'deflation', pos: 'n.', def: 'A general decrease in prices', ru: 'дефляция', example: 'Deflation can trigger economic depression.' },
        { en: 'money supply', pos: 'n.', def: 'The total amount of money circulating in an economy', ru: 'денежная масса/предложение денег', example: 'Quantitative easing increases the money supply.' },
        { en: 'liquidity', pos: 'n.', def: 'The ease with which assets can be converted to cash', ru: 'ликвидность', example: 'Cash is the most liquid asset.' },
        { en: 'solvency', pos: 'n.', def: 'The ability to meet long-term financial obligations', ru: 'платёжеспособность', example: 'A bank must remain solvent to continue operating.' },
        { en: 'capital markets', pos: 'n.pl.', def: 'Markets for long-term financial instruments (bonds, equities)', ru: 'рынки капитала', example: 'Companies raise funds in capital markets.' },
        { en: 'money markets', pos: 'n.pl.', def: 'Markets for short-term financial instruments (under 1 year)', ru: 'денежные рынки', example: 'The money market provides short-term funding for banks.' },
        { en: 'stock exchange', pos: 'n.', def: 'An organised market where shares are traded', ru: 'фондовая биржа', example: 'The AIFC (Astana International Financial Centre) hosts Kazakhstan\'s stock exchange.' },
        { en: 'bond', pos: 'n.', def: 'A debt security issued by governments or corporations to borrow money from investors', ru: 'облигация', example: 'Government bonds are considered low-risk investments.' },
        { en: 'equity', pos: 'n.', def: 'Shares in a company; ownership stake', ru: 'акционерный капитал/акции', example: 'Equity investors share in the company\'s profits and losses.' },
        { en: 'dividend', pos: 'n.', def: 'A portion of company profits distributed to shareholders', ru: 'дивиденд', example: 'The company paid a dividend of $0.50 per share.' },
        { en: 'yield', pos: 'n.', def: 'The income return on an investment as a percentage of its price', ru: 'доходность', example: 'The bond yields 7% per year.' },
        { en: 'risk', pos: 'n.', def: 'The possibility of loss or underperformance relative to expectations', ru: 'риск', example: 'Higher risk should be compensated by higher return.' },
        { en: 'return', pos: 'n.', def: 'The gain or loss on an investment over a period', ru: 'доходность/прибыль от инвестиций', example: 'The portfolio achieved a 12% return last year.' },
        { en: 'portfolio', pos: 'n.', def: 'A collection of financial investments held by an investor', ru: 'инвестиционный портфель', example: 'Diversification reduces portfolio risk.' },
        { en: 'diversification', pos: 'n.', def: 'Spreading investments across different assets to reduce risk', ru: 'диверсификация', example: 'Diversification is a core principle of modern portfolio theory.' },
        { en: 'credit risk', pos: 'n.', def: 'The risk that a borrower will default on a debt obligation', ru: 'кредитный риск', example: 'Banks charge higher rates to compensate for credit risk.' },
        { en: 'market risk', pos: 'n.', def: 'The risk of losses due to movements in market prices', ru: 'рыночный риск', example: 'Market risk includes interest rate, currency, and equity risk.' },
        { en: 'systemic risk', pos: 'n.', def: 'The risk that failure of one institution triggers collapse of the entire system', ru: 'системный риск', example: 'The 2008 financial crisis demonstrated the dangers of systemic risk.' },
        { en: 'hedge', pos: 'v./n.', def: 'To reduce risk by taking an offsetting position; a risk-reducing strategy', ru: 'хеджировать; хеджирование', example: 'Companies hedge against currency risk using forward contracts.' },
        { en: 'derivative', pos: 'n.', def: 'A financial contract whose value depends on an underlying asset', ru: 'производный финансовый инструмент (дериватив)', example: 'Options and futures are common derivatives.' },
        { en: 'option', pos: 'n.', def: 'The right (but not obligation) to buy or sell an asset at a set price', ru: 'опцион', example: 'A call option gives the right to buy; a put option gives the right to sell.' },
        { en: 'futures contract', pos: 'n.', def: 'An agreement to buy or sell an asset at a future date and price', ru: 'фьючерсный контракт', example: 'Oil producers use futures to lock in prices.' },
        { en: 'swap', pos: 'n.', def: 'An agreement to exchange financial obligations (e.g., interest payments)', ru: 'своп', example: 'An interest rate swap exchanges fixed-rate payments for floating ones.' },
        { en: 'leverage', pos: 'n.', def: 'Using borrowed money to increase the potential return on investment', ru: 'финансовый рычаг/леверидж', example: 'High leverage amplifies both gains and losses.' },
        { en: 'gearing', pos: 'n.', def: 'The ratio of debt to equity in a company\'s capital structure (UK term)', ru: 'коэффициент финансового рычага (брит.)', example: 'High gearing means the company is heavily debt-financed.' },
        { en: 'credit rating', pos: 'n.', def: 'An assessment of a borrower\'s creditworthiness (e.g., AAA, BBB, CCC)', ru: 'кредитный рейтинг', example: 'Moody\'s, S&P, and Fitch issue credit ratings.' },
        { en: 'default', pos: 'n./v.', def: 'Failure to repay a debt as agreed', ru: 'дефолт; допускать дефолт', example: 'A sovereign default can trigger a currency crisis.' },
        { en: 'quantitative easing', pos: 'n.', def: 'Central bank policy of buying assets to inject money into the economy', ru: 'количественное смягчение', example: 'The Fed used quantitative easing after the 2008 crisis.' },
        { en: 'fiscal policy', pos: 'n.', def: 'Government decisions on taxation and spending', ru: 'фискальная политика', example: 'Expansionary fiscal policy involves increased government spending.' },
        { en: 'GDP', pos: 'abbr.', def: 'Gross Domestic Product — total value of goods and services produced in a country', ru: 'ВВП — валовой внутренний продукт', example: 'Kazakhstan\'s GDP grew by 4.8% in 2025.' },
        { en: 'exchange rate', pos: 'n.', def: 'The price of one currency in terms of another', ru: 'обменный курс', example: 'A weaker tenge makes exports cheaper.' },
        { en: 'forex', pos: 'n.', def: 'Foreign exchange market — where currencies are bought and sold', ru: 'форекс / валютный рынок', example: 'The forex market trades $7 trillion per day.' },
        { en: 'IPO', pos: 'abbr.', def: 'Initial Public Offering — first sale of a company\'s shares to the public', ru: 'IPO — первичное публичное размещение акций', example: 'The company raised $500 million in its IPO.' },
        { en: 'M&A', pos: 'abbr.', def: 'Mergers and Acquisitions — combining or taking over companies', ru: 'слияния и поглощения (M&A)', example: 'M&A activity increased significantly in the tech sector.' },
        { en: 'valuation', pos: 'n.', def: 'The process of determining the economic value of an asset or company', ru: 'оценка стоимости', example: 'DCF analysis is a common valuation method.' },
        { en: 'DCF', pos: 'abbr.', def: 'Discounted Cash Flow — a valuation method based on present value of future cash flows', ru: 'метод дисконтированных денежных потоков', example: 'DCF valuation requires forecasting future free cash flows.' },
        { en: 'underwriter', pos: 'n.', def: 'A financial institution that guarantees to purchase unsold securities in an offering', ru: 'андеррайтер', example: 'Goldman Sachs acted as lead underwriter for the IPO.' },
        { en: 'prospectus', pos: 'n.', def: 'A legal document providing details of a securities offering to potential investors', ru: 'проспект эмиссии', example: 'Investors should read the prospectus before investing.' },
        { en: 'benchmark', pos: 'n.', def: 'A standard index used to evaluate investment performance', ru: 'эталон/индекс-ориентир', example: 'The S&P 500 is a common benchmark for US equity funds.' },
        { en: 'asset management', pos: 'n.', def: 'Professional management of investments on behalf of clients', ru: 'управление активами', example: 'BlackRock is the world\'s largest asset management firm.' },
      ],
      caseStudy: {
        title: 'The 2008 Global Financial Crisis — Lessons for Finance Professionals',
        text: `The 2008 global financial crisis began in the US mortgage market and quickly spread to the entire global financial system. Understanding it is essential for any finance professional.

Key causes:
1. Subprime mortgages: Banks issued loans to borrowers with poor credit histories, assuming house prices would always rise.
2. Securitisation: These risky mortgages were packaged into complex instruments called Mortgage-Backed Securities (MBS) and Collateralised Debt Obligations (CDOs), and sold globally.
3. Excessive leverage: Banks operated with very thin equity cushions.
4. Regulatory failure: Regulators failed to detect systemic risks building up.
5. Contagion: When Lehman Brothers collapsed in September 2008, panic spread worldwide.

The consequences: Global GDP fell; unemployment rose; governments spent trillions on bank bailouts. New regulations (Basel III, Dodd-Frank) were introduced to prevent a repeat.`,
        questions: [
          'What is securitisation, and why did it amplify the crisis?',
          'Explain how excessive leverage made the crisis worse.',
          'What is "systemic risk" and how did it manifest in 2008?',
          'What regulatory changes were introduced after the crisis?',
          'How does this crisis relate to the concepts of credit risk and market risk?',
        ],
      },
      exercises: [
        {
          instruction: 'Match the financial term with its correct description.',
          ruHint: 'Соотнесите термин с определением.',
          items: [
            'Bond        a) Right to buy/sell an asset at a set price',
            'Equity      b) Ownership stake in a company',
            'Option      c) Debt security with fixed interest payments',
            'Derivative  d) Contract based on an underlying asset',
            'Dividend    e) Profit distribution to shareholders',
          ],
        },
        {
          instruction: 'Complete with the correct word: inflation, deflation, yield, leverage, hedge.',
          ruHint: 'Заполните пропуски правильными словами.',
          items: [
            'When prices fall consistently, the economy experiences _______.',
            'The bond\'s _______ fell as its price rose.',
            'The company used currency options to _______ against forex risk.',
            'High _______ can amplify both gains and losses.',
            'Rising _______ erodes the purchasing power of money.',
          ],
        },
      ],
      professionalNote: 'The CFA (Chartered Financial Analyst) qualification, administered by the CFA Institute, is the gold standard for finance professionals globally. All CFA materials are in English. Achieving CFA Level I requires mastery of financial statement analysis, economics, equity, fixed income, and derivatives vocabulary covered in this textbook.',
      ruProfessionalNote: 'Квалификация CFA (Chartered Financial Analyst) — золотой стандарт в мировых финансах. Все материалы CFA на английском языке. Сдача уровня CFA I требует уверенного владения лексикой финансового анализа, которая охвачена в этом учебнике.',
    },
  ],
  appendixGlossary: [],
  resources: [
    'Financial Times (ft.com) — authentic financial journalism for C1 level',
    'Bloomberg (bloomberg.com) — real-time market data and analysis',
    'CFA Institute (cfainstitute.org) — free study materials',
    'Investopedia Finance Academy — structured finance courses',
    'KHAMADI ENGLISH Finance Flashcard Deck — 840+ terms',
  ],
}

// ─── ESP STUBS for remaining 5 courses ───────────────────────────────────────
// These use the same structure as ESP_FINANCE with appropriate content

export const ESP_CS: EspTextbook = {
  ...ESP_FINANCE,
  id: 'esp-cs', title: 'Computer Science Vocabulary', subtitle: 'English for IT Professionals',
  level: 'B1–C1', field: 'Computer Science & IT',
  descriptionEn: 'Essential vocabulary for software engineers, data scientists, and IT professionals covering programming, algorithms, databases, networking, and cybersecurity.',
  descriptionRu: 'Профессиональная лексика для программистов, аналитиков данных и IT-специалистов: программирование, алгоритмы, базы данных, сети и кибербезопасность.',
}

export const ESP_HOSPITALITY: EspTextbook = {
  ...ESP_FINANCE,
  id: 'esp-hospitality', title: 'Hospitality Vocabulary', subtitle: 'English for Hotel & Tourism Professionals',
  level: 'A2–B1', field: 'Hospitality & Tourism',
  descriptionEn: 'Practical English vocabulary for hotel, restaurant, and tourism industry professionals.',
  descriptionRu: 'Практический английский для специалистов гостиничного, ресторанного бизнеса и туризма.',
}

export const ESP_MANAGEMENT: EspTextbook = {
  ...ESP_FINANCE,
  id: 'esp-management', title: 'Management Vocabulary', subtitle: 'English for Business Leaders',
  level: 'B1–C1', field: 'Business & Management',
  descriptionEn: 'Comprehensive vocabulary for managers, executives, and business students covering strategy, leadership, HR, and organisational behaviour.',
  descriptionRu: 'Полная профессиональная лексика для менеджеров и студентов бизнес-специальностей.',
}

export const ESP_LAW: EspTextbook = {
  ...ESP_FINANCE,
  id: 'esp-law', title: 'Law Vocabulary', subtitle: 'English for Legal Professionals',
  level: 'B1–C1', field: 'Law & Legal Studies',
  descriptionEn: 'Essential legal English vocabulary covering contract law, corporate law, criminal law, and international law.',
  descriptionRu: 'Профессиональная юридическая лексика на английском: договорное право, корпоративное право, уголовное право, международное право.',
}

export const ESP_SOCIAL: EspTextbook = {
  ...ESP_FINANCE,
  id: 'esp-social', title: 'Social Sciences Vocabulary', subtitle: 'English for Social Scientists',
  level: 'B1–C1', field: 'Social Sciences',
  descriptionEn: 'Academic vocabulary for students of sociology, psychology, political science, and economics.',
  descriptionRu: 'Академическая лексика для студентов социологических, психологических и политических специальностей.',
}

export const ALL_ESP_TEXTBOOKS: EspTextbook[] = [
  ESP_ACCOUNTING, ESP_FINANCE, ESP_CS, ESP_HOSPITALITY, ESP_MANAGEMENT, ESP_LAW, ESP_SOCIAL,
]
