export async function run(payload: any) {
    console.log('[Ti-Guy Chat] Processing:', payload);
    return {
        response: "Allô! C'est Ti-Guy. Qu'est-ce que je peux faire pour toi?",
        metadata: { model: 'deepseek' }
    };
}
