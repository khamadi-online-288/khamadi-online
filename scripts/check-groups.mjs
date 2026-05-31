import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://fpcxqhhbzjqucplvzevy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const { data, error } = await supabase.from('english_groups').select('id, name, teacher_id, level_code').limit(20)
console.log('Groups:', JSON.stringify(data, null, 2))
if (error) console.error(error)
