import "dotenv/config";
import express from "express";
import session from "express-session";
import { MongoStore } from "connect-mongo";
import { createServer } from "http";

import { connectDB } from "./db.js";
import { serverEnv, isProduction } from "./config/app-env.js";
import { registerRoutes } from "./routes.js";
import { serveStatic } from "./static.js";

const app = express();
const httpServer = createServer(app);

if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: serverEnv.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: serverEnv.mongoUri,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

export function log(message, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

function summarizeResponse(body) {
  if (body == null) return "";
  try {
    const text = JSON.stringify(body);
    return text.length > 300 ? `${text.slice(0, 297)}...` : text;
  } catch {
    return "[unserializable response]";
  }
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse;

  const originalJson = res.json.bind(res);

  res.json = function (body, ...args) {
    capturedJsonResponse = body;
    return originalJson(body, ...args);
  };

  res.on("finish", () => {
    if (!path.startsWith("/api")) return;

    const duration = Date.now() - start;
    let line = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
    const responseSummary = summarizeResponse(capturedJsonResponse);

    if (responseSummary) {
      line += ` :: ${responseSummary}`;
    }

    log(line);
  });

  next();
});

(async () => {
  await connectDB();
  await registerRoutes(httpServer, app);

  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(err);
    res.status(status).json({ message });
  });

  if (isProduction) {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite.js");
    await setupVite(httpServer, app);
  }

  httpServer.listen(serverEnv.port, "0.0.0.0", () => {
    log(`serving on port ${serverEnv.port}`);
  });
})();
