'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Profile = {
  full_name?: string | null
}

export default function ParentTopbar() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .limit(1)

    setProfile((data?.[0] as Profile) || null)
  }

  async function handleLogout() {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      window.location.href = '/parent/login'
    } finally {
      setLoading(false)
    }
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'Ата-ана'

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(255,255,255,0.80)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid #EEF2F7',
        padding: '16px 24px',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#64748B',
              marginBottom: 4,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            KHAMADI ONLINE
          </div>

          <div
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: '#0F172A',
              letterSpacing: '-0.03em',
            }}
          >
            Сәлем, {firstName}
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={loading}
          style={{
            minHeight: 42,
            padding: '0 16px',
            borderRadius: 14,
            border: 'none',
            background: '#0F172A',
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Шығу...' : 'Logout'}
        </button>
      </div>
    </header>
  )
}