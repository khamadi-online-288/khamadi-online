/**
 * Seed: Social Sciences B1 + Social Sciences B1-C1
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/seed-esp-social.ts
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 */

import * as fs from 'fs'
import * as path from 'path'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

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

const SOC_B1_ID   = '45800af0-cc5a-4787-bf49-a58bcfda9f1a'
const SOC_B1C1_ID = 'a1000000-0000-0000-0000-000000000011'

type W  = { en: string; ru: string }
type LD = { title: string; words: W[] }
type MD = { title: string; section: string; lessons: LD[] }

function w(en: string, ru: string): W { return { en, ru } }

// ─── Module 1 – Introduction to Social Sciences (B1) ─────────────────────────
const mod_intro: MD = {
  title: 'Introduction to Social Sciences', section: 'B1', lessons: [
    {
      title: 'Disciplines Overview',
      words: [
        w('social sciences','общественные науки'), w('sociology','социология'), w('psychology','психология'),
        w('political science','политология'), w('economics','экономика'), w('anthropology','антропология'),
        w('history','история'), w('geography','география'), w('criminology','криминология'),
        w('demography','демография'), w('social work','социальная работа'), w('interdisciplinary','междисциплинарный'),
        w('field of study','область исследования'), w('discipline','дисциплина'), w('methodology','методология'),
        w('theory','теория'), w('empirical','эмпирический'), w('academic','академический'),
        w('scholar','учёный'), w('research','исследование'), w('evidence','доказательство'),
        w('data','данные'), w('publication','публикация'), w('curriculum','учебная программа'),
        w('specialisation','специализация'),
      ],
    },
    {
      title: 'Society & Culture',
      words: [
        w('society','общество'), w('culture','культура'), w('community','сообщество'),
        w('social group','социальная группа'), w('identity','идентичность'), w('tradition','традиция'),
        w('custom','обычай'), w('subculture','субкультура'), w('multicultural','мультикультурный'),
        w('diversity','разнообразие'), w('integration','интеграция'), w('assimilation','ассимиляция'),
        w('cultural norm','культурная норма'), w('symbol','символ'), w('ritual','ритуал'),
        w('belief system','система убеждений'), w('collective identity','коллективная идентичность'),
        w('social cohesion','социальная сплочённость'), w('heritage','наследие'), w('globalisation','глобализация'),
        w('cultural exchange','культурный обмен'), w('value','ценность'), w('worldview','мировоззрение'),
        w('socialisation','социализация'), w('language','язык'),
      ],
    },
    {
      title: 'Norms & Values',
      words: [
        w('norm','норма'), w('value','ценность'), w('sanction','санкция'), w('taboo','табу'),
        w('conformity','конформизм'), w('deviance','девиантность'), w('moral','моральный'),
        w('ethical','этический'), w('social control','социальный контроль'),
        w('prescriptive norm','предписывающая норма'), w('descriptive norm','описательная норма'),
        w('internalise','усваивать'), w('peer pressure','давление сверстников'),
        w('enforcement','принуждение'), w('compliance','соблюдение норм'), w('violation','нарушение'),
        w('punishment','наказание'), w('reward','вознаграждение'),
        w('cultural relativism','культурный релятивизм'), w('ethnocentrism','этноцентризм'),
        w('role expectation','ролевое ожидание'), w('status','статус'), w('legitimate','законный'),
        w('socialise','социализировать'), w('norm violation','нарушение нормы'),
      ],
    },
    {
      title: 'Social Institutions',
      words: [
        w('institution','институт'), w('family','семья'), w('education system','система образования'),
        w('religion','религия'), w('government','правительство'), w('economy','экономика'),
        w('healthcare system','система здравоохранения'), w('mass media','средства массовой информации'),
        w('legal system','правовая система'), w('marriage','брак'), w('bureaucracy','бюрократия'),
        w('organisation','организация'), w('structure','структура'), w('function','функция'),
        w('manifest function','явная функция'), w('latent function','скрытая функция'),
        w('dysfunction','дисфункция'), w('social order','социальный порядок'), w('stability','стабильность'),
        w('authority','власть'), w('regulation','регулирование'), w('policy','политика'),
        w('legitimacy','легитимность'), w('formal institution','формальный институт'),
        w('informal institution','неформальный институт'),
      ],
    },
    {
      title: 'Socialisation',
      words: [
        w('socialisation','социализация'), w('primary socialisation','первичная социализация'),
        w('secondary socialisation','вторичная социализация'), w('agent of socialisation','агент социализации'),
        w('peer group','группа сверстников'), w('role model','образец для подражания'),
        w('identity formation','формирование идентичности'), w('gender role','гендерная роль'),
        w('self-concept','представление о себе'), w('development','развитие'), w('behaviour','поведение'),
        w('cultural transmission','культурная передача'), w('resocialisation','ресоциализация'),
        w('anticipatory socialisation','антиципирующая социализация'),
        w('total institution','тотальный институт'),
        w('symbolic interactionism','символический интеракционизм'),
        w('looking-glass self','зеркальное «я»'), w('significant other','значимый другой'),
        w('generalised other','обобщённый другой'), w('impression management','управление впечатлением'),
        w('stigma','стигма'), w('school','школа'), w('media','СМИ'),
        w('internalisation','интернализация норм'), w('family','семья'),
      ],
    },
    {
      title: 'Key Thinkers',
      words: [
        w('Auguste Comte','Огюст Конт'), w('Émile Durkheim','Эмиль Дюркгейм'),
        w('Max Weber','Макс Вебер'), w('Karl Marx','Карл Маркс'),
        w('Georg Simmel','Георг Зиммель'), w('Talcott Parsons','Талкотт Парсонс'),
        w('Robert Merton','Роберт Мёртон'), w('Erving Goffman','Ирвинг Гофман'),
        w('Michel Foucault','Мишель Фуко'), w('Pierre Bourdieu','Пьер Бурдьё'),
        w('Anthony Giddens','Энтони Гидденс'), w('W.E.B. Du Bois','У.Э.Б. Дюбуа'),
        w('positivism','позитивизм'), w('social fact','социальный факт'), w('anomie','аномия'),
        w('ideal type','идеальный тип'), w('verstehen','понимающая социология'),
        w('class conflict','классовый конфликт'),
        w('structural functionalism','структурный функционализм'),
        w('conflict theory','теория конфликта'),
        w('symbolic interactionism','символический интеракционизм'),
        w('sociological imagination','социологическое воображение'), w('paradigm','парадигма'),
        w('Harriet Martineau','Харриет Мартино'), w('Herbert Spencer','Герберт Спенсер'),
      ],
    },
  ],
}

// ─── Module 2 – Research Basics (B1) ─────────────────────────────────────────
const mod_research: MD = {
  title: 'Research Basics', section: 'B1', lessons: [
    {
      title: 'Research Questions',
      words: [
        w('research question','исследовательский вопрос'), w('problem statement','формулировка проблемы'),
        w('objective','цель'), w('scope','область охвата'), w('feasibility','осуществимость'),
        w('relevance','релевантность'), w('gap in research','пробел в исследовании'),
        w('conceptual framework','концептуальная рамка'), w('theoretical framework','теоретическая рамка'),
        w('variable','переменная'), w('dependent variable','зависимая переменная'),
        w('independent variable','независимая переменная'), w('hypothesis','гипотеза'),
        w('assumption','предположение'), w('operationalise','операционализировать'),
        w('define','определять'), w('clarify','уточнять'), w('narrow down','сузить'),
        w('broad question','широкий вопрос'), w('specific question','конкретный вопрос'),
        w('exploratory','исследовательский'), w('descriptive','описательный'),
        w('explanatory','объяснительный'), w('causal relationship','причинно-следственная связь'),
        w('research design','дизайн исследования'),
      ],
    },
    {
      title: 'Qualitative vs Quantitative',
      words: [
        w('qualitative','качественный'), w('quantitative','количественный'),
        w('mixed methods','смешанные методы'), w('narrative','нарративный'),
        w('numerical data','числовые данные'), w('subjective','субъективный'),
        w('objective','объективный'), w('interpretation','интерпретация'),
        w('measurement','измерение'), w('flexibility','гибкость'),
        w('generalisability','обобщаемость'), w('reliability','надёжность'),
        w('validity','валидность'), w('depth','глубина'), w('breadth','широта'),
        w('sample size','размер выборки'), w('statistical','статистический'),
        w('thematic analysis','тематический анализ'), w('content analysis','контент-анализ'),
        w('grounded theory','обоснованная теория'), w('triangulation','триангуляция'),
        w('positivism','позитивизм'), w('interpretivism','интерпретивизм'),
        w('paradigm','парадигма'), w('in-depth','углублённый'),
      ],
    },
    {
      title: 'Data Collection',
      words: [
        w('data collection','сбор данных'), w('primary data','первичные данные'),
        w('secondary data','вторичные данные'), w('observation','наблюдение'),
        w('participant observation','включённое наблюдение'), w('interview','интервью'),
        w('focus group','фокус-группа'), w('questionnaire','анкета'),
        w('ethnography','этнография'), w('field research','полевое исследование'),
        w('archival research','архивное исследование'), w('experiment','эксперимент'),
        w('longitudinal study','лонгитюдное исследование'),
        w('cross-sectional study','поперечное исследование'), w('systematic','систематический'),
        w('record','фиксировать'), w('transcribe','транскрибировать'), w('code','кодировать'),
        w('categorise','категоризировать'), w('raw data','необработанные данные'),
        w('dataset','набор данных'), w('saturation','насыщение данных'),
        w('reflexivity','рефлексивность'), w('access','доступ к данным'),
        w('gatekeeping','ограничение доступа'),
      ],
    },
    {
      title: 'Surveys',
      words: [
        w('survey','опрос'), w('questionnaire','анкета'), w('respondent','респондент'),
        w('closed question','закрытый вопрос'), w('open question','открытый вопрос'),
        w('Likert scale','шкала Лайкерта'), w('rating scale','рейтинговая шкала'),
        w('pilot study','пилотное исследование'), w('response rate','процент ответов'),
        w('self-report','самоотчёт'), w('online survey','онлайн-опрос'),
        w('representative','репрезентативный'), w('bias','смещение'),
        w('leading question','наводящий вопрос'), w('neutral','нейтральный'),
        w('distribute','распространять'), w('collect','собирать'), w('analyse','анализировать'),
        w('cross-tabulation','перекрёстная таблица'),
        w('frequency distribution','распределение частот'),
        w('social desirability bias','смещение социальной желательности'),
        w('non-response bias','смещение из-за неответов'), w('wording','формулировка вопроса'),
        w('pre-test','предварительное тестирование'), w('instrument','исследовательский инструмент'),
      ],
    },
    {
      title: 'Ethics',
      words: [
        w('ethics','этика'), w('informed consent','информированное согласие'),
        w('confidentiality','конфиденциальность'), w('anonymity','анонимность'),
        w('harm','вред'), w('deception','обман'), w('voluntary participation','добровольное участие'),
        w('withdrawal','отказ от участия'), w('vulnerable group','уязвимая группа'),
        w('ethics committee','этический комитет'),
        w('institutional review board','институциональный комитет по надзору'),
        w('debriefing','разъяснение после исследования'), w('privacy','конфиденциальность'),
        w('data protection','защита данных'), w('transparency','прозрачность'),
        w('integrity','честность'), w('reciprocity','взаимность'),
        w('power imbalance','дисбаланс власти'), w('coercion','принуждение'),
        w('compensation','вознаграждение участников'), w('risk assessment','оценка рисков'),
        w('beneficence','благотворность'), w('non-maleficence','непричинение вреда'),
        w('justice','справедливость'), w('professional standards','профессиональные стандарты'),
      ],
    },
    {
      title: 'Citation',
      words: [
        w('citation','цитирование'), w('reference','ссылка'), w('bibliography','список литературы'),
        w('APA style','стиль APA'), w('Harvard style','гарвардский стиль'),
        w('in-text citation','цитирование в тексте'), w('footnote','сноска'),
        w('endnote','концевая сноска'), w('source','источник'), w('author','автор'),
        w('publication date','дата публикации'), w('volume','том'), w('issue','выпуск'),
        w('page number','номер страницы'), w('DOI','цифровой идентификатор объекта'),
        w('URL','URL-адрес'), w('accessed date','дата обращения'), w('plagiarism','плагиат'),
        w('paraphrase','перефразировать'), w('direct quote','прямая цитата'),
        w('attribution','указание авторства'), w('academic integrity','академическая честность'),
        w('referencing software','программа для ссылок'), w('secondary source','вторичный источник'),
        w('primary source','первичный источник'),
      ],
    },
  ],
}

