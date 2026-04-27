'use client'
import { useState, useEffect } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import AdminHeader from '@/components/english/lms/admin/AdminHeader'
import { Save, Shield } from 'lucide-react'

interface Settings { platform_name: string; max_attempts: number; pass_threshold: number; cert_min_score: number; inactivity_days: number }

const DEFAULTS: Settings = { platform_name: 'English LMS', max_attempts: 3, pass_threshold: 70, cert_min_score: 80, inactivity_days: 14 }

export default function AdminSettingsPage() {
  const supabase = createEnglishClient()
  const [settings, setSettings] = useState<Settings>(DEFAULTS)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      setAdminEmail(session?.user.email ?? '')
      const { data } = await supabase.from('profiles').select('settings').eq('id', session?.user.id ?? '').maybeSingle()
      if ((data as { settings?: Settings } | null)?.settings) {
        setSettings({ ...DEFAULTS, ...(data as { settings: Settings }).settings })
      }
    }
    load()
  }, [])

  async function save() {
    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await supabase.from('profiles').update({ settings } as Record<string, unknown>).eq('id', session.user.id)
    }
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputStyle = { width: '100%', padding: '10px 13px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 10, fontSize: 14, fontFamily: 'Montserrat', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' as const }

  return (
    <div style={{ flex: 1 }}>
      <AdminHeader title="Настройки" />
      <div style={{ padding: '24px 28px', maxWidth: 640 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Platform */}
          <section style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid rgba(27,143,196,0.1)' }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B', marginBottom: 20 }}>Платформа</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Название платформы</label><input value={settings.platform_name} onChange={e => setSettings(s => ({ ...s, platform_name: e.target.value }))} style={inputStyle} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Порог прохождения курса (%)</label><input type="number" min={0} max={100} value={settings.pass_threshold} onChange={e => setSettings(s => ({ ...s, pass_threshold: Number(e.target.value) }))} style={inputStyle} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Минимальный балл для сертификата (%)</label><input type="number" min={0} max={100} value={settings.cert_min_score} onChange={e => setSettings(s => ({ ...s, cert_min_score: Number(e.target.value) }))} style={inputStyle} /></div>
            </div>
          </section>

          {/* Engagement */}
          <section style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid rgba(27,143,196,0.1)' }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B', marginBottom: 20 }}>Вовлечённость</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Макс. попыток на тест</label><input type="number" min={1} max={10} value={settings.max_attempts} onChange={e => setSettings(s => ({ ...s, max_attempts: Number(e.target.value) }))} style={inputStyle} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Дней неактивности до пометки "В группе риска"</label><input type="number" min={1} max={90} value={settings.inactivity_days} onChange={e => setSettings(s => ({ ...s, inactivity_days: Number(e.target.value) }))} style={inputStyle} /></div>
            </div>
          </section>

          {/* Account info */}
          <section style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid rgba(27,143,196,0.1)' }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><Shield size={16} /> Администратор</div>
            <div style={{ fontSize: 13, color: '#475569' }}>Email: <strong>{adminEmail}</strong></div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>Для смены email или пароля используйте раздел «Пользователи».</div>
          </section>

          <button onClick={save} disabled={saving} style={{ padding: '13px', borderRadius: 12, background: saved ? '#10b981' : '#1B3A6B', color: '#fff', fontWeight: 800, fontSize: 15, border: 'none', cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}>
            <Save size={15} />{saved ? 'Сохранено!' : saving ? 'Сохранение...' : 'Сохранить настройки'}
          </button>
        </div>
      </div>
    </div>
  )
}
