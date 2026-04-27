'use client'
import { useState, useRef } from 'react'
import { Award, Loader2, Download, ExternalLink } from 'lucide-react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { createClient } from '@supabase/supabase-js'

interface Props {
  certId?: string
  studentId?: string
  studentName: string
  courseName: string
  courseLevel?: string
  score: number
  issuedAt: string
  certificateNumber: string
  onSaved?: (pdfUrl: string) => void
}

export default function CertificateGenerator({ certId, studentId, studentName, courseName, courseLevel, score, issuedAt, certificateNumber, onSaved }: Props) {
  const supabase = createEnglishClient()
  const [generating, setGenerating] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const previewRef = useRef<HTMLDivElement>(null)

  const dateStr = new Date(issuedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://khamadi.online'}/english/cert/${certificateNumber}`

  async function generate() {
    if (!previewRef.current) return
    setGenerating(true); setStatus('Рендеринг...')
    try {
      const [{ default: html2canvas }, { default: jsPDF }, { default: QRCode }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
        import('qrcode'),
      ])

      // Render the hidden DOM element to canvas
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      // Generate QR code as data URL
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 80, margin: 1, color: { dark: '#1B3A6B', light: '#ffffff' } })

      // Place QR on canvas
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const qrImg = new Image()
        await new Promise<void>(r => { qrImg.onload = () => r(); qrImg.src = qrDataUrl })
        ctx.drawImage(qrImg, canvas.width - 180, canvas.height - 180, 140, 140)
      }

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210)

      // Download locally
      pdf.save(`certificate-${certificateNumber}.pdf`)

      // Upload to Supabase Storage
      setStatus('Загрузка в облако...')
      const pdfBlob = pdf.output('blob')
      const storagePath = `certificates/${certificateNumber}.pdf`

      // Use service role via API for storage upload
      const uploadResp = await fetch('/api/english/admin/upload-cert', {
        method: 'POST',
        body: pdfBlob,
        headers: {
          'Content-Type': 'application/pdf',
          'X-Cert-Path': storagePath,
          'X-Cert-Id': certId ?? '',
          'X-Student-Id': studentId ?? '',
          'X-Student-Name': studentName,
          'X-Course-Name': courseName,
        },
      })

      if (uploadResp.ok) {
        const { url } = await uploadResp.json()
        setPdfUrl(url)
        onSaved?.(url)
      }

      setStatus('')
    } catch (e) {
      console.error(e)
      setStatus('Ошибка генерации')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Certificate preview */}
      <div ref={previewRef} style={{
        width: 794, height: 562, background: '#fff',
        border: '3px solid #1B3A6B', borderRadius: 8,
        padding: '48px 56px', position: 'relative',
        boxSizing: 'border-box', overflow: 'hidden',
      }}>
        {/* Top gradient bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 7, background: 'linear-gradient(90deg, #1B3A6B 0%, #1B8FC4 50%, #C9933B 100%)' }} />
        {/* Bottom gradient bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 7, background: 'linear-gradient(90deg, #C9933B 0%, #1B8FC4 50%, #1B3A6B 100%)' }} />

        {/* Corner decorations */}
        {[['top:16px;left:16px', '0 0 20px 0'], ['top:16px;right:16px', '0 0 0 20px'], ['bottom:16px;left:16px', '20px 0 0 0'], ['bottom:16px;right:16px', '0 20px 0 0']].map(([pos, rad], i) => (
          <div key={i} style={{ position: 'absolute', width: 40, height: 40, border: '2px solid rgba(27,58,107,0.15)', ...Object.fromEntries(pos.split(';').map(s => s.split(':'))) }} />
        ))}

        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 10 }}>
            KHAMADI ONLINE · English Platform
          </div>
          <div style={{ fontSize: 38, fontWeight: 900, color: '#1B3A6B', letterSpacing: '0.05em', marginBottom: 4 }}>СЕРТИФИКАТ</div>
          <div style={{ fontSize: 13, color: '#64748b', letterSpacing: '0.1em', marginBottom: 28 }}>о прохождении курса</div>

          <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 6 }}>Настоящим подтверждается, что</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#C9933B', borderBottom: '2px solid #C9933B', display: 'inline-block', paddingBottom: 6, marginBottom: 20 }}>
            {studentName}
          </div>

          <div style={{ fontSize: 14, color: '#475569', marginBottom: 6 }}>успешно завершил(а) курс</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1B3A6B', marginBottom: 8 }}>{courseName}</div>
          <div style={{ fontSize: 14, color: '#1B8FC4', fontWeight: 700 }}>
            {courseLevel && `Уровень: ${courseLevel} · `}Итоговый балл: {score}/100
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', bottom: 20, left: 48, right: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Номер сертификата</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#475569', letterSpacing: '0.05em' }}>{certificateNumber}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 1, background: '#1B3A6B', margin: '0 auto 4px' }} />
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Подпись</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Дата выдачи</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{dateStr}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={generate} disabled={generating} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 11, background: '#1B3A6B', color: '#fff', border: 'none', fontWeight: 700, fontSize: 13, cursor: generating ? 'default' : 'pointer', opacity: generating ? 0.7 : 1, fontFamily: 'Montserrat' }}>
          {generating ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={15} />}
          {generating ? (status || 'Генерация...') : 'Скачать PDF'}
        </button>
        {pdfUrl && (
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 11, background: '#dcfce7', color: '#166534', fontWeight: 700, fontSize: 13, textDecoration: 'none', fontFamily: 'Montserrat' }}>
            <ExternalLink size={14} /> Открыть в облаке
          </a>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
