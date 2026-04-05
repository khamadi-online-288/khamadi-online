import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const DAYS = [
  'Дүйсенбі',
  'Сейсенбі',
  'Сәрсенбі',
  'Бейсенбі',
  'Жұма',
  'Сенбі',
  'Жексенбі'
]

type TopicRow = {
  id: number
  section_id: number | null
  subject_id: number
  name: string
  pdf_url?: string | null
  order_index?: number | null
}

type QuestionCountRow = {
  topic_id: number
  count: number
}

function parseWeakSubjects(raw: string): string[] {
  return raw
    .split('\n')
    .map((x) => x.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-•\d.)\s]+/, '').trim())
    .map((line) => {
      const separators = [' — ', ' - ', ': ']
      for (const sep of separators) {
        if (line.includes(sep)) return line.split(sep)[0].trim()
      }
      return line
    })
    .filter(Boolean)
}

function unique<T>(arr: T[]) {
  return [...new Set(arr)]
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const userId = String(body.userId || '')
    const weakTopicsText = String(body.weakTopics || '')
    const daysCount = Number(body.daysCount || 7)
    const profileSubjects = Array.isArray(body.profileSubjects) ? body.profileSubjects : []

    if (!userId) {
      return NextResponse.json({ error: 'userId міндетті' }, { status: 400 })
    }

    const weakSubjects = parseWeakSubjects(weakTopicsText)
    const targetSubjects = unique(
      [...weakSubjects, ...profileSubjects]
        .map((x) => String(x || '').trim())
        .filter(Boolean)
    )

    if (targetSubjects.length === 0) {
      return NextResponse.json({ error: 'Пәндер табылмады' }, { status: 400 })
    }

    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .select('id, name')
      .in('name', targetSubjects)

    if (subjectsError) {
      return NextResponse.json({ error: subjectsError.message }, { status: 500 })
    }

    if (!subjects || subjects.length === 0) {
      return NextResponse.json({ error: 'subjects table-дан пәндер табылмады' }, { status: 404 })
    }

    const subjectIds = subjects.map((s: any) => s.id)

    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('id, section_id, subject_id, name, pdf_url, order_index')
      .in('subject_id', subjectIds)
      .order('subject_id', { ascending: true })
      .order('order_index', { ascending: true })

    if (topicsError) {
      return NextResponse.json({ error: topicsError.message }, { status: 500 })
    }

    if (!topics || topics.length === 0) {
      return NextResponse.json({ error: 'topics табылмады' }, { status: 404 })
    }

    const topicIds = topics.map((t: any) => t.id)

    const { data: questionCountsRaw, error: questionCountsError } = await supabase
      .from('questions')
      .select('topic_id')
      .in('topic_id', topicIds)

    if (questionCountsError) {
      return NextResponse.json({ error: questionCountsError.message }, { status: 500 })
    }

    const quizCountMap = new Map<number, number>()
    ;(questionCountsRaw || []).forEach((row: any) => {
      const topicId = Number(row.topic_id)
      quizCountMap.set(topicId, (quizCountMap.get(topicId) || 0) + 1)
    })

    const subjectNameById = new Map<number, string>()
    subjects.forEach((s: any) => subjectNameById.set(Number(s.id), String(s.name)))

    const normalizedTopics = (topics as TopicRow[]).map((topic) => ({
      ...topic,
      pdf_url: topic.pdf_url || '',
      quiz_count: quizCountMap.get(Number(topic.id)) || 0,
      subject_name: subjectNameById.get(Number(topic.subject_id)) || 'Пән'
    }))

    const prioritized = [
      ...normalizedTopics.filter((t) => weakSubjects.includes(t.subject_name)),
      ...normalizedTopics.filter((t) => !weakSubjects.includes(t.subject_name))
    ]

    const chosen = prioritized.slice(0, Math.max(daysCount, 7))

    const rows = Array.from({ length: daysCount }).map((_, i) => {
      const topic = chosen[i % chosen.length]

      return {
        user_id: userId,
        day_label: DAYS[i % 7],
        subject: topic.subject_name,
        topic: topic.name,
        task_type: topic.quiz_count > 0 ? 'theory+quiz' : 'theory',
        duration_minutes: topic.quiz_count > 0 ? 75 : 50,
        status: 'todo',
        subject_id: topic.subject_id,
        section_id: topic.section_id,
        topic_id: topic.id,
        topic_name: topic.name,
        pdf_url: topic.pdf_url || '',
        quiz_count: topic.quiz_count
      }
    })

    const { error: deleteError } = await supabase
      .from('study_plans')
      .delete()
      .eq('user_id', userId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    const { error: insertError } = await supabase
      .from('study_plans')
      .insert(rows)

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      count: rows.length
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Study plan generator қатесі' },
      { status: 500 }
    )
  }
}