import mongoose from "mongoose";
import { defaultSchemaOptions } from "../lib/mongoose-utils.js";
import { volunteerRequestStatuses } from "../../shared/volunteer.js";

const volunteerRequestSchema = new mongoose.Schema(
  {
    requestNumber: { type: Number, unique: true, index: true, sparse: true },
    publicRequestId: { type: String, unique: true, index: true, sparse: true },
    patientId: { type: String, required: true, index: true },
    patientName: { type: String, required: true, trim: true },
    patientPhone: { type: String, default: "", trim: true },
    serviceType: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    locationNote: { type: String, default: "", trim: true },
    details: { type: String, default: "", trim: true },
    urgency: { type: String, default: "medium", trim: true, index: true },
    status: {
      type: String,
      enum: volunteerRequestStatuses,
      default: "pending",
      index: true,
    },
    volunteerId: { type: String, default: null, index: true },
    volunteerName: { type: String, default: "", trim: true },
    volunteerPhone: { type: String, default: "", trim: true },
    patientRating: { type: Number, default: null, min: 1, max: 5 },
    patientFeedback: { type: String, default: "", trim: true },
    volunteerPatientRating: { type: Number, default: null, min: 1, max: 5 },
    volunteerPatientFeedback: { type: String, default: "", trim: true },
    acceptedAt: { type: Date, default: null },
    inProgressAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
  },
  defaultSchemaOptions,
);

export const VolunteerRequest =
  mongoose.models.VolunteerRequest ||
  mongoose.model("VolunteerRequest", volunteerRequestSchema);
