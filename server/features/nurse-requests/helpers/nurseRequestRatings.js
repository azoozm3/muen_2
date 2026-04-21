import { NurseRequest } from "../../../models/NurseRequest.js";
import { User } from "../../../models/user.js";
import PatientInteractionRating from "../../../models/PatientInteractionRating.js";
import { serializeNurseRequest } from "../routes/helpers/nurseRequestSerializers.js";

export async function attachProviderPatientRatings(items) {
  const list = items.map((item) => serializeNurseRequest(item));
  const ids = list.map((item) => String(item.id || item._id)).filter(Boolean);
  if (!ids.length) return list;

  const ratings = await PatientInteractionRating.find({ interactionType: "nurse_request", interactionId: { $in: ids } }).lean();
  const ratingMap = new Map(ratings.map((item) => [String(item.interactionId), item]));

  return list.map((item) => ({
    ...item,
    providerPatientRating: ratingMap.get(String(item.id || item._id))?.rating ?? null,
    providerPatientFeedback: ratingMap.get(String(item.id || item._id))?.feedback ?? "",
  }));
}

export async function updateNursePatientRatingSummary(nurseId) {
  if (!nurseId) return;

  const allRatings = await NurseRequest.find({ nurseId: String(nurseId), patientRating: { $ne: null } }).select("patientRating").lean();
  const count = allRatings.length;
  const average = count ? Number((allRatings.reduce((sum, item) => sum + Number(item.patientRating || 0), 0) / count).toFixed(2)) : null;
  await User.findByIdAndUpdate(nurseId, { $set: { patientRating: average, patientRatingCount: count } });
}
