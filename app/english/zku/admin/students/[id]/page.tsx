'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'

const N = '#003876'
const T = '#1D9E75'
const G = '#C9933B'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.08)'
const ADMIN = '#7C3AED'

const LEVEL_COLOR: Record<string, string> = {
  A1: N, 'A1.1': '#16A34A', A2: '#1B8FC4', B1: '#7C3AED', B2: '#DB2777', C1: '#D97706',
}
const TYPE_LABEL: Record<string, string> = {
  reading: 'Чтение', listening: 'Аудирование', grammar: 'Грамматика',
  writing: 'Письмо', vocabulary: 'Словарь', test: 'Тест',
}
const TYPE_ICON: Record<string, string> = {
  reading: '📖', listening: '🎧', grammar: '📐', writing: '✍️', vocabulary: '📚', test: '🎯',
}

interface StudentDetail {
  user_id: string
  full_name: string | null
  email: string
  phone: string | null
  faculty: string | null
  current_level: string | null
  total_xp: number
  current_streak: number
  longest_streak: number
  last_active_at: string | null
  group_id: string | null
  group_name: string | null
  teacher_name: string | null
  created_at: string | null
  last_sign_in_at: string | null
  email_confirmed: boolean
  lessons_done: number
}

interface LessonProgress {
  lesson_id: string
  lesson_type: string | null
  lesson_title: string | null
  score: number | null
  xp_earned: number | null
  completed_at: string | null
  time_spent_min: number | null
}

interface GroupOption { id: string; name: string }
type Tab = 'info' | 'lessons'
type Toast = { msg: string; type: 'success' | 'error' }

function formatDate(value: string | null, withTime = false): string {
  if (!value) return '—'
  return new Date(value).toLocaleString('ru-RU', withTime
    ? { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: 'numeric', month: 'long', year: 'numeric' })
}

function daysSince(date: string | null): number | null {
  if (!date) return null
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
}

function activityText(date: string | null): string {
  const d = daysSince(date)
  if (d === null) return 'Не заходил'
  if (d === 0) return 'Сегодня'
  if (d === 1) return 'Вчера'
  return `${d} дн. назад`
}

