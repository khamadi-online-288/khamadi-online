import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL      = 'https://fpcxqhhbzjqucplvzevy.supabase.co'
const SERVICE_ROLE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SERVICE_ROLE_KEY) { console.error('Set SUPABASE_SERVICE_ROLE_KEY'); process.exit(1) }

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const PASSWORD = 'Aa123456'

const MENTORS = [
  { name: 'Ситалиева Розалия',  level: 'C1', faculty: 'Ментор', phone: '87778607040', email: 'rozaliya.sitalieva@mail.ru' },
  { name: 'Саркулова Дамира',   level: 'C1', faculty: 'Ментор', phone: '87753706445', email: 'd_sarkulova@mail.ru' },
  { name: 'Габдешова Астра',    level: 'C1', faculty: 'Ментор', phone: '87018497123', email: 'astragab@mail.ru' },
  { name: 'Навекова Дамира',    level: 'C1', faculty: 'Ментор', phone: '87471280477', email: 'navekovad07@mail.ru' },
]

// Get group 201 id
const { data: grpData } = await supabase
  .from('english_groups')
  .select('id, name, teacher_id')
  .eq('name', '201')
  .maybeSingle()

if (!grpData) { console.error('Group 201 not found'); process.exit(1) }
const GROUP_ID = grpData.id
console.log(`Group 201 → ${GROUP_ID}`)

for (const m of MENTORS) {
  console.log(`\nCreating teacher: ${m.name} <${m.email}>`)

  // 1. Create auth user
  const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
    email:          m.email,
    password:       PASSWORD,
    email_confirm:  true,
    user_metadata: { full_name: m.name, phone: m.phone, faculty: m.faculty, role: 'teacher' },
  })

  if (authErr) {
    if (authErr.message?.includes('already been registered') || authErr.message?.includes('already exists')) {
      console.log(`  ⚠ Already exists — updating profile`)
      const { data: existing } = await supabase.auth.admin.listUsers()
      const user = existing?.users?.find(u => u.email === m.email)
      if (!user) { console.log('  ✗ Cannot find user'); continue }

      await supabase.from('english_user_profiles').upsert({
        user_id:       user.id,
        full_name:     m.name,
        role:          'teacher',
        current_level: m.level,
      }, { onConflict: 'user_id' })
      console.log(`  ✓ Profile updated`)
      continue
    }
    console.error(`  ✗ Auth error: ${authErr.message}`)
    continue
  }

  const userId = authData.user.id
  console.log(`  ✓ Auth created → ${userId}`)

  // 2. Create teacher profile
  const { error: profErr } = await supabase.from('english_user_profiles').upsert({
    user_id:       userId,
    full_name:     m.name,
    role:          'teacher',
    current_level: m.level,
    tenant_id:     GROUP_ID, // store group reference
  }, { onConflict: 'user_id' })

  if (profErr) console.error(`  ✗ Profile error: ${profErr.message}`)
  else console.log(`  ✓ Profile created (role=teacher)`)
}

// Assign group 201 to first mentor if no teacher assigned yet
if (!grpData.teacher_id) {
  const firstEmail = MENTORS[0].email
  const { data: firstUser } = await supabase.auth.admin.listUsers()
  const u = firstUser?.users?.find(u => u.email === firstEmail)
  if (u) {
    await supabase.from('english_groups').update({ teacher_id: u.id }).eq('id', GROUP_ID)
    console.log(`\n✓ Group 201 teacher_id assigned to ${MENTORS[0].name}`)
  }
} else {
  console.log(`\nGroup 201 already has a teacher assigned`)
}

console.log('\n✅ Done')
