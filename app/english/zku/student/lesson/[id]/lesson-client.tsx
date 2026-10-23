'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useZkuLang } from '../../zku-lang'
import { IcCheck, IcX, IcBookOpen, IcBook, IcEdit, IcHeadphones, IcTarget, IcAward, IcStar, IcArrowRight, IcVolume } from '../../_icons'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { minutesSince, writeLessonProgress } from '@/lib/english/lesson-time'
import { useTTSSingle, useTTSDialogue } from '@/lib/english/useTTS'
import { certByLesson, certPath, examComplete } from '@/lib/english/zku-level-certs'
import { syncLevelFromProgress } from '@/lib/english/level-progress'
import type { FullLesson, Phase, QCat, QType, WritingLine } from '@/lib/english/zku-lessons/types'

// ── Colors ─────────────────────────────────────────────────────
const N  = '#003876'
const G  = '#C9933B'
const T  = '#1D9E75'
const S  = '#1B8FC4'

const MU = '#64748B'


// ── Writing template tokenizer ──────────────────────────────────
// A writing-template line is `prefix` + <primary blank> + `suffix`, but the
// prefix/suffix themselves may contain extra `___` markers that must each
// become their own input field (previously they were shown as plain text).
type WToken = { t: 'text'; v: string } | { t: 'blank'; key: string; ph: string }

function buildWritingTokens(line: WritingLine): WToken[] {
  const prefix = line.prefix ?? ''
  const suffix = line.suffix ?? ''
  const hasSuffix = suffix.length > 0
  // Keep the implied junction blank unless every blank already lives inside the
  // prefix (a line with `___` in the prefix and no suffix).
  const includePrimary = hasSuffix || !prefix.includes('___')

  const prefixBlanks = (prefix.match(/___/g) ?? []).length
  const suffixBlanks = (suffix.match(/___/g) ?? []).length
  const blankCount = prefixBlanks + (includePrimary ? 1 : 0) + suffixBlanks
  // "start time ... finish time" is two placeholders when the line has two blanks.
  const phParts = (line.placeholder || '').split(/\s*\.\.\.\s*/).map(part => part.trim()).filter(Boolean)
  const splitPlaceholders = blankCount > 1 && phParts.length > 1

  const tokens: WToken[] = []
  let phIndex = 0
  const mkBlank = (key: string): WToken => {
    const ph = splitPlaceholders
      ? (phParts[phIndex] ?? '…')
      : (phIndex === 0 ? (line.placeholder || '…') : '…')
    phIndex++
    return { t: 'blank', key, ph }
  }

  const pParts = prefix.split('___')
  pParts.forEach((part, i) => {
    if (part) tokens.push({ t: 'text', v: part })
    if (i < pParts.length - 1) tokens.push(mkBlank(`${line.key}#p${i}`))
  })

  if (includePrimary) tokens.push(mkBlank(line.key))

  const sParts = suffix.split('___')
  sParts.forEach((part, i) => {
    if (part) tokens.push({ t: 'text', v: part })
    if (i < sParts.length - 1) tokens.push(mkBlank(`${line.key}#s${i}`))
  })

  return tokens
}

function writingBlankKeys(lines: WritingLine[]): string[] {
  return lines.flatMap(l => buildWritingTokens(l).filter((tk): tk is Extract<WToken, { t: 'blank' }> => tk.t === 'blank').map(tk => tk.key))
}

