# ЗКУ English — контекст для ИИ

Модуль изучения английского для ЗКУ им. М. Утемісова (WKU) внутри khamadi-online.
URL: `khamadi.online/english/zku`. Мейнтейнер модуля — Bekzhan (поддержка + фичи), владелец репо — Adilet.

> Корневой `CLAUDE.md` описывает ҰБТ-платформу (симулятор, квизы, `questions`, `user_stats`) — **к ЗКУ это не относится**.
> Дизайн-система оттуда (sky-синий, Montserrat, Tailwind-классы) здесь **не используется**.
> Код и комментарии — на английском, общение — на русском.

---

## Границы модуля

**Своё (можно менять):**
- `app/english/zku/**` — все страницы
- `app/api/english/zku/**` — `register`, `create-user`, `sync-orphans`
- `components/english/zku/LevelCertificateView.tsx`
- `lib/english/zku-*.ts`, `lib/english/zkuTranslations.ts`, `lib/english/useZkuAppShell.ts`
- `lib/english/level-progress.ts`, `lib/english/lesson-time.ts`
- `docs/ZKU-English-Instrukciya.md` — пользовательская инструкция (частично устарела, см. ниже)

**Общее с KHAMADI English (менять осторожно, может сломать `/english/*`):**
- `app/api/english/admin/*`, `app/api/english/teacher/*`, `leaderboard`, `tts`, `ai-proxy`
- `lib/english/mockData.ts` (модули/уроки всех уровней), `supabase-client.ts`, `useTTS.ts`,
  `placementQuestions.ts`, `placementLogic.ts`, `checkWriting.ts`, `download-certificate-pdf.ts`
- `supabase/migrations/*`

**Не трогать:** всё остальное в `app/english/*` (dashboard, teacher, admin, curator, support-agent) — это другой продукт (KHAMADI English), а также весь ҰБТ-код.

---

## Роли и маршруты

| Роль | Корень | Guard |
|---|---|---|
| student | `/english/zku/student` | `student/layout.tsx` — только наличие сессии (роль **не** проверяется) |
| teacher | `/english/zku/teacher` | `teacher/layout.tsx` — role ∈ {teacher, admin} |
| admin | `/english/zku/admin` | `admin/layout.tsx` — role = admin |

- `proxy.ts` (Next middleware) **не покрывает** `/english/zku` — вся защита страниц клиентская, в layout'ах.
- Настоящая защита данных — RLS + проверки в API-роутах.
- Логин `/english/zku/login` → редирект по `english_user_profiles.role`.
- Регистрация **закрыта**: `/api/english/zku/register` и `/create-user` работают только с Bearer-токеном админа. Аккаунты создаёт админ.
- Пароль при создании ≥ 8 символов; смена пароля админом (`/api/english/admin/change-password`) ≥ 6.

### Страницы
- **student:** `page` (дашборд), `course`, `course/[level]` (slug: a1, a11, a2, b1, b2, c1), `module/[id]`, `lesson/[id]`, `vocab`, `vocab/lesson/[id]`, `literature`, `progress`, `placement`, `writing-coach`, `writing-coach/[type]`, `certificates`, `certificates/[level]` (+ отдельные `a1`, `a11`), `leaderboard`, `achievements`, `homework`, `profile`
- **teacher:** `page`, `groups`, `groups/[id]`, `students`, `students/[id]`, `students/[id]/certificates/[slug]`, `literature`
- **admin:** `page`, `students`, `students/[id]`, `students/[id]/certificates/[slug]`, `teachers`, `groups`, `certificates`
- `admin/students/page.tsx.bak` — мусор, не править и не импортировать.

---

## Данные (Supabase)

Клиент: `createEnglishClient()` из `@/lib/english/supabase-client` (browser, `@supabase/ssr`, singleton).
Service role в API: `createEnglishServiceClient()` из `@/lib/english/zku-create-user` (или локальный `createClient` в общих роутах).

