'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import AdminHeader from '@/components/english/lms/admin/AdminHeader'
import { UserPlus, Upload } from 'lucide-react'

export default function CreateUserPage() {
  const router = useRouter()
  const supabase = createEnglishClient()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'student', department: '', studentId: '', languageLevel: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [csvMode, setCsvMode] = useState(false)
  const [csvResult, setCsvResult] = useState<string[]>([])

  const inputStyle = { width: '100%', padding: '11px 14px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 12, fontSize: 14, fontFamily: 'Montserrat', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' as const }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const resp = await fetch('/api/english/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, role: form.role, fullName: form.fullName, department: form.department, studentId: form.studentId, languageLevel: form.languageLevel }),
      })
      const json = await resp.json()
      if (!resp.ok) throw new Error(json.error)
      router.push('/english/admin/users')
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function handleCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const lines = text.trim().split('\n').slice(1) // skip header
    const results: string[] = []
    for (const line of lines) {
      const [fullName, email, password, role, department, studentId] = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''))
      if (!email || !password) { results.push(`❌ ${email ?? line}: пропущены поля`); continue }
      try {
        const resp = await fetch('/api/english/admin/create-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role: role || 'student', fullName, department, studentId }),
        })
        const json = await resp.json()
        if (!resp.ok) results.push(`❌ ${email}: ${json.error}`)
        else results.push(`✅ ${email} создан`)
      } catch { results.push(`❌ ${email}: ошибка`) }
    }
    setCsvResult(results)
  }

  return (
    <div style={{ flex: 1 }}>
      <AdminHeader title="Создать пользователя" />
      <div style={{ padding: '24px 28px', maxWidth: 700 }}>
        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#f1f5f9', borderRadius: 12, padding: 4, width: 'fit-content' }}>
          {[{ id: false, label: 'Один пользователь' }, { id: true, label: 'CSV импорт' }].map(m => (
            <button key={String(m.id)} onClick={() => setCsvMode(m.id)} style={{ padding: '9px 18px', borderRadius: 10, fontWeight: csvMode === m.id ? 800 : 600, fontSize: 13, border: 'none', background: csvMode === m.id ? '#fff' : 'transparent', color: csvMode === m.id ? '#1B3A6B' : '#64748b', cursor: 'pointer', fontFamily: 'Montserrat', boxShadow: csvMode === m.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{m.label}</button>
          ))}
        </div>

        {!csvMode ? (
          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1px solid rgba(27,143,196,0.1)', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {error && <div style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>{error}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Имя *</label><input required value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} style={inputStyle} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Email *</label><input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Пароль *</label><input required type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={inputStyle} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Роль</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={inputStyle}><option value="student">Студент</option><option value="teacher">Преподаватель</option><option value="admin">Администратор</option></select></div>
              <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Отдел</label><input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} style={inputStyle} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>ID студента</label><input value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))} style={inputStyle} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Уровень языка</label>
                <select value={form.languageLevel} onChange={e => setForm(f => ({ ...f, languageLevel: e.target.value }))} style={inputStyle}><option value="">—</option>{['A1','A2','B1','B2','C1','C2'].map(l => <option key={l} value={l}>{l}</option>)}</select></div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" disabled={saving} style={{ flex: 1, padding: '12px', borderRadius: 12, background: '#1B3A6B', color: '#fff', fontWeight: 800, fontSize: 15, border: 'none', cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <UserPlus size={16} /> {saving ? 'Создание...' : 'Создать пользователя'}
              </button>
              <button type="button" onClick={() => router.back()} style={{ padding: '12px 20px', borderRadius: 12, background: '#f1f5f9', color: '#475569', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>Отмена</button>
            </div>
          </form>
        ) : (
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1px solid rgba(27,143,196,0.1)' }}>
            <div style={{ fontSize: 14, color: '#64748b', marginBottom: 16, lineHeight: 1.7 }}>
              CSV формат: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 5 }}>full_name,email,password,role,department,student_id</code><br />
              Первая строка — заголовок. Роль: student / teacher / admin.
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderRadius: 14, border: '2px dashed rgba(27,143,196,0.3)', cursor: 'pointer', background: '#f8fafc' }}>
              <Upload size={20} color="#1B8FC4" />
              <span style={{ fontWeight: 700, color: '#1B8FC4', fontSize: 14 }}>Выберите CSV файл</span>
              <input type="file" accept=".csv" onChange={handleCSV} style={{ display: 'none' }} />
            </label>
            {csvResult.length > 0 && (
              <div style={{ marginTop: 20, background: '#f8fafc', borderRadius: 12, padding: 16, maxHeight: 300, overflowY: 'auto' }}>
                {csvResult.map((r, i) => <div key={i} style={{ fontSize: 13, padding: '4px 0', borderBottom: '1px solid #f1f5f9', color: r.startsWith('✅') ? '#16a34a' : '#dc2626' }}>{r}</div>)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
