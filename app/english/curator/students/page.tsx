'use client'
import { useEffect, useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import DataTable from '@/components/english/lms/shared/DataTable'
import StatusBadge from '@/components/english/lms/shared/StatusBadge'
import Link from 'next/link'
import { RefreshCw } from 'lucide-react'

interface StudentRow extends Record<string, unknown> { id: string; full_name?: string; email?: string; language_level?: string; is_active?: boolean; last_seen_at?: string; created_at?: string }

export default function CuratorStudentsPage() {
  const supabase = createEnglishClient()
  const [students, setStudents] = useState<StudentRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data: roles } = await supabase.from('english_user_roles').select('user_id').eq('role', 'student')
    const ids = ((roles ?? []) as { user_id: string }[]).map(r => r.user_id)
    if (!ids.length) { setLoading(false); return }
    const { data } = await supabase.from('profiles').select('id,full_name,email,language_level,is_active,last_seen_at,created_at').in('id', ids).order('created_at', { ascending: false }).limit(300)
    setStudents((data ?? []) as StudentRow[])
    setLoading(false)
  }

  return (
    <div style={{ flex: 1 }}>
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(27,143,196,0.1)', padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#1B3A6B' }}>Студенты</div>
        <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 10, border: '1.5px solid rgba(27,143,196,0.2)', background: '#fff', color: '#1B8FC4', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat' }}><RefreshCw size={13} /> Обновить</button>
      </div>
      <div style={{ padding: '24px 28px' }}>
        <DataTable
          data={students}
          loading={loading}
          searchKeys={['full_name', 'email']}
          pageSize={50}
          emptyMessage="Студентов нет"
          columns={[
            { key: 'full_name', header: 'Студент', render: s => (
              <div>
                <Link href={`/english/curator/students/${s.id}`} style={{ fontWeight: 700, color: '#1B3A6B', fontSize: 13, textDecoration: 'none' }}>{s.full_name as string ?? '—'}</Link>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{s.email as string}</div>
              </div>
            )},
            { key: 'language_level', header: 'Уровень', render: s => s.language_level ? <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{s.language_level as string}</span> : '—' },
            { key: 'last_seen_at', header: 'Последний вход', render: s => {
              if (!s.last_seen_at) return <span style={{ color: '#94a3b8' }}>Никогда</span>
              const daysAgo = Math.floor((Date.now() - new Date(s.last_seen_at as string).getTime()) / 86400000)
              return <span style={{ color: daysAgo > 14 ? '#ef4444' : '#64748b', fontSize: 13 }}>{new Date(s.last_seen_at as string).toLocaleDateString('ru-RU')}</span>
            }},
            { key: 'is_active', header: 'Статус', render: s => <StatusBadge status={s.is_active ? 'active' : 'inactive'} /> },
          ]}
        />
      </div>
    </div>
  )
}
