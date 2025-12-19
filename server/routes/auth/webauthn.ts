import express, { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  ParsedAuthenticatorAssertionResponse,
  ParsedAuthenticatorAttestationResponse
} from '@simplewebauthn/server';

const router = Router();
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const rpID = process.env.RP_ID || 'localhost';
const rpName = 'Zyeuté';
const origin = process.env.CLIENT_URL || 'http://localhost:5173';

/**
 * POST /api/auth/webauthn/register/options
 * Generate registration options for biometric setup
 */
router.post('/register/options', async (req: Request, res: Response) => {
  try {
    const { userId, userName, userDisplayName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({ error: 'userId and userName are required' });
    }

    const options = await generateRegistrationOptions({
      rpID,
      rpName,
      userID: userId,
      userName,
      userDisplayName: userDisplayName || userName,
      timeout: 60000,
      attestationType: 'direct',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        residentKey: 'preferred'
      },
      supportedAlgorithmIDs: [-7, -257]
    });

    // Store challenge in session (in production, use Redis/session store)
    res.status(200).json({ success: true, options });
  } catch (error) {
    console.error('WebAuthn register options error:', error);
    res.status(500).json({ error: 'Failed to generate options' });
  }
});

/**
 * POST /api/auth/webauthn/register/verify
 * Verify registration response and store credential
 */
router.post('/register/verify', async (req: Request, res: Response) => {
  try {
    const { userId, deviceName, credential, challenge } = req.body;

    if (!userId || !credential) {
      return res.status(400).json({ error: 'userId and credential are required' });
    }

    // Verify registration response
    const verified = await verifyRegistrationResponse({
      response: credential as ParsedAuthenticatorAttestationResponse,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID
    });

    if (!verified.verified) {
      return res.status(401).json({ error: 'Registration verification failed' });
    }

    // Store credential in database
    const { error: storeError } = await supabase
      .from('webauthn_credentials')
      .insert({
        user_id: userId,
        credential_id: Buffer.from(verified.registrationInfo!.credentialID),
        public_key: Buffer.from(verified.registrationInfo!.credentialPublicKey),
        device_name: deviceName || 'Default Device',
        transports: ['internal']
      });

    if (storeError) {
      console.error('Error storing credential:', storeError);
      return res.status(500).json({ error: 'Failed to store credential' });
    }

    // Log auth event
    await supabase.from('auth_audit_log').insert({
      user_id: userId,
      event_type: 'biometric_register',
      status: 'success',
      ip_address: req.ip,
      user_agent: req.get('user-agent')
    });

    res.status(200).json({
      success: true,
      message: 'Biometric device registered successfully'
    });
  } catch (error: any) {
    console.error('WebAuthn register verify error:', error);
    res.status(500).json({ error: 'Registration verification failed' });
  }
});

/**
 * POST /api/auth/webauthn/authenticate/options
 * Generate authentication options for biometric login
 */
router.post('/authenticate/options', async (req: Request, res: Response) => {
  try {
    const options = await generateAuthenticationOptions({
      rpID,
      timeout: 60000
    });

    res.status(200).json({ success: true, options });
  } catch (error) {
    console.error('WebAuthn auth options error:', error);
    res.status(500).json({ error: 'Failed to generate options' });
  }
});

/**
 * POST /api/auth/webauthn/authenticate/verify
 * Verify authentication response and create session
 */
router.post('/authenticate/verify', async (req: Request, res: Response) => {
  try {
    const { credential, challenge } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'credential is required' });
    }

    const credentialID = credential.id;

    // Find credential in database
    const { data: storedCredential } = await supabase
      .from('webauthn_credentials')
      .select('id, user_id, credential_id, public_key, sign_count')
      .eq('credential_id', Buffer.from(credentialID, 'base64url'))
      .single();

    if (!storedCredential) {
      return res.status(401).json({ error: 'Credential not found' });
    }

    // Verify authentication response
    const verified = await verifyAuthenticationResponse({
      response: credential as ParsedAuthenticatorAssertionResponse,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: storedCredential.credential_id as unknown as Uint8Array,
        credentialPublicKey: storedCredential.public_key as unknown as Uint8Array,
        signCount: storedCredential.sign_count,
        credentialDeviceType: 'platform'
      }
    });

    if (!verified.verified) {
      // Log failed auth event
      await supabase.from('auth_audit_log').insert({
        user_id: storedCredential.user_id,
        event_type: 'biometric_login',
        status: 'failed',
        ip_address: req.ip,
        user_agent: req.get('user-agent'),
        error_message: 'Authentication verification failed'
      });
      return res.status(401).json({ error: 'Authentication verification failed' });
    }

    // Update sign count
    await supabase
      .from('webauthn_credentials')
      .update({
        sign_count: verified.authenticationInfo!.signCount,
        last_used_at: new Date().toISOString()
      })
      .eq('id', storedCredential.id);

    // Create session
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const { error: sessionError } = await supabase
      .from('sessions')
      .insert({
        user_id: storedCredential.user_id,
        session_token: sessionToken,
        auth_method: 'biometric',
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
      .eq('id', storedCredential.user_id)
      .single();

    // Log successful auth event
    await supabase.from('auth_audit_log').insert({
      user_id: storedCredential.user_id,
      event_type: 'biometric_login',
      status: 'success',
      ip_address: req.ip,
      user_agent: req.get('user-agent')
    });

    res.status(200).json({
      success: true,
      sessionToken,
      userId: storedCredential.user_id,
      user: user,
      expiresAt: sessionExpires
    });
  } catch (error: any) {
    console.error('WebAuthn auth verify error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

/**
 * GET /api/auth/webauthn/authenticators/:userId
 * List registered authenticators for user
 */
router.get('/authenticators/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const { data: credentials, error } = await supabase
      .from('webauthn_credentials')
      .select('id, device_name, created_at, last_used_at, is_active')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch authenticators' });
    }

    res.status(200).json({
      success: true,
      authenticators: credentials || []
    });
  } catch (error) {
    console.error('Get authenticators error:', error);
    res.status(500).json({ error: 'Failed to fetch authenticators' });
  }
});

export default router;
