/**
 * AI Image Generation Service (Ti-Guy Artiste)
 * Uses OpenAI DALL-E 3 with robust fallback and demo modes
 */

import { supabase } from '../lib/supabase';
import { logger } from '@/lib/logger';

const imageServiceLogger = logger.withContext('ImageService');
import { toast } from '../components/Toast';

// OpenAI API Key
const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;

export interface ImageGenerationResult {
  url: string;
  prompt: string;
  revised_prompt?: string;
  style?: string;
}

/**
 * Generate an image using OpenAI DALL-E 3
 */
export async function generateImage(
  prompt: string,
  style: string = 'cinematic'
): Promise<ImageGenerationResult | null> {
  // 1. Validation
  if (!prompt.trim()) {
    toast.error('Décris ton image d\'abord! 🎨');
    return null;
  }

  // 2. Demo Mode (if no API key)
  if (!openaiKey) {
    imageServiceLogger.warn('⚠️ No OpenAI API Key found. Using Demo Mode.');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
    
    toast.success('🎨 Mode Démo: Image générée!');
    return {
      url: `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1024/1024`,
      prompt,
      style,
      revised_prompt: `(Démo) ${prompt} - Style ${style} québécois`
    };
  }

  try {
    // 3. Enhance Prompt for Quebec Context
    const enhancedPrompt = `${prompt}, style ${style}, high quality, detailed. 
    CONTEXTE QUÉBÉCOIS: Include subtle Quebec elements if fitting (snow, nature, architecture).`;

// 4. Call Server API (FAL via Backend)
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    if (!token) {
        // Fallback to demo for guests
        imageServiceLogger.info("Guest user, using demo mode");
         return {
          url: `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1024/1024`,
          prompt,
          style,
          revised_prompt: `(Guest) ${prompt}`
        };
    }

    const response = await fetch('/api/ai/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        aspectRatio: "1:1"
      })
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error("Unauthorized");
      throw new Error(`Server API error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.imageUrl;

    if (!imageUrl) {
      throw new Error('No image URL returned from server');
    }

    toast.success('🎨 Image générée avec succès!');
    return {
      url: imageUrl,
      prompt,
      revised_prompt: enhancedPrompt,
      style
    };

  } catch (error: any) {
    imageServiceLogger.error('Image generation error:', error);
    toast.error('Erreur de création. Réessaie!');
    
    // Fallback to demo image on error
    return {
      url: `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1024/1024`,
      prompt,
      style,
      revised_prompt: `(Fallback) ${prompt}`
    };
  }
}

/**
 * Remix an existing image
 */
export async function remixImage(imageUrl: string, mode: 'quebec' | 'meme' | 'vintage'): Promise<string | null> {
  toast.info('Remix en cours... 🎨');
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // Return original for demo, in prod would be processed URL
  return imageUrl;
}
