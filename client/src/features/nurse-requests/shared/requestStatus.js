export const NURSE_REQUEST_HISTORY_STATUSES = new Set(["completed", "cancelled"]);
export const NURSE_REQUEST_ACTIVE_STATUSES = new Set(["pending", "accepted", "in_progress"]);

export function normalizeNurseRequest(item = {}) {
  const id = item.id || item._id || item.publicRequestId || "";
  const status = String(item.status || "pending").toLowerCase();
  const visitReport = item.visitReport && typeof item.visitReport === "object" ? item.visitReport : {};
  const address = item.address || "";
  const locationNote = item.locationNote || item.location || "";
  const location = [address, locationNote].filter(Boolean).join(" — ") || address || locationNote || "";
  const note = item.note || item.notes || "";

  return {
    ...item,
    id,
    _id: item._id || id,
    status,
    address,
    locationNote,
    location,
    note,
    notes: note,
    patientId: item.patientId || "",
    patientName: item.patientName || "",
    nurseId: item.nurseId || "",
    nurseName: item.nurseName || "",
    payment: item.payment || {},
    visitReport,
  };
}

export function normalizeNurseRequests(items = []) {
  return items.map(normalizeNurseRequest);
}

export function isHistoryNurseRequest(item) {
  return NURSE_REQUEST_HISTORY_STATUSES.has(String(item?.status || "").toLowerCase());
}

export function isCurrentNurseRequest(item) {
  return NURSE_REQUEST_ACTIVE_STATUSES.has(String(item?.status || "").toLowerCase());
}

export function hasVisitReport(item) {
  const report = item?.visitReport || {};
  return [
    report.generalCondition,
    report.servicesProvided,
    report.vitalSigns,
    report.notes,
    report.followUpInstructions,
    report.recommendation,
  ].some((value) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object" && value) return Object.values(value).some((entry) => String(entry || "").trim());
    return String(value || "").trim().length > 0;
  });
}
