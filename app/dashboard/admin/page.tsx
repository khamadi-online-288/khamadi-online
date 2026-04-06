'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Profile = {
  id: string
  full_name: string
  email: string
  role: string
  city: string
  approval_status: string
}

export default function AdminPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  async function loadProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setProfiles(data)
    }

    setLoading(false)
  }

  useEffect(() => {
    loadProfiles()
  }, [])

  async function approveUser(id: string) {
    await supabase
      .from('profiles')
      .update({ approval_status: 'approved' })
      .eq('id', id)

    loadProfiles()
  }

  async function rejectUser(id: string) {
    await supabase
      .from('profiles')
      .update({ approval_status: 'rejected' })
      .eq('id', id)

    loadProfiles()
  }

  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>
  }

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>
        KHAMADI ADMIN PANEL
      </h1>

      <table style={{ width: '100%', marginTop: 30 }}>
        <thead>
          <tr>
            <th>Аты</th>
            <th>Email</th>
            <th>Қала</th>
            <th>Роль</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {profiles.map((p) => (
            <tr key={p.id}>
              <td>{p.full_name}</td>
              <td>{p.email}</td>
              <td>{p.city}</td>
              <td>{p.role}</td>
              <td>{p.approval_status}</td>

              <td>
                <button
                  onClick={() => approveUser(p.id)}
                  style={{
                    background: '#22c55e',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: 6,
                    marginRight: 10
                  }}
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectUser(p.id)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: 6
                  }}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}