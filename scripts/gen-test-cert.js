// One-off script: generate a test certificate PDF → /public/test-certificate.pdf
// Run: node scripts/gen-test-cert.js
const PDFDocument = require('pdfkit')
const fs   = require('fs')
const path = require('path')
const QRCode = require('qrcode')

const ROOT     = path.join(__dirname, '..')
const FONTS    = path.join(ROOT, 'public', 'fonts')
const OUTPUT   = path.join(ROOT, 'public', 'test-certificate.pdf')

const NAVY  = '#1B3A6B'
const GOLD  = '#C9933B'
const BLUE  = '#1B8FC4'
const BG    = '#FFFEF9'
const SLATE = '#475569'
const MUTED = '#94a3b8'

async function generate() {
  const qrBuf = await QRCode.toBuffer(
    'https://khamadi.online/english/cert/KHEN-2026-TEST-001',
    { type: 'png', width: 160, margin: 1, color: { dark: NAVY, light: BG } }
  )

  const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 })
  doc.pipe(fs.createWriteStream(OUTPUT))

  doc.registerFont('B',  path.join(FONTS, 'DejaVuSans-Bold.ttf'))
  doc.registerFont('R',  path.join(FONTS, 'DejaVuSans.ttf'))
  doc.registerFont('I',  path.join(FONTS, 'DejaVuSans-Oblique.ttf'))

  const W  = doc.page.width   // 841.89
  const H  = doc.page.height  // 595.28
  const cx = W / 2

  // ── Background ──────────────────────────────────────────────────────────────
  doc.rect(0, 0, W, H).fillColor(BG).fill()

  // ── Outer border ─────────────────────────────────────────────────────────────
  doc.rect(5, 5, W - 10, H - 10).strokeColor(NAVY).lineWidth(2).stroke()

  // ── Inner ornamental border ───────────────────────────────────────────────────
  doc.save().opacity(0.4)
  doc.rect(14, 14, W - 28, H - 28).strokeColor(GOLD).lineWidth(0.8).stroke()
  doc.restore()

  // ── Corner L-ornaments ──────────────────────────────────────────────────────
  const co = 18, cs = 28, cw = 1.5, cr = 2.5
  // Top-left
  doc.moveTo(co, co + cs).lineTo(co, co).lineTo(co + cs, co).strokeColor(NAVY).lineWidth(cw).stroke()
  doc.circle(co, co, cr).fillColor(GOLD).fill()
  // Top-right
  doc.moveTo(W - co - cs, co).lineTo(W - co, co).lineTo(W - co, co + cs).strokeColor(NAVY).lineWidth(cw).stroke()
  doc.circle(W - co, co, cr).fillColor(GOLD).fill()
  // Bottom-left
  doc.moveTo(co, H - co - cs).lineTo(co, H - co).lineTo(co + cs, H - co).strokeColor(NAVY).lineWidth(cw).stroke()
  doc.circle(co, H - co, cr).fillColor(GOLD).fill()
  // Bottom-right
  doc.moveTo(W - co - cs, H - co).lineTo(W - co, H - co).lineTo(W - co, H - co - cs).strokeColor(NAVY).lineWidth(cw).stroke()
  doc.circle(W - co, H - co, cr).fillColor(GOLD).fill()

  // ── Header ──────────────────────────────────────────────────────────────────
  doc.font('B').fontSize(17).fillColor(NAVY)
    .text('KHAMADI ENGLISH', 0, 38, { align: 'center', width: W, characterSpacing: 3.5 })

  doc.font('I').fontSize(9.5).fillColor(GOLD)
    .text('by KHAMADI ONLINE', 0, 61, { align: 'center', width: W, characterSpacing: 1.5 })

  // Divider line ◆
  const dY = 80
  doc.save().opacity(0.5)
  doc.moveTo(70, dY).lineTo(cx - 12, dY).strokeColor(GOLD).lineWidth(0.8).stroke()
  doc.moveTo(cx + 12, dY).lineTo(W - 70, dY).strokeColor(GOLD).lineWidth(0.8).stroke()
  doc.restore()
  doc.font('R').fontSize(8).fillColor(GOLD).text('◆', cx - 5, dY - 5.5, { width: 12 })

  // ── Title ───────────────────────────────────────────────────────────────────
  doc.font('B').fontSize(40).fillColor(NAVY)
    .text('СЕРТИФИКАТ', 0, 160, { align: 'center', width: W, characterSpacing: 5 })

  // Gold accent bar
  doc.rect(cx - 30, 206, 60, 2.5).fillColor(GOLD).fill()

  doc.font('R').fontSize(10).fillColor(SLATE)
    .text('о прохождении курса', 0, 214, { align: 'center', width: W, characterSpacing: 1.8 })

  // ── Recipient ────────────────────────────────────────────────────────────────
  doc.font('I').fontSize(11).fillColor(MUTED)
    .text('настоящим подтверждается, что', 0, 240, { align: 'center', width: W })

  doc.font('B').fontSize(32).fillColor(GOLD)
    .text('Адилет Хаметов', 0, 258, { align: 'center', width: W, characterSpacing: 0.8 })

  // Name underline
  doc.save().opacity(0.35)
  doc.rect(cx - 110, 296, 220, 0.8).fillColor(GOLD).fill()
  doc.restore()

  doc.font('I').fontSize(11).fillColor(SLATE)
    .text('успешно завершил(а) курс', 0, 306, { align: 'center', width: W })

  doc.font('B').fontSize(19).fillColor(NAVY)
    .text('Computer Science B1-C1', 0, 324, { align: 'center', width: W })

  doc.font('B').fontSize(11).fillColor(BLUE)
    .text('Уровень: B1-C1  ·  Итоговый балл: 95/100', 0, 350, { align: 'center', width: W })

  // ── Footer ───────────────────────────────────────────────────────────────────
  const fY = H - 82  // ≈ 513

  // Signature 1 — Директор программы
  doc.moveTo(68, fY).lineTo(174, fY).strokeColor(NAVY).lineWidth(0.8).stroke()
  doc.font('B').fontSize(8.5).fillColor(SLATE)
    .text('Директор программы', 66, fY + 5, { width: 110, align: 'center' })

  // Signature 2 — Академический директор (leave right side for QR)
  const s2x = W - 272
  doc.moveTo(s2x, fY).lineTo(s2x + 116, fY).strokeColor(NAVY).lineWidth(0.8).stroke()
  doc.font('B').fontSize(8.5).fillColor(SLATE)
    .text('Академический директор', s2x - 2, fY + 5, { width: 122, align: 'center' })

  // ── Stamp (center) ───────────────────────────────────────────────────────────
  const sX = cx, sY = fY - 18
  doc.circle(sX, sY, 30).strokeColor(NAVY).lineWidth(1.5).dash(3, { space: 2 }).stroke()
  doc.undash()
  doc.circle(sX, sY, 23).strokeColor(GOLD).lineWidth(0.7).stroke()
  doc.font('R').fontSize(13).fillColor(GOLD).text('★', sX - 5.5, sY - 12, { width: 12 })
  doc.font('B').fontSize(5.5).fillColor(NAVY)
    .text('KHAMADI', sX - 16, sY + 2, { width: 32, align: 'center', characterSpacing: 1 })
  doc.font('B').fontSize(5).fillColor(GOLD)
    .text('ENGLISH', sX - 16, sY + 10, { width: 32, align: 'center', characterSpacing: 0.8 })

  // Cert number + date (centered, below stamp area)
  doc.font('R').fontSize(8).fillColor(MUTED)
    .text('№ KHEN-2026-TEST-001', 0, fY + 5, { align: 'center', width: W })
  doc.font('B').fontSize(9).fillColor(SLATE)
    .text('1 мая 2026 г.', 0, fY + 17, { align: 'center', width: W })

  // ── QR code ──────────────────────────────────────────────────────────────────
  const qrSize = 72
  doc.image(qrBuf, W - qrSize - 22, H - qrSize - 20, { width: qrSize, height: qrSize })
  doc.font('R').fontSize(6.5).fillColor(MUTED)
    .text('Сканируй для верификации', W - qrSize - 26, H - 20, { width: qrSize + 10, align: 'center' })

  doc.end()
  console.log('Saved →', OUTPUT)
}

generate().catch(e => { console.error(e); process.exit(1) })