// ─── Module 3 – Sociology (B1) ───────────────────────────────────────────────
const mod_sociology: MD = {
  title: 'Sociology', section: 'B1', lessons: [
    {
      title: 'Social Class',
      words: [
        w('social class','социальный класс'), w('upper class','высший класс'),
        w('middle class','средний класс'), w('working class','рабочий класс'),
        w('lower class','низший класс'), w('socioeconomic status','социально-экономический статус'),
        w('income','доход'), w('wealth','богатство'), w('poverty','бедность'),
        w('inequality','неравенство'), w('social mobility','социальная мобильность'),
        w('upward mobility','восходящая мобильность'), w('downward mobility','нисходящая мобильность'),
        w('stratification','стратификация'), w('hierarchy','иерархия'), w('privilege','привилегия'),
        w('meritocracy','меритократия'), w('occupation','профессия'), w('education','образование'),
        w('life chances','жизненные шансы'), w('class consciousness','классовое сознание'),
        w('bourgeoisie','буржуазия'), w('proletariat','пролетариат'),
        w('cultural capital','культурный капитал'), w('social capital','социальный капитал'),
      ],
    },
    {
      title: 'Gender',
      words: [
        w('gender','гендер'), w('sex','биологический пол'), w('gender role','гендерная роль'),
        w('gender identity','гендерная идентичность'), w('masculinity','маскулинность'),
        w('femininity','феминность'), w('patriarchy','патриархат'), w('matriarchy','матриархат'),
        w('gender equality','гендерное равенство'), w('gender gap','гендерный разрыв'),
        w('sexism','сексизм'), w('discrimination','дискриминация'), w('stereotype','стереотип'),
        w('feminist','феминист'), w('hegemonic masculinity','гегемонная маскулинность'),
        w('gender binary','гендерная бинарность'), w('non-binary','небинарный'),
        w('transgender','трансгендерный'), w('gender pay gap','разрыв в оплате труда по полу'),
        w('glass ceiling','стеклянный потолок'), w('intersectionality','интерсекциональность'),
        w('gendered division of labour','гендерное разделение труда'),
        w('social construction','социальное конструирование'), w('agency','агентность'),
        w('empowerment','расширение прав и возможностей'),
      ],
    },
    {
      title: 'Race & Ethnicity',
      words: [
        w('race','раса'), w('ethnicity','этническая принадлежность'), w('racism','расизм'),
        w('ethnic group','этническая группа'), w('minority','меньшинство'),
        w('majority','большинство'), w('prejudice','предубеждение'),
        w('discrimination','дискриминация'), w('stereotype','стереотип'),
        w('segregation','сегрегация'), w('integration','интеграция'),
        w('multiculturalism','мультикультурализм'), w('colonialism','колониализм'),
        w('postcolonialism','постколониализм'), w('white privilege','белая привилегия'),
        w('institutional racism','институциональный расизм'), w('hate crime','преступление на почве ненависти'),
        w('ethnic identity','этническая идентичность'), w('diaspora','диаспора'),
        w('assimilation','ассимиляция'), w('xenophobia','ксенофобия'),
        w('cultural appropriation','культурное присвоение'), w('antiracism','антирасизм'),
        w('intersectionality','интерсекциональность'), w('representation','репрезентация'),
      ],
    },
    {
      title: 'Family',
      words: [
        w('nuclear family','нуклеарная семья'), w('extended family','расширенная семья'),
        w('single-parent family','неполная семья'), w('marriage','брак'), w('divorce','развод'),
        w('cohabitation','сожительство'), w('parenthood','родительство'), w('kinship','родство'),
        w('household','домохозяйство'), w('domestic violence','домашнее насилие'),
        w('family structure','структура семьи'), w('gender role','гендерная роль'),
        w('socialisation','социализация'), w('child-rearing','воспитание детей'),
        w('birth rate','рождаемость'), w('family values','семейные ценности'),
        w('reconstituted family','восстановленная семья'), w('same-sex family','однополая семья'),
        w('dependency','зависимость'), w('caregiver','опекун'), w('authority','авторитет'),
        w('breadwinner','кормилец'), w('generation','поколение'),
        w('family dynamics','динамика семьи'), w('family','семья'),
      ],
    },
    {
      title: 'Education',
      words: [
        w('education','образование'), w('curriculum','учебная программа'), w('literacy','грамотность'),
        w('numeracy','счётные навыки'), w('achievement','успеваемость'),
        w('attainment gap','разрыв в успеваемости'),
        w('social reproduction','социальное воспроизводство'),
        w('hidden curriculum','скрытый учебный план'), w('streaming','распределение по способностям'),
        w('labelling','навешивание ярлыков'),
        w('self-fulfilling prophecy','самосбывающееся пророчество'),
        w('educational inequality','образовательное неравенство'),
        w('access to education','доступ к образованию'), w('grade','оценка'),
        w('examination','экзамен'), w('university','университет'),
        w('vocational training','профессиональное обучение'),
        w('lifelong learning','непрерывное образование'), w('meritocracy','меритократия'),
        w('privatisation','приватизация'), w('marketisation','маркетизация'),
        w('inclusive education','инклюзивное образование'), w('school','школа'),
        w('teacher','учитель'), w('student','ученик'),
      ],
    },
    {
      title: 'Deviance',
      words: [
        w('deviance','девиантность'), w('crime','преступление'), w('social control','социальный контроль'),
        w('sanction','санкция'), w('formal sanction','формальная санкция'),
        w('informal sanction','неформальная санкция'), w('labelling theory','теория навешивания ярлыков'),
        w('stigma','стигма'), w('moral panic','моральная паника'),
        w('strain theory','теория напряжения'), w('anomie','аномия'),
        w('subcultural theory','субкультурная теория'),
        w('differential association','дифференцированная ассоциация'),
        w('recidivism','рецидивизм'), w('rehabilitation','реабилитация'),
        w('punishment','наказание'), w('deterrence','сдерживание'),
        w('incarceration','заключение под стражу'), w('conformity','конформизм'),
        w('non-conformity','нонконформизм'), w('rule-breaking','нарушение правил'),
        w('folk devil','народный дьявол'), w('norm violation','нарушение нормы'),
        w('restorative justice','восстановительное правосудие'), w('social deviant','социальный девиант'),
      ],
    },
  ],
}