export default function AdminStudentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [student, setStudent] = useState<StudentDetail | null>(null)
  const [lessons, setLessons] = useState<LessonProgress[]>([])
  const [groups, setGroups] = useState<GroupOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<Tab>('info')
  const [token, setToken] = useState('')
  const [toast, setToast] = useState<Toast | null>(null)
  const [passOpen, setPassOpen] = useState(false)
  const [newPass, setNewPass] = useState('')
  const [passLoading, setPassLoading] = useState(false)
  const [groupId, setGroupId] = useState('')
  const [groupLoading, setGroupLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const showToast = (msg: string, type: Toast['type'] = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    const supabase = createEnglishClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.replace('/english/zku/login'); return }
    setToken(session.access_token)

    const res = await fetch(`/api/english/admin/students/${id}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    const data = await res.json() as {
      student?: StudentDetail
      lessons?: LessonProgress[]
      groups?: GroupOption[]
      error?: string
    }
    if (!res.ok || !data.student) {
      setError(data.error ?? 'Не удалось загрузить студента')
      setLoading(false)
      return
    }
    setStudent(data.student)
    setGroupId(data.student.group_id ?? '')
    setLessons(data.lessons ?? [])
    setGroups(data.groups ?? [])
    setLoading(false)
  }, [id, router])

  useEffect(() => { void load() }, [load])

  const skills = useMemo(() => {
    const map: Record<string, { count: number; avgScore: number; totalXp: number }> = {}
    lessons.forEach(lesson => {
      const type = lesson.lesson_type ?? 'reading'
      if (!map[type]) map[type] = { count: 0, avgScore: 0, totalXp: 0 }
      map[type].count += 1
      map[type].avgScore += lesson.score ?? 0
      map[type].totalXp += lesson.xp_earned ?? 0
    })
    Object.values(map).forEach(row => {
      row.avgScore = Math.round(row.avgScore / row.count)
    })
    return Object.entries(map).sort((a, b) => b[1].count - a[1].count)
  }, [lessons])

  const avgScore = lessons.length
    ? Math.round(lessons.reduce((sum, lesson) => sum + (lesson.score ?? 0), 0) / lessons.length)
    : null

  async function changePassword() {
    if (!student || newPass.length < 6) { showToast('Минимум 6 символов', 'error'); return }
    setPassLoading(true)
    const res = await fetch('/api/english/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ targetUserId: student.user_id, newPassword: newPass }),
    })
    const data = await res.json() as { ok?: boolean; error?: string }
    setPassLoading(false)
    if (data.ok) {
      showToast('Пароль изменён')
      setPassOpen(false)
      setNewPass('')
    } else {
      showToast(data.error ?? 'Ошибка', 'error')
    }
  }

  async function saveGroup() {
    if (!student || groupLoading) return
    setGroupLoading(true)
    try {
      const res = await fetch('/api/english/admin/assign-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetUserId: student.user_id, groupId: groupId || null }),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) {
        showToast(data.error ?? 'Ошибка при назначении', 'error')
        return
      }
      const next = groups.find(g => g.id === groupId)
      setStudent(prev => prev ? {
        ...prev,
        group_id: groupId || null,
        group_name: next?.name ?? null,
        teacher_name: groupId ? prev.teacher_name : null,
      } : prev)
      showToast(next ? `Группа: ${next.name}` : 'Студент убран из группы')
      void load()
    } finally {
      setGroupLoading(false)
    }
  }

  async function deleteStudent() {
    if (!student || deleting) return
    const label = student.full_name || student.email || 'этого студента'
    if (!confirm(`Удалить аккаунт «${label}»?\n\nДействие необратимо: профиль, прогресс и вход будут удалены.`)) return
    setDeleting(true)
    try {
      const res = await fetch('/api/english/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetUserId: student.user_id }),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) {
        showToast(data.error ?? 'Ошибка удаления', 'error')
        return
      }
      router.push('/english/zku/admin/students')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '80px 0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${ADMIN}`, borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!student) {
    return (
      <div style={{ padding: '48px 28px', maxWidth: 720, margin: '0 auto' }}>
        <Link href="/english/zku/admin/students" style={{ fontSize: 13, color: MUT, textDecoration: 'none', fontWeight: 700 }}>← Все студенты</Link>
        <div style={{ marginTop: 24, background: '#fff', borderRadius: 16, padding: 28, border: `1px solid ${BDR}`, color: '#DC2626', fontWeight: 700 }}>
          {error || 'Студент не найден'}
        </div>
      </div>
    )
  }

  const initial = (student.full_name ?? '?').charAt(0).toUpperCase()
  const levelColor = LEVEL_COLOR[student.current_level ?? 'A1'] ?? N
  const inactive = (daysSince(student.last_active_at) ?? 999) > 30
  const infoRows: { label: string; value: string }[] = [
    { label: 'Email', value: student.email || '—' },
    { label: 'Телефон', value: student.phone || '—' },
    { label: 'Факультет', value: student.faculty || '—' },
    { label: 'Группа', value: student.group_name || 'Без группы' },
    { label: 'Преподаватель', value: student.teacher_name || '—' },
    { label: 'Уровень', value: student.current_level || 'A1' },
    { label: 'Регистрация', value: formatDate(student.created_at) },
    { label: 'Последний вход', value: formatDate(student.last_sign_in_at, true) },
    { label: 'Последняя активность', value: `${activityText(student.last_active_at)}${student.last_active_at ? ` · ${formatDate(student.last_active_at, true)}` : ''}` },
    { label: 'ID', value: student.user_id },
  ]

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1080, margin: '0 auto' }}>
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, padding: '12px 20px', borderRadius: 12, background: toast.type === 'success' ? T : '#DC2626', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }}>
          {toast.msg}
        </div>
      )}

      {passOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) { setPassOpen(false); setNewPass('') } }}
        >
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px 32px', width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: N, marginBottom: 6 }}>Сменить пароль</div>
            <div style={{ fontSize: 12, color: MUT, marginBottom: 20 }}>
              <strong>{student.full_name}</strong><br />
              <span style={{ color: '#94A3B8' }}>{student.email}</span>
            </div>
            <input
              autoFocus type="text" value={newPass} onChange={e => setNewPass(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') void changePassword() }}
              placeholder="Новый пароль (мин. 6 символов)"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `2px solid ${N}`, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', marginBottom: 14 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setPassOpen(false); setNewPass('') }} style={{ flex: 1, padding: '11px', borderRadius: 10, border: `1px solid ${BDR}`, background: '#F1F5F9', color: MUT, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Отмена</button>
              <button onClick={() => void changePassword()} disabled={passLoading || newPass.length < 6} style={{ flex: 2, padding: '11px', borderRadius: 10, border: 'none', background: newPass.length >= 6 ? N : '#CBD5E1', color: '#fff', fontWeight: 700, fontSize: 13, cursor: newPass.length >= 6 ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
                {passLoading ? 'Сохраняем...' : 'Сохранить пароль'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @media (max-width: 860px) {
          .student-stats { grid-template-columns: 1fr 1fr !important; }
          .student-info { grid-template-columns: 1fr !important; }
          .student-lessons { overflow-x: auto; }
        }
      `}</style>

      <Link href="/english/zku/admin/students" style={{ fontSize: 13, color: MUT, textDecoration: 'none', fontWeight: 700, display: 'inline-flex', marginBottom: 16 }}>
        ← Все студенты
      </Link>

      <div style={{ background: `linear-gradient(135deg, #1a0050 0%, ${ADMIN} 100%)`, borderRadius: 22, padding: '24px 28px', marginBottom: 18, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, position: 'relative', flexWrap: 'wrap' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${levelColor}, ${levelColor}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 28, flexShrink: 0 }}>{initial}</div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>{student.full_name || 'Студент'}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', marginBottom: 10 }}>{student.email || 'Email не указан'}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 800, background: 'rgba(255,255,255,0.16)', padding: '4px 10px', borderRadius: 99 }}>{student.current_level || 'A1'}</span>
              <span style={{ fontSize: 12, fontWeight: 700, background: student.group_name ? 'rgba(255,255,255,0.16)' : 'rgba(239,68,68,0.35)', padding: '4px 10px', borderRadius: 99 }}>{student.group_name || 'Без группы'}</span>
              <span style={{ fontSize: 12, fontWeight: 700, background: inactive ? 'rgba(245,158,11,0.35)' : 'rgba(29,158,117,0.35)', padding: '4px 10px', borderRadius: 99 }}>{activityText(student.last_active_at)}</span>
              <span style={{ fontSize: 12, fontWeight: 700, background: student.email_confirmed ? 'rgba(29,158,117,0.35)' : 'rgba(245,158,11,0.35)', padding: '4px 10px', borderRadius: 99 }}>{student.email_confirmed ? 'Email подтверждён' : 'Email не подтверждён'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="student-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginBottom: 18 }}>
        {[
          { label: 'XP', value: student.total_xp.toLocaleString('ru-RU'), color: G },
          { label: 'Стрик', value: String(student.current_streak), color: '#EF4444' },
          { label: 'Лучший стрик', value: String(student.longest_streak), color: '#F97316' },
          { label: 'Уроков', value: String(student.lessons_done), color: T },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#fff', borderRadius: 16, padding: '16px 18px', border: `1px solid ${BDR}` }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: MUT, fontWeight: 700, marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {([
          ['info', 'Информация'],
          ['lessons', 'Уроки'],
        ] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '8px 18px', borderRadius: 99, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            background: tab === key ? ADMIN : '#fff', color: tab === key ? '#fff' : MUT,
            boxShadow: tab === key ? '0 3px 10px rgba(124,58,237,0.28)' : '0 1px 3px rgba(0,0,0,0.06)',
          }}>{label}</button>
        ))}
      </div>

      {tab === 'info' && (
        <div className="student-info" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 0.8fr)', gap: 16, alignItems: 'start' }}>
          <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${BDR}`, overflow: 'hidden' }}>
            {infoRows.map((row, index) => (
              <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12, padding: '13px 20px', borderTop: index > 0 ? `1px solid ${BDR}` : 'none', alignItems: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: MUT, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{row.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: N, wordBreak: 'break-all' }}>{row.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#fff', borderRadius: 18, padding: '18px 18px 16px', border: `1px solid ${BDR}` }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: N, marginBottom: 12 }}>Группа</div>
              <select
                value={groupId}
                onChange={e => setGroupId(e.target.value)}
                disabled={groupLoading}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, fontFamily: 'inherit', background: '#fff', marginBottom: 10 }}
              >
                <option value="">Без группы</option>
                {groups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}
              </select>
              <button
                onClick={() => void saveGroup()}
                disabled={groupLoading || groupId === (student.group_id ?? '')}
                style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', background: groupId === (student.group_id ?? '') ? '#E2E8F0' : T, color: groupId === (student.group_id ?? '') ? MUT : '#fff', fontWeight: 800, fontSize: 13, cursor: groupId === (student.group_id ?? '') ? 'default' : 'pointer', fontFamily: 'inherit' }}
              >
                {groupLoading ? 'Сохраняем...' : 'Сохранить группу'}
              </button>
            </div>

            <div style={{ background: '#fff', borderRadius: 18, padding: 18, border: `1px solid ${BDR}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: N, marginBottom: 4 }}>Аккаунт</div>
              <button onClick={() => { setPassOpen(true); setNewPass('') }} style={{ padding: '10px 12px', borderRadius: 10, border: `1px solid ${BDR}`, background: '#F8FBFF', color: N, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                Сменить пароль
              </button>
              <button onClick={() => void deleteStudent()} disabled={deleting} style={{ padding: '10px 12px', borderRadius: 10, border: 'none', background: '#FEE2E2', color: '#DC2626', fontWeight: 700, fontSize: 13, cursor: deleting ? 'wait' : 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                {deleting ? 'Удаляем...' : 'Удалить студента'}
              </button>
            </div>

            {avgScore !== null && (
              <div style={{ background: '#fff', borderRadius: 18, padding: 18, border: `1px solid ${BDR}` }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: MUT, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Средний балл</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: avgScore >= 80 ? T : avgScore >= 60 ? G : '#EF4444', marginTop: 4 }}>{avgScore}%</div>
                <div style={{ fontSize: 12, color: MUT, marginTop: 2 }}>по {lessons.length} завершённым урокам</div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'lessons' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {skills.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 18, padding: '18px 20px', border: `1px solid ${BDR}` }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: N, marginBottom: 14 }}>Навыки</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {skills.map(([type, data]) => (
                  <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 28, textAlign: 'center', flexShrink: 0 }}>{TYPE_ICON[type] ?? '📖'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5, gap: 8 }}>
                        <span style={{ fontWeight: 700, color: N }}>{TYPE_LABEL[type] ?? type}</span>
                        <span style={{ color: MUT }}>{data.count} ур. · ср. {data.avgScore}% · +{data.totalXp.toLocaleString('ru-RU')} XP</span>
                      </div>
                      <div style={{ height: 6, background: '#EEF2F7', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${data.avgScore}%`, background: T, borderRadius: 99 }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="student-lessons" style={{ background: '#fff', borderRadius: 18, border: `1px solid ${BDR}`, overflow: 'hidden' }}>
            {lessons.length === 0 ? (
              <div style={{ padding: '48px 0', textAlign: 'center', color: MUT }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📚</div>
                <div style={{ fontWeight: 700 }}>Уроков ещё нет</div>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 140px 80px 70px 80px 160px', padding: '12px 20px', background: '#F8FBFF', borderBottom: `1px solid ${BDR}`, gap: 8, minWidth: 720 }}>
                  {['Урок', 'Тип', 'Балл', 'XP', 'Минуты', 'Дата'].map(head => (
                    <div key={head} style={{ fontSize: 10, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{head}</div>
                  ))}
                </div>
                {lessons.map((lesson, index) => (
                  <div key={`${lesson.lesson_id}-${index}`} style={{
                    display: 'grid', gridTemplateColumns: '2fr 140px 80px 70px 80px 160px', minWidth: 720,
                    padding: '11px 20px', gap: 8, alignItems: 'center',
                    borderTop: index > 0 ? `1px solid ${BDR}` : 'none',
                    background: index % 2 === 0 ? '#fff' : '#FAFCFF',
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: N, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lesson.lesson_title || lesson.lesson_id}</div>
                    <div style={{ fontSize: 12, color: MUT }}>{TYPE_ICON[lesson.lesson_type ?? ''] ?? '📖'} {TYPE_LABEL[lesson.lesson_type ?? ''] ?? lesson.lesson_type ?? '—'}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: (lesson.score ?? 0) >= 80 ? T : (lesson.score ?? 0) >= 60 ? G : '#EF4444' }}>{lesson.score ?? 0}%</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: G }}>+{lesson.xp_earned ?? 0}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: N }}>{lesson.time_spent_min ? `${lesson.time_spent_min}` : '—'}</div>
                    <div style={{ fontSize: 11, color: MUT }}>{formatDate(lesson.completed_at, true)}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
