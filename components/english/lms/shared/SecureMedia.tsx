'use client'
import { useState, useEffect } from 'react'
import { Loader2, Lock } from 'lucide-react'

interface AudioProps {
  storagePath: string | null | undefined
  bucket?: string
  className?: string
  style?: React.CSSProperties
}

// Fetches a signed URL via the API route (never exposes direct storage URLs)
export function SecureAudio({ storagePath, bucket = 'english-content', className, style }: AudioProps) {
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!storagePath) return
    // If it's already a full URL (legacy), use it directly but still route through signed URL if it's Supabase
    const path = storagePath.includes('/storage/v1/object/')
      ? storagePath.split('/storage/v1/object/public/')[1] // extract bucket/path
      : storagePath

    setLoading(true)
    const [extractedBucket, ...rest] = path.split('/')
    const filePath = rest.join('/')
    fetch(`/api/english/signed-url?bucket=${extractedBucket || bucket}&path=${encodeURIComponent(filePath || path)}`)
      .then(r => r.json())
      .then(data => { if (data.url) setUrl(data.url); else setError('Ошибка доступа') })
      .catch(() => setError('Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [storagePath, bucket])

  if (!storagePath) return null
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Загрузка аудио...</div>
  if (error) return <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ef4444', fontSize: 12 }}><Lock size={12} /> {error}</div>

  return (
    <audio controls src={url ?? ''} className={className} style={{ width: '100%', borderRadius: 12, ...style }}
      onContextMenu={e => e.preventDefault()}
    />
  )
}

interface DocProps {
  storagePath: string | null | undefined
  bucket?: string
  label?: string
}

export function SecureDocument({ storagePath, bucket = 'lms-files', label = 'Открыть документ' }: DocProps) {
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function loadUrl() {
    if (!storagePath || url) return
    setLoading(true)
    fetch(`/api/english/signed-url?bucket=${bucket}&path=${encodeURIComponent(storagePath)}`)
      .then(r => r.json())
      .then(data => { if (data.url) setUrl(data.url) })
      .finally(() => setLoading(false))
  }

  if (!storagePath) return null

  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: '#e0f2fe', color: '#0369a1', fontWeight: 700, fontSize: 13, textDecoration: 'none', fontFamily: 'Montserrat' }}>
      📄 {label}
    </a>
  ) : (
    <button onClick={loadUrl} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: '#f1f5f9', color: '#475569', fontWeight: 700, fontSize: 13, border: 'none', cursor: loading ? 'default' : 'pointer', fontFamily: 'Montserrat' }}>
      {loading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Lock size={13} />}
      {loading ? 'Загрузка...' : label}
    </button>
  )
}
