import { caseLabel } from "../helpers.js";

export async function acceptEmergencyCase({ storage, requestId, currentRequest, userId, userRole, user, res }) {
  if (!["doctor", "nurse", "admin"].includes(userRole)) return res.status(403).json({ message: "Only doctors and nurses can accept cases" });
  const updated = await storage.assignPrimaryResponder(requestId, userId, user.name, userRole);
  if (!updated) return res.status(404).json({ message: "Request not found" });
  await storage.createActivityLog(userId, user.name, "case_accepted", `Case ${caseLabel(updated || currentRequest, requestId)} accepted by ${userRole} ${user.name} as primary responder`);
  return res.json(updated);
}

export function canCancelEmergencyRequest({ currentRequest, userId, userRole }) {
  const isOwner = String(currentRequest.patientId || "") === String(userId);
  const isAdmin = userRole === "admin";
  if (!isOwner && !isAdmin) return { ok: false, code: 403, message: "Only the patient who created the request can cancel it" };
  if (["resolved", "cancelled"].includes(currentRequest.status)) return { ok: false, code: 400, message: "This request can no longer be cancelled" };
  return { ok: true };
}

export function canUpdateEmergencyStatus({ currentRequest, userId, userRole, status }) {
  if (status === "cancelled") return canCancelEmergencyRequest({ currentRequest, userId, userRole });
  const isPrimary = String(currentRequest.primaryResponderId || "") === String(userId);
  const isAdmin = userRole === "admin";
  if (!isPrimary && !isAdmin) return { ok: false, code: 403, message: "Only assigned responders can update case status" };
  return { ok: true };
}

export async function finalizeEmergencyStatusUpdate({ storage, requestId, status, userId, user, currentRequest, res }) {
  const updated = await storage.updateRequestStatus(requestId, status);
  if (!updated) return res.status(404).json({ message: "Request not found" });
  await storage.createActivityLog(userId, user.name, `case_${status}`, `Case ${caseLabel(updated || currentRequest, requestId)} status changed to ${status} by ${user.name}`);
  return res.json(updated);
}
