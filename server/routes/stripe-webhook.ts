import type { Request, Response } from "express";
import Stripe from "stripe";
import { IncomingMessage } from "http";

// Provide a fallback for development/testing to prevent startup crashes
// if the environment variable is missing (e.g. during CI or local dev without Stripe)
const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_1234567890abcdefghijklmnopqrstuvwxyz";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("⚠️ STRIPE_SECRET_KEY is missing. Using dummy key for server startup.");
}

const stripe = new Stripe(stripeKey, {
  apiVersion: "2025-12-15.clover" as any, // Match existing config if possible, or use latest
});

export async function stripeWebhookHandler(
  req: Request & IncomingMessage,
  res: Response
) {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).send("Missing Stripe signature");
  }

  // Debug logging
  console.log("Stripe Webhook received:", req.headers["stripe-signature"]);

  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody as Buffer,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    console.log(`Processing Stripe event: ${event.type}`);

    // handle event types here
    switch (event.type) {
      case "checkout.session.completed":
        // TODO: Implement fulfillment logic
        console.log("Checkout session completed:", event.data.object);
        break;
        
      case "payment_intent.succeeded":
        console.log("Payment intent succeeded:", event.data.object);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error("Stripe webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
