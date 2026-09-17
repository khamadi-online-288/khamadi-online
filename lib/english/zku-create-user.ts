import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type ZkuCreateRole = 'student' | 'teacher'

export function createEnglishServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Server misconfiguration: missing Supabase service credentials')
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

/** Ensure ZKU tenant row exists and return its UUID. */
export async function ensureZkuTenantId(admin: SupabaseClient): Promise<string> {
  const { data: existing, error: selectErr } = await admin
    .from('english_tenants')
    .select('id')
    .eq('code', 'zku')
    .maybeSingle()

  if (!selectErr && existing?.id) return existing.id as string

  const { data: upserted, error: upsertErr } = await admin
    .from('english_tenants')
    .upsert(
      {
        code: 'zku',
        name: 'ЗКУ by KHAMADI English',
        primary_color: '#003876',
        email_domain: '@zku.kz',
      },
      { onConflict: 'code' },
    )
    .select('id')
    .single()

  if (upsertErr || !upserted?.id) {
    throw new Error(upsertErr?.message ?? 'Failed to resolve ZKU tenant')
  }
  return upserted.id as string
}

export async function createZkuAuthAndProfile(input: {
  email: string
  password: string
  fullName: string
  role: ZkuCreateRole
  emailConfirm?: boolean
}): Promise<{ userId: string }> {
  const admin = createEnglishServiceClient()
  const tenantId = await ensureZkuTenantId(admin)

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: input.emailConfirm ?? true,
    user_metadata: { full_name: input.fullName, role: input.role },
  })
  if (authError) throw new Error(authError.message)

  const userId = authData.user.id
  const { error: profileErr } = await admin.from('english_user_profiles').upsert(
    {
      user_id: userId,
      full_name: input.fullName,
      role: input.role,
      tenant_id: tenantId,
    },
    { onConflict: 'user_id' },
  )

  if (profileErr) {
    await admin.auth.admin.deleteUser(userId)
    throw new Error(profileErr.message)
  }

  return { userId }
}

/** Attach english profile to an existing auth user (e.g. orphaned signup). */
export async function upsertZkuProfileForUser(input: {
  userId: string
  fullName: string
  role: ZkuCreateRole
}): Promise<void> {
  const admin = createEnglishServiceClient()
  const tenantId = await ensureZkuTenantId(admin)
  const { error } = await admin.from('english_user_profiles').upsert(
    {
      user_id: input.userId,
      full_name: input.fullName,
      role: input.role,
      tenant_id: tenantId,
    },
    { onConflict: 'user_id' },
  )
  if (error) throw new Error(error.message)
}
