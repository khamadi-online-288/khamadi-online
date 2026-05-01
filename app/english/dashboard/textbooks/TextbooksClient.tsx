'use client'

import { useState, useMemo } from 'react'
import { BookOpen, Download, ExternalLink, Search, Filter, BookMarked, Briefcase, GraduationCap } from 'lucide-react'

interface Textbook {
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
}

interface Props {
  textbooks: Textbook[]
  isTeacher: boolean
}

const FIELD_ICONS: Record<string, string> = {
  'General English':       '🇬🇧',
  'Accounting & Finance':  '📊',
  'Finance & Banking':     '💹',
  'Computer Science & IT': '💻',
  'Hospitality & Tourism': '🏨',
  'Business & Management': '📈',
  'Law & Legal Studies':   '⚖️',
  'Social Sciences':       '🔬',
}

const LEVEL_ORDER: Record<string, number> = {
  'A1': 1, 'A1+': 2, 'A2': 3, 'B1': 4, 'B2': 5, 'C1': 6,
  'A2–B1': 3.5, 'B1–C1': 5,
}

const FIELD_COLORS: Record<string, { bg: string; border: string; badge: string }> = {
  'General English':       { bg: '#EFF6FF', border: '#1B8FC4', badge: '#1B3A6B' },
  'Accounting & Finance':  { bg: '#FFFBEB', border: '#C9933B', badge: '#92400E' },
  'Finance & Banking':     { bg: '#F0FDF4', border: '#16A34A', badge: '#14532D' },
  'Computer Science & IT': { bg: '#F5F3FF', border: '#7C3AED', badge: '#4C1D95' },
  'Hospitality & Tourism': { bg: '#FFF1F2', border: '#E11D48', badge: '#881337' },
  'Business & Management': { bg: '#FFF7ED', border: '#EA580C', badge: '#7C2D12' },
  'Law & Legal Studies':   { bg: '#F8FAFC', border: '#475569', badge: '#1E293B' },
  'Social Sciences':       { bg: '#F0FDFA', border: '#0D9488', badge: '#134E4A' },
}

