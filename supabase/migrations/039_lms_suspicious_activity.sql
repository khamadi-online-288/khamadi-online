CREATE TABLE IF NOT EXISTS lms_suspicious_activity (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  action text NOT NULL,
  metadata jsonb,
  url text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lms_suspicious_user ON lms_suspicious_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_lms_suspicious_created ON lms_suspicious_activity(created_at);

ALTER TABLE lms_suspicious_activity ENABLE ROW LEVEL SECURITY;

-- Only admins can read suspicious activity logs
CREATE POLICY "admins_read_suspicious" ON lms_suspicious_activity
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM english_user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Service role inserts via API route
