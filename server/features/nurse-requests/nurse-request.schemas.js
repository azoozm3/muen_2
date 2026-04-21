import { z } from "zod";

export const createNurseRequestSchema = z.object({
  serviceType: z.string().min(1, "Service type is required"),
  requestedDate: z.string().min(1, "Date is required"),
  requestedTime: z.string().min(1, "Time is required"),
  address: z.string().min(1, "Address is required"),
  location: z.string().optional().default(""),
  locationNote: z.string().optional().default(""),
  locationLat: z.string().optional().default(""),
  locationLng: z.string().optional().default(""),
  note: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  paymentOrderId: z.string().min(1, "Payment is required"),
});

export const respondSchema = z.object({
  action: z.enum(["accepted", "rejected"]),
});

export const statusSchema = z.object({
  status: z.enum(["in_progress", "completed", "cancelled"]),
});

export const noteSchema = z.object({
  content: z.string().min(1).max(2000),
});

const adviceItemSchema = z.object({
  name: z.string().optional().default(""),
  dosage: z.string().optional().default(""),
  frequency: z.string().optional().default(""),
  duration: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});

const testMeasurementSchema = z.object({
  type: z.string().optional().default(""),
  value: z.string().optional().default(""),
});

export const visitReportSchema = z.object({
  generalCondition: z.string().optional().default(""),
  careProvided: z.string().optional().default(""),
  followUpPlan: z.string().optional().default(""),
  bloodPressure: z.string().optional().default(""),
  bloodSugar: z.string().optional().default(""),
  temperature: z.string().optional().default(""),
  pulse: z.string().optional().default(""),
  pregnancyTest: z.string().optional().default(""),
  recommendation: z
    .enum(["home_care", "follow_up", "see_doctor", "go_hospital", ""])
    .optional()
    .default(""),
  recommendationNotes: z.string().optional().default(""),
  adviceItems: z.array(adviceItemSchema).optional().default([]),
  careProvidedItems: z.array(z.string()).optional().default([]),
  testMeasurements: z.array(testMeasurementSchema).optional().default([]),
});

export const patientRatingSchema = z.object({
  rating: z.number().min(1).max(5),
  feedback: z.string().optional().default(""),
});

export const reassignSchema = z.object({
  reason: z.string().optional().default(""),
});
