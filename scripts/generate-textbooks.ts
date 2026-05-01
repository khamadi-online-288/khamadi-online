/**
 * Generate bilingual PDF textbooks for KHAMADI ENGLISH.
 * Uses pdf-lib (not pdfkit) — correct Cyrillic rendering.
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/generate-textbooks.ts
 */

import * as path from 'path'
import * as fs from 'fs'
import { PdfWriter, C, VocabEntry } from './pdf-builder'
import { ALL_GENERAL_ENGLISH_LEVELS, LevelContent, Unit } from './content-general-english'
import { ALL_ESP_TEXTBOOKS, EspTextbook, EspModule } from './content-esp'

const OUT_DIR = path.join(__dirname, '..', 'public', 'textbooks')

// ── General English textbook ───────────────────────────────────────────────────

async function generateGeneralEnglish(content: LevelContent): Promise<void> {
  const w = await PdfWriter.create(content.title, content.level)

  // ── Cover ──────────────────────────────────────────────────────────────────
  w.newPage(false)
  w.drawCover(content.title, content.subtitle, content.level, content.descriptionRu)

  // ── Preface ────────────────────────────────────────────────────────────────
  w.newPage(false)
  w.y = 60
  w.sectionHeading('Предисловие / Preface', 1)
  w.bodyText(content.prefaceRu)

  // ── Table of Contents ──────────────────────────────────────────────────────
  w.newPage(false)
  w.y = 60
  w.sectionHeading('Table of Contents / Оглавление', 1)
  w.moveDown(0.5)
  w.tocEntry('Preface / Предисловие', 2)
  w.tocEntry('Table of Contents', 3)
  let tp = 4
  for (const unit of content.units) {
    w.tocEntry(`Unit ${unit.number}: ${unit.title}`, tp)
    w.tocEntry('Grammar / Грамматика', tp + 1, 1)
    w.tocEntry('Vocabulary / Словарь', tp + 2, 1)
    w.tocEntry('Reading / Чтение', tp + 4, 1)
    w.tocEntry('Exercises / Упражнения', tp + 5, 1)
    tp += 8
  }
  w.tocEntry('Grammar Reference', tp)
  w.tocEntry('Glossary / Глоссарий', tp + 3)
  w.tocEntry('Answer Key / Ответы', tp + 6)
  w.tocEntry('Resources', tp + 8)

  // ── Units ──────────────────────────────────────────────────────────────────
  for (const unit of content.units) {
    await generateUnit(w, unit)
  }

  // ── Grammar Reference ──────────────────────────────────────────────────────
  w.newPage()
  w.sectionHeading('Grammar Reference / Грамматический справочник', 1)
  w.bodyText('Summary of all grammar points covered in this course.')
  w.moveDown(0.5)
  for (const unit of content.units) {
    for (const gp of unit.grammar) {
      w.checkY(80)
      w.sectionHeading(gp.title, 2)
      w.bodyText(gp.explanation)
      w.moveDown(0.3)
      w.ruNote(gp.ruExplanation)
      w.moveDown(0.3)
      for (const f of gp.form) {
        w.checkY(16)
        w._t('▸  ' + f, w.marginLeft + 10, w.y, 10, w.B, C.navy)
        w.y += 15
      }
      w.moveDown(0.5)
    }
  }

  // Irregular verbs table
  w.newPage()
  w.sectionHeading('Irregular Verbs / Неправильные глаголы', 2)
  const irregVerbCols = [90, 90, 90, 110]
  const irH = 20
  w.checkY(irH + 4)
  w._r(w.marginLeft, w.y, w.contentW, irH, C.navy)
  let icx = w.marginLeft
  for (const [i, h] of ['Infinitive', 'Past Simple', 'Past Participle', 'RU'].entries()) {
    w._t(h, icx + 3, w.y + 6, 9, w.B, C.white); icx += irregVerbCols[i]
  }
  w.y += irH
  for (const [vi, v] of getIrregularVerbs().entries()) {
    w.checkY(irH)
    if (vi % 2 === 1) w._r(w.marginLeft, w.y, w.contentW, irH, C.accent)
    icx = w.marginLeft
    const fonts = [w.B, w.R, w.R, w.I]
    const colors = [C.navy, C.black, C.black, C.gray]
    for (let i = 0; i < 4; i++) {
      w._t(v[i], icx + 3, w.y + 6, 9, fonts[i], colors[i]); icx += irregVerbCols[i]
    }
    w.y += irH
  }
  w.moveDown(0.5)

  // ── Glossary ───────────────────────────────────────────────────────────────
  w.newPage()
  w.sectionHeading('Complete Glossary / Полный глоссарий', 1)
  w.bodyText('All vocabulary from this course, alphabetically.')
  w.moveDown(0.5)
  const allVocab = [
    ...content.units.flatMap(u => u.vocabulary),
    ...(content.glossaryExtras ?? []),
  ].sort((a, b) => a.en.localeCompare(b.en))
  for (const v of allVocab) {
    w.checkY(20)
    w.glossaryEntry(v.en, v.ru, v.def)
  }

  // ── Answer Key ─────────────────────────────────────────────────────────────
  w.newPage()
  w.sectionHeading('Answer Key / Ответы к упражнениям', 1)
  for (const unit of content.units) {
    w.checkY(30)
    w._t(`Unit ${unit.number}: ${unit.title}`, w.marginLeft, w.y, 12, w.B, C.navy)
    w.y += 18
    for (const [ei, ex] of unit.exercises.entries()) {
      w._t(`Exercise ${ei + 1}: ${ex.instruction.slice(0, 50)}...`, w.marginLeft, w.y, 10, w.I, C.sky)
      w.y += 15
      const ans = getAnswers(ex)
      for (const a of ans) {
        w.checkY(14); w._t(a, w.marginLeft + 20, w.y, 10, w.R, C.black); w.y += 14
      }
      w.moveDown(0.3)
    }
    w.moveDown(0.5)
  }

  // ── Resources ──────────────────────────────────────────────────────────────
  w.newPage()
  w.sectionHeading('Recommended Resources', 1)
  w.bodyText('Continue your English learning with these resources:')
  w.moveDown(0.5)
  for (const [i, r] of content.resources.entries()) {
    for (const l of w.wrap(`${i + 1}.  ${r}`, w.R, 11, w.contentW)) {
      w.checkY(16); w._t(l, w.marginLeft, w.y, 11, w.R, C.black); w.y += 16
    }
    w.moveDown(0.2)
  }

  // ── Study tips ─────────────────────────────────────────────────────────────
  w.newPage()
  w.sectionHeading(`Study Tips for ${content.level}`, 1)
  const tips = [
    ['30 минут каждый день > 5 часов раз в неделю', 'Daily 30-min sessions beat a single 5-hour session. Your brain needs regular exposure to build new language pathways.'],
    ['Активное использование', 'Don\'t just consume English — produce it. Speak aloud, write sentences, explain grammar rules. Active use accelerates acquisition.'],
    ['Ошибки — часть обучения', 'Every mistake is data. When corrected, you remember the right form better. Never be afraid to make errors.'],
    ['Spaced repetition', 'Review new words after 1 day, 3 days, 7 days, 14 days. Use KHAMADI ENGLISH flashcards for this automatically.'],
    ['Читайте на уровень выше', 'Choose texts slightly above your level — challenging enough to learn from, but not so hard you understand nothing.'],
  ]
  for (const [ru, en] of tips) {
    w.checkY(60)
    w.sectionHeading(ru, 3)
    w.bodyText(en)
    w.moveDown(0.4)
  }

  await w.save(path.join(OUT_DIR, `${content.id}.pdf`))
}

