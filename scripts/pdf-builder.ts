/**
 * PDF Builder — pdf-lib based (replaces pdfkit which has a Cyrillic bug).
 * pdfkit/fontkit uses /CIDToGIDMap /Identity with Unicode CIDs but sequential
 * subset GIDs → Cyrillic always renders as garbage. pdf-lib does not have this bug.
 */

import { PDFDocument, PDFPage, PDFFont, PDFName, PDFDict, rgb, RGB } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import * as fontkit2 from 'fontkit'
import * as fs from 'fs'
import * as path from 'path'
import * as zlib from 'zlib'

// ── Colors ────────────────────────────────────────────────────────────────────

const c = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return rgb(r, g, b)
}

export const C = {
  navy:    c('#1B3A6B'),
  sky:     c('#1B8FC4'),
  gold:    c('#C9933B'),
  white:   c('#FFFFFF'),
  black:   c('#0F172A'),
  gray:    c('#64748B'),
  lightBg: c('#F8FAFC'),
  border:  c('#E2E8F0'),
  accent:  c('#EFF6FF'),
}

// ── Font paths ────────────────────────────────────────────────────────────────

const FONTS_DIR = path.join(__dirname, '..', 'public', 'fonts')
const FONT_R = path.join(FONTS_DIR, 'DejaVuSans.ttf')
const FONT_B = path.join(FONTS_DIR, 'DejaVuSans-Bold.ttf')
const FONT_I = path.join(FONTS_DIR, 'DejaVuSans-Oblique.ttf')

// ── Page constants ────────────────────────────────────────────────────────────

const PW = 595   // A4 width
const PH = 842   // A4 height
const ML = 72    // margin left
const MR = 72    // margin right
const MT = 82    // margin top (below header)
const MB = 55    // margin bottom (above footer)
const CW = PW - ML - MR

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface VocabEntry {
  en: string; pos?: string; def: string; ru: string; example?: string
}
export interface Exercise {
  instruction: string; items: string[]; ruHint?: string
}

// ── PdfWriter ─────────────────────────────────────────────────────────────────

export class PdfWriter {
  doc!: PDFDocument
  private _page!: PDFPage
  y = MT
  pageNum = 0
  R!: PDFFont
  B!: PDFFont
  I!: PDFFont
  headerTitle = ''
  headerLevel = ''

  get page() { return this._page }
  get pageH() { return PH }
  get pageW() { return PW }
  get marginLeft() { return ML }
  get contentW() { return CW }

  static async create(headerTitle = '', headerLevel = ''): Promise<PdfWriter> {
    const w = new PdfWriter()
    w.doc = await PDFDocument.create()
    w.doc.registerFontkit(fontkit as any)
    // subset: false — embeds full font, required for correct Cyrillic in Chrome/Edge PDFium
    const opts = { subset: false }
    w.R = await w.doc.embedFont(fs.readFileSync(FONT_R) as unknown as ArrayBuffer, opts)
    w.B = await w.doc.embedFont(fs.readFileSync(FONT_B) as unknown as ArrayBuffer, opts)
    w.I = await w.doc.embedFont(fs.readFileSync(FONT_I) as unknown as ArrayBuffer, opts)
    w.headerTitle = headerTitle
    w.headerLevel = headerLevel
    return w
  }

  // ── Page ──────────────────────────────────────────────────────────────────

  newPage(showHeader = true): void {
    this._page = this.doc.addPage([PW, PH])
    this.pageNum++
    this.y = showHeader && this.pageNum > 2 ? MT : 60
    if (showHeader && this.pageNum > 2) {
      this._header()
      this._footer()
    }
  }

  checkY(needed: number): void {
    if (this.y + needed > PH - MB) this.newPage()
  }

  moveDown(n = 1): void { this.y += Math.round(n * 14) }

  // ── Primitives ────────────────────────────────────────────────────────────

  /** Draw text. yTop = distance from page top to text top */
  _t(text: string, x: number, yTop: number, size: number, font: PDFFont, color = C.black): void {
    if (!text) return
    this._page.drawText(text, { x, y: PH - yTop - size * 0.8, size, font, color })
  }

  /** Draw filled rect. yTop = distance from page top to rect top */
  _r(x: number, yTop: number, w: number, h: number, color: RGB, border?: RGB, bw = 0.4): void {
    const opts: Parameters<PDFPage['drawRectangle']>[0] = {
      x, y: PH - yTop - h, width: w, height: h,
      color,
      ...(border ? { borderColor: border, borderWidth: bw } : { borderWidth: 0 }),
    }
    this._page.drawRectangle(opts)
  }

