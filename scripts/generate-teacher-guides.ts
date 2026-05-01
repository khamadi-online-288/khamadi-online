/**
 * Generate teacher methodology guides for KHAMADI ENGLISH.
 * Uses pdf-lib — correct Cyrillic rendering.
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/generate-teacher-guides.ts
 */

import * as path from 'path'
import * as fs from 'fs'
import { PdfWriter, C } from './pdf-builder'

const OUT_DIR = path.join(__dirname, '..', 'public', 'textbooks', 'teacher')

// ── Cover for teacher guides ───────────────────────────────────────────────────

function drawTeacherCover(w: PdfWriter, title: string, subtitle: string, desc: string): void {
  const band = Math.round(842 * 0.45)
  w._r(0, 0, 595, band, C.navy)
  w._r(0, band, 595, 8, C.gold)
  w._r(0, band + 8, 595, 842 - band - 8, C.lightBg)

  w._t('KHAMADI', 72, 68, 26, w.B, C.sky)
  w._t('ENGLISH', 72, 98, 26, w.B, C.gold)
  w._t('khamadi.online', 72, 130, 11, w.R, C.white)

  w._r(72, 168, 200, 30, C.gold)
  w._t('TEACHER GUIDE', 72 + 10, 175, 12, w.B, C.navy)

  let ty = 218
  for (const l of w.wrap(title, w.B, 28, 595 - 144)) {
    w._t(l, 72, ty, 28, w.B, C.white); ty += 38
  }
  ty += 8
  for (const l of w.wrap(subtitle, w.I, 14, 595 - 144)) {
    if (ty < band - 14) { w._t(l, 72, ty, 14, w.I, C.sky); ty += 20 }
  }
  ty += 10
  w._line(72, ty, 595 - 72, ty, C.sky)
  ty += 14
  for (const l of w.wrap(desc, w.R, 11, 595 - 144)) {
    if (ty < band - 11) { w._t(l, 72, ty, 11, w.R, C.white); ty += 16 }
  }

  const bY = band + 18
  w._t('Методическое пособие для преподавателей', 72, bY, 12, w.B, C.navy)
  w._t('Язык: русский  |  Издание 2026', 72, bY + 18, 10, w.R, C.gray)
}

// ── General Teacher Guide ──────────────────────────────────────────────────────

