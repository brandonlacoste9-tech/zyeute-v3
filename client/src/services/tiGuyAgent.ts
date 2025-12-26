/**
 * Ti-Guy Agent Service
 * AI-powered assistant that generates Quebec-style content
 * 
 * NOTE: OpenAI dependency has been removed. 
 * This service now operates in DEMO MODE using pre-canned responses.
 * For production AI, please use the Server-Side DeepSeek integration (v3-swarm).
 */

import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';

const tiGuyAgentLogger = logger.withContext('TiGuyAgent');

export type TiGuyInput = {
  text: string;
  intent: 'joke' | 'rant' | 'event' | 'ad' | 'poem';
};

export type TiGuyResponse = {
  caption: string;
  emojis: string[];
  tags: string[];
  flagged: boolean;
  reply: string;
};

/**
 * Ti-Guy Agent - Generate Quebec-style content using AI (Demo Mode)
 * @param input - User text and intent for content generation
 * @returns Response with caption, emojis, tags, moderation flag, and Ti-Guy's reply
 */
export const TiGuyAgent = async (input: TiGuyInput): Promise<TiGuyResponse | null> => {
  tiGuyAgentLogger.info('Ti-Guy Agent called (Server Mode)', input);
  
  try {
    // Use Supabase Edge Function 'ti-guy-chat' for generation
    const { data, error } = await supabase.functions.invoke('ti-guy-chat', {
        body: {
            mode: 'generate',
            ...input
        }
    });

    if (error || !data) {
        throw new Error('Edge Function generation failed');
    }

    // Map Edge Function response to TiGuyResponse expected format if needed
    // Assuming Edge Function returns matching structure or we map it here
    return {
        caption: data.caption || input.text,
        emojis: data.emojis || ['🔥'],
        tags: data.tags || ['Quebec'],
        flagged: data.flagged || false,
        reply: data.reply || "C'est tiguidou!"
    };

  } catch (error) {
    tiGuyAgentLogger.error('Ti-Guy Agent error (falling back to demo):', error);
    // Fallback to demo response if server fails
    return generateDemoResponse(input);
  }
};

/**
 * Generate a demo response when Server/OpenAI is not available
 */
function generateDemoResponse(input: TiGuyInput): TiGuyResponse {
  // ... Keep existing demo fallback structure ...
  const responses: Record<TiGuyInput['intent'], TiGuyResponse> = {
    joke: {
      caption: "Haha! C'est ben drôle ça, mon loup! 😂🔥",
      emojis: ['😂', '🔥', '🦫'],
      tags: ['Humour', 'Quebec', 'Funny'],
      flagged: false,
      reply: "C'est tiguidou! Continue comme ça, mon ami! 🇨🇦"
    },
    rant: {
      caption: "Tabarnak! Je comprends ton point, c'est vrai en esti! 😤🔥",
      emojis: ['😤', '💢', '🔥'],
      tags: ['Rant', 'Real', 'Quebec'],
      flagged: false,
      reply: "C'est ben correct de se défouler! Je suis avec toi! ⚜️"
    },
    event: {
      caption: "Ça va être malade! Tout le monde au rendez-vous! 🎉⚜️",
      emojis: ['🎉', '⚜️', '🦫', '🇨🇦'],
      tags: ['Event', 'MTL', 'Quebec'],
      flagged: false,
      reply: "Nice event! J'espère que ça va être hot en esti! 🔥"
    },
    ad: {
      caption: "Check ça! C'est sick comme offre! 💰🔥",
      emojis: ['💰', '🔥', '⚜️'],
      tags: ['Deal', 'Quebec', 'Local'],
      flagged: false,
      reply: "Belle promo! Supporte local, c'est important! 🇨🇦"
    },
    poem: {
      caption: "Des mots qui touchent le cœur québécois... 📝💙",
      emojis: ['📝', '💙', '⚜️', '🍁'],
      tags: ['Poesie', 'Quebec', 'Culture'],
      flagged: false,
      reply: "Wow! T'as du talent, mon ami! Continue d'écrire! ✨"
    }
  };

  return responses[input.intent] || {
    caption: `${input.text} 🔥⚜️`,
    emojis: ['🔥', '⚜️', '🦫'],
    tags: ['Quebec', 'Zyeute'],
    flagged: false,
    reply: "C'est ben correct ça! Continue comme ça! 🇨🇦"
  };
}