async function generateUnit(w: PdfWriter, unit: Unit): Promise<void> {
  // Unit banner
  w.newPage()
  w.unitBanner(`UNIT ${unit.number}`, unit.title, unit.ruTitle)

  // Objectives
  w.sectionHeading('Learning Objectives / Цели обучения', 2)
  for (const obj of unit.objectives) {
    w.checkY(16); w._t('✓  ' + obj, w.marginLeft + 10, w.y, 11, w.R, C.black); w.y += 16
  }
  w.moveDown(0.8)

  // Grammar
  w.newPage()
  w.sectionHeading('Grammar / Грамматика', 1)
  for (const [gi, gp] of unit.grammar.entries()) {
    w.checkY(50)
    w.sectionHeading(`${gi + 1}. ${gp.title}`, 2)
    w.bodyText(gp.explanation)
    w.moveDown(0.3)
    w.ruNote(gp.ruExplanation)
    w.moveDown(0.3)

    w.sectionHeading('Form / Structure', 3)
    const fBoxH = gp.form.length * 16 + 12
    w.checkY(fBoxH)
    w._r(w.marginLeft, w.y, w.contentW, fBoxH, C.lightBg)
    let fy = w.y + 6
    for (const f of gp.form) {
      w._t(f, w.marginLeft + 10, fy, 10, w.B, C.navy); fy += 16
    }
    w.y += fBoxH + 4

    w.sectionHeading('Examples / Примеры', 3)
    for (const ex of gp.examples) {
      w.checkY(16); w._t('▸  ' + ex, w.marginLeft + 10, w.y, 11, w.R, C.sky); w.y += 16
    }
    w.moveDown(0.3)

    if (gp.commonErrors?.length) {
      w.sectionHeading('Common Errors / Типичные ошибки', 3)
      for (const err of gp.commonErrors) {
        w.checkY(16); w._t(err, w.marginLeft + 10, w.y, 11, w.R, C.gold); w.y += 16
      }
      w.moveDown(0.4)
    }
  }

  // Vocabulary
  w.newPage()
  w.sectionHeading('Vocabulary / Словарный запас', 1)
  w.bodyText(`This unit introduces ${unit.vocabulary.length} key words and phrases.`)
  w.moveDown(0.4)
  w.ruNote(`В этом модуле ${unit.vocabulary.length} ключевых слов. Учите их внимательно.`)
  w.moveDown(0.5)
  for (let i = 0; i < unit.vocabulary.length; i += 14) {
    if (i > 0) w.newPage()
    w.vocabTable(unit.vocabulary.slice(i, i + 14))
  }

  // Reading
  w.newPage()
  w.sectionHeading('Reading / Чтение', 1)
  w._t(unit.readingTitle, w.marginLeft, w.y, 14, w.B, C.navy); w.y += 22
  w.moveDown(0.3)
  w.bodyText(unit.readingText)
  w.moveDown(1)

  w.sectionHeading('Comprehension Questions', 2)
  for (const [qi, q] of getReadingQuestions().entries()) {
    w.checkY(16); w._t(`${qi + 1}.  ${q}`, w.marginLeft, w.y, 11, w.R, C.black); w.y += 16
  }

  // Exercises
  w.newPage()
  w.sectionHeading('Exercises / Упражнения', 1)
  for (const [ei, ex] of unit.exercises.entries()) {
    w.checkY(60)
    w.exerciseBlock(ex, ei + 1)
  }

  // Cultural note
  w.checkY(80)
  w.moveDown(0.8)
  w.sectionHeading('Cultural Note / Культурная заметка', 2)
  w.bodyText(unit.culturalNote)
  w.moveDown(0.3)
  w.ruNote(unit.ruCulturalNote)
  w.divider()
}

