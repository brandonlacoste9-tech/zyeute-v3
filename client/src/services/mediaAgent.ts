import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

const mediaLogger = logger.withContext('MediaAgent');

/**
 * 🎨 NectarStream v0.2 - Modular Media Agent Stack
 * Drop-in cinematic media generation for Zyeuté Studio.
 */

export interface GenerationOptions {
  prompt: string;
  style?: 'cinematic' | 'anime' | 'photorealistic' | 'cyberpunk' | 'oil-painting';
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:5';
  negativePrompt?: string;
  seed?: number;
}

export interface GenerationResult {
  url: string;
  id: string;
  meta: any;
}

// ------------------------------------------------------------------
// 1. FAL CLIENT ADAPTER (Modular & Type-Safe)
// ------------------------------------------------------------------

// Default to flux-pro for highest quality cinematic output
const DEFAULT_MODEL = 'fal-ai/flux-pro/v1.1';

async function callFalModel(endpoint: string, input: any): Promise<any> {
    // In a real deployment, this would call a Supabase Edge Function to protect the key.
    // For this drop-in version, we assume a proxied call or careful env usage.
    
    // Check if we have a direct key (only for dev/testing)
    const apiKey = import.meta.env.VITE_FAL_KEY;
    
    if (apiKey) {
         try {
            const response = await fetch(`https://fal.run/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Key ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input),
            });

            if (!response.ok) {
                 const errText = await response.text();
                 throw new Error(`FAL API Error: ${response.status} - ${errText}`);
            }
            return await response.json();
        } catch (error) {
            mediaLogger.error('Direct FAL Call Failed', error);
            throw error;
        }
    } else {
        // Fallback to Supabase Function Proxy (Recommended for Prod)
        const { data, error } = await supabase.functions.invoke('fal-proxy', {
            body: { endpoint, input }
        });
        
        if (error) throw new Error(`FAL Proxy Error: ${error.message}`);
        return data;
    }
}

// ------------------------------------------------------------------
// 2. IMAGE SYNTHESIS ENGINE
// ------------------------------------------------------------------

export const imageSynth = {
  /**
   * Generates a high-quality image based on the prompt and style.
   */
  async generate({ prompt, style = 'cinematic', aspectRatio = '1:1', negativePrompt, seed }: GenerationOptions): Promise<GenerationResult> {
    mediaLogger.info(`Generating ${style} image...`, { prompt });
    const startTime = Date.now();

    // Enhance prompt based on style
    const styleModifiers = {
        'cinematic': 'cinematic lighting, 8k, highly detailed, photorealistic, dramatic atmosphere, shot on 35mm',
        'anime': 'anime style, studio ghibli, makoto shinkai, vibrant colors, detailed background',
        'photorealistic': 'raw photo, f/1.8, realistic textures, natural lighting, dslr',
        'cyberpunk': 'cyberpunk city, neon lights, futuristic, high tech, rain, reflections',
        'oil-painting': 'oil painting texture, classical art style, visible brushstrokes'
    };

    const enhancedPrompt = `${prompt}, ${styleModifiers[style]}`;
    
    // Map aspect ratio to explicit sizes (Flux preference)
    const sizeMap = {
        '1:1': { width: 1024, height: 1024 },
        '16:9': { width: 1280, height: 720 },
        '9:16': { width: 720, height: 1280 },
        '4:5': { width: 816, height: 1024 } // Approx
    };
    
    const size = sizeMap[aspectRatio] || sizeMap['1:1'];

    try {
        const result = await callFalModel(DEFAULT_MODEL, {
            prompt: enhancedPrompt,
            image_size: { width: size.width, height: size.height }, // Flux specific format
            num_inference_steps: 28,
            guidance_scale: 3.5,
            seed: seed || Math.floor(Math.random() * 1000000),
            enable_safety_checker: true
        });

        // Flux returns { images: [{ url: "..." }] }
        const imageUrl = result.images?.[0]?.url;

        if (!imageUrl) throw new Error('No image URL returned from model');
        
        // ------------------------------------------------------------------
        // 3. STORAGE ADAPTER (Persist to Supabase)
        // ------------------------------------------------------------------
        // We fetch the image and re-upload it to our buckets to own the data.
        const imageBlob = await fetch(imageUrl).then(r => r.blob());
        const fileName = `generated/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('media') // Ensure 'media' bucket exists
            .upload(fileName, imageBlob, {
                contentType: 'image/jpeg',
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) throw new Error(`Storage Upload Failed: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(fileName);


        const generationDuration = Date.now() - startTime;
        
        // Phase 8: Telemetry
        import('./swarmTelemetry').then(({ logSwarmEvent }) => {
            logSwarmEvent({
                agent: 'mediaAgent',
                action: 'generateCinematicMedia',
                metadata: {
                    prompt, 
                    style, 
                    model: DEFAULT_MODEL, 
                    originalUrl: imageUrl,
                    finalUrl: publicUrl
                },
                latencyMs: generationDuration
            });
        });

        return {
            url: publicUrl,
            id: uploadData?.path || fileName,
            meta: { prompt, style, model: DEFAULT_MODEL, originalUrl: imageUrl }
        };

    } catch (error) {
        mediaLogger.error('Image Generation Failed', error);
        throw error;
    }
  }
};

// ------------------------------------------------------------------
// 4. VIDEO SYNTHESIS ENGINE (Placeholder / Future Expansion)
// ------------------------------------------------------------------

export const videoSynth = {
    async generateFromImage(imageUrl: string, prompt: string): Promise<GenerationResult> {
         // Future: Integrate Kling or Runway via FAL
         throw new Error("Video synthesis not yet implemented in v0.2");
    }
};

// ------------------------------------------------------------------
// 5. MAIN MEDIA AGENT (The Orchestrator)
// ------------------------------------------------------------------

export const mediaAgent = {
  generateCinematicMedia: imageSynth.generate,
  generateVideo: videoSynth.generateFromImage,
  
  // Future: Add batch operations or specialized workflows
};

export default mediaAgent;
