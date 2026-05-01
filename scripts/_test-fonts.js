const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

const WIN_FONTS = 'C:/Windows/Fonts'
const OUT = 'public/fonts'
const TEST_RU = 'Привет мир! Казахстан. Добро пожаловать на платформу.'
const TEST_EN = 'Hello world! KHAMADI ENGLISH Platform 2026.'

const candidates = [
  { name: 'Times New Roman', reg: 'times.ttf',   bold: 'timesbd.ttf'  },
  { name: 'Verdana',         reg: 'verdana.ttf',  bold: 'verdanab.ttf' },
  { name: 'Courier New',     reg: 'cour.ttf',     bold: 'courbd.ttf'   },
  { name: 'Calibri',         reg: 'calibri.ttf',  bold: 'calibrib.ttf' },
  { name: 'Tahoma',          reg: 'tahoma.ttf',   bold: 'tahomabd.ttf' },
  { name: 'Arial',           reg: 'arial.ttf',    bold: 'arialbd.ttf'  },
]

candidates.forEach(({ name, reg, bold }) => {
  const regPath  = path.join(WIN_FONTS, reg)
  const boldPath = path.join(WIN_FONTS, bold)
  if (!fs.existsSync(regPath)) { console.log(name + ': NOT FOUND'); return }

  const doc = new PDFDocument({ size: 'A4' })
  const outFile = path.join(OUT, '_test_' + name.replace(/ /g, '') + '.pdf')

  try {
    doc.registerFont('R', regPath)
    if (fs.existsSync(boldPath)) doc.registerFont('B', boldPath)

    const out = fs.createWriteStream(outFile)
    doc.pipe(out)
    doc.font('R').fontSize(18).text(name + ' — Cyrillic test:')
    doc.moveDown(0.5)
    doc.font('R').fontSize(14).text('RU: ' + TEST_RU)
    doc.moveDown(0.3)
    doc.font('R').fontSize(14).text('EN: ' + TEST_EN)
    if (fs.existsSync(boldPath)) {
      doc.moveDown(0.3)
      doc.font('B').fontSize(14).text('Bold RU: ' + TEST_RU)
    }
    doc.end()
    out.on('finish', () => {
      const kb = (fs.statSync(outFile).size / 1024).toFixed(0)
      console.log(name + ': OK — ' + kb + ' KB -> ' + outFile)
    })
    out.on('error', e => console.log(name + ': STREAM ERROR — ' + e.message))
  } catch (e) {
    console.log(name + ': REGISTER ERROR — ' + e.message)
  }
})