  _line(x1: number, y1: number, x2: number, y2: number, color = C.navy, w = 1): void {
    this._page.drawLine({ start: { x: x1, y: PH - y1 }, end: { x: x2, y: PH - y2 }, thickness: w, color })
  }

  // ── Word wrap ─────────────────────────────────────────────────────────────

  wrap(text: string, font: PDFFont, size: number, maxW = CW): string[] {
    const lines: string[] = []
    const paragraphs = text.split('\n')
    for (const para of paragraphs) {
      if (!para.trim()) { lines.push(''); continue }
      const words = para.split(' ')
      let cur = ''
      for (const word of words) {
        const test = cur ? cur + ' ' + word : word
        if (font.widthOfTextAtSize(test, size) > maxW && cur) {
          lines.push(cur); cur = word
        } else cur = test
      }
      if (cur || !para) lines.push(cur)
    }
    return lines.length ? lines : ['']
  }

  textH(text: string, font: PDFFont, size: number, maxW: number, lh: number): number {
    return this.wrap(text, font, size, maxW).length * lh
  }

  // ── Header / Footer ───────────────────────────────────────────────────────

  private _header(): void {
    this._r(0, 0, PW, 52, C.navy)
    this._t('KHAMADI ENGLISH', ML, 14, 9, this.B, C.white)
    if (this.headerLevel) {
      const lw = this.B.widthOfTextAtSize(this.headerLevel, 9)
      this._t(this.headerLevel, (PW - lw) / 2, 14, 9, this.R, C.gold)
    }
    if (this.headerTitle) {
      const tw = this.R.widthOfTextAtSize(this.headerTitle, 9)
      this._t(this.headerTitle, PW - MR - tw, 14, 9, this.R, C.white)
    }
  }

  private _footer(): void {
    this._r(0, PH - 36, PW, 36, C.accent)
    this._t('© 2026 KHAMADI ENGLISH • khamadi.online', ML, PH - 22, 8, this.R, C.navy)
    const ps = String(this.pageNum)
    const pw = this.R.widthOfTextAtSize(ps, 8)
    this._t(ps, PW - MR - pw, PH - 22, 8, this.R, C.gray)
  }

  // ── Cover ─────────────────────────────────────────────────────────────────

  drawCover(title: string, subtitle: string, level: string, description: string): void {
    const band = Math.round(PH * 0.45)
    this._r(0, 0, PW, band, C.navy)
    this._r(0, band, PW, 8, C.gold)
    this._r(0, band + 8, PW, PH - band - 8, C.lightBg)

    this._t('KHAMADI', ML, 68, 26, this.B, C.sky)
    this._t('ENGLISH', ML, 98, 26, this.B, C.gold)
    this._t('khamadi.online', ML, 130, 11, this.R, C.white)

    // Level badge
    this._r(ML, 168, 130, 30, C.gold)
    const lw = this.B.widthOfTextAtSize(level, 12)
    this._t(level, ML + (130 - lw) / 2, 175, 12, this.B, C.navy)

    // Title
    let ty = 218
    for (const l of this.wrap(title, this.B, 28, PW - ML - MR)) {
      this._t(l, ML, ty, 28, this.B, C.white); ty += 38
    }
    ty += 6
    for (const l of this.wrap(subtitle, this.I, 14, PW - ML - MR)) {
      if (ty < band - 14) { this._t(l, ML, ty, 14, this.I, C.sky); ty += 20 }
    }
    ty += 10
    this._line(ML, ty, PW - MR, ty, C.sky)
    ty += 14
    for (const l of this.wrap(description, this.R, 11, PW - ML - MR)) {
      if (ty < band - 11) { this._t(l, ML, ty, 11, this.R, C.white); ty += 16 }
    }

    const bY = band + 18
    this._t('Двуязычный учебник / Bilingual Textbook', ML, bY, 12, this.B, C.navy)
    this._t('Английский текст · Объяснения на русском', ML, bY + 18, 11, this.R, C.gray)
    this._t('Издание 2026', ML, bY + 34, 10, this.R, C.gray)
    const kt = 'KHAMADI ENGLISH Platform'
    this._t(kt, PW - MR - this.R.widthOfTextAtSize(kt, 10), bY + 34, 10, this.R, C.sky)
  }

  // ── Section heading ───────────────────────────────────────────────────────

