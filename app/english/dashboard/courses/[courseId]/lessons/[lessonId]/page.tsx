'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createEnglishClient } from '@/lib/english/supabase-client'
import ContentProtection from '@/components/english/ContentProtection'
import { SecureAudio } from '@/components/english/lms/shared/SecureMedia'
import GameQuiz, { type GameQuizQuestion } from '@/components/english/quiz/GameQuiz'
import VocabFlashcards from './VocabFlashcards'

type Lesson = {
  id: string
  course_id: string
  title: string
  lesson_order: number
  reading_text: string | null
  writing_task: string | null
  listening_url: string | null
  listening_transcript: string | null
  vocabulary: VocabItem[] | null
}

type VocabItem = { en: string; ru: string }

type GrammarRow      = { pronoun: string; form: string; short: string; example: string }
type NegationRow     = { full: string; short: string }
type AlphabetRow     = { letter: string; name: string; examples: string[] }
type ReadingRule     = { combo: string; sound: string; note: string }
type GrammarExercise = {
  type: 'multiple_choice' | 'true_false' | 'word_order' | 'free_input' | 'error_correction' | 'fill_blank' | 'academic_writing'
  question: string
  options?: string[]
  answer: string
  explanation?: string
  tip?: string
}
type UsageRow      = { pronoun: string; rule: string; examples: string[] }
type StructureRow  = { type: string; pattern: string; example: string }
type DialogueLine  = { speaker: string; text: string }
type Dialogue      = { title: string; lines: DialogueLine[] }
type NounType      = { type: string; examples: string[] }
type PluralExample = { singular: string; plural: string; note?: string; change?: string }
type PluralRule    = { rule: string; explanation: string; examples: PluralExample[] }
type TrickyWord        = { word: string; article: string; reason: string }
type Comparison        = { indefinite: string; definite: string; note: string }
type RuEnRow           = { russian: string; wrong_english: string; correct_english: string; note: string }
type RuEngRow          = { russian: string; english: string; note: string }
type ItUsageRow        = { context: string; example: string; translation: string }
type CommonMistake     = { wrong: string; correct: string; explanation: string }
type AdjectivePosition = { type: string; pattern: string; examples: { sentence: string; translation: string }[] }
type OrderRow          = { position: number; category: string; examples: string }
type AdjCategory       = { category: string; examples: string[]; academic: string[] }
type UpgradeRow        = { basic: string; academic: string[] }
type SuffixRow         = { suffix: string; meaning: string; examples: string[] }
type SvoRow            = { russian: string; english: string; structure?: string; note?: string }
type SvomptRow         = { element: string; name: string; russian: string; example: string }
type QuestionPair      = { statement: string; question: string; breakdown?: string; wrong?: string; correct?: string; note?: string }
type QuestionType      = { type: string; pattern: string; pairs?: QuestionPair[]; examples?: QuestionPair[] }
type AdverbPair        = { wrong: string; correct: string }
type AdverbType        = { type: string; rule: string; pairs: AdverbPair[] }
type Contraction       = { full: string; short: string }
type NumberEntry       = { num: number; word: string; note?: string }
type NumberGroup       = { group: string; numbers?: NumberEntry[]; examples?: NumberEntry[]; note?: string }
type AcademicRule      = { rule: string; examples: { correct?: string; wrong?: string; note?: string; british?: string; american?: string }[] }
type MeasUnit          = { unit: string; full: string; example: string }
type MeasCategory      = { type: string; units: MeasUnit[] }
type DecimalRow        = { written: string; spoken: string }
type TimeContext       = { context: string; examples: { written: string; spoken: string; note?: string }[] }
type AcademicUse       = { use: string; examples: string[] }
type ArticleRule   = {
  rule: string; explanation: string
  table?: Record<string, string>[]
  usage?: string[]
  examples?: { sentence: string; translation?: string; note?: string }[]
  note?: string; tricky?: TrickyWord[]
  comparison?: Comparison[] | RuEngRow[]
  with_the?: string[]; without_article?: string[]
  it_usage?: ItUsageRow[]; ru_en_comparison?: RuEnRow[]
  positions?: AdjectivePosition[]
  order?: OrderRow[]; memory_tip?: string
  categories?: AdjCategory[]; upgrades?: UpgradeRow[]; suffixes?: SuffixRow[]
  groups?: NumberGroup[]
  pronunciation_rules?: string[]; spelling_rules?: string[]
  academic_rules?: AcademicRule[]
  measurement_categories?: MeasCategory[]
  reading_decimals?: DecimalRow[]
  contexts?: TimeContext[]
  academic_uses?: AcademicUse[]
  svo_comparison?: SvoRow[]
  extended_examples?: { sentence: string; breakdown: string }[]
  svompt_order?: SvomptRow[]
  question_types?: QuestionType[]
  adverb_types?: AdverbType[]
  contractions?: Contraction[]
  inversion_adverbs?: string[]
}

type GrammarContent = {
  title?: string
  explanation?: string
  academic_intro?: string
  table?: GrammarRow[]
  negation?: NegationRow[]
  questions?: string[]
  notes?: string[]
  exercises?: GrammarExercise[]
  alphabet?: AlphabetRow[]
  vowels?: string[]
  rules?: ReadingRule[] | PluralRule[] | ArticleRule[]
  usage?: UsageRow[]
  structures?: StructureRow[]
  dialogues?: Dialogue[]
  noun_types?: NounType[]
  academic_examples?: string[]
  common_mistakes?: CommonMistake[]
}

// B1+ grammar content types
type B1GrammarCategory = { group: string; verbs: string[]; examples: string[] }
type B1GrammarPair     = { verb: string; gerund: string; infinitive: string; note: string }
type B1GrammarTableRow = { verb: string; gerund_meaning: string; gerund_example: string; infinitive_meaning: string; infinitive_example: string }
type B1GrammarUse      = { pattern: string; examples: string[] }
type B1Section         = { heading: string; rule: string; categories?: B1GrammarCategory[]; pairs?: B1GrammarPair[]; table?: B1GrammarTableRow[]; uses?: B1GrammarUse[] }
type B1CommonError     = { wrong: string; correct: string; note: string }
type B1MCQuestion      = { id: number; sentence: string; options: string[]; answer: string; explanation: string }
type B1FIBSentence     = { id: number; text: string; answer: string }
type B1ECItem          = { id: number; wrong: string; correct: string; explanation: string }
type B1MDQuestion      = { id: number; context: string; options: string[]; answer: string; explanation: string }
type B1MCExercise      = { type: 'multiple_choice';   instruction: string; questions: B1MCQuestion[] }
type B1FIBExercise     = { type: 'fill_in_blank';     instruction: string; sentences: B1FIBSentence[] }
type B1ECExercise      = { type: 'error_correction';  instruction: string; sentences: B1ECItem[] }
type B1MDExercise      = { type: 'meaning_difference'; instruction: string; questions: B1MDQuestion[] }
type B1GrammarContent  = { title: string; explanation?: string; sections: B1Section[]; common_errors: B1CommonError[]; exercises: (B1MCExercise | B1FIBExercise | B1ECExercise | B1MDExercise)[] }

type VocabWord = { word: string; translation: string; part_of_speech: string; example: string; example_translation: string }
type VocabMatchEx    = { type: 'match';           instruction: string; pairs:     { word: string; translation: string }[] }
type VocabFIBEx      = { type: 'fill_in_blank';   instruction: string; sentences: { id: number; text: string; answer: string; options: string[] }[] }
type VocabMCEx       = { type: 'multiple_choice'; instruction: string; questions: { id: number; word: string; options: string[]; answer: string }[] }
type VocabularyContent = { title: string; words: VocabWord[]; exercises: (VocabMatchEx | VocabFIBEx | VocabMCEx)[] }

type ReadingContent = {
  title: string
  passage: string
  true_false: { id: number; statement: string; answer: boolean }[]
  multiple_choice: { id: number; question: string; options: string[]; answer: string }[]
  fill_in_blank: {
    instruction: string
    sentences: { id: number; text: string; answer: string }[]
  }
}

type B1RdQuestion   = { id: number; question: string; options: string[]; answer: string; explanation: string }
type B1RdTFQuestion = { id: number; statement: string; answer: boolean; evidence: string }
type B1RdVIC        = { id: number; sentence: string; options: string[]; answer: string; explanation: string }
type B1RdCT         = { id: number; question: string; suggested_answer: string }
type B1RdGlossary   = { term: string; definition: string; translation: string }
type B1ReadingContent = {
  title: string
  text: string
  glossary: B1RdGlossary[]
  comprehension_questions: B1RdQuestion[]
  true_false_questions: B1RdTFQuestion[]
  vocabulary_in_context: B1RdVIC[]
  critical_thinking: B1RdCT[]
}

type SectionRow = { type: string; content: GrammarContent | ReadingContent | null }

type ListeningType     = 'match' | 'true_false' | 'speaker_match' | 'fill_blank' | 'ordering' | 'multiple_choice'
type ListeningOption   = { letter: string; text: string }
type ListeningQuestion = { id: number; question: string; options?: ListeningOption[]; answer: string | number; prefix?: string; suffix?: string }
type ListeningContent  = { audio_url: string; title: string; type: ListeningType; instructions: string; questions: ListeningQuestion[]; options?: string[] }

type QuizQuestion = GameQuizQuestion

type Tab = 'grammar' | 'reading' | 'listening' | 'vocabulary' | 'writing' | 'quiz'

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'grammar',    label: 'Grammar',    icon: '🧠' },
  { key: 'reading',    label: 'Reading',    icon: '📖' },
  { key: 'listening',  label: 'Listening',  icon: '🎧' },
  { key: 'vocabulary', label: 'Vocabulary', icon: '📝' },
  { key: 'writing',    label: 'Writing',    icon: '✍️' },
  { key: 'quiz',       label: 'Quiz',       icon: '✅' },
]


