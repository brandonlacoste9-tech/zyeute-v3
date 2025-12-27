import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  const server = createServer(app);

  // Minimal Auth Backend

  // POST /auth/login
  app.post("/api/auth/login", (req, res) => {
    // Mock login response mostly, as real auth is handled by Supabase client
    // But this endpoint confirms the circuit works.
    const { email } = req.body;
    res.json({
      token: "mock-jwt-token",
      user: {
        id: "mock-user-id",
        region: "fr-CA",
        locale: "fr-CA",
        email: email || "user@example.com"
      }
    });
  });

  // GET /me
  app.get("/api/me", (req, res) => {
    // In a real scenario, we verify the token here.
    // For "finally render" verification:
    res.json({
      id: "mock-user-id",
      region: "fr-CA",
      locale: "fr-CA",
      presenceEnabled: false
    });
  });

  // POST /presence
  app.post("/api/presence", (req, res) => {
    const { enabled } = req.body;
    // Mock state update
    res.json({
      presenceEnabled: enabled
    });
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // FEED EXPLORE (The "Content" Flow)
  app.get("/api/explore", (req, res) => {
    // Mock Data for IMMEDIATE VISUAL PROOF
    res.json([
        {
            id: "vid_01",
            title: "Le Festin de Montréal",
            description: "POV: La meilleure poutine.",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-winter-forest-with-trees-covered-in-snow-40892-large.mp4", // Safe placeholder
            thumbnailUrl: "https://images.unsplash.com/photo-1588790384592-23c345a34f4c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            user: {
                username: "poutine_king",
                avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=King"
            },
            likes: 450,
            views: 1200,
            is_exclusive: false
        },
        {
            id: "vid_02",
            title: "Night Sky QC",
            description: "Aurores boréales hier soir!",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
            thumbnailUrl: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            user: {
                username: "astro_guy",
                avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Astro"
            },
            likes: 890,
            views: 5000,
            is_exclusive: true // Test the lock!
        }
    ]);
  });

  // STRIPE CHECKOUT (The "Money" Flow)
  app.post("/api/stripe/test-checkout", (req, res) => {
    // In production, initiate Stripe Session here
    const { priceId } = req.body;
    res.json({
        url: `https://checkout.stripe.com/pay/${priceId || 'mock-price'}?test_mode=true`,
        mock: true,
        message: "Real Stripe Integration requires Secret Key"
    });
  });

  // GLOBAL STATIC SYNC (The "Payload" Delivery)
  // Serve the frontend build artifacts
  const express = require('express');
  const path = require('path');
  const distPath = path.resolve(__dirname, "../../dist/public"); // Adjusted for server/routes.ts location relative to root

  app.use(express.static(distPath));

  // SPA Fallback - Serve index.html for any unhandled routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  return server;
}
