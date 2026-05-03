// server/vite.js
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createLogger, createServer as createViteServer } from "vite";

const viteLogger = createLogger();

export async function setupVite(server, app) {
  const vite = await createViteServer({
    configFile: path.resolve(process.cwd(), "vite.config.js"),
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
      },
    },
    server: {
      middlewareMode: true,
      hmr: { server, path: "/vite-hmr" },
      allowedHosts: true,
    },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("/{*path}", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        process.cwd(),
        "client",
        "index.html",
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.jsx"`,
        `src="/src/main.jsx?v=${crypto.randomUUID()}"`,
      );

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (error) {
      vite.ssrFixStacktrace(error);
      next(error);
    }
  });
}
