-- ── English lesson progress (ZKU student module) ────────────────
-- Uses text lesson_id to match the string IDs in mockData
-- (e.g. 'l17-1', 'l27-3') rather than UUIDs.

CREATE TABLE IF NOT EXISTS english_lesson_progress (
  id           bigserial    PRIMARY KEY,
  user_id      uuid         REFERENCES auth.users NOT NULL,
  lesson_id    text         NOT NULL,
  completed    boolean      NOT NULL DEFAULT false,
  score        integer,
  time_spent_min integer    NOT NULL DEFAULT 0,
  completed_at timestamptz,
  created_at   timestamptz  NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);

ALTER TABLE english_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "elp_own"
  ON english_lesson_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS elp_user_idx   ON english_lesson_progress (user_id);
CREATE INDEX IF NOT EXISTS elp_lesson_idx ON english_lesson_progress (lesson_id);
