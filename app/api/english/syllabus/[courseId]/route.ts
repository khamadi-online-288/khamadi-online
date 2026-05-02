import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import path from 'path'

export const dynamic = 'force-dynamic'
export const runtime  = 'nodejs'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
)

const FONTS = path.join(process.cwd(), 'public', 'fonts')

const ACTIVITY: Record<string, string> = {
  grammar:    'Практическое занятие',
  vocabulary: 'Словарная работа',
  listening:  'Аудирование',
  reading:    'Чтение и анализ',
  quiz:       'Контрольный тест',
  writing:    'Письменная практика',
}

const OBJECTIVES: Record<string, string[]> = {
  A1: ['Использовать знакомые повседневные выражения', 'Представляться и рассказывать о себе', 'Взаимодействовать простым способом при медленной речи'],
  A2: ['Понимать часто используемые фразы в знакомых темах', 'Общаться в простых типичных ситуациях', 'Описывать своё окружение и насущные потребности'],
  B1: ['Понимать основные идеи сообщений на стандартные темы', 'Справляться с большинством ситуаций в путешествии', 'Составлять связные тексты на знакомые темы'],
  B2: ['Понимать сложные тексты по конкретным и абстрактным темам', 'Общаться свободно и спонтанно с носителями языка', 'Создавать подробные тексты по широкому кругу тем'],
  C1: ['Понимать сложные тексты с неявным смыслом', 'Выражаться свободно, спонтанно и точно', 'Гибко использовать язык в академических и профессиональных целях'],
  ESP: ['Освоить профессиональную терминологию по специализации', 'Применять деловой английский в профессиональных ситуациях', 'Читать и анализировать профессиональные тексты', 'Участвовать в деловых переговорах и презентациях'],
}

type Course = { id: string; title: string; level: string | null; category: string }
type Module = { id: string; title: string; order_index: number }
type Lesson = { id: string; title: string; order_index: number; lesson_type: string; module_id: string }

