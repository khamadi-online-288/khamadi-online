import { readFileSync, writeFileSync } from 'fs'

const FILES = [
  { path: 'app/english/zku/teacher/students/page.tsx', hookAfter: 'const [sortDir,  setSortDir]  = useState<SortDir>' },
  { path: 'app/english/zku/teacher/groups/[id]/page.tsx', hookAfter: 'const [showAdd,  setShowAdd]  = useState(false)' },
  { path: 'app/english/zku/teacher/students/[id]/page.tsx', hookAfter: "const router = useRouter()" },
  { path: 'app/english/zku/admin/teachers/page.tsx', hookAfter: 'const [creating,  setCreating]  = useState(false)' },
  { path: 'app/english/zku/admin/groups/page.tsx', hookAfter: "const [filterLevel, setFilterLevel] = useState('all')" },
]

// String replacements for each file
const REPLACEMENTS = {
  // Teacher students page
  'app/english/zku/teacher/students/page.tsx': [
    ["'Мои студенты'", "t.panel.nav_students"],
    ["'🔍 Поиск по имени...'", "t.panel.search_placeholder"],
    ["'Все группы'", "t.panel.nav_groups"],
    ["'Все уровни'", "t.panel.all_levels"],
    ["'Сегодня'", "t.panel.today"],
    ["'Студент'", "t.panel.student_col"],
    ["'Уровень'", "t.panel.level_col"],
    ["'Стрик'", "t.panel.streak_col"],
    ["'Активность'", "t.panel.activity_col"],
    ["'Группа'", "t.panel.group_col"],
    ["✕ Сбросить", "{t.panel.reset_filter}"],
  ],
  // Admin teachers page
  'app/english/zku/admin/teachers/page.tsx': [
    ["'Преподаватели'", "t.panel.all_teachers"],
    ["'+ Создать преподавателя'", "t.panel.create_teacher"],
    ["'Полное имя *'", "t.panel.teacher_name"],
    ["'Email *'", "t.panel.teacher_email"],
    ["'Создаём...'", "t.panel.saving"],
    ["'Создать аккаунт'", "t.panel.create_teacher"],
    ["'Отмена'", "t.panel.cancel_btn"],
  ],
  // Admin groups page
  'app/english/zku/admin/groups/page.tsx': [
    ["'Все группы'", "t.panel.nav_groups"],
    ["'🔍 Поиск по названию или преподавателю...'", "t.panel.search_placeholder"],
    ["'Все уровни'", "t.panel.all_levels"],
    ["'прогресс'", "t.panel.progress_label"],
    ["'студентов'", "t.panel.students_count"],
  ],
}

for (const { path, hookAfter } of FILES) {
  try {
    let src = readFileSync(path, 'utf-8')

    // Add const { t } = useZkuLang() after the hookAfter line if not present
    if (!src.includes('const { t } = useZkuLang()')) {
      src = src.replace(hookAfter, hookAfter + '\n  const { t } = useZkuLang()')
    }

    // Apply string replacements
    const reps = REPLACEMENTS[path]
    if (reps) {
      for (const [from, to] of reps) {
        if (src.includes(from)) {
          src = src.split(from).join(to)
          console.log(`  ✓ ${path}: replaced ${from}`)
        }
      }
    }

    writeFileSync(path, src, 'utf-8')
    console.log(`✅ ${path}`)
  } catch (e) {
    console.error(`❌ ${path}: ${e.message}`)
  }
}
