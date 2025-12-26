
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";
// Note: Stripe SDK for Deno is not standard. We usually use fetch or a compat library.
// For Simplicity in Edge Functions, we often forward the event or use a simplified handling if verifying signatures is hard without node crypto.
// However, Supabase Edge Functions support Node built-ins recently.
// We will assume "stripe" package works via esm.sh or we use raw web standards.

import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2023-10-16", // Use pinned version
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

  const signature = req.headers.get("Stripe-Signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    let event;
    try {
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret!);
    } catch (err) {
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;
            const userId = session.metadata?.userId; // Assuming passed in metadata
            
            if (userId) {
                // Fulfill order: e.g. update user plan
                // Example: Upgrade to premium
                 await supabaseAdmin.from('user_profiles').update({ 
                     is_premium: true, 
                     plan: 'premium',
                     subscription_tier: 'gold' 
                }).eq('id', userId);
            }
            break;
        }
        case "payment_intent.succeeded":
            // Handle payment intent success
            break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }
});