export async function GET(_req: NextRequest, { params }: { params: { courseId: string } }) {
  const { courseId } = params

  const [courseRes, modulesRes, lessonsRes] = await Promise.all([
    db.from('english_courses').select('id,title,level,category').eq('id', courseId).single(),
    db.from('english_modules').select('id,title,order_index').eq('course_id', courseId).order('order_index'),
    db.from('english_lessons').select('id,title,order_index,lesson_type,module_id').eq('course_id', courseId).order('order_index'),
  ])

  if (!courseRes.data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const course  = courseRes.data as Course
  const modules = (modulesRes.data ?? []) as Module[]
  const lessons = (lessonsRes.data ?? []) as Lesson[]

  const isESP      = course.category === 'English for Special Purposes'
  const levelKey   = course.level?.match(/^[ABC][12]/)?.[0] ?? ''
  const objectives = isESP ? OBJECTIVES.ESP : (OBJECTIVES[levelKey] ?? OBJECTIVES.B1)
  const totalHours = lessons.length * 2
  const modMap     = new Map(modules.map(m => [m.id, m.title]))

  const PDFDocument = (await import('pdfkit')).default
  const doc = new PDFDocument({ size: 'A4', margin: 0, bufferPages: true })
  doc.registerFont('B', path.join(FONTS, 'DejaVuSans-Bold.ttf'))
  doc.registerFont('R', path.join(FONTS, 'DejaVuSans.ttf'))

  const W  = doc.page.width   // 595.28
  const PL = 48               // padding left/right

  // ── collect to buffer ────────────────────────────────────────────────────────
  const chunks: Buffer[] = []
  doc.on('data', c => chunks.push(Buffer.from(c)))

  // ── HEADER ───────────────────────────────────────────────────────────────────
  doc.rect(0, 0, W, 72).fill('#1B3A6B')
  doc.font('B').fontSize(14).fillColor('#fff')
    .text('KHAMADI ENGLISH', PL, 20, { width: W - PL * 2 })
  doc.font('R').fontSize(9).fillColor('rgba(255,255,255,0.6)')
    .text('by KHAMADI ONLINE  ·  khamadi.online/english', PL, 38)
  doc.font('B').fontSize(9).fillColor('#C9933B')
    .text('СИЛЛАБУС / УЧЕБНАЯ ПРОГРАММА', PL, 55, { characterSpacing: 1.5 })

  // Gold accent bar
  doc.rect(0, 72, W, 3).fill('#C9933B')

  let y = 90

  // ── COURSE INFO BOX ──────────────────────────────────────────────────────────
  doc.rect(PL, y, W - PL * 2, 70).fill('#f1f5f9')
  doc.rect(PL, y, 4, 70).fill('#1B8FC4')

  doc.font('B').fontSize(16).fillColor('#1B3A6B')
    .text(course.title, PL + 16, y + 10, { width: W - PL * 2 - 20 })
  doc.font('R').fontSize(10).fillColor('#475569')
    .text(
      `Уровень: ${course.level ?? '—'}   |   Период: 01.05.2026 — 01.05.2027   |   Объём: ${totalHours} ч.   |   Уроков: ${lessons.length}`,
      PL + 16, y + 36, { width: W - PL * 2 - 20 }
    )
  doc.font('R').fontSize(10).fillColor('#64748b')
    .text('Форма обучения: Онлайн  |  KHAMADI ONLINE English Platform', PL + 16, y + 52)

  y += 82

  // ── HELPER: section title ─────────────────────────────────────────────────────
  function sectionTitle(num: string, title: string) {
    if (y > 740) { doc.addPage(); y = 40 }
    doc.rect(PL, y, W - PL * 2, 24).fill('#e2e8f0')
    doc.font('B').fontSize(11).fillColor('#1B3A6B')
      .text(`${num}. ${title}`, PL + 8, y + 6)
    y += 32
  }

  // ── HELPER: bullet list ───────────────────────────────────────────────────────
  function bulletList(items: string[]) {
    for (const item of items) {
      if (y > 750) { doc.addPage(); y = 40 }
      doc.font('R').fontSize(9).fillColor('#1B3A6B').text('•', PL + 6, y)
      doc.font('R').fontSize(9).fillColor('#334155').text(item, PL + 18, y, { width: W - PL * 2 - 18 })
      y += 16
    }
    y += 6
  }

  // ── 1. OBJECTIVES ─────────────────────────────────────────────────────────────
  sectionTitle('1', 'Цели обучения')
  bulletList(objectives)

  // ── 2. WEEK TABLE ────────────────────────────────────────────────────────────
  sectionTitle('2', 'Учебно-тематический план')

  // Table header
  const COL = { week: PL, mod: PL + 42, lesson: PL + 180, hrs: PL + 390, act: PL + 420 }
  const TW  = W - PL * 2

  if (y > 730) { doc.addPage(); y = 40 }
  doc.rect(PL, y, TW, 20).fill('#1B3A6B')
  doc.font('B').fontSize(8).fillColor('#fff')
  doc.text('Нед.', COL.week + 2, y + 5)
  doc.text('Модуль', COL.mod, y + 5, { width: 132 })
  doc.text('Тема урока', COL.lesson, y + 5, { width: 205 })
  doc.text('Ч.', COL.hrs, y + 5)
  doc.text('Тип активности', COL.act, y + 5, { width: 120 })
  y += 20

  lessons.forEach((l, i) => {
    if (y > 750) {
      doc.addPage(); y = 40
      // re-draw table header on new page
      doc.rect(PL, y, TW, 20).fill('#1B3A6B')
      doc.font('B').fontSize(8).fillColor('#fff')
      doc.text('Нед.', COL.week + 2, y + 5)
      doc.text('Модуль', COL.mod, y + 5, { width: 132 })
      doc.text('Тема урока', COL.lesson, y + 5, { width: 205 })
      doc.text('Ч.', COL.hrs, y + 5)
      doc.text('Тип активности', COL.act, y + 5, { width: 120 })
      y += 20
    }
    const rowBg = i % 2 === 0 ? '#fff' : '#f8fafc'
    const rowH  = 18
    doc.rect(PL, y, TW, rowH).fill(rowBg)
    doc.rect(PL, y, TW, rowH).stroke('#e2e8f0').lineWidth(0.4)

    const week     = Math.ceil((i + 1) / 2)
    const modTitle = modMap.get(l.module_id) ?? '—'
    const activity = ACTIVITY[l.lesson_type] ?? 'Практическое занятие'

    doc.font('B').fontSize(8).fillColor('#1B3A6B').text(String(week), COL.week + 2, y + 4)
    doc.font('R').fontSize(7.5).fillColor('#475569').text(modTitle, COL.mod, y + 4, { width: 132, ellipsis: true })
    doc.font('B').fontSize(8).fillColor('#1e293b').text(l.title, COL.lesson, y + 4, { width: 205, ellipsis: true })
    doc.font('R').fontSize(8).fillColor('#64748b').text('2', COL.hrs, y + 4)
    doc.font('R').fontSize(7.5).fillColor('#334155').text(activity, COL.act, y + 4, { width: 118, ellipsis: true })
    y += rowH
  })

  // Total row
  if (y > 750) { doc.addPage(); y = 40 }
  doc.rect(PL, y, TW, 20).fill('#e2e8f0')
  doc.font('B').fontSize(9).fillColor('#1B3A6B')
    .text('Итого:', PL + 4, y + 5)
    .text(`${totalHours} часов`, COL.hrs - 30, y + 5)
  y += 28

  // ── 3. GRADING ───────────────────────────────────────────────────────────────
  if (y > 680) { doc.addPage(); y = 40 }
  sectionTitle('3', 'Система оценивания')

  const grades = [
    { label: 'Квизы (онлайн-тесты)', pct: '40%' },
    { label: 'Mock Exam (итоговый)', pct: '30%' },
    { label: 'Writing Coach',        pct: '20%' },
    { label: 'Посещаемость',         pct: '10%' },
  ]
  for (const g of grades) {
    if (y > 750) { doc.addPage(); y = 40 }
    doc.font('R').fontSize(9.5).fillColor('#334155').text(`${g.label}`, PL + 8, y)
    doc.font('B').fontSize(9.5).fillColor('#1B3A6B').text(g.pct, W - PL - 28, y)
    doc.moveTo(PL + 8, y + 13).lineTo(W - PL - 8, y + 13).stroke('#e2e8f0').lineWidth(0.5)
    y += 18
  }
  y += 4
  doc.font('R').fontSize(9).fillColor('#64748b')
    .text('Минимальный балл для сертификата: 70%. Итоговая оценка — средневзвешенный балл.', PL + 8, y, { width: TW - 16 })
  y += 22

  // ── 4. REQUIREMENTS ──────────────────────────────────────────────────────────
  if (y > 660) { doc.addPage(); y = 40 }
  sectionTitle('4', 'Требования к студентам')
  bulletList([
    'Регулярное выполнение заданий в установленные сроки',
    'Минимум 80% посещаемости онлайн-занятий',
    'Самостоятельная подготовка 30–60 мин в день',
    'Прохождение всех контрольных тестов и Mock Exam',
    'Активное участие в Writing Coach и дискуссиях',
  ])

  // ── 5. RESOURCES ─────────────────────────────────────────────────────────────
  if (y > 680) { doc.addPage(); y = 40 }
  sectionTitle('5', 'Литература и ресурсы')
  bulletList(
    isESP
      ? ['KHAMADI ENGLISH ESP Vocabulary Textbook (платформа)', 'Профессиональные статьи по специальности', 'Платформа: khamadi.online/english', 'LinkedIn Learning (профессиональный английский)']
      : ['KHAMADI ENGLISH Vocabulary Textbook (платформа)', 'Cambridge English Grammar in Use (reference)', 'Платформа: khamadi.online/english', 'Cambridge Dictionary: dictionary.cambridge.org']
  )

  // ── FOOTER with stamp area ────────────────────────────────────────────────────
  const lastPage = doc.bufferedPageRange().count
  doc.switchToPage(lastPage - 1)

  const footerY = 780
  doc.font('R').fontSize(8).fillColor('#94a3b8')
    .text('Директор программы', PL, footerY, { width: 120, align: 'center' })
    .text('Академический директор', W - PL - 130, footerY, { width: 130, align: 'center' })
  doc.moveTo(PL, footerY - 6).lineTo(PL + 120, footerY - 6).stroke('#1B3A6B').lineWidth(0.7)
  doc.moveTo(W - PL - 130, footerY - 6).lineTo(W - PL, footerY - 6).stroke('#1B3A6B').lineWidth(0.7)

  // Stamp circle
  const sX = W / 2, sY = footerY - 16
  doc.circle(sX, sY, 26).stroke('#1B3A6B').dash(2, { space: 2 }).lineWidth(1.2)
  doc.undash().circle(sX, sY, 20).stroke('#C9933B').lineWidth(0.6)
  doc.font('B').fontSize(5.5).fillColor('#1B3A6B')
    .text('KHAMADI', sX - 14, sY - 5, { width: 28, align: 'center', characterSpacing: 0.8 })
  doc.font('B').fontSize(5).fillColor('#C9933B')
    .text('ENGLISH', sX - 14, sY + 2, { width: 28, align: 'center', characterSpacing: 0.6 })

  // Page numbers
  for (let i = 0; i < lastPage; i++) {
    doc.switchToPage(i)
    doc.font('R').fontSize(8).fillColor('#94a3b8')
      .text(`${i + 1} / ${lastPage}`, 0, 822, { align: 'center', width: W })
  }

  doc.end()

  await new Promise<void>((resolve, reject) => {
    doc.on('end', resolve)
    doc.on('error', reject)
  })

  const buf = Buffer.concat(chunks)
  const slug = course.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  return new NextResponse(buf, {
    headers: {
      'Content-Type':        'application/pdf',
      'Content-Disposition': `attachment; filename="syllabus-${slug}.pdf"`,
    },
  })
}