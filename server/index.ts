import "dotenv/config";
import "express-async-errors";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { createServer } from "http";
import { serveStatic } from "./static.js";
import helmet from "helmet";

// Create Express app
const app = express();

// Trust proxy for Vercel / Reverse Proxies
app.set("trust proxy", 1);

// Use Helmet for security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", "https://*.supabase.co", "wss://*.supabase.co", "https://api.stripe.com", "https://fonts.googleapis.com", "https://fonts.gstatic.com", "https://vercel.live"],
            imgSrc: ["'self'", "data:", "https://*.supabase.co", "https://*.gravatar.com", "https://www.zyeute.com"],
            scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", "https://js.stripe.com", "https://vercel.live"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
            frameSrc: ["https://js.stripe.com"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    crossOriginEmbedderPolicy: false
}));

// Extend IncomingMessage for Stripe raw body
declare module "http" {
  interface IncomingMessage {
    rawBody: Buffer | undefined;
  }
}

// JSON parsing with raw body for Stripe webhooks
app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false }));

// Basic CORS
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
  : ["*"];

app.use((req, res, next) => {
  const origin = req.headers.origin || "*";

  const allowOrigin =
    ALLOWED_ORIGINS.includes("*") || ALLOWED_ORIGINS.includes(origin)
      ? origin
      : ALLOWED_ORIGINS[0] || "*";

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", allowOrigin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS,PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    [
      "X-CSRF-Token",
      "X-Requested-With",
      "Accept",
      "Accept-Version",
      "Content-Length",
      "Content-MD5",
      "Content-Type",
      "Date",
      "X-Api-Version",
      "Authorization",
    ].join(", ")
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// Request logging for API routes
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (!req.path.startsWith("/api")) return;
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
  });
  next();
});

// Create HTTP server (for potential WebSockets, SSE, etc.)
const httpServer = createServer(app);

let routesInitialized = false;
const initRoutes = async () => {
  if (!routesInitialized) {
    await registerRoutes(httpServer, app);
    
    // --- VITE DEV SERVER (Existing Logic Restored) ---
    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    // --- INTELLIGENT STARTUP STRATEGY ---
    // If explicitly production, OR if we try to load Vite and it fails, we serve static assets.
    let startedInDev = false;

    if (process.env.NODE_ENV !== "production") {
      try {
        console.log("Attempting to start in Development mode...");
        // Dynamic import to prevent build-time bundling of Vite
        const { setupVite } = await import("./vite.js");
        await setupVite(httpServer, app);
        startedInDev = true;
        console.log("✅ Custom Vite server initialized");
      } catch (err) {
        console.warn("⚠️  Failed to start Vite server (likely running in Production without NODE_ENV=production).");
        console.warn("⚠️  Falling back to Static File Serving.");
        // Fall through to production logic below
      }
    }

    if (!startedInDev) {
      console.log("🚀 Starting in PRODUCTION mode (Static Serving)");
      serveStatic(app);
    }

    routesInitialized = true;
    console.log("Routes initialized");
  }
};

// Central error handler
app.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("API Error:", err);
    const status = err.status || err.statusCode || 500;
    const message =
      process.env.NODE_ENV === "production"
        ? err.publicMessage || "Internal Server Error"
        : err.message || "Internal Server Error";

    res.status(status).json({
      message,
      ...(process.env.NODE_ENV !== "production" && {
        stack: err.stack,
      }),
    });
  }
);

// Vercel serverless handler export
export default async function handler(req: any, res: any) {
  try {
    await initRoutes();
    return app(req, res);
  } catch (err: any) {
    console.error("Critical Server Startup Error:", err);
    // Return JSON response to avoid SyntaxError in client
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      error: "Server startup failed", 
      details: process.env.NODE_ENV === "production" ? "Check server logs" : err.message 
    }));
  }
}

// Local Development Server Start
if (process.env.NODE_ENV !== 'production' || require.main === module) {
    (async () => {
        await initRoutes();
        const port = parseInt(process.env.PORT || "5000", 10);
        httpServer.listen({
            port,
            host: "0.0.0.0",
        }, () => {
            console.log(`serving on port ${port}`);
        });
    })();
}

// Vercel config (disable built-in body parsing)
export const config = {
  api: {
    bodyParser: false,
  },
};
