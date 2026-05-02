import type { ReactNode } from 'react'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createEnglishServerClient } from '@/lib/english/supabase-server'
import { ArrowLeft, Download, Calendar, Clock, BookOpen, Award } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Course  = { id: string; title: string; level: string | null; category: string; description: string | null }
type Module  = { id: string; title: string; order_index: number; section: string | null }
type Lesson  = { id: string; title: string; order_index: number; lesson_type: string; module_id: string }

const ACTIVITY: Record<string, string> = {
  grammar:    'Практическое занятие',
  vocabulary: 'Словарная работа',
  listening:  'Аудирование',
  reading:    'Чтение и анализ',
  quiz:       'Контрольный тест',
  writing:    'Письменная практика',
}

const OBJECTIVES: Record<string, string[]> = {
  A1: [
    'Понимать и использовать знакомые повседневные выражения',
    'Представляться и рассказывать о себе в простой форме',
    'Взаимодействовать простым способом при медленной и чёткой речи',
    'Освоить базовую лексику для общения в типичных ситуациях',
  ],
  A2: [
    'Понимать часто используемые фразы и выражения в знакомых темах',
    'Общаться в простых типичных ситуациях повседневной жизни',
    'Описывать своё окружение, ближайшие потребности простыми предложениями',
    'Понимать короткие несложные тексты и объявления',
  ],
  B1: [
    'Понимать основные идеи чётких сообщений на стандартные знакомые темы',
    'Справляться с большинством ситуаций в путешествии и командировке',
    'Составлять связные тексты на знакомые или личностно значимые темы',
    'Рассказывать об опыте, событиях, мечтах и кратко обосновывать свою позицию',
  ],
  B2: [
    'Понимать содержание сложных текстов по конкретным и абстрактным темам',
    'Общаться достаточно свободно и спонтанно с носителями языка',
    'Создавать чёткие, подробные тексты по широкому кругу тем',
    'Высказывать точку зрения по актуальным вопросам, указывая плюсы и минусы',
  ],
  C1: [
    'Понимать сложные длинные тексты с неявным смыслом',
    'Выражаться свободно, спонтанно и точно в любой ситуации',
    'Гибко и эффективно использовать язык в академических и профессиональных целях',
    'Строить чёткие, логически выстроенные тексты сложной структуры',
  ],
  ESP: [
    'Освоить профессиональную терминологию по специализации',
    'Применять деловой английский в профессиональных ситуациях',
    'Читать, понимать и анализировать профессиональные тексты на английском',
    'Участвовать в деловых переговорах, совещаниях и презентациях',
    'Составлять профессиональные документы, отчёты и корреспонденцию',
  ],
}

const RESOURCES: Record<string, string[]> = {
  General: [
    'KHAMADI ENGLISH Vocabulary Textbook (платформа)',
    'Cambridge English Grammar in Use (reference)',
    'Платформа: khamadi.online/english',
    'Онлайн-словарь: Cambridge Dictionary (dictionary.cambridge.org)',
  ],
  ESP: [
    'KHAMADI ENGLISH ESP Vocabulary Textbook (платформа)',
    'Профессиональные статьи по специальности (материалы платформы)',
    'Платформа: khamadi.online/english',
    'LinkedIn Learning (профессиональный английский)',
  ],
}