// ── ESP textbook ───────────────────────────────────────────────────────────────

async function generateESP(tb: EspTextbook): Promise<void> {
  const w = await PdfWriter.create(tb.title, tb.level)

  // Cover
  w.newPage(false)
  w.drawCover(tb.title, tb.subtitle, tb.level, tb.descriptionRu)

  // Preface
  w.newPage(false)
  w.y = 60
  w.sectionHeading('Предисловие', 1)
  w.bodyText(tb.prefaceRu)

  // TOC
  w.newPage(false)
  w.y = 60
  w.sectionHeading('Table of Contents / Оглавление', 1)
  let tp = 4
  for (const mod of tb.modules) {
    w.tocEntry(`Module ${mod.number}: ${mod.title}`, tp)
    w.tocEntry('Vocabulary', tp + 2, 1)
    w.tocEntry('Case Study', tp + 4, 1)
    w.tocEntry('Exercises', tp + 5, 1)
    tp += 8
  }
  w.tocEntry('Complete Glossary', tp)
  w.tocEntry('Answer Key', tp + 4)
  w.tocEntry('Resources', tp + 6)

  // Modules
  for (const mod of tb.modules) {
    await generateEspModule(w, mod, tb)
  }

  // Domain knowledge pages
  await generateDomainExtra(w, tb)

  // Glossary
  w.newPage()
  w.sectionHeading('Complete Professional Glossary / Профессиональный глоссарий', 1)
  const allTerms = [
    ...tb.modules.flatMap(m => m.vocabulary),
    ...(tb.appendixGlossary ?? []),
  ].sort((a, b) => a.en.localeCompare(b.en))
  w.bodyText(`${allTerms.length} terms, alphabetically.`)
  w.moveDown(0.5)
  for (const v of allTerms) {
    w.checkY(20); w.glossaryEntry(v.en, v.ru, v.def)
  }

  // Answer Key
  w.newPage()
  w.sectionHeading('Answer Key / Ответы', 1)
  for (const mod of tb.modules) {
    w.checkY(30)
    w._t(`Module ${mod.number}: ${mod.title}`, w.marginLeft, w.y, 12, w.B, C.navy); w.y += 18
    for (const [ei, ex] of mod.exercises.entries()) {
      w._t(`Exercise ${ei + 1}`, w.marginLeft, w.y, 10, w.I, C.sky); w.y += 14
      for (const a of getAnswers(ex)) {
        w.checkY(14); w._t(a, w.marginLeft + 20, w.y, 10, w.R, C.black); w.y += 14
      }
      w.moveDown(0.3)
    }
    w.moveDown(0.5)
  }

  // Resources
  w.newPage()
  w.sectionHeading('Professional Resources', 1)
  for (const [i, r] of tb.resources.entries()) {
    for (const l of w.wrap(`${i + 1}.  ${r}`, w.R, 11, w.contentW)) {
      w.checkY(16); w._t(l, w.marginLeft, w.y, 11, w.R, C.black); w.y += 16
    }
    w.moveDown(0.2)
  }

  await w.save(path.join(OUT_DIR, `${tb.id}.pdf`))
}

