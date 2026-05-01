const fontkit = require('fontkit')
const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

const FONT = path.join('public', 'fonts', 'DejaVuSans.ttf')
const font = fontkit.openSync(FONT)

// 1. Does layout() return valid glyph IDs for Cyrillic?
console.log('=== fontkit.layout() test ===')
const run = font.layout('Привет мир')
run.glyphs.forEach((g, i) => {
  const cp = run.glyphs[i].codePoints[0]
  const ch = cp ? String.fromCodePoint(cp) : '?'
  const hasOutlines = g.path && g.path.commands && g.path.commands.length > 0
  console.log(`  '${ch}' U+${cp?.toString(16).toUpperCase().padStart(4,'0')} → GID ${g.id} → outlines: ${hasOutlines ? g.path.commands.length + ' cmds' : 'EMPTY ❌'}`)
})

// 2. Generate a raw PDF and decompress ALL content streams
console.log('\n=== Generating test PDF ===')
const doc = new PDFDocument({ size: 'A4' })
doc.registerFont('R', FONT)
const out = fs.createWriteStream('public/textbooks/_diag.pdf')
doc.pipe(out)
doc.font('R').fontSize(20).text('Привет мир!')
doc.end()

out.on('finish', () => {
  const zlib = require('zlib')
  const buf = fs.readFileSync('public/textbooks/_diag.pdf')
  const str = buf.toString('binary')

  // Find all streams and decompress
  const re = /stream\r?\n([\s\S]*?)\r?\nendstream/g
  let m
  let allHex = []
  while ((m = re.exec(str)) !== null) {
    try {
      const dec = zlib.inflateSync(Buffer.from(m[1], 'binary')).toString('binary')
      // Collect all hex strings in text-drawing ops
      const hexes = dec.match(/<([0-9a-fA-F]+)>/g) || []
      hexes.forEach(h => allHex.push(h.slice(1,-1)))
    } catch(e) {}
  }

  // The unique glyph IDs used in content
  const uniqueGIDs = new Set()
  allHex.forEach(h => {
    for (let i = 0; i < h.length; i += 4) {
      const gid = parseInt(h.slice(i, i+4), 16)
      if (gid > 0) uniqueGIDs.add(gid)
    }
  })

  console.log('Unique GIDs in content stream:', [...uniqueGIDs].sort((a,b)=>a-b).join(', '))

  // Now extract the embedded font subset and check glyph count
  const fontStart = str.indexOf('/Subtype /CIDFontType2')
  if (fontStart > -1) console.log('\n✅ CIDFontType2 found in PDF')

  // Max GID in content — tells us if Cyrillic is in there
  const maxGID = Math.max(...uniqueGIDs)
  console.log('Max GID used:', maxGID, '— "Привет мир" has ~9 chars, so we expect ~9 unique GIDs')
  console.log('GID count:', uniqueGIDs.size, uniqueGIDs.size >= 7 ? '✅ looks right' : '❌ too few — some chars may be missing')
})
