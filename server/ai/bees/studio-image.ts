import { generateImage } from '../media/image-engine';

export async function run(payload: any) {
    const prompt = payload.prompt || 'A cool beaver';
    const result = await generateImage({ prompt, modelHint: 'flux' });
    return result;
}