// ─── Module 4 – Academic Writing Basics (B1) ─────────────────────────────────
const mod_writing: MD = {
  title: 'Academic Writing Basics', section: 'B1', lessons: [
    {
      title: 'Essay Structure',
      words: [
        w('essay','эссе'), w('introduction','введение'), w('body paragraph','основной абзац'),
        w('conclusion','заключение'), w('thesis statement','тезисное утверждение'),
        w('argument','аргумент'), w('evidence','доказательство'), w('topic sentence','тематическое предложение'),
        w('transition','переход'), w('outline','план'), w('structure','структура'),
        w('coherence','связность'), w('cohesion','связность текста'), w('word limit','ограничение по словам'),
        w('academic tone','академический тон'), w('formal language','формальный язык'),
        w('analytical','аналитический'), w('critically evaluate','критически оценивать'),
        w('discuss','обсуждать'), w('compare','сравнивать'), w('contrast','противопоставлять'),
        w('define','определять'), w('illustrate','иллюстрировать'),
        w('summarise','резюмировать'), w('evaluate','оценивать'),
      ],
    },
    {
      title: 'Paragraphing',
      words: [
        w('paragraph','абзац'), w('topic sentence','тематическое предложение'),
        w('supporting sentence','поддерживающее предложение'),
        w('concluding sentence','заключительное предложение'), w('indent','отступ'),
        w('linking word','связующее слово'), w('furthermore','кроме того'),
        w('however','однако'), w('therefore','следовательно'), w('in contrast','в противоположность'),
        w('for instance','например'), w('as a result','в результате'),
        w('nevertheless','тем не менее'), w('additionally','дополнительно'),
        w('in conclusion','в заключение'), w('coherence','связность'), w('unity','единство'),
        w('development','развитие мысли'), w('transition','переход'), w('signpost','сигнальное слово'),
        w('emphasis','акцент'), w('sequence','последовательность'),
        w('logical flow','логическое течение'), w('paragraph length','длина абзаца'),
        w('sub-topic','подтема'),
      ],
    },
    {
      title: 'Thesis Statements',
      words: [
        w('thesis statement','тезисное утверждение'), w('claim','утверждение'),
        w('argument','аргумент'), w('position','позиция'), w('stance','точка зрения'),
        w('debatable','спорный'), w('specific','конкретный'), w('focused','сфокусированный'),
        w('road map','план изложения'), w('assertive','утвердительный'), w('refine','уточнять'),
        w('revise','пересматривать'), w('draft','черновик'), w('clear','чёткий'),
        w('concise','лаконичный'), w('arguable','доказуемый'), w('support','поддерживать'),
        w('evidence','доказательство'), w('develop','развивать'), w('main idea','главная идея'),
        w('controlling idea','управляющая идея'), w('complexity','сложность'),
        w('nuance','нюанс'), w('scope','охват'), w('introductory paragraph','вводный абзац'),
      ],
    },
    {
      title: 'Referencing',
      words: [
        w('referencing','оформление ссылок'), w('citation style','стиль цитирования'),
        w('bibliography','список литературы'), w('reference list','список источников'),
        w('in-text citation','цитирование в тексте'), w('author','автор'),
        w('year of publication','год публикации'), w('title','название'),
        w('publisher','издатель'), w('journal article','статья в журнале'),
        w('book chapter','глава книги'), w('website','веб-сайт'), w('accessed','дата доступа'),
        w('edition','издание'), w('editor','редактор'), w('volume','том'),
        w('issue','выпуск'), w('page range','диапазон страниц'), w('DOI','DOI'),
        w('URL','URL'), w('alphabetical order','алфавитный порядок'),
        w('hanging indent','висячий отступ'), w('Zotero','Zotero'), w('EndNote','EndNote'),
        w('plagiarism checker','программа проверки плагиата'),
      ],
    },
    {
      title: 'Paraphrasing',
      words: [
        w('paraphrase','перефразировать'), w('summarise','резюмировать'),
        w('synthesise','синтезировать'), w('reword','передать своими словами'),
        w('rephrase','перефразировать'), w('change structure','изменить структуру'),
        w('synonym','синоним'), w('original source','оригинальный источник'),
        w('own words','собственными словами'), w('citation','цитирование'),
        w('plagiarism','плагиат'), w('acknowledge','признавать'), w('meaning','смысл'),
        w('retain','сохранять'), w('omit','опускать'), w('abbreviate','сокращать'),
        w('key idea','ключевая идея'), w('restate','переформулировать'),
        w('condense','сжимать'), w('avoid copying','избегать копирования'),
        w('integrate','интегрировать'), w('quote','цитата'), w('block quote','блочная цитата'),
        w('ellipsis','многоточие пропуска'), w('brackets','квадратные скобки'),
      ],
    },
    {
      title: 'Vocabulary',
      words: [
        w('academic vocabulary','академическая лексика'),
        w('discipline-specific','дисциплинарно-специфичный'), w('define','определять'),
        w('concept','концепция'), w('term','термин'), w('abstract noun','отвлечённое существительное'),
        w('nominalisation','номинализация'), w('hedging language','хеджирующий язык'),
        w('cautious language','осторожный язык'), w('formal register','формальный регистр'),
        w('informal','неформальный'), w('colloquial','разговорный'), w('precise','точный'),
        w('ambiguous','неоднозначный'), w('implication','импликация'),
        w('connotation','коннотация'), w('denotation','денотация'), w('frequency','частотность'),
        w('context','контекст'), w('usage','употребление'), w('collocate','сочетаться'),
        w('collocation','коллокация'), w('prefix','приставка'), w('suffix','суффикс'),
        w('root word','корневое слово'),
      ],
    },
  ],
}

// ─── Module 5 – Psychology (B2) ──────────────────────────────────────────────
const mod_psychology: MD = {
  title: 'Psychology', section: 'B2', lessons: [
    {
      title: 'Behaviour & Cognition',
      words: [
        w('behaviour','поведение'), w('cognition','познание'), w('cognitive process','когнитивный процесс'),
        w('thinking','мышление'), w('reasoning','рассуждение'), w('problem-solving','решение проблем'),
        w('decision-making','принятие решений'), w('attention','внимание'),
        w('information processing','обработка информации'), w('schema','схема'),
        w('cognitive bias','когнитивное искажение'), w('heuristic','эвристика'),
        w('rational','рациональный'), w('irrational','иррациональный'),
        w('conscious','сознательный'), w('unconscious','бессознательный'),
        w('stimulus','стимул'), w('response','реакция'), w('conditioning','обусловливание'),
        w('reinforcement','подкрепление'), w('operant conditioning','оперантное обусловливание'),
        w('classical conditioning','классическое обусловливание'),
        w('mental representation','ментальное представление'),
        w('executive function','исполнительная функция'), w('metacognition','метакогниция'),
      ],
    },
    {
      title: 'Personality',
      words: [
        w('personality','личность'), w('trait','черта личности'),
        w('Big Five personality traits','Большая пятёрка черт личности'),
        w('openness','открытость опыту'), w('conscientiousness','добросовестность'),
        w('extraversion','экстраверсия'), w('agreeableness','доброжелательность'),
        w('neuroticism','невротизм'), w('introvert','интроверт'), w('extrovert','экстраверт'),
        w('temperament','темперамент'), w('self-esteem','самооценка'),
        w('self-efficacy','самоэффективность'), w('locus of control','локус контроля'),
        w('psychoanalysis','психоанализ'), w('ego','эго'), w('id','ид'),
        w('superego','супер-эго'), w('defence mechanism','защитный механизм'),
        w('projection','проекция'), w('repression','вытеснение'),
        w('personality disorder','расстройство личности'), w('narcissism','нарциссизм'),
        w('emotional intelligence','эмоциональный интеллект'), w('resilience','устойчивость'),
      ],
    },
    {
      title: 'Motivation',
      words: [
        w('motivation','мотивация'), w('intrinsic motivation','внутренняя мотивация'),
        w('extrinsic motivation','внешняя мотивация'), w('drive','побуждение'),
        w('incentive','стимул'), w('goal','цель'), w('achievement','достижение'),
        w("Maslow's hierarchy","иерархия Маслоу"), w('physiological need','физиологическая потребность'),
        w('safety need','потребность в безопасности'), w('belonging','принадлежность'),
        w('esteem','самоуважение'), w('self-actualisation','самоактуализация'),
        w('reward','вознаграждение'), w('punishment','наказание'), w('reinforcement','подкрепление'),
        w('expectancy','ожидание'), w('valence','валентность'), w('instrumentality','инструментальность'),
        w('flow state','состояние потока'), w('procrastination','прокрастинация'),
        w('autonomy','автономия'), w('competence','компетентность'), w('relatedness','связанность'),
        w('self-determination theory','теория самодетерминации'),
      ],
    },
    {
      title: 'Memory',
      words: [
        w('memory','память'), w('encoding','кодирование'), w('storage','хранение'),
        w('retrieval','извлечение'), w('short-term memory','кратковременная память'),
        w('long-term memory','долговременная память'), w('working memory','рабочая память'),
        w('sensory memory','сенсорная память'), w('episodic memory','эпизодическая память'),
        w('semantic memory','семантическая память'), w('procedural memory','процедурная память'),
        w('implicit memory','имплицитная память'), w('explicit memory','эксплицитная память'),
        w('forgetting','забывание'), w('interference','интерференция'), w('decay','угасание'),
        w('recall','вспоминание'), w('recognition','узнавание'), w('cue','подсказка'),
        w('priming','прайминг'), w('rehearsal','повторение'), w('chunking','разбивка на части'),
        w('mnemonic','мнемоника'), w('false memory','ложная память'),
        w('flashbulb memory','вспышечная память'),
      ],
    },
    {
      title: 'Perception',
      words: [
        w('perception','восприятие'), w('sensation','ощущение'),
        w('selective attention','избирательное внимание'), w('perceptual set','перцептивная установка'),
        w('top-down processing','обработка сверху вниз'),
        w('bottom-up processing','обработка снизу вверх'), w('gestalt','гештальт'),
        w('figure-ground','фигура и фон'), w('depth perception','восприятие глубины'),
        w('illusion','иллюзия'), w('interpretation','интерпретация'), w('threshold','порог'),
        w('absolute threshold','абсолютный порог'), w('difference threshold','разностный порог'),
        w('sensory adaptation','сенсорная адаптация'), w('subliminal','подпороговый'),
        w('perceptual constancy','перцептивное постоянство'), w('context','контекст'),
        w('expectation','ожидание'), w('bias','искажение'), w('multisensory','мультисенсорный'),
        w('visual cortex','зрительная кора'), w('auditory perception','слуховое восприятие'),
        w('spatial awareness','пространственное восприятие'), w('cross-modal','кросс-модальный'),
      ],
    },
    {
      title: 'Social Influence',
      words: [
        w('social influence','социальное влияние'), w('conformity','конформизм'),
        w('compliance','подчинение'), w('obedience','послушание'), w('authority','авторитет'),
        w('peer pressure','давление сверстников'), w('social norms','социальные нормы'),
        w('normative influence','нормативное влияние'),
        w('informational influence','информационное влияние'), w('groupthink','групповое мышление'),
        w('bystander effect','эффект свидетеля'),
        w('diffusion of responsibility','диффузия ответственности'),
        w('social facilitation','социальная фасилитация'), w('social loafing','социальная леность'),
        w('deindividuation','деиндивидуация'), w('minority influence','влияние меньшинства'),
        w('conversion','конверсия'), w('Asch experiment','эксперимент Аша'),
        w('Milgram experiment','эксперимент Милгрэма'),
        w('Stanford prison experiment','Стэнфордский тюремный эксперимент'),
        w('attitude change','изменение установок'), w('persuasion','убеждение'),
        w('propaganda','пропаганда'), w('cult','секта'), w('charisma','харизма'),
      ],
    },
  ],
}

