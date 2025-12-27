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

  return server;
}
