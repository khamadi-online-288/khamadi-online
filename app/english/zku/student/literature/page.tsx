'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { ExternalLink, Download } from 'lucide-react'
import { useZkuLang } from '../zku-lang'
import { IcBookOpen, IcSearch } from '../_icons'

export interface Textbook {
  id: string
  title: string
  course_id: string | null
  book_type: 'student' | 'teacher'
  language: string
  level: string | null
  field: string | null
  file_url: string | null
  file_name: string | null
  pages: number | null
  created_at: string
  author?: string | null
  genre?: string | null
  year?: string | number | null
  kind?: 'graded' | 'original' | null
}

interface Props {
  textbooks?: Textbook[]
}

const N = '#003876'
const G = '#C9933B'
const MUT = '#64748B'

// Статический массив всех 22 книг из Supabase Storage
const FALLBACK_BOOKS: Textbook[] = [
  {
    id: '1',
    title: 'Teacher Guide: A1 Beginner English',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/teacher/teacher-guide-a1-beginner.pdf',
    file_name: 'teacher-guide-a1-beginner.pdf',
    field: 'General English',
    level: 'A1',
    book_type: 'teacher',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    title: 'Teacher Guide: Accounting Vocabulary',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/teacher/teacher-guide-accounting.pdf',
    file_name: 'teacher-guide-accounting.pdf',
    field: 'Accounting & Finance',
    level: 'B1–C1',
    book_type: 'teacher',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '3',
    title: 'Teacher Guide: Management Vocabulary',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/teacher/teacher-guide-management.pdf',
    file_name: 'teacher-guide-management.pdf',
    field: 'Business & Management',
    level: 'B1–C1',
    book_type: 'teacher',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '4',
    title: 'A1 Beginner English',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/student/a1-beginner.pdf',
    file_name: 'a1-beginner.pdf',
    field: 'General English',
    level: 'A1',
    book_type: 'student',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '5',
    title: 'A1 Elementary English',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/student/a1-elementary.pdf',
    file_name: 'a1-elementary.pdf',
    field: 'General English',
    level: 'A1+',
    book_type: 'student',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '6',
    title: 'A2 Pre-Intermediate English',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/student/a2-pre-intermediate.pdf',
    file_name: 'a2-pre-intermediate.pdf',
    field: 'General English',
    level: 'A2',
    book_type: 'student',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '7',
    title: 'B1 Intermediate English',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/student/b1-intermediate.pdf',
    file_name: 'b1-intermediate.pdf',
    field: 'General English',
    level: 'B1',
    book_type: 'student',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '8',
    title: 'B2 Upper-Intermediate English',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/student/b2-upper-intermediate.pdf',
    file_name: 'b2-upper-intermediate.pdf',
    field: 'General English',
    level: 'B2',
    book_type: 'student',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '9',
    title: 'C1 Advanced English',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/student/c1-advanced.pdf',
    file_name: 'c1-advanced.pdf',
    field: 'General English',
    level: 'C1',
    book_type: 'student',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '10',
    title: 'Accounting Vocabulary Textbook',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/student/esp-accounting.pdf',
    file_name: 'esp-accounting.pdf',
    field: 'Accounting & Finance',
    level: 'B1–C1',
    book_type: 'student',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '11',
    title: 'Computer Science Vocabulary Textbook',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/student/esp-cs.pdf',
    file_name: 'esp-cs.pdf',
    field: 'Computer Science & IT',
    level: 'B1–C1',
    book_type: 'student',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '12',
    title: 'Hospitality Vocabulary Textbook',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/student/esp-hospitality.pdf',
    file_name: 'esp-hospitality.pdf',
    field: 'Hospitality & Tourism',
    level: 'A2–B1',
    book_type: 'student',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '13',
    title: 'Management Vocabulary Textbook',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/student/esp-management.pdf',
    file_name: 'esp-management.pdf',
    field: 'Business & Management',
    level: 'B1–C1',
    book_type: 'student',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '14',
    title: 'Finance Industry Vocabulary Textbook',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/student/esp-finance.pdf',
    file_name: 'esp-finance.pdf',
    field: 'Finance & Banking',
    level: 'B1–C1',
    book_type: 'student',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '15',
    title: 'Social Sciences Vocabulary Textbook',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/student/esp-social.pdf',
    file_name: 'esp-social.pdf',
    field: 'Social Sciences',
    level: 'B1–C1',
    book_type: 'student',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '16',
    title: 'Law Vocabulary Textbook',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/student/esp-law.pdf',
    file_name: 'esp-law.pdf',
    field: 'Law & Legal Studies',
    level: 'B1–C1',
    book_type: 'student',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '17',
    title: 'KHAMADI ENGLISH General Teacher Guide',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/teacher/teacher-guide-general.pdf',
    file_name: 'teacher-guide-general.pdf',
    field: 'General',
    level: 'All',
    book_type: 'teacher',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '18',
    title: 'Teacher Guide: Finance Industry Vocabulary',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/teacher/teacher-guide-finance.pdf',
    file_name: 'teacher-guide-finance.pdf',
    field: 'Finance & Banking',
    level: 'B1–C1',
    book_type: 'teacher',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '19',
    title: 'Teacher Guide: Computer Science Vocabulary',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/teacher/teacher-guide-cs.pdf',
    file_name: 'teacher-guide-cs.pdf',
    field: 'Computer Science & IT',
    level: 'B1–C1',
    book_type: 'teacher',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '20',
    title: 'Teacher Guide: Hospitality Vocabulary',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/teacher/teacher-guide-hospitality.pdf',
    file_name: 'teacher-guide-hospitality.pdf',
    field: 'Hospitality & Tourism',
    level: 'A2–B1',
    book_type: 'teacher',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '21',
    title: 'Teacher Guide: Law Vocabulary',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/teacher/teacher-guide-law.pdf',
    file_name: 'teacher-guide-law.pdf',
    field: 'Law & Legal Studies',
    level: 'B1–C1',
    book_type: 'teacher',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: '22',
    title: 'Teacher Guide: Social Sciences Vocabulary',
    file_url: 'https://fpcxqhhbzjqucplvzevy.supabase.co/storage/v1/object/public/textbooks/teacher/teacher-guide-social.pdf',
    file_name: 'teacher-guide-social.pdf',
    field: 'Social Sciences',
    level: 'B1–C1',
    book_type: 'teacher',
    course_id: null,
    language: 'en',
    pages: null,
    created_at: '2026-01-01T00:00:00.000Z'
  }
]