export default function TextbooksClient({ textbooks, isTeacher }: Props) {
  const [search, setSearch] = useState('')
  const [activeField, setActiveField] = useState<string>('all')
  const [activeType, setActiveType] = useState<'general' | 'esp'>('general')

  const generalEnglish = useMemo(
    () => textbooks.filter(t => t.field === 'General English'),
    [textbooks],
  )
  const espBooks = useMemo(
    () => textbooks.filter(t => t.field !== 'General English'),
    [textbooks],
  )

  const fields = useMemo(
    () => ['all', ...Array.from(new Set(textbooks.map(t => t.field ?? 'Other'))).sort()],
    [textbooks],
  )

  const filtered = useMemo(() => {
    const source = activeType === 'general' ? generalEnglish : espBooks
    return source
      .filter(t => {
        if (activeField !== 'all' && t.field !== activeField) return false
        if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
        return true
      })
      .sort((a, b) => (LEVEL_ORDER[a.level ?? ''] ?? 99) - (LEVEL_ORDER[b.level ?? ''] ?? 99))
  }, [generalEnglish, espBooks, activeType, activeField, search])

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '12px',
            background: 'linear-gradient(135deg, #1B3A6B, #1B8FC4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookOpen size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#1B3A6B', fontFamily: 'Montserrat, sans-serif' }}>
              Учебники
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>
              Двуязычные учебники и методические материалы KHAMADI ENGLISH
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'Учебников', value: textbooks.length, icon: '📚', color: '#1B3A6B' },
            { label: 'General English', value: generalEnglish.length, icon: '🇬🇧', color: '#1B8FC4' },
            { label: 'ESP курсов', value: espBooks.length, icon: '💼', color: '#C9933B' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#fff',
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <span style={{ fontSize: 20 }}>{stat.icon}</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Type tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#E2E8F0', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {([
          { key: 'general', label: 'General English', icon: <GraduationCap size={15} /> },
          { key: 'esp', label: 'English for Specific Purposes', icon: <Briefcase size={15} /> },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveType(tab.key); setActiveField('all') }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', borderRadius: 9, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
              background: activeType === tab.key ? '#1B3A6B' : 'transparent',
              color: activeType === tab.key ? '#fff' : '#64748B',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + Field filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10,
          padding: '8px 14px', flex: 1, minWidth: 200,
        }}>
          <Search size={16} color="#94A3B8" />
          <input
            placeholder="Поиск учебников..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: 14, color: '#1B3A6B', width: '100%', background: 'transparent' }}
          />
        </div>

        {activeType === 'esp' && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {fields.filter(f => f === 'all' || f !== 'General English').map(field => (
              <button
                key={field}
                onClick={() => setActiveField(field)}
                style={{
                  padding: '7px 14px', borderRadius: 8, border: `1.5px solid ${activeField === field ? '#1B3A6B' : '#E2E8F0'}`,
                  background: activeField === field ? '#1B3A6B' : '#fff',
                  color: activeField === field ? '#fff' : '#475569',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                {field !== 'all' && <span>{FIELD_ICONS[field] ?? '📖'}</span>}
                {field === 'all' ? 'Все' : field}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Books grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: '#94A3B8' }}>
          <BookOpen size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
          <p style={{ margin: 0, fontSize: 16 }}>Учебники не найдены</p>
          <p style={{ margin: '4px 0 0', fontSize: 13 }}>Попробуйте изменить фильтры или запустите генератор PDF</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {filtered.map(book => (
            <TextbookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {/* Teacher section link */}
      {isTeacher && (
        <div style={{
          marginTop: 40, padding: '20px 24px',
          background: 'linear-gradient(135deg, #1B3A6B 0%, #1B8FC4 100%)',
          borderRadius: 16, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <BookMarked size={24} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Методические пособия</div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>Доступны в кабинете преподавателя</div>
            </div>
          </div>
          <a
            href="/english/teacher/textbooks"
            style={{
              background: '#C9933B', color: '#fff', padding: '10px 20px',
              borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14,
            }}
          >
            Открыть методички →
          </a>
        </div>
      )}
    </div>
  )
}

function TextbookCard({ book }: { book: Textbook }) {
  const colors = FIELD_COLORS[book.field ?? ''] ?? { bg: '#F8FAFC', border: '#E2E8F0', badge: '#475569' }
  const icon = FIELD_ICONS[book.field ?? ''] ?? '📖'
  const hasFile = !!book.file_url

  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${colors.border}`,
      borderRadius: 18,
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default',
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
      {/* Book cover */}
      <div style={{
        height: 140,
        background: `linear-gradient(135deg, #1B3A6B 0%, #1B8FC4 60%, ${colors.border} 100%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', padding: 20,
      }}>
        {/* Level badge */}
        {book.level && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: '#C9933B', color: '#fff',
            padding: '3px 10px', borderRadius: 20,
            fontSize: 11, fontWeight: 800,
          }}>
            {book.level}
          </div>
        )}

        {/* Icon */}
        <div style={{ fontSize: 40, marginBottom: 6 }}>{icon}</div>

        {/* KHAMADI ENGLISH label */}
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 700, letterSpacing: 1.5 }}>
          KHAMADI ENGLISH
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 18px' }}>
        {/* Field badge */}
        <div style={{
          display: 'inline-block', marginBottom: 8,
          background: colors.bg, color: colors.badge,
          border: `1px solid ${colors.border}`,
          padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
        }}>
          {book.field ?? 'General English'}
        </div>

        {/* Title */}
        <h3 style={{
          margin: '0 0 6px', fontSize: 15, fontWeight: 800,
          color: '#1B3A6B', lineHeight: 1.3,
          fontFamily: 'Montserrat, sans-serif',
        }}>
          {book.title}
        </h3>

        {/* Meta */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {book.pages && book.pages > 0 && (
            <span style={{ fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
              📄 {book.pages} стр.
            </span>
          )}
          <span style={{ fontSize: 12, color: '#64748B' }}>
            🌐 Двуязычный
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          {hasFile ? (
            <>
              <a
                href={book.file_url!}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: 'linear-gradient(135deg, #1B3A6B, #1B8FC4)',
                  color: '#fff', textDecoration: 'none',
                  padding: '9px 16px', borderRadius: 9,
                  fontSize: 13, fontWeight: 700,
                }}
              >
                <ExternalLink size={14} />
                Читать
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
                Скачать
              </a>
            </>
          ) : (
            <div style={{
              flex: 1, textAlign: 'center', padding: '9px 16px',
              background: '#F1F5F9', borderRadius: 9,
              fontSize: 13, color: '#94A3B8', fontWeight: 600,
            }}>
              📋 Скоро появится
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
