import { createEnglishServerClient } from '@/lib/english/supabase-server'
import { redirect } from 'next/navigation'
import TeacherHeader from '@/components/english/lms/teacher/TeacherHeader'
import Link from 'next/link'
import { isAtRisk } from '@/lib/english/lms/progress'
import { AlertTriangle } from 'lucide-react'

export default async function TeacherStudentsPage() {
  const supabase = await createEnglishServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/english/login')

  const { data: groups } = await supabase.from('lms_groups').select('id').eq('teacher_id', session.user.id)
  const groupIds = (groups ?? []).map((g: { id: string }) => g.id)

  type GsRow = { student_id: string; group: { id: string; name: string } | null }
  const { data: gs } = groupIds.length
    ? await supabase.from('lms_group_students').select('student_id,group:lms_groups(id,name)').in('group_id', groupIds)
    : { data: [] as GsRow[] }

  const gsRows = (gs ?? []) as GsRow[]
  const studentIds = [...new Set(gsRows.map(x => x.student_id))]
  const groupMap: Record<string, string> = {}
  gsRows.forEach(r => { if (r.group) groupMap[r.student_id] = r.group.name })

  const { data: students } = studentIds.length
    ? await supabase.from('profiles').select('id,full_name,email,last_seen_at,language_level,avatar_url').in('id', studentIds).order('full_name')
    : { data: [] }

  return (
    <div style={{ flex: 1 }}>
      <TeacherHeader title="Студенты" />
      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {(students ?? []).map(s => {
            const st = s as { id: string; full_name?: string; email?: string; last_seen_at?: string; language_level?: string; avatar_url?: string }
            const atRisk = isAtRisk(st.last_seen_at)
            return (
              <Link key={st.id} href={`/english/teacher/students/${st.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', borderRadius: 16, padding: '16px 18px', border: `1.5px solid ${atRisk ? 'rgba(239,68,68,0.25)' : 'rgba(27,143,196,0.1)'}`, boxShadow: '0 2px 8px rgba(27,58,107,0.06)', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(27,58,107,0.12)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(27,58,107,0.06)')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 13, background: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {st.avatar_url ? <img src={st.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 13 }} />
                        : <span style={{ color: '#fff', fontSize: 16, fontWeight: 900 }}>{st.full_name?.[0]?.toUpperCase() ?? 'С'}</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 14, color: '#1B3A6B', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{st.full_name ?? '—'}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{groupMap[st.id] ?? 'Без группы'}</div>
                    </div>
                    {atRisk && <AlertTriangle size={15} color="#ef4444" />}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
                    {st.language_level && <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{st.language_level}</span>}
                    {st.last_seen_at && <span style={{ fontSize: 11, color: '#94a3b8' }}>Вход: {new Date(st.last_seen_at).toLocaleDateString('ru-RU')}</span>}
                  </div>
                </div>
              </Link>
            )
          })}
          {!(students ?? []).length && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 16 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍🎓</div>
              Студентов не найдено
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