const LEVEL_COLOR: Record<string, { color: string; bg: string }> = {
  A1:     { color: N,         bg: '#EEF2F7' },
  'A1+':  { color: '#16A34A', bg: '#DCFCE7' },
  'A1.1': { color: '#16A34A', bg: '#DCFCE7' },
  A2:     { color: '#1B8FC4', bg: '#DBEAFE' },
  'A2–B1':{ color: '#1B8FC4', bg: '#DBEAFE' },
  B1:     { color: '#7C3AED', bg: '#EDE9FE' },
  B2:     { color: '#DB2777', bg: '#FCE7F3' },
  C1:     { color: '#D97706', bg: '#FEF3C7' },
  'B1–C1':{ color: '#7C3AED', bg: '#EDE9FE' },
  All:    { color: N,         bg: '#EEF2F7' },
}

const FIELD_ICONS: Record<string, string> = {
  'General English':       '🇬🇧',
  'General':               '🇬🇧',
  'Accounting & Finance':  '📊',
  'Finance & Banking':     '💹',
  'Computer Science & IT': '💻',
  'Hospitality & Tourism': '🏨',
  'Business & Management': '📈',
  'Law & Legal Studies':   '⚖️',
  'Social Sciences':       '🔬',
}

const FIELD_COLORS: Record<string, { bg: string; border: string; badge: string }> = {
  'General English':       { bg: '#EFF6FF', border: '#1B8FC4', badge: '#1B3A6B' },
  'General':               { bg: '#EFF6FF', border: '#1B8FC4', badge: '#1B3A6B' },
  'Accounting & Finance':  { bg: '#FFFBEB', border: '#C9933B', badge: '#92400E' },
  'Finance & Banking':     { bg: '#F0FDF4', border: '#16A34A', badge: '#14532D' },
  'Computer Science & IT': { bg: '#F5F3FF', border: '#7C3AED', badge: '#4C1D95' },
  'Hospitality & Tourism': { bg: '#FFF1F2', border: '#E11D48', badge: '#881337' },
  'Business & Management': { bg: '#FFF7ED', border: '#EA580C', badge: '#7C2D12' },
  'Law & Legal Studies':   { bg: '#F8FAFC', border: '#475569', badge: '#1E293B' },
  'Social Sciences':       { bg: '#F0FDFA', border: '#0D9488', badge: '#134E4A' },
}

const ALL_LEVELS = ['A1', 'A1+', 'A2', 'B1', 'B2', 'C1', 'A2–B1', 'B1–C1', 'All']

type LevelFilter = 'all' | string
type KindFilter = 'all' | 'student' | 'teacher'

