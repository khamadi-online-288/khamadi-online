-- 042_approval_system.sql
-- User approval workflow

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending'
  CHECK (status IN ('pending', 'approved', 'rejected'));

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES profiles(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS approved_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rejection_reason text;

-- Existing English platform users are already trusted — mark as approved
UPDATE profiles SET status = 'approved' WHERE is_english_user = true;

-- Users without a profiles row at all stay as pending by default when row is created
