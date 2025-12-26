import { logger } from '@/lib/logger';
import { supabase } from '../lib/supabase';

const moderationServiceLogger = logger.withContext('ModerationService');

export type ModerationSeverity = 'safe' | 'low' | 'medium' | 'high' | 'critical';
export type ModerationAction = 'allow' | 'flag' | 'hide' | 'remove' | 'ban';
export type ModerationCategory =
  | 'bullying'
  | 'hate_speech'
  | 'harassment'
  | 'violence'
  | 'spam'
  | 'nsfw'
  | 'illegal'
  | 'self_harm';

export interface ModerationResult {
  is_safe: boolean;
  severity: ModerationSeverity;
  categories: ModerationCategory[];
  confidence: number;
  reason: string;
  action: ModerationAction;
  context_note?: string;
}

/**
 * Analyze text content for violations
 */
export async function analyzeText(text: string): Promise<ModerationResult> {
  try {
    if (!text || text.trim().length === 0) {
      return {
        is_safe: true,
        severity: 'safe',
        categories: [],
        confidence: 100,
        reason: 'Contenu vide',
        action: 'allow',
      };
    }

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    if (!token) {
      moderationServiceLogger.warn('No auth token for moderation. Skipping.');
       return { is_safe: true, severity: 'safe', categories: [], confidence: 0, reason: 'Non authentifié', action: 'allow' };
    }

    const response = await fetch('/api/moderation/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    });
    
    if (!response.ok) {
      throw new Error(`Moderation API failed: ${response.statusText}`);
    }

    const moderationResult: ModerationResult = await response.json();
    return moderationResult;

  } catch (error) {
    moderationServiceLogger.error('Error in analyzeText:', error);
    // Fail open - allow content if moderation fails
    return {
      is_safe: true,
      severity: 'safe',
      categories: [],
      confidence: 0,
      reason: 'Erreur du système de modération',
      action: 'allow',
      context_note: 'Service de modération temporairement indisponible',
    };
  }
}

/**
 * Analyze image content (Stub)
 */
export async function analyzeImage(imageUrl: string): Promise<ModerationResult> {
  try {
     // TODO: Implement image moderation using FAL or another service compatible with new architecture.
     // OpenAI Vision has been removed.
     moderationServiceLogger.debug('Image moderation skipped (OpenAI removed)', imageUrl);
     
     return { 
        is_safe: true, 
        severity: 'safe', 
        categories: [], 
        confidence: 100, 
        reason: 'Modération d\'image désactivée temporairement', 
        action: 'allow' 
     };

  } catch (error) {
    moderationServiceLogger.error('Error in analyzeImage:', error);
    return {
      is_safe: true,
      severity: 'safe',
      categories: [],
      confidence: 0,
      reason: 'Erreur d\'analyse d\'image',
      action: 'allow',
    };
  }
}

/**
 * Analyze video content (analyze key frames)
 */
export async function analyzeVideo(videoUrl: string): Promise<ModerationResult> {
  try {
    // For now, return safe (video analysis requires frame extraction)
    // TODO: Implement frame extraction and analysis
    moderationServiceLogger.debug('Video analysis not yet implemented:', videoUrl);
    
    return {
      is_safe: true,
      severity: 'safe',
      categories: [],
      confidence: 50,
      reason: 'Analyse vidéo en développement',
      action: 'allow',
      context_note: 'L\'analyse complète des vidéos arrive bientôt',
    };
  } catch (error) {
    moderationServiceLogger.error('Error in analyzeVideo:', error);
    return {
      is_safe: true,
      severity: 'safe',
      categories: [],
      confidence: 0,
      reason: 'Erreur d\'analyse vidéo',
      action: 'allow',
    };
  }
}

/**
 * Universal content moderation function
 */
export async function moderateContent(
  content: { text?: string; imageUrl?: string; videoUrl?: string },
  contentType: 'post' | 'comment' | 'bio' | 'message',
  userId: string,
  contentId?: string
): Promise<ModerationResult> {
  try {
    let result: ModerationResult;

    // Analyze based on content type
    if (content.text) {
      result = await analyzeText(content.text);
    } else if (content.imageUrl) {
      result = await analyzeImage(content.imageUrl);
    } else if (content.videoUrl) {
      result = await analyzeVideo(content.videoUrl);
    } else {
      return {
        is_safe: true,
        severity: 'safe',
        categories: [],
        confidence: 100,
        reason: 'Aucun contenu à analyser',
        action: 'allow',
      };
    }

    // Log moderation result
    if (contentId) {
      await logModeration(contentType, contentId, userId, result);
    }

    // Take automatic action based on severity
    if (result.severity === 'high' || result.severity === 'critical') {
      await handleViolation(userId, result);
    }

    return result;
  } catch (error) {
    moderationServiceLogger.error('Error in moderateContent:', error);
    return {
      is_safe: true,
      severity: 'safe',
      categories: [],
      confidence: 0,
      reason: 'Erreur de modération',
      action: 'allow',
    };
  }
}

/**
 * Log moderation result to database
 */
async function logModeration(
  contentType: string,
  contentId: string,
  userId: string,
  result: ModerationResult
): Promise<void> {
  try {
    await supabase.from('moderation_logs').insert({
      content_type: contentType,
      content_id: contentId,
      user_id: userId,
      ai_severity: result.severity,
      ai_categories: result.categories,
      ai_confidence: result.confidence,
      ai_reason: result.reason,
      ai_action: result.action,
      status: result.action === 'allow' ? 'approved' : 'pending',
    });
  } catch (error) {
    moderationServiceLogger.error('Error logging moderation:', error);
  }
}

/**
 * Handle content violation (add strike, ban if needed)
 */
async function handleViolation(
  userId: string,
  result: ModerationResult
): Promise<void> {
  try {
    // Get current user strikes
    const { data: strikeData } = await supabase
      .from('user_strikes')
      .select('*')
      .eq('user_id', userId)
      .single();

    const currentStrikes = strikeData?.strike_count || 0;
    const newStrikeCount = currentStrikes + 1;

    const newStrike = {
      date: new Date().toISOString(),
      reason: result.reason,
      severity: result.severity,
      categories: result.categories,
    };

    // Determine ban duration
    let banUntil = null;
    let isPermanentBan = false;

    if (newStrikeCount === 2) {
      // 24 hour ban
      banUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    } else if (newStrikeCount === 3) {
      // 7 day ban
      banUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (newStrikeCount === 4) {
      // 30 day ban
      banUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    } else if (newStrikeCount >= 5) {
      // Permanent ban
      isPermanentBan = true;
    }

    // Update or create strike record
    if (strikeData) {
      const strikes = [...(strikeData.strikes || []), newStrike];
      
      await supabase
        .from('user_strikes')
        .update({
          strike_count: newStrikeCount,
          strikes,
          ban_until: banUntil,
          is_permanent_ban: isPermanentBan,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    } else {
      await supabase.from('user_strikes').insert({
        user_id: userId,
        strike_count: newStrikeCount,
        strikes: [newStrike],
        ban_until: banUntil,
        is_permanent_ban: isPermanentBan,
      });
    }

    // Create notification for user
    let notificationMessage = `⚠️ Avertissement ${newStrikeCount}/5: ${result.reason}`;
    
    if (newStrikeCount === 2) {
      notificationMessage += ' | Suspension 24h';
    } else if (newStrikeCount === 3) {
      notificationMessage += ' | Suspension 7 jours';
    } else if (newStrikeCount === 4) {
      notificationMessage += ' | Suspension 30 jours';
    } else if (newStrikeCount >= 5) {
      notificationMessage += ' | Bannissement permanent';
    }

    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'system',
      message: notificationMessage,
    });
  } catch (error) {
    moderationServiceLogger.error('Error handling violation:', error);
  }
}

/**
 * Check if user is currently banned
 */
export async function isUserBanned(userId: string): Promise<{
  isBanned: boolean;
  reason?: string;
  until?: string;
}> {
  try {
    const { data } = await supabase
      .from('user_strikes')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!data) {
      return { isBanned: false };
    }

    if (data.is_permanent_ban) {
      return {
        isBanned: true,
        reason: 'Bannissement permanent pour violations répétées',
      };
    }

    if (data.ban_until) {
      const banUntil = new Date(data.ban_until);
      if (banUntil > new Date()) {
        return {
          isBanned: true,
          reason: 'Suspension temporaire',
          until: data.ban_until,
        };
      }
    }

    return { isBanned: false };
  } catch (error) {
    moderationServiceLogger.error('Error checking ban status:', error);
    return { isBanned: false };
  }
}

export default {
  analyzeText,
  analyzeImage,
  analyzeVideo,
  moderateContent,
  isUserBanned,
};
