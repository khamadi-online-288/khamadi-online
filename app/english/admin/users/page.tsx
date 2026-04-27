'use client'
import { useEffect, useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import AdminHeader from '@/components/english/lms/admin/AdminHeader'
import StatusBadge from '@/components/english/lms/shared/StatusBadge'
import DataTable from '@/components/english/lms/shared/DataTable'
import ConfirmDialog from '@/components/english/lms/shared/ConfirmDialog'
import { UserPlus, RefreshCw, Check, X } from 'lucide-react'
import Link from 'next/link'

interface UserRow extends Record<string, unknown> {
  id: string; full_name?: string; email?: string; is_active?: boolean
  last_seen_at?: string; role_from_table?: string; avatar_url?: string
  language_level?: string; created_at?: string; status?: string
}

type PageTab = 'all' | 'pending' | 'blocked'

const LEVELS = ['A1','A2','B1','B2','C1','C2']
const ROLES  = [{ value: 'student', label: 'Студент' }, { value: 'teacher', label: 'Преподаватель' }, { value: 'curator', label: 'Куратор' }]

export default function AdminUsersPage() {
  const [users,         setUsers]         = useState<UserRow[]>([])
  const [groups,        setGroups]        = useState<{ id: string; name: string }[]>([])
  const [loading,       setLoading]       = useState(true)
  const [pageTab,       setPageTab]       = useState<PageTab>('all')
  const [deleteTarget,  setDeleteTarget]  = useState<string | null>(null)
  const [approveTarget, setApproveTarget] = useState<UserRow | null>(null)
  const [rejectTarget,  setRejectTarget]  = useState<UserRow | null>(null)
  const [approveForm,   setApproveForm]   = useState({ role: 'student', level: 'A1', groupId: '' })
  const [rejectReason,  setRejectReason]  = useState('')
  const [saving,        setSaving]        = useState(false)
  const supabase = createEnglishClient()

  useEffect(() => { load(); loadGroups() }, [])

  async function load() {
    setLoading(true)

    // Load pending users directly — independent of english_user_roles join
    const pendingRes = await supabase
      .from('profiles')
      .select('id,full_name,email,is_active,last_seen_at,created_at,language_level,avatar_url,status')
      .eq('status', 'pending')
      .eq('is_english_user', true)
      .order('created_at', { ascending: false })
      .limit(200)

    // Load approved/all English platform users via english_user_roles
    const rolesRes = await supabase.from('english_user_roles').select('user_id,role')
    const roleMap: Record<string, string> = {}
    const englishUserIds: string[] = []
    ;(rolesRes.data ?? []).forEach((r: { user_id: string; role: string }) => {
      roleMap[r.user_id] = r.role
      englishUserIds.push(r.user_id)
    })

    let approvedUsers: UserRow[] = []
    if (englishUserIds.length > 0) {
      const profilesRes = await supabase
        .from('profiles')
        .select('id,full_name,email,is_active,last_seen_at,created_at,language_level,department,avatar_url,status')
        .in('id', englishUserIds)
        .neq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(300)
      approvedUsers = ((profilesRes.data ?? []) as Record<string, unknown>[]).map(p => ({
        ...p,
        role_from_table: roleMap[(p.id as string)] ?? '',
      })) as UserRow[]
    }

    const pendingUsers = ((pendingRes.data ?? []) as Record<string, unknown>[]).map(p => ({
      ...p,
      role_from_table: roleMap[(p.id as string)] ?? 'student',
    })) as UserRow[]

    // Merge: pending first, then approved (dedup by id)
    const seen = new Set<string>()
    const merged: UserRow[] = []
    for (const u of [...pendingUsers, ...approvedUsers]) {
      if (!seen.has(u.id)) { seen.add(u.id); merged.push(u) }
    }
    setUsers(merged)
    setLoading(false)
  }

  async function loadGroups() {
    const { data } = await supabase.from('lms_groups').select('id,name').order('name')
    setGroups((data ?? []) as { id: string; name: string }[])
  }

  async function changeRole(userId: string, role: string) {
    await supabase.from('english_user_roles').upsert({ user_id: userId, role }, { onConflict: 'user_id' })
    setUsers(u => u.map(x => x.id === userId ? { ...x, role_from_table: role } : x))
  }

  async function toggleActive(userId: string, current: boolean) {
    await supabase.from('profiles').update({ is_active: !current }).eq('id', userId)
    setUsers(u => u.map(x => x.id === userId ? { ...x, is_active: !current } : x))
  }

  async function resetPassword(email: string) {
    await supabase.auth.resetPasswordForEmail(email)
    alert(`Письмо для сброса пароля отправлено на ${email}`)
  }

  async function deleteUser(userId: string) {
    await supabase.from('profiles').delete().eq('id', userId)
    setUsers(u => u.filter(x => x.id !== userId))
    setDeleteTarget(null)
  }

  async function approveUser() {
    if (!approveTarget) return
    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    await Promise.all([
      supabase.from('profiles').update({
        status:          'approved',
        language_level:  approveForm.level || null,
        approved_by:     session?.user.id ?? null,
        approved_at:     new Date().toISOString(),
      }).eq('id', approveTarget.id),
      supabase.from('english_user_roles').update({
        role:          approveForm.role,
        current_level: approveForm.level || null,
      }).eq('user_id', approveTarget.id),
    ])
    if (approveForm.groupId) {
      await supabase.from('lms_group_students').insert({ group_id: approveForm.groupId, student_id: approveTarget.id })
    }
    await supabase.from('english_notifications').insert({
      user_id: approveTarget.id,
      title:   'Добро пожаловать на KHAMADI ENGLISH!',
      body:    'Ваша заявка одобрена. Можете войти и начать обучение.',
      type:    'system',
    })
    setUsers(u => u.map(x => x.id === approveTarget.id
      ? { ...x, status: 'approved', role_from_table: approveForm.role, language_level: approveForm.level }
      : x
    ))
    setApproveTarget(null)
    setApproveForm({ role: 'student', level: 'A1', groupId: '' })
    setSaving(false)
  }

  async function rejectUser() {
    if (!rejectTarget) return
    setSaving(true)
    await supabase.from('profiles').update({
      status:           'rejected',
      rejection_reason: rejectReason || null,
    }).eq('id', rejectTarget.id)
    await supabase.from('english_notifications').insert({
      user_id: rejectTarget.id,
      title:   'Заявка отклонена',
      body:    rejectReason || 'Ваша заявка была отклонена администратором.',
      type:    'system',
    })
    setUsers(u => u.map(x => x.id === rejectTarget.id ? { ...x, status: 'rejected' } : x))
    setRejectTarget(null)
    setRejectReason('')
    setSaving(false)
  }

  const pendingUsers = users.filter(u => u.status === 'pending')
  const blockedUsers = users.filter(u => u.status !== 'pending' && u.is_active === false)
  const allUsers     = users.filter(u => u.status !== 'pending' && u.is_active !== false)

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: '1.5px solid rgba(27,143,196,0.2)',
    borderRadius: 10, fontSize: 13, fontFamily: 'Montserrat', outline: 'none',
    background: '#f8fafc', boxSizing: 'border-box',
  }

  return (
    <div style={{ flex: 1 }}>
      <AdminHeader title="Пользователи" />
      <div style={{ padding: '24px 28px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#f1f5f9', borderRadius: 12, padding: 4, width: 'fit-content' }}>
          {([
            { id: 'all',     label: `Все (${allUsers.length})` },
            { id: 'pending', label: `Заявки${pendingUsers.length > 0 ? ` (${pendingUsers.length})` : ''}` },
            { id: 'blocked', label: `Заблокированные (${blockedUsers.length})` },
          ] as { id: PageTab; label: string }[]).map(t => (
            <button key={t.id} onClick={() => setPageTab(t.id)} style={{
              padding: '8px 18px', borderRadius: 9, fontWeight: pageTab === t.id ? 800 : 600, fontSize: 13,
              border: 'none', background: pageTab === t.id ? '#fff' : 'transparent',
              color: pageTab === t.id ? (t.id === 'pending' && pendingUsers.length > 0 ? '#dc2626' : '#1B3A6B') : '#64748b',
              cursor: 'pointer', fontFamily: 'Montserrat',
              boxShadow: pageTab === t.id ? '0 1px 4px rgba(0,0,0,0.09)' : 'none', transition: 'all 0.15s',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Top-right actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20, gap: 10 }}>
          <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 11, border: '1.5px solid rgba(27,143,196,0.2)', background: '#fff', color: '#1B8FC4', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Montserrat' }}>
            <RefreshCw size={14} /> Обновить
          </button>
          <Link href="/english/admin/users/create" style={{ textDecoration: 'none' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 11, background: '#1B3A6B', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>
              <UserPlus size={14} /> Добавить
            </button>
          </Link>
        </div>

        {/* Pending tab */}
        {pageTab === 'pending' && (
          <div>
            {pendingUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontSize: 15 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
                Новых заявок нет
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: 18, border: '1px solid rgba(27,143,196,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                      {['Имя', 'Email', 'Желаемая роль', 'Дата заявки', 'Действия'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#f0f9ff', border: '1.5px solid rgba(27,143,196,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#1B3A6B', flexShrink: 0 }}>
                              {(u.full_name as string)?.[0]?.toUpperCase() ?? '?'}
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{u.full_name as string ?? '—'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{u.email as string ?? '—'}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 6, padding: '2px 9px', fontSize: 12, fontWeight: 700 }}>
                            {u.role_from_table as string || 'student'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8' }}>
                          {u.created_at ? new Date(u.created_at as string).toLocaleDateString('ru-RU') : '—'}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => setApproveTarget(u)}
                              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 9, background: '#dcfce7', color: '#16a34a', fontWeight: 700, fontSize: 12, border: '1.5px solid #86efac', cursor: 'pointer', fontFamily: 'Montserrat' }}>
                              <Check size={13} /> Одобрить
                            </button>
                            <button onClick={() => setRejectTarget(u)}
                              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 9, background: '#fee2e2', color: '#dc2626', fontWeight: 700, fontSize: 12, border: '1.5px solid #fca5a5', cursor: 'pointer', fontFamily: 'Montserrat' }}>
                              <X size={13} /> Отклонить
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* All users tab */}
        {pageTab === 'all' && (
          <DataTable
            data={allUsers}
            loading={loading}
            searchKeys={['full_name', 'email', 'department']}
            pageSize={50}
            emptyMessage="Пользователей нет"
            columns={[
              { key: 'full_name', header: 'Пользователь', render: u => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {u.avatar_url ? <img src={u.avatar_url as string} alt="" style={{ width: '100%', height: '100%', borderRadius: 9, objectFit: 'cover' }} /> : <span style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>{(u.full_name as string)?.[0]?.toUpperCase() ?? '?'}</span>}
                  </div>
                  <div>
                    <Link href={`/english/admin/users/${u.id}`} style={{ fontWeight: 700, color: '#1B3A6B', textDecoration: 'none', fontSize: 13 }}>{u.full_name as string ?? '—'}</Link>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{u.email as string}</div>
                  </div>
                </div>
              )},
              { key: 'role_from_table', header: 'Роль', render: u => (
                <select value={u.role_from_table as string ?? ''} onChange={e => changeRole(u.id as string, e.target.value)}
                  style={{ padding: '4px 8px', borderRadius: 8, border: '1.5px solid rgba(27,143,196,0.2)', fontSize: 12, fontFamily: 'Montserrat', background: '#f8fafc' }}>
                  <option value="">—</option><option value="student">Студент</option><option value="teacher">Преподаватель</option><option value="admin">Администратор</option>
                </select>
              )},
              { key: 'language_level', header: 'Уровень', render: u => u.language_level ? <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{u.language_level as string}</span> : '—' },
              { key: 'created_at', header: 'Регистрация', render: u => u.created_at ? new Date(u.created_at as string).toLocaleDateString('ru-RU') : '—' },
              { key: 'last_seen_at', header: 'Последний вход', render: u => u.last_seen_at ? new Date(u.last_seen_at as string).toLocaleDateString('ru-RU') : 'Никогда' },
              { key: 'is_active', header: 'Статус', render: u => <StatusBadge status={u.is_active ? 'active' : 'inactive'} /> },
              { key: 'actions', header: '', sortable: false, render: u => (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => toggleActive(u.id as string, u.is_active as boolean)} style={{ padding: '4px 10px', borderRadius: 7, border: '1.5px solid rgba(27,143,196,0.2)', background: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: u.is_active ? '#dc2626' : '#16a34a', fontFamily: 'Montserrat' }}>{u.is_active ? 'Откл.' : 'Вкл.'}</button>
                  {u.email && <button onClick={() => resetPassword(u.email as string)} style={{ padding: '4px 10px', borderRadius: 7, border: '1.5px solid rgba(27,143,196,0.2)', background: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#1B8FC4', fontFamily: 'Montserrat' }}>Пароль</button>}
                  <button onClick={() => setDeleteTarget(u.id as string)} style={{ padding: '4px 10px', borderRadius: 7, border: '1.5px solid rgba(239,68,68,0.2)', background: '#fff8f8', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#dc2626', fontFamily: 'Montserrat' }}>Удалить</button>
                </div>
              )},
            ]}
          />
        )}

        {/* Blocked tab */}
        {pageTab === 'blocked' && (
          <DataTable
            data={blockedUsers}
            loading={loading}
            searchKeys={['full_name', 'email']}
            pageSize={50}
            emptyMessage="Заблокированных нет"
            columns={[
              { key: 'full_name', header: 'Пользователь', render: u => (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{u.full_name as string ?? '—'}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{u.email as string}</div>
                </div>
              )},
              { key: 'role_from_table', header: 'Роль', render: u => <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>{u.role_from_table as string || '—'}</span> },
              { key: 'created_at', header: 'Зарег.', render: u => u.created_at ? new Date(u.created_at as string).toLocaleDateString('ru-RU') : '—' },
              { key: 'actions', header: '', sortable: false, render: u => (
                <button onClick={() => toggleActive(u.id as string, false)}
                  style={{ padding: '6px 14px', borderRadius: 9, background: '#dcfce7', color: '#16a34a', fontWeight: 700, fontSize: 12, border: '1.5px solid #86efac', cursor: 'pointer', fontFamily: 'Montserrat' }}>
                  Разблокировать
                </button>
              )},
            ]}
          />
        )}

        <ConfirmDialog open={deleteTarget !== null} title="Удалить пользователя?" message="Это действие необратимо." confirmLabel="Удалить" danger onConfirm={() => deleteTarget && deleteUser(deleteTarget)} onCancel={() => setDeleteTarget(null)} />
      </div>

      {/* Approve Modal */}
      {approveTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) setApproveTarget(null) }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: 32, maxWidth: 440, width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#1B3A6B', marginBottom: 6 }}>Одобрить заявку</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>{approveTarget.full_name as string ?? '—'} · {approveTarget.email as string ?? ''}</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Роль</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {ROLES.map(r => (
                    <button key={r.value} onClick={() => setApproveForm(f => ({ ...f, role: r.value }))}
                      style={{ flex: 1, padding: '9px', borderRadius: 10, border: approveForm.role === r.value ? '2px solid #1B8FC4' : '1.5px solid rgba(27,143,196,0.2)', background: approveForm.role === r.value ? '#f0f9ff' : '#f8fafc', color: approveForm.role === r.value ? '#1B3A6B' : '#64748b', fontWeight: approveForm.role === r.value ? 800 : 600, fontSize: 13, cursor: 'pointer', fontFamily: 'Montserrat' }}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {approveForm.role === 'student' && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Уровень</label>
                  <select value={approveForm.level} onChange={e => setApproveForm(f => ({ ...f, level: e.target.value }))} style={inputStyle}>
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Группа (опционально)</label>
                <select value={approveForm.groupId} onChange={e => setApproveForm(f => ({ ...f, groupId: e.target.value }))} style={inputStyle}>
                  <option value="">— Без группы —</option>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => setApproveTarget(null)} style={{ flex: 1, padding: '11px', borderRadius: 12, background: '#f1f5f9', color: '#475569', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat', fontSize: 14 }}>Отмена</button>
              <button onClick={approveUser} disabled={saving} style={{ flex: 2, padding: '11px', borderRadius: 12, background: '#16a34a', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat', fontSize: 14 }}>
                {saving ? 'Сохранение...' : 'Одобрить →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) setRejectTarget(null) }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: 32, maxWidth: 420, width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#dc2626', marginBottom: 6 }}>Отклонить заявку</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>{rejectTarget.full_name as string ?? '—'} · {rejectTarget.email as string ?? ''}</div>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Причина (опционально)</label>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} placeholder="Укажите причину отклонения..."
              style={{ ...inputStyle, resize: 'vertical' as const, lineHeight: 1.6 }} />
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setRejectTarget(null)} style={{ flex: 1, padding: '11px', borderRadius: 12, background: '#f1f5f9', color: '#475569', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat', fontSize: 14 }}>Отмена</button>
              <button onClick={rejectUser} disabled={saving} style={{ flex: 2, padding: '11px', borderRadius: 12, background: '#dc2626', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat', fontSize: 14 }}>
                {saving ? 'Сохранение...' : 'Отклонить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
