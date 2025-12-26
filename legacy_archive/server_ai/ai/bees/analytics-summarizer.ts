/**
 * Analytics Summarizer Bee
 * Summarizes platform metrics using DeepSeek
 */

// import OpenAI from 'openai';

// OpenAI SDK removed in favor of native fetch to avoid "Missing credentials" errors
// const deepseek = new OpenAI({ ... });

// Type definitions for DeepSeek API
interface DeepSeekResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

export async function run(payload: any) {
    const metrics = payload.metrics || payload;
    const period = payload.period || 'today';

    console.log('[Analytics Summarizer] Summarizing metrics for:', period);

    if (!process.env.DEEPSEEK_API_KEY) {
        return {
            summary: `Analytics summary for ${period}: Service unavailable (Key missing)`,
            metadata: { model: 'none', bee: 'analytics-summarizer' }
        };
    }

    try {
        const response = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    {
                        role: 'system',
                        content: `You are an analytics assistant for Zyeuté, a Quebec social media app. 
                        Summarize the provided metrics in a clear, actionable way. 
                        Highlight trends and notable changes. Keep it concise.`
                    },
                    {
                        role: 'user',
                        content: `Summarize these metrics for ${period}:\n${JSON.stringify(metrics, null, 2)}`
                    }
                ],
                max_tokens: 256,
                temperature: 0.3,
            })
        });

        if (!response.ok) {
            throw new Error(`DeepSeek API error: ${response.statusText}`);
        }

        const data = await response.json() as DeepSeekResponse;
        const summary = data.choices[0]?.message?.content || 'No summary available';

        return {
            summary,
            metadata: { model: 'deepseek', bee: 'analytics-summarizer' }
        };

    } catch (error: any) {
        console.error('[Analytics Summarizer] Error:', error.message);
        return {
            summary: `Analytics summary unavailable: ${error.message}`,
            metadata: { model: 'deepseek', bee: 'analytics-summarizer', error: true }
        };
    }
}
