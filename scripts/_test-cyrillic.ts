// Run: npx ts-node --project tsconfig.scripts.json scripts/_test-cyrillic.ts
import PDFDocument from 'pdfkit'
import * as fs from 'fs'
import * as path from 'path'

const WIN = 'C:/Windows/Fonts'
const OUT = 'public/textbooks/_cyrillic-test.pdf'

const doc = new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 50, right: 50 } })
doc.registerFont('R', path.join(WIN, 'times.ttf'))
doc.registerFont('B', path.join(WIN, 'timesbd.ttf'))

const stream = fs.createWriteStream(OUT)
doc.pipe(stream)

doc.font('B').fontSize(16).text('=== Cyrillic test ===')
doc.moveDown(0.5)

// Test 1: direct string literal
doc.font('R').fontSize(13).text('1. Direct literal: Привет мир! Казахстан. Добро пожаловать.')
doc.moveDown(0.3)

// Test 2: variable
const ru = 'Бухгалтерский учёт — основа финансовой отчётности.'
doc.font('R').fontSize(13).text('2. Variable: ' + ru)
doc.moveDown(0.3)

// Test 3: template literal
doc.font('R').fontSize(13).text(`3. Template: Активы = Обязательства + Капитал`)
doc.moveDown(0.3)

// Test 4: mixed
doc.font('R').fontSize(13).text('4. Mixed: Assets (Активы) = Liabilities (Обязательства) + Equity (Капитал)')
doc.moveDown(0.3)

// Test 5: check code points are correct
const word = 'Привет'
const codePoints = Array.from(word).map(c => 'U+' + c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')).join(' ')
console.log('Code points of "Привет":', codePoints)
doc.font('R').fontSize(11).text('5. Code points of "' + word + '": ' + codePoints)
doc.moveDown(0.3)

// Test 6: long Russian paragraph
doc.font('R').fontSize(12).text(
  '6. Paragraph: Данный учебник предназначен для студентов экономических факультетов, ' +
  'изучающих профессиональный английский язык в области бухгалтерского учёта. ' +
  'После прохождения курса вы сможете читать финансовую отчётность на английском языке.',
  { lineGap: 3 }
)

doc.end()
stream.on('finish', () => console.log('✅ Written: ' + OUT))
stream.on('error', (e: Error) => console.error('❌ Error:', e))