async function generateGeneralGuide(): Promise<void> {
  const w = await PdfWriter.create('General Teacher Guide', 'KHAMADI ENGLISH')

  w.newPage(false)
  drawTeacherCover(w, 'KHAMADI ENGLISH', 'Общее руководство для преподавателей',
    'Философия, методика, инструменты платформы, система оценивания, работа с AI.')

  // Intro
  w.newPage(false)
  w.y = 60
  w.sectionHeading('Введение', 1)
  w.bodyText(`Добро пожаловать в команду KHAMADI ENGLISH!

Данное методическое пособие разработано специально для преподавателей нашей платформы. В нём вы найдёте всё необходимое для эффективной работы со студентами: от философии нашего подхода до конкретных методических приёмов.

Мы убеждены, что качественное образование — это создание среды, где студенты чувствуют себя в безопасности, мотивированы к обучению и видят реальный прогресс.`)

  // Chapter 1: Philosophy
  w.newPage()
  w.sectionHeading('Глава 1. Философия платформы KHAMADI ENGLISH', 1)
  w.bodyText(`KHAMADI ENGLISH — образовательная платформа для казахстанских студентов, стремящихся к международному уровню владения английским.

Наша миссия: сделать качественное английское образование доступным для каждого жителя Казахстана.`)
  w.moveDown(0.5)
  w.sectionHeading('1.1 Наши ценности', 2)
  const values = [
    ['Качество', 'Все материалы разработаны в соответствии с международными стандартами CEFR и прошли профессиональную редактуру.'],
    ['Доступность', 'Материалы на двух языках (английском и русском) — каждый студент понимает объяснение.'],
    ['Технологичность', 'AI, геймификация, адаптивное обучение — для повышения эффективности учебного процесса.'],
    ['Ориентация на результат', 'Каждый элемент курса направлен на достижение конкретного измеримого результата.'],
    ['Уважение к студенту', 'Ошибки — часть обучения. Создавайте безопасную среду для риска.'],
  ]
  for (const [title, text] of values) {
    w.checkY(50)
    w.sectionHeading(title, 3)
    w.bodyText(text)
    w.moveDown(0.3)
  }

  w.sectionHeading('1.2 Уровни CEFR', 2)
  w.bodyText('Все курсы KHAMADI ENGLISH соответствуют уровням CEFR:')
  w.moveDown(0.3)
  const cefrRows = [
    ['A1', 'Beginner', 'Понимает и использует базовые фразы'],
    ['A1+', 'Elementary', 'Общается на простые темы'],
    ['A2', 'Pre-Intermediate', 'Справляется с повседневными ситуациями'],
    ['B1', 'Intermediate', 'Справляется с большинством ситуаций в путешествии'],
    ['B2', 'Upper-Intermediate', 'Общается свободно и спонтанно'],
    ['C1', 'Advanced', 'Выражается свободно и точно'],
  ]
  const colW = [50, 120, w.contentW - 50 - 120]
  const rowH = 22
  w.checkY(rowH * (cefrRows.length + 1) + 10)
  w._r(w.marginLeft, w.y, w.contentW, rowH, C.navy)
  let cx = w.marginLeft
  for (const [i, h] of ['Уровень', 'Название', 'Дескриптор'].entries()) {
    w._t(h, cx + 4, w.y + 6, 9, w.B, C.white); cx += colW[i]
  }
  w.y += rowH
  for (const [ri, row] of cefrRows.entries()) {
    if (ri % 2 === 1) w._r(w.marginLeft, w.y, w.contentW, rowH, C.accent)
    cx = w.marginLeft
    const fonts = [w.B, w.R, w.R] as const
    const colors = [C.navy, C.sky, C.black]
    for (let i = 0; i < 3; i++) {
      w._t(row[i], cx + 4, w.y + 6, 9, fonts[i], colors[i]); cx += colW[i]
    }
    w._r(w.marginLeft, w.y, w.contentW, rowH, C.accent, C.border, 0.3)
    w.y += rowH
  }
  w.moveDown(0.5)

  // Chapter 2: Platform
  w.newPage()
  w.sectionHeading('Глава 2. Платформа и кабинет преподавателя', 1)
  w.bodyText('Платформа KHAMADI ENGLISH (khamadi.online) включает несколько разделов. Преподаватель работает в Teacher Dashboard.')
  w.moveDown(0.5)
  w.sectionHeading('2.1 Основные функции Teacher Dashboard', 2)
  const funcs = [
    ['Управление группами', 'Создание, редактирование групп. Добавление и удаление студентов.'],
    ['Расписание', 'Создание расписания занятий с автоматическими напоминаниями.'],
    ['Мониторинг прогресса', 'Детальная статистика: время на платформе, пройденные уроки, результаты тестов.'],
    ['Задания', 'Назначение домашних заданий из банка упражнений с дедлайном.'],
    ['Отчёты', 'Генерация отчётов о прогрессе группы для родителей или администрации.'],
    ['Учебники', 'Доступ к PDF учебникам студентов и методическим пособиям.'],
    ['Сертификаты', 'Выдача сертификатов студентам, завершившим курс.'],
  ]
  for (const [fn, desc] of funcs) {
    w.checkY(30)
    w._t(fn + ':', w.marginLeft, w.y, 11, w.B, C.navy)
    w.y += 14
    for (const l of w.wrap(desc, w.R, 11, w.contentW - 10)) {
      w.checkY(16); w._t(l, w.marginLeft + 10, w.y, 11, w.R, C.black); w.y += 16
    }
    w.moveDown(0.3)
  }

  // Chapter 3: CLT
  w.newPage()
  w.sectionHeading('Глава 3. Коммуникативный подход (CLT)', 1)
  w.sectionHeading('3.1 Модель урока PPP', 2)
  w.bodyText('Presentation → Practice → Production — трёхступенчатая модель, ведущая студента от знакомства с материалом к самостоятельному использованию.')
  w.moveDown(0.3)
  w.ruNote('PPP = Презентация → Практика → Производство. Ключевая методическая модель KHAMADI ENGLISH.')
  w.moveDown(0.5)
  const ppp = [
    ['P1 — Presentation (10–15 мин)', 'Цель: ввести новый грамматический или лексический материал. Начните с реальной ситуации или текста. Проверьте понимание через концептуальные вопросы (CCQ).', 'Не объясняйте дольше 10 минут — студенты теряют внимание.'],
    ['P2 — Practice (15–20 мин)', 'Цель: отработать материал в контролируемых условиях. Начните с простых упражнений, постепенно усложняйте. Исправляйте ошибки немедленно.', 'Контролируемая практика — ступенька к свободной речи, не самоцель.'],
    ['P3 — Production (15–20 мин)', 'Цель: использовать материал в реальных ситуациях. Ролевые игры, дискуссии. Используйте отложенное исправление ошибок (delayed feedback).', 'Самый важный этап. Если студенты не говорят свободно — всё остальное бессмысленно.'],
  ]
  for (const [label, desc, tip] of ppp) {
    w.checkY(80)
    w._r(w.marginLeft, w.y, w.contentW, 22, C.navy)
    w._t(label, w.marginLeft + 10, w.y + 6, 11, w.B, C.gold)
    w.y += 26
    for (const l of w.wrap(desc, w.R, 11, w.contentW)) {
      w.checkY(16); w._t(l, w.marginLeft, w.y, 11, w.R, C.black); w.y += 16
    }
    w.moveDown(0.2)
    for (const l of w.wrap('💡 ' + tip, w.I, 10, w.contentW)) {
      w.checkY(14); w._t(l, w.marginLeft, w.y, 10, w.I, C.gray); w.y += 14
    }
    w.moveDown(0.6)
  }

  w.sectionHeading('3.2 Техники исправления ошибок', 2)
  const errorTechs = [
    ['Recast', 'Преподаватель повторяет высказывание в правильной форме без указания на ошибку. Пример: "Yesterday I go..." → "Oh, you went? What did you buy?"', 'Во время Production — не прерывает общение.'],
    ['Elicitation', 'Побудите студента исправить ошибку самостоятельно: "Yesterday I..." (пауза с вопросительной интонацией).', 'Когда студент знает правило — просто оговорился.'],
    ['Delayed Feedback', 'Запишите ошибки и разберите их после задания. Не прерывает коммуникацию.', 'Идеально для Production phase.'],
    ['Peer Correction', 'Студенты исправляют ошибки друг друга по чётким критериям.', 'При проверке письменных заданий.'],
  ]
  for (const [name, desc, when] of errorTechs) {
    w.checkY(60)
    w.sectionHeading(name, 3)
    for (const l of w.wrap(desc, w.R, 11, w.contentW)) {
      w.checkY(16); w._t(l, w.marginLeft, w.y, 11, w.R, C.black); w.y += 16
    }
    w._t('Когда: ', w.marginLeft, w.y, 10, w.B, C.gold)
    for (const l of w.wrap(when, w.I, 10, w.contentW - 50)) {
      w.checkY(14); w._t(l, w.marginLeft + 50, w.y, 10, w.I, C.gray); w.y += 14
    }
    w.moveDown(0.5)
  }

  // Chapter 4: Levels
  w.newPage()
  w.sectionHeading('Глава 4. Работа с группами разных уровней', 1)
  const levels = [
    ['A1 Beginner / Elementary',
      'Очень ограниченный словарный запас. Высокая тревожность. Частое использование родного языка.',
      'Много визуальной поддержки. Короткие простые инструкции. Объяснения на русском. Много повторения.',
      'Не ожидайте слишком многого слишком быстро. Первые 3 месяца — закладка фундамента.'],
    ['A2 Pre-Intermediate',
      'Базовые структуры освоены, но автоматизма нет. Словарный запас 800–1200 слов.',
      'Больше парной работы. Введение сложных структур. Начало работы с адаптированными текстами.',
      'Типичные ошибки: Present Simple/Continuous, Past Simple неправильные глаголы.'],
    ['B1 Intermediate',
      'Справляется с повседневными ситуациями. Словарный запас 2000+ слов.',
      'Работа с реальными материалами. Развитие Academic English. Стратегии чтения и аудирования.',
      'Типичные ошибки: Present Perfect vs Past Simple, Conditionals, Passive Voice.'],
    ['B2 Upper-Intermediate',
      'Свободное общение на большинство тем. Начинает осознавать нюансы языка.',
      'Критическое мышление. Академическое письмо. Идиомы и коллокации.',
      'Типичные ошибки: артикли, регистр (formal/informal), complex conditionals.'],
    ['C1 Advanced',
      'Практически свободное владение. Богатый активный словарный запас.',
      'Шлифовка нюансов. Профессиональный и академический English. Работа с медиатекстами.',
      'Типичные ошибки: false friends, тонкие стилистические ошибки.'],
  ]
  for (const [level, chars, approach, errors] of levels) {
    w.checkY(100)
    w._r(w.marginLeft, w.y, w.contentW, 22, C.navy)
    w._t(level, w.marginLeft + 10, w.y + 6, 13, w.B, C.gold)
    w.y += 26
    w._t('Характеристики: ', w.marginLeft, w.y, 10, w.B, C.sky)
    w.y += 14
    for (const l of w.wrap(chars, w.R, 10, w.contentW)) {
      w.checkY(14); w._t(l, w.marginLeft + 10, w.y, 10, w.R, C.black); w.y += 14
    }
    w._t('Подход: ', w.marginLeft, w.y, 10, w.B, C.sky); w.y += 14
    for (const l of w.wrap(approach, w.R, 10, w.contentW)) {
      w.checkY(14); w._t(l, w.marginLeft + 10, w.y, 10, w.R, C.black); w.y += 14
    }
    w._t('Ошибки: ', w.marginLeft, w.y, 10, w.B, C.gold); w.y += 14
    for (const l of w.wrap(errors, w.I, 10, w.contentW)) {
      w.checkY(14); w._t(l, w.marginLeft + 10, w.y, 10, w.I, C.gray); w.y += 14
    }
    w.divider()
    w.moveDown(0.4)
  }

  // Chapter 5: Lesson Planning
  w.newPage()
  w.sectionHeading('Глава 5. Планирование уроков', 1)
  w.bodyText('Хороший план урока — фундамент успешного занятия. Не импровизируйте без подготовки.')
  w.moveDown(0.5)
  w.sectionHeading('5.1 Структура плана урока', 2)
  const planParts = [
    ['Цели урока', 'Что студенты смогут делать в конце урока? Формулируйте через глаголы: "смогут использовать", "смогут описать". Максимум 3 цели.'],
    ['Разминка (5 мин)', 'Активирует студентов, создаёт рабочую атмосферу. Должна быть связана с темой урока.'],
    ['Презентация (10–15 мин)', 'Вводите новый материал через контекст, не в виде списка правил.'],
    ['Контролируемая практика (15–20 мин)', 'Упражнения с единственным правильным ответом — отработка формы.'],
    ['Свободная практика (15–20 мин)', 'Коммуникативные задания. Студенты используют язык свободно.'],
    ['Обратная связь (5 мин)', 'Разбор ошибок. Оценка достижения целей урока.'],
    ['Домашнее задание (2 мин)', 'Чёткое задание с конкретным сроком. Объясните что нужно сделать.'],
  ]
  for (const [part, desc] of planParts) {
    w.checkY(36)
    w._t(part, w.marginLeft, w.y, 11, w.B, C.navy); w.y += 15
    for (const l of w.wrap(desc, w.R, 11, w.contentW - 10)) {
      w.checkY(16); w._t(l, w.marginLeft + 10, w.y, 11, w.R, C.black); w.y += 16
    }
    w.moveDown(0.3)
  }

  // Chapter 6: Assessment
  w.newPage()
  w.sectionHeading('Глава 6. Система оценивания', 1)
  w.bodyText('Оценивание — непрерывный процесс, помогающий студенту и преподавателю понять, где они находятся и что нужно улучшить.')
  w.moveDown(0.5)
  w.sectionHeading('6.1 Виды оценивания', 2)
  const assessTypes = [
    ['Формативное', 'Текущее оценивание в ходе обучения. Цель: выявить пробелы и скорректировать обучение. Примеры: вопросы-ответы, мини-тесты, exit tickets.'],
    ['Суммативное', 'Итоговое оценивание по завершении темы или курса. Примеры: тест, проект, устный экзамен.'],
    ['Диагностическое', 'В начале курса для определения начального уровня и формирования групп.'],
    ['Взаимное (Peer)', 'Студенты оценивают работы друг друга по чётким критериям.'],
    ['Самооценивание', 'Студент оценивает свою работу. Развивает метакогнитивные навыки.'],
  ]
  for (const [type, desc] of assessTypes) {
    w.checkY(40)
    w.sectionHeading(type, 3)
    w.bodyText(desc)
    w.moveDown(0.2)
  }

  w.sectionHeading('6.2 Критерии оценивания письма', 2)
  const rubricRows = [
    ['Содержание', 'Все пункты развёрнуты', 'Пункты выполнены', 'Некоторые пропущены', 'Частично'],
    ['Грамматика', 'Разнообразно, мин. ошибок', 'Немного ошибок', 'Ошибки затрудняют понимание', 'Много ошибок'],
    ['Словарный запас', 'Богатый, точный', 'Адекватный', 'Ограниченный', 'Очень ограниченный'],
    ['Организация', 'Чёткая структура', 'Структура есть', 'Нечёткая', 'Нет структуры'],
  ]
  const rCols = [w.contentW * 0.22, w.contentW * 0.24, w.contentW * 0.22, w.contentW * 0.18, w.contentW * 0.14]
  const rH = 24
  w.checkY(rH * (rubricRows.length + 1) + 10)
  w._r(w.marginLeft, w.y, w.contentW, rH, C.navy)
  let rcx = w.marginLeft
  for (const [i, h] of ['Критерий', 'Отлично (5)', 'Хорошо (4)', 'Удовл. (3)', 'Слабо (1-2)'].entries()) {
    w._t(h, rcx + 3, w.y + 7, 8, w.B, C.white); rcx += rCols[i]
  }
  w.y += rH
  for (const [ri, row] of rubricRows.entries()) {
    if (ri % 2 === 1) w._r(w.marginLeft, w.y, w.contentW, rH, C.accent)
    rcx = w.marginLeft
    for (let i = 0; i < 5; i++) {
      let t = row[i]
      while (t.length > 3 && w.R.widthOfTextAtSize(t, 8) > rCols[i] - 6) t = t.slice(0, -4) + '...'
      w._t(t, rcx + 3, w.y + 7, 8, i === 0 ? w.B : w.R, i === 0 ? C.navy : C.black)
      rcx += rCols[i]
    }
    w._r(w.marginLeft, w.y, w.contentW, rH, C.accent, C.border, 0.3)
    w.y += rH
  }
  w.moveDown(0.5)

  // Chapter 7: AI
  w.newPage()
  w.sectionHeading('Глава 7. AI-инструменты платформы', 1)
  w.bodyText('KHAMADI ENGLISH интегрирует AI (Claude Anthropic) для персонализации обучения.')
  w.moveDown(0.5)
  w.sectionHeading('7.1 AI-функции', 2)
  const aiFeats = [
    ['AI Review', 'После пробного экзамена AI анализирует ошибки и даёт персонализированные советы по темам.'],
    ['Vocabulary Tutor', 'AI объясняет значение слов в контексте, даёт дополнительные примеры.'],
    ['Writing Feedback', 'Студент отправляет сочинение — получает обратную связь по грамматике и структуре.'],
    ['Conversation Practice', 'Разговорная практика с AI-партнёром. Особенно полезна для застенчивых студентов.'],
  ]
  for (const [name, desc] of aiFeats) {
    w.checkY(40)
    w.sectionHeading(name, 3)
    w.bodyText(desc)
    w.moveDown(0.2)
  }
  w.sectionHeading('7.2 Этика использования AI', 2)
  const ethics = [
    'AI — помощник, а не замена учителю. Студент должен думать самостоятельно.',
    'Не позволяйте писать домашние задания целиком через AI — это обесценивает обучение.',
    'Учите критически оценивать ответы AI — он может ошибаться.',
    'Разница: использовать AI для понимания материала (OK) vs выполнять задание вместо себя (не OK).',
  ]
  for (const [i, e] of ethics.entries()) {
    for (const l of w.wrap(`${i + 1}.  ${e}`, w.R, 11, w.contentW)) {
      w.checkY(16); w._t(l, w.marginLeft, w.y, 11, w.R, C.black); w.y += 16
    }
  }
  w.moveDown(0.5)

  // Chapter 8: Classroom management
  w.newPage()
  w.sectionHeading('Глава 8. Управление учебным процессом', 1)
  w.sectionHeading('8.1 Правила группы', 2)
  w.bodyText('В первый день согласуйте с группой правила. Когда студенты сами их формулируют — они чувствуют ответственность.')
  w.moveDown(0.3)
  const rules = [
    'На уроке мы говорим по-английски (насколько возможно на данном уровне)',
    'Мы уважаем ответы и ошибки друг друга — смеяться над ошибками запрещено',
    'Мы приходим вовремя',
    'Домашнее задание — наша ответственность перед собой',
    'Мы задаём вопросы — нет глупых вопросов',
  ]
  for (const [i, r] of rules.entries()) {
    w.checkY(16); w._t(`${i + 1}.  ${r}`, w.marginLeft, w.y, 11, w.R, C.black); w.y += 16
  }
  w.moveDown(0.5)
  w.sectionHeading('8.2 Сложные ситуации', 2)
  const situations = [
    ['Студент молчит', 'Начните с парной работы. Задавайте простые вопросы с заранее известным ответом. Поговорите индивидуально после урока.'],
    ['Один студент доминирует', 'Используйте жетоны — у каждого 3 штуки, отдаёт при каждом ответе. Когда жетоны закончились — пауза.'],
    ['Разный уровень в группе', 'Дифференцированные задания: сложные/простые версии. Пары сильный+слабый. Дополнительные задания для продвинутых.'],
    ['Студенты говорят по-русски', 'Не запрещайте резко — это создаст тревожность. Поставьте "язык урока" как правило с объяснением зачем.'],
  ]
  for (const [sit, sol] of situations) {
    w.checkY(60)
    w.sectionHeading('⚠  ' + sit, 3)
    for (const l of w.wrap(sol, w.R, 11, w.contentW)) {
      w.checkY(16); w._t(l, w.marginLeft, w.y, 11, w.R, C.black); w.y += 16
    }
    w.moveDown(0.4)
  }

  // Chapter 9: Parents
  w.newPage()
  w.sectionHeading('Глава 9. Работа с родителями', 1)
  w.bodyText('Родители — важные партнёры. Регулярная коммуникация повышает вовлечённость студентов.')
  w.moveDown(0.5)
  const parentTips = [
    'Начните с позитива — расскажите о сильных сторонах студента перед тем, как говорить о проблемах.',
    'Используйте конкретные данные (прогресс на платформе, результаты тестов).',
    'Объясните систему обучения: что такое CEFR, как работает геймификация.',
    'Дайте конкретные рекомендации: 15 минут на карточки ежедневно.',
    'Отвечайте честно — если не знаете ответа, скажите "уточню и сообщу".',
  ]
  for (const [i, t] of parentTips.entries()) {
    for (const l of w.wrap(`${i + 1}.  ${t}`, w.R, 11, w.contentW)) {
      w.checkY(16); w._t(l, w.marginLeft, w.y, 11, w.R, C.black); w.y += 16
    }
  }
  w.moveDown(0.5)

  // Chapter 10: FAQ
  w.newPage()
  w.sectionHeading('Глава 10. Часто задаваемые вопросы', 1)
  const faqs = [
    ['Нужно ли объяснять грамматику только на английском?', 'На A1-A2 допустимо объяснение на русском. На B1+ старайтесь объяснять на английском. На C1 — исключительно английский.'],
    ['Что делать, если студент не делает домашнее задание?', 'Поговорите приватно. Выясните причину. Адаптируйте задание. Публичное порицание контрпродуктивно.'],
    ['Как быстро студент должен видеть прогресс?', 'Первые заметные результаты через 3-4 месяца регулярных занятий (3 раза в неделю + домашние задания).'],
    ['Что делать, если я сделал ошибку на уроке?', 'Признайте её честно и исправьте. Это отличная модель поведения для студентов.'],
  ]
  for (const [q, a] of faqs) {
    w.checkY(70)
    for (const l of w.wrap('Q: ' + q, w.B, 11, w.contentW)) {
      w.checkY(16); w._t(l, w.marginLeft, w.y, 11, w.B, C.navy); w.y += 16
    }
    for (const l of w.wrap('A: ' + a, w.R, 11, w.contentW - 16)) {
      w.checkY(16); w._t(l, w.marginLeft + 16, w.y, 11, w.R, C.black); w.y += 16
    }
    w.moveDown(0.5)
  }

  // Chapter 11: Professional development
  w.newPage()
  w.sectionHeading('Глава 11. Профессиональное развитие', 1)
  const profDev = [
    ['Квалификации TESOL/TEFL', 'CELTA (Cambridge) — для начинающих, DELTA — для опытных преподавателей.'],
    ['Методическая литература', '"How Languages Are Learned" (Lightbown), "Teaching by Principles" (Brown) — обязательное чтение.'],
    ['Peer observation', 'Наблюдайте за уроками коллег и приглашайте их на свои уроки — самый быстрый способ роста.'],
    ['Reflection diary', 'Ведите дневник после каждого урока: что прошло хорошо? что улучшить?'],
  ]
  for (const [title, desc] of profDev) {
    w.checkY(40); w.sectionHeading(title, 3); w.bodyText(desc); w.moveDown(0.3)
  }

  // Appendix: lesson plan template
  w.newPage()
  w.sectionHeading('Приложение: Шаблон плана урока', 1)
  const template = [
    'ПЛАН УРОКА', '',
    'Дата: _____________  Группа: _____________  Уровень: ___________',
    'Тема: ________________________________________',
    'Длительность: _______________________________', '',
    'ЦЕЛИ УРОКА (к концу урока студенты смогут):',
    '1. _____________________________________________',
    '2. _____________________________________________',
    '3. _____________________________________________', '',
    'ЭТАП       | ВРЕМЯ | АКТИВНОСТЬ           | ЦЕЛЬ',
    '-----------|-------|----------------------|------------------',
    'Разминка   |  5    |                      |',
    'Презентация| 15    |                      |',
    'Практика   | 20    |                      |',
    'Производство| 20   |                      |',
    'Обратная св| 10    |                      |',
    'Д/З        |  5    |                      |', '',
    'РЕФЛЕКСИЯ:',
    'Что прошло хорошо? _____________________________',
    'Что улучшить? __________________________________',
  ]
  const tmplH = template.length * 14 + 20
  w.checkY(tmplH)
  w._r(w.marginLeft, w.y, w.contentW, tmplH, C.lightBg)
  let ty = w.y + 10
  for (const l of template) {
    w._t(l, w.marginLeft + 10, ty, 9, w.R, C.black); ty += 14
  }
  w.y += tmplH + 8

  await w.save(path.join(OUT_DIR, 'teacher-guide-general.pdf'))
}

