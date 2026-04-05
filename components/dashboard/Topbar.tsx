'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Profile = {
  full_name?: string | null
  role?: 'student' | 'parent' | null
}

export default function Topbar() {
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
      .select('full_name, role')
      .eq('id', user.id)
      .limit(1)

    setProfile((data?.[0] as Profile) || null)
  }

  async function handleLogout() {
    try {
      setLoading(true)
      await supabase.auth.signOut()

      if (profile?.role === 'parent') {
        window.location.href = '/parent/login'
        return
      }

      window.location.href = '/login'
    } finally {
      setLoading(false)
    }
  }

  const firstName =
    profile?.full_name?.trim()?.split(' ')[0] ||
    (profile?.role === 'parent' ? 'Ата-ана' : 'Оқушы')

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(255,255,255,0.78)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid #EEF2F7',
        padding: '16px 24px',
      }}
    >
      <div
        style={{
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
              lineHeight: 1.1,
            }}
          >
            Сәлем, {firstName}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Link
            href="/dashboard/profile"
            style={{
              textDecoration: 'none',
              minHeight: 42,
              padding: '0 16px',
              borderRadius: 14,
              border: '1px solid #E2E8F0',
              background: '#FFFFFF',
              color: '#0F172A',
              fontSize: 14,
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(15,23,42,0.04)',
            }}
          >
            Профиль
          </Link>

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
              boxShadow: '0 10px 24px rgba(15,23,42,0.10)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Шығу...' : 'Logout'}
          </button>
        </div>
      </div>
    </header>
  )
}