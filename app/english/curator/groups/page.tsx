'use client'
import { useEffect, useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import DataTable from '@/components/english/lms/shared/DataTable'
import { Users } from 'lucide-react'

interface GroupRow extends Record<string, unknown> { id: string; name: string; course_title?: string; teacher_name?: string; student_count?: number; created_at?: string }

export default function CuratorGroupsPage() {
  const supabase = createEnglishClient()
  const [groups, setGroups] = useState<GroupRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('lms_groups')
        .select('id,name,created_at,teacher:profiles!lms_groups_teacher_id_fkey(full_name),course:english_courses(title)')
        .order('created_at', { ascending: false })
        .limit(200)

      const ids = ((data ?? []) as unknown[]).map((g: unknown) => (g as { id: string }).id)
      const countRes = ids.length ? await supabase.from('lms_group_students').select('group_id').in('group_id', ids) : { data: [] }
      const countMap: Record<string, number> = {}
      ;(countRes.data ?? []).forEach((r: unknown) => {
        const row = r as { group_id: string }
        countMap[row.group_id] = (countMap[row.group_id] ?? 0) + 1
      })

      setGroups(((data ?? []) as unknown[]).map((g: unknown) => {
        const row = g as { id: string; name: string; created_at?: string; teacher?: { full_name?: string }; course?: { title?: string } }
        return { id: row.id, name: row.name, created_at: row.created_at, teacher_name: row.teacher?.full_name, course_title: row.course?.title, student_count: countMap[row.id] ?? 0 }
      }))
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{ flex: 1 }}>
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(27,143,196,0.1)', padding: '18px 28px' }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#1B3A6B' }}>Группы</div>
      </div>
      <div style={{ padding: '24px 28px' }}>
        <DataTable
          data={groups}
          loading={loading}
          searchKeys={['name', 'teacher_name', 'course_title']}
          pageSize={50}
          emptyMessage="Групп нет"
          columns={[
            { key: 'name', header: 'Группа', render: g => <span style={{ fontWeight: 700, color: '#1B3A6B', fontSize: 14 }}>{g.name as string}</span> },
            { key: 'course_title', header: 'Курс', render: g => g.course_title ? <span style={{ fontSize: 13 }}>{g.course_title as string}</span> : '—' },
            { key: 'teacher_name', header: 'Преподаватель', render: g => g.teacher_name ? <span style={{ fontSize: 13 }}>{g.teacher_name as string}</span> : <span style={{ color: '#94a3b8' }}>—</span> },
            { key: 'student_count', header: 'Студентов', render: g => (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Users size={13} color="#1B8FC4" />
                <span style={{ fontSize: 13, fontWeight: 700 }}>{g.student_count as number}</span>
              </div>
            )},
            { key: 'created_at', header: 'Создана', render: g => g.created_at ? new Date(g.created_at as string).toLocaleDateString('ru-RU') : '—' },
          ]}
        />
      </div>
    </div>
  )
}
