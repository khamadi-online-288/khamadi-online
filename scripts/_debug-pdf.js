const fs = require('fs')
const zlib = require('zlib')

const buf = fs.readFileSync('public/textbooks/_cyrillic-test.pdf')
const text = buf.toString('binary')

// Extract all compressed streams and decompress them
const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g
let match
let streamIdx = 0
let foundCyrillic = false

while ((match = streamRegex.exec(text)) !== null) {
  const raw = Buffer.from(match[1], 'binary')
  try {
    const decompressed = zlib.inflateSync(raw).toString('binary')
    // Look for Tj or TJ operators (text drawing) with non-ASCII hex
    const textOps = decompressed.match(/<[0-9a-fA-F]+>\s*Tj|<[0-9a-fA-F]+>\s*TJ|\[<[0-9a-fA-F]+>/g)
    if (textOps && textOps.length > 0) {
      console.log('\n--- Stream ' + streamIdx + ' text operations (first 5):')
      textOps.slice(0, 5).forEach(op => {
        const hex = op.match(/<([0-9a-fA-F]+)>/)[1]
        // Decode as UTF-16BE pairs
        const chars = []
        for (let i = 0; i < hex.length; i += 4) {
          const cp = parseInt(hex.slice(i, i + 4), 16)
          if (cp > 0) chars.push('U+' + cp.toString(16).toUpperCase().padStart(4,'0') + '(' + (String.fromCodePoint(cp)) + ')')
        }
        console.log('  hex:', hex.slice(0, 32), '→', chars.slice(0, 6).join(' '))
        // Check if any codepoint is Cyrillic (0400-04FF)
        for (let i = 0; i < hex.length; i += 4) {
          const cp = parseInt(hex.slice(i, i + 4), 16)
          if (cp >= 0x0400 && cp <= 0x04FF) { foundCyrillic = true }
        }
      })
    }
  } catch (e) { /* not a deflate stream */ }
  streamIdx++
}

console.log('\n=== Result ===')
console.log(foundCyrillic
  ? '✅ Cyrillic codepoints (U+0400-U+04FF) ARE present in content streams — PDF is correct'
  : '❌ No Cyrillic codepoints found — PDFKit is NOT writing Cyrillic text'
)

// Also check CIDToGIDMap
const cidMap = text.match(/\/CIDToGIDMap\s*\/Identity/)
console.log('CIDToGIDMap Identity:', cidMap ? '✅ present' : '❌ missing')