  sectionHeading(text: string, level: 1 | 2 | 3 = 1): void {
    const sizes = [18, 14, 11] as const
    const size = sizes[level - 1]
    const lh = Math.round(size * 1.5)
    this.checkY(lh + 14)

    if (level === 1) {
      this._r(ML, this.y, CW, 2, C.navy)
      this.y += 8
    }
    const color = level === 1 ? C.navy : level === 2 ? C.sky : C.gold
    const font = this.B
    for (const l of this.wrap(text, font, size, CW)) {
      this.checkY(lh)
      this._t(l, ML, this.y, size, font, color)
      this.y += lh
    }
    this.y += level === 1 ? 6 : 4
  }

  // ── Body text ─────────────────────────────────────────────────────────────

  bodyText(text: string, indent = false, size = 11): void {
    const lh = Math.round(size * 1.5)
    const x = ML + (indent ? 20 : 0)
    const w = CW - (indent ? 20 : 0)
    for (const l of this.wrap(text, this.R, size, w)) {
      this.checkY(lh)
      this._t(l, x, this.y, size, this.R, C.black)
      this.y += lh
    }
    this.y += 3
  }

  // ── RU note box ───────────────────────────────────────────────────────────

  ruNote(text: string): void {
    const pad = 10
    const size = 11
    const lh = Math.round(size * 1.5)
    const lines = this.wrap(text, this.R, size, CW - pad * 2 - 32)
    const boxH = pad * 2 + 12 + lines.length * lh
    this.checkY(boxH + 6)
    const sy = this.y
    this._r(ML, sy, CW, boxH, C.accent, C.border)
    this._t('RU:', ML + pad, sy + pad, 9, this.B, C.sky)
    let ty = sy + pad + 14
    for (const l of lines) {
      this._t(l, ML + pad + 28, ty, size, this.R, C.navy)
      ty += lh
    }
    this.y = sy + boxH + 6
  }

  // ── Info box ──────────────────────────────────────────────────────────────

  infoBox(label: string, text: string): void {
    const size = 11
    const lh = Math.round(size * 1.5)
    const lines = this.wrap(text, this.R, size, CW - 16)
    const boxH = 14 + lh + lines.length * lh
    this.checkY(boxH + 4)
    this._r(ML, this.y, 4, boxH, C.sky)
    this._t(label, ML + 12, this.y, 10, this.B, C.sky)
    this.y += 14
    for (const l of lines) {
      this.checkY(lh)
      this._t(l, ML + 12, this.y, size, this.R, C.black)
      this.y += lh
    }
    this.y += 6
  }

  // ── Vocab table ───────────────────────────────────────────────────────────

  vocabTable(entries: VocabEntry[]): void {
    const cols = [CW * 0.22, CW * 0.36, CW * 0.21, CW * 0.21]
    const rowH = 24
    const size = 9

    // Header
    this.checkY(rowH + 4)
    this._r(ML, this.y, CW, rowH, C.navy)
    let cx = ML
    for (const [i, h] of ['Word / Term', 'Definition (EN)', 'Translation (RU)', 'Example'].entries()) {
      this._t(h, cx + 3, this.y + 7, size, this.B, C.white)
      cx += cols[i]
    }
    this.y += rowH

    for (const [idx, e] of entries.entries()) {
      this.checkY(rowH)
      if (idx % 2 === 1) this._r(ML, this.y, CW, rowH, C.accent)
      this._r(ML, this.y, CW, rowH, C.accent, C.border, 0.3)

      cx = ML
      const cells = [e.en + (e.pos ? ` (${e.pos})` : ''), e.def, e.ru, e.example ?? '']
      const fonts = [this.B, this.R, this.I, this.I]
      const colors = [C.navy, C.black, C.navy, C.gray]
      for (let i = 0; i < 4; i++) {
        let t = cells[i]
        const maxW = cols[i] - 6
        while (t.length > 4 && fonts[i].widthOfTextAtSize(t, size) > maxW) t = t.slice(0, -4) + '...'
        this._t(t, cx + 3, this.y + 8, size, fonts[i], colors[i])
        cx += cols[i]
      }
      this.y += rowH
    }
    this.y += 6
  }

  // ── Exercise block ────────────────────────────────────────────────────────

  exerciseBlock(ex: Exercise, num: number): void {
    this.checkY(48)
    this._r(ML, this.y, CW, 22, C.navy)
    this._t(`Exercise ${num}: ${ex.instruction.slice(0, 55)}${ex.instruction.length > 55 ? '...' : ''}`, ML + 8, this.y + 6, 10, this.B, C.gold)
    this.y += 26
    for (const l of this.wrap(ex.instruction, this.I, 11, CW)) {
      this.checkY(17); this._t(l, ML, this.y, 11, this.I, C.black); this.y += 17
    }
    if (ex.ruHint) {
      for (const l of this.wrap(`(${ex.ruHint})`, this.I, 9, CW)) {
        this.checkY(14); this._t(l, ML, this.y, 9, this.I, C.gray); this.y += 14
      }
    }
    this.y += 3
    for (const [i, item] of ex.items.entries()) {
      for (const l of this.wrap(`${i + 1}.  ${item}`, this.R, 11, CW - 20)) {
        this.checkY(16); this._t(l, ML + 20, this.y, 11, this.R, C.black); this.y += 16
      }
    }
    this.y += 8
  }

