import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ACHIEVEMENTS = [
  { key: 'first_simulator', goal: 1, source: 'total_simulators' },
  { key: 'three_simulators', goal: 3, source: 'total_simulators' },
  { key: 'ten_simulators', goal: 10, source: 'total_simulators' },
  { key: 'score_100', goal: 100, source: 'best_score' },
  { key: 'score_120', goal: 120, source: 'best_score' },
  { key: 'study_plan_7', goal: 7, source: 'total_study_done' },
  { key: 'study_plan_30', goal: 30, source: 'total_study_done' },
  { key: 'ai_analysis', goal: 1, source: 'total_ai_analysis' },
  { key: 'streak_3', goal: 3, source: 'streak' },
  { key: 'streak_7', goal: 7, source: 'streak' },
  { key: 'streak_30', goal: 30, source: 'streak' },
  { key: 'first_quiz', goal: 1, source: 'total_quizzes' },
  { key: 'ten_quizzes', goal: 10, source: 'total_quizzes' },
  { key: 'fifty_quizzes', goal: 50, source: 'total_quizzes' },
  { key: 'quiz_perfect', goal: 1, source: 'total_perfect_quizzes' },
]

function calcLevel(xp: number) {
  return Math.max(1, Math.floor(xp / 100) + 1)
}

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Supabase env missing' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const body = await req.json()

    const userId     = String(body.userId || '')
    const action     = String(body.action || '')
    const score      = Number(body.score || 0)
    const xpEarned   = Number(body.xp_earned || 0)
    const sectionId  = body.section_id ? Number(body.section_id) : null
    const subjectId  = body.subject_id ? Number(body.subject_id) : null
    const correctAns = Number(body.correct_answers || 0)
    const totalQ     = Number(body.total_questions || 0)
    const maxStreak  = Number(body.max_streak || 0)
    const diffLabel  = String(body.difficulty || 'medium')
    const timeSecs   = Number(body.time_seconds || 0)

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'userId және action міндетті' },
        { status: 400 }
      )
    }

    const today = new Date().toISOString().slice(0, 10)

    const { data: currentStats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    let stats: any = currentStats || {
      user_id: userId,
      xp: 0,
      level: 1,
      streak: 0,
      longest_streak: 0,
      last_activity_date: null,
      total_simulators: 0,
      total_study_done: 0,
      total_ai_analysis: 0
    }

    const lastDate = stats.last_activity_date as string | null
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

    const { data: existingActivity } = await supabase
      .from('daily_activity')
      .select('id')
      .eq('user_id', userId)
      .eq('activity_date', today)
      .limit(1)

    const alreadyActiveToday = (existingActivity || []).length > 0

    if (!alreadyActiveToday) {
      await supabase.from('daily_activity').insert({
        user_id: userId,
        activity_date: today,
        activity_type: action
      })

      if (lastDate === yesterday) {
        stats.streak = Number(stats.streak || 0) + 1
      } else if (lastDate === today) {
        stats.streak = Number(stats.streak || 0)
      } else {
        stats.streak = 1
      }

      stats.longest_streak = Math.max(
        Number(stats.longest_streak || 0),
        Number(stats.streak || 0)
      )

      stats.last_activity_date = today
    }

    let xpGain = 0

    if (action === 'simulator_finished') {
      stats.total_simulators = Number(stats.total_simulators || 0) + 1
      xpGain += 30
      if (score >= 100) xpGain += 20
      if (score >= 120) xpGain += 30
    }

    if (action === 'study_plan_done') {
      stats.total_study_done = Number(stats.total_study_done || 0) + 1
      xpGain += 10
    }

    if (action === 'ai_analysis_done') {
      stats.total_ai_analysis = Number(stats.total_ai_analysis || 0) + 1
      xpGain += 15
    }

    if (action === 'quiz_finished') {
      stats.total_quizzes = Number(stats.total_quizzes || 0) + 1
      xpGain += xpEarned
      const isPerfect = totalQ > 0 && correctAns === totalQ
      if (isPerfect) {
        stats.total_perfect_quizzes = Number(stats.total_perfect_quizzes || 0) + 1
      }
      /* quiz_results row is inserted directly by the quiz page — no duplicate insert here */
    }

    stats.xp = Number(stats.xp || 0) + xpGain
    stats.level = calcLevel(Number(stats.xp || 0))
    stats.updated_at = new Date().toISOString()

    const { error: upsertStatsError } = await supabase
      .from('user_stats')
      .upsert(stats, { onConflict: 'user_id' })

    if (upsertStatsError) {
      return NextResponse.json(
        { error: upsertStatsError.message },
        { status: 500 }
      )
    }

    const { data: simResults } = await supabase
      .from('simulator_results')
      .select('total_score')
      .eq('user_id', userId)

    const bestScore = Math.max(
      0,
      ...(simResults || []).map((x: any) => Number(x.total_score || 0))
    )

    const achievementRows = ACHIEVEMENTS.map((a) => {
      let value = 0

      if (a.source === 'total_simulators') value = Number(stats.total_simulators || 0)
      if (a.source === 'total_study_done') value = Number(stats.total_study_done || 0)
      if (a.source === 'total_ai_analysis') value = Number(stats.total_ai_analysis || 0)
      if (a.source === 'streak') value = Number(stats.streak || 0)
      if (a.source === 'best_score') value = bestScore
      if (a.source === 'total_quizzes') value = Number(stats.total_quizzes || 0)
      if (a.source === 'total_perfect_quizzes') value = Number(stats.total_perfect_quizzes || 0)

      return {
        user_id: userId,
        achievement_key: a.key,
        unlocked: value >= a.goal,
        progress: Math.min(value, a.goal),
        unlocked_at: value >= a.goal ? new Date().toISOString() : null
      }
    })

    for (const row of achievementRows) {
      const { data: existing } = await supabase
        .from('user_achievements')
        .select('id, unlocked, unlocked_at')
        .eq('user_id', row.user_id)
        .eq('achievement_key', row.achievement_key)
        .maybeSingle()

      if (!existing) {
        await supabase.from('user_achievements').insert(row)
      } else {
        await supabase
          .from('user_achievements')
          .update({
            progress: row.progress,
            unlocked: row.unlocked || existing.unlocked,
            unlocked_at: existing.unlocked_at || row.unlocked_at
          })
          .eq('id', existing.id)
      }
    }

    return NextResponse.json({
      success: true,
      xp: stats.xp,
      level: stats.level,
      streak: stats.streak,
      longest_streak: stats.longest_streak
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Gamification update қатесі' },
      { status: 500 }
    )
  }
}