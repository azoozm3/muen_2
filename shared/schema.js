import { z } from "zod";
import { requestStatuses, roles, specialties } from "./constants.js";
import { volunteerAvailabilityOptions, volunteerServiceOptions } from "./volunteer.js";

export { requestStatuses, roles, specialties };

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  role: z.enum(["patient", "doctor", "nurse", "volunteer"]),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(6, "Phone number is required").optional(),
  role: z.enum(roles),
});

const medicalHistoryRowSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  details: z.string().trim().min(1, "Details are required"),
  recordDate: z.string().trim().optional().nullable(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  specialty: z.string().optional().nullable(),
  medicalHistory: z.array(medicalHistoryRowSchema).optional().nullable(),
  bio: z.string().optional().nullable(),
  onlineConsultation: z.boolean().optional(),
  volunteerSupportTypes: z.array(z.enum(volunteerServiceOptions)).optional().nullable(),
  volunteerAvailability: z.enum(volunteerAvailabilityOptions).optional().nullable(),
  volunteerHasTransportation: z.boolean().optional(),
  volunteerCoverageArea: z.string().optional().nullable(),
  volunteerNotes: z.string().optional().nullable(),
});

export const insertEmergencyRequestSchema = z.object({
  name: z.string().min(1).default("Patient"),
  age: z.number().int().min(0).optional().nullable().default(0),
  emergencyType: z.string().optional().nullable().default("Emergency Help"),
  description: z.string().optional().nullable().default(""),
  location: z.string().min(1),
  urgency: z.string().optional().nullable().default("High"),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
});

export const adminUpdateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Valid email is required").optional(),
  phone: z.string().min(6, "Phone number is too short").optional().nullable(),
  role: z.enum(roles).optional(),
  active: z.boolean().optional(),
  specialty: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  medicalHistory: z.array(medicalHistoryRowSchema).optional().nullable(),
  bio: z.string().optional().nullable(),
  onlineConsultation: z.boolean().optional(),
  volunteerSupportTypes: z.array(z.enum(volunteerServiceOptions)).optional().nullable(),
  volunteerAvailability: z.enum(volunteerAvailabilityOptions).optional().nullable(),
  volunteerHasTransportation: z.boolean().optional(),
  volunteerCoverageArea: z.string().optional().nullable(),
  volunteerNotes: z.string().optional().nullable(),
});

export const insertReviewSchema = z.object({
  doctorId: z.string(),
  patientId: z.string(),
  patientName: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional().nullable(),
});
