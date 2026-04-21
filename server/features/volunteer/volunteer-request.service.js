import { getNextIdentity } from "../../lib/sequence.js";
import { VolunteerRequest } from "../../models/VolunteerRequest.js";
import { User } from "../../models/user.js";

export function serializeVolunteerRequest(doc) {
  if (!doc) return null;

  const item = doc.toObject ? doc.toObject({ virtuals: true }) : { ...doc };
  const id = item.id || item._id?.toString?.() || String(item._id || "");

  return {
    ...item,
    id,
    _id: id,
    publicRequestId: item.publicRequestId || "",
    requestNumber: item.requestNumber || null,
    patientId: item.patientId || "",
    patientName: item.patientName || "",
    patientPhone: item.patientPhone || "",
    serviceType: item.serviceType || "",
    address: item.address || "",
    latitude: item.latitude ?? null,
    longitude: item.longitude ?? null,
    locationNote: item.locationNote || "",
    details: item.details || "",
    urgency: item.urgency || "medium",
    status: item.status || "pending",
    volunteerId: item.volunteerId || null,
    volunteerName: item.volunteerName || "",
    volunteerPhone: item.volunteerPhone || "",
    patientRating: item.patientRating ?? null,
    patientFeedback: item.patientFeedback || "",
    volunteerPatientRating: item.volunteerPatientRating ?? null,
    volunteerPatientFeedback: item.volunteerPatientFeedback || "",
    acceptedAt: item.acceptedAt || null,
    inProgressAt: item.inProgressAt || null,
    completedAt: item.completedAt || null,
    cancelledAt: item.cancelledAt || null,
    createdAt: item.createdAt || null,
    updatedAt: item.updatedAt || null,
  };
}

export async function createVolunteerRequestNumber() {
  const counter = await getNextIdentity("volunteerRequest");
  return {
    requestNumber: counter.seq,
    publicRequestId: `VOL-${String(counter.seq).padStart(4, "0")}`,
  };
}

export async function findVolunteerRequestByAnyId(id) {
  if (!id) return null;
  const textId = String(id).trim();
  if (!textId) return null;

  const byPublicId = await VolunteerRequest.findOne({ publicRequestId: textId });
  if (byPublicId) return byPublicId;

  if (/^[a-f\d]{24}$/i.test(textId)) {
    return VolunteerRequest.findById(textId);
  }

  return null;
}

export async function updateVolunteerRating(volunteerId) {
  if (!volunteerId) return;

  const ratings = await VolunteerRequest.find({
    volunteerId: String(volunteerId),
    patientRating: { $ne: null },
  }).select("patientRating").lean();

  const average = ratings.length
    ? Number((ratings.reduce((sum, item) => sum + Number(item.patientRating || 0), 0) / ratings.length).toFixed(2))
    : null;

  await User.findByIdAndUpdate(volunteerId, { $set: { rating: average } });
}
