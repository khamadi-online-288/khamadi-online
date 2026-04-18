'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

type Profile = {
  full_name?: string | null
}

export default function ParentTopbar() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadProfile() }, [])

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()
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
      window.location.href = '/ent/parent/login'
    } finally {
      setLoading(false)
    }
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'Ата-ана'
  const initials = firstName.charAt(0).toUpperCase()

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(14,165,233,0.10)',
        padding: '14px 32px',
        boxShadow: '0 1px 20px rgba(14,165,233,0.06)',
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
          <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', marginBottom: 3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            KHAMADI ONLINE
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.04em', lineHeight: 1.15 }}>
            Сәлем, {firstName} 👋
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Avatar */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 14px', borderRadius: 14,
              border: '1px solid rgba(14,165,233,0.15)',
              background: '#fff', color: '#0c4a6e',
              fontSize: 14, fontWeight: 800,
              boxShadow: '0 4px 16px rgba(14,165,233,0.06)',
            }}
          >
            <div
              style={{
                width: 30, height: 30, borderRadius: 999,
                background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 900, color: '#fff', flexShrink: 0,
              }}
            >
              {initials}
            </div>
            Ата-ана
          </div>

          {/* Logout */}
          <motion.button
            onClick={handleLogout}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.04, boxShadow: '0 8px 22px rgba(14,165,233,0.20)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              minHeight: 46, padding: '0 18px', borderRadius: 14, border: 'none',
              background: loading ? 'rgba(14,165,233,0.12)' : 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
              color: loading ? '#0ea5e9' : '#fff',
              fontSize: 14, fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 6px 20px rgba(14,165,233,0.22)',
              letterSpacing: '-0.01em', transition: 'all 0.2s',
            }}
          >
            {loading ? '...' : 'Шығу'}
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}