export default function LiteraturePage({ textbooks = [] }: Props) {
  const { t } = useZkuLang()
  const [level, setLevel] = useState<LevelFilter>('all')
  const [kind, setKind] = useState<KindFilter>('all')
  const [query, setQuery] = useState('')

  const sourceTextbooks = useMemo(() => {
    return textbooks && textbooks.length > 0 ? textbooks : FALLBACK_BOOKS
  }, [textbooks])

  const books = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sourceTextbooks.filter(book => {
      if (level !== 'all' && book.level !== level) return false
      if (kind !== 'all' && book.book_type !== kind) return false
      if (!q) return true
      const blob = `${book.title} ${book.author ?? ''} ${book.field ?? ''}`.toLowerCase()
      return blob.includes(q)
    })
  }, [sourceTextbooks, level, kind, query])

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: sourceTextbooks.length }
    for (const code of ALL_LEVELS) {
      map[code] = sourceTextbooks.filter(b => b.level === code).length
    }
    return map
  }, [sourceTextbooks])

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
        {ALL_LEVELS.filter(code => (counts[code] || 0) > 0).map(code => (
          <FilterChip
            key={code}
            active={level === code}
            label={`${code} · ${counts[code] || 0}`}
            color={LEVEL_COLOR[code]?.color ?? N}
            onClick={() => setLevel(code)}
          />
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 22 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'student', 'teacher'] as const).map(key => (
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
              {key === 'all' ? t.literature.all_kinds : key === 'student' ? 'Student' : 'Teacher Guide'}
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {books.map(book => (
            <LiteratureBookCard key={book.id} book={book} t={t} />
          ))}
        </div>
      )}
    </div>
  )
}

function LiteratureBookCard({ book, t }: { book: Textbook; t: any }) {
  const colors = FIELD_COLORS[book.field ?? ''] ?? { bg: '#F8FAFC', border: '#E2E8F0', badge: '#475569' }
  const icon = FIELD_ICONS[book.field ?? ''] ?? '📖'
  const hasFile = !!book.file_url

  return (
    <div
      style={{
        background: '#fff',
        border: `1.5px solid ${colors.border}`,
        borderRadius: 18,
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 32px ${colors.border}33`
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
      }}
    >
      <a
        href={hasFile ? book.file_url! : '#'}
        target={hasFile ? '_blank' : '_self'}
        rel="noopener noreferrer"
        style={{
          height: 140,
          background: `linear-gradient(135deg, #003876 0%, #1B8FC4 60%, ${colors.border} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: 20,
          textDecoration: 'none',
          cursor: hasFile ? 'pointer' : 'default',
        }}
      >
        {book.level && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: G, color: '#fff',
            padding: '3px 10px', borderRadius: 20,
            fontSize: 11, fontWeight: 800,
          }}>
            {book.level}
          </div>
        )}

        {book.book_type && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: 'rgba(255, 255, 255, 0.25)', color: '#fff',
            backdropFilter: 'blur(4px)',
            padding: '3px 10px', borderRadius: 20,
            fontSize: 10, fontWeight: 700,
            textTransform: 'uppercase'
          }}>
            {book.book_type}
          </div>
        )}

        <div style={{ fontSize: 40, marginBottom: 6 }}>{icon}</div>

        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 700, letterSpacing: 1.5 }}>
          LITERATURE
        </div>
      </a>

      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{
            display: 'inline-block',
            background: colors.bg, color: colors.badge,
            border: `1px solid ${colors.border}`,
            padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
          }}>
            {book.field ?? 'General'}
          </div>

          {book.year && (
            <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>{book.year}</span>
          )}
        </div>

        <h3 style={{
          margin: '0 0 4px', fontSize: 15, fontWeight: 800,
          color: N, lineHeight: 1.3,
          fontFamily: 'Montserrat, sans-serif',
        }}>
          {book.title}
        </h3>

        {book.author && (
          <div style={{ fontSize: 12, color: MUT, fontWeight: 600, marginBottom: 12 }}>
            {book.author}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginBottom: 16, marginTop: 'auto', paddingTop: 8 }}>
          {book.pages && book.pages > 0 ? (
            <span style={{ fontSize: 12, color: MUT, display: 'flex', alignItems: 'center', gap: 4 }}>
              📄 {book.pages} pages
            </span>
          ) : (
            <span style={{ fontSize: 12, color: MUT }}>PDF Document</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {hasFile ? (
            <>
              <a
                href={book.file_url!}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: 'linear-gradient(135deg, #003876, #1B8FC4)',
                  color: '#fff', textDecoration: 'none',
                  padding: '9px 16px', borderRadius: 9,
                  fontSize: 13, fontWeight: 700,
                }}
              >
                <ExternalLink size={14} />
                Open
              </a>
              <a
                href={book.file_url!}
                download={book.file_name ?? book.title}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: colors.bg, color: colors.badge,
                  border: `1.5px solid ${colors.border}`,
                  textDecoration: 'none',
                  padding: '9px 14px', borderRadius: 9,
                  fontSize: 13, fontWeight: 700,
                }}
              >
                <Download size={14} />
                Download
              </a>
            </>
          ) : (
            <div style={{
              flex: 1, textAlign: 'center', padding: '9px 16px',
              background: '#F1F5F9', borderRadius: 9,
              fontSize: 13, color: '#94A3B8', fontWeight: 600,
            }}>
              No file available
            </div>
          )}
        </div>
      </div>
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
