/**
 * Google OAuth Authentication Route
 * Handles Google sign-in credential verification and user session management
 * Based on Grok research implementation from luxury login design phase
 */

import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Google OAuth client
const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const client = new OAuth2Client(googleClientId);

// JWT secret for app tokens
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface GoogleUserPayload {
  sub: string;  // Google user ID
  email?: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
}

/**
 * Verify Google ID token and extract user information
 */
async function verifyGoogleToken(idToken: string): Promise<GoogleUserPayload> {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: googleClientId,
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid token - no payload');
    }
    
    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      email_verified: payload.email_verified,
    };
  } catch (error) {
    console.error('Google token verification failed:', error);
    throw new Error('Invalid Google token');
  }
}

/**
 * Create or update user in Supabase after Google OAuth
 */
async function upsertUser(googleUser: GoogleUserPayload) {
  const { sub, email, name, picture } = googleUser;
  
  if (!email) {
    throw new Error('Email is required from Google account');
  }

  // Check if user exists
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('google_id', sub)
    .single();

  if (existingUser) {
    // Update existing user
    const { data, error } = await supabase
      .from('users')
      .update({
        email,
        username: name || email.split('@')[0],
        avatar_url: picture,
        last_login: new Date().toISOString(),
      })
      .eq('google_id', sub)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Create new user
    const { data, error } = await supabase
      .from('users')
      .insert({
        google_id: sub,
        email,
        username: name || email.split('@')[0],
        avatar_url: picture,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

/**
 * Generate JWT token for authenticated user
 */
function generateAppToken(user: any): string {
  const payload = {
    userId: user.id,
    email: user.email,
    username: user.username,
  };

  return jwt.sign(payload, jwtSecret, {
    expiresIn: '7d', // Token expires in 7 days
  });
}

/**
 * POST /api/google-login
 * Main Google OAuth endpoint called from frontend
 */
export async function handleGoogleLogin(req: Request, res: Response) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required',
      });
    }

    // Step 1: Verify Google token
    const googleUser = await verifyGoogleToken(credential);
    
    // Step 2: Create/update user in Supabase
    const user = await upsertUser(googleUser);
    
    // Step 3: Generate app JWT token
    const token = generateAppToken(user);

    // Step 4: Return success with token
    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error: any) {
    console.error('Google login error:', error);
    
    return res.status(401).json({
      success: false,
      message: error.message || 'Google authentication failed',
    });
  }
}

/**
 * Register Google OAuth routes
 */
export function registerGoogleOAuthRoutes(app: any) {
  app.post('/api/google-login', handleGoogleLogin);
  console.log('✅ Google OAuth routes registered');
}
