import express from "express";
import path from "path";

export function serveStatic(app) {
  const distPath = path.resolve(process.cwd(), "dist/public");

  app.use(express.static(distPath));

  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      return res.sendFile(path.join(distPath, "index.html"));
    }
    next();
  });
}
