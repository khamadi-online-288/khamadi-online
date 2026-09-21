import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import {
  formatRuDateTime,
  loadZkuStudentExportRows,
  requireZkuAdmin,
} from '@/lib/english/zku-students-export'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const FONTS = path.join(process.cwd(), 'public', 'fonts')

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
    doc.text(row.registered_display, left + 36 + colFio, y, {
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
