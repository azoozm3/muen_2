import PatientInteractionRating from "../../models/PatientInteractionRating.js";

export async function attachEmergencyPatientRatings(requests) {
  const ids = requests.map((item) => String(item._id || item.id)).filter(Boolean);
  const ratings = ids.length ? await PatientInteractionRating.find({ interactionType: "emergency", interactionId: { $in: ids } }).lean() : [];
  const ratingMap = new Map(ratings.map((item) => [String(item.interactionId), item]));
  return requests.map((item) => {
    const rating = ratingMap.get(String(item._id || item.id));
    return { ...(item.toObject?.() || item), providerPatientRating: rating?.rating || null, providerPatientFeedback: rating?.feedback || "" };
  });
}
