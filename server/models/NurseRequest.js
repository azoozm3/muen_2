import mongoose from "mongoose";
import { defaultSchemaOptions } from "../lib/mongoose-utils.js";
import { createPaymentSchema, createPricingSnapshotSchema } from "./fragments/payment.js";

const healthRecordRowSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    details: { type: String, trim: true, default: "" },
    recordDate: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const adviceItemSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    dosage: { type: String, trim: true, default: "" },
    frequency: { type: String, trim: true, default: "" },
    duration: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, default: "" },
  },
  { _id: true },
);

const testMeasurementSchema = new mongoose.Schema(
  {
    type: { type: String, default: "", trim: true },
    value: { type: String, default: "", trim: true },
  },
  { _id: true },
);

const nurseVisitReportSchema = new mongoose.Schema(
  {
    generalCondition: { type: String, trim: true, default: "" },
    careProvided: { type: String, trim: true, default: "" },
    followUpPlan: { type: String, trim: true, default: "" },
    bloodPressure: { type: String, trim: true, default: "" },
    bloodSugar: { type: String, trim: true, default: "" },
    temperature: { type: String, trim: true, default: "" },
    pulse: { type: String, trim: true, default: "" },
    pregnancyTest: { type: String, trim: true, default: "" },
    recommendation: { type: String, enum: ["home_care", "follow_up", "see_doctor", "go_hospital", ""], default: "" },
    recommendationNotes: { type: String, trim: true, default: "" },
    adviceItems: { type: [adviceItemSchema], default: [] },
    careProvidedItems: { type: [String], default: [] },
    testMeasurements: { type: [testMeasurementSchema], default: [] },
    completedAt: { type: Date, default: null },
  },
  { _id: false },
);

const pricingSnapshotSchema = createPricingSnapshotSchema({
  serviceKey: "nurseRequest",
  label: "Home Nurse Visit",
});

const paymentSchema = createPaymentSchema();

const reassignmentEventSchema = new mongoose.Schema(
  {
    nurseId: { type: String, default: null, trim: true },
    nurseName: { type: String, default: "", trim: true },
    reason: { type: String, default: "", trim: true },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const nurseRequestSchema = new mongoose.Schema(
  {
    requestNumber: { type: Number, unique: true, index: true, sparse: true },
    publicRequestId: { type: String, unique: true, index: true, sparse: true },
    patientId: { type: String, required: true, index: true },
    patientName: { type: String, required: true, trim: true },
    patientPhone: { type: String, default: "", trim: true },
    serviceType: { type: String, required: true, trim: true },
    requestedDate: { type: String, required: true, trim: true },
    requestedTime: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    locationNote: { type: String, default: "", trim: true },
    locationLat: { type: String, default: "", trim: true },
    locationLng: { type: String, default: "", trim: true },
    note: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "in_progress", "completed", "cancelled", "reassigned"],
      default: "pending",
      index: true,
    },
    nurseId: { type: String, default: null, index: true },
    nurseName: { type: String, default: "", trim: true },
    nursePhone: { type: String, default: "", trim: true },
    rejectionReason: { type: String, default: "", trim: true },
    healthRecordSnapshot: { type: [healthRecordRowSchema], default: [] },
    pricingSnapshot: { type: pricingSnapshotSchema, default: () => ({}) },
    payment: { type: paymentSchema, default: () => ({}) },
    reassignmentRequested: { type: Boolean, default: false },
    reassignmentReason: { type: String, default: "", trim: true },
    reassignmentHistory: { type: [reassignmentEventSchema], default: [] },
    visitReport: { type: nurseVisitReportSchema, default: () => ({}) },
    patientRating: { type: Number, default: null, min: 1, max: 5 },
    patientFeedback: { type: String, default: "", trim: true },
    acceptedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
  },
  defaultSchemaOptions,
);

export const NurseRequest = mongoose.models.NurseRequest || mongoose.model("NurseRequest", nurseRequestSchema);
