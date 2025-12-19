import express, { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { sendMagicLinkEmail } from '../email/sendMagicLinkEmail';

const router = Router();
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Helper: Hash token for storage
const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Helper: Generate secure random token
const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * POST /api/auth/magic-link/send
 * Send magic link to user email
 */
router.post('/send', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Check if user exists
    const { data: user } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (!user) {
      // For security, don't reveal if email exists
      return res.status(200).json({ 
        success: true, 
        message: 'If that email exists, a link has been sent.' 
      });
    }

    // Generate token
    const token = generateToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store token hash in database
    const { error: storeError } = await supabase
      .from('magic_link_tokens')
      .insert({
        user_id: user.id,
        email,
        token_hash: tokenHash,
        expires_at: expiresAt.toISOString(),
        ip_address: req.ip,
        user_agent: req.get('user-agent')
      });

    if (storeError) {
      console.error('Error storing magic link token:', storeError);
      return res.status(500).json({ error: 'Failed to create magic link' });
    }

    // Send email with magic link
    const magicLink = `${process.env.CLIENT_URL}/auth/magic-link?token=${token}`;
    
    await sendMagicLinkEmail(email, magicLink);

    // Log auth event
    await supabase.from('auth_audit_log').insert({
      user_id: user.id,
      event_type: 'magic_link_sent',
      status: 'success',
      ip_address: req.ip,
      user_agent: req.get('user-agent')
    });

    res.status(200).json({ 
      success: true, 
      message: 'Magic link sent to your email' 
    });
  } catch (error) {
    console.error('Magic link send error:', error);
    res.status(500).json({ error: 'Failed to send magic link' });
  }
});

/**
 * POST /api/auth/magic-link/verify
 * Verify magic link token and create session
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const tokenHash = hashToken(token);

    // Find token record
    const { data: tokenRecord } = await supabase
      .from('magic_link_tokens')
      .select('id, user_id, expires_at, used_at')
      .eq('token_hash', tokenHash)
      .single();

    if (!tokenRecord) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Check if token has expired
    if (new Date(tokenRecord.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Token has expired' });
    }

    // Check if token was already used
    if (tokenRecord.used_at) {
      return res.status(401).json({ error: 'Token has already been used' });
    }

    // Mark token as used
    await supabase
      .from('magic_link_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('id', tokenRecord.id);

    // Create session
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const { error: sessionError } = await supabase
      .from('sessions')
      .insert({
        user_id: tokenRecord.user_id,
        session_token: sessionToken,
        auth_method: 'magic-link',
        ip_address: req.ip,
        user_agent: req.get('user-agent'),
        expires_at: sessionExpires.toISOString()
      });

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return res.status(500).json({ error: 'Failed to create session' });
    }

    // Get user data
    const { data: user } = await supabase
      .from('profiles')
      .select('id, email, username, avatar_url')
      .eq('id', tokenRecord.user_id)
      .single();

    // Log auth event
    await supabase.from('auth_audit_log').insert({
      user_id: tokenRecord.user_id,
      event_type: 'magic_link_used',
      status: 'success',
      ip_address: req.ip,
      user_agent: req.get('user-agent')
    });

    res.status(200).json({
      success: true,
      sessionToken,
      userId: tokenRecord.user_id,
      user: user,
      expiresAt: sessionExpires
    });
  } catch (error) {
    console.error('Magic link verify error:', error);
    res.status(500).json({ error: 'Failed to verify magic link' });
  }
});

/**
 * GET /api/auth/magic-link/status/:tokenHash
 * Check status of magic link token
 */
router.get('/status/:tokenHash', async (req: Request, res: Response) => {
  try {
    const { tokenHash } = req.params;

    const { data: token } = await supabase
      .from('magic_link_tokens')
      .select('id, expires_at, used_at')
      .eq('token_hash', tokenHash)
      .single();

    if (!token) {
      return res.status(404).json({ error: 'Token not found' });
    }

    const isExpired = new Date(token.expires_at) < new Date();
    const isUsed = !!token.used_at;

    res.status(200).json({
      valid: !isExpired && !isUsed,
      isExpired,
      isUsed,
      expiresAt: token.expires_at
    });
  } catch (error) {
    console.error('Magic link status error:', error);
    res.status(500).json({ error: 'Failed to check status' });
  }
});

export default router;
