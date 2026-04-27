import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createEnglishServerClient } from '@/lib/english/supabase-server'

type Props = {
  children: React.ReactNode
  params:   Promise<{ courseId: string; lessonId: string }>
}

export default async function LessonLayout({ children, params }: Props) {
  const { courseId, lessonId } = await params

  const supabase = await createEnglishServerClient()

  const [{ data: lesson }, { data: course }] = await Promise.all([
    supabase
      .from('english_lessons')
      .select('title, lesson_order')
      .eq('id', lessonId)
      .maybeSingle(),
    supabase
      .from('english_courses')
      .select('title, total_lessons')
      .eq('id', courseId)
      .maybeSingle(),
  ])

  const lessonTitle  = lesson?.title       ?? 'Урок'
  const courseTitle  = course?.title       ?? 'Курс'
  const lessonNum    = lesson?.lesson_order ?? null

  return (
    <div style={{ minHeight: '100vh', background: '#F5F9FD', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{
        height: 52,
        background: '#fff',
        borderBottom: '1px solid rgba(27,59,107,0.09)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxShadow: '0 1px 8px rgba(27,59,107,0.06)',
      }}>
        {/* Left: back button */}
        <Link
          href={`/english/dashboard/courses/${courseId}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
            fontSize: 13, fontWeight: 800, color: '#1B3A6B', textDecoration: 'none',
            padding: '6px 12px', borderRadius: 10,
            border: '1px solid rgba(27,59,107,0.12)',
            background: 'rgba(27,59,107,0.04)',
            transition: 'background 0.15s',
          }}
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          <span style={{ whiteSpace: 'nowrap' }}>← {courseTitle}</span>
        </Link>

        {/* Right: lesson title */}
        <span style={{
          fontSize: 13, fontWeight: 700, color: '#64748b',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          maxWidth: '55%', textAlign: 'right',
        }}>
          {lessonNum != null ? `Урок ${lessonNum}: ` : ''}{lessonTitle}
        </span>
      </header>

      <main style={{ flex: 1 }}>{children}</main>
    </div>
  )
}
