-- NextGen Authentication System
-- Biometric + Magic Link Support
-- Created: Dec 18, 2025

-- 1. WebAuthn Authenticators (Biometric Storage)
CREATE TABLE IF NOT EXISTS user_authenticators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    credential_id TEXT NOT NULL UNIQUE,
    credential_public_key BYTEA NOT NULL,
    sign_count BIGINT DEFAULT 0,
    transports JSONB,
    device_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ
);

CREATE INDEX idx_user_authenticators_user_id ON user_authenticators(user_id);
CREATE INDEX idx_user_authenticators_credential_id ON user_authenticators(credential_id);

-- 2. Magic Link Tokens (Passwordless Auth)
CREATE TABLE IF NOT EXISTS magic_link_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    token_hash TEXT NOT NULL UNIQUE,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '15 minutes'),
    used_at TIMESTAMPTZ,
    ip_address INET,
    user_agent TEXT
);

CREATE INDEX idx_magic_link_tokens_email ON magic_link_tokens(email);
CREATE INDEX idx_magic_link_tokens_token_hash ON magic_link_tokens(token_hash);
CREATE INDEX idx_magic_link_tokens_expires_at ON magic_link_tokens(expires_at);

-- 3. Session Management
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    auth_method TEXT NOT NULL, -- 'biometric', 'magic_link', 'oauth', 'password'
    ip_address INET,
    user_agent TEXT,
    device_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- 4. Authentication Events Log (Audit Trail)
CREATE TABLE IF NOT EXISTS auth_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT,
    event_type TEXT NOT NULL, -- 'login', 'logout', 'register', 'biometric_add', 'magic_link_sent'
    auth_method TEXT,
    status TEXT NOT NULL, -- 'success', 'failed', 'attempted'
    error_message TEXT,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_auth_events_user_id ON auth_events(user_id);
CREATE INDEX idx_auth_events_email ON auth_events(email);
CREATE INDEX idx_auth_events_created_at ON auth_events(created_at);
CREATE INDEX idx_auth_events_event_type ON auth_events(event_type);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE user_authenticators ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_link_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_events ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for user_authenticators
CREATE POLICY "Users can view their own authenticators"
    ON user_authenticators FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own authenticators"
    ON user_authenticators FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own authenticators"
    ON user_authenticators FOR DELETE
    USING (auth.uid() = user_id);

-- 7. RLS Policies for user_sessions
CREATE POLICY "Users can view their own sessions"
    ON user_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can revoke their own sessions"
    ON user_sessions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 8. RLS Policies for auth_events (audit log - read-only for users)
CREATE POLICY "Users can view their own auth events"
    ON auth_events FOR SELECT
    USING (auth.uid() = user_id);

-- 9. Functions for cleanup
CREATE OR REPLACE FUNCTION cleanup_expired_magic_links()
RETURNS void AS $$
BEGIN
    DELETE FROM magic_link_tokens
    WHERE expires_at < NOW() AND used = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM user_sessions
    WHERE expires_at < NOW() AND revoked = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Function to log auth events
CREATE OR REPLACE FUNCTION log_auth_event(
    p_user_id UUID,
    p_email TEXT,
    p_event_type TEXT,
    p_auth_method TEXT,
    p_status TEXT,
    p_error_message TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_device_info JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_event_id UUID;
BEGIN
    INSERT INTO auth_events (
        user_id, email, event_type, auth_method, status,
        error_message, ip_address, user_agent, device_info
    ) VALUES (
        p_user_id, p_email, p_event_type, p_auth_method, p_status,
        p_error_message, p_ip_address, p_user_agent, p_device_info
    ) RETURNING id INTO v_event_id;
    
    RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Cron job to clean up expired tokens (run every hour)
-- Note: Requires pg_cron extension
-- SELECT cron.schedule('cleanup-magic-links', '0 * * * *', 'SELECT cleanup_expired_magic_links()');
-- SELECT cron.schedule('cleanup-sessions', '0 * * * *', 'SELECT cleanup_expired_sessions()');

-- 12. Comments for documentation
COMMENT ON TABLE user_authenticators IS 'Stores WebAuthn (biometric) credentials for passwordless authentication';
COMMENT ON TABLE magic_link_tokens IS 'Stores one-time magic link tokens for email-based passwordless authentication';
COMMENT ON TABLE user_sessions IS 'Manages active user sessions with auth method tracking';
COMMENT ON TABLE auth_events IS 'Audit log for all authentication events';
