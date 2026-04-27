'use client'
import { useEffect, useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import AdminHeader from '@/components/english/lms/admin/AdminHeader'
import DataTable from '@/components/english/lms/shared/DataTable'
import { Plus, RefreshCw, Users } from 'lucide-react'
import Link from 'next/link'

interface GroupRow extends Record<string, unknown> { id: string; name: string; description?: string; teacher_name?: string; student_count?: number; course_title?: string; created_at?: string }

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<GroupRow[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createEnglishClient()

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('lms_groups')
      .select('id,name,description,created_at,teacher:profiles!lms_groups_teacher_id_fkey(full_name),course:english_courses(title)')
      .order('created_at', { ascending: false })
      .limit(200)

    const groupIds = ((data ?? []) as unknown[]).map((g: unknown) => (g as { id: string }).id)
    const countRes = groupIds.length ? await supabase.from('lms_group_students').select('group_id').in('group_id', groupIds) : { data: [] }
    const countMap: Record<string, number> = {}
    ;(countRes.data ?? []).forEach((r: unknown) => {
      const row = r as { group_id: string }
      countMap[row.group_id] = (countMap[row.group_id] ?? 0) + 1
    })

    setGroups(((data ?? []) as unknown[]).map((g: unknown) => {
      const row = g as { id: string; name: string; description?: string; created_at?: string; teacher?: { full_name?: string }; course?: { title?: string } }
      return { id: row.id, name: row.name, description: row.description, created_at: row.created_at, teacher_name: row.teacher?.full_name, course_title: row.course?.title, student_count: countMap[row.id] ?? 0 }
    }))
    setLoading(false)
  }

  return (
    <div style={{ flex: 1 }}>
      <AdminHeader title="Группы" />
      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginBottom: 20 }}>
          <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 11, border: '1.5px solid rgba(27,143,196,0.2)', background: '#fff', color: '#1B8FC4', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Montserrat' }}><RefreshCw size={14} /> Обновить</button>
          <Link href="/english/admin/groups/create" style={{ textDecoration: 'none' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 11, background: '#1B3A6B', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}><Plus size={14} /> Создать группу</button>
          </Link>
        </div>
        <DataTable
          data={groups}
          loading={loading}
          searchKeys={['name', 'teacher_name', 'course_title']}
          pageSize={50}
          emptyMessage="Групп нет"
          columns={[
            { key: 'name', header: 'Группа', render: g => (
              <Link href={`/english/admin/groups/${g.id}`} style={{ fontWeight: 700, color: '#1B3A6B', textDecoration: 'none', fontSize: 14 }}>{g.name as string}</Link>
            )},
            { key: 'course_title', header: 'Курс', render: g => g.course_title ? <span style={{ fontSize: 13, color: '#334155' }}>{g.course_title as string}</span> : '—' },
            { key: 'teacher_name', header: 'Преподаватель', render: g => g.teacher_name ? <span style={{ fontSize: 13, color: '#334155' }}>{g.teacher_name as string}</span> : <span style={{ color: '#94a3b8' }}>—</span> },
            { key: 'student_count', header: 'Студентов', render: g => (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Users size={13} color="#1B8FC4" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1B3A6B' }}>{g.student_count as number}</span>
              </div>
            )},
            { key: 'created_at', header: 'Создана', render: g => g.created_at ? new Date(g.created_at as string).toLocaleDateString('ru-RU') : '—' },
            { key: 'actions', header: '', sortable: false, render: g => (
              <Link href={`/english/admin/groups/${g.id}`} style={{ padding: '4px 12px', borderRadius: 7, border: '1.5px solid rgba(27,143,196,0.2)', background: '#fff', fontSize: 11, fontWeight: 700, color: '#1B8FC4', textDecoration: 'none', display: 'inline-block' }}>Открыть</Link>
            )},
          ]}
        />
      </div>
    </div>
  )
}