| Таблица | Ключевые поля |
|---|---|
| `english_user_profiles` | `user_id` (PK), `tenant_id`, `role` (student/teacher/admin), `full_name`, `current_level`, `total_xp`, `current_streak`, `longest_streak`, `last_active_at`, `group_id` |
| `english_lesson_progress` | `user_id`, `lesson_id` (text, напр. `l16-1`), `lesson_type`, `lesson_title`, `completed`, `score`, `xp_earned`, `time_spent_min`, `completed_at`; UNIQUE(`user_id`,`lesson_id`) |
| `english_groups` | `id`, `teacher_id`, `name`, `join_code`, `level_code`, `students_count`, `avg_progress` |
| `english_group_teachers` | (`group_id`, `teacher_id`) — many-to-many, у группы может быть несколько преподавателей |
| `english_tenants` | `code` = `'zku'`; `ensureZkuTenantId()` создаёт строку при отсутствии |

- Студент привязан к группе через `english_user_profiles.group_id` (не через `english_group_members`).
- `english_user_roles` — таблица старого KHAMADI English (её читает `proxy.ts`), для ЗКУ источник роли — `english_user_profiles.role`.
- RLS: студент пишет только свой прогресс; teacher/admin читают весь прогресс (миграция 051); профили читаются всеми authenticated (для лидерборда).
- «Сироты» — auth-пользователи без профиля, в админке их не видно. Чинит `/api/english/zku/sync-orphans` (GET — список, POST — создать профили, `dryRun` поддерживается).

### Паттерн API-роута
```ts
const token = req.headers.get('authorization')?.replace('Bearer ', '')
const { data: { user } } = await admin.auth.getUser(token)
// затем проверка english_user_profiles.role
```
Клиент передаёт `Authorization: Bearer ${session.access_token}`.

---

## Контент курса

Контент **захардкожен в TS**, БД-таблицы `english_courses/modules/lessons` ЗКУ не использует.

- **Модули и списки уроков:** `lib/english/mockData.ts` — `MOCK_A1_MODULES`, `MOCK_A11_MODULES`, `MOCK_A2_MODULES`, `MOCK_B1_MODULES`, `MOCK_B2_MODULES`, `MOCK_C1_MODULES` + `MOCK_LESSONS_M*`. Поля `progress`/`isLocked` в mock — заглушки, реальный прогресс считается из `english_lesson_progress`.
- **Тексты уроков:** `app/english/zku/student/lesson/[id]/page.tsx` (~52 000 строк!). Константы `L{module}_{n}` типа `FullLesson`, сводятся в `LESSON_MAP` (~стр. 49165), компонент `LessonPage` в конце файла (~стр. 49741). Неизвестный id → `DEMO`.
  - **Не читать файл целиком.** Искать через `grep -n "const L12_3"` и читать нужный диапазон.
  - Для B2/C1 (`lb2-*`, `lc1-*`) записей в `LESSON_MAP` нет.
- **Словарные уроки:** `student/vocab/lesson/[id]/page.tsx` (~5000 строк), `LESSON_VOCAB` (~стр. 233). Тоже не читать целиком.
- **Литература:** `lib/english/zku-literature.ts`.
- **Цели модулей:** `MODULE_OBJECTIVES` в `student/module/[id]/page.tsx`.

### ID-схема
- Модули: `m-1…m-16` (A1), `m-a11-1…18`, `m-a2-1…24`, `m-b1-1…26`, `m-b2-1…26`, `m-c1-1…32`.
- Уроки A1–B1 нумеруются сквозным номером модуля: `l{N}-{k}`, грамматика `l{N}-g{k}`, варианты `l{N}-3B`.
  `levelOfLessonId()`: N ≤ 16 → A1, ≤ 34 → A1.1, ≤ 58 → A2, ≤ 84 → B1. B2/C1 — `lb2-…`, `lc1-…`.
- Типы уроков: reading, listening, grammar, writing, vocabulary, test.

---

## Уровни, блокировки, сертификаты

Порядок: `A1 → A1.1 → A2 → B1 → B2 → C1` (`LEVEL_PROGRESSION` в `lib/english/zku-level-certs.ts`).
В БД бывает старое значение `current_level = 'Beginner'` → нормализуется в `A1` (`toCourseLevel`).

- **Курс (`course/page.tsx`):** открыт только уровень, равный `current_level`.
- **Модули (`course/[level]`):** модуль N+1 открывается, когда модуль N ≥ 85% (`UNLOCK_THRESHOLD`).
- **Уроки внутри модуля:** все открыты (`isLocked = false` принудительно), финальный тест тоже доступен сразу.
  *Инструкция в docs говорит про блокировку теста на 85% — это устарело.*
