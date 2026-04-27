'use client'
import type { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { awardXP } from '@/lib/english/xp'
import { motion } from 'framer-motion'

type EssayType = 'Academic' | 'Opinion' | 'Discussion' | 'Problem-Solution'

const WRITING_PROMPTS: Record<EssayType, string[]> = {
  Academic: [
    'Some people believe universities should focus on academic subjects only. Others think practical skills are equally important. Discuss both views.',
    'The rise of artificial intelligence will have more negative than positive effects on society. To what extent do you agree?',
    'Governments should invest more in public transportation rather than building new roads. Discuss.',
  ],
  Opinion: [
    'The best way to reduce crime is to ensure that people have a good standard of living. To what extent do you agree?',
    'International travel has more advantages than disadvantages. To what extent do you agree?',
    'Technology is making people more isolated from each other. Do you agree?',
  ],
  Discussion: [
    'Some people think that parents should read or tell stories to children. Others think children can read books themselves. Discuss both views.',
    'In some countries, young people are encouraged to work abroad before starting a career. Discuss the advantages and disadvantages.',
    'Some believe that success comes from hard work; others think talent is more important. Discuss both views.',
  ],
  'Problem-Solution': [
    'Traffic congestion is a major problem in many cities. What are the causes and what measures could be taken to address the problem?',
    'Many young people today do not know how to manage their finances. What are the reasons and what can be done?',
    'Obesity is an increasing problem globally. What are the causes of this problem and what solutions can you suggest?',
  ],
}

const BAND_COLOR = (b: number) => b >= 7 ? '#10b981' : b >= 6 ? '#f59e0b' : '#ef4444'

interface Feedback { overall_band: number; task_achievement: number; coherence_cohesion: number; lexical_resource: number; grammatical_range: number; summary: string; strengths: string[]; corrections: { original: string; corrected: string; explanation: string }[]; suggestions: string[]; improved_intro: string }
interface WritingSession { id: string; prompt: string; overall_score: number; word_count: number; created_at: string }

export default function WritingCoachPage() {
  const supabase = createEnglishClient()
  const [essayType, setEssayType] = useState<EssayType>('Academic')
  const [prompt, setPrompt] = useState(WRITING_PROMPTS['Academic'][0])
  const [customPrompt, setCustomPrompt] = useState(false)
  const [targetBand, setTargetBand] = useState('7.0')
  const [essay, setEssay] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [history, setHistory] = useState<WritingSession[]>([])
  const [uid, setUid] = useState('')

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0

  useEffect(() => {
    supabase.auth.getSession().then((res: { data: { session: Session | null } }) => {
      const session = res.data.session
      if (!session) return
      setUid(session.user.id)
      supabase.from('english_writing_sessions').select('id,prompt,overall_score,word_count,created_at').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(5).then((r: { data: WritingSession[] | null }) => setHistory(r.data ?? []))
    })
  }, [])

  async function getFeedback() {
    if (wordCount < 150 || !uid) return
    setLoading(true); setFeedback(null)
    const aiPrompt = `Ты — эксперт IELTS Writing Band 9. Оцени эссе студента.\n\nТИП: ${essayType}\nТЕМА: ${prompt}\nЦЕЛЕВОЙ BAND: ${targetBand}\nЭССЕ (${wordCount} слов):\n${essay}\n\nДай фидбек строго в JSON без лишнего текста:\n{"overall_band":6.5,"task_achievement":65,"coherence_cohesion":70,"lexical_resource":68,"grammatical_range":72,"summary":"2 предложения на русском","strengths":["сторона 1","сторона 2"],"corrections":[{"original":"фраза с ошибкой","corrected":"исправление","explanation":"объяснение на русском"}],"suggestions":["совет 1","совет 2","совет 3"],"improved_intro":"улучшенное вступление на английском"}`
    try {
      const resp = await fetch('/api/english/ai-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: aiPrompt, maxTokens: 900 }) })
      const { text } = await resp.json()
      const parsed: Feedback = JSON.parse(text.replace(/```json\n?|```/g, '').trim())
      setFeedback(parsed)
      await supabase.from('english_writing_sessions').insert({ user_id: uid, prompt, essay_text: essay, word_count: wordCount, ai_feedback: parsed as unknown as Record<string,unknown>, overall_score: Math.round(parsed.overall_band * 10) })
      await awardXP(supabase, uid, 'writing_submitted')
      const { data } = await supabase.from('english_writing_sessions').select('id,prompt,overall_score,word_count,created_at').eq('user_id', uid).order('created_at', { ascending: false }).limit(5)
      setHistory((data ?? []) as WritingSession[])
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1B3A6B', margin: '0 0 4px' }}>Writing Coach</h1>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>IELTS Writing — детальный AI фидбек по 4 критериям</p>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Left: settings */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid rgba(27,143,196,0.1)' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#1B3A6B', marginBottom: 12 }}>Тип эссе</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
              {(['Academic', 'Opinion', 'Discussion', 'Problem-Solution'] as EssayType[]).map(t => (
                <button key={t} onClick={() => { setEssayType(t); setPrompt(WRITING_PROMPTS[t][0]); setCustomPrompt(false) }}
                  style={{ padding: '9px 14px', borderRadius: 9, border: essayType === t ? '2px solid #1B8FC4' : '1.5px solid rgba(27,143,196,0.15)', background: essayType === t ? '#eff6ff' : '#f8fafc', color: essayType === t ? '#1B3A6B' : '#475569', fontWeight: essayType === t ? 800 : 600, fontSize: 13, cursor: 'pointer', fontFamily: 'Montserrat', textAlign: 'left' as const }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid rgba(27,143,196,0.1)' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#1B3A6B', marginBottom: 10 }}>Тема</div>
            {!customPrompt ? (
              <>
                {WRITING_PROMPTS[essayType].map(p => (
                  <button key={p} onClick={() => setPrompt(p)}
                    style={{ display: 'block', width: '100%', padding: '8px 10px', borderRadius: 8, border: prompt === p ? '2px solid #1B8FC4' : '1px solid rgba(27,143,196,0.1)', background: prompt === p ? '#eff6ff' : '#f8fafc', color: '#334155', fontWeight: 500, fontSize: 11, cursor: 'pointer', fontFamily: 'Montserrat', textAlign: 'left' as const, marginBottom: 6, lineHeight: 1.4 }}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setCustomPrompt(true)} style={{ width: '100%', padding: '7px', borderRadius: 8, border: '1px dashed rgba(27,143,196,0.3)', background: 'transparent', color: '#1B8FC4', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat', marginTop: 4 }}>+ Своя тема</button>
              </>
            ) : (
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} style={{ width: '100%', padding: '10px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 10, fontSize: 12, fontFamily: 'Montserrat', outline: 'none', resize: 'vertical' as const, boxSizing: 'border-box' as const }} />
            )}
          </div>

          <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid rgba(27,143,196,0.1)' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#1B3A6B', marginBottom: 10 }}>Целевой Band</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
              {['5.0', '6.0', '7.0', '8.0'].map(b => (
                <button key={b} onClick={() => setTargetBand(b)}
                  style={{ flex: 1, padding: '8px', borderRadius: 8, border: targetBand === b ? '2px solid #1B8FC4' : '1px solid rgba(27,143,196,0.15)', background: targetBand === b ? '#eff6ff' : '#f8fafc', color: targetBand === b ? '#1B3A6B' : '#64748b', fontWeight: targetBand === b ? 800 : 600, fontSize: 13, cursor: 'pointer', fontFamily: 'Montserrat' }}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid rgba(27,143,196,0.1)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#1B3A6B', marginBottom: 10 }}>Последние эссе</div>
              {history.map(h => (
                <div key={h.id} style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 11, color: '#334155', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{h.prompt?.slice(0, 50)}...</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8' }}>
                    <span>{h.word_count} слов</span>
                    {h.overall_score && <span style={{ color: BAND_COLOR(h.overall_score / 10), fontWeight: 700 }}>Band {(h.overall_score / 10).toFixed(1)}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: editor + feedback */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid rgba(27,143,196,0.1)' }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10, lineHeight: 1.5 }}>{prompt}</div>
            <textarea value={essay} onChange={e => setEssay(e.target.value)} rows={14}
              placeholder="Начните писать ваше эссе здесь... (минимум 250 слов для IELTS)"
              style={{ width: '100%', padding: '14px', border: '1.5px solid rgba(27,143,196,0.15)', borderRadius: 12, fontSize: 14, fontFamily: 'Montserrat', outline: 'none', resize: 'vertical' as const, lineHeight: 1.7, boxSizing: 'border-box' as const }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <span style={{ fontSize: 12, color: wordCount < 150 ? '#ef4444' : wordCount < 250 ? '#f59e0b' : '#10b981', fontWeight: 700 }}>{wordCount} слов {wordCount < 250 ? `(нужно ещё ${250 - wordCount})` : '✓'}</span>
              <button onClick={getFeedback} disabled={loading || wordCount < 150}
                style={{ padding: '11px 24px', borderRadius: 12, background: (loading || wordCount < 150) ? '#e2e8f0' : '#1B3A6B', color: (loading || wordCount < 150) ? '#94a3b8' : '#fff', fontWeight: 800, fontSize: 14, border: 'none', cursor: (loading || wordCount < 150) ? 'default' : 'pointer', fontFamily: 'Montserrat' }}>
                {loading ? 'AI анализирует...' : 'Получить фидбек'}
              </button>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              {/* Band score */}
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid rgba(27,143,196,0.1)', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
                  <div style={{ textAlign: 'center' as const }}>
                    <div style={{ fontSize: 48, fontWeight: 900, color: BAND_COLOR(feedback.overall_band), lineHeight: 1 }}>{feedback.overall_band.toFixed(1)}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>BAND</div>
                  </div>
                  <div style={{ flex: 1, fontSize: 14, color: '#334155', lineHeight: 1.6 }}>{feedback.summary}</div>
                </div>
                {[['Task Achievement', feedback.task_achievement], ['Coherence & Cohesion', feedback.coherence_cohesion], ['Lexical Resource', feedback.lexical_resource], ['Grammatical Range', feedback.grammatical_range]].map(([label, score]) => (
                  <div key={String(label)} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                      <span>{label}</span><span style={{ color: Number(score) >= 70 ? '#10b981' : Number(score) >= 50 ? '#f59e0b' : '#ef4444' }}>{score}/100</span>
                    </div>
                    <div style={{ height: 6, background: '#e2e8f0', borderRadius: 999 }}>
                      <div style={{ height: '100%', borderRadius: 999, background: Number(score) >= 70 ? '#10b981' : Number(score) >= 50 ? '#C9933B' : '#ef4444', width: `${score}%`, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Strengths */}
              <div style={{ background: '#f0fdf4', borderRadius: 14, padding: 18, marginBottom: 12, border: '1px solid rgba(16,185,129,0.2)' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#166534', marginBottom: 10 }}>Сильные стороны</div>
                {feedback.strengths.map((s, i) => <div key={i} style={{ fontSize: 13, color: '#166534', marginBottom: 4 }}>✓ {s}</div>)}
              </div>

              {/* Corrections */}
              {feedback.corrections.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 14, padding: 18, marginBottom: 12, border: '1px solid rgba(27,143,196,0.1)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#1B3A6B', marginBottom: 10 }}>Исправления</div>
                  {feedback.corrections.map((c, i) => (
                    <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: 12, color: '#dc2626', textDecoration: 'line-through', marginBottom: 2 }}>{c.original}</div>
                      <div style={{ fontSize: 12, color: '#166534', marginBottom: 4 }}>→ {c.corrected}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{c.explanation}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              <div style={{ background: '#fffbeb', borderRadius: 14, padding: 18, marginBottom: 12, border: '1px solid rgba(201,147,59,0.2)' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#92400e', marginBottom: 10 }}>Советы</div>
                {feedback.suggestions.map((s, i) => <div key={i} style={{ fontSize: 13, color: '#78350f', marginBottom: 6 }}>{i + 1}. {s}</div>)}
              </div>

              {/* Improved intro */}
              {feedback.improved_intro && (
                <div style={{ background: '#f8fafc', borderRadius: 14, padding: 18, border: '1px solid rgba(27,143,196,0.1)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#1B3A6B', marginBottom: 8 }}>Улучшенное вступление</div>
                  <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.7, fontStyle: 'italic' }}>{feedback.improved_intro}</div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