// ─── Module 6 – Political Science (B2) ───────────────────────────────────────
const mod_politics: MD = {
  title: 'Political Science', section: 'B2', lessons: [
    {
      title: 'Governance',
      words: [
        w('governance','управление'), w('state','государство'), w('nation','нация'),
        w('sovereignty','суверенитет'), w('legitimacy','легитимность'), w('authority','власть'),
        w('power','могущество'), w('accountability','подотчётность'), w('transparency','прозрачность'),
        w('rule of law','верховенство закона'), w('constitution','конституция'),
        w('institution','институт'), w('bureaucracy','бюрократия'),
        w('public administration','государственное управление'), w('public sector','государственный сектор'),
        w('civil service','государственная служба'),
        w('policy implementation','реализация политики'),
        w('multilevel governance','многоуровневое управление'),
        w('decentralisation','децентрализация'), w('federalism','федерализм'),
        w('separation of powers','разделение властей'),
        w('checks and balances','система сдержек и противовесов'),
        w('corruption','коррупция'), w('good governance','надлежащее управление'),
        w('e-governance','электронное управление'),
      ],
    },
    {
      title: 'Democracy',
      words: [
        w('democracy','демократия'), w('representative democracy','представительная демократия'),
        w('direct democracy','прямая демократия'), w('liberal democracy','либеральная демократия'),
        w('deliberative democracy','совещательная демократия'), w('citizen','гражданин'),
        w('suffrage','избирательное право'), w('voting','голосование'),
        w('participation','участие'), w('civil liberties','гражданские свободы'),
        w('political rights','политические права'), w('freedom of speech','свобода слова'),
        w('freedom of press','свобода прессы'), w('opposition','оппозиция'),
        w('pluralism','плюрализм'), w('electoral system','избирательная система'),
        w('majority rule','мажоритарное правило'), w('minority rights','права меньшинств'),
        w('democratic deficit','демократический дефицит'), w('referendum','референдум'),
        w('petition','петиция'), w('protest','протест'), w('civil society','гражданское общество'),
        w('populism','популизм'), w('authoritarianism','авторитаризм'),
      ],
    },
    {
      title: 'Political Systems',
      words: [
        w('political system','политическая система'),
        w('parliamentary system','парламентская система'),
        w('presidential system','президентская система'), w('monarchy','монархия'),
        w('republic','республика'), w('totalitarianism','тоталитаризм'),
        w('dictatorship','диктатура'), w('oligarchy','олигархия'), w('theocracy','теократия'),
        w('communism','коммунизм'), w('capitalism','капитализм'), w('socialism','социализм'),
        w('welfare state','государство всеобщего благосостояния'),
        w('mixed economy','смешанная экономика'), w('federalism','федерализм'),
        w('unitary state','унитарное государство'), w('confederation','конфедерация'),
        w('regime','режим'), w('transition','переход к демократии'),
        w('power structure','структура власти'), w('political party','политическая партия'),
        w('legislature','законодательный орган'), w('executive','исполнительная власть'),
        w('judiciary','судебная власть'), w('bicameral','двухпалатный'),
      ],
    },
    {
      title: 'Elections',
      words: [
        w('election','выборы'), w('candidate','кандидат'), w('campaign','предвыборная кампания'),
        w('ballot','бюллетень'), w('constituency','избирательный округ'),
        w('voter turnout','явка избирателей'), w('electoral roll','список избирателей'),
        w('polling station','избирательный участок'),
        w('proportional representation','пропорциональное представительство'),
        w('first past the post','мажоритарная система'), w('majority','большинство'),
        w('coalition','коалиция'), w('manifesto','предвыборная программа'),
        w('debate','дебаты'), w('campaign finance','финансирование кампании'),
        w('lobby','лоббировать'), w('opinion poll','опрос общественного мнения'),
        w('exit poll','экзит-пол'), w('electoral fraud','избирательное мошенничество'),
        w('incumbent','действующий политик'), w('swing voter','колеблющийся избиратель'),
        w('gerrymandering','джерримандеринг'), w('voter suppression','подавление голосования'),
        w('political mobilisation','политическая мобилизация'),
        w('electoral reform','избирательная реформа'),
      ],
    },
    {
      title: 'Policy Making',
      words: [
        w('policy','политика'), w('public policy','государственная политика'),
        w('agenda','повестка дня'), w('agenda-setting','формирование повестки дня'),
        w('policy cycle','цикл политики'), w('problem identification','выявление проблемы'),
        w('policy formulation','формулирование политики'), w('decision-making','принятие решений'),
        w('implementation','реализация'), w('evaluation','оценка'),
        w('stakeholder','заинтересованная сторона'), w('lobbying','лоббирование'),
        w('interest group','группа интересов'), w('think tank','мозговой центр'),
        w('consultation','консультация'), w('legislation','законодательство'),
        w('regulation','регулирование'), w('budget','бюджет'), w('trade-off','компромисс'),
        w('cost-benefit analysis','анализ затрат и выгод'),
        w('evidence-based policy','политика, основанная на данных'),
        w('policy failure','провал политики'), w('policy transfer','трансфер политики'),
        w('path dependency','зависимость от пути'), w('incrementalism','инкрементализм'),
      ],
    },
    {
      title: 'Political Ideology',
      words: [
        w('ideology','идеология'), w('conservatism','консерватизм'), w('liberalism','либерализм'),
        w('socialism','социализм'), w('nationalism','национализм'), w('fascism','фашизм'),
        w('environmentalism','экологизм'), w('feminism','феминизм'), w('anarchism','анархизм'),
        w('libertarianism','либертарианство'), w('left-wing','левый'), w('right-wing','правый'),
        w('centrist','центрист'), w('radical','радикальный'), w('reformist','реформистский'),
        w('progressive','прогрессивный'), w('reactionary','реакционный'),
        w('egalitarian','эгалитарный'), w('hierarchical','иерархический'),
        w('collectivism','коллективизм'), w('individualism','индивидуализм'),
        w('secular','светский'), w('theocratic','теократический'),
        w('market ideology','рыночная идеология'), w('social justice','социальная справедливость'),
      ],
    },
  ],
}

