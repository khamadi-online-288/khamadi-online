'use client'
import type { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface VocabWord { id: string; word: string; translation?: string; definition?: string; difficulty: number; next_review_at: string; correct_count: number; incorrect_count: number; added_at: string }

const STATUS_LABEL: Record<number, string> = { 0: 'Новое', 1: 'Изучается', 2: 'Повторение', 3: 'Выучено' }
const STATUS_COLOR: Record<number, string> = { 0: '#94a3b8', 1: '#f59e0b', 2: '#1B8FC4', 3: '#10b981' }

export default function VocabularyPage() {
  const supabase = createEnglishClient()
  const [words, setWords] = useState<VocabWord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newWord, setNewWord] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')
  const [uid, setUid] = useState('')

  const now = new Date()
  const dueWords = words.filter(w => new Date(w.next_review_at) <= now)
  const masteredWords = words.filter(w => w.difficulty >= 3)

  useEffect(() => {
    supabase.auth.getSession().then((res: { data: { session: Session | null } }) => {
      const session = res.data.session
      if (!session) return
      setUid(session.user.id)
      load(session.user.id)
    })
  }, [])

  async function load(userId: string) {
    setLoading(true)
    const { data } = await supabase.from('english_vocabulary').select('*').eq('user_id', userId).order('added_at', { ascending: false })
    setWords((data ?? []) as VocabWord[])
    setLoading(false)
  }

  async function addWord() {
    if (!newWord.trim() || !uid) return
    setAdding(true); setAddError('')
    try {
      const prompt = `Для английского слова "${newWord.trim()}" дай JSON без лишнего текста:\n{"translation":"перевод на русский","definition":"краткое определение на английском (1 предложение)","etymology":"происхождение слова на русском (2 предложения, интересно)","root_words":["3-4 однокоренных слова"],"example_sentence":"пример предложения"}`
      const resp = await fetch('/api/english/ai-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, maxTokens: 400 }) })
      const { text } = await resp.json()
      let info: Record<string, unknown> = {}
      try { info = JSON.parse(text.replace(/```json\n?|```/g, '').trim()) } catch { info = { translation: '', definition: '', etymology: '', root_words: [], example_sentence: '' } }

      await supabase.from('english_vocabulary').upsert({ user_id: uid, word: newWord.trim().toLowerCase(), translation: info.translation as string, definition: info.definition as string, etymology: info.etymology as string, root_words: info.root_words as string[], example_sentence: info.example_sentence as string }, { onConflict: 'user_id,word' })
      setNewWord(''); setShowAdd(false)
      load(uid)
    } catch { setAddError('Ошибка. Попробуйте ещё раз.') }
    setAdding(false)
  }

  const filtered = words.filter(w => !search || w.word.toLowerCase().includes(search.toLowerCase()) || (w.translation ?? '').toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap' as const, gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1B3A6B', margin: '0 0 4px' }}>Мой словарь</h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Персональная коллекция слов с SRS-повторением</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {dueWords.length > 0 && (
            <Link href="/english/dashboard/vocabulary/practice" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '10px 18px', borderRadius: 11, background: '#1B8FC4', color: '#fff', fontWeight: 800, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', gap: 6 }}>
                Повторить ({dueWords.length})
              </button>
            </Link>
          )}
          <button onClick={() => setShowAdd(s => !s)} style={{ padding: '10px 18px', borderRadius: 11, background: '#1B3A6B', color: '#fff', fontWeight: 800, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>
            + Добавить слово
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
        {[{ label: 'Всего слов', value: words.length, color: '#1B3A6B' }, { label: 'На повторении', value: dueWords.length, color: '#f59e0b' }, { label: 'Выучено', value: masteredWords.length, color: '#10b981' }].map(m => (
          <div key={m.label} style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', border: '1px solid rgba(27,143,196,0.1)' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{m.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Add word modal */}
      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid rgba(27,143,196,0.15)', marginBottom: 20, boxShadow: '0 4px 20px rgba(27,58,107,0.1)' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#1B3A6B', marginBottom: 12 }}>Добавить слово</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={newWord} onChange={e => setNewWord(e.target.value)} onKeyDown={e => e.key === 'Enter' && addWord()} placeholder="Введите английское слово..." autoFocus
              style={{ flex: 1, padding: '10px 14px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 10, fontSize: 14, fontFamily: 'Montserrat', outline: 'none' }} />
            <button onClick={addWord} disabled={adding || !newWord.trim()} style={{ padding: '10px 18px', borderRadius: 10, background: adding ? '#e2e8f0' : '#1B3A6B', color: adding ? '#94a3b8' : '#fff', fontWeight: 700, border: 'none', cursor: adding ? 'default' : 'pointer', fontFamily: 'Montserrat', fontSize: 13 }}>
              {adding ? 'AI генерирует...' : 'Добавить'}
            </button>
          </div>
          {addError && <div style={{ fontSize: 12, color: '#ef4444', marginTop: 8 }}>{addError}</div>}
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>AI автоматически добавит перевод, этимологию и однокоренные слова</div>
        </motion.div>
      )}

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по слову или переводу..." style={{ width: '100%', padding: '10px 14px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 11, fontSize: 13, fontFamily: 'Montserrat', outline: 'none', marginBottom: 16, boxSizing: 'border-box' as const }} />

      {/* Words list */}
      {loading ? <div style={{ textAlign: 'center' as const, padding: 40, color: '#94a3b8' }}>Загрузка...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {filtered.map((w, i) => (
            <motion.div key={w.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
              style={{ background: '#fff', borderRadius: 14, padding: '14px 18px', border: '1px solid rgba(27,143,196,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#1B3A6B' }}>{w.word}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{w.translation ?? '—'}</div>
              </div>
              <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                <span style={{ background: `${STATUS_COLOR[w.difficulty]}20`, color: STATUS_COLOR[w.difficulty], borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{STATUS_LABEL[w.difficulty] ?? 'Новое'}</span>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>
                  {new Date(w.next_review_at) <= now ? 'Повторить сейчас' : `Повторить ${new Date(w.next_review_at).toLocaleDateString('ru-RU')}`}
                </div>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center' as const, padding: 40, color: '#94a3b8', fontSize: 14 }}>
              {words.length === 0 ? 'Ваш словарь пуст. Добавьте первое слово!' : 'Ничего не найдено'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
