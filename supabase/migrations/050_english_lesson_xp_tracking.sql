-- ── Add lesson_type and xp_earned to english_lesson_progress ──────────────
-- Needed for skill tracking, activity history, and XP calculations

ALTER TABLE english_lesson_progress
  ADD COLUMN IF NOT EXISTS lesson_type   TEXT    DEFAULT 'reading',
  ADD COLUMN IF NOT EXISTS xp_earned     INT     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lesson_title  TEXT,
  ADD COLUMN IF NOT EXISTS module_id     TEXT;

-- Index for skill-type queries (skills breakdown in dashboard/progress)
CREATE INDEX IF NOT EXISTS elp_type_idx ON english_lesson_progress (user_id, lesson_type);

-- ── Add group_id to english_user_profiles (for homework assignments) ─────────
ALTER TABLE english_user_profiles
  ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES english_groups(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS eup_group_idx  ON english_user_profiles (group_id);

-- ── Ensure english_user_profiles has last_active_at index ─────────────────
CREATE INDEX IF NOT EXISTS eup_active_idx ON english_user_profiles (last_active_at DESC);
