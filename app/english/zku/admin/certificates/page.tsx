'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { LEVEL_CERTS } from '@/lib/english/zku-level-certs'

const N = '#003876'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.08)'
const ADMIN = '#7C3AED'

const LEVEL_COLOR: Record<string, string> = {
  A1: '#1D9E75', 'A1.1': '#16A34A', A2: '#1B8FC4', B1: '#7C3AED', B2: '#DB2777', C1: '#D97706',
}

interface IssuedCertificate {
  user_id: string
  full_name: string | null
  email: string
  group_id: string | null
  group_name: string | null
  code: string
  slug: string
  name: string
  program: string
  issued_at: string | null
  certificate_number: string
}

function formatDate(value: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminCertificatesPage() {
  const [rows, setRows] = useState<IssuedCertificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('all')

  const load = useCallback(async () => {
    const supabase = createEnglishClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const res = await fetch('/api/english/admin/certificates', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    const data = await res.json() as { certificates?: IssuedCertificate[]; error?: string }
    if (!res.ok) {
      setError(data.error ?? 'Не удалось загрузить сертификаты')
      setLoading(false)
      return
    }
    setRows(data.certificates ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { void load() }, [load])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return rows.filter(row => {
      if (level !== 'all' && row.code !== level) return false
      if (!query) return true
      const haystack = `${row.full_name ?? ''} ${row.email} ${row.certificate_number} ${row.group_name ?? ''}`.toLowerCase()
      return haystack.includes(query)
    })
  }, [rows, search, level])

  const byLevel = useMemo(() => {
    const counts: Record<string, number> = {}
    rows.forEach(row => { counts[row.code] = (counts[row.code] ?? 0) + 1 })
    return counts
  }, [rows])

  const studentsWithCerts = useMemo(() => new Set(rows.map(row => row.user_id)).size, [rows])

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1180, margin: '0 auto', fontFamily: "'Montserrat', sans-serif" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1a0050', marginBottom: 4 }}>Сертификаты</h1>
        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: MUT, flexWrap: 'wrap' }}>
          <span>🏆 Выдано: <strong style={{ color: N }}>{rows.length}</strong></span>
          <span>🎓 Студентов: <strong style={{ color: ADMIN }}>{studentsWithCerts}</strong></span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button
          onClick={() => setLevel('all')}
          style={{
            padding: '7px 12px', borderRadius: 99, border: `1px solid ${level === 'all' ? ADMIN : BDR}`,
            background: level === 'all' ? ADMIN : '#fff', color: level === 'all' ? '#fff' : MUT,
            fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Все · {rows.length}
        </button>
        {LEVEL_CERTS.map(cert => {
          const color = LEVEL_COLOR[cert.code] ?? N
          const active = level === cert.code
          return (
            <button
              key={cert.code}
              onClick={() => setLevel(cert.code)}
              style={{
                padding: '7px 12px', borderRadius: 99, border: `1px solid ${active ? color : BDR}`,
                background: active ? color : '#fff', color: active ? '#fff' : color,
                fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {cert.code} · {byLevel[cert.code] ?? 0}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по имени, email, номеру или группе"
          style={{ flex: 1, minWidth: 220, padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
        />
        {(search || level !== 'all') && (
          <button
            onClick={() => { setSearch(''); setLevel('all') }}
            style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${BDR}`, background: '#FEE2E2', color: '#DC2626', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Сбросить
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 56, color: MUT }}>Загрузка...</div>
      ) : error ? (
        <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${BDR}`, padding: '40px 20px', textAlign: 'center', color: '#DC2626', fontWeight: 700 }}>{error}</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${BDR}`, overflow: 'auto', boxShadow: '0 1px 6px rgba(0,56,118,0.04)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 150px 130px 180px 140px 110px', padding: '12px 20px', background: '#F8FBFF', borderBottom: `1px solid ${BDR}`, gap: 8, minWidth: 900 }}>
            {['Студент', 'Сертификат', 'Дата', 'Номер', 'Группа', ''].map(head => (
              <div key={head || 'action'} style={{ fontSize: 10, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{head}</div>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: MUT }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🏆</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: N, marginBottom: 4 }}>
                {rows.length === 0 ? 'Сертификатов пока нет' : 'Ничего не найдено'}
              </div>
              <div style={{ fontSize: 12 }}>
                {rows.length === 0
                  ? 'Сертификат появляется после сдачи финального экзамена уровня.'
                  : 'Смените уровень или запрос.'}
              </div>
            </div>
          ) : filtered.map((row, index) => {
            const color = LEVEL_COLOR[row.code] ?? N
            const initial = (row.full_name ?? '?').charAt(0).toUpperCase()
            return (
              <div
                key={`${row.user_id}-${row.code}`}
                style={{
                  display: 'grid', gridTemplateColumns: '1.6fr 150px 130px 180px 140px 110px',
                  padding: '12px 20px', gap: 8, alignItems: 'center', minWidth: 900,
                  borderTop: index > 0 ? `1px solid ${BDR}` : 'none',
                  background: index % 2 === 0 ? '#fff' : '#FAFCFF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${color}, ${color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{initial}</div>
                  <div style={{ minWidth: 0 }}>
                    <Link href={`/english/zku/admin/students/${row.user_id}?tab=certificates`} style={{ fontSize: 12, fontWeight: 700, color: N, textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {row.full_name || 'Студент'}
                    </Link>
                    <div style={{ fontSize: 10, color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.email || '—'}</div>
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, background: `${color}18`, color, padding: '3px 8px', borderRadius: 99 }}>{row.code}</span>
                  <div style={{ fontSize: 11, color: MUT, marginTop: 4 }}>{row.name}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: N }}>{formatDate(row.issued_at)}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: MUT, fontFamily: 'ui-monospace, monospace' }}>{row.certificate_number}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: row.group_name ? N : '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.group_name || 'Без группы'}</div>
                <Link
                  href={`/english/zku/admin/students/${row.user_id}/certificates/${row.slug}?from=registry`}
                  style={{ display: 'block', textAlign: 'center', background: ADMIN, color: '#fff', padding: '8px 10px', borderRadius: 10, fontSize: 12, fontWeight: 800, textDecoration: 'none' }}
                >
                  Открыть
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
