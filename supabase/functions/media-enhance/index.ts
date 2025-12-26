
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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );
    
    // Admin client for colony_tasks (requires higher usage)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { postId, filter } = await req.json();

    // 1. Verify Ownership of Post via RLS Client
    const { data: post, error: fetchError } = await supabaseClient
      .from("publications")
      .select("id, media_url, original_url, visual_filter, user_id")
      .eq("id", postId)
      .single();

    if (fetchError || !post) {
      return new Response(JSON.stringify({ error: "Post not found or unauthorized" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const videoUrl = post.media_url || post.original_url;
    if (!videoUrl) {
         return new Response(JSON.stringify({ error: "Post has no video URL" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    // 2. Queue Task (Admin Client needed to write to colony_tasks if RLS is strict, or use user client if policy allows)
    const { data: task, error: insertError } = await supabaseAdmin
      .from("colony_tasks")
      .insert({
        command: "upscale_video",
        origin: "Deep Enhance Edge Function",
        status: "pending",
        priority: "high",
        metadata: {
          postId: post.id,
          videoUrl: videoUrl,
          filter: filter || 'none'
        },
        user_id: post.user_id 
      })
      .select()
      .single();

    if (insertError) {
        throw new Error("Failed to queue enhancement task: " + insertError.message);
    }

    // 3. Update Post Status
    await supabaseAdmin
        .from("publications")
        .update({ 
            processing_status: 'pending', 
            enhance_started_at: new Date().toISOString(),
            visual_filter: filter || 'none'
        })
        .eq("id", postId);

    return new Response(JSON.stringify({ 
        status: 'success',
        message: 'Enhancement job started',
        data: { taskId: task.id }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