- **Финальный экзамен уровня** = модуль `LEVEL_CERTS[i].moduleId` из 3 уроков (A1: `m-16` / `l16-1..3`, A1.1: `m-a11-18` / `l34-*`, A2: `m-a2-24` / `l58-*`, B1: `m-b1-26` / `l84-*`, B2: `m-b2-26`, C1: `m-c1-32`).
- **Сертификат** выдаётся, когда пройдены все 3 урока экзамена (`examComplete`, `earnedCertsFromProgress`). Номер: `WKU-{CODE}-{первые 8 hex userId}` (`levelCertNumber`). Хранить в БД не нужно — вычисляется из прогресса.
- **Повышение уровня:** после записи урока вызывается `syncLevelFromProgress()` (`lib/english/level-progress.ts`) — поднимает `current_level` на следующий после сданного экзамена; никогда не понижает (placement / ручная установка админом сохраняются).

## Сохранение прогресса урока

В `lesson/[id]` и `vocab/lesson/[id]`:
1. `writeLessonProgress()` (`lib/english/lesson-time.ts`) — upsert по (`user_id`,`lesson_id`); если в БД нет колонки `time_spent_min` — повтор без неё.
2. Только при **первом** прохождении: `+xp` к `total_xp`, пересчёт `current_streak` / `longest_streak` по дню `last_active_at`, upsert профиля.
3. `syncLevelFromProgress(supabase, user.id, id)`.

Изменяя эту логику — менять в обоих файлах одинаково.

---

## UI и стили

- Почти всё — `'use client'` + **inline styles** с локальными константами цветов. Tailwind и классы из `globals.css` почти не используются.
- Палитра ЗКУ: navy `#003876` (`N`), gold `#C9933B` (`G`), teal `#1D9E75` (`T`), sky `#1B8FC4` (`S`), muted `#64748B`, фон `#F4F6FA`. Цвет уровня — `LEVEL_CERTS[].color`.
- Иконки — inline SVG в `student/_icons.tsx` (`IcCheck`, `IcBook`, …).
- Мобильная адаптация — `zku-responsive.css` (брейкпоинт 768px, safe-area, классы `zku-*`). Новые адаптивные правила — туда, а не переписывать огромные файлы.
- Приложение открывается в **React Native WebView**: `?app=1` / `window.ReactNativeWebView` → `useZkuAppShell()` / `isZkuAppShell()`. Редиректы на логин — всегда через `zkuLoginHref()` (сохраняет `?app=1`).
- Корневой layout: `translate="no"` (блок автоперевода браузера), viewport без zoom.

## Языки (RU / KZ / EN)

- Кабинеты: `ZkuLangProvider` / `useZkuLang()` / `ZkuLangSwitcher` из `student/zku-lang.tsx`; словарь `ZKU_T` (`ru`, `kz`, `en`), ключ localStorage `zku-lang`. Новый текст → добавить ключ во **все три** языка (тип `ZkuT` берётся из `ru`).
- Лендинг `/english/zku`: `lib/english/zkuTranslations.ts`.
- `login/` и `register/` — свои локальные словари `T` внутри файла.
- Названия бренда: RU «ЗКУ им. М. Утемісова», KZ «МӨ атындағы БҚУ», EN «West Kazakhstan University (WKU)».

## Внешние сервисы

- AI (Writing coach): `/api/english/ai-proxy` → Anthropic, модель `claude-sonnet-4-20250514`, нужен `ANTHROPIC_API_KEY`, требует сессию.
- TTS: `/api/english/tts` → OpenAI `tts-1` при наличии `OPENAI_API_KEY`, иначе голос браузера (`lib/english/useTTS.ts`).
- Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`.

---

## Правила работы

- Экономить токены: огромные файлы уроков читать только точечно (`grep -n` → `Read` с offset/limit).
- Next.js в репо новее обычного — перед использованием API Next смотреть `node_modules/next/dist/docs/` (см. `AGENTS.md`).
- TypeScript strict, без `any`; ошибки Supabase обрабатывать (`const { data, error } = …`).
- Не менять общие `/api/english/*` и `mockData.ts` без явного предупреждения — ими пользуется KHAMADI English.
- Миграции добавлять новым файлом в `supabase/migrations/` (следующий номер после `053`), применяются вручную в Supabase SQL Editor.
- Тестов нет — проверять через `npx tsc --noEmit` и `npm run lint`.
