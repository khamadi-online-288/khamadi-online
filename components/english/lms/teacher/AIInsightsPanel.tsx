'use client'
import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { analyzeStudentProgress } from '@/lib/english/lms/ai-insights'

interface Props {
  studentName: string
  progressPercent: number
  averageScore: number
  attendancePercent: number
  weakModules: string[]
  strongModules: string[]
  lastSeen: string | null
}

export default function AIInsightsPanel(props: Props) {
  const [text, setText] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function analyze() {
    setLoading(true)
    try {
      const result = await analyzeStudentProgress(props)
      setText(result)
    } catch {
      setText('Не удалось получить AI-анализ. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(27,58,107,0.04), rgba(27,143,196,0.06))', borderRadius: 20, padding: 24, border: '1px solid rgba(27,143,196,0.15)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={18} color="#C9933B" />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B' }}>AI Инсайты</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Анализ через Claude AI</div>
        </div>
      </div>
      {text ? (
        <div style={{ fontSize: 14, color: '#1e293b', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{text}</div>
      ) : (
        <div style={{ color: '#64748b', fontSize: 13, marginBottom: 14 }}>
          Получите персональный AI-анализ успеваемости студента с конкретными рекомендациями.
        </div>
      )}
      <button onClick={analyze} disabled={loading} style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: '#1B3A6B', color: '#fff', border: 'none', fontWeight: 700, fontSize: 13, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'Montserrat' }}>
        {loading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={15} />}
        {text ? 'Обновить анализ' : 'Сгенерировать анализ'}
      </button>
    </div>
  )
}
