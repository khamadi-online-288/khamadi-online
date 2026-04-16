# KHAMADI ONLINE — Project Context for Claude

## Project Overview

**KHAMADI ONLINE** (khamadi.online) — образовательная платформа для подготовки к ҰБТ (единое национальное тестирование, Казахстан).  
Owner/Dev: Adilet  
Repo: github.com/khamadi-online-288/khamadi-online  
Deployed: Vercel

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14, App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + globals.css |
| Backend/DB | Supabase (JS client напрямую) |
| AI | Anthropic Claude API |
| Deploy | Vercel |

---

## Design System

```
Background:   #ffffff  (белый)
Text primary: #0f172a
Text muted:   #64748b / #475569
Accent:       #0ea5e9 (sky-500) / #38bdf8 (sky-400)
Accent dark:  #0284c7
Border:       rgba(226, 232, 240, 0.9)
Card bg:      rgba(255, 255, 255, 0.8)
Dark panel:   #0f172a (используется внутри карточек)
```

- Шрифт: Montserrat (font-weight 700/800 везде)
- Стиль: светлый, чистый, premium — с glassmorphism эффектами
- Акценты — синие (sky), градиенты `#38bdf8 → #0ea5e9 → #0284c7`
- Кнопки: border-radius 999px (pill shape)
- Карточки: border-radius 24–34px, backdrop-filter blur
- Анимации: floatSoft, fadeUp, orbMoveOne/Two, shine, pulseGlow
- Tailwind v4: кастомные классы через `globals.css`, не через `tailwind.config.js`

### Ключевые классы (не менять имена)
`btn-primary`, `btn-secondary`, `hero-primary`, `hero-secondary`,
`feature-card`, `subject-card`, `step-card`, `ai-section`,
`text-gradient`, `badge-pill`, `glass-card`, `orb`, `grid-bg`

---

## Project Structure

```
/app
  /dashboard          # Дашборд студента (прогресс, статистика)
  /quiz               # Квиз-система с геймификацией
  /simulator          # ҰБТ симулятор (полноформатный экзамен)
  /profile            # Профиль пользователя
  /universities       # Раздел университетов
  /parent             # Кабинет родителей
  /subjects           # Предметы (история, математика, физика и т.д.)
/components
  /ui                 # Базовые UI компоненты
  /simulator          # Компоненты симулятора
  /quiz               # Компоненты квиза
/lib
  /supabase.ts        # Supabase client (JS client напрямую)
  /anthropic.ts       # Claude API интеграция
/types                # TypeScript типы
```

---

## Supabase Conventions

- Клиент инициализируется в `/lib/supabase.ts`, импортируется везде оттуда
- Использовать **JS client напрямую** (не Server Actions, не Route Handlers)
- Таблицы используют `snake_case`
- Всегда типизировать ответы через TypeScript generics: `supabase.from<MyType>('table')`
- RLS включён — учитывать при запросах

### Основные таблицы

```sql
-- Вопросы ҰБТ
questions: id, variant_id, subject, question_num, question_type, 
           question_text, option_a, option_b, option_c, option_d,
           correct_answer, explanation, context_text, points

-- Пользователи / прогресс
profiles: id, user_id, name, role (student|parent)
simulator_sessions: id, user_id, variant_id, answers, score, completed_at

-- Геймификация
user_stats: user_id, xp, level, streak, longest_streak, last_activity_date,
            total_simulators, total_study_done, total_ai_analysis,
            total_quizzes, total_perfect_quizzes, updated_at
user_achievements: id, user_id, achievement_key, unlocked, progress, unlocked_at
daily_activity: id, user_id, activity_date, activity_type

-- Квиз-результаты (создать если нет):
-- CREATE TABLE quiz_results (
--   id               bigserial PRIMARY KEY,
--   user_id          uuid REFERENCES auth.users NOT NULL,
--   section_id       integer NOT NULL,
--   subject_id       integer NOT NULL,
--   score            integer NOT NULL,        -- процент правильных (0-100)
--   xp_earned        integer NOT NULL DEFAULT 0,
--   correct_answers  integer NOT NULL DEFAULT 0,
--   total_questions  integer NOT NULL DEFAULT 0,
--   max_streak       integer NOT NULL DEFAULT 0,
--   difficulty       text NOT NULL DEFAULT 'medium',
--   time_seconds     integer NOT NULL DEFAULT 0,
--   created_at       timestamptz NOT NULL DEFAULT now()
-- );
-- CREATE INDEX ON quiz_results(user_id, section_id);
-- ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users read own" ON quiz_results FOR SELECT USING (auth.uid() = user_id);
-- (inserts are done via service role key in /api/update-gamification)
```

---

## ҰБТ Simulator — Key Rules

- **120 вопросов** на вариант (Математика + Физика или другая пара)
- **140 баллов** максимум (официальный формат 2026)
- Таймер: 240 минут, обратный отсчёт
- Навигация по вопросам: сетка с цветовой индикацией (отвечено / пропущено / текущий)
- Subject tabs: переключение между предметами без потери ответов
- AI Review: после завершения — анализ ошибок через Claude API

---

## AI Review (Claude API) — Integration Pattern

```typescript
// Всегда использовать claude-sonnet-4-20250514
// Промпт на русском или казахском в зависимости от пользователя
// Структура ответа: разбор ошибок, советы по темам, общий балл

const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }]
  })
})
```

---

## Features Status

| Фича | Статус |
|---|---|
| Регистрация / Авторизация | ✅ Готово |
| Профиль пользователя | ✅ Готово |
| ҰБТ Симулятор | 🔨 В разработке |
| AI Review | 🔨 В разработке |
| Квиз-система с геймификацией | 🔨 В разработке |
| Дашборд прогресса | 🔨 В разработке |
| Кабинет родителей | 🔨 В разработке |
| Раздел университетов | 🔨 В разработке |
| Контент (вопросы/уроки) | 🔨 Наполняется |

---

## Code Style Rules

- **TypeScript strict** — никаких `any`, всегда явные типы
- **Компоненты** — функциональные, `'use client'` только там где нужно
- **Tailwind v4** — стили через CSS variables в `globals.css`, не хардкод цветов
- **Именование**: компоненты PascalCase, файлы kebab-case, функции camelCase
- **Импорты**: абсолютные через `@/`
- **Ошибки Supabase**: всегда обрабатывать `error` из деструктуризации

```typescript
// ✅ Правильно
const { data, error } = await supabase.from('questions').select('*')
if (error) throw error

// ❌ Неправильно
const result = await supabase.from('questions').select('*')
```

---

## Common Pitfalls (известные проблемы)

- **Tailwind v4 + globals.css**: кастомные классы могут перекрываться — проверять cascade order
- **`'use client'` граница**: не добавлять без необходимости, Server Components по умолчанию
- **Supabase auth**: сессия может быть `null` — всегда проверять перед запросами
- **TypeScript JSX**: файлы с JSX должны иметь расширение `.tsx`

---

## Language

- Код и комментарии: **английский**
- Контент платформы (тексты, вопросы): **русский / казахский**
- Общение в этом чате: русский