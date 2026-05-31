import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ONE-TIME migration route — apply columns for ZKU English ecosystem
// Call once: GET /api/admin/apply-migration
// After success, this route can be deleted

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const steps: string[] = []

  try {
    // Test connection
    const { error: testErr } = await supabase.from('english_lesson_progress').select('id').limit(1)
    if (testErr && !testErr.message.includes('column')) throw testErr

    // Try to insert a row with new columns to see if they exist
    const { error: checkErr } = await supabase
      .from('english_lesson_progress')
      .select('lesson_type, xp_earned, lesson_title')
      .limit(1)

    if (!checkErr) {
      return NextResponse.json({ ok: true, message: 'Columns already exist', steps })
    }

    steps.push('Columns missing — need to add via Supabase SQL editor')

    // Return the SQL to run manually
    const sql = `
-- Run this in Supabase SQL editor: https://supabase.com/dashboard/project/fpcxqhhbzjqucplvzevy/sql

ALTER TABLE english_lesson_progress
  ADD COLUMN IF NOT EXISTS lesson_type   TEXT    DEFAULT 'reading',
  ADD COLUMN IF NOT EXISTS xp_earned     INT     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lesson_title  TEXT,
  ADD COLUMN IF NOT EXISTS module_id     TEXT;

CREATE INDEX IF NOT EXISTS elp_type_idx ON english_lesson_progress (user_id, lesson_type);
CREATE INDEX IF NOT EXISTS eup_active_idx ON english_user_profiles (last_active_at DESC);
`
    return NextResponse.json({
      ok: false,
      message: 'Please run the SQL below in Supabase SQL editor',
      sql,
      link: 'https://supabase.com/dashboard/project/fpcxqhhbzjqucplvzevy/sql',
    })
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
