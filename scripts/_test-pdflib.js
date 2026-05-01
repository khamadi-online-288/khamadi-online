const { PDFDocument, rgb, StandardFonts } = require('pdf-lib')
const fontkit = require('@pdf-lib/fontkit')
const fs = require('fs')

async function test() {
  const pdfDoc = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit)

  const fontBytes = fs.readFileSync('public/fonts/DejaVuSans.ttf')
  const font = await pdfDoc.embedFont(fontBytes)
  const fontBold = await pdfDoc.embedFont(fs.readFileSync('public/fonts/DejaVuSans-Bold.ttf'))

  const page = pdfDoc.addPage([595, 842])
  const { height } = page.getSize()

  let y = height - 60

  page.drawText('=== Тест кириллицы / Cyrillic Test ===', {
    x: 50, y, size: 16, font: fontBold, color: rgb(0.1, 0.2, 0.4)
  })
  y -= 35

  const lines = [
    'Привет мир! Казахстан. Добро пожаловать на платформу.',
    'Бухгалтерский учёт — основа финансовой отчётности.',
    'Активы = Обязательства + Собственный капитал',
    'Mixed: Assets (Активы) = Liabilities (Обязательства) + Equity',
    'KHAMADI ENGLISH — Учебник уровня B1 Intermediate',
    'Урок 1: Глагол to be в настоящем времени',
    'Студент обязан выполнять домашние задания ежедневно.',
  ]

  for (const line of lines) {
    page.drawText(line, { x: 50, y, size: 13, font, color: rgb(0, 0, 0) })
    y -= 25
  }

  const bytes = await pdfDoc.save()
  fs.writeFileSync('public/textbooks/_test-pdflib.pdf', bytes)
  console.log('✅ PDF written:', Math.round(bytes.length / 1024), 'KB')
  console.log('Open: public/textbooks/_test-pdflib.pdf')
}

test().catch(e => { console.error('❌', e.message); process.exit(1) })
