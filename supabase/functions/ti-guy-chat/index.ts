
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { processQuery } from "./utils/patterns.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, action } = await req.json();

    if (action === 'joke') {
       // Import joke logic or replicate here (simplified for this example, patterns has logic)
       // Actually patterns.ts has processQuery which handles 'joke' keyword, so we can use that or specific util
       const response = processQuery("joke"); 
       return new Response(JSON.stringify({ 
           response: response.message, 
           type: 'joke', 
           timestamp: new Date().toISOString() 
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    if (!message) {
      return new Response(JSON.stringify({ error: "Envoie-moi un message, câlisse!" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = processQuery(message);

    return new Response(JSON.stringify({
      response: response.message,
      type: response.type,
      timestamp: new Date().toISOString(),
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
