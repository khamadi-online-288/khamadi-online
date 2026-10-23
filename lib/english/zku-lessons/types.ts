// Shared types for ZKU lesson content (data lives in ./data/*.json)

export type Phase = 'intro' | 'reading' | 'vocab' | 'grammar' | 'practice' | 'quiz' | 'done'
export type QType = 'mc' | 'tf' | 'fill'

export interface VocabItem {
  en: string; ipa: string; pos: string
  ru: string; kz: string; emoji: string
  definition: string; example: string; collocations: string[]
}
export interface GrammarRow { subject: string; verb: string; short: string; example: string }
export interface GrammarExtra { title: string; color: string; bg: string; border: string; rows: { form: string; example: string }[] }
export interface KeyPhrase   { phrase: string; ru: string; context: string }
export interface DialogLine  { speaker: string; text: string; isLeft: boolean }
export type QCat = 'reading' | 'listening' | 'grammar' | 'vocabulary'
export interface Question    { id: string; type: QType; cat: QCat; text: string; opts?: string[]; correct: string; hint: string; points: number }
export interface Exercise    { id: string; type: QType; instruction: string; text: string; opts?: string[]; correct: string; hint: string }
export interface PrepTask    { id: string; word: string; emoji: string; opts: string[]; correct: string }
export interface Task1Item   { id: string; question: string; correct: string }
export interface Task2Item   { id: string; statement: string; correct: 'true' | 'false' }
export interface Character   { id: string; name: string; city: string; emoji: string; color: string; bg: string; role: string }
export interface ListenStatement { id: string; text: string; correctCharId: string }
export interface WritingLine { key: string; prefix: string; suffix: string; placeholder: string; hint: string }
export interface WritingPhrase { category: string; color: string; items: string[] }

export interface FullLesson {
  id: string; moduleNum: number; lessonNum: number
  moduleTitle: string; title: string
  type: 'reading' | 'grammar' | 'listening' | 'writing' | 'test'
  xp: number; duration: number
  paragraphs: string[]
  dialogue: DialogLine[]
  keyPhrases: KeyPhrase[]
  vocab: VocabItem[]
  prepTasks: PrepTask[]
  task1Bank: string[]
  task1Items: Task1Item[]
  task2Items: Task2Item[]
  listenChars: Character[]
  listenStatements: ListenStatement[]
  writingModel: string[]
  writingTemplate: WritingLine[]
  writingPhrases: WritingPhrase[]
  grammarTitle: string; grammarNote: string
  grammarTable: GrammarRow[]
  grammarExtra: GrammarExtra[]
  grammarTip: string
  exercises: Exercise[]
  questions: Question[]
}

