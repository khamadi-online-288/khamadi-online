import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://fpcxqhhbzjqucplvzevy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// 1. Check if table exists
const { data: tbl, error: tblErr } = await supabase
  .from('english_group_teachers').select('*').limit(10)
console.log('english_group_teachers rows:', tbl, tblErr?.message)

// 2. Check group 201
const { data: grp } = await supabase
  .from('english_groups').select('id, name, teacher_id').eq('name', '201').maybeSingle()
console.log('Group 201:', grp)

// 3. Check teacher profiles
const emails = ['rozaliya.sitalieva@mail.ru','d_sarkulova@mail.ru','astragab@mail.ru','navekovad07@mail.ru']
const { data: users } = await supabase.auth.admin.listUsers()
const mentors = users?.users?.filter(u => emails.includes(u.email ?? ''))
console.log('Mentor user IDs:')
mentors?.forEach(u => console.log(' ', u.email, '->', u.id))

// 4. Check their profiles
const ids = mentors?.map(u => u.id) ?? []
const { data: profiles } = await supabase.from('english_user_profiles').select('user_id, role, full_name').in('user_id', ids)
console.log('Profiles:', profiles)
