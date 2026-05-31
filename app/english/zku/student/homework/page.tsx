'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { useZkuLang } from '../zku-lang'
import { IcAward, IcClipboard } from '../_icons'

const N = '#003876'
const M = '#64748B'

interface Assignment {
  id: string
  title: string
  deadline_at: string | null
  min_score: number
  lesson_id: string | null
}

export default function ZKUHomeworkPage() {
  const { t } = useZkuLang()
  const [active,  setActive]  = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) { setLoading(false); return }

      // Get user's group_id from profile
      const { data: profileData } = await supabase
        .from('english_user_profiles')
        .select('group_id, current_level')
        .eq('user_id', user.id)
        .maybeSingle()

      // If no group assigned yet — show empty state gracefully
      if (!profileData?.group_id) { setLoading(false); return }

      const { data } = await supabase
        .from('english_assignments')
        .select('id, title, deadline_at, min_score, lesson_id')
        .eq('group_id', profileData.group_id)
        .order('deadline_at', { ascending: true })

      setActive((data ?? []) as Assignment[])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900, margin: '0 auto', fontFamily: "'Montserrat', sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: N, marginBottom: 4 }}>{t.hw.title}</h1>
        <p style={{ fontSize: 14, color: M }}>{t.hw.subtitle}</p>
      </div>

      <h2 style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
        {t.hw.active} ({active.length})
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#94A3B8', fontWeight: 600 }}>{t.common.loading}</div>
      ) : active.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 18, padding: '48px', textAlign: 'center', border: '1px solid rgba(0,56,118,0.08)', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><IcAward size={36} color={N} /></div>
          <p style={{ fontWeight: 800, fontSize: 16, color: N, marginBottom: 6 }}>{t.hw.no_hw}</p>
          <p style={{ fontSize: 14, color: M, marginBottom: 8 }}>{t.hw.no_hw_sub}</p>
          <p style={{ fontSize: 12, color: '#94A3B8' }}>
            {t.hw.group_info}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {active.map(a => {
            const deadline = a.deadline_at ? new Date(a.deadline_at) : null
            const daysLeft = deadline ? Math.ceil((deadline.getTime() - Date.now()) / 86400000) : null
            const urgent   = daysLeft !== null && daysLeft <= 2

            return (
              <div key={a.id} style={{
                background: '#fff', borderRadius: 18, padding: '20px 24px',
                border: `1px solid ${urgent ? 'rgba(220,38,38,0.2)' : 'rgba(0,56,118,0.08)'}`,
                display: 'flex', alignItems: 'center', gap: 20,
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: urgent ? 'rgba(220,38,38,0.08)' : 'rgba(0,56,118,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><IcClipboard size={24} color={urgent ? '#DC2626' : N} /></div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <p style={{ fontSize: 15, fontWeight: 800, color: N, margin: 0 }}>{a.title}</p>
                    {urgent && (
                      <span style={{ padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(220,38,38,0.1)', color: '#DC2626' }}>
                        {t.hw.urgent}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: M, margin: 0 }}>
                    {t.hw.min_score}: {a.min_score}%
                    {deadline && ` · ${deadline.toLocaleDateString('ru-RU')} (${daysLeft} ${t.hw.days_left})`}
                  </p>
                </div>

                <Link href={`/english/zku/student/lesson/${a.lesson_id ?? 'default'}`} style={{
                  padding: '10px 22px', borderRadius: 12, flexShrink: 0,
                  background: N, color: '#fff',
                  fontWeight: 700, fontSize: 13, textDecoration: 'none',
                  boxShadow: '0 3px 12px rgba(0,56,118,0.25)',
                }}>
                  {t.hw.do_btn}
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}