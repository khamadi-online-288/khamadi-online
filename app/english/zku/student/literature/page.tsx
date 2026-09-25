'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { useZkuLang } from '../zku-lang'
import { IcBookOpen, IcSearch } from '../_icons'
import {
  LITERATURE,
  LIT_LEVELS,
  type LitKind,
  type LitLevel,
  type Localized,
} from '@/lib/english/zku-literature'

const N = '#003876'
const G = '#C9933B'
const MUT = '#64748B'

const LEVEL_COLOR: Record<LitLevel, { color: string; bg: string }> = {
  A1:    { color: N,         bg: '#EEF2F7' },
  'A1.1': { color: '#16A34A', bg: '#DCFCE7' },
  A2:    { color: '#1B8FC4', bg: '#DBEAFE' },
  B1:    { color: '#7C3AED', bg: '#EDE9FE' },
  B2:    { color: '#DB2777', bg: '#FCE7F3' },
  C1:    { color: '#D97706', bg: '#FEF3C7' },
}

type LevelFilter = 'all' | LitLevel
type KindFilter = 'all' | LitKind

function pick(text: Localized, lang: 'ru' | 'kz' | 'en'): string {
  return text[lang]
}

export default function LiteraturePage() {
  const { t, lang } = useZkuLang()
  const [level, setLevel] = useState<LevelFilter>('all')
  const [kind, setKind] = useState<KindFilter>('all')
  const [query, setQuery] = useState('')

  const books = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LITERATURE.filter(book => {
      if (level !== 'all' && book.level !== level) return false
      if (kind !== 'all' && book.kind !== kind) return false
      if (!q) return true
      const blob = `${book.title} ${book.author} ${pick(book.genre, lang)}`.toLowerCase()
      return blob.includes(q)
    })
  }, [level, kind, query, lang])

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: LITERATURE.length }
    for (const code of LIT_LEVELS) {
      map[code] = LITERATURE.filter(b => b.level === code).length
    }
    return map
  }, [])

  return (
    <div style={{ padding: '28px 32px 56px', maxWidth: 1100, margin: '0 auto', fontFamily: "'Montserrat', sans-serif" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: N, margin: '0 0 6px' }}>{t.literature.title}</h1>
        <p style={{ fontSize: 14, color: MUT, margin: 0, lineHeight: 1.5, maxWidth: 680 }}>{t.literature.subtitle}</p>
      </div>

      <div style={{
        background: N, borderRadius: 18, padding: '18px 22px', marginBottom: 20,
        display: 'flex', gap: 14, alignItems: 'flex-start',
        boxShadow: '0 4px 18px rgba(0,56,118,0.16)',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: 'rgba(201,147,59,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IcBookOpen size={20} color={G} />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: G, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
            {t.literature.tip_title}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)', lineHeight: 1.55 }}>{t.literature.tip}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        <FilterChip
          active={level === 'all'}
          label={`${t.literature.all_levels} · ${counts.all}`}
          onClick={() => setLevel('all')}
        />
        {LIT_LEVELS.map(code => (
          <FilterChip
            key={code}
            active={level === code}
            label={`${code} · ${counts[code]}`}
            color={LEVEL_COLOR[code].color}
            onClick={() => setLevel(code)}
          />
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 22 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {([
            ['all', t.literature.all_kinds],
            ['graded', t.literature.graded],
            ['original', t.literature.original],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setKind(key)}
              style={{
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                padding: '8px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                background: kind === key ? N : '#fff',
                color: kind === key ? '#fff' : MUT,
                boxShadow: kind === key ? 'none' : 'inset 0 0 0 1px rgba(0,56,118,0.12)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <label style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8,
          background: '#fff', borderRadius: 999, padding: '8px 14px',
          border: '1px solid rgba(0,56,118,0.12)', minWidth: 240, flex: '1 1 240px', maxWidth: 360,
        }}>
          <IcSearch size={15} color="#94A3B8" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t.literature.search}
            style={{
              border: 'none', outline: 'none', width: '100%',
              fontFamily: 'inherit', fontSize: 13, color: N, background: 'transparent',
            }}
          />
        </label>
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: MUT, marginBottom: 14 }}>
        {books.length} {t.literature.books}
      </div>

      {books.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 18, padding: 48, textAlign: 'center', border: '1px solid rgba(0,56,118,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <IcSearch size={36} color="#CBD5E1" />
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: N, marginBottom: 6 }}>{t.literature.empty}</div>
          <div style={{ fontSize: 13, color: MUT }}>{t.literature.empty_sub}</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {books.map(book => {
            const tone = LEVEL_COLOR[book.level]
            return (
              <article
                key={book.id}
                style={{
                  background: '#fff', borderRadius: 18, padding: '18px 18px 16px',
                  border: '1px solid rgba(0,56,118,0.08)',
                  boxShadow: '0 1px 6px rgba(0,56,118,0.05)',
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 800, color: '#fff', background: tone.color,
                    padding: '3px 10px', borderRadius: 99,
                  }}>{book.level}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: tone.color, background: tone.bg,
                    padding: '3px 10px', borderRadius: 99,
                  }}>
                    {book.kind === 'graded' ? t.literature.kind_graded : t.literature.kind_original}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>{book.year}</span>
                </div>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: N, margin: '0 0 4px', lineHeight: 1.3 }}>{book.title}</h2>
                  <div style={{ fontSize: 13, color: MUT, fontWeight: 600 }}>{book.author}</div>
                </div>
                <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.55, margin: 0, flex: 1 }}>
                  {pick(book.about, lang)}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 8, borderTop: '1px solid #F1F5F9' }}>
                  <Meta>{pick(book.genre, lang)}</Meta>
                  {book.series && <Meta>{book.series}</Meta>}
                  {book.headwords !== null && <Meta>{book.headwords} {t.literature.headwords}</Meta>}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

function FilterChip({
  active, label, onClick, color = N,
}: {
  active: boolean
  label: string
  onClick: () => void
  color?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        padding: '8px 14px', borderRadius: 999, fontSize: 12, fontWeight: 800,
        background: active ? color : '#fff',
        color: active ? '#fff' : color,
        boxShadow: active ? 'none' : 'inset 0 0 0 1px rgba(0,56,118,0.12)',
      }}
    >
      {label}
    </button>
  )
}

function Meta({ children }: { children: ReactNode }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: MUT, background: '#F8FAFC', padding: '4px 8px', borderRadius: 8 }}>
      {children}
    </span>
  )
}
