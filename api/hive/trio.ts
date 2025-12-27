// 🐝 THE COPILOT TRIO HIVE ARCHITECTURE
// Clean, mythic, swarm-native — built from scratch
// Three Bees. Three instincts. One Hive.

import { fal } from "@fal-ai/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Optional: Import your tracer if it exists
// import { trace } from "./tracer";
const trace = (name: string, fn: () => Promise<any>) => fn();

// --- 1. BEE CONFIGURATION ---
const BEES = {
  // DeepSeek config for server-side
  BRAIN_BEE: {
    model: "deepseek-chat",
    baseUrl: "https://api.deepseek.com",
    // Note: In client context this might be empty, 
    // but this file is server-side (api/), so it likely has access to process.env
    apiKey: process.env.DEEPSEEK_API_KEY || "",
  },

  GENERALIST_BEE: {
    model: process.env.GEMINI_API_KEY
      ? "gemini-2.0-flash-exp"
      : "mistral-small",
    apiKey: process.env.GEMINI_API_KEY || process.env.MISTRAL_API_KEY || "",
  },

  CREATOR_BEE: {
    imageModel: "fal-ai/flux-pro/v1.1-ultra",
    videoModel: "fal-ai/luma-dream-machine",
  },
};

// --- 2. BEE PERSONAS ---
const ROLES = {
  ORCHESTRATOR_BEE: `
You are ORCHESTRATOR_BEE.
ROLE: Analyze the user request and choose the correct Bee.
Respond ONLY in JSON:
{ "target": "TI_GUY_BEE" | "VISUAL_DIRECTOR_BEE", "instruction": "string" }
`,

  TI_GUY_BEE: `
You are TI_GUY_BEE.
LANGUAGE: Québec joual.
VIBE: Friendly, sarcastic, local.
TASK: Talk to the user based on the instruction.
`,

  VISUAL_DIRECTOR_BEE: `
You are VISUAL_DIRECTOR_BEE.
TASK: Rewrite prompts for a luxury "Heritage" aesthetic.
STYLE: Dark teak, brushed gold, leather, cinematic lighting.
Output ONLY the rewritten prompt.
`,
};

// --- 3. HIVE ENGINE ---
export class HiveEngine {
  private generalist: GoogleGenerativeAI | null = null;

  constructor() {
    if (BEES.GENERALIST_BEE.apiKey) {
      this.generalist = new GoogleGenerativeAI(BEES.GENERALIST_BEE.apiKey);
    }
  }

  async process(userInput: string) {
    return trace("hive.pipeline", async () => {
      const plan = await this.askBrain(ROLES.ORCHESTRATOR_BEE, userInput, 0.1);
      const directive = this.parse(plan);

      switch (directive.target) {
        case "VISUAL_DIRECTOR_BEE": {
          const rewritten = await this.askBrain(
            ROLES.VISUAL_DIRECTOR_BEE,
            directive.instruction,
            0.7,
          );
          return this.createVisual(rewritten);
        }

        case "TI_GUY_BEE":
        default: {
          if (this.generalist) {
            return this.askGeneralist(
              ROLES.TI_GUY_BEE,
              directive.instruction || userInput,
            );
          }
          return this.askBrain(
            ROLES.TI_GUY_BEE,
            directive.instruction || userInput,
            1.2,
          );
        }
      }
    });
  }

  // --- BRAIN_BEE (DeepSeek) ---
  // Replaced OpenAI SDK with native fetch to remove dependency
  private async askBrain(system: string, user: string, temp: number) {
    if (!BEES.BRAIN_BEE.apiKey) {
      console.warn("⚠️ DeepSeek API Key missing in HiveEngine");
      return "Service unavailable (Key missing)";
    }

    try {
      const response = await fetch(`${BEES.BRAIN_BEE.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEES.BRAIN_BEE.apiKey}`
        },
        body: JSON.stringify({
          model: BEES.BRAIN_BEE.model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          temperature: temp,
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "";
    } catch (error) {
      console.error("HiveEngine DeepSeek error:", error);
      return "Error contacting Hive Mind.";
    }
  }

  // --- GENERALIST_BEE (Gemini Flash / Mistral) ---
  private async askGeneralist(system: string, user: string) {
    if (!this.generalist) {
      throw new Error("Generalist Bee not configured");
    }
    const model = this.generalist.getGenerativeModel({
      model: BEES.GENERALIST_BEE.model,
      systemInstruction: system,
    } as any);
    const result = await model.generateContent(user);
    return result.response.text();
  }

  // --- CREATOR_BEE (FAL) ---
  private async createVisual(prompt: string) {
    const result: any = await fal.subscribe(BEES.CREATOR_BEE.imageModel, {
      input: { prompt, image_size: "portrait_4_3" },
      logs: true,
    });
    return { type: "image", url: result.images[0].url, prompt };
  }

  private parse(raw: string) {
    try {
      return JSON.parse(raw.replace(/```json/g, "").replace(/```/g, "").trim());
    } catch {
      return { target: "TI_GUY_BEE", instruction: raw };
    }
  }
}

export const hive = new HiveEngine();
