/**
 * Ti-Guy Agent Service
 * AI-powered assistant that generates Quebec-style content
 * 
 * NOTE: OpenAI dependency has been removed. 
 * This service now operates in DEMO MODE using pre-canned responses.
 * For production AI, please use the Server-Side DeepSeek integration (v3-swarm).
 */

import { logger } from '@/lib/logger';

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
  tiGuyAgentLogger.info('Ti-Guy Agent called (Demo Mode)', input);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  return generateDemoResponse(input);
};

/**
 * Generate a demo response when OpenAI is not available
 */
function generateDemoResponse(input: TiGuyInput): TiGuyResponse {
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