// ── Course-specific guide ─────────────────────────────────────────────────────

interface CourseConfig {
  id: string; title: string; field: string; level: string
  audience: string; summary: string
  modules: Array<{
    title: string; ruTitle: string
    objectives: string[]; methodology: string
    lessonPlan: string; errors: string[]; assessment: string
  }>
}

async function generateCourseGuide(cfg: CourseConfig): Promise<void> {
  const w = await PdfWriter.create(`Методичка: ${cfg.title}`, cfg.level)

  w.newPage(false)
  drawTeacherCover(w, cfg.title, `Методическое пособие — ${cfg.level}`,
    `Подробные рекомендации по курсу "${cfg.title}" на платформе KHAMADI ENGLISH`)

  w.newPage(false)
  w.y = 60
  w.sectionHeading('О курсе', 1)
  w._t('Предмет: ', w.marginLeft, w.y, 11, w.B, C.navy)
  w._t(cfg.field, w.marginLeft + 70, w.y, 11, w.R, C.black); w.y += 16
  w._t('Уровень: ', w.marginLeft, w.y, 11, w.B, C.navy)
  w._t(cfg.level, w.marginLeft + 70, w.y, 11, w.R, C.black); w.y += 16
  w._t('Аудитория: ', w.marginLeft, w.y, 11, w.B, C.navy); w.y += 16
  for (const l of w.wrap(cfg.audience, w.R, 11, w.contentW - 10)) {
    w._t(l, w.marginLeft + 10, w.y, 11, w.R, C.black); w.y += 16
  }
  w.moveDown(0.5)
  w.bodyText(cfg.summary)

  for (const [mi, mod] of cfg.modules.entries()) {
    w.newPage()
    w.unitBanner(`МОДУЛЬ ${mi + 1}`, mod.title, mod.ruTitle)

    w.sectionHeading('Цели обучения', 2)
    for (const [oi, o] of mod.objectives.entries()) {
      w.checkY(16); w._t(`${oi + 1}.  ${o}`, w.marginLeft, w.y, 11, w.R, C.black); w.y += 16
    }
    w.moveDown(0.5)

    w.sectionHeading('Методические рекомендации', 2)
    w.bodyText(mod.methodology)
    w.moveDown(0.5)

    w.sectionHeading('Примерный план урока', 2)
    const lh = mod.lessonPlan.split('\n').length * 13 + 16
    w.checkY(lh + 10)
    w._r(w.marginLeft, w.y, w.contentW, lh, C.lightBg)
    const planY = w.y + 8
    for (const [li, l] of mod.lessonPlan.split('\n').entries()) {
      w._t(l, w.marginLeft + 10, planY + li * 13, 9, w.R, C.black)
    }
    w.y += lh + 8

    w.sectionHeading('Типичные ошибки студентов', 2)
    for (const [ei, e] of mod.errors.entries()) {
      w.checkY(16); w._t(`${ei + 1}.  ${e}`, w.marginLeft, w.y, 11, w.R, C.gold); w.y += 16
    }
    w.moveDown(0.5)

    w.sectionHeading('Критерии оценивания', 2)
    w.bodyText(mod.assessment)
    w.moveDown(0.5)
  }

  // Extra activities
  w.newPage()
  w.sectionHeading('Дополнительные активности', 1)
  const extras = [
    ['Case Studies', 'Реальные профессиональные ситуации на английском. Развивают критическое мышление и профессиональный язык.', '30–45 мин'],
    ['Role Play', 'Симуляция профессиональных ситуаций: переговоры, презентации.', '20–30 мин'],
    ['Vocabulary Auction', 'Команды делают ставки на правильные определения. Азартный формат для повторения лексики.', '15–20 мин'],
    ['Jigsaw Reading', 'Каждая группа читает свою часть текста и объясняет другим. Развивает говорение и слушание.', '25–30 мин'],
  ]
  for (const [name, desc, time] of extras) {
    w.checkY(60); w.sectionHeading(name, 2); w.bodyText(desc)
    w._t('Время: ' + time, w.marginLeft, w.y, 10, w.I, C.gray); w.y += 14; w.moveDown(0.4)
  }

  await w.save(path.join(OUT_DIR, `teacher-guide-${cfg.id}.pdf`))
}

