import { NurseRequest } from "../../../../models/NurseRequest.js";
import { User } from "../../../../models/User.js";

export async function savePatientRating(requestId, patientId, payload) {
  const doc = await NurseRequest.findById(requestId);
  if (!doc) throw new Error("NOT_FOUND");
  if (String(doc.patientId) !== String(patientId)) throw new Error("ACCESS_DENIED");
  if (doc.status !== "completed") throw new Error("NOT_READY");

  doc.review = { rating: payload.rating, comment: payload.comment || "", createdAt: new Date() };
  await doc.save();

  if (doc.nurseId) {
    const nurse = await User.findById(doc.nurseId);
    if (nurse) {
      const ratings = Array.isArray(nurse.patientRatings) ? nurse.patientRatings : [];
      ratings.push({
        requestId: String(doc._id),
        patientId: String(patientId),
        patientName: doc.patientName || "Patient",
        providerRole: "nurse",
        rating: payload.rating,
        feedback: payload.comment || "",
        createdAt: new Date(),
      });
      nurse.patientRatings = ratings;
      nurse.ratingCount = ratings.length;
      nurse.rating = Number((ratings.reduce((sum, item) => sum + Number(item.rating || 0), 0) / ratings.length).toFixed(2));
      await nurse.save();
    }
  }

  return doc;
}
