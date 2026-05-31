import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://fpcxqhhbzjqucplvzevy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const EMAIL = 'anarkin0000@gmail.com'

const { data: { users } } = await supabase.auth.admin.listUsers()
const user = users?.find(u => u.email === EMAIL)

if (!user) { console.error('User not found:', EMAIL); process.exit(1) }

console.log('Found user:', user.id, user.email)

const { error } = await supabase.from('english_user_profiles').upsert({
  user_id: user.id,
  role: 'admin',
  full_name: user.user_metadata?.full_name ?? user.email?.split('@')[0],
}, { onConflict: 'user_id' })

if (error) console.error('Error:', error.message)
else console.log('✅ Admin role set for', EMAIL)
