-- ============================================================================
-- 0007: SUPABASE SECURITY HARDENING
-- Hardening RLS, Refactoring Views, and Optimizing Policies
-- ============================================================================

-- 1. HARDEN AI TASK PIPELINE (colony_tasks)
-- Add user ownership to tasks and restrict public access
ALTER TABLE public.colony_tasks ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE;

-- Drop insecure public policies
DROP POLICY IF EXISTS "Anyone can insert tasks" ON public.colony_tasks;
DROP POLICY IF EXISTS "Anyone can view tasks" ON public.colony_tasks;

-- Only authenticated users can trigger tasks
CREATE POLICY "Users can insert their own tasks"
ON public.colony_tasks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Only owners or system workers can view task details
CREATE POLICY "Users can view their own tasks"
ON public.colony_tasks FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR (auth.role() = 'service_role'));

-- 2. ENABLE RLS ON LEAKY TABLES
-- Sensitive analytics and device data must be protected
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poussoirs_appareils ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own interactions"
ON public.user_interactions FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own device tokens"
ON public.poussoirs_appareils FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 3. CONVERT SECURITY DEFINER VIEWS TO SECURITY INVOKER
-- Ensures views respect the caller's RLS permissions
ALTER VIEW public.trending_dashboard SET (security_invoker = on);
ALTER VIEW public.tendances_par_region SET (security_invoker = on);
ALTER VIEW public.publication_engagement_breakdown SET (security_invoker = on);

-- 4. CONSOLIDATE REDUNDANT PROFILE POLICIES
-- Cleanup 5+ overlapping policies on user_profiles
DROP POLICY IF EXISTS "profiles_self_rw" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.user_profiles;
DROP POLICY IF EXISTS "self_update_user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

CREATE POLICY "Self managed profile access"
ON public.user_profiles FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 5. SERVICE ROLE OVERRIDE (For AI Swarm/Ti-Guy)
-- Ensure system agents can always operate
CREATE POLICY "Service role full access"
ON public.colony_tasks FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
