import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://fpcxqhhbzjqucplvzevy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const sql = `
DROP POLICY IF EXISTS "teacher_own_groups" ON english_groups;
CREATE POLICY "teacher_own_groups" ON english_groups FOR ALL USING (
  auth.uid() = teacher_id
  OR EXISTS (
    SELECT 1 FROM english_group_teachers
    WHERE group_id = english_groups.id AND teacher_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM english_user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
`

const { error } = await supabase.rpc('exec_sql', { sql })
if (error) {
  console.error('RPC failed (expected):', error.message)
  console.log('\nRun this SQL manually in Supabase SQL Editor:')
  console.log(sql)
} else {
  console.log('✅ RLS policy updated!')
}
