'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import AdminHeader from '@/components/english/lms/admin/AdminHeader'
import DataTable from '@/components/english/lms/shared/DataTable'
import { UserPlus, UserMinus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Student extends Record<string, unknown> { id: string; full_name?: string; email?: string; language_level?: string; last_seen_at?: string }

export default function AdminGroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>()
  const supabase = createEnglishClient()
  const [group, setGroup] = useState<{ name: string; description?: string } | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [addId, setAddId] = useState('')

  useEffect(() => { load() }, [groupId])

  async function load() {
    setLoading(true)
    const [grpRes, membRes] = await Promise.all([
      supabase.from('lms_groups').select('name,description').eq('id', groupId).maybeSingle(),
      supabase.from('lms_group_students').select('student_id').eq('group_id', groupId),
    ])
    setGroup(grpRes.data as { name: string; description?: string } | null)
    const ids = ((membRes.data ?? []) as { student_id: string }[]).map(r => r.student_id)
    if (ids.length) {
      const { data } = await supabase.from('profiles').select('id,full_name,email,language_level,last_seen_at').in('id', ids)
      setStudents((data ?? []) as Student[])
    } else {
      setStudents([])
    }

    const { data: roleData } = await supabase.from('english_user_roles').select('user_id').eq('role', 'student')
    const allIds = ((roleData ?? []) as { user_id: string }[]).map(r => r.user_id)
    if (allIds.length) {
      const { data: allProf } = await supabase.from('profiles').select('id,full_name,email').in('id', allIds).order('full_name').limit(300)
      setAllStudents((allProf ?? []) as Student[])
    }
    setLoading(false)
  }

  async function addStudent() {
    if (!addId) return
    await supabase.from('lms_group_students').upsert({ group_id: groupId, student_id: addId }, { onConflict: 'group_id,student_id' })
    setAddId('')
    load()
  }

  async function removeStudent(studentId: string) {
    await supabase.from('lms_group_students').delete().eq('group_id', groupId).eq('student_id', studentId)
    setStudents(s => s.filter(x => x.id !== studentId))
  }

  const studentSet = new Set(students.map(s => s.id))
  const available = allStudents.filter(s => !studentSet.has(s.id))

  return (
    <div style={{ flex: 1 }}>
      <AdminHeader title={group?.name ?? 'Группа'} />
      <div style={{ padding: '24px 28px' }}>
        <Link href="/english/admin/groups" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13, fontWeight: 600, textDecoration: 'none', marginBottom: 20 }}><ArrowLeft size={14} /> Назад</Link>

        {group?.description && <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>{group.description}</div>}

        {/* Add student */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid rgba(27,143,196,0.1)', marginBottom: 20, display: 'flex', gap: 10 }}>
          <select value={addId} onChange={e => setAddId(e.target.value)} style={{ flex: 1, padding: '10px 13px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 10, fontSize: 13, fontFamily: 'Montserrat', outline: 'none', background: '#f8fafc' }}>
            <option value="">— Выберите студента —</option>
            {available.map(s => <option key={s.id} value={s.id}>{s.full_name ?? s.email ?? s.id}</option>)}
          </select>
          <button onClick={addStudent} style={{ padding: '10px 18px', borderRadius: 10, background: '#1B3A6B', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', gap: 6 }}><UserPlus size={14} /> Добавить</button>
        </div>

        <DataTable
          data={students}
          loading={loading}
          searchKeys={['full_name', 'email']}
          pageSize={50}
          emptyMessage="В группе нет студентов"
          columns={[
            { key: 'full_name', header: 'Студент', render: s => (
              <div>
                <Link href={`/english/admin/users/${s.id}`} style={{ fontWeight: 700, color: '#1B3A6B', textDecoration: 'none', fontSize: 13 }}>{s.full_name as string ?? '—'}</Link>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{s.email as string}</div>
              </div>
            )},
            { key: 'language_level', header: 'Уровень', render: s => s.language_level ? <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{s.language_level as string}</span> : '—' },
            { key: 'last_seen_at', header: 'Последний вход', render: s => s.last_seen_at ? new Date(s.last_seen_at as string).toLocaleDateString('ru-RU') : 'Никогда' },
            { key: 'actions', header: '', sortable: false, render: s => (
              <button onClick={() => removeStudent(s.id as string)} style={{ padding: '4px 10px', borderRadius: 7, border: '1.5px solid rgba(239,68,68,0.2)', background: '#fff8f8', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#dc2626', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', gap: 5 }}><UserMinus size={11} /> Удалить</button>
            )},
          ]}
        />
      </div>
    </div>
  )
}
