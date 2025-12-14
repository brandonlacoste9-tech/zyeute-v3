import { createClient } from "@supabase/supabase-js";

if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("⚠️ Supabase environment variables missing. JWT Auth will fail.");
}

// Create a single supabase admin client for interacting with the Auth API
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Verifies a Supabase JWT and returns the user ID if valid.
 * This is stateless and serverless-friendly.
 */
export async function verifyAuthToken(token: string): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      if (error) console.error("JWT Verification failed:", error.message);
      return null;
    }

    return data.user.id;
  } catch (err) {
    console.error("Unexpected auth error:", err);
    return null;
  }
}
