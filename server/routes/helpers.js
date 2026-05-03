import { z } from "zod";

export function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  req.currentUser = {
    id: String(req.session.userId),
    role: req.session.userRole || "patient",
    name: req.session.userName || "User",
  };

  next();
}

export function requireAdmin(req, res, next) {
  if (!req.session.userId || req.session.userRole !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

export function sanitizeUser(user) {
  if (!user) return null;
  const obj = typeof user.toObject === "function" ? user.toObject() : { ...user };
  if (obj._id && !obj.id) obj.id = String(obj._id);
  delete obj.passwordHash;
  return obj;
}

export function sendZodError(res, err) {
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      message: err.errors[0]?.message || "Invalid request",
      field: err.errors[0]?.path?.join?.(".") || undefined,
    });
  }

  throw err;
}

export async function getCurrentUser(storage, req) {
  if (!req.session.userId) return null;
  return storage.getUserById(req.session.userId);
}

export function caseLabel(item, fallbackId) {
  return item?.publicCaseId || `#${item?.caseNumber || fallbackId}`;
}
