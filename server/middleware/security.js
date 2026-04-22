import crypto from "crypto";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function isApiRequest(req) {
  return req.path.startsWith("/api");
}

function isCsrfExempt(req) {
  return req.path === "/api/auth/signin" || req.path === "/api/auth/signup" || req.path === "/api/auth/signout";
}

export function ensureCsrfToken(req) {
  if (!req.session) return null;
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(24).toString("hex");
  }
  return req.session.csrfToken;
}

export function csrfProtection(req, res, next) {
  if (!isApiRequest(req) || SAFE_METHODS.has(req.method) || isCsrfExempt(req)) {
    return next();
  }

  if (!req.session?.userId) {
    return next();
  }

  const expected = ensureCsrfToken(req);
  const provided = req.get("x-csrf-token");

  if (!provided || provided !== expected) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  return next();
}

export function apiRateLimit({ windowMs, max, keyPrefix = "global" }) {
  const entries = new Map();

  return (req, res, next) => {
    if (!isApiRequest(req)) return next();

    const now = Date.now();
    const ip = req.ip || req.socket?.remoteAddress || "unknown";
    const key = `${keyPrefix}:${ip}:${req.path}`;
    const item = entries.get(key);

    if (!item || now - item.startedAt >= windowMs) {
      entries.set(key, { count: 1, startedAt: now });
      return next();
    }

    if (item.count >= max) {
      const retryAfterSeconds = Math.ceil((windowMs - (now - item.startedAt)) / 1000);
      res.setHeader("Retry-After", String(Math.max(retryAfterSeconds, 1)));
      return res.status(429).json({ message: "Too many requests. Please try again shortly." });
    }

    item.count += 1;
    return next();
  };
}