  // ── TOC entry ─────────────────────────────────────────────────────────────

  tocEntry(title: string, pageN: number, indent = 0): void {
    const x = ML + indent * 18
    const w = CW - indent * 18
    const size = indent ? 10 : 11
    const font = indent ? this.R : this.B
    const color = indent ? C.gray : C.navy
    this.checkY(16)
    this._t(title, x, this.y, size, font, color)
    const ps = String(pageN)
    this._t(ps, ML + w - this.R.widthOfTextAtSize(ps, 10), this.y, 10, this.R, C.sky)
    this.y += 16
  }

  // ── Glossary entry ────────────────────────────────────────────────────────

  glossaryEntry(en: string, ru: string, def: string): void {
    const size = 11; const lh = 17
    const lines = this.wrap(`${en} — ${ru}. ${def}`, this.R, size, CW)
    for (const [i, l] of lines.entries()) {
      this.checkY(lh)
      this._t(l, ML, this.y, size, i === 0 ? this.B : this.R, C.black)
      this.y += lh
    }
    this.y += 2
  }

  // ── Unit/module header banner ─────────────────────────────────────────────

  unitBanner(label: string, title: string, ruTitle: string): void {
    const banH = 76
    this.checkY(banH + 10)
    this._r(ML, this.y, CW, banH, C.navy)
    this._t(label, ML + 14, this.y + 10, 12, this.B, C.gold)
    const titleLines = this.wrap(title, this.B, 18, CW - 28)
    let ty = this.y + 26
    for (const l of titleLines) { this._t(l, ML + 14, ty, 18, this.B, C.white); ty += 24 }
    if (ruTitle) this._t(ruTitle, ML + 14, ty, 12, this.I, C.sky)
    this.y += banH + 10
  }

  // ── Divider ───────────────────────────────────────────────────────────────

  divider(): void {
    this.checkY(10)
    this._line(ML, this.y + 4, ML + CW, this.y + 4, C.border, 0.5)
    this.y += 10
  }

  // ── Save ──────────────────────────────────────────────────────────────────

  async save(outPath: string): Promise<void> {
    const dir = path.dirname(outPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    // First pass: save to get serialized PDF with CIDFont structures
    const rawBytes = await this.doc.save()

    // Second pass: fix CIDToGIDMap for Chrome PDFium compatibility
    const fixedBytes = await fixCidToGidMap(rawBytes, FONT_R)

    fs.writeFileSync(outPath, Buffer.from(fixedBytes))
    console.log(`✅ ${path.basename(outPath)} — ${Math.round(fixedBytes.length / 1024)} KB, ${this.pageNum} pages`)
  }
}

// ── CIDToGIDMap fixer ─────────────────────────────────────────────────────────
// pdf-lib writes /CIDToGIDMap /Identity (CID = Unicode codepoint ≠ font GID).
// Chrome PDFium follows spec strictly: renders GID = CID → wrong glyph.
// Fix: replace /Identity with a real stream mapping Unicode codepoint → GID.

function buildGidMap(fontPath: string): Buffer {
  const font = (fontkit2 as any).openSync(fontPath)
  const buf = Buffer.alloc(65536 * 2, 0)
  for (let cp = 0x0020; cp <= 0x052F; cp++) {
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

async function fixCidToGidMap(pdfBytes: Uint8Array, fontPath: string): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes)
  const ctx = doc.context

  const mapBuf    = buildGidMap(fontPath)
  const compressed = zlib.deflateSync(mapBuf)

  const mapStream = ctx.stream(compressed, {
    Filter: ctx.obj('FlateDecode') as any,
    Length: ctx.obj(compressed.length) as any,
  })
  const mapRef = ctx.register(mapStream)

  ctx.enumerateIndirectObjects().forEach(([_, obj]) => {
    if (obj instanceof PDFDict) {
      const sub = obj.get(PDFName.of('Subtype'))
      if (sub?.toString() === '/CIDFontType2') {
        obj.set(PDFName.of('CIDToGIDMap'), mapRef)
      }
    }
  })

  return doc.save()
}
