export async function run(payload: any) {
    console.log('[Post Composer] Composing post:', payload);
    return {
        content: "Check out this amazing video!",
        mediaUrl: "https://placeholder.com/generated_content.png",
        metadata: { model: 'deepseek' }
    };
}
