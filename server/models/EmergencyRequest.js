import mongoose from "mongoose";
import { defaultSchemaOptions } from "../lib/mongoose-utils.js";

const indexedSparseString = { type: String, unique: true, index: true, sparse: true };
const optionalNumber = { type: Number, default: null };
const optionalDate = { type: Date, default: null };
const optionalUserRef = { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null };

const emergencyIdentityFields = {
  caseNumber: { type: Number, unique: true, index: true, sparse: true },
  publicCaseId: indexedSparseString,
  patientId: optionalUserRef,
  patientPhone: { type: String, default: null, trim: true },
  name: { type: String, required: true, trim: true },
  age: { type: Number, default: 0 },
};

const emergencyDetailsFields = {
  emergencyType: { type: String, default: "Emergency Help", trim: true },
  description: { type: String, default: null },
  location: { type: String, required: true, trim: true },
  urgency: { type: String, default: "High", trim: true },
  status: { type: String, enum: ["pending", "accepted", "on_the_way", "arrived", "resolved", "cancelled"], default: "pending" },
};

const patientLocationFields = {
  latitude: optionalNumber,
  longitude: optionalNumber,
  locationUpdatedAt: optionalDate,
};

const responderLocationFields = {
  responderLatitude: optionalNumber,
  responderLongitude: optionalNumber,
  responderLocationUpdatedAt: optionalDate,
  routeStartedAt: optionalDate,
  routeStartDistanceKm: optionalNumber,
};

const responderFields = {
  acceptedBy: optionalUserRef,
  acceptedByName: { type: String, default: null },
  primaryResponderId: optionalUserRef,
  primaryResponderName: { type: String, default: null },
  primaryResponderRole: { type: String, default: null },
};

const reviewFields = {
  reviewSubmitted: { type: Boolean, default: false },
  reviewedAt: optionalDate,
};

const emergencyRequestSchema = new mongoose.Schema(
  {
    ...emergencyIdentityFields,
    ...emergencyDetailsFields,
    ...patientLocationFields,
    ...responderLocationFields,
    ...responderFields,
    ...reviewFields,
  },
  defaultSchemaOptions,
);

export const EmergencyRequest = mongoose.models.EmergencyRequest || mongoose.model("EmergencyRequest", emergencyRequestSchema);
