/**
 * Seed: Management B1 + Management B1-C1
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/seed-esp-management.ts
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
const MAN_B1_ID   = '41f65a3f-2d1e-4281-a249-7d7b5f255352'
const MAN_B1C1_ID = 'a1000000-0000-0000-0000-000000000009'

// ─── types ────────────────────────────────────────────────────────────────────
type W  = { en: string; ru: string }
type LD = { title: string; words: W[] }
type MD = { title: string; section: string; lessons: LD[] }

function w(en: string, ru: string): W { return { en, ru } }

// ─── Module 1 – Management Fundamentals (B1) ─────────────────────────────────
const mod_mgmt_fundamentals: MD = {
  title: 'Management Fundamentals', section: 'B1', lessons: [
    {
      title: 'Roles of Managers',
      words: [
        w('manager','менеджер'), w('role','роль'), w('responsibility','ответственность'),
        w('authority','полномочие'), w('accountability','подотчётность'),
        w('decision-making','принятие решений'), w('planning','планирование'),
        w('organising','организация'), w('leading','руководство'), w('controlling','контроль'),
        w('team','команда'), w('supervisor','руководитель'), w('middle manager','менеджер среднего звена'),
        w('senior manager','старший менеджер'), w('strategic','стратегический'),
        w('operational','операционный'), w('tactical','тактический'),
        w('functional manager','функциональный менеджер'), w('line manager','линейный менеджер'),
        w('project manager','менеджер проекта'), w('general manager','генеральный менеджер'),
        w('department head','руководитель отдела'), w('stakeholder','заинтересованная сторона'),
        w('objective','цель'), w('outcome','результат'),
      ],
    },
    {
      title: 'Planning',
      words: [
        w('planning','планирование'), w('goal','цель'), w('objective','задача'),
        w('target','целевой показатель'), w('strategy','стратегия'), w('action plan','план действий'),
        w('timeline','временная шкала'), w('milestone','веха'), w('priority','приоритет'),
        w('resource','ресурс'), w('budget','бюджет'), w('forecast','прогноз'),
        w('schedule','расписание'), w('deadline','срок'), w('contingency','резервный план'),
        w('short-term plan','краткосрочный план'), w('long-term plan','долгосрочный план'),
        w('operational plan','операционный план'), w('strategic plan','стратегический план'),
        w('SMART goal','цель SMART'), w('KPI','КПЭ'), w('indicator','индикатор'),
        w('review','проверка'), w('adjust','корректировать'), w('outcome','результат'),
      ],
    },
    {
      title: 'Organising',
      words: [
        w('organising','организация'), w('structure','структура'), w('hierarchy','иерархия'),
        w('division','подразделение'), w('department','отдел'), w('team','команда'),
        w('role','роль'), w('responsibility','ответственность'), w('reporting line','линия подчинения'),
        w('span of control','норма управляемости'), w('chain of command','цепочка командования'),
        w('delegation','делегирование'), w('authority','полномочие'), w('task','задача'),
        w('workflow','рабочий процесс'), w('job design','проектирование рабочего места'),
        w('organisation chart','организационная схема'), w('matrix structure','матричная структура'),
        w('flat structure','плоская структура'), w('functional structure','функциональная структура'),
        w('decentralisation','децентрализация'), w('centralisation','централизация'),
        w('coordination','координация'), w('integration','интеграция'),
        w('resource allocation','распределение ресурсов'),
      ],
    },
    {
      title: 'Leading',
      words: [
        w('leadership','лидерство'), w('leader','лидер'), w('motivation','мотивация'),
        w('inspire','вдохновлять'), w('vision','видение'), w('direction','направление'),
        w('influence','влияние'), w('communicate','общаться'), w('empower','уполномочить'),
        w('delegate','делегировать'), w('coach','наставлять'), w('mentor','быть ментором'),
        w('support','поддерживать'), w('role model','образец для подражания'),
        w('emotional intelligence','эмоциональный интеллект'),
        w('transformational','трансформационный'), w('transactional','транзакционный'),
        w('servant leadership','слуга-лидер'), w('decision','решение'),
        w('accountability','подотчётность'), w('culture','культура'), w('trust','доверие'),
        w('engagement','вовлечённость'), w('performance','результативность'),
        w('team building','командообразование'),
      ],
    },
    {
      title: 'Controlling',
      words: [
        w('controlling','контроль'), w('monitor','отслеживать'), w('measure','измерять'),
        w('evaluate','оценивать'), w('performance','результативность'), w('standard','стандарт'),
        w('deviation','отклонение'), w('correction','коррекция'), w('KPI','КПЭ'),
        w('feedback','обратная связь'), w('review','проверка'), w('report','отчёт'),
        w('audit','аудит'), w('benchmark','эталон'), w('variance','отклонение'),
        w('target','целевой показатель'), w('actual','фактический'), w('gap','разрыв'),
        w('control system','система контроля'), w('dashboard','дашборд'),
        w('exception reporting','отчётность об исключениях'),
        w('corrective action','корректирующее действие'), w('adjustment','корректировка'),
        w('performance review','анализ результатов'), w('continuous improvement','непрерывное улучшение'),
      ],
    },
    {
      title: 'Management Styles',
      words: [
        w('management style','стиль управления'), w('autocratic','авторитарный'),
        w('democratic','демократический'), w('laissez-faire','невмешательство'),
        w('transformational','трансформационный'), w('transactional','транзакционный'),
        w('servant leadership','слуга-лидер'), w('coaching','коучинг'),
        w('paternalistic','патерналистский'), w('bureaucratic','бюрократический'),
        w('situational','ситуационный'), w('contingency','контингентный'),
        w('people-oriented','ориентированный на людей'), w('task-oriented','ориентированный на задачи'),
        w('directive','директивный'), w('supportive','поддерживающий'),
        w('participative','участвующий'), w('achievement-oriented','ориентированный на достижения'),
        w('adaptive','адаптивный'), w('flexible','гибкий'), w('culture','культура'),
        w('motivation','мотивация'), w('effectiveness','эффективность'),
        w('context','контекст'), w('approach','подход'),
      ],
    },
  ],
}

// ─── Module 2 – Communication (B1) ───────────────────────────────────────────
const mod_communication: MD = {
  title: 'Communication', section: 'B1', lessons: [
    {
      title: 'Workplace Communication',
      words: [
        w('communication','коммуникация'), w('verbal','устный'), w('non-verbal','невербальный'),
        w('written','письменный'), w('formal','официальный'), w('informal','неформальный'),
        w('upward','восходящий'), w('downward','нисходящий'), w('lateral','горизонтальный'),
        w('channel','канал'), w('message','сообщение'), w('sender','отправитель'),
        w('receiver','получатель'), w('feedback','обратная связь'), w('noise','помехи'),
        w('clarity','ясность'), w('concise','краткий'), w('professional','профессиональный'),
        w('tone','тон'), w('medium','средство'), w('email','электронная почта'),
        w('meeting','встреча'), w('report','отчёт'), w('presentation','презентация'),
        w('active listening','активное слушание'),
      ],
    },
    {
      title: 'Meetings',
      words: [
        w('meeting','встреча'), w('agenda','повестка дня'), w('minutes','протокол'),
        w('chair','председатель'), w('facilitator','фасилитатор'), w('participant','участник'),
        w('action point','пункт действия'), w('follow-up','последующие действия'),
        w('quorum','кворум'), w('opening','открытие'), w('closing','закрытие'),
        w('discussion','обсуждение'), w('decision','решение'), w('vote','голосование'),
        w('consensus','консенсус'), w('time-keeping','соблюдение времени'),
        w('virtual meeting','виртуальная встреча'), w('face-to-face','лицом к лицу'),
        w('scheduled','запланированный'), w('ad hoc','внеплановый'),
        w('standing meeting','регулярная встреча'), w('briefing','брифинг'),
        w('workshop','мастерская'), w('conference call','конференц-звонок'),
        w('video call','видеозвонок'),
      ],
    },
    {
      title: 'Emails',
      words: [
        w('email','электронное письмо'), w('subject line','тема письма'), w('salutation','приветствие'),
        w('body','основная часть'), w('closing','завершение'), w('signature','подпись'),
        w('cc','копия'), w('bcc','скрытая копия'), w('reply','ответить'), w('forward','переслать'),
        w('attachment','вложение'), w('formal','официальный'), w('informal','неформальный'),
        w('urgent','срочно'), w('priority','приоритет'), w('tone','тон'), w('concise','краткий'),
        w('professional','профессиональный'), w('bullet points','маркированные пункты'),
        w('action required','требуется действие'), w('response time','время ответа'),
        w('thread','цепочка'), w('archive','архив'), w('out of office','вне офиса'),
        w('read receipt','уведомление о прочтении'),
      ],
    },
    {
      title: 'Reports',
      words: [
        w('report','отчёт'), w('executive summary','резюме для руководства'),
        w('introduction','введение'), w('methodology','методология'), w('findings','выводы'),
        w('analysis','анализ'), w('conclusion','заключение'), w('recommendation','рекомендация'),
        w('appendix','приложение'), w('table','таблица'), w('chart','диаграмма'), w('data','данные'),
        w('heading','заголовок'), w('subheading','подзаголовок'), w('numbering','нумерация'),
        w('bullet point','маркированный пункт'), w('reference','ссылка'), w('citation','цитирование'),
        w('objective','цель'), w('audience','аудитория'), w('purpose','назначение'),
        w('format','формат'), w('structure','структура'), w('review','проверка'),
        w('edit','редактировать'),
      ],
    },
    {
      title: 'Presentations',
      words: [
        w('presentation','презентация'), w('slide','слайд'), w('PowerPoint','PowerPoint'),
        w('agenda','повестка дня'), w('opening','открытие'), w('body','основная часть'),
        w('closing','завершение'), w('Q&A','Q&A'), w('visual aid','наглядное пособие'),
        w('chart','диаграмма'), w('graph','график'), w('table','таблица'),
        w('audience','аудитория'), w('key message','ключевое сообщение'), w('storytelling','сторителлинг'),
        w('timing','хронометраж'), w('rehearse','репетировать'), w('eye contact','зрительный контакт'),
        w('voice','голос'), w('pace','темп'), w('confidence','уверенность'), w('question','вопрос'),
        w('answer','ответ'), w('handout','раздаточный материал'), w('feedback','обратная связь'),
      ],
    },
    {
      title: 'Active Listening',
      words: [
        w('active listening','активное слушание'), w('attention','внимание'), w('focus','фокус'),
        w('eye contact','зрительный контакт'), w('body language','язык тела'), w('nodding','кивание'),
        w('paraphrase','перефразировать'), w('summarise','резюмировать'), w('clarify','уточнить'),
        w('question','вопрос'), w('interrupt','прерывать'), w('empathy','эмпатия'),
        w('understanding','понимание'), w('reflect','отражать'), w('respond','отвечать'),
        w('feedback','обратная связь'), w('non-verbal','невербальный'), w('tone','тон'),
        w('silence','молчание'), w('distraction','отвлечение'), w('note-taking','ведение заметок'),
        w('confirm','подтверждать'), w('open question','открытый вопрос'),
        w('closed question','закрытый вопрос'), w('engagement','вовлечённость'),
      ],
    },
  ],
}

// ─── Module 3 – Team Management (B1) ─────────────────────────────────────────
const mod_team_mgmt: MD = {
  title: 'Team Management', section: 'B1', lessons: [
    {
      title: 'Team Roles',
      words: [
        w('team','команда'), w('role','роль'), w('Belbin','Белбин'), w('coordinator','координатор'),
        w('shaper','двигатель'), w('plant','генератор идей'), w('monitor evaluator','аналитик'),
        w('resource investigator','разведчик ресурсов'), w('implementer','исполнитель'),
        w('completer finisher','завершитель'), w('team worker','командный игрок'),
        w('specialist','специалист'), w('strengths','сильные стороны'),
        w('weaknesses','слабые стороны'), w('contribution','вклад'), w('diversity','разнообразие'),
        w('skill','навык'), w('task','задача'), w('responsibility','ответственность'),
        w('interdependence','взаимозависимость'), w('cohesion','сплочённость'),
        w('dynamics','динамика'), w('collaboration','сотрудничество'),
        w('communication','коммуникация'), w('synergy','синергия'),
      ],
    },
    {
      title: 'Motivation',
      words: [
        w('motivation','мотивация'), w('intrinsic','внутренняя'), w('extrinsic','внешняя'),
        w('Maslow','Маслоу'), w('hierarchy of needs','иерархия потребностей'),
        w('physiological','физиологические'), w('safety','безопасность'), w('belonging','принадлежность'),
        w('esteem','уважение'), w('self-actualisation','самоактуализация'), w('Herzberg','Герцберг'),
        w('hygiene factors','гигиенические факторы'), w('motivators','мотиваторы'),
        w('McGregor','МакГрегор'), w('Theory X','Теория X'), w('Theory Y','Теория Y'),
        w('recognition','признание'), w('reward','вознаграждение'), w('incentive','стимул'),
        w('autonomy','автономия'), w('purpose','цель'), w('engagement','вовлечённость'),
        w('satisfaction','удовлетворённость'), w('job enrichment','обогащение труда'),
        w('empowerment','расширение полномочий'),
      ],
    },
    {
      title: 'Delegation',
      words: [
        w('delegation','делегирование'), w('delegate','делегировать'), w('task','задача'),
        w('authority','полномочие'), w('responsibility','ответственность'),
        w('accountability','подотчётность'), w('trust','доверие'), w('empower','уполномочить'),
        w('monitor','отслеживать'), w('follow-up','последующие действия'),
        w('capability','способность'), w('skill','навык'), w('workload','рабочая нагрузка'),
        w('time management','управление временем'), w('brief','инструктировать'),
        w('instruction','инструкция'), w('deadline','срок'), w('outcome','результат'),
        w('feedback','обратная связь'), w('support','поддержка'),
        w('micromanagement','микроменеджмент'), w('autonomy','автономия'), w('ownership','владение'),
        w('development','развитие'), w('effectiveness','эффективность'),
      ],
    },
    {
      title: 'Conflict Resolution',
      words: [
        w('conflict','конфликт'), w('dispute','спор'), w('disagreement','разногласие'),
        w('resolution','разрешение'), w('mediation','медиация'), w('negotiation','переговоры'),
        w('compromise','компромисс'), w('collaborate','сотрудничать'), w('assertive','уверенный'),
        w('passive','пассивный'), w('aggressive','агрессивный'), w('avoid','избегать'),
        w('accommodate','приспосабливаться'), w('win-win','взаимовыгодный'),
        w('confrontation','конфронтация'), w('facilitator','фасилитатор'),
        w('root cause','первопричина'), w('emotion','эмоция'), w('empathy','эмпатия'),
        w('perspective','перспектива'), w('listening','слушание'), w('agreement','соглашение'),
        w('follow-up','последующие действия'), w('escalate','эскалировать'),
        w('reconcile','примириться'),
      ],
    },
    {
      title: 'Feedback',
      words: [
        w('feedback','обратная связь'), w('constructive','конструктивный'), w('positive','положительный'),
        w('negative','отрицательный'), w('specific','конкретный'), w('actionable','действенный'),
        w('timely','своевременный'), w('SBI model','модель SBI'), w('situation','ситуация'),
        w('behaviour','поведение'), w('impact','воздействие'), w('360 feedback','обратная связь 360°'),
        w('performance review','оценка результатов'), w('appraisal','аттестация'),
        w('coaching','коучинг'), w('development','развитие'), w('strength','сильная сторона'),
        w('improvement','улучшение'), w('goal','цель'), w('follow-up','последующие действия'),
        w('open','открытый'), w('honest','честный'), w('two-way','двусторонний'),
        w('recognition','признание'), w('growth','рост'),
      ],
    },
    {
      title: 'Performance',
      words: [
        w('performance','результативность'), w('KPI','КПЭ'), w('target','целевой показатель'),
        w('actual','фактический'), w('review','проверка'), w('appraisal','аттестация'),
        w('objective','цель'), w('achievement','достижение'), w('gap','разрыв'),
        w('improvement','улучшение'), w('underperformance','неудовлетворительные результаты'),
        w('PIP','план улучшения'), w('performance improvement plan','план улучшения результативности'),
        w('recognition','признание'), w('reward','вознаграждение'), w('promotion','продвижение'),
        w('demotion','понижение'), w('development','развитие'), w('training','обучение'),
        w('coaching','коучинг'), w('one-to-one','один на один'), w('annual review','ежегодная проверка'),
        w('rating','оценка'), w('benchmark','эталон'), w('feedback','обратная связь'),
      ],
    },
  ],
}

// ─── Module 4 – Business Documents (B1) ──────────────────────────────────────
const mod_business_docs: MD = {
  title: 'Business Documents', section: 'B1', lessons: [
    {
      title: 'Business Reports',
      words: [
        w('report','отчёт'), w('executive summary','резюме для руководства'),
        w('title page','титульная страница'), w('table of contents','оглавление'),
        w('introduction','введение'), w('background','предыстория'),
        w('methodology','методология'), w('findings','выводы'), w('analysis','анализ'),
        w('conclusion','заключение'), w('recommendation','рекомендация'),
        w('appendix','приложение'), w('reference','ссылка'), w('visual','визуальный'),
        w('chart','диаграмма'), w('table','таблица'), w('professional format','профессиональный формат'),
        w('audience','аудитория'), w('purpose','назначение'), w('scope','охват'),
        w('objective','цель'), w('heading','заголовок'), w('subheading','подзаголовок'),
        w('numbered','пронумерованный'), w('pagination','нумерация страниц'),
      ],
    },
    {
      title: 'Memos',
      words: [
        w('memo','служебная записка'), w('memorandum','меморандум'), w('to','кому'),
        w('from','от'), w('date','дата'), w('subject','тема'), w('purpose','назначение'),
        w('message','сообщение'), w('action required','требуется действие'), w('brief','краткий'),
        w('internal','внутренний'), w('formal','официальный'), w('bullet point','маркированный пункт'),
        w('distribute','распространить'), w('copy','копия'), w('confidential','конфиденциальный'),
        w('urgent','срочно'), w('follow-up','последующие действия'), w('department','отдел'),
        w('team','команда'), w('update','обновление'), w('inform','информировать'),
        w('decision','решение'), w('approval','одобрение'), w('signature','подпись'),
      ],
    },
    {
      title: 'Meeting Minutes',
      words: [
        w('minutes','протокол'), w('meeting','встреча'), w('date','дата'), w('time','время'),
        w('venue','место'), w('attendees','присутствующие'), w('apologies','извинения за отсутствие'),
        w('agenda','повестка дня'), w('discussion','обсуждение'), w('decision','решение'),
        w('action','действие'), w('owner','ответственный'), w('deadline','срок'),
        w('next steps','следующие шаги'), w('follow-up','последующие действия'),
        w('quorum','кворум'), w('vote','голосование'), w('consensus','консенсус'),
        w('adjourn','закрыть заседание'), w('next meeting','следующая встреча'),
        w('distribute','распространить'), w('confirm','подтвердить'), w('approve','одобрить'),
        w('amend','внести поправку'), w('accurate','точный'),
      ],
    },
    {
      title: 'Proposals',
      words: [
        w('proposal','предложение'), w('business case','бизнес-кейс'),
        w('executive summary','резюме для руководства'), w('problem','проблема'),
        w('solution','решение'), w('objective','цель'), w('scope','охват'),
        w('methodology','методология'), w('timeline','временная шкала'), w('budget','бюджет'),
        w('cost-benefit','затраты-выгоды'), w('risk','риск'), w('assumptions','допущения'),
        w('deliverables','результаты'), w('stakeholder','заинтересованная сторона'),
        w('approval','одобрение'), w('recommendation','рекомендация'), w('alternative','альтернатива'),
        w('feasibility','выполнимость'), w('ROI','ROI'), w('return on investment','рентабельность'),
        w('appendix','приложение'), w('professional','профессиональный'), w('persuasive','убедительный'),
        w('sign-off','утверждение'),
      ],
    },
    {
      title: 'KPI Dashboards',
      words: [
        w('KPI dashboard','дашборд КПЭ'), w('metric','метрика'), w('target','целевой показатель'),
        w('actual','фактический'), w('variance','отклонение'), w('RAG','RAG'),
        w('red','красный'), w('amber','жёлтый'), w('green','зелёный'), w('trend','тенденция'),
        w('chart','диаграмма'), w('graph','график'), w('table','таблица'),
        w('scorecard','система показателей'), w('balanced scorecard','сбалансированная система'),
        w('financial KPI','финансовый КПЭ'), w('operational KPI','операционный КПЭ'),
        w('customer KPI','клиентский КПЭ'), w('people KPI','КПЭ персонала'), w('visual','визуальный'),
        w('real-time','в реальном времени'), w('period','период'), w('cumulative','накопительный'),
        w('year-to-date','с начала года'), w('benchmark','эталон'),
      ],
    },
    {
      title: 'Correspondence',
      words: [
        w('business letter','деловое письмо'), w('heading','заголовок'), w('date','дата'),
        w('reference','ссылка'), w('salutation','приветствие'), w('opening','открытие'),
        w('body','основная часть'), w('closing','завершение'), w('signature','подпись'),
        w('formal','официальный'), w('tone','тон'), w('Dear Sir','Уважаемый'),
        w('yours faithfully','с уважением'), w('yours sincerely','искренне ваш'),
        w('cc','копия'), w('enclosure','приложение'), w('follow-up','последующие действия'),
        w('acknowledgement','подтверждение'), w('response','ответ'), w('complaint','жалоба'),
        w('inquiry','запрос'), w('instruction','инструкция'), w('professional','профессиональный'),
        w('clear','ясный'), w('concise','краткий'),
      ],
    },
  ],
}

// ─── Module 5 – Strategic Management (B2) ────────────────────────────────────
const mod_strategic_mgmt: MD = {
  title: 'Strategic Management', section: 'B2', lessons: [
    {
      title: 'Vision & Mission',
      words: [
        w('vision','видение'), w('mission','миссия'), w('values','ценности'), w('purpose','цель'),
        w('strategy','стратегия'), w('objective','задача'), w('goal','цель'),
        w('strategic intent','стратегическое намерение'), w('aspiration','стремление'),
        w('direction','направление'), w('inspire','вдохновлять'), w('communicate','доносить'),
        w('align','согласовывать'), w('stakeholder','заинтересованная сторона'), w('brand','бренд'),
        w('culture','культура'), w('long-term','долгосрочный'), w('core business','основной бизнес'),
        w('differentiation','дифференциация'), w('competitive position','конкурентная позиция'),
        w('why','зачем'), w('how','как'), w('what','что'), w('commitment','приверженность'),
        w('review','пересмотр'),
      ],
    },
    {
      title: 'SWOT',
      words: [
        w('SWOT','SWOT'), w('strengths','сильные стороны'), w('weaknesses','слабые стороны'),
        w('opportunities','возможности'), w('threats','угрозы'), w('internal','внутренний'),
        w('external','внешний'), w('analysis','анализ'), w('environment','среда'),
        w('competitive','конкурентный'), w('resource','ресурс'), w('capability','возможность'),
        w('market','рынок'), w('trend','тенденция'), w('risk','риск'), w('leverage','использовать'),
        w('mitigate','снижать'), w('exploit','использовать'), w('defend','защищать'),
        w('TOWS matrix','матрица TOWS'), w('strategic option','стратегический вариант'),
        w('prioritise','приоритизировать'), w('assess','оценивать'), w('factor','фактор'),
        w('strategic fit','стратегическое соответствие'),
      ],
    },
    {
      title: 'Porter\'s Five Forces',
      words: [
        w('Porter\'s Five Forces','Пять сил Портера'),
        w('competitive rivalry','конкурентное соперничество'),
        w('threat of new entrants','угроза новых участников'),
        w('bargaining power of buyers','переговорная сила покупателей'),
        w('bargaining power of suppliers','переговорная сила поставщиков'),
        w('threat of substitutes','угроза замены'), w('industry structure','структура отрасли'),
        w('barriers to entry','барьеры для входа'), w('switching costs','издержки переключения'),
        w('concentration','концентрация'), w('profitability','прибыльность'),
        w('competitive advantage','конкурентное преимущество'), w('market power','рыночная власть'),
        w('substitute product','продукт-заменитель'),
        w('industry attractiveness','привлекательность отрасли'),
        w('strategic position','стратегическая позиция'), w('rivalry','соперничество'),
        w('differentiation','дифференциация'), w('cost leadership','лидерство по затратам'),
        w('focus strategy','стратегия фокуса'), w('niche','ниша'), w('scale','масштаб'),
        w('regulation','регулирование'), w('intellectual property','интеллектуальная собственность'),
        w('competitive intensity','интенсивность конкуренции'),
      ],
    },
    {
      title: 'Competitive Advantage',
      words: [
        w('competitive advantage','конкурентное преимущество'), w('differentiation','дифференциация'),
        w('cost leadership','лидерство по затратам'), w('focus','фокус'), w('niche','ниша'),
        w('value proposition','ценностное предложение'), w('unique selling point','уникальное торговое предложение'),
        w('USP','УТП'), w('resource','ресурс'), w('capability','возможность'),
        w('core competence','ключевая компетенция'), w('sustainable advantage','устойчивое преимущество'),
        w('generic strategy','родовая стратегия'), w('value chain','цепочка создания ценности'),
        w('activity','деятельность'), w('primary activity','основная деятельность'),
        w('support activity','вспомогательная деятельность'), w('inimitable','неповторимый'),
        w('rare','редкий'), w('valuable','ценный'), w('non-substitutable','незаменимый'),
        w('VRIN','VRIN'), w('strategic resource','стратегический ресурс'),
        w('competitive position','конкурентная позиция'), w('Porter','Портер'),
      ],
    },
    {
      title: 'Strategic Planning',
      words: [
        w('strategic planning','стратегическое планирование'), w('strategy','стратегия'),
        w('vision','видение'), w('mission','миссия'), w('objective','задача'), w('SWOT','SWOT'),
        w('environmental scan','анализ среды'), w('PESTLE','PESTLE'),
        w('competitive analysis','конкурентный анализ'), w('option','вариант'),
        w('prioritise','приоритизировать'), w('strategic choice','стратегический выбор'),
        w('implement','реализовать'), w('monitor','контролировать'), w('review','пересматривать'),
        w('corporate strategy','корпоративная стратегия'),
        w('business strategy','бизнес-стратегия'),
        w('functional strategy','функциональная стратегия'),
        w('scenario planning','сценарное планирование'),
        w('strategic risk','стратегический риск'), w('resource allocation','распределение ресурсов'),
        w('alignment','согласование'), w('cascade','каскадировать'),
        w('balanced scorecard','сбалансированная система'), w('roadmap','дорожная карта'),
      ],
    },
    {
      title: 'Goals',
      words: [
        w('goal','цель'), w('objective','задача'), w('target','целевой показатель'), w('SMART','SMART'),
        w('specific','конкретный'), w('measurable','измеримый'), w('achievable','достижимый'),
        w('relevant','релевантный'), w('time-bound','ограниченный по времени'),
        w('strategic goal','стратегическая цель'), w('operational goal','операционная цель'),
        w('KPI','КПЭ'), w('OKR','OKR'),
        w('objective and key result','задача и ключевой результат'),
        w('cascade','каскадировать'), w('align','согласовывать'), w('priority','приоритет'),
        w('milestone','веха'), w('progress','прогресс'), w('review','проверка'),
        w('accountability','подотчётность'), w('team goal','командная цель'),
        w('individual goal','индивидуальная цель'), w('outcome','результат'), w('stretch goal','амбициозная цель'),
      ],
    },
  ],
}

// ─── Module 6 – Operations Management (B2) ───────────────────────────────────
const mod_operations: MD = {
  title: 'Operations Management', section: 'B2', lessons: [
    {
      title: 'Processes',
      words: [
        w('process','процесс'), w('workflow','рабочий процесс'), w('input','вход'),
        w('output','выход'), w('transformation','преобразование'), w('value-added','добавляющий ценность'),
        w('non-value-added','не добавляющий ценности'), w('process map','карта процесса'),
        w('flowchart','блок-схема'), w('standard','стандарт'), w('efficiency','эффективность'),
        w('effectiveness','результативность'), w('bottleneck','узкое место'),
        w('capacity','пропускная способность'), w('throughput','производительность'),
        w('cycle time','время цикла'), w('lead time','время выполнения'), w('takt time','такт-время'),
        w('process improvement','улучшение процесса'), w('waste','потери'),
        w('variability','изменчивость'), w('error','ошибка'), w('defect','дефект'),
        w('handover','передача'), w('handoff','передача ответственности'),
      ],
    },
    {
      title: 'Lean',
      words: [
        w('lean','бережливое производство'), w('waste','потери'), w('muda','муда'), w('value','ценность'),
        w('value stream','поток создания ценности'), w('flow','поток'), w('pull','вытягивание'),
        w('perfection','совершенство'), w('5S','5S'), w('sort','сортировать'),
        w('set in order','упорядочить'), w('shine','содержать в чистоте'),
        w('standardise','стандартизировать'), w('sustain','поддерживать'), w('kaizen','кайдзен'),
        w('continuous improvement','непрерывное улучшение'), w('just-in-time','точно в срок'),
        w('JIT','ЛТС'), w('Kanban','Канбан'), w('Poka-Yoke','Пока-ёке'),
        w('root cause analysis','анализ первопричин'), w('5 Whys','5 Почему'),
        w('fishbone diagram','диаграмма Исикавы'), w('PDCA','PDCA'), w('elimination','устранение'),
      ],
    },
    {
      title: 'Supply Chain',
      words: [
        w('supply chain','цепочка поставок'), w('supplier','поставщик'),
        w('manufacturer','производитель'), w('distributor','дистрибьютор'), w('retailer','розничный'),
        w('customer','клиент'), w('logistics','логистика'), w('procurement','закупки'),
        w('sourcing','поиск поставщиков'), w('inventory','запасы'), w('warehouse','склад'),
        w('transportation','транспортировка'), w('lead time','время выполнения'),
        w('demand','спрос'), w('forecast','прогноз'), w('replenishment','пополнение запасов'),
        w('just-in-time','точно в срок'), w('lean','бережливое производство'),
        w('risk','риск'), w('resilience','устойчивость'), w('disruption','сбой'),
        w('vendor','вендор'), w('tier 1 supplier','поставщик 1-го уровня'),
        w('outsource','аутсорсировать'), w('globalisation','глобализация'),
      ],
    },
    {
      title: 'Quality Management',
      words: [
        w('quality','качество'), w('total quality management','общее управление качеством'),
        w('TQM','ТУК'), w('ISO 9001','ISO 9001'), w('quality standard','стандарт качества'),
        w('inspection','проверка'), w('defect','дефект'), w('zero defects','ноль дефектов'),
        w('Six Sigma','Шесть сигм'), w('DMAIC','DMAIC'), w('define','определить'),
        w('measure','измерить'), w('analyse','проанализировать'), w('improve','улучшить'),
        w('control','контролировать'), w('quality control','контроль качества'),
        w('quality assurance','обеспечение качества'), w('customer satisfaction','удовлетворённость клиента'),
        w('specification','спецификация'), w('tolerance','допуск'),
        w('non-conformance','несоответствие'), w('corrective action','корректирующее действие'),
        w('audit','аудит'), w('certification','сертификация'),
        w('continuous improvement','непрерывное улучшение'),
      ],
    },
    {
      title: 'KPIs',
      words: [
        w('KPI','КПЭ'), w('operational KPI','операционный КПЭ'), w('productivity','производительность'),
        w('efficiency','эффективность'), w('throughput','производительность'),
        w('OEE','OEE'), w('overall equipment effectiveness','общая эффективность оборудования'),
        w('cycle time','время цикла'), w('defect rate','уровень дефектов'),
        w('on-time delivery','доставка в срок'), w('inventory turnover','оборачиваемость запасов'),
        w('order fulfilment','выполнение заказов'), w('customer satisfaction','удовлетворённость клиента'),
        w('cost per unit','стоимость единицы'), w('downtime','простой'), w('utilisation','использование'),
        w('yield','выход'), w('return rate','уровень возврата'), w('lead time','время выполнения'),
        w('first pass yield','выход с первого прохода'), w('waste','потери'),
        w('energy consumption','потребление энергии'), w('safety incidents','инциденты безопасности'),
        w('absenteeism','прогулы'), w('revenue per employee','выручка на сотрудника'),
      ],
    },
    {
      title: 'Continuous Improvement',
      words: [
        w('continuous improvement','непрерывное улучшение'), w('kaizen','кайдзен'), w('PDCA','PDCA'),
        w('plan','планировать'), w('do','выполнять'), w('check','проверять'), w('act','действовать'),
        w('Lean','бережливое производство'), w('Six Sigma','Шесть сигм'),
        w('root cause analysis','анализ первопричин'), w('5 Whys','5 Почему'),
        w('fishbone','рыбья кость'), w('waste elimination','устранение потерь'),
        w('process mapping','картирование процессов'), w('baseline','базовая линия'),
        w('target','целевой показатель'), w('measure','измерить'), w('improvement project','проект улучшения'),
        w('pilot','пилот'), w('scale','масштабировать'), w('embed','внедрить'),
        w('sustain','поддерживать'), w('culture','культура'), w('employee engagement','вовлечённость'),
        w('benchmark','эталон'),
      ],
    },
  ],
}

// ─── Module 7 – Project Management (B2) ──────────────────────────────────────
const mod_project_mgmt: MD = {
  title: 'Project Management', section: 'B2', lessons: [
    {
      title: 'Project Lifecycle',
      words: [
        w('project lifecycle','жизненный цикл проекта'), w('initiation','инициирование'),
        w('planning','планирование'), w('execution','исполнение'), w('monitoring','мониторинг'),
        w('closing','завершение'), w('phase','фаза'), w('deliverable','результат'),
        w('milestone','веха'), w('gate review','контрольный просмотр'), w('scope','охват'),
        w('schedule','расписание'), w('budget','бюджет'), w('quality','качество'),
        w('risk','риск'), w('stakeholder','заинтересованная сторона'),
        w('project manager','менеджер проекта'), w('project sponsor','спонсор проекта'),
        w('project team','проектная команда'), w('charter','устав проекта'),
        w('business case','бизнес-кейс'), w('kickoff','начало'), w('handover','передача'),
        w('lessons learned','извлечённые уроки'), w('post-project review','посмертный анализ'),
      ],
    },
    {
      title: 'Agile & Waterfall',
      words: [
        w('agile','гибкий'), w('waterfall','каскадный'), w('scrum','скрам'), w('sprint','спринт'),
        w('backlog','бэклог'), w('user story','пользовательская история'),
        w('iteration','итерация'), w('kanban','Канбан'), w('product owner','владелец продукта'),
        w('scrum master','скрам-мастер'), w('velocity','скорость'), w('retrospective','ретроспектива'),
        w('review','проверка'), w('planning','планирование'), w('daily standup','ежедневный стендап'),
        w('burn-down','график сгорания'), w('epic','эпик'), w('story point','балл истории'),
        w('definition of done','определение готовности'), w('cross-functional team','кросс-функциональная команда'),
        w('sequential','последовательный'), w('phase','фаза'), w('deliverable','результат'),
        w('change request','запрос на изменение'), w('flexibility','гибкость'),
      ],
    },
    {
      title: 'Risk Management',
      words: [
        w('risk','риск'), w('risk register','реестр рисков'), w('probability','вероятность'),
        w('impact','воздействие'), w('risk matrix','матрица рисков'), w('risk owner','владелец риска'),
        w('risk appetite','аппетит к риску'), w('residual risk','остаточный риск'),
        w('inherent risk','неотъемлемый риск'), w('mitigation','снижение'),
        w('avoidance','избегание'), w('transfer','перенос'), w('acceptance','принятие'),
        w('contingency plan','резервный план'), w('risk trigger','триггер риска'),
        w('risk response','реакция на риск'), w('monitor','отслеживать'), w('review','проверять'),
        w('escalate','эскалировать'), w('risk log','журнал рисков'), w('issue','проблема'),
        w('assumption','допущение'), w('dependency','зависимость'), w('RAID log','журнал RAID'),
        w('Monte Carlo','Монте-Карло'),
      ],
    },
    {
      title: 'Budgeting',
      words: [
        w('project budget','бюджет проекта'), w('cost estimate','оценка затрат'),
        w('baseline','базовая линия'), w('actual cost','фактические затраты'),
        w('earned value','освоенный объём'), w('EVM','EVM'), w('cost variance','отклонение затрат'),
        w('schedule variance','отклонение расписания'), w('CPI','CPI'), w('SPI','SPI'),
        w('contingency reserve','резерв на непредвиденные'),
        w('management reserve','управленческий резерв'),
        w('budget at completion','бюджет при завершении'),
        w('estimate at completion','оценка при завершении'), w('forecast','прогноз'),
        w('overrun','перерасход'), w('underspend','недорасход'), w('change request','запрос на изменение'),
        w('cost control','контроль затрат'), w('expenditure','расходы'), w('commitment','обязательство'),
        w('accrual','начисление'), w('invoice','счёт'), w('approval','одобрение'),
        w('financial reporting','финансовая отчётность'),
      ],
    },
    {
      title: 'Stakeholders',
      words: [
        w('stakeholder','заинтересованная сторона'), w('stakeholder map','карта заинтересованных сторон'),
        w('power/interest grid','сетка власти/интереса'), w('high influence','высокое влияние'),
        w('low influence','низкое влияние'), w('engage','вовлекать'), w('inform','информировать'),
        w('consult','консультировать'), w('manage','управлять'),
        w('communication plan','план коммуникации'), w('register','реестр'), w('analysis','анализ'),
        w('expectation','ожидание'), w('requirement','требование'), w('sponsor','спонсор'),
        w('key stakeholder','ключевая заинтересованная сторона'), w('executive','руководитель'),
        w('end user','конечный пользователь'), w('customer','клиент'), w('supplier','поставщик'),
        w('regulator','регулятор'), w('media','СМИ'), w('community','сообщество'),
        w('resistance','сопротивление'), w('champion','чемпион'),
      ],
    },
    {
      title: 'Milestones',
      words: [
        w('milestone','веха'), w('deliverable','результат'), w('deadline','срок'),
        w('critical path','критический путь'), w('critical activity','критическая работа'),
        w('float','резерв'), w('slack','временной резерв'), w('network diagram','сетевой график'),
        w('Gantt chart','диаграмма Ганта'), w('schedule','расписание'), w('baseline','базовая линия'),
        w('actual','фактический'), w('variance','отклонение'), w('delay','задержка'),
        w('acceleration','ускорение'), w('dependency','зависимость'), w('predecessor','предшественник'),
        w('successor','последователь'), w('lag','запаздывание'), w('lead','опережение'),
        w('phase gate','фазовый шлюз'), w('review','проверка'), w('sign-off','утверждение'),
        w('approval','одобрение'), w('progress report','отчёт о прогрессе'),
      ],
    },
  ],
}

// ─── Module 8 – HR Management (B2) ───────────────────────────────────────────
const mod_hr_mgmt: MD = {
  title: 'HR Management', section: 'B2', lessons: [
    {
      title: 'Recruitment',
      words: [
        w('recruitment','подбор персонала'), w('job description','должностная инструкция'),
        w('person specification','требования к кандидату'), w('advertise','размещать вакансию'),
        w('job board','доска объявлений'), w('headhunt','хедхантинг'), w('CV','CV'),
        w('resume','резюме'), w('application','заявка'), w('shortlist','краткий список'),
        w('interview','собеседование'), w('assessment centre','ассессмент-центр'),
        w('psychometric test','психометрический тест'), w('competency','компетенция'),
        w('offer','предложение'), w('reject','отклонить'), w('reference','рекомендация'),
        w('background check','проверка биографии'), w('onboard','ввести в должность'),
        w('diversity','разнообразие'), w('inclusion','инклюзивность'),
        w('employer brand','бренд работодателя'), w('talent pipeline','кадровый резерв'),
        w('internal promotion','внутреннее продвижение'), w('external hire','внешний найм'),
      ],
    },
    {
      title: 'Onboarding',
      words: [
        w('onboarding','адаптация'), w('induction','вводный инструктаж'), w('new hire','новый сотрудник'),
        w('orientation','ориентация'), w('welcome','приветствие'), w('buddy','бадди'),
        w('mentor','ментор'), w('training plan','план обучения'), w('IT setup','настройка ИТ'),
        w('access','доступ'), w('documentation','документация'), w('probation','испытательный срок'),
        w('objectives','цели'), w('culture','культура'), w('team introduction','знакомство с командой'),
        w('handbook','справочник'), w('compliance training','обучение соответствию'),
        w('health and safety','здоровье и безопасность'), w('systems','системы'),
        w('processes','процессы'), w('30-60-90 plan','план 30-60-90'),
        w('check-in','встреча'), w('feedback','обратная связь'), w('retention','удержание'),
        w('engagement','вовлечённость'),
      ],
    },
    {
      title: 'Training',
      words: [
        w('training','обучение'), w('learning and development','обучение и развитие'), w('L&D','О&Р'),
        w('needs analysis','анализ потребностей'), w('skill gap','разрыв в навыках'),
        w('competency','компетенция'), w('classroom training','аудиторное обучение'),
        w('e-learning','электронное обучение'), w('on-the-job','на рабочем месте'),
        w('coaching','коучинг'), w('mentoring','наставничество'), w('workshop','мастерская'),
        w('seminar','семинар'), w('certification','сертификация'), w('CPD','НПР'),
        w('continuing professional development','непрерывное профессиональное развитие'),
        w('return on investment','рентабельность инвестиций'), w('ROI','ROI'),
        w('evaluation','оценка'), w('Kirkpatrick model','модель Киркпатрика'),
        w('reaction','реакция'), w('learning','обучение'), w('behaviour','поведение'),
        w('results','результаты'), w('training plan','план обучения'),
      ],
    },
    {
      title: 'Performance Reviews',
      words: [
        w('performance review','оценка результатов'), w('appraisal','аттестация'),
        w('annual review','ежегодная проверка'), w('mid-year review','полугодовая проверка'),
        w('360 feedback','обратная связь 360°'), w('self-assessment','самооценка'),
        w('manager assessment','оценка менеджером'), w('objective','цель'), w('KPI','КПЭ'),
        w('rating','оценка'), w('calibration','калибровка'), w('development plan','план развития'),
        w('promotion','продвижение'), w('succession planning','планирование преемственности'),
        w('talent management','управление талантами'),
        w('performance improvement plan','план улучшения результативности'), w('PIP','ПУР'),
        w('recognition','признание'), w('reward','вознаграждение'), w('compensation','компенсация'),
        w('benchmark','эталон'), w('normalisation','нормализация'), w('bias','предвзятость'),
        w('fairness','справедливость'), w('documentation','документация'),
      ],
    },
    {
      title: 'Retention',
      words: [
        w('retention','удержание'), w('turnover','текучесть'), w('attrition','отток'),
        w('employee engagement','вовлечённость'), w('satisfaction','удовлетворённость'),
        w('survey','опрос'), w('pulse survey','пульс-опрос'), w('exit interview','выходное интервью'),
        w('stay interview','интервью о причинах остаться'), w('reward','вознаграждение'),
        w('recognition','признание'), w('career development','карьерное развитие'),
        w('flexible working','гибкий график'), w('work-life balance','баланс работы и жизни'),
        w('culture','культура'), w('values','ценности'), w('purpose','цель'),
        w('belonging','принадлежность'), w('psychological safety','психологическая безопасность'),
        w('manager quality','качество менеджера'), w('promotion','продвижение'),
        w('succession','преемственность'), w('benefits','льготы'), w('salary review','пересмотр зарплаты'),
        w('employer brand','бренд работодателя'),
      ],
    },
    {
      title: 'Organisational Culture',
      words: [
        w('culture','культура'), w('values','ценности'), w('norms','нормы'),
        w('behaviour','поведение'), w('climate','климат'), w('shared beliefs','общие убеждения'),
        w('leadership','лидерство'), w('tone from the top','тон сверху'),
        w('culture assessment','оценка культуры'), w('change','изменение'), w('culture gap','культурный разрыв'),
        w('alignment','согласование'), w('diversity and inclusion','разнообразие и инклюзивность'),
        w('D&I','Р&И'), w('belonging','принадлежность'),
        w('psychological safety','психологическая безопасность'), w('trust','доверие'),
        w('transparency','прозрачность'), w('communication','коммуникация'),
        w('recognition','признание'), w('feedback','обратная связь'), w('engagement','вовлечённость'),
        w('purpose','цель'), w('brand','бренд'), w('organisational identity','организационная идентичность'),
      ],
    },
  ],
}

// ─── Module 9 – Financial Management (C1) ────────────────────────────────────
const mod_financial_mgmt: MD = {
  title: 'Financial Management', section: 'C1', lessons: [
    {
      title: 'Budgeting',
      words: [
        w('budget','бюджет'), w('master budget','сводный бюджет'), w('operating budget','операционный бюджет'),
        w('capital budget','капитальный бюджет'), w('zero-based budgeting','бюджетирование с нуля'),
        w('incremental budgeting','приростное бюджетирование'), w('rolling budget','скользящий бюджет'),
        w('budget holder','распорядитель бюджета'), w('variance analysis','анализ отклонений'),
        w('favourable','благоприятный'), w('adverse','неблагоприятный'), w('reforecast','пересмотр прогноза'),
        w('budget cycle','бюджетный цикл'), w('approval','одобрение'),
        w('budget committee','бюджетный комитет'), w('top-down','сверху вниз'),
        w('bottom-up','снизу вверх'), w('assumption','допущение'), w('driver','драйвер'),
        w('sensitivity','чувствительность'), w('flexed budget','гибкий бюджет'),
        w('cost centre','центр затрат'), w('profit centre','центр прибыли'),
        w('investment centre','центр инвестиций'), w('budget control','бюджетный контроль'),
      ],
    },
    {
      title: 'Cost Analysis',
      words: [
        w('cost analysis','анализ затрат'), w('fixed cost','постоянные затраты'),
        w('variable cost','переменные затраты'), w('semi-variable','полупеременные'),
        w('direct cost','прямые затраты'), w('indirect cost','косвенные затраты'),
        w('overhead','накладные расходы'), w('cost allocation','распределение затрат'),
        w('absorption costing','позаказный учёт'), w('marginal costing','маржинальный учёт'),
        w('activity-based costing','учёт по видам деятельности'), w('ABC','ABC'),
        w('cost driver','носитель затрат'), w('cost pool','пул затрат'),
        w('cost centre','центр затрат'), w('break-even','точка безубыточности'),
        w('contribution','вклад'), w('margin','маржа'), w('cost reduction','снижение затрат'),
        w('efficiency','эффективность'), w('value analysis','анализ ценности'),
        w('benchmarking','бенчмаркинг'), w('cost model','модель затрат'),
        w('profitability','прибыльность'), w('cost structure','структура затрат'),
      ],
    },
    {
      title: 'P&L',
      words: [
        w('profit and loss','прибыль и убытки'), w('P&L','ОПУ'),
        w('income statement','отчёт о доходах'), w('revenue','выручка'),
        w('cost of goods sold','себестоимость'), w('gross profit','валовая прибыль'),
        w('gross margin','маржа валовой прибыли'), w('operating expense','операционные расходы'),
        w('EBIT','EBIT'), w('EBITDA','EBITDA'), w('depreciation','амортизация'),
        w('amortisation','амортизация НМА'), w('interest','проценты'), w('tax','налог'),
        w('net profit','чистая прибыль'), w('net margin','маржа чистой прибыли'),
        w('exceptional items','исключительные статьи'), w('prior year','предыдущий год'),
        w('budget','бюджет'), w('actual','фактический'), w('variance','отклонение'),
        w('management accounts','управленческая отчётность'),
        w('monthly reporting','ежемесячная отчётность'), w('year-to-date','с начала года'),
        w('forecast','прогноз'),
      ],
    },
    {
      title: 'Investment Decisions',
      words: [
        w('investment decision','инвестиционное решение'), w('capital budgeting','бюджетирование капвложений'),
        w('NPV','ЧПС'), w('IRR','ВНД'), w('payback period','срок окупаемости'),
        w('discounted cash flow','дисконтированный денежный поток'), w('DCF','ДДП'),
        w('hurdle rate','пороговая ставка'), w('WACC','WACC'),
        w('cost of capital','стоимость капитала'), w('return on investment','рентабельность инвестиций'),
        w('ROI','ROI'), w('risk','риск'), w('sensitivity analysis','анализ чувствительности'),
        w('scenario','сценарий'), w('post-investment review','анализ после инвестиций'),
        w('capital allocation','распределение капитала'),
        w('strategic investment','стратегические инвестиции'), w('capex','капвложения'),
        w('opex','операционные расходы'), w('approval','одобрение'), w('business case','бизнес-кейс'),
        w('option','вариант'), w('prioritise','приоритизировать'), w('portfolio','портфель'),
      ],
    },
    {
      title: 'Financial Reporting',
      words: [
        w('financial reporting','финансовая отчётность'), w('annual report','годовой отчёт'),
        w('management accounts','управленческая отчётность'),
        w('statutory accounts','уставная отчётность'), w('P&L','ОПУ'),
        w('balance sheet','баланс'), w('cash flow statement','отчёт о движении денежных средств'),
        w('notes','примечания'), w('IFRS','МСФО'), w('UK GAAP','UK GAAP'),
        w('consolidation','консолидация'), w('intercompany','внутригрупповой'),
        w('audit','аудит'), w('external auditor','внешний аудитор'), w('review','проверка'),
        w('governance','управление'), w('board','совет'), w('disclosure','раскрытие'),
        w('investor','инвестор'), w('analyst','аналитик'), w('regulatory','регуляторный'),
        w('filing deadline','срок подачи'), w('Companies House','Регистрационная палата'),
        w('transparency','прозрачность'), w('KPI','КПЭ'),
      ],
    },
    {
      title: 'Controlling',
      words: [
        w('financial controlling','финансовый контроллинг'), w('controller','контроллер'),
        w('management accounts','управленческая отчётность'),
        w('variance analysis','анализ отклонений'), w('budget vs actual','бюджет против факта'),
        w('forecast','прогноз'), w('KPI','КПЭ'), w('dashboard','дашборд'),
        w('cost control','контроль затрат'), w('revenue management','управление доходами'),
        w('working capital','оборотный капитал'), w('cash flow','денежный поток'),
        w('receivables','дебиторская задолженность'), w('payables','кредиторская задолженность'),
        w('inventory','запасы'), w('month-end close','закрытие месяца'),
        w('reconciliation','сверка'), w('journal','журнал'), w('accrual','начисление'),
        w('prepayment','предоплата'), w('intercompany','внутригрупповой'),
        w('sign-off','утверждение'), w('commentary','комментарий'), w('action','действие'),
        w('corrective measure','корректирующая мера'),
      ],
    },
  ],
}

// ─── Module 10 – Change Management (C1) ──────────────────────────────────────
const mod_change_mgmt: MD = {
  title: 'Change Management', section: 'C1', lessons: [
    {
      title: 'Change Models',
      words: [
        w('change model','модель изменений'), w('Kotter\'s 8 steps','8 шагов Коттера'),
        w('Lewin\'s model','модель Левина'), w('unfreeze','разморозить'), w('change','изменить'),
        w('refreeze','заморозить снова'), w('ADKAR','ADKAR'), w('awareness','осознание'),
        w('desire','желание'), w('knowledge','знание'), w('ability','способность'),
        w('reinforcement','подкрепление'), w('McKinsey 7S','McKinsey 7S'), w('Prosci','Prosci'),
        w('change curve','кривая изменений'), w('Kübler-Ross','Кюблер-Росс'),
        w('denial','отрицание'), w('anger','гнев'), w('bargaining','торг'),
        w('depression','депрессия'), w('acceptance','принятие'), w('transition','переход'),
        w('transformation','трансформация'), w('change journey','путь изменений'), w('framework','концепция'),
      ],
    },
    {
      title: 'Resistance',
      words: [
        w('resistance','сопротивление'), w('change resistance','сопротивление изменениям'),
        w('barrier','барьер'), w('reluctance','нежелание'), w('fear','страх'),
        w('uncertainty','неопределённость'), w('ambiguity','двусмысленность'),
        w('loss aversion','неприятие потерь'), w('comfort zone','зона комфорта'),
        w('stakeholder resistance','сопротивление заинтересованных сторон'),
        w('active resistance','активное сопротивление'), w('passive resistance','пассивное сопротивление'),
        w('root cause','первопричина'), w('concern','озабоченность'), w('address','решать'),
        w('listen','слушать'), w('engage','вовлекать'), w('involve','участвовать'),
        w('communicate','доносить'), w('empathy','эмпатия'), w('champion','чемпион'),
        w('early adopter','первый пользователь'), w('sceptic','скептик'), w('convert','обратить'),
        w('overcome','преодолеть'),
      ],
    },
    {
      title: 'Communication Strategy',
      words: [
        w('communication strategy','стратегия коммуникации'),
        w('change communication','коммуникация изменений'), w('key message','ключевое сообщение'),
        w('audience','аудитория'), w('channel','канал'), w('frequency','частота'),
        w('two-way','двусторонний'), w('transparency','прозрачность'), w('honest','честный'),
        w('consistent','последовательный'), w('FAQ','FAQ'), w('rumour','слух'),
        w('narrative','нарратив'), w('briefing','брифинг'), w('town hall','общее собрание'),
        w('intranet','интранет'), w('email','электронная почта'), w('line manager','линейный менеджер'),
        w('cascade','каскадировать'), w('feedback','обратная связь'), w('listen','слушать'),
        w('adapt','адаптировать'), w('timing','выбор времени'), w('plan','план'),
        w('measurement','измерение'),
      ],
    },
    {
      title: 'Implementation',
      words: [
        w('implementation','реализация'), w('change plan','план изменений'),
        w('workstream','рабочий поток'), w('milestone','веха'), w('deliverable','результат'),
        w('owner','ответственный'), w('timeline','временная шкала'), w('resource','ресурс'),
        w('budget','бюджет'), w('dependency','зависимость'), w('risk','риск'),
        w('governance','управление'), w('steering committee','руководящий комитет'),
        w('programme office','офис программы'), w('PMO','PMO'), w('change network','сеть изменений'),
        w('change agent','агент изменений'), w('pilot','пилот'), w('rollout','развёртывание'),
        w('phased approach','поэтапный подход'), w('cutover','переход'),
        w('go-live','запуск'), w('hypercare','гиперуход'), w('stabilise','стабилизировать'),
        w('embed','внедрить'),
      ],
    },
    {
      title: 'Evaluation',
      words: [
        w('evaluation','оценка'), w('change effectiveness','эффективность изменений'),
        w('benefit realisation','реализация выгод'), w('measurement','измерение'),
        w('KPI','КПЭ'), w('baseline','базовая линия'), w('target','целевой показатель'),
        w('outcome','результат'), w('survey','опрос'), w('feedback','обратная связь'),
        w('adoption rate','уровень принятия'), w('usage','использование'),
        w('compliance','соответствие'), w('behaviour change','изменение поведения'),
        w('culture shift','культурный сдвиг'),
        w('post-implementation review','анализ после внедрения'),
        w('lessons learned','извлечённые уроки'), w('ROI','ROI'), w('sustainability','устойчивость'),
        w('embed','внедрить'), w('reinforce','усиливать'), w('celebrate','праздновать'),
        w('adjust','корректировать'), w('continuous improvement','непрерывное улучшение'),
        w('dashboard','дашборд'),
      ],
    },
    {
      title: 'Leadership',
      words: [
        w('change leadership','лидерство изменений'), w('leader','лидер'), w('sponsor','спонсор'),
        w('visible','заметный'), w('committed','приверженный'), w('champion','чемпион'),
        w('coalition','коалиция'), w('storytelling','сторителлинг'), w('vision','видение'),
        w('communicate','доносить'), w('listen','слушать'), w('empower','уполномочить'),
        w('role model','образец для подражания'), w('consistency','последовательность'),
        w('integrity','честность'), w('trust','доверие'), w('resilience','устойчивость'),
        w('ambiguity','неопределённость'), w('decision-making','принятие решений'),
        w('pace','темп'), w('prioritise','приоритизировать'), w('culture','культура'),
        w('accountability','подотчётность'), w('reward','вознаграждение'),
        w('recognition','признание'),
      ],
    },
  ],
}

// ─── Module 11 – Business Strategy (C1) ──────────────────────────────────────
const mod_business_strategy: MD = {
  title: 'Business Strategy', section: 'C1', lessons: [
    {
      title: 'Corporate Strategy',
      words: [
        w('corporate strategy','корпоративная стратегия'), w('diversification','диверсификация'),
        w('portfolio','портфель'), w('business unit','бизнес-единица'), w('core business','основной бизнес'),
        w('BCG matrix','матрица БКГ'), w('growth','рост'), w('question mark','знак вопроса'),
        w('star','звезда'), w('cash cow','дойная корова'), w('dog','собака'),
        w('Ansoff matrix','матрица Ансофф'), w('market penetration','проникновение на рынок'),
        w('product development','разработка продукта'), w('market development','развитие рынка'),
        w('vertical integration','вертикальная интеграция'),
        w('horizontal integration','горизонтальная интеграция'), w('synergy','синергия'),
        w('divestiture','дивестирование'), w('merger','слияние'), w('acquisition','поглощение'),
        w('strategic intent','стратегическое намерение'), w('corporate centre','корпоративный центр'),
        w('value creation','создание ценности'), w('strategic logic','стратегическая логика'),
      ],
    },
    {
      title: 'Mergers',
      words: [
        w('merger','слияние'), w('acquisition','поглощение'), w('M&A','M&A'),
        w('strategic rationale','стратегическое обоснование'), w('synergy','синергия'),
        w('cost saving','экономия затрат'), w('revenue synergy','синергия доходов'),
        w('due diligence','дью-дилидженс'), w('valuation','оценка'), w('integration','интеграция'),
        w('PMI','ИПС'), w('cultural fit','культурное соответствие'), w('target','цель'),
        w('acquirer','поглощающая компания'), w('hostile','враждебный'), w('friendly','дружественный'),
        w('regulatory approval','регуляторное одобрение'), w('antitrust','антимонопольный'),
        w('shareholder value','акционерная стоимость'), w('premium','премия'),
        w('dilution','разводнение'), w('EPS accretion','прирост EPS'), w('goodwill','деловая репутация'),
        w('write-down','списание'), w('post-merger','после слияния'),
      ],
    },
    {
      title: 'Diversification',
      words: [
        w('diversification','диверсификация'), w('related diversification','связанная диверсификация'),
        w('unrelated diversification','несвязанная диверсификация'), w('conglomerate','конгломерат'),
        w('portfolio','портфель'), w('risk spread','распределение риска'),
        w('core competence','ключевая компетенция'), w('synergy','синергия'),
        w('economies of scope','экономия от разнообразия'), w('market','рынок'), w('product','продукт'),
        w('geographic','географический'), w('organic growth','органический рост'),
        w('acquisition','поглощение'), w('joint venture','совместное предприятие'),
        w('alliance','альянс'), w('risk management','управление рисками'),
        w('revenue diversification','диверсификация доходов'), w('brand extension','расширение бренда'),
        w('new market','новый рынок'), w('new product','новый продукт'), w('resource','ресурс'),
        w('capability','возможность'), w('value creation','создание ценности'),
        w('strategic logic','стратегическая логика'),
      ],
    },
    {
      title: 'Innovation',
      words: [
        w('innovation','инновация'), w('disruptive','разрушительный'), w('incremental','постепенный'),
        w('radical','радикальный'), w('open innovation','открытая инновация'),
        w('R&D','НИОКР'), w('research and development','исследования и разработки'),
        w('product innovation','продуктовая инновация'), w('process innovation','процессная инновация'),
        w('business model innovation','инновация бизнес-модели'), w('design thinking','дизайн-мышление'),
        w('prototype','прототип'), w('pilot','пилот'), w('scale','масштабировать'),
        w('lean startup','бережливый стартап'), w('MVP','MVP'),
        w('minimum viable product','минимально жизнеспособный продукт'),
        w('intellectual property','интеллектуальная собственность'), w('patent','патент'),
        w('first mover','первопроходец'), w('fast follower','быстрый последователь'),
        w('ecosystem','экосистема'), w('platform','платформа'), w('agile','гибкий'),
        w('digital','цифровой'),
      ],
    },
    {
      title: 'Globalisation',
      words: [
        w('globalisation','глобализация'), w('internationalisation','интернационализация'),
        w('market entry','выход на рынок'), w('export','экспорт'), w('licensing','лицензирование'),
        w('franchising','франчайзинг'), w('joint venture','совместное предприятие'),
        w('acquisition','поглощение'), w('greenfield','гринфилд'),
        w('FDI','ПИИ'), w('foreign direct investment','прямые иностранные инвестиции'),
        w('localisation','локализация'), w('global strategy','глобальная стратегия'),
        w('multi-domestic','мультидомашний'), w('transnational','транснациональный'),
        w('trade barrier','торговый барьер'), w('tariff','тариф'), w('regulation','регулирование'),
        w('culture','культура'), w('political risk','политический риск'),
        w('currency risk','валютный риск'), w('supply chain','цепочка поставок'),
        w('emerging market','развивающийся рынок'), w('competitive advantage','конкурентное преимущество'),
        w('global brand','глобальный бренд'),
      ],
    },
    {
      title: 'Business Ethics',
      words: [
        w('business ethics','деловая этика'), w('corporate social responsibility','корпоративная социальная ответственность'),
        w('CSR','КСО'), w('stakeholder','заинтересованная сторона'), w('ESG','ESG'),
        w('environmental','экологический'), w('social','социальный'), w('governance','управление'),
        w('ethical decision-making','этическое принятие решений'), w('values','ценности'),
        w('code of conduct','кодекс поведения'), w('integrity','честность'),
        w('transparency','прозрачность'), w('accountability','подотчётность'),
        w('bribery','взяточничество'), w('corruption','коррупция'), w('whistleblowing','разоблачение'),
        w('modern slavery','современное рабство'), w('supply chain ethics','этика цепочки поставок'),
        w('greenwashing','гринвошинг'), w('reporting','отчётность'), w('sustainability','устойчивость'),
        w('purpose','цель'), w('trust','доверие'), w('reputation','репутация'),
      ],
    },
  ],
}

// ─── Module 12 – Executive Communication (C1) ────────────────────────────────
const mod_exec_communication: MD = {
  title: 'Executive Communication', section: 'C1', lessons: [
    {
      title: 'Board Reports',
      words: [
        w('board report','отчёт совету'), w('board of directors','совет директоров'),
        w('executive summary','резюме для руководства'), w('financial performance','финансовые результаты'),
        w('strategic update','стратегическое обновление'), w('risk overview','обзор рисков'),
        w('KPI dashboard','дашборд КПЭ'), w('budget vs actual','бюджет против факта'),
        w('year-to-date','с начала года'), w('variance','отклонение'),
        w('recommendation','рекомендация'), w('decision required','требуется решение'),
        w('for information','для информации'), w('governance','управление'),
        w('confidential','конфиденциальный'), w('board pack','пакет для совета'),
        w('appendix','приложение'), w('management accounts','управленческая отчётность'),
        w('outlook','прогноз'), w('headcount','численность персонала'),
        w('investment proposal','инвестиционное предложение'),
        w('regulatory update','регуляторное обновление'), w('action log','журнал действий'),
        w('minutes','протокол'), w('next meeting','следующая встреча'),
      ],
    },
    {
      title: 'Stakeholder Management',
      words: [
        w('stakeholder','заинтересованная сторона'),
        w('stakeholder map','карта заинтересованных сторон'),
        w('power interest grid','сетка власти/интереса'), w('engagement','вовлечённость'),
        w('communication','коммуникация'), w('expectation','ожидание'),
        w('requirement','требование'), w('relationship','отношения'), w('influence','влияние'),
        w('trust','доверие'), w('two-way','двусторонний'), w('tailored message','индивидуальное сообщение'),
        w('channel','канал'), w('frequency','частота'), w('key message','ключевое сообщение'),
        w('update','обновление'), w('listen','слушать'), w('feedback','обратная связь'),
        w('escalate','эскалировать'), w('report','отчитываться'), w('transparency','прозрачность'),
        w('accountability','подотчётность'), w('commitment','обязательство'),
        w('deliverable','результат'), w('satisfaction','удовлетворённость'),
      ],
    },
    {
      title: 'Crisis Communication',
      words: [
        w('crisis','кризис'), w('crisis communication','кризисная коммуникация'),
        w('spokesperson','пресс-секретарь'), w('key message','ключевое сообщение'),
        w('media','СМИ'), w('press statement','пресс-заявление'),
        w('holding statement','предварительное заявление'), w('briefing','брифинг'),
        w('social media','социальные сети'), w('transparency','прозрачность'),
        w('honest','честный'), w('timely','своевременный'), w('accurate','точный'),
        w('do not speculate','не спекулировать'), w('empathy','эмпатия'),
        w('action','действие'), w('resolution','разрешение'), w('reputational risk','репутационный риск'),
        w('brand','бренд'), w('stakeholder','заинтересованная сторона'),
        w('internal communication','внутренняя коммуникация'),
        w('external communication','внешняя коммуникация'), w('Q&A','Q&A'),
        w('lessons learned','извлечённые уроки'), w('recovery','восстановление'),
      ],
    },
    {
      title: 'Negotiations',
      words: [
        w('negotiation','переговоры'), w('preparation','подготовка'), w('interest','интерес'),
        w('position','позиция'), w('BATNA','BATNA'), w('ZOPA','ZOPA'),
        w('zone of possible agreement','зона возможного соглашения'), w('offer','предложение'),
        w('counter-offer','встречное предложение'), w('concession','уступка'),
        w('compromise','компромисс'), w('win-win','взаимовыгодный'), w('deadlock','тупик'),
        w('anchor','якорь'), w('opening bid','начальное предложение'), w('closing','закрытие'),
        w('agreement','соглашение'), w('relationship','отношения'), w('trust','доверие'),
        w('power','власть'), w('leverage','рычаг'), w('cultural difference','культурное различие'),
        w('style','стиль'), w('outcome','результат'), w('follow-up','последующие действия'),
      ],
    },
    {
      title: 'Public Speaking',
      words: [
        w('public speaking','публичные выступления'), w('speech','речь'),
        w('presentation','презентация'), w('keynote','основной доклад'), w('audience','аудитория'),
        w('message','сообщение'), w('structure','структура'), w('opening hook','зацепка открытия'),
        w('body','основная часть'), w('conclusion','заключение'), w('call to action','призыв к действию'),
        w('storytelling','сторителлинг'), w('data','данные'), w('visual aid','наглядное пособие'),
        w('pace','темп'), w('tone','тон'), w('eye contact','зрительный контакт'),
        w('gesture','жест'), w('pause','пауза'), w('confidence','уверенность'),
        w('nerves','волнение'), w('rehearse','репетировать'), w('Q&A','Q&A'),
        w('feedback','обратная связь'), w('impact','воздействие'),
      ],
    },
    {
      title: 'Leadership Narrative',
      words: [
        w('leadership narrative','нарратив лидера'), w('storytelling','сторителлинг'),
        w('vision','видение'), w('mission','миссия'), w('purpose','цель'), w('why','зачем'),
        w('inspire','вдохновлять'), w('connect','соединять'), w('authentic','аутентичный'),
        w('vulnerable','уязвимый'), w('personal','личный'), w('credible','достоверный'),
        w('consistent','последовательный'), w('message','сообщение'), w('audience','аудитория'),
        w('emotional','эмоциональный'), w('rational','рациональный'), w('example','пример'),
        w('metaphor','метафора'), w('data','данные'), w('challenge','вызов'),
        w('journey','путь'), w('transformation','трансформация'), w('call to action','призыв к действию'),
        w('legacy','наследие'),
      ],
    },
  ],
}

// ─── assembled module lists ────────────────────────────────────────────────────

const MAN_B1_MODULES: MD[] = [
  mod_mgmt_fundamentals,
  mod_communication,
  mod_team_mgmt,
  mod_business_docs,
]

const MAN_B1C1_MODULES: MD[] = [
  mod_mgmt_fundamentals,
  mod_communication,
  mod_team_mgmt,
  mod_business_docs,
  mod_strategic_mgmt,
  mod_operations,
  mod_project_mgmt,
  mod_hr_mgmt,
  mod_financial_mgmt,
  mod_change_mgmt,
  mod_business_strategy,
  mod_exec_communication,
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
  console.log('🚀 ESP Management seed script')
  console.log('   Supabase URL:', SUPABASE_URL)

  const ALL_IDS = [MAN_B1_ID, MAN_B1C1_ID]

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

  await seedCourse(MAN_B1_ID,   MAN_B1_MODULES,   'Management B1')
  await seedCourse(MAN_B1C1_ID, MAN_B1C1_MODULES, 'Management B1-C1')

  console.log('\n🎉 Done! Management seeded.')
  console.log(`   Management B1:    ${MAN_B1_MODULES.length} modules, ${MAN_B1_MODULES.length * 6} lessons`)
  console.log(`   Management B1-C1: ${MAN_B1C1_MODULES.length} modules, ${MAN_B1C1_MODULES.length * 6} lessons`)
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err)
  process.exit(1)
})
