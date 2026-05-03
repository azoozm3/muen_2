import mongoose from "mongoose";
import { defaultSchemaOptions } from "../lib/mongoose-utils.js";
import {
  createPaymentSchema,
  createPricingSnapshotSchema,
} from "./fragments/payment.js";

const prescriptionItemSchema = new mongoose.Schema(
  {
    medicineName: { type: String, trim: true, default: "" },
    dosage: { type: String, trim: true, default: "" },
    frequency: { type: String, trim: true, default: "" },
    duration: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, default: "" },
  },
  { _id: true },
);

const pricingSnapshotSchema = createPricingSnapshotSchema({
  serviceKey: "appointment",
  label: "Doctor Appointment",
});

const paymentSchema = createPaymentSchema();

const appointmentSchema = new mongoose.Schema(
  {
    appointmentNumber: {
      type: Number,
      unique: true,
      index: true,
      sparse: true,
    },
    patientId: { type: String, required: true, index: true },
    doctorId: { type: String, required: true, index: true },
    patientName: { type: String, required: true, trim: true },
    patientPhone: { type: String, default: "", trim: true },
    doctorName: { type: String, required: true, trim: true },
    specialty: { type: String, default: "", trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    reason: { type: String, default: "", trim: true },
    appointmentType: {
      type: String,
      enum: ["in_person", "online"],
      default: "in_person",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    consultationSummary: { type: String, default: "", trim: true },
    prescription: { type: [prescriptionItemSchema], default: [] },
    reviewSubmitted: { type: Boolean, default: false },
    pricingSnapshot: { type: pricingSnapshotSchema, default: () => ({}) },
    payment: { type: paymentSchema, default: () => ({}) },
    zoomMeetingId: { type: String, default: "", trim: true },
    zoomJoinUrl: { type: String, default: "", trim: true },
    zoomStartUrl: { type: String, default: "", trim: true },
    zoomPassword: { type: String, default: "", trim: true },
    zoomCreatedAt: { type: Date, default: null },
  },
  defaultSchemaOptions,
);

export const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);
export default Appointment;
