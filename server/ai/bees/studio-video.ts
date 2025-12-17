import { generateVideo } from '../media/video-engine';

export async function run(payload: any) {
    const prompt = payload.prompt || 'A cinematic drone shot of Montreal';
    const result = await generateVideo({ prompt, modelHint: 'hunyuan_video' });
    return result;
}
