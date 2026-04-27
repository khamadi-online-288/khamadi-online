-- 041_english_isolation.sql
-- Adds is_english_user flag to profiles and auto-marks users who register on English platform

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_english_user boolean DEFAULT false;

-- Mark existing English platform users
UPDATE profiles
SET is_english_user = true
WHERE id IN (SELECT user_id FROM english_user_roles);

-- Auto-mark on role assignment
CREATE OR REPLACE FUNCTION mark_english_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE profiles SET is_english_user = true WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_mark_english_user ON english_user_roles;
CREATE TRIGGER trg_mark_english_user
  AFTER INSERT ON english_user_roles
  FOR EACH ROW EXECUTE FUNCTION mark_english_user();
