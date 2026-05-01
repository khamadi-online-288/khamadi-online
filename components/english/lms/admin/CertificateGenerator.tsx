'use client'
import { useState, useRef } from 'react'
import { Loader2, Download, ExternalLink } from 'lucide-react'

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

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFEF9',
        logging: false,
      })

      const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 80, margin: 1, color: { dark: '#1B3A6B', light: '#FFFEF9' } })

      const ctx = canvas.getContext('2d')
      if (ctx) {
        const qrImg = new Image()
        await new Promise<void>(r => { qrImg.onload = () => r(); qrImg.src = qrDataUrl })
        ctx.drawImage(qrImg, canvas.width - 180, canvas.height - 180, 140, 140)
      }

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210)

      pdf.save(`certificate-${certificateNumber}.pdf`)

      setStatus('Загрузка в облако...')
      const pdfBlob = pdf.output('blob')
      const storagePath = `certificates/${certificateNumber}.pdf`

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
      {/* Certificate preview — 794×562px matches A4 landscape proportions */}
      <div ref={previewRef} style={{
        width: 794,
        height: 562,
        background: '#FFFEF9',
        border: '2px solid #1B3A6B',
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* Inner ornamental border */}
        <div style={{
          position: 'absolute', top: 9, left: 9, right: 9, bottom: 9,
          border: '1px solid rgba(201,147,59,0.4)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* Corner L-ornaments */}
        <div style={{ position: 'absolute', top: 16, left: 16, width: 30, height: 30, borderTop: '1.5px solid #1B3A6B', borderLeft: '1.5px solid #1B3A6B' }} />
        <div style={{ position: 'absolute', top: 13, left: 13, width: 6, height: 6, background: '#C9933B', borderRadius: '50%' }} />

        <div style={{ position: 'absolute', top: 16, right: 16, width: 30, height: 30, borderTop: '1.5px solid #1B3A6B', borderRight: '1.5px solid #1B3A6B' }} />
        <div style={{ position: 'absolute', top: 13, right: 13, width: 6, height: 6, background: '#C9933B', borderRadius: '50%' }} />

        <div style={{ position: 'absolute', bottom: 16, left: 16, width: 30, height: 30, borderBottom: '1.5px solid #1B3A6B', borderLeft: '1.5px solid #1B3A6B' }} />
        <div style={{ position: 'absolute', bottom: 13, left: 13, width: 6, height: 6, background: '#C9933B', borderRadius: '50%' }} />

        <div style={{ position: 'absolute', bottom: 16, right: 16, width: 30, height: 30, borderBottom: '1.5px solid #1B3A6B', borderRight: '1.5px solid #1B3A6B' }} />
        <div style={{ position: 'absolute', bottom: 13, right: 13, width: 6, height: 6, background: '#C9933B', borderRadius: '50%' }} />

        {/* QR placeholder — overwritten by canvas after html2canvas capture */}
        {/* canvas.width - 180 at scale=2 → CSS x=704; canvas.height - 180 → CSS y=472; size 140→70 */}
        <div style={{
          position: 'absolute', right: 20, bottom: 20,
          width: 70, height: 70,
          border: '1px dashed rgba(27,58,107,0.2)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,254,249,0.7)',
          zIndex: 1,
        }}>
          <div style={{ fontSize: 7.5, color: '#b0bec5', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, textAlign: 'center', lineHeight: 1.5, letterSpacing: '0.05em' }}>
            QR КОД<br />верификации
          </div>
        </div>

        {/* ── HEADER ── */}
        <div style={{ textAlign: 'center', paddingTop: 22, position: 'relative', zIndex: 2 }}>
          <div style={{
            fontSize: 19, fontWeight: 900, color: '#1B3A6B',
            letterSpacing: '0.22em', fontFamily: 'Montserrat, sans-serif',
            textTransform: 'uppercase',
          }}>
            KHAMADI ENGLISH
          </div>
          <div style={{
            fontSize: 10, fontStyle: 'italic', color: '#C9933B',
            letterSpacing: '0.08em', marginTop: 3,
            fontFamily: 'Montserrat, sans-serif',
          }}>
            by KHAMADI ONLINE
          </div>
        </div>

        {/* Ornamental divider under header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          margin: '8px 76px 0', gap: 8,
          position: 'relative', zIndex: 2,
        }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,147,59,0.55))' }} />
          <div style={{ fontSize: 9, color: '#C9933B', lineHeight: 1 }}>◆</div>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(201,147,59,0.55), transparent)' }} />
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative', zIndex: 2,
          paddingBottom: 6,
        }}>
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <div style={{
              fontSize: 40, fontWeight: 900, color: '#1B3A6B',
              letterSpacing: '0.14em', lineHeight: 1,
              fontFamily: 'Montserrat, sans-serif',
            }}>
              СЕРТИФИКАТ
            </div>
            <div style={{ width: 56, height: 2.5, background: '#C9933B', margin: '7px auto 5px' }} />
            <div style={{
              fontSize: 11, color: '#64748b', letterSpacing: '0.1em',
              fontFamily: 'Montserrat, sans-serif',
            }}>
              о прохождении курса
            </div>
          </div>

          {/* Recipient */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 12, fontStyle: 'italic', color: '#94a3b8',
              fontFamily: 'Georgia, "Times New Roman", serif',
              marginBottom: 6,
            }}>
              настоящим подтверждается, что
            </div>
            <div style={{
              fontSize: 33, fontWeight: 900, color: '#C9933B',
              fontFamily: 'Montserrat, sans-serif',
              lineHeight: 1.15, letterSpacing: '0.03em',
            }}>
              {studentName}
            </div>
            <div style={{
              width: 240, height: 1, background: 'rgba(201,147,59,0.35)',
              margin: '5px auto 7px',
            }} />
            <div style={{
              fontSize: 12, fontStyle: 'italic', color: '#64748b',
              fontFamily: 'Montserrat, sans-serif',
              marginBottom: 6,
            }}>
              успешно завершил(а) курс
            </div>
            <div style={{
              fontSize: 20, fontWeight: 800, color: '#1B3A6B',
              fontFamily: 'Montserrat, sans-serif',
              marginBottom: 4,
            }}>
              {courseName}
            </div>
            <div style={{
              fontSize: 12, color: '#1B8FC4', fontWeight: 700,
              fontFamily: 'Montserrat, sans-serif',
            }}>
              {courseLevel && `Уровень: ${courseLevel} · `}Итоговый балл: {score}/100
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        {/* paddingRight: 116 → right content edge at 794-116=678, QR starts at 704 → 26px clearance */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          paddingLeft: 36, paddingRight: 116, paddingBottom: 18,
          position: 'relative', zIndex: 2,
        }}>

          {/* Signature 1 — Директор программы */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 96, height: 1, background: '#1B3A6B', margin: '0 auto 4px' }} />
            <div style={{
              fontSize: 9.5, fontWeight: 700, color: '#475569',
              fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.04em',
            }}>
              Директор программы
            </div>
          </div>

          {/* Center — stamp + cert number + date */}
          <div style={{ textAlign: 'center' }}>
            {/* Circular stamp */}
            <div style={{
              width: 58, height: 58, borderRadius: '50%',
              border: '1.5px dashed #1B3A6B',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 4px', position: 'relative', boxSizing: 'border-box',
            }}>
              <div style={{
                position: 'absolute', width: 46, height: 46, borderRadius: '50%',
                border: '0.8px solid rgba(201,147,59,0.55)',
              }} />
              <div style={{ fontSize: 13, color: '#C9933B', lineHeight: 1, position: 'relative', zIndex: 1 }}>★</div>
              <div style={{
                fontSize: 5.5, fontWeight: 800, color: '#1B3A6B',
                fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.1em',
                lineHeight: 1.3, position: 'relative', zIndex: 1, marginTop: 1,
              }}>KHAMADI</div>
              <div style={{
                fontSize: 4.5, fontWeight: 700, color: '#C9933B',
                fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.08em',
                lineHeight: 1.3, position: 'relative', zIndex: 1,
              }}>ENGLISH</div>
            </div>
            <div style={{ fontSize: 8.5, color: '#94a3b8', fontFamily: 'Montserrat, sans-serif' }}>
              № {certificateNumber}
            </div>
            <div style={{
              fontSize: 9.5, fontWeight: 700, color: '#475569',
              fontFamily: 'Montserrat, sans-serif', marginTop: 1,
            }}>
              {dateStr}
            </div>
          </div>

          {/* Signature 2 — Академический директор */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 96, height: 1, background: '#1B3A6B', margin: '0 auto 4px' }} />
            <div style={{
              fontSize: 9.5, fontWeight: 700, color: '#475569',
              fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.04em',
            }}>
              Академический директор
            </div>
          </div>

        </div>
      </div>

      {/* Actions */}
      <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          onClick={generate}
          disabled={generating}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 11,
            background: '#1B3A6B', color: '#fff', border: 'none',
            fontWeight: 700, fontSize: 13,
            cursor: generating ? 'default' : 'pointer',
            opacity: generating ? 0.7 : 1,
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          {generating ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={15} />}
          {generating ? (status || 'Генерация...') : 'Скачать PDF'}
        </button>
        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 18px', borderRadius: 11,
              background: '#dcfce7', color: '#166534',
              fontWeight: 700, fontSize: 13, textDecoration: 'none',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            <ExternalLink size={14} /> Открыть в облаке
          </a>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
