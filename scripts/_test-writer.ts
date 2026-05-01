// Test PdfWriter with Russian text — same class used in textbooks
import * as path from 'path'
import { PdfWriter } from './pdf-builder'

async function main() {
  const w = await PdfWriter.create('Тест учебника', 'A1')
  w.newPage(false)
  w.y = 60

  // Exact same calls as generate-textbooks.ts
  w.sectionHeading('Тест кириллицы через PdfWriter', 1)
  w.bodyText('Добро пожаловать в курс A1 Beginner English от KHAMADI ENGLISH!')
  w.bodyText('Глагол "to be" — самый важный глагол в английском.')
  w.ruNote('Бухгалтерский учёт — основа финансовой отчётности.')
  w.sectionHeading('Словарный запас', 2)
  w.vocabTable([
    { en: 'hello', pos: 'excl.', def: 'A greeting', ru: 'привет', example: 'Hello!' },
    { en: 'student', pos: 'n.', def: 'A person who studies', ru: 'студент', example: 'I am a student.' },
    { en: 'language', pos: 'n.', def: 'System of communication', ru: 'язык', example: 'English is a language.' },
  ])
  w.sectionHeading('Упражнения', 2)
  w.exerciseBlock({
    instruction: 'Complete with am, is, are.',
    ruHint: 'Заполните пропуски: am, is или are.',
    items: ['I _____ a student.', 'She _____ from Kazakhstan.'],
  }, 1)

  await w.save(path.join('public', 'textbooks', '_test-writer.pdf'))
}

main().catch(e => { console.error(e.message); process.exit(1) })
