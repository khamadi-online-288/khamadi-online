-- 044_english_roles_status.sql
-- Move approval workflow into english_user_roles (no dependency on profiles columns)

ALTER TABLE english_user_roles ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';
ALTER TABLE english_user_roles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE english_user_roles ADD COLUMN IF NOT EXISTS rejection_reason text;
ALTER TABLE english_user_roles ADD COLUMN IF NOT EXISTS approved_at timestamptz;
ALTER TABLE english_user_roles ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- All existing users are already approved
UPDATE english_user_roles SET status = 'approved' WHERE status = 'pending' OR status IS NULL;

-- Add constraint after backfill
ALTER TABLE english_user_roles DROP CONSTRAINT IF EXISTS english_user_roles_status_check;
ALTER TABLE english_user_roles ADD CONSTRAINT english_user_roles_status_check
  CHECK (status IN ('pending', 'approved', 'rejected'));
