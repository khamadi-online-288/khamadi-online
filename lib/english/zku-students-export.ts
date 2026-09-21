import { createEnglishServiceClient } from '@/lib/english/zku-create-user'

const PAGE_SIZE = 1000

type ProfileRow = {
  user_id: string
  full_name: string | null
  current_level: string | null
}

export type ZkuStudentExportRow = {
  fio: string
  registered_at: string | null
  registered_display: string
  level: string
}

export function formatRuDateTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Almaty',
  })
}

function displayLevel(raw: string | null | undefined): string {
  const v = raw?.trim()
  if (!v) return '—'
  return v
}

function levelFromLessonId(lessonId: string): string | null {
  const n = parseInt(lessonId.replace(/^l/, '').split('-')[0] ?? '', 10)
  if (Number.isNaN(n) || n <= 0) return null
  if (n <= 16) return 'A1'
  if (n <= 34) return 'A1.1'
  if (n <= 58) return 'A2'
  if (n <= 84) return 'B1'
  return 'B2'
}

const LEVEL_RANK: Record<string, number> = {
  A1: 1, 'A1.1': 2, A2: 3, B1: 4, B2: 5, C1: 6, C2: 7,
}

function maxLevel(a: string | null, b: string | null): string | null {
  if (!a) return b
  if (!b) return a
  return (LEVEL_RANK[a] ?? 0) >= (LEVEL_RANK[b] ?? 0) ? a : b
}

async function fetchAllStudentProfiles(
  admin: ReturnType<typeof createEnglishServiceClient>,
): Promise<ProfileRow[]> {
  const all: ProfileRow[] = []
  let from = 0
  for (;;) {
    const to = from + PAGE_SIZE - 1
    const { data, error } = await admin
      .from('english_user_profiles')
      .select('user_id, full_name, current_level')
      .eq('role', 'student')
      .range(from, to)
    if (error) throw new Error(error.message)
    const batch = (data ?? []) as ProfileRow[]
    all.push(...batch)
    if (batch.length < PAGE_SIZE) break
    from += PAGE_SIZE
    if (from > 50_000) break
  }
  return all
}

async function listAuthMeta(
  admin: ReturnType<typeof createEnglishServiceClient>,
): Promise<Map<string, { email: string; created_at: string | null }>> {
  const map = new Map<string, { email: string; created_at: string | null }>()
  let page = 1
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw new Error(error.message)
    for (const u of data.users ?? []) {
      map.set(u.id, { email: u.email ?? '', created_at: u.created_at ?? null })
    }
    if (!data.users?.length || data.users.length < 1000) break
    page += 1
    if (page > 50) break
  }
  return map
}

async function placementLevels(
  admin: ReturnType<typeof createEnglishServiceClient>,
  userIds: string[],
): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  if (userIds.length === 0) return map

  for (let i = 0; i < userIds.length; i += 200) {
    const chunk = userIds.slice(i, i + 200)
    const { data, error } = await admin
      .from('english_placement_results')
      .select('user_id, recommended_level, completed_at')
      .in('user_id', chunk)
      .order('completed_at', { ascending: false })
    if (error) continue
    for (const row of data ?? []) {
      const uid = row.user_id as string
      const lvl = (row.recommended_level as string | null)?.trim()
      if (!lvl || map.has(uid)) continue
      map.set(uid, lvl)
    }
  }
  return map
}

async function progressInferredLevels(
  admin: ReturnType<typeof createEnglishServiceClient>,
  userIds: string[],
): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  if (userIds.length === 0) return map

  for (let i = 0; i < userIds.length; i += 200) {
    const chunk = userIds.slice(i, i + 200)
    const { data, error } = await admin
      .from('english_lesson_progress')
      .select('user_id, lesson_id')
      .in('user_id', chunk)
      .eq('completed', true)
    if (error) continue
    for (const row of data ?? []) {
      const uid = row.user_id as string
      const inferred = levelFromLessonId(String(row.lesson_id ?? ''))
      if (!inferred) continue
      map.set(uid, maxLevel(map.get(uid) ?? null, inferred) ?? inferred)
    }
  }
  return map
}

export async function requireZkuAdmin(token: string) {
  const admin = createEnglishServiceClient()
  const { data: { user }, error: authErr } = await admin.auth.getUser(token)
  if (authErr || !user) return { admin, error: 'Unauthorized' as const }
  const { data: caller } = await admin
    .from('english_user_profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!caller || caller.role !== 'admin') return { admin, error: 'Forbidden' as const }
  return { admin, error: null }
}

/** All students (same scope as admin list), with registration time and resolved level. */
export async function loadZkuStudentExportRows(): Promise<ZkuStudentExportRow[]> {
  const admin = createEnglishServiceClient()
  const profiles = await fetchAllStudentProfiles(admin)
  const userIds = profiles.map((p) => p.user_id)
  const [authMap, placementMap, progressMap] = await Promise.all([
    listAuthMeta(admin),
    placementLevels(admin, userIds),
    progressInferredLevels(admin, userIds),
  ])

  return profiles
    .map((p) => {
      const auth = authMap.get(p.user_id)
      const fio =
        p.full_name?.trim() ||
        auth?.email?.split('@')[0] ||
        auth?.email ||
        '—'
      const merged = maxLevel(
        maxLevel(p.current_level?.trim() || null, placementMap.get(p.user_id) ?? null),
        progressMap.get(p.user_id) ?? null,
      )
      const registered_at = auth?.created_at ?? null
      return {
        fio,
        registered_at,
        registered_display: formatRuDateTime(registered_at),
        level: displayLevel(merged),
      }
    })
    .sort((a, b) => (a.registered_at ?? '').localeCompare(b.registered_at ?? ''))
}
