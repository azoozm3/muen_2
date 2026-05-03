import storage from "../../../storage/index.js";

export function appointmentErrorResponse(res, error, fallbackMessage) {
  const message = error?.message || "";
  if (message === "ACCESS_DENIED") return res.status(403).json({ message: "Access denied" });
  if (message === "PATIENT_NOT_FOUND") return res.status(404).json({ message: "Patient not found" });
  if (message === "DOCTOR_NOT_FOUND") return res.status(404).json({ message: "Doctor not found" });
  if (message === "ONLINE_NOT_AVAILABLE") return res.status(400).json({ message: "This doctor does not currently offer online consultations" });
  if (message === "APPOINTMENT_NOT_FOUND") return res.status(404).json({ message: "Appointment not found" });
  if (message === "ALREADY_HANDLED") return res.status(400).json({ message: "This appointment has already been handled" });
  if (message === "CANNOT_CANCEL") return res.status(400).json({ message: "This appointment can no longer be cancelled" });
  if (message === "NOT_CONFIRMABLE") return res.status(400).json({ message: "Only confirmed appointments can be completed" });
  if (message === "REVIEW_TOO_EARLY") return res.status(400).json({ message: "Review is allowed only after the appointment is completed" });
  if (message === "REVIEW_EXISTS") return res.status(400).json({ message: "Review already submitted" });
  return res.status(500).json({ message: fallbackMessage });
}

export async function safeActivityLog(userId, actorName, action, details, warningLabel) {
  try { await storage.createActivityLog(userId, actorName, action, details); }
  catch (logError) { console.warn(`${warningLabel} warning`, logError?.message || logError); }
}
