function normalizeHealthRows(rows) {
  if (!Array.isArray(rows)) return [];

  return rows
    .map((row) => ({
      title: row?.title || row?.name || "",
      details: row?.details || row?.value || row?.description || "",
      recordDate: row?.recordDate || row?.date || "",
    }))
    .filter((row) => row.title || row.details || row.recordDate);
}

export function serializeNurseRequest(doc = {}) {
  const id = doc?._id ? String(doc._id) : String(doc.id || "");
  const requestedDate = doc.requestedDate || doc.date || "";
  const requestedTime = doc.requestedTime || doc.time || "";

  return {
    id,
    _id: id,
    publicRequestId: doc.publicRequestId || doc.requestNumber || id,
    patientId: doc.patientId ? String(doc.patientId) : "",
    patientName: doc.patientName || doc.name || "Patient",
    patientPhone: doc.patientPhone || doc.phone || "",
    nurseId: doc.nurseId ? String(doc.nurseId) : "",
    nurseName: doc.nurseName || "",
    serviceType: doc.serviceType || doc.category || "Nurse Care",
    status: doc.status || "pending",
    requestedDate,
    requestedTime,
    date: requestedDate,
    time: requestedTime,
    address: doc.address || "",
    location: doc.location || doc.locationNote || doc.address || "",
    locationNote: doc.locationNote || doc.location || "",
    locationLat: doc.locationLat ?? doc.latitude ?? null,
    locationLng: doc.locationLng ?? doc.longitude ?? null,
    note: doc.note || doc.description || "",
    healthRecordSnapshot: normalizeHealthRows(doc.healthRecordSnapshot),
    visitReport: doc.visitReport || null,
    providerPatientRating: doc.providerPatientRating || null,
    providerPatientFeedback: doc.providerPatientFeedback || "",
    patientRating: doc.patientRating || null,
    patientFeedback: doc.patientFeedback || "",
    createdAt: doc.createdAt || null,
    updatedAt: doc.updatedAt || null,
  };
}