// ── Course configs ────────────────────────────────────────────────────────────

const COURSES: CourseConfig[] = [
  {
    id: 'a1-beginner', title: 'A1 Beginner English', field: 'General English', level: 'A1',
    audience: 'Абсолютные начинающие без опыта изучения английского или с очень слабой базой.',
    summary: 'Курс A1 Beginner охватывает: алфавит, базовую грамматику (to be, Present Simple), базовый словарный запас (500+ слов), простые диалоги и приветствия.',
    modules: [{
      title: 'Introductions & Greetings', ruTitle: 'Знакомства и приветствия',
      objectives: ['Представляться и знакомиться', 'Использовать to be в настоящем', 'Освоить 50 базовых слов'],
      methodology: 'Создайте атмосферу безопасности. Используйте много визуальных материалов. Объясняйте по-русски сложные концепты. TPR — студенты выполняют физические действия по командам на английском.',
      lessonPlan: 'УРОК 1 (90 мин): Hello, I am...\nРазминка (10): Карточки с именами\nПрезентация (15): To be — am/is/are\nПрактика (20): Заполнение пробелов\nПроизводство (25): Знакомство с 3 одногруппниками\nРефлексия (10): Что узнали?\nДЗ (5): 5 предложений о себе',
      errors: ['"She am" → "She is" — am ТОЛЬКО с I', '"My name Asel" → "My name is Asel" — нельзя опускать глагол', '"I am student" → "I am a student" — артикль'],
      assessment: 'Может представиться (имя, возраст, страна). Правильно использует am/is/are. Знает 30+ слов. Оценка 5: всё правильно; 4: 1-2 ошибки в to be; 3: понятно, но много ошибок.',
    }],
  },
  {
    id: 'accounting', title: 'Accounting Vocabulary', field: 'Accounting & Finance', level: 'B1–C1',
    audience: 'Студенты экономических специальностей, бухгалтеры, финансисты, желающие работать в международных компаниях или сдать ACCA.',
    summary: 'Курс охватывает профессиональную лексику бухгалтерского учёта: финансовая отчётность, активы и обязательства, МСФО, аудит. 840+ терминов из реальных финансовых документов.',
    modules: [{
      title: 'Financial Fundamentals', ruTitle: 'Основы финансового учёта',
      objectives: ['Объяснить бухгалтерское уравнение', 'Описать 4 основных финансовых отчёта', 'Использовать 50 ключевых терминов'],
      methodology: 'Начните с реального баланса известной казахстанской компании (Kaspi Bank). Студенты уже видели эти документы — ваша задача дать им английские названия. Comparative approach: баланс на русском и английском рядом.',
      lessonPlan: 'УРОК (90 мин): The Accounting Equation\nРазминка (10): Мозговой штурм\nПрезентация (20): Assets = Liabilities + Equity\nПрактика (20): Классификация статей баланса\nПроизводство (25): Анализ баланса в парах\nОбратная связь (10): CCQ и типичные ошибки\nДЗ (5): Найти годовой отчёт Kaspi Bank',
      errors: ['Revenue vs income — выручка vs прибыль (разные значения!)', 'Debit/credit ≠ дебетовая карта (другое значение в учёте)', '"We have to pay liabilities" — "liabilities" уже означает долг'],
      assessment: 'Описывает баланс на английском. Различает revenue vs profit, debit vs credit. Оценка 5: безошибочное использование в контексте.',
    }],
  },
  {
    id: 'finance', title: 'Finance Industry Vocabulary', field: 'Finance & Banking', level: 'B1–C1',
    audience: 'Студенты финансовых специальностей, банковские работники, инвестиционные аналитики.',
    summary: 'Финансовые рынки, банковское дело, инвестиции, управление рисками и корпоративные финансы.',
    modules: [{
      title: 'The Financial System', ruTitle: 'Финансовая система',
      objectives: ['Описать структуру финансовой системы', 'Объяснить роль центрального банка', 'Различать виды инструментов'],
      methodology: 'Используйте новости из Bloomberg, Reuters, Financial Times. Начните с обсуждения: "What happened to interest rates last week?" — вводит в тему через реальный контекст.',
      lessonPlan: 'УРОК (90 мин): Financial System\nРазминка (10): Новость недели из Bloomberg\nПрезентация (15): Структура финсистемы\nПрактика (20): Matching — institution/function\nПроизводство (30): Дебаты об ставках\nОбратная связь (10): Ошибки и фактические неточности\nДЗ (5): Статья о монетарной политике',
      errors: ['Interest rate (ставка) ≠ interest (интерес)', '"Loan" vs "borrow" vs "lend" — три разных слова', 'The Fed = The Federal Reserve = одно и то же'],
      assessment: 'Описывает функции ЦБ. Различает монетарную и фискальную политику. Объясняет процентную ставку.',
    }],
  },
  {
    id: 'cs', title: 'Computer Science Vocabulary', field: 'Computer Science & IT', level: 'B1–C1',
    audience: 'Студенты IT-специальностей, программисты, системные администраторы.',
    summary: 'Алгоритмы, структуры данных, базы данных, сети, кибербезопасность, Agile, DevOps.',
    modules: [{
      title: 'Programming Fundamentals', ruTitle: 'Основы программирования',
      objectives: ['Описывать код на английском', 'Читать техническую документацию', 'Участвовать в code review'],
      methodology: 'Используйте реальный код. GitHub, Stack Overflow — аутентичные материалы. Задание: найти и объяснить функцию на GitHub на английском.',
      lessonPlan: 'УРОК: Technical Documentation\nРазминка (10): Что означает этот код?\nПрезентация (15): variable, function, loop, condition\nПрактика (20): Match term/definition\nПроизводство (30): Объясни партнёру код\nДЗ: Комментарии к своему коду на английском',
      errors: ['Algorithm vs program — не синонимы', '"Debug" = искать и исправлять ошибки', 'Variable ≠ variant (false friend)'],
      assessment: 'Объясняет простой алгоритм на английском. Читает документацию без словаря.',
    }],
  },
  {
    id: 'hospitality', title: 'Hospitality Vocabulary', field: 'Hospitality & Tourism', level: 'A2–B1',
    audience: 'Работники гостиниц, ресторанов и туристической отрасли.',
    summary: 'Практический английский: бронирование, обслуживание гостей, работа с жалобами, туристические маршруты.',
    modules: [{
      title: 'Hotel Check-in & Check-out', ruTitle: 'Заезд и выезд',
      objectives: ['Проводить check-in на английском', 'Отвечать на запросы гостей', 'Работать с жалобами профессионально'],
      methodology: 'Ролевые игры — основной метод. Студент = receptionist, преподаватель = demanding guest. Начните с видео реального check-in в Marriott.',
      lessonPlan: 'УРОК: Hotel Check-in\nВидео (10): Реальный check-in\nПрезентация (15): Скрипт check-in\nПрактика (20): Диалог с пробелами\nПроизводство (30): Ролевая игра\nДЗ: Скрипт для потерянной брони',
      errors: ['"Do you have reservation?" → "Do you have a reservation?" — артикль!', 'Room vs chamber — используйте "room"', 'Checkout = выезд, не "проверка"'],
      assessment: 'Проводит полный check-in. Вежливо работает с 3 типами жалоб. Использует 30+ профессиональных фраз.',
    }],
  },
  {
    id: 'management', title: 'Management Vocabulary', field: 'Business & Management', level: 'B1–C1',
    audience: 'Студенты MBA, менеджеры, руководители среднего звена.',
    summary: 'Стратегическое планирование, лидерство, управление проектами, HR, корпоративная коммуникация.',
    modules: [{
      title: 'Strategic Management', ruTitle: 'Стратегический менеджмент',
      objectives: ['Описывать стратегию на английском', 'Использовать SWOT, PESTLE', 'Проводить стратегические презентации'],
      methodology: 'Case Study — разбор реальных бизнес-кейсов из Harvard Business Review. Начните с казахстанского контекста (Kaspi, Jusan), затем переходите к международным.',
      lessonPlan: 'УРОК: SWOT Analysis\nВводный кейс (15): KazMunayGas\nПрезентация (15): SWOT framework\nПрактика (20): SWOT matrix\nПроизводство (25): Презентация анализа\nДЗ: SWOT для своей компании',
      errors: ['Weakness ≠ weak point (но близко)', '"We should to invest" → "We should invest"', 'Strategy vs tactic — чёткое разграничение'],
      assessment: 'Проводит SWOT. Представляет стратегические выводы. Использует 30+ управленческих терминов.',
    }],
  },
  {
    id: 'law', title: 'Law Vocabulary', field: 'Law & Legal Studies', level: 'B1–C1',
    audience: 'Студенты юридических факультетов, практикующие юристы.',
    summary: 'Договорное право, корпоративное право, уголовный процесс, составление контрактов.',
    modules: [{
      title: 'Contract Law', ruTitle: 'Договорное право',
      objectives: ['Читать контракты на английском', 'Понимать ключевые правовые концепции', 'Составлять простые договоры'],
      methodology: 'Работа с реальными контрактами — NDA, Service Agreement. Метод: студенты = lawyers reviewing a contract.',
      lessonPlan: 'УРОК: Reading a Contract\nВводный вопрос (10): Что проверить перед подписанием?\nПрезентация (15): Parties, Recitals, Terms\nПрактика (20): Найти offer, acceptance, consideration\nПроизводство (30): Группы проверяют раздел\nДЗ: Перевести один пункт и объяснить смысл',
      errors: ['Party (в праве) = сторона, не вечеринка', '"Shall" в контрактах = обязательство', 'Clause vs article — в праве разные значения'],
      assessment: 'Понимает структуру договора. Объясняет consideration, breach, indemnity.',
    }],
  },
  {
    id: 'social', title: 'Social Sciences Vocabulary', field: 'Social Sciences', level: 'B1–C1',
    audience: 'Студенты социологических, психологических и политических специальностей.',
    summary: 'Исследовательские методы, социологические концепции, политические теории, академическое письмо.',
    modules: [{
      title: 'Research Methods', ruTitle: 'Методы исследования',
      objectives: ['Описывать методологию исследования', 'Различать качественные и количественные методы', 'Писать Research Section'],
      methodology: 'Академическое письмо — ключевой навык. Реальные статьи из JSTOR, Google Scholar. Структура абзаца PEEL: Point, Evidence, Explanation, Link.',
      lessonPlan: 'УРОК: Qualitative vs Quantitative\nВводный опрос (10): Как исследуете явления?\nПрезентация (15): Qualitative vs Quantitative\nПрактика (20): Классификация методов\nПроизводство (25): Разработать мини-исследование\nДЗ: Paragraph о методологии (150 слов)',
      errors: ['"Research" — неисчисляемое: "a research" ❌, "research" ✓', '"Data is" → "Data are" (данные — мн. число)', 'Hypothesis vs theory — разные уровни доказанности'],
      assessment: 'Пишет академический параграф. Различает qualitative/quantitative. Использует 25+ академических терминов.',
    }],
  },
]

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })
  console.log('📋 KHAMADI ENGLISH — Teacher Guide Generator (pdf-lib)')
  console.log('=======================================================')

  console.log('📖 General teacher guide...')
  await generateGeneralGuide()

  console.log('\n📖 Course guides...')
  for (const cfg of COURSES) {
    await generateCourseGuide(cfg)
  }

  console.log('\n✅ Done! 9 teacher guides generated.')
}

main().catch(err => { console.error('❌', err.message); process.exit(1) })
