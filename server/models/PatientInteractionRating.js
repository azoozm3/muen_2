import mongoose from "mongoose";
import { defaultSchemaOptions } from "../lib/mongoose-utils.js";

const patientInteractionRatingSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true, trim: true },
    providerId: { type: String, required: true, trim: true },
    providerRole: { type: String, enum: ["doctor", "nurse"], required: true },
    interactionType: { type: String, enum: ["appointment", "emergency", "nurse_request"], required: true },
    interactionId: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    feedback: { type: String, default: "", trim: true },
  },
  defaultSchemaOptions,
);

patientInteractionRatingSchema.index({ interactionType: 1, interactionId: 1, providerId: 1 }, { unique: true });
patientInteractionRatingSchema.index({ patientId: 1, createdAt: -1 });

const PatientInteractionRating =
  mongoose.models.PatientInteractionRating ||
  mongoose.model("PatientInteractionRating", patientInteractionRatingSchema);

export default PatientInteractionRating;
