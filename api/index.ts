import 'express-async-errors';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes.js";
import { createServer } from "http";
import type { VercelRequest, VercelResponse } from '@vercel/node';

const app = express();
app.set("trust proxy", 1);

declare module "http" {
  interface IncomingMessage {
    rawBody: Buffer;
  }
}

app.use(express.json({ verify: (req, _res, buf) => { req.rawBody = buf; } }));
app.use(express.urlencoded({ extended: false }));

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",").map(s => s.trim()) || 
  (process.env.NODE_ENV === "production" 
    ? ["https://zyeute.com", "https://www.zyeute.com"] 
    : ["http://localhost:5173", "http://localhost:3000"]);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", allowOrigin);
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
  res.header("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (!req.path.startsWith("/api")) return;
    console.log(`${req.method} ${req.path} ${res.statusCode} in ${Date.now() - start}ms`);
  });
  next();
});

const httpServer = createServer(app);
let routesInitialized = false;
const initRoutes = async () => {
  if (!routesInitialized) {
    await registerRoutes(app);
    routesInitialized = true;
    console.log("Routes initialized");
  }
};

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("API Error:", err);
  const status = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === "production" ? err.publicMessage || "Internal Server Error" : err.message || "Internal Server Error";
  res.status(status).json({ message, ...(process.env.NODE_ENV !== "production" && { stack: err.stack }) });
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await initRoutes();
    return app(req as any, res as any);
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export const config = { api: { bodyParser: false } };
