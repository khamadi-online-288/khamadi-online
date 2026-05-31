'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import { checkWriting } from '@/lib/english/checkWriting'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { useZkuLang } from '../../zku-lang'
import { IcMail, IcEdit, IcBookOpen, IcStar, IcPalette, IcCheck, IcAlertTri } from '../../_icons'

const NAVY = '#003876'
const MUTED = '#64748B'

interface WritingTask {
  id: string; type: string; title: string; prompt: string
  word_min: number; word_max: number
  structure_hints: string[]; phrase_bank: string[]
}

const TASKS_BY_TYPE: Record<string, WritingTask> = {
  email: {
    id: 'email-1', type: 'email', title: 'Email to professor',
    prompt: 'Write an email to your professor requesting an exam retake. Explain why you missed it and suggest a convenient time.',
    word_min: 100, word_max: 150,
    structure_hints: ['Greeting', 'Reason for writing', 'Specific request', 'Suggested time', 'Closing'],
    phrase_bank: ['Dear Professor [Name]','I am writing to request','Due to [reason]','I was unable to attend','Would it be possible to','I would be grateful if','Please let me know','I look forward to hearing from you','Thank you for your understanding','Best regards'],
  },
  essay: {
    id: 'essay-1', type: 'essay', title: 'Technology in Education',
    prompt: 'Write an essay about the impact of technology on modern education. Discuss both advantages and disadvantages. Give examples from your experience.',
    word_min: 200, word_max: 280,
    structure_hints: ['Introduction + thesis', 'Advantages (2-3 points)', 'Disadvantages (1-2 points)', 'Your opinion', 'Conclusion'],
    phrase_bank: ['In recent years','It is widely believed that','On the one hand','On the other hand','For instance','Furthermore','However','In conclusion','To sum up','This suggests that'],
  },
  letter: {
    id: 'letter-1', type: 'letter', title: 'Letter to a Friend',
    prompt: 'Write a letter to your English-speaking friend telling them about your university life. Describe your studies, friends, and free time activities.',
    word_min: 120, word_max: 180,
    structure_hints: ['Greeting + how are you', 'University & studies', 'Friends & campus life', 'Free time', 'Invitation or closing'],
    phrase_bank: ['How have you been?','I am doing well','Things have been busy','I wanted to tell you about','The best part is','I have been enjoying','What about you?','Write back soon','Looking forward to your reply','Take care'],
  },
  story: {
    id: 'story-1', type: 'story', title: 'An Unexpected Event',
    prompt: 'Write a short story about an unexpected event that changed your day. Use vivid descriptions and dialogue.',
    word_min: 150, word_max: 220,
    structure_hints: ['Setting the scene', 'The unexpected event', 'Your reaction', 'What happened next', 'How it ended'],
    phrase_bank: ['It was an ordinary day when','All of a sudden','I could not believe my eyes','Without hesitation','As soon as','By the time','It turned out that','Looking back','I will never forget','From that day on'],
  },
  review: {
    id: 'review-1', type: 'review', title: 'Review a Movie or Book',
    prompt: 'Write a review of a movie or book you recently watched or read. Include a brief summary, what you liked, and your recommendation.',
    word_min: 120, word_max: 180,
    structure_hints: ['Title + genre + brief summary', 'What you liked', 'What could be better', 'Who you recommend it to', 'Final rating'],
    phrase_bank: ['The story follows','The main character','What I found impressive was','The plot was','I particularly enjoyed','One weakness is','I would recommend this to','Overall I give it','It is worth watching/reading','Highly recommended'],
  },
  description: {
    id: 'desc-1', type: 'description', title: 'Describe a Place',
    prompt: 'Describe a place that is special to you — it could be your hometown, a favourite café, or a travel destination. Make the reader feel like they are there.',
    word_min: 130, word_max: 190,
    structure_hints: ['Introduction — where and why special', 'Physical description (sights, sounds, smells)', 'The atmosphere / feeling', 'A specific memory there', 'Why you recommend visiting'],
    phrase_bank: ['Nestled in','As you approach','The air is filled with','You can hear','The most striking feature is','It has a unique atmosphere','One of my favourite memories','I always feel','Whether you visit in summer or winter','It is a place you will never forget'],
  },
}

const TYPE_META: Record<string, { icon: React.ReactElement; name: string; color: string; bg: string }> = {
  email:       { icon: <IcMail     size={22} color="#1B8FC4" />, name: 'Email',       color: '#1B8FC4', bg: '#E6F1FB' },
  essay:       { icon: <IcEdit     size={22} color="#534AB7" />, name: 'Essay',       color: '#534AB7', bg: '#EDEAFD' },
  letter:      { icon: <IcMail     size={22} color="#1D9E75" />, name: 'Letter',      color: '#1D9E75', bg: '#E8F8F3' },
  story:       { icon: <IcBookOpen size={22} color="#EF9F27" />, name: 'Story',       color: '#EF9F27', bg: '#FEF3E0' },
  review:      { icon: <IcStar     size={22} color="#D85A30" />, name: 'Review',      color: '#D85A30', bg: '#FDEBE6' },
  description: { icon: <IcPalette  size={22} color="#0F766E" />, name: 'Description', color: '#0F766E', bg: '#CCFBF1' },
}

