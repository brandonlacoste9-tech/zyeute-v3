-- Zyeuté Next-Gen Authentication Schema
-- Supports: Biometric (WebAuthn), Magic Link, Password, OAuth

-- WebAuthn Credentials Table
CREATE TABLE IF NOT EXISTS webauthn_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credential_id BYTEA NOT NULL UNIQUE,
  public_key BYTEA NOT NULL,
  sign_count INTEGER NOT NULL DEFAULT 0,
  transports TEXT[] DEFAULT ARRAY[]::TEXT[],
  device_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_webauthn_user_id ON webauthn_credentials(user_id);
CREATE INDEX idx_webauthn_credential_id ON webauthn_credentials(credential_id);

-- Magic Link Tokens Table
CREATE TABLE IF NOT EXISTS magic_link_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_magic_link_user_id ON magic_link_tokens(user_id);
CREATE INDEX idx_magic_link_email ON magic_link_tokens(email);
CREATE INDEX idx_magic_link_expires_at ON magic_link_tokens(expires_at);
CREATE INDEX idx_magic_link_token_hash ON magic_link_tokens(token_hash);

-- Session Management Table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  auth_method TEXT NOT NULL CHECK (auth_method IN ('biometric', 'magic-link', 'password', 'oauth', 'guest')),
  device_fingerprint TEXT,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Audit Log Table
CREATE TABLE IF NOT EXISTS auth_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('login', 'logout', 'register', 'password_change', 'biometric_register', 'biometric_login', 'magic_link_sent', 'magic_link_used', 'oauth_login')),
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
  ip_address INET,
  user_agent TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_user_id ON auth_audit_log(user_id);
CREATE INDEX idx_audit_event_type ON auth_audit_log(event_type);
CREATE INDEX idx_audit_created_at ON auth_audit_log(created_at);

-- Enable Row-Level Security (RLS)
ALTER TABLE webauthn_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_link_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own credentials
CREATE POLICY "Users can view their own credentials" ON webauthn_credentials
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own credentials" ON webauthn_credentials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own credentials" ON webauthn_credentials
  FOR DELETE USING (auth.uid() = user_id);

-- Magic link tokens (service role access only)
CREATE POLICY "Service can create magic links" ON magic_link_tokens
  FOR INSERT WITH CHECK (true);

-- Sessions (service role access)
CREATE POLICY "Users can view their own sessions" ON sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can manage sessions" ON sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service can update sessions" ON sessions
  FOR UPDATE USING (true);

-- Audit logs (admin only)
CREATE POLICY "Admins can view audit logs" ON auth_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Service can log auth events" ON auth_audit_log
  FOR INSERT WITH CHECK (true);

-- Function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM magic_link_tokens WHERE expires_at < NOW();
  DELETE FROM sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to log auth events
CREATE OR REPLACE FUNCTION log_auth_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_status TEXT,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_error_message TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO auth_audit_log (user_id, event_type, status, ip_address, user_agent, error_message)
  VALUES (p_user_id, p_event_type, p_status, p_ip_address, p_user_agent, p_error_message);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_activity_at in sessions
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_activity_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session_activity
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_session_activity();

GRANT SELECT, INSERT, UPDATE, DELETE ON webauthn_credentials TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON sessions TO authenticated;
GRANT SELECT ON auth_audit_log TO authenticated;
GRANT EXECUTE ON FUNCTION log_auth_event TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_tokens TO authenticated;
