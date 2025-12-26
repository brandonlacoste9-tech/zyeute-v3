import { type Express } from "express";
import { type Server } from "http";
import fs from "fs";
import path from "path";

export async function setupVite(server: Server, app: Express) {
  // Use dynamic imports with variables to prevent esbuild from bundling these in production
  const viteModuleName = "vite";
  const { createServer: createViteServer, createLogger } = await import(viteModuleName);
  const configPath = path.resolve(process.cwd(), "vite.config.js");
  const viteConfig = (await import(configPath)).default;
  const viteLogger = createLogger();
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, path: "/vite-hmr" },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${Math.random().toString(36).substring(7)}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
