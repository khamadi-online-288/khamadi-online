'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import AdminHeader from '@/components/english/lms/admin/AdminHeader'
import { ArrowLeft, Save, Mail, Shield, BookOpen, Users, Activity } from 'lucide-react'
import Link from 'next/link'

interface Profile { id: string; full_name?: string; email?: string; department?: string; student_id_number?: string; language_level?: string; is_active?: boolean; last_seen_at?: string; created_at?: string; avatar_url?: string; phone?: string }
interface ActivityRow { id: string; action: string; created_at: string; metadata?: Record<string, unknown> }
interface ProgressRow { id: string; lesson_title?: string; course_title?: string; status: string; completed_at?: string; score?: number }

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>()
  const router = useRouter()
  const supabase = createEnglishClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [role, setRole] = useState('')
  const [activity, setActivity] = useState<ActivityRow[]>([])
  const [progress, setProgress] = useState<ProgressRow[]>([])
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([])
  const [tab, setTab] = useState<'info' | 'progress' | 'groups' | 'activity'>('info')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ full_name: '', email: '', department: '', student_id_number: '', language_level: '', phone: '', is_active: true })

  useEffect(() => { load() }, [userId])

  async function load() {
    const [profileRes, roleRes, actRes, progRes, grpRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('english_user_roles').select('role').eq('user_id', userId).maybeSingle(),
      supabase.from('lms_activity_log').select('id,action,created_at,metadata').eq('user_id', userId).order('created_at', { ascending: false }).limit(50),
      supabase.from('lms_progress').select('id,status,completed_at,score,lesson:english_lesson_sections(title),course:english_courses(title)').eq('student_id', userId).order('completed_at', { ascending: false }).limit(50),
      supabase.from('lms_group_students').select('group:lms_groups(id,name)').eq('student_id', userId),
    ])
    const p = profileRes.data as Profile | null
    if (p) {
      setProfile(p)
      setForm({ full_name: p.full_name ?? '', email: p.email ?? '', department: p.department ?? '', student_id_number: p.student_id_number ?? '', language_level: p.language_level ?? '', phone: (p as unknown as { phone?: string }).phone ?? '', is_active: p.is_active ?? true })
    }
    setRole((roleRes.data as { role: string } | null)?.role ?? '')
    setActivity((actRes.data ?? []) as ActivityRow[])
    setProgress(((progRes.data ?? []) as unknown[]).map((r: unknown) => {
      const row = r as { id: string; status: string; completed_at?: string; score?: number; lesson?: { title?: string }; course?: { title?: string } }
      return { id: row.id, status: row.status, completed_at: row.completed_at, score: row.score, lesson_title: row.lesson?.title, course_title: row.course?.title }
    }))
    setGroups(((grpRes.data ?? []) as unknown[]).map((r: unknown) => {
      const row = r as { group?: { id: string; name: string } }
      return row.group ?? { id: '', name: '' }
    }).filter(g => g.id))
  }

  async function save() {
    setSaving(true)
    await supabase.from('profiles').update({ full_name: form.full_name, department: form.department, student_id_number: form.student_id_number, language_level: form.language_level || null, is_active: form.is_active }).eq('id', userId)
    if (role) await supabase.from('english_user_roles').upsert({ user_id: userId, role }, { onConflict: 'user_id' })
    setSaving(false)
    router.push('/english/admin/users')
  }

  const inputStyle = { width: '100%', padding: '10px 13px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 10, fontSize: 13, fontFamily: 'Montserrat', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' as const }
  const tabs = [{ id: 'info', label: 'Профиль', icon: <Shield size={13} /> }, { id: 'progress', label: 'Прогресс', icon: <BookOpen size={13} /> }, { id: 'groups', label: 'Группы', icon: <Users size={13} /> }, { id: 'activity', label: 'Активность', icon: <Activity size={13} /> }]

  if (!profile) return <div style={{ flex: 1 }}><AdminHeader title="Загрузка..." /></div>

  return (
    <div style={{ flex: 1 }}>
      <AdminHeader title={profile.full_name ?? 'Пользователь'} />
      <div style={{ padding: '24px 28px', maxWidth: 800 }}>
        <Link href="/english/admin/users" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13, fontWeight: 600, textDecoration: 'none', marginBottom: 20 }}><ArrowLeft size={14} /> Назад</Link>

        {/* Header card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(27,143,196,0.1)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {profile.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', borderRadius: 16, objectFit: 'cover' }} /> : <span style={{ color: '#fff', fontSize: 24, fontWeight: 800 }}>{profile.full_name?.[0]?.toUpperCase() ?? '?'}</span>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#1B3A6B' }}>{profile.full_name ?? '—'}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{profile.email}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              {role && <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 6, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>{role === 'admin' ? 'Администратор' : role === 'teacher' ? 'Преподаватель' : 'Студент'}</span>}
              {profile.language_level && <span style={{ background: '#dcfce7', color: '#166534', borderRadius: 6, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>{profile.language_level}</span>}
              <span style={{ background: profile.is_active ? '#dcfce7' : '#fee2e2', color: profile.is_active ? '#166534' : '#dc2626', borderRadius: 6, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>{profile.is_active ? 'Активен' : 'Неактивен'}</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', textAlign: 'right' }}>
            <div>Регистрация: {profile.created_at ? new Date(profile.created_at).toLocaleDateString('ru-RU') : '—'}</div>
            <div style={{ marginTop: 4 }}>Последний вход: {profile.last_seen_at ? new Date(profile.last_seen_at).toLocaleDateString('ru-RU') : 'Никогда'}</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#f1f5f9', borderRadius: 12, padding: 4, width: 'fit-content' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 16px', borderRadius: 9, fontWeight: tab === t.id ? 800 : 600, fontSize: 12, border: 'none', background: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#1B3A6B' : '#64748b', cursor: 'pointer', fontFamily: 'Montserrat', boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{t.icon}{t.label}</button>
          ))}
        </div>

        {tab === 'info' && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid rgba(27,143,196,0.1)', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><label style={{ fontSize: 11, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Полное имя</label><input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} style={inputStyle} /></div>
              <div><label style={{ fontSize: 11, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Email</label><input value={form.email} disabled style={{ ...inputStyle, opacity: 0.6 }} /></div>
              <div><label style={{ fontSize: 11, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Отдел</label><input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} style={inputStyle} /></div>
              <div><label style={{ fontSize: 11, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>ID студента</label><input value={form.student_id_number} onChange={e => setForm(f => ({ ...f, student_id_number: e.target.value }))} style={inputStyle} /></div>
              <div><label style={{ fontSize: 11, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Уровень языка</label>
                <select value={form.language_level} onChange={e => setForm(f => ({ ...f, language_level: e.target.value }))} style={inputStyle}><option value="">—</option>{['A1','A2','B1','B2','C1','C2'].map(l => <option key={l} value={l}>{l}</option>)}</select></div>
              <div><label style={{ fontSize: 11, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Роль</label>
                <select value={role} onChange={e => setRole(e.target.value)} style={inputStyle}><option value="">—</option><option value="student">Студент</option><option value="teacher">Преподаватель</option><option value="admin">Администратор</option></select></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="isActive" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} style={{ width: 16, height: 16 }} />
              <label htmlFor="isActive" style={{ fontSize: 13, fontWeight: 700, color: '#475569', cursor: 'pointer' }}>Активный пользователь</label>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={save} disabled={saving} style={{ flex: 1, padding: '11px', borderRadius: 11, background: '#1B3A6B', color: '#fff', fontWeight: 800, fontSize: 14, border: 'none', cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}><Save size={15} />{saving ? 'Сохранение...' : 'Сохранить'}</button>
              <button onClick={() => supabase.auth.resetPasswordForEmail(form.email).then(() => alert('Письмо отправлено'))} style={{ padding: '11px 18px', borderRadius: 11, background: '#f1f5f9', color: '#1B8FC4', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={14} />Сброс пароля</button>
            </div>
          </div>
        )}

        {tab === 'progress' && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(27,143,196,0.1)' }}>
            {progress.length === 0 ? <div style={{ color: '#94a3b8', fontSize: 13 }}>Нет данных о прогрессе</div> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {progress.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 9, background: '#f8fafc' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{p.lesson_title ?? '—'}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{p.course_title ?? '—'}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {p.score != null && <span style={{ fontSize: 13, fontWeight: 800, color: p.score >= 80 ? '#10b981' : '#f59e0b' }}>{p.score}%</span>}
                      <span style={{ fontSize: 11, background: p.status === 'completed' ? '#dcfce7' : '#fef3c7', color: p.status === 'completed' ? '#166534' : '#92400e', borderRadius: 6, padding: '2px 8px', fontWeight: 700 }}>{p.status === 'completed' ? 'Завершён' : 'В процессе'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'groups' && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(27,143,196,0.1)' }}>
            {groups.length === 0 ? <div style={{ color: '#94a3b8', fontSize: 13 }}>Не состоит ни в одной группе</div> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {groups.map(g => (
                  <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 11, background: '#f8fafc', border: '1px solid rgba(27,143,196,0.08)' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1B3A6B' }}>{g.name}</span>
                    <Link href={`/english/admin/groups/${g.id}`} style={{ fontSize: 12, color: '#1B8FC4', fontWeight: 700, textDecoration: 'none' }}>Открыть →</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'activity' && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(27,143,196,0.1)' }}>
            {activity.length === 0 ? <div style={{ color: '#94a3b8', fontSize: 13 }}>Нет активности</div> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {activity.map(a => (
                  <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', borderRadius: 8, background: '#f8fafc' }}>
                    <span style={{ fontSize: 12, color: '#334155', fontWeight: 600 }}>{a.action}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(a.created_at).toLocaleString('ru-RU')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