export default async function SyllabusPage({ params }: { params: { courseId: string } }) {
  const supabase = await createEnglishServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/english/login')

  const [courseRes, modulesRes, lessonsRes] = await Promise.all([
    supabase.from('english_courses').select('id,title,level,category,description').eq('id', params.courseId).single(),
    supabase.from('english_modules').select('id,title,order_index,section').eq('course_id', params.courseId).order('order_index'),
    supabase.from('english_lessons').select('id,title,order_index,lesson_type,module_id').eq('course_id', params.courseId).order('order_index'),
  ])

  if (!courseRes.data) notFound()

  const course  = courseRes.data as Course
  const modules = (modulesRes.data ?? []) as Module[]
  const lessons = (lessonsRes.data ?? []) as Lesson[]

  const isESP      = course.category === 'English for Special Purposes'
  const levelKey   = course.level?.match(/^[ABC][12]/)?.[0] ?? ''
  const objectives = isESP ? OBJECTIVES.ESP : (OBJECTIVES[levelKey] ?? OBJECTIVES.B1)
  const resources  = isESP ? RESOURCES.ESP : RESOURCES.General
  const totalHours = lessons.length * 2

  // Build week rows: 2 lessons per week
  type WeekRow = { week: number; module: string; lesson: string; hours: number; activity: string }
  const rows: WeekRow[] = []
  const modMap = new Map(modules.map(m => [m.id, m]))
  lessons.forEach((l, i) => {
    rows.push({
      week:     Math.ceil((i + 1) / 2),
      module:   modMap.get(l.module_id)?.title ?? '—',
      lesson:   l.title,
      hours:    2,
      activity: ACTIVITY[l.lesson_type] ?? 'Практическое занятие',
    })
  })

  const PERIOD = '01.05.2026 — 01.05.2027'

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Montserrat, sans-serif', maxWidth: 1000 }}>

      {/* Back + actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <Link href="/english/teacher/syllabus" style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#64748b', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
          <ArrowLeft size={15} /> Все силлабусы
        </Link>
        <a
          href={`/api/english/syllabus/${course.id}`}
          target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#C9933B', color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: 11, fontSize: 13, fontWeight: 800 }}
        >
          <Download size={15} /> Скачать PDF
        </a>
      </div>

      {/* Header card */}
      <div style={{ background: 'linear-gradient(135deg,#1B3A6B 0%,#2E5FA3 60%,#1B8FC4 100%)', borderRadius: 24, padding: '32px 36px', color: '#fff', marginBottom: 28, boxShadow: '0 16px 40px rgba(27,58,107,0.22)' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
          KHAMADI ENGLISH — СИЛЛАБУС / УЧЕБНАЯ ПРОГРАММА
        </div>
        <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em' }}>{course.title}</h1>
        {course.level && (
          <span style={{ display: 'inline-block', background: 'rgba(201,147,59,0.3)', color: '#fde68a', border: '1px solid rgba(201,147,59,0.5)', padding: '3px 14px', borderRadius: 99, fontSize: 12, fontWeight: 800, marginBottom: 22 }}>
            {course.level}
          </span>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {[
            { icon: <Calendar size={16} />, label: 'Период', value: PERIOD },
            { icon: <Clock size={16} />,    label: 'Объём',  value: `${totalHours} академических часов` },
            { icon: <BookOpen size={16} />, label: 'Уроков', value: `${lessons.length} уроков · ${modules.length} модулей` },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '14px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: 14 }}>
              <div style={{ color: '#7dd3fc', marginTop: 1 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
                <div style={{ fontSize: 13, fontWeight: 800, marginTop: 2 }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Objectives */}
      <Card title="1. Цели обучения" icon={<Award size={17} color="#1B8FC4" />}>
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {objectives.map((obj, i) => (
            <li key={i} style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, fontWeight: 600 }}>{obj}</li>
          ))}
        </ul>
      </Card>

      {/* Week table */}
      <Card title="2. Учебно-тематический план" icon={<BookOpen size={17} color="#1B8FC4" />}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#1B3A6B', color: '#fff' }}>
                {['Нед.', 'Модуль', 'Тема урока', 'Часы', 'Тип активности'].map(h => (
                  <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontWeight: 800, fontSize: 11, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 800, color: '#1B3A6B', whiteSpace: 'nowrap' }}>{r.week}</td>
                  <td style={{ padding: '10px 14px', color: '#475569', fontSize: 12, maxWidth: 200 }}>{r.module}</td>
                  <td style={{ padding: '10px 14px', color: '#1e293b', fontWeight: 700 }}>{r.lesson}</td>
                  <td style={{ padding: '10px 14px', color: '#64748b', whiteSpace: 'nowrap', textAlign: 'center' }}>{r.hours}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                      background: r.activity === 'Контрольный тест' ? '#fee2e2' : r.activity === 'Словарная работа' ? '#ede9fe' : '#e0f2fe',
                      color:      r.activity === 'Контрольный тест' ? '#991b1b' : r.activity === 'Словарная работа' ? '#5b21b6' : '#0369a1',
                    }}>{r.activity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#f1f5f9', borderTop: '2px solid #e2e8f0' }}>
                <td colSpan={3} style={{ padding: '11px 14px', fontWeight: 900, color: '#1B3A6B', fontSize: 13 }}>Итого</td>
                <td style={{ padding: '11px 14px', fontWeight: 900, color: '#1B3A6B', textAlign: 'center' }}>{totalHours}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Grading */}
      <Card title="3. Система оценивания" icon={<Award size={17} color="#C9933B" />}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
          {[
            { label: 'Квизы',        pct: 40, color: '#1B8FC4' },
            { label: 'Mock Exam',    pct: 30, color: '#7c3aed' },
            { label: 'Writing Coach',pct: 20, color: '#16a34a' },
            { label: 'Посещаемость', pct: 10, color: '#C9933B' },
          ].map(g => (
            <div key={g.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1e293b' }}>{g.label}</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: g.color }}>{g.pct}%</span>
              </div>
              <div style={{ height: 6, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${g.pct}%`, height: '100%', background: g.color, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>
        <p style={{ margin: '16px 0 0', fontSize: 13, color: '#64748b', fontWeight: 600 }}>
          Итоговая оценка — средневзвешенный балл. Для получения сертификата необходимо набрать не менее <strong style={{ color: '#1B3A6B' }}>70%</strong>.
        </p>
      </Card>

      {/* Requirements */}
      <Card title="4. Требования к студентам">
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            'Регулярное выполнение заданий в установленные сроки',
            'Минимум 80% посещаемости занятий (онлайн-уроков)',
            'Самостоятельная подготовка между занятиями (30–60 мин/день)',
            'Прохождение всех контрольных тестов и Mock Exam',
            'Активное участие в обсуждениях и Writing Coach',
          ].map((r, i) => (
            <li key={i} style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, fontWeight: 600 }}>{r}</li>
          ))}
        </ul>
      </Card>

      {/* Resources */}
      <Card title="5. Литература и ресурсы">
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {resources.map((r, i) => (
            <li key={i} style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, fontWeight: 600 }}>{r}</li>
          ))}
        </ul>
      </Card>

    </div>
  )
}

function Card({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(27,143,196,0.11)', borderRadius: 20, padding: '24px 28px', marginBottom: 20, boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        {icon}
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#1B3A6B', letterSpacing: '-0.02em' }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}