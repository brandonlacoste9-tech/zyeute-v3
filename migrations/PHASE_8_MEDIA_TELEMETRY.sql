-- Phase 8: Telemetry & Media Analytics
-- Schema for tracking Swarm Media Generation and Usage

CREATE TABLE IF NOT EXISTS media_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent TEXT NOT NULL, -- e.g., 'mediaAgent', 'JoualBee'
    action TEXT NOT NULL, -- e.g., 'generateCinematicMedia'
    metadata JSONB DEFAULT '{}'::jsonb, -- Store prompt, style, model info
    latency_ms INTEGER, -- Execution time in milliseconds
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    
    -- Optional: link to user if available/needed, but keep loose for swarm agents
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Index for dashboards
CREATE INDEX IF NOT EXISTS idx_media_telemetry_timestamp ON media_telemetry(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_media_telemetry_agent ON media_telemetry(agent);
CREATE INDEX IF NOT EXISTS idx_media_telemetry_action ON media_telemetry(action);

-- RLS Policies
ALTER TABLE media_telemetry ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (agents/clients) to insert logs
CREATE POLICY "Allow authenticated insert" ON media_telemetry
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to view logs (for dashboard)
CREATE POLICY "Allow authenticated select" ON media_telemetry
    FOR SELECT TO authenticated
    USING (true);

-- Optional: Service role has full access (implicit)