async function generateEspModule(w: PdfWriter, mod: EspModule, tb: EspTextbook): Promise<void> {
  w.newPage()
  w.unitBanner(`MODULE ${mod.number}  ·  ${tb.field.toUpperCase()}`, mod.title, mod.ruTitle)

  w.sectionHeading('Learning Objectives', 2)
  for (const o of mod.objectives) {
    w.checkY(16); w._t('✓  ' + o, w.marginLeft + 10, w.y, 11, w.R, C.black); w.y += 16
  }
  w.moveDown(0.8)

  w.sectionHeading('Introduction / Введение', 1)
  w.bodyText(mod.introduction)
  w.moveDown(0.3)
  w.ruNote(mod.ruIntroduction)

  w.newPage()
  w.sectionHeading('Theory / Теоретический материал', 1)
  w.bodyText(mod.theory)
  w.moveDown(0.5)
  w.ruNote(mod.ruTheory)

  w.newPage()
  w.sectionHeading('Professional Vocabulary / Профессиональная лексика', 1)
  w.bodyText(`This module covers ${mod.vocabulary.length} professional terms.`)
  w.moveDown(0.4)
  for (let i = 0; i < mod.vocabulary.length; i += 12) {
    if (i > 0) w.newPage()
    w.vocabTable(mod.vocabulary.slice(i, i + 12))
  }

  w.newPage()
  w.sectionHeading(`Case Study: ${mod.caseStudy.title}`, 1)
  w._r(w.marginLeft, w.y, w.contentW, 22, C.sky)
  w._t('CASE STUDY', w.marginLeft + 10, w.y + 6, 11, w.B, C.white)
  w.y += 26
  w.bodyText(mod.caseStudy.text)
  w.moveDown(0.5)
  w.sectionHeading('Discussion Questions', 2)
  for (const [qi, q] of mod.caseStudy.questions.entries()) {
    for (const l of w.wrap(`${qi + 1}.  ${q}`, w.R, 11, w.contentW)) {
      w.checkY(16); w._t(l, w.marginLeft, w.y, 11, w.R, C.black); w.y += 16
    }
  }

  w.newPage()
  w.sectionHeading('Exercises / Упражнения', 1)
  for (const [ei, ex] of mod.exercises.entries()) {
    w.checkY(60); w.exerciseBlock(ex, ei + 1)
  }

  w.checkY(80)
  w.moveDown(0.5)
  w._r(w.marginLeft, w.y, 4, 56, C.gold)
  w._t('Professional Note', w.marginLeft + 12, w.y, 10, w.B, C.gold)
  w.y += 14
  for (const l of w.wrap(mod.professionalNote, w.R, 11, w.contentW - 12)) {
    w.checkY(17); w._t(l, w.marginLeft + 12, w.y, 11, w.R, C.black); w.y += 17
  }
  w.moveDown(0.3)
  for (const l of w.wrap(mod.ruProfessionalNote, w.I, 10, w.contentW - 12)) {
    w.checkY(15); w._t(l, w.marginLeft + 12, w.y, 10, w.I, C.gray); w.y += 15
  }
  w.moveDown(1)
}

