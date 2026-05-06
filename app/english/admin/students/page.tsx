'use client'
import { useEffect, useState, useMemo } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import AdminHeader from '@/components/english/lms/admin/AdminHeader'
import { Search, Check, X, RefreshCw, ChevronLeft, ChevronRight, Filter } from 'lucide-react'

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const PAGE_SIZE = 20

interface Student {
  id: string
  full_name: string
  email: string
  language_level: string | null
  status: string
  created_at: string
  last_seen_at: string | null
  is_active: boolean
}

const cardStyle: React.CSSProperties = { background: '#fff', borderRadius: 16, border: '1px solid rgba(27,143,196,0.1)', boxShadow: '0 2px 8px rgba(27,58,107,0.06)' }
const badgeStyle = (color: string, bg: string): React.CSSProperties => ({ background: bg, color, borderRadius: 6, padding: '2px 9px', fontSize: 11, fontWeight: 700 })

export default function AdminStudentsPage() {
  const supabase = createEnglishClient()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [approveTarget, setApproveTarget] = useState<Student | null>(null)
  const [approveLevel, setApproveLevel] = useState('A1')
  const [saving, setSaving] = useState(false)
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([])
  const [approveGroupId, setApproveGroupId] = useState('')

  useEffect(() => { load(); loadGroups() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('english_user_roles')
      .select('user_id, full_name, email, status, created_at, current_level, is_active')
      .eq('role', 'student')
      .order('created_at', { ascending: false })
      .limit(500)

    setStudents(((data ?? []) as Record<string, unknown>[]).map(r => ({
      id:             r.user_id as string,
      full_name:      (r.full_name as string) ?? '',
      email:          (r.email as string) ?? '',
      language_level: r.current_level as string | null,
      status:         (r.status as string) ?? 'pending',
      created_at:     (r.created_at as string) ?? '',
      last_seen_at:   null,
      is_active:      r.is_active !== false,
    })))
    setLoading(false)
  }

  async function loadGroups() {
    const { data } = await supabase.from('lms_groups').select('id,name').order('name')
    setGroups((data ?? []) as { id: string; name: string }[])
  }

  async function changeLevel(studentId: string, level: string) {
    await supabase.from('english_user_roles').update({ current_level: level }).eq('user_id', studentId)
    setStudents(s => s.map(x => x.id === studentId ? { ...x, language_level: level } : x))
  }

  async function toggleBlock(studentId: string, currentlyActive: boolean) {
    await supabase.from('english_user_roles').update({ is_active: !currentlyActive }).eq('user_id', studentId)
    setStudents(s => s.map(x => x.id === studentId ? { ...x, is_active: !currentlyActive } : x))
  }

  async function approveStudent() {
    if (!approveTarget) return
    setSaving(true)
    await supabase.from('english_user_roles').update({
      status:        'approved',
      current_level: approveLevel,
      approved_at:   new Date().toISOString(),
    }).eq('user_id', approveTarget.id)
    if (approveGroupId) {
      await supabase.from('lms_group_students').insert({ group_id: approveGroupId, student_id: approveTarget.id })
    }
    await supabase.from('english_notifications').insert({
      user_id: approveTarget.id,
      title:   'Добро пожаловать на KHAMADI ENGLISH!',
      message: 'Ваша заявка одобрена. Можете начать обучение.',
    })
    setStudents(s => s.map(x => x.id === approveTarget.id ? { ...x, status: 'approved', language_level: approveLevel } : x))
    setApproveTarget(null)
    setApproveLevel('A1')
    setApproveGroupId('')
    setSaving(false)
  }

  const filtered = useMemo(() => {
    let list = students
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s => s.full_name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q))
    }
    if (levelFilter !== 'all') list = list.filter(s => s.language_level === levelFilter)
    if (statusFilter !== 'all') list = list.filter(s => s.status === statusFilter)
    return list
  }, [students, search, levelFilter, statusFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const stats = {
    total:    students.length,
    pending:  students.filter(s => s.status === 'pending').length,
    approved: students.filter(s => s.status === 'approved').length,
    blocked:  students.filter(s => !s.is_active).length,
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 10, fontSize: 13, fontFamily: 'Montserrat', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' }

  return (
    <div style={{ flex: 1 }}>
      <AdminHeader title="Студенты" />
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {[
            { label: 'Всего студентов', value: stats.total, color: '#1B8FC4' },
            { label: 'Ожидают одобрения', value: stats.pending, color: '#ef4444' },
            { label: 'Одобрены', value: stats.approved, color: '#10b981' },
            { label: 'Заблокированы', value: stats.blocked, color: '#f59e0b' },
          ].map(c => (
            <div key={c.label} style={{ ...cardStyle, padding: '18px 20px' }}>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{c.label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: c.color }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ ...cardStyle, padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 220 }}>
            <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(0) }} placeholder="Поиск по имени или email..."
              style={{ ...inputStyle, paddingLeft: 34 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={13} color="#94a3b8" />
            <select value={levelFilter} onChange={e => { setLevelFilter(e.target.value); setPage(0) }}
              style={{ padding: '9px 12px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 10, fontSize: 13, fontFamily: 'Montserrat', background: '#f8fafc', cursor: 'pointer' }}>
              <option value="all">Все уровни</option>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0) }}
            style={{ padding: '9px 12px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 10, fontSize: 13, fontFamily: 'Montserrat', background: '#f8fafc', cursor: 'pointer' }}>
            <option value="all">Все статусы</option>
            <option value="pending">Ожидают</option>
            <option value="approved">Одобрены</option>
            <option value="rejected">Отклонены</option>
          </select>
          <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 10, border: '1.5px solid rgba(27,143,196,0.2)', background: '#fff', color: '#1B8FC4', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Montserrat' }}>
            <RefreshCw size={13} /> Обновить
          </button>
        </div>

        {/* Table */}
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>Загрузка...</div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Montserrat', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                    {['Студент', 'Уровень', 'Статус', 'Дата регистрации', 'Действия'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((s, i) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 10, background: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>{s.full_name?.[0]?.toUpperCase() ?? '?'}</span>
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#1e293b' }}>{s.full_name || '—'}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <select value={s.language_level ?? ''} onChange={e => changeLevel(s.id, e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: 8, border: '1.5px solid rgba(27,143,196,0.2)', fontSize: 12, fontFamily: 'Montserrat', background: '#f8fafc' }}>
                          <option value="">—</option>
                          {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {s.status === 'pending' && <span style={badgeStyle('#92400e', '#fef3c7')}>Ожидает</span>}
                        {s.status === 'approved' && <span style={badgeStyle('#166534', '#dcfce7')}>Одобрен</span>}
                        {s.status === 'rejected' && <span style={badgeStyle('#dc2626', '#fee2e2')}>Отклонён</span>}
                        {!s.is_active && <span style={{ ...badgeStyle('#dc2626', '#fee2e2'), marginLeft: 6 }}>Блок</span>}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>
                        {s.created_at ? new Date(s.created_at).toLocaleDateString('ru-RU') : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {s.status === 'pending' && (
                            <button onClick={() => setApproveTarget(s)}
                              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 8, background: '#dcfce7', color: '#16a34a', fontWeight: 700, fontSize: 12, border: '1.5px solid #86efac', cursor: 'pointer', fontFamily: 'Montserrat' }}>
                              <Check size={12} /> Одобрить
                            </button>
                          )}
                          <button onClick={() => toggleBlock(s.id, s.is_active)}
                            style={{ padding: '5px 12px', borderRadius: 8, background: s.is_active ? '#fee2e2' : '#dcfce7', color: s.is_active ? '#dc2626' : '#16a34a', fontWeight: 700, fontSize: 12, border: `1.5px solid ${s.is_active ? '#fca5a5' : '#86efac'}`, cursor: 'pointer', fontFamily: 'Montserrat' }}>
                            {s.is_active ? 'Блок.' : 'Разбл.'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {paginated.length === 0 && (
                <div style={{ padding: '60px 0', textAlign: 'center', color: '#94a3b8' }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>👨‍🎓</div>
                  <div style={{ fontSize: 14 }}>Студентов не найдено</div>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{filtered.length} студентов · стр. {page + 1} из {totalPages}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                      style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid rgba(27,143,196,0.2)', background: '#fff', cursor: page === 0 ? 'default' : 'pointer', opacity: page === 0 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B8FC4' }}>
                      <ChevronLeft size={15} />
                    </button>
                    <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                      style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid rgba(27,143,196,0.2)', background: '#fff', cursor: page >= totalPages - 1 ? 'default' : 'pointer', opacity: page >= totalPages - 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B8FC4' }}>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Approve modal */}
      {approveTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) setApproveTarget(null) }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: 32, maxWidth: 420, width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#1B3A6B', marginBottom: 4 }}>Одобрить студента</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 22 }}>{approveTarget.full_name} · {approveTarget.email}</div>

            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Уровень</label>
            <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
              {LEVELS.map(l => (
                <button key={l} onClick={() => setApproveLevel(l)} style={{ padding: '7px 14px', borderRadius: 9, border: approveLevel === l ? '2px solid #1B8FC4' : '1.5px solid rgba(27,143,196,0.2)', background: approveLevel === l ? '#f0f9ff' : '#f8fafc', color: approveLevel === l ? '#1B3A6B' : '#64748b', fontWeight: approveLevel === l ? 800 : 600, fontSize: 13, cursor: 'pointer', fontFamily: 'Montserrat' }}>{l}</button>
              ))}
            </div>

            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Группа (опционально)</label>
            <select value={approveGroupId} onChange={e => setApproveGroupId(e.target.value)} style={{ ...inputStyle, marginBottom: 22 }}>
              <option value="">— Без группы —</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setApproveTarget(null)} style={{ flex: 1, padding: '11px', borderRadius: 12, background: '#f1f5f9', color: '#475569', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat', fontSize: 14 }}>Отмена</button>
              <button onClick={approveStudent} disabled={saving} style={{ flex: 2, padding: '11px', borderRadius: 12, background: '#16a34a', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat', fontSize: 14, opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Сохранение...' : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Check size={15} /> Одобрить</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
