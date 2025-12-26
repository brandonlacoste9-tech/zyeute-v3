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
    contentSecurityPolicy: false, // Disable CSP for now to avoid breaking scripts/images
    crossOriginEmbedderPolicy: false
}));

// Extend IncomingMessage for Stripe raw body
declare module "http" {
  interface IncomingMessage {
    rawBody: Buffer;
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
    if (process.env.NODE_ENV === "production") {
        serveStatic(app);
    } else {
        const { setupVite } = await import("./vite.js");
        await setupVite(httpServer, app);
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
  await initRoutes();
  return app(req, res);
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
