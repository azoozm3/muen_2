import { PatientInteractionRating, User } from "../models.js";

const ADMIN_EDITABLE_FIELDS = [
  "name",
  "phone",
  "role",
  "active",
  "specialty",
  "address",
  "medicalHistory",
  "bio",
  "onlineConsultation",
  "volunteerSupportTypes",
  "volunteerAvailability",
  "volunteerHasTransportation",
  "volunteerCoverageArea",
  "volunteerNotes",
];

const PROFILE_EDITABLE_FIELDS = [
  "name",
  "phone",
  "address",
  "specialty",
  "medicalHistory",
  "bio",
  "onlineConsultation",
  "volunteerSupportTypes",
  "volunteerAvailability",
  "volunteerHasTransportation",
  "volunteerCoverageArea",
  "volunteerNotes",
];

export function pickDefinedFields(source, fields) {
  return fields.reduce((acc, key) => {
    if (source[key] !== undefined) acc[key] = source[key];
    return acc;
  }, {});
}

export function buildAdminUserUpdateData(data) {
  const updateData = pickDefinedFields(data, ADMIN_EDITABLE_FIELDS);
  if (data.email !== undefined) updateData.email = data.email.toLowerCase();
  return updateData;
}

export function buildProfileUpdateData(data) {
  return pickDefinedFields(data, PROFILE_EDITABLE_FIELDS);
}

export function buildDoctorsQuery(filters = {}) {
  const query = { role: "doctor", active: true };
  if (filters.onlineConsultation) query.onlineConsultation = true;
  if (filters.specialty) query.specialty = filters.specialty;
  if (filters.search) query.name = { $regex: filters.search, $options: "i" };
  return query;
}

export function buildActivityPayload(userIdOrPayload, userName, action, details) {
  if (userIdOrPayload && typeof userIdOrPayload === "object" && !Array.isArray(userIdOrPayload)) {
    return userIdOrPayload;
  }

  return {
    userId: userIdOrPayload || null,
    userName: userName || null,
    action: action || "activity",
    details: details || null,
  };
}

export async function refreshPatientRating(patientId) {
  const ratings = await PatientInteractionRating.find({ patientId: String(patientId) });
  if (!ratings.length) {
    await User.findByIdAndUpdate(patientId, { patientRating: null, patientRatingCount: 0 });
    return;
  }

  const avg = ratings.reduce((sum, item) => sum + Number(item.rating || 0), 0) / ratings.length;
  await User.findByIdAndUpdate(patientId, { patientRating: Number(avg.toFixed(2)), patientRatingCount: ratings.length });
}
