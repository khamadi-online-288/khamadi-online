'use client'
import { useState, useRef } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { Upload, X, FileText, Loader2 } from 'lucide-react'

interface Props {
  bucket?: string
  folder?: string
  accept?: string
  maxSizeMB?: number
  onUploaded: (url: string, path: string) => void
  label?: string
}

export default function FileUpload({ bucket = 'lms-files', folder = 'uploads', accept = '*', maxSizeMB = 10, onUploaded, label = 'Загрузить файл' }: Props) {
  const supabase = createEnglishClient()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const ref = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > maxSizeMB * 1024 * 1024) { setError(`Файл слишком большой (макс ${maxSizeMB} МБ)`); return }
    setUploading(true); setError('')

    const ext = file.name.split('.').pop()
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: uploadErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: false })
    if (uploadErr) { setError(uploadErr.message); setUploading(false); return }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
    setFileName(file.name)
    setUploading(false)
    onUploaded(publicUrl, path)
  }

  function clear() {
    setFileName(''); setError('')
    if (ref.current) ref.current.value = ''
  }

  return (
    <div>
      {!fileName ? (
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, border: '2px dashed rgba(27,143,196,0.3)', cursor: uploading ? 'default' : 'pointer', background: '#f8fafc', opacity: uploading ? 0.7 : 1 }}>
          {uploading ? <Loader2 size={18} color="#1B8FC4" style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={18} color="#1B8FC4" />}
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1B8FC4' }}>{uploading ? 'Загрузка...' : label}</span>
          <input ref={ref} type="file" accept={accept} onChange={handleFile} disabled={uploading} style={{ display: 'none' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </label>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: '#dcfce7', border: '1px solid rgba(22,163,74,0.2)' }}>
          <FileText size={16} color="#16a34a" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#166534', flex: 1 }}>{fileName}</span>
          <button onClick={clear} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}><X size={14} color="#166534" /></button>
        </div>
      )}
      {error && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 6 }}>{error}</div>}
    </div>
  )
}
