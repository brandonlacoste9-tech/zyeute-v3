export async function run(payload: any) {
    console.log('[Moderation] Checking content:', payload);
    return {
        approved: true,
        reason: null,
        metadata: { model: 'deepseek' }
    };
}
