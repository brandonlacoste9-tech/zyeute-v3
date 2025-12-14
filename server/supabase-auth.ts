/**
 * Supabase Auth Integration for Backend
 * JWT-based authentication (serverless-friendly)
 */

import { createClient } from '@supabase/supabase-js';
import type { Request, Response, NextFunction } from 'express';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Supabase credentials missing - auth middleware will reject all requests');
}

// Server-side Supabase client with service role key
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

/**
 * Middleware to verify Supabase JWT token
 * Extracts user from Authorization header
 */
export async function requireSupabaseAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Extract JWT from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    // Verify JWT and get user
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      console.error('[SupabaseAuth] Token verification failed:', error?.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Attach user to request for downstream handlers
    (req as any).supabaseUser = user;

    next();
  } catch (error: any) {
    console.error('[SupabaseAuth] Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

/**
 * Optional auth middleware - allows both authenticated and anonymous requests
 */
export async function optionalSupabaseAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided - continue as anonymous
      (req as any).supabaseUser = null;
      return next();
    }

    const token = authHeader.replace('Bearer ', '');

    if (!supabaseAdmin) {
      (req as any).supabaseUser = null;
      return next();
    }

    // Try to verify token, but don't fail if invalid
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    (req as any).supabaseUser = user || null;

    next();
  } catch (error) {
    // Silently continue as anonymous on error
    (req as any).supabaseUser = null;
    next();
  }
}

/**
 * Get Supabase user from request
 */
export function getSupabaseUser(req: Request): any | null {
  return (req as any).supabaseUser || null;
}
