// Check which Windows fonts actually have Cyrillic glyphs
// Uses fontkit (bundled with pdfkit) to inspect cmap tables

const fontkit = require('fontkit')
const path = require('path')

const WIN = 'C:/Windows/Fonts'
const CYRILLIC_SAMPLES = [
  0x0410, // А
  0x0430, // а
  0x041F, // П
  0x0440, // р
  0x0438, // и
  0x0432, // в
  0x0435, // е
  0x0442, // т
]

const candidates = [
  ['arial.ttf',    'Arial'],
  ['arialbd.ttf',  'Arial Bold'],
  ['times.ttf',    'Times New Roman'],
  ['timesbd.ttf',  'Times New Roman Bold'],
  ['verdana.ttf',  'Verdana'],
  ['calibri.ttf',  'Calibri'],
  ['tahoma.ttf',   'Tahoma'],
  ['cour.ttf',     'Courier New'],
]

candidates.forEach(([file, name]) => {
  const fullPath = path.join(WIN, file)
  try {
    const font = fontkit.openSync(fullPath)
    let supported = 0
    CYRILLIC_SAMPLES.forEach(cp => {
      const glyph = font.glyphForCodePoint(cp)
      if (glyph && glyph.id !== 0) supported++
    })
    const pct = Math.round(supported / CYRILLIC_SAMPLES.length * 100)
    const status = supported === CYRILLIC_SAMPLES.length ? '✅ FULL' : supported > 0 ? '⚠️ PARTIAL' : '❌ NONE'
    console.log(status + ' ' + name + ' (' + supported + '/' + CYRILLIC_SAMPLES.length + ' glyphs) — ' + file)
  } catch (e) {
    console.log('❌ ERROR ' + name + ': ' + e.message)
  }
})