export default function WritingTrainerPage({ params }: { params: Promise<{ type: string }> }) {
  const { type }   = use(params)
  const { t }      = useZkuLang()
  const typeInfo   = TYPE_META[type] ?? TYPE_META['email']
  const task       = TASKS_BY_TYPE[type] ?? TASKS_BY_TYPE['email']

  const [text, setText]           = useState('')
  const [result, setResult]       = useState<ReturnType<typeof checkWriting> | null>(null)
  const [saved, setSaved]         = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving]       = useState(false)

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length

  function insertPhrase(phrase: string) {
    setText(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + phrase + ' ')
  }

  function handleCheck() {
    setResult(checkWriting(text, task))
  }

  async function handleSave() {
    if (!text.trim() || saving) return
    setSaving(true)
    const checked = result ?? checkWriting(text, task)
    setResult(checked)
    try {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) { setSaving(false); return }

      const xpEarned = Math.round((checked.score / 100) * 50) // up to 50 XP for writing
      const lessonId = `writing-${type}-${Date.now()}`

      await supabase.from('english_lesson_progress').insert({
        user_id:      user.id,
        lesson_id:    lessonId,
        lesson_type:  'writing',
        lesson_title: `${typeInfo.name}: ${task.title}`,
        completed:    true,
        score:        checked.score,
        xp_earned:    xpEarned,
        completed_at: new Date().toISOString(),
      })

      // Update XP in profile
      const { data: profile } = await supabase
        .from('english_user_profiles')
        .select('total_xp, last_active_at, current_streak, longest_streak')
        .eq('user_id', user.id).maybeSingle()
      const now = new Date()
      const lastActive = profile?.last_active_at ? new Date(profile.last_active_at) : null
      const isNewDay = !lastActive || now.toDateString() !== lastActive.toDateString()
      const newStreak = isNewDay ? (profile?.current_streak ?? 0) + 1 : (profile?.current_streak ?? 1)
      await supabase.from('english_user_profiles').upsert({
        user_id: user.id,
        total_xp: (profile?.total_xp ?? 0) + xpEarned,
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, profile?.longest_streak ?? 0),
        last_active_at: now.toISOString(),
      }, { onConflict: 'user_id' })

      setSaved(true)
    } catch { /* silent */ }
    setSaving(false)
  }

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1100, margin: '0 auto', fontFamily: "'Montserrat', sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <Link href="/english/zku/student/writing-coach" style={{ fontSize: 13, color: MUTED, textDecoration: 'none', fontWeight: 600 }}>
          {t.common.back}
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: typeInfo.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{typeInfo.icon}</div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: NAVY, lineHeight: 1.1 }}>{typeInfo.name}</h1>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>

        {/* ── LEFT: Task panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Prompt */}
          <div style={{ background: '#fff', borderRadius: 18, padding: '20px', border: '1px solid rgba(0,56,118,0.08)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              {t.writing.task_label}
            </p>
            <p style={{ fontSize: 14, color: NAVY, fontWeight: 600, lineHeight: 1.65, marginBottom: 14 }}>{task.prompt}</p>
            <span style={{ background: '#EBF0F8', color: NAVY, padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
              {task.word_min}–{task.word_max} {t.writing.words}
            </span>
          </div>

          {/* Structure hints */}
          <div style={{ background: '#fff', borderRadius: 18, padding: '20px', border: '1px solid rgba(0,56,118,0.08)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              {t.writing.structure_label}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {task.structure_hints.map((hint, i) => (
                <div key={hint} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: NAVY, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 900, flexShrink: 0,
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 13, color: NAVY, fontWeight: 500 }}>{hint}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phrase bank */}
          <div style={{ background: '#fff', borderRadius: 18, padding: '20px', border: '1px solid rgba(0,56,118,0.08)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              {t.writing.phrase_label} {t.writing.phrase_hint}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {task.phrase_bank.map(phrase => (
                <button key={phrase} onClick={() => insertPhrase(phrase)} style={{
                  textAlign: 'left', padding: '8px 12px', borderRadius: 8,
                  border: '1.5px solid rgba(0,56,118,0.12)',
                  background: '#F4F7FB', color: NAVY, fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget).style.background = '#EBF0F8'; (e.currentTarget).style.borderColor = NAVY }}
                onMouseLeave={e => { (e.currentTarget).style.background = '#F4F7FB'; (e.currentTarget).style.borderColor = 'rgba(0,56,118,0.12)' }}>
                  {phrase}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Editor ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Textarea */}
          <div style={{ background: '#fff', borderRadius: 18, padding: '20px', border: '1px solid rgba(0,56,118,0.08)', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {t.writing.your_text}
              </p>
              <span style={{
                fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                background: wordCount >= task.word_min && wordCount <= task.word_max ? '#E8F8F3' : wordCount > 0 ? '#FEF3E0' : '#F1F5F9',
                color: wordCount >= task.word_min && wordCount <= task.word_max ? '#1D9E75' : wordCount > 0 ? '#EF9F27' : '#94A3B8',
              }}>
                {wordCount} / {task.word_min}–{task.word_max} {t.writing.words}
              </span>
            </div>

            <textarea
              value={text}
              onChange={e => { setText(e.target.value); setResult(null) }}
              placeholder='Dear Professor...'
              style={{
                width: '100%', minHeight: 320, padding: '16px',
                borderRadius: 12, border: '1.5px solid rgba(0,56,118,0.15)',
                fontSize: 14, lineHeight: 1.75, fontFamily: "'Montserrat', sans-serif",
                color: NAVY, background: '#FAFBFD', resize: 'vertical',
                outline: 'none', boxSizing: 'border-box',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = NAVY; e.currentTarget.style.background = '#fff' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,56,118,0.15)'; e.currentTarget.style.background = '#FAFBFD' }}
            />
          </div>

          {/* Result */}
          {result && (
            <div style={{
              background: '#fff', borderRadius: 18, padding: '20px',
              border: `1.5px solid ${result.score >= 75 ? '#1D9E75' : '#EF9F27'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <p style={{ fontWeight: 800, color: NAVY, fontSize: 15 }}>
                  {result.score >= 75 ? t.writing.result_good : t.writing.result_almost}
                </p>
                <span style={{ fontSize: 22, fontWeight: 900, color: result.score >= 75 ? '#1D9E75' : '#EF9F27' }}>
                  {result.score}%
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                {[
                  { label: t.writing.check_volume,   ok: result.word_count_ok },
                  { label: t.writing.check_greeting,  ok: result.has_greeting },
                  { label: t.writing.check_closing,   ok: result.has_closing },
                  { label: t.writing.check_phrases,   ok: result.phrases_used >= 2 },
                ].map(c => (
                  <div key={c.label} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 12px', borderRadius: 10,
                    background: c.ok ? '#E8F8F3' : '#FEF3E0',
                  }}>
                    <span style={{ display: 'flex' }}>{c.ok ? <IcCheck size={14} color="#1D9E75" /> : <IcAlertTri size={14} color="#EF9F27" />}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: c.ok ? '#1D9E75' : '#EF9F27' }}>{c.label}</span>
                  </div>
                ))}
              </div>

              {result.feedback.length > 0 && (
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: MUTED, marginBottom: 8 }}>{t.writing.tips_label}</p>
                  {result.feedback.map(f => (
                    <p key={f} style={{ fontSize: 13, color: '#475569', marginBottom: 4 }}>• {f}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleCheck} disabled={!text.trim()} style={{
              flex: 1, padding: '13px', borderRadius: 12, border: 'none',
              background: text.trim() ? NAVY : '#94A3B8',
              color: '#fff', fontWeight: 800, fontSize: 14,
              cursor: text.trim() ? 'pointer' : 'not-allowed',
              boxShadow: text.trim() ? '0 4px 14px rgba(0,56,118,0.3)' : 'none',
              fontFamily: 'inherit',
            }}>
              {t.writing.check}
            </button>
            <button onClick={handleSave} disabled={!text.trim() || saved || saving} style={{
              flex: 1, padding: '13px', borderRadius: 12, border: `1.5px solid rgba(0,56,118,0.2)`,
              background: saved ? '#E8F8F3' : '#fff', color: saved ? '#1D9E75' : NAVY,
              fontWeight: 700, fontSize: 14, cursor: (saved || saving) ? 'default' : 'pointer', fontFamily: 'inherit',
              opacity: (!text.trim()) ? 0.5 : 1,
            }}>
              {saving ? '...' : saved ? t.writing.saved : t.writing.save}
            </button>
            <button onClick={() => setSubmitted(true)} style={{
              flex: 1, padding: '13px', borderRadius: 12, border: 'none',
              background: submitted ? '#E8F8F3' : '#1D9E75',
              color: submitted ? '#1D9E75' : '#fff',
              fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {submitted ? t.writing.submitted : t.writing.submit}
            </button>
          </div>

          {submitted && (
            <div style={{ padding: '14px 18px', borderRadius: 12, background: '#E8F8F3', border: '1px solid #1D9E75', textAlign: 'center' }}>
              <p style={{ fontWeight: 700, color: '#1D9E75', fontSize: 14 }}>{t.writing.sent_msg}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}