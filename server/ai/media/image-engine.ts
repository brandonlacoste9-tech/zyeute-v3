export async function generateImage(params: { prompt: string; modelHint?: string }) {
    console.log('[Media Engine] Generating image:', params);
    return {
        url: 'https://placeholder.com/image.png',
        cost: 0.05,
        model: params.modelHint || 'flux'
    };
}
