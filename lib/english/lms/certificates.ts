import type { SupabaseClient } from '@supabase/supabase-js'

export async function checkCertificateEligibility(
  supabase: SupabaseClient,
  studentId: string,
  courseId: string,
  minScore = 70
): Promise<{ eligible: boolean; avgScore: number; progress: number }> {
  const { data: progress } = await supabase
    .from('lms_progress')
    .select('status, score')
    .eq('student_id', studentId)
    .eq('course_id', courseId)

  if (!progress?.length) return { eligible: false, avgScore: 0, progress: 0 }
  const completed = progress.filter(p => p.status === 'completed')
  const pct = Math.round((completed.length / progress.length) * 100)
  const scored = progress.filter(p => p.score != null)
  const avg = scored.length ? Math.round(scored.reduce((s, p) => s + (p.score ?? 0), 0) / scored.length) : 0
  return { eligible: pct >= 80 && avg >= minScore, avgScore: avg, progress: pct }
}

export async function issueCertificate(
  supabase: SupabaseClient,
  studentId: string,
  courseId: string,
  finalScore: number
) {
  const certNum = `KHEN-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  const { data, error } = await supabase
    .from('lms_certificates')
    .insert({ student_id: studentId, course_id: courseId, certificate_number: certNum, final_score: finalScore })
    .select()
    .single()
  if (error) throw error
  return data
}