async function generateDomainExtra(w: PdfWriter, tb: EspTextbook): Promise<void> {
  w.newPage()
  w.sectionHeading(`Writing in ${tb.field}`, 1)
  w.bodyText('Professional writing in English follows specific conventions. Below are the most important genres and structures in your field.')
  w.moveDown(0.5)

  const writingTypes = [
    {
      title: 'Professional Emails',
      ruTitle: 'Деловые письма',
      desc: 'Emails in professional settings follow a clear structure: subject line, greeting, purpose, details, call to action, closing.',
      ruDesc: 'Деловое письмо на английском: тема, приветствие, цель, детали, призыв к действию, завершение.',
      example: 'Subject: Request for Meeting\n\nDear Mr Johnson,\n\nI am writing to request a meeting to discuss the Q3 results.\nWould you be available on Thursday at 2:00 PM?\n\nKind regards,\n[Your name]',
    },
    {
      title: 'Professional Reports',
      ruTitle: 'Отчёты',
      desc: 'Reports use clear headings, factual language, and logical organisation: executive summary, background, findings, analysis, recommendations.',
      ruDesc: 'Отчёты: резюме для руководства, исходная информация, результаты, анализ, рекомендации.',
      example: 'REPORT: Q3 Financial Performance\n\nExecutive Summary\nRevenue increased 8.3% year-on-year...\n\nKey Findings\n1. Revenue: +8.3% YoY\n2. Operating profit: +5.7% YoY',
    },
  ]

  for (const wt of writingTypes) {
    w.checkY(120)
    w.sectionHeading(`${wt.title} (${wt.ruTitle})`, 2)
    w.bodyText(wt.desc)
    w.ruNote(wt.ruDesc)
    w.moveDown(0.3)
    const exH = 10 + w.wrap(wt.example, w.R, 10, w.contentW - 20).length * 14
    w.checkY(exH + 20)
    w._r(w.marginLeft, w.y, w.contentW, 16, C.sky)
    w._t('EXAMPLE', w.marginLeft + 6, w.y + 4, 8, w.B, C.white)
    w.y += 16
    w._r(w.marginLeft, w.y, w.contentW, exH, C.lightBg)
    const exY = w.y + 6
    for (const [li, l] of w.wrap(wt.example, w.R, 10, w.contentW - 20).entries()) {
      w._t(l, w.marginLeft + 10, exY + li * 14, 10, w.R, C.black)
    }
    w.y += exH + 8
    w.moveDown(0.5)
  }

  // Pronunciation guide
  w.newPage()
  w.sectionHeading('Pronunciation Guide / Произношение', 1)
  w.bodyText(`Correct pronunciation of ${tb.field} terms is essential for professional credibility.`)
  w.moveDown(0.3)
  w.ruNote('Правильное произношение терминов важно для профессионального имиджа. Ниже — типичные трудности.')
  w.moveDown(0.5)
  const pronTips = [
    'Multi-syllable stress: ac-COUNT-ing, fi-NANCE / FI-nance, man-AGE-ment',
    'Silent letters: debt /det/, receipt /rɪsiːt/, subtle /sʌtl/',
    'British vs American: schedule /ʃedjuːl/ (UK) vs /skedjuːl/ (US)',
    'Abbreviations: IFRS, GDP — pronounce each letter individually',
    'Numbers: 8.5% = "eight point five percent" (not "comma")',
  ]
  for (const [i, tip] of pronTips.entries()) {
    w.checkY(16)
    w._t(`${i + 1}.  `, w.marginLeft, w.y, 11, w.B, C.navy)
    for (const l of w.wrap(tip, w.R, 11, w.contentW - 20)) {
      w.checkY(16); w._t(l, w.marginLeft + 20, w.y, 11, w.R, C.black); w.y += 16
    }
    w.moveDown(0.2)
  }
}

