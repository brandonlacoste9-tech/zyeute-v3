import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { supabase } from '../lib/supabase';

const router = express.Router();

// Utility: Hash token for storage
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Utility: Generate secure token
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * POST /api/auth/magic-link/send
 * Send a magic link to user's email
 */
router.post('/send', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Generate magic link token
    const token = generateToken();
    const tokenHash = hashToken(token);
    const magicLinkUrl = `${process.env.CLIENT_URL}/auth/magic-link?token=${token}`;

    // Store token in database
    const { error: insertError } = await supabase
      .from('magic_link_tokens')
      .insert([
        {
          email,
          token,
          token_hash: tokenHash,
          ip_address: req.ip,
          user_agent: req.get('user-agent'),
        },
      ]);

    if (insertError) {
      console.error('Magic link insert error:', insertError);
      return res.status(500).json({ error: 'Failed to generate magic link' });
    }

    // TODO: Send email with magic link
    // For now, log to console (replace with actual email service)
    console.log(`\n📧 MAGIC LINK EMAIL (Development)\nTo: ${email}\nLink: ${magicLinkUrl}\n`);

    res.json({
      success: true,
      message: `Magic link sent to ${email}`,
      // In development, return the link for testing
      ...(process.env.NODE_ENV === 'development' && { magicLink: magicLinkUrl }),
    });
  } catch (error) {
    console.error('Magic link send error:', error);
    res.status(500).json({ error: 'Internal server error' });
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

    // Find magic link token
    const { data: magicLinkData, error: selectError } = await supabase
      .from('magic_link_tokens')
      .select('*')
      .eq('token_hash', tokenHash)
      .single();

    if (selectError || !magicLinkData) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Check if already used
    if (magicLinkData.used) {
      return res.status(401).json({ error: 'Token has already been used' });
    }

    // Check if expired
    if (new Date(magicLinkData.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Token has expired' });
    }

    const email = magicLinkData.email;

    // Create user session
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const { data: sessionData, error: sessionError } = await supabase
      .from('user_sessions')
      .insert([
        {
          user_id: email, // Temporary: use email as user_id
          session_token: sessionToken,
          auth_method: 'magic_link',
          ip_address: req.ip,
          user_agent: req.get('user-agent'),
        },
      ])
      .select();

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      return res.status(500).json({ error: 'Failed to create session' });
    }

    // Mark token as used
    await supabase
      .from('magic_link_tokens')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('id', magicLinkData.id);

    res.json({
      success: true,
      email,
      sessionToken,
      authMethod: 'magic_link',
    });
  } catch (error) {
    console.error('Magic link verify error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