// ─── Module 7 – Economics (B2) ────────────────────────────────────────────────
const mod_economics: MD = {
  title: 'Economics', section: 'B2', lessons: [
    {
      title: 'Microeconomics',
      words: [
        w('microeconomics','микроэкономика'), w('consumer','потребитель'), w('producer','производитель'),
        w('firm','фирма'), w('market','рынок'), w('price','цена'), w('quantity','количество'),
        w('utility','полезность'), w('marginal utility','предельная полезность'),
        w('budget constraint','бюджетное ограничение'), w('elasticity','эластичность'),
        w('price elasticity of demand','ценовая эластичность спроса'),
        w('consumer surplus','потребительский излишек'),
        w('producer surplus','излишек производителя'), w('profit','прибыль'),
        w('cost','издержки'), w('revenue','доход'), w('perfect competition','совершенная конкуренция'),
        w('monopoly','монополия'), w('oligopoly','олигополия'),
        w('barriers to entry','барьеры для входа'), w('economies of scale','эффект масштаба'),
        w('diminishing returns','убывающая отдача'), w('opportunity cost','альтернативные издержки'),
        w('rational choice','рациональный выбор'),
      ],
    },
    {
      title: 'Macroeconomics',
      words: [
        w('macroeconomics','макроэкономика'), w('national economy','национальная экономика'),
        w('GDP','ВВП'), w('economic growth','экономический рост'), w('recession','рецессия'),
        w('inflation','инфляция'), w('deflation','дефляция'), w('unemployment','безработица'),
        w('aggregate demand','совокупный спрос'), w('aggregate supply','совокупное предложение'),
        w('monetary policy','денежно-кредитная политика'), w('fiscal policy','фискальная политика'),
        w('interest rate','процентная ставка'), w('money supply','денежная масса'),
        w('central bank','центральный банк'), w('balance of payments','платёжный баланс'),
        w('trade deficit','торговый дефицит'), w('exchange rate','обменный курс'),
        w('business cycle','деловой цикл'), w('multiplier effect','мультипликационный эффект'),
        w('austerity','жёсткая экономия'), w('stimulus package','пакет стимулирования'),
        w('national debt','государственный долг'), w('budget deficit','дефицит бюджета'),
        w('economic indicator','экономический показатель'),
      ],
    },
    {
      title: 'Supply & Demand',
      words: [
        w('supply','предложение'), w('demand','спрос'), w('equilibrium','равновесие'),
        w('equilibrium price','равновесная цена'), w('excess demand','избыточный спрос'),
        w('excess supply','избыточное предложение'), w('law of demand','закон спроса'),
        w('law of supply','закон предложения'), w('shift in demand','сдвиг спроса'),
        w('shift in supply','сдвиг предложения'), w('price ceiling','потолок цен'),
        w('price floor','нижний предел цены'), w('substitute good','товар-заменитель'),
        w('complementary good','дополняющий товар'), w('normal good','нормальный товар'),
        w('inferior good','низший товар'), w('Giffen good','гиффеновский товар'),
        w('elasticity','эластичность'), w('inelastic','неэластичный'), w('elastic','эластичный'),
        w('quantity demanded','объём спроса'), w('quantity supplied','объём предложения'),
        w('market clearing','рыночное очищение'), w('deadweight loss','безвозвратные потери'),
        w('consumer behaviour','потребительское поведение'),
      ],
    },
    {
      title: 'Market Failures',
      words: [
        w('market failure','провал рынка'), w('externality','внешний эффект'),
        w('positive externality','положительный внешний эффект'),
        w('negative externality','отрицательный внешний эффект'),
        w('public good','общественное благо'), w('private good','частное благо'),
        w('merit good','благо общественного значения'), w('demerit good','антиобщественное благо'),
        w('information asymmetry','асимметрия информации'), w('moral hazard','моральный риск'),
        w('adverse selection','неблагоприятный отбор'), w('monopoly power','монопольная власть'),
        w('free rider','безбилетник'), w('non-excludable','неисключаемый'),
        w('non-rival','несоперничающий'), w('pollution','загрязнение'),
        w('carbon tax','углеродный налог'), w('cap and trade','система торговли выбросами'),
        w('subsidy','субсидия'), w('regulation','регулирование'),
        w('price intervention','ценовое вмешательство'), w('Coase theorem','теорема Коуза'),
        w('social cost','социальные издержки'), w('social benefit','социальная выгода'),
        w('government intervention','государственное вмешательство'),
      ],
    },
    {
      title: 'Fiscal Policy',
      words: [
        w('fiscal policy','фискальная политика'), w('government expenditure','государственные расходы'),
        w('taxation','налогообложение'), w('budget','бюджет'), w('budget surplus','профицит бюджета'),
        w('budget deficit','дефицит бюджета'), w('national debt','государственный долг'),
        w('automatic stabiliser','автоматический стабилизатор'),
        w('discretionary spending','дискреционные расходы'),
        w('Keynesian economics','кейнсианская экономика'),
        w('expansionary fiscal policy','экспансионистская фискальная политика'),
        w('contractionary fiscal policy','сдерживающая фискальная политика'),
        w('public spending','государственные расходы'),
        w('welfare spending','расходы на социальное обеспечение'),
        w('infrastructure','инфраструктура'), w('progressive tax','прогрессивный налог'),
        w('regressive tax','регрессивный налог'), w('direct tax','прямой налог'),
        w('indirect tax','косвенный налог'), w('tax avoidance','уклонение от налогов'),
        w('tax evasion','уклонение от уплаты налогов'),
        w('multiplier effect','мультипликационный эффект'), w('crowding out','вытеснение'),
        w('debt-to-GDP ratio','соотношение долга к ВВП'),
        w('sovereign debt crisis','кризис суверенного долга'),
      ],
    },
    {
      title: 'GDP',
      words: [
        w('GDP','ВВП'), w('gross domestic product','валовой внутренний продукт'),
        w('GNP','ВНП'), w('gross national product','валовой национальный продукт'),
        w('nominal GDP','номинальный ВВП'), w('real GDP','реальный ВВП'),
        w('GDP per capita','ВВП на душу населения'), w('economic growth rate','темп экономического роста'),
        w('output','выпуск продукции'), w('expenditure approach','метод расходов'),
        w('income approach','метод доходов'), w('production approach','производственный метод'),
        w('consumption','потребление'), w('investment','инвестиции'),
        w('government spending','государственные расходы'), w('net exports','чистый экспорт'),
        w('depreciation','амортизация'), w('GDP deflator','дефлятор ВВП'),
        w('purchasing power parity','паритет покупательной способности'),
        w('Human Development Index','индекс человеческого развития'),
        w('inequality-adjusted HDI','HDI с учётом неравенства'),
        w('Gini coefficient','коэффициент Джини'), w('sustainable development','устойчивое развитие'),
        w('economic welfare','экономическое благосостояние'), w('underground economy','теневая экономика'),
      ],
    },
  ],
}

// ─── Module 8 – Research Methods (B2) ────────────────────────────────────────
const mod_methods: MD = {
  title: 'Research Methods', section: 'B2', lessons: [
    {
      title: 'Hypothesis Testing',
      words: [
        w('hypothesis','гипотеза'), w('null hypothesis','нулевая гипотеза'),
        w('alternative hypothesis','альтернативная гипотеза'), w('p-value','p-значение'),
        w('significance level','уровень значимости'),
        w('statistical significance','статистическая значимость'),
        w('Type I error','ошибка I рода'), w('Type II error','ошибка II рода'),
        w('confidence interval','доверительный интервал'), w('test statistic','тестовая статистика'),
        w('t-test','t-тест'), w('chi-square test','критерий хи-квадрат'),
        w('ANOVA','дисперсионный анализ'), w('regression analysis','регрессионный анализ'),
        w('correlation','корреляция'), w('causation','причинно-следственная связь'),
        w('confounding variable','искажающая переменная'), w('control group','контрольная группа'),
        w('experimental group','экспериментальная группа'), w('randomisation','рандомизация'),
        w('double blind','двойное слепое исследование'), w('effect size','размер эффекта'),
        w('power analysis','анализ мощности'), w('Bonferroni correction','поправка Бонферрони'),
        w('reproducibility','воспроизводимость'),
      ],
    },
    {
      title: 'Sampling',
      words: [
        w('sampling','выборка'), w('population','генеральная совокупность'),
        w('sample','выборка'), w('representative sample','репрезентативная выборка'),
        w('random sampling','случайная выборка'), w('stratified sampling','стратифицированная выборка'),
        w('cluster sampling','кластерная выборка'), w('systematic sampling','систематическая выборка'),
        w('purposive sampling','целенаправленная выборка'),
        w('snowball sampling','метод снежного кома'), w('convenience sampling','удобная выборка'),
        w('quota sampling','квотная выборка'), w('sample size','размер выборки'),
        w('sampling frame','основа выборки'), w('sampling bias','смещение выборки'),
        w('over-representation','чрезмерное представление'),
        w('under-representation','недостаточное представление'),
        w('generalisability','обобщаемость'), w('external validity','внешняя валидность'),
        w('internal validity','внутренняя валидность'),
        w('non-probability sampling','невероятностная выборка'),
        w('probability sampling','вероятностная выборка'), w('margin of error','погрешность'),
        w('census','перепись населения'), w('respondent','респондент'),
      ],
    },
    {
      title: 'Statistical Analysis',
      words: [
        w('statistics','статистика'), w('descriptive statistics','описательная статистика'),
        w('inferential statistics','выводная статистика'), w('mean','среднее значение'),
        w('median','медиана'), w('mode','мода'), w('standard deviation','стандартное отклонение'),
        w('variance','дисперсия'), w('frequency','частота'), w('distribution','распределение'),
        w('normal distribution','нормальное распределение'), w('skewness','асимметрия'),
        w('kurtosis','эксцесс'), w('outlier','выброс'),
        w('correlation coefficient','коэффициент корреляции'), w('regression','регрессия'),
        w('multivariate analysis','многомерный анализ'), w('factor analysis','факторный анализ'),
        w('cluster analysis','кластерный анализ'), w('cross-tabulation','перекрёстная таблица'),
        w('bar chart','столбчатая диаграмма'), w('histogram','гистограмма'),
        w('scatter plot','диаграмма рассеяния'), w('SPSS','SPSS'),
        w('R software','статистический пакет R'),
      ],
    },
    {
      title: 'Interviews',
      words: [
        w('interview','интервью'), w('structured interview','структурированное интервью'),
        w('semi-structured interview','полуструктурированное интервью'),
        w('unstructured interview','неструктурированное интервью'),
        w('in-depth interview','углублённое интервью'), w('interviewee','интервьюируемый'),
        w('interviewer','интервьюер'), w('rapport','взаимопонимание'),
        w('probe','уточняющий вопрос'), w('follow-up question','дополнительный вопрос'),
        w('open-ended question','открытый вопрос'), w('closed question','закрытый вопрос'),
        w('recording','запись'), w('transcription','транскрипция'),
        w('informed consent','информированное согласие'), w('confidentiality','конфиденциальность'),
        w('anonymisation','анонимизация'), w('thematic analysis','тематический анализ'),
        w('saturation','насыщение данных'), w('reflexivity','рефлексивность'),
        w('interviewer bias','смещение интервьюера'), w('leading question','наводящий вопрос'),
        w('elite interview','интервью с элитой'),
        w('life history interview','биографическое интервью'), w('virtual interview','онлайн-интервью'),
      ],
    },
    {
      title: 'Case Studies',
      words: [
        w('case study','кейс-исследование'), w('single case','единичный кейс'),
        w('multiple case','множественный кейс'), w('embedded case','встроенный кейс'),
        w('holistic approach','целостный подход'), w('context','контекст'),
        w('triangulation','триангуляция'), w('thick description','насыщенное описание'),
        w('generalisability','обобщаемость'), w('transferability','переносимость'),
        w('bounded system','ограниченная система'), w('within-case analysis','внутрикейсовый анализ'),
        w('cross-case analysis','межкейсовый анализ'), w('qualitative data','качественные данные'),
        w('process tracing','отслеживание процессов'), w('instrumental case','инструментальный кейс'),
        w('intrinsic case','интринсивный кейс'),
        w('comparative case study','сравнительное кейс-исследование'),
        w('longitudinal','лонгитюдный'), w('retrospective','ретроспективный'),
        w('prospective','проспективный'),
        w('naturalistic generalisation','натуралистическое обобщение'),
        w('deviant case','девиантный кейс'), w('critical case','критический кейс'),
        w('typical case','типичный кейс'),
      ],
    },
    {
      title: 'Literature Review',
      words: [
        w('literature review','обзор литературы'), w('systematic review','систематический обзор'),
        w('narrative review','нарративный обзор'), w('meta-analysis','мета-анализ'),
        w('database','база данных'), w('academic journal','академический журнал'),
        w('peer-reviewed','рецензируемый'), w('search strategy','стратегия поиска'),
        w('keyword','ключевое слово'), w('inclusion criteria','критерии включения'),
        w('exclusion criteria','критерии исключения'), w('critical appraisal','критическая оценка'),
        w('synthesise','синтезировать'), w('thematic synthesis','тематический синтез'),
        w('conceptual framework','концептуальная рамка'), w('gap in literature','пробел в литературе'),
        w('seminal work','основополагающая работа'),
        w('citation tracking','отслеживание цитирований'),
        w('bibliographic software','библиографическое программное обеспечение'),
        w('abstract','аннотация'), w('full text','полный текст'), w('PRISMA','PRISMA'),
        w('evidence synthesis','синтез доказательств'), w('grey literature','серая литература'),
        w('preprint','препринт'),
      ],
    },
  ],
}

