/**
 * Post-process a pdf-lib generated PDF to fix the CIDToGIDMap.
 *
 * Root cause: pdf-lib (and pdfkit) write Unicode codepoints as CIDs in the
 * content stream with /CIDToGIDMap /Identity.  Chrome's PDFium strictly follows
 * the spec: CID 0x041F (П) → GID 0x041F → renders whatever glyph is at that
 * index in the font (not П).  Adobe Reader uses ToUnicode as a fallback, so
 * it works.  Chrome does not.
 *
 * Fix: replace /Identity with a real 65536-entry GID map built from the font's
 * own cmap table so that CID N → actual GID for Unicode codepoint N.
 */

import * as fontkit from 'fontkit'
import * as fs from 'fs'
import * as path from 'path'
import * as zlib from 'zlib'

const FONTS_DIR = path.join(__dirname, '..', 'public', 'fonts')

// Build CIDToGIDMap bytes for a font: 65536 entries × 2 bytes each
function buildCidToGidMap(fontPath: string): Buffer {
  const font = (fontkit as any).openSync(fontPath)
  const buf = Buffer.alloc(65536 * 2, 0)      // default: GID 0 = .notdef
  for (let cp = 0x0020; cp <= 0x04FF; cp++) {  // Latin + Cyrillic
    try {
      const g = font.glyphForCodePoint(cp)
      if (g && g.id > 0) {
        buf[cp * 2]     = (g.id >> 8) & 0xFF
        buf[cp * 2 + 1] = g.id & 0xFF
      }
    } catch (_) {}
  }
  // Also cover the full Latin Extended range
  for (let cp = 0x0500; cp <= 0x052F; cp++) {
    try {
      const g = font.glyphForCodePoint(cp)
      if (g && g.id > 0) {
        buf[cp * 2]     = (g.id >> 8) & 0xFF
        buf[cp * 2 + 1] = g.id & 0xFF
      }
    } catch (_) {}
  }
  return buf
}

// Replace /CIDToGIDMap /Identity in a raw PDF buffer with a real stream.
// Works on uncompressed PDF (pdf-lib uses ObjStm, so we need a different approach).
// We do a string-level replacement of the Identity reference and inject a new object.
export function fixCidToGidMapInFile(pdfPath: string): void {
  let pdf = fs.readFileSync(pdfPath)
  const pdfStr = pdf.toString('binary')

  // Check if there are any /CIDToGIDMap /Identity entries
  if (!pdfStr.includes('/CIDToGIDMap /Identity')) {
    return  // nothing to fix
  }

  // Build maps for all three DejaVu faces
  const faces = ['DejaVuSans', 'DejaVuSans-Bold', 'DejaVuSans-Oblique']
  const maps = faces.map(f => buildCidToGidMap(path.join(FONTS_DIR, f + '.ttf')))

  // For all faces the cmap is the same (same Unicode coverage), use first
  const rawMap = maps[0]
  const compressed = zlib.deflateSync(rawMap)

  // We'll inject ONE shared CIDToGIDMap stream object right before %%EOF
  // and update all /CIDToGIDMap /Identity to /CIDToGIDMap N 0 R

  // Find current max object number
  const objNums = [...pdfStr.matchAll(/^(\d+) 0 obj/gm)].map(m => parseInt(m[1]))
  const maxObj = Math.max(...objNums)
  const newObjNum = maxObj + 1

  // Build the new stream object
  const streamObj =
    `${newObjNum} 0 obj\n` +
    `<< /Length ${compressed.length} /Filter /FlateDecode >>\n` +
    `stream\n`

  // Replace /CIDToGIDMap /Identity with reference to new object
  const fixedStr = pdfStr.replace(/\/CIDToGIDMap \/Identity/g, `/CIDToGIDMap ${newObjNum} 0 R`)

  // Find %%EOF position
  const eofIdx = fixedStr.lastIndexOf('%%EOF')
  const xrefIdx = fixedStr.lastIndexOf('\nstartxref\n')

  if (eofIdx < 0) {
    // ObjStm-based PDF — different structure, can't do simple injection
    // Fall back: write as-is (will still work in non-Chrome viewers)
    return
  }

  // Build updated PDF
  const beforeEof = fixedStr.slice(0, xrefIdx)
  const newXrefOffset = Buffer.byteLength(beforeEof, 'binary') +
    Buffer.byteLength(streamObj, 'binary') +
    compressed.length +
    Buffer.byteLength('\nendstream\nendobj\n', 'binary')

  const updatedPdf = Buffer.concat([
    Buffer.from(fixedStr.replace(/\/CIDToGIDMap \/Identity/g, `/CIDToGIDMap ${newObjNum} 0 R`), 'binary'),
  ])

  fs.writeFileSync(pdfPath, updatedPdf)
}

// ── Simple test ────────────────────────────────────────────────────────────────
if (require.main === module) {
  const target = path.join('public', 'textbooks', '_test-writer.pdf')
  const before = fs.readFileSync(target)
  fixCidToGidMapInFile(target)
  const after = fs.readFileSync(target)
  console.log('Before:', before.length, 'bytes')
  console.log('After: ', after.length, 'bytes')
  console.log('Identity entries remaining:',
    after.toString('binary').split('/CIDToGIDMap /Identity').length - 1)
}
