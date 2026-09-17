import { NextRequest, NextResponse } from 'next/server'
import {
  createEnglishServiceClient,
  ensureZkuTenantId,
  type ZkuCreateRole,
} from '@/lib/english/zku-create-user'

async function requireAdmin(token: string) {
  const admin = createEnglishServiceClient()
  const { data: { user }, error } = await admin.auth.getUser(token)
  if (error || !user) return { admin, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  const { data: profile } = await admin
    .from('english_user_profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!profile || profile.role !== 'admin') {
    return { admin, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return { admin, error: null as null }
}

async function listAllAuthUsers(admin: ReturnType<typeof createEnglishServiceClient>) {
  const users: Array<{
    id: string
    email?: string
    created_at?: string
    user_metadata?: Record<string, unknown>
  }> = []
  let page = 1
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw new Error(error.message)
    users.push(...(data.users ?? []))
    if (!data.users?.length || data.users.length < 1000) break
    page += 1
    if (page > 20) break
  }
  return users
}

function inferName(meta: Record<string, unknown> | undefined, email: string | undefined): string {
  const fromMeta = typeof meta?.full_name === 'string' ? meta.full_name.trim() : ''
  if (fromMeta) return fromMeta
  if (email) return email.split('@')[0] ?? email
  return 'Student'
}

export type OrphanUser = {
  user_id: string
  email: string
  full_name: string
  role: ZkuCreateRole
  created_at: string | null
}

async function findOrphans(admin: ReturnType<typeof createEnglishServiceClient>): Promise<OrphanUser[]> {
  const [authUsers, profilesRes] = await Promise.all([
    listAllAuthUsers(admin),
    admin.from('english_user_profiles').select('user_id'),
  ])
  if (profilesRes.error) throw new Error(profilesRes.error.message)

  const hasProfile = new Set((profilesRes.data ?? []).map((p: { user_id: string }) => p.user_id))

  return authUsers
    .filter((u) => !hasProfile.has(u.id))
    .map((u) => {
      const meta = (u.user_metadata ?? {}) as Record<string, unknown>
      const roleRaw = meta.role
      const role: ZkuCreateRole =
        roleRaw === 'teacher' ? 'teacher' : 'student'
      return {
        user_id: u.id,
        email: u.email ?? '',
        full_name: inferName(meta, u.email),
        role,
        created_at: u.created_at ?? null,
      }
    })
    .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
}

/** List Auth users that have no english_user_profiles row (invisible in admin). */
export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { admin, error } = await requireAdmin(token)
  if (error) return error

  try {
    const orphans = await findOrphans(admin)
    return NextResponse.json({ count: orphans.length, orphans })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/** Create missing english_user_profiles for orphan Auth users. */
export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { admin, error } = await requireAdmin(token)
  if (error) return error

  let body: { userIds?: string[]; dryRun?: boolean } = {}
  try {
    body = await req.json()
  } catch {
    /* empty body = sync all */
  }

  try {
    const orphans = await findOrphans(admin)
    const selected = body.userIds?.length
      ? orphans.filter((o) => body.userIds!.includes(o.user_id))
      : orphans

    if (body.dryRun) {
      return NextResponse.json({ ok: true, dryRun: true, wouldSync: selected.length, orphans: selected })
    }

    const tenantId = await ensureZkuTenantId(admin)
    const synced: string[] = []
    const failed: Array<{ user_id: string; error: string }> = []

    for (const o of selected) {
      const { error: upsertErr } = await admin.from('english_user_profiles').upsert(
        {
          user_id: o.user_id,
          full_name: o.full_name,
          role: o.role,
          tenant_id: tenantId,
        },
        { onConflict: 'user_id' },
      )
      if (upsertErr) failed.push({ user_id: o.user_id, error: upsertErr.message })
      else synced.push(o.user_id)
    }

    return NextResponse.json({
      ok: true,
      synced: synced.length,
      failed,
      orphans: selected.map((o) => ({ ...o, synced: synced.includes(o.user_id) })),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sync failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