// ─── Module 9 – Global Issues (C1) ───────────────────────────────────────────
const mod_global: MD = {
  title: 'Global Issues', section: 'C1', lessons: [
    {
      title: 'Globalisation',
      words: [
        w('globalisation','глобализация'), w('interdependence','взаимозависимость'),
        w('transnational corporation','транснациональная корпорация'), w('free trade','свободная торговля'),
        w('trade liberalisation','либерализация торговли'),
        w('economic integration','экономическая интеграция'),
        w('cultural globalisation','культурная глобализация'),
        w('political globalisation','политическая глобализация'),
        w('global governance','глобальное управление'), w('world system theory','теория мировой системы'),
        w('core-periphery','центр-периферия'), w('dependency theory','теория зависимости'),
        w('neoliberalism','неолиберализм'), w('Washington Consensus','Вашингтонский консенсус'),
        w('anti-globalisation','антиглобализм'), w('localisation','локализация'),
        w('glocal','глокальный'), w('digital globalisation','цифровая глобализация'),
        w('supply chain','цепочка поставок'), w('financial globalisation','финансовая глобализация'),
        w('capital flows','потоки капитала'), w('outsourcing','аутсорсинг'),
        w('inequality','неравенство'), w('development gap','разрыв в развитии'),
        w('global civil society','глобальное гражданское общество'),
      ],
    },
    {
      title: 'Migration',
      words: [
        w('migration','миграция'), w('immigrant','иммигрант'), w('emigrant','эмигрант'),
        w('refugee','беженец'), w('asylum seeker','искатель убежища'),
        w('internally displaced person','внутренне перемещённое лицо'),
        w('push factor','выталкивающий фактор'), w('pull factor','притягивающий фактор'),
        w('economic migration','экономическая миграция'), w('forced migration','вынужденная миграция'),
        w('voluntary migration','добровольная миграция'), w('remittance','денежный перевод'),
        w('brain drain','утечка мозгов'), w('diaspora','диаспора'), w('integration','интеграция'),
        w('xenophobia','ксенофобия'), w('border control','пограничный контроль'),
        w('immigration policy','иммиграционная политика'), w('citizenship','гражданство'),
        w('stateless person','апатрид'), w('UNHCR','УВКБ ООН'), w('detention','задержание'),
        w('deportation','депортация'), w('asylum','убежище'), w('transnationalism','транснационализм'),
      ],
    },
    {
      title: 'Inequality',
      words: [
        w('inequality','неравенство'), w('income inequality','неравенство доходов'),
        w('wealth inequality','неравенство богатства'), w('Gini coefficient','коэффициент Джини'),
        w('poverty line','черта бедности'), w('absolute poverty','абсолютная бедность'),
        w('relative poverty','относительная бедность'), w('social exclusion','социальное исключение'),
        w('social mobility','социальная мобильность'),
        w('intergenerational inequality','межпоколенческое неравенство'),
        w('gender inequality','гендерное неравенство'), w('racial inequality','расовое неравенство'),
        w('digital divide','цифровой разрыв'), w('access to healthcare','доступ к медицинской помощи'),
        w('access to education','доступ к образованию'),
        w('wealth redistribution','перераспределение богатства'),
        w('progressive taxation','прогрессивное налогообложение'),
        w('welfare state','государство всеобщего благосостояния'),
        w('universal basic income','базовый универсальный доход'),
        w('meritocracy','меритократия'), w('structural inequality','структурное неравенство'),
        w('intersectionality','интерсекциональность'),
        w('SDGs','Цели устойчивого развития'),
        w('human rights','права человека'),
        w('Sustainable Development Goals','ЦУР ООН'),
      ],
    },
    {
      title: 'Climate & Society',
      words: [
        w('climate change','изменение климата'), w('global warming','глобальное потепление'),
        w('greenhouse gas','парниковый газ'), w('carbon footprint','углеродный след'),
        w('decarbonisation','декарбонизация'), w('renewable energy','возобновляемая энергия'),
        w('climate justice','климатическая справедливость'),
        w('environmental sociology','экологическая социология'),
        w('ecological footprint','экологический след'), w('biodiversity loss','утрата биоразнообразия'),
        w('climate migration','климатическая миграция'), w('climate refugee','климатический беженец'),
        w('IPCC','МГЭИК'), w('Paris Agreement','Парижское соглашение'), w('net zero','нулевые выбросы'),
        w('carbon tax','углеродный налог'), w('green economy','зелёная экономика'),
        w('sustainable development','устойчивое развитие'),
        w('environmental justice','экологическая справедливость'),
        w('social movement','социальное движение'), w('climate activism','климатический активизм'),
        w('divestment','вывод инвестиций'),
        w('corporate social responsibility','корпоративная социальная ответственность'),
        w('adaptation','адаптация к изменениям климата'), w('mitigation','смягчение последствий'),
      ],
    },
    {
      title: 'Conflict',
      words: [
        w('conflict','конфликт'), w('armed conflict','вооружённый конфликт'), w('war','война'),
        w('civil war','гражданская война'), w('genocide','геноцид'), w('terrorism','терроризм'),
        w('peacebuilding','миростроительство'), w('peacekeeping','поддержание мира'),
        w('diplomacy','дипломатия'), w('sanction','санкция'),
        w('humanitarian intervention','гуманитарная интервенция'),
        w('international law','международное право'), w('United Nations','Объединённые Нации'),
        w('Security Council','Совет Безопасности'),
        w('conflict resolution','урегулирование конфликтов'), w('negotiation','переговоры'),
        w('mediation','медиация'), w('ceasefire','прекращение огня'),
        w('post-conflict reconstruction','постконфликтное восстановление'),
        w('refugee crisis','кризис беженцев'), w('ethnic conflict','этнический конфликт'),
        w('proxy war','война по доверенности'), w('just war theory','теория справедливой войны'),
        w('R2P','ответственность по защите'), w('transitional justice','переходное правосудие'),
      ],
    },
    {
      title: 'Development',
      words: [
        w('development','развитие'), w('economic development','экономическое развитие'),
        w('human development','развитие человека'), w('sustainable development','устойчивое развитие'),
        w('SDGs','ЦУР'), w('Human Development Index','индекс человеческого развития'),
        w('underdevelopment','недоразвитость'), w('Global South','глобальный Юг'),
        w('Global North','глобальный Север'), w('aid','помощь'),
        w('foreign direct investment','прямые иностранные инвестиции'),
        w('microfinance','микрофинансирование'), w('capacity building','наращивание потенциала'),
        w('good governance','надлежащее управление'), w('civil society','гражданское общество'),
        w('NGO','НКО'), w('dependency theory','теория зависимости'),
        w('modernisation theory','теория модернизации'),
        w('structural adjustment','структурная перестройка'), w('IMF','МВФ'),
        w('World Bank','Всемирный банк'), w('WTO','ВТО'), w('trade barrier','торговый барьер'),
        w('fair trade','честная торговля'), w('development cooperation','сотрудничество в целях развития'),
      ],
    },
  ],
}

