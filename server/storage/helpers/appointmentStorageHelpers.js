import { Appointment, EmergencyRequest, PatientInteractionRating, User } from "../models.js";

export async function attachAppointmentRatings(items) {
  const appointments = items.map((item) => {
    const plain = typeof item.toObject === "function" ? item.toObject() : { ...item };
    plain.id = String(plain.id || plain._id);
    return plain;
  });

  const ids = appointments.map((item) => String(item.id || item._id)).filter(Boolean);
  if (!ids.length) return appointments;

  const ratings = await PatientInteractionRating.find({ interactionType: "appointment", interactionId: { $in: ids } }).lean();
  const ratingMap = new Map(ratings.map((item) => [String(item.interactionId), item]));

  return appointments.map((appointment) => {
    const rating = ratingMap.get(String(appointment.id || appointment._id));
    return { ...appointment, providerPatientRating: rating?.rating ?? null, providerPatientFeedback: rating?.feedback ?? "" };
  });
}

function createPatientLookupMaps(patients) {
  const byId = new Map();
  const byName = new Map();

  for (const patient of patients) {
    byId.set(String(patient._id), patient);
    const key = String(patient.name || "").trim().toLowerCase();
    if (!key) continue;
    const list = byName.get(key) || [];
    list.push(patient);
    byName.set(key, list);
  }

  return { byId, byName };
}

function findMatchedPatient(record, idField, nameField, maps) {
  if (record[idField] && maps.byId.has(String(record[idField]))) return maps.byId.get(String(record[idField]));
  const candidates = maps.byName.get(String(record[nameField] || "").trim().toLowerCase()) || [];
  return candidates.length === 1 ? candidates[0] : null;
}

async function backfillPhoneOnCollection(records, idField, nameField, phoneField) {
  const patients = await User.find({ role: "patient" }).select("_id name phone");
  const maps = createPatientLookupMaps(patients);

  for (const record of records) {
    const matched = findMatchedPatient(record, idField, nameField, maps);
    if (!matched?.phone) continue;
    record[phoneField] = matched.phone;
    if (!record[idField]) record[idField] = String(matched._id);
    await record.save();
  }
}

export async function backfillEmergencyRequestPhones() {
  const requests = await EmergencyRequest.find({ $or: [{ patientPhone: { $exists: false } }, { patientPhone: null }, { patientPhone: "" }] });
  return backfillPhoneOnCollection(requests, "patientId", "name", "patientPhone");
}

export async function backfillAppointmentPhones() {
  const appointments = await Appointment.find({ $or: [{ patientPhone: { $exists: false } }, { patientPhone: null }, { patientPhone: "" }] });
  return backfillPhoneOnCollection(appointments, "patientId", "patientName", "patientPhone");
}

export function buildZoomMeetingUpdate(zoomMeeting = {}) {
  return {
    zoomMeetingId: zoomMeeting.meetingId || "",
    zoomJoinUrl: zoomMeeting.joinUrl || "",
    zoomStartUrl: zoomMeeting.startUrl || "",
    zoomPassword: zoomMeeting.password || "",
    zoomCreatedAt: zoomMeeting.joinUrl ? new Date() : null,
  };
}

export function buildAppointmentStatusUpdate(status) {
  const updateData = { status };
  if (["confirmed", "rejected", "cancelled"].includes(status)) updateData.respondedAt = new Date();
  if (status === "completed") updateData.completedAt = new Date();
  return updateData;
}

export function buildAppointmentNotesUpdate(consultationSummary, prescription = []) {
  return {
    consultationSummary,
    consultationNotes: consultationSummary,
    prescription,
    notesUpdatedAt: consultationSummary || prescription.length ? new Date() : null,
  };
}
