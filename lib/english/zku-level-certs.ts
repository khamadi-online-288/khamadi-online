/** Final exam of each ZKU level. Completing every part issues the certificate. */

export interface LevelCert {
  code: string
  slug: string
  moduleId: string
  lessons: string[]
  name: string
  program: string
  color: string
  header: string
  button: string
  shadow: string
  skills: string[]
}

export const LEVEL_CERTS: LevelCert[] = [
  {
    code: 'A1', slug: 'a1', moduleId: 'm-16',
    lessons: ['l16-1', 'l16-2', 'l16-3'],
    name: 'Beginner', program: 'A1 English — Beginner Level',
    color: '#1D9E75',
    header: 'linear-gradient(135deg, #003876 0%, #012f5c 100%)',
    button: 'linear-gradient(135deg, #C9933B, #8B6427)',
    shadow: 'rgba(201,147,59,0.35)',
    skills: ['Basic vocabulary', 'Present Simple', 'Numbers & Colors', 'Self-introduction'],
  },
  {
    code: 'A1.1', slug: 'a11', moduleId: 'm-a11-18',
    lessons: ['l34-1', 'l34-2', 'l34-3'],
    name: 'Elementary', program: 'A1.1 English — Elementary Level',
    color: '#16A34A',
    header: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
    button: 'linear-gradient(135deg, #16A34A, #15803D)',
    shadow: 'rgba(22,163,74,0.30)',
    skills: ['Everyday English', 'Shopping', 'Descriptions', 'Past Simple intro'],
  },
  {
    code: 'A2', slug: 'a2', moduleId: 'm-a2-24',
    lessons: ['l58-1', 'l58-2', 'l58-3'],
    name: 'Pre-Intermediate', program: 'A2 English — Pre-Intermediate Level',
    color: '#1B8FC4',
    header: 'linear-gradient(135deg, #1B8FC4 0%, #0e7490 100%)',
    button: 'linear-gradient(135deg, #1B8FC4, #0369a1)',
    shadow: 'rgba(27,143,196,0.35)',
    skills: ['Past Simple', 'Comparatives', 'Daily routines', 'Shopping & Travel'],
  },
  {
    code: 'B1', slug: 'b1', moduleId: 'm-b1-26',
    lessons: ['l84-1', 'l84-2', 'l84-3'],
    name: 'Intermediate', program: 'B1 English — Intermediate Level',
    color: '#7C3AED',
    header: 'linear-gradient(135deg, #7C3AED 0%, #5b21b6 100%)',
    button: 'linear-gradient(135deg, #7C3AED, #6d28d9)',
    shadow: 'rgba(124,58,237,0.35)',
    skills: ['Conditionals', 'Passive Voice', 'Reported Speech', 'IELTS 5.0+'],
  },
  {
    code: 'B2', slug: 'b2', moduleId: 'm-b2-26',
    lessons: ['lb2-26-1', 'lb2-26-2', 'lb2-26-3'],
    name: 'Upper-Intermediate', program: 'B2 English — Upper-Intermediate Level',
    color: '#DB2777',
    header: 'linear-gradient(135deg, #DB2777 0%, #9d174d 100%)',
    button: 'linear-gradient(135deg, #DB2777, #be185d)',
    shadow: 'rgba(219,39,119,0.35)',
    skills: ['Advanced Grammar', 'Academic Writing', 'Debates', 'IELTS 6.0+'],
  },
  {
    code: 'C1', slug: 'c1', moduleId: 'm-c1-32',
    lessons: ['lc1-32-1', 'lc1-32-2', 'lc1-32-3'],
    name: 'Advanced', program: 'C1 English — Advanced Level',
    color: '#D97706',
    header: 'linear-gradient(135deg, #D97706 0%, #92400e 100%)',
    button: 'linear-gradient(135deg, #D97706, #b45309)',
    shadow: 'rgba(217,119,6,0.35)',
    skills: ['Idiomatic English', 'Academic Research', 'Business English', 'IELTS 7.0+'],
  },
]

export function certByCode(code: string): LevelCert | undefined {
  return LEVEL_CERTS.find(c => c.code === code)
}

export function certBySlug(slug: string): LevelCert | undefined {
  return LEVEL_CERTS.find(c => c.slug === slug)
}

export function certByModule(moduleId: string): LevelCert | undefined {
  return LEVEL_CERTS.find(c => c.moduleId === moduleId)
}

export function certByLesson(lessonId: string): LevelCert | undefined {
  return LEVEL_CERTS.find(c => c.lessons.includes(lessonId))
}

export function certPath(cert: LevelCert): string {
  return `/english/zku/student/certificates/${cert.slug}`
}

/** Map a stored lesson id to its CEFR level. B2/C1 ids are prefixed, not numeric. */
export function levelOfLessonId(lessonId: string): string | null {
  if (lessonId.startsWith('lb2-')) return 'B2'
  if (lessonId.startsWith('lc1-')) return 'C1'
  const m = lessonId.match(/^l(\d+)/)
  if (!m) return null
  const n = parseInt(m[1], 10)
  if (n <= 16) return 'A1'
  if (n <= 34) return 'A1.1'
  if (n <= 58) return 'A2'
  if (n <= 84) return 'B1'
  return null
}

export function examComplete(cert: LevelCert, completed: ReadonlySet<string>): boolean {
  return cert.lessons.every(id => completed.has(id))
}
