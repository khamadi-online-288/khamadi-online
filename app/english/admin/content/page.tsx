import { createEnglishServerClient } from '@/lib/english/supabase-server'
import { redirect } from 'next/navigation'
import AdminHeader from '@/components/english/lms/admin/AdminHeader'
import Link from 'next/link'
import { BookOpen, Layers, FileText, CheckCircle, AlertCircle } from 'lucide-react'

const cardStyle: React.CSSProperties = { background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.1)', boxShadow: '0 2px 12px rgba(27,58,107,0.07)' }

interface CourseRow {
  id: string
  title: string
  level: string | null
  category: string | null
  is_active: boolean
  module_count: number
  lesson_count: number
  fill_pct: number
}

export default async function AdminContentPage() {
  const supabase = await createEnglishServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/english/login')

  const { data: courses } = await supabase
    .from('english_courses')
    .select('id, title, level, category, is_active')
    .order('level')

  const courseList = (courses ?? []) as { id: string; title: string; level: string | null; category: string | null; is_active: boolean }[]

  const enriched: CourseRow[] = await Promise.all(
    courseList.map(async c => {
      const { count: moduleCount } = await supabase
        .from('english_modules')
        .select('id', { count: 'exact', head: true })
        .eq('course_id', c.id)

      const { data: lessonRows } = await supabase
        .from('english_lessons')
        .select('id')
        .eq('course_id', c.id)

      const lessonIds = (lessonRows ?? []).map(l => (l as { id: string }).id)
      const lessonCount = lessonIds.length

      let fill_pct = 0
      if (lessonIds.length > 0) {
        const [totalSectionsRes, filledSectionsRes] = await Promise.all([
          supabase
            .from('english_lesson_sections')
            .select('id', { count: 'exact', head: true })
            .in('lesson_id', lessonIds)
            .eq('is_active', true),
          supabase
            .from('english_lesson_sections')
            .select('id', { count: 'exact', head: true })
            .in('lesson_id', lessonIds)
            .eq('is_active', true)
            .not('content', 'is', null)
            .neq('content', '{}'),
        ])
        const totalSections  = totalSectionsRes.count ?? 0
        const filledSections = filledSectionsRes.count ?? 0
        fill_pct = totalSections > 0 ? Math.round((filledSections / totalSections) * 100) : 0
      }

      const total = lessonCount

      return { ...c, module_count: moduleCount ?? 0, lesson_count: total, fill_pct }
    })
  )

  const totalLessons  = enriched.reduce((s, c) => s + c.lesson_count, 0)
  const totalModules  = enriched.reduce((s, c) => s + c.module_count, 0)
  const totalFilled   = enriched.reduce((s, c) => s + Math.round(c.lesson_count * c.fill_pct / 100), 0)
  const avgFill       = totalLessons > 0 ? Math.round((totalFilled / totalLessons) * 100) : 0

  const LEVEL_COLORS: Record<string, string> = { A1: '#10b981', A2: '#3b82f6', B1: '#8b5cf6', B2: '#C9933B', C1: '#ef4444', C2: '#1B3A6B' }

  return (
    <div style={{ flex: 1 }}>
      <AdminHeader title="Контент" />
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {[
            { label: 'Курсов', value: enriched.length, icon: <BookOpen size={18} />, color: '#1B8FC4' },
            { label: 'Модулей', value: totalModules, icon: <Layers size={18} />, color: '#8b5cf6' },
            { label: 'Уроков', value: totalLessons, icon: <FileText size={18} />, color: '#1B3A6B' },
            { label: '% заполненности', value: `${avgFill}%`, icon: avgFill >= 70 ? <CheckCircle size={18} /> : <AlertCircle size={18} />, color: avgFill >= 70 ? '#10b981' : '#f59e0b' },
          ].map(c => (
            <div key={c.label} style={{ ...cardStyle, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: `${c.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{c.label}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: c.color }}>{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Courses table */}
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px 14px', fontSize: 15, fontWeight: 900, color: '#1B3A6B' }}>Курсы</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontFamily: 'Montserrat', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                {['Курс', 'Уровень', 'Категория', 'Модули', 'Уроков', '% контента', 'Статус', ''].map(h => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enriched.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{c.title}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {c.level && (
                      <span style={{ background: `${LEVEL_COLORS[c.level] ?? '#94a3b8'}22`, color: LEVEL_COLORS[c.level] ?? '#64748b', borderRadius: 6, padding: '2px 9px', fontSize: 12, fontWeight: 700 }}>
                        {c.level}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: 12 }}>{c.category ?? '—'}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1B3A6B', textAlign: 'center' }}>{c.module_count}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1B3A6B', textAlign: 'center' }}>{c.lesson_count}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 99, background: '#f1f5f9', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 99, width: `${c.fill_pct}%`, background: c.fill_pct >= 80 ? '#10b981' : c.fill_pct >= 50 ? '#f59e0b' : '#ef4444', transition: 'width 0.4s' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: c.fill_pct >= 80 ? '#10b981' : c.fill_pct >= 50 ? '#f59e0b' : '#ef4444', minWidth: 36, textAlign: 'right' }}>{c.fill_pct}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: c.is_active ? '#dcfce7' : '#f1f5f9', color: c.is_active ? '#16a34a' : '#94a3b8', borderRadius: 6, padding: '2px 9px', fontSize: 11, fontWeight: 700 }}>
                      {c.is_active ? 'Активен' : 'Скрыт'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Link href={`/english/admin/courses`} style={{ textDecoration: 'none' }}>
                      <span style={{ fontSize: 12, color: '#1B8FC4', fontWeight: 700, cursor: 'pointer' }}>Открыть →</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {enriched.length === 0 && (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📚</div>
              <div style={{ fontSize: 14 }}>Курсов пока нет</div>
            </div>
          )}
        </div>

        {/* Low fill warning */}
        {enriched.filter(c => c.lesson_count > 0 && c.fill_pct < 30).length > 0 && (
          <div style={{ background: '#fff7ed', borderRadius: 16, padding: '16px 20px', border: '1.5px solid rgba(239,68,68,0.2)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <AlertCircle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#92400e' }}>Курсы с низким заполнением (&lt;30%)</div>
              <div style={{ fontSize: 13, color: '#78350f', marginTop: 4 }}>
                {enriched.filter(c => c.lesson_count > 0 && c.fill_pct < 30).map(c => c.title).join(', ')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