// ─── Module 10 – Critical Theory (C1) ────────────────────────────────────────
const mod_critical: MD = {
  title: 'Critical Theory', section: 'C1', lessons: [
    {
      title: 'Postmodernism',
      words: [
        w('postmodernism','постмодернизм'), w('modernity','современность'),
        w('grand narrative','большой нарратив'), w('metanarrative','метанарратив'),
        w('deconstruction','деконструкция'), w('relativism','релятивизм'),
        w('truth','истина'), w('knowledge','знание'), w('power-knowledge','власть-знание'),
        w('language','язык'), w('text','текст'), w('discourse','дискурс'),
        w('hyperreality','гиперреальность'), w('simulacrum','симулякр'),
        w('fragmentation','фрагментация'), w('pluralism','плюрализм'),
        w('identity','идентичность'), w('fluidity','текучесть'), w('pastiche','пастиш'),
        w('parody','пародия'), w('irony','ирония'), w('Jean Baudrillard','Жан Бодрийяр'),
        w('Jean-François Lyotard','Жан-Франсуа Лиотар'), w('Jacques Derrida','Жак Деррида'),
        w('Michel Foucault','Мишель Фуко'),
      ],
    },
    {
      title: 'Feminism',
      words: [
        w('feminism','феминизм'), w('first-wave feminism','феминизм первой волны'),
        w('second-wave feminism','феминизм второй волны'), w('third-wave feminism','феминизм третьей волны'),
        w('fourth-wave feminism','феминизм четвёртой волны'), w('gender equality','гендерное равенство'),
        w('patriarchy','патриархат'), w('oppression','угнетение'), w('liberation','освобождение'),
        w('reproductive rights','репродуктивные права'),
        w('sexual harassment','сексуальные домогательства'), w('bodily autonomy','телесная автономия'),
        w('intersectionality','интерсекциональность'), w('liberal feminism','либеральный феминизм'),
        w('socialist feminism','социалистический феминизм'),
        w('radical feminism','радикальный феминизм'), w('ecofeminism','экофеминизм'),
        w('standpoint theory','теория точки зрения'), w('male gaze','мужской взгляд'),
        w('objectification','объективация'), w('sexualisation','сексуализация'),
        w('misogyny','мизогиния'), w('gender performativity','гендерная перформативность'),
        w('Simone de Beauvoir','Симона де Бовуар'), w('Judith Butler','Джудит Батлер'),
      ],
    },
    {
      title: 'Marxism',
      words: [
        w('Marxism','марксизм'), w('class struggle','классовая борьба'),
        w('mode of production','способ производства'), w('means of production','средства производства'),
        w('capitalism','капитализм'), w('communism','коммунизм'), w('bourgeoisie','буржуазия'),
        w('proletariat','пролетариат'), w('surplus value','прибавочная стоимость'),
        w('exploitation','эксплуатация'), w('alienation','отчуждение'), w('ideology','идеология'),
        w('false consciousness','ложное сознание'), w('class consciousness','классовое сознание'),
        w('revolution','революция'), w('dialectical materialism','диалектический материализм'),
        w('historical materialism','исторический материализм'),
        w('base and superstructure','базис и надстройка'), w('hegemony','гегемония'),
        w('neo-Marxism','неомарксизм'), w('critical theory','критическая теория'),
        w('Frankfurt School','Франкфуртская школа'), w('Antonio Gramsci','Антонио Грамши'),
        w('Louis Althusser','Луи Альтюссер'), w('political economy','политическая экономия'),
      ],
    },
    {
      title: 'Discourse Analysis',
      words: [
        w('discourse analysis','анализ дискурса'), w('discourse','дискурс'), w('text','текст'),
        w('language','язык'), w('power','власть'), w('knowledge','знание'),
        w('subject position','субъектная позиция'), w('representation','репрезентация'),
        w('critical discourse analysis','критический дискурс-анализ'), w('framing','фрейминг'),
        w('rhetoric','риторика'), w('narrative','нарратив'), w('ideology','идеология'),
        w('hegemony','гегемония'), w('interpellation','интерпелляция'),
        w('signifier','означающее'), w('signified','означаемое'), w('genre','жанр'),
        w('intertextuality','интертекстуальность'), w('context','контекст'),
        w('meaning-making','создание смысла'), w('semiotics','семиотика'),
        w('deconstruction','деконструкция'), w('Foucauldian analysis','фукоистский анализ'),
        w('genealogy','генеалогия'),
      ],
    },
    {
      title: 'Power & Ideology',
      words: [
        w('power','власть'), w('domination','господство'), w('hegemony','гегемония'),
        w('resistance','сопротивление'), w('ideology','идеология'), w('legitimation','легитимация'),
        w('coercion','принуждение'), w('consent','согласие'), w('authority','авторитет'),
        w('biopower','биовласть'), w('disciplinary power','дисциплинарная власть'),
        w('surveillance','слежка'), w('panopticon','паноптикум'),
        w('repressive state apparatus','репрессивный государственный аппарат'),
        w('ideological state apparatus','идеологический государственный аппарат'),
        w('social control','социальный контроль'), w('normalisation','нормализация'),
        w('subject','субъект'), w('subjectification','субъективация'), w('micro-power','микровласть'),
        w('counter-hegemony','контргегемония'), w('emancipation','эмансипация'),
        w('subalternity','субальтерность'), w('structural power','структурная власть'),
        w('soft power','мягкая сила'),
      ],
    },
    {
      title: 'Intersectionality',
      words: [
        w('intersectionality','интерсекциональность'), w('identity','идентичность'),
        w('race','раса'), w('gender','гендер'), w('class','класс'), w('sexuality','сексуальность'),
        w('disability','инвалидность'), w('age','возраст'), w('religion','религия'),
        w('nationality','национальность'), w('multiple oppression','множественное угнетение'),
        w('privilege','привилегия'), w('marginalisation','маргинализация'),
        w('social location','социальное положение'),
        w('structural inequality','структурное неравенство'),
        w('systems of oppression','системы угнетения'), w('standpoint theory','теория точки зрения'),
        w('matrix of domination','матрица господства'), w('lived experience','жизненный опыт'),
        w('positionality','позициональность'), w('Kimberlé Crenshaw','Кимберли Кренш'),
        w('Black feminism','чёрный феминизм'),
        w('critical race theory','критическая расовая теория'), w('ableism','эйблизм'),
        w('heteronormativity','гетеронормативность'),
      ],
    },
  ],
}

// ─── Module 11 – Applied Social Sciences (C1) ────────────────────────────────
const mod_applied: MD = {
  title: 'Applied Social Sciences', section: 'C1', lessons: [
    {
      title: 'Social Policy',
      words: [
        w('social policy','социальная политика'), w('welfare state','государство всеобщего благосостояния'),
        w('social security','социальное обеспечение'), w('pension','пенсия'),
        w('unemployment benefit','пособие по безработице'),
        w('housing policy','жилищная политика'), w('healthcare policy','политика здравоохранения'),
        w('education policy','политика в области образования'),
        w('poverty reduction','сокращение бедности'), w('social protection','социальная защита'),
        w('means testing','проверка нуждаемости'), w('universal provision','всеобщее обеспечение'),
        w('targeted provision','адресная помощь'), w('austerity','режим жёсткой экономии'),
        w('privatisation','приватизация'), w('decentralisation','децентрализация'),
        w('devolution','передача полномочий'), w('policy evaluation','оценка политики'),
        w('social spending','социальные расходы'), w('redistribution','перераспределение'),
        w('social investment','социальные инвестиции'), w('basic income','базовый доход'),
        w('active labour market policy','активная политика на рынке труда'),
        w('means-tested benefit','адресное пособие'),
        w('comparative social policy','сравнительная социальная политика'),
      ],
    },
    {
      title: 'Public Health',
      words: [
        w('public health','общественное здравоохранение'), w('epidemiology','эпидемиология'),
        w('morbidity','заболеваемость'), w('mortality','смертность'),
        w('health inequality','неравенство в здоровье'),
        w('social determinants of health','социальные детерминанты здоровья'),
        w('health promotion','укрепление здоровья'), w('prevention','профилактика'),
        w('immunisation','иммунизация'), w('vaccination','вакцинация'),
        w('pandemic','пандемия'), w('epidemic','эпидемия'),
        w('surveillance','эпидемиологический надзор'), w('quarantine','карантин'),
        w('contact tracing','отслеживание контактов'), w('risk factor','фактор риска'),
        w('behavioural change','изменение поведения'), w('health literacy','грамотность в вопросах здоровья'),
        w('mental health','психическое здоровье'),
        w('global health governance','глобальное управление здравоохранением'),
        w('WHO','ВОЗ'), w('evidence-based practice','практика, основанная на доказательствах'),
        w('health system','система здравоохранения'), w('primary healthcare','первичная медицинская помощь'),
        w('health disparity','диспропорция в здоровье'),
      ],
    },
    {
      title: 'Urban Studies',
      words: [
        w('urban studies','урбанистика'), w('city','город'), w('urbanisation','урбанизация'),
        w('metropolitan area','столичный регион'), w('suburb','пригород'),
        w('gentrification','джентрификация'), w('urban poverty','городская бедность'),
        w('segregation','сегрегация'), w('social cohesion','социальная сплочённость'),
        w('neighbourhood','район'), w('community development','развитие сообщества'),
        w('affordable housing','доступное жильё'), w('homelessness','бездомность'),
        w('urban planning','городское планирование'), w('smart city','умный город'),
        w('green space','зелёные зоны'), w('public transport','общественный транспорт'),
        w('walkability','пешеходная доступность'), w('urban renewal','обновление городской среды'),
        w('urban sprawl','разрастание городов'), w('mixed-use development','многофункциональная застройка'),
        w('social infrastructure','социальная инфраструктура'),
        w('right to the city','право на город'), w('Henri Lefebvre','Анри Лефевр'),
        w('housing','жильё'),
      ],
    },
    {
      title: 'Media & Society',
      words: [
        w('mass media','средства массовой информации'), w('news media','новостные СМИ'),
        w('social media','социальные медиа'), w('media ownership','медиасобственность'),
        w('media concentration','концентрация медиа'), w('framing','фрейминг'),
        w('agenda-setting','формирование повестки дня'), w('gatekeeping','отбор информации'),
        w('media bias','предвзятость СМИ'), w('media literacy','медиаграмотность'),
        w('propaganda','пропаганда'), w('disinformation','дезинформация'),
        w('misinformation','недостоверная информация'), w('echo chamber','информационный пузырь'),
        w('filter bubble','пузырь фильтров'), w('audience','аудитория'),
        w('media consumption','потребление медиа'), w('cultural hegemony','культурная гегемония'),
        w('representation','репрезентация'), w('stereotyping','стереотипизация'),
        w('news values','новостные ценности'), w('fourth estate','четвёртая власть'),
        w('citizen journalism','гражданская журналистика'), w('platform','платформа'),
        w('algorithmic curation','алгоритмическая кураторство'),
      ],
    },
    {
      title: 'Digital Sociology',
      words: [
        w('digital sociology','цифровая социология'), w('digital society','цифровое общество'),
        w('social media','социальные медиа'), w('digital identity','цифровая идентичность'),
        w('online community','онлайн-сообщество'),
        w('surveillance capitalism','капитализм слежки'), w('datafication','датафикация'),
        w('algorithmic governance','алгоритмическое управление'),
        w('digital inequality','цифровое неравенство'), w('digital divide','цифровой разрыв'),
        w('platform economy','платформенная экономика'), w('networked society','сетевое общество'),
        w('cyberculture','киберкультура'), w('virtual community','виртуальное сообщество'),
        w('digital labour','цифровой труд'), w('big data','большие данные'),
        w('privacy','конфиденциальность'), w('data ethics','этика данных'),
        w('cybersecurity','кибербезопасность'), w('disinformation','дезинформация'),
        w('viral content','вирусный контент'), w('hashtag activism','хэштег-активизм'),
        w('digital democracy','цифровая демократия'), w('e-participation','электронное участие'),
        w('posthumanism','постгуманизм'),
      ],
    },
    {
      title: 'AI & Society',
      words: [
        w('artificial intelligence','искусственный интеллект'),
        w('machine learning','машинное обучение'), w('algorithmic bias','алгоритмическая предвзятость'),
        w('AI ethics','этика ИИ'), w('automation','автоматизация'),
        w('future of work','будущее труда'), w('job displacement','вытеснение рабочих мест'),
        w('reskilling','переобучение'), w('AI governance','управление ИИ'),
        w('regulation','регулирование'), w('transparency','прозрачность'),
        w('accountability','ответственность'), w('explainability','объяснимость'),
        w('facial recognition','распознавание лиц'), w('predictive policing','предиктивная полиция'),
        w('social credit system','система социального рейтинга'),
        w('digital rights','цифровые права'), w('surveillance state','государство слежки'),
        w('privacy','конфиденциальность'), w('digital authoritarianism','цифровой авторитаризм'),
        w('AI literacy','грамотность в области ИИ'), w('techno-utopianism','техноутопизм'),
        w('techno-dystopianism','технодистопизм'), w('platform power','власть платформы'),
        w('digital divide','цифровой разрыв'),
      ],
    },
  ],
}

