'use client'
import { useEffect, useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import AdminHeader from '@/components/english/lms/admin/AdminHeader'
import CertificateGenerator from '@/components/english/lms/admin/CertificateGenerator'
import { Download, RefreshCw, Award } from 'lucide-react'

interface CertRow { id: string; issued_at: string; final_score?: number; student_name?: string; course_title?: string; student_id?: string; course_id?: string; certificate_number?: string }

export default function AdminCertificatesPage() {
  const supabase = createEnglishClient()
  const [certs, setCerts] = useState<CertRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<CertRow | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('lms_certificates')
      .select('id,issued_at,final_score,certificate_number,student_id,course_id,student:profiles(full_name),course:english_courses(title)')
      .order('issued_at', { ascending: false })
      .limit(300)
    setCerts(((data ?? []) as unknown[]).map((c: unknown) => {
      const row = c as { id: string; issued_at: string; final_score?: number; certificate_number?: string; student_id?: string; course_id?: string; student?: { full_name?: string }; course?: { title?: string } }
      return { id: row.id, issued_at: row.issued_at, final_score: row.final_score, student_name: row.student?.full_name, course_title: row.course?.title, student_id: row.student_id, course_id: row.course_id, certificate_number: row.certificate_number }
    }))
    setLoading(false)
  }

  function exportCSV() {
    const rows = [['ID', 'Студент', 'Курс', 'Балл', 'Номер сертификата', 'Дата выдачи']]
    certs.forEach(c => rows.push([c.id, c.student_name ?? '', c.course_title ?? '', c.final_score != null ? `${c.final_score}%` : '', c.certificate_number ?? '', new Date(c.issued_at).toLocaleDateString('ru-RU')]))
    const bom = '﻿'
    const csv = bom + rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `certificates-${new Date().toISOString().split('T')[0]}.csv`; a.click()
  }

  const filtered = certs.filter(c => !search || (c.student_name ?? '').toLowerCase().includes(search.toLowerCase()) || (c.course_title ?? '').toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ flex: 1 }}>
      <AdminHeader title="Сертификаты" />
      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, gap: 10, flexWrap: 'wrap' as const }}>
          <input placeholder="Поиск по студенту или курсу..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '10px 14px', borderRadius: 11, border: '1.5px solid rgba(27,143,196,0.2)', fontSize: 13, fontFamily: 'Montserrat', outline: 'none', background: '#fff', width: 280 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '10px 14px', borderRadius: 10, border: '1.5px solid rgba(27,143,196,0.2)', background: '#fff', color: '#1B8FC4', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat' }}><RefreshCw size={13} /> Обновить</button>
            <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '10px 14px', borderRadius: 10, border: '1.5px solid rgba(27,143,196,0.2)', background: '#fff', color: '#1B8FC4', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat' }}><Download size={13} /> CSV</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.1)', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center' as const, color: '#94a3b8' }}>Загрузка...</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 13, fontFamily: 'Montserrat' }}>
                <thead><tr style={{ background: '#f8fafc' }}>
                  {['Студент', 'Курс', 'Балл', 'Дата', ''].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left' as const, fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase' as const }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr key={c.id} onClick={() => setSelected(c === selected ? null : c)} style={{ background: selected?.id === c.id ? '#eff6ff' : i % 2 === 0 ? '#fff' : '#fafbfc', borderTop: '1px solid #f1f5f9', cursor: 'pointer' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#1e293b' }}>{c.student_name ?? '—'}</div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>{c.course_title ?? '—'}</td>
                      <td style={{ padding: '12px 16px' }}>{c.final_score != null ? <span style={{ fontWeight: 800, color: '#10b981' }}>{c.final_score}%</span> : '—'}</td>
                      <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 12 }}>{new Date(c.issued_at).toLocaleDateString('ru-RU')}</td>
                      <td style={{ padding: '12px 16px' }}><Award size={14} color={selected?.id === c.id ? '#1B3A6B' : '#cbd5e1'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && filtered.length === 0 && <div style={{ padding: 40, textAlign: 'center' as const, color: '#94a3b8', fontSize: 13 }}>Сертификатов нет</div>}
          </div>

          {selected && (
            <CertificateGenerator
              certId={selected.id}
              studentId={selected.student_id}
              studentName={selected.student_name ?? ''}
              courseName={selected.course_title ?? ''}
              score={selected.final_score ?? 0}
              issuedAt={selected.issued_at}
              certificateNumber={selected.certificate_number ?? `KH-${selected.id.slice(0, 6).toUpperCase()}`}
              onSaved={url => setCerts(cs => cs.map(c => c.id === selected.id ? { ...c, certificate_number: c.certificate_number } : c))}
            />
          )}
        </div>
      </div>
    </div>
  )
}
