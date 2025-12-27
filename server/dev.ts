
import express from 'express';
import { registerRoutes } from './routes';

const app = express();
const port = 3000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS for local development
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header("Access-Control-Allow-Origin", origin || "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

// Register routes
registerRoutes(app);

app.listen(port, () => {
  console.log(`🚀 Backend running on http://localhost:${port}`);
  console.log(`👉 API available at http://localhost:${port}/api/health`);
});
