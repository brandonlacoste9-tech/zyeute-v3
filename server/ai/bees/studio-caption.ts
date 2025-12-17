export async function run(payload: any) {
    console.log('[Studio Caption] Generating caption:', payload);
    return {
        caption: "Une superbe vue du Québec! #Zyeute #Quebec",
        metadata: { model: 'deepseek' }
    };
}
