import "dotenv/config";
import express from "express";
import session from "express-session";
import { MongoStore } from "connect-mongo";
import { createServer } from "http";

import { connectDB } from "./db.js";
import { hasCustomSessionSecret, serverEnv, isProduction } from "./config/app-env.js";
import { registerRoutes } from "./routes.js";
import { serveStatic } from "./static.js";
import { apiRateLimit, csrfProtection } from "./middleware/security.js";

const app = express();
const httpServer = createServer(app);
const isProdBuild = process.env.NODE_ENV === "production";

if (isProduction && !hasCustomSessionSecret) {
  throw new Error("SESSION_SECRET must be configured in production");
}

if (isProdBuild) {
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
      secure: isProdBuild,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(apiRateLimit({ windowMs: 60_000, max: 120, keyPrefix: "api" }));
app.use("/api/auth/signin", apiRateLimit({ windowMs: 60_000, max: 12, keyPrefix: "signin" }));
app.use("/api/auth/signup", apiRateLimit({ windowMs: 60_000, max: 10, keyPrefix: "signup" }));
app.use("/api/requests", apiRateLimit({ windowMs: 60_000, max: 40, keyPrefix: "requests" }));
app.use(csrfProtection);

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
  if (!serverEnv.enableApiResponseBodyLogging) return "";
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

  if (isProdBuild) {
    serveStatic(app);
  } else {
    const viteModulePath = "./vite.js";
    const { setupVite } = await import(viteModulePath);
    await setupVite(httpServer, app);
  }

  httpServer.listen(serverEnv.port, "0.0.0.0", () => {
    log(`serving on port ${serverEnv.port}`);
  });
})();
