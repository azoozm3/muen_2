import PatientInteractionRating from "../../models/PatientInteractionRating.js";
import { NurseRequest } from "../../models/NurseRequest.js";
import { Review } from "../../models/Review.js";
import { VolunteerRequest } from "../../models/VolunteerRequest.js";

export async function getProfileRatings(user) {
  const userId = String(user?._id || user?.id || "");
  let patientRatings = [];
  let providerRatings = [];

  if (user?.role === "patient") {
    patientRatings = await PatientInteractionRating.find({ patientId: userId }).sort({ createdAt: -1 }).lean();
  }

  if (user?.role === "doctor") {
    providerRatings = await Review.find({ doctorId: userId }).sort({ createdAt: -1 }).lean();
  }

  if (user?.role === "nurse") {
    const nurseRatings = await NurseRequest.find({ nurseId: userId, patientRating: { $ne: null } }).sort({ updatedAt: -1, createdAt: -1 }).lean();
    providerRatings = nurseRatings.map((item) => ({
      _id: item._id,
      patientName: item.patientName || item.name || "Patient",
      rating: item.patientRating,
      comment: item.patientFeedback || "",
      createdAt: item.updatedAt || item.createdAt || null,
    }));
  }

  if (user?.role === "volunteer") {
    const volunteerRatings = await VolunteerRequest.find({ volunteerId: userId, patientRating: { $ne: null } }).sort({ updatedAt: -1, createdAt: -1 }).lean();
    providerRatings = volunteerRatings.map((item) => ({
      _id: item._id,
      patientName: item.patientName || "Patient",
      rating: item.patientRating,
      comment: item.patientFeedback || "",
      createdAt: item.updatedAt || item.createdAt || null,
    }));
  }

  return { patientRatings, providerRatings };
}

export async function getPublicPatientRatings(patientId) {
  return PatientInteractionRating.find({ patientId: String(patientId) }).sort({ createdAt: -1 }).lean();
}

export function buildPublicProviderSummary(user, providerRatings = []) {
  if (!user) return { providerRating: null, providerRatingCount: 0 };

  if (user.role === "nurse") {
    return {
      providerRating: user.patientRating ?? null,
      providerRatingCount: Number(user.patientRatingCount || providerRatings.length || 0),
    };
  }

  return {
    providerRating: user.rating ?? null,
    providerRatingCount: providerRatings.length,
  };
}
