-- ═══════════════════════════════════════════════════════════════
-- KHAMADI ENGLISH — Users migration (run in Supabase SQL Editor)
-- Adds: status, email, approved_at, rejection_reason columns
-- Safe to re-run multiple times (idempotent)
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE english_user_roles
  ADD COLUMN IF NOT EXISTS status           text NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS email            text,
  ADD COLUMN IF NOT EXISTS approved_at      timestamptz,
  ADD COLUMN IF NOT EXISTS rejection_reason text;

-- Existing users without status = treat as already approved
UPDATE english_user_roles
SET status = 'approved'
WHERE status IS NULL OR status = '';

-- Index for fast pending-user lookups
CREATE INDEX IF NOT EXISTS idx_english_user_roles_status ON english_user_roles(status);

-- Confirm
SELECT
  COUNT(*) FILTER (WHERE status = 'pending')  AS pending,
  COUNT(*) FILTER (WHERE status = 'approved') AS approved,
  COUNT(*) FILTER (WHERE status = 'rejected') AS rejected,
  COUNT(*) AS total
FROM english_user_roles;
