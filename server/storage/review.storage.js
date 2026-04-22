import {
  ActivityLog,
  Appointment,
  Counter,
  EmergencyRequest,
  PatientInteractionRating,
  Review,
  User,
} from "./models.js";

export const reviewStorageMethods = {
  async getReviews(doctorId) {
    return await Review.find({ doctorId }).sort({ createdAt: -1 });
  },

  async createReview(review) {
    return await Review.create(review);
  },

  async updateDoctorRating(doctorId) {
    const doctorReviews = await Review.find({ doctorId });

    if (doctorReviews.length === 0) return;

    const avg =
      doctorReviews.reduce((sum, r) => sum + r.rating, 0) /
      doctorReviews.length;

    await User.findByIdAndUpdate(doctorId, {
      rating: Number(avg.toFixed(2)),
    });
  },

  async createPatientInteractionRating(data) {
    const saved = await PatientInteractionRating.findOneAndUpdate(
      {
        interactionType: data.interactionType,
        interactionId: String(data.interactionId),
        providerId: String(data.providerId),
      },
      {
        patientId: String(data.patientId),
        providerRole: data.providerRole,
        rating: data.rating,
        feedback: data.feedback || "",
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );

    await this.updatePatientRating(data.patientId);
    return saved;
  }
};