function normalizeAnswer(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[.,!?;:]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Gap drills ask for the missing words, but a correct full sentence is the same answer. */
function fillAnswerMatches(userRaw: string, correctRaw: string, prompt: string): boolean {
  const user = normalizeAnswer(userRaw)
  const correct = normalizeAnswer(correctRaw)
  if (!user || !correct) return false
  if (user === correct) return true
  if ((prompt.match(/___/g) ?? []).length !== 1) return false

  const parts = prompt.split('→')
  const withBlank = parts.filter(part => part.includes('___'))
  const clause = (withBlank.length > 0 ? withBlank[withBlank.length - 1] : prompt)
    .replace(/\s*\([^)]*\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const expected = normalizeAnswer(clause.replace('___', ` ${correctRaw} `))
  if (expected.length >= 8 && (user === expected || user.includes(expected))) return true

  const [beforeRaw, afterRaw = ''] = clause.split('___')
  const before = normalizeAnswer(beforeRaw)
  const after = normalizeAnswer(afterRaw)

  // Contraction gaps: the answer key often folds the preceding word into the
  // answer (gap after "She" → "she's"). Typing just the gap "'s" must also pass.
  const lastBefore = before.split(' ').filter(Boolean).pop() ?? ''
  if (lastBefore && (normalizeAnswer(lastBefore + user) === correct || normalizeAnswer(`${lastBefore} ${user}`) === correct)) return true

  let rest = user
  if (before && (rest === before || rest.startsWith(`${before} `))) rest = rest.slice(before.length).trim()
  if (after && (rest === after || rest.endsWith(` ${after}`))) rest = rest.slice(0, rest.length - after.length).trim()
  return rest === correct
}

function answersMatch(item: { type?: string; correct: string; text?: string }, raw: string): boolean {
  if (item.type === 'fill') return fillAnswerMatches(raw, item.correct, item.text ?? '')
  return raw.trim().toLowerCase() === item.correct.trim().toLowerCase()
}


// ── Step config ─────────────────────────────────────────────────
const READING_STEPS: { key: Phase; label: string; icon: React.ReactElement }[] = [
  { key: 'reading',  label: 'Reading',  icon: <IcBookOpen size={14} color="currentColor" /> },
]
const GRAMMAR_STEPS: { key: Phase; label: string; icon: React.ReactElement }[] = [
  { key: 'grammar',  label: 'Theory',   icon: <IcEdit    size={14} color="currentColor" /> },
  { key: 'practice', label: 'Practice', icon: <IcTarget  size={14} color="currentColor" /> },
]

// ── Main component ──────────────────────────────────────────────

export default function LessonClient({ id, lesson }: { id: string; lesson: FullLesson }) {
  const { t }  = useZkuLang()
  const isReading = lesson.paragraphs.length > 0

  const [phase,      setPhase]     = useState<Phase>(isReading ? 'reading' : 'grammar')
  const [vocabIdx,   setVocabIdx]  = useState(0)
  const [flipped,    setFlipped]   = useState(false)
  const [qIdx,       setQIdx]      = useState(0)
  const [answers,    setAnswers]   = useState<Record<string, string>>({})
  const [checked,    setChecked]   = useState(false)
  const [fillVal,    setFillVal]   = useState('')
  const [exIdx,      setExIdx]     = useState(0)
  const [exAnswer,   setExAnswer]  = useState('')
  const [exChecked,  setExChecked] = useState(false)
  const [exFill,     setExFill]    = useState('')
  const [exScore,    setExScore]   = useState(0)
  // reading sub-steps: 0=prep, 1=text, 2=task1, 3=task2
  const [readStep,   setReadStep]  = useState(0)
  const [prepAnswers, setPrepAnswers] = useState<Record<string,string>>({})
  const [prepChecked, setPrepChecked] = useState(false)
  const [t1Answers,  setT1Answers] = useState<Record<string,string>>({})
  const [t1Active,   setT1Active]  = useState<string|null>(null)
  const [t1Checked,  setT1Checked] = useState(false)
  const [t2Answers,  setT2Answers] = useState<Record<string,string>>({})
  const [t2Checked,  setT2Checked] = useState(false)
  // listening sub-steps: 0=prep, 1=listen, 2=task1, 3=task2
  const [lisStep,    setLisStep]   = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)
  // TTS hooks
  const ttsRead = useTTSSingle()
  const ttsDial = useTTSDialogue(lesson.dialogue ?? [])
  const ttsVocab = useTTSSingle()
  // aliases for legacy code
  const isPlaying = ttsDial.playing
  const hasPlayed = ttsDial.hasPlayed
  const [lisT1Ans,   setLisT1Ans]  = useState<Record<string,string>>({})
  const [lisT1Done,  setLisT1Done] = useState(false)
  const [lisT2Ans,   setLisT2Ans]  = useState<Record<string,string>>({})
  const [lisT2Done,  setLisT2Done] = useState(false)
  const [lisT2Idx,   setLisT2Idx]  = useState(0)
  // grammar sub-steps: 0=hook, 1=rule, 2=table, 3=extra, 4=tip
  const [gramStep,   setGramStep]  = useState(0)
  // writing sub-steps: 0=prep, 1=model, 2=write
  const [writStep,   setWritStep]  = useState(0)
  const [writFields, setWritFields] = useState<Record<string,string>>({})
  const [writSubmitted, setWritSubmitted] = useState(false)
  // quiz state
  const [qzIdx,      setQzIdx]     = useState(0)
  const [qzAnswer,   setQzAnswer]  = useState('')
  const [qzFill,     setQzFill]    = useState('')
  const [qzChecked,  setQzChecked] = useState(false)
  const [qzStreak,   setQzStreak]  = useState(0)
  const [qzMaxStreak,setQzMaxStreak] = useState(0)
  const [qzXP,       setQzXP]      = useState(0)
  const [qzResults,  setQzResults] = useState<{ id: string; correct: boolean; earned: number }[]>([])
  const [qzDone,     setQzDone]    = useState(false)
  const [showXpAnim, setShowXpAnim] = useState(false)
  const [xpAnimVal,  setXpAnimVal]  = useState(0)
  const [certHref,   setCertHref]   = useState<string | null>(null)

  // Listening finishes via lisStep, not phase — promote to 'done' so saveProgress runs
  useEffect(() => {
    if (lesson.type !== 'listening') return
    if (lisStep !== 3) return
    if (lisT2Idx < lesson.listenStatements.length) return
    if (phase === 'done') return
    setPhase('done')
  }, [lesson.type, lesson.listenStatements.length, lisStep, lisT2Idx, phase])

  // Writing finishes via writSubmitted, not phase — promote to 'done' so saveProgress runs
  useEffect(() => {
    if (lesson.type !== 'writing') return
    if (!writSubmitted) return
    if (phase === 'done') return
    setPhase('done')
  }, [lesson.type, writSubmitted, phase])

  // ── Save lesson completion when phase reaches 'done' ──────────
  const startedAtRef = useRef(Date.now())
  const savedRef = useRef(false)
  useEffect(() => {
    if (phase !== 'done' || savedRef.current) return
    savedRef.current = true
    async function saveProgress() {
      try {
        const supabase = createEnglishClient()
        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user
        if (!user) return

        // Check if already completed (avoid double XP)
        const { data: existing } = await supabase
          .from('english_lesson_progress')
          .select('completed, xp_earned')
          .eq('user_id', user.id)
          .eq('lesson_id', id)
          .maybeSingle()

        const alreadyDone = existing?.completed === true

        // Compute score from answers
        const total = lesson.questions?.length ?? 0
        const computedScore = total > 0
          ? Math.round(lesson.questions.filter(q =>
              answersMatch(q, answers[q.id] ?? '')
            ).length / total * 100)
          : 80 // default for non-test lessons

        // Save progress record
        await writeLessonProgress(supabase, {
          user_id:         user.id,
          lesson_id:       id,
          lesson_type:     lesson.type,
          lesson_title:    lesson.title,
          completed:       true,
          score:           computedScore,
          xp_earned:       lesson.xp,
          completed_at:    new Date().toISOString(),
          time_spent_min:  minutesSince(startedAtRef.current),
        }, 'upsert')

        // Only update XP and streak if this is first completion
        if (!alreadyDone) {
          const { data: profile } = await supabase
            .from('english_user_profiles')
            .select('total_xp, current_streak, longest_streak, last_active_at')
            .eq('user_id', user.id)
            .maybeSingle()

          const now = new Date()
          const lastActive = profile?.last_active_at ? new Date(profile.last_active_at) : null
          const isNewDay = !lastActive || now.toDateString() !== lastActive.toDateString()
          const newStreak = isNewDay ? (profile?.current_streak ?? 0) + 1 : (profile?.current_streak ?? 1)
          const newXp = (profile?.total_xp ?? 0) + lesson.xp
          const newLongest = Math.max(newStreak, profile?.longest_streak ?? 0)

          await supabase.from('english_user_profiles').upsert({
            user_id:        user.id,
            total_xp:       newXp,
            current_streak: newStreak,
            longest_streak: newLongest,
            last_active_at: now.toISOString(),
          }, { onConflict: 'user_id' })

          // Show XP animation
          setXpAnimVal(lesson.xp)
          setShowXpAnim(true)
          setTimeout(() => setShowXpAnim(false), 3000)
        }

        // Advance current_level when a final-exam part is completed.
        if (certByLesson(id)) {
          await syncLevelFromProgress(supabase, user.id, id)
        }
      } catch { /* silent — don't block UI */ }
    }
    saveProgress()
  }, [phase, id, lesson, answers])

  // ── Save quiz/test completion when qzDone becomes true ───────────
  const qzSavedRef = useRef(false)
  useEffect(() => {
    if (!qzDone || qzSavedRef.current || lesson.type !== 'test') return
    qzSavedRef.current = true
    async function saveQuizProgress() {
      try {
        const supabase = createEnglishClient()
        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user
        if (!user) return

        const { data: existing } = await supabase
          .from('english_lesson_progress')
          .select('completed, xp_earned')
          .eq('user_id', user.id)
          .eq('lesson_id', id)
          .maybeSingle()

        const alreadyDone = existing?.completed === true
        const total = lesson.questions?.length ?? 0
        const correct = qzResults.filter(r => r.correct).length
        const computedScore = total > 0 ? Math.round(correct / total * 100) : 0
        const xpEarned = Math.max(qzXP, 0)

        await writeLessonProgress(supabase, {
          user_id:        user.id,
          lesson_id:      id,
          lesson_type:    'test',
          lesson_title:   lesson.title,
          completed:      true,
          score:          computedScore,
          xp_earned:      xpEarned,
          completed_at:   new Date().toISOString(),
          time_spent_min: minutesSince(startedAtRef.current),
        }, 'upsert')

        if (!alreadyDone) {
          const { data: profile } = await supabase
            .from('english_user_profiles')
            .select('total_xp, current_streak, longest_streak, last_active_at')
            .eq('user_id', user.id)
            .maybeSingle()

          const now = new Date()
          const lastActive = profile?.last_active_at ? new Date(profile.last_active_at) : null
          const isNewDay = !lastActive || now.toDateString() !== lastActive.toDateString()
          const newStreak = isNewDay ? (profile?.current_streak ?? 0) + 1 : (profile?.current_streak ?? 1)
          const newXp = (profile?.total_xp ?? 0) + xpEarned
          const newLongest = Math.max(newStreak, profile?.longest_streak ?? 0)

          await supabase.from('english_user_profiles').upsert({
            user_id:        user.id,
            total_xp:       newXp,
            current_streak: newStreak,
            longest_streak: newLongest,
            last_active_at: now.toISOString(),
          }, { onConflict: 'user_id' })
        }

        // Advance current_level when the final-exam test is completed.
        if (certByLesson(id)) {
          await syncLevelFromProgress(supabase, user.id, id)
        }
      } catch { /* silent */ }
    }
    saveQuizProgress()
  }, [qzDone, id, lesson, qzResults, qzXP])

  // Show the level certificate once every part of the final exam is done
  useEffect(() => {
    const exam = certByLesson(id)
    if (!exam) return
    if (phase !== 'done' && !qzDone) return
    const href = certPath(exam)
    let cancelled = false
    async function checkCert() {
      try {
        const supabase = createEnglishClient()
        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user
        if (!user || cancelled) return
        const { data } = await supabase
          .from('english_lesson_progress')
          .select('lesson_id')
          .eq('user_id', user.id)
          .eq('completed', true)
          .in('lesson_id', exam.lessons)
        if (cancelled) return
        const done = new Set((data ?? []).map(row => (row as { lesson_id: string }).lesson_id))
        done.add(id)
        if (examComplete(exam, done)) setCertHref(href)
      } catch { /* silent */ }
    }
    checkCert()
    return () => { cancelled = true }
  }, [phase, qzDone, id])

  function renderLevelCert() {
    if (!certHref) return null
    return (
      <Link href={certHref} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '14px', borderRadius: 12, textDecoration: 'none', marginBottom: 10,
        background: 'linear-gradient(135deg, #C9933B, #8B6427)', color: '#fff',
        fontSize: 14, fontWeight: 800, boxShadow: '0 6px 20px rgba(201,147,59,0.35)',
      }}>
        🎓 {t.certs.completion_cert}
      </Link>
    )
  }

  const GRAMMAR_ORDER: Phase[] = ['grammar', 'practice', 'done']
  const READING_ORDER: Phase[] = ['reading', 'done']

  function nextPhase() {
    const order = isReading ? READING_ORDER : GRAMMAR_ORDER
    const cur = order.indexOf(phase)
    if (cur < order.length - 1) {
      setPhase(order[cur + 1])
      setExIdx(0); setExAnswer(''); setExChecked(false)
      setVocabIdx(0); setFlipped(false)
    }
  }

  const q       = lesson.questions[qIdx]
  const total   = lesson.questions.length
  const answer  = answers[q?.id ?? ''] ?? ''
  const correct = checked && !!q && answersMatch(q, answer)

  const score = total > 0
    ? Math.round(lesson.questions.filter(q => answersMatch(q, answers[q.id] ?? '')).length / total * 100)
    : 0

  // ── Navigation helpers ───────────────────────────────────────────
  function getModuleUrl(): string {
    const n = parseInt(id.split('-')[0].replace('l', ''))
    const mn = lesson.moduleNum
    if (n <= 16)  return `/english/zku/student/module/m-${mn}`
    if (n <= 34)  return `/english/zku/student/module/m-a11-${mn}`
    if (n <= 58)  return `/english/zku/student/module/m-a2-${mn}`
    return `/english/zku/student/module/m-b1-${mn}`
  }
  function getCourseUrl(): string {
    const n = parseInt(id.split('-')[0].replace('l', ''))
    if (n <= 16)  return `/english/zku/student/course/a1`
    if (n <= 34)  return `/english/zku/student/course/a11`
    if (n <= 58)  return `/english/zku/student/course/a2`
    return `/english/zku/student/course/b1`
  }
  const moduleUrl = getModuleUrl()
  const courseUrl = getCourseUrl()

  function select(opt: string) { if (!checked) setAnswers(p => ({ ...p, [q.id]: opt })) }
  function check() {
    const val = q.type === 'fill' ? fillVal.trim() : answer
    if (!val) return
    setAnswers(p => ({ ...p, [q.id]: val }))
    setChecked(true)
  }
  function next() {
    setChecked(false); setFillVal('')
    if (qIdx + 1 < total) setQIdx(i => i + 1)
    else nextPhase()
  }

  // ── Shared header (called as function, not component) ────────
  function renderHeader() {
    const readingSteps = [{ key: 'reading' as Phase,  label: t.lesson.step_text,     icon: <IcBookOpen size={14} color="currentColor" /> }]
    const grammarSteps = [
      { key: 'grammar'  as Phase, label: t.lesson.step_theory,    icon: <IcEdit   size={14} color="currentColor" /> },
      { key: 'practice' as Phase, label: t.lesson.step_practice,  icon: <IcTarget size={14} color="currentColor" /> },
    ]
    const steps      = isReading ? readingSteps : grammarSteps
    const order      = isReading ? READING_ORDER : GRAMMAR_ORDER
    const phaseI     = order.indexOf(phase)
    const visibleSteps = steps
    return (
      <div style={{
        background: '#fff', borderBottom: '1px solid rgba(0,56,118,0.08)',
        padding: '0 24px', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, height: 60 }}>
          <Link href={moduleUrl} style={{ color: MU, textDecoration: 'none', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
            ← {t.lesson.back}
          </Link>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
            {visibleSteps.map((s, i) => {
              const stepPhI = order.indexOf(s.key)
              const isDone  = phaseI > stepPhI
              const isAct   = phase === s.key
              return (
                <React.Fragment key={s.key}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    fontSize: 11, fontWeight: isDone ? 600 : isAct ? 800 : 500,
                    color: isDone ? T : isAct ? N : '#94A3B8',
                    padding: '4px 10px', borderRadius: 8,
                    background: isAct ? '#EEF2F7' : 'transparent',
                    border: isAct ? '1px solid rgba(0,56,118,0.15)' : '1px solid transparent',
                  }}>
                    {isDone ? <IcCheck size={13} color={T} /> : s.icon}
                    <span>{s.key === 'grammar' ? t.lesson.step_theory : s.key === 'practice' ? t.lesson.step_practice : s.label}</span>
                  </div>
                  {i < visibleSteps.length - 1 && (
                    <div style={{ width: 16, height: 1, background: isDone ? T : '#E2E8F0' }} />
                  )}
                </React.Fragment>
              )
            })}
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: G, flexShrink: 0 }}>+{lesson.xp} XP</div>
        </div>
      </div>
    )
  }

  // ── READING phase ─────────────────────────────────────────────
  if (phase === 'reading') {
    const STEPS_READ = [t.lesson.step_prep, t.lesson.step_text, t.lesson.step_task1, t.lesson.step_task2]
    const hasTasks = lesson.prepTasks.length > 0

    // ── Step 0: Preparation ──────────────────────────────────────
    if (readStep === 0 && hasTasks) {
      const allAnswered = lesson.prepTasks.every(p => prepAnswers[p.id])
      const correctCount = lesson.prepTasks.filter(p => prepAnswers[p.id] === p.correct).length
      return (
        <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif" }}>
          {renderHeader()}
          <div className="zku-lesson-pad" style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px 56px' }}>

            {/* Step breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
              {STEPS_READ.map((s, i) => (
                <React.Fragment key={s}>
                  <span style={{ fontSize: 11, fontWeight: i === 0 ? 800 : 500, color: i === 0 ? N : i < readStep ? T : '#94A3B8' }}>{s}</span>
                  {i < STEPS_READ.length - 1 && <span style={{ color: '#CBD5E1', fontSize: 10 }}>›</span>}
                </React.Fragment>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,56,118,0.08)', border: '1px solid rgba(0,56,118,0.07)', marginBottom: 12 }}>
              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${N}, #1B5FBF)`, padding: '20px 28px', color: '#fff' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>{t.lesson.step_prep} · Module {lesson.moduleNum} Lesson {lesson.lessonNum}</div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>{t.lesson.prep_title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{lesson.prepTasks.length - Object.keys(prepAnswers).length} {t.lesson.prep_remaining}</div>
              </div>

              {/* Prep tasks */}
              <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {lesson.prepTasks.map(p => {
                  const answered = prepAnswers[p.id]
                  const isCorr = prepChecked && answered === p.correct
                  const isWrong = prepChecked && answered && answered !== p.correct
                  return (
                    <div key={p.id} style={{ borderRadius: 12, border: `1.5px solid ${isCorr ? T : isWrong ? '#EF4444' : answered ? S : 'rgba(0,56,118,0.12)'}`, overflow: 'hidden', background: isCorr ? '#F0FDF4' : isWrong ? '#FEF2F2' : '#fff' }}>
                      <div style={{ padding: '10px 16px', background: 'rgba(0,56,118,0.03)', borderBottom: '1px solid rgba(0,56,118,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 20 }}>{p.emoji}</span>
                        <span style={{ fontSize: 15, fontWeight: 900, color: N }}>{p.word}</span>
                        {isCorr && <IcCheck size={16} color={T} />}
                        {isWrong && <><IcX size={16} color="#EF4444" /><span style={{ fontSize: 11, color: '#EF4444', marginLeft: 4 }}>→ {p.correct}</span></>}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '12px 16px' }}>
                        {p.opts.map(opt => (
                          <button key={opt} onClick={() => !prepChecked && setPrepAnswers(a => ({ ...a, [p.id]: opt }))} style={{
                            padding: '7px 16px', borderRadius: 99, fontSize: 12, fontWeight: 600,
                            cursor: prepChecked ? 'default' : 'pointer', fontFamily: 'inherit',
                            border: `1.5px solid ${answered === opt ? S : 'rgba(0,56,118,0.12)'}`,
                            background: prepChecked && answered === opt && isCorr ? T : prepChecked && answered === opt ? '#EF4444' : answered === opt ? '#EFF6FF' : '#F8FBFF',
                            color: prepChecked && answered === opt ? '#fff' : answered === opt ? N : '#475569',
                            transition: 'all 0.15s',
                          }}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {!prepChecked ? (
              <button onClick={() => setPrepChecked(true)} disabled={!allAnswered} style={{
                width: '100%', padding: '15px', borderRadius: 14, border: 'none',
                background: allAnswered ? S : '#E2E8F0', color: '#fff', fontSize: 14, fontWeight: 800,
                cursor: allAnswered ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
                boxShadow: allAnswered ? `0 4px 18px ${S}44` : 'none', transition: 'all 0.2s',
              }}>{t.lesson.check_btn}</button>
            ) : (
              <div>
                <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 12, padding: '12px 18px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <IcCheck size={16} color={T} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: T }}>{correctCount}/{lesson.prepTasks.length} correct — {correctCount === lesson.prepTasks.length ? t.lesson.perfect : t.lesson.good_try} {t.lesson.now_read}</span>
                </div>
                <button onClick={() => setReadStep(1)} style={{
                  width: '100%', padding: '15px', borderRadius: 14, border: 'none',
                  background: N, color: '#fff', fontSize: 14, fontWeight: 800,
                  cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 18px rgba(0,56,118,0.28)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  {t.lesson.continue_reading} <IcArrowRight size={16} color="#fff" />
                </button>
              </div>
            )}
          </div>
        </div>
      )
    }

    // ── Step 1: Reading text ─────────────────────────────────────
    if (readStep === 1 || (!hasTasks && readStep === 0)) return (
      <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif" }}>
        {renderHeader()}
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 0 56px' }}>

          {/* Hero with photo */}
          <div style={{ position: 'relative', overflow: 'hidden', minHeight: 280 }}>
            {/* Photo */}
            <img
              src={`/lessons/${lesson.id}.jpg`}
              alt={lesson.title}
              style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            {/* Gradient overlay — always shown, blends with photo or stands alone */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,28,70,0.95) 0%, rgba(0,28,70,0.55) 50%, rgba(0,28,70,0.15) 100%)',
            }} />
            {/* Text over photo */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 36px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
                Reading · {(() => { const n = parseInt(id.split('-')[0].replace('l','')); return n <= 16 ? 'A1' : n <= 34 ? 'A1.1' : n <= 58 ? 'A2' : 'B1'; })()} · Module {lesson.moduleNum} · Lesson {lesson.lessonNum}
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 10 }}>{lesson.title}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Introductions', 'University life', 'Describing people', 'Kazakhstan'].map(tag => (
                  <span key={tag} style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)' }}>{tag}</span>
                ))}
              </div>
            </div>
            {/* Fallback background when no photo */}
            <div style={{ position: 'absolute', inset: 0, zIndex: -1, background: `linear-gradient(160deg, ${N} 0%, #0F4B8C 60%, #1a6fc4 100%)` }} />
          </div>

          <div style={{ padding: '24px 32px 0' }}>
            {/* Reading card */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '28px 32px', boxShadow: '0 2px 12px rgba(0,56,118,0.06)', marginBottom: 14, border: '1px solid rgba(0,56,118,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: MU, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.lesson.read_carefully_label}</span>
                <button onClick={() => ttsRead.toggle(lesson.paragraphs.join(' '), 'nova')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: ttsRead.playing ? '#FEF3C7' : '#F0FDF4', border: `1px solid ${ttsRead.playing ? '#FCD34D' : '#86EFAC'}`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: ttsRead.playing ? '#D97706' : T, fontFamily: 'inherit' }}>
                  <IcVolume size={14} color={ttsRead.playing ? '#D97706' : T} />
                  {ttsRead.loading ? 'Загрузка...' : ttsRead.playing ? '⏸ Пауза' : 'Слушать'}
                </button>
              </div>
              {lesson.paragraphs.map((p, i) => (
                <p key={i} style={{ fontSize: 15, color: '#334155', lineHeight: 1.9, marginBottom: i < lesson.paragraphs.length - 1 ? 16 : 0, paddingBottom: i < lesson.paragraphs.length - 1 ? 16 : 0, borderBottom: i < lesson.paragraphs.length - 1 ? '1px solid #F1F5F9' : 'none' }}>{p}</p>
              ))}
            </div>

            {/* Dialogue */}
            {lesson.dialogue.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 16, padding: '22px 28px', marginBottom: 14, border: '1px solid rgba(0,56,118,0.07)', boxShadow: '0 2px 8px rgba(0,56,118,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: MU, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.lesson.dialogue_label}</span>
                  <button onClick={() => ttsRead.toggle(lesson.dialogue.map(l => l.text).join(' '), 'nova')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: ttsRead.playing ? '#FEF3C7' : '#F0FDF4', border: `1px solid ${ttsRead.playing ? '#FCD34D' : '#86EFAC'}`, borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: ttsRead.playing ? '#D97706' : T, fontFamily: 'inherit' }}>
                    <IcVolume size={13} color={ttsRead.playing ? '#D97706' : T} />
                    {ttsRead.playing ? '⏸ Пауза' : '▶ Слушать'}
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {lesson.dialogue.map((line, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: line.isLeft ? 'row' : 'row-reverse', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: line.isLeft ? N : '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>{line.speaker[0]}</div>
                      <div style={{ maxWidth: '75%' }}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: MU, marginBottom: 3, textAlign: line.isLeft ? 'left' : 'right' }}>{line.speaker}</div>
                        <div style={{ background: line.isLeft ? '#F8FBFF' : '#F5F3FF', border: `1px solid ${line.isLeft ? 'rgba(0,56,118,0.1)' : 'rgba(124,58,237,0.15)'}`, borderRadius: line.isLeft ? '4px 14px 14px 14px' : '14px 4px 14px 14px', padding: '9px 13px', fontSize: 13, color: '#334155', lineHeight: 1.6 }}>{line.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Phrases */}
            {lesson.keyPhrases.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', marginBottom: 14, border: '1px solid rgba(0,56,118,0.07)', boxShadow: '0 2px 8px rgba(0,56,118,0.05)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: MU, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
                  Key Phrases · {lesson.keyPhrases.length} expressions
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {lesson.keyPhrases.map(kp => (
                    <button key={kp.phrase} onClick={() => ttsRead.toggle(kp.phrase, 'nova')} style={{ textAlign: 'left', background: '#F8FBFF', border: '1px solid rgba(0,56,118,0.08)', borderRadius: 10, padding: '10px 14px', cursor: 'pointer', fontFamily: 'inherit' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: N, marginBottom: 2 }}>{kp.phrase}</div>
                      <div style={{ fontSize: 11, color: MU }}>{kp.ru}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => setReadStep(hasTasks ? 2 : 0)} style={{
              width: '100%', padding: '15px', borderRadius: 14, border: 'none',
              background: S, color: '#fff', fontSize: 14, fontWeight: 800,
              cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 4px 18px ${S}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {lesson.task1Items.length > 0 ? <><IcArrowRight size={16} color="#fff" /> Continue to Task 1</> : <><IcCheck size={16} color="#fff" /> Finish Lesson</>}
            </button>
          </div>
        </div>
      </div>
    )

    // ── Step 2: Task 1 — word bank ───────────────────────────────
    if (readStep === 2) {
      const remaining = lesson.task1Bank.filter(w => !Object.values(t1Answers).includes(w))
      const allFilled = lesson.task1Items.every(i => t1Answers[i.id])
      const t1correct = lesson.task1Items.filter(i => t1Answers[i.id]?.toLowerCase() === i.correct.toLowerCase()).length

      return (
        <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif" }}>
          {renderHeader()}
          <div className="zku-lesson-pad" style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px 56px' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
              {STEPS_READ.map((s, i) => (
                <React.Fragment key={s}>
                  <span style={{ fontSize: 11, fontWeight: i === 2 ? 800 : 500, color: i < 2 ? T : i === 2 ? N : '#94A3B8' }}>{s}</span>
                  {i < STEPS_READ.length - 1 && <span style={{ color: '#CBD5E1', fontSize: 10 }}>›</span>}
                </React.Fragment>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,56,118,0.08)', border: '1px solid rgba(0,56,118,0.07)', marginBottom: 12 }}>
              <div style={{ background: `linear-gradient(135deg, ${N}, #1B5FBF)`, padding: '18px 28px', color: '#fff' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>{t.lesson.task1_label}</div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{t.lesson.task1_title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{lesson.task1Items.length - Object.keys(t1Answers).length} {t.lesson.prep_remaining}</div>
              </div>

              {/* Word bank */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(0,56,118,0.07)', background: '#F8FBFF' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {lesson.task1Bank.map(w => {
                    const used = Object.values(t1Answers).includes(w)
                    const isSelected = t1Active === w
                    return (
                      <button key={w} onClick={() => !used && !t1Checked && setT1Active(a => a === w ? null : w)} style={{
                        padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                        border: `1.5px solid ${isSelected ? S : used ? '#E2E8F0' : 'rgba(0,56,118,0.2)'}`,
                        background: isSelected ? S : used ? '#F1F5F9' : '#fff',
                        color: isSelected ? '#fff' : used ? '#94A3B8' : N,
                        cursor: used ? 'default' : 'pointer', fontFamily: 'inherit',
                        textDecoration: used ? 'line-through' : 'none', transition: 'all 0.15s',
                      }}>{w}</button>
                    )
                  })}
                </div>
              </div>

              {/* Questions */}
              <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {lesson.task1Items.map((item, qi) => {
                  const ans = t1Answers[item.id]
                  const isCorr = t1Checked && ans?.toLowerCase() === item.correct.toLowerCase()
                  const isWrong = t1Checked && ans && !isCorr
                  const [before, after] = item.question.split('___')
                  return (
                    <div key={item.id} onClick={() => { if (t1Active && !t1Checked) { setT1Answers(a => ({ ...a, [item.id]: t1Active })); setT1Active(null) } }} style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 12,
                      background: isCorr ? '#F0FDF4' : isWrong ? '#FEF2F2' : '#F8FAFC',
                      border: `1.5px solid ${isCorr ? '#86EFAC' : isWrong ? '#FECACA' : ans ? S : 'rgba(0,56,118,0.1)'}`,
                      cursor: t1Active && !t1Checked ? 'pointer' : 'default',
                      transition: 'all 0.15s',
                    }}>
                      <span style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>{qi + 1}.</span>
                      <span style={{ fontSize: 13, color: '#334155' }}>{before}</span>
                      <span style={{
                        minWidth: 100, padding: '3px 12px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                        background: isCorr ? '#DCFCE7' : isWrong ? '#FECACA' : ans ? '#DBEAFE' : '#E2E8F0',
                        color: isCorr ? T : isWrong ? '#EF4444' : ans ? N : '#94A3B8',
                        textAlign: 'center', border: `1px solid ${ans ? S + '40' : 'transparent'}`,
                      }}>{ans || '________'}</span>
                      {after && <span style={{ fontSize: 13, color: '#334155' }}>{after}</span>}
                      {ans && !t1Checked && <button onClick={e => { e.stopPropagation(); setT1Answers(a => { const n = {...a}; delete n[item.id]; return n }) }} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 16, lineHeight: 1 }}>×</button>}
                      {isWrong && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#EF4444' }}>→ {item.correct}</span>}
                    </div>
                  )
                })}
              </div>
            </div>

            {!t1Checked ? (
              <button onClick={() => setT1Checked(true)} disabled={!allFilled} style={{
                width: '100%', padding: '15px', borderRadius: 14, border: 'none',
                background: allFilled ? S : '#E2E8F0', color: '#fff', fontSize: 14, fontWeight: 800,
                cursor: allFilled ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
                boxShadow: allFilled ? `0 4px 18px ${S}44` : 'none', transition: 'all 0.2s',
              }}>{t.lesson.finish_btn}</button>
            ) : (
              <div>
                <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 12, padding: '12px 18px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <IcCheck size={16} color={T} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: T }}>{t1correct}/{lesson.task1Items.length} correct!</span>
                </div>
                <button onClick={() => setReadStep(3)} style={{ width: '100%', padding: '15px', borderRadius: 14, border: 'none', background: N, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 18px rgba(0,56,118,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  Continue to Task 2 <IcArrowRight size={16} color="#fff" />
                </button>
              </div>
            )}
          </div>
        </div>
      )
    }

    // ── Step 3: Task 2 — True/False ──────────────────────────────
    if (readStep === 3) {
      const allT2 = lesson.task2Items.every(i => t2Answers[i.id])
      const t2correct = lesson.task2Items.filter(i => t2Answers[i.id] === i.correct).length
      return (
        <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif" }}>
          {renderHeader()}
          <div className="zku-lesson-pad" style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px 56px' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
              {STEPS_READ.map((s, i) => (
                <React.Fragment key={s}>
                  <span style={{ fontSize: 11, fontWeight: i === 3 ? 800 : 500, color: i < 3 ? T : i === 3 ? N : '#94A3B8' }}>{s}</span>
                  {i < STEPS_READ.length - 1 && <span style={{ color: '#CBD5E1', fontSize: 10 }}>›</span>}
                </React.Fragment>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,56,118,0.08)', border: '1px solid rgba(0,56,118,0.07)', marginBottom: 12 }}>
              <div style={{ background: `linear-gradient(135deg, ${N}, #1B5FBF)`, padding: '18px 28px', color: '#fff' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>{t.lesson.task2_label}</div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{t.lesson.task2_title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{lesson.task2Items.length} statements about the text</div>
              </div>

              <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {lesson.task2Items.map((item, qi) => {
                  const ans = t2Answers[item.id]
                  const isCorr = t2Checked && ans === item.correct
                  const isWrong = t2Checked && ans && !isCorr
                  return (
                    <div key={item.id} style={{ borderRadius: 12, border: `1.5px solid ${isCorr ? '#86EFAC' : isWrong ? '#FECACA' : 'rgba(0,56,118,0.1)'}`, background: isCorr ? '#F0FDF4' : isWrong ? '#FEF2F2' : '#F8FAFC', overflow: 'hidden' }}>
                      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: MU, flexShrink: 0 }}>{qi + 1}.</span>
                        <span style={{ fontSize: 13, color: '#334155', flex: 1 }}>{item.statement}</span>
                        {t2Checked && (isCorr ? <IcCheck size={16} color={T} /> : <IcX size={16} color="#EF4444" />)}
                      </div>
                      {!t2Checked && (
                        <div style={{ display: 'flex', borderTop: '1px solid rgba(0,56,118,0.07)' }}>
                          {(['true', 'false'] as const).map(opt => (
                            <button key={opt} onClick={() => setT2Answers(a => ({ ...a, [item.id]: opt }))} style={{
                              flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700,
                              background: ans === opt ? (opt === 'true' ? T : '#EF4444') : 'transparent',
                              color: ans === opt ? '#fff' : opt === 'true' ? T : '#EF4444',
                              borderRight: opt === 'true' ? '1px solid rgba(0,56,118,0.07)' : 'none',
                              transition: 'all 0.15s',
                            }}>
                              {opt === 'true' ? t.lesson.true_btn : t.lesson.false_btn}
                            </button>
                          ))}
                        </div>
                      )}
                      {t2Checked && isWrong && (
                        <div style={{ padding: '6px 16px', borderTop: '1px solid #FECACA', background: '#FEF2F2', fontSize: 11, color: '#EF4444', fontWeight: 600 }}>
                          {t.lesson.correct_ans} {item.correct === 'true' ? t.lesson.true_btn : t.lesson.false_btn}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {!t2Checked ? (
              <button onClick={() => setT2Checked(true)} disabled={!allT2} style={{
                width: '100%', padding: '15px', borderRadius: 14, border: 'none',
                background: allT2 ? S : '#E2E8F0', color: '#fff', fontSize: 14, fontWeight: 800,
                cursor: allT2 ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
                boxShadow: allT2 ? `0 4px 18px ${S}44` : 'none', transition: 'all 0.2s',
              }}>{t.lesson.finish_btn}</button>
            ) : (
              <div>
                <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 12, padding: '12px 18px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <IcCheck size={16} color={T} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: T }}>{t2correct}/{lesson.task2Items.length} correct — {t2correct >= 5 ? t.lesson.excellent : t.lesson.good_job}</span>
                </div>
                <button onClick={nextPhase} style={{ width: '100%', padding: '15px', borderRadius: 14, border: 'none', background: N, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 18px rgba(0,56,118,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <IcCheck size={16} color="#fff" /> Finish Lesson
                </button>
              </div>
            )}
          </div>
        </div>
      )
    }

    // fallback — skip tasks
    return (
      <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif" }}>
        {renderHeader()}
        <div style={{ maxWidth: 680, margin: '40px auto', padding: '0 24px', textAlign: 'center' }}>
          <button onClick={nextPhase} style={{ padding: '15px 40px', borderRadius: 14, border: 'none', background: N, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
            Finish Lesson <IcCheck size={16} color="#fff" />
          </button>
        </div>
      </div>
    )
  }

  // ── LISTENING phase ───────────────────────────────────────────
  if (lesson.type === 'listening') {
    const LIS_STEPS = [t.lesson.step_prep, t.lesson.step_listen, t.lesson.step_task1, t.lesson.step_task2]
    const P  = '#7C3AED'  // purple for listening
    const PL = '#F5F3FF'
    const PB = '#DDD6FE'

    const playAudio  = ttsDial.play
    const pauseAudio = ttsDial.pause
    const resumeAudio = ttsDial.resume
    const stopAudio  = () => { ttsDial.stop(); ttsDial.setHasPlayed(true) }

    function Breadcrumb({ active }: { active: number }) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
          {LIS_STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <span style={{ fontSize: 11, fontWeight: i === active ? 800 : 500, color: i < active ? T : i === active ? P : '#94A3B8' }}>{s}</span>
              {i < LIS_STEPS.length - 1 && <span style={{ color: '#CBD5E1', fontSize: 10 }}>›</span>}
            </React.Fragment>
          ))}
        </div>
      )
    }

    // ── Step 0: Preparation ──────────────────────────────────────
    if (lisStep === 0) {
      const allAnswered = lesson.prepTasks.every(p => prepAnswers[p.id])
      const correctCount = lesson.prepTasks.filter(p => prepAnswers[p.id] === p.correct).length
      return (
        <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif" }}>
          {renderHeader()}
          <div className="zku-lesson-pad" style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px 56px' }}>
            <Breadcrumb active={0} />
            <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 20px rgba(124,58,237,0.1)', border: `1px solid ${PB}`, marginBottom: 12 }}>
              <div style={{ background: `linear-gradient(135deg, ${P}, #6D28D9)`, padding: '20px 28px', color: '#fff' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>{t.lesson.step_prep} · Module {lesson.moduleNum} Lesson {lesson.lessonNum}</div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>{t.lesson.prep_title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{lesson.prepTasks.length - Object.keys(prepAnswers).length} {t.lesson.prep_remaining}</div>
              </div>
              <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {lesson.prepTasks.map(p => {
                  const answered = prepAnswers[p.id]
                  const isCorr = prepChecked && answered === p.correct
                  const isWrong = prepChecked && answered && answered !== p.correct
                  return (
                    <div key={p.id} style={{ borderRadius: 12, border: `1.5px solid ${isCorr ? T : isWrong ? '#EF4444' : answered ? P : 'rgba(124,58,237,0.15)'}`, overflow: 'hidden', background: isCorr ? '#F0FDF4' : isWrong ? '#FEF2F2' : '#fff' }}>
                      <div style={{ padding: '10px 16px', background: PL, borderBottom: `1px solid ${PB}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 22 }}>{p.emoji}</span>
                        <span style={{ fontSize: 15, fontWeight: 900, color: P }}>{p.word}</span>
                        {isCorr && <IcCheck size={16} color={T} />}
                        {isWrong && <><IcX size={16} color="#EF4444" /><span style={{ fontSize: 11, color: '#EF4444', marginLeft: 4 }}>→ {p.correct}</span></>}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '12px 16px' }}>
                        {p.opts.map(opt => (
                          <button key={opt} onClick={() => !prepChecked && setPrepAnswers(a => ({ ...a, [p.id]: opt }))} style={{
                            padding: '7px 16px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: prepChecked ? 'default' : 'pointer', fontFamily: 'inherit',
                            border: `1.5px solid ${answered === opt ? P : 'rgba(124,58,237,0.15)'}`,
                            background: prepChecked && answered === opt && isCorr ? T : prepChecked && answered === opt ? '#EF4444' : answered === opt ? PL : '#F8F9FF',
                            color: prepChecked && answered === opt ? '#fff' : answered === opt ? P : '#475569',
                            transition: 'all 0.15s',
                          }}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            {!prepChecked ? (
              <button onClick={() => setPrepChecked(true)} disabled={!allAnswered} style={{ width: '100%', padding: '15px', borderRadius: 14, border: 'none', background: allAnswered ? P : '#E2E8F0', color: '#fff', fontSize: 14, fontWeight: 800, cursor: allAnswered ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 0.2s' }}>{t.lesson.check_btn}</button>
            ) : (
              <div>
                <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 12, padding: '12px 18px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <IcCheck size={16} color={T} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: T }}>{correctCount}/{lesson.prepTasks.length} correct! Now listen to the conversation.</span>
                </div>
                <button onClick={() => setLisStep(1)} style={{ width: '100%', padding: '15px', borderRadius: 14, border: 'none', background: P, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <IcArrowRight size={16} color="#fff" /> Continue to Listen
                </button>
              </div>
            )}
          </div>
        </div>
      )
    }

    // ── Step 1: Listen + Transcript ──────────────────────────────
    if (lisStep === 1) return (
      <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif" }}>
        {renderHeader()}
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 0 56px' }}>

          {/* Hero with photo */}
          <div style={{ position: 'relative', overflow: 'hidden', minHeight: 260 }}>
            <img src={`/lessons/${lesson.id}.jpg`} alt={lesson.title} style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(75,0,160,0.95) 0%, rgba(75,0,160,0.5) 55%, rgba(75,0,160,0.1) 100%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 36px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Listening · {(() => { const n = parseInt(id.split('-')[0].replace('l','')); return n <= 16 ? 'A1' : n <= 34 ? 'A1.1' : n <= 58 ? 'A2' : 'B1'; })()} · Module {lesson.moduleNum} · Lesson {lesson.lessonNum}</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 10 }}>{lesson.title}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Video call', 'First week', 'University life', 'Making friends'].map(tag => (
                  <span key={tag} style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.25)' }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ position: 'absolute', inset: 0, zIndex: -1, background: `linear-gradient(160deg, #4C1D95 0%, ${P} 60%, #6D28D9 100%)` }} />
          </div>

          <div style={{ padding: '24px 32px 0' }}>
            <Breadcrumb active={1} />

            {/* Instruction */}
            <div style={{ background: PL, border: `1px solid ${PB}`, borderRadius: 14, padding: '14px 18px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <IcHeadphones size={20} color={P} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: P, marginBottom: 2 }}>Listen to the video call between Aizhan and Dias.</div>
                <div style={{ fontSize: 12, color: '#6D28D9' }}>Do the preparation task first. Then listen and do the exercises.</div>
              </div>
            </div>

            {/* Audio player */}
            <div style={{ background: '#fff', borderRadius: 18, padding: '24px 28px', marginBottom: 14, border: `1px solid ${PB}`, boxShadow: `0 2px 20px rgba(124,58,237,0.1)` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: P, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Audio · {lesson.dialogue.length} lines · ~{lesson.duration} min</div>

              {/* Waveform visual */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 40, marginBottom: 18, overflow: 'hidden' }}>
                {Array.from({ length: 48 }, (_, i) => (
                  <div key={i} style={{ flex: 1, borderRadius: 99, background: isPlaying ? P : '#E2E8F0', height: `${20 + Math.sin(i * 0.8) * 14 + Math.cos(i * 1.3) * 8}px`, transition: 'all 0.3s', opacity: isPlaying ? 0.7 + Math.sin(i * 0.5) * 0.3 : 0.4 }} />
                ))}
              </div>

              {/* Controls: Play / Pause / Stop */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Play or Pause */}
                {!isPlaying && !ttsDial.paused && (
                  <button onClick={hasPlayed ? ttsDial.play : playAudio} style={{ width: 52, height: 52, borderRadius: '50%', border: 'none', background: P, color: '#fff', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${P}44`, flexShrink: 0 }}>
                    {ttsDial.loading ? <span style={{ fontSize: 13 }}>⏳</span> : '▶'}
                  </button>
                )}
                {isPlaying && (
                  <button onClick={pauseAudio} style={{ width: 52, height: 52, borderRadius: '50%', border: 'none', background: '#F59E0B', color: '#fff', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(245,158,11,0.4)', flexShrink: 0 }}>
                    ⏸
                  </button>
                )}
                {ttsDial.paused && (
                  <button onClick={resumeAudio} style={{ width: 52, height: 52, borderRadius: '50%', border: 'none', background: T, color: '#fff', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${T}44`, flexShrink: 0 }}>
                    ▶
                  </button>
                )}
                {/* Stop */}
                {(isPlaying || ttsDial.paused) && (
                  <button onClick={stopAudio} style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #EF4444', background: '#FEF2F2', color: '#EF4444', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    ⏹
                  </button>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: N, marginBottom: 2 }}>{lesson.title}</div>
                  <div style={{ fontSize: 11, color: MU }}>
                    {isPlaying
                      ? `${t.lesson.playing}${ttsDial.lineIdx >= 0 ? ` · ${ttsDial.lineIdx + 1}/${lesson.dialogue.length}` : ''}`
                      : ttsDial.paused ? '⏸ Пауза'
                      : hasPlayed ? t.lesson.played
                      : t.lesson.press_play}
                  </div>
                </div>
                {hasPlayed && !isPlaying && !ttsDial.paused && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: T, background: '#DCFCE7', padding: '4px 10px', borderRadius: 99 }}>✓ Done</span>
                )}
              </div>
            </div>

            {/* Transcript with current line highlight */}
            <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${PB}`, overflow: 'hidden', marginBottom: 16 }}>
              <button onClick={() => setShowTranscript(s => !s)} style={{ width: '100%', padding: '16px 24px', background: showTranscript ? P : '#F8F9FF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'inherit' }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: showTranscript ? '#fff' : P }}>{t.lesson.transcript_btn}</span>
                <span style={{ fontSize: 16, color: showTranscript ? '#fff' : P }}>{showTranscript ? '▲' : '▼'}</span>
              </button>
              {showTranscript && (
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {lesson.dialogue.map((line, i) => {
                    const isCurrentLine = ttsDial.lineIdx === i
                    return (
                      <div key={i} style={{ display: 'flex', flexDirection: line.isLeft ? 'row' : 'row-reverse', alignItems: 'flex-start', gap: 10,
                        opacity: ttsDial.lineIdx >= 0 && !isCurrentLine ? 0.4 : 1,
                        transition: 'opacity 0.3s',
                      }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: line.isLeft ? N : P, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff',
                          boxShadow: isCurrentLine ? `0 0 0 3px ${line.isLeft ? N : P}44` : 'none',
                        }}>{line.speaker[0]}</div>
                        <div style={{ maxWidth: '80%' }}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: MU, marginBottom: 3, textAlign: line.isLeft ? 'left' : 'right' }}>{line.speaker}</div>
                          <div style={{
                            background: isCurrentLine ? (line.isLeft ? '#DBEAFE' : '#EDE9FE') : line.isLeft ? '#F8FBFF' : PL,
                            border: `1px solid ${isCurrentLine ? (line.isLeft ? N : P) : line.isLeft ? 'rgba(0,56,118,0.1)' : PB}`,
                            borderRadius: line.isLeft ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                            padding: '9px 14px', fontSize: 13, color: '#334155', lineHeight: 1.6,
                            transition: 'all 0.3s',
                          }}>{line.text}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <button onClick={() => setLisStep(2)} style={{ width: '100%', padding: '15px', borderRadius: 14, border: 'none', background: P, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 4px 18px ${P}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <IcArrowRight size={16} color="#fff" /> Continue to Task 1
            </button>
          </div>
        </div>
      </div>
    )

    // ── Step 2: Task 1 — True / False ────────────────────────────
    if (lisStep === 2) {
      // Newer listening lessons store real T/F in task2Items.
      // Older ones keep T/F inside task1Items (correct: 'true' | 'false').
      const tfItems = lesson.task2Items.length > 0
        ? lesson.task2Items.map(i => ({ id: i.id, text: i.statement, correct: i.correct }))
        : lesson.task1Items.map(i => ({ id: i.id, text: i.question, correct: i.correct }))
      const allDone = tfItems.every(i => lisT1Ans[i.id])
      const correct = tfItems.filter(i => lisT1Ans[i.id] === i.correct).length
      return (
        <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif" }}>
          {renderHeader()}
          <div className="zku-lesson-pad" style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px 56px' }}>
            <Breadcrumb active={2} />
            <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: `0 2px 20px ${P}18`, border: `1px solid ${PB}`, marginBottom: 12 }}>
              <div style={{ background: `linear-gradient(135deg, ${P}, #6D28D9)`, padding: '18px 28px', color: '#fff' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>{t.lesson.listen_t1_label}</div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{t.lesson.task2_title}</div>
              </div>
              <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tfItems.map((item, qi) => {
                  const ans = lisT1Ans[item.id]
                  const isCorr = lisT1Done && ans === item.correct
                  const isWrong = lisT1Done && ans && !isCorr
                  return (
                    <div key={item.id} style={{ borderRadius: 12, border: `1.5px solid ${isCorr ? '#86EFAC' : isWrong ? '#FECACA' : 'rgba(124,58,237,0.15)'}`, background: isCorr ? '#F0FDF4' : isWrong ? '#FEF2F2' : '#F8F9FF', overflow: 'hidden' }}>
                      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: P, flexShrink: 0 }}>{qi + 1}.</span>
                        <span style={{ fontSize: 13, color: '#334155', flex: 1 }}>{item.text}</span>
                        {lisT1Done && (isCorr ? <IcCheck size={16} color={T} /> : <IcX size={16} color="#EF4444" />)}
                      </div>
                      {!lisT1Done && (
                        <div style={{ display: 'flex', borderTop: `1px solid rgba(124,58,237,0.1)` }}>
                          {(['true', 'false'] as const).map(opt => (
                            <button key={opt} onClick={() => setLisT1Ans(a => ({ ...a, [item.id]: opt }))} style={{ flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, background: ans === opt ? (opt === 'true' ? T : '#EF4444') : 'transparent', color: ans === opt ? '#fff' : opt === 'true' ? T : '#EF4444', borderRight: opt === 'true' ? `1px solid rgba(124,58,237,0.1)` : 'none', transition: 'all 0.15s' }}>
                              {opt === 'true' ? t.lesson.true_btn : t.lesson.false_btn}
                            </button>
                          ))}
                        </div>
                      )}
                      {lisT1Done && isWrong && <div style={{ padding: '6px 16px', borderTop: '1px solid #FECACA', background: '#FEF2F2', fontSize: 11, color: '#EF4444', fontWeight: 600 }}>{t.lesson.correct_ans} {item.correct === 'true' ? t.lesson.true_btn : t.lesson.false_btn}</div>}
                    </div>
                  )
                })}
              </div>
            </div>
            {!lisT1Done ? (
              <button onClick={() => setLisT1Done(true)} disabled={!allDone} style={{ width: '100%', padding: '15px', borderRadius: 14, border: 'none', background: allDone ? P : '#E2E8F0', color: '#fff', fontSize: 14, fontWeight: 800, cursor: allDone ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 0.2s' }}>{t.lesson.finish_btn}</button>
            ) : (
              <div>
                <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 12, padding: '12px 18px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <IcCheck size={16} color={T} /><span style={{ fontSize: 13, fontWeight: 700, color: T }}>{correct}/{tfItems.length} correct!</span>
                </div>
                <button onClick={() => setLisStep(3)} style={{ width: '100%', padding: '15px', borderRadius: 14, border: 'none', background: N, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  Continue to Task 2 <IcArrowRight size={16} color="#fff" />
                </button>
              </div>
            )}
          </div>
        </div>
      )
    }

    // ── Step 3: Task 2 — Who said it? Character cards ────────────
    if (lisStep === 3) {
      const stmt = lesson.listenStatements[lisT2Idx]
      const total2 = lesson.listenStatements.length
      const allT2Done = lisT2Idx >= total2
      const correct2 = lesson.listenStatements.filter(s => lisT2Ans[s.id] === s.correctCharId).length

      if (allT2Done) return (
        <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ maxWidth: 480, width: '100%', background: '#fff', borderRadius: 28, padding: '48px 36px', boxShadow: '0 8px 40px rgba(124,58,237,0.15)', textAlign: 'center', border: `1px solid ${PB}` }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🎧</div>
            <div style={{ fontSize: 12, color: MU, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>{t.lesson.lesson_complete}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: N, marginBottom: 6 }}>{t.lesson.well_done}</div>
            <div style={{ fontSize: 14, color: MU, marginBottom: 28 }}>{lesson.title} · Module {lesson.moduleNum}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 28 }}>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: 32, fontWeight: 900, color: P }}>{correct2}/{total2}</div><div style={{ fontSize: 11, color: MU, marginTop: 5, fontWeight: 600, textTransform: 'uppercase' }}>Task 2</div></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: 32, fontWeight: 900, color: G }}>+{lesson.xp}</div><div style={{ fontSize: 11, color: MU, marginTop: 5, fontWeight: 600, textTransform: 'uppercase' }}>XP</div></div>
            </div>
            <div style={{ height: 8, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden', marginBottom: 28 }}>
              <div style={{ height: '100%', width: '100%', background: `linear-gradient(90deg, ${P}, #6D28D9)`, borderRadius: 99 }} />
            </div>
            {renderLevelCert()}
            <Link href={moduleUrl} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '14px', borderRadius: 12, border: 'none', background: N, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,56,118,0.28)' }}>
              {t.lesson.back_to_module} <IcArrowRight size={14} color="#fff" />
            </Link>
          </div>
        </div>
      )

      return (
        <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif" }}>
          {renderHeader()}
          <div className="zku-lesson-pad" style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px 56px' }}>
            <Breadcrumb active={3} />

            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 8, background: '#E2E8F0', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(lisT2Idx / total2) * 100}%`, background: P, borderRadius: 99, transition: 'width 0.3s' }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: P, flexShrink: 0 }}>{lisT2Idx + 1} / {total2}</span>
            </div>

            {/* Instruction */}
            <div style={{ background: PL, border: `1px solid ${PB}`, borderRadius: 14, padding: '14px 20px', marginBottom: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: P, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.lesson.listen_t2_label}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: N, lineHeight: 1.5 }}>"{stmt.text}"</div>
            </div>

            {/* Character cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              {lesson.listenChars.map(ch => {
                const selected = lisT2Ans[stmt.id] === ch.id
                const isChecked = lisT2Done
                const isCorrect = isChecked && ch.id === stmt.correctCharId
                const isWrong   = isChecked && selected && !isCorrect
                return (
                  <button key={ch.id} onClick={() => {
                    if (lisT2Done) return
                    setLisT2Ans(a => ({ ...a, [stmt.id]: ch.id }))
                    setTimeout(() => {
                      setLisT2Done(true)
                      setTimeout(() => { setLisT2Done(false); setLisT2Idx(i => i + 1) }, 1000)
                    }, 400)
                  }} style={{
                    borderRadius: 16, border: `2px solid ${isCorrect ? T : isWrong ? '#EF4444' : selected ? P : ch.color + '30'}`,
                    background: isCorrect ? '#F0FDF4' : isWrong ? '#FEF2F2' : selected ? PL : '#fff',
                    padding: '20px 16px', cursor: 'pointer', fontFamily: 'inherit',
                    boxShadow: selected ? `0 4px 20px ${ch.color}25` : '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'all 0.2s', textAlign: 'center',
                  }}>
                    {/* Avatar */}
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: `linear-gradient(135deg, ${ch.color}, ${ch.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 32, boxShadow: `0 4px 16px ${ch.color}40` }}>
                      {ch.emoji}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: N, marginBottom: 3 }}>{ch.name}</div>
                    <div style={{ fontSize: 11, color: ch.color, fontWeight: 700, marginBottom: 4 }}>{ch.role}</div>
                    <div style={{ fontSize: 11, color: MU, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      📍 {ch.city}
                    </div>
                    {isCorrect && <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: T }}>✓ Correct!</div>}
                    {isWrong   && <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: '#EF4444' }}>✗ Wrong</div>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )
    }
  }

  // ── WRITING phase ─────────────────────────────────────────────
  if (lesson.type === 'writing') {
    const WR_STEPS = [t.lesson.step_prep, t.lesson.step_model, t.lesson.step_write]
    const W  = '#1D9E75'
    const WL = '#F0FDF4'
    const WB = '#86EFAC'

    function WBreadcrumb({ active }: { active: number }) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
          {WR_STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <span style={{ fontSize: 11, fontWeight: i === active ? 800 : 500, color: i < active ? W : i === active ? N : '#94A3B8' }}>{s}</span>
              {i < WR_STEPS.length - 1 && <span style={{ color: '#CBD5E1', fontSize: 10 }}>›</span>}
            </React.Fragment>
          ))}
        </div>
      )
    }

    // ── Step 0: Preparation ──────────────────────────────────────
    if (writStep === 0) {
      const allAnswered = lesson.prepTasks.every(p => prepAnswers[p.id])
      const correct = lesson.prepTasks.filter(p => prepAnswers[p.id] === p.correct).length
      return (
        <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif" }}>
          {renderHeader()}
          <div className="zku-lesson-pad" style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px 56px' }}>
            <WBreadcrumb active={0} />
            <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: `0 2px 20px ${W}18`, border: `1px solid ${WB}`, marginBottom: 12 }}>
              <div style={{ background: `linear-gradient(135deg, ${W}, #15803D)`, padding: '20px 28px', color: '#fff' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>{t.lesson.step_prep} · Module {lesson.moduleNum} Lesson {lesson.lessonNum}</div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>Match the sentence starters to their meanings</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{lesson.prepTasks.length - Object.keys(prepAnswers).length} {t.lesson.prep_remaining}</div>
              </div>
              <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {lesson.prepTasks.map(p => {
                  const answered = prepAnswers[p.id]
                  const isCorr = prepChecked && answered === p.correct
                  const isWrong = prepChecked && answered && answered !== p.correct
                  return (
                    <div key={p.id} style={{ borderRadius: 12, border: `1.5px solid ${isCorr ? W : isWrong ? '#EF4444' : answered ? W + '60' : WB}`, overflow: 'hidden', background: isCorr ? WL : isWrong ? '#FEF2F2' : '#fff' }}>
                      <div style={{ padding: '10px 16px', background: WL, borderBottom: `1px solid ${WB}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 20 }}>{p.emoji}</span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: N, fontStyle: 'italic' }}>{p.word}</span>
                        {isCorr && <IcCheck size={16} color={W} />}
                        {isWrong && <><IcX size={16} color="#EF4444" /><span style={{ fontSize: 11, color: '#EF4444', marginLeft: 4 }}>→ {p.correct}</span></>}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '12px 16px' }}>
                        {p.opts.map(opt => (
                          <button key={opt} onClick={() => !prepChecked && setPrepAnswers(a => ({ ...a, [p.id]: opt }))} style={{
                            padding: '7px 16px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: prepChecked ? 'default' : 'pointer', fontFamily: 'inherit',
                            border: `1.5px solid ${answered === opt ? W : WB}`,
                            background: prepChecked && answered === opt && isCorr ? W : prepChecked && answered === opt ? '#EF4444' : answered === opt ? WL : '#F8FFF9',
                            color: prepChecked && answered === opt ? '#fff' : answered === opt ? W : '#475569',
                            transition: 'all 0.15s',
                          }}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            {!prepChecked ? (
              <button onClick={() => setPrepChecked(true)} disabled={!allAnswered} style={{ width: '100%', padding: '15px', borderRadius: 14, border: 'none', background: allAnswered ? W : '#E2E8F0', color: '#fff', fontSize: 14, fontWeight: 800, cursor: allAnswered ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 0.2s' }}>{t.lesson.check_btn}</button>
            ) : (
              <div>
                <div style={{ background: WL, border: `1px solid ${WB}`, borderRadius: 12, padding: '12px 18px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <IcCheck size={16} color={W} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: W }}>{correct}/{lesson.prepTasks.length} correct! Now read the model text.</span>
                </div>
                <button onClick={() => setWritStep(1)} style={{ width: '100%', padding: '15px', borderRadius: 14, border: 'none', background: N, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <IcArrowRight size={16} color="#fff" /> Read model text
                </button>
              </div>
            )}
          </div>
        </div>
      )
    }

    // ── Step 1: Model text ───────────────────────────────────────
    if (writStep === 1) return (
      <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif" }}>
        {renderHeader()}
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 0 56px' }}>

          {/* Hero */}
          <div style={{ position: 'relative', overflow: 'hidden', minHeight: 240 }}>
            <img src={`/lessons/${lesson.id}.jpg`} alt={lesson.title} style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(5,80,50,0.95) 0%, rgba(5,80,50,0.5) 55%, rgba(5,80,50,0.1) 100%)` }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 36px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Writing · {(() => { const n = parseInt(id.split('-')[0].replace('l','')); return n <= 16 ? 'A1' : n <= 34 ? 'A1.1' : n <= 58 ? 'A2' : 'B1'; })()} · Module {lesson.moduleNum} · Lesson {lesson.lessonNum}</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 10 }}>{lesson.title}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Personal profile', 'Introducing yourself', 'About university', 'Goals & dreams'].map(tag => (
                  <span key={tag} style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.25)' }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ position: 'absolute', inset: 0, zIndex: -1, background: `linear-gradient(160deg, #064E3B 0%, ${W} 60%, #15803D 100%)` }} />
          </div>

          <div style={{ padding: '24px 32px 0' }}>
            <WBreadcrumb active={1} />

            {/* Instruction */}
            <div style={{ background: WL, border: `1px solid ${WB}`, borderRadius: 14, padding: '14px 18px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <IcEdit size={20} color={W} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: W, marginBottom: 2 }}>{t.lesson.read_model}</div>
                <div style={{ fontSize: 12, color: '#15803D' }}>Pay attention to the structure, phrases and vocabulary. You will write your own profile next.</div>
              </div>
            </div>

            {/* Model text card */}
            <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: `1px solid ${WB}`, boxShadow: `0 2px 20px ${W}18`, marginBottom: 14 }}>
              {/* Author tag */}
              <div style={{ background: WL, padding: '14px 24px', borderBottom: `1px solid ${WB}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${N}, #1B5FBF)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👩‍🎓</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: N }}>Aizhan Bekova</div>
                  <div style={{ fontSize: 11, color: MU }}>WKU · Group 101 · Model profile</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: W, background: WL, padding: '3px 10px', borderRadius: 99, border: `1px solid ${WB}` }}>Example</span>
              </div>

              <div style={{ padding: '24px 28px' }}>
                {lesson.writingModel.map((para, i) => (
                  <p key={i} style={{ fontSize: 14, color: '#334155', lineHeight: 1.9, marginBottom: i < lesson.writingModel.length - 1 ? 14 : 0, paddingBottom: i < lesson.writingModel.length - 1 ? 14 : 0, borderBottom: i < lesson.writingModel.length - 1 ? '1px solid #F1F5F9' : 'none' }}>{para}</p>
                ))}
              </div>

              {/* Highlighted phrases */}
              <div style={{ padding: '16px 24px', borderTop: `1px solid ${WB}`, background: '#FAFFFE' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: W, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>{t.lesson.key_phrases_label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['My name is...', 'I am from...', 'I study at...', 'My favourite subject is...', 'My best friend is...', 'My goal is to...', 'My dream is to...'].map(ph => (
                    <span key={ph} style={{ fontSize: 11, fontWeight: 600, color: W, background: WL, border: `1px solid ${WB}`, padding: '3px 12px', borderRadius: 99, fontStyle: 'italic' }}>{ph}</span>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => setWritStep(2)} style={{ width: '100%', padding: '15px', borderRadius: 14, border: 'none', background: W, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 4px 18px ${W}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <IcArrowRight size={16} color="#fff" /> Now write your own profile!
            </button>
          </div>
        </div>
      </div>
    )

    // ── Step 2: Write ────────────────────────────────────────────
    const writKeys  = writingBlankKeys(lesson.writingTemplate)
    const total     = writKeys.length
    const filled    = writKeys.filter(k => (writFields[k] ?? '').trim()).length
    const pct       = total > 0 ? Math.round(filled / total * 100) : 0
    const wordCount = writKeys.map(k => writFields[k] ?? '').join(' ').split(/\s+/).filter(Boolean).length

    if (!writSubmitted) return (
      <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif" }}>
        {renderHeader()}
        <div className="zku-lesson-pad" style={{ maxWidth: 1020, margin: '0 auto', padding: '32px 32px 56px' }}>
          <WBreadcrumb active={2} />

          <div className="zku-writing-split" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>

            {/* Left: Writing template */}
            <div>
              <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: `1px solid ${WB}`, boxShadow: `0 2px 20px ${W}18` }}>
                {/* Header */}
                <div style={{ background: `linear-gradient(135deg, ${W}, #15803D)`, padding: '20px 28px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Your writing · Task</div>
                    <div style={{ fontSize: 17, fontWeight: 900 }}>{t.lesson.write_task_label}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 900 }}>{pct}%</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{filled}/{total} filled</div>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ height: 4, background: 'rgba(0,0,0,0.1)' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: '#fff', transition: 'width 0.3s' }} />
                </div>

                {/* Template sentences */}
                <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {lesson.writingTemplate.map((line, i) => {
                    const tokens = buildWritingTokens(line)
                    const lineFilled = tokens.some(tk => tk.t === 'blank' && (writFields[tk.key] ?? '').trim())
                    return (
                      <div key={line.key} style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: MU, minWidth: 20 }}>{i + 1}.</span>
                        {tokens.map((tk, ti) => tk.t === 'text'
                          ? <span key={ti} style={{ fontSize: 14, color: '#334155', fontWeight: 500, whiteSpace: 'pre-wrap' }}>{tk.v}</span>
                          : (
                            <input
                              key={ti}
                              value={writFields[tk.key] ?? ''}
                              onChange={e => setWritFields(f => ({ ...f, [tk.key]: e.target.value }))}
                              placeholder={tk.ph}
                              style={{
                                border: 'none', borderBottom: `2px solid ${writFields[tk.key] ? W : '#E2E8F0'}`,
                                background: 'transparent', outline: 'none', padding: '2px 4px',
                                fontSize: 14, fontWeight: 700, color: N, fontFamily: 'inherit',
                                width: `${Math.max((writFields[tk.key] || tk.ph).length, 8) + 1}ch`,
                                minWidth: 80, transition: 'border-color 0.2s',
                              }}
                            />
                          )
                        )}
                        {!lineFilled && <span style={{ fontSize: 10, color: '#94A3B8', fontStyle: 'italic' }}>({line.hint})</span>}
                      </div>
                    )
                  })}
                </div>

                {/* Word count */}
                <div style={{ padding: '14px 28px', borderTop: `1px solid ${WB}`, background: WL, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: MU, fontWeight: 600 }}>{t.lesson.word_count_label} <strong style={{ color: wordCount >= 50 ? W : N }}>{wordCount}</strong></span>
                  <span style={{ fontSize: 11, color: MU }}>Target: 50+ words</span>
                </div>
              </div>

              <button onClick={() => setWritSubmitted(true)} disabled={filled < total} style={{
                width: '100%', marginTop: 12, padding: '15px', borderRadius: 14, border: 'none',
                background: filled >= total ? W : '#E2E8F0', color: '#fff', fontSize: 14, fontWeight: 800,
                cursor: filled >= total ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
                boxShadow: filled >= total ? `0 4px 18px ${W}44` : 'none', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <IcCheck size={16} color="#fff" /> Submit my profile
              </button>
            </div>

            {/* Right: {t.lesson.useful_phrases_label} */}
            <div>
              <div style={{ background: '#fff', borderRadius: 16, border: `1px solid rgba(0,56,118,0.08)`, overflow: 'hidden', position: 'sticky', top: 80 }}>
                <div style={{ padding: '14px 18px', background: '#F8FBFF', borderBottom: '1px solid rgba(0,56,118,0.07)' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: N, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.lesson.useful_phrases_label}</div>
                  <div style={{ fontSize: 10, color: MU, marginTop: 2 }}>{t.lesson.click_copy}</div>
                </div>
                {lesson.writingPhrases.map(group => (
                  <div key={group.category} style={{ borderBottom: '1px solid rgba(0,56,118,0.06)' }}>
                    <div style={{ padding: '10px 18px 6px', background: `${group.color}08` }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: group.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{group.category}</span>
                    </div>
                    <div style={{ padding: '6px 12px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {group.items.map(ph => (
                        <button key={ph} onClick={() => navigator.clipboard?.writeText(ph)} style={{
                          textAlign: 'left', background: `${group.color}08`, border: `1px solid ${group.color}20`,
                          borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontFamily: 'inherit',
                          fontSize: 11, color: '#334155', fontStyle: 'italic', transition: 'all 0.15s',
                        }}>
                          {ph}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )

    // ── Submitted: show final profile ────────────────────────────
    return (
      <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif" }}>
        {renderHeader()}
        <div className="zku-lesson-pad" style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px 56px' }}>

          {/* Success banner */}
          <div style={{ background: `linear-gradient(135deg, ${W}, #15803D)`, borderRadius: 18, padding: '28px 32px', marginBottom: 20, color: '#fff', textAlign: 'center' }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>✍️</div>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>{t.lesson.writing_done}</div>
            <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>Your profile is ready!</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>{wordCount} words written · +{lesson.xp} XP earned</div>
          </div>

          {/* Your profile card */}
          <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: `1px solid ${WB}`, boxShadow: `0 4px 24px ${W}18`, marginBottom: 16 }}>
            <div style={{ background: WL, padding: '16px 24px', borderBottom: `1px solid ${WB}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${W}, #15803D)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>✍️</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: N }}>{writFields['name'] || 'Your name'}</div>
                <div style={{ fontSize: 11, color: MU }}>{writFields['uni'] || 'Your university'} · Your profile</div>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: W, background: WL, padding: '3px 10px', borderRadius: 99, border: `1px solid ${WB}` }}>My writing</span>
            </div>
            <div style={{ padding: '22px 28px' }}>
              {lesson.writingTemplate.map((line, i) => {
                const tokens = buildWritingTokens(line)
                const anyVal = tokens.some(tk => tk.t === 'blank' && (writFields[tk.key] ?? '').trim())
                if (!anyVal) return null
                return (
                  <p key={line.key} style={{ fontSize: 14, color: '#334155', lineHeight: 1.9, marginBottom: i < lesson.writingTemplate.length - 1 ? 10 : 0, whiteSpace: 'pre-wrap' }}>
                    {tokens.map((tk, ti) => tk.t === 'text'
                      ? <React.Fragment key={ti}>{tk.v}</React.Fragment>
                      : <strong key={ti} style={{ color: N }}>{(writFields[tk.key] ?? '').trim() || '____'}</strong>
                    )}
                  </p>
                )
              })}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            {[
              { v: `${wordCount}`, l: t.lesson.words_written,    color: W },
              { v: `${total}`,     l: t.lesson.sentences_label, color: N },
              { v: `+${lesson.xp}`, l: t.lesson.xp_earned,     color: G },
            ].map(s => (
              <div key={s.l} style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '16px', textAlign: 'center', border: '1px solid rgba(0,56,118,0.07)' }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.v}</div>
                <div style={{ fontSize: 10, color: MU, marginTop: 4, fontWeight: 600, textTransform: 'uppercase' }}>{s.l}</div>
              </div>
            ))}
          </div>

          {renderLevelCert()}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setWritSubmitted(false)} style={{ flex: 1, padding: '13px', borderRadius: 12, border: `1.5px solid ${WB}`, background: WL, color: W, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              Edit
            </button>
            <Link href={moduleUrl} style={{ flex: 2, padding: '13px', borderRadius: 12, border: 'none', background: N, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 16px rgba(0,56,118,0.28)' }}>
              {t.lesson.back_to_module} <IcArrowRight size={14} color="#fff" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── QUIZ / TEST phase ─────────────────────────────────────────
  if (lesson.type === 'test' && lesson.questions.length > 0) {
    const CAT_CFG: Record<QCat, { label: string; color: string; bg: string; border: string }> = {
      reading:    { label: t.module.type_reading,    color: '#1B8FC4', bg: '#DBEAFE', border: '#93C5FD' },
      listening:  { label: t.module.type_listening,  color: '#7C3AED', bg: '#EDE9FE', border: '#C4B5FD' },
      grammar:    { label: t.module.type_grammar,    color: N,         bg: '#EEF2F7', border: '#BFDBFE' },
      vocabulary: { label: t.module.type_vocabulary, color: '#0F766E', bg: '#CCFBF1', border: '#5EEAD4' },
    }

    const qs    = lesson.questions
    const total = qs.length

    // ── Done screen ─────────────────────────────────────────────
    if (qzDone) {
      const maxXP = qs.reduce((s, q) => s + q.points * 3, 0)
      const pct   = Math.round(qzXP / qs.reduce((s, q) => s + q.points, 0) * 100)
      const grade = pct >= 90 ? 'A' : pct >= 75 ? 'B' : pct >= 60 ? 'C' : 'D'
      const gradeColor = pct >= 90 ? T : pct >= 75 ? '#1B8FC4' : pct >= 60 ? G : '#EF4444'
      const correct = qzResults.filter(r => r.correct).length

      // Category breakdown (only cats that have questions)
      const cats: QCat[] = ['reading', 'listening', 'grammar', 'vocabulary']
      const catStats = cats.map(cat => {
        const catQs = qs.filter(q => q.cat === cat)
        const catCorrect = qzResults.filter(r => r.correct && qs.find(q => q.id === r.id)?.cat === cat).length
        return { cat, total: catQs.length, correct: catCorrect }
      }).filter(cs => cs.total > 0)

      return (
        <div style={{ minHeight: '100vh', background: '#F0F4FA', fontFamily: "'Montserrat', sans-serif" }}>
          <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>

            {/* Grade card */}
            <div style={{ background: `linear-gradient(135deg, ${gradeColor}22, ${gradeColor}08)`, border: `1px solid ${gradeColor}44`, borderRadius: 28, padding: '40px 32px', textAlign: 'center', marginBottom: 20 }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: `linear-gradient(135deg, ${gradeColor}, ${gradeColor}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: `0 8px 32px ${gradeColor}44` }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: '#fff' }}>{grade}</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>{lesson.title}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: N, marginBottom: 4 }}>
                {pct >= 90 ? t.lesson.outstanding : pct >= 75 ? t.lesson.great_job : pct >= 60 ? t.lesson.good_effort : t.lesson.keep_studying}
              </div>
              <div style={{ fontSize: 14, color: MU, marginBottom: 28 }}>{correct}/{total} {t.common.label_correct.toLowerCase()} · {pct}%</div>

              {/* Stats row */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
                {[
                  { v: `${correct}/${total}`, l: t.common.label_correct,    color: T },
                  { v: `+${qzXP}`,            l: t.lesson.xp_earned,        color: G },
                  { v: `×${qzMaxStreak}`,      l: t.lesson.score,            color: '#7C3AED' },
                ].map(s => (
                  <div key={s.l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.v}</div>
                    <div style={{ fontSize: 10, color: '#64748B', marginTop: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category breakdown */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '24px', marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>{t.lesson.results_by_cat}</div>
              {catStats.map(cs => {
                const cfg = CAT_CFG[cs.cat]
                const cp  = Math.round(cs.correct / cs.total * 100)
                return (
                  <div key={cs.cat} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: cfg.color, background: cfg.bg, padding: '2px 10px', borderRadius: 99 }}>{cfg.label}</span>
                        <span style={{ fontSize: 12, color: '#64748B' }}>{cs.correct}/{cs.total}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: cp >= 70 ? T : '#EF4444' }}>{cp}%</span>
                    </div>
                    <div style={{ height: 6, background: '#EEF2F7', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${cp}%`, background: cp >= 70 ? T : '#EF4444', borderRadius: 99, transition: 'width 1s ease' }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Mistakes review */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>{t.lesson.incorrect_answers}</div>
              {qzResults.filter(r => !r.correct).length === 0
                ? <div style={{ fontSize: 13, color: T, fontWeight: 700, textAlign: 'center', padding: '8px 0' }}>{t.lesson.perfect_score}</div>
                : qzResults.filter(r => !r.correct).map(r => {
                    const q = qs.find(q => q.id === r.id)!
                    const cfg = CAT_CFG[q.cat]
                    return (
                      <div key={r.id} style={{ padding: '12px 0', borderBottom: '1px solid rgba(0,56,118,0.06)', display: 'flex', gap: 12 }}>
                        <div style={{ flexShrink: 0, marginTop: 2 }}><IcX size={16} color="#EF4444" /></div>
                        <div>
                          <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>{q.text}</div>
                          <div style={{ fontSize: 12, color: T, fontWeight: 700 }}>✓ {q.correct}</div>
                          <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{q.hint}</div>
                        </div>
                        <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 800, color: cfg.color, background: cfg.bg, padding: '2px 8px', borderRadius: 99, flexShrink: 0, alignSelf: 'flex-start' }}>{cfg.label}</span>
                      </div>
                    )
                  })
              }
            </div>

            {renderLevelCert()}
            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => {
                setQzDone(false); setQzIdx(0); setQzAnswer(''); setQzFill('')
                setQzChecked(false); setQzXP(0); setQzResults([]); setQzStreak(0); setQzMaxStreak(0)
                qzSavedRef.current = false
              }} style={{ flex: 1, padding: '14px', borderRadius: 14, border: `2px solid ${N}`, background: '#fff', color: N, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                ↺ {t.lesson.retry_test}
              </button>
              <Link href={moduleUrl} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 14, border: 'none', background: `linear-gradient(135deg, ${N}, #1B5FBF)`, color: '#fff', fontSize: 13, fontWeight: 800, textDecoration: 'none', boxShadow: '0 6px 20px rgba(0,56,118,0.4)' }}>
                {t.lesson.back_to_module} <IcArrowRight size={16} color="#fff" />
              </Link>
            </div>
          </div>
        </div>
      )
    }

    // ── Active quiz ──────────────────────────────────────────────
    const q      = qs[qzIdx]
    const catCfg = CAT_CFG[q.cat]
    const val    = q.type === 'fill' ? qzFill : qzAnswer
    const isCorr = qzChecked && answersMatch(q, val)
    const combo  = qzStreak >= 5 ? 3 : qzStreak >= 3 ? 2 : 1

    function checkAnswer() {
      if (!val || qzChecked) return
      const correct = answersMatch(q, val)
      const newStreak = correct ? qzStreak + 1 : 0
      const earned = correct ? q.points * Math.min(combo, 3) : 0
      setQzChecked(true)
      setQzStreak(newStreak)
      setQzMaxStreak(s => Math.max(s, newStreak))
      setQzXP(x => x + earned)
      setQzResults(r => [...r, { id: q.id, correct, earned }])
      if (correct && earned > 0) {
        setXpAnimVal(earned); setShowXpAnim(true)
        setTimeout(() => setShowXpAnim(false), 1200)
      }
    }

    function nextQ() {
      if (qzIdx + 1 >= total) { setQzDone(true); return }
      setQzIdx(i => i + 1)
      setQzAnswer(''); setQzFill(''); setQzChecked(false)
    }

    return (
      <div style={{ minHeight: '100vh', background: '#F0F4FA', fontFamily: "'Montserrat', sans-serif", position: 'relative' }}>

        {/* XP popup animation */}
        {showXpAnim && (
          <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)', zIndex: 999, fontSize: 32, fontWeight: 900, color: G, textShadow: `0 0 20px ${G}`, animation: 'none', pointerEvents: 'none' }}>
            +{xpAnimVal} XP ⚡
          </div>
        )}

        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,56,118,0.08)', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12, height: 60 }}>

            {/* Progress */}
            <div style={{ flex: 1, height: 6, background: '#EEF2F7', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(qzIdx / total) * 100}%`, background: `linear-gradient(90deg, ${N}, #1B8FC4)`, borderRadius: 99, transition: 'width 0.4s ease' }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', flexShrink: 0 }}>{qzIdx + 1}/{total}</span>

            {/* Streak */}
            {qzStreak > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: qzStreak >= 3 ? `${G}22` : '#FFF7ED', border: `1px solid ${qzStreak >= 3 ? G : '#FED7AA'}`, borderRadius: 99, padding: '4px 10px', flexShrink: 0 }}>
                <span style={{ fontSize: 13 }}>⚡</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: qzStreak >= 3 ? G : '#EA580C' }}>{qzStreak}</span>
              </div>
            )}

            {/* XP total */}
            <div style={{ fontSize: 11, fontWeight: 700, color: G, flexShrink: 0 }}>+{qzXP} XP</div>
          </div>
        </div>

        <div className="zku-lesson-pad" style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px 56px' }}>

          {/* Category badge + combo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: catCfg.color, background: catCfg.bg, border: `1px solid ${catCfg.border}`, padding: '4px 14px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {catCfg.label}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {combo > 1 && <span style={{ fontSize: 11, fontWeight: 800, color: G, background: `${G}22`, padding: '3px 10px', borderRadius: 99, border: `1px solid ${G}44` }}>×{combo}</span>}
              <span style={{ fontSize: 11, fontWeight: 600, color: '#475569' }}>+{q.points * combo} XP</span>
            </div>
          </div>

          {/* Question card */}
          <div style={{ background: '#fff', borderRadius: 24, padding: '32px 28px', marginBottom: 14, border: '1px solid rgba(0,56,118,0.08)', boxShadow: '0 4px 16px rgba(0,56,118,0.08)' }}>

            {/* Q type badge */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '3px 10px', borderRadius: 6, background: q.type === 'mc' ? '#DBEAFE' : q.type === 'tf' ? '#DCFCE7' : '#EDE9FE', color: q.type === 'mc' ? '#1D4ED8' : q.type === 'tf' ? '#16A34A' : '#7C3AED' }}>
                {q.type === 'mc' ? t.lesson.mc_type : q.type === 'tf' ? t.lesson.tf_type : t.lesson.fill_type}
              </span>
            </div>

            <div style={{ fontSize: 20, fontWeight: 800, color: N, lineHeight: 1.5, marginBottom: q.type === 'fill' && q.text.includes('___') ? 10 : 28 }}>{q.text}</div>
            {q.type === 'fill' && q.text.includes('___') && (
              <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', lineHeight: 1.45, marginBottom: 20 }}>
                {t.lesson.fill_gap_hint}
              </div>
            )}

            {/* Fill in the blank */}
            {q.type === 'fill' ? (
              <input
                autoFocus
                value={qzChecked ? qzFill : qzFill}
                onChange={e => !qzChecked && setQzFill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !qzChecked && checkAnswer()}
                disabled={qzChecked}
                placeholder={t.lesson.type_answer_ph}
                style={{
                  width: '100%', padding: '16px 20px', borderRadius: 14, boxSizing: 'border-box',
                  fontSize: 16, fontFamily: 'inherit', fontWeight: 700, outline: 'none',
                  border: `2px solid ${qzChecked ? (isCorr ? T : '#EF4444') : 'rgba(0,56,118,0.2)'}`,
                  background: qzChecked ? (isCorr ? '#F0FDF4' : '#FEF2F2') : '#fff',
                  color: qzChecked ? (isCorr ? '#16A34A' : '#DC2626') : N, transition: 'all 0.2s',
                }}
              />
            ) : (
              // MC / TF options
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {q.opts?.map((opt, oi) => {
                  const isSel  = qzAnswer === opt
                  const isOptCorr = opt.toLowerCase() === q.correct.toLowerCase()
                  let bg = '#F8FBFF', border = 'rgba(0,56,118,0.12)', tc = '#334155'
                  if (qzChecked) {
                    if (isOptCorr)       { bg = '#F0FDF4'; border = T;        tc = '#16A34A' }
                    else if (isSel)      { bg = '#FEF2F2'; border = '#EF4444'; tc = '#DC2626' }
                  } else if (isSel)      { bg = '#EFF6FF'; border = '#3B82F6'; tc = N }
                  return (
                    <button key={opt} onClick={() => !qzChecked && setQzAnswer(opt)} style={{
                      padding: '16px 20px', borderRadius: 14, border: `2px solid ${border}`,
                      background: bg, color: tc, fontSize: 14, fontWeight: 600,
                      textAlign: 'left', cursor: qzChecked ? 'default' : 'pointer',
                      fontFamily: 'inherit', transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', gap: 14,
                    }}>
                      <span style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, background: qzChecked ? (isOptCorr ? T : isSel ? '#EF4444' : '#F1F5F9') : isSel ? '#3B82F6' : '#EEF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: (qzChecked && (isOptCorr || isSel)) || (!qzChecked && isSel) ? '#fff' : '#64748B', fontSize: 11, fontWeight: 800, border: `1px solid ${border}22` }}>
                        {qzChecked && isOptCorr ? <IcCheck size={14} color="#fff" /> : qzChecked && isSel ? <IcX size={14} color="#fff" /> : String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Feedback */}
          {qzChecked && (
            <div style={{ background: isCorr ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${isCorr ? '#86EFAC' : '#FCA5A5'}`, borderRadius: 16, padding: '16px 20px', marginBottom: 14 }}>
              <div style={{ fontWeight: 800, color: isCorr ? '#16A34A' : '#DC2626', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                {isCorr ? <><IcCheck size={16} color="#16A34A" /> {t.lesson.correct} {qzStreak >= 3 ? `⚡ ${qzStreak}` : ''}</> : <><IcX size={16} color="#DC2626" /> {t.lesson.wrong}</>}
                {isCorr && <span style={{ fontSize: 13, color: G, marginLeft: 'auto', fontWeight: 900 }}>+{q.points * combo} XP</span>}
              </div>
              {!isCorr && <div style={{ fontSize: 12, color: '#DC2626', marginBottom: 4 }}>{t.lesson.correct_answer_show} <strong style={{ color: '#16A34A' }}>{q.correct}</strong></div>}
              <div style={{ fontSize: 12, color: '#475569' }}>{q.hint}</div>
            </div>
          )}

          {/* Button */}
          {!qzChecked ? (
            <button onClick={checkAnswer} disabled={!val} style={{ width: '100%', padding: '16px', borderRadius: 14, border: 'none', background: val ? `linear-gradient(135deg, ${N}, #1B5FBF)` : '#CBD5E1', color: val ? '#fff' : '#94A3B8', fontSize: 14, fontWeight: 800, cursor: val ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 0.2s', boxShadow: val ? '0 4px 20px rgba(0,56,118,0.4)' : 'none' }}>
              {t.lesson.check}
            </button>
          ) : (
            <button onClick={nextQ} style={{ width: '100%', padding: '16px', borderRadius: 14, border: 'none', background: isCorr ? `linear-gradient(135deg, ${T}, #15803D)` : `linear-gradient(135deg, ${N}, #1B5FBF)`, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: isCorr ? `0 4px 20px ${T}44` : `0 4px 20px ${N}44` }}>
              {qzIdx + 1 < total ? t.lesson.next_q : t.lesson.see_results}
            </button>
          )}

          {/* Dot progress */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 24, justifyContent: 'center' }}>
            {qs.map((q, i) => {
              const res = qzResults.find(r => r.id === q.id)
              return (
                <div key={q.id} style={{ width: 10, height: 10, borderRadius: '50%', background: res ? (res.correct ? T : '#EF4444') : i === qzIdx ? '#3B82F6' : '#CBD5E1', border: `1px solid ${res ? (res.correct ? T : '#EF4444') : i === qzIdx ? '#3B82F6' : '#CBD5E1'}`, transition: 'all 0.3s' }} />
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ── VOCABULARY phase ──────────────────────────────────────────
  if (phase === 'vocab') {
    const vw   = lesson.vocab[vocabIdx]
    const last = vocabIdx === lesson.vocab.length - 1
    return (
      <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif" }}>
        {renderHeader()}
        <div className="zku-lesson-pad" style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px 48px' }}>

          {/* Counter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: MU }}>
              Word {vocabIdx + 1} of {lesson.vocab.length}
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>{t.lesson.tap_flip}</div>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 5, marginBottom: 24 }}>
            {lesson.vocab.map((_, i) => (
              <div key={i} style={{
                height: 4, flex: 1, borderRadius: 99,
                background: i < vocabIdx ? T : i === vocabIdx ? N : '#E2E8F0',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>

          {/* Flashcard */}
          <div
            onClick={() => setFlipped(f => !f)}
            style={{
              background: flipped ? N : '#fff',
              borderRadius: 24, padding: '48px 36px',
              boxShadow: flipped ? `0 8px 32px rgba(0,56,118,0.25)` : '0 4px 20px rgba(0,56,118,0.1)',
              border: flipped ? 'none' : '1px solid rgba(0,56,118,0.1)',
              cursor: 'pointer', textAlign: 'center', marginBottom: 20,
              transition: 'all 0.3s ease',
              minHeight: 280, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            {!flipped ? (
              /* Front — English side */
              <>
                <div style={{ fontSize: 48, marginBottom: 12 }}>{vw.emoji}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: N, marginBottom: 4 }}>{vw.en}</div>
                <div style={{ fontSize: 13, color: '#7C3AED', fontWeight: 600, marginBottom: 4, letterSpacing: '0.04em' }}>{vw.ipa}</div>
                <div style={{ fontSize: 11, color: MU, marginBottom: 14, background: '#F1F5F9', borderRadius: 6, padding: '3px 10px' }}>{vw.pos}</div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, maxWidth: 300, textAlign: 'center', marginBottom: 14 }}>
                  {vw.definition}
                </div>
                <button onClick={e => { e.stopPropagation(); ttsVocab.toggle(vw.en, 'nova') }} style={{
                  display: 'flex', alignItems: 'center', gap: 5, background: ttsVocab.playing ? '#FEF3C7' : '#F0FDF4',
                  border: `1px solid ${ttsVocab.playing ? '#FCD34D' : '#86EFAC'}`, borderRadius: 8, padding: '6px 14px',
                  cursor: 'pointer', fontSize: 12, color: ttsVocab.playing ? '#D97706' : T, fontWeight: 600, fontFamily: 'inherit',
                }}>
                  <IcVolume size={13} color={ttsVocab.playing ? '#D97706' : T} />
                  {ttsVocab.loading ? 'Загрузка...' : ttsVocab.playing ? '⏸' : '▶ Listen'}
                </button>
                <div style={{ fontSize: 11, color: '#CBD5E1', marginTop: 16 }}>tap to see translation →</div>
              </>
            ) : (
              /* Back — Translation side */
              <>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Russian</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{vw.ru}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Kazakh</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: 'rgba(255,255,255,0.85)' }}>{vw.kz}</div>
                    </div>
                  </div>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', marginBottom: 12 }} />
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 14 }}>
                    "{vw.example}"
                  </div>
                  {vw.collocations.length > 0 && (
                    <div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Common phrases</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {vw.collocations.map(c => (
                          <span key={c} style={{ fontSize: 11, fontWeight: 600, color: '#fff', background: 'rgba(255,255,255,0.12)', borderRadius: 6, padding: '3px 8px' }}>{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 14, textAlign: 'center' }}>tap to flip back</div>
                </div>
              </>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 10 }}>
            {vocabIdx > 0 && (
              <button onClick={() => { setVocabIdx(i => i - 1); setFlipped(false) }} style={{
                padding: '12px 20px', borderRadius: 12, border: '1.5px solid rgba(0,56,118,0.2)',
                background: '#fff', color: N, fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>← Prev</button>
            )}
            <button onClick={() => {
              if (last) nextPhase()
              else { setVocabIdx(i => i + 1); setFlipped(false) }
            }} style={{
              flex: 1, padding: '12px', borderRadius: 12, border: 'none',
              background: last ? T : N,
              color: '#fff', fontSize: 13, fontWeight: 800,
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: `0 4px 16px rgba(0,56,118,0.25)`,
            }}>
              {last ? 'Go to Grammar →' : `Next word (${vocabIdx + 2}/${lesson.vocab.length}) →`}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── GRAMMAR phase (step-by-step) ──────────────────────────────
  if (phase === 'grammar') {
    const allLines = lesson.grammarNote.split('\n')

    // Parse note into paragraph sections
    const sections: string[][] = []
    let cur: string[] = []
    for (const ln of allLines) {
      if (ln.trim() === '') { if (cur.length) { sections.push(cur); cur = [] } } else cur.push(ln.trim())
    }
    if (cur.length) sections.push(cur)

    const introSecs  = sections.filter(s => !s.some(l => l.startsWith('⚠️') || l.startsWith('❌')) && !s.every(l => l.startsWith('💡') || l.startsWith('📌') || l.startsWith('🎯') || l.startsWith('🔧')))
    const mistakeSecs = sections.filter(s => s.some(l => l.startsWith('⚠️') || l.startsWith('❌') || l.startsWith('✅')) && !s.every(l => l.startsWith('✅')))
    const tipSecs    = sections.filter(s => s.every(l => l.startsWith('💡') || l.startsWith('📌') || l.startsWith('🎯') || l.startsWith('🔧') || l.trim() === ''))

    const steps: { type: string; label: string; emoji: string }[] = [
      { type: 'intro', label: t.lesson.grammar_theory ?? 'Теория', emoji: '📖' },
    ]
    if (lesson.grammarTable.length > 0) steps.push({ type: 'table', label: 'Формула', emoji: '📊' })
    if (lesson.grammarExtra.length > 0) steps.push({ type: 'extra', label: 'Паттерны', emoji: '🔍' })
    if (mistakeSecs.length > 0) steps.push({ type: 'mistakes', label: 'Ошибки', emoji: '⚠️' })
    if (lesson.grammarTip) steps.push({ type: 'tip', label: t.lesson.grammar_tip ?? 'Запомни', emoji: '💡' })

    const totalSteps = steps.length
    const curStep = Math.min(gramStep, totalSteps - 1)
    const stepInfo = steps[curStep]
    const isLast = curStep === totalSteps - 1

    const tableHeadersMap: Record<string, string[]> = {
      ru: ['Подлежащее', 'Глагол', 'Форма', 'Пример'],
      kz: ['Бастауыш', 'Етістік', 'Форма', 'Мысал'],
      en: ['Subject', 'Verb', 'Form', 'Example'],
    }
    const lng = (typeof window !== 'undefined' ? localStorage.getItem('zku-lang') || 'ru' : 'ru') as 'ru'|'kz'|'en'
    const headers = tableHeadersMap[lng] ?? tableHeadersMap.ru

    function renderLine(line: string, i: number) {
      if (line.startsWith('⚠️') || (line.startsWith('❌') && !line.includes('✅'))) return (
        <div key={i} style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 8, fontSize: 13.5, color: '#991B1B', fontWeight: 600, lineHeight: 1.65 }}>{line}</div>
      )
      if (line.startsWith('✅')) return (
        <div key={i} style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '10px 14px', marginBottom: 8, fontSize: 13.5, color: '#166534', fontWeight: 700, lineHeight: 1.65 }}>{line}</div>
      )
      if (line.startsWith('💡') || line.startsWith('📌') || line.startsWith('🎯') || line.startsWith('🔧')) return (
        <div key={i} style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '10px 14px', marginBottom: 8, fontSize: 13.5, color: '#92400E', fontWeight: 600, lineHeight: 1.65 }}>{line}</div>
      )
      if (/^[①②③④⑤⑥⑦⑧0-9]/.test(line)) return (
        <div key={i} style={{ paddingLeft: 14, marginBottom: 8, borderLeft: '3px solid rgba(0,56,118,0.18)', fontSize: 14, color: '#334155', lineHeight: 1.75, fontWeight: 500 }}>{line}</div>
      )
      return <div key={i} style={{ marginBottom: 6, fontSize: 14, color: '#334155', lineHeight: 1.75, fontWeight: 500 }}>{line}</div>
    }

    function goNext() {
      if (curStep < totalSteps - 1) setGramStep(s => s + 1)
      else { nextPhase(); setGramStep(0) }
    }

    return (
    <div style={{ minHeight: '100vh', background: '#F0F4FA', fontFamily: "'Montserrat', sans-serif" }}>
      {renderHeader()}
      <div style={{ maxWidth: 660, margin: '0 auto', padding: '20px 18px 80px' }}>

        {/* Topic header */}
        <div style={{ background: `linear-gradient(135deg, ${N}, #0055a4)`, borderRadius: 20, padding: '20px 24px', marginBottom: 14, boxShadow: `0 6px 24px ${N}33`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 5, position: 'relative' }}>
            {t.lesson.grammar_point ?? 'Grammar'}
          </div>
          <div style={{ fontSize: 19, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2, position: 'relative' }}>{lesson.grammarTitle}</div>
        </div>

        {/* Step tabs */}
        <div style={{ display: 'flex', gap: 5, marginBottom: 12, flexWrap: 'wrap' }}>
          {steps.map((s, i) => (
            <button key={i} onClick={() => setGramStep(i)} style={{
              padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none', fontFamily: 'inherit',
              background: i === curStep ? N : i < curStep ? '#DCFCE7' : '#fff',
              color: i === curStep ? '#fff' : i < curStep ? '#166534' : '#94A3B8',
              boxShadow: i === curStep ? `0 3px 10px ${N}44` : '0 1px 3px rgba(0,0,0,0.06)',
              transition: 'all 0.15s',
            }}>
              {i < curStep ? '✓' : s.emoji} {s.label}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div style={{ height: 4, background: '#E2E8F0', borderRadius: 99, marginBottom: 18, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((curStep + 1) / totalSteps) * 100}%`, background: `linear-gradient(90deg, ${N}, ${S})`, borderRadius: 99, transition: 'width 0.4s ease' }} />
        </div>

        {/* Step content card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '22px', border: '1px solid rgba(0,56,118,0.08)', boxShadow: '0 2px 16px rgba(0,56,118,0.07)', minHeight: 300 }}>

          {stepInfo.type === 'intro' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: '#EEF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📖</div>
                <span style={{ fontSize: 12, fontWeight: 800, color: N, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.lesson.grammar_theory ?? 'Теория'}</span>
              </div>
              {introSecs.map((sec, si) => (
                <div key={si} style={{ marginBottom: si < introSecs.length - 1 ? 14 : 0, paddingBottom: si < introSecs.length - 1 ? 14 : 0, borderBottom: si < introSecs.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  {sec.map((line, li) => renderLine(line, li))}
                </div>
              ))}
              {tipSecs.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  {tipSecs[0].map((line, li) => renderLine(line, li))}
                </div>
              )}
            </>
          )}

          {stepInfo.type === 'table' && lesson.grammarTable.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📊</div>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Формула и примеры</span>
              </div>
              <div className="zku-table-scroll">
              <div className="zku-grammar-wide" style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(124,58,237,0.15)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 0.9fr 2fr', background: '#7C3AED', padding: '10px 14px', gap: 6 }}>
                  {headers.map(h => <div key={h} style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</div>)}
                </div>
                {lesson.grammarTable.map((row, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 0.9fr 2fr', padding: '13px 14px', gap: 6, alignItems: 'center', background: i % 2 === 0 ? '#FAFAFF' : '#fff', borderTop: i > 0 ? '1px solid #EDE9FE' : 'none' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#7C3AED' }}>{row.subject}</span>
                    <span style={{ fontSize: 14, fontWeight: 900, color: N }}>{row.verb}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: T, background: '#DCFCE7', padding: '3px 8px', borderRadius: 6, display: 'inline-block' }}>{row.short}</span>
                    <span style={{ fontSize: 12, color: '#475569', fontStyle: 'italic', lineHeight: 1.55 }}>{row.example}</span>
                  </div>
                ))}
              </div>
              </div>
            </>
          )}

          {stepInfo.type === 'extra' && lesson.grammarExtra.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🔍</div>
                <span style={{ fontSize: 12, fontWeight: 800, color: S, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Доп. паттерны</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {lesson.grammarExtra.map(block => (
                  <div key={block.title} style={{ borderRadius: 14, border: `1.5px solid ${block.border}`, overflow: 'hidden' }}>
                    <div style={{ background: `${block.color}18`, padding: '9px 14px', borderBottom: `1px solid ${block.border}`, display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: block.color }} />
                      <span style={{ fontSize: 10, fontWeight: 800, color: block.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{block.title}</span>
                    </div>
                    {block.rows.map((row, ri) => (
                      <div key={row.form} style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', borderTop: ri > 0 ? `1px solid ${block.border}` : 'none' }}>
                        <div style={{ background: `${block.color}0C`, padding: '11px 14px', borderRight: `1px solid ${block.border}`, display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontSize: 12.5, fontWeight: 800, color: block.color, lineHeight: 1.45 }}>{row.form}</span>
                        </div>
                        <div style={{ background: '#fff', padding: '11px 14px', display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontSize: 12.5, color: '#475569', fontStyle: 'italic', lineHeight: 1.55 }}>{row.example}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}

          {stepInfo.type === 'mistakes' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚠️</div>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Типичные ошибки</span>
              </div>
              {mistakeSecs.map((sec, si) => (
                <div key={si} style={{ marginBottom: 14 }}>
                  {sec.map((line, li) => renderLine(line, li))}
                </div>
              ))}
            </>
          )}

          {stepInfo.type === 'tip' && lesson.grammarTip && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: `${G}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcStar size={20} color={G} /></div>
                <span style={{ fontSize: 12, fontWeight: 800, color: G, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.lesson.grammar_tip ?? 'Запомни'}</span>
              </div>
              <div style={{ background: `linear-gradient(135deg, ${G}10, ${G}05)`, border: `1.5px solid ${G}35`, borderRadius: 16, padding: '18px' }}>
                {lesson.grammarTip.split('\n').map((line, i) => {
                  if (line.trim() === '') return <div key={i} style={{ height: 6 }} />
                  if (line.includes('✅')) return <div key={i} style={{ color: '#166534', fontWeight: 700, marginBottom: 5, fontSize: 13.5, lineHeight: 1.65 }}>{line}</div>
                  if (line.includes('❌')) return <div key={i} style={{ color: '#991B1B', fontWeight: 700, marginBottom: 5, fontSize: 13.5, lineHeight: 1.65 }}>{line}</div>
                  return <div key={i} style={{ fontSize: 13.5, color: '#78350F', lineHeight: 1.75, fontWeight: 500, marginBottom: 3 }}>{line}</div>
                })}
              </div>
            </>
          )}

        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          {curStep > 0 && (
            <button onClick={() => setGramStep(s => s - 1)} style={{
              padding: '14px 20px', borderRadius: 14, border: '1.5px solid rgba(0,56,118,0.2)',
              background: '#fff', color: N, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}>← Назад</button>
          )}
          <button onClick={goNext} style={{
            flex: 1, padding: '15px', borderRadius: 14, border: 'none',
            background: isLast
              ? (lesson.exercises.length > 0 ? `linear-gradient(135deg, ${S}, #0067c7)` : `linear-gradient(135deg, ${N}, #0055a4)`)
              : `linear-gradient(135deg, ${N}, #0055a4)`,
            color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: `0 6px 20px ${N}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'transform 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none' }}>
            {isLast ? (
              lesson.exercises.length > 0
                ? <><IcArrowRight size={16} color="#fff" />{t.lesson.grammar_practice ?? 'Практика'} — {lesson.exercises.length} {t.lesson.exercises_label ?? 'заданий'}</>
                : <><IcCheck size={16} color="#fff" />{t.lesson.finish_lesson ?? 'Завершить урок'}</>
            ) : (
              <>Понятно! Дальше →</>
            )}
          </button>
        </div>
      </div>
    </div>
    )
  }

  // ── PRACTICE phase ────────────────────────────────────────────
  if (phase === 'practice') {
    const exs   = lesson.exercises
    const ex    = exs[exIdx]
    const total = exs.length
    const val   = ex.type === 'fill' ? exFill : exAnswer
    const isCorrect = exChecked && answersMatch(ex, val)
    const gapCount = (ex.text.match(/___/g) ?? []).length

    function checkEx() {
      if (!val) return
      if (isCorrect || exChecked) return
      setExChecked(true)
      if (answersMatch(ex, val)) setExScore(s => s + 1)
    }

    function nextEx() {
      if (exIdx + 1 < total) {
        setExIdx(i => i + 1)
        setExAnswer(''); setExFill(''); setExChecked(false)
      } else {
        nextPhase()
      }
    }

    return (
      <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif" }}>
        {renderHeader()}
        <div className="zku-lesson-pad" style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px 56px' }}>

          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 8, background: '#E2E8F0', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(exIdx / total) * 100}%`, background: S, borderRadius: 99, transition: 'width 0.3s' }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: S, flexShrink: 0 }}>{exIdx + 1} / {total}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: MU, background: '#EEF2F7', padding: '3px 10px', borderRadius: 8 }}>+{Math.round(lesson.xp / total)} XP</span>
          </div>

          {/* Exercise card */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px 32px', boxShadow: '0 2px 20px rgba(0,56,118,0.08)', border: '1px solid rgba(0,56,118,0.07)', marginBottom: 12 }}>

            {/* Instruction */}
            <div style={{ fontSize: 11, fontWeight: 700, color: S, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: gapCount > 0 ? 8 : 16 }}>
              {ex.instruction}
            </div>
            {ex.type === 'fill' && gapCount > 0 && (
              <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', lineHeight: 1.45, marginBottom: 16 }}>
                {t.lesson.fill_gap_hint}
              </div>
            )}

            {/* Sentence — one gap is an inline field, so it is obvious the rest stays */}
            {ex.type === 'fill' && gapCount === 1 ? (
              <div style={{ fontSize: 20, fontWeight: 800, color: N, lineHeight: 1.8, marginBottom: 8 }}>
                {ex.text.split('___').map((part, i, parts) => (
                  <span key={i}>
                    {part}
                    {i < parts.length - 1 && (
                      <input
                        autoFocus
                        aria-label={t.lesson.fill_gap_hint}
                        value={exFill}
                        onChange={e => !exChecked && setExFill(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !exChecked && checkEx()}
                        disabled={exChecked}
                        placeholder="…"
                        style={{
                          display: 'inline-block',
                          width: `${Math.min(24, Math.max(7, exFill.length + 1))}ch`,
                          maxWidth: '100%',
                          margin: '0 6px',
                          padding: '2px 8px',
                          borderRadius: 8,
                          fontSize: 18,
                          fontFamily: 'inherit',
                          fontWeight: 700,
                          outline: 'none',
                          verticalAlign: 'baseline',
                          border: `2px solid ${exChecked ? (isCorrect ? T : '#EF4444') : 'rgba(0,56,118,0.25)'}`,
                          background: exChecked ? (isCorrect ? '#F0FDF4' : '#FEF2F2') : '#FAFBFD',
                          color: N,
                        }}
                      />
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 20, fontWeight: 800, color: N, lineHeight: 1.6, marginBottom: 24 }}>
                {ex.text}
              </div>
            )}

            {/* Input — separate box only when the gap is not already inline */}
            {ex.type === 'fill' && gapCount !== 1 ? (
              <input
                autoFocus
                value={exFill}
                onChange={e => !exChecked && setExFill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !exChecked && checkEx()}
                disabled={exChecked}
                placeholder={t.lesson.type_answer_ph}
                style={{
                  width: '100%', padding: '14px 18px', borderRadius: 12, boxSizing: 'border-box',
                  fontSize: 16, fontFamily: 'inherit', fontWeight: 600, outline: 'none',
                  border: `2px solid ${exChecked ? (isCorrect ? T : '#EF4444') : 'rgba(0,56,118,0.2)'}`,
                  background: exChecked ? (isCorrect ? '#F0FDF4' : '#FEF2F2') : '#FAFBFD',
                  color: N, transition: 'all 0.2s',
                }}
              />
            ) : ex.type !== 'fill' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ex.opts?.map((opt, oi) => {
                  const isSel  = exAnswer === opt
                  const isCorr = opt.toLowerCase() === ex.correct.toLowerCase()
                  let bg = '#F8FAFC', border = 'rgba(0,56,118,0.1)', tc = '#334155'
                  if (exChecked) {
                    if (isCorr)     { bg = '#F0FDF4'; border = T;          tc = T }
                    else if (isSel) { bg = '#FEF2F2'; border = '#EF4444';  tc = '#EF4444' }
                  } else if (isSel) { bg = '#EFF6FF'; border = S;          tc = N }
                  return (
                    <button key={opt} onClick={() => !exChecked && setExAnswer(opt)} style={{
                      padding: '14px 18px', borderRadius: 12, border: `2px solid ${border}`,
                      background: bg, color: tc, fontSize: 15, fontWeight: 700,
                      textAlign: 'left', cursor: exChecked ? 'default' : 'pointer',
                      fontFamily: 'inherit', transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                      <span style={{
                        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                        background: exChecked ? (isCorr ? T : isSel ? '#EF4444' : '#E2E8F0') : isSel ? S : '#E2E8F0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: (exChecked && (isCorr || isSel)) || (!exChecked && isSel) ? '#fff' : '#94A3B8',
                        fontSize: 11, fontWeight: 800, transition: 'all 0.15s',
                      }}>
                        {exChecked && isCorr   ? <IcCheck size={14} color="#fff" />
                         : exChecked && isSel  ? <IcX     size={14} color="#fff" />
                         : String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>

          {/* Feedback */}
          {exChecked && (
            <div style={{
              background: isCorrect ? '#F0FDF4' : '#FEF2F2',
              border: `1px solid ${isCorrect ? '#86EFAC' : '#FECACA'}`,
              borderRadius: 14, padding: '14px 18px', marginBottom: 12,
              display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <div style={{ flexShrink: 0, marginTop: 1 }}>
                {isCorrect ? <IcCheck size={16} color={T} /> : <IcX size={16} color="#EF4444" />}
              </div>
              <div>
                <div style={{ fontWeight: 800, color: isCorrect ? T : '#EF4444', marginBottom: 3 }}>
                  {isCorrect ? t.lesson.correct : `${t.lesson.wrong_with_answer} "${ex.correct}"`}
                </div>
                <div style={{ fontSize: 13, color: '#475569' }}>{ex.hint}</div>
              </div>
            </div>
          )}

          {/* Button */}
          {!exChecked ? (
            <button onClick={checkEx} disabled={!val} style={{
              width: '100%', padding: '15px', borderRadius: 14, border: 'none',
              background: val ? S : '#E2E8F0',
              color: '#fff', fontSize: 14, fontWeight: 800,
              cursor: val ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
              boxShadow: val ? `0 4px 18px ${S}44` : 'none',
              transition: 'all 0.2s',
            }}>
              Check answer
            </button>
          ) : (
            <button onClick={nextEx} style={{
              width: '100%', padding: '15px', borderRadius: 14, border: 'none',
              background: T, color: '#fff', fontSize: 14, fontWeight: 800,
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: `0 4px 18px ${T}44`,
            }}>
              {exIdx + 1 < total ? `Next exercise →` : `Finish Practice →`}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── QUIZ phase ────────────────────────────────────────────────
  if (phase === 'quiz') return (
    <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif" }}>
      {renderHeader()}
      <div className="zku-lesson-pad" style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 48px' }}>

        {/* Question counter + progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: MU }}>
            Question {qIdx + 1} <span style={{ color: '#94A3B8' }}>/ {total}</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: N, background: '#EEF2F7', padding: '4px 10px', borderRadius: 8 }}>
            +{Math.round(lesson.xp / total)} XP
          </div>
        </div>

        <div style={{ height: 6, background: '#E2E8F0', borderRadius: 99, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ height: '100%', width: `${((qIdx + (checked ? 1 : 0)) / total) * 100}%`, background: N, borderRadius: 99, transition: 'width 0.35s ease' }} />
        </div>

        {/* Question card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '28px', boxShadow: '0 2px 16px rgba(0,56,118,0.07)', marginBottom: 14, border: '1px solid rgba(0,56,118,0.07)' }}>

          {/* Q type badge */}
          <div style={{ marginBottom: 16 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
              padding: '4px 10px', borderRadius: 6,
              background: q.type === 'mc' ? '#EEF2F7' : q.type === 'tf' ? '#DCFCE7' : '#EDE9FE',
              color: q.type === 'mc' ? N : q.type === 'tf' ? T : '#7C3AED',
            }}>
              {q.type === 'mc' ? t.lesson.mc_type : q.type === 'tf' ? t.lesson.tf_type : t.lesson.fill_type}
            </span>
          </div>

          <div style={{ fontSize: 19, fontWeight: 800, color: N, lineHeight: 1.5, marginBottom: q.type === 'fill' && q.text.includes('___') ? 8 : 24 }}>
            {q.text}
          </div>
          {q.type === 'fill' && q.text.includes('___') && (
            <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', lineHeight: 1.45, marginBottom: 16 }}>
              {t.lesson.fill_gap_hint}
            </div>
          )}

          {/* Fill blank */}
          {q.type === 'fill' ? (
            <input
              autoFocus
              value={checked ? answers[q.id] ?? '' : fillVal}
              onChange={e => !checked && setFillVal(e.target.value)}
              placeholder={t.lesson.type_answer_ph}
              disabled={checked}
              onKeyDown={e => e.key === 'Enter' && !checked && check()}
              style={{
                width: '100%', padding: '14px 18px', borderRadius: 12, boxSizing: 'border-box',
                fontSize: 16, fontFamily: 'inherit', outline: 'none', fontWeight: 600,
                border: `2px solid ${checked ? (correct ? T : '#EF4444') : 'rgba(0,56,118,0.2)'}`,
                background: checked ? (correct ? '#F0FDF4' : '#FEF2F2') : '#FAFBFD',
                color: N, transition: 'border-color 0.2s',
              }}
            />
          ) : (
            /* MC / TF options */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.opts?.map((opt, oi) => {
                const isSel  = answer === opt
                const isCorr = opt === q.correct
                let bg = '#F8FAFC', border = 'rgba(0,56,118,0.1)', tc = '#334155'
                if (checked) {
                  if (isCorr)         { bg = '#F0FDF4'; border = T;        tc = T }
                  else if (isSel)     { bg = '#FEF2F2'; border = '#EF4444'; tc = '#EF4444' }
                } else if (isSel)     { bg = '#EFF6FF'; border = S;        tc = N }

                return (
                  <button key={opt} onClick={() => select(opt)} style={{
                    padding: '14px 18px', borderRadius: 12, border: `2px solid ${border}`,
                    background: bg, color: tc, fontSize: 14, fontWeight: 600,
                    textAlign: 'left', cursor: checked ? 'default' : 'pointer',
                    fontFamily: 'inherit', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: checked ? (isCorr ? T : isSel ? '#EF4444' : '#E2E8F0') : isSel ? S : '#E2E8F0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: (checked && (isCorr || isSel)) || (!checked && isSel) ? '#fff' : '#94A3B8',
                      fontSize: 11, fontWeight: 800,
                    }}>
                      {checked && isCorr   ? <IcCheck size={14} color="#fff" />
                       : checked && isSel  ? <IcX     size={14} color="#fff" />
                       : String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Feedback */}
        {checked && (
          <div style={{
            background: correct ? '#F0FDF4' : '#FEF2F2',
            border: `1px solid ${correct ? '#86EFAC' : '#FECACA'}`,
            borderRadius: 14, padding: '14px 18px', marginBottom: 14,
          }}>
            <div style={{ fontWeight: 800, color: correct ? T : '#EF4444', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              {correct ? <IcCheck size={16} color={T} /> : <IcX size={16} color="#EF4444" />}
              {correct ? t.lesson.correct : t.lesson.wrong}
            </div>
            <div style={{ fontSize: 13, color: '#475569' }}>{q.hint}</div>
          </div>
        )}

        {/* Button */}
        {!checked ? (
          <button onClick={check} disabled={!answer && !fillVal} style={{
            width: '100%', padding: '15px', borderRadius: 14, border: 'none',
            background: (answer || fillVal) ? N : '#E2E8F0',
            color: '#fff', fontSize: 14, fontWeight: 800,
            cursor: (answer || fillVal) ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
            boxShadow: (answer || fillVal) ? '0 4px 18px rgba(0,56,118,0.28)' : 'none',
            transition: 'all 0.2s',
          }}>{t.lesson.check}</button>
        ) : (
          <button onClick={next} style={{
            width: '100%', padding: '15px', borderRadius: 14, border: 'none',
            background: T, color: '#fff', fontSize: 14, fontWeight: 800,
            cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 4px 18px rgba(29,158,117,0.3)',
          }}>
            {qIdx + 1 < total ? `${t.lesson.next} (${qIdx + 2}/${total})` : t.lesson.see_results}
          </button>
        )}
      </div>
    </div>
  )

  // ── DONE phase ────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <div style={{ background: '#fff', borderRadius: 28, padding: '48px 36px', boxShadow: '0 8px 40px rgba(0,56,118,0.12)', textAlign: 'center', border: '1px solid rgba(0,56,118,0.07)' }}>

          {/* Trophy */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <IcAward size={80} color={G} />
          </div>

          <div style={{ fontSize: 12, color: MU, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            {t.lesson.lesson_complete}
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: N, marginBottom: 6, letterSpacing: '-0.02em' }}>
            {t.lesson.well_done}
          </div>
          <div style={{ fontSize: 14, color: MU, marginBottom: 32 }}>
            {lesson.title} · Module {lesson.moduleNum}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 32 }}>
            {[
              { v: `${lesson.duration} min`, l: t.common.label_read, color: N },
              { v: `+${lesson.xp}`,          l: t.lesson.xp_earned, color: G },
            ].map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 11, color: MU, marginTop: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* XP bar */}
          <div style={{ height: 8, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden', marginBottom: 32 }}>
            <div style={{ height: '100%', width: '100%', background: `linear-gradient(90deg, ${G}, #F59E0B)`, borderRadius: 99 }} />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {renderLevelCert()}
            {lesson.vocab.length > 0 && (
              <Link href={`/english/zku/student/vocab/lesson/${id}`} style={{
                padding: '14px', borderRadius: 12, border: 'none',
                background: `linear-gradient(135deg, #0F766E, #1D9E75)`, color: '#fff', fontSize: 13, fontWeight: 700,
                textDecoration: 'none', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(29,158,117,0.3)',
              }}>
                <IcBook size={16} color="#fff" /> {t.module.vocab_study} ({lesson.vocab.length} {t.module.words_word})
              </Link>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setPhase('reading')} style={{
                flex: 1, padding: '12px', borderRadius: 12,
                border: '1.5px solid rgba(0,56,118,0.2)',
                background: '#fff', color: N, fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                {t.module.re_read}
              </button>
              <Link href={moduleUrl} style={{
                flex: 2, padding: '12px', borderRadius: 12, border: 'none',
                background: N, color: '#fff', fontSize: 13, fontWeight: 700,
                textDecoration: 'none', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 6,
                boxShadow: '0 4px 16px rgba(0,56,118,0.28)',
              }}>
                {t.lesson.back_to_module} <IcArrowRight size={14} color="#fff" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}