// ─── Module 12 – Academic Communication (C1) ─────────────────────────────────
const mod_communication: MD = {
  title: 'Academic Communication', section: 'C1', lessons: [
    {
      title: 'Research Papers',
      words: [
        w('research paper','научная статья'), w('abstract','аннотация'),
        w('introduction','введение'), w('literature review','обзор литературы'),
        w('methodology','методология'), w('findings','результаты'), w('discussion','обсуждение'),
        w('conclusion','заключение'), w('reference list','список литературы'),
        w('appendix','приложение'), w('hypothesis','гипотеза'),
        w('theoretical framework','теоретическая рамка'),
        w('conceptual framework','концептуальная рамка'), w('contribution','вклад в науку'),
        w('gap in knowledge','пробел в знаниях'), w('implication','значение'),
        w('limitation','ограничение'), w('future research','будущие исследования'),
        w('keyword','ключевое слово'), w('title page','титульная страница'),
        w('acknowledgement','благодарность'), w('word count','количество слов'),
        w('style guide','руководство по стилю'), w('submission','подача'),
        w('revision','доработка'),
      ],
    },
    {
      title: 'Conference Presentations',
      words: [
        w('conference','конференция'), w('presentation','презентация'),
        w('abstract submission','подача аннотации'), w('call for papers','объявление о приёме материалов'),
        w('slide deck','набор слайдов'), w('poster presentation','стендовый доклад'),
        w('oral presentation','устный доклад'), w('panel discussion','панельная дискуссия'),
        w('keynote speaker','основной докладчик'), w('Q&A session','сессия вопросов и ответов'),
        w('networking','нетворкинг'), w('proceedings','материалы конференции'),
        w('peer','коллега-учёный'), w('academic audience','академическая аудитория'),
        w('time limit','ограничение времени'), w('visual aid','наглядное пособие'),
        w('handout','раздаточный материал'), w('cite','цитировать'),
        w('acknowledge','признавать вклад'), w('question handling','ответы на вопросы'),
        w('conference paper','конференционный доклад'), w('workshop','воркшоп'),
        w('roundtable','круглый стол'), w('symposium','симпозиум'),
        w('live demonstration','живая демонстрация'),
      ],
    },
    {
      title: 'Peer Review',
      words: [
        w('peer review','рецензирование'), w('reviewer','рецензент'),
        w('blind review','слепое рецензирование'),
        w('double-blind review','двойное слепое рецензирование'),
        w('open review','открытое рецензирование'), w('editor','редактор'),
        w('journal','журнал'), w('submission','подача'), w('review criteria','критерии рецензирования'),
        w('accept','принять'), w('reject','отклонить'),
        w('revise and resubmit','доработать и повторно отправить'),
        w('minor revision','незначительная доработка'), w('major revision','существенная доработка'),
        w('feedback','обратная связь'), w('critique','критика'), w('constructive','конструктивный'),
        w('academic quality','академическое качество'), w('originality','оригинальность'),
        w('significance','значимость'), w('rigour','строгость'),
        w('methodology evaluation','оценка методологии'),
        w('academic publishing','академическое издание'), w('open access','открытый доступ'),
        w('impact factor','импакт-фактор'),
      ],
    },
    {
      title: 'Grant Writing',
      words: [
        w('grant','грант'), w('funding body','финансирующий орган'),
        w('research proposal','исследовательское предложение'), w('budget','бюджет'),
        w('justification','обоснование'), w('timeline','временная шкала'),
        w('deliverable','результат работы'), w('milestone','веха'), w('impact','воздействие'),
        w('value for money','соотношение цены и качества'),
        w('dissemination','распространение результатов'), w('collaboration','сотрудничество'),
        w('co-investigator','соисследователь'), w('principal investigator','главный исследователь'),
        w('track record','послужной список'), w('feasibility','осуществимость'),
        w('ethics approval','одобрение этического комитета'),
        w('intellectual property','интеллектуальная собственность'),
        w('overhead','накладные расходы'), w('match funding','софинансирование'),
        w('impact case study','кейс воздействия'), w('evaluative criteria','критерии оценки'),
        w("reviewers' comments","комментарии рецензентов"),
        w('competitive grant','конкурентный грант'), w('call for proposals','конкурс предложений'),
      ],
    },
    {
      title: 'Academic Debate',
      words: [
        w('academic debate','академическая дискуссия'), w('argument','аргумент'),
        w('counter-argument','контраргумент'), w('rebuttal','опровержение'),
        w('evidence','доказательство'), w('claim','утверждение'), w('premise','предпосылка'),
        w('conclusion','вывод'), w('logical fallacy','логическая ошибка'),
        w('ad hominem','аргумент к личности'), w('straw man','соломенное пугало'),
        w('false dichotomy','ложная дихотомия'), w('appeal to authority','апелляция к авторитету'),
        w('burden of proof','бремя доказательства'), w('citation','цитирование'),
        w('critical thinking','критическое мышление'), w('academic tone','академический тон'),
        w('persuasion','убеждение'), w('rhetoric','риторика'), w('concede','уступать'),
        w('acknowledge','признавать'), w('qualify','уточнять'), w('posit','постулировать'),
        w('dispute','оспаривать'), w('synthesis','синтез'),
      ],
    },
    {
      title: 'Publishing',
      words: [
        w('academic publishing','академическое издание'), w('journal','журнал'),
        w('monograph','монография'), w('edited volume','коллективная монография'),
        w('book chapter','глава книги'), w('open access','открытый доступ'),
        w('paywall','платный доступ'), w('preprint','препринт'), w('DOI','DOI'),
        w('impact factor','импакт-фактор'), w('citation index','индекс цитирования'),
        w('h-index','h-индекс'), w('SSCI','SSCI'), w('Scopus','Scopus'),
        w('Web of Science','Web of Science'), w('plagiarism','плагиат'),
        w('self-plagiarism','самоплагиат'), w('retraction','отзыв статьи'),
        w('author affiliation','аффилиация автора'), w('corresponding author','ответственный автор'),
        w('submission guidelines','требования к подаче'), w('copyediting','редакторская правка'),
        w('proof','корректура'), w('publication date','дата публикации'),
        w('research output','исследовательские результаты'),
      ],
    },
  ],
}

// ─── assembled module lists ────────────────────────────────────────────────────

const SOC_B1_MODULES: MD[] = [
  mod_intro,
  mod_research,
  mod_sociology,
  mod_writing,
]

const SOC_B1C1_MODULES: MD[] = [
  mod_intro,
  mod_research,
  mod_sociology,
  mod_writing,
  mod_psychology,
  mod_politics,
  mod_economics,
  mod_methods,
  mod_global,
  mod_critical,
  mod_applied,
  mod_communication,
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
      const lesson     = mod.lessons[li]
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
  console.log('🚀 ESP Social Sciences seed script')
  console.log('   Supabase URL:', SUPABASE_URL)

  const ALL_IDS = [SOC_B1_ID, SOC_B1C1_ID]

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

  await seedCourse(SOC_B1_ID,   SOC_B1_MODULES,   'Social Sciences B1')
  await seedCourse(SOC_B1C1_ID, SOC_B1C1_MODULES, 'Social Sciences B1-C1')

  console.log('\n🎉 Done! Social Sciences seeded.')
  console.log(`   Social Sciences B1:     ${SOC_B1_MODULES.length} modules, ${SOC_B1_MODULES.length * 6} lessons`)
  console.log(`   Social Sciences B1-C1: ${SOC_B1C1_MODULES.length} modules, ${SOC_B1C1_MODULES.length * 6} lessons`)
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err)
  process.exit(1)
})