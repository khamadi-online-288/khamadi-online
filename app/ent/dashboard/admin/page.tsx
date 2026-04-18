'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type Profile = {
  id: string
  full_name: string
  email: string
  role: string
  city: string
  approval_status: string
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

export default function AdminPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  async function loadProfiles() {
    setLoading(true)
    const res = await fetch('/ent/api/admin/profiles')
    const json = await res.json()
    if (json.profiles) setProfiles(json.profiles)
    setLoading(false)
  }

  useEffect(() => { loadProfiles() }, [])

  async function updateStatus(id: string, approval_status: string) {
    await fetch('/ent/api/admin/profiles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approval_status }),
    })
    loadProfiles()
  }

  const approveUser = (id: string) => updateStatus(id, 'approved')
  const rejectUser  = (id: string) => updateStatus(id, 'rejected')

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 14px' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 700 }}>Жүктелуде...</p>
        </div>
      </div>
    )
  }

  const pending = profiles.filter((p) => p.approval_status === 'pending')
  const approved = profiles.filter((p) => p.approval_status === 'approved')
  const rejected = profiles.filter((p) => p.approval_status === 'rejected')

  return (
    <div>
      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          Admin
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.05em', margin: 0, marginBottom: 6 }}>
          KHAMADI Admin Panel
        </h1>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, margin: 0 }}>
          Қолданушыларды басқару, бекіту және қабылдамау.
        </p>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { icon: '⏳', num: String(pending.length), label: 'Күтуде', color: '#f59e0b' },
          { icon: '✅', num: String(approved.length), label: 'Бекітілген', color: '#22c55e' },
          { icon: '❌', num: String(rejected.length), label: 'Қабылданбаған', color: '#ef4444' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: '#fff', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 22, padding: 20, textAlign: 'center', boxShadow: '0 8px 20px rgba(14,165,233,0.07)' }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color, letterSpacing: '-0.03em', marginBottom: 4 }}>{s.num}</div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <motion.div
        {...fadeUp(0.16)}
        style={{
          background: '#fff',
          border: '1px solid rgba(14,165,233,0.14)',
          borderRadius: 26,
          padding: 22,
          boxShadow: '0 10px 28px rgba(14,165,233,0.07)',
          overflowX: 'auto',
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 900, color: '#0c4a6e', marginBottom: 18, letterSpacing: '-0.02em' }}>
          Барлық қолданушылар ({profiles.length})
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(14,165,233,0.12)' }}>
              {['Аты', 'Email', 'Қала', 'Роль', 'Status', 'Әрекет'].map((h) => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 800, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {profiles.map((p, i) => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                style={{ borderBottom: '1px solid rgba(14,165,233,0.08)' }}
              >
                <td style={{ padding: '13px 14px', fontWeight: 700, color: '#0c4a6e' }}>{p.full_name || '—'}</td>
                <td style={{ padding: '13px 14px', color: '#64748b', fontWeight: 600 }}>{p.email || '—'}</td>
                <td style={{ padding: '13px 14px', color: '#64748b', fontWeight: 600 }}>{p.city || '—'}</td>
                <td style={{ padding: '13px 14px' }}>
                  <span style={{
                    padding: '5px 10px', borderRadius: 999, fontSize: 12, fontWeight: 800,
                    background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd',
                  }}>
                    {p.role || '—'}
                  </span>
                </td>
                <td style={{ padding: '13px 14px' }}>
                  <span style={{
                    padding: '5px 10px', borderRadius: 999, fontSize: 12, fontWeight: 800,
                    background: p.approval_status === 'approved' ? '#f0fdf4' : p.approval_status === 'rejected' ? '#fef2f2' : '#fefce8',
                    color: p.approval_status === 'approved' ? '#166534' : p.approval_status === 'rejected' ? '#991b1b' : '#854d0e',
                    border: p.approval_status === 'approved' ? '1px solid #bbf7d0' : p.approval_status === 'rejected' ? '1px solid #fecaca' : '1px solid #fef08a',
                  }}>
                    {p.approval_status || '—'}
                  </span>
                </td>
                <td style={{ padding: '13px 14px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => approveUser(p.id)}
                      style={{
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        color: '#fff',
                        padding: '7px 12px',
                        borderRadius: 10,
                        border: 'none',
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(34,197,94,0.2)',
                      }}
                    >
                      Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => rejectUser(p.id)}
                      style={{
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: '#fff',
                        padding: '7px 12px',
                        borderRadius: 10,
                        border: 'none',
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(239,68,68,0.2)',
                      }}
                    >
                      Reject
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {profiles.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>
            Қолданушылар табылмады
          </div>
        )}
      </motion.div>
    </div>
  )
}
