'use client'

import { useState } from 'react'
import { BookOpen, BookMarked, Download, ExternalLink, Users, GraduationCap } from 'lucide-react'

interface Textbook {
  id: string
  title: string
  book_type: 'student' | 'teacher'
  level: string | null
  field: string | null
  file_url: string | null
  file_name: string | null
  pages: number | null
}

interface Props {
  guides: Textbook[]
  studentBooks: Textbook[]
}

const FIELD_ICONS: Record<string, string> = {
  'General English':       '🇬🇧',
  'General':               '📚',
  'Accounting & Finance':  '📊',
  'Finance & Banking':     '💹',
  'Computer Science & IT': '💻',
  'Hospitality & Tourism': '🏨',
  'Business & Management': '📈',
  'Law & Legal Studies':   '⚖️',
  'Social Sciences':       '🔬',
}

export default function TeacherTextbooksClient({ guides, studentBooks }: Props) {
  const [activeTab, setActiveTab] = useState<'guides' | 'student'>('guides')

  const generalGuide = guides.find(g => g.field === 'General')
  const courseGuides = guides.filter(g => g.field !== 'General')

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #1B3A6B, #C9933B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookMarked size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#1B3A6B', fontFamily: 'Montserrat, sans-serif' }}>
              Методические материалы
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>
              Пособия для преподавателей и учебники для студентов
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'Методичек', value: guides.length, icon: '📋', color: '#C9933B' },
            { label: 'Учебников', value: studentBooks.length, icon: '📚', color: '#1B8FC4' },
          ].map(s => (
            <div key={s.label} style={{
              background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12,
              padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: '#E2E8F0', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {([
          { key: 'guides' as const, label: 'Методические пособия', icon: <BookMarked size={15} /> },
          { key: 'student' as const, label: 'Учебники для студентов', icon: <GraduationCap size={15} /> },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', borderRadius: 9, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
              background: activeTab === tab.key ? '#1B3A6B' : 'transparent',
              color: activeTab === tab.key ? '#fff' : '#64748B',
            }}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'guides' ? (
        <div>
          {/* General guide featured card */}
          {generalGuide && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1B3A6B', marginBottom: 12 }}>
                📌 Общее руководство
              </h2>
              <div style={{
                background: 'linear-gradient(135deg, #1B3A6B 0%, #1B8FC4 100%)',
                borderRadius: 18, padding: 28, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 20, flexWrap: 'wrap',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: 48 }}>📘</div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{generalGuide.title}</div>
                    <div style={{ fontSize: 14, opacity: 0.85 }}>Философия платформы, методика, оценивание, AI-инструменты</div>
                    <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>
                      Язык: русский · Рекомендуется прочитать первым
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {generalGuide.file_url && (
                    <>
                      <a href={generalGuide.file_url} target="_blank" rel="noopener noreferrer" style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'rgba(255,255,255,0.2)', color: '#fff',
                        padding: '10px 18px', borderRadius: 10, textDecoration: 'none',
                        fontSize: 13, fontWeight: 700, border: '1.5px solid rgba(255,255,255,0.3)',
                      }}>
                        <ExternalLink size={15} /> Открыть
                      </a>
                      <a href={generalGuide.file_url} download style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: '#C9933B', color: '#fff',
                        padding: '10px 18px', borderRadius: 10, textDecoration: 'none',
                        fontSize: 13, fontWeight: 700,
                      }}>
                        <Download size={15} /> Скачать
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Course guides grid */}
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1B3A6B', marginBottom: 16 }}>
            📚 Методички по курсам
          </h2>
          {courseGuides.length === 0 ? (
            <EmptyState message="Методические пособия ещё не загружены" sub="Запустите generate-teacher-guides.ts и upload-textbooks.ts" />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
              {courseGuides.map(guide => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1B3A6B', marginBottom: 16 }}>
            📖 Учебники студентов (предпросмотр)
          </h2>
          {studentBooks.length === 0 ? (
            <EmptyState message="Учебники ещё не загружены" sub="Запустите generate-textbooks.ts и upload-textbooks.ts" />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
              {studentBooks.map(book => (
                <StudentBookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function GuideCard({ guide }: { guide: Textbook }) {
  const icon = FIELD_ICONS[guide.field ?? ''] ?? '📋'
  const hasFile = !!guide.file_url

  return (
    <div style={{
      background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16,
      overflow: 'hidden', transition: 'all 0.2s',
    }}
      onMouseEnter={e => { ;(e.currentTarget as HTMLDivElement).style.borderColor = '#C9933B'; ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(201,147,59,0.15)' }}
      onMouseLeave={e => { ;(e.currentTarget as HTMLDivElement).style.borderColor = '#E2E8F0'; ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
    >
      {/* Cover */}
      <div style={{
        height: 100, background: 'linear-gradient(135deg, #1B3A6B 0%, #C9933B 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
      }}>
        <span style={{ fontSize: 32 }}>{icon}</span>
        <div style={{ color: '#fff' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, opacity: 0.7 }}>МЕТОДИЧКА</div>
          {guide.level && (
            <div style={{ fontSize: 12, fontWeight: 800, marginTop: 2 }}>{guide.level}</div>
          )}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px' }}>
        <h3 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: '#1B3A6B', lineHeight: 1.3 }}>
          {guide.title}
        </h3>
        {guide.field && (
          <p style={{ margin: '0 0 12px', fontSize: 12, color: '#64748B' }}>{guide.field}</p>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          {hasFile ? (
            <>
              <a href={guide.file_url!} target="_blank" rel="noopener noreferrer" style={{
                flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                background: '#1B3A6B', color: '#fff', padding: '8px', borderRadius: 8,
                textDecoration: 'none', fontSize: 12, fontWeight: 700,
              }}>
                <ExternalLink size={13} /> Открыть
              </a>
              <a href={guide.file_url!} download style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                background: '#FFF7ED', color: '#C9933B', border: '1.5px solid #C9933B',
                padding: '8px 12px', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 700,
              }}>
                <Download size={13} />
              </a>
            </>
          ) : (
            <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: '#F1F5F9', borderRadius: 8, fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>
              Скоро
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StudentBookCard({ book }: { book: Textbook }) {
  const icon = FIELD_ICONS[book.field ?? ''] ?? '📖'
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ fontSize: 28, width: 40, textAlign: 'center', flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1B3A6B', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{book.title}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {book.level && <span style={{ fontSize: 11, background: '#EFF6FF', color: '#1B3A6B', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>{book.level}</span>}
          <span style={{ fontSize: 11, color: '#64748B' }}>Двуязычный</span>
        </div>
      </div>
      {book.file_url && (
        <a href={book.file_url} target="_blank" rel="noopener noreferrer" style={{ color: '#1B8FC4', flexShrink: 0 }}>
          <ExternalLink size={16} />
        </a>
      )}
    </div>
  )
}

function EmptyState({ message, sub }: { message: string; sub: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', background: '#fff', borderRadius: 16, border: '1.5px dashed #E2E8F0' }}>
      <BookOpen size={36} color="#CBD5E1" style={{ marginBottom: 12 }} />
      <p style={{ margin: 0, fontSize: 15, color: '#475569', fontWeight: 600 }}>{message}</p>
      <p style={{ margin: '6px 0 0', fontSize: 13, color: '#94A3B8' }}>{sub}</p>
    </div>
  )
}