function GrammarExerciseItem({ ex, num }: { ex: GrammarExercise; num: number }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)

  return (
    <div style={{ borderRadius: 14, border: '1px solid rgba(27,143,196,0.09)', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', background: 'rgba(27,143,196,0.04)', fontSize: 13, fontWeight: 800, color: '#1B3A6B' }}>
        {num}. {ex.question}
      </div>

      <div style={{ padding: '12px 16px' }}>
        {ex.type === 'multiple_choice' && ex.options && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ex.options.map(opt => {
              const isSelected = selected === opt
              const isCorrect  = opt === ex.answer
              const bg = revealed
                ? isCorrect ? 'rgba(16,185,129,0.12)' : isSelected ? 'rgba(239,68,68,0.08)' : '#f8fafc'
                : isSelected ? 'rgba(27,143,196,0.10)' : '#f8fafc'
              const border = revealed
                ? isCorrect ? '1.5px solid rgba(16,185,129,0.5)' : isSelected ? '1.5px solid rgba(239,68,68,0.4)' : '1px solid rgba(27,143,196,0.09)'
                : isSelected ? '1.5px solid rgba(27,143,196,0.4)' : '1px solid rgba(27,143,196,0.09)'
              return (
                <button key={opt} onClick={() => { if (!revealed) { setSelected(opt); setRevealed(true) } }}
                  style={{ padding: '8px 18px', borderRadius: 10, border, background: bg, fontSize: 14, fontWeight: 800, cursor: revealed ? 'default' : 'pointer', color: revealed && isCorrect ? '#10b981' : revealed && isSelected ? '#ef4444' : '#1B3A6B', transition: 'all 0.15s' }}>
                  {opt} {revealed && isCorrect && '✓'}{revealed && isSelected && !isCorrect && '✗'}
                </button>
              )
            })}
          </div>
        )}

        {ex.type === 'true_false' && (
          <div style={{ display: 'flex', gap: 8 }}>
            {['correct', 'wrong'].map(opt => {
              const label = opt === 'correct' ? '✓ Верно' : '✗ Неверно'
              const isSelected = selected === opt
              const isCorrect  = opt === ex.answer
              const bg = revealed ? isCorrect ? 'rgba(16,185,129,0.12)' : isSelected ? 'rgba(239,68,68,0.08)' : '#f8fafc' : isSelected ? 'rgba(27,143,196,0.10)' : '#f8fafc'
              return (
                <button key={opt} onClick={() => { if (!revealed) { setSelected(opt); setRevealed(true) } }}
                  style={{ padding: '8px 18px', borderRadius: 10, border: revealed && isCorrect ? '1.5px solid rgba(16,185,129,0.5)' : '1px solid rgba(27,143,196,0.09)', background: bg, fontSize: 14, fontWeight: 800, cursor: revealed ? 'default' : 'pointer', color: '#1B3A6B' }}>
                  {label}
                </button>
              )
            })}
            {revealed && ex.explanation && (
              <span style={{ fontSize: 13, color: '#10b981', fontWeight: 700, alignSelf: 'center', marginLeft: 8 }}>{ex.explanation}</span>
            )}
          </div>
        )}

        {ex.type === 'academic_writing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <textarea placeholder="Напишите ваш ответ здесь..." rows={4}
              style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1.5px solid rgba(27,143,196,0.18)', fontSize: 14, fontWeight: 600, color: '#1B3A6B', resize: 'vertical', outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }} />
            {ex.tip && <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, padding: '8px 12px', background: 'rgba(27,143,196,0.05)', borderRadius: 10 }}>💡 {ex.tip}</div>}
          </div>
        )}

        {(ex.type === 'fill_blank' || ex.type === 'word_order' || ex.type === 'free_input' || ex.type === 'error_correction') && (
          <div>
            {!revealed ? (
              <button onClick={() => setRevealed(true)} style={{ padding: '8px 18px', borderRadius: 10, border: '1px solid rgba(27,143,196,0.20)', background: 'rgba(27,143,196,0.06)', fontSize: 13, fontWeight: 800, color: '#1B8FC4', cursor: 'pointer' }}>
                Показать ответ
              </button>
            ) : (
              <div style={{ fontSize: 14, fontWeight: 800, color: '#10b981', padding: '10px 14px', background: 'rgba(16,185,129,0.08)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.20)' }}>
                ✓ {ex.answer}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function LessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const router = useRouter()

  const [lesson,    setLesson]    = useState<Lesson | null>(null)
  const [sections,  setSections]  = useState<SectionRow[]>([])
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading,   setLoading]   = useState(true)
  const [userId,    setUserId]    = useState<string | null>(null)
  const [userName,  setUserName]  = useState<string | undefined>(undefined)
  const [tab,       setTab]       = useState<Tab>('grammar')
  const [isESP,     setIsESP]     = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const sessionStartRef = useRef<number>(Date.now())

  // B1 grammar exercises state
  const [b1MC,      setB1MC]      = useState<Record<number, string>>({})
  const [b1FIB,     setB1FIB]     = useState<Record<number, string>>({})
  const [b1MD,      setB1MD]      = useState<Record<number, string>>({})
  const [b1ECShow,  setB1ECShow]  = useState<Record<number, boolean>>({})
  const [b1Checked, setB1Checked] = useState(false)

  // Vocabulary exercises state
  const [vocMatchSel,   setVocMatchSel]   = useState<string | null>(null)
  const [vocMatchPairs, setVocMatchPairs] = useState<Record<string, string>>({})
  const [vocFIB,        setVocFIB]        = useState<Record<number, string>>({})
  const [vocMC,         setVocMC]         = useState<Record<number, string>>({})
  const [vocChecked,    setVocChecked]    = useState(false)

  // Reading exercises state (A1)
  const [rdTF,      setRdTF]      = useState<Record<number, boolean | null>>({})
  const [rdMC,      setRdMC]      = useState<Record<number, string>>({})
  const [rdFIB,     setRdFIB]     = useState<Record<number, string>>({})
  const [rdChecked, setRdChecked] = useState(false)

  // B1 reading exercises state
  const [b1RdMC,      setB1RdMC]      = useState<Record<number, string>>({})
  const [b1RdTF,      setB1RdTF]      = useState<Record<number, boolean | null>>({})
  const [b1RdVIC,     setB1RdVIC]     = useState<Record<number, string>>({})
  const [b1RdCTShow,  setB1RdCTShow]  = useState<Record<number, boolean>>({})
  const [b1RdChecked, setB1RdChecked] = useState(false)

  // Writing
  const [writingText,  setWritingText]  = useState('')
  const [writingSaved, setWritingSaved] = useState(false)

  const [listenAnswers, setListenAnswers] = useState<Record<number, string>>({})
  const [listenChecked, setListenChecked] = useState(false)
  const [listenPlayed,  setListenPlayed]  = useState(false)

  // Quiz data
  const [quizId,        setQuizId]       = useState<string | null>(null)
  const [passThreshold, setPassThreshold] = useState(90)

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) { router.push('/english/login'); return }
      setUserId(user.id)
      supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle().then((r: { data: { full_name?: string } | null }) => {
        if (r.data) setUserName(r.data.full_name ?? user.email?.split('@')[0])
      })
      sessionStartRef.current = Date.now()

      // Start study session tracking
      supabase.from('english_study_sessions').insert({
        user_id: user.id,
        lesson_id: lessonId,
        started_at: new Date().toISOString(),
      }).select('id').single().then((r: { data: { id: string } | null }) => {
        if (r.data) setSessionId(r.data.id)
      })

      const [lessonRes, sectionsRes, questionsRes, progRes, courseRes] = await Promise.all([
        supabase.from('english_lessons').select('*').eq('id', lessonId).single(),
        supabase.from('english_lesson_sections').select('type, content').eq('lesson_id', lessonId).order('order_index'),
        supabase.from('english_quizzes').select('id,pass_threshold,questions').eq('lesson_id', lessonId).maybeSingle(),
        supabase.from('english_progress').select('attempts').eq('user_id', user.id).eq('lesson_id', lessonId).maybeSingle(),
        supabase.from('english_courses').select('category').eq('id', courseId).single(),
      ])
      if ((courseRes.data as { category: string } | null)?.category === 'English for Special Purposes') {
        setIsESP(true)
        setTab('vocabulary')
      }
      setSections((sectionsRes.data ?? []) as SectionRow[])

      if (lessonRes.data) {
        const raw = lessonRes.data as Lesson & { vocabulary: unknown }
        const vocab: VocabItem[] | null = (() => {
          if (!raw.vocabulary) return null
          if (Array.isArray(raw.vocabulary)) return raw.vocabulary as VocabItem[]
          try { return JSON.parse(raw.vocabulary as unknown as string) as VocabItem[] } catch { return null }
        })()
        setLesson({ ...raw, vocabulary: vocab })
      }

      const quizRow = questionsRes.data as { id: string; pass_threshold: number; questions: QuizQuestion[] } | null
      if (quizRow) {
        setQuizId(quizRow.id)
        setPassThreshold(quizRow.pass_threshold ?? 90)
        setQuestions(quizRow.questions ?? [])
      }
      setLoading(false)
    }
    load()
  }, [lessonId, router])

  // Close study session on unmount
  useEffect(() => {
    return () => {
      const sid = sessionId
      const mins = Math.round((Date.now() - sessionStartRef.current) / 60000)
      if (sid && mins > 0) {
        createEnglishClient().from('english_study_sessions').update({
          ended_at: new Date().toISOString(),
          duration_minutes: mins,
        }).eq('id', sid).then(() => {})
      }
    }
  }, [sessionId])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 700 }}>Загрузка урока...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>😕</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0c4a6e', marginBottom: 16 }}>Урок не найден</div>
          <button className="btn-primary" onClick={() => router.push(`/english/dashboard/courses/${courseId}`)}>← Назад</button>
        </div>
      </div>
    )
  }

  return (
    <ContentProtection userId={userId ?? undefined} userName={userName}>
    <div style={{ background: '#F5F9FD', minHeight: '100vh' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 24px 48px', position: 'relative', zIndex: 1 }}>

        {/* LESSON TITLE */}
        <div className="fade-up" style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.03em', margin: 0 }}>
            {lesson.title}
          </h1>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
          {(isESP ? TABS.filter(t => t.key === 'vocabulary') : TABS).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 18px', borderRadius: 12,
                border: tab === t.key ? '2px solid rgba(14,165,233,0.5)' : '1.5px solid rgba(14,165,233,0.15)',
                background: tab === t.key ? 'rgba(14,165,233,0.08)' : '#fff',
                color: tab === t.key ? '#0284c7' : '#94a3b8',
                fontWeight: tab === t.key ? 900 : 700,
                fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >

            {/* GRAMMAR */}
            {tab === 'grammar' && (() => {
              const g = (sections.find(s => s.type === 'grammar')?.content ?? null) as GrammarContent | null
              if (!g || !g.title) return (
                <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.10)', padding: 40, textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🚧</div>
                  <div style={{ color: '#94a3b8', fontWeight: 700 }}>Grammar content coming soon</div>
                </div>
              )

              // ── B1+ format (has sections field) ──────────────────────────
              const b1 = g as unknown as B1GrammarContent
              if (b1.sections?.length) {
                const b1MC_ex  = b1.exercises?.find(e => e.type === 'multiple_choice')   as B1MCExercise  | undefined
                const b1FIB_ex = b1.exercises?.find(e => e.type === 'fill_in_blank')     as B1FIBExercise | undefined
                const b1EC_ex  = b1.exercises?.find(e => e.type === 'error_correction')  as B1ECExercise  | undefined
                const b1MD_ex  = b1.exercises?.find(e => e.type === 'meaning_difference') as B1MDExercise | undefined
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Title + explanation */}
                    <div className="glass-card" style={{ padding: '24px 28px' }}>
                      <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1B3A6B', letterSpacing: '-0.03em', margin: '0 0 14px' }}>{b1.title}</h2>
                      {b1.explanation && <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.8, margin: 0, fontWeight: 600 }}>{b1.explanation}</p>}
                    </div>

                    {/* Sections */}
                    {b1.sections.map((sec, si) => (
                      <div key={si} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '16px 24px', background: 'linear-gradient(135deg,rgba(14,165,233,0.07),rgba(14,165,233,0.03))', borderBottom: '1px solid rgba(14,165,233,0.12)' }}>
                          <div style={{ fontSize: 16, fontWeight: 900, color: '#0c4a6e', marginBottom: 6 }}>{sec.heading}</div>
                          <div style={{ fontSize: 13, color: '#475569', fontWeight: 600, lineHeight: 1.65 }}>{sec.rule}</div>
                        </div>
                        <div style={{ padding: '16px 24px' }}>

                          {/* categories: verbs + examples */}
                          {sec.categories?.map((cat, ci) => (
                            <div key={ci} style={{ marginBottom: 16 }}>
                              <div style={{ fontSize: 13, fontWeight: 800, color: '#0284c7', marginBottom: 8 }}>{cat.group}</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                                {(cat.verbs ?? []).map(v => <span key={v} style={{ padding: '4px 12px', borderRadius: 999, background: 'rgba(14,165,233,0.1)', fontSize: 13, fontWeight: 800, color: '#0369a1' }}>{v}</span>)}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                {(cat.examples ?? []).map((ex, ei) => <div key={ei} style={{ fontSize: 13, color: '#334155', fontStyle: 'italic', padding: '6px 12px', background: '#f8fafc', borderRadius: 8, borderLeft: '3px solid rgba(14,165,233,0.3)' }}>{ex}</div>)}
                              </div>
                            </div>
                          ))}

                          {/* pairs: both forms same meaning */}
                          {sec.pairs?.map((p, pi) => (
                            <div key={pi} style={{ marginBottom: 12, padding: '12px 16px', borderRadius: 14, background: '#f8fafc', border: '1px solid rgba(14,165,233,0.1)' }}>
                              <div style={{ fontSize: 14, fontWeight: 900, color: '#0284c7', marginBottom: 8 }}>{p.verb}</div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 6 }}>
                                <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', fontSize: 13, fontStyle: 'italic', color: '#15803d', fontWeight: 600 }}>✦ gerund: {p.gerund}</div>
                                <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)', fontSize: 13, fontStyle: 'italic', color: '#1d4ed8', fontWeight: 600 }}>✦ infinitive: {p.infinitive}</div>
                              </div>
                              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>💡 {p.note}</div>
                            </div>
                          ))}

                          {/* table: different meanings */}
                          {sec.table?.map((row, ri) => (
                            <div key={ri} style={{ marginBottom: 14, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(14,165,233,0.12)' }}>
                              <div style={{ padding: '10px 16px', background: 'rgba(14,165,233,0.08)', fontSize: 14, fontWeight: 900, color: '#0c4a6e' }}>{row.verb}</div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                                <div style={{ padding: '12px 16px', borderRight: '1px solid rgba(14,165,233,0.1)', background: 'rgba(34,197,94,0.04)' }}>
                                  <div style={{ fontSize: 11, fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>+ герундий</div>
                                  <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>{row.gerund_meaning}</div>
                                  <div style={{ fontSize: 13, fontStyle: 'italic', color: '#6b7280' }}>{row.gerund_example}</div>
                                </div>
                                <div style={{ padding: '12px 16px', background: 'rgba(59,130,246,0.04)' }}>
                                  <div style={{ fontSize: 11, fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>+ инфинитив</div>
                                  <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>{row.infinitive_meaning}</div>
                                  <div style={{ fontSize: 13, fontStyle: 'italic', color: '#6b7280' }}>{row.infinitive_example}</div>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* uses: after prepositions patterns */}
                          {sec.uses?.map((u, ui) => (
                            <div key={ui} style={{ marginBottom: 14 }}>
                              <div style={{ fontSize: 13, fontWeight: 800, color: '#7c3aed', marginBottom: 8, padding: '6px 12px', background: 'rgba(124,58,237,0.07)', borderRadius: 8, display: 'inline-block' }}>{u.pattern}</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                {u.examples.map((ex, ei) => <div key={ei} style={{ fontSize: 13, color: '#334155', fontStyle: 'italic', padding: '6px 12px', background: '#f8fafc', borderRadius: 8, borderLeft: '3px solid rgba(124,58,237,0.3)' }}>{ex}</div>)}
                              </div>
                            </div>
                          ))}

                        </div>
                      </div>
                    ))}

                    {/* Common errors */}
                    {b1.common_errors?.length > 0 && (
                      <div className="glass-card" style={{ padding: 24 }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: '#dc2626', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 16 }}>⚠️ Common Errors</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {b1.common_errors.map((err, ei) => (
                            <div key={ei} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(239,68,68,0.15)' }}>
                              <div style={{ padding: '10px 16px', background: 'rgba(239,68,68,0.06)', fontSize: 13, color: '#dc2626', fontWeight: 700 }}>✗ {err.wrong}</div>
                              <div style={{ padding: '10px 16px', background: 'rgba(34,197,94,0.06)', fontSize: 13, color: '#16a34a', fontWeight: 700, borderTop: '1px solid rgba(34,197,94,0.15)' }}>✓ {err.correct}</div>
                              <div style={{ padding: '8px 16px', background: '#f9fafb', fontSize: 12, color: '#64748b', fontWeight: 600, borderTop: '1px solid rgba(0,0,0,0.05)' }}>💡 {err.note}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* B1 Multiple Choice */}
                    {b1MC_ex && (
                      <div className="glass-card" style={{ padding: 24 }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: '#0c4a6e', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>🔤 {b1MC_ex.instruction}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 16 }}>
                          {b1MC_ex.questions.map(q => {
                            const sel = b1MC[q.id]; const ok = b1Checked ? sel === q.answer : null
                            return (
                              <div key={q.id}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}><span style={{ color: '#94a3b8', fontWeight: 900, marginRight: 6 }}>{q.id}.</span>{q.sentence}</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                  {q.options.map(opt => { const isSel = sel === opt; const isGood = b1Checked && opt === q.answer; const isBad = b1Checked && isSel && opt !== q.answer
                                    return <button key={opt} onClick={() => { if (!b1Checked) setB1MC(p => ({ ...p, [q.id]: opt })) }}
                                      style={{ padding: '8px 18px', borderRadius: 999, fontSize: 13, fontWeight: 800, cursor: b1Checked ? 'default' : 'pointer', border: '2px solid', borderColor: isGood ? '#16a34a' : isBad ? '#dc2626' : isSel ? '#0ea5e9' : 'rgba(14,165,233,0.2)', background: isGood ? 'rgba(34,197,94,0.1)' : isBad ? 'rgba(239,68,68,0.1)' : isSel ? 'rgba(14,165,233,0.1)' : '#fff', color: isGood ? '#16a34a' : isBad ? '#dc2626' : isSel ? '#0369a1' : '#475569' }}>{opt}</button>
                                  })}
                                </div>
                                {b1Checked && <div style={{ marginTop: 8, fontSize: 12, color: ok ? '#16a34a' : '#dc2626', fontWeight: 700 }}>{ok ? '✓' : '✗'} {q.explanation}</div>}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* B1 Fill in blank */}
                    {b1FIB_ex && (
                      <div className="glass-card" style={{ padding: 24 }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: '#0c4a6e', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 16 }}>📝 {b1FIB_ex.instruction}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                          {b1FIB_ex.sentences.map(s => {
                            const val = b1FIB[s.id] ?? ''; const ok = b1Checked ? val.trim().toLowerCase() === s.answer.toLowerCase() : null
                            const parts = s.text.split('___')
                            return (
                              <div key={s.id} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4, fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
                                <span style={{ color: '#94a3b8', fontWeight: 900, marginRight: 4 }}>{s.id}.</span>
                                <span>{parts[0]}</span>
                                <input value={val} onChange={e => { if (!b1Checked) setB1FIB(p => ({ ...p, [s.id]: e.target.value })) }}
                                  style={{ display: 'inline-block', minWidth: 130, padding: '4px 10px', borderRadius: 8, border: `1.5px solid ${b1Checked ? (ok ? '#16a34a' : '#dc2626') : 'rgba(14,165,233,0.35)'}`, background: b1Checked ? (ok ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)') : '#fff', fontSize: 14, fontWeight: 800, color: b1Checked ? (ok ? '#16a34a' : '#dc2626') : '#0369a1', outline: 'none' }} />
                                <span>{parts[1]}</span>
                                {b1Checked && !ok && <span style={{ fontSize: 12, color: '#dc2626', fontWeight: 800 }}>→ {s.answer}</span>}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* B1 Error correction */}
                    {b1EC_ex && (
                      <div className="glass-card" style={{ padding: 24 }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: '#0c4a6e', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 16 }}>🔧 {b1EC_ex.instruction}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {b1EC_ex.sentences.map(s => (
                            <div key={s.id} style={{ borderRadius: 14, border: '1px solid rgba(239,68,68,0.15)', overflow: 'hidden' }}>
                              <div style={{ padding: '10px 16px', background: 'rgba(239,68,68,0.05)', fontSize: 13, fontWeight: 700, color: '#dc2626' }}>
                                <span style={{ color: '#94a3b8', marginRight: 6 }}>{s.id}.</span>✗ {s.wrong}
                              </div>
                              {b1ECShow[s.id] ? (
                                <>
                                  <div style={{ padding: '10px 16px', background: 'rgba(34,197,94,0.05)', fontSize: 13, fontWeight: 700, color: '#16a34a', borderTop: '1px solid rgba(34,197,94,0.12)' }}>✓ {s.correct}</div>
                                  <div style={{ padding: '8px 16px', background: '#f9fafb', fontSize: 12, color: '#64748b', fontWeight: 600 }}>💡 {s.explanation}</div>
                                </>
                              ) : (
                                <button onClick={() => setB1ECShow(p => ({ ...p, [s.id]: true }))}
                                  style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', fontSize: 13, fontWeight: 700, color: '#0284c7', cursor: 'pointer', textAlign: 'left', borderTop: '1px solid rgba(14,165,233,0.1)' }}>
                                  Показать правильный ответ →
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* B1 Meaning difference */}
                    {b1MD_ex && (
                      <div className="glass-card" style={{ padding: 24 }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: '#0c4a6e', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>🔀 {b1MD_ex.instruction}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 16 }}>
                          {b1MD_ex.questions.map(q => {
                            const sel = b1MD[q.id]; const ok = b1Checked ? sel === q.answer : null
                            return (
                              <div key={q.id}>
                                <div style={{ fontSize: 13, color: '#7c3aed', fontWeight: 700, marginBottom: 8, padding: '6px 12px', background: 'rgba(124,58,237,0.06)', borderRadius: 8 }}>{q.id}. {q.context}</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                  {q.options.map(opt => { const isSel = sel === opt; const isGood = b1Checked && opt === q.answer; const isBad = b1Checked && isSel && opt !== q.answer
                                    return <button key={opt} onClick={() => { if (!b1Checked) setB1MD(p => ({ ...p, [q.id]: opt })) }}
                                      style={{ textAlign: 'left', padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: b1Checked ? 'default' : 'pointer', border: '1.5px solid', borderColor: isGood ? '#16a34a' : isBad ? '#dc2626' : isSel ? '#0ea5e9' : 'rgba(14,165,233,0.15)', background: isGood ? 'rgba(34,197,94,0.08)' : isBad ? 'rgba(239,68,68,0.08)' : isSel ? 'rgba(14,165,233,0.08)' : '#f8fafc', color: isGood ? '#16a34a' : isBad ? '#dc2626' : isSel ? '#0369a1' : '#475569' }}>
                                      {opt} {b1Checked && isGood ? ' ✓' : b1Checked && isBad ? ' ✗' : ''}
                                    </button>
                                  })}
                                </div>
                                {b1Checked && <div style={{ marginTop: 8, fontSize: 12, color: ok ? '#16a34a' : '#dc2626', fontWeight: 700 }}>{ok ? '✓' : '✗'} {q.explanation}</div>}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Check / Reset */}
                    <div style={{ display: 'flex', gap: 12 }}>
                      {!b1Checked ? (
                        <button onClick={() => setB1Checked(true)}
                          style={{ padding: '12px 32px', borderRadius: 999, background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', color: '#fff', fontWeight: 900, fontSize: 15, border: 'none', cursor: 'pointer' }}>
                          Check Answers
                        </button>
                      ) : (
                        <button onClick={() => { setB1MC({}); setB1FIB({}); setB1MD({}); setB1ECShow({}); setB1Checked(false) }}
                          style={{ padding: '12px 32px', borderRadius: 999, background: '#f1f5f9', color: '#475569', fontWeight: 900, fontSize: 15, border: '1.5px solid rgba(14,165,233,0.2)', cursor: 'pointer' }}>
                          Try Again
                        </button>
                      )}
                    </div>

                  </div>
                )
              }
              // ── end B1+ branch ────────────────────────────────────────────

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                  {/* Title + explanation + academic_intro */}
                  <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.10)', padding: '24px 28px' }}>
                    <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1B3A6B', letterSpacing: '-0.03em', margin: '0 0 12px' }}>{g.title}</h2>
                    {g.explanation   && <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.75, margin: '0 0 10px', fontWeight: 600 }}>{g.explanation}</p>}
                    {g.academic_intro && <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8, margin: 0, fontWeight: 600, padding: '12px 16px', background: 'rgba(27,59,107,0.04)', borderRadius: 12, borderLeft: '3px solid #1B3A6B' }}>{g.academic_intro}</p>}
                  </div>

                  {/* Conjugation table */}
                  {g.table && g.table.length > 0 && (
                    <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.10)', overflow: 'hidden' }}>
                      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(27,143,196,0.08)', fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Формы глагола</div>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: 'rgba(27,143,196,0.04)' }}>
                            {['Местоимение','Форма','Сокращение','Пример'].map(h => (
                              <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 12, fontWeight: 800, color: '#64748b', borderBottom: '1px solid rgba(27,143,196,0.08)' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {g.table.map((row, i) => (
                            <tr key={i} style={{ borderBottom: i < g.table!.length - 1 ? '1px solid rgba(27,143,196,0.06)' : 'none' }}>
                              <td style={{ padding: '12px 20px', fontSize: 14, fontWeight: 800, color: '#1B3A6B' }}>{row.pronoun}</td>
                              <td style={{ padding: '12px 20px' }}>
                                <span style={{ background: 'rgba(27,143,196,0.10)', color: '#1B8FC4', fontWeight: 900, fontSize: 15, padding: '3px 10px', borderRadius: 8 }}>{row.form}</span>
                              </td>
                              <td style={{ padding: '12px 20px', fontSize: 13, color: '#475569', fontWeight: 700 }}>{row.short}</td>
                              <td style={{ padding: '12px 20px', fontSize: 13, color: '#64748b', fontStyle: 'italic' }}>{row.example}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Negation */}
                  {g.negation && g.negation.length > 0 && (
                    <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.10)', padding: '20px 24px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>Отрицание</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {g.negation.map((row, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 14, color: '#475569', fontWeight: 600, minWidth: 160 }}>{row.full}</span>
                            <span style={{ color: '#94a3b8', fontSize: 12 }}>→</span>
                            <span style={{ fontSize: 14, fontWeight: 900, color: '#ef4444' }}>{row.short}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Alphabet grid */}
                  {g.alphabet && g.alphabet.length > 0 && (
                    <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.10)', padding: '20px 24px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>
                        Алфавит — 26 букв
                        {g.vowels && (
                          <span style={{ marginLeft: 12, color: '#1B8FC4', fontWeight: 700, textTransform: 'none', fontSize: 12 }}>
                            Гласные: {g.vowels.join(' · ')}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
                        {g.alphabet.map((row, i) => (
                          <div key={i} style={{ borderRadius: 12, border: '1px solid rgba(27,143,196,0.09)', padding: '10px 12px', background: '#f8fafc' }}>
                            <div style={{ fontSize: 18, fontWeight: 900, color: '#1B3A6B', marginBottom: 2 }}>{row.letter}</div>
                            <div style={{ fontSize: 12, color: '#1B8FC4', fontWeight: 700, marginBottom: 4 }}>[{row.name}]</div>
                            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{row.examples.join(', ')}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Usage (this/that/these/those) */}
                  {g.usage && g.usage.length > 0 && (
                    <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.10)', padding: '20px 24px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>Использование</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {g.usage.map((u, i) => (
                          <div key={i} style={{ borderRadius: 14, border: '1px solid rgba(27,143,196,0.09)', overflow: 'hidden' }}>
                            <div style={{ padding: '10px 16px', background: 'rgba(27,143,196,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{ background: '#1B8FC4', color: '#fff', fontWeight: 900, fontSize: 13, padding: '3px 10px', borderRadius: 8 }}>{u.pronoun}</span>
                              <span style={{ fontSize: 13, color: '#475569', fontWeight: 700 }}>{u.rule}</span>
                            </div>
                            <div style={{ padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {u.examples.map((ex, j) => (
                                <div key={j} style={{ fontSize: 14, color: '#1B3A6B', fontStyle: 'italic', fontWeight: 600 }}>"{ex}"</div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Structures */}
                  {g.structures && g.structures.length > 0 && (
                    <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.10)', overflow: 'hidden' }}>
                      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(27,143,196,0.08)', fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Структуры предложений</div>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: 'rgba(27,143,196,0.04)' }}>
                            {['Тип','Шаблон','Пример'].map(h => (
                              <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 12, fontWeight: 800, color: '#64748b', borderBottom: '1px solid rgba(27,143,196,0.08)' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {g.structures.map((s, i) => (
                            <tr key={i} style={{ borderBottom: i < g.structures!.length - 1 ? '1px solid rgba(27,143,196,0.06)' : 'none' }}>
                              <td style={{ padding: '11px 20px', fontSize: 13, fontWeight: 800, color: '#1B3A6B', whiteSpace: 'nowrap' }}>{s.type}</td>
                              <td style={{ padding: '11px 20px', fontSize: 13, color: '#1B8FC4', fontFamily: 'monospace', fontWeight: 700 }}>{s.pattern}</td>
                              <td style={{ padding: '11px 20px', fontSize: 13, color: '#475569', fontStyle: 'italic' }}>{s.example}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Noun types */}
                  {g.noun_types && g.noun_types.length > 0 && (
                    <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.10)', padding: '20px 24px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>Типы существительных</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                        {g.noun_types.map((nt, i) => (
                          <div key={i} style={{ borderRadius: 12, border: '1px solid rgba(27,143,196,0.09)', padding: '12px 14px', background: '#f8fafc' }}>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#1B3A6B', marginBottom: 6 }}>{nt.type}</div>
                            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{nt.examples.join(', ')}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Plural rules (new format with rule/explanation/examples) */}
                  {g.rules && g.rules.length > 0 && (g.rules[0] as PluralRule).rule && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {(g.rules as PluralRule[]).map((r, i) => (
                        <div key={i} style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.10)', overflow: 'hidden' }}>
                          <div style={{ padding: '14px 20px', background: 'rgba(27,143,196,0.05)', borderBottom: '1px solid rgba(27,143,196,0.08)' }}>
                            <div style={{ fontSize: 14, fontWeight: 900, color: '#1B3A6B', marginBottom: 4 }}>{r.rule}</div>
                            <div style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>{r.explanation}</div>
                          </div>
                          <div style={{ padding: '12px 20px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {(r.examples ?? []).map((ex, j) => (
                              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid rgba(27,143,196,0.08)' }}>
                                <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{ex.singular}</span>
                                <span style={{ color: '#94a3b8', fontSize: 11 }}>→</span>
                                <span style={{ fontSize: 13, fontWeight: 900, color: '#1B8FC4' }}>{ex.plural}</span>
                                {(ex.note || ex.change) && <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>({ex.note ?? ex.change})</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Academic examples */}
                  {g.academic_examples && g.academic_examples.length > 0 && (
                    <div style={{ background: 'rgba(27,59,107,0.04)', borderRadius: 20, border: '1px solid rgba(27,59,107,0.10)', padding: '20px 24px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#1B3A6B', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>📚 Академические примеры</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {g.academic_examples.map((ex, i) => (
                          <div key={i} style={{ fontSize: 14, color: '#1B3A6B', fontStyle: 'italic', fontWeight: 600, padding: '8px 14px', background: '#fff', borderRadius: 10, borderLeft: '3px solid #1B3A6B' }}>{ex}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dialogues */}
                  {g.dialogues && g.dialogues.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {g.dialogues.map((d, i) => (
                        <div key={i} style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.10)', overflow: 'hidden' }}>
                          <div style={{ padding: '12px 20px', background: 'rgba(27,143,196,0.05)', borderBottom: '1px solid rgba(27,143,196,0.08)', fontSize: 13, fontWeight: 800, color: '#1B3A6B' }}>
                            💬 {d.title}
                          </div>
                          <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {d.lines.map((line, j) => (
                              <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                <span style={{ width: 24, height: 24, borderRadius: '50%', background: line.speaker === 'A' ? '#1B8FC4' : '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, flexShrink: 0 }}>{line.speaker}</span>
                                <span style={{ fontSize: 14, color: '#1B3A6B', fontWeight: 600, lineHeight: 1.6, paddingTop: 2 }}>{line.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reading rules (original format) */}
                  {g.rules && g.rules.length > 0 && !(g.rules[0] as PluralRule).rule && (
                    <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.10)', overflow: 'hidden' }}>
                      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(27,143,196,0.08)', fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Правила чтения</div>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: 'rgba(27,143,196,0.04)' }}>
                            {['Буква/сочетание', 'Звук', 'Правило'].map(h => (
                              <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 12, fontWeight: 800, color: '#64748b', borderBottom: '1px solid rgba(27,143,196,0.08)' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {g.rules.map((rule, i) => {
                            const r = rule as { combo?: string; sound?: string; note?: string }
                            return (
                              <tr key={i} style={{ borderBottom: i < g.rules!.length - 1 ? '1px solid rgba(27,143,196,0.06)' : 'none' }}>
                                <td style={{ padding: '12px 20px' }}>
                                  <span style={{ background: 'rgba(27,143,196,0.10)', color: '#1B8FC4', fontWeight: 900, fontSize: 15, padding: '3px 10px', borderRadius: 8 }}>{r.combo ?? ''}</span>
                                </td>
                                <td style={{ padding: '12px 20px', fontSize: 14, fontWeight: 800, color: '#1B3A6B' }}>[{r.sound ?? ''}]</td>
                                <td style={{ padding: '12px 20px', fontSize: 13, color: '#475569', fontWeight: 600 }}>{r.note ?? ''}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Questions */}
                  {g.questions && g.questions.length > 0 && (
                    <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.10)', padding: '20px 24px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>Вопросы</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {g.questions.map((q, i) => (
                          <div key={i} style={{ fontSize: 15, fontWeight: 700, color: '#1B3A6B', padding: '10px 16px', background: 'rgba(27,143,196,0.05)', borderRadius: 12, borderLeft: '3px solid #1B8FC4' }}>{q}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {g.notes && g.notes.length > 0 && (
                    <div style={{ background: 'rgba(201,147,59,0.06)', borderRadius: 20, border: '1px solid rgba(201,147,59,0.18)', padding: '20px 24px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#C9933B', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>⚠️ Запомни</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {g.notes.map((note, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                            <span style={{ color: '#C9933B', fontWeight: 900, flexShrink: 0, marginTop: 2 }}>•</span>
                            <span style={{ fontSize: 14, color: '#78350f', fontWeight: 600, lineHeight: 1.6 }}>{note}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Article rules (with tricky/comparison/with_the/without_article) */}
                  {g.rules && g.rules.length > 0 && (g.rules[0] as ArticleRule).usage !== undefined && !(g.rules[0] as PluralRule).examples && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {(g.rules as ArticleRule[]).map((r, i) => (
                        <div key={i} style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.10)', overflow: 'hidden' }}>
                          <div style={{ padding: '14px 20px', background: 'rgba(27,143,196,0.05)', borderBottom: '1px solid rgba(27,143,196,0.08)' }}>
                            <div style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B', marginBottom: 4 }}>{r.rule}</div>
                            <div style={{ fontSize: 13, color: '#475569', fontWeight: 600, lineHeight: 1.65 }}>{r.explanation}</div>
                          </div>
                          <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {/* Inline table (pronoun tables) */}
                            {r.table && r.table.length > 0 && (() => {
                              const headers = Object.keys(r.table![0])
                              return (
                                <div style={{ overflowX: 'auto' }}>
                                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                    <thead>
                                      <tr style={{ background: 'rgba(27,143,196,0.06)' }}>
                                        {headers.map(h => (
                                          <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontWeight: 800, color: '#64748b', borderBottom: '1px solid rgba(27,143,196,0.10)', whiteSpace: 'nowrap' }}>
                                            {h.charAt(0).toUpperCase() + h.slice(1)}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {r.table!.map((row, j) => (
                                        <tr key={j} style={{ borderBottom: j < r.table!.length - 1 ? '1px solid rgba(27,143,196,0.06)' : 'none' }}>
                                          {headers.map(h => (
                                            <td key={h} style={{ padding: '9px 14px', color: h === 'pronoun' || h === 'object' || h === 'subject' ? '#1B8FC4' : '#1B3A6B', fontWeight: h === 'pronoun' || h === 'object' ? 900 : 600 }}>
                                              {row[h]}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )
                            })()}

                            {/* IT usage contexts */}
                            {r.it_usage && r.it_usage.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {r.it_usage.map((u, j) => (
                                  <div key={j} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 10, padding: '8px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid rgba(27,143,196,0.08)', alignItems: 'center' }}>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: '#1B8FC4', background: 'rgba(27,143,196,0.10)', padding: '3px 8px', borderRadius: 6, textAlign: 'center' }}>{u.context}</span>
                                    <div>
                                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1B3A6B', fontStyle: 'italic', marginBottom: 2 }}>{u.example}</div>
                                      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{u.translation}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* RU-EN comparison (obligatory subject) */}
                            {r.ru_en_comparison && r.ru_en_comparison.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {r.ru_en_comparison.map((c, j) => (
                                  <div key={j} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(27,143,196,0.10)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
                                      <div style={{ padding: '9px 12px', background: 'rgba(148,163,184,0.08)', borderRight: '1px solid rgba(27,143,196,0.08)' }}>
                                        <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 3 }}>Русский</div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{c.russian}</div>
                                      </div>
                                      <div style={{ padding: '9px 12px', background: 'rgba(239,68,68,0.05)', borderRight: '1px solid rgba(27,143,196,0.08)' }}>
                                        <div style={{ fontSize: 10, fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', marginBottom: 3 }}>❌ Неверно</div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#7f1d1d', fontStyle: 'italic' }}>{c.wrong_english}</div>
                                      </div>
                                      <div style={{ padding: '9px 12px', background: 'rgba(16,185,129,0.05)' }}>
                                        <div style={{ fontSize: 10, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginBottom: 3 }}>✓ Верно</div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#064e3b', fontStyle: 'italic' }}>{c.correct_english}</div>
                                      </div>
                                    </div>
                                    <div style={{ padding: '5px 12px', background: 'rgba(27,143,196,0.03)', fontSize: 11, color: '#64748b', fontWeight: 600 }}>{c.note}</div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Positions (attributive/predicative) */}
                            {r.positions && r.positions.length > 0 && (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                {r.positions.map((pos, j) => (
                                  <div key={j} style={{ borderRadius: 12, border: '1px solid rgba(27,143,196,0.10)', overflow: 'hidden' }}>
                                    <div style={{ padding: '9px 14px', background: 'rgba(27,143,196,0.06)', borderBottom: '1px solid rgba(27,143,196,0.08)' }}>
                                      <div style={{ fontSize: 12, fontWeight: 900, color: '#1B3A6B' }}>{pos.type}</div>
                                      <div style={{ fontSize: 11, color: '#1B8FC4', fontFamily: 'monospace', fontWeight: 700 }}>{pos.pattern}</div>
                                    </div>
                                    <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                                      {pos.examples.map((ex, k) => (
                                        <div key={k}>
                                          <span style={{ fontSize: 13, fontWeight: 700, color: '#1B3A6B', fontStyle: 'italic' }}>{ex.sentence}</span>
                                          <span style={{ fontSize: 12, color: '#64748b', marginLeft: 6 }}>— {ex.translation}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Order table (OSASCOMP) */}
                            {r.order && r.order.length > 0 && (
                              <div>
                                {r.memory_tip && (
                                  <div style={{ fontSize: 13, fontWeight: 800, color: '#1B8FC4', padding: '8px 14px', background: 'rgba(27,143,196,0.07)', borderRadius: 10, marginBottom: 8 }}>
                                    💡 {r.memory_tip}
                                  </div>
                                )}
                                <div style={{ overflowX: 'auto' }}>
                                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                    <thead>
                                      <tr style={{ background: 'rgba(27,143,196,0.06)' }}>
                                        {['#', 'Категория', 'Примеры'].map(h => (
                                          <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontWeight: 800, color: '#64748b', borderBottom: '1px solid rgba(27,143,196,0.10)' }}>{h}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {r.order.map((row, j) => (
                                        <tr key={j} style={{ borderBottom: '1px solid rgba(27,143,196,0.06)' }}>
                                          <td style={{ padding: '8px 14px', fontWeight: 900, color: '#1B8FC4', width: 32 }}>{row.position}</td>
                                          <td style={{ padding: '8px 14px', fontWeight: 800, color: '#1B3A6B', whiteSpace: 'nowrap' }}>{row.category}</td>
                                          <td style={{ padding: '8px 14px', color: '#475569', fontWeight: 600 }}>{row.examples}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Categories (adjective types) */}
                            {r.categories && r.categories.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {r.categories.map((cat, j) => (
                                  <div key={j} style={{ borderRadius: 12, border: '1px solid rgba(27,143,196,0.09)', overflow: 'hidden' }}>
                                    <div style={{ padding: '9px 14px', background: 'rgba(27,143,196,0.05)', borderBottom: '1px solid rgba(27,143,196,0.08)', fontSize: 13, fontWeight: 900, color: '#1B3A6B' }}>{cat.category}</div>
                                    <div style={{ padding: '9px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                      <div>
                                        <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Обычные</div>
                                        <div style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>{cat.examples.join(', ')}</div>
                                      </div>
                                      <div>
                                        <div style={{ fontSize: 10, fontWeight: 800, color: '#1B8FC4', textTransform: 'uppercase', marginBottom: 4 }}>Академические</div>
                                        <div style={{ fontSize: 12, color: '#1B3A6B', fontWeight: 700 }}>{cat.academic.join(', ')}</div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Upgrades (basic → academic) */}
                            {r.upgrades && r.upgrades.length > 0 && (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
                                {r.upgrades.map((u, j) => (
                                  <div key={j} style={{ borderRadius: 12, border: '1px solid rgba(27,143,196,0.09)', padding: '10px 14px', background: '#f8fafc' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                      <span style={{ fontSize: 13, fontWeight: 900, color: '#ef4444', background: 'rgba(239,68,68,0.08)', padding: '2px 8px', borderRadius: 6 }}>{u.basic}</span>
                                      <span style={{ color: '#94a3b8', fontSize: 12 }}>→</span>
                                    </div>
                                    <div style={{ fontSize: 12, color: '#1B3A6B', fontWeight: 700, lineHeight: 1.7 }}>{u.academic.join(' · ')}</div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Suffixes */}
                            {r.suffixes && r.suffixes.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                {r.suffixes.map((s, j) => (
                                  <div key={j} style={{ display: 'grid', gridTemplateColumns: '80px 160px 1fr', gap: 10, padding: '9px 14px', borderRadius: 10, background: '#f8fafc', border: '1px solid rgba(27,143,196,0.08)', alignItems: 'center' }}>
                                    <span style={{ fontSize: 15, fontWeight: 900, color: '#1B8FC4', background: 'rgba(27,143,196,0.10)', padding: '3px 10px', borderRadius: 8, textAlign: 'center' }}>{s.suffix}</span>
                                    <span style={{ fontSize: 13, color: '#475569', fontWeight: 700 }}>{s.meaning}</span>
                                    <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{s.examples.join(', ')}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* SVO comparison */}
                            {r.svo_comparison && r.svo_comparison.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {(r.svo_comparison as SvoRow[]).map((row, j) => (
                                  <div key={j} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, padding: '8px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid rgba(27,143,196,0.08)', alignItems: 'center' }}>
                                    <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{row.russian}</span>
                                    <span style={{ fontSize: 13, color: '#1B3A6B', fontWeight: 700, fontStyle: 'italic' }}>{row.english}</span>
                                    {row.structure && <span style={{ fontSize: 11, fontWeight: 800, color: '#1B8FC4', background: 'rgba(27,143,196,0.10)', padding: '2px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>{row.structure}</span>}
                                    {row.note && <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, gridColumn: '1/-1' }}>{row.note}</span>}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Extended examples (SVO + adverbials) */}
                            {r.extended_examples && r.extended_examples.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Расширенные примеры</div>
                                {r.extended_examples.map((ex, j) => (
                                  <div key={j} style={{ padding: '8px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid rgba(27,143,196,0.08)' }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1B3A6B', fontStyle: 'italic', marginBottom: 3 }}>{ex.sentence}</div>
                                    <div style={{ fontSize: 11, color: '#1B8FC4', fontWeight: 700 }}>{ex.breakdown}</div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* SVOMPT order table */}
                            {r.svompt_order && r.svompt_order.length > 0 && (
                              <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                  <thead>
                                    <tr style={{ background: 'rgba(27,143,196,0.06)' }}>
                                      {['Элемент','Название','По-русски','Пример'].map(h => (
                                        <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontWeight: 800, color: '#64748b', borderBottom: '1px solid rgba(27,143,196,0.10)', whiteSpace: 'nowrap' }}>{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(r.svompt_order as SvomptRow[]).map((row, j) => (
                                      <tr key={j} style={{ borderBottom: '1px solid rgba(27,143,196,0.06)' }}>
                                        <td style={{ padding: '8px 14px', fontWeight: 900, color: '#1B8FC4', fontSize: 16 }}>{row.element}</td>
                                        <td style={{ padding: '8px 14px', fontWeight: 800, color: '#1B3A6B' }}>{row.name}</td>
                                        <td style={{ padding: '8px 14px', color: '#64748b', fontWeight: 600 }}>{row.russian}</td>
                                        <td style={{ padding: '8px 14px', color: '#475569', fontStyle: 'italic', fontWeight: 600 }}>{row.example}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}

                            {/* Question types */}
                            {r.question_types && r.question_types.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {(r.question_types as QuestionType[]).map((qt, j) => (
                                  <div key={j} style={{ borderRadius: 12, border: '1px solid rgba(27,143,196,0.09)', overflow: 'hidden' }}>
                                    <div style={{ padding: '10px 14px', background: 'rgba(27,143,196,0.05)', borderBottom: '1px solid rgba(27,143,196,0.08)' }}>
                                      <div style={{ fontSize: 13, fontWeight: 900, color: '#1B3A6B' }}>{qt.type}</div>
                                      <div style={{ fontSize: 11, fontWeight: 700, color: '#1B8FC4', fontFamily: 'monospace', marginTop: 3 }}>{qt.pattern}</div>
                                    </div>
                                    <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                      {(qt.pairs || qt.examples || []).filter(p => p.question).map((p, k) => (
                                        <div key={k} style={{ display: 'grid', gridTemplateColumns: p.statement ? '1fr 1fr' : '1fr', gap: 8 }}>
                                          {p.statement ? (
                                            <>
                                              <div style={{ padding: '6px 10px', borderRadius: 8, background: '#f8fafc', border: '1px solid rgba(27,143,196,0.08)', fontSize: 13, color: '#475569', fontWeight: 600, fontStyle: 'italic' }}>{p.statement}</div>
                                              <div style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(27,143,196,0.06)', border: '1px solid rgba(27,143,196,0.15)', fontSize: 13, color: '#1B3A6B', fontWeight: 700, fontStyle: 'italic' }}>{p.question}</div>
                                            </>
                                          ) : (
                                            <div style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(27,143,196,0.06)', fontSize: 13, color: '#1B3A6B', fontWeight: 700, fontStyle: 'italic' }}>{p.question}</div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Adverb types with wrong/correct pairs */}
                            {r.adverb_types && r.adverb_types.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {(r.adverb_types as AdverbType[]).map((at, j) => (
                                  <div key={j} style={{ borderRadius: 12, border: '1px solid rgba(27,143,196,0.09)', overflow: 'hidden' }}>
                                    <div style={{ padding: '10px 14px', background: 'rgba(27,143,196,0.05)', borderBottom: '1px solid rgba(27,143,196,0.08)' }}>
                                      <div style={{ fontSize: 12, fontWeight: 900, color: '#1B3A6B', marginBottom: 3 }}>{at.type}</div>
                                      <div style={{ fontSize: 12, color: '#C9933B', fontWeight: 700 }}>📌 {at.rule}</div>
                                    </div>
                                    <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                      {at.pairs.map((p, k) => (
                                        <div key={k} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                          <div style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)', fontSize: 12, fontStyle: 'italic' }}>
                                            <span style={{ fontSize: 10, fontWeight: 800, color: '#ef4444' }}>✗ </span>{p.wrong}
                                          </div>
                                          <div style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)', fontSize: 12, fontStyle: 'italic' }}>
                                            <span style={{ fontSize: 10, fontWeight: 800, color: '#10b981' }}>✓ </span>{p.correct}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Contractions */}
                            {r.contractions && r.contractions.length > 0 && (
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Сокращения</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                  {(r.contractions as Contraction[]).map((c, j) => (
                                    <div key={j} style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '6px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid rgba(27,143,196,0.08)' }}>
                                      <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{c.full}</span>
                                      <span style={{ color: '#94a3b8' }}>→</span>
                                      <span style={{ fontSize: 13, fontWeight: 900, color: '#1B8FC4' }}>{c.short}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Inversion adverbs */}
                            {r.inversion_adverbs && r.inversion_adverbs.length > 0 && (
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Наречия вызывающие инверсию</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                  {r.inversion_adverbs.map((adv, j) => (
                                    <span key={j} style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(27,143,196,0.10)', border: '1px solid rgba(27,143,196,0.18)', fontSize: 13, fontWeight: 900, color: '#1B8FC4' }}>{adv}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Number groups */}
                            {r.groups && r.groups.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {(r.groups as NumberGroup[]).map((grp, j) => (
                                  <div key={j} style={{ borderRadius: 12, border: '1px solid rgba(27,143,196,0.09)', overflow: 'hidden' }}>
                                    <div style={{ padding: '9px 14px', background: 'rgba(27,143,196,0.05)', borderBottom: '1px solid rgba(27,143,196,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ fontSize: 13, fontWeight: 900, color: '#1B3A6B' }}>{grp.group}</span>
                                      {grp.note && <span style={{ fontSize: 11, fontWeight: 800, color: '#C9933B', background: 'rgba(201,147,59,0.10)', padding: '2px 8px', borderRadius: 6 }}>⚠️ {grp.note}</span>}
                                    </div>
                                    <div style={{ padding: '10px 14px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                      {(grp.numbers || grp.examples || []).map((n, k) => (
                                        <div key={k} style={{ padding: '5px 10px', borderRadius: 8, background: '#f8fafc', border: '1px solid rgba(27,143,196,0.08)', display: 'flex', gap: 6, alignItems: 'center' }}>
                                          <span style={{ fontSize: 13, fontWeight: 900, color: '#1B8FC4' }}>{n.num}</span>
                                          <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>{n.word}</span>
                                          {n.note && <span style={{ fontSize: 10, color: '#94a3b8' }}>({n.note})</span>}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Pronunciation / spelling rules (string arrays) */}
                            {(r.pronunciation_rules || r.spelling_rules) && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {(r.pronunciation_rules || r.spelling_rules || []).map((rule, j) => (
                                  <div key={j} style={{ display: 'flex', gap: 8, padding: '8px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid rgba(27,143,196,0.08)' }}>
                                    <span style={{ color: '#1B8FC4', fontWeight: 900, flexShrink: 0 }}>•</span>
                                    <span style={{ fontSize: 13, color: '#475569', fontWeight: 600, lineHeight: 1.6 }}>{rule}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Academic rules (correct/wrong pairs) */}
                            {r.academic_rules && r.academic_rules.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {(r.academic_rules as AcademicRule[]).map((ar, j) => (
                                  <div key={j} style={{ borderRadius: 12, border: '1px solid rgba(27,143,196,0.09)', overflow: 'hidden' }}>
                                    <div style={{ padding: '9px 14px', background: 'rgba(27,143,196,0.05)', borderBottom: '1px solid rgba(27,143,196,0.08)', fontSize: 13, fontWeight: 900, color: '#1B3A6B' }}>{ar.rule}</div>
                                    <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                      {ar.examples.map((ex, k) => (
                                        <div key={k} style={{ display: 'grid', gridTemplateColumns: ex.wrong ? '1fr 1fr' : '1fr', gap: 8 }}>
                                          {ex.correct && ex.wrong ? (
                                            <>
                                              <div style={{ padding: '7px 10px', borderRadius: 8, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', fontSize: 12 }}>
                                                <span style={{ fontSize: 10, fontWeight: 800, color: '#10b981' }}>✓ </span>
                                                <span style={{ color: '#064e3b', fontWeight: 700 }}>{ex.correct}</span>
                                              </div>
                                              <div style={{ padding: '7px 10px', borderRadius: 8, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', fontSize: 12 }}>
                                                <span style={{ fontSize: 10, fontWeight: 800, color: '#ef4444' }}>✗ </span>
                                                <span style={{ color: '#7f1d1d', fontWeight: 700 }}>{ex.wrong}</span>
                                              </div>
                                            </>
                                          ) : (
                                            <div style={{ padding: '7px 10px', borderRadius: 8, background: 'rgba(27,143,196,0.05)', fontSize: 12 }}>
                                              <span style={{ color: '#1B3A6B', fontWeight: 700 }}>{ex.correct || ex.note}</span>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Measurement categories */}
                            {r.measurement_categories && r.measurement_categories.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {(r.measurement_categories as MeasCategory[]).map((cat, j) => (
                                  <div key={j} style={{ borderRadius: 12, border: '1px solid rgba(27,143,196,0.09)', overflow: 'hidden' }}>
                                    <div style={{ padding: '8px 14px', background: 'rgba(27,143,196,0.05)', borderBottom: '1px solid rgba(27,143,196,0.08)', fontSize: 12, fontWeight: 900, color: '#1B3A6B' }}>{cat.type}</div>
                                    <div style={{ padding: '10px 14px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                      {cat.units.map((u, k) => (
                                        <div key={k} style={{ padding: '7px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid rgba(27,143,196,0.08)', display: 'flex', gap: 8, alignItems: 'center' }}>
                                          <span style={{ fontSize: 14, fontWeight: 900, color: '#1B8FC4' }}>{u.unit}</span>
                                          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{u.full}</span>
                                          <span style={{ fontSize: 11, color: '#94a3b8' }}>e.g. {u.example}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Decimal reading */}
                            {r.reading_decimals && r.reading_decimals.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Чтение чисел</div>
                                {(r.reading_decimals as DecimalRow[]).map((d, j) => (
                                  <div key={j} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10, padding: '8px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid rgba(27,143,196,0.08)', alignItems: 'center' }}>
                                    <span style={{ fontSize: 14, fontWeight: 900, color: '#1B8FC4' }}>{d.written}</span>
                                    <span style={{ fontSize: 13, color: '#475569', fontWeight: 600, fontStyle: 'italic' }}>{d.spoken}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Time/year/fraction contexts */}
                            {r.contexts && r.contexts.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {(r.contexts as TimeContext[]).map((ctx, j) => (
                                  <div key={j} style={{ borderRadius: 12, border: '1px solid rgba(27,143,196,0.09)', overflow: 'hidden' }}>
                                    <div style={{ padding: '9px 14px', background: 'rgba(27,143,196,0.05)', borderBottom: '1px solid rgba(27,143,196,0.08)', fontSize: 13, fontWeight: 900, color: '#1B3A6B' }}>{ctx.context}</div>
                                    <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                                      {ctx.examples.filter(e => e.written).map((ex, k) => (
                                        <div key={k} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 10, alignItems: 'center' }}>
                                          <span style={{ fontSize: 13, fontWeight: 900, color: '#1B8FC4' }}>{ex.written}</span>
                                          <span style={{ fontSize: 13, color: '#475569', fontWeight: 600, fontStyle: 'italic' }}>{ex.spoken}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Academic uses */}
                            {r.academic_uses && r.academic_uses.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {(r.academic_uses as AcademicUse[]).map((au, j) => (
                                  <div key={j} style={{ borderRadius: 12, border: '1px solid rgba(27,143,196,0.09)', overflow: 'hidden' }}>
                                    <div style={{ padding: '9px 14px', background: 'rgba(27,143,196,0.05)', borderBottom: '1px solid rgba(27,143,196,0.08)', fontSize: 12, fontWeight: 900, color: '#1B3A6B' }}>{au.use}</div>
                                    <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                                      {au.examples.map((ex, k) => (
                                        <div key={k} style={{ fontSize: 13, color: '#1B3A6B', fontStyle: 'italic', fontWeight: 600, padding: '5px 10px', borderLeft: '2px solid rgba(27,143,196,0.20)' }}>{ex}</div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Usage list */}
                            {r.usage && r.usage.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                {r.usage.map((u, j) => (
                                  <div key={j} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#475569', fontWeight: 600 }}>
                                    <span style={{ color: '#1B8FC4', flexShrink: 0 }}>•</span>{u}
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* Examples with translation */}
                            {r.examples && r.examples.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {(r.examples ?? []).map((ex, j) => (
                                  <div key={j} style={{ padding: '8px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid rgba(27,143,196,0.08)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                      <span style={{ fontSize: 14, fontWeight: 800, color: '#1B3A6B', fontStyle: 'italic' }}>"{ex.sentence}"</span>
                                      <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginLeft: 8 }}>— {ex.translation}</span>
                                    </div>
                                    {ex.note && <span style={{ fontSize: 11, color: '#1B8FC4', fontWeight: 700, flexShrink: 0, background: 'rgba(27,143,196,0.08)', padding: '2px 8px', borderRadius: 6 }}>{ex.note}</span>}
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* Note */}
                            {r.note && <div style={{ fontSize: 13, color: '#78350f', fontWeight: 700, padding: '8px 12px', background: 'rgba(201,147,59,0.08)', borderRadius: 10, borderLeft: '3px solid #C9933B' }}>⚠️ {r.note}</div>}
                            {/* Tricky words */}
                            {r.tricky && r.tricky.length > 0 && (
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Сложные случаи</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                  {r.tricky.map((t, j) => (
                                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid rgba(27,143,196,0.08)' }}>
                                      <span style={{ fontWeight: 900, color: '#1B3A6B', fontSize: 14, minWidth: 100 }}>{t.article} {t.word}</span>
                                      <span style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>{t.reason}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {/* Comparison blocks — handles both A/THE comparisons and RU/EN comparisons */}
                            {r.comparison && r.comparison.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {(r.comparison as (Comparison | RuEngRow)[]).map((c, j) => {
                                  const isRuEng = 'russian' in c
                                  const left  = isRuEng ? (c as RuEngRow).russian : (c as Comparison).indefinite
                                  const right = isRuEng ? (c as RuEngRow).english : (c as Comparison).definite
                                  const lLabel = isRuEng ? 'Русский' : 'A/AN'
                                  const rLabel = isRuEng ? 'English' : 'THE'
                                  return (
                                    <div key={j} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(27,143,196,0.10)' }}>
                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                                        <div style={{ padding: '10px 14px', background: 'rgba(148,163,184,0.06)', borderRight: '1px solid rgba(27,143,196,0.08)' }}>
                                          <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>{lLabel}</div>
                                          <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{left}</div>
                                        </div>
                                        <div style={{ padding: '10px 14px', background: 'rgba(27,143,196,0.04)' }}>
                                          <div style={{ fontSize: 10, fontWeight: 800, color: '#1B8FC4', textTransform: 'uppercase', marginBottom: 4 }}>{rLabel}</div>
                                          <div style={{ fontSize: 13, fontWeight: 700, color: '#1B3A6B', fontStyle: 'italic' }}>{right}</div>
                                        </div>
                                      </div>
                                      <div style={{ padding: '6px 14px', background: 'rgba(27,143,196,0.03)', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{c.note}</div>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                            {/* With the / Without article */}
                            {(r.with_the || r.without_article) && (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                {r.with_the && (
                                  <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                                    <div style={{ fontSize: 11, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>С THE</div>
                                    {r.with_the.map((item, j) => <div key={j} style={{ fontSize: 13, color: '#1B3A6B', fontWeight: 600, marginBottom: 4 }}>• {item}</div>)}
                                  </div>
                                )}
                                {r.without_article && (
                                  <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.20)' }}>
                                    <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>БЕЗ АРТИКЛЯ</div>
                                    {r.without_article.map((item, j) => <div key={j} style={{ fontSize: 13, color: '#1B3A6B', fontWeight: 600, marginBottom: 4 }}>• {item}</div>)}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Common mistakes */}
                  {g.common_mistakes && g.common_mistakes.length > 0 && (
                    <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(239,68,68,0.15)', overflow: 'hidden' }}>
                      <div style={{ padding: '14px 24px', borderBottom: '1px solid rgba(239,68,68,0.10)', fontSize: 11, fontWeight: 800, color: '#ef4444', letterSpacing: '0.07em', textTransform: 'uppercase' }}>❌ Типичные ошибки</div>
                      <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {g.common_mistakes.map((m, i) => (
                          <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(27,143,196,0.08)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.05)', borderRight: '1px solid rgba(27,143,196,0.08)' }}>
                                <div style={{ fontSize: 10, fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', marginBottom: 4 }}>❌ Неверно</div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#7f1d1d', fontStyle: 'italic' }}>{m.wrong}</div>
                              </div>
                              <div style={{ padding: '10px 14px', background: 'rgba(16,185,129,0.05)' }}>
                                <div style={{ fontSize: 10, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginBottom: 4 }}>✓ Верно</div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#064e3b', fontStyle: 'italic' }}>{m.correct}</div>
                              </div>
                            </div>
                            <div style={{ padding: '6px 14px', background: 'rgba(27,143,196,0.03)', fontSize: 12, color: '#475569', fontWeight: 600 }}>{m.explanation}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Exercises */}
                  {g.exercises && g.exercises.length > 0 && (
                    <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.10)', padding: '20px 24px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 16 }}>Упражнения</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {g.exercises.map((ex, i) => (
                          <GrammarExerciseItem key={i} ex={ex} num={i + 1} />
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )
            })()}

            {/* READING */}
            {tab === 'reading' && (() => {
              const rawRd = sections.find(s => s.type === 'reading')?.content as (ReadingContent & B1ReadingContent) | null

              // ── B1 reading branch ──────────────────────────────────────
              if (rawRd?.text && rawRd?.comprehension_questions) {
                const b1r = rawRd as B1ReadingContent
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Passage */}
                    <div className="glass-card" style={{ padding: 32 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <span style={{ fontSize: 20 }}>📖</span>
                        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: 0 }}>{b1r.title}</h2>
                      </div>
                      <div style={{ fontSize: 15, lineHeight: 2, color: '#1e293b', fontWeight: 600, background: 'rgba(14,165,233,0.04)', borderRadius: 16, padding: '20px 24px', borderLeft: '4px solid #0ea5e9' }}>
                        {b1r.text}
                      </div>
                    </div>

                    {/* Glossary */}
                    {b1r.glossary?.length > 0 && (
                      <div className="glass-card" style={{ padding: 28 }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: '#0c4a6e', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 16 }}>📚 Glossary</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {b1r.glossary.map((g, i) => (
                            <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 1fr auto', gap: 12, alignItems: 'start', padding: '10px 14px', borderRadius: 12, background: '#f8fafc', border: '1px solid rgba(14,165,233,0.1)' }}>
                              <span style={{ fontSize: 14, fontWeight: 900, color: '#0369a1' }}>{g.term}</span>
                              <span style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>{g.definition}</span>
                              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, fontStyle: 'italic' }}>{g.translation}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Comprehension (MC) */}
                    {b1r.comprehension_questions?.length > 0 && (
                      <div className="glass-card" style={{ padding: 28 }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: '#0c4a6e', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 18 }}>🔤 Comprehension Questions</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                          {b1r.comprehension_questions.map(q => {
                            const sel = b1RdMC[q.id]
                            const correct = b1RdChecked ? sel?.[0] === q.answer : null
                            return (
                              <div key={q.id}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>{q.id}. {q.question}</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                  {q.options.map(opt => {
                                    const isSelected = sel === opt
                                    const isCorrect  = b1RdChecked && opt[0] === q.answer
                                    const isWrong    = b1RdChecked && isSelected && opt[0] !== q.answer
                                    return (
                                      <button key={opt} onClick={() => { if (!b1RdChecked) setB1RdMC(p => ({ ...p, [q.id]: opt })) }}
                                        style={{ textAlign: 'left', padding: '10px 16px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: b1RdChecked ? 'default' : 'pointer', border: '1.5px solid', borderColor: isCorrect ? '#16a34a' : isWrong ? '#dc2626' : isSelected ? '#0ea5e9' : 'rgba(14,165,233,0.15)', background: isCorrect ? 'rgba(34,197,94,0.08)' : isWrong ? 'rgba(239,68,68,0.08)' : isSelected ? 'rgba(14,165,233,0.08)' : '#f8fafc', color: isCorrect ? '#16a34a' : isWrong ? '#dc2626' : isSelected ? '#0369a1' : '#475569', transition: 'all 0.15s' }}>
                                        {opt} {b1RdChecked && isCorrect ? '✓' : b1RdChecked && isWrong ? '✗' : ''}
                                      </button>
                                    )
                                  })}
                                </div>
                                {b1RdChecked && <div style={{ marginTop: 8, fontSize: 13, color: '#475569', fontWeight: 600, background: 'rgba(14,165,233,0.06)', borderRadius: 10, padding: '8px 12px' }}>{q.explanation}</div>}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* True / False */}
                    {b1r.true_false_questions?.length > 0 && (
                      <div className="glass-card" style={{ padding: 28 }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: '#0c4a6e', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 18 }}>✅ True / False</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {b1r.true_false_questions.map(q => {
                            const sel = b1RdTF[q.id]
                            const correct = b1RdChecked ? sel === q.answer : null
                            return (
                              <div key={q.id} style={{ background: b1RdChecked ? (correct ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)') : '#f8fafc', borderRadius: 14, padding: '14px 18px', border: `1px solid ${b1RdChecked ? (correct ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)') : 'rgba(14,165,233,0.1)'}` }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>{q.id}. {q.statement}</div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                  {([true, false] as const).map(val => (
                                    <button key={String(val)} onClick={() => { if (!b1RdChecked) setB1RdTF(p => ({ ...p, [q.id]: val })) }}
                                      style={{ padding: '6px 20px', borderRadius: 999, fontSize: 13, fontWeight: 800, cursor: b1RdChecked ? 'default' : 'pointer', border: '2px solid', borderColor: sel === val ? '#0ea5e9' : 'rgba(14,165,233,0.2)', background: sel === val ? '#0ea5e9' : '#fff', color: sel === val ? '#fff' : '#64748b', transition: 'all 0.15s' }}>
                                      {val ? 'True' : 'False'}
                                    </button>
                                  ))}
                                  {b1RdChecked && <span style={{ fontSize: 13, fontWeight: 800, color: correct ? '#16a34a' : '#dc2626', marginLeft: 6, alignSelf: 'center' }}>{correct ? '✓ Correct' : `✗ ${q.answer ? 'True' : 'False'}`}</span>}
                                </div>
                                {b1RdChecked && <div style={{ marginTop: 8, fontSize: 12, color: '#64748b', fontWeight: 600, fontStyle: 'italic' }}>Evidence: &quot;{q.evidence}&quot;</div>}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Vocabulary in Context */}
                    {b1r.vocabulary_in_context?.length > 0 && (
                      <div className="glass-card" style={{ padding: 28 }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: '#0c4a6e', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 18 }}>🔍 Vocabulary in Context</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                          {b1r.vocabulary_in_context.map(q => {
                            const sel = b1RdVIC[q.id]
                            const correct = b1RdChecked ? sel?.[0] === q.answer : null
                            const parts = q.sentence.split('[BLANK]')
                            return (
                              <div key={q.id}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>
                                  {q.id}. {parts[0]}<span style={{ background: '#fef9c3', border: '1px solid #fcd34d', borderRadius: 6, padding: '2px 8px', color: '#92400e', fontWeight: 900 }}>___</span>{parts[1]}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                  {q.options.map(opt => {
                                    const isSelected = sel === opt
                                    const isCorrect  = b1RdChecked && opt[0] === q.answer
                                    const isWrong    = b1RdChecked && isSelected && opt[0] !== q.answer
                                    return (
                                      <button key={opt} onClick={() => { if (!b1RdChecked) setB1RdVIC(p => ({ ...p, [q.id]: opt })) }}
                                        style={{ textAlign: 'left', padding: '10px 16px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: b1RdChecked ? 'default' : 'pointer', border: '1.5px solid', borderColor: isCorrect ? '#16a34a' : isWrong ? '#dc2626' : isSelected ? '#0ea5e9' : 'rgba(14,165,233,0.15)', background: isCorrect ? 'rgba(34,197,94,0.08)' : isWrong ? 'rgba(239,68,68,0.08)' : isSelected ? 'rgba(14,165,233,0.08)' : '#f8fafc', color: isCorrect ? '#16a34a' : isWrong ? '#dc2626' : isSelected ? '#0369a1' : '#475569', transition: 'all 0.15s' }}>
                                        {opt} {b1RdChecked && isCorrect ? '✓' : b1RdChecked && isWrong ? '✗' : ''}
                                      </button>
                                    )
                                  })}
                                </div>
                                {b1RdChecked && <div style={{ marginTop: 8, fontSize: 13, color: '#475569', fontWeight: 600, background: 'rgba(14,165,233,0.06)', borderRadius: 10, padding: '8px 12px' }}>{q.explanation}</div>}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Critical Thinking */}
                    {b1r.critical_thinking?.length > 0 && (
                      <div className="glass-card" style={{ padding: 28 }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: '#0c4a6e', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 18 }}>💡 Critical Thinking</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          {b1r.critical_thinking.map(q => (
                            <div key={q.id} style={{ borderRadius: 14, border: '1px solid rgba(14,165,233,0.12)', overflow: 'hidden' }}>
                              <div style={{ padding: '14px 18px', background: 'rgba(14,165,233,0.05)', fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{q.id}. {q.question}</div>
                              <div style={{ padding: '10px 18px' }}>
                                <button onClick={() => setB1RdCTShow(p => ({ ...p, [q.id]: !p[q.id] }))}
                                  style={{ fontSize: 13, fontWeight: 800, color: '#0369a1', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                  {b1RdCTShow[q.id] ? '▲ Hide suggested answer' : '▼ Show suggested answer'}
                                </button>
                                {b1RdCTShow[q.id] && (
                                  <div style={{ marginTop: 10, fontSize: 13, color: '#475569', fontWeight: 600, lineHeight: 1.7, background: '#f8fafc', borderRadius: 10, padding: '12px 16px', borderLeft: '3px solid #0ea5e9' }}>
                                    {q.suggested_answer}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Check / Reset */}
                    <div style={{ display: 'flex', gap: 12 }}>
                      {!b1RdChecked ? (
                        <button onClick={() => setB1RdChecked(true)}
                          style={{ padding: '12px 32px', borderRadius: 999, background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', color: '#fff', fontWeight: 900, fontSize: 15, border: 'none', cursor: 'pointer' }}>
                          Check Answers
                        </button>
                      ) : (
                        <button onClick={() => { setB1RdMC({}); setB1RdTF({}); setB1RdVIC({}); setB1RdCTShow({}); setB1RdChecked(false) }}
                          style={{ padding: '12px 32px', borderRadius: 999, background: '#f1f5f9', color: '#475569', fontWeight: 900, fontSize: 15, border: '1.5px solid rgba(14,165,233,0.2)', cursor: 'pointer' }}>
                          Try Again
                        </button>
                      )}
                    </div>
                  </div>
                )
              }

              // ── A1 reading branch ──────────────────────────────────────
              const rc = rawRd as ReadingContent | null
              if (!rc?.passage) return (
                <div className="glass-card" style={{ padding: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <span style={{ fontSize: 20 }}>📖</span>
                    <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: 0 }}>Reading</h2>
                  </div>
                  <div style={{ color: '#94a3b8', fontWeight: 700 }}>Текст для чтения не добавлен</div>
                </div>
              )
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {/* Passage */}
                  <div className="glass-card" style={{ padding: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                      <span style={{ fontSize: 20 }}>📖</span>
                      <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: 0 }}>{rc.title}</h2>
                    </div>
                    <div style={{ fontSize: 15, lineHeight: 2, color: '#1e293b', fontWeight: 600, background: 'rgba(14,165,233,0.04)', borderRadius: 16, padding: '20px 24px', borderLeft: '4px solid #0ea5e9' }}>
                      {rc.passage}
                    </div>
                  </div>

                  {/* True / False */}
                  {rc.true_false?.length > 0 && (
                    <div className="glass-card" style={{ padding: 28 }}>
                      <div style={{ fontSize: 13, fontWeight: 900, color: '#0c4a6e', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 18 }}>✅ True / False</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {rc.true_false.map(q => {
                          const sel = rdTF[q.id]
                          const correct = rdChecked ? sel === q.answer : null
                          return (
                            <div key={q.id} style={{ background: rdChecked ? (correct ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)') : '#f8fafc', borderRadius: 14, padding: '14px 18px', border: `1px solid ${rdChecked ? (correct ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)') : 'rgba(14,165,233,0.1)'}` }}>
                              <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>{q.id}. {q.statement}</div>
                              <div style={{ display: 'flex', gap: 10 }}>
                                {([true, false] as const).map(val => (
                                  <button key={String(val)} onClick={() => { if (!rdChecked) setRdTF(p => ({ ...p, [q.id]: val })) }}
                                    style={{ padding: '6px 20px', borderRadius: 999, fontSize: 13, fontWeight: 800, cursor: rdChecked ? 'default' : 'pointer', border: '2px solid', borderColor: sel === val ? '#0ea5e9' : 'rgba(14,165,233,0.2)', background: sel === val ? '#0ea5e9' : '#fff', color: sel === val ? '#fff' : '#64748b', transition: 'all 0.15s' }}>
                                    {val ? 'True' : 'False'}
                                  </button>
                                ))}
                                {rdChecked && <span style={{ fontSize: 13, fontWeight: 800, color: correct ? '#16a34a' : '#dc2626', marginLeft: 6, alignSelf: 'center' }}>{correct ? '✓ Correct' : `✗ Answer: ${q.answer ? 'True' : 'False'}`}</span>}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Multiple Choice */}
                  {rc.multiple_choice?.length > 0 && (
                    <div className="glass-card" style={{ padding: 28 }}>
                      <div style={{ fontSize: 13, fontWeight: 900, color: '#0c4a6e', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 18 }}>🔤 Multiple Choice</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        {rc.multiple_choice.map(q => {
                          const sel = rdMC[q.id]
                          const correct = rdChecked ? sel === q.answer : null
                          return (
                            <div key={q.id}>
                              <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>{q.id}. {q.question}</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                {q.options.map(opt => {
                                  const isSelected = sel === opt
                                  const isCorrect = rdChecked && opt === q.answer
                                  const isWrong   = rdChecked && isSelected && opt !== q.answer
                                  return (
                                    <button key={opt} onClick={() => { if (!rdChecked) setRdMC(p => ({ ...p, [q.id]: opt })) }}
                                      style={{ textAlign: 'left', padding: '10px 16px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: rdChecked ? 'default' : 'pointer', border: '1.5px solid', borderColor: isCorrect ? '#16a34a' : isWrong ? '#dc2626' : isSelected ? '#0ea5e9' : 'rgba(14,165,233,0.15)', background: isCorrect ? 'rgba(34,197,94,0.08)' : isWrong ? 'rgba(239,68,68,0.08)' : isSelected ? 'rgba(14,165,233,0.08)' : '#f8fafc', color: isCorrect ? '#16a34a' : isWrong ? '#dc2626' : isSelected ? '#0369a1' : '#475569', transition: 'all 0.15s' }}>
                                      {opt} {rdChecked && isCorrect ? '✓' : rdChecked && isWrong ? '✗' : ''}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Fill in Blank */}
                  {rc.fill_in_blank?.sentences?.length > 0 && (
                    <div className="glass-card" style={{ padding: 28 }}>
                      <div style={{ fontSize: 13, fontWeight: 900, color: '#0c4a6e', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>📝 Fill in the Blank</div>
                      <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 16, background: 'rgba(14,165,233,0.06)', borderRadius: 10, padding: '8px 14px' }}>{rc.fill_in_blank.instruction}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {rc.fill_in_blank.sentences.map(s => {
                          const val = rdFIB[s.id] ?? ''
                          const isCorrect = rdChecked ? val.trim().toLowerCase() === s.answer.toLowerCase() : null
                          const parts = s.text.split('___')
                          return (
                            <div key={s.id} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
                              <span style={{ color: '#94a3b8', fontWeight: 900, marginRight: 6 }}>{s.id}.</span>
                              <span>{parts[0]}</span>
                              <input value={val} onChange={e => { if (!rdChecked) setRdFIB(p => ({ ...p, [s.id]: e.target.value })) }}
                                style={{ display: 'inline-block', width: 110, padding: '4px 10px', borderRadius: 8, border: `1.5px solid ${rdChecked ? (isCorrect ? '#16a34a' : '#dc2626') : 'rgba(14,165,233,0.35)'}`, background: rdChecked ? (isCorrect ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)') : '#fff', fontSize: 14, fontWeight: 800, color: rdChecked ? (isCorrect ? '#16a34a' : '#dc2626') : '#0369a1', outline: 'none', textAlign: 'center' }} />
                              {parts[1] && <span>{parts[1]}</span>}
                              {rdChecked && !isCorrect && <span style={{ fontSize: 12, color: '#dc2626', fontWeight: 800 }}>→ {s.answer}</span>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Check / Reset buttons */}
                  <div style={{ display: 'flex', gap: 12 }}>
                    {!rdChecked ? (
                      <button onClick={() => setRdChecked(true)}
                        style={{ padding: '12px 32px', borderRadius: 999, background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', color: '#fff', fontWeight: 900, fontSize: 15, border: 'none', cursor: 'pointer' }}>
                        Check Answers
                      </button>
                    ) : (
                      <button onClick={() => { setRdTF({}); setRdMC({}); setRdFIB({}); setRdChecked(false) }}
                        style={{ padding: '12px 32px', borderRadius: 999, background: '#f1f5f9', color: '#475569', fontWeight: 900, fontSize: 15, border: '1.5px solid rgba(14,165,233,0.2)', cursor: 'pointer' }}>
                        Try Again
                      </button>
                    )}
                  </div>
                </div>
              )
            })()}

            {/* WRITING */}
            {tab === 'writing' && (
              <div className="glass-card" style={{ padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <span style={{ fontSize: 20 }}>✍️</span>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: 0 }}>Writing</h2>
                </div>
                {lesson.writing_task && (
                  <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 16, padding: '16px 20px', marginBottom: 20, fontSize: 15, lineHeight: 1.7, color: '#0369a1', fontWeight: 700 }}>
                    📋 {lesson.writing_task}
                  </div>
                )}
                <textarea
                  value={writingText}
                  onChange={e => { setWritingText(e.target.value); setWritingSaved(false) }}
                  placeholder="Write your answer here..."
                  rows={8}
                  style={{ width: '100%', padding: '16px', borderRadius: 16, border: '1.5px solid rgba(14,165,233,0.2)', background: '#fff', color: '#0f172a', fontSize: 14, fontWeight: 600, lineHeight: 1.8, resize: 'vertical', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(14,165,233,0.5)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(14,165,233,0.2)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                  <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 700 }}>{writingText.trim().split(/\s+/).filter(Boolean).length} слов</span>
                  <button
                    className="btn-primary"
                    onClick={() => { localStorage.setItem(`eng_writing_${lessonId}`, writingText); setWritingSaved(true) }}
                  >
                    {writingSaved ? '✓ Сохранено' : 'Сохранить'}
                  </button>
                </div>
              </div>
            )}

            {/* LISTENING */}
            {tab === 'listening' && (() => {
              const listening = sections.find(s => s.type === 'listening')?.content as ListeningContent | undefined

              if (!listening?.audio_url) {
                return (
                  <div style={{ padding: 40, textAlign: 'center' as const, color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>
                    🎧 Listening материал для этого урока скоро появится
                  </div>
                )
              }

              const listenType = listening.type ?? 'match'
              const totalQ = listening.questions.length
              const correctCount = listenChecked
                ? listening.questions.filter(q => {
                    const userAns = (listenAnswers[q.id] ?? '').trim().toLowerCase()
                    const correct = String(q.answer).trim().toLowerCase()
                    return userAns === correct
                  }).length
                : 0

              return (
                <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>

                  {/* Title + instructions */}
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1B3A6B', margin: '0 0 8px' }}>{listening.title}</h2>
                    <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{listening.instructions}</p>
                  </div>

                  {/* Audio player */}
                  <div style={{ background: '#1B3A6B', borderRadius: 20, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: '#C9933B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>
                        🎧
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{listening.title}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>A1 Beginner • Listening</div>
                      </div>
                    </div>
                    <audio
                      controls
                      src={listening.audio_url}
                      onPlay={() => setListenPlayed(true)}
                      style={{ width: '100%', borderRadius: 8 }}
                      controlsList="nodownload"
                    />
                    {!listenPlayed && (
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center' as const }}>
                        ▶ Прослушайте аудио перед ответом на вопросы
                      </div>
                    )}
                  </div>

                  {/* ── MATCH ── */}
                  {listenType === 'match' && totalQ > 0 && (() => {
                    const firstOpts = listening.questions[0]?.options ?? []
                    return (
                      <>
                        {firstOpts.length > 0 && (
                          <div style={{ background: '#f8fafc', borderRadius: 16, padding: '20px 24px', border: '1px solid rgba(27,58,107,0.08)' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#1B3A6B', marginBottom: 12, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
                              Варианты ответов:
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {firstOpts.map(opt => (
                                <div key={opt.letter} style={{ fontSize: 14, color: '#475569' }}>
                                  <span style={{ fontWeight: 700, color: '#1B3A6B', marginRight: 8 }}>{opt.letter})</span>
                                  {opt.text}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <div style={{ fontSize: 15, fontWeight: 800, color: '#1B3A6B' }}>Сопоставьте вопросы с ответами:</div>
                          {listening.questions.map((q, idx) => {
                            const sel = listenAnswers[q.id]
                            const isCorrect = listenChecked && sel?.toLowerCase() === String(q.answer).toLowerCase()
                            const isWrong   = listenChecked && !!sel && !isCorrect
                            const isEmpty   = listenChecked && !sel
                            const opts = q.options ?? []
                            return (
                              <div key={q.id} style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', border: `1.5px solid ${isCorrect ? '#10b981' : isWrong ? '#ef4444' : isEmpty ? '#f59e0b' : 'rgba(27,58,107,0.1)'}`, display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                                  {idx + 1}
                                </div>
                                <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{q.question}</div>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, justifyContent: 'flex-end' }}>
                                  {opts.map(opt => {
                                    const optCorrect = opt.letter.toLowerCase() === String(q.answer).toLowerCase()
                                    return (
                                      <button
                                        key={opt.letter}
                                        disabled={listenChecked}
                                        onClick={() => setListenAnswers(prev => ({ ...prev, [q.id]: opt.letter }))}
                                        style={{
                                          width: 36, height: 36, borderRadius: 8, fontWeight: 800, fontSize: 13,
                                          cursor: listenChecked ? 'default' : 'pointer',
                                          transition: 'all 0.15s', fontFamily: 'Montserrat',
                                          border: `1.5px solid ${sel === opt.letter ? (listenChecked ? (optCorrect ? '#10b981' : '#ef4444') : '#1B8FC4') : (listenChecked && optCorrect ? '#10b981' : 'rgba(27,58,107,0.15)')}`,
                                          background: sel === opt.letter ? (listenChecked ? (optCorrect ? '#10b981' : '#ef4444') : '#1B8FC4') : (listenChecked && optCorrect ? '#dcfce7' : '#fff'),
                                          color: sel === opt.letter ? '#fff' : (listenChecked && optCorrect ? '#166534' : '#1B3A6B'),
                                        }}
                                      >
                                        {opt.letter.toUpperCase()}
                                      </button>
                                    )
                                  })}
                                </div>
                                {listenChecked && <div style={{ fontSize: 18, flexShrink: 0 }}>{isCorrect ? '✅' : '❌'}</div>}
                              </div>
                            )
                          })}
                        </div>
                      </>
                    )
                  })()}

                  {/* ── TRUE / FALSE ── */}
                  {listenType === 'true_false' && totalQ > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {listening.questions.map((q, idx) => {
                        const sel = listenAnswers[q.id]
                        const isCorrect = listenChecked && sel?.toLowerCase() === String(q.answer).toLowerCase()
                        const isWrong   = listenChecked && !!sel && !isCorrect
                        return (
                          <div key={q.id} style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', border: `1.5px solid ${isCorrect ? '#10b981' : isWrong ? '#ef4444' : 'rgba(27,58,107,0.1)'}`, display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                              {idx + 1}
                            </div>
                            <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{q.question}</div>
                            <div style={{ display: 'flex', gap: 8 }}>
                              {(['true', 'false'] as const).map(opt => {
                                const optCorrect = opt === String(q.answer).toLowerCase()
                                return (
                                  <button
                                    key={opt}
                                    disabled={listenChecked}
                                    onClick={() => setListenAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                    style={{
                                      padding: '6px 16px', borderRadius: 8, fontWeight: 700, fontSize: 13,
                                      cursor: listenChecked ? 'default' : 'pointer', fontFamily: 'Montserrat',
                                      border: `1.5px solid ${sel === opt ? (listenChecked ? (optCorrect ? '#10b981' : '#ef4444') : '#1B8FC4') : (listenChecked && optCorrect ? '#10b981' : 'rgba(27,58,107,0.15)')}`,
                                      background: sel === opt ? (listenChecked ? (optCorrect ? '#10b981' : '#ef4444') : '#1B8FC4') : (listenChecked && optCorrect ? '#dcfce7' : '#fff'),
                                      color: sel === opt ? '#fff' : (listenChecked && optCorrect ? '#166534' : '#1B3A6B'),
                                    }}
                                  >
                                    {opt === 'true' ? 'True' : 'False'}
                                  </button>
                                )
                              })}
                            </div>
                            {listenChecked && <div style={{ fontSize: 18 }}>{isCorrect ? '✅' : '❌'}</div>}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* ── SPEAKER MATCH ── */}
                  {listenType === 'speaker_match' && totalQ > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {listening.questions.map((q, idx) => {
                        const sel = listenAnswers[q.id]
                        const isCorrect = listenChecked && sel?.toLowerCase() === String(q.answer).toLowerCase()
                        const isWrong   = listenChecked && !!sel && !isCorrect
                        const speakerOpts = listening.options ?? ['Tom', 'Anna', 'nobody']
                        return (
                          <div key={q.id} style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', border: `1.5px solid ${isCorrect ? '#10b981' : isWrong ? '#ef4444' : 'rgba(27,58,107,0.1)'}`, display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                              {idx + 1}
                            </div>
                            <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{q.question}</div>
                            <div style={{ display: 'flex', gap: 8 }}>
                              {speakerOpts.map(opt => {
                                const optCorrect = opt.toLowerCase() === String(q.answer).toLowerCase()
                                return (
                                  <button
                                    key={opt}
                                    disabled={listenChecked}
                                    onClick={() => setListenAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                    style={{
                                      padding: '6px 14px', borderRadius: 8, fontWeight: 700, fontSize: 12,
                                      cursor: listenChecked ? 'default' : 'pointer', fontFamily: 'Montserrat',
                                      border: `1.5px solid ${sel === opt ? (listenChecked ? (optCorrect ? '#10b981' : '#ef4444') : '#1B8FC4') : (listenChecked && optCorrect ? '#10b981' : 'rgba(27,58,107,0.15)')}`,
                                      background: sel === opt ? (listenChecked ? (optCorrect ? '#10b981' : '#ef4444') : '#1B8FC4') : (listenChecked && optCorrect ? '#dcfce7' : '#fff'),
                                      color: sel === opt ? '#fff' : (listenChecked && optCorrect ? '#166534' : '#1B3A6B'),
                                    }}
                                  >
                                    {opt}
                                  </button>
                                )
                              })}
                            </div>
                            {listenChecked && <div style={{ fontSize: 18 }}>{isCorrect ? '✅' : '❌'}</div>}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* ── FILL IN THE BLANK ── */}
                  {listenType === 'fill_blank' && totalQ > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {listening.questions.map((q, idx) => {
                        const val = listenAnswers[q.id] ?? ''
                        const isCorrect = listenChecked && val.trim().toLowerCase() === String(q.answer).toLowerCase()
                        const isWrong   = listenChecked && !isCorrect
                        return (
                          <div key={q.id} style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: `1.5px solid ${isCorrect ? '#10b981' : isWrong ? '#ef4444' : 'rgba(27,58,107,0.1)'}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                                {idx + 1}
                              </div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{q.question}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
                              {q.prefix && <span style={{ fontSize: 14, color: '#475569' }}>{q.prefix}</span>}
                              <input
                                value={val}
                                onChange={e => { if (!listenChecked) setListenAnswers(prev => ({ ...prev, [q.id]: e.target.value })) }}
                                disabled={listenChecked}
                                placeholder="..."
                                style={{
                                  padding: '6px 12px', borderRadius: 8, minWidth: 120, outline: 'none',
                                  border: `1.5px solid ${isCorrect ? '#10b981' : isWrong ? '#ef4444' : '#cbd5e1'}`,
                                  fontSize: 14, fontWeight: 600, fontFamily: 'Montserrat',
                                  background: isCorrect ? '#dcfce7' : isWrong ? '#fee2e2' : '#fff',
                                  color: '#1B3A6B',
                                }}
                              />
                              {q.suffix && <span style={{ fontSize: 14, color: '#475569' }}>{q.suffix}</span>}
                              {listenChecked && <span style={{ fontSize: 18 }}>{isCorrect ? '✅' : '❌'}</span>}
                            </div>
                            {listenChecked && isWrong && (
                              <div style={{ marginTop: 8, fontSize: 13, color: '#10b981', fontWeight: 600 }}>
                                Правильный ответ: {String(q.answer)}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* ── ORDERING ── */}
                  {listenType === 'ordering' && totalQ > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>
                        Введите порядковый номер (1–{totalQ}) для каждого слова:
                      </div>
                      {listening.questions.map((q, idx) => {
                        const val = listenAnswers[q.id] ?? ''
                        const isCorrect = listenChecked && Number(val) === Number(q.answer)
                        const isWrong   = listenChecked && !isCorrect
                        return (
                          <div key={q.id} style={{ background: '#fff', borderRadius: 14, padding: '14px 20px', border: `1.5px solid ${isCorrect ? '#10b981' : isWrong ? '#ef4444' : 'rgba(27,58,107,0.1)'}`, display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#64748b', flexShrink: 0 }}>
                              {idx + 1}
                            </div>
                            <div style={{ flex: 1, fontSize: 15, fontWeight: 700, color: '#1B3A6B' }}>{q.question}</div>
                            <input
                              type="number"
                              min={1}
                              max={totalQ}
                              value={val}
                              onChange={e => { if (!listenChecked) setListenAnswers(prev => ({ ...prev, [q.id]: e.target.value })) }}
                              disabled={listenChecked}
                              placeholder="#"
                              style={{
                                width: 60, padding: '6px 10px', borderRadius: 8, textAlign: 'center' as const, outline: 'none',
                                border: `1.5px solid ${isCorrect ? '#10b981' : isWrong ? '#ef4444' : '#cbd5e1'}`,
                                fontSize: 15, fontWeight: 700, fontFamily: 'Montserrat',
                                background: isCorrect ? '#dcfce7' : isWrong ? '#fee2e2' : '#fff',
                                color: '#1B3A6B',
                              }}
                            />
                            {listenChecked && <div style={{ fontSize: 18 }}>{isCorrect ? '✅' : `❌ (${q.answer})`}</div>}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* ── MULTIPLE CHOICE ── */}
                  {listenType === 'multiple_choice' && totalQ > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      {listening.questions.map((q, idx) => {
                        const sel = listenAnswers[q.id]
                        const isCorrect = listenChecked && sel?.toLowerCase() === String(q.answer).toLowerCase()
                        const isWrong   = listenChecked && !!sel && !isCorrect
                        return (
                          <div key={q.id} style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', border: `1.5px solid ${isCorrect ? '#10b981' : isWrong ? '#ef4444' : 'rgba(27,58,107,0.1)'}` }}>
                            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#1B3A6B', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff' }}>
                                {idx + 1}
                              </div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', lineHeight: 1.5 }}>{q.question}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {(q.options ?? []).map(opt => {
                                const isSelected     = sel === opt.letter
                                const isRight        = listenChecked && opt.letter.toLowerCase() === String(q.answer).toLowerCase()
                                const isSelectedWrong = listenChecked && isSelected && !isRight
                                return (
                                  <button
                                    key={opt.letter}
                                    disabled={listenChecked}
                                    onClick={() => setListenAnswers(prev => ({ ...prev, [q.id]: opt.letter }))}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: 12,
                                      padding: '10px 14px', borderRadius: 10, border: '1.5px solid',
                                      cursor: listenChecked ? 'default' : 'pointer',
                                      fontFamily: 'Montserrat', textAlign: 'left' as const,
                                      transition: 'all 0.15s',
                                      borderColor: isRight ? '#10b981' : isSelectedWrong ? '#ef4444' : isSelected ? '#1B8FC4' : 'rgba(27,58,107,0.12)',
                                      background:  isRight ? '#dcfce7' : isSelectedWrong ? '#fee2e2' : isSelected ? 'rgba(27,143,196,0.08)' : '#f8fafc',
                                    }}
                                  >
                                    <div style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, background: isRight ? '#10b981' : isSelectedWrong ? '#ef4444' : isSelected ? '#1B8FC4' : 'rgba(27,58,107,0.08)', color: (isRight || isSelectedWrong || isSelected) ? '#fff' : '#1B3A6B' }}>
                                      {opt.letter.toUpperCase()}
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: 500, flex: 1, color: isRight ? '#166534' : isSelectedWrong ? '#991b1b' : '#1e293b' }}>
                                      {opt.text}
                                    </div>
                                    {listenChecked && isRight        && <div style={{ fontSize: 16 }}>✅</div>}
                                    {listenChecked && isSelectedWrong && <div style={{ fontSize: 16 }}>❌</div>}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Check / Result */}
                  {totalQ > 0 && (!listenChecked ? (
                    <button
                      onClick={() => setListenChecked(true)}
                      disabled={Object.keys(listenAnswers).length < totalQ}
                      style={{
                        padding: '14px 32px', borderRadius: 12, border: 'none', alignSelf: 'center',
                        fontWeight: 700, fontSize: 15, fontFamily: 'Montserrat', transition: 'all 0.2s',
                        cursor: Object.keys(listenAnswers).length < totalQ ? 'default' : 'pointer',
                        background: Object.keys(listenAnswers).length < totalQ ? '#e2e8f0' : '#1B3A6B',
                        color: Object.keys(listenAnswers).length < totalQ ? '#94a3b8' : '#fff',
                      }}
                    >
                      Проверить ({Object.keys(listenAnswers).length}/{totalQ})
                    </button>
                  ) : (
                    <div style={{ background: correctCount === totalQ ? '#dcfce7' : correctCount >= totalQ * 0.6 ? '#fef3c7' : '#fee2e2', borderRadius: 16, padding: '24px', textAlign: 'center' as const }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{correctCount === totalQ ? '🎉' : correctCount >= totalQ * 0.6 ? '👍' : '📚'}</div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: '#1B3A6B', marginBottom: 4 }}>{correctCount} из {totalQ} правильно</div>
                      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
                        {correctCount === totalQ ? 'Отлично! Все ответы верны!' : correctCount >= totalQ * 0.6 ? 'Хороший результат! Прослушайте ещё раз для закрепления.' : 'Прослушайте аудио ещё раз и попробуйте снова.'}
                      </div>
                      <button
                        onClick={() => { setListenAnswers({}); setListenChecked(false) }}
                        style={{ padding: '10px 24px', background: '#1B3A6B', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat' }}
                      >
                        Попробовать снова
                      </button>
                    </div>
                  ))}

                </div>
              )
            })()}

            {/* VOCABULARY */}
            {tab === 'vocabulary' && (() => {
              const vc = sections.find(s => s.type === 'vocabulary')?.content as VocabularyContent | null
              // Fallback to old lesson.vocabulary if no section content
              if (!vc?.words?.length && lesson.vocabulary?.length) {
                return (
                  <div className="glass-card" style={{ padding: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 20 }}>📝</span>
                        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: 0 }}>Vocabulary</h2>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#1B8FC4', background: 'rgba(27,143,196,0.10)', padding: '4px 14px', borderRadius: 99 }}>
                          {lesson.vocabulary!.length} слов
                        </span>
                      </div>
                    </div>
                    <VocabFlashcards items={lesson.vocabulary!} />
                  </div>
                )
              }
              if (!vc?.words?.length) return (
                <div className="glass-card" style={{ padding: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <span style={{ fontSize: 20 }}>📝</span>
                    <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: 0 }}>Vocabulary</h2>
                  </div>
                  <div style={{ color: '#94a3b8', fontWeight: 700 }}>Словарь не добавлен</div>
                </div>
              )
              const matchEx    = vc.exercises?.find(e => e.type === 'match')    as VocabMatchEx    | undefined
              const fibEx      = vc.exercises?.find(e => e.type === 'fill_in_blank') as VocabFIBEx | undefined
              const mcEx       = vc.exercises?.find(e => e.type === 'multiple_choice') as VocabMCEx | undefined
              const shuffledTr = matchEx ? [...matchEx.pairs.map(p => p.translation)].reverse() : []
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                  {/* Word list */}
                  <div className="glass-card" style={{ padding: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                      <span style={{ fontSize: 20 }}>📝</span>
                      <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: 0 }}>{vc.title}</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {vc.words.map((w, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '180px 90px 1fr', gap: 12, padding: '12px 16px', borderRadius: 14, background: i % 2 === 0 ? 'rgba(14,165,233,0.04)' : '#f8fafc', border: '1px solid rgba(14,165,233,0.08)', alignItems: 'start' }}>
                          <div>
                            <span style={{ fontSize: 15, fontWeight: 900, color: '#0284c7' }}>{w.word}</span>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginTop: 2 }}>{w.translation}</div>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', background: '#f1f5f9', borderRadius: 6, padding: '3px 8px', marginTop: 2, display: 'inline-block', whiteSpace: 'nowrap' }}>{w.part_of_speech}</span>
                          <div>
                            <div style={{ fontSize: 13, color: '#334155', fontStyle: 'italic', fontWeight: 600 }}>{w.example}</div>
                            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>{w.example_translation}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Match exercise */}
                  {matchEx && (
                    <div className="glass-card" style={{ padding: 28 }}>
                      <div style={{ fontSize: 13, fontWeight: 900, color: '#0c4a6e', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>🔗 Match</div>
                      <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 16 }}>{matchEx.instruction}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {matchEx.pairs.map((p, i) => {
                            const paired = vocMatchPairs[p.word]
                            const isSel  = vocMatchSel === p.word
                            const isOk   = vocChecked ? paired === p.translation : null
                            return (
                              <button key={i} onClick={() => {
                                if (vocChecked) return
                                if (isSel) { setVocMatchSel(null); return }
                                if (paired) { const np = {...vocMatchPairs}; delete np[p.word]; setVocMatchPairs(np) }
                                setVocMatchSel(p.word)
                              }}
                                style={{ padding: '9px 14px', borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: 'pointer', border: '2px solid', textAlign: 'left', borderColor: isOk === true ? '#16a34a' : isOk === false ? '#dc2626' : isSel ? '#0ea5e9' : paired ? '#7c3aed' : 'rgba(14,165,233,0.2)', background: isOk === true ? 'rgba(34,197,94,0.08)' : isOk === false ? 'rgba(239,68,68,0.08)' : isSel ? 'rgba(14,165,233,0.12)' : paired ? 'rgba(124,58,237,0.07)' : '#f8fafc', color: isSel ? '#0369a1' : '#1e293b' }}>
                                {p.word} {paired ? <span style={{ fontSize: 12, color: '#7c3aed', fontWeight: 700 }}>→ {paired}</span> : ''}
                              </button>
                            )
                          })}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {shuffledTr.map((tr, i) => {
                            const usedBy = Object.entries(vocMatchPairs).find(([, v]) => v === tr)?.[0]
                            return (
                              <button key={i} onClick={() => {
                                if (vocChecked || !vocMatchSel) return
                                if (usedBy) return
                                setVocMatchPairs(p => ({ ...p, [vocMatchSel]: tr }))
                                setVocMatchSel(null)
                              }}
                                style={{ padding: '9px 14px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: vocMatchSel && !usedBy ? 'pointer' : 'default', border: '2px solid', textAlign: 'left', borderColor: usedBy ? '#7c3aed' : 'rgba(14,165,233,0.2)', background: usedBy ? 'rgba(124,58,237,0.07)' : '#f8fafc', color: '#475569', opacity: usedBy ? 0.5 : 1 }}>
                                {tr}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fill in blank */}
                  {fibEx && (
                    <div className="glass-card" style={{ padding: 28 }}>
                      <div style={{ fontSize: 13, fontWeight: 900, color: '#0c4a6e', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>📝 Fill in the Blank</div>
                      <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 16, background: 'rgba(14,165,233,0.06)', borderRadius: 10, padding: '8px 14px' }}>{fibEx.instruction}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {fibEx.sentences.map(s => {
                          const sel = vocFIB[s.id]
                          const ok  = vocChecked ? sel === s.answer : null
                          const parts = s.text.split('___')
                          return (
                            <div key={s.id}>
                              <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                                <span style={{ color: '#94a3b8', fontWeight: 900, marginRight: 6 }}>{s.id}.</span>
                                {parts[0]}<span style={{ display: 'inline-block', minWidth: 90, borderBottom: `2px solid ${ok === true ? '#16a34a' : ok === false ? '#dc2626' : '#0ea5e9'}`, margin: '0 6px', textAlign: 'center', color: ok === true ? '#16a34a' : ok === false ? '#dc2626' : '#0369a1', fontWeight: 900 }}>{sel ?? '___'}</span>{parts[1]}
                                {vocChecked && ok === false && <span style={{ fontSize: 12, color: '#dc2626', fontWeight: 800, marginLeft: 8 }}>→ {s.answer}</span>}
                              </div>
                              {!vocChecked && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                  {s.options.map(opt => (
                                    <button key={opt} onClick={() => setVocFIB(p => ({ ...p, [s.id]: opt }))}
                                      style={{ padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 800, cursor: 'pointer', border: '2px solid', borderColor: sel === opt ? '#0ea5e9' : 'rgba(14,165,233,0.2)', background: sel === opt ? '#0ea5e9' : '#fff', color: sel === opt ? '#fff' : '#475569' }}>
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Multiple choice */}
                  {mcEx && (
                    <div className="glass-card" style={{ padding: 28 }}>
                      <div style={{ fontSize: 13, fontWeight: 900, color: '#0c4a6e', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>🔤 Multiple Choice</div>
                      <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 16 }}>{mcEx.instruction}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        {mcEx.questions.map(q => {
                          const sel = vocMC[q.id]
                          return (
                            <div key={q.id}>
                              <div style={{ fontSize: 15, fontWeight: 900, color: '#0284c7', marginBottom: 8 }}>{q.id}. {q.word}</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {q.options.map(opt => {
                                  const isSel  = sel === opt
                                  const isGood = vocChecked && opt === q.answer
                                  const isBad  = vocChecked && isSel && opt !== q.answer
                                  return (
                                    <button key={opt} onClick={() => { if (!vocChecked) setVocMC(p => ({ ...p, [q.id]: opt })) }}
                                      style={{ textAlign: 'left', padding: '10px 16px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: vocChecked ? 'default' : 'pointer', border: '1.5px solid', borderColor: isGood ? '#16a34a' : isBad ? '#dc2626' : isSel ? '#0ea5e9' : 'rgba(14,165,233,0.15)', background: isGood ? 'rgba(34,197,94,0.08)' : isBad ? 'rgba(239,68,68,0.08)' : isSel ? 'rgba(14,165,233,0.08)' : '#f8fafc', color: isGood ? '#16a34a' : isBad ? '#dc2626' : isSel ? '#0369a1' : '#475569' }}>
                                      {opt} {vocChecked && isGood ? '✓' : vocChecked && isBad ? '✗' : ''}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Check / Reset */}
                  <div style={{ display: 'flex', gap: 12 }}>
                    {!vocChecked ? (
                      <button onClick={() => setVocChecked(true)}
                        style={{ padding: '12px 32px', borderRadius: 999, background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', color: '#fff', fontWeight: 900, fontSize: 15, border: 'none', cursor: 'pointer' }}>
                        Check Answers
                      </button>
                    ) : (
                      <button onClick={() => { setVocMatchSel(null); setVocMatchPairs({}); setVocFIB({}); setVocMC({}); setVocChecked(false) }}
                        style={{ padding: '12px 32px', borderRadius: 999, background: '#f1f5f9', color: '#475569', fontWeight: 900, fontSize: 15, border: '1.5px solid rgba(14,165,233,0.2)', cursor: 'pointer' }}>
                        Try Again
                      </button>
                    )}
                  </div>
                </div>
              )
            })()}

            {/* QUIZ */}
            {tab === 'quiz' && (
              questions.length === 0 || !quizId ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                  <div style={{ fontWeight: 700 }}>Квиз для этого урока ещё не добавлен</div>
                </div>
              ) : (
                <GameQuiz
                  quizId={quizId}
                  questions={questions}
                  lessonId={lessonId}
                  courseId={courseId}
                  userId={userId ?? ''}
                  passThreshold={passThreshold}
                  onNextLesson={() => router.push(`/english/dashboard/courses/${courseId}`)}
                />
              )
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
    </ContentProtection>
  )
}