// ── Helper functions ───────────────────────────────────────────────────────────

function getReadingQuestions(): string[] {
  return [
    'What is the main topic of the reading passage?',
    'According to the text, where is the main character from?',
    'Find and write three examples of the grammar from this unit.',
    'List at least five vocabulary words from this unit that appear in the text.',
    'Write a short paragraph (3-5 sentences) about your own experience with this topic.',
  ]
}

function getAnswers(ex: { instruction: string; items: string[] }): string[] {
  if (ex.instruction.toLowerCase().includes('am, is, are')) {
    const k = ['am', 'is', 'are', 'are', 'is', 'are', 'is', 'are']
    return ex.items.map((_, i) => `${i + 1}. ${k[i] ?? 'is'}`)
  }
  if (ex.instruction.toLowerCase().includes('since or for')) {
    return ex.items.map((_, i) => `${i + 1}. ${['since', 'for', 'since', 'since'][i] ?? 'for'}`)
  }
  return ex.items.map((_, i) => `${i + 1}. (see answer sheet)`)
}

function getIrregularVerbs(): string[][] {
  return [
    ['be', 'was/were', 'been', 'быть'],
    ['begin', 'began', 'begun', 'начинать'],
    ['break', 'broke', 'broken', 'ломать'],
    ['bring', 'brought', 'brought', 'приносить'],
    ['build', 'built', 'built', 'строить'],
    ['buy', 'bought', 'bought', 'покупать'],
    ['choose', 'chose', 'chosen', 'выбирать'],
    ['come', 'came', 'come', 'приходить'],
    ['do', 'did', 'done', 'делать'],
    ['drink', 'drank', 'drunk', 'пить'],
    ['drive', 'drove', 'driven', 'водить'],
    ['eat', 'ate', 'eaten', 'есть'],
    ['feel', 'felt', 'felt', 'чувствовать'],
    ['find', 'found', 'found', 'находить'],
    ['get', 'got', 'got', 'получать'],
    ['give', 'gave', 'given', 'давать'],
    ['go', 'went', 'gone', 'идти'],
    ['have', 'had', 'had', 'иметь'],
    ['hear', 'heard', 'heard', 'слышать'],
    ['know', 'knew', 'known', 'знать'],
    ['leave', 'left', 'left', 'уходить'],
    ['make', 'made', 'made', 'делать'],
    ['meet', 'met', 'met', 'встречать'],
    ['read', 'read', 'read', 'читать'],
    ['run', 'ran', 'run', 'бежать'],
    ['say', 'said', 'said', 'говорить'],
    ['see', 'saw', 'seen', 'видеть'],
    ['send', 'sent', 'sent', 'посылать'],
    ['sleep', 'slept', 'slept', 'спать'],
    ['speak', 'spoke', 'spoken', 'говорить'],
    ['take', 'took', 'taken', 'брать'],
    ['teach', 'taught', 'taught', 'учить'],
    ['tell', 'told', 'told', 'рассказывать'],
    ['think', 'thought', 'thought', 'думать'],
    ['understand', 'understood', 'understood', 'понимать'],
    ['write', 'wrote', 'written', 'писать'],
  ]
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })
  console.log('📚 KHAMADI ENGLISH — Textbook Generator (pdf-lib)')
  console.log('==================================================')

  console.log('📖 General English textbooks...')
  for (const level of ALL_GENERAL_ENGLISH_LEVELS) {
    await generateGeneralEnglish(level)
  }

  console.log('\n📖 ESP textbooks...')
  for (const esp of ALL_ESP_TEXTBOOKS) {
    await generateESP(esp)
  }

  fs.writeFileSync(
    path.join(OUT_DIR, 'manifest.json'),
    JSON.stringify({ generated_at: new Date().toISOString(), count: 13 }, null, 2),
  )
  console.log('\n✅ Done! 13 textbooks generated.')
}

main().catch(err => { console.error('❌', err.message); process.exit(1) })
