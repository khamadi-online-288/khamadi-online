import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { createEnglishServiceClient } from '@/lib/english/zku-create-user'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const FONTS = path.join(process.cwd(), 'public', 'fonts')
const PAGE_SIZE = 1000

type ProfileRow = {
  user_id: string
  full_name: string | null
  current_level: string | null
}

function formatRuDateTime(iso: string | null | undefined): string {
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

/** Normalize CEFR-like level for display (A1, A1.1, A2, B1…). */
function displayLevel(raw: string | null | undefined): string {
  const v = raw?.trim()
  if (!v) return '—'
  return v
}

/**
 * Infer studying level from completed lesson ids (l1… → A1, l17… → A1.1, …).
 * Used only when profile.current_level is empty.
 */
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

  // Chunk .in() queries
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
      if (!lvl || map.has(uid)) continue // first = latest due to order
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

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createEnglishServiceClient()
  const { data: { user }, error: authErr } = await admin.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: caller } = await admin
    .from('english_user_profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!caller || caller.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Same scope as admin students list: all role=student (not only tenant_id=zku).
  // Many legacy signups have tenant_id NULL and were dropped by the old filter (~150).
  let profiles: ProfileRow[]
  try {
    profiles = await fetchAllStudentProfiles(admin)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load students'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  const userIds = profiles.map((p) => p.user_id)
  const [authMap, placementMap, progressMap] = await Promise.all([
    listAuthMeta(admin),
    placementLevels(admin, userIds),
    progressInferredLevels(admin, userIds),
  ])

  const rows = profiles
    .map((p) => {
      const auth = authMap.get(p.user_id)
      const fio =
        p.full_name?.trim() ||
        auth?.email?.split('@')[0] ||
        auth?.email ||
        '—'

      // Merge sources: profile + placement + progress (highest wins).
      // Default DB "A1" alone often hides real placement/progress.
      const merged = maxLevel(
        maxLevel(p.current_level?.trim() || null, placementMap.get(p.user_id) ?? null),
        progressMap.get(p.user_id) ?? null,
      )

      return {
        fio,
        registered_at: auth?.created_at ?? null,
        level: displayLevel(merged),
      }
    })
    .sort((a, b) => (a.registered_at ?? '').localeCompare(b.registered_at ?? ''))

  const PDFDocument = (await import('pdfkit')).default
  const doc = new PDFDocument({ size: 'A4', margin: 40, bufferPages: true })
  doc.registerFont('B', path.join(FONTS, 'DejaVuSans-Bold.ttf'))
  doc.registerFont('R', path.join(FONTS, 'DejaVuSans.ttf'))

  const chunks: Buffer[] = []
  doc.on('data', (c: Buffer) => chunks.push(Buffer.from(c)))

  const pageW = doc.page.width
  const left = 40
  const usable = pageW - 80

  const colFio = usable * 0.48
  const colDate = usable * 0.32
  const colLevel = usable * 0.2

  const drawHeader = () => {
    doc.rect(0, 0, pageW, 56).fill('#003876')
    doc.font('B').fontSize(13).fillColor('#fff')
      .text('ЗКУ · English — список студентов', left, 16, { width: usable })
    doc.font('R').fontSize(9).fillColor('rgba(255,255,255,0.75)')
      .text(
        `Сформировано: ${formatRuDateTime(new Date().toISOString())} · всего: ${rows.length}`,
        left,
        34,
        { width: usable },
      )
  }

  const drawTableHead = (y: number) => {
    doc.rect(left, y, usable, 22).fill('#E8F1FB')
    doc.font('B').fontSize(9).fillColor('#003876')
    doc.text('№', left + 6, y + 6, { width: 28 })
    doc.text('ФИО', left + 36, y + 6, { width: colFio - 10 })
    doc.text('Регистрация', left + 36 + colFio, y + 6, { width: colDate - 6 })
    doc.text('Уровень', left + 36 + colFio + colDate, y + 6, { width: colLevel - 6 })
    return y + 26
  }

  drawHeader()
  let y = 72
  y = drawTableHead(y)

  rows.forEach((row, i) => {
    const rowH = 18
    if (y + rowH > doc.page.height - 40) {
      doc.addPage()
      drawHeader()
      y = 72
      y = drawTableHead(y)
    }

    if (i % 2 === 1) {
      doc.rect(left, y - 2, usable, rowH).fill('#F8FBFF')
    }

    doc.font('R').fontSize(9).fillColor('#0f172a')
    doc.text(String(i + 1), left + 6, y, { width: 28, lineBreak: false })
    doc.text(row.fio, left + 36, y, { width: colFio - 10, lineBreak: false, height: 14 })
    doc.text(formatRuDateTime(row.registered_at), left + 36 + colFio, y, {
      width: colDate - 6,
      lineBreak: false,
    })
    doc.font('B').fillColor('#003876')
      .text(row.level, left + 36 + colFio + colDate, y, { width: colLevel - 6, lineBreak: false })

    y += rowH
  })

  if (rows.length === 0) {
    doc.font('R').fontSize(11).fillColor('#64748b')
      .text('Студентов пока нет.', left, y + 12)
  }

  doc.end()
  await new Promise<void>((resolve, reject) => {
    doc.on('end', resolve)
    doc.on('error', reject)
  })

  const buf = Buffer.concat(chunks)
  const stamp = new Date().toISOString().slice(0, 10)

  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="zku-students-${stamp}.pdf"`,
    },
  })
}
