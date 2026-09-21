import { NextRequest, NextResponse } from 'next/server'
import ExcelJS from 'exceljs'
import {
  formatRuDateTime,
  loadZkuStudentExportRows,
  requireZkuAdmin,
} from '@/lib/english/zku-students-export'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await requireZkuAdmin(token)
  if (error === 'Unauthorized') return NextResponse.json({ error }, { status: 401 })
  if (error === 'Forbidden') return NextResponse.json({ error }, { status: 403 })

  let rows
  try {
    rows = await loadZkuStudentExportRows()
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load students'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'ZKU English'
  workbook.created = new Date()

  const sheet = workbook.addWorksheet('Студенты', {
    views: [{ state: 'frozen', ySplit: 1 }],
  })

  sheet.columns = [
    { header: '№', key: 'n', width: 8 },
    { header: 'ФИО', key: 'fio', width: 36 },
    { header: 'Время регистрации', key: 'registered', width: 22 },
    { header: 'Уровень', key: 'level', width: 12 },
  ]

  const header = sheet.getRow(1)
  header.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  header.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF003876' },
  }
  header.alignment = { vertical: 'middle', horizontal: 'center' }
  header.height = 22

  rows.forEach((row, i) => {
    const r = sheet.addRow({
      n: i + 1,
      fio: row.fio,
      registered: row.registered_display,
      level: row.level,
    })
    if (i % 2 === 1) {
      r.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF8FBFF' },
      }
    }
    r.getCell('level').alignment = { horizontal: 'center' }
    r.getCell('n').alignment = { horizontal: 'center' }
  })

  sheet.addRow([])
  sheet.addRow([
    `Сформировано: ${formatRuDateTime(new Date().toISOString())} · всего: ${rows.length}`,
  ])

  const buffer = await workbook.xlsx.writeBuffer()
  const stamp = new Date().toISOString().slice(0, 10)

  return new NextResponse(Buffer.from(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="zku-students-${stamp}.xlsx"`,
    },
  })
}
