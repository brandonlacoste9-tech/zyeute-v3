
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { action, prompt, modelHint, imageSize, duration, includeImage, history, message } = await req.json();

    // Verify User Credit Balance (Simplified for now - can enhance with DB check)
    // Note: In real scenarios, check user credits table here.

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      req.headers.get("Authorization")?.replace("Bearer ", "") ?? ""
    );

    if (authError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    let taskType = "";
    let payload = {};

    switch (action) {
      case "generate-image":
        taskType = "generate_image";
        payload = { prompt, modelHint, imageSize };
        break;
      case "generate-video":
        taskType = "generate_video";
        payload = { prompt, duration, modelHint };
        break;
      case "compose-post":
        taskType = "compose_post";
        payload = { prompt, includeImage, modelHint };
        break;
      default:
         return new Response(JSON.stringify({ error: "Invalid action" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    // Insert Task into colony_tasks for Swarm to pickup
    const { data: task, error: insertError } = await supabase
      .from("colony_tasks")
      .insert({
        command: taskType,
        origin: "Studio AI Edge Function",
        status: "pending",
        priority: "normal",
        metadata: payload,
        user_id: user.id, // Linked to user!
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error("Task Insert Error", insertError);
      throw new Error("Failed to queue AI task");
    }

    return new Response(JSON.stringify({ success: true, taskId: task.id, message: "Job queued" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
